// Builds dist/ — the ONLY folder Netlify publishes as static files.
// Same exclusions as .vercelignore, plus: api/ (server code — Netlify bundles it into functions), every dotfile/dot-folder
// at any depth (.env, .env.local, .vercel, .claude …), package files and host configs. Fails if anything secret slips in.
// Run: node build/netlify-dist.cjs   (Netlify runs it as the build command)
const fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, ".."), OUT = path.join(ROOT, "dist");

const ignore = fs.readFileSync(path.join(ROOT, ".vercelignore"), "utf8").split(/\r?\n/).map(s => s.trim()).filter(s => s && !s.startsWith("#"));
const extra = ["api/", "dist/", "package.json", "package-lock.json", "vercel.json", "netlify.toml", "*.cjs", "*.md", "zz-*"];
const patterns = ignore.concat(extra).map(p => {
  const dir = p.endsWith("/"), body = (dir ? p.slice(0, -1) : p).replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, "[^/]*");
  return { dir, re: new RegExp("^" + body + "$") };
});
const denied = (name, isDir) => name.startsWith(".") || patterns.some(p => p.re.test(name) && (!p.dir || isDir));

fs.rmSync(OUT, { recursive: true, force: true });
let files = 0, bytes = 0;
function copy(src, dst, top) {
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    if (e.name.startsWith(".") || (top && denied(e.name, e.isDirectory()))) continue;
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    if (e.isDirectory()) { fs.mkdirSync(d, { recursive: true }); copy(s, d, false); }
    else if (e.isFile()) { fs.mkdirSync(dst, { recursive: true }); fs.copyFileSync(s, d); files++; bytes += fs.statSync(s).size; }
  }
}
copy(ROOT, OUT, true);

// safety net: nothing that looks like a secret or server source may be published
const bad = [];
(function scan(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name), rel = path.relative(OUT, p).replace(/\\/g, "/");
    if (e.isDirectory()) { if (/^(api|server|build|archive|netlify|node_modules)$/.test(rel)) bad.push(rel + "/"); scan(p); continue; }
    if (/(^|\/)\.env|\.pem$|\.key$|credential|secret/i.test(rel)) bad.push(rel);
  }
})(OUT);
if (bad.length) { console.error("Refusing to publish:", bad.join(", ")); process.exit(1); }
console.log("dist/:", files, "files,", Math.round(bytes / 1024 / 1024 * 10) / 10, "MB");
