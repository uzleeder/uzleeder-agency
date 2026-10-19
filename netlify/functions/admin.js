// Netlify Function → the same handler Vercel runs (api/admin.js). See netlify/shared/vercel-adapter.js.
exports.handler = require("../shared/vercel-adapter")(require("../../api/admin.js"));
