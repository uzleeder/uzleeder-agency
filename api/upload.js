// POST /api/upload — admin only: takes a data-URL image or PDF, stores it in Vercel Blob and returns /api/media/<key>.
// Vercel limits request bodies to 4.5 MB, so files are capped at 3 MB (≈4 MB once base64-encoded).
const crypto = require("crypto");
const { json, body, onlyPost } = require("./_lib/http");
const { requireAuth } = require("./_lib/auth");
const store = require("./_lib/store");

const MAX_BYTES = 3 * 1024 * 1024;
const TYPES = /^(image\/(png|jpe?g|webp|gif|avif|svg\+xml)|application\/pdf)$/;

module.exports = async (req, res) => {
  if (!onlyPost(req, res)) return;
  if (!(await requireAuth(req))) return json(res, 401, { error: "Unauthorized" });
  if (!store.configured()) return json(res, 503, { error: "Storage is not connected", code: "storage-missing" });
  let data;
  try { data = await body(req); } catch (e) { return json(res, 413, { error: "File too large (max 3MB)" }); }
  const m = /^data:([\w.+/-]+);base64,(.+)$/.exec(data.dataUrl || "");
  if (!m) return json(res, 400, { error: "Invalid file data" });
  const contentType = m[1];
  if (!TYPES.test(contentType)) return json(res, 400, { error: "Only images and PDF documents are allowed" });
  const buffer = Buffer.from(m[2], "base64");
  if (buffer.length > MAX_BYTES) return json(res, 413, { error: "File too large (max 3MB)" });
  const ext = contentType === "application/pdf" ? "pdf" : contentType.split("/")[1].replace("+xml", "").replace("jpeg", "jpg");
  const key = "img_" + Date.now().toString(36) + crypto.randomBytes(4).toString("hex") + "." + ext;
  const name = String(data.name || "").replace(/[^\w.\- ]/g, "").slice(0, 80);
  try {
    const url = await store.saveMedia(key, buffer, contentType);
    await store.log({ action: "media.upload", object: name || key, detail: Math.round(buffer.length / 1024) + " KB · " + contentType });
    return json(res, 200, { ok: true, url, key, size: buffer.length, contentType });
  } catch (e) {
    console.error("upload failed:", e);
    return json(res, 500, { error: "Upload failed", detail: e.message });
  }
};
