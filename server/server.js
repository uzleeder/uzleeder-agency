// UzLeeder — contact form backend
// Receives POST /api/contact, validates the data, and forwards the message
// to your Telegram account via the Telegram Bot API.
//
// Setup:
//   1. cp .env.example .env  and fill in TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID
//   2. npm install
//   3. npm start
//
// Node 18+ is required (global fetch is used).

import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3000;

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Comma-separated list of allowed origins, e.g.
// ALLOWED_ORIGINS=https://leeder.com,https://www.leeder.com
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

app.use(express.json({ limit: "16kb" }));

// ---- CORS: only accept requests from your own site ----
app.use(cors({
  origin(origin, cb) {
    // Allow same-origin / tools with no Origin header (curl, server-to-server).
    if (!origin) return cb(null, true);
    // If no whitelist is configured, allow all (handy for local dev).
    if (ALLOWED_ORIGINS.length === 0) return cb(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
  methods: ["POST", "OPTIONS"]
}));

// ---- Tiny in-memory rate limiter (anti-spam) ----
const hits = new Map(); // ip -> [timestamps]
const WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 5;
function rateLimited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter(t => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  return list.length > MAX_PER_WINDOW;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.post("/api/contact", async (req, res) => {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.ip;
  if (rateLimited(ip)) {
    return res.status(429).json({ ok: false, error: "Too many requests. Please try again later." });
  }

  const body = req.body || {};
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  // Honeypot: real users leave this empty; bots tend to fill every field.
  if (body.website) return res.json({ ok: true });

  // ---- Server-side validation ----
  const errors = [];
  if (name.length < 2 || name.length > 80) errors.push("name");
  if (!EMAIL_RE.test(email) || email.length > 120) errors.push("email");
  if (message.length < 5 || message.length > 2000) errors.push("message");
  if (errors.length) {
    return res.status(400).json({ ok: false, error: "Invalid fields", fields: errors });
  }

  if (!BOT_TOKEN || !CHAT_ID) {
    console.error("TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not configured.");
    return res.status(500).json({ ok: false, error: "Server not configured" });
  }

  const text =
    "🌐 <b>New message from UzLeeder site</b>\n\n" +
    "👤 <b>Name:</b> " + esc(name) + "\n" +
    "✉️ <b>Email:</b> " + esc(email) + "\n" +
    "🌍 <b>IP:</b> " + esc(ip) + "\n\n" +
    "💬 <b>Message:</b>\n" + esc(message);

  try {
    const tg = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: "HTML" })
    });
    const result = await tg.json();
    if (!result.ok) {
      console.error("Telegram API error:", result);
      return res.status(502).json({ ok: false, error: "Failed to deliver message" });
    }
    return res.json({ ok: true });
  } catch (err) {
    console.error("Send error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// Optional: serve the static site from the parent folder so frontend + backend
// run on the same origin (then API_BASE in script.js can stay "").
app.use(express.static(new URL("..", import.meta.url).pathname));

app.listen(PORT, () => {
  console.log(`UzLeeder server running on http://localhost:${PORT}`);
  if (ALLOWED_ORIGINS.length) console.log("Allowed origins:", ALLOWED_ORIGINS.join(", "));
});
