// /partners/apply — the Partner Program application, five steps.
// Server: POST /api/contact?partner=1 (api/_lib/partners.js) validates everything again; the success screen appears only after it saved the record.
// The unsent draft lives in this tab's sessionStorage (a convenience only — never the record).
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (v) { return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var root = document.documentElement, body = $("#paBody");
  $("#themeToggle").addEventListener("click", function () { var t = root.getAttribute("data-theme") === "light" ? "dark" : "light"; root.setAttribute("data-theme", t); try { localStorage.setItem("uzleeder_theme", t); } catch (e) {} });

  var STEPS = [["you", "About you"], ["contact", "How we reply"], ["work", "Experience & evidence"], ["give", "Your contribution"], ["review", "Review & submit"]];
  var info = null, open = false, step = 0, maxStep = 0;
  var d = { applicantType: "individual", name: "", organization: "", authority: "", role: "", location: "", email: "", contactMethod: "email", contactDetail: "", skills: "", previousWork: "", links: [""], areas: [], motivation: "", collabKind: "", collaboration: "", availability: "", additional: "" };
  try { var saved = JSON.parse(sessionStorage.getItem("uz_partner_draft") || "null"); if (saved && typeof saved === "object") Object.assign(d, saved.d || {}), step = maxStep = Math.min(saved.step || 0, 4); } catch (e) {}
  var persist = function () { try { sessionStorage.setItem("uz_partner_draft", JSON.stringify({ d: d, step: step })); } catch (e) {} };

  /* ---------- building blocks ---------- */
  function field(k, label, o) {
    o = o || {};
    var id = "pa-" + k, val = d[k] || "", req = o.req ? ' required aria-required="true"' : "";
    var ctl = o.area ? '<textarea id="' + id + '" name="' + k + '" rows="' + (o.rows || 5) + '" maxlength="' + (o.max || 4000) + '"' + req + (o.ph ? ' placeholder="' + esc(o.ph) + '"' : "") + ' aria-describedby="' + id + '-hint ' + id + '-err">' + esc(val) + "</textarea>"
      : '<input id="' + id + '" name="' + k + '" type="' + (o.type || "text") + '" value="' + esc(val) + '" maxlength="' + (o.max || 200) + '"' + req + (o.ph ? ' placeholder="' + esc(o.ph) + '"' : "") + (o.auto ? ' autocomplete="' + o.auto + '"' : "") + ' aria-describedby="' + id + '-hint ' + id + '-err"/>';
    return '<div class="field pa-field" data-f="' + k + '"><label for="' + id + '">' + esc(label) + (o.req ? ' <span class="pp-req" aria-hidden="true">*</span>' : ' <span class="pa-opt">optional</span>') + "</label>" + ctl +
      '<div class="pa-under"><span class="pa-hint" id="' + id + '-hint">' + esc(o.hint || "") + "</span>" + (o.area && o.count ? '<span class="pa-chars" data-count="' + k + '">' + val.length + " / " + (o.max || 4000) + "</span>" : "") + "</div>" +
      '<span class="field-err" id="' + id + '-err">' + esc(o.err || "This field is required.") + "</span></div>";
  }
  function choices(name, legend, opts, hint) {
    return '<fieldset class="pa-choices" data-f="' + name + '"><legend>' + esc(legend) + ' <span class="pp-req" aria-hidden="true">*</span></legend>' + (hint ? '<p class="pa-hint">' + esc(hint) + "</p>" : "") + '<div class="pa-choice-grid">' + opts.map(function (o) {
      return '<label class="pa-choice"><input type="radio" name="' + name + '" value="' + o[0] + '"' + (d[name] === o[0] ? " checked" : "") + "/><span class=\"pa-choice-in\">" + (o[3] || "") + "<b>" + esc(o[1]) + "</b><small>" + esc(o[2]) + "</small></span></label>";
    }).join("") + "</div></fieldset>";
  }
  var ICON = {
    individual: '<svg class="pa-ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
    team: '<svg class="pa-ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3.5"/><circle cx="17" cy="9" r="2.8"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M15 14.5a5 5 0 0 1 6.5 5.5"/></svg>',
    organization: '<svg class="pa-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21V5l8-3 8 3v16"/><path d="M9 21v-5h6v5M8 8h2M14 8h2M8 12h2M14 12h2"/></svg>',
    email: '<svg class="pa-ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="m3.5 7.5 8.5 6 8.5-6"/></svg>',
    telegram: '<svg class="pa-ico pa-ico-fill" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#29A9EB"/><path fill="#fff" d="M5.3 11.7 17 7.2c.5-.2 1 .1.8.9l-2 9.4c-.1.6-.6.8-1.1.5l-3-2.2-1.5 1.4c-.2.2-.3.3-.6.3l.2-3.1 5.7-5.1c.2-.2 0-.4-.4-.1l-7 4.4-3-.9c-.7-.2-.7-.6.2-1z"/></svg>',
    phone: '<svg class="pa-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>'
  };
  var COLLAB = ["Project-based", "Part-time", "Advisory", "Full-time", "Other"];

  /* ---------- steps ---------- */
  var VIEWS = [
    function () {
      return choices("applicantType", "You are applying as", [["individual", "An individual", "Your own skills and work", ICON.individual], ["team", "A team", "A group working together", ICON.team], ["organization", "An organization", "A company or studio", ICON.organization]]) +
        field("name", d.applicantType === "individual" ? "Full name" : "Your full name (the representative)", { req: true, auto: "name", ph: "Name Surname" }) +
        '<div class="pa-org"' + (d.applicantType === "individual" ? " hidden" : "") + ">" + field("organization", d.applicantType === "team" ? "Team name" : "Organization name", { req: true, ph: d.applicantType === "team" ? "Team Name" : "Organization Name" }) +
        field("authority", "Your authority to apply on its behalf", { req: true, max: 300, ph: "e.g. founder; team lead, applying with the team's agreement" }) + "</div>" +
        field("role", "Professional role or area of expertise", { req: true, ph: "e.g. Full-stack developer, product designer" }) +
        field("location", "Country or general location", { max: 120, ph: "e.g. Tashkent, Uzbekistan", hint: "A city or country is enough." });
    },
    function () {
      return field("email", "Email address", { req: true, type: "email", auto: "email", ph: "you@example.com", err: "Enter a valid email address.", hint: "Needed for your application record, even if you prefer another channel." }) +
        choices("contactMethod", "Where should we reply?", [["email", "Email", "We write to your email", ICON.email], ["telegram", "Telegram", "Message on Telegram", ICON.telegram], ["phone", "Phone", "Call or WhatsApp", ICON.phone]]) +
        '<div class="pa-contact"' + (d.contactMethod === "email" ? " hidden" : "") + ">" + field("contactDetail", d.contactMethod === "phone" ? "Phone number" : "Telegram username or phone", { req: true, max: 120, ph: d.contactMethod === "phone" ? "+998 90 123 45 67" : "@username" }) + "</div>" +
        '<p class="pa-note">We reply through this channel. No email is sent automatically — every update also appears on your private application page.</p>';
    },
    function () {
      return field("skills", "Skills and relevant experience", { req: true, area: true, count: true, ph: "What you are good at, tools you use, years of experience…", hint: "Be specific — what you can actually do." }) +
        field("previousWork", "Previous work or projects", { req: true, area: true, count: true, ph: "One or two projects: what it was, what you did, what the result was.", hint: "Describe your own part." }) +
        '<fieldset class="pa-links" data-f="links"><legend>Links to your work <span class="pa-opt">optional</span></legend><p class="pa-hint">Portfolio, GitHub, LinkedIn, Behance or a live project — full https:// links.</p><div id="paLinks">' +
        d.links.map(function (l, i) { return linkRow(l, i); }).join("") + '</div><button type="button" class="pa-add" id="paAddLink"' + (d.links.length >= 6 ? " hidden" : "") + '>+ Add another link</button><span class="field-err">Use full https:// links (for example https://github.com/you).</span></fieldset>';
    },
    function () {
      return '<fieldset class="pa-areas" data-f="areas"><legend>Where do you want to contribute? <span class="pp-req" aria-hidden="true">*</span></legend><p class="pa-hint">Choose one or more.</p><div class="pa-tiles">' +
        info.areas.map(function (a, i) { return '<label class="pa-tile"><input type="checkbox" name="areas" value="' + esc(a) + '"' + (d.areas.indexOf(a) >= 0 ? " checked" : "") + '/><span>' + esc(a) + "</span></label>"; }).join("") +
        '</div><span class="field-err">Choose at least one area.</span></fieldset>' +
        field("motivation", "Why UzLeeder — and what would you contribute?", { req: true, area: true, count: true, ph: "What you want to work on and the value you would bring." }) +
        '<fieldset class="pa-collab" data-f="collaboration"><legend>Preferred collaboration <span class="pp-req" aria-hidden="true">*</span></legend><div class="pa-chips">' +
        COLLAB.map(function (c) { return '<label class="pa-chip"><input type="radio" name="collabKind" value="' + c + '"' + (d.collabKind === c ? " checked" : "") + "/><span>" + c + "</span></label>"; }).join("") +
        "</div>" + field("collaboration", "Describe it in a few words", { req: true, max: 300, ph: "e.g. project-based design work, 10–15 hours a week" }) + '<span class="field-err">Choose a type or describe it.</span></fieldset>' +
        field("availability", "Availability or expected contribution", { max: 300, ph: "e.g. 15 hours a week from November" }) +
        field("additional", "Anything else we should know", { area: true, rows: 3 });
    },
    function () {
      var row = function (k, l) { var v = d[k]; if (k === "links") v = d.links.filter(Boolean).join("\n"); if (k === "areas") v = d.areas.join(", "); if (k === "applicantType" || k === "contactMethod") v = v.charAt(0).toUpperCase() + v.slice(1); return v ? "<div><dt>" + l + "</dt><dd>" + esc(v) + "</dd></div>" : ""; };
      var grp = function (i, rows) { return '<section class="pa-sum"><div class="pa-sum-h"><h3>' + STEPS[i][1] + '</h3><button type="button" class="pa-edit" data-goto="' + i + '">Edit</button></div><dl class="pp-dl compact">' + rows + "</dl></section>"; };
      var v = info.notices.version;
      return '<p class="pa-note">Check everything below. Nothing has been sent yet.</p>' +
        grp(0, row("applicantType", "Applying as") + row("name", "Name") + row("organization", "Team / organization") + row("authority", "Authority") + row("role", "Role") + row("location", "Location")) +
        grp(1, row("email", "Email") + row("contactMethod", "Reply by") + row("contactDetail", "Telegram / phone")) +
        grp(2, row("skills", "Skills") + row("previousWork", "Previous work") + row("links", "Links")) +
        grp(3, row("areas", "Areas") + row("motivation", "Motivation") + row("collaboration", "Collaboration") + row("availability", "Availability") + row("additional", "Additional")) +
        '<fieldset class="pa-acks"><legend>Required</legend>' +
        '<label class="pp-check"><input type="checkbox" name="truth"/><span>My application is truthful to the best of my knowledge.</span></label>' +
        '<label class="pp-check"><input type="checkbox" name="conditions"/><span>I have read and acknowledge the <a href="/partners#conditions" target="_blank" rel="noopener">partnership conditions</a> (version ' + esc(v) + ").</span></label>" +
        '<label class="pp-check"><input type="checkbox" name="privacy"/><span>I have read the separate <a href="/partners#privacy" target="_blank" rel="noopener">privacy notice</a> (version ' + esc(v) + ").</span></label></fieldset>" +
        '<fieldset class="pa-acks pa-optional"><legend>Optional</legend><label class="pp-check"><input type="checkbox" name="updates"/><span>Also contact me about future collaboration opportunities. You can change this later.</span></label></fieldset>' +
        '<p class="pa-small pp-muted">The time and the notice version of each acknowledgement are stored with your application. This is an acknowledgement, not a universal electronic signature or a confidentiality agreement.</p>';
    }
  ];
  function linkRow(v, i) { return '<div class="pa-link-row"><label class="pp-vh" for="pa-link-' + i + '">Link ' + (i + 1) + '</label><input id="pa-link-' + i + '" type="url" inputmode="url" data-link="' + i + '" value="' + esc(v) + '" placeholder="https://" maxlength="300"/>' + (i ? '<button type="button" class="pa-x" data-rm="' + i + '" aria-label="Remove link ' + (i + 1) + '">×</button>' : "") + "</div>"; }

  /* ---------- validation per step ---------- */
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, HTTPS = /^https:\/\/[^\s@/]+\.[^\s]+$/;
  function checks() {
    var org = d.applicantType !== "individual";
    return [
      [["name", d.name.length >= 2], ["organization", !org || d.organization.length >= 2], ["authority", !org || d.authority.length >= 3], ["role", d.role.length >= 3]],
      [["email", EMAIL.test(d.email)], ["contactDetail", d.contactMethod === "email" || d.contactDetail.length >= 3]],
      [["skills", d.skills.length >= 3], ["previousWork", d.previousWork.length >= 3], ["links", d.links.filter(Boolean).every(function (u) { return HTTPS.test(u); })]],
      [["areas", d.areas.length > 0], ["motivation", d.motivation.length >= 3], ["collaboration", d.collaboration.length >= 3]],
      []
    ];
  }
  function validStep(i) { return checks()[i].every(function (c) { return c[1]; }); }
  function showErrors() {
    var bad = [];
    checks()[step].forEach(function (c) { var box = $('[data-f="' + c[0] + '"]', body); if (!box) return; box.classList.toggle("invalid", !c[1]); $$("input,textarea", box).forEach(function (x) { if (x.type !== "radio" && x.type !== "checkbox") x.setAttribute("aria-invalid", c[1] ? "false" : "true"); }); if (!c[1]) bad.push(box); });
    return bad;
  }

  /* ---------- render ---------- */
  function render(focus) {
    var last = step === STEPS.length - 1;
    $("#paBar").style.width = ((step + 1) / STEPS.length * 100) + "%";
    $("#paCount").textContent = "Step " + (step + 1) + " of " + STEPS.length + " — " + STEPS[step][1];
    $("#paSteps").innerHTML = STEPS.map(function (s, i) {
      var state = i < step || (i <= maxStep && validStep(i) && i !== step) ? "done" : i === step ? "now" : "";
      var can = i <= maxStep && i !== step;
      return '<li class="' + state + '">' + (can ? '<button type="button" data-goto="' + i + '">' : "<span>") + '<i aria-hidden="true">' + (state === "done" ? "✓" : i + 1) + "</i>" + esc(s[1]) + (state === "now" ? '<span class="pp-vh"> (current step)</span>' : "") + (can ? "</button>" : "</span>") + "</li>";
    }).join("");
    body.innerHTML = (!open ? '<div class="pa-closed" role="status"><b>Applications are not open yet.</b> You can look through the form, but submitting is turned off until UzLeeder finishes reviewing the program conditions and privacy details.</div>' : "") +
      '<form id="paForm" novalidate><h2 id="paStepTitle" tabindex="-1">' + esc(STEPS[step][1]) + "</h2>" + VIEWS[step]() +
      '<div class="pp-alert" role="alert" hidden></div>' +
      '<label class="trap" aria-hidden="true">Website<input tabindex="-1" name="website" autocomplete="off"/></label>' +
      '<div class="pa-nav">' + (step ? '<button type="button" class="btn btn-ghost" id="paPrev"><svg class="ico" aria-hidden="true"><use href="#i-back"/></svg>Back</button>' : '<a class="btn btn-ghost" href="/partners">Cancel</a>') +
      (last ? '<button type="submit" class="btn btn-primary" id="paSubmit"' + (open ? "" : " disabled") + '>' + (open ? "Submit application" : "Submitting is not open yet") + "</button>"
        : '<button type="submit" class="btn btn-primary">Continue<svg class="ico" aria-hidden="true"><use href="#i-arrow"/></svg></button>') + "</div></form>";
    bind();
    if (focus) { var h = $("#paStepTitle"); var y = $(".pa-card").getBoundingClientRect().top + window.scrollY - 90; if (y < window.scrollY) window.scrollTo({ top: Math.max(0, y), behavior: "instant" }); h.focus({ preventScroll: true }); }
  }
  function go(i) { step = Math.max(0, Math.min(STEPS.length - 1, i)); maxStep = Math.max(maxStep, step); persist(); render(true); }

  function bind() {
    var form = $("#paForm");
    form.addEventListener("input", function (e) {
      var t = e.target, k = t.name;
      if (t.dataset.link !== undefined) { d.links[+t.dataset.link] = t.value.trim(); }
      else if (k && k in d && t.type !== "radio" && t.type !== "checkbox") d[k] = t.value.trim();
      var c = k && $('[data-count="' + k + '"]', form); if (c) c.textContent = t.value.length + " / " + t.maxLength;
      var box = t.closest("[data-f]"); if (box) box.classList.remove("invalid");
      persist();
    });
    form.addEventListener("change", function (e) {
      var t = e.target;
      if (t.name === "applicantType" || t.name === "contactMethod") { d[t.name] = t.value; persist(); render(false); var x = $('[name="' + t.name + '"]:checked', body); if (x) x.focus(); return; }
      if (t.name === "areas") { d.areas = $$("[name=areas]:checked", form).map(function (x) { return x.value; }); $('[data-f="areas"]', form).classList.remove("invalid"); persist(); }
      if (t.name === "collabKind") { d.collabKind = t.value; var c = $("[name=collaboration]", form); if (!c.value || COLLAB.indexOf(c.value) >= 0) { c.value = t.value; d.collaboration = t.value; } persist(); }
    });
    var add = $("#paAddLink", form);
    if (add) add.onclick = function () { d.links.push(""); persist(); $("#paLinks").insertAdjacentHTML("beforeend", linkRow("", d.links.length - 1)); $("[data-link='" + (d.links.length - 1) + "']").focus(); add.hidden = d.links.length >= 6; };
    // remove buttons also exist on rows added after render, so listen on the form
    form.addEventListener("click", function (e) { var b = e.target.closest("[data-rm]"); if (!b) return; d.links.splice(+b.dataset.rm, 1); persist(); render(false); var l = $("[data-link]:last-of-type", body); if (l) l.focus(); });
    $$("[data-goto]").forEach(function (b) { b.onclick = function () { go(+b.dataset.goto); }; });
    var prev = $("#paPrev", form); if (prev) prev.onclick = function () { go(step - 1); };
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var alert = $(".pp-alert", form);
      if (step < STEPS.length - 1) {
        var bad = showErrors();
        if (bad.length) { alert.hidden = false; alert.textContent = "Please complete the highlighted " + (bad.length === 1 ? "field" : bad.length + " fields") + "."; var f = $("input:not([type=radio]):not([type=checkbox]),textarea", bad[0]) || $("input", bad[0]); if (f) f.focus(); return; }
        return go(step + 1);
      }
      submit(form, alert);
    });
  }

  async function submit(form, alert) {
    if (!open) return;
    for (var i = 0; i < 4; i++) if (!validStep(i)) { alert.hidden = false; alert.textContent = "Step " + (i + 1) + " (" + STEPS[i][1] + ") needs attention."; return; }
    var acks = {}; ["truth", "conditions", "privacy", "updates"].forEach(function (k) { acks[k] = $("[name=" + k + "]", form).checked; });
    if (!acks.truth || !acks.conditions || !acks.privacy) { alert.hidden = false; alert.textContent = "Please tick the three required acknowledgements. The optional one is up to you."; return; }
    var btn = $("#paSubmit"); btn.disabled = true; btn.textContent = "Submitting…"; alert.hidden = true;
    var key = null; try { key = sessionStorage.getItem("uz_partner_pending"); } catch (e) {}
    if (!key) { key = Array.from(crypto.getRandomValues(new Uint8Array(32)), function (b) { return b.toString(16).padStart(2, "0"); }).join(""); try { sessionStorage.setItem("uz_partner_pending", key); } catch (e) {} }
    var payload = { action: "submit", key: key, version: info.notices.version, website: form.elements.website.value,
      name: d.name, email: d.email, contactMethod: d.contactMethod, contactDetail: d.contactMethod === "email" ? "" : d.contactDetail, location: d.location,
      applicantType: d.applicantType, organization: d.applicantType === "individual" ? "" : d.organization, authority: d.applicantType === "individual" ? "" : d.authority,
      role: d.role, links: d.links.filter(Boolean).join("\n"), skills: d.skills, motivation: d.motivation, previousWork: d.previousWork,
      availability: d.availability, collaboration: d.collaboration, additional: d.additional, areas: d.areas };
    Object.assign(payload, acks);
    try {
      var j = await window.PartnerUI.request(payload);
      try { sessionStorage.setItem("uz_partner_access", JSON.stringify({ id: j.record.id, key: key })); sessionStorage.removeItem("uz_partner_pending"); sessionStorage.removeItem("uz_partner_draft"); } catch (e) {}
      done(j.record, key);
    } catch (err) {
      alert.hidden = false; alert.textContent = err.message + " Your application was not submitted — please try again.";
      btn.disabled = false; btn.textContent = "Submit application";
    }
  }

  function done(rec, key) {
    $(".pa-progress span").style.width = "100%";
    $("#paCount").textContent = "Submitted";
    $("#paSteps").innerHTML = STEPS.map(function (s) { return '<li class="done"><span><i aria-hidden="true">✓</i>' + esc(s[1]) + "</span></li>"; }).join("");
    body.innerHTML = '<div class="pa-done" tabindex="-1" id="paDone"><div class="pa-check" aria-hidden="true">✓</div><h2>Your application is saved.</h2><p class="pp-muted">Thank you. A person will review it — there is no automatic decision and no fixed timeline.</p>' +
      '<dl class="pp-dl"><div><dt>Application reference</dt><dd class="pp-mono">' + esc(rec.id) + '</dd></div><div><dt>Status</dt><dd>' + esc(rec.status) + " — no decision has been made yet</dd></div></dl>" +
      '<div class="pp-key"><p><b>Your private access key.</b> With the reference, it opens your application on any device. It is shown only now and cannot be recovered — save it somewhere safe and don\'t share it.</p><code class="pp-mono" id="paKey">' + esc(key) + "</code>" +
      '<div class="pa-key-acts"><button type="button" class="btn btn-ghost" id="paCopy">Copy key</button><button type="button" class="btn btn-ghost" id="paSave">Save as a text file</button></div></div>' +
      '<div class="pa-nav"><a class="btn btn-primary" href="/workspace/partners">Open my application<svg class="ico" aria-hidden="true"><use href="#i-arrow"/></svg></a><a class="btn btn-ghost" href="/partners">Back to the program</a></div></div>';
    var box = $("#paDone"); window.scrollTo({ top: Math.max(0, $(".pa-card").getBoundingClientRect().top + window.scrollY - 90), behavior: "instant" }); box.focus({ preventScroll: true });
    $("#paCopy").onclick = function () { var b = this; navigator.clipboard.writeText(key).then(function () { b.textContent = "Copied"; }, function () { b.textContent = "Select the key above to copy"; }); };
    $("#paSave").onclick = function () {
      var txt = "UzLeeder Partner Program\n\nApplication reference: " + rec.id + "\nPrivate access key: " + key + "\n\nOpen your application: " + location.origin + "/workspace/partners\nKeep this file private.\n";
      var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([txt], { type: "text/plain" })); a.download = "uzleeder-partner-" + rec.id + ".txt"; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
    };
  }

  function start() {
    window.PartnerUI.request({ action: "info" }).then(function (j) {
      info = j; open = !!j.config.enabled;
      d.areas = d.areas.filter(function (a) { return info.areas.indexOf(a) >= 0; });
      render(false);
    }).catch(function (e) {
      body.innerHTML = '<div class="pa-closed" role="alert"><b>The application could not load.</b> ' + esc(e.message) + " Please refresh the page or try again later.</div>";
    });
  }
  if (window.PartnerUI) start(); else window.addEventListener("load", start);
})();
