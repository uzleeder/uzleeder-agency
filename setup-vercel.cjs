// UzLeeder — one-command Vercel setup (Node.js version).
//   node setup-vercel.cjs        (or: npm run setup)
// 1) makes sure a private Vercel Blob store is connected
// 2) ADMIN_PASSWORD=auto in .env → creates a strong password on this computer, shows it once, saves it in .env
// 3) uploads every non-empty key from .env to Vercel (Production + Preview), secrets as Sensitive
// 4) deploys to production
// Needs: vercel CLI logged in (vercel login). Nothing here is ever deployed (.vercelignore).
"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { spawnSync } = require("child_process");

const ROOT = __dirname;
const ENV_FILE = path.join(ROOT, ".env");
const c = { cyan: s => "\x1b[36m" + s + "\x1b[0m", green: s => "\x1b[32m" + s + "\x1b[0m", yellow: s => "\x1b[33m" + s + "\x1b[0m", red: s => "\x1b[31m" + s + "\x1b[0m", gray: s => "\x1b[90m" + s + "\x1b[0m" };

// run the vercel CLI; values are passed as separate arguments (no shell string building)
function vercel(args, opts = {}) {
  const cmd = process.platform === "win32" ? "vercel.cmd" : "vercel";
  const r = spawnSync(cmd, args, { cwd: ROOT, encoding: "utf8", shell: process.platform === "win32", stdio: opts.show ? "inherit" : "pipe" });
  if (r.error) { console.error(c.red("Could not run the Vercel CLI. Install it with:  npm i -g vercel")); process.exit(1); }
  return { ok: r.status === 0, out: (r.stdout || "") + (r.stderr || "") };
}
// Windows cmd needs quoting for values with special characters
const arg = v => (process.platform === "win32" ? '"' + String(v).replace(/"/g, '\\"') + '"' : String(v));

if (!fs.existsSync(ENV_FILE)) { console.error(c.red("No .env file found in " + ROOT)); process.exit(1); }

/* ---------- 0) logged in? ---------- */
const who = vercel(["whoami"]);
if (!who.ok && /log ?in|credentials|token/i.test(who.out)) { console.error(c.red("You are not logged in to Vercel. Run:  vercel login   — then run this again.")); process.exit(1); }

/* ---------- 1) Blob storage ---------- */
console.log(c.cyan("\n[1/4] Blob storage"));
const stores = vercel(["blob", "list-stores"]).out;
if (/No blob stores connected/i.test(stores)) {
  console.log("Creating and connecting a private Blob store 'uzleeder-blob'...");
  vercel(["blob", "create-store", "uzleeder-blob", "--access", "private", "--environment", "production", "--environment", "preview", "--yes"], { show: true });
} else console.log(c.green("A Blob store is already connected."));

/* ---------- 2) admin password ---------- */
console.log(c.cyan("\n[2/4] Admin password"));
let envText = fs.readFileSync(ENV_FILE, "utf8");
if (/^ADMIN_PASSWORD=auto\s*$/m.test(envText)) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const body = Array.from(crypto.randomBytes(16), b => chars[b % chars.length]).join("");
  const pw = "Uzl-" + body + "-" + crypto.randomInt(10, 100);
  envText = envText.replace(/^ADMIN_PASSWORD=auto\s*$/m, "ADMIN_PASSWORD=" + pw);
  fs.writeFileSync(ENV_FILE, envText);
  console.log(c.yellow("\n  NEW ADMIN PASSWORD:  " + pw));
  console.log(c.yellow("  (also saved in .env — write it down somewhere safe)\n"));
} else console.log(c.gray("ADMIN_PASSWORD is not \"auto\" — using the value in .env (or keeping Vercel's if empty)."));

/* ---------- 3) environment keys ---------- */
console.log(c.cyan("\n[3/4] Environment keys"));
const SENSITIVE = /PASSWORD|SECRET|TOKEN/;
let failed = 0;
envText.split(/\r?\n/).forEach(line => {
  const m = /^\s*([A-Z_]+)=(.*)$/.exec(line);
  if (!m) return;
  const key = m[1], value = m[2].trim().replace(/^"|"$/g, "");
  if (!value) { console.log(c.gray("  " + key + "  (empty — kept as it is on Vercel)")); return; }
  if (key === "BLOB_READ_WRITE_TOKEN") { console.log(c.gray("  " + key + "  (managed by the Blob store connection)")); return; }
  for (const target of ["production", "preview"]) {
    const r = vercel(["env", "add", key, target, "--value", arg(value), "--force", SENSITIVE.test(key) ? "--sensitive" : "--no-sensitive", "--yes"]);
    if (r.ok) console.log(c.green("  " + key + " -> " + target));
    else { failed++; console.log(c.red("  " + key + " -> " + target + " FAILED")); console.log(c.gray("    " + r.out.trim().split("\n").slice(-2).join(" ").replace(value, "***"))); }
  }
});
if (failed) { console.error(c.red("\nSome keys failed — nothing was deployed. Fix the error above and run again.")); process.exit(1); }

/* ---------- 4) deploy ---------- */
console.log(c.cyan("\n[4/4] Deploy"));
const dep = vercel(["deploy", "--prod", "--yes"], { show: true });
if (!dep.ok) { console.error(c.red("Deploy failed — see the output above.")); process.exit(1); }
console.log(c.green("\nDone. Admin: https://uzleeder.vercel.app/admin"));
