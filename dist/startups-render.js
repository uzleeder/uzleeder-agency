// Shared renderer for the Startups page (/startups, /startups/<slug>) and the homepage preview (#startups) — used by build/build-startups.js (cards
// pre-rendered into index.html) AND in the browser (/startups-render.js: published data, language switch).
// Pure functions: data in, escaped HTML out. Nothing from the CMS is ever inserted as raw HTML;
// links must be https:// or site-relative, brand colours must be #rrggbb.
(function (root) {
  "use strict";
  var LANGS = ["en", "uz", "ru"];
  // status: label per language + a shape, so the stage is readable without colour
  var STATUS = ["exploring", "research", "prototype", "development", "beta", "launched", "paused"];
  var SHAPE = { exploring: "○", research: "◎", prototype: "◇", development: "◐", beta: "◑", launched: "●", paused: "Ⅱ" };
  var CATEGORY = ["ai", "logistics", "edtech", "saas", "devtools", "experimental"];
  var FONTS = ["site", "outfit", "grotesk", "michroma"];

  var T = {
    en: {
      st_exploring: "Exploring", st_research: "Research", st_prototype: "Prototype", st_development: "In Development", st_beta: "Beta", st_launched: "Launched", st_paused: "Paused",
      cat_ai: "AI & Emerging Technology", cat_logistics: "Logistics & Mobility", cat_edtech: "Education & EdTech", cat_saas: "SaaS & Business Systems", cat_devtools: "Developer Tools", cat_experimental: "Experimental Ventures",
      pitch: "See the pitch", pdf: "PDF", idea: "Share an idea", visit: "Visit", stage: "Stage", newtab: "opens in a new tab",
      empty: "No ventures are published yet.", more: "Full overview", all: "All", cert: "Certificate", certT: "Verify the UzLeeder venture record", certNone: "Certificate: not issued yet", less: "Hide overview", view: "View venture", back: "All ventures", notfound: "This venture was not found.", by: "Led by",
      d_overview: "Overview", d_problem: "Problem being explored", d_solution: "Proposed solution", d_users: "Target users", d_approach: "Product approach", d_features: "Product features", d_team: "Team",
      d_status: "Current status", d_tech: "Confirmed technologies", d_roadmap: "Roadmap", d_links: "Pitch & links", d_note: "Honest note",
      rm_done: "Done", rm_now: "Now", rm_next: "Next", rm_later: "Later", rm_hint: "Plans can change as we learn — only “Done” is a fact.",
      d_cta_t: "Interested in this venture?", d_cta_p: "Partners, operators and collaborators are welcome to start a conversation.", d_cta_b: "Discuss a venture"
    },
    uz: {
      st_exploring: "O'rganilmoqda", st_research: "Tadqiqot", st_prototype: "Prototip", st_development: "Ishlab chiqilmoqda", st_beta: "Beta", st_launched: "Ishga tushgan", st_paused: "To'xtatilgan",
      cat_ai: "AI va yangi texnologiyalar", cat_logistics: "Logistika va transport", cat_edtech: "Ta'lim va EdTech", cat_saas: "SaaS va biznes tizimlar", cat_devtools: "Dasturchilar uchun vositalar", cat_experimental: "Tajriba yo'nalishlari",
      pitch: "Pitchni ko'rish", pdf: "PDF", idea: "G'oya bilan bo'lishish", visit: "Ochish", stage: "Bosqich", newtab: "yangi oynada ochiladi",
      empty: "Hozircha e'lon qilingan loyiha yo'q.", more: "To'liq ma'lumot", all: "Hammasi", cert: "Sertifikat", certT: "UzLeeder loyiha qaydini tekshirish", certNone: "Sertifikat: hali berilmagan", less: "Yopish", view: "Batafsil", back: "Barcha loyihalar", notfound: "Bu loyiha topilmadi.", by: "Rahbar",
      d_overview: "Umumiy ma'lumot", d_problem: "O'rganilayotgan muammo", d_solution: "Taklif etilayotgan yechim", d_users: "Kimlar uchun", d_approach: "Mahsulot yondashuvi", d_features: "Mahsulot imkoniyatlari", d_team: "Jamoa",
      d_status: "Hozirgi holat", d_tech: "Tasdiqlangan texnologiyalar", d_roadmap: "Yo'l xaritasi", d_links: "Pitch va havolalar", d_note: "Ochiq eslatma",
      rm_done: "Bajarildi", rm_now: "Hozir", rm_next: "Keyingi", rm_later: "Keyinroq", rm_hint: "Rejalar o'rganganimiz sari o'zgarishi mumkin — faqat “Bajarildi” fakt.",
      d_cta_t: "Bu loyiha qiziqtirdimi?", d_cta_p: "Hamkorlar, tashuvchilar va sheriklar bilan suhbatga ochiqmiz.", d_cta_b: "Loyihani muhokama qilish"
    },
    ru: {
      st_exploring: "Исследуется", st_research: "Исследование", st_prototype: "Прототип", st_development: "В разработке", st_beta: "Бета", st_launched: "Запущен", st_paused: "Приостановлен",
      cat_ai: "AI и новые технологии", cat_logistics: "Логистика и транспорт", cat_edtech: "Образование и EdTech", cat_saas: "SaaS и бизнес-системы", cat_devtools: "Инструменты разработчика", cat_experimental: "Экспериментальные направления",
      pitch: "Смотреть питч", pdf: "PDF", idea: "Предложить идею", visit: "Открыть", stage: "Этап", newtab: "откроется в новой вкладке",
      empty: "Пока нет опубликованных проектов.", more: "Подробный обзор", all: "Все", cert: "Сертификат", certT: "Проверить запись о проекте UzLeeder", certNone: "Сертификат: ещё не выдан", less: "Скрыть обзор", view: "Подробнее", back: "Все проекты", notfound: "Проект не найден.", by: "Руководитель",
      d_overview: "Обзор", d_problem: "Какую проблему изучаем", d_solution: "Предлагаемое решение", d_users: "Для кого", d_approach: "Подход к продукту", d_features: "Возможности продукта", d_team: "Команда",
      d_status: "Текущий статус", d_tech: "Подтверждённые технологии", d_roadmap: "Дорожная карта", d_links: "Питч и ссылки", d_note: "Честное примечание",
      rm_done: "Сделано", rm_now: "Сейчас", rm_next: "Далее", rm_later: "Позже", rm_hint: "Планы могут меняться по мере работы — фактом является только «Сделано».",
      d_cta_t: "Заинтересовал проект?", d_cta_p: "Партнёры, перевозчики и соавторы — будем рады обсудить.", d_cta_b: "Обсудить проект"
    }
  };

  var esc = function (s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"); };
  var t = function (k, lang) { return (T[lang] && T[lang][k]) || T.en[k] || k; };
  // localized field with English fallback (a plain string is used as-is)
  var tx = function (v, lang) { if (!v) return ""; if (typeof v === "string") return v; return v[lang] || v.en || ""; };
  var safeUrl = function (u) { u = String(u || "").trim(); return /^https:\/\/[^\s"'<>]+$/.test(u) || /^\/(?!\/)[^\s"'<>]*$/.test(u) ? u : ""; };
  var hex = function (c) { return /^#[0-9a-fA-F]{6}$/.test(c || "") ? c : ""; };
  var slugOk = function (s) { return /^[a-z0-9][a-z0-9-]{0,48}$/.test(s || ""); };
  var visible = function (list) { return (Array.isArray(list) ? list : []).filter(function (v) { return v && !v.archived && v.name && slugOk(v.slug); }); };
  var ext = function (u) { return /^https:/.test(u) || /\.(pdf|html)$/i.test(u); };

  function statusPill(status, lang) {
    var s = STATUS.indexOf(status) >= 0 ? status : "exploring";
    return '<span class="su-status su-' + s + '"><span class="su-shape" aria-hidden="true">' + SHAPE[s] + "</span>" +
      '<span class="su-vh">' + esc(t("stage", lang)) + ": </span>" + esc(t("st_" + s, lang)) + "</span>";
  }
  function mark(v) {
    var logo = safeUrl(v.logo);
    if (logo) return '<span class="su-logo"><img src="' + esc(logo) + '" alt="" width="48" height="48" loading="lazy" decoding="async"/></span>';
    return '<span class="su-logo su-mono" aria-hidden="true">' + esc(String(v.name || "?").replace(/[^A-Za-z0-9]/g, "").slice(0, 2) || "U") + "</span>";
  }
  // the venture's own wordmark (from its pitch deck): coloured parts on the deck's background
  function brandParts(v) { var b = v.brand; return b && Array.isArray(b.parts) ? b.parts.filter(function (p) { return p && p.t; }) : []; }
  function brandTile(v, lang, o) {
    o = o || {};
    var tag = o.h1 ? "h1" : "h3";
    var b = v.brand, parts = brandParts(v);
    var col = { fg: hex(b.fg) || "#f2f4f8", a1: hex(b.a1) || "#f0384e", a2: hex(b.a2) || hex(b.a1) || "#f0384e" };
    var logo = safeUrl(v.logo);
    // parts are separated by a space unless a part is glued to the previous one (T + -PORT → T-PORT)
    var word = parts.map(function (p, i) { return (i && !p.glue ? " " : "") + '<span style="color:' + (col[p.c] || col.fg) + '">' + esc(p.t) + "</span>"; }).join("");
    var bg = hex(b.bg) || "#10141c", glow = hex(b.bg2);
    return '<div class="su-brand" data-font="' + (FONTS.indexOf(b.font) >= 0 ? b.font : "site") + '" style="background:' + (glow ? "radial-gradient(120% 140% at 18% 0%," + glow + " 0%," + bg + " 58%)," : "") + bg + ";color:" + col.fg + '">' +
      (logo ? '<img class="su-brand-mark" src="' + esc(logo) + '" alt="" width="44" height="44" loading="lazy" decoding="async"/>' : "") +
      '<div class="su-brand-txt">' + (tx(b.eyebrow, lang) ? '<p class="su-brand-k" style="color:' + col.a1 + '">' + esc(tx(b.eyebrow, lang)) + "</p>" : "") +
      "<" + tag + ' class="su-word">' + (o.href ? '<a class="su-name-link" href="' + esc(o.href) + '" data-su-link="">' + word + "</a>" : word) + "</" + tag + "></div></div>";
  }
  // the venture's issued, valid UzLeeder record → its public verification page (/verify/…)
  function certLink(v, lang) {
    var c = v.certificate, url = c && /^\/verify\/UZL-[A-Z]{3}-\d{4}-\d{6}\?c=[2-9A-HJ-NP-Z]{10}$/.test(c.url || "") ? c.url : "";
    var ico = '<svg class="su-cert-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 4.5 6v6c0 4.5 3.2 7.8 7.5 9 4.3-1.2 7.5-4.5 7.5-9V6z"/><path d="m8.8 12.2 2.2 2.2 4.4-4.6"/></svg>';
    if (!url) return v.detail === false ? "" : '<span class="su-cert su-cert-none">' + ico + esc(t("certNone", lang)) + "</span>";
    return '<a class="su-link su-cert" href="' + esc(url) + '" target="_blank" rel="noopener" title="' + esc(t("certT", lang)) + '"><svg class="su-cert-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 4.5 6v6c0 4.5 3.2 7.8 7.5 9 4.3-1.2 7.5-4.5 7.5-9V6z"/><path d="m8.8 12.2 2.2 2.2 4.4-4.6"/></svg>' +
      esc(t("cert", lang)) + '<span class="su-sr"> — ' + esc(v.name) + " · " + esc(c.number) + " (" + esc(t("newtab", lang)) + ")</span></a>";
  }
  function teamLine(v, lang) { return (v.team || []).filter(function (m) { return m && m.name; }).map(function (m) { return m.name + (tx(m.role, lang) ? " — " + tx(m.role, lang) : ""); }).join(" · "); }
  var lines = function (s) { return String(s || "").split(/\r?\n/).map(function (x) { return x.trim(); }).filter(Boolean); };
  function hasDetail(v) { return v.detail !== false && ["problem", "features", "users", "approach", "stageNote", "description"].some(function (k) { return tx(v[k], "en"); }); }
  var pageOf = function (v) { return "/startups/" + v.slug; };
  // pitch · PDF/links · certificate — the same actions on the card and on the detail page
  function actions(v, lang, o) {
    var pitch = safeUrl(v.pitch), nt = '<span class="su-sr"> (' + esc(t("newtab", lang)) + ")</span>", out = "";
    var links = (v.links || []).map(function (l) { return { url: safeUrl(l && l.url), label: tx(l && l.label, lang) }; }).filter(function (l) { return l.url && l.url !== pitch; });
    if (pitch) out += '<a class="btn btn-primary su-pitch" href="' + esc(pitch) + '"' + (ext(pitch) ? ' target="_blank" rel="noopener"' : "") + ">" + esc(t("pitch", lang)) + '<span class="su-sr"> — ' + esc(v.name) + "</span>" + (ext(pitch) ? nt : "") + '<span aria-hidden="true"> ↗</span></a>';
    links.slice(0, o && o.allLinks ? 8 : 2).forEach(function (l) {
      var pdf = /\.pdf$/i.test(l.url);
      out += '<a class="su-link" href="' + esc(l.url) + '"' + (ext(l.url) ? ' target="_blank" rel="noopener"' : "") + ">" + esc(pdf && !(o && o.allLinks) ? t("pdf", lang) : (l.label || t("visit", lang))) +
        '<span class="su-sr"> — ' + esc(l.label || v.name) + "</span>" + (ext(l.url) ? nt : "") + '<span aria-hidden="true"> ↗</span></a>';
    });
    return out + certLink(v, lang);
  }
  // card: the whole card opens the venture's page (script); the name is the real link (keyboard, no-JS, crawlers)
  function card(v, lang, o) {
    o = o || {};
    var cat = CATEGORY.indexOf(v.category) >= 0 ? v.category : "experimental", page = hasDetail(v) ? pageOf(v) : "";
    var acts = actions(v, lang) || '<a class="su-link" href="' + (o.home ? "#contact" : "/#contact") + '" data-source="startups">' + esc(t("idea", lang)) + '<span aria-hidden="true"> →</span></a>';
    var branded = brandParts(v).length > 0;
    return '<article class="su-card reveal' + (v.status === "exploring" ? " su-soft" : "") + (branded ? " su-branded" : "") + (page ? " su-has-detail" : "") + '" data-cat="' + cat + '" data-slug="' + esc(v.slug) + '"' + (page ? ' data-href="' + esc(page) + '"' : "") + ">" +
      (branded ? brandTile(v, lang, { href: page }) : "") + (page ? '<span class="su-card-chev su-go" aria-hidden="true"></span>' : "") +
      '<div class="su-card-b">' +
      '<div class="su-card-h">' + (branded ? "" : mark(v)) + '<p class="su-cat">' + esc(t("cat_" + cat, lang)) + "</p>" + statusPill(v.status, lang) + "</div>" +
      (branded ? "" : "<h3>" + (page ? '<a class="su-name-link" href="' + esc(page) + '" data-su-link="">' + esc(v.name) + "</a>" : esc(v.name)) + "</h3>") +
      (tx(v.tagline, lang) ? '<p class="su-tag">' + esc(tx(v.tagline, lang)) + "</p>" : "") +
      (tx(v.summary, lang) ? '<p class="su-sum">' + esc(tx(v.summary, lang)) + "</p>" : "") +
      (tx(v.role, lang) ? '<p class="su-role">' + esc(tx(v.role, lang)) + "</p>" : teamLine(v, lang) ? '<p class="su-role">' + esc(teamLine(v, lang)) + "</p>" : "") +
      '<div class="su-card-f">' + acts + "</div></div></article>";
  }
  function directory(list, lang, o) {
    var vs = visible(list);
    if (!vs.length) return '<p class="su-empty">' + esc(t("empty", lang)) + "</p>";
    return vs.map(function (v) { return card(v, lang, o); }).join("");
  }

  /* ---- the venture's own page: /startups/<slug> ---- */
  function sec(id, title, inner) { return inner ? '<section class="su-d-sec" aria-labelledby="sd-' + id + '"><h2 id="sd-' + id + '">' + esc(title) + "</h2>" + inner + "</section>" : ""; }
  function bullets(s) { var ls = lines(s); if (!ls.length) return ""; return ls.length === 1 ? "<p>" + esc(ls[0]) + "</p>" : '<ul class="su-list">' + ls.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>"; }
  function detail(v, lang) {
    var cat = CATEGORY.indexOf(v.category) >= 0 ? v.category : "experimental";
    var tech = (v.technologies || []).filter(Boolean), team = (v.team || []).filter(function (m) { return m && m.name; });
    var rm = (v.roadmap || []).filter(function (r) { return r && tx(r.title, lang); });
    var head = brandParts(v).length ? brandTile(v, lang, { h1: true }) : '<div class="su-d-plain">' + mark(v) + "<h1>" + esc(v.name) + "</h1></div>";
    return '<a class="su-back" href="/startups" data-su-link=""><span aria-hidden="true">← </span>' + esc(t("back", lang)) + "</a>" +
      '<header class="su-page-head">' + head +
      '<div class="su-page-meta">' + statusPill(v.status, lang) + '<span class="su-cat">' + esc(t("cat_" + cat, lang)) + "</span>" + (teamLine(v, lang) ? '<span class="su-role">' + esc(teamLine(v, lang)) + "</span>" : "") + "</div>" +
      (tx(v.tagline, lang) ? '<p class="su-page-tag">' + esc(tx(v.tagline, lang)) + "</p>" : "") +
      '<div class="su-card-f su-page-acts">' + actions(v, lang, { allLinks: true }) + "</div></header>" +
      '<div class="su-d-body su-page-body">' +
      sec("overview", t("d_overview", lang), (tx(v.summary, lang) ? '<p class="su-lead">' + esc(tx(v.summary, lang)) + "</p>" : "") + bullets(tx(v.description, lang))) +
      sec("status", t("d_status", lang), (tx(v.stageNote, lang) ? "<p>" + esc(tx(v.stageNote, lang)) + "</p>" : "") +
        (tx(v.notice, lang) ? '<div class="su-note" role="note"><b>' + esc(t("d_note", lang)) + "</b><p>" + esc(tx(v.notice, lang)) + "</p></div>" : "")) +
      sec("problem", t("d_problem", lang), bullets(tx(v.problem, lang))) +
      sec("solution", t("d_solution", lang), bullets(tx(v.solution, lang))) +
      sec("features", t("d_features", lang), bullets(tx(v.features, lang))) +
      sec("users", t("d_users", lang), bullets(tx(v.users, lang))) +
      sec("approach", t("d_approach", lang), bullets(tx(v.approach, lang))) +
      sec("team", t("d_team", lang), team.length ? '<ul class="su-team">' + team.map(function (m) { return "<li><b>" + esc(m.name) + "</b>" + (tx(m.role, lang) ? "<span>" + esc(tx(m.role, lang)) + "</span>" : "") + "</li>"; }).join("") + "</ul>" : "") +
      sec("tech", t("d_tech", lang), tech.length ? '<ul class="su-chips">' + tech.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" : "") +
      sec("roadmap", t("d_roadmap", lang), rm.length ? '<ol class="su-road">' + rm.map(function (r) {
        var st = ["done", "now", "next", "later"].indexOf(r.state) >= 0 ? r.state : "later";
        return '<li class="su-rm su-rm-' + st + '"><span class="su-rm-k">' + esc(t("rm_" + st, lang)) + "</span><div><b>" + esc(tx(r.title, lang)) + "</b>" + (tx(r.text, lang) ? "<p>" + esc(tx(r.text, lang)) + "</p>" : "") + "</div></li>";
      }).join("") + '</ol><p class="su-hint">' + esc(t("rm_hint", lang)) + "</p>" : "") +
      '<aside class="su-d-cta"><div><b>' + esc(t("d_cta_t", lang)) + "</b><p>" + esc(t("d_cta_p", lang)) + '</p></div><a class="btn btn-ghost" href="/#contact" data-source="startups">' + esc(t("d_cta_b", lang)) + "</a></aside></div>";
  }
  // categories in use, in display order (for the filter buttons)
  function categories(list) { var seen = []; visible(list).forEach(function (v) { var c = CATEGORY.indexOf(v.category) >= 0 ? v.category : "experimental"; if (seen.indexOf(c) < 0) seen.push(c); }); return seen; }
  // the venture for a page address, old addresses included (/startups/uzport → T-Port)
  function find(list, slug) { return visible(list).filter(function (v) { return hasDetail(v) && (v.slug === slug || (v.aliases || []).indexOf(slug) >= 0); })[0] || null; }

  var API = { LANGS: LANGS, STATUS: STATUS, CATEGORY: CATEGORY, FONTS: FONTS, T: T, t: t, tx: tx, esc: esc, safeUrl: safeUrl, hex: hex, slugOk: slugOk, visible: visible, statusPill: statusPill, card: card, directory: directory, detail: detail, hasDetail: hasDetail, categories: categories, find: find };
  if (typeof module !== "undefined" && module.exports) module.exports = API; else root.SU = API;
})(this);
