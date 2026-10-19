// Builds sign.html — everything about the "Crafted by UzLeeder" digital signature in ONE self-contained file:
// live badge (crafted.js is embedded, so it works offline / from the desktop), previews, motion, anatomy,
// colours, embed code (one line · full inline · plain HTML), download and rules.
//   node server/build-sign.cjs      (run again whenever crafted.js changes)
"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
// "</script" inside the embedded code would end the <script> tag early; "<\/script" means the same in JS
const src = fs.readFileSync(path.join(ROOT, "crafted.js"), "utf8").replace(/<\/script/gi, "<\\/script").trim();

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Sign · Crafted by UzLeeder</title>
<meta name="description" content="The UzLeeder digital signature: live badge, motion, anatomy, colours, embed code and rules — in one file."/>
<meta name="robots" content="noindex"/>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 44'%3E%3Cpath d='M4 41 24 5l20 36' fill='none' stroke='%23f0384e' stroke-width='7'/%3E%3Cpath d='M14 41 24 23l10 18' fill='none' stroke='%23fff' stroke-width='5.5'/%3E%3C/svg%3E"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700&family=Outfit:wght@700;800&display=swap" rel="stylesheet"/>
<style>
  :root{--bg:#07090d;--surface:#10141c;--surface2:#151a24;--line:rgba(255,255,255,.1);--text:#f2f4f8;--muted:#9098a8;--red:#f0384e;--red2:#ff5468;color-scheme:dark}
  *{box-sizing:border-box;margin:0}
  html{scroll-behavior:smooth}
  body{font-family:Manrope,'Segoe UI',system-ui,sans-serif;background:var(--bg);color:var(--text);line-height:1.6}
  main{max-width:1000px;margin:0 auto;padding:0 16px 90px}
  a{color:var(--red2)}
  h1{font-family:Outfit,sans-serif;font-size:clamp(2rem,5vw,3.2rem);letter-spacing:-.025em;line-height:1.05}
  h2{font-family:Outfit,sans-serif;font-size:clamp(1.3rem,2.6vw,1.7rem);letter-spacing:-.015em;margin:0 0 10px}
  h3{font-family:Outfit,sans-serif;font-size:1.05rem;margin:18px 0 6px}
  p{color:var(--muted);max-width:70ch}
  .k{font:700 .72rem/1 ui-monospace,Consolas,monospace;letter-spacing:.22em;color:var(--red);margin-bottom:12px;text-transform:uppercase}
  section{padding:56px 0 0}
  section+section{border-top:1px solid var(--line);margin-top:56px}
  .toc{display:flex;flex-wrap:wrap;gap:8px;margin-top:22px}
  .toc a{font-size:.84rem;font-weight:600;color:var(--muted);text-decoration:none;padding:6px 12px;border:1px solid var(--line);border-radius:999px}
  .toc a:hover,.toc a:focus-visible{color:var(--text);border-color:var(--red)}
  /* hero */
  .hero{padding:70px 0 10px;text-align:center}
  .hero p{margin:12px auto 0}
  .stageBig{overflow:hidden;margin:34px auto 0;border:1px solid var(--line);border-radius:18px;background:radial-gradient(60% 80% at 50% 0%,rgba(240,56,78,.12),transparent 70%),linear-gradient(180deg,#0b1020,#0a0d1a);padding:44px 12px}
  .big{display:block;transform:scale(1.9);transform-origin:center}
  @media (max-width:560px){.big{transform:scale(1.25)}}
  .hint{font-size:.85rem;color:var(--muted);margin-top:26px}
  /* previews */
  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
  @media (max-width:820px){.grid2,.grid3{grid-template-columns:1fr}}
  .stage{border:1px solid var(--line);border-radius:14px;overflow:hidden}
  .stage-h{display:flex;justify-content:space-between;gap:10px;padding:8px 14px;font:600 .7rem/1.4 ui-monospace,Consolas,monospace;letter-spacing:.12em;color:var(--muted);border-bottom:1px solid var(--line)}
  .dark{background:linear-gradient(180deg,#0b1020,#0a0d1a)}
  .light{background:#f6f7f9;border-color:rgba(28,34,51,.14)}.light .stage-h{color:#5b6377;border-color:rgba(28,34,51,.12)}
  .foot{padding:22px 20px 6px}
  .foot-row{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;padding-bottom:16px;border-bottom:1px solid rgba(255,255,255,.08)}
  .light .foot-row{border-color:rgba(28,34,51,.1)}
  .client{display:flex;align-items:center;gap:10px}
  .client i{width:32px;height:32px;border-radius:9px;background:linear-gradient(135deg,#8ab4ff,#7c6cff);display:grid;place-items:center;font-style:normal;font-weight:800;color:#0b1020}
  .client b{display:block;font-family:Outfit,sans-serif;color:#fff}.light .client b{color:#10141f}
  .client small{color:#8e97ab;font-size:.72rem}
  .copy-r{font-size:.8rem;color:#aab2c4}.light .copy-r{color:#5b6377}
  .mini{padding:18px 10px}
  /* tables, code */
  table{width:100%;border-collapse:collapse;margin-top:10px;font-size:.9rem}
  td,th{text-align:left;padding:9px 10px;border-bottom:1px solid var(--line);vertical-align:top}
  th{color:var(--muted);font-weight:600;font-size:.8rem}
  code,.mono{font-family:ui-monospace,Consolas,monospace;font-size:.86em}
  code{color:#ffd0d6}
  .sw{display:inline-block;width:18px;height:18px;border-radius:5px;vertical-align:-4px;margin-right:8px;border:1px solid rgba(255,255,255,.2)}
  .r{color:var(--red)}.w{color:#fff}
  pre{background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:14px;overflow:auto;max-height:340px;font:.8rem/1.6 ui-monospace,Consolas,monospace;color:#d6dbe6;white-space:pre-wrap;word-break:break-all}
  .row{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:18px;flex-wrap:wrap}
  .row b{font-size:.95rem}
  .btns{display:flex;gap:8px;flex-wrap:wrap}
  button{font:inherit;font-size:.85rem;font-weight:700;color:var(--text);background:var(--surface2);border:1px solid var(--line);border-radius:8px;padding:7px 12px;cursor:pointer}
  button:hover{border-color:var(--red)}
  button.primary{background:var(--red);border-color:var(--red);color:#fff}
  button:focus-visible,a:focus-visible{outline:2px solid var(--red);outline-offset:2px}
  .card{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:18px}
  ul{color:var(--muted);padding-left:20px}
  li{margin:4px 0}
  ul.do li::marker{content:"✓  ";color:#22c55e}ul.dont li::marker{content:"✕  ";color:var(--red)}
  .timeline{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:10px;font:.82rem ui-monospace,Consolas,monospace}
  .timeline span{padding:6px 10px;border:1px solid var(--line);border-radius:8px;background:var(--surface)}
  .timeline i{font-style:normal;color:var(--muted)}
  .toast{position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:#fff;color:#07090d;font-weight:700;padding:8px 14px;border-radius:8px;opacity:0;transition:opacity .2s;pointer-events:none}
  .toast.on{opacity:1}
  footer{border-top:1px solid var(--line);margin-top:70px;padding-top:6px}
</style>
</head>
<body>
<main>

  <!-- 1 · LIVE -->
  <header class="hero">
    <p class="k">UzLeeder · digital signature</p>
    <h1>Crafted by UzLeeder</h1>
    <p>The signature at the very bottom of every website UzLeeder builds. The Λ mark sways; hover it and it types the family like the site intro.</p>
    <div class="stageBig"><uzleeder-crafted theme="dark" class="big"></uzleeder-crafted></div>
    <p class="hint">Hover (or focus with Tab) — <code>&lt;UzLeeder&gt;</code> → <code>&lt;LeeCodes&gt;</code> → <code>&lt;Max's Code&gt;</code>. Move away and it returns.</p>
    <nav class="toc" aria-label="On this page" style="justify-content:center">
      <a href="#previews">Previews</a><a href="#motion">Motion</a><a href="#anatomy">Anatomy &amp; colours</a><a href="#embed">Embed code</a><a href="#rules">Rules</a>
    </nav>
  </header>

  <!-- 2 · PREVIEWS -->
  <section id="previews" aria-labelledby="h-prev">
    <p class="k">01 · Previews</p>
    <h2 id="h-prev">On a real footer</h2>
    <div class="grid2">
      <div class="stage dark"><div class="stage-h"><span>DARK SITE</span><span>theme="dark"</span></div>
        <div class="foot"><div class="foot-row"><span class="client"><i>Σ</i><span><b>Client Name</b><small>Sample footer</small></span></span><span class="copy-r">© 2026 Client Name</span></div>
        <uzleeder-crafted theme="dark"></uzleeder-crafted></div></div>
      <div class="stage light"><div class="stage-h"><span>LIGHT SITE</span><span>theme="light"</span></div>
        <div class="foot"><div class="foot-row"><span class="client"><i>Σ</i><span><b>Client Name</b><small style="color:#5b6377">Sample footer</small></span></span><span class="copy-r">© 2026 Client Name</span></div>
        <uzleeder-crafted theme="light"></uzleeder-crafted></div></div>
    </div>
    <h3>Options</h3>
    <div class="grid3">
      <div class="stage dark"><div class="stage-h"><span>AUTO</span><span>theme="auto"</span></div><div class="mini"><uzleeder-crafted theme="auto"></uzleeder-crafted></div></div>
      <div class="stage dark"><div class="stage-h"><span>SMALL</span><span>size="sm"</span></div><div class="mini"><uzleeder-crafted theme="dark" size="sm"></uzleeder-crafted></div></div>
      <div class="stage light"><div class="stage-h"><span>LEFT</span><span>align="start"</span></div><div class="mini"><uzleeder-crafted theme="light" align="start"></uzleeder-crafted></div></div>
    </div>
  </section>

  <!-- 3 · MOTION -->
  <section id="motion" aria-labelledby="h-mot">
    <p class="k">02 · Motion</p>
    <h2 id="h-mot">How it moves</h2>
    <div class="grid2">
      <div class="card"><h3 style="margin-top:0">At rest — the sign sways</h3>
        <p>Only the Λ mark moves: it sways around its base, −5° → 0 → +5° → 0, in a 2.8 s loop. “CRAFTED BY” and the wordmark stay still.</p></div>
      <div class="card"><h3 style="margin-top:0">On hover / focus — typing</h3>
        <p>The wordmark becomes brackets and a red caret, like the site intro, and types the family one after another. Moving away returns it to <b class="w">Uz</b><b class="r">Leeder</b> at once.</p></div>
    </div>
    <table>
      <thead><tr><th>Word</th><th>Red</th><th>White (ink on light)</th><th>Click while it shows →</th></tr></thead>
      <tbody>
        <tr><td class="mono">&lt;<span class="w">Uz</span><span class="r">Leeder</span>&gt;</td><td class="r">Leeder</td><td>Uz</td><td><a href="https://uzleeder.vercel.app/?ref=crafted" target="_blank" rel="noopener">uzleeder.vercel.app</a></td></tr>
        <tr><td class="mono">&lt;<span class="r">Lee</span><span class="w">Codes</span>&gt;</td><td class="r">Lee</td><td>Codes</td><td><a href="https://t.me/leecodes" target="_blank" rel="noopener">t.me/leecodes</a></td></tr>
        <tr><td class="mono">&lt;<span class="r">Max's</span><span class="w"> Code</span>&gt;</td><td class="r">Max's</td><td>Code</td><td><a href="https://t.me/maxscode" target="_blank" rel="noopener">t.me/maxscode</a></td></tr>
      </tbody>
    </table>
    <p style="margin-top:10px">The link follows the word on screen. At rest (and on touch screens, where there is no hover) it always opens uzleeder.vercel.app.</p>
    <div class="timeline" aria-label="Typing timing"><span>type 85 ms / letter</span><i>→</i><span>hold 1.1 s</span><i>→</i><span>delete 40 ms / letter</span><i>→</i><span>pause 0.26 s</span><i>→</i><span>next word</span></div>
    <ul style="margin-top:14px">
      <li>Brackets and caret are red; the caret blinks once a second. The badge widens smoothly for the longer words — no jump.</li>
      <li>The sway pauses while it types and continues after.</li>
      <li><b style="color:var(--text)">Reduce motion</b> (system setting): no sway, no typing — hover swaps whole words every 1.1 s.</li>
      <li>Keyboard: Tab focuses it and starts the typing; the link name for screen readers is always “Crafted by UzLeeder”.</li>
    </ul>
  </section>

  <!-- 4 · ANATOMY -->
  <section id="anatomy" aria-labelledby="h-ana">
    <p class="k">03 · Anatomy &amp; colours</p>
    <h2 id="h-ana">What it is made of</h2>
    <table>
      <thead><tr><th>Part</th><th>Spec</th></tr></thead>
      <tbody>
        <tr><td><b>CRAFTED BY</b></td><td>Monospace (ui-monospace / Consolas), 11 px, weight 600, uppercase, tracking .28em, muted colour</td></tr>
        <tr><td><b>Λ mark</b></td><td>22 × 20 px on the 48 × 44 grid — outer Λ stroke 7, inner chevron stroke 5.5, miter joins</td></tr>
        <tr><td><b>Wordmark</b></td><td>Outfit 800, 17 px, tracking −.02em — <b class="w">Uz</b> + <b class="r">Leeder</b></td></tr>
        <tr><td><b>Layout</b></td><td>Gap 12 px · centred · 14 px above and below · link padding 4 × 6 px</td></tr>
        <tr><td><b>Small (size="sm")</b></td><td>9.5 px label · 18 × 16 px mark · 14 px wordmark · gap 9 px</td></tr>
      </tbody>
    </table>
    <table>
      <thead><tr><th>Colour</th><th>Dark site</th><th>Light site</th></tr></thead>
      <tbody>
        <tr><td>“Crafted by”</td><td><span class="sw" style="background:#8e97ab"></span><span class="mono">#8E97AB</span></td><td><span class="sw" style="background:#5b6377"></span><span class="mono">#5B6377</span></td></tr>
        <tr><td>“Uz” · inner Λ · white parts of typed words</td><td><span class="sw" style="background:#ffffff"></span><span class="mono">#FFFFFF</span></td><td><span class="sw" style="background:#1c2233"></span><span class="mono">#1C2233</span></td></tr>
        <tr><td>“Leeder” · outer Λ · brackets · caret · red parts</td><td><span class="sw" style="background:#f0384e"></span><span class="mono">#F0384E</span></td><td><span class="sw" style="background:#e01e37"></span><span class="mono">#E01E37</span></td></tr>
      </tbody>
    </table>
  </section>

  <!-- 5 · EMBED -->
  <section id="embed" aria-labelledby="h-emb">
    <p class="k">04 · Embed code</p>
    <h2 id="h-emb">Add it to a website</h2>
    <p>Put it at the very end of the site's footer. It renders in its own Shadow DOM — the site's CSS cannot break it and it cannot break the site.</p>

    <div class="row"><b>Option 1 — one line (recommended)</b><div class="btns"><button type="button" data-copy="embed">Copy</button></div></div>
    <pre id="code-embed"></pre>
    <table>
      <thead><tr><th>Attribute</th><th>Values</th></tr></thead>
      <tbody>
        <tr><td><code>theme</code></td><td><code>dark</code> (default) · <code>light</code> · <code>auto</code> — follows the visitor's system setting</td></tr>
        <tr><td><code>align</code></td><td><code>center</code> (default) · <code>start</code> · <code>end</code></td></tr>
        <tr><td><code>size</code></td><td><code>md</code> (default) · <code>sm</code></td></tr>
        <tr><td><code>fonts</code></td><td><code>none</code> — skip the tiny Outfit font subset (uses the system font)</td></tr>
      </tbody>
    </table>

    <div class="row"><b>Option 2 — full code inline (no external request)</b><div class="btns"><button type="button" data-copy="inline">Copy</button><button type="button" class="primary" id="dl">Download crafted.js</button></div></div>
    <p>For sites that must not load scripts from another domain. The same code as <code>crafted.js</code>, pasted into the page.</p>
    <pre id="code-inline"></pre>

    <div class="row"><b>Option 3 — plain HTML, static (no script at all)</b><div class="btns"><button type="button" data-copy="htmlDark">Copy · dark</button><button type="button" data-copy="htmlLight">Copy · light</button></div></div>
    <p>No motion and no typing — only the look. Uses the site's fonts when Outfit is not loaded.</p>
    <pre id="code-htmlDark"></pre>
  </section>

  <!-- 6 · RULES -->
  <section id="rules" aria-labelledby="h-rules">
    <p class="k">05 · Rules</p>
    <h2 id="h-rules">Use it honestly</h2>
    <div class="grid2">
      <div><ul class="do">
        <li>Only on websites UzLeeder really built — for client sites, agreed in the contract or with the client.</li>
        <li>Small, at the very bottom of the footer: it signs the work, it does not advertise.</li>
        <li>Use <code>theme</code> to match the site — never recolour it.</li>
      </ul></div>
      <div><ul class="dont">
        <li>No crown — it is retired. No other logo in its place.</li>
        <li>Do not change the colours, the mark, the words or the motion.</li>
        <li>Not a certification, award or guarantee.</li>
      </ul></div>
    </div>
    <div class="card" style="margin-top:18px"><h3 style="margin-top:0">Privacy</h3><p>Links to uzleeder.vercel.app. No cookies, no tracking, no analytics. The only external request is the Outfit font subset for the letters it shows — skip it with <code>fonts="none"</code> or Option 3.</p></div>
    <div class="card" style="margin-top:12px"><h3 style="margin-top:0">Not the project signature</h3><p>The Workspace project signature (UZLEEDER · PROJECT COMPLETED / READY FOR DEPLOYMENT / DEMONSTRATION · PROJECT ID · SALAAM NEW ERA.) is the internal delivery mark on a project record. “Crafted by UzLeeder” is the public signature on a live website.</p></div>
  </section>

  <footer><uzleeder-crafted theme="dark"></uzleeder-crafted></footer>
</main>
<div class="toast" id="toast" role="status" aria-live="polite">Copied</div>

<!-- crafted.js (embedded by server/build-sign.cjs — edit crafted.js, then rebuild) -->
<script id="crafted-src">
${src}
</script>
<script>
  var SRC = document.getElementById("crafted-src").textContent.trim();
  var CLOSE = "<" + "/script>";
  function plain(dark) {
    var muted = dark ? "#8e97ab" : "#5b6377", ink = dark ? "#ffffff" : "#1c2233", red = dark ? "#f0384e" : "#e01e37";
    return "<!-- UzLeeder digital signature (" + (dark ? "dark" : "light") + ", static) -->\\n" +
      '<div style="display:flex;justify-content:center;padding:14px 0">\\n' +
      '  <a href="https://uzleeder.vercel.app/?ref=crafted" target="_blank" rel="noopener" aria-label="Crafted by UzLeeder" style="display:inline-flex;align-items:center;gap:12px;text-decoration:none">\\n' +
      '    <span aria-hidden="true" style="font:600 11px/1 ui-monospace,Consolas,monospace;letter-spacing:.28em;text-transform:uppercase;color:' + muted + '">Crafted by</span>\\n' +
      '    <svg viewBox="0 0 48 44" width="22" height="20" aria-hidden="true" style="overflow:visible"><path d="M4 41 24 5l20 36" fill="none" stroke="' + red + '" stroke-width="7" stroke-miterlimit="10"/><path d="M14 41 24 23l10 18" fill="none" stroke="' + ink + '" stroke-width="5.5" stroke-miterlimit="10"/></svg>\\n' +
      '    <span aria-hidden="true" style="font:800 17px/1 Outfit,\\'Segoe UI\\',system-ui,sans-serif;letter-spacing:-.02em"><span style="color:' + ink + '">Uz</span><span style="color:' + red + '">Leeder</span></span>\\n' +
      "  </a>\\n</div>";
  }
  var SNIP = {
    embed: '<script src="https://uzleeder.vercel.app/crafted.js" defer>' + CLOSE + '\\n<uzleeder-crafted theme="dark"></uzleeder-crafted>',
    inline: '<uzleeder-crafted theme="dark"></uzleeder-crafted>\\n<script>\\n' + SRC + '\\n' + CLOSE,
    htmlDark: plain(true), htmlLight: plain(false)
  };
  ["embed", "inline", "htmlDark"].forEach(function (k) { document.getElementById("code-" + k).textContent = SNIP[k]; });
  var toast = document.getElementById("toast");
  function show(msg) { toast.textContent = msg; toast.classList.add("on"); setTimeout(function () { toast.classList.remove("on"); }, 1600); }
  document.querySelectorAll("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      var text = SNIP[b.getAttribute("data-copy")];
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(function () { show("Copied"); }, function () { show("Copy failed — select the code manually"); });
      else { var t = document.createElement("textarea"); t.value = text; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); show("Copied"); } catch (e) { show("Copy failed — select the code manually"); } t.remove(); }
    });
  });
  document.getElementById("dl").addEventListener("click", function () {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([SRC + "\\n"], { type: "text/javascript" }));
    a.download = "crafted.js"; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
  });
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(ROOT, "sign.html"), html);
console.log("sign.html written (" + Math.round(html.length / 1024) + " KB), crafted.js embedded");
