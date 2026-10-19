// POST /api/workspace — the private UzLeeder Workspace (separate from the Control Center at /admin).
// Every action needs the owner's session token; everything is checked here on the server.
// Body: { action: "<area>.<verb>", ...params }
const crypto = require("crypto");
const { json, body, onlyPost } = require("./_lib/http");
const auth = require("./_lib/auth");
const store = require("./_lib/store");
const ws = require("./_lib/ws");
const tg = require("./_lib/tg");
const { gh, vc, yt } = require("./_lib/integrations");
const su = require("./_lib/startups");
const certs = require("./_lib/certs");

const str = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const pick = (v, list, dflt) => (list.includes(v) ? v : dflt);
const sha = s => crypto.createHash("sha256").update(String(s)).digest("hex").slice(0, 40);
const sleep = ms => new Promise(r => setTimeout(r, ms));
class Bad extends Error { constructor(m, s) { super(m); this.status = s || 400; } }
const need = (cond, msg, status) => { if (!cond) throw new Bad(msg, status); };

const PROJECT_STATUS = ["PLANNING", "ACTIVE", "IN_REVIEW", "WAITING_FOR_CLIENT", "READY_FOR_DELIVERY", "COMPLETED", "ARCHIVED"];
const PROJECT_KIND = ["client", "product", "demo", "internal"];      // decides the signature: COMPLETED · READY FOR DEPLOYMENT · DEMONSTRATION
const TASK_STATUS = ["todo", "in_progress", "review", "done"];
const taskStatus = s => (s === "doing" ? "in_progress" : TASK_STATUS.includes(s) ? s : "todo");   // "doing" = pre-V5 records
const SERVICES = ["website", "system", "ai", "academy", "design", "existing", "other"];
const FOLDERS = ["projects", "brand", "media", "documents", "development", "deliverables"];
const FILE_STATUS = ["draft", "in_review", "approved", "final"];
const WEBSITE_ENV = ["production", "staging", "development"];
const DEFAULT_CHANNELS = ["@uzleeder", "@ai_leeder", "@leecodes", "@maxscode", "@kodyoz"];
const CEO_PROFILE = "@agi_leeder";
const FILE_TYPES = /^(image\/|video\/|audio\/|text\/|application\/(pdf|json|zip|x-zip-compressed|msword|vnd\.openxmlformats-officedocument\.[\w.]+|vnd\.ms-[\w.-]+|octet-stream|javascript|xml))/;

/* ---------------- requests (leads) ---------------- */
const requestView = l => ({
  id: l.id, code: l.code || "", createdAt: l.createdAt, updatedAt: l.updatedAt, stage: ws.stageOf(l), status: l.status, name: l.name, contact: l.contact,
  channel: l.channel, service: l.service, budget: l.budget, timeline: l.timeline, message: l.message, lang: l.lang,
  source: l.source || "website", notes: l.notes || "", projectId: l.projectId || null, clientId: l.clientId || null,
  attachments: l.attachments || [], thread: l.thread || [], canReply: !!(l.tg && l.tg.chatId)
});
async function getRequest(id) { need(ws.okId(id), "bad id"); const l = await store.getLead(id); need(l, "Request not found", 404); return l; }

/* ---------------- Telegram destinations ---------------- */
async function tgConfig() {
  const cfg = await ws.getConfig("telegram");
  if (!Array.isArray(cfg.destinations)) cfg.destinations = DEFAULT_CHANNELS.map(handle => ({ handle }));
  return cfg;
}

/* ---------------- content publishing ---------------- */
const LOCK_MS = 3 * 60e3;
function summarize(doc) {
  const dests = (doc.destinations || []).concat(doc.youtube && doc.youtube.channelId ? ["yt:" + doc.youtube.channelId] : []);
  const st = dests.map(h => ((doc.pubs || {})[h] || {}).state || "not_sent");
  const n = s => st.filter(x => x === s).length;
  doc.delivery = { total: dests.length, sent: n("sent"), failed: n("failed"), unknown: n("unknown"), sending: n("sending"), notSent: n("not_sent"), cancelled: n("cancelled") };
  const d = doc.delivery;
  // DRAFT → READY → PUBLISHING → PUBLISHED | PARTIAL (some destinations failed) | FAILED; ARCHIVED hides it from the active list
  const touched = d.sent + d.failed + d.unknown + d.sending > 0;
  doc.status = doc.archived ? "archived"
    : !d.total || !touched ? (doc.ready ? "ready" : "draft")
    : d.sending ? "publishing" : d.sent === d.total ? "published" : d.sent ? "partial" : "failed";
  return doc;
}
function publicLink(handle, chat, messageId) {
  const u = chat && chat.username ? chat.username : /^@/.test(handle) ? handle.slice(1) : "";
  return u && messageId ? "https://t.me/" + u + "/" + messageId : "";
}
function validatePost(doc) {
  const text = String(doc.text || "");
  if (doc.media && doc.media.key) need(text.length <= tg.CAPTION_MAX, "With a photo, video or file Telegram allows at most " + tg.CAPTION_MAX + " characters of text (now " + text.length + ").");
  else { need(text.trim().length > 0, "Write the text of the post first."); need(text.length <= tg.TEXT_MAX, "Telegram allows at most " + tg.TEXT_MAX + " characters per message (now " + text.length + ")."); }
}

async function sendTelegram(p) {
  need(p.confirm === true, "Confirm the send first.");
  const idem = str(p.idem, 64);
  need(/^[a-z0-9-]{8,64}$/i.test(idem), "Missing send id");
  let doc = await ws.get("content", str(p.id, 40));
  need(doc, "Content not found", 404);
  // the same click (same idempotency key) never sends twice — also when the browser retries the request
  const dk = "ws-send-" + sha(doc.id + ":" + idem);
  if (await store.seenRecently(dk, 7 * 864e5)) return { ok: true, duplicate: true, content: summarize(doc) };
  await store.remember(dk, { id: doc.id });

  need(!doc.archived, "This content is archived. Restore it before sending.");
  validatePost(doc);
  need(tg.configured("publish"), "Integration required: TELEGRAM_BOT_TOKEN is not configured on the server.");
  const cfg = await tgConfig();
  const known = new Map(cfg.destinations.map(d => [d.handle, d]));
  const pubs = doc.pubs = doc.pubs || {};
  const forced = Array.isArray(p.force) ? p.force.filter(h => typeof h === "string") : [];
  const t = Date.now();
  // in-flight sends that never reported back become "unknown" — only an explicit, confirmed resend touches them
  (doc.destinations || []).forEach(h => { const x = pubs[h]; if (x && x.state === "sending" && t - Date.parse(x.lockAt || 0) > LOCK_MS) Object.assign(x, { state: "unknown", error: "No confirmation from Telegram was stored. Check the channel before resending." }); });
  const only = Array.isArray(p.only) ? p.only : null;       // "Retry failed" passes the failed handles only
  const targets = (doc.destinations || []).filter(h => {
    if (!tg.HANDLE.test(h) || !known.has(h)) return false;
    if (only && !only.includes(h)) return false;
    const st = (pubs[h] || {}).state || "not_sent";
    if (st === "sent" || st === "sending") return false;     // never resend what Telegram confirmed / what is in flight
    if (st === "unknown") return forced.includes(h);
    return true;                                              // not_sent · failed · cancelled
  });
  if (!targets.length) return { ok: true, nothing: true, content: summarize(doc) };

  const lock = crypto.randomBytes(6).toString("hex");
  targets.forEach(h => { pubs[h] = Object.assign({}, pubs[h], { state: "sending", lock, lockAt: new Date().toISOString(), error: null }); });
  await ws.put("content", summarize(doc));
  // a parallel request may have taken the same destinations — keep only the ones this request locked
  const fresh = await ws.get("content", doc.id);
  const mine = targets.filter(h => ((fresh.pubs || {})[h] || {}).lock === lock);
  doc = fresh;

  let mediaFile = null, mediaError = null;
  if (doc.media && doc.media.key) {
    const f = await ws.readFileBytes(doc.media.key, tg.UPLOAD_MAX).catch(e => ({ err: e.message }));
    if (!f || f.err) mediaError = "The attached file could not be read from storage.";
    else if (f.tooBig) mediaError = "The file is " + Math.round(f.size / 1048576) + " MB — the Telegram Bot API accepts at most 50 MB.";
    else mediaFile = f;
  }
  for (let i = 0; i < mine.length; i++) {
    const h = mine[i], dest = known.get(h), prev = doc.pubs[h] || {};
    const r = mediaError ? { ok: false, error: mediaError } : await tg.sendPost(dest.chatId || h, doc, mediaFile);
    const at = new Date().toISOString();
    doc.pubs[h] = r.ok
      ? { state: "sent", messageId: r.result.message_id, chatId: r.result.chat && r.result.chat.id, link: publicLink(h, r.result.chat, r.result.message_id), at, attempts: (prev.attempts || 0) + 1 }
      : { state: "failed", error: r.error + (r.retryAfter ? " (retry after " + r.retryAfter + " s)" : ""), code: r.code, at, attempts: (prev.attempts || 0) + 1 };
    doc.history = (doc.history || []).concat({ at, dest: h, result: doc.pubs[h].state, messageId: doc.pubs[h].messageId, error: doc.pubs[h].error }).slice(-200);
    await ws.put("content", summarize(doc));
    await ws.activity(r.ok ? "telegram.sent" : "telegram.failed", (r.ok ? "Telegram sent to " : "Telegram failed for ") + h + (r.ok ? " (message " + r.result.message_id + ")" : ": " + doc.pubs[h].error), { kind: "content", id: doc.id });
    if (i < mine.length - 1) await sleep(350);                // stay well under Telegram's rate limits
  }
  return { ok: true, content: summarize(doc) };
}

/* ---------------- search ---------------- */
function matches(obj, q, fields) { return fields.some(f => String(obj[f] || "").toLowerCase().includes(q)); }

/* ---------------- actions ---------------- */
const A = {};

A["overview"] = async p => {
  const [leads, projects, tasks, files, content, activity, portfolio] = await Promise.all([
    store.listLeads(500), ws.list("projects"), ws.list("tasks"), ws.list("files"), ws.list("content"), ws.readActivity(12), ws.list("portfolio")
  ]);
  const reqs = leads.map(requestView);
  // "today" in Max's own time zone (the browser sends it), so "due today" matches his calendar
  const today = /^\d{4}-\d{2}-\d{2}$/.test(p.today || "") ? p.today : new Date().toISOString().slice(0, 10);
  let deployments = { configured: vc.configured() };
  if (vc.configured()) { const r = await vc.list(); deployments = r.ok ? { configured: true, latest: r.data.deployments.slice(0, 5), failed: r.data.deployments.filter(d => d.state === "failed").length } : { configured: true, error: r.error }; }
  content.forEach(summarize);
  const openTasks = tasks.filter(t => taskStatus(t.status) !== "done");
  const title = c => c.title || String(c.text || "").slice(0, 60);
  const failures = content.filter(c => ["partial", "failed"].includes(c.status) || c.delivery.unknown);
  return {
    requests: { new: reqs.filter(r => r.stage === "new").length, open: reqs.filter(r => ["new", "reviewing"].includes(r.stage)).length, latest: reqs.filter(r => ["new", "reviewing", "qualified", "waiting"].includes(r.stage)).slice(0, 6) },
    projects: { active: projects.filter(p => !["COMPLETED", "ARCHIVED"].includes(p.status)).map(p => ({ id: p.id, name: p.name, status: p.status, due: p.due })).slice(0, 8), total: projects.length },
    tasks: { open: openTasks.length, due: openTasks.filter(t => t.due && t.due <= today).length, overdue: openTasks.filter(t => t.due && t.due < today).map(t => ({ id: t.id, title: t.title, due: t.due, projectId: t.projectId })).slice(0, 8) },
    files: { total: files.length, attention: files.filter(f => f.attention || f.status === "in_review").map(f => ({ id: f.id, name: f.name, note: f.attention || "In review" })).slice(0, 8) },
    content: {
      drafts: content.filter(c => c.status === "draft").map(c => ({ id: c.id, title: title(c) })).slice(0, 6),
      ready: content.filter(c => c.status === "ready").map(c => ({ id: c.id, title: title(c) })).slice(0, 6),
      failures: failures.map(c => ({ id: c.id, title: title(c), delivery: c.delivery })).slice(0, 6)
    },
    portfolio: { waiting: portfolio.filter(x => x.state !== "sent").length },
    failedOps: failures.length + (deployments.failed || 0),
    deployments, activity,
    integrations: { telegram: tg.configured("publish"), github: gh.configured(), vercel: vc.configured(), youtube: yt.configured(), storage: store.configured() }
  };
};
// real connection checks: connected · not_configured · expired (credentials refused) · error — never assumed
const intState = (configured, r) => !configured ? { state: "not_configured" }
  : r.ok ? { state: "connected" }
  : { state: [401, 403].includes(r.status || r.code) || /refresh token|unauthori[sz]ed|invalid.*token/i.test(r.error || "") ? "expired" : "error", error: r.error || "Unknown error" };
A["integrations.check"] = async () => {
  const [t, s, g, v, y] = await Promise.all([
    tg.configured("publish") ? tg.me("publish") : null,
    tg.configured("services") ? tg.me("services") : null,
    gh.configured() ? gh.repos() : null,
    vc.configured() ? vc.list() : null,
    yt.configured() ? yt.channels() : null
  ]);
  return { integrations: {
    storage: { state: store.configured() ? "connected" : "not_configured" },
    telegram: Object.assign(intState(tg.configured("publish"), t || {}), t && t.ok ? { detail: "@" + t.result.username } : {}),
    servicesBot: Object.assign(intState(tg.configured("services"), s || {}), s && s.ok ? { detail: "@" + s.result.username } : {}),
    github: intState(gh.configured(), g || {}),
    vercel: intState(vc.configured(), v || {}),
    youtube: Object.assign(intState(yt.configured(), y || {}), y && y.ok ? { detail: y.data.length + " channel(s)" } : {})
  }, checkedAt: new Date().toISOString() };
};

/* requests */
A["requests.list"] = async () => ({ requests: (await store.listLeads(1000)).map(requestView) });
A["requests.create"] = async p => {
  const name = str(p.name, 120), message = str(p.message, 4000);
  need(name && message, "Name and description are required.");
  const l = await store.addLead({ name, contact: str(p.contact, 200), channel: pick(p.channel, ["telegram", "whatsapp", "email", "phone", "other"], "other"), service: pick(p.service, SERVICES, "other"), message, source: "workspace", stage: "new", lang: str(p.lang, 5), budget: str(p.budget, 60), timeline: str(p.timeline, 60) });
  await ws.activity("request.created", "Request " + l.code + " added manually: " + name, { kind: "request", id: l.id });
  return { request: requestView(l) };
};
A["requests.update"] = async p => {
  const l = await getRequest(p.id);
  if (p.stage !== undefined) {
    need(ws.STAGES.includes(p.stage), "bad stage");
    need(p.stage !== "converted" || l.projectId, "A request becomes CONVERTED by creating its project.");
    if (ws.stageOf(l) !== p.stage) await ws.activity("request.stage", "Request " + (l.code || l.name || l.id) + " → " + p.stage.toUpperCase(), { kind: "request", id: l.id });
    l.stage = p.stage;
  }
  if (typeof p.notes === "string") l.notes = p.notes.slice(0, 4000);
  return { request: requestView(await ws.saveLead(l)) };
};
A["requests.convert"] = async p => {
  const l = await getRequest(p.id);
  if (l.projectId) { const ex = await ws.get("projects", l.projectId); if (ex) return { project: ex, request: requestView(l), existing: true }; }
  // reuse a client with the same contact, otherwise create one from the request
  const clients = await ws.list("clients");
  let client = l.contact ? clients.find(c => c.contact && c.contact.toLowerCase() === String(l.contact).toLowerCase()) : null;
  if (!client) { client = await ws.create("clients", { name: l.name || "Client", contact: l.contact || "", channel: l.channel || "", notes: "", fromRequest: l.id }); await ws.activity("client.created", "Client created: " + client.name, { kind: "client", id: client.id }); }
  const project = await ws.create("projects", { name: str(p.name, 140) || (l.name ? l.name + " — " : "") + ({ website: "Website", system: "Business system", ai: "AI system", academy: "Academy", design: "Design", existing: "Existing project" }[l.service] || "Project"), status: "PLANNING", kind: "client", code: ws.projectCode(), clientId: client.id, requestId: l.id, service: l.service || "", summary: String(l.message || "").slice(0, 2000), due: "", links: [] });
  Object.assign(l, { stage: "converted", projectId: project.id, clientId: client.id });
  await ws.saveLead(l);
  await ws.activity("project.created", "Project created from request: " + project.name, { kind: "project", id: project.id });
  return { project, request: requestView(l) };
};
A["requests.reply"] = async p => {
  const l = await getRequest(p.id);
  need(l.tg && l.tg.chatId, "This request did not come through the Telegram bot.");
  const text = str(p.text, 4000); need(text, "Write a reply first.");
  const idem = str(p.idem, 64); need(/^[a-z0-9-]{8,64}$/i.test(idem), "Missing send id");
  const dk = "ws-reply-" + sha(l.id + ":" + idem);
  if (await store.seenRecently(dk, 864e5)) return { request: requestView(l), duplicate: true };
  await store.remember(dk, { id: l.id });
  const r = await tg.call("services", "sendMessage", { chat_id: l.tg.chatId, text });
  l.thread = (l.thread || []).concat({ at: new Date().toISOString(), dir: "out", text, ok: r.ok, messageId: r.ok ? r.result.message_id : undefined, error: r.ok ? undefined : r.error }).slice(-100);
  await ws.saveLead(l);
  await ws.activity(r.ok ? "request.replied" : "request.reply_failed", (r.ok ? "Replied to " : "Reply failed to ") + (l.name || "customer") + " via the services bot", { kind: "request", id: l.id });
  if (!r.ok) throw new Bad("Telegram did not deliver the reply: " + r.error, 502);
  return { request: requestView(l) };
};
A["requests.attachment"] = async (p, res) => {
  const l = await getRequest(p.id);
  const a = (l.attachments || []).find(x => x.fileId === p.fileId);
  need(a, "Attachment not found", 404);
  const f = await tg.downloadFile("services", a.fileId);
  need(f.ok, f.error || "Download failed", 502);
  res.statusCode = 200;
  res.setHeader("Content-Type", a.mime || f.type);
  res.setHeader("Content-Disposition", 'attachment; filename="' + String(a.name || f.name).replace(/[^\w.\- ]/g, "_") + '"');
  res.setHeader("Cache-Control", "no-store");
  res.end(f.buf);
  return undefined;
};

/* generic records: clients · projects · tasks · websites */
const SHAPE = {
  clients: p => ({ name: str(p.name, 140), contact: str(p.contact, 200), channel: str(p.channel, 30), company: str(p.company, 140), notes: str(p.notes, 4000) }),
  projects: p => ({ name: str(p.name, 140), status: pick(p.status, PROJECT_STATUS, "PLANNING"), kind: pick(p.kind, PROJECT_KIND, p.clientId ? "client" : "internal"), clientId: str(p.clientId, 40), service: str(p.service, 30), summary: str(p.summary, 4000), due: /^\d{4}-\d{2}-\d{2}$/.test(p.due || "") ? p.due : "", repo: /^[\w.-]+\/[\w.-]+$/.test(p.repo || "") ? p.repo : "", websiteId: str(p.websiteId, 40) }),
  tasks: p => ({ title: str(p.title, 200), status: taskStatus(p.status), projectId: str(p.projectId, 40), startupId: p.startupId === undefined ? undefined : ws.okId(p.startupId) ? p.startupId : "", milestoneId: p.milestoneId === undefined ? undefined : /^[a-f0-9]{10}$/.test(p.milestoneId || "") ? p.milestoneId : "", assignee: p.assignee === undefined ? undefined : str(p.assignee, 60), due: /^\d{4}-\d{2}-\d{2}$/.test(p.due || "") ? p.due : "", priority: pick(p.priority, ["low", "normal", "high"], "normal"), notes: str(p.notes, 4000) }),
  websites: p => ({ name: str(p.name, 140), url: /^https:\/\/[^\s"'<>]+$/.test(p.url || "") ? p.url.slice(0, 300) : "", env: pick(p.env, WEBSITE_ENV, "production"), projectId: str(p.projectId, 40), hosting: str(p.hosting, 60), notes: str(p.notes, 2000) })
};
// read-side normalisation of records written before V5
const NORMALIZE = { tasks: t => Object.assign(t, { status: taskStatus(t.status) }), projects: p => Object.assign(p, { kind: p.kind || (p.clientId ? "client" : "internal") }) };
const REQUIRED = { clients: "name", projects: "name", tasks: "title", websites: "url" };
const LABEL = { clients: "Client", projects: "Project", tasks: "Task", websites: "Website" };
for (const c of Object.keys(SHAPE)) {
  A[c + ".list"] = async () => ({ [c]: (await ws.list(c)).map(NORMALIZE[c] || (x => x)) });
  A[c + ".save"] = async p => {
    const fields = SHAPE[c](p);
    Object.keys(fields).forEach(k => { if (fields[k] === undefined) delete fields[k]; });   // a form that does not send a link keeps it
    need(fields[REQUIRED[c]], LABEL[c] + ": " + REQUIRED[c] + " is required" + (c === "websites" ? " (https://…)" : "") + ".");
    if (p.id) {
      const doc = await ws.get(c, p.id); need(doc, "Not found", 404);
      const before = c === "tasks" ? taskStatus(doc.status) : doc.status;
      Object.assign(doc, fields);
      if (c === "projects" && !doc.code) doc.code = ws.projectCode();
      await ws.put(c, doc);
      if (c === "projects" && before !== doc.status) await ws.activity("project.status", doc.name + ": " + before + " → " + doc.status, { kind: "project", id: doc.id });
      if (c === "tasks" && before !== doc.status) await ws.activity(doc.status === "done" ? "task.done" : "task.status", (doc.status === "done" ? "Task done: " : "Task " + doc.status.replace("_", " ") + ": ") + doc.title, { kind: "task", id: doc.id });
      return { item: doc };
    }
    const doc = await ws.create(c, c === "projects" ? Object.assign(fields, { code: ws.projectCode() }) : fields);
    await ws.activity(c.slice(0, -1) + ".created", LABEL[c] + " created: " + (doc.name || doc.title || doc.url), { kind: c.slice(0, -1), id: doc.id });
    return { item: doc };
  };
  A[c + ".delete"] = async p => {
    const doc = await ws.get(c, p.id); need(doc, "Not found", 404);
    need(p.confirm === true, "Confirmation required");
    await ws.remove(c, doc.id);
    await ws.activity(c.slice(0, -1) + ".deleted", LABEL[c] + " deleted: " + (doc.name || doc.title || doc.url));
    return {};
  };
}
A["projects.get"] = async p => {
  const project = await ws.get("projects", p.id); need(project, "Project not found", 404);
  NORMALIZE.projects(project);
  const [tasks, files, content, activity, websites, portfolio] = await Promise.all([ws.list("tasks"), ws.list("files"), ws.list("content"), ws.readActivity(300), ws.list("websites"), ws.list("portfolio")]);
  const client = project.clientId ? await ws.get("clients", project.clientId).catch(() => null) : null;
  return {
    project, client,
    portfolio: portfolio.find(x => x.projectId === project.id) || null,
    tasks: tasks.filter(t => t.projectId === project.id).map(NORMALIZE.tasks),
    files: files.filter(f => f.projectId === project.id),
    content: content.filter(c => c.projectId === project.id).map(summarize),
    websites: websites.filter(w => w.projectId === project.id || w.id === project.websiteId),
    activity: activity.filter(a => a.ref && a.ref.id === project.id).slice(0, 40)
  };
};
// real reachability check of a website (status code + response time), stored on the record
A["websites.check"] = async p => {
  const doc = await ws.get("websites", p.id); need(doc, "Not found", 404);
  const t = Date.now();
  let result;
  try {
    const ctl = new AbortController(); const timer = setTimeout(() => ctl.abort(), 10000);
    const r = await fetch(doc.url, { method: "GET", redirect: "follow", signal: ctl.signal, headers: { "User-Agent": "uzleeder-workspace-check" } });
    clearTimeout(timer);
    result = { at: new Date().toISOString(), status: r.status, ok: r.ok, ms: Date.now() - t };
  } catch (e) { result = { at: new Date().toISOString(), ok: false, error: e.name === "AbortError" ? "Timed out after 10 s" : e.message, ms: Date.now() - t }; }
  doc.lastCheck = result;
  await ws.put("websites", doc);
  return { item: doc };
};

/* files with versions */
const fileView = f => f;
async function getFileDoc(id) { const f = await ws.get("files", id); need(f, "File not found", 404); return f; }
function versionFrom(p, n) {
  need(ws.fileKeyOk(p.key), "Upload the file first.");
  return { v: n, key: p.key, size: Math.max(0, +p.size || 0), type: FILE_TYPES.test(p.type || "") ? p.type : "application/octet-stream", at: new Date().toISOString(), by: "Max", note: str(p.note, 300) };
}
A["files.list"] = async () => ({ files: (await ws.list("files")).map(fileView) });
A["files.create"] = async p => {
  const name = str(p.name, 200); need(name, "File name is required.");
  const doc = await ws.create("files", { name, folder: pick(p.folder, FOLDERS, "documents"), status: "draft", projectId: str(p.projectId, 40), startupId: ws.okId(p.startupId) ? p.startupId : "", milestoneId: /^[a-f0-9]{10}$/.test(p.milestoneId || "") ? p.milestoneId : "", tags: [], attention: "", versions: [versionFrom(p, 1)], current: 1 });
  await ws.activity("file.uploaded", "File uploaded: " + name, { kind: "file", id: doc.id });
  return { file: doc };
};
A["files.version"] = async p => {
  const doc = await getFileDoc(p.id);
  const n = Math.max(...doc.versions.map(v => v.v)) + 1;
  doc.versions.push(versionFrom(p, n)); doc.current = n;
  await ws.put("files", doc);
  await ws.activity("file.version", "New version v" + n + " of " + doc.name, { kind: "file", id: doc.id });
  return { file: doc };
};
// restoring never deletes history: the old version becomes a new current version
A["files.restore"] = async p => {
  const doc = await getFileDoc(p.id);
  const old = doc.versions.find(v => v.v === +p.v); need(old, "Version not found", 404);
  const n = Math.max(...doc.versions.map(v => v.v)) + 1;
  doc.versions.push(Object.assign({}, old, { v: n, at: new Date().toISOString(), by: "Max", note: "Restored from v" + old.v })); doc.current = n;
  await ws.put("files", doc);
  await ws.activity("file.restored", doc.name + ": v" + old.v + " restored as v" + n, { kind: "file", id: doc.id });
  return { file: doc };
};
A["files.update"] = async p => {
  const doc = await getFileDoc(p.id);
  const changes = [];
  if (p.name !== undefined) { const n = str(p.name, 200); need(n, "Name cannot be empty."); if (n !== doc.name) changes.push("renamed to " + n); doc.name = n; }
  if (p.folder !== undefined) { const f = pick(p.folder, FOLDERS, doc.folder); if (f !== doc.folder) changes.push("moved to " + f); doc.folder = f; }
  if (p.projectId !== undefined) { doc.projectId = str(p.projectId, 40); changes.push(doc.projectId ? "linked to a project" : "unlinked from project"); }
  if (p.startupId !== undefined) { doc.startupId = ws.okId(p.startupId) ? p.startupId : ""; changes.push(doc.startupId ? "linked to a startup" : "unlinked from startup"); }
  if (p.status !== undefined) { const s = pick(p.status, FILE_STATUS, doc.status || "draft"); if (s !== (doc.status || "draft")) changes.push("status " + s.replace("_", " ")); doc.status = s; }
  if (p.attention !== undefined) doc.attention = str(p.attention, 200);
  if (p.description !== undefined) doc.description = str(p.description, 2000);
  await ws.put("files", doc);
  if (changes.length) await ws.activity("file.updated", doc.name + ": " + changes.join(", "), { kind: "file", id: doc.id });
  return { file: doc };
};
A["files.delete"] = async p => {
  const doc = await getFileDoc(p.id);
  need(p.confirm === doc.name, "Type the file name to confirm deletion.");
  const [content, files] = await Promise.all([ws.list("content"), ws.list("files")]);
  // storage still used by a post or by another file (a duplicate shares its bytes) is kept
  const used = new Set(content.map(c => c.media && c.media.key).filter(Boolean)
    .concat(...files.filter(f => f.id !== doc.id).map(f => f.versions.map(v => v.key))));
  for (const v of doc.versions) if (!used.has(v.key)) await ws.deleteBlob(v.key);
  await ws.remove("files", doc.id);
  await ws.activity("file.deleted", "File deleted: " + doc.name);
  return {};
};
// duplicate = a new file record starting from the current version (the stored bytes are shared, not copied)
A["files.duplicate"] = async p => {
  const doc = await getFileDoc(p.id);
  const cur = doc.versions.find(v => v.v === doc.current);
  const name = str(p.name, 200) || doc.name.replace(/(\.[^.]+)?$/, " (copy)$1");
  const copy = await ws.create("files", { name, folder: doc.folder, status: "draft", projectId: doc.projectId || "", tags: [], attention: "", description: doc.description || "",
    versions: [Object.assign({}, cur, { v: 1, at: new Date().toISOString(), by: "Max", note: "Duplicated from " + doc.name + " v" + cur.v })], current: 1, duplicatedFrom: doc.id });
  await ws.activity("file.duplicated", "File duplicated: " + doc.name + " → " + name, { kind: "file", id: copy.id });
  return { file: copy };
};
// compare two versions of a text file: returns both texts, the browser renders the line diff
A["files.compare"] = async p => {
  const doc = await getFileDoc(p.id);
  const a = doc.versions.find(v => v.v === +p.a), b = doc.versions.find(v => v.v === +p.b);
  need(a && b, "Version not found", 404);
  need(TEXTY.test(a.type) && TEXTY.test(b.type) || /\.(md|txt|json|js|css|html|csv|xml|yml|yaml)$/i.test(doc.name), "Only text files can be compared.");
  const [fa, fb] = await Promise.all([ws.readFileBytes(a.key, 512 * 1024), ws.readFileBytes(b.key, 512 * 1024)]);
  need(fa && fb && !fa.tooBig && !fb.tooBig, "The files are too large to compare here (512 KB max).");
  return { a: { v: a.v, text: fa.buf.toString("utf8") }, b: { v: b.v, text: fb.buf.toString("utf8") } };
};
A["files.link"] = async p => {
  const doc = await getFileDoc(p.id);
  const v = doc.versions.find(x => x.v === (+p.v || doc.current)); need(v, "Version not found", 404);
  const url = await ws.signedLink(v.key).catch(() => null);
  return url ? { url } : { stream: true };
};
A["files.get"] = async (p, res) => {
  const doc = await getFileDoc(p.id);
  const v = doc.versions.find(x => x.v === (+p.v || doc.current)); need(v, "Version not found", 404);
  const r = await ws.fileStream(v.key); need(r && r.stream, "File missing in storage", 404);
  res.statusCode = 200;
  res.setHeader("Content-Type", v.type || "application/octet-stream");
  res.setHeader("Cache-Control", "no-store");
  const buf = Buffer.from(await new Response(r.stream).arrayBuffer());
  res.end(buf);
  return undefined;
};
// small uploads through the function (local preview / fallback). Big files go browser → Blob via /api/blob-upload.
A["files.uploadSmall"] = async p => {
  const m = /^data:([\w/+.-]+);base64,(.+)$/.exec(String(p.dataUrl || ""));
  need(m, "Bad file");
  need(FILE_TYPES.test(m[1]), "This file type is not accepted.");
  const buf = Buffer.from(m[2], "base64");
  need(buf.length <= 3 * 1024 * 1024, "Files over 3 MB upload directly to storage on the live site.");
  const ext = (/\.([a-z0-9]{1,6})$/i.exec(str(p.name, 200)) || [, "bin"])[1].toLowerCase();
  const key = "wsf/wsf_" + Date.now().toString(36) + crypto.randomBytes(5).toString("hex") + "." + ext;
  await ws.saveFileBytes(key, buf, m[1]);
  return { key, size: buf.length, type: m[1] };
};
// text editor: read the current version, save edits as a new version
const TEXTY = /^(text\/|application\/(json|javascript|xml))/;
A["files.text"] = async p => {
  const doc = await getFileDoc(p.id);
  const v = doc.versions.find(x => x.v === doc.current);
  need(TEXTY.test(v.type) || /\.(md|txt|json|js|css|html|csv|xml|yml|yaml)$/i.test(doc.name), "Only text files can be edited here.");
  const f = await ws.readFileBytes(v.key, 1024 * 1024); need(f && !f.tooBig, "The file is too large for the editor (1 MB max).");
  return { text: f.buf.toString("utf8"), v: v.v };
};
A["files.saveText"] = async p => {
  const doc = await getFileDoc(p.id);
  need(typeof p.text === "string" && p.text.length <= 1024 * 1024, "Text too large");
  need(+p.base === doc.current, "The file changed since you opened it (now v" + doc.current + "). Reload before saving.", 409);
  const cur = doc.versions.find(x => x.v === doc.current);
  const ext = (/\.([a-z0-9]{1,6})$/i.exec(doc.name) || [, "txt"])[1].toLowerCase();
  const key = "wsf/wsf_" + Date.now().toString(36) + crypto.randomBytes(5).toString("hex") + "." + ext;
  await ws.saveFileBytes(key, Buffer.from(p.text, "utf8"), cur.type || "text/plain");
  const n = Math.max(...doc.versions.map(v => v.v)) + 1;
  doc.versions.push({ v: n, key, size: Buffer.byteLength(p.text), type: cur.type || "text/plain", at: new Date().toISOString(), by: "Max", note: str(p.note, 300) || "Edited in Workspace" });
  doc.current = n;
  await ws.put("files", doc);
  await ws.activity("file.version", "Edited " + doc.name + " → v" + n, { kind: "file", id: doc.id });
  return { file: doc };
};

/* media: content studio + telegram + youtube */
A["content.list"] = async () => ({ content: (await ws.list("content")).map(summarize) });
A["content.save"] = async p => {
  const cfg = await tgConfig();
  const allowed = new Set(cfg.destinations.map(d => d.handle));
  const fields = {
    title: str(p.title, 140), type: pick(p.type, ["post", "announcement", "video"], "post"), text: typeof p.text === "string" ? p.text.slice(0, 5000) : "",
    projectId: str(p.projectId, 40),
    destinations: Array.isArray(p.destinations) ? [...new Set(p.destinations.filter(h => allowed.has(h)))] : [],
    media: p.media && ws.fileKeyOk(p.media.key) ? { key: p.media.key, kind: pick(p.media.kind, ["photo", "video", "document"], "document"), name: str(p.media.name, 200), size: +p.media.size || 0 } : null,
    youtube: p.youtube && p.youtube.channelId ? { channelId: str(p.youtube.channelId, 60), title: str(p.youtube.title, 100), description: str(p.youtube.description, 5000), visibility: pick(p.youtube.visibility, ["private", "unlisted", "public"], "private") } : null
  };
  if (p.id) {
    const doc = await ws.get("content", p.id); need(doc, "Not found", 404);
    Object.assign(doc, fields);
    return { content: summarize(await ws.put("content", summarize(doc))) };
  }
  const doc = await ws.create("content", Object.assign(fields, { pubs: {}, history: [] }));
  await ws.activity("content.created", "Content created: " + (doc.title || doc.text.slice(0, 50) || "untitled"), { kind: "content", id: doc.id });
  return { content: summarize(doc) };
};
// READY = reviewed and waiting to be sent; saving never publishes anything by itself
A["content.ready"] = async p => {
  const doc = await ws.get("content", p.id); need(doc, "Not found", 404);
  doc.ready = p.ready !== false;
  await ws.activity("content.ready", (doc.ready ? "Content marked ready: " : "Content back to draft: ") + (doc.title || String(doc.text || "").slice(0, 50)), { kind: "content", id: doc.id });
  return { content: summarize(await ws.put("content", summarize(doc))) };
};
// ARCHIVED keeps the record and its publishing history (including failures) — it is only hidden from the active list
A["content.archive"] = async p => {
  const doc = await ws.get("content", p.id); need(doc, "Not found", 404);
  need(!Object.values(doc.pubs || {}).some(x => x.state === "sending"), "A send is in progress — wait for its result first.");
  doc.archived = p.archived !== false;
  await ws.activity(doc.archived ? "content.archived" : "content.restored", (doc.archived ? "Content archived: " : "Content restored: ") + (doc.title || String(doc.text || "").slice(0, 50)), { kind: "content", id: doc.id });
  return { content: summarize(await ws.put("content", summarize(doc))) };
};
A["content.delete"] = async p => {
  const doc = await ws.get("content", p.id); need(doc, "Not found", 404);
  need(p.confirm === true, "Confirmation required");
  // publishing records are never deleted — failed ones keep their error state
  need(!(doc.history || []).length && !Object.keys(doc.pubs || {}).length, "This content has a publishing history, so it cannot be deleted. Archive it instead.", 409);
  await ws.remove("content", doc.id);
  await ws.activity("content.deleted", "Content deleted: " + (doc.title || String(doc.text || "").slice(0, 50)));
  return {};
};
A["content.send"] = sendTelegram;
// "Cancel": destinations not yet sent stay unsent on purpose (the draft is kept)
A["content.cancel"] = async p => {
  const doc = await ws.get("content", p.id); need(doc, "Not found", 404);
  (doc.destinations || []).forEach(h => { const x = (doc.pubs = doc.pubs || {})[h]; if (!x || ["failed", "not_sent"].includes(x.state)) doc.pubs[h] = Object.assign({}, x, { state: "cancelled" }); });
  return { content: summarize(await ws.put("content", summarize(doc))) };
};
// "unknown" = sent but the answer was lost. Max checks the channel, then marks it sent or allows a resend.
A["content.resolve"] = async p => {
  const doc = await ws.get("content", p.id); need(doc, "Not found", 404);
  const x = (doc.pubs || {})[p.dest]; need(x && x.state === "unknown", "Nothing to resolve");
  doc.pubs[p.dest] = p.as === "sent" ? Object.assign(x, { state: "sent", error: null, note: "Confirmed manually by Max" }) : Object.assign(x, { state: "failed", error: "Marked as not delivered by Max" });
  return { content: summarize(await ws.put("content", summarize(doc))) };
};

A["telegram.status"] = async () => {
  const cfg = await tgConfig();
  const out = { configured: tg.configured("publish"), destinations: cfg.destinations, ceo: { handle: CEO_PROFILE, supported: false, note: "Personal-profile publishing is not supported by the Telegram Bot API, so it is not configured." } };
  if (out.configured) { const m = await tg.me("publish"); out.bot = m.ok ? { username: m.result.username, name: m.result.first_name } : { error: m.error }; }
  return out;
};
A["telegram.destinations"] = async p => {
  need(Array.isArray(p.handles), "bad list");
  const handles = [...new Set(p.handles.map(h => String(h).trim()).map(h => (h.startsWith("@") ? h : "@" + h)))].slice(0, 30);
  const bad = handles.filter(h => !tg.HANDLE.test(h)); need(!bad.length, "Not valid usernames: " + bad.join(", "));
  need(!handles.includes(CEO_PROFILE), CEO_PROFILE + " is the CEO profile, not a channel — it cannot be a publishing destination.");
  const cfg = await tgConfig();
  const prev = new Map(cfg.destinations.map(d => [d.handle, d]));
  cfg.destinations = handles.map(h => prev.get(h) || { handle: h });
  await ws.setConfig("telegram", cfg);
  return { destinations: cfg.destinations };
};
A["telegram.verify"] = async p => {
  const cfg = await tgConfig();
  const list = p.handle ? cfg.destinations.filter(d => d.handle === p.handle) : cfg.destinations;
  for (const d of list) {
    const r = await tg.verifyDestination(d.handle);
    Object.assign(d, { chatId: r.chatId || d.chatId, title: r.title, type: r.type, verified: { ok: r.ok, canPost: !!r.canPost, at: r.checkedAt, error: r.error || null, botStatus: r.botStatus } });
  }
  await ws.setConfig("telegram", cfg);
  return { destinations: cfg.destinations };
};
// services bot: webhook status and connection (Max confirms before an existing webhook is replaced)
A["bot.status"] = async () => {
  if (!tg.configured("services")) return { configured: false };
  const [m, w] = await Promise.all([tg.me("services"), tg.call("services", "getWebhookInfo")]);
  return { configured: true, bot: m.ok ? { username: m.result.username } : { error: m.error },
    webhook: w.ok ? { url: w.result.url || "", pending: w.result.pending_update_count, lastError: w.result.last_error_message || null, lastErrorAt: w.result.last_error_date ? new Date(w.result.last_error_date * 1000).toISOString() : null } : { error: w.error } };
};
A["bot.connect"] = async (p, res, req) => {
  need(tg.configured("services"), "Integration required: the bot token is not configured.");
  need(p.confirm === true, "Confirmation required");
  const host = String(req.headers["x-forwarded-host"] || req.headers.host || "");
  need(/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(host) && !/localhost|127\.0\.0\.1/.test(host), "The bot can only be connected from the live site (https).");
  const url = "https://" + host + "/api/bot";
  const r = await tg.call("services", "setWebhook", { url, secret_token: tg.webhookSecret(), allowed_updates: ["message", "callback_query"], max_connections: 10 });
  need(r.ok, "Telegram refused: " + r.error, 502);
  await ws.activity("bot.connected", "Services bot webhook set to " + url);
  return A["bot.status"]();
};

A["youtube.status"] = async () => {
  if (!yt.configured()) return { configured: false };
  const r = await yt.channels();
  return r.ok ? { configured: true, channels: r.data } : { configured: true, error: r.error };
};
const YT_MAX = 200 * 1024 * 1024;
A["youtube.upload"] = async p => {
  need(p.confirm === true, "Confirm the upload first.");
  need(yt.configured(), "Integration required: YouTube OAuth credentials are not configured.");
  const doc = await ws.get("content", p.id); need(doc, "Not found", 404);
  const y = doc.youtube; need(y && y.channelId && y.title, "Choose a channel and write a title first.");
  need(doc.media && doc.media.kind === "video", "Attach a video first.");
  const key = "yt:" + y.channelId;
  const prev = (doc.pubs = doc.pubs || {})[key] || {};
  if (prev.state === "sent") return { content: summarize(doc), duplicate: true };
  need(prev.state !== "sending" || Date.now() - Date.parse(prev.lockAt || 0) > 10 * 60e3, "An upload is already running.");
  const channels = await yt.channels(); need(channels.ok, channels.error, 502);
  need(channels.data.some(c => c.id === y.channelId), "This YouTube account does not own the selected channel.");
  doc.pubs[key] = Object.assign({}, prev, { state: "sending", lockAt: new Date().toISOString() });
  await ws.put("content", summarize(doc));
  const f = await ws.readFileBytes(doc.media.key, YT_MAX);
  let r;
  if (!f) r = { ok: false, error: "The video could not be read from storage." };
  else if (f.tooBig) r = { ok: false, error: "Videos over 200 MB cannot be uploaded from the Workspace yet (" + Math.round(f.size / 1048576) + " MB)." };
  else r = await yt.upload(y, f);
  const at = new Date().toISOString();
  doc.pubs[key] = r.ok ? { state: "sent", videoId: r.data.videoId, link: "https://youtu.be/" + r.data.videoId, uploadStatus: r.data.uploadStatus, at, attempts: (prev.attempts || 0) + 1 }
    : { state: "failed", error: r.error, at, attempts: (prev.attempts || 0) + 1 };
  doc.history = (doc.history || []).concat({ at, dest: key, result: doc.pubs[key].state, videoId: doc.pubs[key].videoId, error: doc.pubs[key].error });
  await ws.put("content", summarize(doc));
  await ws.activity(r.ok ? "youtube.uploaded" : "youtube.failed", r.ok ? "YouTube upload accepted: " + r.data.videoId : "YouTube upload failed: " + r.error, { kind: "content", id: doc.id });
  return { content: summarize(doc) };
};
A["youtube.check"] = async p => {
  const doc = await ws.get("content", p.id); need(doc, "Not found", 404);
  const key = Object.keys(doc.pubs || {}).find(k => k.startsWith("yt:") && doc.pubs[k].videoId); need(key, "No uploaded video");
  const r = await yt.status(doc.pubs[key].videoId); need(r.ok, r.error, 502);
  Object.assign(doc.pubs[key], { uploadStatus: r.data.uploadStatus, processing: r.data.processing, privacy: r.data.privacy, failure: r.data.failure, checkedAt: new Date().toISOString() });
  return { content: summarize(await ws.put("content", doc)) };
};

/* portfolio: PROJECT COMPLETED → owner review → PORTFOLIO DRAFT → APPROVE → site draft (published from the Control Center)
   Nothing here touches the live website: the entry goes into the Control Center's draft, and Max publishes it there. */
const PF_TAGS = { client: ["delivered", "live-client"], uzleeder: ["live-own", "product", "demo"] };
const PF_READY = ["COMPLETED", "READY_FOR_DELIVERY"];
const pfLink = v => (/^https:\/\/[^\s"'<>]+$/.test(v || "") ? String(v).slice(0, 300) : "");
const pfImage = v => (/^(https:\/\/[^\s"'<>]+|\/api\/media\/[\w.-]+)$/.test(v || "") ? String(v).slice(0, 300) : "");
A["portfolio.list"] = async () => ({ portfolio: await ws.list("portfolio") });
A["portfolio.create"] = async p => {
  const project = await ws.get("projects", str(p.projectId, 40)); need(project, "Project not found", 404);
  need(PF_READY.includes(project.status), "Only a completed (or ready-for-delivery) project can become a portfolio entry.");
  const existing = (await ws.list("portfolio")).find(x => x.projectId === project.id);
  if (existing) return { entry: existing, existing: true };
  const owner = project.clientId ? "client" : "uzleeder";
  // starts almost empty on purpose: the client's brief and private notes are never copied into public text automatically
  const entry = await ws.create("portfolio", { projectId: project.id, code: project.code || "", title: project.name, summary: "", role: "", tech: "", link: "", image: "",
    owner, tag: owner === "client" ? "delivered" : project.kind === "demo" ? "demo" : project.kind === "product" ? "product" : "live-own", showClient: false, clientName: "", state: "draft" });
  await ws.activity("portfolio.draft", "Portfolio draft created for " + project.name, { kind: "project", id: project.id });
  return { entry };
};
A["portfolio.save"] = async p => {
  const e = await ws.get("portfolio", str(p.id, 40)); need(e, "Not found", 404);
  const owner = e.owner;
  Object.assign(e, { title: str(p.title, 140), summary: str(p.summary, 1500), role: str(p.role, 300), tech: str(p.tech, 300), link: pfLink(p.link), image: pfImage(p.image),
    tag: pick(p.tag, PF_TAGS[owner], e.tag), showClient: owner === "client" && p.showClient === true, clientName: str(p.clientName, 120) });
  if (e.state === "approved") e.state = "draft";                 // any edit needs a fresh approval
  return { entry: await ws.put("portfolio", e) };
};
A["portfolio.approve"] = async p => {
  const e = await ws.get("portfolio", str(p.id, 40)); need(e, "Not found", 404);
  need(p.confirm === true, "Confirmation required");
  need(e.title && e.summary.length >= 20, "Write a title and a public summary (at least 20 characters) before approving.");
  e.state = "approved"; e.approvedAt = new Date().toISOString();
  await ws.activity("portfolio.approved", "Portfolio entry approved: " + e.title, { kind: "project", id: e.projectId });
  return { entry: await ws.put("portfolio", e) };
};
A["portfolio.toSite"] = async p => {
  const e = await ws.get("portfolio", str(p.id, 40)); need(e, "Not found", 404);
  need(p.confirm === true, "Confirmation required");
  need(e.state === "approved" || e.state === "sent", "Approve the entry first.");
  const draft = await store.readDraft();
  const content = JSON.parse(JSON.stringify(draft ? draft.content : (await store.readPublished()).content || {}));
  content.projects = Array.isArray(content.projects) ? content.projects : [];
  const item = { owner: e.owner, tag: e.tag, client: e.showClient ? e.clientName : "", title: e.title, link: e.link, image: e.image, video: "",
    tech: e.tech.split(",").map(s => s.trim()).filter(Boolean).slice(0, 12), desc: { en: e.summary }, cat: {}, role: e.role ? { en: e.role } : {}, why: {}, value: "", portfolioId: e.id };
  const at = content.projects.findIndex(x => x.portfolioId === e.id);
  if (at >= 0) content.projects[at] = Object.assign({}, content.projects[at], item); else content.projects.push(item);
  await store.saveDraft(content);
  e.state = "sent"; e.sentAt = new Date().toISOString();
  await ws.put("portfolio", e);
  await ws.activity("portfolio.sent", "Portfolio entry added to the website draft: " + e.title + " (publish it from the Control Center)", { kind: "project", id: e.projectId });
  return { entry: e };
};

/* startups — one canonical record (api/_lib/startups.js), used by the Control Center (content + publishing)
   and by the Workspace (operations: milestones, tasks, files, notes). The public page only ever sees the published copy. */
// Permissions (server-side). The owner (role "admin", the only account that can sign in today) holds all of them;
// the other roles exist so a team can be added without touching these rules.
const SU_PERMS = ["view", "create", "edit", "ops", "review", "publish", "archive", "delete", "order"];
const SU_ROLES = {
  admin: SU_PERMS,
  editor: ["view", "create", "edit", "ops", "order"],        // writes drafts and runs operations; cannot approve or publish
  reviewer: ["view", "review"],                            // approves / rejects submitted drafts
  auditor: ["view"]
};
const suCan = (who, p) => !!who && (SU_ROLES[who.role] || []).includes(p);
const suAllow = (who, p) => { if (!suCan(who, p)) throw new Bad("Your role does not allow this (startups: " + p + ").", 403); };
const actor = who => (who && who.name) || (who && who.role === "admin" ? "Max" : (who && who.role) || "unknown");
const SU_ACTION_PERM = { submit: "edit", toDraft: "edit", approve: "review", reject: "review", publish: "publish", unpublish: "publish", restore: "edit", archive: "archive" };
async function startupOps(id) {
  const [tasks, files] = await Promise.all([ws.list("tasks"), ws.list("files")]);
  return { tasks: tasks.filter(t => t.startupId === id).map(NORMALIZE.tasks), files: files.filter(f => f.startupId === id) };
}
const fullStartup = async r => {
  const ops = await startupOps(r.id);
  const ids = new Set([r.id].concat(ops.tasks.map(t => t.id), ops.files.map(f => f.id)));
  const certRows = (await ws.list("certs")).filter(c => c.startupId === r.id);
  certRows.forEach(c => ids.add(c.id));
  const activity = (await ws.readActivity(400)).filter(a => a.ref && ids.has(a.ref.id)).slice(0, 80);
  return { certificates: certRows.map(c => Object.assign(certs.row(c), { verifyUrl: c.number ? certs.verifyUrl(c) : null, review: c.review || null, infoRequests: c.infoRequests || [], gaps: certs.gaps(c) })), startup: Object.assign({}, r, { versions: (r.versions || []).map(v => ({ v: v.v, at: v.at, by: v.by, name: v.content && v.content.name })) }), tasks: ops.tasks, files: ops.files, activity };
};
A["startups.perms"] = async (p, res, req, who) => ({ role: who.role, perms: SU_PERMS.filter(x => suCan(who, x)) });
A["startups.list"] = async (p, res, req, who) => {
  suAllow(who, "view");
  const [list, tasks, files] = await Promise.all([su.all(), ws.list("tasks"), ws.list("files")]);
  const today = new Date().toISOString().slice(0, 10);
  return { initialized: list.length > 0, startups: list.map(r => {
    const t = tasks.filter(x => x.startupId === r.id).map(NORMALIZE.tasks);
    const next = (r.milestones || []).filter(m => m.status !== "done").sort((a, b) => (a.target || "9999").localeCompare(b.target || "9999"))[0] || null;
    return Object.assign(su.row(r), { openTasks: t.filter(x => x.status !== "done").length, overdue: t.filter(x => x.status !== "done" && x.due && x.due < today).length, files: files.filter(f => f.startupId === r.id).length, nextMilestone: next });
  }) };
};
A["startups.get"] = async (p, res, req, who) => { suAllow(who, "view"); return fullStartup(await su.getRec(str(p.id, 40))); };
A["startups.create"] = async (p, res, req, who) => { suAllow(who, "create"); return fullStartup(await su.create(p, actor(who))); };
A["startups.save"] = async (p, res, req, who) => { suAllow(who, "edit"); return fullStartup(await su.saveDraft(str(p.id, 40), p, actor(who))); };
Object.keys(SU_ACTION_PERM).forEach(action => {
  A["startups." + action] = async (p, res, req, who) => { suAllow(who, SU_ACTION_PERM[action]); return fullStartup(await su.transition(str(p.id, 40), action, p, actor(who))); };
});
A["startups.delete"] = async (p, res, req, who) => { suAllow(who, "delete"); await su.remove(str(p.id, 40), p.confirm, actor(who)); return {}; };
A["startups.reorder"] = async (p, res, req, who) => { suAllow(who, "order"); await su.reorder(str(p.id, 40), +p.dir, actor(who)); return A["startups.list"](p, res, req, who); };
A["startups.internal"] = async (p, res, req, who) => { suAllow(who, "ops"); return fullStartup(await su.saveInternal(str(p.id, 40), p, actor(who))); };
A["startups.milestone"] = async (p, res, req, who) => { suAllow(who, "ops"); return fullStartup(await su.saveMilestone(str(p.id, 40), p, actor(who))); };
A["startups.milestoneDelete"] = async (p, res, req, who) => { suAllow(who, "ops"); return fullStartup(await su.deleteMilestone(str(p.id, 40), str(p.milestoneId, 20), actor(who))); };
A["startups.import"] = async (p, res, req, who) => {
  suAllow(who, "create");
  // what is public today becomes the canonical records: the Control Center list if it has one, otherwise the built-in ventures
  const cms = ((await store.readPublished()).content || {}).startups;
  const source = Array.isArray(cms) && cms.length ? cms : require("./_lib/startups-seed.json");
  const out = await su.importInitial(source, actor(who));
  return Object.assign({ imported: out.length }, await A["startups.list"](p, res, req, who));
};


/* development + deployments */
A["dev.repos"] = async () => { if (!gh.configured()) return { configured: false }; const r = await gh.repos(); return r.ok ? { configured: true, repos: r.data } : { configured: true, error: r.error }; };
A["dev.repo"] = async p => { need(gh.configured(), "Integration required: GITHUB_TOKEN"); const r = await gh.repo(p.full); need(r.ok, r.error, 502); return r.data; };
A["deploy.list"] = async () => { if (!vc.configured()) return { configured: false }; const r = await vc.list(); return r.ok ? Object.assign({ configured: true }, r.data) : { configured: true, error: r.error }; };
A["deploy.logs"] = async p => { need(vc.configured(), "Integration required: VERCEL_TOKEN"); const r = await vc.events(p.id); need(r.ok, r.error, 502); return { lines: r.data }; };
A["deploy.promote"] = async p => {
  need(vc.configured(), "Integration required: VERCEL_TOKEN");
  need(p.confirm === true, "Confirmation required");
  const r = await vc.promote(p.id); need(r.ok, "Vercel refused: " + r.error, 502);
  await ws.activity("deploy.promote", "Asked Vercel to make deployment " + p.id + " the production version");
  return { requested: true };
};

/* activity + search */
A["activity.list"] = async p => ({ activity: await ws.readActivity(Math.min(500, +p.limit || 200)) });
A["search"] = async p => {
  const q = str(p.q, 80).toLowerCase(); need(q.length >= 2, "Type at least 2 characters.");
  const [leads, projects, clients, tasks, files, content, websites, activity] = await Promise.all([
    store.listLeads(1000), ws.list("projects"), ws.list("clients"), ws.list("tasks"), ws.list("files"), ws.list("content"), ws.list("websites"), ws.readActivity(300)
  ]);
  const hit = (kind, list, fields, title) => list.filter(x => matches(x, q, fields)).slice(0, 8).map(x => ({ kind, id: x.id, title: title(x) }));
  return { results: [].concat(
    hit("project", projects, ["name", "summary", "status"], x => x.name),
    hit("request", leads, ["name", "contact", "message", "notes"], x => (x.name || "Request") + " — " + String(x.message || "").slice(0, 60)),
    hit("client", clients, ["name", "contact", "company", "notes"], x => x.name),
    hit("task", tasks, ["title", "notes"], x => x.title),
    hit("file", files, ["name", "folder", "description"], x => x.name),
    hit("content", content, ["title", "text"], x => x.title || String(x.text || "").slice(0, 60)),
    hit("website", websites, ["name", "url"], x => x.name || x.url),
    activity.filter(a => String(a.text).toLowerCase().includes(q)).slice(0, 8).map(a => ({ kind: "activity", id: a.ref && a.ref.id, refKind: a.ref && a.ref.kind, title: a.text, at: a.at }))
  ) };
};

/* certificates — UzLeeder Venture Record Certificates (api/_lib/certs.js). Every action checks the caller's role there. */
const sendPdf = (res, out) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'attachment; filename="' + out.filename.replace(/[^\w.-]/g, "_") + '"');
  res.setHeader("Cache-Control", "no-store");
  if (out.sha256) res.setHeader("X-Content-SHA256", out.sha256);
  if (out.intact !== undefined) res.setHeader("X-Integrity", out.intact ? "match" : "MISMATCH");
  res.end(out.bytes);
  return undefined;
};
const certOut = (r, who) => ({ certificate: certs.view(r, who) });
A["certs.perms"] = async (p, res, req, who) => ({ role: who.role, perms: certs.PERMS.filter(x => certs.can(who, x)), types: certs.TYPE_KEYS, stages: certs.STAGES, evidence: certs.EVIDENCE });
A["certs.list"] = async (p, res, req, who) => {
  const [rows, startups] = await Promise.all([certs.list({ startupId: str(p.startupId, 40), type: str(p.type, 20), status: str(p.status, 20) }, who), su.all()]);
  return { certificates: rows, ventures: startups.filter(r => !r.archived).map(r => ({ id: r.id, slug: r.slug, name: (r.draft && r.draft.name) || r.slug })) };
};
A["certs.get"] = async (p, res, req, who) => {
  const r = await certs.getRec(str(p.id, 40));
  const out = certOut(r, who);
  out.files = (await ws.list("files")).filter(f => f.startupId === r.startupId).map(f => ({ id: f.id, name: f.name, folder: f.folder }));
  if (certs.can(who, "audit") && r.number) out.stats = await certs.stats(r.id, who);
  return out;
};
A["certs.create"] = async (p, res, req, who) => certOut(await certs.create({ startupId: str(p.startupId, 40), type: p.type, lang: p.lang, fields: p.fields, origin: p.origin, request: p.request }, who), who);
A["certs.save"] = async (p, res, req, who) => certOut(await certs.save(str(p.id, 40), p, who), who);
A["certs.evidence"] = async (p, res, req, who) => certOut(await certs.evidence(str(p.id, 40), p, who), who);
["submit", "requestInfo", "respond", "approve", "reject", "suspend", "reinstate", "revoke"].forEach(action => {
  A["certs." + action] = async (p, res, req, who) => certOut(await certs.transition(str(p.id, 40), action, p, who), who);
});
A["certs.issue"] = async (p, res, req, who) => certOut(await certs.issue(str(p.id, 40), p, who), who);
A["certs.reissue"] = async (p, res, req, who) => certOut(await certs.reissue(str(p.id, 40), p, who), who);
A["certs.delete"] = async (p, res, req, who) => certs.remove(str(p.id, 40), p, who);
A["certs.preview"] = async (p, res, req, who) => sendPdf(res, await certs.previewPdf(str(p.id, 40), who));
A["certs.pdf"] = async (p, res, req, who) => sendPdf(res, await certs.issuedPdf(str(p.id, 40), who));
A["certs.templates"] = async (p, res, req, who) => { if (!certs.can(who, "view")) throw new Bad("Your role does not allow this (view).", 403); return { templates: await certs.templates() }; };
A["certs.templateSave"] = async (p, res, req, who) => ({ template: await certs.saveTemplate(str(p.type, 20), p, who) });
A["certs.templatePreview"] = async (p, res, req, who) => {
  if (!certs.can(who, "templates")) throw new Bad("Your role does not allow this (templates).", 403);
  const t = await certs.template(str(p.type, 20));
  const render = require("./_lib/certpdf").render;
  const lang = ["en", "uz", "ru"].includes(p.lang) ? p.lang : t.lang;
  const bytes = await render({ preview: true, number: "UZL-SAMPLE", type: t.type, lang, issuedAt: new Date().toISOString(), verifyUrl: "https://uzleeder.vercel.app/verify/UZL-SAMPLE", verifyCode: "XXXXXXXXXX", templateVersion: t.version, recordVersion: 1,
    fields: { ventureName: "Sample Venture", repRole: "founder", representative: "Founder Name", stage: "prototype", member: "Team Member", memberRole: "Product Lead", milestone: "Milestone name", completedOn: "2026-01-15" },
    template: { title: t.title, subtitle: t.subtitle[lang] || "", statement: t.statement[lang] || "", signatory: t.signatory } });
  return sendPdf(res, { bytes, filename: "template-" + t.type + "-v" + t.version + "-" + lang + ".pdf" });
};
A["certs.prepareAll"] = async (p, res, req, who) => ({ created: (await certs.prepareAll(p, who)).map(certs.row) });
A["certs.stats"] = async (p, res, req, who) => ({ stats: await certs.stats(str(p.id, 40), who) });

// which Workspace areas a non-owner role may call at all (each action then checks its own permission)
const ROLE_SCOPE = {
  editor: /^(startups\.|certs\.|tasks\.|files\.(list|get|link|text|uploadSmall|create|update|saveText|compare)$|activity\.|search$)/,
  reviewer: /^(startups\.(perms|list|get|approve|reject|toDraft)$|certs\.|activity\.|search$)/,
  auditor: /^(startups\.(perms|list|get)$|certs\.(perms|list|get|pdf|preview|stats|templates)$|activity\.)/
};
module.exports = async (req, res) => {
  if (!onlyPost(req, res)) return;
  if (!auth.configured()) return json(res, 503, { ok: false, error: "Admin login is not configured on the server" });
  const who = await auth.requireAuth(req);
  if (!who) return json(res, 401, { ok: false, error: "Unauthorized" });
  if (who.role !== "admin" && !ROLE_SCOPE[who.role]) return json(res, 403, { ok: false, error: "Unknown role" });
  if (!store.configured()) return json(res, 503, { ok: false, error: "Storage is not connected", code: "storage-missing" });
  let p;
  try { p = await body(req); } catch (e) { return json(res, 400, { ok: false, error: "Bad JSON" }); }
  const fn = A[p && p.action];
  if (!fn) return json(res, 400, { ok: false, error: "Unknown action" });
  if (who.role !== "admin" && !ROLE_SCOPE[who.role].test(p.action)) return json(res, 403, { ok: false, error: "Your role does not allow this." });
  try {
    const out = await fn(p, res, req, who);
    if (out === undefined) return;                                // streamed a file
    return json(res, 200, Object.assign({ ok: true }, out));
  } catch (e) {
    if (e instanceof Bad || e instanceof su.Bad || e instanceof certs.Bad) return json(res, e.status, { ok: false, error: e.message });
    console.error("workspace", p.action, e);
    return json(res, 500, { ok: false, error: "Server error" });
  }
};
module.exports._summarize = summarize;
