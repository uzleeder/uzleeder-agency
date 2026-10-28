/* UzLeeder print kit — print options for certificates, contracts and policy documents.
   Colour: Colourful (brand colours, backgrounds kept) or Black & white (greyscale, white paper).
   Orientation: Portrait or Landscape (A4). The choice is remembered on this device only.
   Wiring: existing buttons with onclick="window.print()" or [data-print] open the dialog;
   pages without one get a floating "Print" button. Nothing is sent anywhere. */
(function () {
  "use strict";
  var KEY = "uzleeder_print", d = document, root = d.documentElement;
  var pref = { color: "color", size: "portrait" };
  try { var s = JSON.parse(localStorage.getItem(KEY) || "null"); if (s) { if (s.color === "bw" || s.color === "color") pref.color = s.color; if (s.size === "portrait" || s.size === "landscape") pref.size = s.size; } } catch (e) {}

  var css = d.createElement("style");
  css.textContent =
    ".pk-fab{position:fixed;right:18px;bottom:18px;z-index:9998;display:inline-flex;align-items:center;gap:8px;padding:11px 16px;border:0;border-radius:999px;background:#E3242B;color:#fff;font:600 14px/1 system-ui,-apple-system,'Segoe UI',sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.22);cursor:pointer}" +
    ".pk-fab:focus-visible,.pk-dlg button:focus-visible{outline:3px solid #0F1B2D;outline-offset:2px}" +
    ".pk-back{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(10,14,22,.55)}" +
    ".pk-dlg{width:100%;max-width:380px;background:#fff;color:#0F1B2D;border-radius:16px;padding:20px 20px 18px;box-shadow:0 24px 60px rgba(0,0,0,.35);font:14px/1.45 system-ui,-apple-system,'Segoe UI',sans-serif}" +
    /* the host document's own h2/legend styles must not leak into the dialog */
    ".pk-dlg h2{margin:0 0 14px!important;padding:0!important;border:0!important;background:none!important;font:700 17px/1.3 system-ui,-apple-system,'Segoe UI',sans-serif!important;letter-spacing:normal!important;text-transform:none!important;color:#0F1B2D!important;text-align:left!important}" +
    ".pk-dlg h2::before,.pk-dlg h2::after,.pk-dlg legend::before,.pk-dlg legend::after{content:none!important;display:none!important}" +
    ".pk-dlg fieldset{border:0;margin:0 0 14px;padding:0}.pk-dlg legend{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#5b6475;margin-bottom:8px}" +
    ".pk-opts{display:grid;grid-template-columns:1fr 1fr;gap:8px}" +
    ".pk-opt{display:flex;flex-direction:column;align-items:center;gap:8px;padding:12px 8px;border:1.5px solid #d8dce3;border-radius:12px;background:#fff;color:#0F1B2D;font:600 13px system-ui,sans-serif;cursor:pointer}" +
    ".pk-opt[aria-checked=true]{border-color:#E3242B;box-shadow:0 0 0 3px rgba(227,36,43,.14)}" +
    ".pk-sw{display:flex;gap:4px}.pk-sw i{width:14px;height:14px;border-radius:50%;border:1px solid rgba(0,0,0,.15)}" +
    ".pk-pg{background:#fff;border:1.5px solid #0F1B2D;border-radius:2px}" +
    ".pk-acts{display:flex;justify-content:flex-end;gap:8px;margin-top:4px}" +
    ".pk-btn{padding:10px 16px;border-radius:10px;border:1.5px solid #d8dce3;background:#fff;color:#0F1B2D;font:600 14px system-ui,sans-serif;cursor:pointer}" +
    ".pk-btn.pk-go{background:#E3242B;border-color:#E3242B;color:#fff}" +
    ".pk-note{margin:0 0 12px;font-size:12px;color:#5b6475}" +
    "@media print{.pk-fab,.pk-back{display:none!important}" +
      "html[data-pk-color=color] *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}" +
      "html[data-pk-color=bw]{background:#fff!important}html[data-pk-color=bw] body{filter:grayscale(1) contrast(1.08)!important;background:#fff!important}}";
  d.head.appendChild(css);

  var page = d.createElement("style"); page.id = "pk-page"; d.head.appendChild(page);
  function apply() {
    root.setAttribute("data-pk-color", pref.color);
    root.setAttribute("data-pk-size", pref.size);
    page.textContent = "@page{size:A4 " + pref.size + ";margin:10mm}";
  }
  apply();

  function opt(group, value, label, art) {
    return '<button type="button" class="pk-opt" role="radio" data-g="' + group + '" data-v="' + value + '" aria-checked="' + (pref[group] === value) + '">' + art + label + "</button>";
  }
  var SW_COLOR = '<span class="pk-sw" aria-hidden="true"><i style="background:#E3242B"></i><i style="background:#0F1B2D"></i><i style="background:#C9A227"></i></span>';
  var SW_BW = '<span class="pk-sw" aria-hidden="true"><i style="background:#fff"></i><i style="background:#888"></i><i style="background:#000"></i></span>';
  var PG_P = '<span class="pk-pg" aria-hidden="true" style="width:22px;height:30px"></span>';
  var PG_L = '<span class="pk-pg" aria-hidden="true" style="width:30px;height:22px"></span>';

  var back = null, opener = null;
  function close() { if (!back) return; back.remove(); back = null; d.removeEventListener("keydown", onKey, true); if (opener) opener.focus(); }
  function onKey(e) {
    if (e.key === "Escape") { e.preventDefault(); close(); }
    if (e.key === "Tab" && back) { var f = back.querySelectorAll("button"), a = f[0], z = f[f.length - 1]; if (e.shiftKey && d.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && d.activeElement === z) { e.preventDefault(); a.focus(); } }
  }
  function open(e) {
    if (e) e.preventDefault();
    opener = d.activeElement;
    back = d.createElement("div"); back.className = "pk-back";
    back.innerHTML = '<div class="pk-dlg" role="dialog" aria-modal="true" aria-labelledby="pkTitle"><h2 id="pkTitle">Print this document</h2>' +
      '<fieldset><legend>Colour</legend><div class="pk-opts" role="radiogroup" aria-label="Colour">' + opt("color", "color", "Colourful", SW_COLOR) + opt("color", "bw", "Black &amp; white", SW_BW) + "</div></fieldset>" +
      '<fieldset><legend>Page (A4)</legend><div class="pk-opts" role="radiogroup" aria-label="Orientation">' + opt("size", "portrait", "Portrait", PG_P) + opt("size", "landscape", "Landscape", PG_L) + "</div></fieldset>" +
      '<p class="pk-note">For a PDF, choose “Save as PDF” in the print window.</p>' +
      '<div class="pk-acts"><button type="button" class="pk-btn" data-pk="cancel">Cancel</button><button type="button" class="pk-btn pk-go" data-pk="print">Print</button></div></div>';
    d.body.appendChild(back);
    back.addEventListener("click", function (ev) {
      if (ev.target === back) return close();
      var o = ev.target.closest(".pk-opt");
      if (o) { pref[o.dataset.g] = o.dataset.v; back.querySelectorAll('.pk-opt[data-g="' + o.dataset.g + '"]').forEach(function (b) { b.setAttribute("aria-checked", b === o ? "true" : "false"); }); return; }
      var a = ev.target.closest("[data-pk]"); if (!a) return;
      if (a.dataset.pk === "cancel") return close();
      try { localStorage.setItem(KEY, JSON.stringify(pref)); } catch (err) {}
      apply(); close();
      setTimeout(function () { window.print(); }, 60);
    });
    d.addEventListener("keydown", onKey, true);
    back.querySelector('.pk-opt[aria-checked="true"]').focus();
  }

  function wire() {
    var btns = Array.prototype.slice.call(d.querySelectorAll('[onclick*="window.print"],[data-print]'));
    btns.forEach(function (b) { b.removeAttribute("onclick"); b.addEventListener("click", open); b.setAttribute("aria-haspopup", "dialog"); });
    if (!btns.length) {
      var f = d.createElement("button"); f.type = "button"; f.className = "pk-fab"; f.setAttribute("aria-haspopup", "dialog");
      f.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>Print';
      f.addEventListener("click", open); d.body.appendChild(f);
    }
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", wire); else wire();
  window.PrintKit = { open: open };
})();
