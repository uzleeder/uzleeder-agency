/* =========================================================
   UzLeeder — Portfolio V3 · behaviour
   i18n · theme · navigation · hero video · case studies ·
   certificate lightbox · contact form · admin CMS content
   ========================================================= */
(function () {
"use strict";

/* ===== Configuration ===== */
// Backend endpoint for the contact form (Netlify function via netlify.toml).
// If the API is hosted elsewhere, set API_BASE to its origin, e.g. "https://api.example.com".
const API_BASE = "";
const CONTACT_ENDPOINT = API_BASE + "/api/contact";

/* ===== Translations (generated: retained v1 keys + v2 copy) ===== */
const i18n = /*__I18N__*/{}/*__END__*/;

const LABELS = { en: "EN", uz: "UZ", ru: "RU", fa: "FA", ar: "AR" };
// /en /uz /ru /fa /ar pages carry <meta name="uzl-lang">; "/" follows the visitor's saved choice (no forced redirects)
const PAGE_LANG = (document.querySelector('meta[name="uzl-lang"]') || {}).content || "";
const LOCALE_PATH = /^\/(en|uz|ru|fa|ar)\/?$/;
// privacy-safe analytics: event names + service/language/source only — never names, contacts or messages
function track(name, params) {
  try { if (typeof window.gtag === "function") window.gtag("event", name, params || {}); } catch (e) {}
  try { if (window.uzla) { const p = params || {}; window.uzla.event(name, p.source || p.service || p.channel || p.reason || p.id || ""); } } catch (e) {}
}
// what visitors actually do: CTA clicks, case studies, language/theme changes, outbound links
document.addEventListener("click", e => {
  const a = e.target.closest("a, button");
  if (!a) return;
  if (a.matches(".btn-primary, .nav-cta, [data-source]") && a.getAttribute("href") === "#contact") track("cta_click", { source: a.dataset.source || "contact" });
  else if (a.matches('a[href="#work"]')) track("cta_click", { source: "see_projects" });
  else if (a.matches('a[target="_blank"]') && !/t\.me|wa\.me|mailto:/.test(a.href)) { try { track("outbound", { source: new URL(a.href).hostname.replace(/^www\./, "") }); } catch (err) {} }
  if (a.matches(".lang-opt")) track("lang_change", { source: a.dataset.lang });
  if (a.matches("#themeToggle")) track("theme_change", { source: root.getAttribute("data-theme") === "dark" ? "light" : "dark" });
}, true);
const RTL = { fa: true, ar: true };
const LANG_KEY = "uzleeder_lang";
const THEME_KEY = "uzleeder_theme";
const THEME_COLORS = { dark: "#07090d", light: "#f6f7f9" };
const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const root = document.documentElement;
let curLang = "en";
const t = k => {
  const d = i18n[curLang] || {};
  return d[k] != null ? d[k] : (i18n.en[k] != null ? i18n.en[k] : "");
};
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
// Uzbek groups digits with spaces; the other languages use 1,234 (Western digits, as in the rest of the page)
const fmt = n => n.toLocaleString(curLang === "uz" ? "ru-RU" : "en-US");

/* ===== Intro (every load): <UzLeeder> + <For leaders> typed → brackets become the Λ mark → AGI system initialization ===== */
// The brand animation itself is locked; only the loading line below it changed (V5):
// "AGI //" + real boot states on a five-segment rail — each state lights one segment. No percentage.
const INTRO_STATES = ["SYSTEM INITIALIZATION", "LOADING UZLEEDER", "CONNECTING SYSTEMS", "HUMAN CONTROL · ON", "READY"];
const intro = $("#intro");
const cachedDesign = (() => { try { return JSON.parse(localStorage.getItem("uzleeder_design") || "null") || {}; } catch (e) { return {}; } })();
if (intro) {
  let seen = false;
  try { seen = sessionStorage.getItem("uzleeder_intro_seen") === "1"; sessionStorage.setItem("uzleeder_intro_seen", "1"); } catch (e) {}
  if (cachedDesign.intro === "off" || (cachedDesign.intro === "session" && seen)) intro.remove();
  else if (reduceMotion) stillIntro(intro);
  else runIntro(intro);
}
function introCloser(el, extra) {
  let done = false;
  return function finish() {
    if (done) return;
    done = true;
    if (extra) extra();
    el.classList.add("out");
    root.style.overflow = "";
    setTimeout(() => el.remove(), 520);
  };
}
// reduced motion: keep the identity (mark + READY), no movement, open quickly
function stillIntro(el) {
  const finish = introCloser(el);
  $("#introState", el).textContent = "READY";
  $$(".boot i", el).forEach(s => s.classList.add("on"));
  el.classList.add("still", "ready");
  el.addEventListener("click", finish);
  setTimeout(finish, 700);
}
function runIntro(el) {
  const state = $("#introState", el);
  const timers = [];
  const at = (ms, fn) => timers.push(setTimeout(fn, ms));
  let loaded = document.readyState === "complete";
  window.addEventListener("load", () => { loaded = true; }, { once: true });
  // a page served from cache (or already loaded) steps through the states quickly
  const nav = performance.getEntriesByType && performance.getEntriesByType("navigation")[0];
  const cached = !!(nav && nav.transferSize === 0 && nav.decodedBodySize > 0);
  root.style.overflow = "hidden";                                  // no scrolling behind the intro

  const finish = introCloser(el, () => timers.forEach(clearTimeout));
  el.addEventListener("click", finish);                            // click / any key skips the intro
  document.addEventListener("keydown", finish, { once: true });

  const setState = i => {
    $$(".boot i", el).forEach((s, k) => s.classList.toggle("on", k <= i));   // one rail segment per state
    state.classList.add("swap");
    at(160, () => { state.textContent = INTRO_STATES[i]; state.classList.remove("swap"); });
  };

  // bracket size in the text line: the sideways Λ (100px wide once upright) is as tall as its slot
  const s0 = +($(".ib-l", el).getBoundingClientRect().height / 100).toFixed(3) || .55;
  el.style.setProperty("--s0", s0);
  el.classList.add("play");
  at(2150, () => {
    // "<" folds into the outer Λ, ">" into the inner Λ (outer ×0.5, 9.5/44 of the mark lower),
    // each travelling from its slot in the text to the centre of the 100×92 mark
    const m = $(".intro-mark", el).getBoundingClientRect(), cx = m.left + m.width / 2, cy = m.top + m.height / 2;
    const innerDrop = 9.5 / 44 * 92;
    [["ib-l", -90, 1, 0], ["ib-r", 90, .5, innerDrop]].forEach(([cls, rot, scale, drop]) => {
      const slot = $("." + cls, el), r = slot.getBoundingClientRect();
      const dx = cx - (r.left + r.width / 2), dy = cy - (r.top + r.height / 2) + drop;
      $("svg", slot).animate([
        { transform: "translate(0px,0px) rotate(" + rot + "deg) scale(" + s0 + ")" },
        { transform: "translate(" + dx + "px," + dy + "px) rotate(0deg) scale(" + scale + ")" }
      ], { duration: 650, easing: "cubic-bezier(.2,.7,.2,1)", fill: "forwards" });
    });
    el.classList.add("merge");
  });
  at(2800, () => el.classList.add("logo"));
  at(3050, () => {
    $(".boot i", el).classList.add("on");
    el.classList.add("load");
    let i = 0, waited = 0;
    // INITIALIZING … PREPARING SYSTEM, then READY once the page has loaded (videos can hold the load event, so wait ≤ 1 s)
    const gap = () => (cached || loaded ? 160 : 300);
    function step() {
      if (i < INTRO_STATES.length - 2) { setState(++i); at(gap(), step); return; }
      if (!loaded && waited < 1000) { waited += 120; at(120, step); return; }
      setState(INTRO_STATES.length - 1);
      at(160, () => el.classList.add("ready"));
      // brand moment: the new era, then the homepage
      at(300, () => el.classList.add("era"));
      at(1000, finish);
    }
    at(gap(), step);
  });
  at(9000, finish);                                                // never hold the page longer than this
}
/* ===== Language ===== */
function applyLang(lang) {
  if (!i18n[lang]) lang = "en";
  curLang = lang;
  const dict = i18n[lang];
  $$("[data-i18n]").forEach(el => {
    const v = dict[el.getAttribute("data-i18n")];
    if (v != null) el.innerHTML = v;
  });
  $$("[data-i18n-ph]").forEach(el => {
    const v = dict[el.getAttribute("data-i18n-ph")];
    if (v != null) el.setAttribute("placeholder", v);
  });
  $("#langLabel").textContent = LABELS[lang];
  root.lang = lang;
  root.dir = RTL[lang] ? "rtl" : "ltr";
  $$(".lang-opt").forEach(o => {
    const on = o.dataset.lang === lang;
    o.classList.toggle("active", on);
    o.setAttribute("aria-checked", on ? "true" : "false");
  });
  try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
  // keep the address shareable: /ru shows Russian, etc. (only on "/" and the locale pages)
  if (LOCALE_PATH.test(location.pathname) || location.pathname === "/" || location.pathname === "/index.html") {
    const want = "/" + lang;
    if (location.pathname !== want && (PAGE_LANG || location.pathname !== "/")) { try { history.replaceState(null, "", want + location.search + location.hash); } catch (e) {} }
  }
  $$("[data-lang-link]").forEach(a => a.classList.toggle("on", a.dataset.langLink === lang));
  if (typeof syncBrief === "function") syncBrief();
  syncHeroButton();
  refreshCounts();
  updateProof();
  renderStartups();
  if (window.__cmsProjects) translateProjects();
  if (window.__cmsTeam) translateTeam();
  if (window.__cmsReviews) translateReviews();
  if (openCaseId) renderCase(openCaseId);
  restartTyping();
}

const langWrap = $("#langWrap");
const langBtn = $("#langBtn");
function setLangMenu(open) {
  langWrap.classList.toggle("open", open);
  langBtn.setAttribute("aria-expanded", open ? "true" : "false");
}
langBtn.addEventListener("click", e => { e.stopPropagation(); setLangMenu(!langWrap.classList.contains("open")); });
$$(".lang-opt").forEach(o => o.addEventListener("click", () => { applyLang(o.dataset.lang); setLangMenu(false); langBtn.focus(); }));
document.addEventListener("click", () => setLangMenu(false));
langWrap.addEventListener("keydown", e => { if (e.key === "Escape") { setLangMenu(false); langBtn.focus(); } });

/* ===== Typed role line ===== */
const typedEl = $("#typed");
let typeTimer = null, rIdx = 0, cIdx = 0, deleting = false;
function typeLoop() {
  const roles = t("roles");
  if (!Array.isArray(roles) || !roles.length) return;
  const word = roles[rIdx % roles.length];
  if (!deleting) {
    typedEl.textContent = word.slice(0, ++cIdx);
    if (cIdx >= word.length) { deleting = true; typeTimer = setTimeout(typeLoop, 1800); return; }
  } else {
    typedEl.textContent = word.slice(0, --cIdx);
    if (cIdx <= 0) { deleting = false; rIdx = (rIdx + 1) % roles.length; }
  }
  typeTimer = setTimeout(typeLoop, deleting ? 40 : 80);
}
function restartTyping() {
  clearTimeout(typeTimer);
  const roles = t("roles");
  if (reduceMotion) { typedEl.textContent = Array.isArray(roles) ? roles.join(" · ") : ""; return; }
  rIdx = 0; cIdx = 0; deleting = false; typedEl.textContent = "";
  typeLoop();
}

/* ===== Theme ===== */
let theme = root.getAttribute("data-theme") || "dark";
function applyTheme(next) {
  theme = next === "light" ? "light" : "dark";
  root.setAttribute("data-theme", theme);
  const meta = $("#themeColor");
  if (meta) meta.setAttribute("content", THEME_COLORS[theme]);
  // project screenshots that exist in both themes
  $$("[data-dark][data-light]").forEach(img => {
    const src = img.getAttribute("data-" + theme);
    if (src && img.getAttribute("src") !== src) img.setAttribute("src", src);
  });
  try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
}
$("#themeToggle").addEventListener("click", () => applyTheme(theme === "dark" ? "light" : "dark"));

/* ===== Navigation: scrolled state, progress, mobile menu, active link ===== */
const nav = $("#navbar");
const progress = $("#progress");
let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const y = window.scrollY;
    nav.classList.toggle("scrolled", y > 24);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = "scaleX(" + (max > 0 ? Math.min(1, y / max) : 0) + ")";
    ticking = false;
  });
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const menuBtn = $("#menuBtn");
const navMenu = $("#navMenu");
function setMenu(open) {
  navMenu.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  document.body.style.overflow = open ? "hidden" : "";
}
menuBtn.addEventListener("click", () => setMenu(!navMenu.classList.contains("open")));
$$("a", navMenu).forEach(a => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", e => { if (e.key === "Escape" && navMenu.classList.contains("open")) { setMenu(false); menuBtn.focus(); } });
window.addEventListener("resize", () => { if (window.innerWidth > 1100 && navMenu.classList.contains("open")) setMenu(false); });

const navMap = { services: "services", work: "work", process: "process", faq: "process", about: "about", uzleeder: "about", team: "about", contact: "contact" };
const navLinks = $$("a", navMenu);
const activeIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const id = navMap[e.target.id];
    navLinks.forEach(a => a.classList.toggle("active", !!id && a.getAttribute("href") === "#" + id));
  });
}, { rootMargin: "-45% 0px -50% 0px" });
$$("main > section[id]").forEach(s => activeIO.observe(s));

/* ===== Reveal on scroll (staggered within each group) ===== */
const revealIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("show");
    revealIO.unobserve(e.target);
    if (e.target.id === "pipeline") startPipeline();
    if (e.target.matches(".era-title")) e.target.closest(".era").classList.add("seen");
    if (e.target.matches(".proof li")) countUp(e.target.querySelector("[data-count]"));
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
function observeReveal(scope) {
  $$(".reveal", scope).forEach(el => {
    const sibs = Array.from(el.parentElement.children).filter(c => c.classList.contains("reveal"));
    el.style.transitionDelay = (Math.max(0, sibs.indexOf(el)) % 6) * 0.07 + "s";
    revealIO.observe(el);
  });
}
observeReveal(document);

/* ===== AI pipeline: interactive stages ===== */
// Runs through the chain on its own until the visitor picks a stage; then it follows the visitor.
let pipeTimer = null, pipeManual = false;
const pipeBtns = $$("#pipeline .pipe-btn");
function selectStage(n, fromUser) {
  if (!pipeBtns.length) return;
  pipeBtns.forEach((b, j) => {
    const on = j + 1 === n;
    b.setAttribute("aria-selected", on ? "true" : "false");
    b.tabIndex = on ? 0 : -1;
    b.parentElement.classList.toggle("on", j < n);
    b.parentElement.classList.toggle("cur", on);
  });
  $("#pipeN").textContent = String(n).padStart(2, "0") + " / " + String(pipeBtns.length).padStart(2, "0");
  $("#pipeH").setAttribute("data-i18n", "p" + n); $("#pipeH").innerHTML = t("p" + n);
  $("#pipeX").setAttribute("data-i18n", "px" + n); $("#pipeX").innerHTML = t("px" + n);
  $("#pipePanel").setAttribute("aria-labelledby", "pipeTab" + n);
  if (fromUser) { pipeManual = true; clearInterval(pipeTimer); $("#pipeline").classList.add("manual"); }
}
pipeBtns.forEach((b, i) => {
  b.addEventListener("click", () => selectStage(i + 1, true));
  b.addEventListener("keydown", e => {
    const k = e.key, last = pipeBtns.length - 1;
    let to = null;
    if (k === "ArrowRight" || k === "ArrowDown") to = i === last ? 0 : i + 1;
    if (k === "ArrowLeft" || k === "ArrowUp") to = i === 0 ? last : i - 1;
    if (k === "Home") to = 0;
    if (k === "End") to = last;
    if (to == null) return;
    e.preventDefault();
    if (root.dir === "rtl" && (k === "ArrowRight" || k === "ArrowLeft")) to = k === "ArrowRight" ? (i === 0 ? last : i - 1) : (i === last ? 0 : i + 1);
    selectStage(to + 1, true); pipeBtns[to].focus();
  });
});
function startPipeline() {
  if (!pipeBtns.length || pipeTimer || pipeManual) return;
  selectStage(1);
  if (reduceMotion) return;
  let n = 1;
  pipeTimer = setInterval(() => {
    if (pipeManual) return clearInterval(pipeTimer);
    n = n % pipeBtns.length + 1;
    selectStage(n);
  }, 2600);
}
/* ===== Proof: count-up ===== */
function countUp(el) {
  if (!el || el.dataset.done) return;
  el.dataset.done = "1";
  const suffix = el.dataset.suffix || "";
  if (reduceMotion) { el.textContent = fmt(+el.dataset.count) + suffix; return; }
  const start = performance.now(), dur = 1200;
  (function step(now) {
    // the target is read every frame: live numbers (projects, startups) may arrive while it is counting
    const p = Math.min(1, (now - start) / dur), eased = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(Math.round(+el.dataset.count * eased)) + suffix;
    if (p < 1) requestAnimationFrame(step);
  })(start);
}
function refreshCounts() {
  $$("[data-count]").forEach(el => { if (el.dataset.done || !root.classList.contains("js")) el.textContent = fmt(+el.dataset.count) + (el.dataset.suffix || ""); });
}
/* ===== Proof: live numbers =====
   products shipped = visible built-in projects + published Control Center projects whose status means shipped
   (live → "live"; product for deployment → "ready"); demos, concepts and projects in development are not counted.
   startups = published ventures from /api/startups; certificates = the 9 built-in + those added in the Control Center. */
const SHIP = { "live-own": "live", "live-client": "live", live: "live", delivered: "live", product: "ready", sale: "ready" };
let ventureCount = null, extraCerts = 0;
function setCount(el, n) {
  if (!el) return;
  el.dataset.count = n;
  el.textContent = fmt(n) + (el.dataset.suffix || "");      // right number at once; the count-up still plays when it scrolls into view
}
function updateProof() {
  let live = 0, ready = 0;
  $$("#workList [data-case]").forEach(a => { if (!a.hidden) { if (a.dataset.ship === "live") live++; else if (a.dataset.ship === "ready") ready++; } });
  (window.__cmsProjects || []).forEach(p => { const s = SHIP[p.tag]; if (s === "live") live++; else if (s === "ready") ready++; });
  setCount($("#pfShipped"), live + ready);
  const txt = $("#pfShippedTxt"); if (txt) txt.textContent = t("pf1x").replace("{live}", live).replace("{ready}", ready);
  if (ventureCount != null) setCount($("#pfVentures"), ventureCount);
  const vt = $("#pfVenturesTxt"); if (vt) vt.textContent = t("pf6");
  setCount($("#pfCerts"), 9 + extraCerts);
}
/* ===== Startups preview (#startups) — the full page is /startups =====
   The cards are pre-rendered in English at build time; the published ventures from /api/startups replace them
   (with ?preview=1 and an admin session: the drafts) and follow the language. Rendering: /startups-render.js (window.SU). */
let startupList = null;
function renderStartups() {
  const grid = $("#suGrid");
  if (!grid || !startupList || !window.SU) return;
  const shown = !!grid.querySelector(".su-card.show"), lang = SU.LANGS.indexOf(curLang) >= 0 ? curLang : "en";
  grid.innerHTML = SU.directory(startupList, lang, { home: true });
  if (shown) $$(".reveal", grid).forEach(el => el.classList.add("show")); else observeReveal(grid);
}
// a click anywhere on a venture card (not on its links) opens the venture's page on /startups
document.addEventListener("click", e => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const card = e.target.closest(".su-card[data-href]");
  if (card && !e.target.closest("a, button, input, select, textarea") && !String(getSelection && getSelection()).trim()) location.href = card.getAttribute("data-href");
});
function loadVentureCount() {
  const token = PREVIEW ? adminToken() : "";
  fetch(token ? "/api/startups?preview=1" : "/api/startups", { cache: "no-store", headers: token ? { Authorization: "Bearer " + token } : {} })
    .then(r => (r.ok ? r.json() : null)).then(j => {
      if (!j || !Array.isArray(j.startups)) return;
      startupList = j.startups.slice().sort((a, b) => (a.order || 0) - (b.order || 0));
      ventureCount = window.SU ? SU.visible(startupList).length : startupList.length;
      updateProof(); renderStartups();
    }).catch(() => { /* keep the built-in cards and number */ });
}

/* ===== Hero video ===== */
const heroVideo = $("#heroVideo");
const heroPlay = $("#heroPlay");
const heroFill = $("#heroFill");
let heroWanted = !reduceMotion;          // user intent; off-screen pausing doesn't change it
function syncHeroButton() {
  if (!heroVideo) return;
  const playing = !heroVideo.paused;
  heroPlay.setAttribute("aria-pressed", playing ? "true" : "false");
  heroPlay.setAttribute("aria-label", playing ? t("v_pause") : t("v_play"));
}
if (heroVideo) {
  const tryPlay = () => { const p = heroVideo.play(); if (p && p.catch) p.catch(() => { heroWanted = false; syncHeroButton(); }); };
  heroVideo.addEventListener("play", syncHeroButton);
  heroVideo.addEventListener("pause", syncHeroButton);
  heroVideo.addEventListener("timeupdate", () => {
    if (heroVideo.duration) heroFill.style.width = (heroVideo.currentTime / heroVideo.duration * 100) + "%";
  });
  heroPlay.addEventListener("click", () => {
    heroWanted = heroVideo.paused;
    if (heroWanted) tryPlay(); else heroVideo.pause();
  });
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && heroWanted) tryPlay(); else if (!e.isIntersecting) heroVideo.pause();
  }, { threshold: 0.25 }).observe(heroVideo);
  syncHeroButton();
}

/* ===== Lazy project videos ===== */
const lazyVideoIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    const v = e.target;
    if (e.isIntersecting) {
      if (!v.src && v.dataset.src) { v.src = v.dataset.src; v.preload = "metadata"; }
      if (!reduceMotion) { const p = v.play(); if (p && p.catch) p.catch(() => {}); }
    } else v.pause();
  });
}, { rootMargin: "200px 0px", threshold: 0.2 });
$$("video.lazy-video").forEach(v => lazyVideoIO.observe(v));

/* ===== Case studies ===== */
const CASE_STATIC = {
  shokirov: {
    title: "Shokirov Math Academy", statusKey: "st_live_client", statusCls: "pill-live", service: "system",
    tech: ["React", "Node.js", "Express", "PostgreSQL (Neon)", "JWT", "Vercel"],
    hero: () => ({ type: "img", src: theme === "light" ? "projects/shokirov-academy-light.png" : "projects/shokirov-academy-dark.png", alt: "Shokirov Math Academy platform" }),
    gallery: [
      { type: "img", src: "projects/shokirov-academy-dark.png", alt: "Shokirov Math Academy — dark theme" },
      { type: "img", src: "projects/shokirov-academy-light.png", alt: "Shokirov Math Academy — light theme" }
    ],
    links: [
      { href: "https://shokirov-academy.vercel.app", key: "proj_view", primary: true, ext: true },
      { href: "contract-shokirov.html", key: "proj_contract", ext: true }
    ]
  },
  markethub: {
    title: "MarketHub — B2B Travel Portal", statusKey: "st_product", statusCls: "pill-sale", service: "system",
    tech: ["Python", "Flask", "SQLite", "2FA", "Docker", "PDF invoicing", "Multi-tenant"],
    hero: () => ({ type: "video", src: "projects/markethub-cover.mp4", poster: "projects/markethub-cover.png", alt: "MarketHub product walkthrough" }),
    gallery: [
      { type: "img", src: "projects/markethub-cover.png", alt: "MarketHub — portal overview" }
    ],
    links: [
      { href: "https://t.me/uzleeder", key: "proj_buy", primary: true, ext: true },
      { href: "certificate-markethub.html", key: "proj_certificate", ext: true }
    ]
  }
};
CASE_STATIC.academy = {
  title: "UzLeeder Academy", statusKey: "st_live_own", statusCls: "pill-live", service: "system",
  tech: ["Vanilla JavaScript", "PWA", "Service Worker", "IndexedDB", "Vercel Serverless Functions", "Vercel Edge Middleware", "Neon Postgres", "Vercel Blob", "Web Crypto (PBKDF2, HMAC)", "Pyodide", "SVG"],
  media: { video: "/api/media/med_mui0q5kipfy5aiau.mp4", image: "/api/media/med_mui0pjiofm744u73.png" },
  hero() { return this.media.video ? { type: "video", src: this.media.video, poster: this.media.image, alt: "UzLeeder Academy walkthrough" } : { type: "img", src: this.media.image, alt: "UzLeeder Academy" }; },
  get gallery() { return this.media.image ? [{ type: "img", src: this.media.image, alt: "UzLeeder Academy — overview" }] : []; },
  links: [{ href: "https://uzleeder-academy.vercel.app", key: "proj_view", primary: true, ext: true }]
};
// which Control Center project has which built-in case study
const CASE_MATCH = { academy: p => /uzleeder-academy\.vercel\.app/i.test(p.link || "") || /^uzleeder academy$/i.test((p.title || "").trim()) };
const caseFor = p => Object.keys(CASE_MATCH).find(id => CASE_MATCH[id](p)) || "";
const caseDialog = $("#caseDialog");
const caseBody = $("#caseBody");
let openCaseId = null, caseOpener = null;

function mediaHTML(m, autoplay) {
  if (m.type === "video") {
    return '<video src="' + esc(m.src) + '" poster="' + esc(m.poster) + '" muted loop playsinline controls preload="metadata"' +
      (autoplay && !reduceMotion ? " autoplay" : "") + ' aria-label="' + esc(m.alt) + '"></video>';
  }
  return '<img src="' + esc(m.src) + '" alt="' + esc(m.alt) + '" loading="lazy" decoding="async"/>';
}
function renderCase(id) {
  const s = CASE_STATIC[id], c = (t("cases") || {})[id];
  if (!s || !c) return;
  const sec = (n, key, inner) => '<section class="case-sec"><h3><span>' + n + "</span>" + esc(t(key)) + "</h3><div>" + inner + "</div></section>";
  const arch = '<div class="arch">' + c.arch.map((row, i) =>
    (i ? '<span class="arch-arrow" aria-hidden="true"></span>' : "") +
    '<div class="arch-node"><b>' + esc(row[0]) + "</b><span>" + esc(row[1]) + "</span></div>").join("") + "</div>";
  const links = s.links.map(l => '<a class="' + (l.primary ? "btn btn-primary" : "btn btn-ghost") + '" href="' + esc(l.href) + '"' +
    (l.ext ? ' target="_blank" rel="noopener"' : "") + ">" + esc(t(l.key)) + '<svg class="ico" aria-hidden="true"><use href="#i-out"/></svg></a>').join("");
  caseBody.innerHTML =
    '<div class="case-top"><span>' + esc(t("cs_label")) + " · " + esc(c.cat) + '</span>' +
    '<button class="case-close" type="button" data-close aria-label="' + esc(t("cs_close")) + '"><svg class="ico" aria-hidden="true"><use href="#i-close"/></svg></button></div>' +
    '<header class="case-head"><span class="pill">' + esc(c.cat) + '</span><h2 id="caseTitle">' + esc(s.title) + "</h2><p>" + esc(c.lead) + "</p></header>" +
    '<div class="case-media">' + mediaHTML(s.hero.call(s), true) + "</div>" +
    '<div class="case-sections">' +
      sec("01", "cs_overview", "<p>" + esc(c.overview) + "</p>") +
      sec("02", "cs_challenge", "<p>" + esc(c.challenge) + "</p>") +
      sec("03", "cs_solution", "<p>" + esc(c.solution) + "</p>") +
      sec("04", "cs_arch", arch) +
      sec("05", "cs_tech", "<ul>" + s.tech.map(x => "<li>" + esc(x) + "</li>").join("") + "</ul>") +
      sec("06", "cs_role", "<p>" + esc(c.role) + "</p>") +
      sec("07", "cs_result", "<p>" + esc(c.result) + '</p><div class="case-gallery">' + s.gallery.map(m => mediaHTML(m, false)).join("") + "</div>") +
      sec("08", "cs_status", '<p><span class="pill ' + (s.statusCls || "") + '">' + esc(t(s.statusKey)) + "</span></p><p>" + esc(t("cs_status_" + id)) + "</p>") +
      '<div class="case-actions"><a class="btn btn-primary" href="#contact" data-close data-service="' + esc(s.service) + '" data-source="project_page">' + esc(t("cs_cta")) + '<svg class="ico" aria-hidden="true"><use href="#i-arrow"/></svg></a>' +
        links.replace(/btn btn-primary/g, "btn btn-ghost") + "</div>" +
    "</div>";
}
function openCase(id, opener) {
  if (!CASE_STATIC[id] || !caseDialog.showModal) return;
  track("case_open", { id });
  openCaseId = id; caseOpener = opener || document.activeElement;
  renderCase(id);
  if (heroVideo && !heroVideo.paused) heroVideo.pause();
  caseDialog.showModal();
  caseBody.scrollTop = 0;
  const close = $(".case-close", caseBody); if (close) close.focus();
  try { history.replaceState(null, "", "#case-" + id); } catch (e) {}
}
function closeDialogs(d) {
  if (d.open) d.close();
}
caseDialog.addEventListener("close", () => {
  $$("video", caseBody).forEach(v => v.pause());
  caseBody.innerHTML = "";
  openCaseId = null;
  try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {}
  if (heroVideo && heroWanted) { const p = heroVideo.play(); if (p && p.catch) p.catch(() => {}); }
  if (caseOpener && caseOpener.focus) caseOpener.focus();
});
document.addEventListener("click", e => {
  const b = e.target.closest("[data-open-case]");
  if (b) { e.preventDefault(); openCase(b.getAttribute("data-open-case"), b); }
});

/* ===== Certificate lightbox ===== */
const lightbox = $("#lightbox");
let lbOpener = null;
document.addEventListener("click", e => {
  const a = e.target.closest("[data-lightbox]");
  if (!a || !lightbox.showModal) return;
  e.preventDefault();
  lbOpener = a;
  const img = $("#lbImg");
  img.src = a.getAttribute("href");
  img.alt = a.dataset.title || "";
  $("#lbTitle").textContent = a.dataset.title || "";
  $("#lbMeta").textContent = a.dataset.meta || "";
  const v = $("#lbVerify");
  if (a.dataset.verify) { v.href = a.dataset.verify; v.hidden = false; } else v.hidden = true;
  lightbox.showModal();
  $(".lb-close", lightbox).focus();
});
lightbox.addEventListener("close", () => { if (lbOpener) lbOpener.focus(); });

// shared: close buttons + click on backdrop
[caseDialog, lightbox].forEach(d => {
  d.addEventListener("click", e => {
    if (e.target === d || e.target.closest("[data-close]")) closeDialogs(d);
  });
});

/* ===== Toast ===== */
function toast(message, type) {
  const wrap = $("#toastWrap");
  const el = document.createElement("div");
  el.className = "toast " + (type || "");
  el.innerHTML = '<svg class="ico" aria-hidden="true"><use href="' + (type === "err" ? "#i-alert" : "#i-check") + '"/></svg><span></span>';
  el.querySelector("span").textContent = message;
  wrap.appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));
  setTimeout(() => { el.classList.remove("show"); setTimeout(() => el.remove(), 350); }, 4200);
}

/* ===== Copy email ===== */
const copyBtn = $("#copyEmail");
if (copyBtn) {
  copyBtn.addEventListener("click", async () => {
    const text = copyBtn.dataset.copy;
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; }
    catch (e) {
      const ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { ok = document.execCommand("copy"); } catch (e2) {}
      ta.remove();
    }
    const label = $("[data-i18n]", copyBtn);
    if (ok) {
      copyBtn.classList.add("done"); label.textContent = t("copied");
      setTimeout(() => { copyBtn.classList.remove("done"); label.textContent = t("copy"); }, 2000);
    } else toast(t("copy_fail"), "err");
  });
}

/* ===== Project brief (contact) ===== */
// Validation mirrors /api/contact. Success is shown only after the server has saved the brief;
// on any failure the text stays in the form (and in sessionStorage) with a direct-contact fallback.
const form = $("#contactForm");
const statusEl = $("#formStatus");
const BRIEF_KEY = "uzleeder_brief";
const RULES = {
  telegram: v => /^@?[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(v) || /^\+?[\d\s().-]{7,20}$/.test(v),
  whatsapp: v => /^\+?[\d\s().-]{7,20}$/.test(v),
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
};
const CONTACT_UI = {
  telegram: { label: "brief_c_telegram", err: "err_telegram", ph: "@username", type: "text", mode: "text", ac: "off" },
  whatsapp: { label: "brief_c_whatsapp", err: "err_whatsapp", ph: "+998 90 123 45 67", type: "tel", mode: "tel", ac: "tel" },
  email: { label: "brief_c_email", err: "err_email", ph: "you@example.com", type: "email", mode: "email", ac: "email" }
};
let briefSource = "direct", briefStarted = false;
function channel() { const c = form && form.querySelector('input[name="channel"]:checked'); return c ? c.value : "telegram"; }
function syncBrief() {
  if (!form) return;
  const ui = CONTACT_UI[channel()], inp = form.elements.contact;
  const lab = $("#cf-contact-label"), err = $("#cf-contact-err");
  lab.setAttribute("data-i18n", ui.label); lab.innerHTML = t(ui.label);
  err.setAttribute("data-i18n", ui.err); err.innerHTML = t(ui.err);
  inp.type = ui.type; inp.inputMode = ui.mode; inp.autocomplete = ui.ac; inp.placeholder = ui.ph;
}
if (form) {
  const f = form.elements;
  const saveDraft = () => { try { sessionStorage.setItem(BRIEF_KEY, JSON.stringify({ name: f.name.value, channel: channel(), contact: f.contact.value, service: f.service.value, message: f.message.value, budget: f.budget.value, timeline: f.timeline.value })); } catch (e) {} };
  try {                                                     // restore an unsent brief after a reload
    const d = JSON.parse(sessionStorage.getItem(BRIEF_KEY) || "null");
    if (d) { ["name", "contact", "service", "message", "budget", "timeline"].forEach(k => { if (d[k]) f[k].value = d[k]; }); const r = form.querySelector('input[name="channel"][value="' + d.channel + '"]'); if (r) r.checked = true; }
  } catch (e) {}
  syncBrief();
  const check = field => {
    const v = field.value.trim();
    const ok = field.name === "name" ? v.length >= 2 : field.name === "contact" ? RULES[channel()](v) : field.name === "service" ? !!v : v.length >= 10;
    field.closest(".field").classList.toggle("invalid", !ok);
    field.setAttribute("aria-invalid", ok ? "false" : "true");
    return ok;
  };
  const fields = [f.name, f.contact, f.service, f.message];
  fields.forEach(x => {
    x.addEventListener("blur", () => { if (x.value.trim()) check(x); });
    x.addEventListener("input", () => { if (x.closest(".field").classList.contains("invalid")) check(x); });
  });
  form.addEventListener("input", () => { saveDraft(); if (!briefStarted) { briefStarted = true; track("lead_form_start", { source: briefSource, language: curLang }); } });
  form.addEventListener("change", e => { if (e.target.name === "channel") { syncBrief(); f.contact.closest(".field").classList.remove("invalid"); f.contact.focus(); } saveDraft(); });
  // CTAs remember where the visitor came from and can preselect the service
  document.addEventListener("click", e => {
    const el = e.target.closest("[data-source], [data-service]");
    if (!el) return;
    if (el.dataset.source) briefSource = el.dataset.source;
    if (el.dataset.service && !f.service.value) { f.service.value = el.dataset.service; saveDraft(); }
    if (el.closest("#caseDialog")) setTimeout(() => $("#contact").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }), 60);
  });
  $$('a[href^="https://t.me/"], a[href^="https://wa.me/"], a[href^="mailto:"]').forEach(a => a.addEventListener("click", () => track("contact_click", { channel: a.href.startsWith("mailto") ? "email" : a.href.includes("wa.me") ? "whatsapp" : "telegram" })));

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const bad = fields.filter(x => !check(x));
    statusEl.className = "form-status";
    $("#briefFallback").hidden = true;
    if (bad.length) { statusEl.textContent = t("form_invalid"); statusEl.classList.add("err"); bad[0].focus(); return; }
    const btn = $(".form-submit", form);
    btn.classList.add("loading"); btn.disabled = true;
    statusEl.textContent = t("form_sending");
    const payload = { name: f.name.value.trim(), channel: channel(), contact: f.contact.value.trim(), service: f.service.value, message: f.message.value.trim(),
      budget: f.budget.value, timeline: f.timeline.value, lang: curLang, source: briefSource, website: f.website ? f.website.value : "" };
    let res = null, data = {};
    try {
      res = await fetch(CONTACT_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      data = await res.json().catch(() => ({}));
    } catch (err) { res = null; }
    btn.classList.remove("loading"); btn.disabled = false;
    if (res && res.ok && data.ok) {
      statusEl.textContent = t(data.duplicate ? "form_dup" : "form_ok") + (data.code ? " " + t("form_code") + " " + data.code : ""); statusEl.classList.add("ok");
      toast(t(data.duplicate ? "form_dup" : "form_ok"), "ok");
      track("lead_submit_success", { service: payload.service, language: curLang, source: briefSource });
      form.reset(); syncBrief(); briefStarted = false;
      try { sessionStorage.removeItem(BRIEF_KEY); } catch (e2) {}
      return;
    }
    // nothing is cleared: the visitor can retry or use the direct links
    const key = res && res.status === 429 ? "form_rate" : res && res.status === 400 ? "form_invalid" : "form_err";
    if (res && res.status === 400 && data.fields) Object.keys(data.fields).forEach(k => { const x = f[k]; if (x && x.closest(".field")) x.closest(".field").classList.add("invalid"); });
    statusEl.textContent = t(key); statusEl.classList.add("err");
    $("#briefFallback").hidden = false;
    track("lead_submit_error", { reason: res ? String(res.status) : "network", service: payload.service, language: curLang });
    console.error("Brief not delivered:", res ? res.status : "network error");
  });
}

/* ===== Admin CMS: remote text overrides + dynamic projects ===== */
// honest statuses — only what the evidence supports (set per project in the Control Center)
const CMS_TAGS = {
  "live-own": { cls: "pill-live", key: "st_live_own" }, "live-client": { cls: "pill-live", key: "st_live_client" }, product: { cls: "pill-sale", key: "st_product" }, delivered: { cls: "", key: "st_delivered" },
  demo: { cls: "", key: "st_demo" }, dev: { cls: "", key: "st_dev" }, private: { cls: "", key: "st_private" }, concept: { cls: "", key: "st_concept" }, archived: { cls: "", key: "st_archived" },
  live: { cls: "pill-live", key: "tag_live" }, sale: { cls: "pill-sale", key: "tag_sale" }, soon: { cls: "", key: "tag_soon" }
};
function translateProjects() {
  const list = window.__cmsProjects || [];
  $$("#workList [data-cmsproj]").forEach(card => {
    const p = list[+card.getAttribute("data-cmsproj")];
    if (!p) return;
    const pick = o => (o && (o[curLang] || o.en)) || "";
    const pEl = $(".proj-p", card);
    if (pEl) pEl.textContent = pick(p.desc);
    [["cat", "m_category"], ["role", "m_role"]].forEach(([f, k]) => {
      const dd = $('[data-pf="' + f + '"]', card);
      if (dd) { dd.textContent = pick(p[f]); dd.parentElement.hidden = !dd.textContent; $("dt", dd.parentElement).textContent = t(k); }
    });
    const why = $(".work-why", card);
    if (why) { $("span", why).textContent = pick(p.why); $("b", why).textContent = t("m_why"); why.hidden = !pick(p.why); }
    const btn = $(".proj-btnlabel", card);
    if (btn) btn.textContent = t("proj_view") || "View";
  });
}
// the built-in projects (Shokirov, MarketHub — with full case studies) stay unless hidden in the Control Center;
// projects added in the Control Center appear after them
function renderProjects(list, hide) {
  const wrap = $("#workList");
  if (!wrap) return;
  hide = hide || {};
  $$("[data-case]", wrap).forEach(a => { a.hidden = !!hide[a.dataset.case]; });
  $$("[data-cmsproj]", wrap).forEach(a => a.remove());
  list = (list || []).filter(p => p && !p.archived);
  window.__cmsProjects = list;
  const builtIn = $$("[data-case]", wrap).filter(a => !a.hidden);
  builtIn.forEach((a, i) => { a.classList.toggle("reverse", i % 2 === 1); const n = $(".work-num", a); if (n) n.textContent = String(i + 1).padStart(2, "0"); });
  list.forEach((p, i) => {
    const idx = builtIn.length + i;
    const tag = CMS_TAGS[p.tag] || CMS_TAGS.live;
    const art = document.createElement("article");
    art.className = "work-item" + (idx % 2 ? " reverse" : "") + " reveal";
    art.setAttribute("data-cmsproj", i);
    const num = String(idx + 1).padStart(2, "0");
    const yt = /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/.exec(p.video || "");
    const media = yt
      ? '<div class="media-frame"><iframe src="https://www.youtube-nocookie.com/embed/' + yt[1] + '" title="' + esc((p.title || "") + " video") + '" loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" style="width:100%;height:100%;border:0"></iframe></div>'
      : p.video && /^(\/api\/media\/|https:\/\/)/.test(p.video)
      ? '<div class="media-frame"><video class="lazy-video" data-src="' + esc(p.video) + '"' + (p.image ? ' poster="' + esc(p.image) + '"' : "") + ' muted loop playsinline preload="none" aria-label="' + esc((p.title || "") + " video") + '"></video></div>'
      : p.image
      ? '<a class="media-frame" href="' + esc(p.link || "#") + '" target="_blank" rel="noopener"><img src="' + esc(p.image) + '" alt="' + esc((p.title || "") + " preview") + '" loading="lazy" decoding="async"/></a>'
      : '<div class="media-frame"><div class="media-empty"><svg viewBox="0 0 48 44" aria-hidden="true"><use href="#brand-mark"/></svg></div></div>';
    art.innerHTML =
      '<div class="work-media">' + media + '<span class="work-num" aria-hidden="true">' + num + "</span></div>" +
      '<div class="work-body"><div class="work-tags"><span class="pill ' + tag.cls + '" data-i18n="' + tag.key + '">' + esc(t(tag.key)) + "</span>" +
        // who it was built for: UzLeeder's own product, or a client (named only with permission)
        (p.owner === "client" ? '<span class="pill"><span data-i18n="own_client">' + esc(t("own_client")) + "</span>" + (p.clientPublic && p.client ? " · " + esc(p.client) : "") + "</span>"
          : p.owner === "uzleeder" ? '<span class="pill" data-i18n="own_uzleeder">' + esc(t("own_uzleeder")) + "</span>" : "") + "</div>" +
      '<h3 class="work-title"></h3><p class="work-lead proj-p"></p>' +
      '<dl class="work-meta"><div hidden><dt></dt><dd data-pf="cat"></dd></div><div hidden><dt></dt><dd data-pf="role"></dd></div>' +
      (p.value ? '<div><dt data-i18n="m_value">' + esc(t("m_value")) + "</dt><dd>" + esc(p.value) + "</dd></div>" : "") + "</dl>" +
      '<div class="proj-tech"></div><p class="work-why" hidden><b></b><span></span></p>' +
      (caseFor(p) ? (() => { const id = caseFor(p); if (p.video || p.image) CASE_STATIC[id].media = { video: p.video && /^(\/api\/media\/|https:\/\/)/.test(p.video) && !/youtu/.test(p.video) ? p.video : "", image: p.image || "" }; return ""; })() : "") +
      (p.link || p.certificate || caseFor(p) ? '<div class="work-actions">' +
        (caseFor(p) ? '<button class="btn btn-primary" type="button" data-open-case="' + caseFor(p) + '"><span data-i18n="cs_open">' + esc(t("cs_open")) + '</span><svg class="ico" aria-hidden="true"><use href="#i-arrow"/></svg></button>' : "") +
        (p.link ? '<a class="btn ' + (caseFor(p) ? "btn-ghost" : "btn-primary") + '" href="' + esc(p.link) + '" target="_blank" rel="noopener"><span class="proj-btnlabel"></span><svg class="ico" aria-hidden="true"><use href="#i-out"/></svg></a>' : "") +
        (p.certificate ? '<a class="btn-link" href="/certified?d=' + encodeURIComponent(p.certificate) + '" target="_blank" rel="noopener" data-i18n="proj_certificate">' + esc(t("proj_certificate")) + "</a>" : "") + "</div>" : "") +
      "</div>";
    $(".work-title", art).textContent = p.title || "";
    const tech = $(".proj-tech", art);
    const chips = [];
    (p.tech || []).forEach(x => { const last = chips[chips.length - 1]; if (last && (last.split("(").length > last.split(")").length)) chips[chips.length - 1] = last + ", " + x; else chips.push(x); });
    chips.forEach(x => { const s = document.createElement("span"); s.textContent = x; tech.appendChild(s); });
    wrap.appendChild(art);
    $$("video.lazy-video", art).forEach(v => lazyVideoIO.observe(v));
  });
  observeReveal(wrap);
  updateProof();
}
// AI team managed in the Control Center: [{ name, icon, role:{en,..}, desc:{en,..}, archived, order }]
// (Claude stays first as Chief Architect unless the admin reorders it.)
function renderTeam(list) {
  const wrap = $("#aiTeam");
  if (!wrap) return;
  const live = list.filter(m => m && m.name && !m.archived).sort((a, b) => (a.order || 0) - (b.order || 0));
  if (!live.length) return;
  window.__cmsTeam = live;
  wrap.innerHTML = live.map((m, i) =>
    '<li class="tm-card' + (i === 0 && /claude/i.test(m.name) ? " tm-architect" : "") + ' reveal" data-cmsteam="' + i + '"><span class="tm-avatar">' +
    (m.icon ? '<img src="' + esc(m.icon) + '" alt="" width="40" height="40" loading="lazy" decoding="async"/>' : '<svg viewBox="0 0 48 44" width="30" height="28" aria-hidden="true"><use href="#brand-mark"/></svg>') +
    '</span><div class="tm-body"><h3>' + esc(m.name) + '</h3><p class="tm-role"></p><p class="tm-desc"></p>' +
    '<span class="tm-status"><i aria-hidden="true"></i><span data-i18n="team_ai">' + esc(t("team_ai")) + '</span> · <span data-i18n="team_online">' + esc(t("team_online")) + "</span></span></div></li>").join("");
  translateTeam();
  observeReveal(wrap);
  const count = $(".team-count");
  if (count) count.removeAttribute("data-i18n"), count.textContent = count.textContent.replace(/\d+(?=\D*$)/, live.length);
}
function translateTeam() {
  (window.__cmsTeam || []).forEach((m, i) => {
    const card = $('[data-cmsteam="' + i + '"]');
    if (!card) return;
    // empty language → the built-in translation for known teammates, then English
    const pick = (o, k) => (o && o[curLang]) || (m.key && t("tm_" + m.key + "_" + k)) || (o && o.en) || "";
    $(".tm-role", card).textContent = pick(m.role, "r");
    $(".tm-desc", card).textContent = pick(m.desc, "d");
  });
}
// extra certificates added in the Control Center: [{ title, meta, image, verify, archived }]
function renderCerts(list) {
  const grid = $(".cert-grid");
  if (!grid) return;
  $$("[data-cmscert]", grid).forEach(n => n.remove());
  const doc = $(".cert-doc", grid);
  extraCerts = list.filter(c => c && c.title && c.image && !c.archived).length; updateProof();
  list.filter(c => c && c.title && c.image && !c.archived).forEach(c => {
    const li = document.createElement("li");
    li.className = "reveal"; li.setAttribute("data-cmscert", "");
    li.innerHTML = '<a class="cert-card" href="' + esc(c.image) + '" data-lightbox data-title="' + esc(c.title) + '" data-meta="' + esc(c.meta || "") + '"' +
      (c.verify ? ' data-verify="' + esc(c.verify) + '"' : "") + '><img src="' + esc(c.image) + '" alt="' + esc(c.title) + ' certificate" loading="lazy" decoding="async"/>' +
      '<span class="cc-t">' + esc(c.title) + '</span><span class="cc-m">' + esc(c.meta || "") + "</span></a>";
    grid.insertBefore(li, doc ? doc.parentElement : null);
  });
  observeReveal(grid);
}

// client reviews from the Control Center: [{ name, role:{en,..}, text:{en,..}, project, photo, rating, archived, consent }]
// Only reviews the client agreed to publish are shown; without any, the block stays hidden.
function renderReviews(list) {
  const box = $("#reviews"), ul = $("#reviewsList");
  if (!box || !ul) return;
  const live = (list || []).filter(r => r && r.name && r.consent && !r.archived && r.text && Object.keys(r.text).length);
  window.__cmsReviews = live;
  box.hidden = !live.length;
  ul.innerHTML = live.map((r, i) => {
    const stars = r.rating >= 1 && r.rating <= 5 ? '<span class="review-stars" aria-label="' + r.rating + ' / 5">' + "★".repeat(r.rating) + "</span>" : "";
    const ava = r.photo ? '<img class="review-ava" src="' + esc(r.photo) + '" alt="" loading="lazy" decoding="async"/>' : '<span class="review-ava" aria-hidden="true">' + esc(r.name.trim()[0].toUpperCase()) + "</span>";
    return '<li class="review reveal" data-cmsrev="' + i + '">' + stars + '<blockquote dir="auto"></blockquote><div class="review-who">' + ava +
      '<div><b>' + esc(r.name) + '</b><span class="rv-role"></span>' + (r.project ? '<div class="review-proj">' + esc(r.project) + "</div>" : "") + "</div></div></li>";
  }).join("");
  translateReviews();
  observeReveal(ul);
}
function translateReviews() {
  (window.__cmsReviews || []).forEach((r, i) => {
    const li = $('[data-cmsrev="' + i + '"]'); if (!li) return;
    const pick = o => (o && (o[curLang] || o.en || o[Object.keys(o)[0]])) || "";
    $("blockquote", li).textContent = pick(r.text);
    $(".rv-role", li).textContent = pick(r.role);
  });
}

// contact details edited in the Control Center replace the built-in ones everywhere on the page
function applyContact(c) {
  if (!c || typeof c !== "object") return;
  const digits = v => String(v || "").replace(/[^\d+]/g, "");
  const handle = v => String(v || "").trim().replace(/^@/, "").replace(/^https?:\/\/[^/]+\//, "").replace(/\/.*$/, "");
  const rules = [];
  if (c.email) rules.push({ href: "mailto:uzleeder@gmail.com", to: "mailto:" + c.email, text: [["uzleeder@gmail.com", c.email]] });
  if (c.phone) rules.push({ href: "tel:+998916395110", to: "tel:" + digits(c.phone), text: [["+998 91 639 51 10", c.phone]] });
  const wa = c.whatsapp || c.phone;
  if (wa) rules.push({ href: "https://wa.me/998916395110", to: "https://wa.me/" + digits(wa).replace(/^\+/, ""), text: [["+998 91 639 51 10", wa]] });
  if (c.telegram) rules.push({ href: "https://t.me/uzleeder", to: "https://t.me/" + handle(c.telegram), text: [["@uzleeder", "@" + handle(c.telegram)]] });
  if (c.github) rules.push({ href: "https://github.com/uzleeder", to: "https://github.com/" + handle(c.github), text: [["github.com/uzleeder", "github.com/" + handle(c.github)], ["uzleeder", handle(c.github)]] });
  if (c.youtube) rules.push({ href: "https://www.youtube.com/@uzleeder", to: "https://www.youtube.com/@" + handle(c.youtube).replace(/^@/, ""), text: [] });
  $$("a[href]").forEach(a => rules.forEach(r => {
    if (a.getAttribute("href") !== r.href) return;
    a.setAttribute("href", r.to);
    const walk = document.createTreeWalker(a, NodeFilter.SHOW_TEXT);
    for (let n = walk.nextNode(); n; n = walk.nextNode()) r.text.forEach(([from, to]) => { if (n.nodeValue.trim() === from || n.nodeValue.includes(from) && from.length > 8) n.nodeValue = n.nodeValue.split(from).join(to); });
  }));
  if (c.email) { const cp = $("#copyEmail"); if (cp) cp.dataset.copy = c.email; }
}
// prices not approved by the owner are replaced by "Price after scoping"; defect-fix line only when approved
function applyPricing(p) {
  if (!p || typeof p !== "object") return;
  const hide = p.hide || {};
  $$("[data-price]").forEach(el => {
    const k = el.getAttribute("data-price"), base = el.getAttribute("data-i18n-base") || el.getAttribute("data-i18n");
    el.setAttribute("data-i18n-base", base);
    el.setAttribute("data-i18n", hide[k] ? "price_request" : base);
    el.innerHTML = t(hide[k] ? "price_request" : base);
  });
  const scope = $(".scope ul");
  if (scope && p.defect30 && !$("[data-defect30]", scope)) { const li = document.createElement("li"); li.setAttribute("data-i18n", "defect30"); li.setAttribute("data-defect30", ""); li.innerHTML = t("defect30"); scope.appendChild(li); }
}

/* ===== Site design from the Control Center: palette, cursor, fonts, sections, intro ===== */
// The admin sends a fully resolved palette; every value is validated before it reaches CSS.
const okColor = v => typeof v === "string" && /^(#[0-9a-f]{3,8}|rgba?\([\d.,\s%]+\))$/i.test(v.trim());
const okRgb = v => typeof v === "string" && /^\d{1,3},\s*\d{1,3},\s*\d{1,3}$/.test(v.trim());
const okFont = v => typeof v === "string" && /^[\w\s'"-]{1,60}$/.test(v);
function cursorCSS(outer, inner, halo, fallback) {
  const svg = "<svg xmlns='http://www.w3.org/2000/svg' width='22' height='24' viewBox='12 -6 56 60'><defs><filter id='s' x='-30%' y='-30%' width='160%' height='160%'><feDropShadow dx='0' dy='1.6' stdDeviation='1.6' flood-color='#000' flood-opacity='.4'/></filter></defs>" +
    "<g fill='none' stroke-miterlimit='10' transform='rotate(-28 24 5)' filter='url(#s)'><path d='M4 41 24 5l20 36' stroke='" + halo + "' stroke-width='11'/><path d='M14 41 24 23l10 18' stroke='" + halo + "' stroke-width='9.5'/>" +
    "<path d='M4 41 24 5l20 36' stroke='" + outer + "' stroke-width='7'/><path d='M14 41 24 23l10 18' stroke='" + inner + "' stroke-width='5.5'/></g></svg>";
  return 'url("data:image/svg+xml,' + encodeURIComponent(svg).replace(/'/g, "%27") + '") 3 1,' + fallback;
}
function designToCSS(d) {
  const p = d && d.palette;
  if (!p) return "";
  const vars = (o, map) => Object.keys(map).filter(k => o && (map[k][1] ? okRgb(o[k]) : okColor(o[k]))).map(k => map[k][0] + ":" + o[k].trim()).join(";");
  const ROOT = { brand: ["--brand"], brandRgb: ["--brand-rgb", 1], brand2: ["--brand-2"], brandDeep: ["--brand-deep"], brandSoft: ["--brand-soft"], ink: ["--ink"], deep: ["--deep"], panel: ["--brand-panel"], panelDark: ["--brand-panel-dark"], media: ["--media-bg"] };
  const MODE = { accent: ["--accent"], accentRgb: ["--accent-rgb", 1], onAccent: ["--on-accent"], bg: ["--bg"], bg2: ["--bg-2"], surface: ["--surface"], surface2: ["--surface-2"], line: ["--line"], line2: ["--line-2"], text: ["--text"], muted: ["--muted"], faint: ["--faint"], markInner: ["--mark-inner"], inkText: ["--ink-text"] };
  let css = ":root{" + vars(p, ROOT) + "}" +
    ':root[data-theme="dark"]{' + vars(p.dark, MODE) + "}" +
    ':root[data-theme="light"]{' + vars(p.light, MODE) + "}";
  const dk = p.dark || {}, lt = p.light || {};
  if (okColor(dk.accent) && okColor(lt.accent) && okColor(p.ink) && okColor(p.deep)) {
    const dIn = okColor(dk.markInner) ? dk.markInner : "#ffffff", lIn = okColor(lt.markInner) ? lt.markInner : p.ink;
    const hit = ":is(a,button,summary,label[for],.lang-opt,[data-lightbox],[data-open-case])";
    css += "@media (hover:hover) and (pointer:fine){" +
      ':root[data-theme="dark"] body{cursor:' + cursorCSS(dk.accent, dIn, p.deep, "auto") + "}" +
      ':root[data-theme="light"] body{cursor:' + cursorCSS(lt.accent, lIn, "#ffffff", "auto") + "}" +
      ':root[data-theme="dark"] ' + hit + "{cursor:" + cursorCSS(dIn, dk.accent, p.deep, "pointer") + "}" +
      ':root[data-theme="light"] ' + hit + "{cursor:" + cursorCSS(lIn, lt.accent, "#ffffff", "pointer") + "}}";
  }
  const f = d.font || {};
  if (okFont(f.display) && okFont(f.body)) css += ':root:not([dir="rtl"]){--display:' + f.display + ",'Segoe UI',system-ui,sans-serif;--font:" + f.body + ",'Segoe UI',system-ui,sans-serif}";
  return css;
}
const SECTION_IDS = ["proof", "era", "ai", "method", "uzleeder", "about", "team", "stack", "certificates", "process", "faq"];
function applySections(hide) {
  SECTION_IDS.forEach(id => {
    const sec = document.getElementById(id); if (!sec) return;
    const off = !!(hide && hide[id]);
    sec.hidden = off;
    $$('a[href="#' + id + '"]').forEach(a => { if (a.closest(".nav-menu, .footer-nav")) a.hidden = off; });
  });
  // keep the section numbers continuous (01, 02, …) after hiding some
  let n = 0;
  $$("main > section").forEach(sec => { const num = $(".sec-num", sec); if (num && !sec.hidden) num.textContent = String(++n).padStart(2, "0"); });
}
// custom design: one ready-made option per part of the site → data-ds-* attributes (see style.css)
const DS = { btn: ["pill", "square", "outline"], card: ["filled", "elevated", "glass"], radius: ["sharp", "round"], hero: ["centered", "text"],
  nav: ["solid", "pill"], sections: ["flat", "lines"], space: ["compact", "spacious"], heads: ["light", "upper"] };
function applyCustom(c) {
  const attrs = {};
  Object.keys(DS).forEach(k => {
    const v = c && c[k];
    if (DS[k].includes(v)) { attrs["data-ds-" + k] = v; root.setAttribute("data-ds-" + k, v); } else root.removeAttribute("data-ds-" + k);
  });
  return attrs;
}
function applyDesign(d) {
  d = d && typeof d === "object" ? d : {};
  const css = designToCSS(d);
  let st = $("#cmsDesign");
  if (css) { if (!st) { st = document.createElement("style"); st.id = "cmsDesign"; document.head.appendChild(st); } st.textContent = css; }
  else if (st) st.remove();
  const f = d.font || {};
  const fontHref = typeof f.href === "string" && /^https:\/\/fonts\.googleapis\.com\/css2\?[\w=&:;@,.+%-]+$/.test(f.href) ? f.href : "";
  let fl = $("#cmsFont");
  if (fontHref) { if (!fl) { fl = document.createElement("link"); fl.rel = "stylesheet"; fl.id = "cmsFont"; document.head.appendChild(fl); } if (fl.href !== fontHref) fl.href = fontHref; }
  else if (fl) fl.remove();
  applySections(d.hide);
  const attrs = applyCustom(d.parts);
  // favicon in the chosen colours (the Λ tile)
  const icon = $('link[rel="icon"][type="image/svg+xml"]') || $('link[rel="icon"]');
  const p = d.palette;
  if (icon && p && okColor(p.brand) && okColor(p.ink)) {
    fetch("/icon.svg").then(r => r.text()).then(svg => {
      svg = svg.split("#1c2233").join(p.ink).split("#e5243b").join(p.brand);
      icon.setAttribute("href", "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg));
    }).catch(() => {});
  }
  const tc = $('meta[name="theme-color"]');
  if (tc && d.palette) { const m = d.palette[theme === "light" ? "light" : "dark"]; if (m && okColor(m.bg)) tc.setAttribute("content", m.bg); }
  // remember for the next visit (not while previewing a draft)
  if (!PREVIEW) try {
    const cache = { css, fontHref, mode: d.mode, intro: d.intro, attrs };
    if (css || fontHref || d.mode || d.intro || Object.keys(attrs).length) localStorage.setItem("uzleeder_design", JSON.stringify(cache)); else localStorage.removeItem("uzleeder_design");
  } catch (e) {}
}
// ?preview=1 — the Control Center opens the site with the unpublished draft (admin token required)
const PREVIEW = /[?&]preview=1\b/.test(location.search);
function adminToken() { try { return sessionStorage.getItem("uz_admin_token") || ""; } catch (e) { return ""; } }
function previewBar(ok) {
  const bar = document.createElement("div");
  bar.className = "preview-bar" + (ok ? "" : " err");
  bar.setAttribute("role", "status");
  bar.innerHTML = '<span data-i18n="' + (ok ? "pv_bar" : "pv_fail") + '"></span><a href="' + esc(location.pathname) + '" data-i18n="pv_exit"></a>';
  $$("[data-i18n]", bar).forEach(el => { el.innerHTML = t(el.getAttribute("data-i18n")); });
  document.body.appendChild(bar);
  root.classList.add("has-preview");
}
async function loadRemoteContent() {
  try {
    const token = PREVIEW ? adminToken() : "";
    const res = await fetch(PREVIEW && token ? "/api/content?draft=1" : "/api/content", {
      cache: "no-store", headers: token ? { Authorization: "Bearer " + token } : {}
    });
    if (PREVIEW) previewBar(res.ok && !!token);
    if (!res.ok) return;
    const content = await res.json();
    if (!content || typeof content !== "object") return;
    if (content.overrides) {
      Object.keys(LABELS).forEach(l => { if (content.overrides[l]) Object.assign(i18n[l], content.overrides[l]); });
    }
    const hideBuiltin = content.settings && content.settings.hideBuiltin;
    if ((Array.isArray(content.projects) && content.projects.length) || hideBuiltin) renderProjects(content.projects, hideBuiltin);
    if (Array.isArray(content.team) && content.team.length) renderTeam(content.team);
    if (Array.isArray(content.certificates)) renderCerts(content.certificates);
    if (Array.isArray(content.testimonials)) renderReviews(content.testimonials);
    if (content.settings && content.settings.contact) applyContact(content.settings.contact);
    applyDesign(content.settings && content.settings.design);
    applyPricing(content.settings && content.settings.pricing);
    applyLang(curLang);
  } catch (e) {
    if (PREVIEW) previewBar(false);
    /* offline or not deployed yet: keep the built-in content */
  }
}

// the Admin link is shown only while this browser tab holds a signed-in admin session
(function adminLink() {
  const a = $("#navAdmin");
  const tok = adminToken();
  if (!a || !tok) return;
  // token = base64url(payload).signature — show the link only until the session expires
  try {
    const p = JSON.parse(atob(tok.split(".")[0].replace(/-/g, "+").replace(/_/g, "/")));
    if (p.exp && p.exp * (p.exp < 1e12 ? 1000 : 1) < Date.now()) return;
  } catch (e) { /* unknown token shape: the admin page validates it anyway */ }
  a.hidden = false;
})();
/* ===== Init ===== */
(function init() {
  // footer copyright year follows the visitor's clock, so it never goes stale
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  let savedTheme;
  try { savedTheme = localStorage.getItem(THEME_KEY); } catch (e) {}
  if (!savedTheme && (cachedDesign.mode === "light" || cachedDesign.mode === "dark")) savedTheme = cachedDesign.mode;
  if (!savedTheme && window.matchMedia) savedTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  applyTheme(savedTheme || theme);

  let savedLang = PAGE_LANG;
  if (!savedLang) try { savedLang = localStorage.getItem(LANG_KEY); } catch (e) {}
  if (!savedLang) {
    const n = (navigator.language || "en").slice(0, 2);
    savedLang = i18n[n] ? n : "en";
  }
  applyLang(savedLang);

  const m = location.hash.match(/^#case-(\w+)$/);
  if (m && CASE_STATIC[m[1]]) openCase(m[1]);
  // older shared links (/#startup-t-port) now live on the venture's own page
  const sm = location.hash.match(/^#startup-([a-z0-9-]+)$/);
  if (sm) location.replace("/startups/" + sm[1]);

  loadRemoteContent();
  loadVentureCount();
})();
})();
