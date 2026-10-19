// Telegram Bot API client for the Workspace (publishing) and the services bot.
// Tokens stay on the server: they are never returned to the browser, logged, or put in error messages.
//   TELEGRAM_BOT_TOKEN            default bot (lead notifications, publishing, services bot)
//   TELEGRAM_PUBLISH_BOT_TOKEN    optional: a separate bot that is admin in the channels
//   TELEGRAM_SERVICES_BOT_TOKEN   optional: a separate token for @uzleeder_services_bot
const crypto = require("crypto");

const tokenFor = role => (role === "publish" && process.env.TELEGRAM_PUBLISH_BOT_TOKEN) ||
  (role === "services" && process.env.TELEGRAM_SERVICES_BOT_TOKEN) || process.env.TELEGRAM_BOT_TOKEN || "";
const configured = role => /^\d+:[\w-]{20,}$/.test(tokenFor(role));
const scrub = (s, role) => { const t = tokenFor(role); return String(s || "").split(t || "\u0000").join("<token>"); };
const sleep = ms => new Promise(r => setTimeout(r, ms));

// one Bot API call → { ok, result } or { ok:false, code, error, retryAfter }
async function call(role, method, params, form) {
  if (!configured(role)) return { ok: false, code: 0, error: "Integration required: the bot token is not configured." };
  const url = "https://api.telegram.org/bot" + tokenFor(role) + "/" + method;
  for (let attempt = 0; attempt < 2; attempt++) {
    let j;
    try {
      const r = await fetch(url, form ? { method: "POST", body: form } : { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(params || {}) });
      j = await r.json().catch(() => ({ ok: false, error_code: r.status, description: "HTTP " + r.status }));
    } catch (e) {
      return { ok: false, code: -1, error: "Network error reaching Telegram: " + scrub(e.message, role) };
    }
    if (j.ok) return { ok: true, result: j.result };
    const retryAfter = j.parameters && j.parameters.retry_after;
    // rate limit: wait once if Telegram asks for a short pause, otherwise report it
    if (j.error_code === 429 && retryAfter && retryAfter <= 5 && attempt === 0 && !form) { await sleep(retryAfter * 1000 + 250); continue; }
    return { ok: false, code: j.error_code || 0, error: scrub(j.description || "Telegram refused the request", role), retryAfter };
  }
  return { ok: false, code: 429, error: "Rate limited by Telegram" };
}

let meCache = {};
async function me(role) {
  const hit = meCache[role];
  if (hit && Date.now() - hit.at < 5 * 60e3) return hit.r;
  const r = await call(role, "getMe");
  if (r.ok) meCache[role] = { at: Date.now(), r };
  return r;
}

const HANDLE = /^@[A-Za-z][A-Za-z0-9_]{3,31}$/;
// checks one destination: it must be a channel (or group) and the bot must be allowed to post there
async function verifyDestination(handle) {
  const out = { handle, checkedAt: new Date().toISOString(), ok: false };
  if (!HANDLE.test(handle)) return Object.assign(out, { error: "Not a valid Telegram username" });
  const bot = await me("publish");
  if (!bot.ok) return Object.assign(out, { error: bot.error });
  const chat = await call("publish", "getChat", { chat_id: handle });
  if (!chat.ok) return Object.assign(out, { error: chat.code === 400 ? "Telegram cannot find this chat (" + chat.error + ")" : chat.error });
  Object.assign(out, { chatId: chat.result.id, type: chat.result.type, title: chat.result.title || chat.result.first_name || handle });
  if (chat.result.type === "private") return Object.assign(out, { error: "This is a personal account, not a channel. Bots cannot post as a personal profile." });
  const member = await call("publish", "getChatMember", { chat_id: chat.result.id, user_id: bot.result.id });
  if (!member.ok) return Object.assign(out, { error: "The bot is not a member of this " + out.type + " — add @" + bot.result.username + " as an administrator." });
  const m = member.result;
  const canPost = out.type === "channel" ? (m.status === "creator" || (m.status === "administrator" && m.can_post_messages !== false)) : ["creator", "administrator", "member"].includes(m.status);
  out.botStatus = m.status;
  out.canPost = canPost;
  out.ok = canPost;
  if (!canPost) out.error = out.type === "channel" ? "@" + bot.result.username + " must be a channel administrator with the “Post messages” right." : "The bot cannot post in this group.";
  return out;
}

const TEXT_MAX = 4096, CAPTION_MAX = 1024, UPLOAD_MAX = 50 * 1024 * 1024;
// sends one post to one chat; media bytes are uploaded by the server (the token never leaves it)
async function sendPost(chatId, post, mediaFile) {
  const text = String(post.text || "");
  if (!mediaFile) return call("publish", "sendMessage", { chat_id: chatId, text, disable_web_page_preview: !!post.noPreview });
  const kind = post.media.kind;
  const method = kind === "photo" ? "sendPhoto" : kind === "video" ? "sendVideo" : "sendDocument";
  const field = kind === "photo" ? "photo" : kind === "video" ? "video" : "document";
  const form = new FormData();
  form.append("chat_id", String(chatId));
  if (text) form.append("caption", text);
  if (kind === "video") form.append("supports_streaming", "true");
  form.append(field, new Blob([mediaFile.buf], { type: mediaFile.type }), post.media.name || field);
  return call("publish", method, null, form);
}

// downloads a file a customer sent to the bot (Bot API limit: 20 MB) — bytes only, the token stays here
async function downloadFile(role, fileId) {
  if (!/^[\w-]{10,200}$/.test(fileId || "")) return { ok: false, error: "bad file id" };
  const f = await call(role, "getFile", { file_id: fileId });
  if (!f.ok) return f;
  try {
    const r = await fetch("https://api.telegram.org/file/bot" + tokenFor(role) + "/" + f.result.file_path);
    if (!r.ok) return { ok: false, error: "Telegram file download failed (" + r.status + ")" };
    return { ok: true, buf: Buffer.from(await r.arrayBuffer()), type: r.headers.get("content-type") || "application/octet-stream", name: f.result.file_path.split("/").pop() };
  } catch (e) { return { ok: false, error: "Network error: " + scrub(e.message, role) }; }
}

// secret for the webhook header, derived from ADMIN_SECRET (no extra env var needed)
const webhookSecret = () => crypto.createHmac("sha256", process.env.ADMIN_SECRET || "").update("uzleeder-services-bot-webhook").digest("hex").slice(0, 48);

module.exports = { call, me, configured, verifyDestination, sendPost, downloadFile, webhookSecret, HANDLE, TEXT_MAX, CAPTION_MAX, UPLOAD_MAX };
