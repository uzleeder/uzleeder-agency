// Storage for the UzLeeder Control Center on Vercel — backed by Vercel Blob (@vercel/blob 2.x).
// Needs BLOB_READ_WRITE_TOKEN (added automatically when a Blob store is connected to the project).
//
// Layout
//   cms/published/<ts>.json  published site content (newest wins; last KEEP versions kept as history)
//   cms/draft.json           work-in-progress content from the admin editor
//   msgs/<id>.json           contact-form messages from the older form (personal data → private)
//   leads/<id>.json          project briefs from the website — the lead pipeline (private)
//   dedupe/<hash>.json       short-lived duplicate-submission guard
//   log/<ts>-<rand>.json     activity / audit log
//   media/<key>              uploaded images & documents (served to the site through /api/media/<key>)
//   auth/credential.json     the admin password hash after Max changes it (scrypt + salt + version)
//
// Blobs are written as PRIVATE by default. Set BLOB_ACCESS=public only for a store created as public.
// Vercel Blob by default; Netlify Blobs when running on Netlify (netlify/shared/vercel-adapter.js sets UZL_BLOB_DRIVER)
const ON_NETLIFY = process.env.UZL_BLOB_DRIVER === "netlify";
const blob = ON_NETLIFY ? require("./blob-netlify") : require("@vercel/blob");

const ACCESS = process.env.BLOB_ACCESS === "public" ? "public" : "private";
const KEEP = 5;
const LOG_KEEP = 500;

const configured = () => ON_NETLIFY || !!process.env.BLOB_READ_WRITE_TOKEN;
const accessMode = () => ACCESS;

async function listAll(prefix, max = 2000) {
  const out = [];
  let cursor;
  do {
    const page = await blob.list({ prefix, limit: 1000, cursor });
    out.push(...page.blobs);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor && out.length < max);
  return out;
}

async function readText(pathname) {
  const r = await blob.get(pathname, { access: ACCESS, useCache: false });
  if (!r || r.statusCode !== 200) return null;
  return new Response(r.stream).text();
}
async function getJSON(pathname) {
  const t = await readText(pathname).catch(e => (isNotFound(e) ? null : Promise.reject(e)));
  return t ? JSON.parse(t) : null;
}
function putJSON(pathname, obj, overwrite = true) {
  return blob.put(pathname, JSON.stringify(obj), {
    access: ACCESS, contentType: "application/json", addRandomSuffix: false, allowOverwrite: overwrite, cacheControlMaxAge: 60
  });
}
const isNotFound = e => e && (e.name === "BlobNotFoundError" || /not.?found/i.test(e.message || ""));
const newest = arr => arr.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

/* ---------- content (draft / publish) ---------- */
async function readPublished() {
  if (!configured()) return { content: {}, meta: null };
  const [latest] = newest(await listAll("cms/published/"));
  if (!latest) return { content: {}, meta: null };
  return { content: (await getJSON(latest.pathname)) || {}, meta: { updatedAt: latest.uploadedAt, versions: undefined } };
}
async function readDraft() {
  const b = (await listAll("cms/draft.json")).find(x => x.pathname === "cms/draft.json");
  if (!b) return null;
  return { content: await getJSON("cms/draft.json"), meta: { updatedAt: b.uploadedAt } };
}
async function saveDraft(obj) { await putJSON("cms/draft.json", obj); }
async function discardDraft() { await blob.del("cms/draft.json").catch(() => {}); }
async function publish(obj) {
  // unique name even for two publishes in the same millisecond (double-click)
  await putJSON("cms/published/" + Date.now() + "-" + Math.random().toString(36).slice(2, 7) + ".json", obj, false);
  const versions = newest(await listAll("cms/published/"));
  const stale = versions.slice(KEEP).map(b => b.pathname);
  if (stale.length) await blob.del(stale);
  await discardDraft();
  return versions.length > KEEP ? KEEP : versions.length;
}
async function publishedVersions() {
  return newest(await listAll("cms/published/")).map(b => ({ pathname: b.pathname, at: b.uploadedAt, size: b.size }));
}

/* ---------- messages ---------- */
const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
async function addMessage(msg) {
  const id = newId();
  const doc = Object.assign({ id, createdAt: new Date().toISOString(), status: "new", priority: "normal" }, msg, { id });
  await putJSON("msgs/" + id + ".json", doc, false);
  return doc;
}
async function listMessages(limit = 200) {
  const blobs = newest(await listAll("msgs/")).slice(0, limit);
  const docs = [];
  for (let i = 0; i < blobs.length; i += 20) {                       // fetch in small parallel batches
    const part = await Promise.all(blobs.slice(i, i + 20).map(b => getJSON(b.pathname).catch(() => null)));
    docs.push(...part.filter(Boolean));
  }
  return docs.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}
async function updateMessage(id, patch) {
  if (!/^[a-z0-9]+$/i.test(id)) throw new Error("bad id");
  const doc = await getJSON("msgs/" + id + ".json");
  if (!doc) return null;
  const allowed = {};
  if (["new", "read", "in_progress", "replied", "archived"].includes(patch.status)) allowed.status = patch.status;
  if (["low", "normal", "high"].includes(patch.priority)) allowed.priority = patch.priority;
  if (typeof patch.note === "string") allowed.note = patch.note.slice(0, 2000);
  const next = Object.assign(doc, allowed, { updatedAt: new Date().toISOString() });
  await putJSON("msgs/" + id + ".json", next);
  return next;
}
async function deleteMessage(id) {
  if (!/^[a-z0-9]+$/i.test(id)) throw new Error("bad id");
  await blob.del("msgs/" + id + ".json");
}

/* ---------- activity log ---------- */
async function log(entry) {
  if (!configured()) return;
  const at = new Date();
  const doc = Object.assign({ at: at.toISOString(), actor: "Max" }, entry);
  try {
    await putJSON("log/" + String(at.getTime()).padStart(15, "0") + "-" + Math.random().toString(36).slice(2, 7) + ".json", doc, false);
    if (Math.random() < 0.05) {                                     // occasional pruning keeps the log bounded
      const all = newest(await listAll("log/"));
      const stale = all.slice(LOG_KEEP).map(b => b.pathname);
      if (stale.length) await blob.del(stale);
    }
  } catch (e) { console.error("activity log write failed:", e.message); }
}
async function readLog(limit = 100) {
  const blobs = newest(await listAll("log/")).slice(0, limit);
  const docs = await Promise.all(blobs.map(b => getJSON(b.pathname).catch(() => null)));
  return docs.filter(Boolean).sort((a, b) => b.at.localeCompare(a.at));
}

/* ---------- media ---------- */
async function saveMedia(key, buffer, contentType) {
  await blob.put("media/" + key, buffer, { access: ACCESS, contentType, addRandomSuffix: false, allowOverwrite: false });
  return "/api/media/" + key;
}
async function listMedia() {
  return newest(await listAll("media/")).map(b => ({ key: b.pathname.slice(6), url: "/api/media/" + b.pathname.slice(6), size: b.size, uploadedAt: b.uploadedAt }));
}
async function getMedia(key, range) {
  const opts = { access: ACCESS };
  if (range) opts.headers = { range };
  let r = await blob.get("media/" + key, opts).catch(e => (isNotFound(e) ? null : range ? "retry" : Promise.reject(e)));
  if (r === "retry") r = await blob.get("media/" + key, { access: ACCESS }).catch(e => (isNotFound(e) ? null : Promise.reject(e)));
  return r && r.stream ? r : null;
}
async function deleteMedia(key) { await blob.del("media/" + key); }
// short-lived signed CDN link for a private file (supports Range requests → video seeking, big files)
const signedCache = new Map();
async function signedMediaUrl(key) {
  const hit = signedCache.get(key);
  if (hit && hit.until - Date.now() > 2 * 3600e3) return hit.url;
  const pathname = "media/" + key;
  if (ACCESS === "public") { const h = await blob.head(pathname); return h && h.url; }
  const until = Date.now() + 24 * 3600e3;
  const tok = await blob.issueSignedToken({ pathname, operations: ["get", "head"], validUntil: until });
  const { presignedUrl } = await blob.presignUrl(tok, { operation: "get", pathname, access: "private", validUntil: until });
  signedCache.set(key, { url: presignedUrl, until });
  if (signedCache.size > 500) signedCache.clear();
  return presignedUrl;
}

/* ---------- leads (project briefs from the website) ---------- */
const LEAD_STATUS = ["new", "contacted", "qualified", "proposal", "won", "lost"];
// readable request ID shown to the customer and in the Workspace: UL-2026-7K3F (no 0/O/1/I)
const leadCode = () => "UL-" + new Date().getFullYear() + "-" + Array.from(require("crypto").randomBytes(4), b => "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"[b % 32]).join("");
async function addLead(lead) {
  const id = newId();
  const doc = Object.assign({ id, createdAt: new Date().toISOString(), status: "new", code: leadCode() }, lead, { id });
  await putJSON("leads/" + id + ".json", doc, false);
  return doc;
}
async function getLead(id) {
  if (!/^[a-z0-9]+$/i.test(id)) throw new Error("bad id");
  return getJSON("leads/" + id + ".json");
}
async function listLeads(limit = 500) {
  const blobs = newest(await listAll("leads/")).slice(0, limit);
  const docs = [];
  for (let i = 0; i < blobs.length; i += 20) {
    const part = await Promise.all(blobs.slice(i, i + 20).map(b => getJSON(b.pathname).catch(() => null)));
    docs.push(...part.filter(Boolean));
  }
  return docs.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}
async function updateLead(id, patch) {
  const doc = await getLead(id);
  if (!doc) return null;
  const allowed = {};
  if (LEAD_STATUS.includes(patch.status)) allowed.status = patch.status;
  if (patch.followUp === "" || patch.followUp === null) allowed.followUp = null;
  else if (typeof patch.followUp === "string" && /^\d{4}-\d{2}-\d{2}$/.test(patch.followUp)) allowed.followUp = patch.followUp;
  if (typeof patch.notes === "string") allowed.notes = patch.notes.slice(0, 4000);
  if (patch.notify && typeof patch.notify === "object") allowed.notify = patch.notify;
  const next = Object.assign(doc, allowed, { updatedAt: new Date().toISOString() });
  await putJSON("leads/" + id + ".json", next);
  return next;
}
async function deleteLead(id) {
  if (!/^[a-z0-9]+$/i.test(id)) throw new Error("bad id");
  await blob.del("leads/" + id + ".json");
}
// duplicate protection: the same contact + text within the window counts once
async function seenRecently(key, windowMs) {
  const p = "dedupe/" + key + ".json";
  const prev = await getJSON(p).catch(() => null);
  if (prev && Date.now() - prev.at < windowMs) return prev;
  return null;
}
async function remember(key, data) { await putJSON("dedupe/" + key + ".json", Object.assign({ at: Date.now() }, data)); }

/* ---------- analytics (first-party, anonymous) ----------
   an/raw/<day>/<visitId>.json   one document per visit (overwritten while the visit goes on)
   an/day/<day>.json             daily roll-up; raw visits of finished days are deleted after roll-up */
async function saveVisit(day, id, doc) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !/^[a-z0-9]{8,32}$/i.test(id)) throw new Error("bad visit");
  await putJSON("an/raw/" + day + "/" + id + ".json", doc);
}
async function rawVisits(day) {
  const blobs = await listAll("an/raw/" + day + "/", 5000);
  const docs = [];
  for (let i = 0; i < blobs.length; i += 25) {
    const part = await Promise.all(blobs.slice(i, i + 25).map(b => getJSON(b.pathname).catch(() => null)));
    docs.push(...part.filter(Boolean));
  }
  return { docs, paths: blobs.map(b => b.pathname) };
}
// which days have roll-ups / raw visits — one list call each
async function analyticsIndex() {
  const [days, raw] = await Promise.all([listAll("an/day/", 2000), listAll("an/raw/", 20000)]);
  const rawByDay = {};
  raw.forEach(b => { const d = b.pathname.split("/")[2]; (rawByDay[d] = rawByDay[d] || []).push(b.pathname); });
  return { dayFiles: new Set(days.map(b => b.pathname.slice(7, 17))), rawByDay };
}
async function readRaw(paths) {
  const docs = [];
  for (let i = 0; i < paths.length; i += 25) docs.push(...(await Promise.all(paths.slice(i, i + 25).map(p => getJSON(p).catch(() => null)))).filter(Boolean));
  return docs;
}
async function readDay(day) { return getJSON("an/day/" + day + ".json").catch(() => null); }
async function writeDay(day, agg, rawPaths) {
  await putJSON("an/day/" + day + ".json", agg);
  for (let i = 0; i < rawPaths.length; i += 100) await blob.del(rawPaths.slice(i, i + 100)).catch(() => {});
}

/* ---------- published versions (rollback) ---------- */
async function readVersion(pathname) {
  if (!/^cms\/published\/[\w-]+\.json$/.test(pathname)) throw new Error("bad version");
  return getJSON(pathname);
}

/* ---------- admin credential (scrypt hash, never the password itself) ---------- */
async function getCredential() { return getJSON("auth/credential.json"); }
async function setCredential(cred) { await putJSON("auth/credential.json", cred); }

/* ---------- health ---------- */
async function ping() {
  if (!configured()) return { ok: false, reason: "not-configured" };
  const t = Date.now();
  try { await blob.list({ limit: 1 }); return { ok: true, ms: Date.now() - t }; }
  catch (e) { return { ok: false, reason: e.message }; }
}

module.exports = {
  configured, accessMode, ping,
  readPublished, readDraft, saveDraft, discardDraft, publish, publishedVersions,
  addMessage, listMessages, updateMessage, deleteMessage,
  log, readLog,
  saveMedia, listMedia, getMedia, deleteMedia, signedMediaUrl,
  getCredential, setCredential,
  LEAD_STATUS, addLead, getLead, listLeads, updateLead, deleteLead, seenRecently, remember, readVersion,
  saveVisit, rawVisits, readDay, writeDay, analyticsIndex, readRaw,
  // low-level access for the Workspace data layer (api/_lib/ws.js)
  _raw: { getJSON, putJSON, listAll, newest, isNotFound, blob: () => blob, access: () => ACCESS }
};
