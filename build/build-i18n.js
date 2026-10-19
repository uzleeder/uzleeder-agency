// Builds script.js: retained v1 translations + v2 copy, then validates every data-i18n key.
const fs = require("fs"), path = require("path"), vm = require("vm");
const SP = __dirname;
const PROJECT = path.join(__dirname, "..");

const oldHtml = fs.readFileSync(path.join(SP, "pre-v2/index.html"), "utf8");
const start = oldHtml.indexOf("const i18n = {");
const end = oldHtml.indexOf("\n};", start);
const oldI18n = vm.runInNewContext("(" + oldHtml.slice(start + "const i18n = ".length, end + 2) + ")");

const KEEP = /^(tag_live|tag_soon|tag_sale|proj_view|proj_contract|proj_certificate|proj_buy|proj_negotiable|svc\d+(_title)?|price_(academy|web|ai|b2b|bot|starter|pro|custom|ent|sub)|from(10|15|250)b?|free_clients|one_time|based_req|popular|get_started|lets_talk|f_\w+|certs_(featured_badge|featured_desc|featured2_badge|featured2_desc|verify)|msg_tg|phone_label|loc_city|form_\w+)$/;
const v2 = require(path.join(SP, "i18n-v2.js"));

// Site languages: EN + UZ (retained v1 copy + v2), FA + AR (full standalone dictionaries, RTL).
// Tajik/Russian sources are kept in i18n-v2.js but no longer shipped.
const out = {};
for (const lang of ["en", "uz", "ru"]) {
  const kept = {};
  // flag emoji render as plain "UZ" letters on Windows — drop them from retained copy
  for (const [k, v] of Object.entries(oldI18n[lang])) if (KEEP.test(k)) kept[k] = typeof v === "string" ? v.replace(/\s*\u{1F1FA}\u{1F1FF}/gu, "") : v;
  out[lang] = Object.assign(kept, v2[lang]);
}
out.fa = require(path.join(SP, "lang-fa.js"));
out.ar = require(path.join(SP, "lang-ar.js"));
// V3, V4, then V5 (AGI-first) copy win over everything older
const v3 = require(path.join(SP, "i18n-v3.js"));
const v4 = require(path.join(SP, "i18n-v4.js"));
const v5 = require(path.join(SP, "i18n-v5.js"));
for (const lang of Object.keys(out)) Object.assign(out[lang], v3[lang] || {}, v4[lang] || {}, v5[lang] || {});
// V5 naming: "AI" → "AGI" in UzLeeder's own brand/positioning copy (all languages).
// Only the keys below are renamed. "AI" stays where it states a fact: certificate names, third-party tools and the
// AI team (models), "AI-assisted" development, and the honesty notes ("AI is not perfect", "no AI inside the bot").
const AGI_KEYS = ["nav_ai", "ai_kicker", "ai_title", "ai_sub", "ai1_d", "ai5_t", "ai9_d", "brand_title", "brand_lead", "bw1", "pr3",
  "foot_line", "hb_title", "s3_t", "s3_d", "aiw3", "faq1_a", "st_aii", "about_p2", "hero_eyebrow", "svc9_title"];
const AGI_KEEP = /AI-assisted|AI-Assisted|AI-ассистир[а-яё]*|[Рр]азработ[а-яё]* с AI|AI yordamida\w*|AI yordamidagi|بمساعدة AI|با کمک AI|مبتنی بر AI/g;
const toAGI = s => {
  const kept = [];
  return s.replace(AGI_KEEP, m => "\u0000" + (kept.push(m) - 1) + "\u0000")
    .replace(/\bAI\b/g, "AGI")
    .replace(/هوش مصنوعی/g, "AGI")                       // FA writes "AI" as a word
    .replace(/بالذكاء الاصطناعي/g, "بـAGI").replace(/الذكاء الاصطناعي/g, "AGI")   // AR too
    .replace(/\u0000(\d+)\u0000/g, (_, i) => kept[i]);
};
for (const lang of Object.keys(out)) {
  for (const k of AGI_KEYS) if (typeof out[lang][k] === "string") out[lang][k] = toAGI(out[lang][k]);
  if (Array.isArray(out[lang].roles)) out[lang].roles = out[lang].roles.map(r => (/assist|ассист|[Рр]азработчик с|yordam|ёрии|مساعدة|کمک/i.test(r) ? r : toAGI(r)));
}
// extra case studies (projects added through the Control Center)
const academy = require(path.join(SP, "cases-academy.js"));
for (const lang of Object.keys(out)) out[lang].cases = Object.assign({}, out[lang].cases, { academy: academy[lang] });

// structural checks for the nested parts (roles list, case studies)
for (const lang of ["ru", "fa", "ar"]) {
  if (!Array.isArray(out[lang].roles) || out[lang].roles.length !== out.en.roles.length) console.log(lang, "ROLES mismatch");
  for (const id of Object.keys(out.en.cases)) {
    const a = out.en.cases[id], b = (out[lang].cases || {})[id];
    const bad = !b ? ["whole case"] : Object.keys(a).filter(k => b[k] == null || (Array.isArray(a[k]) && a[k].length !== b[k].length));
    if (bad.length) console.log(lang, "CASE", id, "problems:", bad.join(", "));
  }
}

// validate: every key used in index.html / script must exist in all languages
const html = fs.readFileSync(path.join(PROJECT, "index.html"), "utf8");
const tpl = fs.readFileSync(path.join(SP, "script.template.js"), "utf8");
const used = new Set();
for (const m of html.matchAll(/data-i18n(?:-ph)?="([^"]+)"/g)) used.add(m[1]);
for (const m of tpl.matchAll(/\bt\("([a-z0-9_]+)"\)/g)) used.add(m[1]);
for (const k of ["tag_live", "tag_sale", "tag_soon", "proj_view", "proj_contract", "proj_certificate", "proj_buy"]) used.add(k);
let problems = 0;
for (const lang of Object.keys(out)) {
  const missing = [...used].filter(k => out[lang][k] == null);
  if (missing.length) { problems++; console.log(lang, "MISSING:", missing.join(", ")); }
  const unused = Object.keys(out[lang]).filter(k => !used.has(k) && k !== "roles" && k !== "cases");
  if (unused.length) console.log(lang, "unused (kept for admin overrides?):", unused.join(", "));
}

if (problems) { console.error("Missing translation keys — script.js was NOT written. Add them to build/i18n-v5.js."); process.exit(1); }
const json = JSON.stringify(out, null, 1).replace(/\u2028|\u2029/g, "");
const js = tpl.replace("/*__I18N__*/{}/*__END__*/", json);
fs.writeFileSync(path.join(PROJECT, "script.js"), js, "utf8");
console.log("script.js written:", js.length, "bytes; keys used:", used.size, problems ? "— FIX MISSING KEYS" : "— all keys present");
