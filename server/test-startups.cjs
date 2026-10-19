// Tests for the Startups section renderer (build/startups-render.js) and the built-in venture data.
const path = require("path");
const SU = require(path.join(__dirname, "..", "build", "startups-render.js"));
const seed = require(path.join(__dirname, "..", "build", "startups-data.js"));
const results = [];
const check = (name, ok, got) => results.push((ok ? "PASS " : "FAIL ") + name + (ok ? "" : "  → got: " + String(got).slice(0, 200)));

// built-in data follows the accuracy rules
check("seed: unique valid slugs", new Set(seed.map(v => v.slug)).size === seed.length && seed.every(v => SU.slugOk(v.slug)));
check("seed: known statuses and categories", seed.every(v => SU.STATUS.includes(v.status) && SU.CATEGORY.includes(v.category)));
check("seed: no Beta/Launched without proof", seed.every(v => !["beta", "launched"].includes(v.status)));
check("seed: no Space Zero", !JSON.stringify(seed).toLowerCase().includes("space zero"));
const tp = seed.find(v => v.slug === "t-port");
const cb = seed.find(v => v.slug === "caiber-learn");
check("T-Port replaces UzPort (old address kept as alias)", tp && !seed.some(v => v.slug === "uzport") && tp.aliases.includes("uzport"));
check("T-Port: research stage, honest notice", tp && tp.status === "research" && /no public product yet/i.test(tp.notice.en) && /does not sell tickets/i.test(tp.notice.en));
check("T-Port: LLC fact names the earlier name", /LLC under the project's earlier name, UzPort/.test(tp.stageNote.en));
check("CAIBER Learn: research stage, confirmed team only", cb && cb.status === "research" && cb.team.map(m => m.name).join() === "Max,Jack");
check("no unverified technologies", seed.every(v => v.technologies.length === 0));
check("no prices, revenue figures or valuations", !/\$\s?\d|\d\s?[Kk]\b|\b1B\b|valuation|break-even|subscribers/.test(JSON.stringify(seed)));
check("pitch decks link to files on this site", tp.pitch === "/projects/pitches/t-port-2.0.html" && cb.pitch === "/projects/pitches/caiber-learn-2.0.html" && tp.links[0].url === "/projects/pitches/t-port-2.0.pdf" && cb.links[0].url === "/projects/pitches/caiber-learn-2.0.pdf");
check("plans are marked as plans", /\(planned\)/.test(tp.features.en) && /\(planned\)/.test(cb.features.en));

const d0nopitch = () => ({ slug: "x-venture", name: "X", status: "exploring", category: "experimental", detail: false, links: [] });
// rendering — the homepage section (#startups)
const fs = require("fs");
const ROOT = path.join(__dirname, "..");
const html = SU.directory(seed, "en");
check("directory renders every visible venture", (html.match(/<article class="su-card/g) || []).length === seed.length);
check("See the pitch opens each HTML deck in a new tab", html.includes('href="/projects/pitches/t-port-2.0.html" target="_blank" rel="noopener">See the pitch') && html.includes('href="/projects/pitches/caiber-learn-2.0.html" target="_blank" rel="noopener">See the pitch'));
check("the PDF deck is offered next to the pitch", html.includes('href="/projects/pitches/t-port-2.0.pdf"') && html.includes('href="/projects/pitches/caiber-learn-2.0.pdf"'));
check("cards link to each venture's own page", html.includes('data-href="/startups/t-port"') && html.includes('class="su-name-link" href="/startups/caiber-learn" data-su-link=""') && !html.includes('data-href="/startups/future-ventures"'));
check("ventures without a pitch invite a conversation", SU.card(Object.assign({}, d0nopitch()), "en", { home: true }).includes('href="#contact"') && SU.card(Object.assign({}, d0nopitch()), "en").includes('href="/#contact"'));
check("deck wordmarks: new T-PORT 2.0 identity and CAIBER Learn 2.0 in their colours", html.includes('<span style="color:#22B8FF">T</span><span style="color:#F2F6FF">-PORT</span> <span style="color:#22B8FF">2.0</span>') && html.includes("t-port-mark.png") && html.includes('data-font="michroma"') && html.includes('<span style="color:#8E90FF">Learn</span>') && html.includes('<span style="color:#FFB547">2.0</span>'));
check("logo, pitch and PDF files exist on the site", seed.every(v => [v.logo, v.pitch].concat((v.links || []).map(l => l.url)).filter(Boolean).every(u => fs.existsSync(path.join(ROOT, u)))));
check("card shows the confirmed team", html.includes("Max — Founder &amp; Lead Architect · Jack — Project &amp; Ecosystem Manager"));
check("status readable without colour", SU.statusPill("research", "en").includes("Stage: </span>Research") && SU.statusPill("research", "en").includes("su-shape"));
check("unknown status falls back to Exploring", SU.statusPill("hacked", "en").includes("Exploring"));
check("languages: Uzbek labels, English fallback", SU.card(tp, "uz").includes("Pitchni ko&#39;rish") && SU.tx({ en: "E" }, "ru") === "E");

const evil = { slug: "x", name: '<img src=x onerror=alert(1)>', status: "launched", category: "ai", logo: "javascript:alert(1)", pitch: "javascript:alert(2)",
  brand: { bg: "red;background:url(x)", fg: "#fff\" onload=\"x", parts: [{ t: "<i>w</i>", c: "a1" }], eyebrow: { en: "<script>e</script>" } },
  tagline: { en: "<script>alert(1)</script>" }, team: [{ name: "<b>x</b>" }], links: [{ label: { en: "bad" }, url: "javascript:alert(1)" }, { label: { en: "ok" }, url: "https://example.com" }], roadmap: [], technologies: [] };
const ev = SU.card(evil, "en");
check("names, texts and wordmarks are escaped", !ev.includes("<img src=x") && !ev.includes("<script>") && !ev.includes("<b>x</b>") && !ev.includes("<i>w</i>") && ev.includes("&lt;script&gt;"));
check("javascript: links are dropped", !/javascript:/i.test(ev) && ev.includes('href="https://example.com"'));
check("brand colours must be #rrggbb", !ev.includes("url(x)") && !ev.includes("onload"));
check("safeUrl allows https and site paths only", SU.safeUrl("https://a.b/c") && SU.safeUrl("/api/media/x.png") && !SU.safeUrl("//evil.com") && !SU.safeUrl("http://a.b") && !SU.safeUrl("data:text/html,x"));
check("archived and nameless ventures are hidden", SU.visible([{ slug: "a", name: "A", archived: true }, { slug: "b", name: "" }, { slug: "c", name: "C" }]).map(v => v.slug).join() === "c");
check("empty list shows an empty state", SU.directory([], "en").includes("su-empty"));

// the homepage carries the section right after Work, pre-rendered
// the standalone page
const page = fs.readFileSync(path.join(ROOT, "startups.html"), "utf8");
check("page: SEO title, description and canonical", page.includes("<title>Startups &amp; Ventures | UzLeeder</title>") && page.includes('<link rel="canonical" href="https://uzleeder.vercel.app/startups"/>') && page.includes('property="og:image"'));
check("page: hero, founder's vision, ventures — in that order", (a => a[0] > 0 && a[0] < a[1] && a[1] < a[2])([page.indexOf("Building What <em>Comes Next.</em>"), page.indexOf("Ideas become products. Products become possibilities."), page.indexOf('id="ventures"')]) && page.includes("SALAAM NEW ERA."));
check("page: cards pre-rendered, seed and scripts inlined", (page.slice(page.indexOf('id="suGrid"'), page.indexOf('id="suDetail"')).match(/<article class="su-card/g) || []).length === seed.length && !page.includes("/*__") && !page.includes("<!--__"));
check("page: one h1 in the directory view", (page.slice(page.indexOf("<main"), page.indexOf('id="suDetail"')).match(/<h1/g) || []).length === 1);
check("old addresses find the venture (uzport → T-Port)", SU.find(seed, "uzport").slug === "t-port" && SU.find(seed, "future-ventures") === null && SU.find(seed, "nope") === null);
const index = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const w = index.indexOf('id="work"'), st = index.indexOf('id="startups"'), era = index.indexOf('id="era"');
check("index: Startups section comes right after Work", w > 0 && st > w && st < era && !/<section[^>]*id="(?!startups)/.test(index.slice(index.indexOf("</section>", w) + 10, st)));
check("index: cards pre-rendered for visitors without JavaScript", (index.slice(st, era).match(/<article class="su-card/g) || []).length === seed.length);
const grid = index.slice(index.indexOf('id="suGrid"'), era);
const cardOf = slug => { const a = grid.indexOf('data-slug="' + slug + '"'); const b = grid.indexOf("</article>", a); return grid.slice(a, b); };
check("index: a compact preview — no in-card overviews, a link to the full page", !cardOf("t-port").includes("<details") && index.slice(st, era).includes('href="/startups"') && !index.includes('id="suDetails"'));
check("venture page: every content section", (p => ["Problem being explored", "Product features", "Target users", "Product approach", "Team", "Roadmap", "Current status", "Honest note"].every(k => p.includes(k)) && p.includes("T-Port Travel") && p.includes("does not sell tickets") && p.includes('<h1 class="su-word">') && p.includes('href="/startups" data-su-link=""'))(SU.detail(tp, "en")));
check("certificate row on every venture card: honest label until a record is issued", cardOf("t-port").includes("Certificate: not issued yet") && cardOf("caiber-learn").includes("su-cert-none") && !cardOf("future-ventures").includes("su-cert"));
check("an issued record turns the label into the verification link", (h => h.includes('class="su-link su-cert" href="/verify/UZL-VRC-2026-000001?c=JQJKUKEEDN"') && !h.includes("su-cert-none"))(SU.card(Object.assign({}, tp, { certificate: { number: "UZL-VRC-2026-000001", url: "/verify/UZL-VRC-2026-000001?c=JQJKUKEEDN" } }), "en")));
const ev2 = SU.detail(Object.assign({}, evil, { problem: { en: "<img src=x onerror=1>" }, roadmap: [{ state: "done", title: { en: "<b>x</b>" } }] }), "en");
check("full overview escapes everything", !ev2.includes("<img src=x") && !ev2.includes("<b>x</b>") && !/javascript:/i.test(ev2));
check("index: nav and proof strip open the /startups page", index.includes('<a href="/startups" data-i18n="nav_startups">') && index.includes('<a class="proof-a" href="/startups">') && !index.includes('href="#startups"'));

console.log(results.join("\n"));
const fails = results.filter(r => r.startsWith("FAIL")).length;
console.log("\n" + (fails ? fails + " FAILED" : "ALL " + results.length + " STARTUPS TESTS PASSED"));
process.exitCode = fails ? 1 : 0;
