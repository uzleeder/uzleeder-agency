// POST /api/track — anonymous first-party analytics beacon from the website (see api/_lib/analytics.js).
// Public, tiny, never returns data. Bots, the signed-in admin and Do-Not-Track visitors are not recorded.
const { body } = require("./_lib/http");
const store = require("./_lib/store");
const { parseVisit } = require("./_lib/analytics");

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") { res.statusCode = 405; res.setHeader("Allow", "POST"); return res.end(); }
  if (!store.configured()) { res.statusCode = 204; return res.end(); }
  let data;
  try {
    data = await body(req);
    if (typeof data === "string") data = JSON.parse(data);
  } catch (e) { res.statusCode = 400; return res.end(); }
  if (JSON.stringify(data || {}).length > 16000) { res.statusCode = 413; return res.end(); }
  try {
    const visit = parseVisit(data, req, null);
    if (visit) await store.saveVisit(visit.day, visit.v, visit);
  } catch (e) { console.error("track failed:", e.message); }
  res.statusCode = 204; res.end();
};
