// POST /api/login — exchanges the admin password (changed one, else ADMIN_PASSWORD) for a 12-hour admin token. Every attempt is written to the activity log.
const { json, body, onlyPost, client } = require("./_lib/http");
const auth = require("./_lib/auth");
const store = require("./_lib/store");

const SESSION_MS = 12 * 60 * 60 * 1000;

module.exports = async (req, res) => {
  if (!onlyPost(req, res)) return;
  if (!auth.configured()) return json(res, 500, { error: "Admin is not configured (ADMIN_PASSWORD / ADMIN_SECRET)", code: "admin-missing" });
  let data;
  try { data = await body(req); } catch (e) { return json(res, 400, { error: "Bad JSON" }); }
  const ctx = client(req);
  if (!(await auth.checkPassword(data.password))) {
    await store.log({ actor: "Unknown", action: "security.login_failed", object: "Admin sign-in", detail: [ctx.country, ctx.ip].filter(Boolean).join(" · "), level: "warning" });
    await new Promise(r => setTimeout(r, 600));                     // slows down password guessing
    return json(res, 401, { ok: false, error: "Wrong password" });
  }
  const exp = Date.now() + SESSION_MS;
  await store.log({ action: "security.login", object: "Admin sign-in", detail: [ctx.country, ctx.ua && ctx.ua.split(")")[0] + ")"].filter(Boolean).join(" · ") });
  return json(res, 200, { ok: true, token: await auth.issue(exp), exp });
};
