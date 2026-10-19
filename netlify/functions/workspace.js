// Netlify Function → the same handler Vercel runs (api/workspace.js). See netlify/shared/vercel-adapter.js.
exports.handler = require("../shared/vercel-adapter")(require("../../api/workspace.js"));
