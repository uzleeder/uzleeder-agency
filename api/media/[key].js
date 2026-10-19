// GET /api/media/<key> — public: serves an uploaded image / video / document from Vercel Blob.
//   med_… (direct browser uploads, any size): redirect to a short-lived signed CDN link — big files and video seeking work.
//   img_… (older small uploads): streamed through this function, as before.
const { Readable } = require("stream");
const store = require("../_lib/store");

module.exports = async (req, res) => {
  const key = String((req.query && req.query.key) || "");
  if (!/^(img|med)_[a-z0-9]+\.[a-z0-9]+$/i.test(key)) { res.statusCode = 400; return res.end("Bad key"); }
  if (!store.configured()) { res.statusCode = 404; return res.end("Not found"); }
  if (key.startsWith("med_")) {
    try {
      const url = await store.signedMediaUrl(key);
      if (url) {
        res.statusCode = 302;
        res.setHeader("Location", url);
        res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
        return res.end();
      }
    } catch (e) { console.error("signed media link failed, streaming instead:", e.message); }
  }
  try {
    // Range requests (video seeking) are passed through when the storage answers with a partial response
    const range = /^bytes=\d*-\d*$/.test(String(req.headers && req.headers.range || "")) ? req.headers.range : "";
    const file = await store.getMedia(key, range);
    if (!file) { res.statusCode = 404; return res.end("Not found"); }
    const cr = file.headers && file.headers.get && file.headers.get("content-range");
    const len = file.headers && file.headers.get && file.headers.get("content-length");
    res.statusCode = cr ? 206 : 200;
    if (cr) res.setHeader("Content-Range", cr);
    if (len) res.setHeader("Content-Length", len);
    res.setHeader("Accept-Ranges", "bytes");
    res.setHeader("Content-Type", (file.blob && file.blob.contentType) || (file.headers && file.headers.get && file.headers.get("content-type")) || "application/octet-stream");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.setHeader("X-Content-Type-Options", "nosniff");
    if (/svg/.test((file.blob && file.blob.contentType) || "")) res.setHeader("Content-Security-Policy", "default-src 'none'; style-src 'unsafe-inline'");
    Readable.fromWeb(file.stream).pipe(res);
  } catch (e) {
    console.error("media read failed:", e.message);
    res.statusCode = 404; res.end("Not found");
  }
};
