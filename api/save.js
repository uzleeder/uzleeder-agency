// POST /api/save — admin only.
//   { mode: "draft",   content, summary }  → saves the work-in-progress draft
//   { mode: "publish", content, summary }  → publishes it (keeps the last 5 published versions) and clears the draft
//   { mode: "discard" }                    → throws the draft away
// A body without "mode" is treated as a direct publish of the whole object (older admin panel).
const { json, body, onlyPost } = require("./_lib/http");
const { requireAuth } = require("./_lib/auth");
const store = require("./_lib/store");

module.exports = async (req, res) => {
  if (!onlyPost(req, res)) return;
  if (!(await requireAuth(req))) return json(res, 401, { error: "Unauthorized" });
  if (!store.configured()) return json(res, 503, { error: "Storage is not connected", code: "storage-missing" });
  let data;
  try { data = await body(req); } catch (e) { return json(res, 400, { error: "Bad JSON" }); }

  const mode = data && data.mode ? data.mode : "publish";
  const content = data && data.mode ? data.content : data;
  const summary = typeof (data && data.summary) === "string" ? data.summary.slice(0, 300) : "";
  try {
    if (mode === "discard") {
      await store.discardDraft();
      await store.log({ action: "draft.discard", object: "Site content", detail: summary });
      return json(res, 200, { ok: true });
    }
    if (!content || typeof content !== "object" || Array.isArray(content)) return json(res, 400, { error: "Invalid content" });
    if (JSON.stringify(content).length > 900000) return json(res, 413, { error: "Content is too large" });
    if (mode === "draft") {
      await store.saveDraft(content);
      await store.log({ action: "draft.save", object: "Site content", detail: summary });
      return json(res, 200, { ok: true, mode });
    }
    if (mode === "publish") {
      const versions = await store.publish(content);
      await store.log({ action: "content.publish", object: "Site content", detail: summary });
      return json(res, 200, { ok: true, mode, versions });
    }
    return json(res, 400, { error: "Unknown mode" });
  } catch (e) {
    console.error("save failed:", e);
    return json(res, 500, { error: "Failed to save", detail: e.message });
  }
};
