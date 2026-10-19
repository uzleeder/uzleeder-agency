// POST /api/bot — webhook of @uzleeder_services_bot, the customer request gateway (plain code, no AI).
// Start → choose service → describe project → name → contact → budget (optional) → timeline (optional)
// → attachment (optional) → confirm → Workspace Request with a readable ID (UL-2026-XXXX).
// The bot promises no response time — it only says Max replies here.
// Telegram signs every call with the secret set by the Workspace ("Connect bot"); anything else is rejected.
const crypto = require("crypto");
const { json, body } = require("./_lib/http");
const store = require("./_lib/store");
const ws = require("./_lib/ws");
const tg = require("./_lib/tg");
const { telegram: notifyOwner, leadText } = require("./_lib/notify");

const T = {
  uz: {
    hi: "Salam! UzLeeder'ga xush kelibsiz.\nNima qurmoqchisiz?",
    svc: { website: "🌐 Veb-sayt", system: "🧩 Biznes tizim", ai: "⚙️ AI / avtomatlashtirish", academy: "🎓 Akademiya", design: "🎨 Dizayn", existing: "🛠 Mavjud loyiha", other: "✳️ Boshqa" },
    describe: "Loyihangizni qisqacha yozing: nima kerak va nima uchun.",
    short: "Biroz batafsilroq yozing (kamida 10 ta belgi).",
    name: "Ismingiz?", useName: "{n}",
    contact: "Siz bilan qanday bog'lanamiz? Pastdagi tugma bilan raqamingizni yuboring yoki telefon / email yozing.",
    sharePhone: "📱 Raqamni yuborish", useUser: "Telegram orqali (@{u})",
    budget: "Taxminiy byudjet? (ixtiyoriy)", timeline: "Qachongacha kerak? (ixtiyoriy)",
    budgets: { lt500: "$500 gacha", "500-1500": "$500–1 500", "1500-4000": "$1 500–4 000", gt4000: "$4 000+", unsure: "Hali bilmayman" },
    timelines: { asap: "Imkon qadar tez", "1m": "1 oy ichida", "1-3m": "1–3 oy", flexible: "Shoshilinch emas" },
    attach: "Fayl yoki rasm biriktirasizmi? Yuboring yoki «O'tkazib yuborish»ni bosing.",
    skip: "O'tkazib yuborish", attached: "Biriktirildi: {n}",
    confirm: "Tekshiring:\n\n{s}\n\nYuboraymi?", send: "✅ Yuborish", cancel: "✖️ Bekor qilish",
    done: "So'rov qabul qilindi ✓\n\nSo'rov raqami:\n{id}\n\nMax shu yerda javob beradi.",
    cancelled: "Bekor qilindi. Yangi so'rov uchun /start bosing.",
    again: "Yangi so'rov uchun /start bosing.", forwarded: "Xabaringiz Maxga yetkazildi ✓",
    limit: "Bir soatda 3 tadan ortiq so'rov yuborib bo'lmaydi. Keyinroq urinib ko'ring.",
    error: "Kechirasiz, so'rov saqlanmadi. Birozdan so'ng qayta urinib ko'ring yoki @uzleeder ga yozing.",
    fields: { name: "Ism", service: "Xizmat", project: "Loyiha", contact: "Aloqa", budget: "Byudjet", timeline: "Muddat", files: "Fayllar" }
  },
  ru: {
    hi: "Salam! Добро пожаловать в UzLeeder.\nЧто вы хотите создать?",
    svc: { website: "🌐 Сайт", system: "🧩 Бизнес-система", ai: "⚙️ AI / автоматизация", academy: "🎓 Академия", design: "🎨 Дизайн", existing: "🛠 Текущий проект", other: "✳️ Другое" },
    describe: "Кратко опишите проект: что нужно и для чего.",
    short: "Напишите чуть подробнее (минимум 10 символов).",
    name: "Как вас зовут?", useName: "{n}",
    contact: "Как с вами связаться? Отправьте номер кнопкой ниже или напишите телефон / email.",
    sharePhone: "📱 Отправить номер", useUser: "Через Telegram (@{u})",
    budget: "Примерный бюджет? (необязательно)", timeline: "К какому сроку? (необязательно)",
    budgets: { lt500: "До $500", "500-1500": "$500–1 500", "1500-4000": "$1 500–4 000", gt4000: "$4 000+", unsure: "Пока не знаю" },
    timelines: { asap: "Как можно скорее", "1m": "В течение месяца", "1-3m": "1–3 месяца", flexible: "Не срочно" },
    attach: "Хотите приложить файл или фото? Отправьте его или нажмите «Пропустить».",
    skip: "Пропустить", attached: "Приложено: {n}",
    confirm: "Проверьте:\n\n{s}\n\nОтправить?", send: "✅ Отправить", cancel: "✖️ Отмена",
    done: "Заявка принята ✓\n\nНомер заявки:\n{id}\n\nМакс ответит здесь.",
    cancelled: "Отменено. Для новой заявки нажмите /start.",
    again: "Для новой заявки нажмите /start.", forwarded: "Сообщение передано Максу ✓",
    limit: "Нельзя отправить больше 3 заявок в час. Попробуйте позже.",
    error: "Извините, заявка не сохранилась. Попробуйте позже или напишите @uzleeder.",
    fields: { name: "Имя", service: "Услуга", project: "Проект", contact: "Контакт", budget: "Бюджет", timeline: "Срок", files: "Файлы" }
  },
  en: {
    hi: "Salam! Welcome to UzLeeder.\nWhat would you like to build?",
    svc: { website: "🌐 Website", system: "🧩 Business System", ai: "⚙️ AI / Automation", academy: "🎓 Academy", design: "🎨 Design", existing: "🛠 Existing Project", other: "✳️ Other" },
    describe: "Briefly describe the project: what you need and why.",
    short: "Please write a little more (at least 10 characters).",
    name: "What is your name?", useName: "{n}",
    contact: "How can we reach you? Share your number with the button below or type a phone / email.",
    sharePhone: "📱 Share my number", useUser: "Via Telegram (@{u})",
    budget: "Approximate budget? (optional)", timeline: "When do you need it? (optional)",
    budgets: { lt500: "Under $500", "500-1500": "$500–1,500", "1500-4000": "$1,500–4,000", gt4000: "$4,000+", unsure: "Not sure yet" },
    timelines: { asap: "As soon as possible", "1m": "Within a month", "1-3m": "1–3 months", flexible: "Flexible" },
    attach: "Want to attach a file or photo? Send it now or press “Skip”.",
    skip: "Skip", attached: "Attached: {n}",
    confirm: "Please check:\n\n{s}\n\nSend it?", send: "✅ Send", cancel: "✖️ Cancel",
    done: "Request received ✓\n\nRequest ID:\n{id}\n\nMax will reply here.",
    cancelled: "Cancelled. Press /start for a new request.",
    again: "Press /start for a new request.", forwarded: "Your message was passed to Max ✓",
    limit: "You can send at most 3 requests per hour. Please try again later.",
    error: "Sorry, the request was not saved. Please try again later or write to @uzleeder.",
    fields: { name: "Name", service: "Service", project: "Project", contact: "Contact", budget: "Budget", timeline: "Timeline", files: "Files" }
  }
};const langOf = code => (/^uz/.test(code || "") ? "uz" : /^(ru|kk|ky|tg|be|uk)/.test(code || "") ? "ru" : "en");
const fill = (s, v) => s.replace(/\{(\w+)\}/g, (_, k) => (v[k] == null ? "" : v[k]));
const send = (chatId, text, extra) => tg.call("services", "sendMessage", Object.assign({ chat_id: chatId, text, disable_web_page_preview: true }, extra || {}));
const safeEq = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && crypto.timingSafeEqual(x, y); };

function serviceKeyboard(L) {
  return { inline_keyboard: [["website", "system"], ["ai", "academy"], ["design", "existing"], ["other"]].map(row => row.map(k => ({ text: L.svc[k], callback_data: "svc:" + k }))) };
}
// one-tap choices (same values as the website brief) + Skip
function choiceKeyboard(L, kind) {
  const map = kind === "budget" ? L.budgets : L.timelines, pre = kind === "budget" ? "bud:" : "tl:";
  const keys = Object.keys(map), rows = [];
  for (let i = 0; i < keys.length; i += 2) rows.push(keys.slice(i, i + 2).map(k => ({ text: map[k], callback_data: pre + k })));
  rows.push([{ text: L.skip, callback_data: pre + "skip" }]);
  return { inline_keyboard: rows };
}
const confirmKeyboard = L => ({ inline_keyboard: [[{ text: L.send, callback_data: "send" }, { text: L.cancel, callback_data: "cancel" }]] });
const attachKeyboard = L => ({ inline_keyboard: [[{ text: L.skip, callback_data: "skip" }]] });
function summary(L, st) {
  return [L.fields.name + ": " + st.name, L.fields.service + ": " + L.svc[st.service], L.fields.project + ": " + st.message, L.fields.contact + ": " + st.contact]
    .concat(st.budget ? L.fields.budget + ": " + L.budgets[st.budget] : [], st.timeline ? L.fields.timeline + ": " + L.timelines[st.timeline] : [],
      st.attachments && st.attachments.length ? L.fields.files + ": " + st.attachments.map(a => a.name).join(", ") : []).join("\n");
}
const keepMeta = st => ({ lang: st.lang, submits: st.submits || [], lastLead: st.lastLead, lastLeadAt: st.lastLeadAt });

async function submit(chatId, from, st, L) {
  const recent = (st.submits || []).filter(t => Date.now() - t < 3600e3);
  if (recent.length >= 3) { await send(chatId, L.limit); return; }
  let lead;
  try {
    lead = await store.addLead({
      name: st.name || [from.first_name, from.last_name].filter(Boolean).join(" ").slice(0, 120) || (from.username ? "@" + from.username : "Telegram user"),
      contact: st.contact, channel: "telegram", service: st.service, message: st.message, budget: st.budget || "", timeline: st.timeline || "",
      lang: st.lang, source: "telegram_bot", stage: "new",
      tg: { chatId, userId: from.id, username: from.username || null }, attachments: st.attachments || [], thread: []
    });
  } catch (e) { console.error("bot: lead not saved", e.message); await ws.setBotState(chatId, Object.assign(st, { step: "confirm" })); await send(chatId, L.error, { reply_markup: confirmKeyboard(L) }); return; }
  await ws.activity("request.received", "Request " + lead.code + " received from the services bot: " + lead.name, { kind: "request", id: lead.id });
  const notify = await notifyOwner(leadText(lead)).catch(() => "failed");
  await store.updateLead(lead.id, { notify: { telegram: notify, at: new Date().toISOString() } }).catch(() => {});
  await ws.setBotState(chatId, { step: "done", lang: st.lang, lastLead: lead.id, lastLeadAt: Date.now(), submits: recent.concat(Date.now()) });
  await send(chatId, fill(L.done, { id: lead.code }), { reply_markup: { remove_keyboard: true } });
}

async function askContact(chatId, from, L) {
  const kb = [[{ text: L.sharePhone, request_contact: true }]];
  if (from.username) kb.push([{ text: fill(L.useUser, { u: from.username }) }]);
  await send(chatId, L.contact, { reply_markup: { keyboard: kb, resize_keyboard: true, one_time_keyboard: true } });
}

async function onMessage(m) {
  if (!m.chat || m.chat.type !== "private" || !m.from || m.from.is_bot) return;
  const chatId = m.chat.id;
  let st = (await ws.botState(chatId)) || {};
  const lang = st.lang || langOf(m.from.language_code);
  const L = T[lang];
  const text = typeof m.text === "string" ? m.text.trim() : "";

  if (/^\/start\b/.test(text)) {
    const l2 = langOf(m.from.language_code);
    await ws.setBotState(chatId, Object.assign(keepMeta(st), { step: "service", lang: l2 }));
    await send(chatId, T[l2].hi, { reply_markup: serviceKeyboard(T[l2]) });
    return;
  }
  if (/^\/cancel\b/.test(text)) { await ws.setBotState(chatId, Object.assign(keepMeta(st), { step: "idle", lang })); await send(chatId, L.cancelled, { reply_markup: { remove_keyboard: true } }); return; }

  if (st.step === "describe") {
    if (text.length < 10) { await send(chatId, L.short); return; }
    st.message = text.slice(0, 3000); st.step = "name";
    await ws.setBotState(chatId, st);
    const tgName = [m.from.first_name, m.from.last_name].filter(Boolean).join(" ").slice(0, 60);
    await send(chatId, L.name, tgName ? { reply_markup: { keyboard: [[{ text: fill(L.useName, { n: tgName }) }]], resize_keyboard: true, one_time_keyboard: true } } : {});
    return;
  }
  if (st.step === "name") {
    if (text.length < 2 || text.length > 80 || /^\//.test(text)) { await send(chatId, L.name); return; }
    st.name = text; st.step = "contact";
    await ws.setBotState(chatId, st);
    await askContact(chatId, m.from, L);
    return;
  }
  if (st.step === "contact") {
    let contact = "";
    if (m.contact && m.contact.user_id === m.from.id) contact = "+" + String(m.contact.phone_number).replace(/^\+/, "");
    else if (m.from.username && text === fill(L.useUser, { u: m.from.username })) contact = "@" + m.from.username;
    else if (/^[+\d][\d\s()-]{6,20}$/.test(text) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text) || /^@\w{4,32}$/.test(text)) contact = text;
    if (!contact) { await askContact(chatId, m.from, L); return; }
    st.contact = contact.slice(0, 200); st.step = "budget";
    await ws.setBotState(chatId, st);
    await send(chatId, L.budget, { reply_markup: choiceKeyboard(L, "budget") });
    return;
  }
  if (st.step === "budget" || st.step === "timeline") { await send(chatId, L[st.step], { reply_markup: choiceKeyboard(L, st.step) }); return; }
  if (st.step === "attach") {
    const doc = m.document ? { fileId: m.document.file_id, name: m.document.file_name || "file", mime: m.document.mime_type, size: m.document.file_size }
      : m.photo && m.photo.length ? (p => ({ fileId: p.file_id, name: "photo.jpg", mime: "image/jpeg", size: p.file_size }))(m.photo[m.photo.length - 1])
      : m.video ? { fileId: m.video.file_id, name: m.video.file_name || "video.mp4", mime: m.video.mime_type, size: m.video.file_size } : null;
    if (!doc) { await send(chatId, L.attach, { reply_markup: attachKeyboard(L) }); return; }
    st.attachments = (st.attachments || []).concat(doc).slice(0, 5);
    st.step = "confirm";
    await ws.setBotState(chatId, st);
    await send(chatId, fill(L.attached, { n: doc.name }) + "\n\n" + fill(L.confirm, { s: summary(L, st) }), { reply_markup: confirmKeyboard(L) });
    return;
  }
  // after a request: follow-up messages go into that request's thread in the Workspace
  if (st.lastLead && Date.now() - (st.lastLeadAt || 0) < 30 * 864e5 && text) {
    const lead = await store.getLead(st.lastLead).catch(() => null);
    if (lead) {
      lead.thread = (lead.thread || []).concat({ at: new Date().toISOString(), dir: "in", text: text.slice(0, 3000) }).slice(-100);
      await ws.saveLead(lead);
      await ws.activity("request.message", "New message from " + (lead.name || "customer") + " (services bot)", { kind: "request", id: lead.id });
      await send(chatId, L.forwarded);
      return;
    }
  }
  await send(chatId, L.again);
}

async function onCallback(q) {
  const chatId = q.message && q.message.chat && q.message.chat.id;
  await tg.call("services", "answerCallbackQuery", { callback_query_id: q.id });
  if (!chatId || q.message.chat.type !== "private") return;
  const st = (await ws.botState(chatId)) || {};
  const L = T[st.lang || langOf(q.from.language_code)];
  const data = String(q.data || "");
  if (data.startsWith("svc:") && st.step === "service") {
    const k = data.slice(4); if (!L.svc[k]) return;
    Object.assign(st, { service: k, step: "describe", lang: st.lang || langOf(q.from.language_code) });
    await ws.setBotState(chatId, st);
    await send(chatId, L.svc[k] + "\n\n" + L.describe);
  } else if (data.startsWith("bud:") && st.step === "budget") {
    const k = data.slice(4); if (k !== "skip" && !L.budgets[k]) return;
    Object.assign(st, { budget: k === "skip" ? "" : k, step: "timeline" });
    await ws.setBotState(chatId, st);
    await send(chatId, L.timeline, { reply_markup: choiceKeyboard(L, "timeline") });
  } else if (data.startsWith("tl:") && st.step === "timeline") {
    const k = data.slice(3); if (k !== "skip" && !L.timelines[k]) return;
    Object.assign(st, { timeline: k === "skip" ? "" : k, step: "attach", attachments: [] });
    await ws.setBotState(chatId, st);
    await send(chatId, L.attach, { reply_markup: attachKeyboard(L) });
  } else if (data === "skip" && st.step === "attach") {
    st.step = "confirm"; await ws.setBotState(chatId, st);
    await send(chatId, fill(L.confirm, { s: summary(L, st) }), { reply_markup: confirmKeyboard(L) });
  } else if (data === "send" && st.step === "confirm") {
    st.step = "submitting"; await ws.setBotState(chatId, st);    // a double tap cannot create two requests
    await submit(chatId, q.from, st, L);
  } else if (data === "cancel") {
    await ws.setBotState(chatId, Object.assign(keepMeta(st), { step: "idle" }));
    await send(chatId, L.cancelled, { reply_markup: { remove_keyboard: true } });
  }
}
module.exports = async (req, res) => {
  if (req.method !== "POST") return json(res, 405, { ok: false });
  if (!process.env.ADMIN_SECRET || !safeEq(req.headers["x-telegram-bot-api-secret-token"] || "", tg.webhookSecret())) return json(res, 401, { ok: false });
  if (!store.configured()) return json(res, 503, { ok: false });
  let u;
  try { u = await body(req); } catch (e) { return json(res, 200, { ok: true }); }
  // Telegram re-delivers an update if we were slow: handle every update_id once
  if (u && Number.isInteger(u.update_id)) {
    const key = "tgu-" + u.update_id;
    if (await store.seenRecently(key, 2 * 864e5)) return json(res, 200, { ok: true });
    await store.remember(key, {});
  }
  try {
    if (u.message) await onMessage(u.message);
    else if (u.callback_query) await onCallback(u.callback_query);
  } catch (e) { console.error("bot update failed:", e.message); }
  return json(res, 200, { ok: true });
};
