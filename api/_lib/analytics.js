// First-party, anonymous analytics: visit parsing + daily aggregation.
// Stored per visit: pages, sections reached, events (names only), engaged time, scroll depth,
// referrer host, UTM tags, language, device/browser/OS family and country (from Vercel's edge).
// Never stored: IP address, names, contact details, message text, full user agent.
const crypto = require("crypto");

const TZ = "Asia/Tashkent";
const dayOf = d => new Date(d).toLocaleDateString("en-CA", { timeZone: TZ });          // YYYY-MM-DD in Tashkent
const hourOf = d => +new Date(d).toLocaleString("en-US", { timeZone: TZ, hour: "2-digit", hour12: false }) % 24;

const BOT_RE = /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|facebookexternalhit|embedly|whatsapp|telegrambot|monitor|curl|wget|python|axios|node-fetch|go-http/i;
const clip = (v, n) => String(v == null ? "" : v).replace(/[\u0000-\u001F\u007F<>]/g, "").slice(0, n);
const ID = /^[a-z0-9_-]{1,40}$/i;

function device(ua, sw) {
  if (/ipad|tablet/i.test(ua) || (sw >= 600 && sw < 1024 && /android|mobile/i.test(ua))) return "Tablet";
  if (/mobi|iphone|android/i.test(ua) || (sw && sw < 600)) return "Mobile";
  return "Desktop";
}
function browser(ua) {
  if (/edg\//i.test(ua)) return "Edge"; if (/opr\/|opera/i.test(ua)) return "Opera"; if (/yabrowser/i.test(ua)) return "Yandex";
  if (/samsungbrowser/i.test(ua)) return "Samsung"; if (/firefox|fxios/i.test(ua)) return "Firefox";
  if (/chrome|crios/i.test(ua)) return "Chrome"; if (/safari/i.test(ua)) return "Safari"; return "Other";
}
function os(ua) {
  if (/windows/i.test(ua)) return "Windows"; if (/iphone|ipad|ios/i.test(ua)) return "iOS"; if (/android/i.test(ua)) return "Android";
  if (/mac os/i.test(ua)) return "macOS"; if (/linux/i.test(ua)) return "Linux"; return "Other";
}

// turns a client beacon into a stored visit document (or null for bots / admin / junk)
function parseVisit(body, req, prev) {
  const h = req.headers || {};
  const ua = String(h["user-agent"] || "");
  if (!body || typeof body !== "object" || body.admin || !ua || BOT_RE.test(ua)) return null;
  const id = String(body.v || "");
  if (!/^[a-z0-9]{8,32}$/i.test(id)) return null;
  const now = Date.now();
  // the visit keeps the day and hour it started on (client start time, trusted only within 12 h)
  const cs = +body.start;
  const start = prev ? prev.start : (cs && Math.abs(now - cs) < 12 * 3600e3 ? cs : now);
  const day = prev ? prev.day : dayOf(start);
  const ip = String(h["x-forwarded-for"] || h["x-real-ip"] || "").split(",")[0].trim();
  // daily-rotating anonymous visitor key: counts unique visitors per day without storing the IP
  const vk = crypto.createHash("sha256").update(ip + "|" + ua + "|" + day + "|" + (process.env.ADMIN_SECRET || "uzl")).digest("hex").slice(0, 16);
  const sw = Math.max(0, Math.min(10000, +body.sw || 0));
  const list = (a, n, f) => (Array.isArray(a) ? a.slice(0, n).map(f).filter(Boolean) : []);
  let ref = "";
  try { if (body.ref) { const u = new URL(String(body.ref)); ref = u.hostname.replace(/^www\./, "").slice(0, 80); } } catch (e) {}
  const self = String(h.host || "").replace(/:\d+$/, "");
  if (ref && (ref === self || ref.endsWith(".vercel.app") && ref.startsWith("uzleeder"))) ref = "";
  return {
    v: id, day, start, updated: now, hour: prev ? prev.hour : hourOf(start), vk,
    isNew: !!body.isNew,
    pages: list(body.pages, 20, p => ({ p: clip(p && p.p, 60), l: clip(p && p.l, 5) })),
    sections: list(body.sections, 30, s => (ID.test(String(s)) ? String(s) : null)),
    events: list(body.events, 60, e => (e && ID.test(String(e.n)) ? { n: String(e.n), s: e.s ? clip(e.s, 40) : undefined } : null)),
    dur: Math.max(0, Math.min(6 * 3600e3, +body.dur || 0)),
    depth: Math.max(0, Math.min(100, Math.round(+body.depth || 0))),
    lang: clip(body.lang, 5), theme: body.theme === "light" ? "light" : "dark",
    ref, utm: body.utm && typeof body.utm === "object" ? { s: clip(body.utm.s, 40), m: clip(body.utm.m, 40), c: clip(body.utm.c, 60) } : null,
    device: device(ua, sw), browser: browser(ua), os: os(ua),
    country: clip(h["x-vercel-ip-country"], 2) || "—"
  };
}

const inc = (o, k, n) => { if (!k) return; o[k] = (o[k] || 0) + (n || 1); };
// daily aggregate of visit documents
function aggregate(day, visits) {
  const a = { day, visits: 0, visitors: 0, newVisitors: 0, pageviews: 0, dur: 0, bounces: 0, depth: 0,
    sections: {}, events: {}, eventDetail: {}, refs: {}, utm: {}, countries: {}, langs: {}, devices: {}, browsers: {}, os: {}, hours: {}, pages: {} };
  const keys = new Set(), newKeys = new Set();
  for (const v of visits) {
    a.visits++; keys.add(v.vk); if (v.isNew) newKeys.add(v.vk);
    a.pageviews += Math.max(1, (v.pages || []).length);
    a.dur += v.dur || 0; a.depth += v.depth || 0;
    if ((v.dur || 0) < 10000 && (v.sections || []).length <= 1 && !(v.events || []).length) a.bounces++;
    new Set(v.sections || []).forEach(s => inc(a.sections, s));
    (v.events || []).forEach(e => { inc(a.events, e.n); if (e.s) inc(a.eventDetail, e.n + ":" + e.s); });
    inc(a.refs, v.ref || "Direct / none");
    if (v.utm && v.utm.s) inc(a.utm, v.utm.s + (v.utm.m ? " / " + v.utm.m : "") + (v.utm.c ? " · " + v.utm.c : ""));
    inc(a.countries, v.country || "—"); inc(a.langs, v.lang || "—"); inc(a.devices, v.device); inc(a.browsers, v.browser); inc(a.os, v.os);
    inc(a.hours, String(v.hour));
    (v.pages || []).forEach(p => inc(a.pages, p.p || "/"));
  }
  a.visitors = keys.size; a.newVisitors = newKeys.size;
  return a;
}

module.exports = { parseVisit, aggregate, dayOf, TZ };
