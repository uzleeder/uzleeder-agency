// Builds "UzLeeder Official Design" — the brand guidelines — as a self-contained HTML (A4, printable)
// and a PDF (through headless Edge/Chrome):  node server/build-design-guide.cjs
// Output: brand/UzLeeder-Official-Design.html and brand/UzLeeder-Official-Design.pdf
"use strict";
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "brand");
const read = f => fs.readFileSync(path.join(ROOT, f), "utf8");
// inline an SVG file (drops the XML prolog/comments; ids are made unique per use)
let uid = 0;
const svg = (f, cls) => {
  const n = ++uid;
  let s = read(f).replace(/<\?xml[^>]*>/, "").replace(/<!--[\s\S]*?-->/g, "").trim();
  s = s.replace(/id="([^"]+)"/g, (m, id) => `id="${id}-${n}"`).replace(/href="#([^"]+)"/g, (m, id) => `href="#${id}-${n}"`);
  return s.replace("<svg ", `<svg class="${cls || ""}" `);
};
const VERSION = "2026.09";
const TODAY = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

const COLORS = [
  ["Brand Red", "#E5243B", "229, 36, 59", "The logo colour. Λ mark, wordmark “Leeder”, favicon, documents."],
  ["Red · dark theme", "#F0384E", "240, 56, 78", "Accent on dark backgrounds: buttons, links, highlights, emblem."],
  ["Red · light theme", "#E01E37", "224, 30, 55", "Accent on light backgrounds and paper: documents, stamp."],
  ["Light red", "#FF5468", "255, 84, 104", "Small highlights on dark: kickers, numbers, hover states."],
  ["Ink Navy", "#1C2233", "28, 34, 51", "Inner Λ on light, emblem disc, wordmark “Uz” on paper."],
  ["Deep Black", "#07090D", "7, 9, 13", "Dark background, intro, signature section."],
  ["Surface", "#10141C", "16, 20, 28", "Cards and panels in the dark theme."],
  ["Paper", "#F6F7F9", "246, 247, 249", "Light theme background."],
  ["White", "#FFFFFF", "255, 255, 255", "Inner Λ on dark, text on red buttons."]
];
const TEMPLATES = [
  ["Bold Red", "#F0384E", "#1C2233", "Official identity — the default"], ["Navy + Gold", "#C9A227", "#0B1F3A", "Premium, classic"],
  ["Emerald", "#10B981", "#0F2A24", "Calm, growth"], ["Royal Purple", "#8B5CF6", "#1E1B3A", "Creative, AI"],
  ["Ocean Blue", "#3B82F6", "#0F1D33", "Trust, technology"], ["Sunset Orange", "#F97316", "#2A1A10", "Energy, bold"], ["Monochrome", "#F2F4F8", "#10141F", "Minimal"]
];

// "Crafted by UzLeeder" website signature — static copy of /crafted.js for print (same sizes and colours)
const craftedBadge = dark => {
  const muted = dark ? "#8E97AB" : "#5B6377", ink = dark ? "#FFFFFF" : "#1C2233", red = dark ? "#F0384E" : "#E01E37";
  return `<div style="display:flex;justify-content:center;align-items:center;gap:3mm;padding:6mm 0 7mm">` +
    `<span style="font-family:Consolas,'Cascadia Mono',monospace;font-weight:600;font-size:7.5pt;letter-spacing:.28em;color:${muted}">CRAFTED BY</span>` +
    `<svg viewBox="0 0 48 44" style="width:6.2mm;height:5.7mm;overflow:visible"><path d="M4 41 24 5l20 36" fill="none" stroke="${red}" stroke-width="7" stroke-miterlimit="10"/><path d="M14 41 24 23l10 18" fill="none" stroke="${ink}" stroke-width="5.5" stroke-miterlimit="10"/></svg>` +
    `<span style="font-family:'Outfit',sans-serif;font-weight:800;font-size:12pt;letter-spacing:-.02em;line-height:1"><span style="color:${ink}">Uz</span><span style="color:${red}">Leeder</span></span></div>`;
};

const page = (n, kicker, title, body, dark) => `
<section class="page${dark ? " dark" : ""}">
  <header class="ph"><span class="ph-mark">${svg(dark ? "logo-mark-white.svg" : "logo-mark.svg")}</span><span>UzLeeder Official Design</span><span class="ph-n">${String(n).padStart(2, "0")}</span></header>
  <p class="kicker">${kicker}</p>
  <h2>${title}</h2>
  ${body}
  <footer class="pf"><span>UzLeeder · For Leaders</span><span>v${VERSION}</span></footer>
</section>`;

const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta name="robots" content="noindex"/>
<title>UzLeeder Official Design — Brand Guidelines v${VERSION}</title>
<link rel="icon" href="/icon.svg"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet"/>
<style>
@page{size:A4;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:'Manrope','Segoe UI',system-ui,sans-serif;color:#1C2233;background:#2a2f3a;font-size:11pt;line-height:1.55}
.page{position:relative;width:210mm;min-height:297mm;margin:0 auto 12mm;padding:22mm 18mm 26mm;background:#fff;overflow:hidden;page-break-after:always;break-after:page}
.page.dark{background:#07090D;color:#F2F4F8}
@media print{body{background:none}.page{margin:0;height:297mm;min-height:0}.noprint{display:none!important}}
h1,h2,h3{font-family:'Outfit','Manrope',sans-serif;letter-spacing:-.02em;line-height:1.1}
h2{font-size:26pt;margin-bottom:10mm}
h3{font-size:13pt;margin:0 0 3mm}
p{margin-bottom:3mm}
.kicker{font-family:Consolas,'Cascadia Mono',monospace;font-size:8pt;letter-spacing:.25em;text-transform:uppercase;color:#E01E37;margin-bottom:3mm}
.dark .kicker{color:#FF5468}
.muted{color:#5e6b7d}.dark .muted{color:#9098a8}
.small{font-size:9pt}
.ph{position:absolute;top:9mm;left:18mm;right:18mm;display:flex;align-items:center;gap:3mm;font-size:8pt;color:#8b92a1;font-weight:700;letter-spacing:.04em}
.ph-mark svg{width:6mm;height:5.5mm;display:block}
.ph-n{margin-left:auto;font-family:Consolas,monospace}
.pf{position:absolute;bottom:9mm;left:18mm;right:18mm;display:flex;justify-content:space-between;font-size:7.5pt;color:#8b92a1;border-top:.3mm solid rgba(128,128,128,.25);padding-top:2.5mm}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:7mm}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:6mm}
.grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:5mm}
.box{border:.3mm solid #e4e6eb;border-radius:3mm;padding:6mm}
.dark .box{border-color:rgba(255,255,255,.12)}
.tile{border-radius:3mm;display:grid;place-items:center;padding:8mm;min-height:40mm}
.tile svg{max-width:100%;max-height:32mm}
.tile.l{background:#F6F7F9}.tile.d{background:#07090D}.tile.r{background:#E5243B}.tile.w{background:#fff;border:.3mm solid #e4e6eb}
.cap{font-size:8.5pt;margin-top:2mm}.cap b{display:block;font-size:9.5pt}
ul.list{padding-left:5mm;margin-bottom:3mm}ul.list li{margin-bottom:1.5mm}
.do li::marker{content:"✓  ";color:#16a34a}.dont li::marker{content:"✕  ";color:#E01E37}
table{width:100%;border-collapse:collapse;font-size:9pt}
th{text-align:left;font-family:Consolas,monospace;font-size:7.5pt;letter-spacing:.12em;text-transform:uppercase;color:#8b92a1;font-weight:500;padding:2mm 2mm;border-bottom:.3mm solid #e4e6eb}
td{padding:2.4mm 2mm;border-bottom:.3mm solid #eef0f4;vertical-align:top}
.sw{width:14mm;height:9mm;border-radius:1.5mm;border:.3mm solid rgba(0,0,0,.08)}
.mono{font-family:Consolas,'Cascadia Mono',monospace}
/* cover */
.cover{display:flex;flex-direction:column;justify-content:space-between;background:radial-gradient(70% 55% at 80% 20%,rgba(240,56,78,.22),transparent 70%),#07090D;color:#fff}
.cover .top{display:flex;align-items:center;gap:5mm}
.cover .top svg{width:18mm;height:16.5mm}
.cover .word{font-family:'Outfit',sans-serif;font-weight:800;font-size:26pt;letter-spacing:-.02em;line-height:1}
.cover .word b{color:#F0384E}
.cover .tag{display:block;font-family:Consolas,monospace;font-size:8pt;letter-spacing:.42em;color:#9098a8;margin-top:2mm}
.cover h1{font-size:44pt;line-height:1.02;margin-bottom:6mm}
.cover h1 em{font-style:normal;color:#F0384E}
.cover .em{position:absolute;right:-30mm;bottom:40mm;width:120mm;opacity:.9}
.cover .meta{display:flex;gap:10mm;font-size:9pt;color:#9098a8}
.cover .meta b{display:block;color:#fff;font-size:10pt}
.toc{columns:2;column-gap:10mm;font-size:10.5pt}
.toc li{list-style:none;margin-bottom:3mm;break-inside:avoid;display:flex;gap:3mm}
.toc span{font-family:Consolas,monospace;color:#E01E37;min-width:9mm}
.big{font-family:'Outfit',sans-serif;font-weight:800;letter-spacing:-.03em;line-height:.95}
.construct{position:relative;background:#F6F7F9;border-radius:3mm;padding:8mm;display:grid;place-items:center}
.construct svg{width:70mm;height:64mm}
.clear{position:relative;display:inline-block;padding:12mm;border:.4mm dashed #E01E37;border-radius:2mm}
.clear svg{width:60mm;display:block}
.dontgrid .tile{min-height:30mm;position:relative}
.dontgrid .tile::after{content:"✕";position:absolute;top:2mm;right:3mm;color:#E01E37;font-weight:800}
.typesample{border-bottom:.3mm solid #e4e6eb;padding:4mm 0}
.btn{display:inline-flex;align-items:center;gap:2mm;padding:3mm 6mm;border-radius:2.5mm;font-weight:700;font-size:10pt;border:.3mm solid transparent}
.btn-p{background:#F0384E;color:#fff}.btn-g{border-color:rgba(255,255,255,.2);color:#fff}
.pill{display:inline-block;padding:.8mm 3mm;border-radius:99px;font-size:8pt;font-weight:700;border:.3mm solid rgba(255,255,255,.2)}
.dl{position:fixed;right:6mm;bottom:6mm;display:flex;gap:3mm;z-index:9}
.dl a,.dl button{font:inherit;font-weight:700;font-size:13px;padding:10px 16px;border-radius:10px;border:0;background:#F0384E;color:#fff;text-decoration:none;cursor:pointer}
</style></head>
<body>
<div class="dl noprint"><button type="button" onclick="window.print()">Print / Save as PDF</button></div>

<!-- COVER -->
<section class="page cover">
  <div class="top">${svg("logo-mark-white.svg").replace("<svg ", '<svg style="display:none" ')}${svg("icon.svg")}<div><div class="word">Uz<b>Leeder</b></div><span class="tag">FOR LEADERS</span></div></div>
  <div class="em">${svg("emblem.svg")}</div>
  <div>
    <p class="kicker" style="color:#FF5468">Brand guidelines · v${VERSION}</p>
    <h1>UzLeeder<br/>Official <em>Design.</em></h1>
    <p style="max-width:120mm;color:#c9ced8;font-size:12pt">The complete visual and verbal identity of UzLeeder: logo, emblem, stamp, colours, typography, interface, motion, documents and voice.</p>
  </div>
  <div class="meta"><div><b>Owner</b>Max (Mekhriddin Abdualim), Founder &amp; CEO</div><div><b>Identity</b>Bold Red</div><div><b>Updated</b>${TODAY}</div></div>
</section>

${page(2, "Contents", "What is inside", `
<ol class="toc">
  <li><span>03</span>Brand essence</li><li><span>04</span>Primary logo</li><li><span>05</span>Logo construction &amp; clear space</li>
  <li><span>06</span>Logo versions</li><li><span>07</span>Logo misuse</li><li><span>08</span>Official emblem</li><li><span>09</span>Document stamp</li>
  <li><span>10</span>Colour palette</li><li><span>11</span>Colour templates</li><li><span>12</span>Typography</li><li><span>13</span>Interface elements</li>
  <li><span>14</span>Motion &amp; intro</li><li><span>15</span>Documents</li><li><span>16</span>Digital signature</li><li><span>17</span>Voice &amp; copy</li><li><span>18</span>Languages</li><li><span>19</span>Asset files</li>
</ol>
<div class="box" style="margin-top:12mm"><h3>How to use this guide</h3><p class="muted">Use the files from the brand kit (<span class="mono">/brand</span>) — never redraw the logo. When in doubt, choose the simpler option: the Λ mark, the Bold Red accent and plenty of space. The live website, the Control Center and all documents follow these rules.</p></div>`)}

${page(3, "01 · Brand essence", "Who UzLeeder is", `
<div class="grid2">
  <div><h3>Name</h3><p><b>UzLeeder</b> — written as one word, capital U and L. “Uz” for Uzbekistan, “Leeder” for leaders.</p>
  <h3 style="margin-top:6mm">Slogan</h3><p class="big" style="font-size:22pt">FOR LEADERS</p>
  <h3 style="margin-top:6mm">Positioning</h3><p class="big" style="font-size:18pt">Engineering products for the <span style="color:#E01E37">AI era.</span></p>
  <p class="muted">Websites, business portals and AI automation for your business. Based in Uzbekistan — available for projects worldwide.</p></div>
  <div><h3>Four layers</h3><ul class="list">
    <li><b>Max</b> — Founder &amp; CEO, the human decision-maker.</li><li><b>UzLeeder</b> — the brand and engineering business.</li>
    <li><b>AI Engineering</b> — the AI-assisted method: Understand → Architect → Direct AI → Generate → Review → Test → Ship.</li>
    <li><b>Control Center</b> — the private system that runs the business.</li></ul>
  <h3 style="margin-top:6mm">Brand philosophy</h3><p class="big" style="font-size:24pt;color:#E01E37">SALAAM<br/><span style="color:#1C2233;font-size:14pt;letter-spacing:.3em">NEW ERA</span></p>
  <p class="muted">UzLeeder entering the new era of building with intelligence. Used once, intentionally — never as decoration.</p>
  <h3 style="margin-top:6mm">Principle</h3><p>AI assists. Max directs. Max validates.</p></div>
</div>`)}

${page(4, "02 · Logo", "Primary logo", `
<div class="tile w" style="min-height:70mm">${svg("brand/bold-red/logo-lockup.svg").replace("<svg ", '<svg style="width:150mm;max-height:none" ')}</div>
<div class="grid2" style="margin-top:8mm">
  <div><h3>Lockup</h3><p class="muted">The Λ mark + the wordmark <b>Uz</b><b style="color:#E5243B">Leeder</b> + the slogan <span class="mono">FOR LEADERS</span>. This is the primary logo for the website header, documents and presentations.</p></div>
  <div><h3>The Λ mark</h3><p class="muted">A peak — leadership and direction — drawn as two strokes: the red outer Λ and the inner chevron. Used alone for the favicon, app icon, cursor, avatars and small spaces.</p></div>
</div>
<div class="grid3" style="margin-top:6mm">
  <div class="tile l">${svg("logo-mark.svg")}</div><div class="tile d">${svg("brand/bold-red/logo-lockup-dark.svg").replace("<svg ", '<svg style="width:100%" ')}</div><div class="tile d">${svg("icon.svg")}</div>
</div>
<p class="cap small muted">Mark on light · lockup on dark · app icon</p>`)}

${page(5, "03 · Logo", "Construction & clear space", `
<div class="grid2">
  <div class="construct">
    <svg viewBox="-6 -6 60 56"><defs><pattern id="g" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M4 0H0V4" fill="none" stroke="#dfe3ea" stroke-width=".2"/></pattern></defs>
    <rect x="0" y="0" width="48" height="44" fill="url(#g)"/><rect x="0" y="0" width="48" height="44" fill="none" stroke="#b9c0cc" stroke-width=".25" stroke-dasharray="1 1"/>
    <path d="M4 41 24 5l20 36" fill="none" stroke="#E5243B" stroke-width="7" stroke-miterlimit="10"/><path d="M14 41 24 23l10 18" fill="none" stroke="#1C2233" stroke-width="5.5" stroke-miterlimit="10"/>
    <path d="M4 41 24 5l20 36M14 41 24 23l10 18" fill="none" stroke="#fff" stroke-width=".25"/>
    <circle cx="24" cy="5" r=".8" fill="#fff"/><circle cx="24" cy="23" r=".8" fill="#fff"/></svg>
  </div>
  <div><h3>Geometry (48 × 44 grid)</h3><ul class="list small">
    <li>Outer Λ: points (4,41) → (24,5) → (44,41), stroke <b>7</b>, miter joins.</li>
    <li>Inner chevron: (14,41) → (24,23) → (34,41), stroke <b>5.5</b>.</li>
    <li>Both strokes share the same base line; the inner peak sits exactly half-way.</li>
    <li>Colours: outer <b>Brand Red</b>; inner <b>Ink Navy</b> on light, <b>White</b> on dark.</li></ul>
  <h3 style="margin-top:6mm">Clear space</h3><p class="muted small">Keep empty space around the logo equal to the height of the inner chevron (≈ 40% of the mark height). No text, edges or images inside it.</p>
  <h3 style="margin-top:6mm">Minimum size</h3><p class="muted small">Λ mark: 16 px / 5 mm. Full lockup: 120 px / 32 mm wide. Below that, use the mark alone.</p></div>
</div>
<div style="margin-top:10mm;text-align:center"><span class="clear">${svg("brand/bold-red/logo-lockup.svg")}</span><p class="cap small muted">The dashed line marks the minimum clear space.</p></div>`)}

${page(6, "04 · Logo", "Logo versions", `
<div class="grid3">
  <div><div class="tile l">${svg("logo-mark.svg")}</div><p class="cap"><b>Colour on light</b>Default for paper, light theme, documents.</p></div>
  <div><div class="tile d">${svg("logo-mark-white.svg").replace("<svg ", '<svg style="display:none" ')}<svg viewBox="0 0 48 44" style="width:36mm"><path d="M4 41 24 5l20 36" fill="none" stroke="#F0384E" stroke-width="7" stroke-miterlimit="10"/><path d="M14 41 24 23l10 18" fill="none" stroke="#fff" stroke-width="5.5" stroke-miterlimit="10"/></svg></div><p class="cap"><b>Colour on dark</b>Website dark theme, intro, social.</p></div>
  <div><div class="tile d">${svg("logo-mark-white.svg")}</div><p class="cap"><b>White</b>On photos, video and coloured backgrounds.</p></div>
  <div><div class="tile l">${svg("logo-mark-dark.svg")}</div><p class="cap"><b>One colour (ink)</b>Fax, engraving, one-colour print.</p></div>
  <div><div class="tile r">${svg("logo-mark-white.svg")}</div><p class="cap"><b>White on red</b>Only on Brand Red surfaces.</p></div>
  <div><div class="tile d">${svg("icon.svg")}</div><p class="cap"><b>App icon</b>Rounded ink tile — favicon, home screen, avatar.</p></div>
</div>
<div class="box" style="margin-top:8mm"><h3>Latin always, left to right</h3><p class="muted small">The wordmark is never translated or transliterated. On Persian and Arabic pages the logo stays Latin and left-to-right.</p></div>`)}

${page(7, "05 · Logo", "Logo misuse", `
<div class="grid4 dontgrid">
  <div><div class="tile l"><svg viewBox="0 0 48 44" style="width:26mm;transform:rotate(18deg)"><path d="M4 41 24 5l20 36" fill="none" stroke="#E5243B" stroke-width="7"/><path d="M14 41 24 23l10 18" fill="none" stroke="#1C2233" stroke-width="5.5"/></svg></div><p class="cap">Do not rotate</p></div>
  <div><div class="tile l"><svg viewBox="0 0 48 44" preserveAspectRatio="none" style="width:34mm;height:16mm"><path d="M4 41 24 5l20 36" fill="none" stroke="#E5243B" stroke-width="7"/><path d="M14 41 24 23l10 18" fill="none" stroke="#1C2233" stroke-width="5.5"/></svg></div><p class="cap">Do not stretch</p></div>
  <div><div class="tile l"><svg viewBox="0 0 48 44" style="width:26mm"><path d="M4 41 24 5l20 36" fill="none" stroke="#22c55e" stroke-width="7"/><path d="M14 41 24 23l10 18" fill="none" stroke="#a855f7" stroke-width="5.5"/></svg></div><p class="cap">Do not recolour</p></div>
  <div><div class="tile l"><svg viewBox="0 0 48 44" style="width:26mm;filter:drop-shadow(2px 3px 2px rgba(0,0,0,.6)) blur(.4px)"><path d="M4 41 24 5l20 36" fill="none" stroke="#E5243B" stroke-width="7"/><path d="M14 41 24 23l10 18" fill="none" stroke="#1C2233" stroke-width="5.5"/></svg></div><p class="cap">No shadows or effects</p></div>
  <div><div class="tile l"><svg viewBox="0 0 48 44" style="width:26mm"><path d="M4 41 24 5l20 36" fill="none" stroke="#E5243B" stroke-width="3"/><path d="M14 41 24 23l10 18" fill="none" stroke="#1C2233" stroke-width="2"/></svg></div><p class="cap">Do not change stroke weights</p></div>
  <div><div class="tile l"><svg viewBox="0 0 48 44" style="width:26mm"><path d="M4 41 24 5l20 36" fill="none" stroke="#1C2233" stroke-width="7"/><path d="M14 41 24 23l10 18" fill="none" stroke="#E5243B" stroke-width="5.5"/></svg></div><p class="cap">Do not swap the colours</p></div>
  <div><div class="tile" style="background:linear-gradient(135deg,#f59e0b,#ec4899)"><svg viewBox="0 0 48 44" style="width:26mm"><path d="M4 41 24 5l20 36" fill="none" stroke="#E5243B" stroke-width="7"/><path d="M14 41 24 23l10 18" fill="none" stroke="#1C2233" stroke-width="5.5"/></svg></div><p class="cap">No busy backgrounds</p></div>
  <div><div class="tile l" style="font-family:Georgia,serif;font-size:14pt">👑 UzLeeder</div><p class="cap">No crown — it is retired</p></div>
</div>`)}

${page(8, "06 · Emblem", "Official emblem", `
<div class="grid2">
  <div class="tile d" style="min-height:95mm">${svg("emblem.svg").replace("<svg ", '<svg style="width:80mm;max-height:none" ')}</div>
  <div><h3>What it is</h3><p class="muted">The round seal of UzLeeder: ink-navy disc, red rim and dotted ring, the Λ peak with a white summit, “UZLEEDER” on top, “·FOR·LEADERS·” below and “EST. 2026”.</p>
  <h3 style="margin-top:6mm">Where it is used</h3><ul class="list small"><li>The UzLeeder brand section of the website (the ring rotates slowly; the centre stays still).</li><li>The footer (stamp style, follows the theme).</li><li>Official moments: certificates, awards, social cover images.</li></ul>
  <h3 style="margin-top:6mm">Rules</h3><ul class="list small dont"><li>Not a replacement for the logo in the header.</li><li>Never crop the ring text or change “EST. 2026”.</li><li>Minimum size 18 mm / 64 px so the lettering stays readable.</li></ul></div>
</div>`)}

${page(9, "07 · Stamp", "Document stamp", `
<div class="grid2">
  <div class="tile w" style="min-height:95mm">${svg("emblem-stamp.svg").replace("<svg ", '<svg style="width:78mm;max-height:none;transform:rotate(-8deg);mix-blend-mode:multiply" ')}</div>
  <div><h3>The stamp edition</h3><p class="muted">The emblem without the disc — one ink colour (Red · light theme) with the inner Λ in Ink Navy, on a transparent background, so it prints like a real rubber stamp.</p>
  <h3 style="margin-top:6mm">How to place it</h3><ul class="list small"><li>Bottom right of a document, next to the signature line.</li><li>Rotated −8°, blend mode “multiply”, 30–36 mm wide.</li><li>Only on documents issued by UzLeeder: certificates, service &amp; pricing documents, contracts.</li></ul>
  <div class="box" style="margin-top:6mm"><h3>Honesty rule</h3><p class="muted small">The stamp marks a document as issued <b>by UzLeeder itself</b>. It is not third-party certification and must never be presented as one.</p></div></div>
</div>`)}

${page(10, "08 · Colour", "Colour palette — Bold Red", `
<table><thead><tr><th></th><th>Name</th><th>HEX</th><th>RGB</th><th>Use</th></tr></thead><tbody>
${COLORS.map(([n, h, r, u]) => `<tr><td><div class="sw" style="background:${h}"></div></td><td><b>${n}</b></td><td class="mono">${h}</td><td class="mono">${r}</td><td class="muted">${u}</td></tr>`).join("")}
</tbody></table>
<div class="grid2" style="margin-top:8mm"><div class="box"><h3>Proportion</h3><div style="display:flex;height:9mm;border-radius:1.5mm;overflow:hidden"><i style="flex:60;background:#07090D"></i><i style="flex:25;background:#F6F7F9"></i><i style="flex:10;background:#1C2233"></i><i style="flex:5;background:#F0384E"></i></div><p class="muted small" style="margin-top:3mm">Mostly dark or paper, some ink — red only as the accent (≈5%). Red means “action” or “brand”.</p></div>
<div class="box"><h3>Semantic tokens (code)</h3><p class="mono small">--color-brand · --color-accent · --color-background · --color-surface · --color-text · --color-muted · --color-border · --color-success · --color-warning · --color-danger</p><p class="muted small">The website, the Control Center and the documents use the same tokens.</p></div></div>`)}

${page(11, "09 · Colour", "Colour templates (Control Center)", `
<p class="muted">Bold Red is the official identity. The Control Center → Design page can switch the <b>website</b> to one of these templates, or build a custom design part by part (colours, buttons, cards, corners, hero, menu, sections, spacing, headings). Each template has a dark and a light version and its own brand kit in <span class="mono">/brand</span>.</p>
<div class="grid4" style="margin-top:6mm">
${TEMPLATES.map(([n, a, ink, note]) => `<div class="box" style="padding:0;overflow:hidden"><div style="height:24mm;background:${ink};display:grid;place-items:center"><svg viewBox="0 0 48 44" style="width:14mm"><path d="M4 41 24 5l20 36" fill="none" stroke="${a}" stroke-width="7"/><path d="M14 41 24 23l10 18" fill="none" stroke="#fff" stroke-width="5.5"/></svg></div><div style="padding:3mm 4mm"><b style="font-size:9.5pt">${n}</b><p class="muted small" style="margin:0">${note}</p><p class="mono small" style="margin:0">${a}</p></div></div>`).join("")}
</div>
<div class="box" style="margin-top:8mm"><h3>Rule</h3><p class="muted small">Templates and custom designs change only the website. Official documents — certificates, the services document and contracts — always keep the original Bold Red identity.</p></div>`)}

${page(12, "10 · Typography", "Typography", `
<div class="typesample"><p class="kicker" style="color:#8b92a1">Display · Outfit 700–800</p><p class="big" style="font-size:34pt">Engineering products for the AI era.</p></div>
<div class="typesample"><p class="kicker" style="color:#8b92a1">Body · Manrope 400–700</p><p style="font-size:13pt;max-width:150mm">Websites, business portals and AI automation for your business. We agree the scope, price and delivery plan before development begins.</p></div>
<div class="typesample"><p class="kicker" style="color:#8b92a1">Labels · Monospace (Cascadia Mono / Consolas), uppercase, wide tracking</p><p class="mono" style="letter-spacing:.25em;font-size:10pt">01 — SELECTED WORK · FOR LEADERS</p></div>
<div class="typesample"><p class="kicker" style="color:#8b92a1">Persian &amp; Arabic · Vazirmatn</p><p style="font-size:15pt;direction:rtl;text-align:right">ساخت محصول برای عصر AI — منتجات لعصر الذكاء الاصطناعي</p></div>
<div class="grid2" style="margin-top:6mm"><div><h3>Scale (web)</h3><p class="small muted">Hero 56–88 px · Section title 40–56 px · Card title 20–24 px · Body 16–18 px · Labels 11–12 px.</p></div>
<div><h3>Rules</h3><ul class="list small"><li>Tight tracking on headlines (−2%), none on body text.</li><li>No letter-spacing in Persian or Arabic — it breaks the joins.</li><li>Uppercase only for short labels, never for paragraphs.</li></ul></div></div>`)}

${page(13, "11 · Interface", "Interface elements", `
<div class="box" style="background:#07090D;color:#fff;border:0">
  <div style="display:flex;gap:4mm;flex-wrap:wrap;align-items:center;margin-bottom:6mm"><span class="btn btn-p">Discuss your project →</span><span class="btn btn-g">See real projects</span><span class="pill" style="color:#22c55e;border-color:rgba(34,197,94,.4)">● Live client project</span><span class="pill" style="color:#FF5468;border-color:rgba(240,56,78,.45)">Product available for deployment</span></div>
  <p class="mono" style="font-size:8pt;letter-spacing:.2em;color:#9098a8"><span style="color:#F0384E">01</span> ——— SERVICES</p>
  <p class="big" style="font-size:22pt;margin-bottom:0">Three things UzLeeder builds.</p>
</div>
<div class="grid2" style="margin-top:7mm">
  <div><h3>Buttons</h3><p class="muted small">Primary = red fill, white text, one per view. Secondary = outline. Radius 10 px.</p>
  <h3 style="margin-top:5mm">Section kicker</h3><p class="muted small">Two-digit red number + thin line + uppercase label. Numbers follow the order on the page.</p>
  <h3 style="margin-top:5mm">Status pills</h3><p class="muted small">Only honest statuses: Live client project · Product available for deployment · Demonstration · In development · Private project · Concept · Archived.</p></div>
  <div><h3>Cards</h3><p class="muted small">Surface colour, 1 px border, radius 14–18 px, no heavy shadows; lift 3 px on hover.</p>
  <h3 style="margin-top:5mm">Cursor</h3><p class="muted small">The Λ mark, tilted −28° like a system arrow (22 × 24 px). Colours swap on links.</p>
  <h3 style="margin-top:5mm">Themes</h3><p class="muted small">Dark and light versions of every screen; the visitor’s choice is remembered.</p></div>
</div>`)}

${page(14, "12 · Motion", "Motion & intro", `
<div class="grid2">
  <div class="box" style="background:#07090D;color:#fff;border:0;text-align:center;padding:10mm 4mm"><p class="big" style="font-size:20pt"><span style="color:#F0384E">&lt;</span><span style="color:#fff">Uz</span><span style="color:#F0384E">Leeder</span><span style="color:#F0384E">&gt;</span></p><p class="mono" style="font-size:8pt;letter-spacing:.3em">&lt;FOR LEADERS&gt;</p><p style="margin:6mm 0"><svg viewBox="0 0 48 44" style="width:16mm"><path d="M4 41 24 5l20 36" fill="none" stroke="#F0384E" stroke-width="7"/><path d="M14 41 24 23l10 18" fill="none" stroke="#fff" stroke-width="5.5"/></svg></p><p class="mono" style="font-size:7.5pt;letter-spacing:.3em;color:#9098a8"><b style="color:#fff">AGI</b> <span style="color:#F0384E">//</span> SYSTEM INITIALIZATION → … → READY</p><p class="big" style="font-size:18pt;color:#F0384E;margin-top:4mm">SALAAM</p><p class="mono" style="font-size:8pt;letter-spacing:.4em">NEW ERA</p></div>
  <div><h3>The intro — locked</h3><ol class="list small"><li>“&lt;”, then U·z·L·e·e·d·e·r letter by letter, then “&gt;”.</li><li>“&lt;For leaders&gt;” types in below.</li><li>The brackets fold into the Λ mark.</li><li>System initialization line (V5): “AGI //” + SYSTEM INITIALIZATION · LOADING UZLEEDER · CONNECTING SYSTEMS · HUMAN CONTROL · ON · READY, one segment of a five-part rail per state (no percentages).</li><li>SALAAM / NEW ERA — then the homepage.</li></ol>
  <p class="muted small">The core animation must not be redesigned. Only speed, smoothness and accessibility may improve.</p>
  <h3 style="margin-top:5mm">Everywhere else</h3><ul class="list small"><li>Short, calm transitions (200–600 ms, ease-out).</li><li>Motion explains state; it is never decoration.</li><li>“Reduce motion”: the intro shows the still logo and READY, then opens.</li></ul></div>
</div>`)}

${page(15, "13 · Documents", "Documents", `
<div class="grid2">
  <div class="box" style="padding:0;overflow:hidden;position:relative;min-height:120mm">
    <div style="position:absolute;inset:6mm;border:.3mm solid rgba(224,30,55,.4)"></div>
    <div style="padding:12mm 10mm;position:relative">
      <div style="display:flex;justify-content:center;align-items:center;gap:3mm">${svg("logo-mark.svg").replace("<svg ", '<svg style="width:10mm" ')}<div><div class="big" style="font-size:15pt">Uz<span style="color:#E5243B">Leeder</span></div><div class="mono" style="font-size:6pt;letter-spacing:.35em;color:#8b92a1">FOR LEADERS</div></div></div>
      <p style="text-align:center;font-family:'Outfit';font-weight:800;letter-spacing:.2em;color:#E01E37;font-size:9pt;margin-top:5mm">OFFICIAL SERVICES &amp; PRICING</p>
      <div style="height:1.5mm;background:#eef0f4;margin:4mm 0 2mm"></div><div style="height:1.5mm;background:#eef0f4;width:80%"></div><div style="height:1.5mm;background:#eef0f4;width:90%;margin-top:2mm"></div>
      <div style="position:absolute;right:10mm;bottom:-60mm;width:26mm;transform:rotate(-8deg)">${svg("emblem-stamp.svg")}</div>
    </div>
    <div style="position:absolute;left:50%;top:58%;transform:translate(-50%,-50%);width:50mm;opacity:.05">${svg("logo-mark.svg")}</div>
  </div>
  <div><h3>Layout</h3><ul class="list small"><li>Header: primary lockup, centred.</li><li>Title in spaced uppercase, Red · light theme.</li><li>Thin red inner frame 20 px from the edge.</li><li>Watermark: the Λ mark, very light, in the centre.</li><li>Signature bottom left, stamp bottom right (−8°).</li><li>Serif body (Georgia) for formal text; Segoe/Manrope for tables.</li></ul>
  <h3 style="margin-top:5mm">Co-branding</h3><p class="muted small">With a client (for example UzLeeder × Shokirov) both logos sit side by side at equal visual weight, separated by “×”. The client keeps its own colours.</p>
  <h3 style="margin-top:5mm">Always Bold Red</h3><p class="muted small">Documents never follow website templates: logo, accent, watermark and stamp stay in the original Bold Red identity.</p></div>
</div>`)}

${page(16, "14 · Signature", "Digital signature — Crafted by UzLeeder", `
<p class="muted">The signature at the very bottom of every website UzLeeder builds. It replaces the old crown badge and uses the Λ mark.</p>
<div class="grid2" style="margin-top:4mm">
  <div class="box" style="background:linear-gradient(180deg,#0b1020,#0a0d1a);border:0;padding:0;overflow:hidden">
    <div style="display:flex;justify-content:space-between;align-items:center;padding:6mm 6mm 4mm;border-bottom:.3mm solid rgba(255,255,255,.08)"><span style="font-family:'Outfit';font-weight:800;color:#fff;font-size:10pt">Client Name</span><span style="font-size:7pt;color:#aab2c4">© 2026 Client Name</span></div>
    ${craftedBadge(true)}
  </div>
  <div class="box" style="background:#F6F7F9;border:0;padding:0;overflow:hidden">
    <div style="display:flex;justify-content:space-between;align-items:center;padding:6mm 6mm 4mm;border-bottom:.3mm solid rgba(28,34,51,.1)"><span style="font-family:'Outfit';font-weight:800;color:#10141f;font-size:10pt">Client Name</span><span style="font-size:7pt;color:#5b6377">© 2026 Client Name</span></div>
    ${craftedBadge(false)}
  </div>
</div>
<p class="cap small muted">Dark sites · light sites (sample client footers)</p>
<div class="grid2" style="margin-top:6mm">
  <div><h3>Anatomy</h3><ul class="list small">
    <li><b>CRAFTED BY</b> — monospace, 11 px, uppercase, tracking .28em, muted colour.</li>
    <li><b>Λ mark</b> — 22 × 20 px, the standard two strokes (7 / 5.5).</li>
    <li><b>Wordmark</b> — Outfit 800, 17 px: <b>Uz</b> in ink (white on dark) + <b style="color:#E01E37">Leeder</b> in red.</li>
    <li>Gap 12 px, centred, 14 px above and below. Small size: 9.5 / 18 × 16 / 14 px.</li>
    <li><b>Motion</b> — at rest only the Λ sways around its base (2.8 s loop); “CRAFTED BY” stays still. On hover or focus the wordmark types, like the intro: <span class="mono">&lt;UzLeeder&gt; → &lt;LeeCodes&gt; → &lt;Max's Code&gt;</span>; leaving returns it to the wordmark. Reduce motion: no waving, no typing.</li></ul>
  <table style="margin-top:3mm"><thead><tr><th></th><th>Dark site</th><th>Light site</th></tr></thead><tbody>
    <tr><td>“Crafted by”</td><td class="mono">#8E97AB</td><td class="mono">#5B6377</td></tr>
    <tr><td>“Uz” · inner Λ</td><td class="mono">#FFFFFF</td><td class="mono">#1C2233</td></tr>
    <tr><td>“Leeder” · outer Λ</td><td class="mono">#F0384E</td><td class="mono">#E01E37</td></tr></tbody></table></div>
  <div><h3>How to add it</h3>
  <p class="small">One line in the site's footer (recommended):</p>
  <p class="mono small" style="background:#10141C;color:#d6dbe6;border-radius:2mm;padding:3mm;word-break:break-all">&lt;script src="https://uzleeder.vercel.app/crafted.js" defer&gt;&lt;/script&gt;<br/>&lt;uzleeder-crafted theme="dark"&gt;&lt;/uzleeder-crafted&gt;</p>
  <p class="muted small"><span class="mono">theme</span> dark · light · auto — <span class="mono">align</span> center · start · end — <span class="mono">size</span> md · sm — <span class="mono">fonts="none"</span> skips the Outfit subset. It renders in its own Shadow DOM, so the site's CSS cannot change it. A script-free HTML version is on <span class="mono">/brand/crafted-by.html</span>.</p>
  <h3 style="margin-top:4mm">Rules</h3><ul class="list small do"><li>Only on websites UzLeeder really built — for client sites, agreed in the contract or with the client.</li><li>Small, at the very bottom of the footer: it signs the work, it does not advertise.</li><li>Links to uzleeder.vercel.app; no cookies, no tracking.</li></ul>
  <ul class="list small dont"><li>No crown, no recolouring, no other logo in its place.</li></ul></div>
</div>
<div class="box" style="margin-top:5mm"><h3>Not the same as the project signature</h3><p class="muted small">The Workspace project signature (UZLEEDER · PROJECT COMPLETED / READY FOR DEPLOYMENT / DEMONSTRATION · PROJECT ID · SALAAM NEW ERA.) is an internal delivery mark on a project record. “Crafted by UzLeeder” is the public signature on a live website. Neither is a certification.</p></div>`)}

${page(17, "15 · Voice", "Voice & copy", `
<div class="grid2">
  <div><h3>Tone</h3><p>Confident · technical · clear · human · calm · ambitious. A builder who understands business — not a marketing template.</p>
  <h3 style="margin-top:5mm">Prefer</h3><ul class="list small do"><li>“Real products. Real engineering.”</li><li>“AI-assisted development.”</li><li>“Designed, directed, validated, shipped.”</li><li>Concrete facts: what it is, who it is for, what it does.</li></ul>
  <h3 style="margin-top:5mm">Avoid</h3><ul class="list small dont"><li>“Revolutionary”, “world-class”, “industry-leading”, “passionate developer”.</li><li>Invented clients, numbers, reviews or guarantees.</li><li>Promising perfect AI or unlimited free work.</li></ul></div>
  <div><h3>AI team — how to talk about it</h3><ul class="list small"><li><b>Max</b> — Founder &amp; CEO, the human decision-maker.</li><li><b>Claude</b> — <b>Chief Architect</b> (an AI workflow role).</li><li><b>Codex</b> — AI Coding Engineer; other tools only in roles they really play.</li><li>Always add: AI systems are part of Max’s AI-assisted workflow — not employees or owners.</li></ul>
  <h3 style="margin-top:5mm">Numbers</h3><p class="muted small">Only verified product data (for example 5,653 exercises, 31 topics, 1,100+ airlines) — labelled as product data, never as revenue or results.</p>
  <h3 style="margin-top:5mm">Prices</h3><p class="muted small">Always “from $…”, with the final price fixed in the agreed scope.</p></div>
</div>`)}

${page(18, "16 · Languages", "Languages", `
<table><thead><tr><th>Language</th><th>Address</th><th>Direction</th><th>Role</th></tr></thead><tbody>
<tr><td><b>English</b></td><td class="mono">/en</td><td>LTR</td><td class="muted">International buyers, default</td></tr>
<tr><td><b>O'zbek</b></td><td class="mono">/uz</td><td>LTR</td><td class="muted">Primary market</td></tr>
<tr><td><b>Русский</b></td><td class="mono">/ru</td><td>LTR</td><td class="muted">Regional buyers</td></tr>
<tr><td><b>فارسی</b></td><td class="mono">/fa</td><td>RTL</td><td class="muted">Kept for existing audience</td></tr>
<tr><td><b>العربية</b></td><td class="mono">/ar</td><td>RTL</td><td class="muted">Kept for existing audience</td></tr></tbody></table>
<div class="grid2" style="margin-top:8mm"><div class="box"><h3>Rules</h3><ul class="list small"><li>The logo, “FOR LEADERS” and “SALAAM NEW ERA” stay in Latin letters.</li><li>Right-to-left pages mirror the layout; icons with direction flip.</li><li>Buyer-friendly words, no developer jargon in sales copy.</li></ul></div>
<div class="box"><h3>Translation status</h3><p class="muted small">Uzbek, Russian, Persian and Arabic texts should be reviewed by a native speaker before major campaigns.</p></div></div>`)}

${page(19, "17 · Files", "Asset files", `
<p class="muted">All files are in the project folder <span class="mono">brand/</span> and online at <span class="mono">uzleeder.vercel.app/brand</span> — SVG (any size) and PNG.</p>
<table style="margin-top:4mm"><thead><tr><th>File</th><th>What</th><th>PNG size</th></tr></thead><tbody>
<tr><td class="mono">logo-lockup.svg</td><td>Λ + UzLeeder + FOR LEADERS, for light backgrounds</td><td>1320 × 384</td></tr>
<tr><td class="mono">logo-lockup-dark.svg</td><td>The same on a dark tile</td><td>1320 × 384</td></tr>
<tr><td class="mono">logo-mark.svg</td><td>Λ mark, colour</td><td>512</td></tr>
<tr><td class="mono">logo-mark-white.svg</td><td>Λ mark, white</td><td>—</td></tr>
<tr><td class="mono">logo-mark-mono.svg</td><td>Λ mark, one colour</td><td>—</td></tr>
<tr><td class="mono">icon.svg</td><td>App icon / favicon tile</td><td>512</td></tr>
<tr><td class="mono">emblem.svg</td><td>Official round emblem</td><td>1024</td></tr>
<tr><td class="mono">emblem-stamp.svg</td><td>Document stamp, transparent</td><td>1024</td></tr>
<tr><td class="mono">og-image.png</td><td>Social media preview</td><td>1200 × 630</td></tr>
<tr><td class="mono">apple-touch-icon.png</td><td>Phone home-screen icon</td><td>180</td></tr>
<tr><td class="mono">/crafted.js</td><td>“Crafted by UzLeeder” website signature (embed)</td><td>—</td></tr>
<tr><td class="mono">crafted-by.html</td><td>Signature previews, embed code and plain HTML</td><td>—</td></tr></tbody></table>
<p class="muted small" style="margin-top:4mm">Each template has its own folder: bold-red, navy-gold, emerald, royal, ocean, sunset, mono.</p>
<div class="box" style="margin-top:8mm"><h3>Contact</h3><p class="small">UzLeeder · Tashkent, Uzbekistan · uzleeder@gmail.com · t.me/uzleeder · uzleeder.vercel.app</p><p class="muted small">Questions about the brand go to Max. This guide is updated with every change of the identity.</p></div>`)}
</body></html>
`;

fs.mkdirSync(OUT, { recursive: true });
const htmlFile = path.join(OUT, "UzLeeder-Official-Design.html");
fs.writeFileSync(htmlFile, html);
console.log("HTML:", path.relative(ROOT, htmlFile), Math.round(html.length / 1024) + " KB");

// PDF through headless Edge / Chrome
const exe = ["C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "C:/Program Files/Microsoft/Edge/Application/msedge.exe", "C:/Program Files/Google/Chrome/Application/chrome.exe"].find(f => fs.existsSync(f));
if (!exe) { console.log("No Edge/Chrome — PDF skipped."); process.exit(0); }
const pdfFile = path.join(OUT, "UzLeeder-Official-Design.pdf");
spawnSync(exe, ["--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--virtual-time-budget=6000", "--print-to-pdf=" + pdfFile, "file:///" + htmlFile.replace(/\\/g, "/")], { stdio: "ignore" });
console.log(fs.existsSync(pdfFile) ? "PDF: " + path.relative(ROOT, pdfFile) + " " + Math.round(fs.statSync(pdfFile).size / 1024) + " KB" : "PDF was not created");
