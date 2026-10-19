// Workspace data layer (private, Vercel Blob). Admin content (cms/) stays separate.
//
//   ws/<collection>/<id>.json   clients · projects · tasks · files · websites · content · portfolio · startups · certs · certtpl
//   ws/activity/<ts>-<r>.json   real events only (project created, file uploaded, Telegram sent/failed …)
//   ws/config/<name>.json       telegram destinations, youtube settings
//   ws/bot/<chatId>.json        services-bot conversation state
//   wsf/<key>                   private Workspace files (never served by /api/media)
//
// Requests are the existing leads (leads/<id>.json) — website briefs and bot requests land in the same place.
const store = require("./store");
const { getJSON, putJSON, listAll, newest } = store._raw;
const blob = () => store._raw.blob();

const COLLECTIONS = ["clients", "projects", "tasks", "files", "websites", "content", "portfolio", "startups", "certs", "certtpl"];
const ACTIVITY_KEEP = 1000;

const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const now = () => new Date().toISOString();
const okId = id => typeof id === "string" && /^[a-z0-9_-]{4,40}$/i.test(id);
const col = c => { if (!COLLECTIONS.includes(c)) throw new Error("bad collection"); return c; };

async function readMany(paths) {
  const out = [];
  for (let i = 0; i < paths.length; i += 25) out.push(...(await Promise.all(paths.slice(i, i + 25).map(p => getJSON(p).catch(() => null)))).filter(Boolean));
  return out;
}
async function list(c, limit = 2000) {
  const blobs = newest(await listAll("ws/" + col(c) + "/", limit)).slice(0, limit);
  const docs = await readMany(blobs.map(b => b.pathname));
  return docs.sort((a, b) => (b.updatedAt || b.createdAt || "").localeCompare(a.updatedAt || a.createdAt || ""));
}
async function get(c, id) { if (!okId(id)) throw new Error("bad id"); return getJSON("ws/" + col(c) + "/" + id + ".json"); }
async function put(c, doc) {
  if (!okId(doc.id)) throw new Error("bad id");
  doc.updatedAt = now();
  await putJSON("ws/" + col(c) + "/" + doc.id + ".json", doc);
  return doc;
}
async function create(c, fields) {
  const doc = Object.assign({ createdAt: now(), createdBy: "Max" }, fields, { id: newId() });
  return put(c, doc);
}
async function remove(c, id) { if (!okId(id)) throw new Error("bad id"); await blob().del("ws/" + col(c) + "/" + id + ".json"); }

/* ---------- activity (real events only) ---------- */
async function activity(type, text, ref) {
  const at = new Date();
  const doc = { at: at.toISOString(), actor: "Max", type, text: String(text).slice(0, 300) };
  if (ref) doc.ref = ref;                                     // { kind, id } → opens the record from the log
  try {
    await putJSON("ws/activity/" + String(at.getTime()).padStart(15, "0") + "-" + Math.random().toString(36).slice(2, 7) + ".json", doc, false);
    if (Math.random() < 0.04) {
      const all = newest(await listAll("ws/activity/", 5000));
      const stale = all.slice(ACTIVITY_KEEP).map(b => b.pathname);
      if (stale.length) await blob().del(stale);
    }
  } catch (e) { console.error("workspace activity write failed:", e.message); }
  return doc;
}
async function readActivity(limit = 200) {
  const blobs = newest(await listAll("ws/activity/", 5000)).slice(0, limit);
  return (await readMany(blobs.map(b => b.pathname))).sort((a, b) => b.at.localeCompare(a.at));
}

/* ---------- config ---------- */
const CONFIG = ["telegram", "youtube"];
async function getConfig(name) { if (!CONFIG.includes(name)) throw new Error("bad config"); return (await getJSON("ws/config/" + name + ".json").catch(() => null)) || {}; }
async function setConfig(name, obj) { if (!CONFIG.includes(name)) throw new Error("bad config"); obj.updatedAt = now(); await putJSON("ws/config/" + name + ".json", obj); return obj; }

/* ---------- requests (= leads) ---------- */
// Request status (V5): NEW → REVIEWING → QUALIFIED → (WAITING_FOR_CLIENT) → CONVERTED · DECLINED · ARCHIVED.
// The work after conversion (development, delivery, completed) is the project's status, not the request's.
// Kept next to the older admin status so the Control Center keeps working; older stage values map over.
const STAGES = ["new", "reviewing", "qualified", "waiting", "converted", "declined", "archived"];
const LEGACY_STAGE = { request: "new", review: "reviewing", project: "converted", development: "converted", delivery: "converted", completed: "converted" };
const stageOf = l => {
  if (l.stage) return STAGES.includes(l.stage) ? l.stage : LEGACY_STAGE[l.stage] || "new";
  return ({ new: "new", contacted: "reviewing", qualified: "qualified", proposal: "qualified", won: "converted", lost: "declined" })[l.status] || "new";
};
// project ID for the signature: UL-7K3F (requests get UL-2026-7K3F in store.addLead); no 0/O/1/I to avoid misreading
const projectCode = () => "UL-" + Array.from(require("crypto").randomBytes(4), b => "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"[b % 32]).join("");
async function saveLead(doc) { doc.updatedAt = now(); await putJSON("leads/" + doc.id + ".json", doc); return doc; }

/* ---------- bot conversation state ---------- */
async function botState(chatId) { return (await getJSON("ws/bot/" + String(chatId).replace(/[^0-9-]/g, "") + ".json").catch(() => null)) || null; }
async function setBotState(chatId, st) { await putJSON("ws/bot/" + String(chatId).replace(/[^0-9-]/g, "") + ".json", Object.assign(st, { at: now() })); }

/* ---------- private files ---------- */
const fileKeyOk = k => typeof k === "string" && /^(wsf\/wsf_|media\/med_)[a-z0-9]{8,40}\.[a-z0-9]{1,6}$/.test(k);
async function readFileBytes(key, max) {
  if (!fileKeyOk(key)) throw new Error("bad file key");
  const r = await blob().get(key, { access: store._raw.access() });
  if (!r || !r.stream) return null;
  const size = r.blob && r.blob.size;
  if (max && size && size > max) return { tooBig: true, size };
  const buf = Buffer.from(await new Response(r.stream).arrayBuffer());
  if (max && buf.length > max) return { tooBig: true, size: buf.length };
  return { buf, type: (r.blob && r.blob.contentType) || "application/octet-stream", size: buf.length };
}
async function fileStream(key) {
  if (!fileKeyOk(key)) throw new Error("bad file key");
  return blob().get(key, { access: store._raw.access() }).catch(() => null);
}
async function signedLink(key) {
  const b = blob();
  if (!fileKeyOk(key) || typeof b.issueSignedToken !== "function") return null;
  if (store._raw.access() === "public") { const h = await b.head(key); return h && h.url; }
  const until = Date.now() + 10 * 60e3;
  const tok = await b.issueSignedToken({ pathname: key, operations: ["get"], validUntil: until });
  const { presignedUrl } = await b.presignUrl(tok, { operation: "get", pathname: key, access: "private", validUntil: until });
  return presignedUrl;
}
async function saveFileBytes(key, buf, type) {
  if (!/^wsf\/wsf_[a-z0-9]{8,40}\.[a-z0-9]{1,6}$/.test(key)) throw new Error("bad file key");
  await blob().put(key, buf, { access: store._raw.access(), contentType: type, addRandomSuffix: false, allowOverwrite: false });
}
async function deleteBlob(key) { if (fileKeyOk(key) && key.startsWith("wsf/")) await blob().del(key).catch(() => {}); }

module.exports = {
  COLLECTIONS, STAGES, stageOf, projectCode, newId, now, okId,
  list, get, put, create, remove, activity, readActivity, getConfig, setConfig, saveLead,
  botState, setBotState, fileKeyOk, readFileBytes, fileStream, signedLink, saveFileBytes, deleteBlob
};
