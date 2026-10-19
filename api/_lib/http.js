// Small helpers shared by the Vercel functions.
function json(res, status, obj) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}

// Vercel parses JSON bodies into req.body; fall back to the raw stream just in case.
async function body(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body || "{}");
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function onlyPost(req, res) {
  if (req.method === "POST") return true;
  res.setHeader("Allow", "POST");
  json(res, 405, { ok: false, error: "Method not allowed" });
  return false;
}

// coarse request context for the security log (never stored for public visitors)
function client(req) {
  const h = req.headers || {};
  return {
    ip: String(h["x-forwarded-for"] || h["x-real-ip"] || "").split(",")[0].trim() || undefined,
    country: h["x-vercel-ip-country"] || undefined,
    ua: String(h["user-agent"] || "").slice(0, 160) || undefined
  };
}

module.exports = { json, body, onlyPost, client };
