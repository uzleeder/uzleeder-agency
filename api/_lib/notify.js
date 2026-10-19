// Telegram notification for new leads — one retry on failure, never throws.
// Returns "sent" | "failed" | "not-configured".
const esc = s => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const SERVICE = { website: "Business website", system: "Business system", ai: "AI / automation", academy: "Academy", design: "Design", existing: "Existing project", other: "Other" };
const CHANNEL = { telegram: "Telegram", whatsapp: "WhatsApp", email: "Email" };

function leadText(l) {
  return "🌐 <b>UzLeeder — new project brief</b>" + (l.code ? " · <code>" + esc(l.code) + "</code>" : "") + "\n\n" +
    "👤 <b>Name:</b> " + esc(l.name) + "\n" +
    "📨 <b>Reply via " + esc(CHANNEL[l.channel] || l.channel) + ":</b> " + esc(l.contact) + "\n" +
    "🧩 <b>Service:</b> " + esc(SERVICE[l.service] || l.service) + "\n" +
    (l.budget ? "💰 <b>Budget:</b> " + esc(l.budget) + "\n" : "") +
    (l.timeline ? "⏱ <b>Timeline:</b> " + esc(l.timeline) + "\n" : "") +
    "🌍 <b>Language:</b> " + esc((l.lang || "").toUpperCase()) + " · <b>Source:</b> " + esc(l.source || "direct") + "\n\n" +
    "💬 <b>Project:</b>\n" + esc(l.message);
}

async function telegram(text) {
  const { TELEGRAM_BOT_TOKEN: token, TELEGRAM_CHAT_ID: chatId } = process.env;
  if (!token || !chatId) return "not-configured";
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const r = await fetch("https://api.telegram.org/bot" + token + "/sendMessage", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true })
      });
      const j = await r.json().catch(() => ({}));
      if (j.ok) return "sent";
      console.error("Telegram refused (attempt " + (attempt + 1) + "):", j.description || r.status);
    } catch (e) { console.error("Telegram error (attempt " + (attempt + 1) + "):", e.message); }
    if (attempt === 0) await new Promise(res => setTimeout(res, 700));
  }
  return "failed";
}

module.exports = { telegram, leadText, SERVICE, CHANNEL };
