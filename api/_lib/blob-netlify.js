// Netlify Blobs behind the small @vercel/blob surface that store.js / ws.js / certs.js / partners.js use
// (put · list · get · del · head), so the same server code runs on Netlify.
// Used when UZL_BLOB_DRIVER=netlify (set by netlify/shared/vercel-adapter.js before any handler loads).
//   · create-only writes (allowOverwrite:false) use onlyIfNew → atomic, like Vercel's "This blob already exists"
//   · uploadedAt / size / contentType live in each blob's metadata (list() reads them for newest-first sorting)
//   · no signed CDN links on Netlify: issueSignedToken throws, and callers already fall back to streaming
const { getStore } = require("@netlify/blobs");

const STORE = process.env.UZL_NETLIFY_STORE || "uzleeder";
// strong consistency: a write is visible to the very next read (records, numbering, partner revisions rely on it)
// Inside Netlify Functions the context comes from the runtime. Maintenance scripts run elsewhere pass the site and a token.
const store = () => getStore(Object.assign({ name: STORE, consistency: "strong" },
  process.env.UZL_NETLIFY_SITE_ID && process.env.UZL_NETLIFY_TOKEN ? { siteID: process.env.UZL_NETLIFY_SITE_ID, token: process.env.UZL_NETLIFY_TOKEN } : {}));
const notFound = name => { const e = new Error("The requested blob does not exist"); e.name = "BlobNotFoundError"; e.pathname = name; return e; };
const toInput = data => {
  if (typeof data === "string") return data;
  if (Buffer.isBuffer(data)) return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
  if (data instanceof Uint8Array) return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
  if (data instanceof ArrayBuffer) return data;
  return String(data);
};
const sizeOf = data => typeof data === "string" ? Buffer.byteLength(data) : (data && (data.byteLength || data.length)) || 0;

async function put(pathname, data, o = {}) {
  const metadata = { uploadedAt: new Date().toISOString(), size: sizeOf(data), contentType: o.contentType || "application/octet-stream" };
  const res = await store().set(pathname, toInput(data), o.allowOverwrite ? { metadata } : { metadata, onlyIfNew: true });
  if (!o.allowOverwrite && res && res.modified === false) throw new Error("This blob already exists");
  return { pathname, url: "netlify-blobs://" + STORE + "/" + pathname, contentType: metadata.contentType };
}

async function list({ prefix = "", limit = 1000, cursor } = {}) {
  const { blobs } = await store().list({ prefix });
  const keys = blobs.map(b => b.key).sort();
  const start = cursor ? Math.max(0, keys.indexOf(cursor) + 1) : 0;
  const page = keys.slice(start, start + limit);
  const out = [];
  for (let i = 0; i < page.length; i += 25) {
    const metas = await Promise.all(page.slice(i, i + 25).map(k => store().getMetadata(k).catch(() => null)));
    metas.forEach((m, j) => {
      if (!m) return;                                    // deleted between list and read
      const md = m.metadata || {};
      out.push({ pathname: page[i + j], url: "netlify-blobs://" + STORE + "/" + page[i + j], size: md.size || 0, uploadedAt: md.uploadedAt || new Date(0).toISOString(), contentType: md.contentType });
    });
  }
  const hasMore = start + limit < keys.length;
  return { blobs: out, hasMore, cursor: hasMore ? page[page.length - 1] : undefined };
}

async function get(pathname) {
  const r = await store().getWithMetadata(pathname, { type: "stream" });
  if (!r) return null;
  const md = r.metadata || {};
  // Netlify Blobs has no byte ranges: the whole file is returned (status 200), which media playback handles
  return { statusCode: 200, stream: r.data, blob: { contentType: md.contentType, size: md.size }, headers: new Headers({ "content-type": md.contentType || "application/octet-stream", "content-length": String(md.size || "") }) };
}

async function del(paths) {
  const list = (Array.isArray(paths) ? paths : [paths]).filter(Boolean);
  for (let i = 0; i < list.length; i += 25) await Promise.all(list.slice(i, i + 25).map(k => store().delete(k)));
}

async function head(pathname) {
  const m = await store().getMetadata(pathname);
  if (!m) throw notFound(pathname);
  const md = m.metadata || {};
  return { pathname, url: null, size: md.size || 0, uploadedAt: md.uploadedAt, contentType: md.contentType };
}

async function issueSignedToken() { throw new Error("Signed links are not available on Netlify — streaming instead."); }
async function presignUrl() { throw new Error("Signed links are not available on Netlify — streaming instead."); }

module.exports = { put, list, get, del, head, issueSignedToken, presignUrl, driver: "netlify" };
