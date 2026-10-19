// Netlify Function → api/media/[key].js (files from Netlify Blobs, streamed through the function).
exports.handler = require("../shared/vercel-adapter")(require("../../api/media/[key].js"));
