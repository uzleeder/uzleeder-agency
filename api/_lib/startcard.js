// Startup preview card — 1200×630 PNG for link previews (Open Graph / X / Telegram / LinkedIn).
// Built from the startup's PUBLISHED record only: brand colours, wordmark parts, eyebrow, tagline, real status and
// category, optional logo. SVG → PNG with resvg (WebAssembly — no native modules). Fonts: PT Sans / PT Serif (OFL,
// api/_lib/fonts), measured with fontkit so long names and taglines fit instead of overflowing.
const fs = require("fs"), path = require("path");
const fontkit = require("@pdf-lib/fontkit");

const W = 1200, H = 630;
const FONT_DIR = path.join(__dirname, "fonts");
const FILES = { sans: "PT_Sans-Web-Regular.ttf", sansBold: "PT_Sans-Web-Bold.ttf", serifBold: "PT_Serif-Web-Bold.ttf" };
const FAMILY = { sans: "PT Sans", sansBold: "PT Sans", serifBold: "PT Serif" };
let fontBufs = null, fonts = null, wasmReady = null, resvg = null;
function loadFonts() {
  if (fonts) return fonts;
  fontBufs = Object.fromEntries(Object.entries(FILES).map(([k, f]) => [k, fs.readFileSync(path.join(FONT_DIR, f))]));
  fonts = Object.fromEntries(Object.entries(fontBufs).map(([k, b]) => [k, fontkit.create(b)]));
  return fonts;
}
const width = (font, text, size) => { const f = loadFonts()[font]; return f.layout(String(text)).advanceWidth / f.unitsPerEm * size; };
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const hex = (v, d) => /^#[0-9a-f]{6}$/i.test(v || "") ? v : d;
const pickLang = (o, lang) => (o && typeof o === "object") ? (o[lang] || o.en || o.uz || o.ru || "") : String(o || "");

const STATUS_LABEL = { exploring: "Exploring", research: "Research", prototype: "Prototype", development: "In development", beta: "Beta", launched: "Launched", paused: "Paused" };
const CATEGORY_LABEL = { ai: "AI", logistics: "Logistics", edtech: "EdTech", saas: "SaaS", devtools: "Developer tools", experimental: "Experimental" };

/* wrap text into at most `max` lines that fit `w`; the last line gets an ellipsis if text remains */
function wrap(text, font, size, w, max) {
  const words = String(text || "").replace(/\s+/g, " ").trim().split(" ").filter(Boolean), lines = [];
  let cur = "";
  for (let i = 0; i < words.length; i++) {
    const t = cur ? cur + " " + words[i] : words[i];
    if (width(font, t, size) <= w) { cur = t; continue; }
    if (cur) lines.push(cur); cur = words[i];
    if (lines.length === max) { cur = ""; break; }
  }
  if (cur && lines.length < max) lines.push(cur);
  const used = lines.join(" ").split(" ").length;
  if (used < words.length && lines.length) {
    let last = lines[lines.length - 1];
    while (last && width(font, last + "…", size) > w) last = last.replace(/\s*\S+$/, "");
    lines[lines.length - 1] = last + "…";
  }
  return lines;
}

/* the startup's wordmark: brand parts (glue = no space before) or the plain name */
function wordmarkParts(s) {
  const b = s.brand;
  if (b && Array.isArray(b.parts) && b.parts.length) return b.parts.map((p, i) => ({ t: String(p.t || ""), c: p.c || "fg", space: i > 0 && !p.glue }));
  return [{ t: String(s.name || s.slug || ""), c: "fg", space: false }];
}

function buildSvg(s, opts) {
  opts = opts || {};
  const lang = ["en", "uz", "ru"].includes(opts.lang) ? opts.lang : "en";
  const b = s.brand || {};
  const C = { bg: hex(b.bg, "#0F1B2D"), bg2: hex(b.bg2, hex(b.bg, "#16263F")), fg: hex(b.fg, "#F5F7FB"), a1: hex(b.a1, "#E3242B"), a2: hex(b.a2, hex(b.a1, "#E3242B")) };
  const pad = 72, logo = opts.logoData || null, textW = W - pad * 2 - (logo ? 190 : 0);

  // wordmark: largest size (≤ 112) that fits the width
  const parts = wordmarkParts(s);
  const markText = parts.map(p => (p.space ? " " : "") + p.t).join("");
  let ms = 112; while (ms > 48 && width("sansBold", markText, ms) > textW) ms -= 4;
  const eyebrow = pickLang(b.eyebrow, lang).toUpperCase();
  const tagline = pickLang(s.tagline, lang) || pickLang(s.summary, lang);
  const tl = wrap(tagline, "sans", 38, W - pad * 2, 2);

  const chips = [STATUS_LABEL[s.status], CATEGORY_LABEL[s.category]].filter(Boolean);
  let cx = pad, chipSvg = "";
  chips.forEach((c, i) => {
    const cw = width("sansBold", c.toUpperCase(), 20) + 20 * 0.12 * c.length + 40;
    chipSvg += `<rect x="${cx}" y="430" width="${cw}" height="44" rx="22" fill="${i ? "none" : C.a1}" fill-opacity="${i ? 1 : 0.18}" stroke="${C.a1}" stroke-opacity="${i ? 0.55 : 0.9}" stroke-width="2"/>` +
      `<text x="${cx + cw / 2}" y="459" text-anchor="middle" font-family="PT Sans" font-weight="700" font-size="20" letter-spacing="2.4" fill="${i ? C.fg : C.a1}">${esc(c.toUpperCase())}</text>`;
    cx += cw + 14;
  });

  let y = 150;
  const eyebrowSvg = eyebrow ? `<text x="${pad}" y="${y}" font-family="PT Sans" font-weight="700" font-size="22" letter-spacing="5" fill="${C.a1}">${esc(eyebrow)}</text>` : "";
  y += eyebrow ? 22 + ms * 0.95 : ms * 0.9;
  const tspans = parts.map(p => `<tspan fill="${C[p.c] || C.fg}">${esc((p.space ? " " : "") + p.t)}</tspan>`).join("");
  const markSvg = `<text x="${pad}" y="${y}" font-family="PT Sans" font-weight="700" font-size="${ms}" xml:space="preserve">${tspans}</text>`;
  const tagSvg = tl.map((l, i) => `<text x="${pad}" y="${y + 70 + i * 48}" font-family="PT Sans" font-size="38" fill="${C.fg}" fill-opacity="0.82">${esc(l)}</text>`).join("");
  const logoSvg = logo ? `<image x="${W - pad - 160}" y="92" width="160" height="160" href="${logo}" preserveAspectRatio="xMidYMid meet"/>` : "";
  const url = "uzleeder.uz/startups/" + s.slug;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
  <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.bg}"/><stop offset="1" stop-color="${C.bg2}"/></linearGradient>
  <radialGradient id="glow" cx="0.92" cy="0.08" r="0.6"><stop offset="0" stop-color="${C.a1}" stop-opacity="0.28"/><stop offset="1" stop-color="${C.a1}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#g)"/>
<rect width="${W}" height="${H}" fill="url(#glow)"/>
<rect x="0" y="0" width="${W}" height="8" fill="${C.a1}"/>
${eyebrowSvg}
${markSvg}
${tagSvg}
${chipSvg}
${logoSvg}
<line x1="${pad}" y1="532" x2="${W - pad}" y2="532" stroke="${C.fg}" stroke-opacity="0.16" stroke-width="2"/>
<g transform="translate(${pad},552) scale(0.95)"><path d="M4 41 24 5l20 36" fill="none" stroke="#E3242B" stroke-width="7" stroke-miterlimit="10"/><path d="M14 41 24 23l10 18" fill="none" stroke="${C.fg}" stroke-width="5.5" stroke-miterlimit="10"/></g>
<text x="${pad + 58}" y="584" font-family="PT Sans" font-weight="700" font-size="28" fill="${C.fg}">UzLeeder</text>
<text x="${pad + 58 + width("sansBold", "UzLeeder", 28) + 14}" y="584" font-family="PT Sans" font-size="22" fill="${C.fg}" fill-opacity="0.6">Startups &amp; Ventures</text>
<text x="${W - pad}" y="584" text-anchor="end" font-family="PT Sans" font-size="24" fill="${C.fg}" fill-opacity="0.75">${esc(url)}</text>
</svg>`;
}

async function ensureWasm() {
  if (!wasmReady) {
    resvg = require("@resvg/resvg-wasm");
    wasmReady = resvg.initWasm(fs.readFileSync(require.resolve("@resvg/resvg-wasm/index_bg.wasm"))).catch(e => { if (!/already/i.test(String(e && e.message))) { wasmReady = null; throw e; } });
  }
  return wasmReady;
}

async function renderPng(s, opts) {
  await ensureWasm();
  loadFonts();
  const svg = buildSvg(s, opts);
  const r = new resvg.Resvg(svg, { fitTo: { mode: "width", value: W }, font: { fontBuffers: Object.values(fontBufs), loadSystemFonts: false, defaultFontFamily: "PT Sans" } });
  const png = r.render().asPng();
  return Buffer.from(png);
}

module.exports = { buildSvg, renderPng, W, H, STATUS_LABEL, CATEGORY_LABEL };
