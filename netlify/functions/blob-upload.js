// Direct browser→storage uploads are a Vercel Blob feature. On Netlify the Control Center and Workspace
// fall back to the in-function upload (files up to about 3 MB).
exports.handler = async () => ({ statusCode: 501, headers: { "content-type": "application/json" }, body: JSON.stringify({ ok: false, error: "Direct uploads are not available on this host. Files up to 3 MB upload normally." }) });
