// Runs an unchanged Vercel handler (api/*.js: (req, res) => …) as a Netlify Function (Lambda-style handler).
// One code path for both hosts: the same validation, permissions and storage logic, with Netlify Blobs underneath.
process.env.UZL_BLOB_DRIVER = "netlify";                  // must be set before api/_lib/store.js loads
const { Writable } = require("stream");
const { connectLambda } = require("@netlify/blobs");

const TEXT = /^(application\/(json|javascript|xml)|text\/|image\/svg\+xml)/i;

function makeReq(event) {
  const headers = {};
  Object.entries(event.headers || {}).forEach(([k, v]) => { headers[k.toLowerCase()] = v; });
  // Netlify gives the visitor's address here; the handlers read x-forwarded-for
  if (!headers["x-forwarded-for"] && headers["x-nf-client-connection-ip"]) headers["x-forwarded-for"] = headers["x-nf-client-connection-ip"];
  let raw = event.body || "";
  if (event.isBase64Encoded && raw) raw = Buffer.from(raw, "base64").toString("utf8");
  let body = raw;
  if (/json/i.test(headers["content-type"] || "") && raw) { try { body = JSON.parse(raw); } catch (e) { body = raw; } }
  const query = Object.assign({}, event.queryStringParameters || {});
  return { method: event.httpMethod, headers, query, body, url: event.rawUrl || event.path || "/" };
}

function makeRes() {
  const chunks = [];
  let done;
  const finished = new Promise(r => { done = r; });
  const res = new Writable({ write(c, enc, cb) { chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c, enc)); cb(); } });
  res.statusCode = 200;
  res.headers = {};
  res.setHeader = (k, v) => { res.headers[String(k).toLowerCase()] = v; return res; };
  res.getHeader = k => res.headers[String(k).toLowerCase()];
  res.removeHeader = k => { delete res.headers[String(k).toLowerCase()]; };
  res.writeHead = (s, h) => { res.statusCode = s; Object.entries(h || {}).forEach(([k, v]) => res.setHeader(k, v)); return res; };
  res.on("finish", () => done());
  res.finished = finished;
  res.body = () => Buffer.concat(chunks);
  return res;
}

module.exports = (handler, { legacy = true } = {}) => async (event, context) => {
  if (legacy) connectLambda(event); // Modern Functions supply the full Blobs context, including strong reads.
  const req = makeReq(event), res = makeRes();
  try {
    await handler(req, res);
    if (!res.writableEnded) await Promise.race([res.finished, new Promise(r => setTimeout(r, 25000))]);
  } catch (e) {
    console.error("handler failed:", e && e.stack || e);
    return { statusCode: 500, headers: { "content-type": "application/json" }, body: JSON.stringify({ ok: false, error: "Server error" }) };
  }
  const buf = res.body(), type = String(res.getHeader("content-type") || "");
  const headers = {};
  Object.entries(res.headers).forEach(([k, v]) => { headers[k] = Array.isArray(v) ? v.join(", ") : String(v); });
  const text = !buf.length || TEXT.test(type);
  return { statusCode: res.statusCode, headers, body: text ? buf.toString("utf8") : buf.toString("base64"), isBase64Encoded: !text };
};
