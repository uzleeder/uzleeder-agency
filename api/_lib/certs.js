// UzLeeder Venture Record Certificates — records, workflow, permissions, numbering, issuance, revocation, verification.
// An INTERNAL UzLeeder document: never a government registration, licence, accreditation or proof of ownership/funding.
//
// Storage (Vercel Blob, private — same store as the Workspace):
//   ws/certs/<id>.json        the certificate record (workflow state, fields, evidence, audit, issuance snapshot)
//   ws/certtpl/<type>.json    the template for a document type (versioned; issued certificates keep their own snapshot)
//   ws/certno/<NUMBER>.json   number reservation — written create-only, so two issuances can never share a number;
//                             never deleted, so a revoked / superseded / void number is never reused
//   ws/certissue/<id>-<rev>   create-only issuance guard (a double click cannot issue one approval twice)
//   ws/certstats/<id>.json    verification counter (per day, no IP or visitor data)
//   wsc/<NUMBER>-<rand>.pdf   the issued PDF (private; its SHA-256 is stored in the record)
//
// Workflow (enforced here):  Draft → Under review → Approved → Issued   ·  Rejected (back to Draft on edit)
//   Issued → Suspended ⇄ Issued · Issued/Suspended → Revoked (final) · Issued/Suspended → Superseded (when a reissue is issued)
//   Issued records are never edited: a correction is a new record (reissue) that links to the old one.
const crypto = require("crypto");
const store = require("./store");
const ws = require("./ws");
const su = require("./startups");
const pdf = require("./certpdf");
const { getJSON, putJSON, listAll } = store._raw;
const blob = () => store._raw.blob();

class Bad extends Error { constructor(m, s) { super(m); this.status = s || 400; } }
const need = (c, m, s) => { if (!c) throw new Bad(m, s); };
const now = () => new Date().toISOString();
const str = (v, max) => (typeof v === "string" ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").replace(/\s+/g, " ").trim().slice(0, max) : "");
const pick = (v, list, d) => (list.includes(v) ? v : d);
const clone = o => JSON.parse(JSON.stringify(o));
const SITE = () => (process.env.SITE_URL || "https://uzleeder.uz").replace(/\/+$/, "");

/* ---------- document types ---------- */
const TYPES = {
  venture: { prefix: "VRC", required: ["ventureName", "representative", "stage"] },
  stage: { prefix: "DSR", required: ["ventureName", "representative", "stage"] },
  founder: { prefix: "FTA", required: ["ventureName", "member", "memberRole"] },
  completion: { prefix: "PCR", required: ["ventureName", "milestone", "completedOn"] }
};
const TYPE_KEYS = Object.keys(TYPES);
const FIELDS = ["ventureName", "representative", "stage", "market", "registration", "member", "memberRole", "milestone", "completedOn"];
const OPTIONAL = ["market", "registration"];                   // printed only once their evidence is Verified
const STAGES = ["concept", "research", "prototype", "development", "beta", "launched", "paused"];
const EVIDENCE = ["submitted", "under_review", "verified", "rejected", "na"];
const STATUS = ["draft", "review", "approved", "rejected", "issued", "suspended", "revoked", "superseded"];
const LANGS = ["en", "uz", "ru"];
const NUMBER_RE = /^UZL-(VRC|DSR|FTA|PCR)-\d{4}-\d{6}$/;
const CODE_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";     // no 0/O/1/I
const CODE_RE = /^[2-9A-HJ-NP-Z]{10}$/;
// wording that would misrepresent an internal record (checked on editable text; the fixed legal note is not editable)
const MISLEADING = /government[- ]?approved|officially registered|state[- ]registered|certified startup|accredit|licen[cs]ed by|it[- ]park resident|guarantee|davlat tomonidan tasdiqlangan|государственн\w* (одобр|аккредит)|аккредит/i;

/* ---------- permissions (server-side; the UI only mirrors them) ---------- */
const PERMS = ["view", "prepare", "edit", "request", "evidence", "approve", "issue", "reissue", "revoke", "templates", "audit"];
const ROLES = {
  admin: PERMS,                                                     // the owner (Max) — the only role that can sign in today
  editor: ["view", "prepare", "edit", "request"],
  reviewer: ["view", "evidence", "approve", "audit"],
  auditor: ["view", "audit"]
};
const can = (who, perm) => !!who && (ROLES[who.role] || []).includes(perm);
const actor = who => (who && who.name) || (who && who.role === "admin" ? "Max" : (who && who.role) || "unknown");
function allow(who, perm) { need(can(who, perm), "Your role does not allow this (" + perm + ").", 403); }

/* ---------- templates ---------- */
const DEFAULT_TEMPLATE = type => ({
  id: type, type, enabled: true, version: 1, title: "VENTURE RECORD CERTIFICATE",
  subtitle: {}, statement: {}, signatory: null, lang: "en", history: [], updatedAt: null, updatedBy: null
});
async function template(type) {
  need(TYPES[type], "Unknown document type");
  return (await ws.get("certtpl", type)) || DEFAULT_TEMPLATE(type);
}
const templates = async () => Promise.all(TYPE_KEYS.map(template));
const loc = (v, max) => { const o = {}; if (v && typeof v === "object") LANGS.forEach(l => { const s = str(v[l], max); if (s) o[l] = s; }); return o; };
async function saveTemplate(type, p, who) {
  allow(who, "templates");
  const t = await template(type);
  need(p.rev === undefined || +p.rev === (t.version || 1), "The template changed after you opened it. Reload.", 409);
  const next = {
    enabled: p.enabled !== false,
    title: str(p.title, 60).toUpperCase() || "VENTURE RECORD CERTIFICATE",
    subtitle: loc(p.subtitle, 80), statement: loc(p.statement, 400),
    signatory: p.signatory && str(p.signatory.name, 80) ? Object.assign({ name: str(p.signatory.name, 80), role: str(p.signatory.role, 80) }, p.signatory.sign === true ? { sign: true } : {}) : null,
    lang: pick(p.lang, LANGS, "en")
  };
  const text = [next.title].concat(Object.values(next.subtitle), Object.values(next.statement), next.signatory ? [next.signatory.role] : []).join(" ");
  need(!MISLEADING.test(text), "This wording could present an internal record as a government registration, licence or accreditation. Rephrase it.");
  need(/VENTURE|RECORD|CERTIFICATE/.test(next.title), "Keep the title recognisable as a UzLeeder venture record.");
  const before = { version: t.version, title: t.title, subtitle: t.subtitle, statement: t.statement, signatory: t.signatory, lang: t.lang, enabled: t.enabled, at: t.updatedAt, by: t.updatedBy };
  if (JSON.stringify([t.title, t.subtitle, t.statement, t.signatory, t.lang, t.enabled]) === JSON.stringify([next.title, next.subtitle, next.statement, next.signatory, next.lang, next.enabled])) return t;
  Object.assign(t, next, { version: (t.version || 1) + 1, updatedBy: actor(who) });
  t.history = [before].concat(t.history || []).slice(0, 30);
  await ws.put("certtpl", Object.assign(t, { updatedAt: now() }));
  await ws.activity("cert.template", "Certificate template “" + type + "” → version " + t.version, { kind: "certtpl", id: type });
  return t;
}

/* ---------- records ---------- */
async function getRec(id) { need(ws.okId(id), "bad id"); const r = await ws.get("certs", id); need(r, "Certificate not found", 404); return r; }
const all = async () => ws.list("certs");
function audit(r, who, action, note) { r.audit = r.audit || []; r.audit.unshift({ at: now(), by: actor(who), role: (who && who.role) || "", action, note: note ? String(note).slice(0, 500) : undefined }); }
async function put(r) { r.rev = (r.rev || 0) + 1; return ws.put("certs", r); }
function stale(r, rev) { need(rev === undefined || rev === null || +rev === (r.rev || 0), "Someone changed this certificate after you opened it. Reload, then try again.", 409); }
const log = (type, text, r) => ws.activity(type, text, { kind: "cert", id: r.id });
const label = r => (r.number || "draft") + " · " + ((r.fields || {}).ventureName || "?");

function cleanFields(p, type) {
  p = p && typeof p === "object" ? p : {};
  const f = {
    ventureName: str(p.ventureName, 80), repRole: pick(p.repRole, ["founder", "representative"], "founder"), representative: str(p.representative, 80),
    discloseRep: p.discloseRep !== false, stage: pick(p.stage, STAGES, ""), market: str(p.market, 60), registration: str(p.registration, 160),
    member: str(p.member, 80), memberRole: str(p.memberRole, 80), milestone: str(p.milestone, 160), completedOn: /^\d{4}-\d{2}-\d{2}$/.test(p.completedOn || "") ? p.completedOn : ""
  };
  const text = FIELDS.filter(k => k !== "registration").map(k => f[k]).join(" ");
  need(!MISLEADING.test(text), "A field uses wording that could present this record as a government registration, licence or accreditation.");
  return f;
}
const claimKeys = type => TYPES[type].required.concat(OPTIONAL);
function blankClaims(type, fields) {
  const c = {};
  claimKeys(type).forEach(k => { c[k] = { status: fields[k] ? "submitted" : "na", note: "", files: [] }; });
  return c;
}
// what the reviewer still has to settle before approval
function gaps(r) {
  const out = [];
  TYPES[r.type].required.forEach(k => {
    if (!r.fields[k]) out.push({ field: k, problem: "missing" });
    else if ((r.claims[k] || {}).status !== "verified") out.push({ field: k, problem: (r.claims[k] || {}).status || "submitted" });
  });
  OPTIONAL.forEach(k => { if (r.fields[k] && (r.claims[k] || {}).status !== "verified") out.push({ field: k, problem: "not printed until verified", optional: true }); });
  return out;
}
function row(r) {
  return { id: r.id, number: r.number || null, type: r.type, status: r.status, lang: r.lang, startupId: r.startupId, ventureName: (r.fields || {}).ventureName,
    issuedAt: r.issuedAt || null, issuedBy: r.issuedBy || null, updatedAt: r.updatedAt, createdBy: r.createdBy, origin: r.origin,
    replacesNumber: r.replacesNumber || null, supersededByNumber: r.supersededByNumber || null, openInfoRequest: (r.infoRequests || []).some(q => !q.response) };
}
// the view for the Control Center / Workspace (no PDF bytes, no internal-only data beyond what authorised staff may see)
function view(r, who) {
  const v = clone(r);
  v.gaps = r.type && r.fields ? gaps(r) : [];
  v.verifyUrl = r.number ? verifyUrl(r) : null;
  if (!can(who, "audit")) delete v.audit;
  return v;
}
const verifyUrl = r => SITE() + "/verify/" + r.number + "?c=" + r.verifyCode;

async function list(q, who) {
  allow(who, "view");
  q = q || {};
  let rows = (await all()).map(row);
  if (q.startupId) rows = rows.filter(x => x.startupId === q.startupId);
  if (q.type) rows = rows.filter(x => x.type === q.type);
  if (q.status) rows = rows.filter(x => x.status === q.status);
  return rows;
}

async function create(p, who) {
  allow(who, p.origin === "workspace" ? "request" : "prepare");
  const type = pick(p.type, TYPE_KEYS, "");
  need(type, "Choose a document type.");
  const t = await template(type); need(t.enabled !== false, "This document type is switched off in the templates.");
  const s = await su.getRec(p.startupId);
  const d = s.draft || {}, lead = (d.team || [])[0] || {};
  const pre = { ventureName: d.name, repRole: "founder", representative: lead.name || "", stage: d.status === "exploring" ? "concept" : d.status };
  const fields = cleanFields(Object.assign(pre, p.fields || {}), type);
  const r = {
    type, startupId: s.id, slug: s.slug, lang: pick(p.lang, LANGS, t.lang || "en"), status: "draft", fields, claims: blankClaims(type, fields),
    origin: p.origin === "workspace" ? "workspace" : "admin", request: str(p.request, 1000), notes: "", infoRequests: [], audit: [],
    createdBy: actor(who), replaces: null
  };
  audit(r, who, "created", r.origin === "workspace" ? "Requested from the Workspace" + (r.request ? ": " + r.request : "") : "Draft created");
  const doc = await ws.create("certs", r);
  await log("cert.created", "Certificate draft: " + label(doc) + " (" + type + ")", doc);
  return doc;
}

async function save(id, p, who) {
  allow(who, "edit");
  const r = await getRec(id); stale(r, p.rev);
  need(["draft", "rejected"].includes(r.status), "Only a draft can be edited. " + (["issued", "suspended"].includes(r.status) ? "Use “Reissue” for a correction." : ""));
  const fields = cleanFields(Object.assign({}, r.fields, p.fields || {}), r.type);
  // a changed value loses its Verified status — evidence was for the old value
  claimKeys(r.type).forEach(k => {
    const c = r.claims[k] || (r.claims[k] = { status: "na", note: "", files: [] });
    if (fields[k] !== r.fields[k]) c.status = fields[k] ? "submitted" : "na";
  });
  r.fields = fields;
  if (p.lang) r.lang = pick(p.lang, LANGS, r.lang);
  if (typeof p.notes === "string") r.notes = p.notes.slice(0, 4000);
  if (r.status === "rejected") { r.status = "draft"; audit(r, who, "edited", "Edited after rejection — back to draft"); } else audit(r, who, "edited");
  await put(r);
  return r;
}

async function evidence(id, p, who) {
  allow(who, "evidence");
  const r = await getRec(id); stale(r, p.rev);
  need(["draft", "review"].includes(r.status), "Evidence can be reviewed while the certificate is a draft or under review.");
  const k = p.field; need(claimKeys(r.type).includes(k), "Unknown field");
  const status = pick(p.status, EVIDENCE, ""); need(status, "Unknown evidence status");
  need(status !== "verified" || r.fields[k], "There is no value to verify.");
  const files = Array.isArray(p.files) ? p.files.filter(ws.okId).slice(0, 10) : (r.claims[k] || {}).files || [];
  r.claims[k] = { status, note: str(p.note, 500), files, by: actor(who), at: now() };
  audit(r, who, "evidence", k + " → " + status + (p.note ? " (" + str(p.note, 200) + ")" : ""));
  await put(r);
  return r;
}

async function transition(id, action, p, who) {
  const r = await getRec(id); stale(r, p.rev);
  const by = actor(who);
  if (action === "submit") {
    allow(who, r.origin === "workspace" ? "request" : "prepare");
    need(["draft", "rejected"].includes(r.status), "Only a draft can be submitted.");
    const missing = TYPES[r.type].required.filter(k => !r.fields[k]);
    need(!missing.length, "Fill in: " + missing.join(", "));
    r.status = "review"; r.review = null; audit(r, who, "submitted");
  } else if (action === "requestInfo") {
    allow(who, "evidence");
    need(r.status === "review", "Only a certificate under review can be sent back for information.");
    const note = str(p.note, 1000); need(note, "Say what information is missing.");
    r.infoRequests = r.infoRequests || []; r.infoRequests.push({ at: now(), by, note, response: "", respondedAt: null });
    r.status = "draft"; audit(r, who, "info requested", note);
  } else if (action === "respond") {
    allow(who, "request");
    const q = (r.infoRequests || []).filter(x => !x.response).pop(); need(q, "There is no open information request.");
    const text = str(p.response, 2000); need(text, "Write a response.");
    q.response = text; q.respondedAt = now(); q.respondedBy = by; audit(r, who, "info provided", text);
  } else if (action === "approve") {
    allow(who, "approve");
    need(r.status === "review", "Only a certificate under review can be approved.");
    const open = gaps(r).filter(g => !g.optional);
    need(!open.length, "Not every required claim is verified: " + open.map(g => g.field + " (" + g.problem + ")").join(", "));
    // separation of duties: an approver may not approve their own draft — except the owner, who is the only account today
    need(who.role === "admin" || r.createdBy !== by, "You prepared this certificate; another reviewer must approve it.", 403);
    r.status = "approved"; r.review = { decision: "approved", note: str(p.note, 500), by, at: now() }; audit(r, who, "approved", p.note);
  } else if (action === "reject") {
    allow(who, "approve");
    need(r.status === "review", "Only a certificate under review can be rejected.");
    const note = str(p.note, 1000); need(note, "A rejection needs a reason.");
    r.status = "rejected"; r.review = { decision: "rejected", note, by, at: now() }; audit(r, who, "rejected", note);
  } else if (action === "suspend") {
    allow(who, "revoke");
    need(r.status === "issued", "Only an issued certificate can be suspended.");
    const reason = str(p.reason, 500); need(reason, "A suspension needs a reason.");
    r.status = "suspended"; r.suspension = { at: now(), by, reason }; r.statusChangedAt = now(); audit(r, who, "suspended", reason);
  } else if (action === "reinstate") {
    allow(who, "revoke");
    need(r.status === "suspended", "Only a suspended certificate can be reinstated.");
    const reason = str(p.reason, 500); need(reason, "Say why it is reinstated.");
    r.status = "issued"; r.suspension = Object.assign({}, r.suspension, { liftedAt: now(), liftedBy: by, liftReason: reason }); r.statusChangedAt = now(); audit(r, who, "reinstated", reason);
  } else if (action === "revoke") {
    allow(who, "revoke");
    need(["issued", "suspended"].includes(r.status), "Only an issued or suspended certificate can be revoked.");
    const reason = str(p.reason, 500); need(reason, "A revocation needs a reason.");
    need(p.confirm === r.number, "Type the certificate number to confirm.");
    r.status = "revoked"; r.revocation = { at: now(), by, reason }; r.statusChangedAt = now(); audit(r, who, "revoked", reason);
  } else throw new Bad("Unknown action");
  await put(r);
  await log("cert." + action, "Certificate " + action + ": " + label(r), r);
  return r;
}

// delete is for drafts that were never issued; issued history is kept forever
async function remove(id, p, who) {
  allow(who, "prepare");
  const r = await getRec(id);
  need(["draft", "rejected"].includes(r.status) && !r.number, "Only an unissued draft can be deleted. Issued certificates are suspended or revoked instead.");
  await ws.remove("certs", id);
  await ws.activity("cert.deleted", "Certificate draft deleted: " + label(r) + " (" + r.type + ")");
  return { deleted: id };
}

/* ---------- numbering ---------- */
async function reserveNumber(type, certId, at) {
  const year = new Date(at).getUTCFullYear(), head = "UZL-" + TYPES[type].prefix + "-" + year + "-";
  const used = (await listAll("ws/certno/" + head)).map(b => +(b.pathname.slice(("ws/certno/" + head).length).replace(".json", "")) || 0);
  let n = used.length ? Math.max(...used) + 1 : 1;
  for (let i = 0; i < 40; i++, n++) {
    const number = head + String(n).padStart(6, "0");
    try { await putJSON("ws/certno/" + number + ".json", { number, id: certId, at }, false); return number; }
    catch (e) { if (!/already exists/i.test(e.message || "")) throw e; }   // taken by a concurrent issuance → next one
  }
  throw new Bad("Could not reserve a certificate number — try again.", 503);
}
const verifyCode = () => Array.from(crypto.randomBytes(10), b => CODE_ALPHABET[b % 32]).join("");
const sha256 = buf => crypto.createHash("sha256").update(buf).digest("hex");

function snapshotOf(r, t, at, number, code, recordVersion) {
  const f = clone(r.fields);
  OPTIONAL.forEach(k => { if ((r.claims[k] || {}).status !== "verified") f[k] = ""; });
  return {
    number, type: r.type, lang: r.lang, issuedAt: at, verifyCode: code, verifyUrl: SITE() + "/verify/" + number + "?c=" + code,
    templateVersion: t.version || 1, recordVersion, replaces: r.replacesNumber || null, fields: f,
    template: { title: t.title, subtitle: t.subtitle[r.lang] || "", statement: t.statement[r.lang] || "", signatory: t.signatory || null }
  };
}

async function issue(id, p, who) {
  allow(who, "issue");
  const r = await getRec(id); stale(r, p.rev);
  need(r.status === "approved", "Only an approved certificate can be issued.");
  try { await putJSON("ws/certissue/" + r.id + "-" + (r.rev || 0) + ".json", { at: now(), by: actor(who) }, false); }
  catch (e) { if (/already exists/i.test(e.message || "")) throw new Bad("This certificate is already being issued.", 409); throw e; }
  const t = await template(r.type);
  const at = now();
  const number = await reserveNumber(r.type, r.id, at);
  const code = verifyCode();
  const prev = r.replaces ? await getRec(r.replaces).catch(() => null) : null;
  const snap = snapshotOf(r, t, at, number, code, prev ? (prev.recordVersion || 1) + 1 : 1);
  let bytes;
  try { bytes = await pdf.render(snap); }
  catch (e) { await putJSON("ws/certno/" + number + ".json", { number, id: r.id, at, void: true, reason: "PDF generation failed" }, true); throw e; }
  const key = "wsc/" + number + "-" + crypto.randomBytes(4).toString("hex") + ".pdf";
  await blob().put(key, bytes, { access: store._raw.access(), contentType: "application/pdf", addRandomSuffix: false, allowOverwrite: false });
  Object.assign(r, {
    status: "issued", number, verifyCode: code, issuedAt: at, issuedBy: actor(who), recordVersion: snap.recordVersion,
    snapshot: snap, templateVersion: snap.templateVersion, signatory: snap.template.signatory,
    pdf: { key, sha256: sha256(bytes), size: bytes.length, filename: number + ".pdf", template: pdf.TEMPLATE_ID }, statusChangedAt: at
  });
  audit(r, who, "issued", number + " · SHA-256 " + r.pdf.sha256.slice(0, 16) + "…");
  await put(r);
  await log("cert.issued", "Certificate issued: " + label(r), r);
  if (prev && ["issued", "suspended"].includes(prev.status)) {
    prev.status = "superseded"; prev.supersededBy = r.id; prev.supersededByNumber = number; prev.statusChangedAt = at;
    audit(prev, who, "superseded", "Replaced by " + number);
    await put(prev);
    await log("cert.superseded", "Certificate superseded: " + label(prev) + " → " + number, prev);
  }
  return r;
}

// a correction: a new draft linked to the issued record (which stays valid until the replacement is issued)
async function reissue(id, p, who) {
  allow(who, "reissue");
  const old = await getRec(id);
  need(["issued", "suspended"].includes(old.status), "Only an issued or suspended certificate can be reissued.");
  const open = (await all()).find(x => x.replaces === old.id && !["issued", "revoked", "superseded"].includes(x.status));
  need(!open, "A replacement for this certificate is already being prepared.", 409);
  const r = {
    type: old.type, startupId: old.startupId, slug: old.slug, lang: old.lang, status: "draft", fields: clone(old.fields), claims: clone(old.claims),
    origin: p.origin === "workspace" ? "workspace" : "admin", request: str(p.note, 1000), notes: "", infoRequests: [], audit: [],
    createdBy: actor(who), replaces: old.id, replacesNumber: old.number
  };
  audit(r, who, "created", "Reissue of " + old.number + (r.request ? ": " + r.request : ""));
  const doc = await ws.create("certs", r);
  audit(old, who, "reissue started", "Replacement draft created");
  await put(old);
  await log("cert.reissue", "Reissue started for " + old.number, doc);
  return doc;
}

/* ---------- PDF ---------- */
async function previewPdf(id, who) {
  allow(who, "view");
  const r = await getRec(id);
  if (r.number) return issuedPdf(id, who);
  const t = await template(r.type);
  const snap = snapshotOf(r, t, now(), "UZL-" + TYPES[r.type].prefix + "-PREVIEW", "XXXXXXXXXX", 1);
  snap.preview = true;
  return { bytes: await pdf.render(snap), filename: "preview-" + (r.slug || r.id) + ".pdf", preview: true };
}
async function issuedPdf(id, who) {
  allow(who, "view");
  const r = await getRec(id);
  need(r.pdf && r.pdf.key, "This certificate has no issued PDF.", 404);
  const got = await blob().get(r.pdf.key, { access: store._raw.access() });
  need(got && got.stream, "The PDF is missing from storage.", 404);
  const bytes = Buffer.from(await new Response(got.stream).arrayBuffer());
  return { bytes, filename: r.pdf.filename, sha256: sha256(bytes), intact: sha256(bytes) === r.pdf.sha256 };
}

/* ---------- public verification ---------- */
const NOT_FOUND = { ok: true, found: false, status: "not_found" };
async function verify(number, code) {
  if (!NUMBER_RE.test(number || "") || !CODE_RE.test(code || "")) return NOT_FOUND;
  const res = await getJSON("ws/certno/" + number + ".json").catch(() => null);
  if (!res || !res.id || res.void) return NOT_FOUND;
  const r = await ws.get("certs", res.id).catch(() => null);
  // same answer for a wrong code and an unknown number — nothing to enumerate
  if (!r || r.number !== number || !r.verifyCode || !crypto.timingSafeEqual(Buffer.from(r.verifyCode), Buffer.from(code))) return NOT_FOUND;
  bump(r.id).catch(() => {});
  const f = r.snapshot.fields, out = {
    ok: true, found: true, issuer: "UzLeeder", number: r.number, type: r.type, typeLabel: pdf.TYPE_LABEL[r.type], status: r.status,
    ventureName: f.ventureName, issuedAt: r.issuedAt, statusChangedAt: r.statusChangedAt || r.issuedAt, lang: r.lang,
    note: "Internal UzLeeder venture record. It does not replace government business registration, licences, permits or other official credentials."
  };
  if (["venture", "stage"].includes(r.type)) { out.stage = f.stage; out.stageLabel = pdf.STAGE_LABEL[f.stage] || null; }
  if (f.discloseRep !== false) {
    if (["venture", "stage"].includes(r.type)) { out.representative = f.representative; out.repRole = f.repRole; }
    if (r.type === "founder") { out.member = f.member; out.memberRole = f.memberRole; }
  }
  if (r.type === "completion") { out.milestone = f.milestone; out.completedOn = f.completedOn; }
  if (f.registration) out.registration = f.registration;
  if (r.status === "revoked") out.revokedAt = r.revocation && r.revocation.at;
  if (r.status === "suspended") out.suspendedAt = r.suspension && r.suspension.at;
  if (r.status === "superseded" && r.supersededByNumber) out.supersededBy = r.supersededByNumber;
  if (r.replacesNumber) out.replaces = r.replacesNumber;
  return out;
}
async function bump(id) {
  const k = "ws/certstats/" + id + ".json", day = now().slice(0, 10);
  const s = (await getJSON(k).catch(() => null)) || { count: 0, days: {} };
  s.count++; s.last = now(); s.days[day] = (s.days[day] || 0) + 1;
  const keep = Object.keys(s.days).sort().slice(-90); s.days = Object.fromEntries(keep.map(d => [d, s.days[d]]));
  await putJSON(k, s);
}
async function stats(id, who) { allow(who, "audit"); return (await getJSON("ws/certstats/" + id + ".json").catch(() => null)) || { count: 0, days: {} }; }

/* ---------- convenience: a Venture Record draft for each venture that has none yet ---------- */
async function prepareAll(p, who) {
  allow(who, "prepare");
  const [ventures, certs] = await Promise.all([su.all(), all()]);
  const made = [];
  for (const s of ventures.filter(v => !v.archived && v.draft && v.draft.detail !== false)) {   // research directions without their own record are skipped
    if (certs.some(c => c.startupId === s.id && c.type === "venture" && !["revoked", "superseded"].includes(c.status))) continue;
    made.push(await create({ startupId: s.id, type: "venture", lang: pick(p.lang, LANGS, "en") }, who));
  }
  return made;
}

// the "Certificate" button on the homepage cards: per venture slug, its current VALID record (Venture Record first,
// then Development Stage Record). Only the number and the verification link — what the printed QR code already carries.
async function publicBySlug() {
  const rank = { venture: 0, stage: 1 };
  const best = {};
  (await all()).filter(r => r.status === "issued" && r.number && r.slug && r.type in rank).forEach(r => {
    const cur = best[r.slug];
    if (!cur || rank[r.type] < rank[cur.type] || (rank[r.type] === rank[cur.type] && r.issuedAt > cur.issuedAt)) best[r.slug] = r;
  });
  const out = {};
  Object.keys(best).forEach(s => { const r = best[s]; out[s] = { number: r.number, type: r.type, url: "/verify/" + r.number + "?c=" + r.verifyCode }; });
  return out;
}

module.exports = {
  publicBySlug,
  Bad, TYPES, TYPE_KEYS, STAGES, EVIDENCE, STATUS, PERMS, ROLES, LANGS, NUMBER_RE, can,
  template, templates, saveTemplate, list, getRec, view, row, gaps, create, save, evidence, transition, remove, issue, reissue,
  previewPdf, issuedPdf, verify, stats, prepareAll, verifyUrl
};
