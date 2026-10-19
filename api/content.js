// GET /api/content — public: the PUBLISHED admin content (text overrides, projects, team, certificates, settings).
// GET /api/content?draft=1 with an admin token — the current draft (falls back to published) for "Preview".
// Always answers JSON ({} when storage is not connected) so the site falls back to its built-in content.
const { json } = require("./_lib/http");
const { requireAuth } = require("./_lib/auth");
const store = require("./_lib/store");

module.exports = async (req, res) => {
  try {
    const wantDraft = req.query && req.query.draft === "1";
    if (wantDraft) {
      if (!(await requireAuth(req))) return json(res, 401, { error: "Unauthorized" });
      const draft = store.configured() ? await store.readDraft() : null;
      if (draft && draft.content) return json(res, 200, Object.assign({}, draft.content, { __preview: "draft" }));
    }
    const { content } = await store.readPublished();
    return json(res, 200, content || {});
  } catch (e) {
    console.error("content read failed:", e);
    return json(res, 200, {});
  }
};
