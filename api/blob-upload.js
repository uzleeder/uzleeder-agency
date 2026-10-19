// POST /api/blob-upload — issues short-lived tokens so the Control Center can upload big files
// (images, videos, PDFs) straight from the browser to Vercel Blob, in parallel parts.
// The file itself never passes through this function, so the 4.5 MB function limit does not apply.
// Admin only: the admin session token travels in `clientPayload` and is verified before any token is issued.
const { handleUpload } = require("@vercel/blob/client");
const { json, body } = require("./_lib/http");
const auth = require("./_lib/auth");
const store = require("./_lib/store");

const TYPES = [
  "image/png", "image/jpeg", "image/webp", "image/gif", "image/avif", "image/svg+xml",
  "video/mp4", "video/webm", "video/quicktime", "video/x-m4v", "video/ogg",
  "application/pdf"
];
const WS_TYPES = [
  "image/*", "video/*", "audio/*", "text/*", "application/pdf", "application/json", "application/zip", "application/x-zip-compressed",
  "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/javascript", "application/xml", "application/octet-stream"
];
const MAX = 5* 1024 * 1024 * 1024;          // 5 GB per file; total space follows the Vercel Blob plan

module.exports = async (req, res) => {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return json(res, 405, { error: "Method not allowed" }); }
  if (!store.configured()) return json(res, 503, { error: "Storage is not connected", code: "storage-missing" });
  let data;
  try { data = await body(req); } catch (e) { return json(res, 400, { error: "Bad JSON" }); }
  try {
    const result = await handleUpload({
      body: data,
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        let p = {};
        try { p = JSON.parse(clientPayload || "{}"); } catch (e) {}
        const ok = await auth.requireAuth({ headers: { authorization: "Bearer " + (p.token || "") } });
        if (!ok) throw new Error("Unauthorized");
        // wsf/ = private Workspace files (documents, archives, source) — never served by /api/media
        if (/^wsf\/wsf_[a-z0-9]{8,40}\.[a-z0-9]{1,6}$/.test(pathname))
          return { allowedContentTypes: WS_TYPES, maximumSizeInBytes: MAX, addRandomSuffix: false, allowOverwrite: false, validUntil: Date.now() + 60 * 60 * 1000 };
        if (!/^media\/med_[a-z0-9]{8,40}\.[a-z0-9]{2,5}$/.test(pathname)) throw new Error("Bad file name");
        return { allowedContentTypes: TYPES, maximumSizeInBytes: MAX, addRandomSuffix: false, allowOverwrite: false, validUntil: Date.now() + 60 * 60 * 1000 };
      }
    });
    return json(res, 200, result);
  } catch (e) {
    const unauthorized = /unauthorized/i.test(e.message);
    return json(res, unauthorized ? 401 : 400, { error: e.message });
  }
};
