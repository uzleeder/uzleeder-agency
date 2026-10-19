// Startups — the /startups page (+ /startups/<slug>) and a preview of the ventures on the homepage (#startups, after Work):
//   · the built-in venture cards (build/startups-data.js) pre-rendered in English into index.html
//     between <!--SU:CARDS--> … <!--/SU:CARDS--> (crawlable, works without JavaScript),
//   · the shared renderer copied to /startups-render.js (script.js re-renders from /api/startups),
//   · the same data as api/_lib/startups-seed.json for the API (build/ is not deployed).
// Run through `npm run build:site` — before build-locales.js, which copies index.html into the language pages.
const fs = require("fs"), path = require("path");
const SP = __dirname, PROJECT = path.join(__dirname, "..");
const SU = require(path.join(SP, "startups-render.js"));
const seed = require(path.join(SP, "startups-data.js"));

// fail early on data the section would silently hide
const slugs = new Set();
seed.forEach((v, i) => {
  if (!v.name || !SU.slugOk(v.slug)) throw new Error("startups-data #" + i + ": name and a lowercase slug are required");
  if (slugs.has(v.slug)) throw new Error("startups-data: duplicate slug " + v.slug);
  slugs.add(v.slug);
  if (SU.STATUS.indexOf(v.status) < 0) throw new Error("startups-data " + v.slug + ": unknown status " + v.status);
  if (SU.CATEGORY.indexOf(v.category) < 0) throw new Error("startups-data " + v.slug + ": unknown category " + v.category);
  [v.logo, v.pitch].concat((v.links || []).map(l => l.url)).forEach(u => {
    if (u && u.startsWith("/") && !fs.existsSync(path.join(PROJECT, u))) throw new Error("startups-data " + v.slug + ": missing file " + u);
  });
});

const file = path.join(PROJECT, "index.html");
const html = fs.readFileSync(file, "utf8");
const A = "<!--SU:CARDS-->", B = "<!--/SU:CARDS-->";
const a = html.indexOf(A), b = html.indexOf(B);
if (a < 0 || b < a) throw new Error("index.html: " + A + " … " + B + " markers missing");
let out = html.slice(0, a + A.length) + SU.directory(seed, "en", { home: true }) + html.slice(b);
fs.writeFileSync(file, out);
fs.copyFileSync(path.join(SP, "startups-render.js"), path.join(PROJECT, "startups-render.js"));
// the Startups page itself: /startups and /startups/<slug> (one file; the venture pages render from the same data)
const inlineJS = s => s.replace(/<\/script/gi, "<\\/script");
const cssv = (out.match(/style\.css\?v=([\w.]+)/) || [, "1"])[1];
let page = fs.readFileSync(path.join(SP, "startups.template.html"), "utf8");
const put = (marker, value) => { if (!page.includes(marker)) throw new Error("template marker missing: " + marker); page = page.split(marker).join(value); };
put("/*__CSSV__*/", cssv);
put("<!--__CARDS__-->", SU.directory(seed, "en"));
put("/*__SEED__*/", JSON.stringify(seed).replace(/</g, "\\u003c"));   // no "</script>" can end the seed early
put("/*__RENDER__*/", inlineJS(fs.readFileSync(path.join(SP, "startups-render.js"), "utf8")));
put("/*__CLIENT__*/", inlineJS(fs.readFileSync(path.join(SP, "startups-client.js"), "utf8")));
fs.writeFileSync(path.join(PROJECT, "startups.html"), page);
fs.writeFileSync(path.join(PROJECT, "api", "_lib", "startups-seed.json"), JSON.stringify(seed));
console.log("startups.html + #startups:", SU.visible(seed).length, "ventures,", seed.filter(v => v.pitch).length, "with a pitch deck");
