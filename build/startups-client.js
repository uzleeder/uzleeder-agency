// /startups — browser behaviour (inlined into startups.html by build/build-startups.js).
// One data set for the directory and the venture pages: the built-in seed (pre-rendered), replaced by the published
// ventures from /api/startups; with ?preview=1 and a Control Center session, the drafts.
(function () {
  "use strict";
  var SU = window.SU, $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var SITE = "https://uzleeder.uz";
  var seed = []; try { seed = JSON.parse($("#su-seed").textContent); } catch (e) {}
  var list = seed, filter = "all";

  // page texts (venture texts come from the data); textContent only, except the marked headline
  var P = {
    en: { skip: "Skip to content", nav_services: "Services", nav_work: "Work", nav_startups: "Startups", nav_how: "How it works", nav_about: "About", nav_contact: "Contact", btn_discuss: "Discuss your project",
      eyebrow: "UzLeeder Ventures", h1: "Building What <em>Comes Next.</em>", lead: "We build and explore technology ventures designed to solve real problems, create useful digital products, and open new possibilities for the AI era.",
      cta1: "Explore Startups", cta2: "Discuss a Venture", v_k: "Founder's vision", v_h: "Ideas become products. Products become possibilities.",
      v_p: "Every venture begins with a problem worth solving. Our approach is to explore the opportunity, design a practical solution, build the product, and improve it through real-world feedback.",
      p1_t: "Identify", p1_d: "Discover meaningful problems and underserved opportunities.", p2_t: "Build", p2_d: "Turn validated concepts into usable products through thoughtful engineering and product design.",
      p3_t: "Evolve", p3_d: "Test, learn, improve, and expand when the evidence supports the next step.", d_k: "Directory", d_h: "Our Ventures",
      d_p: "Explore the products and initiatives we are developing, researching, and bringing to life.", note: "“Research” means there is no public product yet. Figures in the decks are hypotheses, not results.",
      f_home: "Home", title: "Startups & Ventures | UzLeeder",
      desc: "Explore UzLeeder ventures, emerging technology initiatives, and digital products being developed for the AI era.", preview: "Preview — unpublished drafts", preview_err: "Preview unavailable — sign in to the Control Center first", filter: "Filter by category" },
    uz: { skip: "Kontentga o'tish", nav_services: "Xizmatlar", nav_work: "Ishlar", nav_startups: "Startaplar", nav_how: "Qanday ishlaymiz", nav_about: "Haqida", nav_contact: "Aloqa", btn_discuss: "Loyihani muhokama qilish",
      eyebrow: "UzLeeder Ventures", h1: "Keyingi bosqichni <em>quramiz.</em>", lead: "Real muammolarni hal qiladigan, foydali raqamli mahsulotlar yaratadigan va AI davrida yangi imkoniyatlar ochadigan texnologik loyihalarni quramiz va o'rganamiz.",
      cta1: "Startaplarni ko'rish", cta2: "Loyihani muhokama qilish", v_k: "Asoschi qarashi", v_h: "G'oyalar mahsulotga, mahsulotlar imkoniyatga aylanadi.",
      v_p: "Har bir loyiha hal qilishga arziydigan muammodan boshlanadi. Biz imkoniyatni o'rganamiz, amaliy yechimni loyihalaymiz, mahsulotni quramiz va real foydalanuvchilar fikri asosida yaxshilaymiz.",
      p1_t: "Aniqlash", p1_d: "Muhim muammolar va e'tibordan chetda qolgan imkoniyatlarni topish.", p2_t: "Qurish", p2_d: "Tasdiqlangan g'oyalarni puxta muhandislik va mahsulot dizayni orqali foydali mahsulotga aylantirish.",
      p3_t: "Rivojlantirish", p3_d: "Sinash, o'rganish, yaxshilash — va dalillar tasdiqlaganda kengaytirish.", d_k: "Katalog", d_h: "Bizning loyihalar",
      d_p: "Ishlab chiqayotgan, o'rganayotgan va hayotga tatbiq etayotgan mahsulot va tashabbuslarimiz.", note: "“Tadqiqot” — hali ochiq mahsulot yo'q degani. Taqdimotlardagi raqamlar natija emas, faraz.",
      f_home: "Bosh sahifa", title: "Startaplar va loyihalar | UzLeeder",
      desc: "UzLeeder loyihalari, yangi texnologik tashabbuslar va AI davri uchun ishlab chiqilayotgan raqamli mahsulotlar.", preview: "Ko'rib chiqish — e'lon qilinmagan qoralamalar", preview_err: "Ko'rib chiqish ishlamadi — avval Control Center'ga kiring", filter: "Kategoriya bo'yicha saralash" },
    ru: { skip: "К содержимому", nav_services: "Услуги", nav_work: "Работы", nav_startups: "Стартапы", nav_how: "Как мы работаем", nav_about: "О нас", nav_contact: "Контакты", btn_discuss: "Обсудить проект",
      eyebrow: "UzLeeder Ventures", h1: "Строим то, что <em>будет дальше.</em>", lead: "Мы создаём и исследуем технологические проекты, которые решают реальные задачи, дают полезные цифровые продукты и открывают новые возможности эпохи AI.",
      cta1: "Смотреть стартапы", cta2: "Обсудить проект", v_k: "Взгляд основателя", v_h: "Идеи становятся продуктами. Продукты — возможностями.",
      v_p: "Каждый проект начинается с проблемы, которую стоит решить. Мы изучаем возможность, проектируем практичное решение, строим продукт и улучшаем его по реальной обратной связи.",
      p1_t: "Найти", p1_d: "Находить значимые проблемы и недооценённые возможности.", p2_t: "Построить", p2_d: "Превращать проверенные идеи в рабочие продукты через продуманную инженерию и дизайн.",
      p3_t: "Развивать", p3_d: "Тестировать, учиться, улучшать и расширяться, когда это подтверждают факты.", d_k: "Каталог", d_h: "Наши проекты",
      d_p: "Продукты и инициативы, которые мы разрабатываем, исследуем и воплощаем.", note: "«Исследование» значит, что публичного продукта пока нет. Цифры в презентациях — гипотезы, а не результаты.",
      f_home: "Главная", title: "Стартапы и проекты | UzLeeder",
      desc: "Проекты UzLeeder, новые технологические инициативы и цифровые продукты, создаваемые для эпохи AI.", preview: "Предпросмотр — неопубликованные черновики", preview_err: "Предпросмотр недоступен — сначала войдите в Control Center", filter: "Фильтр по категории" }
  };

  var lang = (function () {
    var q = (location.search.match(/[?&]lang=([a-z]{2})/) || [])[1], s;
    try { s = localStorage.getItem("uzleeder_lang"); } catch (e) {}
    var l = q || s || "en";
    return SU.LANGS.indexOf(l) >= 0 ? l : "en";        // FA/AR visitors see English here
  })();
  var p = function (k) { return (P[lang] && P[lang][k]) || P.en[k] || ""; };

  /* ---------- meta (title, description, canonical, social) ---------- */
  function setMeta(title, desc, path) {
    document.title = title;
    var url = SITE + path;
    [["meta[name=description]", desc], ["meta[property='og:title']", title], ["meta[property='og:description']", desc], ["meta[name='twitter:title']", title], ["meta[name='twitter:description']", desc], ["meta[property='og:url']", url]]
      .forEach(function (m) { var el = $(m[0]); if (el) el.setAttribute("content", m[1]); });
    var c = $("link[rel=canonical]"); if (c) c.setAttribute("href", url);
  }

  /* ---------- rendering ---------- */
  function applyPageText() {
    root.setAttribute("lang", lang); root.setAttribute("dir", "ltr");
    $$("[data-p]").forEach(function (el) { var v = p(el.getAttribute("data-p")); if (!v) return; if (el.hasAttribute("data-html")) el.innerHTML = v; else el.textContent = v; });
    $("#langLabel").textContent = lang.toUpperCase();
    $$(".lang-opt").forEach(function (b) { var on = b.dataset.lang === lang; b.classList.toggle("active", on); b.setAttribute("aria-checked", on ? "true" : "false"); });
    $("#suFilters").setAttribute("aria-label", p("filter"));
  }
  function renderFilters() {
    var cats = SU.categories(list), box = $("#suFilters");
    // filters only help once there are several ventures in several categories
    if (SU.visible(list).length < 3 || cats.length < 2) { box.hidden = true; filter = "all"; return; }
    if (filter !== "all" && cats.indexOf(filter) < 0) filter = "all";
    box.hidden = false;
    box.innerHTML = ["all"].concat(cats).map(function (c) {
      return '<button type="button" data-cat="' + c + '" aria-pressed="' + (filter === c) + '">' + SU.esc(c === "all" ? SU.t("all", lang) : SU.t("cat_" + c, lang)) + "</button>";
    }).join("");
  }
  // cards carry the site's "reveal" entrance (hidden until shown): this page has to show them itself
  var io = "IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches
    ? new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("show"); io.unobserve(e.target); } }); }, { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }) : null;
  var firstPaint = true;
  function showAll(scope) { $$(".reveal", scope).forEach(function (el) { el.classList.add("show"); }); }
  function reveal(scope) {
    $$(".reveal", scope).forEach(function (el, i) {
      if (!io) { el.classList.add("show"); return; }
      el.style.transitionDelay = (i % 6) * 0.06 + "s"; io.observe(el);
    });
    // content must never depend on the observer firing (hidden tabs, embedded browsers): show everything shortly after load
    setTimeout(function () { showAll(scope); }, 1200);
  }
  function renderList() {
    renderFilters();
    var shown = filter === "all" ? list : SU.visible(list).filter(function (v) { return v.category === filter; });
    var grid = $("#suGrid");
    grid.innerHTML = SU.directory(shown, lang);
    // first load: cards fade in as they scroll into view; after a filter, language or data change they appear at once
    if (firstPaint) { firstPaint = false; reveal(grid); } else showAll(grid);
  }
  function route(focus) {
    var m = location.pathname.match(/^\/startups\/([a-z0-9-]+)\/?$/);
    var v = m ? SU.find(list, m[1]) : null;
    // an old address (e.g. /startups/uzport) shows the venture under its current one
    if (v && v.slug !== m[1]) { history.replaceState(null, "", "/startups/" + v.slug + location.search); }
    $("#suDirectory").hidden = !!m; $("#suDetail").hidden = !m;
    if (m) {
      $("#suDetailBody").innerHTML = v ? SU.detail(v, lang)
        : '<div class="su-notfound"><a class="su-back" href="/startups" data-su-link=""><span aria-hidden="true">← </span>' + SU.esc(SU.t("back", lang)) + "</a><h1>" + SU.esc(SU.t("notfound", lang)) + "</h1></div>";
      if (v) setMeta(v.name + " — " + SU.t("st_" + v.status, lang) + " | UzLeeder", SU.tx(v.tagline, lang) || SU.tx(v.summary, lang) || p("desc"), "/startups/" + v.slug);
      else setMeta(SU.t("notfound", lang) + " | UzLeeder", p("desc"), "/startups");
      // unknown or unpublished address: keep it out of search results
      var rb = $("meta[name=robots]"); if (rb) rb.setAttribute("content", v ? "index, follow" : "noindex, follow");
      if (focus) { var h = $("#suDetail h1"); if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); } }
    } else {
      renderList();
      setMeta(p("title"), p("desc"), "/startups");
      var rd = $("meta[name=robots]"); if (rd) rd.setAttribute("content", "index, follow");
    }
  }
  function renderAll(focus) { applyPageText(); route(focus); }
  function go(href) { history.pushState(null, "", href + location.search); setMenu(false); route(true); window.scrollTo(0, 0); }

  /* ---------- in-page navigation between the directory and the venture pages ---------- */
  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest("[data-su-link]");
    if (a) {
      var href = a.getAttribute("href");
      e.preventDefault();
      if (href === location.pathname) { if (href === "/startups") window.scrollTo(0, 0); return; }
      go(href);
      return;
    }
    var f = e.target.closest && e.target.closest("#suFilters [data-cat]");
    if (f) { filter = f.dataset.cat; renderList(); var b = $('#suFilters [data-cat="' + filter + '"]'); if (b) b.focus(); return; }
    // a click anywhere on a venture card (not on its links) opens the venture's page
    var card = e.target.closest && e.target.closest(".su-card[data-href]");
    if (card && !e.target.closest("a, button, input, select, textarea") && !String(window.getSelection ? getSelection() : "").trim()) go(card.getAttribute("data-href"));
  });
  window.addEventListener("popstate", function () { route(true); });

  /* ---------- header: menu, language, theme (same storage keys as the homepage) ---------- */
  var navMenu = $("#navMenu"), menuBtn = $("#menuBtn");
  function setMenu(open) { navMenu.classList.toggle("open", open); menuBtn.setAttribute("aria-expanded", open ? "true" : "false"); menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu"); }
  menuBtn.addEventListener("click", function () { setMenu(!navMenu.classList.contains("open")); });
  $$("#navMenu a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  var langWrap = $("#langWrap"), langBtn = $("#langBtn");
  function setLangMenu(open) { langWrap.classList.toggle("open", open); langBtn.setAttribute("aria-expanded", open ? "true" : "false"); }
  langBtn.addEventListener("click", function (e) { e.stopPropagation(); setLangMenu(!langWrap.classList.contains("open")); });
  document.addEventListener("click", function (e) { if (!langWrap.contains(e.target)) setLangMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { if (langWrap.classList.contains("open")) { setLangMenu(false); langBtn.focus(); } if (navMenu.classList.contains("open")) { setMenu(false); menuBtn.focus(); } } });
  $$(".lang-opt").forEach(function (b) { b.addEventListener("click", function () { lang = b.dataset.lang; try { localStorage.setItem("uzleeder_lang", lang); } catch (e) {} setLangMenu(false); renderAll(false); langBtn.focus(); }); });
  $("#themeToggle").addEventListener("click", function () {
    var tt = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", tt); try { localStorage.setItem("uzleeder_theme", tt); } catch (e) {}
  });
  var nav = $("#navbar"), onScroll = function () { nav.classList.toggle("scrolled", window.scrollY > 8); };
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  renderAll(false);

  /* ---------- live data: published ventures (or the drafts with ?preview=1 and a Control Center session) ---------- */
  var PREVIEW = /[?&]preview=1\b/.test(location.search);
  var token = ""; if (PREVIEW) { try { token = sessionStorage.getItem("uz_admin_token") || ""; } catch (e) {} }
  fetch(PREVIEW && token ? "/api/startups?preview=1" : "/api/startups", { cache: "no-store", headers: token ? { Authorization: "Bearer " + token } : {} })
    .then(function (r) {
      if (PREVIEW) { var bar = document.createElement("div"); bar.className = "preview-bar" + (r.ok && token ? "" : " err"); bar.setAttribute("role", "status"); bar.textContent = r.ok && token ? p("preview") : p("preview_err"); document.body.appendChild(bar); }
      return r.ok ? r.json() : null;
    })
    .then(function (c) { if (c && c.ok && Array.isArray(c.startups)) { list = c.startups.slice().sort(function (a, b) { return (a.order || 0) - (b.order || 0); }); route(false); } })
    .catch(function () { /* offline or not deployed: the built-in ventures stay */ });
})();
