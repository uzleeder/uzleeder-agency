// Builds the localized entry pages (en.html, uz.html, ru.html, fa.html, ar.html) from index.html,
// plus sitemap.xml and robots.txt. Served as /en, /uz, /ru, /fa, /ar (rewrites in vercel.json).
// Each page has its own <html lang/dir>, title, description, canonical and og tags; the body is the same
// (script.js switches the language from <meta name="uzl-lang">). No location-based redirects.
const fs = require("fs"), path = require("path");
const PROJECT = path.join(__dirname, "..");
const DOMAIN = "https://uzleeder.uz";
const LANGS = ["en", "uz", "ru", "fa", "ar"];
const OG = { en: "en_US", uz: "uz_UZ", ru: "ru_RU", fa: "fa_IR", ar: "ar_AR" };
const TITLE = "Max — Prompt Engineer & AI-Assisted Developer | UzLeeder";   // the V2 title, same in every language
const META = {
  en: [TITLE, "Max (Mekhriddin Abdualim) — prompt engineer, AI-assisted developer and founder of UzLeeder. Real digital products, AI systems, learning platforms and modern web experiences, built in Tashkent, Uzbekistan."],
  uz: [TITLE, "Max (Mekhriddin Abdualim) — prompt engineer, AI yordamida ishlaydigan dasturchi va UzLeeder asoschisi. Real raqamli mahsulotlar, AI tizimlari, ta'lim platformalari va zamonaviy veb-loyihalar — Toshkent, O'zbekiston."],
  ru: [TITLE, "Макс (Мехриддин Абдуалим) — промпт-инженер, разработчик с AI и основатель UzLeeder. Реальные цифровые продукты, AI-системы, образовательные платформы и современные веб-проекты — Ташкент, Узбекистан."],
  fa: [TITLE, "مکس (مهرالدین عبدالعلیم) — مهندس پرامپت، توسعه‌دهنده با کمک AI و بنیان‌گذار UzLeeder. محصولات دیجیتال واقعی، سیستم‌های AI، پلتفرم‌های آموزشی و تجربه‌های وب مدرن — تاشکند، ازبکستان."],
  ar: [TITLE, "ماكس (مهر الدين عبد العليم) — مهندس أوامر ومطوّر بمساعدة AI ومؤسس UzLeeder. منتجات رقمية حقيقية وأنظمة AI ومنصات تعليمية وتجارب ويب حديثة — طشقند، أوزبكستان."]
};
const attr = s => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
const setMeta = (html, re, value) => { if (!re.test(html)) throw new Error("meta not found: " + re); return html.replace(re, value); };

function localize(html, lang) {
  const [title, desc] = META[lang];
  const url = lang ? DOMAIN + "/" + lang : DOMAIN + "/";
  html = setMeta(html, /<html lang="[a-z]+"( dir="(rtl|ltr)")? data-theme="dark">/, `<html lang="${lang}" dir="${lang === "fa" || lang === "ar" ? "rtl" : "ltr"}" data-theme="dark">`);
  html = setMeta(html, /<title>[^<]*<\/title>/, `<title>${attr(title)}</title>`);
  html = setMeta(html, /<meta name="description" content="[^"]*"\/>/, `<meta name="description" content="${attr(desc)}"/>`);
  html = setMeta(html, /<link rel="canonical" href="[^"]*"\/>/, `<link rel="canonical" href="${url}"/>`);
  html = setMeta(html, /<meta property="og:url" content="[^"]*"\/>/, `<meta property="og:url" content="${url}"/>`);
  html = setMeta(html, /<meta property="og:title" content="[^"]*"\/>/, `<meta property="og:title" content="${attr(title)}"/>`);
  html = setMeta(html, /<meta property="og:description" content="[^"]*"\/>/, `<meta property="og:description" content="${attr(desc)}"/>`);
  html = setMeta(html, /<meta name="twitter:title" content="[^"]*"\/>/, `<meta name="twitter:title" content="${attr(title)}"/>`);
  html = setMeta(html, /<meta name="twitter:description" content="[^"]*"\/>/, `<meta name="twitter:description" content="${attr(desc)}"/>`);
  html = html.replace(/<meta property="og:locale" content="[^"]*"\/>(\s*<meta property="og:locale:alternate" content="[^"]*"\/>)*/,
    `<meta property="og:locale" content="${OG[lang]}"/>` + LANGS.filter(l => l !== lang).map(l => `\n<meta property="og:locale:alternate" content="${OG[l]}"/>`).join(""));
  html = html.replace(/<meta name="uzl-lang" content="[a-z]+"\/>\n?/, "");
  html = html.replace("</title>", `</title>\n<meta name="uzl-lang" content="${lang}"/>`);
  return html;
}

// root index.html keeps English meta (x-default) without a forced language
let index = fs.readFileSync(path.join(PROJECT, "index.html"), "utf8");
index = index.replace(/<meta name="uzl-lang" content="[a-z]+"\/>\n?/, "");
const rootTitle = META.en[0], rootDesc = META.en[1];
index = index.replace(/<title>[^<]*<\/title>/, `<title>${attr(rootTitle)}</title>`)
  .replace(/<meta name="description" content="[^"]*"\/>/, `<meta name="description" content="${attr(rootDesc)}"/>`)
  .replace(/<meta property="og:title" content="[^"]*"\/>/, `<meta property="og:title" content="${attr(rootTitle)}"/>`)
  .replace(/<meta property="og:description" content="[^"]*"\/>/, `<meta property="og:description" content="${attr(rootDesc)}"/>`)
  .replace(/<meta name="twitter:title" content="[^"]*"\/>/, `<meta name="twitter:title" content="${attr(rootTitle)}"/>`)
  .replace(/<meta name="twitter:description" content="[^"]*"\/>/, `<meta name="twitter:description" content="${attr(rootDesc)}"/>`);
fs.writeFileSync(path.join(PROJECT, "index.html"), index);
for (const l of LANGS) fs.writeFileSync(path.join(PROJECT, l + ".html"), localize(index, l));

// sitemap with reciprocal hreflang alternates
const today = new Date().toISOString().slice(0, 10);
const alts = LANGS.map(l => `    <xhtml:link rel="alternate" hreflang="${l}" href="${DOMAIN}/${l}"/>`).join("\n") + `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${DOMAIN}/"/>`;
const urls = ["", ...LANGS].map(l => `  <url>\n    <loc>${DOMAIN}/${l}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${l ? "0.9" : "1.0"}</priority>\n${alts}\n  </url>`).join("\n") +
  // the Startups page and each venture's own page (built-in ventures with a full description)
  ["/partners", "/startups"].concat(require("./startups-data.js").filter(v => v.detail !== false && !v.archived).map(v => "/startups/" + v.slug))
    .map(u => `\n  <url>\n    <loc>${DOMAIN}${u}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${u === "/startups" ? "0.8" : "0.7"}</priority>\n  </url>`).join("");
fs.writeFileSync(path.join(PROJECT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`);
fs.writeFileSync(path.join(PROJECT, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /admin.html\nDisallow: /api/\n\nSitemap: ${DOMAIN}/sitemap.xml\n`);
console.log("locale pages:", LANGS.map(l => l + ".html").join(" "), "· sitemap.xml · robots.txt");
