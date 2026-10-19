// AI tools shown on hover in each AI-engineering card. Only tools already listed on the site.
const L = "https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg@latest/icons/";
const F = d => "https://www.google.com/s2/favicons?domain=" + d + "&sz=128";
exports.TOOLS = {
  claude: ["Claude", L + "claude-color.svg"], chatgpt: ["ChatGPT", L + "openai.svg"], gemini: ["Gemini", L + "gemini-color.svg"],
  notebooklm: ["NotebookLM", F("notebooklm.google")], perplexity: ["Perplexity", L + "perplexity-color.svg"],
  n8n: ["n8n", L + "n8n-color.svg"], zapier: ["Zapier", F("zapier.com")], openclaw: ["OpenClaw", F("openclaw.ai")],
  claudecode: ["Claude Code", L + "claudecode-color.svg"], cursor: ["Cursor", L + "cursor.svg"], replit: ["Replit", L + "replit-color.svg"], lovable: ["Lovable", L + "lovable-color.svg"],
  midjourney: ["Midjourney", L + "midjourney.svg"], runway: ["Runway", L + "runway.svg"], kling: ["Kling", L + "kling-color.svg"], elevenlabs: ["ElevenLabs", L + "elevenlabs.svg"], heygen: ["HeyGen", F("heygen.com")]
};
// card (by title key) -> tools
exports.CARDS = {
  ai1_t: ["claude", "chatgpt", "gemini"],
  ai2_t: ["claude", "chatgpt", "gemini"],
  ai3_t: ["notebooklm", "perplexity", "claude"],
  ai4_t: ["notebooklm", "claude", "chatgpt"],
  ai5_t: ["n8n", "zapier", "claude"],
  ai6_t: ["claudecode", "cursor", "replit", "lovable"],
  ai7_t: ["claude", "chatgpt", "gemini", "perplexity"],
  ai8_t: ["midjourney", "runway", "kling", "elevenlabs", "heygen"],
  ai9_t: ["n8n", "zapier", "openclaw"]
};
// key = "tx_<card#>_<tool>"
exports.STRINGS = {
  en: {
    ai_tools_label: "Tools I use here",
    tx_1_claude: "long, structured system prompts", tx_1_chatgpt: "fast prompt iteration and testing", tx_1_gemini: "comparing outputs across models",
    tx_2_claude: "roles, rules and tone for assistants", tx_2_chatgpt: "custom assistant behaviour", tx_2_gemini: "checking consistency across models",
    tx_3_notebooklm: "answers grounded in my own documents", tx_3_perplexity: "cited, source-backed research", tx_3_claude: "reasoning over the provided context",
    tx_4_notebooklm: "responses limited to uploaded sources", tx_4_claude: "\"answer only from the context\" rules", tx_4_chatgpt: "knowledge files with strict instructions",
    tx_5_n8n: "multi-step AI workflows", tx_5_zapier: "connecting apps to AI steps", tx_5_claude: "the reasoning step inside a flow",
    tx_6_claudecode: "large coding tasks from the terminal", tx_6_cursor: "AI pair-programming in the editor", tx_6_replit: "quick builds and deploys in the browser", tx_6_lovable: "from idea to working prototype",
    tx_7_claude: "reasoning and long documents", tx_7_chatgpt: "writing and brainstorming", tx_7_gemini: "fast research and analysis", tx_7_perplexity: "live web search with citations",
    tx_8_midjourney: "images and concept art", tx_8_runway: "AI video editing and generation", tx_8_kling: "cinematic clips from text or images", tx_8_elevenlabs: "realistic voiceovers", tx_8_heygen: "AI avatar videos",
    tx_9_n8n: "automations with AI nodes", tx_9_zapier: "no-code app automations", tx_9_openclaw: "a personal AI assistant for real tasks"
  },
  uz: {
    ai_tools_label: "Bu yerda ishlatadigan vositalarim",
    tx_1_claude: "uzun, tuzilgan system prompt'lar", tx_1_chatgpt: "prompt'larni tez sinash va yaxshilash", tx_1_gemini: "modellar javoblarini solishtirish",
    tx_2_claude: "yordamchilar uchun rol, qoida va ohang", tx_2_chatgpt: "yordamchi xulq-atvorini sozlash", tx_2_gemini: "modellar orasida barqarorlikni tekshirish",
    tx_3_notebooklm: "o'z hujjatlarimga tayangan javoblar", tx_3_perplexity: "manbali, iqtibosli tadqiqot", tx_3_claude: "berilgan kontekst asosida fikrlash",
    tx_4_notebooklm: "faqat yuklangan manbalar doirasidagi javoblar", tx_4_claude: "\"faqat kontekstdan javob ber\" qoidalari", tx_4_chatgpt: "qat'iy ko'rsatmali bilim fayllari",
    tx_5_n8n: "ko'p bosqichli AI workflow'lar", tx_5_zapier: "ilovalarni AI bosqichlariga ulash", tx_5_claude: "oqim ichidagi fikrlash bosqichi",
    tx_6_claudecode: "terminaldan katta dasturlash vazifalari", tx_6_cursor: "muharrirda AI bilan birga kod yozish", tx_6_replit: "brauzerda tez qurish va deploy", tx_6_lovable: "g'oyadan ishlaydigan prototipgacha",
    tx_7_claude: "fikrlash va uzun hujjatlar", tx_7_chatgpt: "yozish va g'oya topish", tx_7_gemini: "tez tadqiqot va tahlil", tx_7_perplexity: "manbali jonli veb-qidiruv",
    tx_8_midjourney: "rasmlar va konsept-art", tx_8_runway: "AI video tahrirlash va yaratish", tx_8_kling: "matn yoki rasmdan kinematik kliplar", tx_8_elevenlabs: "tabiiy ovozlashtirish", tx_8_heygen: "AI avatar videolar",
    tx_9_n8n: "AI tugunli avtomatlashtirishlar", tx_9_zapier: "kodsiz ilova avtomatlashtirishlari", tx_9_openclaw: "real vazifalar uchun shaxsiy AI yordamchi"
  },
  tg: {
    ai_tools_label: "Абзорҳое, ки дар ин ҷо истифода мебарам",
    tx_1_claude: "system prompt-ҳои дароз ва сохторёфта", tx_1_chatgpt: "санҷиш ва беҳтар кардани зуди prompt-ҳо", tx_1_gemini: "муқоисаи ҷавобҳои моделҳо",
    tx_2_claude: "нақш, қоида ва оҳанг барои ёварон", tx_2_chatgpt: "танзими рафтори ёвар", tx_2_gemini: "санҷиши устуворӣ байни моделҳо",
    tx_3_notebooklm: "ҷавобҳо бар асоси ҳуҷҷатҳои худам", tx_3_perplexity: "тадқиқот бо манбаъ ва иқтибос", tx_3_claude: "фикр кардан бар асоси контексти додашуда",
    tx_4_notebooklm: "ҷавобҳо танҳо дар доираи манбаъҳои боргузоришуда", tx_4_claude: "қоидаҳои \"танҳо аз контекст ҷавоб деҳ\"", tx_4_chatgpt: "файлҳои дониш бо дастурҳои қатъӣ",
    tx_5_n8n: "workflow-ҳои бисёрмарҳилаи AI", tx_5_zapier: "пайвасти барномаҳо ба қадамҳои AI", tx_5_claude: "қадами фикр дар дохили ҷараён",
    tx_6_claudecode: "вазифаҳои калони барномасозӣ аз терминал", tx_6_cursor: "навиштани код бо AI дар муҳаррир", tx_6_replit: "сохтан ва ҷойгиркунии зуд дар браузер", tx_6_lovable: "аз ғоя то прототипи корӣ",
    tx_7_claude: "фикр ва ҳуҷҷатҳои дароз", tx_7_chatgpt: "навиштан ва ҷустуҷӯи ғоя", tx_7_gemini: "тадқиқот ва таҳлили зуд", tx_7_perplexity: "ҷустуҷӯи зиндаи веб бо иқтибос",
    tx_8_midjourney: "тасвирҳо ва консепт-арт", tx_8_runway: "таҳрир ва эҷоди видео бо AI", tx_8_kling: "клипҳои синамоӣ аз матн ё тасвир", tx_8_elevenlabs: "овоздиҳии табиӣ", tx_8_heygen: "видеоҳои аватари AI",
    tx_9_n8n: "автоматикунонӣ бо гиреҳҳои AI", tx_9_zapier: "автоматикунонии барномаҳо бе код", tx_9_openclaw: "ёвари шахсии AI барои корҳои воқеӣ"
  },
  ru: {
    ai_tools_label: "Инструменты, которые я здесь использую",
    tx_1_claude: "длинные структурированные системные промпты", tx_1_chatgpt: "быстрые итерации и тесты промптов", tx_1_gemini: "сравнение ответов разных моделей",
    tx_2_claude: "роли, правила и тон для ассистентов", tx_2_chatgpt: "настройка поведения ассистента", tx_2_gemini: "проверка стабильности между моделями",
    tx_3_notebooklm: "ответы на основе моих документов", tx_3_perplexity: "исследования с источниками и цитатами", tx_3_claude: "рассуждение по заданному контексту",
    tx_4_notebooklm: "ответы только по загруженным источникам", tx_4_claude: "правила «отвечай только из контекста»", tx_4_chatgpt: "файлы знаний со строгими инструкциями",
    tx_5_n8n: "многошаговые AI-воркфлоу", tx_5_zapier: "связка приложений с AI-шагами", tx_5_claude: "шаг рассуждения внутри процесса",
    tx_6_claudecode: "крупные задачи прямо из терминала", tx_6_cursor: "парное программирование с AI в редакторе", tx_6_replit: "быстрая сборка и деплой в браузере", tx_6_lovable: "от идеи до рабочего прототипа",
    tx_7_claude: "рассуждения и длинные документы", tx_7_chatgpt: "тексты и мозговой штурм", tx_7_gemini: "быстрый поиск и анализ", tx_7_perplexity: "живой веб-поиск с цитатами",
    tx_8_midjourney: "изображения и концепт-арт", tx_8_runway: "монтаж и генерация видео", tx_8_kling: "кинематографичные клипы из текста или фото", tx_8_elevenlabs: "реалистичная озвучка", tx_8_heygen: "видео с AI-аватарами",
    tx_9_n8n: "автоматизации с AI-узлами", tx_9_zapier: "no-code автоматизация приложений", tx_9_openclaw: "личный AI-ассистент для реальных задач"
  }
};
