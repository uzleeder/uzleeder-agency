// Builds the brand/ folder: every logo, emblem, stamp and icon in every colour template of the Control Center.
//   node server/build-brand.cjs            (SVG + gallery)
//   node server/build-brand.cjs --png      (also PNG exports through headless Edge/Chrome)
// Template colours are read from admin.html (PRESETS), so the folder always matches the Design page.
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { spawnSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "brand");

/* ---------- templates from admin.html ---------- */
const admin = fs.readFileSync(path.join(ROOT, "admin.html"), "utf8");
const a = admin.indexOf("const NEUTRAL"), b = admin.indexOf("function customPreset");
const PRESETS = vm.runInNewContext(admin.slice(a, b) + ";PRESETS");

/* ---------- source artwork (Bold Red originals) ---------- */
const src = f => fs.readFileSync(path.join(ROOT, f), "utf8");
const SRC = { mark: src("logo-mark.svg"), white: src("logo-mark-white.svg"), mono: src("logo-mark-dark.svg"), icon: src("icon.svg"), emblem: src("emblem.svg"), stamp: src("emblem-stamp.svg") };
const recolor = (svg, map) => Object.keys(map).reduce((s, from) => s.split(from).join(map[from]).split(from.toUpperCase()).join(map[from]), svg);

function assets(p) {
  const o = p.o, L = o.light, B = o.brand, INK = o.ink;
  const lockup = (bg, word1, word2, tag, mark) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 330 96" role="img" aria-label="UzLeeder — For Leaders">` +
    (bg ? `<rect width="330" height="96" rx="14" fill="${bg}"/>` : "") +
    `<g transform="translate(18 18) scale(1.36)"><path d="M4 41 24 5l20 36" fill="none" stroke="${mark[0]}" stroke-width="7" stroke-miterlimit="10"/><path d="M14 41 24 23l10 18" fill="none" stroke="${mark[1]}" stroke-width="5.5" stroke-miterlimit="10"/></g>` +
    `<text x="92" y="56" font-family="Outfit,'Segoe UI',Arial,sans-serif" font-size="40" font-weight="800" letter-spacing="-.5"><tspan fill="${word1}">Uz</tspan><tspan fill="${word2}">Leeder</tspan></text>` +
    `<text x="94" y="78" font-family="Consolas,'Cascadia Mono',monospace" font-size="11.5" letter-spacing="5" fill="${tag}">FOR LEADERS</text></svg>\n`;
  const isRed = p.id === "bold-red";
  return {
    "logo-mark.svg": isRed ? SRC.mark : recolor(SRC.mark, { "#e5243b": L, "#1c2233": INK }).replace("(Bold Red)", "(" + p.name + ")"),
    "logo-mark-white.svg": SRC.white,
    "logo-mark-mono.svg": recolor(SRC.mono, { "#1c2233": INK }),
    "icon.svg": isRed ? SRC.icon : recolor(SRC.icon, { "#1c2233": INK, "#e5243b": B }),
    "emblem.svg": isRed ? SRC.emblem : recolor(SRC.emblem, { "#1c2233": INK, "#f0384e": B }).replace("Bold Red edition", p.name + " edition"),
    "emblem-stamp.svg": isRed ? SRC.stamp : recolor(SRC.stamp, { "#e01e37": L, "#1c2233": INK }),
    "logo-lockup.svg": lockup(null, INK, isRed ? "#e5243b" : L, "#8b92a1", [isRed ? "#e5243b" : L, INK]),
    "logo-lockup-dark.svg": lockup(o.bg || "#07090d", "#ffffff", B, "#9098a8", [B, o.markInnerDark || "#ffffff"])
  };
}

/* ---------- write SVGs ---------- */
fs.mkdirSync(OUT, { recursive: true });
const manifest = [];
for (const p of PRESETS) {
  const dir = path.join(OUT, p.id);
  fs.mkdirSync(dir, { recursive: true });
  const files = assets(p);
  Object.entries(files).forEach(([n, svg]) => fs.writeFileSync(path.join(dir, n), svg));
  manifest.push({ id: p.id, name: p.name, note: p.note, colors: { brand: p.o.brand, light: p.o.light, ink: p.o.ink, bg: p.o.bg }, files: Object.keys(files) });
}
// shared bitmaps used by the live site (Bold Red)
for (const f of ["og-image.png", "apple-touch-icon.png"]) fs.copyFileSync(path.join(ROOT, f), path.join(OUT, "bold-red", f));

/* ---------- optional PNG exports ---------- */
if (process.argv.includes("--png")) {
  const browsers = ["C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "C:/Program Files/Microsoft/Edge/Application/msedge.exe", "C:/Program Files/Google/Chrome/Application/chrome.exe"];
  const exe = browsers.find(f => fs.existsSync(f));
  if (!exe) console.log("No Edge/Chrome found — skipping PNG export.");
  else {
    const tmp = path.join(OUT, ".tmp.html");
    const jobs = [["logo-mark.svg", 512, 470], ["icon.svg", 512, 512], ["emblem.svg", 1024, 1024], ["emblem-stamp.svg", 1024, 1024], ["logo-lockup.svg", 1320, 384], ["logo-lockup-dark.svg", 1320, 384]];
    for (const p of PRESETS) for (const [f, w, h] of jobs) {
      const svg = fs.readFileSync(path.join(OUT, p.id, f), "utf8");
      fs.writeFileSync(tmp, `<!doctype html><html><head><style>*{margin:0}html,body{width:${w}px;height:${h}px;overflow:hidden;background:transparent}svg{display:block;width:${w}px;height:${h}px}</style></head><body>${svg}</body></html>`);
      const png = path.join(OUT, p.id, f.replace(".svg", ".png"));
      spawnSync(exe, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1", "--default-background-color=00000000",
        `--window-size=${w},${h}`, "--virtual-time-budget=1500", "--screenshot=" + png, "file:///" + tmp.replace(/\\/g, "/")], { stdio: "ignore" });
      process.stdout.write(fs.existsSync(png) ? "." : "x");
    }
    fs.rmSync(tmp, { force: true });
    manifest.forEach(m => { m.png = fs.readdirSync(path.join(OUT, m.id)).filter(n => n.endsWith(".png")); });
    console.log("");
  }
}

// list PNG exports that exist (also when this run skipped --png)
manifest.forEach(m => { m.png = fs.readdirSync(path.join(OUT, m.id)).filter(n => n.endsWith(".png")); });

/* ---------- gallery page + README ---------- */
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const darkBg = f => /white|dark|icon|emblem\.svg/.test(f);
const gallery = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><meta name="robots" content="noindex, nofollow"/>
<title>UzLeeder Brand Kit</title><link rel="icon" href="/icon.svg"/>
<style>
:root{--bg:#0b0e14;--card:#10141c;--line:rgba(255,255,255,.1);--text:#f2f4f8;--muted:#9098a8}
*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',system-ui,sans-serif;background:var(--bg);color:var(--text);padding:clamp(16px,4vw,48px)}
h1{font-size:clamp(1.6rem,4vw,2.4rem);margin-bottom:6px}p.lead{color:var(--muted);margin-bottom:28px;max-width:720px}
nav{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:32px}nav a{padding:6px 12px;border:1px solid var(--line);border-radius:999px;color:var(--text);text-decoration:none;font-size:.86rem}
section{margin-bottom:44px}h2{display:flex;align-items:center;gap:12px;font-size:1.25rem;margin-bottom:4px}h2 i{width:18px;height:18px;border-radius:50%;display:inline-block}
.note{color:var(--muted);font-size:.86rem;margin-bottom:14px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px}
.card{border:1px solid var(--line);border-radius:12px;overflow:hidden;background:var(--card)}
.pv{height:150px;display:grid;place-items:center;padding:18px;background:#fff}.pv.d{background:#07090d}.pv img{max-width:100%;max-height:112px}
.meta{padding:10px 12px;font-size:.8rem;display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap}.meta a{color:#ff8a98}
</style></head><body>
<h1>UzLeeder Brand Kit</h1>
<p class="lead">Every logo, emblem, stamp and icon in every colour template of the Control Center (Design page). Click a file to open it; right-click → Save to download. SVG files scale to any size.</p>
<p style="margin:-12px 0 24px"><a href="/brand/UzLeeder-Official-Design.pdf" download style="display:inline-block;padding:10px 16px;border-radius:10px;background:#f0384e;color:#fff;font-weight:700;text-decoration:none">Download UzLeeder Official Design (PDF)</a> <a href="/brand/UzLeeder-Official-Design.html" style="color:#ff8a98;margin-left:10px">Open the guide</a></p>
<nav>${manifest.map(m => `<a href="#${m.id}">${esc(m.name)}</a>`).join("")}</nav>
${manifest.map(m => `<section id="${m.id}"><h2><i style="background:${m.colors.brand}"></i>${esc(m.name)}</h2><p class="note">${esc(m.note)} · brand ${m.colors.brand} · light ${m.colors.light} · ink ${m.colors.ink}</p><div class="grid">
${m.files.map(f => `<div class="card"><div class="pv${darkBg(f) ? " d" : ""}"><img src="/brand/${m.id}/${f}" alt="${esc(m.name + " " + f)}" loading="lazy"/></div><div class="meta"><span>${f}</span><span><a href="/brand/${m.id}/${f}" download>SVG</a>${(m.png || []).includes(f.replace(".svg", ".png")) ? ` · <a href="/brand/${m.id}/${f.replace(".svg", ".png")}" download>PNG</a>` : ""}</span></div></div>`).join("\n")}
</div></section>`).join("\n")}
</body></html>
`;
fs.writeFileSync(path.join(OUT, "index.html"), gallery);
fs.writeFileSync(path.join(OUT, "README.md"), `# UzLeeder Brand Kit

All brand artwork in every colour template of the Control Center → Design page.
Open \`brand/index.html\` (or https://uzleeder.vercel.app/brand/) to browse and download.

| Folder | Template |
|---|---|
${manifest.map(m => `| \`${m.id}/\` | ${m.name} — ${m.note} (brand ${m.colors.brand}) |`).join("\n")}

Files in each folder:

- \`logo-mark.svg\` — Λ mark for light backgrounds
- \`logo-mark-white.svg\` — white Λ for dark backgrounds
- \`logo-mark-mono.svg\` — one-colour Λ (ink)
- \`logo-lockup.svg\` / \`logo-lockup-dark.svg\` — Λ + "UzLeeder" + "FOR LEADERS"
- \`icon.svg\` — app / favicon tile
- \`emblem.svg\` — official round emblem
- \`emblem-stamp.svg\` — document stamp (transparent)
- \`*.png\` — bitmap exports (logo 512, icon 512, emblem & stamp 1024, lockups 1320×384)
- \`bold-red/og-image.png\`, \`bold-red/apple-touch-icon.png\` — the images the live site uses

Regenerate after changing templates: \`node server/build-brand.cjs --png\`
`);
console.log("brand/ written:", manifest.length, "templates ×", manifest[0].files.length, "SVG files");
