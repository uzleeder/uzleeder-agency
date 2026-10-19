// Local development server for the UzLeeder site + Control Center.
//   node server/local-dev.cjs        → http://localhost:8080   (admin: /admin)
//
// Runs the real Vercel functions from /api with a stand-in for @vercel/blob that keeps
// everything on disk in server/.localdata/ — so login, drafts, preview, publish, messages
// and media all work without a Vercel account. Never deployed (server/ is in .vercelignore).
//
// The admin password is generated once and stored in server/.localdata/admin-password.txt
// (a local test password only — production uses ADMIN_PASSWORD from Vercel).
const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { Readable } = require("stream");

const ROOT = path.join(__dirname, "..");
const DATA = process.env.UZL_DATA_DIR || path.join(__dirname, ".localdata");
const BLOBS = path.join(DATA, "blobs");
const PORT = +process.env.PORT || 8080;
fs.mkdirSync(BLOBS, { recursive: true });

/* ---------- local admin credentials ---------- */
function persisted(file, make) {
  const f = path.join(DATA, file);
  if (!fs.existsSync(f)) fs.writeFileSync(f, make());
  return fs.readFileSync(f, "utf8").trim();
}
// keys from the project's .env (same file setup-vercel.ps1 uploads) — Telegram works locally too,
// and a filled-in ADMIN_PASSWORD replaces the generated local one
const dotenv = {};
try {
  fs.readFileSync(path.join(ROOT, ".env"), "utf8").split(/\r?\n/).forEach(l => {
    const m = /^\s*([A-Z_]+)=(.*)$/.exec(l); if (m && m[2].trim()) dotenv[m[1]] = m[2].trim().replace(/^"|"$/g, "");
  });
} catch (e) {}
["TELEGRAM_BOT_TOKEN", "TELEGRAM_CHAT_ID", "TELEGRAM_PUBLISH_BOT_TOKEN", "TELEGRAM_SERVICES_BOT_TOKEN", "GITHUB_TOKEN", "GITHUB_OWNER",
  "VERCEL_TOKEN", "VERCEL_PROJECT", "VERCEL_TEAM_ID", "YOUTUBE_CLIENT_ID", "YOUTUBE_CLIENT_SECRET", "YOUTUBE_REFRESH_TOKEN"].forEach(k => { if (dotenv[k]) process.env[k] = dotenv[k]; });
// UZL_LOCAL_PASSWORD: throwaway password for automated local tests (never your real one)
const PASSWORD = process.env.UZL_LOCAL_PASSWORD || dotenv.ADMIN_PASSWORD || persisted("admin-password.txt", () => "uzl-local-" + crypto.randomBytes(4).toString("hex"));
process.env.ADMIN_PASSWORD = PASSWORD;
process.env.ADMIN_SECRET = persisted("admin-secret.txt", () => crypto.randomBytes(32).toString("hex"));
process.env.BLOB_READ_WRITE_TOKEN = "local-disk";

/* ---------- @vercel/blob stand-in (same calls store.js uses) ---------- */
const enc = p => Buffer.from(p).toString("base64url");
const dec = n => Buffer.from(n, "base64url").toString();
const metaOf = p => { try { return JSON.parse(fs.readFileSync(path.join(BLOBS, enc(p) + ".meta"), "utf8")); } catch (e) { return null; } };
const blob = {
  async put(pathname, data, o = {}) {
    const file = path.join(BLOBS, enc(pathname));
    if (fs.existsSync(file) && !o.allowOverwrite) throw new Error("This blob already exists");
    const buf = Buffer.isBuffer(data) ? data : Buffer.from(String(data));
    fs.writeFileSync(file, buf);
    fs.writeFileSync(file + ".meta", JSON.stringify({ contentType: o.contentType || "application/octet-stream", uploadedAt: new Date().toISOString(), size: buf.length }));
    return { pathname, url: "local://" + pathname };
  },
  async list({ prefix = "", limit = 1000 } = {}) {
    const blobs = fs.readdirSync(BLOBS).filter(n => !n.endsWith(".meta")).map(dec).filter(p => p.startsWith(prefix))
      .map(p => { const m = metaOf(p) || {}; return { pathname: p, url: "local://" + p, size: m.size || 0, uploadedAt: m.uploadedAt }; });
    return { blobs: blobs.slice(0, limit), hasMore: false };
  },
  async get(pathname) {
    const file = path.join(BLOBS, enc(pathname));
    if (!fs.existsSync(file)) return null;
    const m = metaOf(pathname) || {};
    return { statusCode: 200, stream: Readable.toWeb(fs.createReadStream(file)), blob: { contentType: m.contentType, size: m.size } };
  },
  async del(p) { (Array.isArray(p) ? p : [p]).forEach(x => { const f = path.join(BLOBS, enc(x)); fs.rmSync(f, { force: true }); fs.rmSync(f + ".meta", { force: true }); }); },
  async head(pathname) { return metaOf(pathname); }
};
require.cache[require.resolve("@vercel/blob", { paths: [ROOT] })] = { id: "local-blob", filename: "local-blob", loaded: true, exports: blob };

/* ---------- static files ---------- */
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".pdf": "application/pdf",
  ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".mp4": "video/mp4", ".webmanifest": "application/manifest+json", ".ico": "image/x-icon", ".txt": "text/plain", ".xml": "application/xml" };
const BLOCKED = /^\/(server|archive|netlify|node_modules|\.claude|\.vercel|api\/_lib)(\/|$)|\/\./;
function serveStatic(req, res, url) {
  let p = decodeURIComponent(url.pathname);
  if (p === "/admin" || p === "/admin/") p = "/admin.html";
  if (p === "/certified") p = "/certified.html";
  if (p === "/workspace" || p === "/workspace/") p = "/workspace.html";
  if (p === "/agi" || p === "/agi/") p = "/agi.html";
  if (p === '/partners/apply' || p === '/partners/apply/') p = '/partner-apply.html';
  if (p === '/partners' || p === '/partners/') p = '/partners.html';
  if (p === '/workspace/partners' || p === '/workspace/partners/') p = '/partner-workspace.html';
  if (/^\/verify(\/[A-Za-z0-9-]*)?\/?$/.test(p)) p = "/verify.html";
  if (/^\/startups(\/[a-z0-9-]*)?\/?$/.test(p)) p = "/startups.html";
  if (/^\/(en|uz|ru|fa|ar)\/?$/.test(p)) p = "/" + p.replace(/\//g, "") + ".html";
  if (BLOCKED.test(p)) return notFound(res);
  if (p.endsWith("/")) p += "index.html";
  const file = path.join(ROOT, p);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return notFound(res);
  const stat = fs.statSync(file), type = TYPES[path.extname(file).toLowerCase()] || "application/octet-stream";
  const range = req.headers.range && /bytes=(\d*)-(\d*)/.exec(req.headers.range);
  if (range && type === "video/mp4") {                                   // videos need range requests
    const start = +range[1] || 0, end = range[2] ? +range[2] : stat.size - 1;
    res.writeHead(206, { "Content-Type": type, "Content-Range": `bytes ${start}-${end}/${stat.size}`, "Accept-Ranges": "bytes", "Content-Length": end - start + 1 });
    return fs.createReadStream(file, { start, end }).pipe(res);
  }
  res.writeHead(200, { "Content-Type": type, "Content-Length": stat.size, "Cache-Control": "no-cache" });
  fs.createReadStream(file).pipe(res);
}
function notFound(res) {
  const f = path.join(ROOT, "404.html");
  res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
  res.end(fs.existsSync(f) ? fs.readFileSync(f) : "Not found");
}

/* ---------- API routing (same paths as on Vercel) ---------- */
function handlerFor(p) {
  const m = /^\/api\/media\/([^/]+)$/.exec(p);
  if (m) return { file: path.join(ROOT, "api/media/[key].js"), query: { key: decodeURIComponent(m[1]) } };
  const n = /^\/api\/([a-z-]+)$/.exec(p);
  if (n && fs.existsSync(path.join(ROOT, "api", n[1] + ".js"))) return { file: path.join(ROOT, "api", n[1] + ".js"), query: {} };
  return null;
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  const h = handlerFor(url.pathname);
  if (!h) return serveStatic(req, res, url);
  req.query = Object.assign(Object.fromEntries(url.searchParams), h.query);
  try { await require(h.file)(req, res); }
  catch (e) { console.error(e); if (!res.headersSent) { res.statusCode = 500; res.end(JSON.stringify({ error: "Local server error" })); } }
  console.log(new Date().toLocaleTimeString(), req.method, url.pathname, res.statusCode);
}).listen(PORT, () => {
  console.log("\nUzLeeder local server  →  http://localhost:" + PORT);
  console.log("Control Center         →  http://localhost:" + PORT + "/admin");
  console.log("Workspace              →  http://localhost:" + PORT + "/workspace");
  console.log("Local admin password   →  " + PASSWORD + "\n");
});
