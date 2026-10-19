// /api/admin — UzLeeder Control Center data (admin token required for everything).
//   GET  ?action=overview   status + counts + recent activity + draft state (one call for the dashboard)
//   GET  ?action=messages   inbox          GET ?action=log&limit=N   activity log
//   GET  ?action=media      uploaded files GET ?action=versions      published content history
//   POST { action: "message.update", id, status?, priority?, note? }
//   POST { action: "message.delete", id }      POST { action: "media.delete", key, name? }
//   POST { action: "logout" }                  (recorded in the activity log)
//   POST { action: "password.change", current, next } → new token; all other sessions end
//   GET  ?action=leads                     project briefs (lead pipeline)
//   POST { action: "lead.update", id, status?, followUp?, notes? } · { action: "lead.delete", id } · { action: "lead.notify", id }
//   GET  ?action=version&path=cms/published/…    one published version (preview before restoring)
//   POST { action: "version.restore", path }     publish an older version again
// Nothing here ever returns a secret — only whether each piece of configuration is present.
const { json, body, client } = require("./_lib/http");
const auth = require("./_lib/auth");
const store = require("./_lib/store");
const notify = require("./_lib/notify");
const an = require("./_lib/analytics");

// analytics for the last N days: finished days are rolled up once (raw visits deleted), today is live
let anCache = null;
async function analytics(n) {
  if (anCache && anCache.n === n && Date.now() - anCache.at < 60000) return anCache.data;
  const today = an.dayOf(Date.now());
  const idx = await store.analyticsIndex();
  const days = [];
  for (let i = n - 1; i >= 0; i--) days.push(an.dayOf(Date.now() - i * 864e5));
  const out = [];
  let live = 0;
  for (const day of [...new Set(days)]) {
    const raw = idx.rawByDay[day] || [];
    if (day !== today && idx.dayFiles.has(day)) { out.push(await store.readDay(day)); continue; }
    if (!raw.length) { out.push(an.aggregate(day, [])); continue; }
    const docs = await store.readRaw(raw);
    const agg = an.aggregate(day, docs);
    if (day === today) live = docs.filter(v => Date.now() - v.updated < 5 * 60e3).length;
    else await store.writeDay(day, agg, raw);
    out.push(agg);
  }
  const data = { days: out.filter(Boolean), today, live, tz: an.TZ, generatedAt: new Date().toISOString() };
  anCache = { n, at: Date.now(), data };
  return data;
}

async function fullStatus() {
  const s = systemStatus();
  const cred = await auth.credential().catch(() => null);
  s.passwordChangedAt = cred ? cred.changedAt : null;
  return s;
}
function systemStatus() {
  const e = process.env;
  return {
    admin: auth.configured(),
    storage: store.configured(),
    storageAccess: store.accessMode(),
    passwordChangedAt: null,
    telegram: !!(e.TELEGRAM_BOT_TOKEN && e.TELEGRAM_CHAT_ID),
    deployment: {
      platform: e.VERCEL ? "Vercel" : "Unknown",
      environment: e.VERCEL_ENV || null,
      url: e.VERCEL_PROJECT_PRODUCTION_URL || e.VERCEL_URL || null,
      region: e.VERCEL_REGION || null,
      commit: e.VERCEL_GIT_COMMIT_SHA ? e.VERCEL_GIT_COMMIT_SHA.slice(0, 7) : null,
      commitMessage: e.VERCEL_GIT_COMMIT_MESSAGE ? e.VERCEL_GIT_COMMIT_MESSAGE.slice(0, 120) : null,
      deploymentId: e.VERCEL_DEPLOYMENT_ID || null
    },
    runtime: process.version,
    serverTime: new Date().toISOString()
  };
}

async function overview() {
  const status = await fullStatus();
  const out = { status, storageHealth: await store.ping(), counts: null, activity: [], draft: null, published: null };
  if (!status.storage || !out.storageHealth.ok) return out;
  const [messages, activity, draft, published, media, leads] = await Promise.all([
    store.listMessages(200).catch(() => []),
    store.readLog(12).catch(() => []),
    store.readDraft().catch(() => null),
    store.readPublished().catch(() => ({ content: {}, meta: null })),
    store.listMedia().catch(() => []),
    store.listLeads(500).catch(() => [])
  ]);
  out.counts = {
    messages: messages.length,
    unread: messages.filter(m => m.status === "new").length,
    media: media.length,
    leads: leads.length,
    newLeads: leads.filter(l => l.status === "new").length
  };
  out.pipeline = {};
  store.LEAD_STATUS.forEach(s => { out.pipeline[s] = leads.filter(l => l.status === s).length; });
  out.recentLeads = leads.slice(0, 5).map(l => ({ id: l.id, name: l.name, service: l.service, status: l.status, createdAt: l.createdAt }));
  // real delivery evidence: the newest lead that has a Telegram result
  const withNotify = leads.find(l => l.notify && l.notify.telegram && l.notify.telegram !== "pending");
  out.lastNotify = withNotify ? { result: withNotify.notify.telegram, at: withNotify.notify.at || withNotify.createdAt } : null;
  out.recentMessages = messages.slice(0, 5).map(m => ({ id: m.id, name: m.name, createdAt: m.createdAt, status: m.status }));
  out.activity = activity;
  out.draft = draft ? { updatedAt: draft.meta.updatedAt } : null;
  out.published = published.meta ? { updatedAt: published.meta.updatedAt } : null;
  return out;
}

module.exports = async (req, res) => {
  if (!auth.configured()) return json(res, 500, { error: "Admin is not configured", code: "admin-missing" });
  if (!(await auth.requireAuth(req))) return json(res, 401, { error: "Unauthorized" });

  try {
    if (req.method === "GET") {
      const action = (req.query && req.query.action) || "overview";
      if (action === "overview") return json(res, 200, await overview());
      if (action === "status") return json(res, 200, { status: await fullStatus(), storageHealth: await store.ping() });
      if (!store.configured()) return json(res, 503, { error: "Storage is not connected", code: "storage-missing" });
      if (action === "messages") return json(res, 200, { messages: await store.listMessages(300) });
      if (action === "log") return json(res, 200, { log: await store.readLog(Math.min(300, +req.query.limit || 100)) });
      if (action === "media") return json(res, 200, { media: await store.listMedia() });
      if (action === "versions") return json(res, 200, { versions: await store.publishedVersions() });
      if (action === "leads") return json(res, 200, { leads: await store.listLeads(500) });
      if (action === "analytics") return json(res, 200, await analytics(Math.max(1, Math.min(90, +req.query.days || 30))));
      if (action === "version") {
        const p = String(req.query.path || "");
        if (!/^cms\/published\/[\w-]+\.json$/.test(p)) return json(res, 400, { error: "Bad version" });
        const content = await store.readVersion(p);
        return content ? json(res, 200, { content }) : json(res, 404, { error: "Version not found" });
      }
      return json(res, 400, { error: "Unknown action" });
    }

    if (req.method === "POST") {
      let data;
      try { data = await body(req); } catch (e) { return json(res, 400, { error: "Bad JSON" }); }
      const a = data.action;
      if (a === "logout") {
        await store.log({ action: "security.logout", object: "Admin sign-out", detail: (client(req).country || "") });
        return json(res, 200, { ok: true });
      }
      if (!store.configured()) return json(res, 503, { error: "Storage is not connected", code: "storage-missing" });
      if (a === "password.change") {
        // current password is required again; every other session ends (token version bump)
        const next = String(data.next || "");
        if (!(await auth.checkPassword(data.current))) {
          await store.log({ action: "security.password_failed", object: "Password change", detail: "wrong current password", level: "warning" });
          await new Promise(r => setTimeout(r, 600));
          return json(res, 403, { error: "The current password is not correct" });
        }
        if (next.length < 6 || next.length > 200) return json(res, 400, { error: "Use at least 6 characters" });
        if (await auth.checkPassword(next)) return json(res, 400, { error: "The new password must be different" });
        await auth.setPassword(next);
        await store.log({ action: "security.password_changed", object: "Admin password", detail: "other sessions signed out", level: "warning" });
        const exp = Date.now() + 12 * 60 * 60 * 1000;
        return json(res, 200, { ok: true, token: await auth.issue(exp), exp });
      }
      if ((a === "lead.update" || a === "lead.delete" || a === "lead.notify") && !/^[a-z0-9]+$/i.test(String(data.id || ""))) {
        return json(res, 400, { error: "Bad lead id" });
      }
      if (a === "lead.update") {
        if (data.status != null && !store.LEAD_STATUS.includes(data.status)) return json(res, 400, { error: "Unknown status" });
        const before = await store.getLead(String(data.id));
        if (!before) return json(res, 404, { error: "Lead not found" });
        const doc = await store.updateLead(String(data.id), { status: data.status, followUp: data.followUp, notes: data.notes });
        if (data.status && data.status !== before.status) await store.log({ action: "lead.status", object: doc.name, detail: before.status + " → " + data.status });
        return json(res, 200, { ok: true, lead: doc });
      }
      if (a === "lead.delete") {
        const lead = await store.getLead(String(data.id));
        await store.deleteLead(String(data.id));
        await store.log({ action: "lead.delete", object: lead ? lead.name : String(data.id), level: "warning" });
        return json(res, 200, { ok: true });
      }
      if (a === "lead.notify") {
        const lead = await store.getLead(String(data.id));
        if (!lead) return json(res, 404, { error: "Lead not found" });
        const tg = await notify.telegram(notify.leadText(lead));
        const doc = await store.updateLead(lead.id, { notify: { telegram: tg, at: new Date().toISOString() } });
        await store.log({ action: tg === "sent" ? "lead.notify_retry" : "lead.notify_failed", object: lead.name, detail: "Telegram: " + tg, level: tg === "sent" ? "info" : "warning" });
        return json(res, 200, { ok: tg === "sent", result: tg, lead: doc });
      }
      if (a === "version.restore") {
        // publishes an older version again (it becomes the newest); the current one stays in history
        const p = String(data.path || "");
        if (!/^cms\/published\/[\w-]+\.json$/.test(p)) return json(res, 400, { error: "Bad version" });
        const content = await store.readVersion(p);
        if (!content) return json(res, 404, { error: "Version not found" });
        await store.publish(content);
        await store.log({ action: "content.restore", object: "Site content", detail: "restored version from " + (data.at || p), level: "warning" });
        return json(res, 200, { ok: true });
      }
      if ((a === "message.update" || a === "message.delete") && !/^[a-z0-9]+$/i.test(String(data.id || ""))) {
        return json(res, 400, { error: "Bad message id" });
      }
      if (a === "message.update") {
        const doc = await store.updateMessage(String(data.id || ""), data);
        if (!doc) return json(res, 404, { error: "Message not found" });
        if (data.status) await store.log({ action: "message.status", object: doc.name, detail: data.status });
        return json(res, 200, { ok: true, message: doc });
      }
      if (a === "message.delete") {
        await store.deleteMessage(String(data.id || ""));
        await store.log({ action: "message.delete", object: String(data.name || data.id), level: "warning" });
        return json(res, 200, { ok: true });
      }
      if (a === "media.log") {
        // browser uploads go straight to Blob; this records them in the activity log
        const key = String(data.key || "");
        if (!/^med_[a-z0-9]+\.[a-z0-9]+$/i.test(key)) return json(res, 400, { error: "Bad key" });
        await store.log({ action: "media.upload", object: String(data.name || key).replace(/[^\w.\- ]/g, "").slice(0, 80) || key, detail: (Math.round((+data.size || 0) / 1048576 * 10) / 10) + " MB · " + String(data.type || "").slice(0, 40) });
        return json(res, 200, { ok: true });
      }
      if (a === "media.delete") {
        const key = String(data.key || "");
        if (!/^(img|med)_[a-z0-9]+\.[a-z0-9]+$/i.test(key)) return json(res, 400, { error: "Bad key" });
        await store.deleteMedia(key);
        await store.log({ action: "media.delete", object: String(data.name || key), level: "warning" });
        return json(res, 200, { ok: true });
      }
      return json(res, 400, { error: "Unknown action" });
    }

    res.setHeader("Allow", "GET, POST");
    return json(res, 405, { error: "Method not allowed" });
  } catch (e) {
    console.error("admin api failed:", e);
    return json(res, 500, { error: "The server could not complete this request", detail: e.message });
  }
};
