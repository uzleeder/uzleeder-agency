// GET /api/startups — public: the published startups for /startups and the homepage counter.
//   Only records that are published, visible and not archived; only their public fields (never drafts,
//   internal notes, milestones, tasks or files).
// GET /api/startups?preview=1 with the admin token — the current drafts, for "Preview" in the Control Center.
// Before the Control Center has imported anything (or without storage) it answers with the built-in ventures.
// GET /api/startups?verify=UZL-VRC-2026-000001&c=CODE — public certificate verification for /verify (api/_lib/certs.js):
//   only the approved public fields and the live status; the same "not found" for a wrong code and an unknown number.
//   (Lives here because the Vercel plan allows a fixed number of functions.)
const { json } = require("./_lib/http");
const auth = require("./_lib/auth");
const store = require("./_lib/store");
const su = require("./_lib/startups");
const seed = require("./_lib/startups-seed.json");
const certs = require("./_lib/certs");
const { client } = require("./_lib/http");

// best-effort per-instance limit for verification lookups (no visitor data is stored)
const hits = new Map();
function limited(req) {
  const ip = client(req).ip || "?", t = Math.floor(Date.now() / 60000), k = ip + ":" + t;
  const n = (hits.get(k) || 0) + 1; hits.set(k, n);
  if (hits.size > 5000) hits.clear();
  return n > 30;
}

const seedList = () => seed.filter(s => s && !s.archived && s.name).map(s => Object.assign({ slug: s.slug, aliases: s.aliases || [], order: 0 }, su.cleanPublic(s)));

module.exports = async (req, res) => {
  if (req.method !== "GET") return json(res, 405, { ok: false, error: "Method not allowed" });
  const preview = req.query && req.query.preview === "1";
  try {
    if (req.query && req.query.verify !== undefined) {
      res.setHeader("Cache-Control", "no-store");
      res.setHeader("X-Robots-Tag", "noindex");
      if (limited(req)) return json(res, 429, { ok: false, error: "Too many lookups — try again in a minute." });
      if (!store.configured()) return json(res, 503, { ok: false, error: "Verification is temporarily unavailable." });
      return json(res, 200, await certs.verify(String(req.query.verify).toUpperCase().slice(0, 40), String(req.query.c || "").toUpperCase().slice(0, 20)));
    }
    if (preview) {
      res.setHeader("Cache-Control", "no-store");
      if (!(await auth.requireAuth(req))) return json(res, 401, { ok: false, error: "Unauthorized" });
      if (!store.configured()) return json(res, 200, { ok: true, preview: true, initialized: false, startups: seedList() });
      const list = (await su.all()).filter(r => !r.archived);
      return json(res, 200, { ok: true, preview: true, initialized: list.length > 0,
        startups: list.length ? list.map(r => Object.assign({ slug: r.slug, aliases: r.aliases || [], order: r.order || 0, state: r.state, visible: !!r.visible }, r.draft)) : seedList() });
    }
    res.setHeader("Cache-Control", "public, max-age=0, s-maxage=30, stale-while-revalidate=60");
    if (!store.configured()) return json(res, 200, { ok: true, initialized: false, startups: seedList() });
    const out = await su.publicList();
    const list = out.initialized ? out.startups : seedList();
    const valid = await certs.publicBySlug().catch(() => ({}));       // a failed certificate read never hides the ventures
    list.forEach(v => { if (valid[v.slug]) v.certificate = valid[v.slug]; });
    return json(res, 200, { ok: true, initialized: out.initialized, startups: list });
  } catch (e) {
    console.error("startups read failed:", e.message);
    res.setHeader("Cache-Control", "no-store");
    return json(res, 500, { ok: false, error: "Could not read startups" });
  }
};
