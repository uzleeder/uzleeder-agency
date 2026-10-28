// Startup link previews (api/og.js + api/_lib/startcard.js): card PNG per published startup, per-startup meta tags.
// Run: node server/test-og.cjs   (no network: the static page is read from disk, the store is not configured → seed)
const path = require("path"), fs = require("fs");
const ROOT = path.join(__dirname, "..");
delete process.env.BLOB_READ_WRITE_TOKEN; delete process.env.NETLIFY_BLOBS_CONTEXT;
const results = [];
const check = (name, ok, got) => results.push((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  → got: " + String(JSON.stringify(got)).slice(0, 300)));

const STATIC = fs.readFileSync(path.join(ROOT, "startups.html"), "utf8");
global.fetch = async url => {
  url = String(url);
  if (url.endsWith("/startups.html")) return { ok: true, status: 200, text: async () => STATIC, headers: { get: () => "text/html" } };
  if (url.endsWith(".png")) { const f = path.join(ROOT, url.replace(/^https?:\/\/[^/]+/, "")); if (fs.existsSync(f)) { const b = fs.readFileSync(f); return { ok: true, status: 200, headers: { get: () => "image/png" }, arrayBuffer: async () => b.buffer.slice(b.byteOffset, b.byteOffset + b.length) }; } }
  return { ok: false, status: 404, headers: { get: () => "" } };
};
const og = require(path.join(ROOT, "api/og.js"));
const card = require(path.join(ROOT, "api/_lib/startcard.js"));
function call(query, method) {
  return new Promise(resolve => {
    const headers = {}, chunks = [];
    const res = { statusCode: 200, setHeader: (k, v) => { headers[k.toLowerCase()] = v; }, end: b => { if (b) chunks.push(Buffer.isBuffer(b) ? b : Buffer.from(b)); resolve({ status: res.statusCode, headers, body: Buffer.concat(chunks) }); } };
    og({ method: method || "GET", query, headers: { host: "uzleeder.uz", "x-forwarded-proto": "https" } }, res);
  });
}
const PNG = b => b.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
const size = b => [b.readUInt32BE(16), b.readUInt32BE(20)];

(async () => {
  for (const slug of ["t-port", "caiber-learn", "future-ventures"]) {
    const r = await call({ s: slug });
    check("card for " + slug + " is a 1200×630 PNG", r.status === 200 && r.headers["content-type"] === "image/png" && PNG(r.body) && size(r.body).join() === "1200,630", [r.status, r.headers["content-type"], r.body.length && size(r.body)]);
  }
  const c = await call({ s: "t-port" });
  check("card is cacheable", /s-maxage=86400/.test(c.headers["cache-control"] || ""));
  check("alias address (uzport) gets the T-Port card", (await call({ s: "uzport" })).status === 200);
  check("unknown startup → 404, no image", (await call({ s: "no-such-startup" })).status === 404);
  check("malformed slug → 404", (await call({ s: "../etc/passwd" })).status === 404);
  check("POST is refused", (await call({ s: "t-port" }, "POST")).status === 405);

  const svg = card.buildSvg({ slug: "t-port", name: "T-Port", status: "research", category: "logistics", tagline: { en: "One destination." }, brand: { bg: "#071533", fg: "#F2F6FF", a1: "#22B8FF", parts: [{ t: "T", c: "a1" }, { t: "-PORT", c: "fg", glue: true }] } });
  check("card shows the real status and category", /RESEARCH/.test(svg) && /LOGISTICS/.test(svg));
  check("card uses the brand colours and wordmark parts", /#071533/.test(svg) && /<tspan fill="#22B8FF">T<\/tspan><tspan fill="#F2F6FF">-PORT<\/tspan>/.test(svg));
  check("card escapes text", /&lt;b&gt;/.test(card.buildSvg({ slug: "x", name: "<b>X</b>" })));
  const long = card.buildSvg({ slug: "x", name: "International Smart Logistics Platform Uzbekistan Extra", tagline: { en: "word ".repeat(80) } });
  check("long tagline is cut to two lines with an ellipsis", (long.match(/fill-opacity="0.82"/g) || []).length === 2 && /…/.test(long));
  check("card without a brand still renders (UzLeeder colours)", /#0F1B2D/.test(card.buildSvg({ slug: "x", name: "X" })));

  const p = await call({ page: "caiber-learn" }), h = p.body.toString();
  check("startup page keeps the app (same HTML, 200)", p.status === 200 && h.length > STATIC.length - 400 && /startups/i.test(h));
  check("page title is the startup's", /<title>CAIBER Learn — Learn smarter/.test(h));
  check("og:image points to this startup's card (versioned)", /og:image" content="https:\/\/uzleeder\.uz\/startups\/caiber-learn\/card\.png\?v=[0-9a-f]{10}"/.test(h));
  check("twitter:image matches og:image", (h.match(/twitter:image" content="([^"]*)/) || [])[1] === (h.match(/og:image" content="([^"]*)/) || [])[1]);
  check("canonical and og:url use uzleeder.uz", /canonical" href="https:\/\/uzleeder\.uz\/startups\/caiber-learn"/.test(h) && /og:url" content="https:\/\/uzleeder\.uz\/startups\/caiber-learn"/.test(h));
  check("og:image:alt is added", /og:image:alt" content="CAIBER Learn/.test(h));
  const u = (await call({ page: "unknown-x" })).body.toString();
  check("unknown startup page keeps the generic tags", /og:image" content="https:\/\/uzleeder\.uz\/og-image\.png"/.test(u));

  results.forEach(r => console.log(r));
  const fails = results.filter(r => r.startsWith("FAIL")).length;
  console.log("\n" + (fails ? fails + " FAILED" : "ALL " + results.length + " PREVIEW CARD TESTS PASSED"));
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
