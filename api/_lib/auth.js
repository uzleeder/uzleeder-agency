// Admin auth for the Vercel functions: HMAC-signed token (JWT-like), Node's built-in crypto only.
// Unlike the Netlify copy there is NO fallback secret — without ADMIN_SECRET, admin endpoints refuse to work,
// so a token can never be forged with a publicly known default key.
//
// Password: ADMIN_PASSWORD (env) is the starting password. Once Max changes it in the Control Center,
// a scrypt hash is stored privately in Blob (auth/credential.json) and replaces the env password.
// Every change bumps a version number that is baked into tokens, so all other sessions end at once.
// Forgotten password: delete auth/credential.json in the Blob store → ADMIN_PASSWORD works again.
const crypto = require("crypto");
const store = require("./store");

const secret = () => process.env.ADMIN_SECRET || "";
const configured = () => secret().length >= 16 && (!!process.env.ADMIN_PASSWORD || store.configured());

const b64url = buf => Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const hmac = payload => b64url(crypto.createHmac("sha256", secret()).update(payload).digest());
const safeEqual = (a, b) => {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

/* ---------- stored credential (cached briefly per function instance) ---------- */
let cache = null, cacheAt = 0;
async function credential() {
  if (!store.configured()) return null;
  if (Date.now() - cacheAt < 20000) return cache;
  cache = await store.getCredential().catch(() => cache);
  cacheAt = Date.now();
  return cache;
}
const scrypt = (pw, salt) => new Promise((res, rej) => crypto.scrypt(String(pw), salt, 64, (e, k) => (e ? rej(e) : res(k.toString("hex")))));

async function checkPassword(pw) {
  if (!pw || typeof pw !== "string") return false;
  const cred = await credential();
  if (cred && cred.hash) return safeEqual(await scrypt(pw, cred.salt), cred.hash);
  return !!process.env.ADMIN_PASSWORD && safeEqual(pw, process.env.ADMIN_PASSWORD);
}
async function setPassword(pw) {
  const prev = await credential();
  const salt = crypto.randomBytes(16).toString("hex");
  const cred = { hash: await scrypt(pw, salt), salt, v: ((prev && prev.v) || 0) + 1, changedAt: new Date().toISOString() };
  await store.setCredential(cred);
  cache = cred; cacheAt = Date.now();
  return cred;
}
async function version() { const c = await credential(); return (c && c.v) || 0; }

/* ---------- tokens ---------- */
function sign(payloadObj) {
  const payload = b64url(JSON.stringify(payloadObj));
  return payload + "." + hmac(payload);
}
function verify(token) {
  if (!configured() || !token || typeof token !== "string") return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig || !safeEqual(sig, hmac(payload))) return null;
  let obj;
  try { obj = JSON.parse(Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString()); }
  catch (e) { return null; }
  if (!obj.exp || Date.now() > obj.exp) return null;
  return obj;
}
async function issue(exp) { return sign({ role: "admin", exp, v: await version() }); }

// valid signature + not expired + issued after the latest password change
async function requireAuth(req) {
  const h = (req.headers && req.headers.authorization) || "";
  const obj = verify(h.replace(/^Bearer\s+/i, ""));
  if (!obj) return null;
  if ((obj.v || 0) !== (await version())) return null;
  return obj;
}

module.exports = { sign, verify, issue, requireAuth, configured, safeEqual, checkPassword, setPassword, credential };
