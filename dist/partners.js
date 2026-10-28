// /partners — public Partner Program landing page: header, notices and the availability line.
// The application itself is its own page: /partners/apply (partner-apply.js).
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var esc = function (v) { return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };

  /* ---------- header: menu + theme (same storage key as the homepage) ---------- */
  var navMenu = $("#navMenu"), menuBtn = $("#menuBtn");
  function setMenu(open) { navMenu.classList.toggle("open", open); menuBtn.setAttribute("aria-expanded", open ? "true" : "false"); menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu"); }
  menuBtn.addEventListener("click", function () { setMenu(!navMenu.classList.contains("open")); });
  $$("#navMenu a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && navMenu.classList.contains("open")) { setMenu(false); menuBtn.focus(); } });
  $("#themeToggle").addEventListener("click", function () {
    var t = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", t); try { localStorage.setItem("uzleeder_theme", t); } catch (e) {}
  });
  var nav = $("#navbar"), onScroll = function () { nav.classList.toggle("scrolled", window.scrollY > 8); };
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  function noticesHTML(info) {
    var n = info.notices, c = info.config;
    var block = function (id, title, items) {
      return '<article class="pp-notice" id="' + id + '"><h3>' + title + '</h3><ol class="pp-notice-list">' + items.map(function (x, i) {
        return "<li><h4>" + String.fromCharCode(65 + i) + " — " + esc(x[0]) + "</h4><p>" + esc(x[1]) + "</p></li>";
      }).join("") + "</ol></article>";
    };
    return '<p class="pp-version">Version <b>' + esc(n.version) + "</b>. Plain-language summary; the final wording must be reviewed for the applicable jurisdiction and the actual legal relationship. " +
      "Acknowledging these notices is not a universal electronic signature and not a comprehensive confidentiality agreement.</p>" +
      '<p class="pp-version">The full rules are in the <a href="/partners/policy">UzLeeder Partner Program Policy</a> (version ' + esc(n.version) + "). The conditions below summarise it.</p>" +
      block("conditions", "Partnership conditions", n.conditions) + block("privacy", "Privacy notice", n.privacy) +
      '<dl class="pp-facts"><div><dt>Responsible organization</dt><dd>' + esc(c.organization || "Not configured yet — applications stay closed until it is") + "</dd></div>" +
      "<div><dt>Privacy contact</dt><dd>" + (c.contact ? '<a href="mailto:' + esc(c.contact) + '">' + esc(c.contact) + "</a>" : "Not configured yet") + "</dd></div>" +
      "<div><dt>Closed applications are kept for</dt><dd>" + esc(c.retentionDays) + " days, then deleted (unless a documented legal hold applies)</dd></div></dl>";
  }

  function start() {
    window.PartnerUI.request({ action: "info" }).then(function (info) {
      $("#noticesBody").innerHTML = noticesHTML(info);
      if (location.hash === "#conditions" || location.hash === "#privacy") { var t = $(location.hash); if (t) t.scrollIntoView(); }
      $("#application").innerHTML = info.config.enabled
        ? '<span class="pp-dot ok" aria-hidden="true"></span>Applications are open — five short steps, about 10 minutes.'
        : '<span class="pp-dot" aria-hidden="true"></span>Applications are not open yet. You can preview the application form; submitting opens once the program details are finalized.';
    }).catch(function () {
      $("#noticesBody").innerHTML = '<p class="pp-muted">The notices could not load. Please refresh the page.</p>';
    });
  }
  if (window.PartnerUI) start(); else window.addEventListener("load", start);
})();
