// End-to-end tests for UzLeeder Venture Record Certificates (api/_lib/certs.js through /api/workspace and /api/startups).
// In-memory @vercel/blob replacement, the same as server/test-api.cjs.
const path = require("path");
const ROOT = path.join(__dirname, "..") + "/";
const API = ROOT + "api/";

const mem = new Map();
let clock = Date.now();
const mock = {
  async put(pathname, data, o) {
    if (mem.has(pathname) && !o.allowOverwrite) throw new Error("This blob already exists");
    const buf = Buffer.isBuffer(data) ? data : Buffer.from(typeof data === "string" ? data : data);
    mem.set(pathname, { buf, contentType: o.contentType, uploadedAt: new Date(clock += 1000) });
    return { pathname, url: "https://blob.test/" + pathname };
  },
  async list({ prefix = "", limit = 1000 } = {}) {
    const blobs = [...mem.entries()].filter(([k]) => k.startsWith(prefix)).map(([k, v]) => ({ pathname: k, url: "https://blob.test/" + k, size: v.buf.length, uploadedAt: v.uploadedAt }));
    return { blobs: blobs.slice(0, limit), hasMore: false };
  },
  async get(pathname) { const v = mem.get(pathname); if (!v) return null; return { statusCode: 200, stream: new Response(v.buf).body, blob: { contentType: v.contentType, size: v.buf.length } }; },
  async del(p) { (Array.isArray(p) ? p : [p]).forEach(k => mem.delete(k)); },
  async head() {}
};
require.cache[require.resolve(ROOT + "node_modules/@vercel/blob")] = { exports: mock, loaded: true, id: "mock" };

function call(fn, { method = "POST", body = {}, headers = {}, query = {} } = {}) {
  return new Promise(resolve => {
    const chunks = [];
    const res = { statusCode: 200, headers: {}, setHeader(k, v) { this.headers[k.toLowerCase()] = v; }, write(c) { chunks.push(Buffer.from(c)); return true; }, on() {}, once() {}, emit() {},
      end(b) { if (b) chunks.push(Buffer.from(b)); const buf = Buffer.concat(chunks); let j; try { j = JSON.parse(buf.toString()); } catch (e) {} resolve({ status: this.statusCode, buf, json: j, headers: this.headers }); } };
    Promise.resolve(fn({ method, body, headers, query }, res)).catch(e => resolve({ status: "THREW", buf: Buffer.from(String(e.stack)) }));
  });
}
const results = [];
const check = (name, ok, got) => results.push((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  → got: " + String(JSON.stringify(got)).slice(0, 300)));

(async () => {
  Object.assign(process.env, { ADMIN_PASSWORD: "pw", ADMIN_SECRET: "0123456789abcdef0123456789abcdef", BLOB_READ_WRITE_TOKEN: "test", SITE_URL: "https://uzleeder.vercel.app" });
  const auth = require(API + "_lib/auth.js");
  const login = require(API + "login.js"), wsApi = require(API + "workspace.js"), pub = require(API + "startups.js");
  const { PDFDocument } = require("pdf-lib");
  const L = await call(login, { body: { password: "pw" } });
  const H = { authorization: "Bearer " + L.json.token };
  const exp = Date.now() + 3600e3;
  const tok = role => ({ authorization: "Bearer " + auth.sign({ role, exp, v: 0 }) });
  const EDITOR = tok("editor"), REVIEWER = tok("reviewer"), AUDITOR = tok("auditor");
  const W = (action, body = {}, headers = H) => call(wsApi, { headers, body: Object.assign({ action }, body) });
  const V = (number, c, ip) => call(pub, { method: "GET", query: { verify: number, c }, headers: { "x-forwarded-for": ip || "10.0.0." + Math.floor(Math.random() * 250) } });
  const year = new Date().getUTCFullYear();

  // ventures to certify
  await W("startups.import");
  const ventures = (await W("certs.list")).json.ventures;
  const tport = ventures.find(v => v.slug === "t-port"), caiber = ventures.find(v => v.slug === "caiber-learn");
  check("ventures available to certify", tport && caiber, ventures);

  const P = await W("certs.perms");
  check("owner has every certificate permission", P.json.perms.length === 11, P.json);
  check("editor permissions are limited", (await W("certs.perms", {}, EDITOR)).json.perms.join() === "view,prepare,edit,request");

  // 1–4 · draft from the venture record; nothing is verified automatically
  let c = (await W("certs.create", { startupId: tport.id, type: "venture", lang: "en" })).json.certificate;
  check("draft prefilled from the venture record", c.status === "draft" && c.fields.ventureName === "T-Port" && c.fields.representative === "Max" && c.fields.stage === "research", c);
  check("submitted information is not marked verified", Object.values(c.claims).every(x => x.status !== "verified") && c.claims.ventureName.status === "submitted");
  c = (await W("certs.save", { id: c.id, rev: c.rev, fields: { representative: "Mekhriddin Abdualim", market: "Uzbekistan" } })).json.certificate;
  check("gaps list the unverified claims", c.gaps.filter(g => !g.optional).length === 3 && c.gaps.some(g => g.field === "market" && g.optional), c.gaps);
  const pv = await W("certs.preview", { id: c.id });
  check("preview PDF renders (watermarked, not issued)", pv.status === 200 && pv.buf.slice(0, 5).toString() === "%PDF-" && /preview/.test(pv.headers["content-disposition"]), pv.status);
  check("misleading wording refused", (await W("certs.save", { id: c.id, rev: c.rev, fields: { milestone: "Government approved startup" } })).status === 400);

  c = (await W("certs.submit", { id: c.id, rev: c.rev })).json.certificate;
  check("submitted → under review", c.status === "review");
  const early = await W("certs.approve", { id: c.id, rev: c.rev });
  check("approval refused while claims are unverified", early.status === 400 && /not every required claim/i.test(early.json.error), early.json);

  // 5 · permissions are enforced on the server
  check("editor cannot review evidence", (await W("certs.evidence", { id: c.id, rev: c.rev, field: "ventureName", status: "verified" }, EDITOR)).status === 403);
  check("editor cannot approve", (await W("certs.approve", { id: c.id, rev: c.rev }, EDITOR)).status === 403);
  check("auditor cannot issue", (await W("certs.issue", { id: c.id, rev: c.rev }, AUDITOR)).status === 403);
  check("no token → 401", (await call(wsApi, { body: { action: "certs.list" } })).status === 401);

  for (const field of ["ventureName", "representative", "stage"]) c = (await W("certs.evidence", { id: c.id, rev: c.rev, field, status: "verified", note: "Checked against the founder's records" }, REVIEWER)).json.certificate;
  check("reviewer verified the required claims", ["ventureName", "representative", "stage"].every(k => c.claims[k].status === "verified" && c.claims[k].by === "reviewer"));
  check("issue before approval refused", (await W("certs.issue", { id: c.id, rev: c.rev })).status === 400);
  c = (await W("certs.approve", { id: c.id, rev: c.rev, note: "Records match" }, REVIEWER)).json.certificate;
  check("approved", c.status === "approved" && c.review.by === "reviewer");
  check("reviewer cannot issue", (await W("certs.issue", { id: c.id, rev: c.rev }, REVIEWER)).status === 403);

  // 6–9 · issue, number, PDF, integrity
  c = (await W("certs.issue", { id: c.id, rev: c.rev })).json.certificate;
  const first = c;
  check("issued with the numbering format", c.status === "issued" && c.number === "UZL-VRC-" + year + "-000001", c.number);
  check("issuance record: digest, template, snapshot, issuer", /^[0-9a-f]{64}$/.test(c.pdf.sha256) && c.templateVersion === 1 && c.snapshot.fields.ventureName === "T-Port" && c.issuedBy === "Max");
  check("unverified optional claim is not printed", c.snapshot.fields.market === "", c.snapshot.fields);
  check("verification URL carries an unguessable code", /^https:\/\/uzleeder\.vercel\.app\/verify\/UZL-VRC-\d{4}-000001\?c=[2-9A-HJ-NP-Z]{10}$/.test(c.verifyUrl), c.verifyUrl);
  const D = await W("certs.pdf", { id: c.id });
  check("PDF download: filename, digest header, integrity match", D.status === 200 && D.headers["content-disposition"].includes(c.number + ".pdf") && D.headers["x-content-sha256"] === c.pdf.sha256 && D.headers["x-integrity"] === "match", D.headers);
  const doc = await PDFDocument.load(D.buf);
  const pg = doc.getPage(0).getSize();
  check("PDF is A4 landscape", Math.round(pg.width) === 842 && Math.round(pg.height) === 595, pg);
  check("PDF carries the approved data (title/subject metadata)", doc.getTitle().includes(c.number) && doc.getSubject().includes("T-Port") && doc.getAuthor() === "UzLeeder", [doc.getTitle(), doc.getSubject()]);
  check("PDF embeds its fonts", D.buf.includes(Buffer.from("/FontFile2")), "no FontFile2");
  check("no download without a token", (await call(wsApi, { body: { action: "certs.pdf", id: c.id } })).status === 401);

  // 10–12 · public verification
  const code = c.verifyUrl.split("c=")[1];
  const pv1 = (await V(c.number, code)).json;
  check("public verification: found, issued, approved fields", pv1.found && pv1.status === "issued" && pv1.issuer === "UzLeeder" && pv1.ventureName === "T-Port" && pv1.representative === "Mekhriddin Abdualim" && pv1.stage === "research", pv1);
  const leaked = ["claims", "audit", "notes", "pdf", "verifyCode", "snapshot", "infoRequests", "startupId", "review", "createdBy", "issuedBy"].filter(k => k in pv1);
  check("public verification exposes no private fields", !leaked.length && !JSON.stringify(pv1).includes(code), leaked);
  const wrong = (await V(c.number, "ABCDEFGHJK")).json, unknown = (await V("UZL-VRC-" + year + "-009999", code)).json;
  check("wrong code and unknown number look the same", JSON.stringify(wrong) === JSON.stringify(unknown) && wrong.status === "not_found");
  check("malformed identifiers rejected", (await V("../../etc", "x")).json.status === "not_found");

  // 13 · later venture edits do not touch the issued document
  const srec = (await W("startups.get", { id: tport.id })).json.startup;
  await W("startups.save", { id: tport.id, rev: srec.rev, draft: Object.assign({}, srec.draft, { name: "T-Port Renamed" }) });
  const D2 = await W("certs.pdf", { id: c.id });
  const again = (await W("certs.get", { id: c.id })).json.certificate;
  check("venture edit leaves the issued PDF and snapshot unchanged", D2.headers["x-content-sha256"] === c.pdf.sha256 && again.snapshot.fields.ventureName === "T-Port" && (await V(c.number, code)).json.ventureName === "T-Port");
  check("issued certificate cannot be edited", (await W("certs.save", { id: c.id, rev: again.rev, fields: { ventureName: "X" } })).status === 400);
  check("issued certificate cannot be deleted", (await W("certs.delete", { id: c.id })).status === 400);
  check("startup detail lists its certificates", (await W("startups.get", { id: tport.id })).json.certificates.some(x => x.number === c.number));

  // 14–15 · reissue → supersede
  let r2 = (await W("certs.reissue", { id: c.id, note: "Correct the market" })).json.certificate;
  check("reissue: a linked draft, claims carried over", r2.status === "draft" && r2.replacesNumber === c.number);
  check("only one open reissue at a time", (await W("certs.reissue", { id: c.id })).status === 409);
  r2 = (await W("certs.evidence", { id: r2.id, rev: r2.rev, field: "market", status: "verified" })).json.certificate;
  r2 = (await W("certs.submit", { id: r2.id, rev: r2.rev })).json.certificate;
  r2 = (await W("certs.approve", { id: r2.id, rev: r2.rev })).json.certificate;
  r2 = (await W("certs.issue", { id: r2.id, rev: r2.rev })).json.certificate;
  check("replacement issued with a new number and version 2", r2.number === "UZL-VRC-" + year + "-000002" && r2.recordVersion === 2 && r2.snapshot.fields.market === "Uzbekistan");
  const oldV = (await V(c.number, code)).json;
  check("old certificate is superseded and points to the replacement", oldV.status === "superseded" && oldV.supersededBy === r2.number, oldV);
  check("old PDF still available to authorised users", (await W("certs.pdf", { id: c.id })).headers["x-content-sha256"] === c.pdf.sha256);

  // 16 · suspend / reinstate / revoke
  const code2 = r2.verifyUrl.split("c=")[1];
  check("suspension needs a reason", (await W("certs.suspend", { id: r2.id, rev: r2.rev })).status === 400);
  r2 = (await W("certs.suspend", { id: r2.id, rev: r2.rev, reason: "Founder details under check" })).json.certificate;
  check("public page shows Suspended", (await V(r2.number, code2)).json.status === "suspended");
  r2 = (await W("certs.reinstate", { id: r2.id, rev: r2.rev, reason: "Check completed" })).json.certificate;
  check("reinstated → issued", r2.status === "issued" && (await V(r2.number, code2)).json.status === "issued");
  check("revocation needs the typed number", (await W("certs.revoke", { id: r2.id, rev: r2.rev, reason: "Test" })).status === 400);
  r2 = (await W("certs.revoke", { id: r2.id, rev: r2.rev, reason: "Test revocation", confirm: r2.number })).json.certificate;
  check("revoked; public status changes; record kept", r2.status === "revoked" && (await V(r2.number, code2)).json.status === "revoked" && r2.audit.some(a => a.action === "revoked"));
  check("revoked certificate cannot be reinstated", (await W("certs.reinstate", { id: r2.id, rev: r2.rev, reason: "x" })).status === 400);
  check("audit history hidden from roles without audit", !("audit" in (await W("certs.get", { id: r2.id }, EDITOR)).json.certificate) && "audit" in (await W("certs.get", { id: r2.id }, AUDITOR)).json.certificate);

  // 18 · concurrent issuance never duplicates a number
  async function approved(startupId, type, lang, fields) {
    let x = (await W("certs.create", { startupId, type, lang, fields })).json.certificate;
    for (const k of Object.keys(x.claims)) if (x.fields[k] && !["market", "registration"].includes(k)) x = (await W("certs.evidence", { id: x.id, rev: x.rev, field: k, status: "verified" })).json.certificate;
    x = (await W("certs.submit", { id: x.id, rev: x.rev })).json.certificate;
    return (await W("certs.approve", { id: x.id, rev: x.rev })).json.certificate;
  }
  const batch = [];
  for (let i = 0; i < 5; i++) batch.push(await approved(caiber.id, "venture", "en"));
  const issued = await Promise.all(batch.map(x => W("certs.issue", { id: x.id, rev: x.rev })));
  const nums = issued.map(x => x.json.certificate && x.json.certificate.number);
  check("5 concurrent issuances → 5 distinct numbers", nums.every(Boolean) && new Set(nums).size === 5, nums);
  check("revoked / superseded numbers are not reused", !nums.includes("UZL-VRC-" + year + "-000001") && !nums.includes("UZL-VRC-" + year + "-000002"));
  const twice = await approved(caiber.id, "venture", "en");
  const both = await Promise.all([W("certs.issue", { id: twice.id, rev: twice.rev }), W("certs.issue", { id: twice.id, rev: twice.rev })]);
  check("double-issuing one approval: exactly one succeeds", both.filter(x => x.status === 200).length === 1, both.map(x => x.status));

  // 19 · other document types and languages
  const ru = await approved(caiber.id, "stage", "ru");
  const ruI = (await W("certs.issue", { id: ru.id, rev: ru.rev })).json.certificate;
  check("Russian Development Stage Record issues (DSR numbering)", ruI.number === "UZL-DSR-" + year + "-000001" && (await W("certs.pdf", { id: ruI.id })).buf.length > 10000);
  const fta = await approved(caiber.id, "founder", "uz", { member: "Jack", memberRole: "Project & Ecosystem Manager" });
  const ftaI = (await W("certs.issue", { id: fta.id, rev: fta.rev })).json.certificate;
  check("Uzbek Founder/Team Association Record issues (FTA)", ftaI.number === "UZL-FTA-" + year + "-000001" && (await V(ftaI.number, ftaI.verifyUrl.split("c=")[1])).json.member === "Jack");
  const pcr = (await W("certs.create", { startupId: caiber.id, type: "completion", fields: { milestone: "Foundation sprint" } })).json.certificate;
  check("Project Completion Record needs a completion date", (await W("certs.submit", { id: pcr.id, rev: pcr.rev })).status === 400);
  check("unissued draft can be deleted", (await W("certs.delete", { id: pcr.id })).json.deleted === pcr.id);

  // templates
  const T = (await W("certs.templates")).json.templates;
  check("four document types with default templates", T.map(t => t.type).join() === "venture,stage,founder,completion" && T.every(t => t.version === 1));
  check("template wording that implies accreditation is refused", (await W("certs.templateSave", { type: "venture", rev: 1, title: "VENTURE RECORD CERTIFICATE", subtitle: { en: "Accredited startup record" } })).status === 400);
  check("editor cannot change templates", (await W("certs.templateSave", { type: "venture", rev: 1, title: "VENTURE RECORD CERTIFICATE" }, EDITOR)).status === 403);
  const T2 = (await W("certs.templateSave", { type: "venture", rev: 1, title: "VENTURE RECORD CERTIFICATE", signatory: { name: "Mekhriddin Abdualim", role: "Founder & CEO, UzLeeder" } })).json.template;
  check("template change creates version 2 with history", T2.version === 2 && T2.history[0].version === 1);
  check("issued certificates keep their template version", (await W("certs.get", { id: first.id })).json.certificate.templateVersion === 1);
  check("template preview renders", (await W("certs.templatePreview", { type: "venture", lang: "ru" })).buf.slice(0, 5).toString() === "%PDF-");
  // founder's handwritten signature: off unless the template says sign:true; never invented for other fields
  check("signature flag is off by default", !T2.signatory.sign);
  const T3 = (await W("certs.templateSave", { type: "venture", rev: 2, title: "VENTURE RECORD CERTIFICATE", signatory: { name: "Mekhriddin Abdualim", role: "Founder & CEO, UzLeeder", sign: true } })).json.template;
  check("founder signature flag is saved on the template", T3 && T3.signatory.sign === true && T3.version === 3, T3 && T3.signatory);
  const imgs = async buf => { const d = await PDFDocument.load(buf); return d.getPages().reduce((n, p) => { const x = p.node.Resources().lookup(require("pdf-lib").PDFName.of("XObject")); return n + (x ? x.keys().length : 0); }, 0); };
  const { render } = require(API + "_lib/certpdf.js");
  const snapBase = { number: "UZL-VRC-2026-T00001", type: "venture", lang: "en", issuedAt: "2026-10-28T10:00:00Z", templateVersion: 3, verifyUrl: "https://uzleeder.uz/verify/x", fields: { ventureName: "X", repRole: "founder", representative: "Y", stage: "mvp", market: "UZ" }, template: { title: "VENTURE RECORD CERTIFICATE", subtitle: "", statement: "", signatory: { name: "Mekhriddin Abdualim", role: "Founder & CEO" } } };
  const noSign = await render(JSON.parse(JSON.stringify(snapBase))), withSign = await render(Object.assign(JSON.parse(JSON.stringify(snapBase)), { template: Object.assign({}, snapBase.template, { signatory: Object.assign({}, snapBase.template.signatory, { sign: true }) }) }));
  check("PDF has no signature image without the flag", (await imgs(noSign)) === 0);
  check("PDF carries the founder's signature image with the flag", (await imgs(withSign)) === 1);
  check("signature is not drawn when there is no signatory", (await imgs(await render(Object.assign(JSON.parse(JSON.stringify(snapBase)), { template: Object.assign({}, snapBase.template, { signatory: null }) })))) === 0);

  // workspace request flow
  let wq = (await W("certs.create", { startupId: tport.id, type: "stage", origin: "workspace", request: "Need a stage record for the incubator application" }, EDITOR)).json.certificate;
  check("workspace request creates a draft with the request text", wq.origin === "workspace" && wq.request.includes("incubator"));
  wq = (await W("certs.submit", { id: wq.id, rev: wq.rev }, EDITOR)).json.certificate;
  wq = (await W("certs.requestInfo", { id: wq.id, rev: wq.rev, note: "Attach the research summary" }, REVIEWER)).json.certificate;
  check("reviewer requests information → back to draft", wq.status === "draft" && wq.infoRequests[0].note.includes("research"));
  wq = (await W("certs.respond", { id: wq.id, rev: wq.rev, response: "Uploaded to Files → Documents" }, EDITOR)).json.certificate;
  check("requester responds", wq.infoRequests[0].response.includes("Uploaded"));
  wq = (await W("certs.submit", { id: wq.id, rev: wq.rev }, EDITOR)).json.certificate;
  wq = (await W("certs.reject", { id: wq.id, rev: wq.rev }, REVIEWER));
  check("rejection needs a reason", wq.status === 400);

  // stale writes, stats, prepare-all, rate limit
  const cur = (await W("certs.get", { id: twice.id })).json.certificate;
  check("stale revision refused (409)", (await W("certs.suspend", { id: cur.id, rev: 1, reason: "x" })).status === 409);
  check("verification activity counted (no visitor data)", (await W("certs.stats", { id: first.id })).json.stats.count >= 3);
  const prep = (await W("certs.prepareAll")).json.created;
  // CAIBER has valid Venture Records; T-Port's are superseded/revoked; Future Ventures has no record of its own
  check("prepare-all: a draft only where no valid venture record exists", prep.length === 1 && prep[0].startupId === tport.id, prep);
  // startups: one record, permissions enforced on the server for every role
  check("startups: owner permissions", (await W("startups.perms")).json.perms.join() === "view,create,edit,ops,review,publish,archive,delete,order");
  let sx = (await W("startups.create", { name: "Perm Test", status: "exploring", category: "saas", tagline: { en: "x" }, slug: "perm-test" }, EDITOR)).json.startup;
  check("startups: editor can create a draft", sx && sx.state === "draft" && sx.createdBy !== "Max", sx && sx.createdBy);
  sx = (await W("startups.submit", { id: sx.id, rev: sx.rev }, EDITOR)).json.startup;
  check("startups: editor cannot approve", (await W("startups.approve", { id: sx.id, rev: sx.rev }, EDITOR)).status === 403);
  check("startups: reviewer cannot edit content", (await W("startups.save", { id: sx.id, rev: sx.rev, draft: sx.draft }, REVIEWER)).status === 403);
  sx = (await W("startups.approve", { id: sx.id, rev: sx.rev }, REVIEWER)).json.startup;
  check("startups: reviewer approves", sx.state === "approved");
  check("startups: reviewer cannot publish", (await W("startups.publish", { id: sx.id, rev: sx.rev, confirm: true }, REVIEWER)).status === 403);
  check("startups: editor cannot publish", (await W("startups.publish", { id: sx.id, rev: sx.rev, confirm: true }, EDITOR)).status === 403);
  check("startups: not public before publishing", !(await call(pub, { method: "GET", query: {} })).json.startups.some(v => v.slug === "perm-test"));
  sx = (await W("startups.publish", { id: sx.id, rev: sx.rev, confirm: true })).json.startup;
  check("startups: owner publishes → public", sx.visible && (await call(pub, { method: "GET", query: {} })).json.startups.some(v => v.slug === "perm-test"));
  check("startups: auditor reads but cannot change operations", (await W("startups.get", { id: sx.id }, AUDITOR)).status === 200 && (await W("startups.internal", { id: sx.id, rev: sx.rev, internal: { goals: "x" } }, AUDITOR)).status === 403);
  check("startups: non-owner roles cannot reach unrelated areas", (await W("clients.list", {}, EDITOR)).status === 403 && (await W("content.list", {}, REVIEWER)).status === 403 && (await W("files.delete", {}, EDITOR)).status === 403);
  const unk = await call(wsApi, { headers: { authorization: "Bearer " + auth.sign({ role: "guest", exp, v: 0 }) }, body: { action: "startups.list" } });
  check("startups: unknown role refused", unk.status === 403);

  // homepage "Certificate" button data: only a VALID record, only number + verification link
  const pubList = (await call(pub, { method: "GET", query: {} })).json.startups;
  const pc = pubList.find(s => s.slug === "caiber-learn").certificate, pt = pubList.find(s => s.slug === "t-port");
  check("public list: valid venture record linked for CAIBER Learn", pc && pc.type === "venture" && /^\/verify\/UZL-VRC-\d{4}-\d{6}\?c=[2-9A-HJ-NP-Z]{10}$/.test(pc.url) && Object.keys(pc).join() === "number,type,url", pc);
  check("public list: no button when the venture's records are superseded/revoked", !("certificate" in pt), pt.certificate);
  const pcRec = (await W("certs.list", { startupId: caiber.id })).json.certificates.find(x => x.number === pc.number);
  let toSuspend = (await W("certs.get", { id: pcRec.id })).json.certificate;
  await W("certs.suspend", { id: toSuspend.id, rev: toSuspend.rev, reason: "test" });
  const after = (await call(pub, { method: "GET", query: {} })).json.startups.find(s => s.slug === "caiber-learn").certificate;
  check("public list: a suspended record is never linked", !after || after.number !== pc.number, after);

  let last;
  for (let i = 0; i < 31; i++) last = await V(first.number, code, "203.0.113.9");
  check("verification lookups are rate-limited", last.status === 429);

  console.log(results.join("\n"));
  const fails = results.filter(r => r.startsWith("FAIL")).length;
  console.log("\n" + (fails ? fails + " FAILED" : "ALL " + results.length + " CERTIFICATE TESTS PASSED"));
  process.exitCode = fails ? 1 : 0;
})();
