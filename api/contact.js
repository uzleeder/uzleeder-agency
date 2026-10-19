// POST /api/contact — the website's project brief.
// Order of work: validate → rate-limit → duplicate check → SAVE the lead (durable, private Blob)
// → notify Telegram (one retry) → record the notification result on the lead.
// Success is reported only after the lead is saved, or — if storage is unavailable — after
// Telegram accepted it. Both results are returned separately; the client never sees a fake success.
//
// New body:    { name, channel: telegram|whatsapp|email, contact, service: website|system|ai|other,
//                message, budget?, timeline?, lang?, source?, website (honeypot) }
// Older body:  { name, email, message } — still accepted (treated as channel "email").
const crypto = require("crypto");
const { json, body, onlyPost, client } = require("./_lib/http");
const store = require("./_lib/store");
const notify = require("./_lib/notify");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s().-]{7,20}$/;
const TG_RE = /^@?[a-zA-Z][a-zA-Z0-9_]{4,31}$/;
const CHANNELS = ["telegram", "whatsapp", "email"];
const SERVICES = ["website", "system", "ai", "academy", "design", "existing", "other"];
const BUDGETS = ["lt500", "500-1500", "1500-4000", "gt4000", "unsure"];
const TIMELINES = ["asap", "1m", "1-3m", "flexible"];
const SOURCES = ["homepage", "project_page", "service_page", "contact", "direct"];

// strip control characters, collapse extreme whitespace, cap length
const clean = (v, max) => String(v == null ? "" : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").replace(/[ \t]{3,}/g, "  ").trim().slice(0, max);

// simple per-instance rate limit (serverless instances are short-lived; the dedupe store covers repeats)
const hits = new Map();
function limited(ip) {
  if (!ip) return false;
  const now = Date.now(), win = 10 * 60 * 1000;
  const list = (hits.get(ip) || []).filter(t => now - t < win);
  list.push(now); hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > 6;
}

function validate(d) {
  const legacy = !d.channel && d.email;
  const out = {
    name: clean(d.name, 80),
    channel: legacy ? "email" : clean(d.channel, 20),
    contact: clean(legacy ? d.email : d.contact, 120),
    service: legacy ? "other" : clean(d.service, 20),
    message: clean(d.message, 2000),
    budget: BUDGETS.includes(d.budget) ? d.budget : "",
    timeline: TIMELINES.includes(d.timeline) ? d.timeline : "",
    lang: /^(en|uz|ru|fa|ar)$/.test(d.lang || "") ? d.lang : "en",
    source: SOURCES.includes(d.source) ? d.source : "direct"
  };
  const errors = {};
  if (out.name.length < 2) errors.name = "name";
  if (!CHANNELS.includes(out.channel)) errors.channel = "channel";
  else if (out.channel === "email" && !EMAIL_RE.test(out.contact)) errors.contact = "email";
  else if (out.channel === "whatsapp" && !PHONE_RE.test(out.contact)) errors.contact = "phone";
  else if (out.channel === "telegram" && !(TG_RE.test(out.contact) || PHONE_RE.test(out.contact))) errors.contact = "telegram";
  if (!SERVICES.includes(out.service)) errors.service = "service";
  if (out.message.length < (legacy ? 5 : 10)) errors.message = "message";
  if (out.channel === "telegram" && TG_RE.test(out.contact) && !out.contact.startsWith("@")) out.contact = "@" + out.contact;
  return { lead: out, errors };
}

module.exports = async (req, res) => {
  if (req.query && req.query.partner === '1') return require('./_lib/partners').handler(req, res);
  if (!onlyPost(req, res)) return;
  let data;
  try { data = await body(req); } catch (e) { return json(res, 400, { ok: false, error: "Bad JSON" }); }
  if (!data || typeof data !== "object") return json(res, 400, { ok: false, error: "Bad JSON" });

  if (data.website) return json(res, 200, { ok: true, stored: true });   // honeypot: bots fill it, humans never see it

  const ctx = client(req);
  if (limited(ctx.ip)) return json(res, 429, { ok: false, error: "Too many requests", code: "rate-limited" });

  const { lead, errors } = validate(data);
  if (Object.keys(errors).length) return json(res, 400, { ok: false, error: "Invalid fields", fields: errors });

  const storage = store.configured();
  const key = crypto.createHash("sha256").update(lead.contact.toLowerCase() + "|" + lead.message.toLowerCase()).digest("hex").slice(0, 32);

  // same brief sent again within 10 minutes (double click, retry after a slow network) → accepted once
  if (storage) {
    const prev = await store.seenRecently(key, 10 * 60 * 1000).catch(() => null);
    if (prev) return json(res, 200, { ok: true, stored: true, duplicate: true, code: prev.code || undefined, notified: prev.notified || null });
  }

  let saved = null;
  if (storage) {
    try {
      saved = await store.addLead(Object.assign({}, lead, { stage: "new", notify: { telegram: "pending" }, country: ctx.country || null }));
      await store.log({ actor: "Visitor", action: "lead.received", object: lead.name, detail: lead.service + " · " + lead.lang.toUpperCase() + " · " + lead.source });
    } catch (e) { console.error("Lead save failed:", e.message); }
  }

  const tg = await notify.telegram(notify.leadText(saved || lead));
  if (saved) {
    await store.updateLead(saved.id, { notify: { telegram: tg, at: new Date().toISOString() } }).catch(() => {});
    if (tg === "failed") await store.log({ action: "lead.notify_failed", object: lead.name, detail: "Telegram", level: "warning" });
  }
  if (storage) await store.remember(key, { id: saved && saved.id, code: saved && saved.code, notified: tg }).catch(() => {});

  if (saved) return json(res, 200, { ok: true, stored: true, code: saved.code, notified: tg === "sent" ? true : tg === "failed" ? false : null });
  if (tg === "sent") return json(res, 200, { ok: true, stored: false, notified: true });
  console.error("Lead not accepted: storage " + (storage ? "failed" : "missing") + ", Telegram " + tg);
  return json(res, 502, { ok: false, error: "The message could not be delivered", code: "delivery-failed" });
};
