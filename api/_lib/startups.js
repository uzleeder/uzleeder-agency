// Startups — ONE canonical record per venture, shared by the public /startups page, the Control Center and the Workspace.
//
//   ws/startups/<id>.json = {
//     id, slug, order, archived, owner, createdAt/By, updatedAt/By, rev,
//     draft:     { ...public fields }          ← edited in the Control Center (never shown publicly)
//     published: { ...public fields } | null   ← the approved copy the public page shows
//     visible:   true|false                    ← published AND not unpublished/archived
//     state:     draft | review | approved | rejected | published   (state of the draft)
//     review:    { note, by, at }               ← last review decision
//     versions:  [{ v, at, by, content }]        ← every published copy (latest 10) for restore
//     internal:  { goals, notes, opStatus, devNotes, decisions, repo, demo, docs }   ← never public
//     milestones:[{ id, title, target, status, blocker, note, doneAt }]           ← never public
//   }
// Tasks and files stay in their Workspace collections and point here with startupId (+ milestoneId).
// Workflow (enforced here, on the server):  Draft → Review → Approved → Published
//   save while in review/approved/published  → back to Draft (the live copy stays until a new publish)
//   reject needs a reason · publish needs Approved · unpublish hides it · restore copies a version into the draft
const crypto = require("crypto");
const ws = require("./ws");

const STATUS = ["exploring", "research", "prototype", "development", "beta", "launched", "paused"];
const CATEGORY = ["ai", "logistics", "edtech", "saas", "devtools", "experimental"];
const STATE = ["draft", "review", "approved", "rejected", "published"];
const OP_STATUS = ["active", "paused", "blocked"];
const MS_STATUS = ["planned", "in_progress", "blocked", "done"];
const RM_STATE = ["done", "now", "next", "later"];
const LANGS = ["en", "uz", "ru"];
const TEXTS = ["tagline", "summary", "description", "role", "stageNote", "notice", "problem", "solution", "users", "approach", "features"];
const VERSIONS_KEEP = 10;

class Bad extends Error { constructor(m, s) { super(m); this.status = s || 400; } }
const need = (c, m, s) => { if (!c) throw new Bad(m, s); };
const str = (v, max) => (typeof v === "string" ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max) : "");
const pick = (v, list, d) => (list.includes(v) ? v : d);
const slugOk = s => /^[a-z0-9][a-z0-9-]{0,48}$/.test(s || "");
const https = u => (/^https:\/\/[^\s"'<>]+$/.test(u || "") ? String(u).slice(0, 400) : "");
// links: https:// or a file on this site (e.g. /projects/pitches/deck.pdf)
const linkUrl = u => (/^https:\/\/[^\s"'<>]+$/.test(u || "") || /^\/(?!\/)[\w./-]+$/.test(u || "") ? String(u).slice(0, 400) : "");
const imageUrl = u => (/^(https:\/\/[^\s"'<>]+|\/api\/media\/[\w.-]+|\/[\w./-]+\.(png|jpe?g|webp|svg|gif))$/i.test(u || "") ? String(u).slice(0, 400) : "");
const now = () => new Date().toISOString();
const clone = o => JSON.parse(JSON.stringify(o));
const loc = (v, max) => { const o = {}; if (v && typeof v === "object") LANGS.forEach(l => { const s = str(v[l], max); if (s) o[l] = s; }); else if (typeof v === "string" && v.trim()) o.en = str(v, max); return o; };

// wordmark for the homepage card: up to 4 text parts, each coloured fg / a1 / a2 (#rrggbb only), on bg
const hex = c => (/^#[0-9a-fA-F]{6}$/.test(c || "") ? c : "");
function cleanBrand(b) {
  if (!b || typeof b !== "object") return null;
  const parts = (Array.isArray(b.parts) ? b.parts : []).map(x => Object.assign({ t: str(x && x.t, 24), c: pick(x && x.c, ["fg", "a1", "a2"], "fg") }, x && x.glue === true ? { glue: true } : {})).filter(x => x.t).slice(0, 4);
  if (!parts.length) return null;
  return { font: pick(b.font, ["site", "outfit", "grotesk", "michroma"], "site"), bg: hex(b.bg), bg2: hex(b.bg2), fg: hex(b.fg), a1: hex(b.a1), a2: hex(b.a2), eyebrow: loc(b.eyebrow, 60), parts };
}

// the public part — the only fields that can ever reach /api/startups
function cleanPublic(p) {
  p = p && typeof p === "object" ? p : {};
  const out = {
    name: str(p.name, 60), status: pick(p.status, STATUS, "exploring"), category: pick(p.category, CATEGORY, "experimental"),
    detail: p.detail === true, logo: imageUrl(p.logo), cover: imageUrl(p.cover), pitch: linkUrl(p.pitch), brand: cleanBrand(p.brand),
    tags: (Array.isArray(p.tags) ? p.tags : []).map(t => str(t, 30)).filter(Boolean).slice(0, 8),
    technologies: (Array.isArray(p.technologies) ? p.technologies : []).map(t => str(t, 40)).filter(Boolean).slice(0, 20),
    team: (Array.isArray(p.team) ? p.team : []).map(m => ({ name: str(m && m.name, 60), role: loc(m && m.role, 80) })).filter(m => m.name).slice(0, 10),
    links: (Array.isArray(p.links) ? p.links : []).map(l => ({ label: loc(l && l.label, 60), url: linkUrl(l && l.url), kind: pick(l && l.kind, ["website", "repository", "demo", "docs", "other"], "other") })).filter(l => l.url).slice(0, 8),
    roadmap: (Array.isArray(p.roadmap) ? p.roadmap : []).map(r => ({ state: pick(r && r.state, RM_STATE, "next"), title: loc(r && r.title, 120), text: loc(r && r.text, 600) })).filter(r => Object.keys(r.title).length).slice(0, 20)
  };
  TEXTS.forEach(k => { out[k] = loc(p[k], k === "tagline" || k === "role" ? 200 : 3000); });
  return out;
}
const publicView = rec => Object.assign({ slug: rec.slug, aliases: rec.aliases || [], order: rec.order || 0 }, rec.published);

function cleanInternal(p) {
  p = p && typeof p === "object" ? p : {};
  return { goals: str(p.goals, 3000), notes: str(p.notes, 6000), opStatus: pick(p.opStatus, OP_STATUS, "active"), devNotes: str(p.devNotes, 10000), decisions: str(p.decisions, 10000),
    repo: /^[\w.-]+\/[\w.-]+$/.test(p.repo || "") ? p.repo : "", demo: https(p.demo), docs: https(p.docs) };
}

/* ---------- reading ---------- */
const all = async () => (await ws.list("startups")).sort((a, b) => (a.order || 0) - (b.order || 0) || String(a.createdAt).localeCompare(String(b.createdAt)));
async function getRec(id) { need(ws.okId(id), "bad id"); const r = await ws.get("startups", id); need(r, "Startup not found", 404); return r; }
// the public list: published, visible, not archived — nothing internal
async function publicList() {
  const list = await all();
  return { initialized: list.length > 0, startups: list.filter(r => r.visible && r.published && !r.archived).map(publicView) };
}
// summary rows for management lists (Control Center / Workspace)
function row(r) {
  return { id: r.id, slug: r.slug, order: r.order || 0, name: (r.draft && r.draft.name) || (r.published && r.published.name) || r.slug, status: (r.draft || {}).status, category: (r.draft || {}).category,
    logo: (r.draft || {}).logo || "", state: r.state, visible: !!r.visible, archived: !!r.archived, hasPublished: !!r.published,
    changed: !!r.published && JSON.stringify(r.draft) !== JSON.stringify(r.published), updatedAt: r.updatedAt, updatedBy: r.updatedBy, owner: r.owner || "Max",
    publishedAt: r.publishedAt || null, opStatus: (r.internal || {}).opStatus || "active", milestones: r.milestones || [] };
}

/* ---------- writing ---------- */
async function put(r, by) { r.updatedAt = now(); r.updatedBy = by; r.rev = (r.rev || 0) + 1; return ws.put("startups", r); }
const log = (type, text, r) => ws.activity(type, text, { kind: "startup", id: r.id });
async function slugFree(slug, exceptId) { return !(await all()).some(r => r.slug === slug && r.id !== exceptId); }
function stale(r, rev) { need(rev === undefined || rev === null || +rev === (r.rev || 0), "Someone saved this startup after you opened it. Reload, then make your change again.", 409); }

async function create(p, by) {
  const draft = cleanPublic(p);
  need(draft.name, "A startup needs a name.");
  const slug = str(p.slug, 49).toLowerCase() || draft.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 49);
  need(slugOk(slug), "The page address may contain lowercase letters, numbers and dashes.");
  need(await slugFree(slug), "Another startup already uses /startups/" + slug + ".", 409);
  const order = (await all()).reduce((m, r) => Math.max(m, r.order || 0), 0) + 1;
  const r = await ws.create("startups", { slug, order, archived: false, owner: by, createdBy: by, draft, published: null, visible: false, state: "draft", review: null, versions: [], internal: cleanInternal({}), milestones: [], rev: 0 });
  await log("startup.created", "Startup created: " + draft.name + " (draft — not public)", r);
  return r;
}
async function saveDraft(id, p, by) {
  const r = await getRec(id); stale(r, p.rev);
  const draft = cleanPublic(p.draft);
  need(draft.name, "A startup needs a name.");
  if (p.slug !== undefined && p.slug !== r.slug) {
    const slug = str(p.slug, 49).toLowerCase();
    need(slugOk(slug), "The page address may contain lowercase letters, numbers and dashes.");
    need(await slugFree(slug, r.id), "Another startup already uses /startups/" + slug + ".", 409);
    need(!r.visible, "Unpublish the startup before changing its public address.");
    r.slug = slug;
  }
  const stageChanged = r.draft && r.draft.status !== draft.status;
  const before = JSON.stringify(r.draft);
  r.draft = draft;
  if (before !== JSON.stringify(draft) && r.state !== "draft") r.state = "draft";      // edited → needs review again; the live copy stays
  await put(r, by);
  await log("startup.edited", "Draft edited: " + draft.name + (stageChanged ? " · stage → " + draft.status : ""), r);
  return r;
}
async function transition(id, action, p, by) {
  const r = await getRec(id); stale(r, p.rev);
  const name = r.draft.name;
  if (action === "submit") {
    need(["draft", "rejected"].includes(r.state), "Only a draft can be submitted for review.");
    need(r.draft.name && (r.draft.tagline.en || r.draft.summary.en), "Add at least a name and an English one-line or short description before review.");
    r.state = "review"; r.review = null;
    await put(r, by); await log("startup.submitted", "Submitted for review: " + name, r);
  } else if (action === "approve") {
    need(r.state === "review", "Only content in review can be approved.");
    r.state = "approved"; r.review = { decision: "approved", note: str(p.note, 1000), by, at: now() };
    await put(r, by); await log("startup.approved", "Approved: " + name, r);
  } else if (action === "reject") {
    need(r.state === "review", "Only content in review can be rejected.");
    const note = str(p.note, 1000); need(note.length >= 3, "Write why the changes are rejected.");
    r.state = "rejected"; r.review = { decision: "rejected", note, by, at: now() };
    await put(r, by); await log("startup.rejected", "Changes rejected: " + name + " — " + note, r);
  } else if (action === "toDraft") {
    need(["review", "approved", "rejected"].includes(r.state), "Already a draft.");
    r.state = "draft"; await put(r, by); await log("startup.to_draft", "Returned to draft: " + name, r);
  } else if (action === "publish") {
    need(p.confirm === true, "Confirm publishing first.");
    need(!r.archived, "Restore the startup from the archive before publishing.");
    const republish = r.state === "published" && r.published && !r.visible && JSON.stringify(r.draft) === JSON.stringify(r.published);
    need(r.state === "approved" || republish, "Only approved content can be published. Submit it for review and approve it first.");
    r.published = clone(r.draft); r.visible = true; r.state = "published"; r.publishedAt = now(); r.publishedBy = by;
    const v = (r.versions.length ? r.versions[r.versions.length - 1].v : 0) + 1;
    r.versions = r.versions.concat({ v, at: r.publishedAt, by, content: clone(r.published) }).slice(-VERSIONS_KEEP);
    await put(r, by); await log("startup.published", "Published: " + name + " (version " + v + ") — visible on /startups", r);
  } else if (action === "unpublish") {
    need(p.confirm === true, "Confirm first.");
    need(r.visible, "It is not public.");
    r.visible = false; await put(r, by); await log("startup.unpublished", "Unpublished: " + name + " — removed from /startups", r);
  } else if (action === "restore") {
    const ver = (r.versions || []).find(x => x.v === +p.v); need(ver, "Version not found", 404);
    r.draft = clone(ver.content); r.state = "draft";
    await put(r, by); await log("startup.restored", "Version " + ver.v + " copied into the draft of " + name + " (review and publish to make it live)", r);
  } else if (action === "archive") {
    need(p.confirm === true, "Confirm first.");
    r.archived = p.archived !== false; if (r.archived) r.visible = false;
    await put(r, by); await log(r.archived ? "startup.archived" : "startup.unarchived", (r.archived ? "Archived (hidden, history kept): " : "Restored from the archive: ") + name, r);
  } else throw new Bad("Unknown action");
  return r;
}
async function remove(id, confirm, by) {
  const r = await getRec(id);
  need(r.archived, "Archive the startup first — only archived startups can be deleted.");
  need(confirm === r.slug, "Type the page address (" + r.slug + ") to confirm deletion.");
  // unlink operational records; their history stays
  for (const t of (await ws.list("tasks")).filter(x => x.startupId === r.id)) { t.startupId = ""; t.milestoneId = ""; await ws.put("tasks", t); }
  for (const f of (await ws.list("files")).filter(x => x.startupId === r.id)) { f.startupId = ""; await ws.put("files", f); }
  await ws.remove("startups", r.id);
  await ws.activity("startup.deleted", "Startup deleted: " + (r.draft.name || r.slug) + " by " + by);
}
async function reorder(id, dir, by) {
  const list = await all(); const i = list.findIndex(r => r.id === id); need(i >= 0, "Startup not found", 404);
  const j = i + (dir < 0 ? -1 : 1); if (j < 0 || j >= list.length) return list;
  [list[i], list[j]] = [list[j], list[i]];
  for (let k = 0; k < list.length; k++) if (list[k].order !== k + 1) { list[k].order = k + 1; await ws.put("startups", list[k]); }
  await log("startup.reordered", "Display order changed: " + (list[j].draft.name || list[j].slug), list[j]);
  return list;
}
async function saveInternal(id, p, by) {
  const r = await getRec(id);
  const before = (r.internal || {}).opStatus;
  r.internal = cleanInternal(Object.assign({}, r.internal, p.internal));
  await put(r, by);
  await log("startup.internal", "Internal notes updated: " + r.draft.name + (before !== r.internal.opStatus ? " · status → " + r.internal.opStatus : ""), r);
  return r;
}
async function saveMilestone(id, p, by) {
  const r = await getRec(id);
  const fields = { title: str(p.title, 140), target: /^\d{4}-\d{2}-\d{2}$/.test(p.target || "") ? p.target : "", status: pick(p.status, MS_STATUS, "planned"), blocker: str(p.blocker, 500), note: str(p.note, 2000) };
  need(fields.title, "A milestone needs a title.");
  let m = p.milestoneId ? (r.milestones || []).find(x => x.id === p.milestoneId) : null;
  if (p.milestoneId) need(m, "Milestone not found", 404);
  const before = m ? m.status : null;
  if (m) Object.assign(m, fields); else { m = Object.assign({ id: crypto.randomBytes(5).toString("hex"), createdAt: now() }, fields); r.milestones = (r.milestones || []).concat(m); }
  if (m.status === "done" && !m.doneAt) m.doneAt = now(); if (m.status !== "done") delete m.doneAt;
  await put(r, by);
  await log("startup.milestone", (before ? "Milestone " + m.title + ": " + before + " → " + m.status : "Milestone added: " + m.title) + " (" + r.draft.name + ")", r);
  return r;
}
async function deleteMilestone(id, milestoneId, by) {
  const r = await getRec(id);
  const m = (r.milestones || []).find(x => x.id === milestoneId); need(m, "Milestone not found", 404);
  r.milestones = r.milestones.filter(x => x.id !== milestoneId);
  for (const t of (await ws.list("tasks")).filter(x => x.milestoneId === milestoneId)) { t.milestoneId = ""; await ws.put("tasks", t); }
  await put(r, by); await log("startup.milestone_deleted", "Milestone removed: " + m.title + " (" + r.draft.name + ")", r);
  return r;
}
// first start: the ventures that are live today become canonical records, already published (they are public right now)
async function importInitial(seed, by) {
  need(!(await all()).length, "Startups already exist — nothing was imported.", 409);
  const out = [];
  let order = 0;
  for (const s of seed) {
    const draft = cleanPublic(s);
    if (!draft.name || !slugOk(s.slug) || s.archived) continue;
    const at = now();
    const r = await ws.create("startups", { slug: s.slug, aliases: (Array.isArray(s.aliases) ? s.aliases : []).filter(slugOk), order: ++order, archived: false, owner: by, createdBy: by, draft, published: clone(draft), visible: true, state: "published",
      review: { decision: "approved", note: "Imported from the live /startups page", by, at }, publishedAt: at, publishedBy: by, versions: [{ v: 1, at, by, content: clone(draft) }], internal: cleanInternal({}), milestones: [], rev: 0 });
    await log("startup.imported", "Imported from the live page (already public): " + draft.name, r);
    out.push(r);
  }
  return out;
}

module.exports = { Bad, STATUS, CATEGORY, STATE, OP_STATUS, MS_STATUS, cleanPublic, publicView, publicList, all, getRec, row, create, saveDraft, transition, remove, reorder, saveInternal, saveMilestone, deleteMilestone, importInitial };
