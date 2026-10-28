// UzLeeder Venture Record Certificate — PDF renderer (A4 landscape, fonts embedded, vector QR).
// Input is the immutable issuance snapshot (api/_lib/certs.js → issue); the output bytes are stored with their SHA-256.
// Design rules (do not relax): no seals, no emblems, no accreditation marks; the legal note is always printed.
// Signature image: only the founder's own handwritten signature (api/_lib/sign-founder.png), and only when the template's
// signatory has `sign: true` — set by the founder in the Control Center (owner decision, 2026-10-28). Never for another person.
// Fonts: PT Serif / PT Sans (ParaType, SIL Open Font License — api/_lib/fonts/OFL.txt), Latin + Cyrillic for EN / UZ / RU.
const fs = require("fs"), path = require("path");
const { PDFDocument, rgb, degrees } = require("pdf-lib");
const fontkit = require("@pdf-lib/fontkit");
const qrcode = require("qrcode-generator");

const TEMPLATE_ID = "UZL-CERT-A4L";
const FONT_DIR = path.join(__dirname, "fonts");
const FILES = { serif: "PT_Serif-Web-Regular.ttf", serifBold: "PT_Serif-Web-Bold.ttf", serifItalic: "PT_Serif-Web-Italic.ttf", sans: "PT_Sans-Web-Regular.ttf", sansBold: "PT_Sans-Web-Bold.ttf" };
const SIGN_FILE = path.join(__dirname, "sign-founder.png");
let fontBytes = null, signBytes;
const loadSign = () => signBytes !== undefined ? signBytes : (signBytes = fs.existsSync(SIGN_FILE) ? fs.readFileSync(SIGN_FILE) : null);
const loadFonts = () => fontBytes || (fontBytes = Object.fromEntries(Object.entries(FILES).map(([k, f]) => [k, fs.readFileSync(path.join(FONT_DIR, f))])));

const hex = h => rgb(parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255);
const C = { paper: hex("#FBF9F4"), ink: hex("#14213D"), soft: hex("#4A5468"), faint: hex("#8A90A0"), gold: hex("#B08D57"), goldSoft: hex("#D9C7A5"), red: hex("#F0384E"), line: hex("#E4DED2") };

// every printed word, per language. The official title stays in English on every version.
const L = {
  en: {
    eco: "VENTURE ECOSYSTEM", sub: "Startup Identity & Development Record",
    statement: "This document records the venture identified below within the UzLeeder venture ecosystem, according to the issuer's internal record and verification process.",
    founder: "Recorded Founder", representative: "Designated Representative", classification: "Record classification", stage: "Development stage at issue date",
    member: "Recorded team member", memberRole: "Recorded role", milestone: "Recorded milestone", completedOn: "Completed on", market: "Market",
    registration: "External registration (verified)", issued: "Date issued", issuer: "Issuer", signatory: "Authorized signatory", number: "Certificate No.",
    verify: "Verify this record", verifyHint: "The verification page — not the QR code itself — confirms whether this record is valid.", code: "Verification code",
    note: "UzLeeder-issued venture record. This document does not replace government business registration, licenses, permits, or other official credentials.",
    template: "Template", version: "Record version", replaces: "Replaces"
  },
  uz: {
    eco: "VENCHUR EKOTIZIMI", sub: "Startap identifikatsiyasi va rivojlanish qaydi",
    statement: "Ushbu hujjat quyida ko'rsatilgan loyihaning UzLeeder venchur ekotizimida qayd etilganini emitentning ichki qayd va tekshiruv jarayoniga muvofiq hujjatlashtiradi.",
    founder: "Qayd etilgan asoschi", representative: "Vakolatli vakil", classification: "Qayd turi", stage: "Berilgan sanadagi rivojlanish bosqichi",
    member: "Qayd etilgan jamoa a'zosi", memberRole: "Qayd etilgan vazifa", milestone: "Qayd etilgan natija", completedOn: "Yakunlangan sana", market: "Bozor",
    registration: "Tashqi ro'yxat (tekshirilgan)", issued: "Berilgan sana", issuer: "Emitent", signatory: "Vakolatli imzolovchi", number: "Sertifikat raqami",
    verify: "Qaydni tekshirish", verifyHint: "Qayd haqiqiyligini QR kodning o'zi emas, tekshiruv sahifasi tasdiqlaydi.", code: "Tekshiruv kodi",
    note: "UzLeeder tomonidan berilgan loyiha qaydi. Ushbu hujjat davlat ro'yxatidan o'tkazish, litsenziya, ruxsatnoma yoki boshqa rasmiy hujjatlar o'rnini bosmaydi.",
    template: "Shablon", version: "Qayd versiyasi", replaces: "O'rniga"
  },
  ru: {
    eco: "ВЕНЧУРНАЯ ЭКОСИСТЕМА", sub: "Идентификация и развитие стартапа",
    statement: "Настоящий документ фиксирует запись о проекте, указанном ниже, в венчурной экосистеме UzLeeder в соответствии с внутренним порядком учёта и проверки эмитента.",
    founder: "Зафиксированный основатель", representative: "Уполномоченный представитель", classification: "Тип записи", stage: "Этап развития на дату выдачи",
    member: "Участник команды", memberRole: "Зафиксированная роль", milestone: "Зафиксированный этап", completedOn: "Дата завершения", market: "Рынок",
    registration: "Внешняя регистрация (проверено)", issued: "Дата выдачи", issuer: "Эмитент", signatory: "Уполномоченное лицо", number: "Номер сертификата",
    verify: "Проверить запись", verifyHint: "Действительность записи подтверждает страница проверки, а не сам QR-код.", code: "Код проверки",
    note: "Запись о проекте, выданная UzLeeder. Документ не заменяет государственную регистрацию бизнеса, лицензии, разрешения и иные официальные документы.",
    template: "Шаблон", version: "Версия записи", replaces: "Заменяет"
  }
};
const TYPE_LABEL = {
  venture: { en: "Venture Record", uz: "Loyiha qaydi", ru: "Запись о проекте" },
  stage: { en: "Development Stage Record", uz: "Rivojlanish bosqichi qaydi", ru: "Запись об этапе развития" },
  founder: { en: "Founder / Team Association Record", uz: "Asoschi / jamoa aloqasi qaydi", ru: "Запись о связи с командой" },
  completion: { en: "Project Completion Record", uz: "Loyiha natijasini yakunlash qaydi", ru: "Запись о завершении этапа" }
};
const STAGE_LABEL = {
  concept: { en: "Concept", uz: "G'oya", ru: "Концепция" }, research: { en: "Research", uz: "Tadqiqot", ru: "Исследование" },
  prototype: { en: "Prototype", uz: "Prototip", ru: "Прототип" }, development: { en: "In Development", uz: "Ishlab chiqilmoqda", ru: "В разработке" },
  beta: { en: "Beta", uz: "Beta", ru: "Бета" }, launched: { en: "Launched", uz: "Ishga tushgan", ru: "Запущен" }, paused: { en: "Paused", uz: "To'xtatilgan", ru: "Приостановлен" }
};
const MONTHS = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  uz: ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"],
  ru: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"]
};
function fmtDate(iso, lang) {
  const d = new Date(iso); if (isNaN(d)) return String(iso || "");
  const day = d.getUTCDate(), m = MONTHS[lang][d.getUTCMonth()], y = d.getUTCFullYear();
  return lang === "en" ? day + " " + m + " " + y : lang === "uz" ? y + "-yil " + day + "-" + m : day + " " + m + " " + y + " г.";
}

// words → lines that fit `width`
function wrap(text, font, size, width) {
  const out = []; let line = "";
  String(text || "").split(/\s+/).filter(Boolean).forEach(w => {
    const next = line ? line + " " + w : w;
    if (font.widthOfTextAtSize(next, size) <= width || !line) line = next; else { out.push(line); line = w; }
  });
  if (line) out.push(line);
  return out;
}
// shrink a single line until it fits
function fit(text, font, size, width, min) { while (size > min && font.widthOfTextAtSize(text, size) > width) size -= 0.5; return size; }
const spaced = (s, n) => Array.from(String(s)).join(n === 2 ? "  " : " ");

/**
 * snap = {
 *   number, type, lang, issuedAt, verifyUrl, verifyCode, templateVersion, recordVersion, replaces,
 *   fields: { ventureName, repRole: "founder"|"representative", representative, stage, market, registration, member, memberRole, milestone, completedOn },
 *   template: { title, subtitle, statement, signatory: { name, role } | null }
 * }
 */
async function render(snap) {
  const lang = L[snap.lang] ? snap.lang : "en", t = L[lang], f = snap.fields || {}, tpl = snap.template || {};
  const fb = loadFonts();
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const F = {};
  for (const k of Object.keys(fb)) F[k] = await pdf.embedFont(fb[k], { subset: true });
  const when = new Date(snap.issuedAt || Date.now());
  pdf.setTitle("UzLeeder Venture Record Certificate — " + snap.number);
  pdf.setAuthor("UzLeeder"); pdf.setCreator("UzLeeder certificate service · " + TEMPLATE_ID + " v" + snap.templateVersion);
  pdf.setProducer("UzLeeder"); pdf.setSubject((TYPE_LABEL[snap.type] || TYPE_LABEL.venture).en + " · " + f.ventureName);
  pdf.setKeywords(["UzLeeder", "venture record", snap.number]); pdf.setCreationDate(when); pdf.setModificationDate(when); pdf.setLanguage(lang);

  const W = 841.89, H = 595.28;
  const p = pdf.addPage([W, H]);
  const text = (s, x, y, font, size, color, opts) => p.drawText(String(s), Object.assign({ x, y, font, size, color }, opts || {}));
  const center = (s, y, font, size, color) => text(s, (W - font.widthOfTextAtSize(String(s), size)) / 2, y, font, size, color);

  // paper, frame: thin navy rule + gold hairline, small geometric corner ticks
  p.drawRectangle({ x: 0, y: 0, width: W, height: H, color: C.paper });
  p.drawRectangle({ x: 22, y: 22, width: W - 44, height: H - 44, borderColor: C.ink, borderWidth: 0.9 });
  p.drawRectangle({ x: 28, y: 28, width: W - 56, height: H - 56, borderColor: C.gold, borderWidth: 0.4 });
  [[28, 28, 1, 1], [W - 28, 28, -1, 1], [28, H - 28, 1, -1], [W - 28, H - 28, -1, -1]].forEach(([x, y, sx, sy]) => {
    p.drawLine({ start: { x: x + sx * 6, y: y + sy * 6 }, end: { x: x + sx * 22, y: y + sy * 6 }, thickness: 0.8, color: C.gold });
    p.drawLine({ start: { x: x + sx * 6, y: y + sy * 6 }, end: { x: x + sx * 6, y: y + sy * 22 }, thickness: 0.8, color: C.gold });
  });

  // header: the official Λ mark (brand red + ink), name, label — and the number on the right
  const mx = 58, my = H - 92, s = 0.62;
  p.drawSvgPath("M4 41 24 5l20 36", { x: mx, y: my + 44 * s, scale: s, borderColor: C.red, borderWidth: 7 });
  p.drawSvgPath("M14 41 24 23l10 18", { x: mx, y: my + 44 * s, scale: s, borderColor: C.ink, borderWidth: 5.5 });
  text("UzLeeder", mx + 38, my + 12, F.serifBold, 17, C.ink);
  text(spaced(t.eco), mx + 38, my, F.sansBold, 6.4, C.gold);
  const noLbl = t.number.toUpperCase();
  text(spaced(noLbl), W - 58 - F.sansBold.widthOfTextAtSize(spaced(noLbl), 6.4), my + 14, F.sansBold, 6.4, C.faint);
  text(snap.number, W - 58 - F.sansBold.widthOfTextAtSize(snap.number, 11), my, F.sansBold, 11, C.ink);

  // title block
  const title = String(tpl.title || "VENTURE RECORD CERTIFICATE").toUpperCase();
  const tSize = fit(spaced(title), F.serif, 25, W - 220, 16);
  center(spaced(title), H - 150, F.serif, tSize, C.ink);
  center(tpl.subtitle || t.sub, H - 172, F.serifItalic, 11.5, C.soft);
  p.drawLine({ start: { x: W / 2 - 34, y: H - 186 }, end: { x: W / 2 + 34, y: H - 186 }, thickness: 0.8, color: C.gold });

  // statement
  let y = H - 210;
  wrap(tpl.statement || t.statement, F.serif, 10.5, 520).forEach(line => { center(line, y, F.serif, 10.5, C.soft); y -= 15; });

  // venture name
  const vSize = fit(f.ventureName, F.serifBold, 34, W - 200, 18);
  y -= 42;
  center(f.ventureName, y, F.serifBold, vSize, C.ink);

  // the recorded facts — 3 columns (+ an optional verified line)
  const cls = (TYPE_LABEL[snap.type] || TYPE_LABEL.venture)[lang];
  const stage = f.stage ? (STAGE_LABEL[f.stage] || {})[lang] || f.stage : "";
  let cols;
  if (snap.type === "founder") cols = [[t.member, f.member], [t.memberRole, f.memberRole], [t.classification, cls]];
  else if (snap.type === "completion") cols = [[t.milestone, f.milestone], [t.completedOn, f.completedOn ? fmtDate(f.completedOn, lang) : ""], [t.classification, cls]];
  else cols = [[f.repRole === "representative" ? t.representative : t.founder, f.representative], [t.classification, cls], [t.stage, stage]];
  cols = cols.filter(c => c[1]);
  const colW = 210, gap = 18, total = cols.length * colW + (cols.length - 1) * gap;
  y -= 66;
  cols.forEach(([k, v], i) => {
    const cx = (W - total) / 2 + i * (colW + gap) + colW / 2;
    const ks = spaced(String(k).toUpperCase());
    const kSize = fit(ks, F.sansBold, 6.6, colW, 5.2);
    text(ks, cx - F.sansBold.widthOfTextAtSize(ks, kSize) / 2, y + 22, F.sansBold, kSize, C.gold);
    const lines = wrap(v, F.serifBold, 13, colW).slice(0, 2);
    lines.forEach((ln, j) => text(ln, cx - F.serifBold.widthOfTextAtSize(ln, 13) / 2, y - j * 16, F.serifBold, 13, C.ink));
    if (i) p.drawLine({ start: { x: cx - colW / 2 - gap / 2, y: y - 18 }, end: { x: cx - colW / 2 - gap / 2, y: y + 30 }, thickness: 0.4, color: C.line });
  });
  const extra = [f.market ? t.market + ": " + f.market : "", f.registration ? t.registration + ": " + f.registration : ""].filter(Boolean).join("   ·   ");
  if (extra) center(extra, y - 46, F.sans, 8.5, C.soft);

  // footer band
  const fy = 58;
  p.drawLine({ start: { x: 58, y: fy + 84 }, end: { x: W - 58, y: fy + 84 }, thickness: 0.5, color: C.line });
  const label = (k, x, yy) => text(spaced(String(k).toUpperCase()), x, yy, F.sansBold, 6, C.faint);
  label(t.issued, 58, fy + 64); text(fmtDate(snap.issuedAt, lang), 58, fy + 50, F.serifBold, 11, C.ink);
  label(t.issuer, 58, fy + 30); text("UzLeeder", 58, fy + 16, F.serifBold, 11, C.ink);
  if (tpl.signatory && tpl.signatory.name) {
    label(t.signatory, 210, fy + 64);
    text(tpl.signatory.name, 210, fy + 50, F.serifBold, 11, C.ink);
    if (tpl.signatory.role) text(tpl.signatory.role, 210, fy + 37, F.sans, 8.5, C.soft);
    /* founder's handwritten signature — right of the name, crossing the footer rule like real ink */
    const sb = tpl.signatory.sign ? loadSign() : null;
    if (sb) {
      const img = await pdf.embedPng(sb), sw = 104, sh = sw * img.height / img.width;
      const tw = Math.max(F.serifBold.widthOfTextAtSize(tpl.signatory.name, 11), tpl.signatory.role ? F.sans.widthOfTextAtSize(tpl.signatory.role, 8.5) : 0);
      p.drawImage(img, { x: Math.min(210 + tw + 14, 470), y: fy + 34, width: sw, height: sh });
    }
  }
  // the legal note — always printed, readable size
  const noteX = 210, noteW = 290;
  let ny = tpl.signatory && tpl.signatory.name ? fy + 18 : fy + 58;
  const notes = [t.note].concat(lang !== "en" ? [L.en.note] : []);
  notes.forEach((n, i) => { wrap(n, i ? F.sans : F.sansBold, i ? 7 : 7.6, noteW).forEach(line => { text(line, noteX, ny, i ? F.sans : F.sansBold, i ? 7 : 7.6, i ? C.faint : C.soft); ny -= i ? 9 : 10; }); ny -= 4; });

  // QR (vector modules) + link + code
  const qr = qrcode(0, "M"); qr.addData(snap.verifyUrl); qr.make();
  const n = qr.getModuleCount(), qs = 66, cell = qs / n, qx = W - 66 - qs, qy = fy + 2;
  const qz = cell * 4;                                        // the 4-module quiet zone scanners need
  p.drawRectangle({ x: qx - qz, y: qy - qz, width: qs + 2 * qz, height: qs + 2 * qz, color: rgb(1, 1, 1), borderColor: C.line, borderWidth: 0.5 });
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) p.drawRectangle({ x: qx + c * cell, y: qy + qs - (r + 1) * cell, width: cell + 0.05, height: cell + 0.05, color: C.ink });
  const rx = qx - cell * 4 - 12;
  const right = (s2, yy, font, size, color) => text(s2, rx - font.widthOfTextAtSize(String(s2), size), yy, font, size, color);
  right(spaced(t.verify.toUpperCase()), fy + 64, F.sansBold, 6, C.gold);
  const shortUrl = snap.verifyUrl.replace(/^https:\/\//, "").replace(/\?.*$/, "");
  right(shortUrl, fy + 50, F.sans, fit(shortUrl, F.sans, 8, 175, 6), C.ink);
  right(t.code + ": " + snap.verifyCode, fy + 38, F.sansBold, 8, C.ink);
  wrap(t.verifyHint, F.sans, 6.6, 150).forEach((ln, i) => right(ln, fy + 24 - i * 8.5, F.sans, 6.6, C.faint));

  // provenance line (inside the frame, bottom)
  const prov = [t.template + " " + TEMPLATE_ID + " v" + snap.templateVersion, t.version + " " + (snap.recordVersion || 1), snap.replaces ? t.replaces + " " + snap.replaces : "", lang.toUpperCase()].filter(Boolean).join("  ·  ");
  text(prov, 58, 36, F.sans, 6, C.faint);

  // an unissued preview is unmistakable: a diagonal mark across the page
  if (snap.preview) {
    const wm = "PREVIEW — NOT ISSUED", ws2 = 54;
    p.drawText(wm, { x: W / 2 - F.sansBold.widthOfTextAtSize(wm, ws2) / 2 * 0.82, y: H / 2 - 150, size: ws2, font: F.sansBold, color: C.red, opacity: 0.13, rotate: degrees(20) });
  }

  return Buffer.from(await pdf.save({ useObjectStreams: false }));
}

module.exports = { render, TEMPLATE_ID, TYPE_LABEL, STAGE_LABEL, L, fmtDate };
