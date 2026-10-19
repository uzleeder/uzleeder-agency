// End-to-end test of the V3 Vercel API with an in-memory @vercel/blob replacement.
const path = require("path");
const ROOT = require("path").join(__dirname, "..") + "/";
const API = ROOT + "api/";

// ---- in-memory blob mock (same surface as @vercel/blob 2.x used by store.js) ----
const mem = new Map();
let clock = Date.now();
const mock = {
  async put(pathname, data, o) {
    if (mem.has(pathname) && !o.allowOverwrite) throw new Error("This blob already exists");
    const buf = Buffer.isBuffer(data) ? data : Buffer.from(String(data));
    mem.set(pathname, { buf, contentType: o.contentType, uploadedAt: new Date(clock += 1000), access: o.access });
    return { pathname, url: "https://blob.test/" + pathname };
  },
  async list({ prefix = "", limit = 1000 } = {}) {
    const blobs = [...mem.entries()].filter(([k]) => k.startsWith(prefix)).map(([k, v]) => ({ pathname: k, url: "https://blob.test/" + k, size: v.buf.length, uploadedAt: v.uploadedAt }));
    return { blobs: blobs.slice(0, limit), hasMore: false };
  },
  async get(pathname) {
    const v = mem.get(pathname); if (!v) return null;
    return { statusCode: 200, stream: new Response(v.buf).body, blob: { contentType: v.contentType, size: v.buf.length } };
  },
  async del(p) { (Array.isArray(p) ? p : [p]).forEach(k => mem.delete(k)); },
  async head() {}
};
require.cache[require.resolve(ROOT + "node_modules/@vercel/blob")] = { exports: mock, loaded: true, id: "mock" };

const load = f => { delete require.cache[require.resolve(API + f)]; return require(API + f); };
function call(fn, { method = "POST", body = {}, headers = {}, query = {} } = {}) {
  return new Promise(resolve => {
    const chunks = [];
    const res = { statusCode: 200, headers: {}, setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
      write(c) { chunks.push(Buffer.from(c)); return true; }, on() {}, once() {}, emit() {},
      end(b) { if (b) chunks.push(Buffer.from(b)); const raw = Buffer.concat(chunks).toString(); let j; try { j = JSON.parse(raw); } catch (e) {} resolve({ status: this.statusCode, body: raw, json: j, headers: this.headers }); } };
    Promise.resolve(fn({ method, body, headers, query }, res)).catch(e => resolve({ status: "THREW", body: e.stack }));
  });
}
const results = [];
const check = (name, ok, got) => results.push((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  → got: " + String(JSON.stringify(got)).slice(0, 200)));

(async () => {
  Object.assign(process.env, { ADMIN_PASSWORD: "pw", ADMIN_SECRET: "0123456789abcdef0123456789abcdef", BLOB_READ_WRITE_TOKEN: "test" });
  delete process.env.TELEGRAM_BOT_TOKEN; delete process.env.TELEGRAM_CHAT_ID;
  delete require.cache[require.resolve(API + "_lib/store.js")];

  const contact = load("contact.js"), login = load("login.js"), admin = load("admin.js"), save = load("save.js"), content = load("content.js"), upload = load("upload.js");
  const media = load("media/[key].js");

  // login (failed + ok) → both logged
  check("login wrong → 401", (await call(login, { body: { password: "x" } })).status === 401);
  const L = await call(login, { body: { password: "pw" } });
  check("login ok → token", L.status === 200 && L.json.token, L);
  const H = { authorization: "Bearer " + L.json.token };

  // project brief → lead (no Telegram configured)
  const brief = { name: "Aziz", channel: "telegram", contact: "aziz_dev", service: "system", message: "We need an academy portal with payments", budget: "500-1500", lang: "uz", source: "homepage" };
  const C = await call(contact, { body: brief });
  check("brief stored as lead → 200 stored:true", C.status === 200 && C.json.stored === true && C.json.notified === null, C);
  check("duplicate brief accepted once", (await call(contact, { body: brief })).json.duplicate === true);
  check("brief: telegram needs a username/phone", (await call(contact, { body: Object.assign({}, brief, { contact: "x", message: "another message here" }) })).status === 400);
  check("brief: email channel needs an email", (await call(contact, { body: Object.assign({}, brief, { channel: "email", contact: "not-mail", message: "another message 2" }) })).json.fields.contact === "email");
  check("brief: whatsapp needs a phone", (await call(contact, { body: Object.assign({}, brief, { channel: "whatsapp", contact: "abc", message: "another message 3" }) })).json.fields.contact === "phone");
  check("brief: unknown service rejected", (await call(contact, { body: Object.assign({}, brief, { service: "hack", message: "another message 4" }) })).status === 400);
  check("brief: short text rejected", (await call(contact, { body: Object.assign({}, brief, { message: "hi" }) })).status === 400);
  check("legacy body still works", (await call(contact, { body: { name: "Old Form", email: "a@b.co", message: "Hello, I need a site" } })).json.stored === true);
  check("contact honeypot → 200, not stored", (await call(contact, { body: { website: "x", name: "Bot", email: "b@b.co", message: "spam spam" } })).status === 200);
  const storeMod = require(API + "_lib/store.js");
  await storeMod.addMessage({ name: "Aziz", email: "a@b.co", message: "Hello, I need a site", lang: "uz", source: "website" });

  // leads
  check("leads need auth", (await call(admin, { method: "GET", query: { action: "leads" } })).status === 401);
  const LD = await call(admin, { method: "GET", headers: H, query: { action: "leads" } });
  check("leads list has 2 (duplicate + honeypot excluded)", LD.json.leads.length === 2, LD.json);
  const lead = LD.json.leads.find(l => l.name === "Aziz");
  check("lead fields", lead.status === "new" && lead.channel === "telegram" && lead.contact === "@aziz_dev" && lead.notify.telegram === "not-configured", lead);
  check("lead.update → contacted + follow-up", (await call(admin, { headers: H, body: { action: "lead.update", id: lead.id, status: "contacted", followUp: "2026-10-01", notes: "Called" } })).json.lead.status === "contacted");
  check("lead.update bad status → 400", (await call(admin, { headers: H, body: { action: "lead.update", id: lead.id, status: "hacked" } })).status === 400);
  check("lead.update bad id → 400", (await call(admin, { headers: H, body: { action: "lead.update", id: "../x", status: "won" } })).status === 400);
  const RN = await call(admin, { headers: H, body: { action: "lead.notify", id: lead.id } });
  check("lead.notify without Telegram → not-configured", RN.json.result === "not-configured", RN.json);
  const OV2 = await call(admin, { method: "GET", headers: H, query: { action: "overview" } });
  check("overview pipeline counts", OV2.json.counts.leads === 2 && OV2.json.counts.newLeads === 1 && OV2.json.pipeline.contacted === 1, OV2.json.pipeline);
  // messages
  const M = await call(admin, { method: "GET", headers: H, query: { action: "messages" } });
  const msg = M.json.messages[0];
  check("messages list has 1 (honeypot excluded)", M.json.messages.length === 1, M.json);
  check("message fields", msg.name === "Aziz" && msg.status === "new" && msg.lang === "uz" && msg.source);
  const U = await call(admin, { headers: H, body: { action: "message.update", id: msg.id, status: "replied", priority: "high" } });
  check("message.update → replied/high", U.json.message.status === "replied" && U.json.message.priority === "high", U.json);
  check("message.update rejects bad status", (await call(admin, { headers: H, body: { action: "message.update", id: msg.id, status: "hacked" } })).json.message.status === "replied");
  check("message.update bad id → 400", (await call(admin, { headers: H, body: { action: "message.update", id: "../x" } })).status === 400);

  // draft / preview / publish
  check("save without token → 401", (await call(save, { body: { mode: "draft", content: {} } })).status === 401);
  await call(save, { headers: H, body: { mode: "draft", content: { overrides: { en: { hero_desc: "DRAFT" } } }, summary: "Hero text" } });
  check("public content ignores draft", (await call(content, { method: "GET" })).body === "{}");
  check("preview without token → 401", (await call(content, { method: "GET", query: { draft: "1" } })).status === 401);
  const P = await call(content, { method: "GET", headers: H, query: { draft: "1" } });
  check("preview returns draft", P.json.overrides.en.hero_desc === "DRAFT" && P.json.__preview === "draft", P.json);
  const PUB = await call(save, { headers: H, body: { mode: "publish", content: { overrides: { en: { hero_desc: "LIVE" } } }, summary: "Hero text" } });
  check("publish 200", PUB.status === 200, PUB);
  check("public content now published", (await call(content, { method: "GET" })).json.overrides.en.hero_desc === "LIVE");
  check("draft cleared after publish", !mem.has("cms/draft.json"));
  for (let i = 0; i < 7; i++) { const r = await call(save, { headers: H, body: { mode: "publish", content: { v: i } } }); if (r.status !== 200) check("rapid publish #" + i, false, r.body); }
  const V = await call(admin, { method: "GET", headers: H, query: { action: "versions" } });
  check("only last 5 published versions kept", V.json.versions.length === 5, V.json);
  const VR = V.json.versions[2];
  check("version preview returns content", (await call(admin, { method: "GET", headers: H, query: { action: "version", path: VR.pathname } })).json.content.v != null);
  check("version path traversal rejected", (await call(admin, { method: "GET", headers: H, query: { action: "version", path: "../auth/credential.json" } })).status === 400);
  const vBefore = (await call(content, { method: "GET" })).json.v;
  const vOld = (await call(admin, { method: "GET", headers: H, query: { action: "version", path: VR.pathname } })).json.content.v;
  check("version.restore publishes the old version", (await call(admin, { headers: H, body: { action: "version.restore", path: VR.pathname } })).status === 200 && (await call(content, { method: "GET" })).json.v === vOld && vOld !== vBefore);
  check("version.restore without token → 401", (await call(admin, { body: { action: "version.restore", path: VR.pathname } })).status === 401);
  check("legacy body (no mode) publishes", (await call(save, { headers: H, body: { legacy: true } })).status === 200 && (await call(content, { method: "GET" })).json.legacy === true);

  // media
  const png = "data:image/png;base64," + Buffer.from("fakepng").toString("base64");
  const UP = await call(upload, { headers: H, body: { dataUrl: png, name: "cover.png" } });
  check("upload → /api/media url", UP.status === 200 && /^\/api\/media\/img_/.test(UP.json.url), UP);
  check("upload rejects html", (await call(upload, { headers: H, body: { dataUrl: "data:text/html;base64,PGI+" } })).status === 400);
  const G = await call(media, { method: "GET", query: { key: UP.json.key } });
  check("media proxy serves bytes", G.status === 200 && G.headers["content-type"] === "image/png", { s: G.status, h: G.headers });
  const ML = await call(admin, { method: "GET", headers: H, query: { action: "media" } });
  check("media list has upload", ML.json.media.length === 1 && ML.json.media[0].key === UP.json.key);
  await call(admin, { headers: H, body: { action: "media.delete", key: UP.json.key, name: "cover.png" } });
  check("media deleted", (await call(media, { method: "GET", query: { key: UP.json.key } })).status === 404);

  // log contents
  const LG = await call(admin, { method: "GET", headers: H, query: { action: "log", limit: "50" } });
  const acts = LG.json.log.map(e => e.action);
  ["security.login_failed", "security.login", "lead.received", "lead.status", "message.status", "draft.save", "content.publish", "media.upload", "media.delete"].forEach(a => check("log records " + a, acts.includes(a), acts));
  check("unauthenticated admin → 401", (await call(admin, { method: "GET", query: { action: "overview" } })).status === 401);

  // password change
  check("pw change wrong current → 403", (await call(admin, { headers: H, body: { action: "password.change", current: "bad", next: "newpass12345" } })).status === 403);
  check("pw change weak → 400", (await call(admin, { headers: H, body: { action: "password.change", current: "pw", next: "short" } })).status === 400);
  const PC = await call(admin, { headers: H, body: { action: "password.change", current: "pw", next: "NewPass2026x" } });
  check("pw change ok → new token", PC.status === 200 && PC.json.token, PC);
  check("hash stored, not the password", mem.has("auth/credential.json") && !mem.get("auth/credential.json").buf.toString().includes("NewPass2026x"));
  check("old session rejected after change", (await call(admin, { method: "GET", headers: H, query: { action: "status" } })).status === 401);
  const H2 = { authorization: "Bearer " + PC.json.token };
  check("new token works", (await call(admin, { method: "GET", headers: H2, query: { action: "status" } })).status === 200);
  check("old env password refused", (await call(login, { body: { password: "pw" } })).status === 401);
  check("new password logs in", (await call(login, { body: { password: "NewPass2026x" } })).status === 200);
  check("log records password change", (await call(admin, { method: "GET", headers: H2, query: { action: "log" } })).json.log.some(a => a.action === "security.password_changed"));
  // Telegram configured but failing → lead still saved, notified:false; retry succeeds later
  process.env.TELEGRAM_BOT_TOKEN = "t"; process.env.TELEGRAM_CHAT_ID = "c";
  let tgOk = false, tgCalls = 0;
  const realFetch = global.fetch;
  global.fetch = async (url, o) => { if (String(url).includes("api.telegram.org")) { tgCalls++; return { status: 200, json: async () => ({ ok: tgOk, description: "down" }) }; } return realFetch(url, o); };
  const F1 = await call(contact, { body: { name: "Nodira", channel: "email", contact: "n@example.com", service: "website", message: "Landing page for my bakery please" } });
  check("telegram down: lead saved, notified:false", F1.status === 200 && F1.json.stored === true && F1.json.notified === false, F1.json);
  check("telegram retried once", tgCalls === 2, tgCalls);
  const nl = (await call(admin, { method: "GET", headers: H2, query: { action: "leads" } })).json.leads.find(l => l.name === "Nodira");
  check("lead records failed notification", nl.notify.telegram === "failed");
  tgOk = true;
  const RT = await call(admin, { headers: H2, body: { action: "lead.notify", id: nl.id } });
  check("retry notification → sent", RT.json.ok === true && RT.json.lead.notify.telegram === "sent", RT.json);
  global.fetch = realFetch; delete process.env.TELEGRAM_BOT_TOKEN; delete process.env.TELEGRAM_CHAT_ID;
  // analytics: anonymous beacons, bots/admin dropped, aggregation + daily roll-up
  const track = load("track.js");
  const UA = { "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1", "x-forwarded-for": "10.0.0.7", "x-vercel-ip-country": "UZ" };
  const beacon = (v, extra) => Object.assign({ v, start: Date.now(), isNew: true, pages: [{ p: "/uz", l: "uz" }], sections: ["home", "services", "work", "contact"], events: [{ n: "cta_click", s: "homepage" }, { n: "lead_submit_success", s: "website" }], dur: 45000, depth: 80, ref: "https://www.instagram.com/x", lang: "uz", sw: 390 }, extra || {});
  check("track → 204", (await call(track, { headers: UA, body: beacon("visit0000001") })).status === 204);
  await call(track, { headers: UA, body: beacon("visit0000001", { dur: 60000 }) });            // same visit updated, not duplicated
  await call(track, { headers: { "user-agent": "Googlebot/2.1" }, body: beacon("botvisit0001") });
  await call(track, { headers: UA, body: beacon("adminvisit01", { admin: true }) });
  await call(track, { headers: UA, body: beacon("../../x") });
  const rawKeys = [...mem.keys()].filter(k => k.startsWith("an/raw/"));
  check("only the real visit is stored (bot, admin, bad id dropped)", rawKeys.length === 1, rawKeys);
  const stored = JSON.parse(mem.get(rawKeys[0]).buf.toString());
  check("no IP or full user agent stored", !JSON.stringify(stored).includes("10.0.0.7") && !JSON.stringify(stored).includes("AppleWebKit") && stored.device === "Mobile" && stored.os === "iOS" && stored.ref === "instagram.com", stored);
  check("analytics needs auth", (await call(admin, { method: "GET", query: { action: "analytics" } })).status === 401);
  const AN = await call(admin, { method: "GET", headers: H2, query: { action: "analytics", days: "7" } });
  const td = AN.json.days.find(d => d.day === AN.json.today);
  check("today aggregated", td && td.visits === 1 && td.visitors === 1 && td.sections.contact === 1 && td.events.lead_submit_success === 1 && td.dur === 60000, td);
  // a finished day is rolled up once and its raw visits deleted
  const storeA = require(API + "_lib/store.js"), anl = require(API + "_lib/analytics.js");
  const yday = anl.dayOf(Date.now() - 864e5);
  await storeA.saveVisit(yday, "oldvisit0001", Object.assign(anl.parseVisit(beacon("oldvisit0001"), { headers: UA }, null), { day: yday }));
  const AN2 = await call(require(API + "admin.js"), { method: "GET", headers: H2, query: { action: "analytics", days: "8" } });
  check("past day rolled up", (AN2.json.days.find(d => d.day === yday) || {}).visits === 1 && mem.has("an/day/" + yday + ".json") && ![...mem.keys()].some(k => k.startsWith("an/raw/" + yday)), AN2.json.days.map(d => d.day + ":" + d.visits).join(" "));
  // big uploads: token endpoint refuses without an admin session or with a bad file name
  const bu = load("blob-upload.js");
  const genBody = (pathname, token) => ({ type: "blob.generate-client-token", payload: { pathname, callbackUrl: "https://x/api/blob-upload", clientPayload: JSON.stringify({ token }), multipart: true } });
  check("blob-upload without session → 401", (await call(bu, { body: genBody("media/med_abcdef1234.mp4", "nope") })).status === 401);
  check("blob-upload bad file name → 400", (await call(bu, { body: genBody("../auth/credential.json", PC.json.token) })).status === 400);
  // a direct-upload file (med_) is served (falls back to streaming when signing is unavailable)
  await mock.put("media/med_testvideo01.mp4", Buffer.from("fakevideo"), { contentType: "video/mp4" });
  const MV = await call(media, { method: "GET", query: { key: "med_testvideo01.mp4" } });
  check("med_ media served", MV.status === 200 && MV.headers["content-type"] === "video/mp4", { s: MV.status });
  check("media.log needs a med_ key", (await call(admin, { headers: H2, body: { action: "media.log", key: "../x" } })).status === 400);

  // ================= V5 Workspace (code-powered, no AI) =================
  const wsApi = load("workspace.js");
  const W = (action, p) => call(wsApi, { headers: H2, body: Object.assign({ action }, p || {}) });
  check("workspace needs a session", (await call(wsApi, { body: { action: "overview" } })).status === 401);

  // website brief → request with a readable ID, status NEW
  const B5 = await call(contact, { body: Object.assign({}, brief, { message: "V5 brief: a portal for our academy", service: "academy" }) });
  check("brief returns a UL request ID", B5.status === 200 && /^UL-\d{4}-[2-9A-HJ-NP-Z]{4}$/.test(B5.json.code || ""), B5.json);
  const R5 = (await W("requests.list")).json.requests;
  const req5 = R5.find(r => r.code === B5.json.code);
  check("request is NEW with its code", req5 && req5.stage === "new" && req5.service === "academy", req5);
  check("older leads map to V5 statuses", R5.every(r => ["new", "reviewing", "qualified", "waiting", "converted", "declined", "archived"].includes(r.stage)), R5.map(r => r.stage));
  check("CONVERTED cannot be chosen by hand", (await W("requests.update", { id: req5.id, stage: "converted" })).status === 400);
  check("status → WAITING_FOR_CLIENT", (await W("requests.update", { id: req5.id, stage: "waiting" })).json.request.stage === "waiting");
  const CV = await W("requests.convert", { id: req5.id });
  check("request → project (client + UL project ID)", CV.status === 200 && CV.json.request.stage === "converted" && /^UL-[2-9A-HJ-NP-Z]{4}$/.test(CV.json.project.code) && CV.json.project.kind === "client", CV.json);
  check("converting twice returns the same project", (await W("requests.convert", { id: req5.id })).json.existing === true);
  const P5 = CV.json.project;

  // tasks: 4 statuses, legacy "doing" normalised
  const T5 = (await W("tasks.save", { title: "Landing page", projectId: P5.id, status: "doing" })).json.item;
  check("legacy task status doing → in_progress", T5.status === "in_progress", T5);
  check("task → REVIEW", (await W("tasks.save", Object.assign({}, T5, { status: "review" }))).json.item.status === "review");

  // files: status, duplicate shares bytes, delete keeps shared bytes, compare
  const up1 = (await W("files.uploadSmall", { dataUrl: "data:text/plain;base64," + Buffer.from("line one\nline two").toString("base64"), name: "page.txt" })).json;
  const F5 = (await W("files.create", Object.assign({ name: "page.txt", folder: "deliverables", projectId: P5.id }, up1))).json.file;
  check("file in Deliverables starts as draft", F5.folder === "deliverables" && F5.status === "draft" && F5.versions[0].by === "Max", F5);
  const F5b = (await W("files.saveText", { id: F5.id, text: "line one\nline 2\nline three", base: 1, note: "edit" })).json.file;
  const CMP = await W("files.compare", { id: F5.id, a: 1, b: 2 });
  check("compare returns both versions", CMP.status === 200 && CMP.json.a.text.includes("line two") && CMP.json.b.text.includes("line three"), CMP.json);
  const DUP = (await W("files.duplicate", { id: F5.id })).json.file;
  check("duplicate = new file from the current version", DUP.name === "page (copy).txt" && DUP.versions.length === 1 && DUP.versions[0].key === F5b.versions[1].key, DUP);
  check("file status → in review", (await W("files.update", { id: F5.id, status: "in_review" })).json.file.status === "in_review");
  await W("files.delete", { id: F5.id, confirm: "page.txt" });
  check("deleting the original keeps the duplicate's bytes", mem.has(DUP.versions[0].key) && !mem.has(F5.versions[0].key));

  // content lifecycle: DRAFT → READY; archive; publishing records cannot be deleted
  const C5 = (await W("content.save", { title: "Launch", text: "Hello channels" })).json.content;
  check("new content is DRAFT", C5.status === "draft");
  check("mark READY", (await W("content.ready", { id: C5.id })).json.content.status === "ready");
  check("send without Telegram → integration required (nothing faked)", /Integration required/.test((await W("content.send", { id: C5.id, confirm: true, idem: "idem-test-0001" })).json.error || ""));
  const C6 = (await W("content.save", { title: "Old post", text: "was sent" })).json.content;
  const raw6 = JSON.parse(mem.get("ws/content/" + C6.id + ".json").buf.toString());
  raw6.destinations = ["@uzleeder"]; raw6.pubs = { "@uzleeder": { state: "failed", error: "Bad Request: chat not found" } }; raw6.history = [{ dest: "@uzleeder", result: "failed" }];
  await mock.put("ws/content/" + C6.id + ".json", JSON.stringify(raw6), { allowOverwrite: true, contentType: "application/json" });
  check("failed record keeps FAILED", (await W("content.list")).json.content.find(c => c.id === C6.id).status === "failed");
  check("content with publishing history cannot be deleted", (await W("content.delete", { id: C6.id, confirm: true })).status === 409);
  check("…but can be archived", (await W("content.archive", { id: C6.id })).json.content.status === "archived");
  check("archived content cannot be sent", /archived/i.test((await W("content.send", { id: C6.id, confirm: true, idem: "idem-test-0002" })).json.error || ""));
  check("a never-sent draft can be deleted", (await W("content.delete", { id: C5.id, confirm: true })).status === 200);

  // portfolio: only completed projects; nothing reaches the live site (only the Control Center draft)
  check("portfolio needs a completed project", (await W("portfolio.create", { projectId: P5.id })).status === 400);
  await W("projects.save", Object.assign({}, P5, { status: "COMPLETED" }));
  const PF = (await W("portfolio.create", { projectId: P5.id })).json.entry;
  check("portfolio draft starts without private brief text", PF.state === "draft" && PF.summary === "" && PF.showClient === false, PF);
  check("approve needs a public summary", (await W("portfolio.approve", { id: PF.id, confirm: true })).status === 400);
  await W("portfolio.save", { id: PF.id, title: "Academy portal", summary: "A student portal with payments and progress tracking.", tech: "Node, Postgres", link: "https://example.com", tag: "delivered" });
  check("approve", (await W("portfolio.approve", { id: PF.id, confirm: true })).json.entry.state === "approved");
  const pubBefore = [...mem.keys()].filter(k => k.startsWith("cms/published/")).length;
  const TS = await W("portfolio.toSite", { id: PF.id, confirm: true });
  const draft5 = JSON.parse(mem.get("cms/draft.json").buf.toString());
  check("approved entry goes into the Control Center draft", TS.json.entry.state === "sent" && draft5.projects.some(x => x.portfolioId === PF.id && x.title === "Academy portal" && x.client === ""), draft5.projects);
  check("…and nothing is published by itself", [...mem.keys()].filter(k => k.startsWith("cms/published/")).length === pubBefore);

  // integrations report real state
  const IC = (await W("integrations.check")).json.integrations;
  check("unconfigured integrations say not_configured", IC.telegram.state === "not_configured" && IC.github.state === "not_configured" && IC.storage.state === "connected", IC);
  const OV = (await W("overview", { today: "2099-01-01" })).json;
  check("overview counts real records only", typeof OV.failedOps === "number" && OV.tasks.due >= 0 && OV.portfolio.waiting === 0, OV);

  // services bot: full conversation → request with code, name, budget, timeline (Telegram replies fail harmlessly without a token)
  const bot = load("bot.js");
  const secret = require(API + "_lib/tg.js").webhookSecret();
  let uid = 9000;
  const upd = u => call(bot, { headers: { "x-telegram-bot-api-secret-token": secret }, body: Object.assign({ update_id: ++uid }, u) });
  const from = { id: 777, first_name: "Dilnoza", username: "dilnoza_dev", language_code: "en" }, chat = { id: 777, type: "private" };
  const bmsg = text => upd({ message: { chat, from, text } });
  const cb = data => upd({ callback_query: { id: "q" + uid, from, data, message: { chat } } });
  check("bot rejects calls without the webhook secret", (await call(bot, { body: { update_id: 1 } })).status === 401);
  await bmsg("/start"); await cb("svc:design"); await bmsg("A new logo and brand kit for our cafe"); await bmsg("Dilnoza K."); await bmsg("+998 90 123 45 67");
  await cb("bud:500-1500"); await cb("tl:skip"); await cb("skip"); await cb("send"); await cb("send");
  const botLeads = (await W("requests.list")).json.requests.filter(r => r.source === "telegram_bot");
  check("bot creates exactly one request (double tap ignored)", botLeads.length === 1, botLeads.length);
  const bl = botLeads[0] || {};
  check("bot request has code, name, service, budget", /^UL-\d{4}-/.test(bl.code) && bl.name === "Dilnoza K." && bl.service === "design" && bl.budget === "500-1500" && bl.timeline === "" && bl.stage === "new", bl);
  // ================= Startups: one canonical record, three experiences =================
  const suApi = load("startups.js");
  const pub = async () => (await call(suApi, { method: "GET", query: {} })).json;
  const P0 = await pub();
  check("startups: before import the built-in ventures are served", P0.ok && P0.initialized === false && P0.startups.map(s => s.slug).join() === "t-port,caiber-learn,future-ventures", P0);
  check("startups: preview needs the admin token", (await call(suApi, { method: "GET", query: { preview: "1" } })).status === 401);
  check("startups: POST is not allowed on the public endpoint", (await call(suApi, { method: "POST", body: {} })).status === 405);
  const IM = await W("startups.import");
  check("startups: import makes canonical published records", IM.json.imported === 3 && IM.json.startups.every(r => r.visible && r.state === "published"), IM.json);
  check("startups: second import refused", (await W("startups.import")).status === 409);
  const P1 = await pub();
  check("startups: public list now comes from the records", P1.initialized === true && P1.startups.length === 3);
  const NEW = await W("startups.create", { name: "Secret Lab", status: "prototype", category: "ai" });
  const sid = NEW.json.startup.id;
  check("startups: a new startup is a private draft", NEW.json.startup.state === "draft" && NEW.json.startup.visible === false && !(await pub()).startups.some(s => s.slug === "secret-lab"));
  check("startups: duplicate address refused", (await W("startups.create", { name: "Secret Lab" })).status === 409);
  const PV = (await call(suApi, { method: "GET", query: { preview: "1" }, headers: H2 })).json;
  check("startups: preview shows the draft to the admin", PV.preview && PV.startups.some(s => s.slug === "secret-lab"));
  let rev = NEW.json.startup.rev;
  const SV = await W("startups.save", { id: sid, rev, draft: { name: "Secret Lab", status: "prototype", category: "ai", tagline: { en: "A test venture" }, links: [{ url: "javascript:alert(1)" }, { url: "/projects/pitches/x.pdf", label: { en: "Deck" } }] } });
  rev = SV.json.startup.rev;
  check("startups: unsafe links dropped on save", SV.json.startup.draft.links.map(l => l.url).join() === "/projects/pitches/x.pdf", SV.json.startup.draft.links);
  check("startups: a stale save is refused (409)", (await W("startups.save", { id: sid, rev: rev - 1, draft: { name: "Old copy" } })).status === 409);
  check("startups: publish without approval refused", (await W("startups.publish", { id: sid, rev, confirm: true })).status === 400);
  check("startups: reject needs a reason", (await W("startups.submit", { id: sid, rev })).json.startup.state === "review" && (await W("startups.reject", { id: sid, note: "" })).status === 400);
  const RJ = await W("startups.reject", { id: sid, note: "Tagline too vague" });
  check("startups: rejected with explanation", RJ.json.startup.state === "rejected" && RJ.json.startup.review.note === "Tagline too vague");
  await W("startups.submit", { id: sid }); await W("startups.approve", { id: sid });
  const PB = await W("startups.publish", { id: sid, confirm: true });
  check("startups: approved → published (version 1)", PB.json.startup.visible && PB.json.startup.versions.length === 1);
  await W("startups.internal", { id: sid, internal: { notes: "PRIVATE-NOTE-123", goals: "win", opStatus: "blocked", repo: "uzleeder/secret" } });
  await W("startups.milestone", { id: sid, title: "PRIVATE-MILESTONE", status: "in_progress" });
  const pubJson = JSON.stringify(await pub());
  check("startups: public shows the published copy only", pubJson.includes("Secret Lab") && pubJson.includes("A test venture"));
  const privKeys = ["internal", "milestones", "versions", "review", "state", "visible", "rev", "draft", "published", "publishedBy", "updatedBy", "createdBy"];
  check("startups: internal notes, milestones and workflow never public", !/PRIVATE-NOTE-123|PRIVATE-MILESTONE|uzleeder\/secret/.test(pubJson) && JSON.parse(pubJson).startups.every(x => privKeys.every(k => !(k in x))), JSON.parse(pubJson).startups.map(x => Object.keys(x).filter(k => privKeys.includes(k))));
  const g1 = (await W("startups.get", { id: sid })).json.startup;
  await W("startups.save", { id: sid, rev: g1.rev, draft: Object.assign({}, g1.draft, { name: "Secret Lab v2" }) });
  const after = await pub();
  check("startups: editing after publish keeps the live copy until a new publish", after.startups.some(s => s.name === "Secret Lab") && !after.startups.some(s => s.name === "Secret Lab v2") && (await W("startups.get", { id: sid })).json.startup.state === "draft");
  const ms = (await W("startups.get", { id: sid })).json.startup.milestones[0];
  const TK = (await W("tasks.save", { title: "Build prototype", startupId: sid, milestoneId: ms.id, assignee: "Max" })).json.item;
  await W("tasks.save", Object.assign({}, { id: TK.id, title: "Build prototype v2", status: "in_progress" }));
  const upS = (await W("files.uploadSmall", { dataUrl: "data:text/plain;base64," + Buffer.from("spec").toString("base64"), name: "spec.txt" })).json;
  await W("files.create", Object.assign({ name: "spec.txt", folder: "projects", startupId: sid }, upS));
  const SG = (await W("startups.get", { id: sid })).json;
  check("startups: tasks keep their startup link when edited elsewhere", SG.tasks.length === 1 && SG.tasks[0].title === "Build prototype v2" && SG.tasks[0].milestoneId === ms.id);
  check("startups: files belong to the startup", SG.files.length === 1 && SG.files[0].name === "spec.txt");
  check("startups: activity records real events", ["startup.created", "startup.rejected", "startup.published", "startup.milestone", "task.created", "file.uploaded"].every(t => SG.activity.some(a => a.type === t)), SG.activity.map(a => a.type));
  const SL = (await W("startups.list")).json.startups.find(r => r.id === sid);
  check("startups: Workspace list shows real operations", SL.openTasks === 1 && SL.files === 1 && SL.nextMilestone.title === "PRIVATE-MILESTONE" && SL.opStatus === "blocked" && SL.changed === true);
  await W("startups.unpublish", { id: sid, confirm: true });
  check("startups: unpublish removes it from the public list", !(await pub()).startups.some(s => s.slug === "secret-lab"));
  const RS = await W("startups.restore", { id: sid, v: 1 });
  check("startups: restore copies a published version into the draft", RS.json.startup.draft.name === "Secret Lab" && RS.json.startup.state === "draft");
  check("startups: delete needs archive first", (await W("startups.delete", { id: sid, confirm: "secret-lab" })).status === 400);
  await W("startups.archive", { id: sid, confirm: true });
  check("startups: delete needs the typed address", (await W("startups.delete", { id: sid, confirm: "wrong" })).status === 400);
  check("startups: delete works and unlinks tasks", (await W("startups.delete", { id: sid, confirm: "secret-lab" })).status === 200 && (await W("tasks.list")).json.tasks.find(t => t.id === TK.id).startupId === "");
  check("startups: workspace actions need a session", (await call(wsApi, { body: { action: "startups.list" } })).status === 401);

  // contact with neither channel → 502
  delete process.env.BLOB_READ_WRITE_TOKEN;
  check("contact with no inbox and no Telegram → 502", (await call(load("contact.js"), { body: { name: "Aziz", email: "a@b.co", message: "Hello there" } })).status === 502);

  console.log(results.join("\n"));
  const fails = results.filter(r => r.startsWith("FAIL")).length;
  console.log("\n" + (fails ? fails + " FAILED" : "ALL " + results.length + " TESTS PASSED"));
})();
