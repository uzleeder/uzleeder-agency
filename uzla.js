/* UzLeeder first-party analytics — anonymous visit summary sent to /api/track.
   Collected: pages, sections reached, event names (with a short label), engaged time, scroll depth,
   referrer host, UTM tags, language, theme and screen width. No names, contacts, messages or IPs.
   Not collected at all when the browser sends Do Not Track / Global Privacy Control. */
(function () {
  "use strict";
  if (navigator.doNotTrack === "1" || window.doNotTrack === "1" || navigator.globalPrivacyControl === true) { window.uzla = { event: function () {} }; return; }
  var rid = function () { return (Date.now().toString(36) + Math.random().toString(36).slice(2, 12)).slice(0, 20); };
  var ss = function (k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } };
  var ls = function (k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } };

  // one visit per browser tab session; "new" = first visit ever on this browser
  var vid = ss("uzla_v"), start = +ss("uzla_s") || Date.now();
  if (!vid) { vid = rid(); ss("uzla_v", vid); ss("uzla_s", String(start)); }
  var isNew = !ls("uzla_seen");
  if (isNew) ls("uzla_seen", new Date().toISOString().slice(0, 10));
  var state = JSON.parse(ss("uzla_state") || "null") || { pages: [], sections: [], events: [], dur: 0, depth: 0, isNew: isNew };

  var q = new URLSearchParams(location.search);
  if (!state.utm && q.get("utm_source")) state.utm = { s: q.get("utm_source"), m: q.get("utm_medium") || "", c: q.get("utm_campaign") || "" };
  if (state.ref === undefined) state.ref = document.referrer || "";
  var lang = function () { return document.documentElement.lang || ""; };
  state.pages.push({ p: location.pathname, l: lang() });
  if (state.pages.length > 20) state.pages = state.pages.slice(-20);

  var admin = false;
  try { admin = !!sessionStorage.getItem("uz_admin_token"); } catch (e) {}
  var save = function () { ss("uzla_state", JSON.stringify(state)); };
  var dirty = true;

  // engaged time: only while the tab is visible
  var visibleSince = document.visibilityState === "visible" ? Date.now() : 0;
  var tick = function () { if (visibleSince) { state.dur += Date.now() - visibleSince; visibleSince = Date.now(); } };

  function send(final) {
    tick();
    if (!dirty && !final) return;
    dirty = false; save();
    var payload = JSON.stringify({ v: vid, start: start, isNew: state.isNew, pages: state.pages, sections: state.sections, events: state.events,
      dur: state.dur, depth: state.depth, ref: state.ref, utm: state.utm || null, lang: lang(), theme: document.documentElement.getAttribute("data-theme"),
      sw: window.screen && screen.width, admin: admin });
    try {
      if (navigator.sendBeacon && navigator.sendBeacon("/api/track", new Blob([payload], { type: "application/json" }))) return;
    } catch (e) {}
    try { fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: payload, keepalive: true }).catch(function () {}); } catch (e) {}
  }

  // sections reached (at least a third of the section on screen)
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && state.sections.indexOf(e.target.id) < 0) { state.sections.push(e.target.id); dirty = true; }
      });
    }, { threshold: 0.33 });
    var watch = function () { document.querySelectorAll("main > section[id], section.doc-view[id]").forEach(function (s) { io.observe(s); }); };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", watch); else watch();
  }
  // scroll depth
  window.addEventListener("scroll", function () {
    var h = document.documentElement, max = h.scrollHeight - h.clientHeight;
    var d = max > 0 ? Math.round(h.scrollTop / max * 100) : 100;
    if (d > state.depth) { state.depth = d; dirty = true; }
  }, { passive: true });

  // public API for the site script: uzla.event("cta_click", "homepage")
  window.uzla = {
    event: function (name, label) {
      if (!/^[a-z0-9_-]{1,40}$/i.test(name)) return;
      if (state.events.length >= 60) return;
      state.events.push(label ? { n: name, s: String(label).slice(0, 40) } : { n: name });
      dirty = true;
      if (/^lead_submit/.test(name)) send();          // conversions are sent right away
    }
  };

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") send(true); else visibleSince = Date.now();
  });
  window.addEventListener("pagehide", function () { send(true); });
  setTimeout(function () { send(); }, 8000);          // quick first record, so short visits still count
  setInterval(function () { if (document.visibilityState === "visible") send(); }, 60000);
})();
