// Startup link previews.
//   GET /api/og?s=<slug>[&lang=en|uz|ru]  → 1200×630 PNG preview card   (public route: /startups/<slug>/card.png)
//   GET /api/og?page=<slug>               → /startups.html with that startup's <title>, description, canonical,
//                                           Open Graph and Twitter tags   (public route: /startups/<slug>)
// Only PUBLISHED, visible startups are used (or the seed before the store is set up) — drafts never leak into a card.
// The page itself still renders in the browser exactly as before; crawlers (Telegram, X, LinkedIn, Facebook) read the tags.
const crypto = require("crypto");
const store = require("./_lib/store");
const su = require("./_lib/startups");
const card = require("./_lib/startcard");
const seed = require("./_lib/startups-seed.json");

const seedList = () => seed.filter(s => s && !s.archived && s.name).map(s => Object.assign({ slug: s.slug, aliases: s.aliases || [], order: 0 }, su.cleanPublic(s)));
const SLUG = /^[a-z0-9][a-z0-9-]{0,48}$/;

async function findStartup(slug) {
  if (!SLUG.test(slug || "")) return null;
  let list;
  if (!store.configured()) list = seedList();
  else { const out = await su.publicList(); list = out.initialized ? out.startups : seedList(); }
  return list.find(s => s.slug === slug) || list.find(s => (s.aliases || []).includes(slug)) || null;
}
const origin = req => {
  const h = req.headers || {}, host = String(h["x-forwarded-host"] || h.host || "uzleeder.uz").split(",")[0].trim();
  const proto = String(h["x-forwarded-proto"] || (/^(localhost|127\.)/.test(host) ? "http" : "https")).split(",")[0].trim();
  return proto + "://" + host;
};
const version = s => crypto.createHash("sha1").update(JSON.stringify(s)).digest("hex").slice(0, 10);
const esc = v => String(v == null ? "" : v).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const en = o => (o && typeof o === "object") ? (o.en || o.uz || o.ru || "") : String(o || "");

/* logo: only this site's own files (relative path), only PNG/JPEG, short timeout — never an arbitrary URL */
async function logoData(s, base) {
  const u = s.logo || "";
  if (!/^\/[\w./-]+\.(png|jpe?g)$/i.test(u) && !/^\/api\/media\/[\w.-]+$/.test(u)) return null;
  try {
    const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 2500);
    const r = await fetch(base + u, { signal: ctl.signal }); clearTimeout(t);
    const type = (r.headers.get("content-type") || "").split(";")[0];
    if (!r.ok || !/^image\/(png|jpeg)$/.test(type)) return null;
    const buf = Buffer.from(await r.arrayBuffer());
    return buf.length > 1.5 * 1024 * 1024 ? null : "data:" + type + ";base64," + buf.toString("base64");
  } catch (e) { return null; }
}

function withMeta(html, s, base) {
  const name = s.name || s.slug, tagline = en(s.tagline) || en(s.summary);
  const title = name + (tagline ? " — " + tagline : "") + " | UzLeeder";
  const desc = (en(s.summary) || tagline || "A UzLeeder venture.").replace(/\s+/g, " ").slice(0, 280);
  const url = "https://uzleeder.uz/startups/" + s.slug;
  const img = base + "/startups/" + s.slug + "/card.png?v=" + version(s);
  const set = (re, val) => { html = html.replace(re, (m, a, b) => a + esc(val) + b); };
  set(/(<title>)[^<]*(<\/title>)/, title);
  set(/(<meta name="description" content=")[^"]*(")/, desc);
  set(/(<link rel="canonical" href=")[^"]*(")/, url);
  set(/(<meta property="og:title" content=")[^"]*(")/, title);
  set(/(<meta property="og:description" content=")[^"]*(")/, desc);
  set(/(<meta property="og:url" content=")[^"]*(")/, url);
  set(/(<meta property="og:image" content=")[^"]*(")/, img);
  set(/(<meta name="twitter:title" content=")[^"]*(")/, title);
  set(/(<meta name="twitter:description" content=")[^"]*(")/, desc);
  set(/(<meta name="twitter:image" content=")[^"]*(")/, img);
  if (!/og:image:alt/.test(html)) html = html.replace(/(<meta property="og:image:height"[^>]*>)/, '$1\n<meta property="og:image:alt" content="' + esc(name + " — UzLeeder venture preview card") + '"/>');
  return html;
}

module.exports = async (req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") { res.statusCode = 405; return res.end("Method not allowed"); }
  const q = req.query || {}, base = origin(req);

  if (q.page !== undefined) {
    let html;
    try {
      const r = await fetch(base + "/startups.html");
      if (!r.ok) throw new Error("startups.html " + r.status);
      html = await r.text();
    } catch (e) {
      console.error("og page: static page unavailable:", e.message);
      res.statusCode = 503; res.setHeader("Content-Type", "text/html; charset=utf-8"); res.setHeader("Cache-Control", "no-store");
      return res.end('<!doctype html><meta charset="utf-8"><title>UzLeeder</title><p>The page is temporarily unavailable. <a href="/startups">Open Startups</a>.</p>');
    }
    try {
      const s = await findStartup(String(q.page).toLowerCase().split("/")[0]);
      if (s) html = withMeta(html, s, base);
    } catch (e) { console.error("og page: startup lookup failed:", e.message); }   // still serve the page with the generic tags
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=0, s-maxage=300, stale-while-revalidate=600");
    return res.end(html);
  }

  try {
    const s = await findStartup(String(q.s || "").toLowerCase());
    if (!s) { res.statusCode = 404; res.setHeader("Content-Type", "text/plain; charset=utf-8"); res.setHeader("Cache-Control", "no-store"); return res.end("No published startup at this address."); }
    const png = await card.renderPng(s, { lang: String(q.lang || "en"), logoData: await logoData(s, base) });
    res.statusCode = 200;
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800");
    res.setHeader("X-Content-Type-Options", "nosniff");
    return res.end(png);
  } catch (e) {
    console.error("og card failed:", e.message);
    res.statusCode = 500; res.setHeader("Content-Type", "text/plain; charset=utf-8"); res.setHeader("Cache-Control", "no-store");
    return res.end("Could not render the preview card.");
  }
};
