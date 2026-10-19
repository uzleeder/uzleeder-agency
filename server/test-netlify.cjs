// The Netlify port: the real netlify/functions/* run through netlify/shared/vercel-adapter.js on an in-memory
// replacement for @netlify/blobs that behaves like the real one (atomic onlyIfNew, metadata, streams, strong reads).
const path = require("path");
const ROOT = path.join(__dirname, "..");
const FN = f => path.join(ROOT, "netlify", "functions", f + ".js");

const mem = new Map();
let connected = 0;
const fakeStore = {
  async set(key, data, o = {}) {
    if (o.onlyIfNew && mem.has(key)) return { modified: false };
    const buf = typeof data === "string" ? Buffer.from(data) : Buffer.from(data);
    mem.set(key, { buf, metadata: o.metadata || {}, etag: String(Math.random()) });
    return { modified: true };
  },
  async getWithMetadata(key) { const v = mem.get(key); return v ? { data: new Response(v.buf).body, metadata: v.metadata, etag: v.etag } : null; },
  async getMetadata(key) { const v = mem.get(key); return v ? { metadata: v.metadata, etag: v.etag } : null; },
  async list({ prefix = "" } = {}) { return { blobs: [...mem.keys()].filter(k => k.startsWith(prefix)).map(key => ({ key, etag: mem.get(key).etag })), directories: [] }; },
  async delete(key) { mem.delete(key); }
};
require.cache[require.resolve("@netlify/blobs", { paths: [ROOT] })] = { id: "nb", loaded: true, exports: {
  getStore: () => fakeStore, connectLambda: () => { connected++; }
} };

Object.assign(process.env, { ADMIN_PASSWORD: "pw", ADMIN_SECRET: "0123456789abcdef0123456789abcdef", SITE_URL: "https://uzleeder.netlify.app" });
delete process.env.BLOB_READ_WRITE_TOKEN; delete process.env.TELEGRAM_BOT_TOKEN; delete process.env.TELEGRAM_CHAT_ID;

const results = [];
const check = (name, ok, got) => results.push((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  → got: " + String(JSON.stringify(got)).slice(0, 300)));
const fn = {}; ["login", "startups", "workspace", "contact", "upload", "media", "content", "admin", "blob-upload"].forEach(n => { fn[n] = require(FN(n)).handler; });
const ev = (method, { body, query, headers, b64 } = {}) => ({ httpMethod: method, headers: Object.assign({ "content-type": "application/json", "x-nf-client-connection-ip": "198.51.100." + Math.floor(Math.random() * 200) }, headers || {}), queryStringParameters: query || {}, body: body === undefined ? null : b64 ? body : JSON.stringify(body), isBase64Encoded: !!b64, path: "/" });
const json = r => { try { return JSON.parse(r.body); } catch (e) { return null; } };

(async () => {
  check("storage driver is Netlify Blobs", require(path.join(ROOT, "api/_lib/store.js"))._raw.blob().driver === "netlify");
  const L = await fn.login(ev("POST", { body: { password: "pw" } }));
  const token = json(L) && json(L).token;
  check("login through the Netlify function", L.statusCode === 200 && token, L);
  check("Netlify Blobs connected per invocation", connected >= 1);
  const H = { authorization: "Bearer " + token };
  const W = async (action, body = {}) => { const r = await fn.workspace(ev("POST", { body: Object.assign({ action }, body), headers: H })); return { status: r.statusCode, json: json(r), raw: r }; };

  const pub0 = json(await fn.startups(ev("GET")));
  check("public startups served (built-in until imported)", pub0.ok && pub0.startups.map(s => s.slug).join() === "t-port,caiber-learn,future-ventures", pub0);
  check("workspace import writes canonical records to Netlify Blobs", (await W("startups.import")).json.imported === 3 && [...mem.keys()].some(k => k.startsWith("ws/startups/")));
  check("second import refused (records persisted)", (await W("startups.import")).status === 409);

  // certificates end to end, numbering under concurrency, binary PDF through the adapter
  const prep = (await W("certs.prepareAll")).json.created;
  check("certificate drafts prepared", prep.length === 2, prep);
  async function approve(id) {
    let c = (await W("certs.get", { id })).json.certificate;
    for (const k of ["ventureName", "representative", "stage"]) c = (await W("certs.evidence", { id, rev: c.rev, field: k, status: "verified" })).json.certificate;
    c = (await W("certs.submit", { id, rev: c.rev })).json.certificate;
    return (await W("certs.approve", { id, rev: c.rev })).json.certificate;
  }
  const a = await Promise.all(prep.map(p => approve(p.id)));
  const issued = await Promise.all(a.map(c => W("certs.issue", { id: c.id, rev: c.rev })));
  const nums = issued.map(x => x.json.certificate && x.json.certificate.number);
  check("concurrent issuance → distinct numbers (atomic create-only on Netlify Blobs)", nums.every(Boolean) && new Set(nums).size === 2, nums);
  const pdf = await fn.workspace(ev("POST", { body: { action: "certs.pdf", id: a[0].id }, headers: H }));
  const bytes = Buffer.from(pdf.body, pdf.isBase64Encoded ? "base64" : "utf8");
  check("PDF returned as binary (base64) with integrity header", pdf.statusCode === 200 && pdf.isBase64Encoded && bytes.slice(0, 5).toString() === "%PDF-" && pdf.headers["x-integrity"] === "match", pdf.headers);
  const c0 = issued[0].json.certificate, code = c0.verifyUrl.split("c=")[1];
  check("verification URL uses the configured Netlify domain", c0.verifyUrl.startsWith("https://uzleeder.netlify.app/verify/"), c0.verifyUrl);
  const v = json(await fn.startups(ev("GET", { query: { verify: c0.number, c: code } })));
  check("public verification through the Netlify function", v.found && v.status === "issued", v);
  const pub1 = json(await fn.startups(ev("GET")));
  check("startup cards get their certificate link", pub1.startups.filter(s => s.certificate).length === 2);

  // partner program through /api/contact?partner=1
  const P = async (b, h = {}) => { const r = await fn.contact(ev("POST", { body: b, query: { partner: "1" }, headers: h })); return { status: r.statusCode, json: json(r) }; };
  check("partner applications closed until configured", (await P({ action: "info" })).json.config.enabled === false);
  check("owner opens applications", (await P({ action: "configure", organization: "Test fixture only", contact: "privacy@example.invalid", retentionDays: 30, reviewed: true, enabled: true }, H)).json.ok);
  const notices = require(path.join(ROOT, "api/_lib/partner-notices.json"));
  const app = await P({ action: "submit", key: "d".repeat(64), version: notices.version, name: "Netlify Applicant", email: "n@example.invalid", contactMethod: "email", applicantType: "individual", role: "Developer", skills: "Node", motivation: "Build products", previousWork: "A project", collaboration: "Project-based", areas: ["Software Development"], truth: true, conditions: true, privacy: true });
  check("partner application saved on Netlify Blobs", app.status === 200 && app.json.record.status === "Submitted" && [...mem.keys()].some(k => k.startsWith("partners/records/")), app.json);
  const dup = await P({ action: "submit", key: "d".repeat(64), version: notices.version, name: "Netlify Applicant", email: "n@example.invalid", contactMethod: "email", applicantType: "individual", role: "Developer", skills: "Node", motivation: "Build products", previousWork: "A project", collaboration: "Project-based", areas: ["Software Development"], truth: true, conditions: true, privacy: true });
  check("retry finds the same application (create-only revision)", dup.json.record.id === app.json.record.id && dup.json.duplicate);
  check("applicant reads only with the key", (await P({ action: "get", id: app.json.record.id })).status === 404 && (await P({ action: "get", id: app.json.record.id, key: "d".repeat(64) })).json.ok);

  // uploads and media streaming (binary in and out)
  const png = Buffer.from("89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000d4944415478da63f8ffff3f0005fe02fea7d6a4a00000000049454e44ae426082", "hex");
  const up = json(await fn.upload(ev("POST", { body: { name: "dot.png", type: "image/png", data: "data:image/png;base64," + png.toString("base64"), dataUrl: "data:image/png;base64," + png.toString("base64") }, headers: H })));
  const url = up && (up.url || (up.file && up.file.url));
  check("image upload through the Netlify function", url && /^\/api\/media\//.test(url), up);
  if (url) {
    const m = await fn.media(ev("GET", { query: { key: url.split("/").pop() } }));
    const got = Buffer.from(m.body, m.isBase64Encoded ? "base64" : "utf8");
    check("media streamed back byte-for-byte (pipe through the adapter)", m.statusCode === 200 && m.isBase64Encoded && got.equals(png) && m.headers["content-type"] === "image/png", { status: m.statusCode, len: got.length });
  }
  check("direct big-file uploads answer 501 (clients fall back to in-function upload)", (await fn["blob-upload"](ev("POST", { body: {} }))).statusCode === 501);
  check("unauthenticated workspace call refused", (await fn.workspace(ev("POST", { body: { action: "certs.list" } }))).statusCode === 401);
  const content = json(await fn.content(ev("GET")));
  check("public content endpoint answers", content && typeof content === "object", content);

  console.log(results.join("\n"));
  const fails = results.filter(r => r.startsWith("FAIL")).length;
  console.log("\n" + (fails ? fails + " FAILED" : "ALL " + results.length + " NETLIFY TESTS PASSED"));
  process.exitCode = fails ? 1 : 0;
})().catch(e => { console.error(e); process.exitCode = 1; });
