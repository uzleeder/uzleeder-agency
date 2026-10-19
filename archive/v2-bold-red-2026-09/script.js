/* =========================================================
   UzLeeder — Portfolio V2 · behaviour
   i18n · theme · navigation · hero video · case studies ·
   certificate lightbox · contact form · admin CMS content
   ========================================================= */
(function () {
"use strict";

/* ===== Configuration ===== */
// Backend endpoint for the contact form (Netlify function via netlify.toml).
// If the API is hosted elsewhere, set API_BASE to its origin, e.g. "https://api.example.com".
const API_BASE = "";
const CONTACT_ENDPOINT = API_BASE + "/api/contact";

/* ===== Translations (generated: retained v1 keys + v2 copy) ===== */
const i18n = {
 "en": {
  "tag_live": "Live",
  "tag_soon": "Coming Soon",
  "tag_sale": "For Sale",
  "proj_buy": "Inquire",
  "proj_negotiable": "or let's talk",
  "proj_contract": "View contract",
  "proj_certificate": "View certificate",
  "proj_view": "View site",
  "svc1_title": "Academy Website",
  "svc1": "Full website for English academies and tutoring centers — courses, pricing, contact & registration.",
  "svc2_title": "Professional Websites",
  "svc2": "Professional websites — from a one-page landing to a complete multi-page site with a backend, built for your business.",
  "svc9_title": "AI Agent & API Integration",
  "svc9": "Custom AI agents, chatbots and API integrations that connect your tools and automate real work.",
  "svc10_title": "B2B Portal & Platform",
  "svc10": "Full-stack business portals with role-based panels, auth, database and dashboards — like a real SaaS.",
  "svc11_title": "Telegram Bot & Automation",
  "svc11": "Telegram bots and no-code automations that handle orders, leads and repetitive tasks for you.",
  "svc3_title": "Custom Web Design",
  "svc3": "Fully custom design with unique branding, colors, and layout — built just for you.",
  "svc4_title": "Website Maintenance",
  "svc4": "Updates, fixes, and improvements for existing websites. Always free for my clients.",
  "svc5_title": "Logo Design",
  "svc5": "Unique, professional logos that capture your brand identity and make you stand out.",
  "svc6_title": "AI Video & Photo",
  "svc6": "Stunning AI-generated videos and images for your brand, ads, and social media.",
  "svc7_title": "Email Writing",
  "svc7": "Professional, persuasive emails for outreach, sales, and business communication.",
  "svc8_title": "Presentations",
  "svc8": "Eye-catching, professional slide decks for business, pitches, and education.",
  "from250": "from $250",
  "free_clients": "Free for clients",
  "price_academy": "$200 – $2000",
  "price_web": "$200 – $4000+",
  "price_ai": "from $500",
  "price_b2b": "from $1000",
  "price_bot": "from $100",
  "price_starter": "$200",
  "price_pro": "$600",
  "price_custom": "$1500+",
  "price_ent": "$4000+",
  "from15": "from $15",
  "from10": "from $10",
  "from10b": "from $10",
  "from15b": "from $15",
  "certs_verify": "Verify",
  "certs_featured_badge": "Government Certified",
  "certs_featured_desc": "A joint initiative between the governments of the United Arab Emirates and the Republic of Uzbekistan, training and empowering five million people in AI prompt engineering — aligned with Uzbekistan's Strategy for the Development of AI Technologies through 2030.",
  "certs_featured2_badge": "Google Cloud · AI",
  "certs_featured2_desc": "A Google Cloud course covering how generative AI works, its real-world applications, and the tools behind modern AI systems — the foundation of the AI-powered websites and solutions I build.",
  "price_sub": "No hidden fees. What you see is what you pay.",
  "one_time": "one-time payment",
  "based_req": "based on requirements",
  "popular": "Most Popular",
  "get_started": "Get Started",
  "lets_talk": "Let's Talk",
  "f_landing": "Landing page (1 page)",
  "f_mobile": "Mobile responsive",
  "f_contact": "Contact section",
  "f_tg": "Telegram integration",
  "f_3day": "3-day delivery",
  "f_support": "Free support",
  "f_multi": "Multi-page website",
  "f_custom": "Custom design & branding",
  "f_reg": "Registration form",
  "f_tgphone": "Telegram + phone integration",
  "f_cms": "CMS (editable content)",
  "f_5day": "5-day delivery",
  "f_forever": "Free support forever",
  "f_everything": "Everything in Professional",
  "f_adv": "Advanced animations",
  "f_backend": "Backend integration",
  "f_domain": "Domain setup help",
  "f_priority": "Priority delivery",
  "f_lifetime": "Lifetime free support",
  "f_everything_custom": "Everything in Custom",
  "f_platform": "Full-stack web platform",
  "f_panels": "Multi-role admin panels",
  "f_dbapi": "Database, auth & API",
  "f_deploy": "Deployment & training",
  "msg_tg": "Message on Telegram",
  "phone_label": "Phone",
  "loc_city": "Tashkent City, Uzbekistan",
  "form_name": "Your name",
  "form_name_ph": "e.g. John Doe",
  "form_email": "Email",
  "form_email_ph": "you@example.com",
  "form_msg": "Message",
  "form_msg_ph": "Tell me about your project...",
  "form_send": "Send Message",
  "form_sending": "Sending...",
  "form_ok": "Message sent — I'll reply soon.",
  "form_err": "Something went wrong. Please try again, or write on Telegram.",
  "form_invalid": "Please check the highlighted fields.",
  "skip": "Skip to content",
  "nav_work": "Work",
  "nav_ai": "AI",
  "nav_about": "About",
  "nav_contact": "Contact",
  "nav_pricing": "Pricing",
  "hero_eyebrow": "UzLeeder · AI era / 2026",
  "hero_title": "Engineering products for the <em>AI era.</em>",
  "hero_desc": "I'm Max — a prompt engineer and AI-assisted developer building real digital products, AI systems, learning platforms and modern web experiences through UzLeeder.",
  "btn_work": "View work",
  "btn_about": "About UzLeeder",
  "btn_contact": "Contact",
  "hf_based": "Based in",
  "hf_city": "Tashkent, Uzbekistan",
  "hf_shipped": "Shipped",
  "hf_products": "2 production products",
  "hf_focus": "Focus",
  "hf_focus_v": "AI systems · Web products",
  "sc_now": "Now showing",
  "cs_open": "View case study",
  "v_play": "Play video",
  "v_pause": "Pause video",
  "work_kicker": "Selected work",
  "work_title": "Real products. Real engineering.",
  "port_sub": "Every project here is shipped, working software — the proof behind everything else on this page.",
  "certified": "UzLeeder Certified",
  "m_category": "Category",
  "m_role": "Role",
  "m_tech": "Technology",
  "m_value": "Project value",
  "m_why": "Why it matters",
  "w1_lead": "A full-stack education platform for a real math academy — student, teacher and director dashboards behind role-based auth, with online admissions, attendance, payments, grades and homework.",
  "w1_cat": "Education platform",
  "w1_role": "Full-stack: product, UI, API, database",
  "w1_why": "One system runs admissions, teaching and payments for the whole academy — and gives students 5,653 auto-graded exercises across 31 DTM-book topics.",
  "w2_lead": "A ready-to-deploy B2B booking portal for travel consolidators. Agencies submit requests from private areas; the team prices each order against discount rules, captures the airline PNR and sends a branded PDF invoice automatically.",
  "w2_cat": "B2B SaaS · Travel",
  "w2_role": "Sole author: product, backend, security, UI",
  "w2_why": "Multi-company SaaS with role-based access, 2FA and a full audit log — plus a GDS itinerary reader that recognises 1,100+ airlines from raw PNR text.",
  "next_k": "03 — Next",
  "next_t": "Your product could be the next case study.",
  "build_kicker": "What I build",
  "build_title": "Systems, not just screens.",
  "b1_t": "AI Systems",
  "b1_d": "RAG applications, knowledge-based assistants, AI workflows and agentic pipelines.",
  "b2_t": "AI-Assisted Products",
  "b2_d": "Modern applications engineered with AI in the loop — faster iteration, the same engineering discipline.",
  "b3_t": "Web Applications",
  "b3_d": "Production-oriented websites and platforms with auth, databases and admin panels.",
  "b4_t": "Learning Systems",
  "b4_d": "Educational platforms and personal learning systems — like the Shokirov Math Academy platform.",
  "b5_t": "Automation",
  "b5_d": "Multi-step workflows, Telegram bots and integrations that take repetitive work off people.",
  "b6_t": "Digital Products",
  "b6_d": "From concept to deployment: product thinking, design, build and launch.",
  "ai_kicker": "AI engineering",
  "ai_title": "AI isn't decoration. It's part of the engineering.",
  "ai_sub": "How I actually work with models — the methods behind the products.",
  "pipe_title": "How an idea becomes a product",
  "p1": "Idea",
  "p1d": "a real problem",
  "p2": "Prompt",
  "p2d": "instructions & constraints",
  "p3": "Model",
  "p3d": "the right model per step",
  "p4": "Logic",
  "p4d": "code, rules, data",
  "p5": "System",
  "p5d": "APIs, databases, auth",
  "p6": "Product",
  "p6d": "shipped software",
  "p7": "User",
  "p7d": "real people use it",
  "ai1_t": "Prompt Engineering",
  "ai1_d": "Designing system-level instructions, constraints, behaviour and output structures for reliable AI applications.",
  "ai2_t": "System Prompt Design",
  "ai2_d": "Defining roles, rules, tone and failure behaviour so a model acts consistently inside a product.",
  "ai3_t": "RAG",
  "ai3_d": "Connecting models to controlled knowledge sources so answers are grounded in relevant information.",
  "ai4_t": "Knowledge-Base-Constrained Responses",
  "ai4_d": "Keeping answers inside an approved knowledge base — and saying \"I don't know\" when the source is silent.",
  "ai5_t": "AI Workflow Orchestration",
  "ai5_d": "Chaining steps — retrieve, reason, generate, check — so several capabilities complete one larger task.",
  "ai6_t": "AI-Assisted Development",
  "ai6_d": "Building software with Claude Code, Cursor and similar tools, while architecture, review and testing stay human-owned.",
  "ai7_t": "Multi-Model Workflows",
  "ai7_d": "Choosing the right model for each step — reasoning, writing, vision, voice — instead of forcing one model to do everything.",
  "ai8_t": "Content Generation Pipelines",
  "ai8_d": "Repeatable pipelines for text, image, video and voice with tools like Midjourney, Runway, Kling and ElevenLabs.",
  "ai9_t": "Intelligent Automation",
  "ai9_d": "n8n, Zapier and custom code that let AI act on real tools — forms, messages, spreadsheets and APIs.",
  "brand_title": "An AI-first technology and digital product brand.",
  "brand_lead": "UzLeeder is the brand Max founded to build products and systems with modern software engineering and AI — for leaders who want working tools, not decoration.",
  "brand_what": "What we build",
  "bw1": "AI systems",
  "bw2": "Web products",
  "bw3": "Learning platforms",
  "bw4": "Automation",
  "bw5": "Digital experiences",
  "brand_vision": "Vision",
  "v1": "Start from Uzbekistan.",
  "v2": "Build across Central Asia.",
  "v3": "Scale globally.",
  "emblem_cap": "Official emblem",
  "max_kicker": "Founder",
  "max_roles": "Prompt Engineer · AI-Assisted Developer · Founder, UzLeeder",
  "max_quote": "“I don't want to simply use AI tools. I build products around them.”",
  "about_p1": "I'm Max (Mekhriddin Abdualim), founder of UzLeeder, based in Tashkent, Uzbekistan. I work with an engineer's mindset: understand the problem, design the system, then use AI to move faster without cutting corners.",
  "about_p2": "My work sits where product building meets AI workflows — full-stack platforms, automation and AI-assisted development. I learn by shipping: every project is an experiment that ends as working software.",
  "about_p3": "I'm certified in AI prompt engineering through the Five Million AI Leaders programme and in generative AI through Google Cloud — and I keep learning with every build.",
  "pr1": "Engineering mindset",
  "pr1d": "Systems first, screens second.",
  "pr2": "Product building",
  "pr2d": "Shipped beats perfect.",
  "pr3": "AI workflows",
  "pr3d": "Models as tools, not magic.",
  "pr4": "Experimentation",
  "pr4d": "Test, measure, iterate.",
  "photo_role": "Founder · UzLeeder",
  "soon": "Soon",
  "stack_kicker": "Technology",
  "stack_title": "Grouped by purpose.",
  "stack_sub": "Only what I use in real work — nothing listed just because it's popular.",
  "st_ai": "AI & models",
  "st_lang": "Languages",
  "st_fb": "Frontend & backend",
  "st_data": "Data & security",
  "st_deploy": "Deployment",
  "st_auto": "Automation",
  "st_media": "Creative AI & design",
  "st_work": "Workspace",
  "proof_kicker": "Proof",
  "proof_title": "Numbers we can verify.",
  "pf1": "products shipped — one live, one ready to deploy",
  "pf2": "auto-graded exercises in Shokirov Math Academy",
  "pf3": "DTM-book topics structured for exam practice",
  "pf4": "airlines recognised by MarketHub's GDS reader",
  "pf5": "verified certificates, including Google Cloud",
  "certs_kicker": "Certificates",
  "certs_title": "Verified learning.",
  "certs_sub": "Courses and programmes I've completed — each one links to its official verification.",
  "doc_title": "Official services & pricing document",
  "price_kicker": "Services & pricing",
  "price_title": "Clear scope. Transparent pricing.",
  "contact_title": "Let's build something.",
  "contact_sub": "Tell me what you're building. I reply fast — usually the same day, on email or Telegram.",
  "copy": "Copy",
  "copied": "Copied",
  "copy_fail": "Couldn't copy — select the address instead.",
  "err_name": "Please enter your name.",
  "err_email": "Please enter a valid email address.",
  "err_msg": "Please write a short message.",
  "foot_line": "AI-era technology. Real products. Real engineering.",
  "cs_overview": "Overview",
  "cs_challenge": "Challenge",
  "cs_solution": "Solution",
  "cs_tech": "Technology",
  "cs_role": "My role",
  "cs_result": "Result",
  "cs_media": "Media",
  "cs_arch": "Architecture",
  "cs_close": "Close case study",
  "cs_label": "Case study",
  "roles": [
   "Prompt Engineer",
   "AI-Assisted Developer",
   "AI Systems Builder",
   "Founder, UzLeeder"
  ],
  "cases": {
   "shokirov": {
    "cat": "Education platform · Live",
    "lead": "A full-stack education platform built for a real math academy — far more than a landing page.",
    "overview": "Shokirov Math Academy runs on a platform with three role-based dashboards — student, teacher and director. It covers the academy's full cycle: online applications, enrolment, attendance, payments, grades, feedback and homework, plus a learning core for DTM exam preparation.",
    "challenge": "The academy needed one system for admissions, teaching and payments across three roles — and structured, self-checking exam practice for students, not just a website that describes courses.",
    "solution": "Applicants apply online; the teacher reviews and enrols them, then manages attendance, payments, grades, feedback and homework, while the director oversees payments academy-wide. Students practise on 31 DTM-book topics with 5,653 auto-graded exercises, compete in a rating system and use UZ/EN languages with dark and light themes.",
    "role": "End-to-end delivery by UzLeeder: product planning, UI, the React frontend, the Node.js + Express API, database design and deployment.",
    "result": "Live in production at shokirov-academy.vercel.app, delivered under a signed project-completion contract.",
    "arch": [
     [
      "Users",
      "Students · teachers · director"
     ],
     [
      "Web app",
      "React interface · UZ/EN · dark/light"
     ],
     [
      "Application logic",
      "Node.js + Express serverless API on Vercel"
     ],
     [
      "Auth & roles",
      "JWT role-based access"
     ],
     [
      "Database",
      "PostgreSQL on Neon"
     ],
     [
      "Output",
      "Dashboards · auto-grading · ratings · payment records"
     ]
    ]
   },
   "markethub": {
    "cat": "B2B SaaS · Travel · For sale",
    "lead": "A complete, ready-to-deploy B2B booking portal for travel consolidators and ticketing desks.",
    "overview": "MarketHub gives partner agencies a private area to submit booking requests, while the consolidator's team prices, confirms and invoices each order. It is a multi-company SaaS with role-based access for super-admins, admins, operators and agencies.",
    "challenge": "Consolidators receive booking requests from many agencies. Every order has to be priced against discount rules, matched to an airline PNR and invoiced — securely, per company, with a clear audit trail.",
    "solution": "Agencies submit requests; operators price each order against consolidator discount rules, capture the airline PNR and send a branded PDF invoice automatically. A GDS itinerary reader recognises 1,100+ airlines from raw PNR text. 2FA, a full audit log, analytics and account inventory are built in. Invite-only and private by design.",
    "role": "Sole author and developer, as confirmed by the UzLeeder product certificate: product design, the Python/Flask backend, data model, security and interface.",
    "result": "Complete and ready to deploy. Authorship and ownership are certified by UzLeeder; the product is available for sale or licensing.",
    "arch": [
     [
      "Users",
      "Partner agencies · operators · admins"
     ],
     [
      "Web app",
      "Invite-only portal with private agency areas"
     ],
     [
      "Application logic",
      "Python + Flask — pricing rules and order flow"
     ],
     [
      "Security",
      "Roles · 2FA · full audit log"
     ],
     [
      "Data",
      "SQLite · multi-company"
     ],
     [
      "Services",
      "GDS itinerary reader · PDF invoice generator"
     ],
     [
      "Output",
      "Priced order + branded PDF invoice"
     ]
    ]
   }
  },
  "ai_tools_label": "Tools I use here",
  "tx_1_claude": "long, structured system prompts",
  "tx_1_chatgpt": "fast prompt iteration and testing",
  "tx_1_gemini": "comparing outputs across models",
  "tx_2_claude": "roles, rules and tone for assistants",
  "tx_2_chatgpt": "custom assistant behaviour",
  "tx_2_gemini": "checking consistency across models",
  "tx_3_notebooklm": "answers grounded in my own documents",
  "tx_3_perplexity": "cited, source-backed research",
  "tx_3_claude": "reasoning over the provided context",
  "tx_4_notebooklm": "responses limited to uploaded sources",
  "tx_4_claude": "\"answer only from the context\" rules",
  "tx_4_chatgpt": "knowledge files with strict instructions",
  "tx_5_n8n": "multi-step AI workflows",
  "tx_5_zapier": "connecting apps to AI steps",
  "tx_5_claude": "the reasoning step inside a flow",
  "tx_6_claudecode": "large coding tasks from the terminal",
  "tx_6_cursor": "AI pair-programming in the editor",
  "tx_6_replit": "quick builds and deploys in the browser",
  "tx_6_lovable": "from idea to working prototype",
  "tx_7_claude": "reasoning and long documents",
  "tx_7_chatgpt": "writing and brainstorming",
  "tx_7_gemini": "fast research and analysis",
  "tx_7_perplexity": "live web search with citations",
  "tx_8_midjourney": "images and concept art",
  "tx_8_runway": "AI video editing and generation",
  "tx_8_kling": "cinematic clips from text or images",
  "tx_8_elevenlabs": "realistic voiceovers",
  "tx_8_heygen": "AI avatar videos",
  "tx_9_n8n": "automations with AI nodes",
  "tx_9_zapier": "no-code app automations",
  "tx_9_openclaw": "a personal AI assistant for real tasks",
  "nav_team": "Team",
  "team_kicker": "Team",
  "team_title": "Max's team.",
  "team_sub": "One human founder. An AI crew where every model has a job — and nobody takes a day off.",
  "team_count": "1 human · 12 AI teammates",
  "team_human": "Human",
  "team_ai": "AI",
  "team_online": "online",
  "team_note": "Roles describe how Max actually uses each tool. Final decisions — and responsibility for every release — stay human.",
  "tm_max_r": "Founder · CEO · Lead Developer",
  "tm_max_d": "Sets the direction, designs the systems and makes the final call — and answers for every release.",
  "tm_claude_r": "Co-Founder · Chief Architect",
  "tm_claude_d": "Thinks through systems with me, challenges plans and writes the heavy code.",
  "tm_claudecode_r": "Senior Engineer",
  "tm_claudecode_d": "Ships large coding tasks straight from the terminal.",
  "tm_codex_r": "Software Engineer",
  "tm_codex_d": "A second pair of hands on code — refactors, tests and reviews.",
  "tm_chatgpt_r": "Writer & Adviser",
  "tm_chatgpt_d": "Drafts copy, emails and ideas — and gives a second opinion.",
  "tm_gemini_r": "Research Analyst",
  "tm_gemini_d": "Researches, summarises and analyses information fast.",
  "tm_perplexity_r": "Fact-Checker",
  "tm_perplexity_d": "Checks claims against live, cited sources.",
  "tm_cursor_r": "Pair Programmer",
  "tm_cursor_d": "Codes alongside me inside the editor.",
  "tm_higgsfield_r": "Creative Director · Video",
  "tm_higgsfield_d": "Cinematic camera moves and AI video effects.",
  "tm_midjourney_r": "Visual Designer",
  "tm_midjourney_d": "Concept art, visuals and brand imagery.",
  "tm_elevenlabs_r": "Voice Artist",
  "tm_elevenlabs_d": "Realistic voiceovers in any language.",
  "tm_notebooklm_r": "Knowledge Librarian",
  "tm_notebooklm_d": "Turns documents into notes and audio overviews.",
  "tm_n8n_r": "Operations Manager",
  "tm_n8n_d": "Runs the automations that connect everything."
 },
 "uz": {
  "tag_live": "Faol",
  "tag_soon": "Tez kunda",
  "tag_sale": "Sotuvda",
  "proj_buy": "So'rov yuborish",
  "proj_negotiable": "yoki kelishamiz",
  "proj_contract": "Shartnomani ko'rish",
  "proj_certificate": "Sertifikatni ko'rish",
  "proj_view": "Saytni ko'rish",
  "svc1_title": "Akademiya sayti",
  "svc1": "Ingliz tili akademiyalari va o'quv markazlari uchun to'liq sayt — kurslar, narxlar, aloqa va ro'yxat.",
  "svc2_title": "Professional saytlar",
  "svc2": "Professional saytlar — bir sahifali landingdan tortib backend bilan to'liq ko'p sahifali saytgacha, biznesingiz uchun.",
  "svc9_title": "AI Agent & API integratsiya",
  "svc9": "Maxsus AI agentlar, chatbotlar va API integratsiyalari — vositalaringizni bog'lab, ishni avtomatlashtiradi.",
  "svc10_title": "B2B portal va platforma",
  "svc10": "Rolli panellar, auth, baza va dashboardlar bilan full-stack biznes portallari — haqiqiy SaaS kabi.",
  "svc11_title": "Telegram bot va avtomatlashtirish",
  "svc11": "Buyurtma, mijoz va takroriy vazifalarni bajaradigan Telegram botlar va kodsiz avtomatlashtirishlar.",
  "svc3_title": "Maxsus veb-dizayn",
  "svc3": "Noyob brending, ranglar va tartib bilan to'liq maxsus dizayn — faqat siz uchun.",
  "svc4_title": "Sayt texnik xizmati",
  "svc4": "Mavjud saytlar uchun yangilanishlar, tuzatishlar va yaxshilanishlar. Mijozlarim uchun har doim bepul.",
  "svc5_title": "Logo dizayni",
  "svc5": "Brendingizni aks ettiruvchi noyob, professional logolar — ajralib turishingiz uchun.",
  "svc6_title": "AI Video va Rasm",
  "svc6": "Brendingiz, reklama va ijtimoiy tarmoqlar uchun ajoyib AI video va rasmlar.",
  "svc7_title": "Email yozish",
  "svc7": "Murojaat, savdo va biznes muloqoti uchun professional, ishonarli emaillar.",
  "svc8_title": "Taqdimotlar",
  "svc8": "Biznes, pitch va ta'lim uchun e'tiborni tortadigan professional slaydlar.",
  "from250": "$250 dan",
  "free_clients": "Mijozlar uchun bepul",
  "price_academy": "$200 – $2000",
  "price_web": "$200 – $4000+",
  "price_ai": "$500 dan",
  "price_b2b": "$1000 dan",
  "price_bot": "$100 dan",
  "price_starter": "$200",
  "price_pro": "$600",
  "price_custom": "$1500+",
  "price_ent": "$4000+",
  "from15": "$15 dan",
  "from10": "$10 dan",
  "from10b": "$10 dan",
  "from15b": "$15 dan",
  "certs_verify": "Tasdiqlash",
  "certs_featured_badge": "Davlat tomonidan tasdiqlangan",
  "certs_featured_desc": "Birlashgan Arab Amirliklari va O'zbekiston Respublikasi hukumatlarining qo'shma tashabbusi — besh million kishini AI uchun prompt yozishga o'rgatish va kuchaytirish, O'zbekistonning 2030-yilgacha AI texnologiyalarini rivojlantirish strategiyasiga mos ravishda.",
  "certs_featured2_badge": "Google Cloud · AI",
  "certs_featured2_desc": "Google Cloud kursi — generativ AI qanday ishlashi, uning amaliy qo'llanilishi va zamonaviy AI tizimlari ortidagi vositalar haqida. Bu men quradigan AI asosidagi saytlar va yechimlarning poydevori.",
  "price_sub": "Yashirin to'lovlar yo'q. Ko'rganingiz — to'laganingiz.",
  "one_time": "bir martalik to'lov",
  "based_req": "talablarga asoslangan",
  "popular": "Eng ommabop",
  "get_started": "Boshlash",
  "lets_talk": "Gaplashamiz",
  "f_landing": "Landing sahifa (1 sahifa)",
  "f_mobile": "Mobil moslashuvchan",
  "f_contact": "Aloqa bo'limi",
  "f_tg": "Telegram integratsiya",
  "f_3day": "3 kunda yetkazish",
  "f_support": "Bepul yordam",
  "f_multi": "Ko'p sahifali sayt",
  "f_custom": "Maxsus dizayn va brending",
  "f_reg": "Ro'yxatdan o'tish formasi",
  "f_tgphone": "Telegram + telefon integratsiya",
  "f_cms": "CMS (tahrirlanadigan kontent)",
  "f_5day": "5 kunda yetkazish",
  "f_forever": "Abadiy bepul yordam",
  "f_everything": "Professional'dagi hamma narsa",
  "f_adv": "Ilg'or animatsiyalar",
  "f_backend": "Backend integratsiya",
  "f_domain": "Domen sozlash yordami",
  "f_priority": "Ustuvor yetkazish",
  "f_lifetime": "Umrbod bepul yordam",
  "f_everything_custom": "Custom'dagi hamma narsa",
  "f_platform": "Full-stack veb-platforma",
  "f_panels": "Ko'p rolli admin panellar",
  "f_dbapi": "Baza, auth va API",
  "f_deploy": "Deploy va o'rgatish",
  "msg_tg": "Telegram orqali yozish",
  "phone_label": "Telefon",
  "loc_city": "Toshkent City, O'zbekiston",
  "form_name": "Ismingiz",
  "form_name_ph": "masalan, Akmal Valiyev",
  "form_email": "Email",
  "form_email_ph": "siz@example.com",
  "form_msg": "Xabar",
  "form_msg_ph": "Loyihangiz haqida yozing...",
  "form_send": "Xabar yuborish",
  "form_sending": "Yuborilmoqda...",
  "form_ok": "Xabar yuborildi — tez orada javob beraman.",
  "form_err": "Nimadir xato ketdi. Qayta urinib ko'ring yoki Telegram'da yozing.",
  "form_invalid": "Belgilangan maydonlarni tekshiring.",
  "skip": "Asosiy qismga o'tish",
  "nav_work": "Ishlar",
  "nav_ai": "AI",
  "nav_about": "Men haqimda",
  "nav_contact": "Aloqa",
  "nav_pricing": "Narxlar",
  "hero_eyebrow": "UzLeeder · AI davri / 2026",
  "hero_title": "<em>AI davri</em> uchun mahsulotlar muhandisligi.",
  "hero_desc": "Men Max — prompt engineer va AI yordamida ishlaydigan dasturchiman. UzLeeder orqali haqiqiy raqamli mahsulotlar, AI tizimlari, ta'lim platformalari va zamonaviy veb-tajribalar quraman.",
  "btn_work": "Ishlarni ko'rish",
  "btn_about": "UzLeeder haqida",
  "btn_contact": "Aloqa",
  "hf_based": "Joylashuv",
  "hf_city": "Toshkent, O'zbekiston",
  "hf_shipped": "Topshirilgan",
  "hf_products": "2 ta ishlaydigan mahsulot",
  "hf_focus": "Yo'nalish",
  "hf_focus_v": "AI tizimlar · Veb-mahsulotlar",
  "sc_now": "Hozir ko'rsatilmoqda",
  "cs_open": "Case study'ni ko'rish",
  "v_play": "Videoni qo'yish",
  "v_pause": "Videoni to'xtatish",
  "work_kicker": "Tanlangan ishlar",
  "work_title": "Haqiqiy mahsulotlar. Haqiqiy muhandislik.",
  "port_sub": "Bu yerdagi har bir loyiha — topshirilgan, ishlab turgan dastur. Sahifadagi hamma narsaning isboti shu.",
  "certified": "UzLeeder tasdiqlagan",
  "m_category": "Kategoriya",
  "m_role": "Rolim",
  "m_tech": "Texnologiyalar",
  "m_value": "Loyiha qiymati",
  "m_why": "Nega muhim",
  "w1_lead": "Haqiqiy matematika akademiyasi uchun full-stack ta'lim platformasi — rolli autentifikatsiya ortida talaba, o'qituvchi va direktor panellari; onlayn qabul, davomat, to'lovlar, baholar va uy vazifalari.",
  "w1_cat": "Ta'lim platformasi",
  "w1_role": "Full-stack: mahsulot, UI, API, baza",
  "w1_why": "Butun akademiyaning qabul, o'qitish va to'lov jarayoni bitta tizimda — talabalar uchun esa DTM kitobidagi 31 mavzu bo'yicha 5 653 ta avtomatik tekshiriladigan mashq.",
  "w2_lead": "Aviachipta konsolidatorlari uchun deploy qilishga tayyor B2B bron portali. Agentliklar shaxsiy hududidan so'rov yuboradi; jamoa har bir buyurtmani chegirma qoidalari bo'yicha narxlaydi, aviakompaniya PNR'ini kiritadi va brendli PDF hisob-fakturani avtomatik yuboradi.",
  "w2_cat": "B2B SaaS · Sayohat",
  "w2_role": "Yagona muallif: mahsulot, backend, xavfsizlik, UI",
  "w2_why": "Rolli kirish, 2FA va to'liq audit jurnaliga ega ko'p kompaniyali SaaS — hamda PNR matnidan 1 100+ aviakompaniyani taniydigan GDS o'quvchisi.",
  "next_k": "03 — Keyingisi",
  "next_t": "Keyingi case study sizning mahsulotingiz bo'lishi mumkin.",
  "build_kicker": "Nima quraman",
  "build_title": "Shunchaki ekranlar emas — tizimlar.",
  "b1_t": "AI tizimlar",
  "b1_d": "RAG ilovalar, bilim bazasiga asoslangan yordamchilar, AI workflow'lar va agentli pipeline'lar.",
  "b2_t": "AI yordamida qurilgan mahsulotlar",
  "b2_d": "AI ishtirokida yaratilgan zamonaviy ilovalar — tezroq iteratsiya, o'sha muhandislik intizomi.",
  "b3_t": "Veb-ilovalar",
  "b3_d": "Autentifikatsiya, baza va admin panellarga ega, real ishlatishga mo'ljallangan sayt va platformalar.",
  "b4_t": "Ta'lim tizimlari",
  "b4_d": "Ta'lim platformalari va shaxsiy o'quv tizimlari — Shokirov Math Academy platformasi kabi.",
  "b5_t": "Avtomatlashtirish",
  "b5_d": "Takroriy ishni odamlardan oladigan ko'p bosqichli workflow'lar, Telegram botlar va integratsiyalar.",
  "b6_t": "Raqamli mahsulotlar",
  "b6_d": "G'oyadan deploy'gacha: mahsulot fikrlashi, dizayn, qurish va ishga tushirish.",
  "ai_kicker": "AI muhandisligi",
  "ai_title": "AI bezak emas. U muhandislikning bir qismi.",
  "ai_sub": "Modellar bilan qanday ishlayman — mahsulotlar ortidagi usullar.",
  "pipe_title": "G'oya qanday qilib mahsulotga aylanadi",
  "p1": "G'oya",
  "p1d": "haqiqiy muammo",
  "p2": "Prompt",
  "p2d": "ko'rsatmalar va cheklovlar",
  "p3": "Model",
  "p3d": "har bosqichga mos model",
  "p4": "Mantiq",
  "p4d": "kod, qoidalar, ma'lumot",
  "p5": "Tizim",
  "p5d": "API, baza, auth",
  "p6": "Mahsulot",
  "p6d": "topshirilgan dastur",
  "p7": "Foydalanuvchi",
  "p7d": "real odamlar ishlatadi",
  "ai1_t": "Prompt Engineering",
  "ai1_d": "Ishonchli AI ilovalar uchun tizim darajasidagi ko'rsatmalar, cheklovlar, xulq-atvor va javob tuzilmalarini loyihalash.",
  "ai2_t": "System Prompt dizayni",
  "ai2_d": "Model mahsulot ichida barqaror ishlashi uchun rol, qoidalar, ohang va xatoga munosabatni belgilash.",
  "ai3_t": "RAG",
  "ai3_d": "Javoblar tegishli ma'lumotga tayanishi uchun modellarni nazorat qilinadigan bilim manbalariga ulash.",
  "ai4_t": "Bilim bazasi bilan cheklangan javoblar",
  "ai4_d": "Javoblarni tasdiqlangan bilim bazasi doirasida saqlash — manbada javob bo'lmasa, \"bilmayman\" deyish.",
  "ai5_t": "AI workflow orkestratsiyasi",
  "ai5_d": "Bosqichlarni zanjirga ulash — topish, fikrlash, yaratish, tekshirish — bir nechta imkoniyat bitta katta vazifani bajaradi.",
  "ai6_t": "AI yordamida dasturlash",
  "ai6_d": "Claude Code, Cursor kabi vositalar bilan dastur yozish — arxitektura, review va test esa inson nazoratida.",
  "ai7_t": "Ko'p modelli workflow'lar",
  "ai7_d": "Har bir bosqich uchun mos modelni tanlash — fikrlash, yozish, ko'rish, ovoz — hammasini bitta modelga yuklamaslik.",
  "ai8_t": "Kontent yaratish pipeline'lari",
  "ai8_d": "Midjourney, Runway, Kling va ElevenLabs kabi vositalar bilan matn, rasm, video va ovoz uchun takrorlanadigan pipeline'lar.",
  "ai9_t": "Aqlli avtomatlashtirish",
  "ai9_d": "AI'ga real vositalar — formalar, xabarlar, jadvallar va API'lar ustida ishlash imkonini beruvchi n8n, Zapier va maxsus kod.",
  "brand_title": "AI'ga tayanuvchi texnologiya va raqamli mahsulot brendi.",
  "brand_lead": "UzLeeder — Max zamonaviy dasturiy muhandislik va AI bilan mahsulot va tizimlar qurish uchun asos solgan brend. Bezak emas, ishlaydigan vosita istagan liderlar uchun.",
  "brand_what": "Nima quramiz",
  "bw1": "AI tizimlar",
  "bw2": "Veb-mahsulotlar",
  "bw3": "Ta'lim platformalari",
  "bw4": "Avtomatlashtirish",
  "bw5": "Raqamli tajribalar",
  "brand_vision": "Maqsad",
  "v1": "O'zbekistondan boshlash.",
  "v2": "Markaziy Osiyo bo'ylab qurish.",
  "v3": "Global miqyosga chiqish.",
  "emblem_cap": "Rasmiy emblema",
  "max_kicker": "Asoschi",
  "max_roles": "Prompt Engineer · AI yordamida dasturchi · UzLeeder asoschisi",
  "max_quote": "“Men AI vositalaridan shunchaki foydalanishni istamayman. Ularning atrofida mahsulot quraman.”",
  "about_p1": "Men Max (Mekhriddin Abdualim), UzLeeder asoschisiman, Toshkentda yashayman. Muhandis kabi fikrlayman: avval muammoni tushunaman, keyin tizimni loyihalayman, so'ng sifatdan voz kechmay tezroq harakatlanish uchun AI'dan foydalanaman.",
  "about_p2": "Ishim mahsulot qurish va AI workflow'lari kesishgan joyda — full-stack platformalar, avtomatlashtirish va AI yordamida dasturlash. Topshirish orqali o'rganaman: har bir loyiha ishlaydigan dastur bilan tugaydigan tajriba.",
  "about_p3": "\"Besh million AI yetakchilari\" dasturi orqali AI prompt engineering va Google Cloud orqali generativ AI bo'yicha sertifikatlarim bor — va har bir loyiha bilan o'rganishda davom etaman.",
  "pr1": "Muhandislik fikrlashi",
  "pr1d": "Avval tizim, keyin ekran.",
  "pr2": "Mahsulot qurish",
  "pr2d": "Topshirilgani mukammalidan afzal.",
  "pr3": "AI workflow'lar",
  "pr3d": "Modellar — sehr emas, vosita.",
  "pr4": "Tajriba",
  "pr4d": "Sinash, o'lchash, takrorlash.",
  "photo_role": "Asoschi · UzLeeder",
  "soon": "Tez kunda",
  "stack_kicker": "Texnologiyalar",
  "stack_title": "Maqsadiga ko'ra guruhlangan.",
  "stack_sub": "Faqat real ishda ishlatadiganlarim — mashhur bo'lgani uchun qo'shilgan hech narsa yo'q.",
  "st_ai": "AI va modellar",
  "st_lang": "Dasturlash tillari",
  "st_fb": "Frontend va backend",
  "st_data": "Ma'lumot va xavfsizlik",
  "st_deploy": "Deploy",
  "st_auto": "Avtomatlashtirish",
  "st_media": "Kreativ AI va dizayn",
  "st_work": "Ish muhiti",
  "proof_kicker": "Isbot",
  "proof_title": "Tekshirsa bo'ladigan raqamlar.",
  "pf1": "ta mahsulot topshirilgan — biri ishlab turibdi, biri deploy'ga tayyor",
  "pf2": "ta avtomatik tekshiriladigan mashq — Shokirov Math Academy'da",
  "pf3": "ta DTM kitobi mavzusi imtihonga tayyorlov uchun tuzilgan",
  "pf4": "ta aviakompaniyani MarketHub'ning GDS o'quvchisi taniydi",
  "pf5": "ta tasdiqlangan sertifikat, jumladan Google Cloud",
  "certs_kicker": "Sertifikatlar",
  "certs_title": "Tasdiqlangan bilim.",
  "certs_sub": "Tamomlagan kurs va dasturlarim — har biri rasmiy tekshiruv sahifasiga bog'langan.",
  "doc_title": "Rasmiy xizmatlar va narxlar hujjati",
  "price_kicker": "Xizmatlar va narxlar",
  "price_title": "Aniq hajm. Shaffof narxlar.",
  "contact_title": "Keling, birga quramiz.",
  "contact_sub": "Nima qurayotganingizni yozing. Tez javob beraman — odatda o'sha kuni, email yoki Telegram orqali.",
  "copy": "Nusxalash",
  "copied": "Nusxalandi",
  "copy_fail": "Nusxalab bo'lmadi — manzilni belgilab oling.",
  "err_name": "Ismingizni kiriting.",
  "err_email": "To'g'ri email manzil kiriting.",
  "err_msg": "Qisqa xabar yozing.",
  "foot_line": "AI davri texnologiyasi. Haqiqiy mahsulotlar. Haqiqiy muhandislik.",
  "cs_overview": "Umumiy ma'lumot",
  "cs_challenge": "Muammo",
  "cs_solution": "Yechim",
  "cs_tech": "Texnologiyalar",
  "cs_role": "Mening rolim",
  "cs_result": "Natija",
  "cs_media": "Media",
  "cs_arch": "Arxitektura",
  "cs_close": "Case study'ni yopish",
  "cs_label": "Case study",
  "roles": [
   "Prompt Engineer",
   "AI yordamida dasturchi",
   "AI tizimlar quruvchisi",
   "UzLeeder asoschisi"
  ],
  "cases": {
   "shokirov": {
    "cat": "Ta'lim platformasi · Faol",
    "lead": "Haqiqiy matematika akademiyasi uchun qurilgan full-stack ta'lim platformasi — shunchaki landing emas.",
    "overview": "Shokirov Math Academy uchta rolli panelga ega platformada ishlaydi: talaba, o'qituvchi va direktor. U akademiyaning to'liq siklini qamrab oladi: onlayn ariza, qabul, davomat, to'lovlar, baholar, feedback va uy vazifalari, hamda DTM imtihoniga tayyorlov uchun o'quv qismi.",
    "challenge": "Akademiyaga uchta rol uchun qabul, o'qitish va to'lovlarni birlashtiruvchi yagona tizim kerak edi — hamda kurslarni tasvirlaydigan sayt emas, talabalar uchun tuzilgan, o'zini o'zi tekshiradigan imtihon mashqlari.",
    "solution": "Arizachilar onlayn ariza beradi; o'qituvchi ularni ko'rib chiqib qabul qiladi, so'ng davomat, to'lovlar, baholar, feedback va uy vazifalarini boshqaradi, direktor esa akademiya bo'yicha to'lovlarni nazorat qiladi. Talabalar DTM kitobidagi 31 mavzu bo'yicha 5 653 ta avtomatik tekshiriladigan mashq ishlaydi, reytingda bellashadi, UZ/EN tillari va dark/light rejimlaridan foydalanadi.",
    "role": "UzLeeder tomonidan to'liq bajarilgan: mahsulotni rejalashtirish, UI, React frontend, Node.js + Express API, baza loyihasi va deploy.",
    "result": "shokirov-academy.vercel.app manzilida ishlab turibdi va imzolangan loyiha topshirish shartnomasi asosida topshirilgan.",
    "arch": [
     [
      "Foydalanuvchilar",
      "Talabalar · o'qituvchilar · direktor"
     ],
     [
      "Veb-ilova",
      "React interfeys · UZ/EN · dark/light"
     ],
     [
      "Ilova mantig'i",
      "Vercel'dagi Node.js + Express serverless API"
     ],
     [
      "Auth va rollar",
      "JWT asosidagi rolli kirish"
     ],
     [
      "Baza",
      "Neon'dagi PostgreSQL"
     ],
     [
      "Natija",
      "Panellar · avto-tekshiruv · reyting · to'lov yozuvlari"
     ]
    ]
   },
   "markethub": {
    "cat": "B2B SaaS · Sayohat · Sotuvda",
    "lead": "Aviachipta konsolidatorlari va biletlash markazlari uchun to'liq, deploy qilishga tayyor B2B bron portali.",
    "overview": "MarketHub hamkor agentliklarga bron so'rovlarini yuborish uchun shaxsiy hudud beradi, konsolidator jamoasi esa har bir buyurtmani narxlaydi, tasdiqlaydi va hisob-faktura chiqaradi. Bu super-admin, admin, operator va agentliklar uchun rolli kirishga ega ko'p kompaniyali SaaS.",
    "challenge": "Konsolidatorlar ko'plab agentliklardan so'rov oladi. Har bir buyurtma chegirma qoidalari bo'yicha narxlanishi, aviakompaniya PNR'i bilan bog'lanishi va hisob-faktura qilinishi kerak — xavfsiz, har bir kompaniya uchun alohida va aniq audit izi bilan.",
    "solution": "Agentliklar so'rov yuboradi; operatorlar har bir buyurtmani konsolidator chegirma qoidalari bo'yicha narxlaydi, aviakompaniya PNR'ini kiritadi va brendli PDF hisob-fakturani avtomatik yuboradi. GDS marshrut o'quvchisi PNR matnidan 1 100+ aviakompaniyani taniydi. 2FA, to'liq audit jurnali, analitika va hisob-inventar ichiga qurilgan. Faqat taklif asosida, maxfiy qilib loyihalangan.",
    "role": "UzLeeder mahsulot sertifikati tasdiqlaganidek, yagona muallif va dasturchi: mahsulot dizayni, Python/Flask backend, ma'lumot modeli, xavfsizlik va interfeys.",
    "result": "To'liq tayyor va deploy qilishga shay. Mualliflik va egalik UzLeeder tomonidan tasdiqlangan; mahsulot sotish yoki litsenziyalash uchun mavjud.",
    "arch": [
     [
      "Foydalanuvchilar",
      "Hamkor agentliklar · operatorlar · adminlar"
     ],
     [
      "Veb-ilova",
      "Agentliklar uchun shaxsiy hududli, taklif asosidagi portal"
     ],
     [
      "Ilova mantig'i",
      "Python + Flask — narx qoidalari va buyurtma oqimi"
     ],
     [
      "Xavfsizlik",
      "Rollar · 2FA · to'liq audit jurnali"
     ],
     [
      "Ma'lumot",
      "SQLite · ko'p kompaniyali"
     ],
     [
      "Servislar",
      "GDS marshrut o'quvchisi · PDF hisob-faktura generatori"
     ],
     [
      "Natija",
      "Narxlangan buyurtma + brendli PDF hisob-faktura"
     ]
    ]
   }
  },
  "ai_tools_label": "Bu yerda ishlatadigan vositalarim",
  "tx_1_claude": "uzun, tuzilgan system prompt'lar",
  "tx_1_chatgpt": "prompt'larni tez sinash va yaxshilash",
  "tx_1_gemini": "modellar javoblarini solishtirish",
  "tx_2_claude": "yordamchilar uchun rol, qoida va ohang",
  "tx_2_chatgpt": "yordamchi xulq-atvorini sozlash",
  "tx_2_gemini": "modellar orasida barqarorlikni tekshirish",
  "tx_3_notebooklm": "o'z hujjatlarimga tayangan javoblar",
  "tx_3_perplexity": "manbali, iqtibosli tadqiqot",
  "tx_3_claude": "berilgan kontekst asosida fikrlash",
  "tx_4_notebooklm": "faqat yuklangan manbalar doirasidagi javoblar",
  "tx_4_claude": "\"faqat kontekstdan javob ber\" qoidalari",
  "tx_4_chatgpt": "qat'iy ko'rsatmali bilim fayllari",
  "tx_5_n8n": "ko'p bosqichli AI workflow'lar",
  "tx_5_zapier": "ilovalarni AI bosqichlariga ulash",
  "tx_5_claude": "oqim ichidagi fikrlash bosqichi",
  "tx_6_claudecode": "terminaldan katta dasturlash vazifalari",
  "tx_6_cursor": "muharrirda AI bilan birga kod yozish",
  "tx_6_replit": "brauzerda tez qurish va deploy",
  "tx_6_lovable": "g'oyadan ishlaydigan prototipgacha",
  "tx_7_claude": "fikrlash va uzun hujjatlar",
  "tx_7_chatgpt": "yozish va g'oya topish",
  "tx_7_gemini": "tez tadqiqot va tahlil",
  "tx_7_perplexity": "manbali jonli veb-qidiruv",
  "tx_8_midjourney": "rasmlar va konsept-art",
  "tx_8_runway": "AI video tahrirlash va yaratish",
  "tx_8_kling": "matn yoki rasmdan kinematik kliplar",
  "tx_8_elevenlabs": "tabiiy ovozlashtirish",
  "tx_8_heygen": "AI avatar videolar",
  "tx_9_n8n": "AI tugunli avtomatlashtirishlar",
  "tx_9_zapier": "kodsiz ilova avtomatlashtirishlari",
  "tx_9_openclaw": "real vazifalar uchun shaxsiy AI yordamchi",
  "nav_team": "Jamoa",
  "team_kicker": "Jamoa",
  "team_title": "Max jamoasi.",
  "team_sub": "Bitta inson-asoschi. Har bir model o'z vazifasiga ega AI jamoa — va hech kim dam olish kuni olmaydi.",
  "team_count": "1 inson · 12 AI jamoadosh",
  "team_human": "Inson",
  "team_ai": "AI",
  "team_online": "onlayn",
  "team_note": "Rollar Max har bir vositadan qanday foydalanishini ko'rsatadi. Yakuniy qaror — va har bir relizning mas'uliyati — insonda qoladi.",
  "tm_max_r": "Asoschi · CEO · Bosh dasturchi",
  "tm_max_d": "Yo'nalishni belgilaydi, tizimlarni loyihalaydi, yakuniy qarorni qabul qiladi — va har bir reliz uchun javob beradi.",
  "tm_claude_r": "Hammuassis · Bosh arxitektor",
  "tm_claude_d": "Tizimlarni men bilan birga o'ylaydi, rejalarni tanqid qiladi va og'ir kodni yozadi.",
  "tm_claudecode_r": "Senior muhandis",
  "tm_claudecode_d": "Katta dasturlash vazifalarini to'g'ridan-to'g'ri terminaldan bajaradi.",
  "tm_codex_r": "Dasturiy muhandis",
  "tm_codex_d": "Koddagi ikkinchi qo'l — refaktoring, testlar va review.",
  "tm_chatgpt_r": "Yozuvchi va maslahatchi",
  "tm_chatgpt_d": "Matn, email va g'oyalar qoralamasini yozadi — va ikkinchi fikr beradi.",
  "tm_gemini_r": "Tadqiqot tahlilchisi",
  "tm_gemini_d": "Ma'lumotni tez izlaydi, qisqartiradi va tahlil qiladi.",
  "tm_perplexity_r": "Fakt-tekshiruvchi",
  "tm_perplexity_d": "Da'volarni jonli, manbali ma'lumotlar bilan tekshiradi.",
  "tm_cursor_r": "Juftlikda dasturchi",
  "tm_cursor_d": "Muharrir ichida men bilan birga kod yozadi.",
  "tm_higgsfield_r": "Kreativ direktor · Video",
  "tm_higgsfield_d": "Kinematik kamera harakatlari va AI video effektlar.",
  "tm_midjourney_r": "Vizual dizayner",
  "tm_midjourney_d": "Konsept-art, vizuallar va brend tasvirlari.",
  "tm_elevenlabs_r": "Ovoz artisti",
  "tm_elevenlabs_d": "Istalgan tilda tabiiy ovozlashtirish.",
  "tm_notebooklm_r": "Bilim kutubxonachisi",
  "tm_notebooklm_d": "Hujjatlarni qaydlar va audio sharhlarga aylantiradi.",
  "tm_n8n_r": "Operatsiyalar menejeri",
  "tm_n8n_d": "Hammasini bog'lab turuvchi avtomatlashtirishlarni boshqaradi."
 },
 "fa": {
  "tag_live": "فعال",
  "tag_soon": "به‌زودی",
  "tag_sale": "برای فروش",
  "proj_buy": "استعلام",
  "proj_negotiable": "یا توافقی",
  "proj_contract": "مشاهده قرارداد",
  "proj_certificate": "مشاهده گواهی",
  "proj_view": "مشاهده سایت",
  "svc1_title": "وب‌سایت آکادمی",
  "svc1": "وب‌سایت کامل برای آکادمی‌ها و مراکز آموزشی — دوره‌ها، قیمت‌ها، تماس و ثبت‌نام.",
  "svc2_title": "وب‌سایت‌های حرفه‌ای",
  "svc2": "وب‌سایت حرفه‌ای — از یک صفحهٔ فرود تا سایت چندصفحه‌ای کامل با بک‌اند، برای کسب‌وکار شما.",
  "svc9_title": "ایجنت هوش مصنوعی و یکپارچه‌سازی API",
  "svc9": "ایجنت‌های هوش مصنوعی، چت‌بات‌ها و یکپارچه‌سازی API که ابزارهای شما را به هم وصل و کار واقعی را خودکار می‌کنند.",
  "svc10_title": "پورتال و پلتفرم B2B",
  "svc10": "پورتال‌های تجاری فول‌استک با پنل‌های نقش‌محور، احراز هویت، پایگاه داده و داشبورد — مثل یک SaaS واقعی.",
  "svc11_title": "ربات تلگرام و اتوماسیون",
  "svc11": "ربات‌های تلگرام و اتوماسیون بدون کد برای سفارش‌ها، سرنخ‌ها و کارهای تکراری.",
  "svc3_title": "طراحی وب اختصاصی",
  "svc3": "طراحی کاملاً اختصاصی با برندینگ، رنگ‌ها و چیدمان منحصربه‌فرد — فقط برای شما.",
  "svc4_title": "نگهداری وب‌سایت",
  "svc4": "به‌روزرسانی، رفع اشکال و بهبود وب‌سایت‌های موجود. برای مشتریانم همیشه رایگان.",
  "svc5_title": "طراحی لوگو",
  "svc5": "لوگوهای منحصربه‌فرد و حرفه‌ای که هویت برند شما را نشان می‌دهند.",
  "svc6_title": "ویدیو و عکس با هوش مصنوعی",
  "svc6": "ویدیوها و تصاویر چشمگیر ساخته‌شده با هوش مصنوعی برای برند، تبلیغات و شبکه‌های اجتماعی.",
  "svc7_title": "نگارش ایمیل",
  "svc7": "ایمیل‌های حرفه‌ای و متقاعدکننده برای ارتباط، فروش و مکاتبات تجاری.",
  "svc8_title": "ارائه‌ها",
  "svc8": "اسلایدهای حرفه‌ای و جذاب برای کسب‌وکار، ارائهٔ سرمایه‌گذاری و آموزش.",
  "from250": "از $250",
  "free_clients": "رایگان برای مشتریان",
  "price_academy": "$200 – $2000",
  "price_web": "$200 – $4000+",
  "price_ai": "از $500",
  "price_b2b": "از $1000",
  "price_bot": "از $100",
  "price_starter": "$200",
  "price_pro": "$600",
  "price_custom": "$1500+",
  "price_ent": "$4000+",
  "from15": "از $15",
  "from10": "از $10",
  "from10b": "از $10",
  "from15b": "از $15",
  "certs_verify": "تأیید",
  "certs_featured_badge": "گواهی دولتی",
  "certs_featured_desc": "طرح مشترک دولت‌های امارات متحدهٔ عربی و جمهوری ازبکستان برای آموزش پنج میلیون نفر در مهندسی پرامپت — همسو با راهبرد توسعهٔ فناوری‌های هوش مصنوعی ازبکستان تا ۲۰۳۰.",
  "certs_featured2_badge": "Google Cloud · AI",
  "certs_featured2_desc": "دورهٔ Google Cloud دربارهٔ نحوهٔ کار هوش مصنوعی مولد، کاربردهای واقعی آن و ابزارهای سیستم‌های هوش مصنوعی مدرن.",
  "price_sub": "بدون هزینهٔ پنهان. همان چیزی که می‌بینید، همان را پرداخت می‌کنید.",
  "one_time": "پرداخت یک‌باره",
  "based_req": "بسته به نیاز",
  "popular": "محبوب‌ترین",
  "get_started": "شروع کنید",
  "lets_talk": "صحبت کنیم",
  "f_landing": "صفحهٔ فرود (۱ صفحه)",
  "f_mobile": "سازگار با موبایل",
  "f_contact": "بخش تماس",
  "f_tg": "اتصال به تلگرام",
  "f_3day": "تحویل ۳ روزه",
  "f_support": "پشتیبانی رایگان",
  "f_multi": "وب‌سایت چندصفحه‌ای",
  "f_custom": "طراحی و برندینگ اختصاصی",
  "f_reg": "فرم ثبت‌نام",
  "f_tgphone": "اتصال تلگرام و تلفن",
  "f_cms": "CMS (محتوای قابل ویرایش)",
  "f_5day": "تحویل ۵ روزه",
  "f_forever": "پشتیبانی رایگان همیشگی",
  "f_everything": "همهٔ امکانات Professional",
  "f_adv": "انیمیشن‌های پیشرفته",
  "f_backend": "یکپارچه‌سازی بک‌اند",
  "f_domain": "کمک در راه‌اندازی دامنه",
  "f_priority": "تحویل با اولویت",
  "f_lifetime": "پشتیبانی رایگان مادام‌العمر",
  "f_everything_custom": "همهٔ امکانات Custom",
  "f_platform": "پلتفرم وب فول‌استک",
  "f_panels": "پنل‌های مدیریت چندنقشی",
  "f_dbapi": "پایگاه داده، احراز هویت و API",
  "f_deploy": "استقرار و آموزش",
  "msg_tg": "پیام در تلگرام",
  "phone_label": "تلفن",
  "loc_city": "تاشکند، ازبکستان",
  "form_name": "نام شما",
  "form_name_ph": "مثلاً علی رضایی",
  "form_email": "ایمیل",
  "form_email_ph": "you@example.com",
  "form_msg": "پیام",
  "form_msg_ph": "دربارهٔ پروژه‌تان بگویید...",
  "form_send": "ارسال پیام",
  "form_sending": "در حال ارسال...",
  "form_ok": "پیام ارسال شد — به‌زودی پاسخ می‌دهم.",
  "form_err": "مشکلی پیش آمد. دوباره تلاش کنید یا در تلگرام پیام دهید.",
  "form_invalid": "لطفاً فیلدهای مشخص‌شده را بررسی کنید.",
  "skip": "رفتن به محتوا",
  "nav_work": "کارها",
  "nav_ai": "AI",
  "nav_about": "دربارهٔ من",
  "nav_contact": "تماس",
  "nav_pricing": "قیمت‌ها",
  "hero_eyebrow": "UzLeeder · عصر هوش مصنوعی / 2026",
  "hero_title": "مهندسی محصول برای <em>عصر هوش مصنوعی.</em>",
  "hero_desc": "من Max هستم — مهندس پرامپت و توسعه‌دهنده‌ای که با کمک هوش مصنوعی کار می‌کند. از طریق UzLeeder محصولات دیجیتال واقعی، سیستم‌های هوش مصنوعی، پلتفرم‌های آموزشی و تجربه‌های وب مدرن می‌سازم.",
  "btn_work": "مشاهدهٔ کارها",
  "btn_about": "دربارهٔ UzLeeder",
  "btn_contact": "تماس",
  "hf_based": "محل",
  "hf_city": "تاشکند، ازبکستان",
  "hf_shipped": "تحویل‌شده",
  "hf_products": "۲ محصول فعال",
  "hf_focus": "تمرکز",
  "hf_focus_v": "سیستم‌های AI · محصولات وب",
  "sc_now": "در حال نمایش",
  "cs_open": "مشاهدهٔ مطالعهٔ موردی",
  "v_play": "پخش ویدیو",
  "v_pause": "توقف ویدیو",
  "work_kicker": "کارهای منتخب",
  "work_title": "محصولات واقعی. مهندسی واقعی.",
  "port_sub": "هر پروژهٔ این‌جا نرم‌افزاری تحویل‌شده و کارا است — گواه همهٔ چیزهای دیگر این صفحه.",
  "certified": "تأییدشده توسط UzLeeder",
  "m_category": "دسته",
  "m_role": "نقش",
  "m_tech": "فناوری",
  "m_value": "ارزش پروژه",
  "m_why": "چرا مهم است",
  "w1_lead": "پلتفرم آموزشی فول‌استک برای یک آکادمی واقعی ریاضی — داشبوردهای دانش‌آموز، معلم و مدیر با احراز هویت نقش‌محور، به‌همراه پذیرش آنلاین، حضور و غیاب، پرداخت‌ها، نمرات و تکالیف.",
  "w1_cat": "پلتفرم آموزشی",
  "w1_role": "فول‌استک: محصول، UI، API، پایگاه داده",
  "w1_why": "یک سیستم پذیرش، آموزش و پرداخت‌های کل آکادمی را اداره می‌کند — و ۵٬۶۵۳ تمرین با تصحیح خودکار در ۳۱ مبحث کتاب DTM در اختیار دانش‌آموزان می‌گذارد.",
  "w2_lead": "پورتال رزرو B2B آمادهٔ استقرار برای کنسولیداتورهای سفر. آژانس‌ها از فضای اختصاصی خود درخواست می‌فرستند؛ تیم قیمت هر سفارش را طبق قوانین تخفیف تعیین می‌کند، PNR ایرلاین را ثبت و فاکتور PDF برنددار را خودکار ارسال می‌کند.",
  "w2_cat": "B2B SaaS · سفر",
  "w2_role": "نویسندهٔ یگانه: محصول، بک‌اند، امنیت، UI",
  "w2_why": "SaaS چندشرکتی با دسترسی نقش‌محور، 2FA و گزارش کامل ممیزی — به‌همراه خوانندهٔ GDS که بیش از ۱٬۱۰۰ ایرلاین را از متن خام PNR تشخیص می‌دهد.",
  "next_k": "03 — بعدی",
  "next_t": "محصول شما می‌تواند مطالعهٔ موردی بعدی باشد.",
  "build_kicker": "چه می‌سازم",
  "build_title": "سیستم، نه فقط صفحه.",
  "b1_t": "سیستم‌های هوش مصنوعی",
  "b1_d": "برنامه‌های RAG، دستیارهای مبتنی بر دانش، گردش‌کارهای AI و پایپ‌لاین‌های عامل‌محور.",
  "b2_t": "محصولات ساخته‌شده با AI",
  "b2_d": "برنامه‌های مدرن با حضور AI در فرایند — تکرار سریع‌تر، همان انضباط مهندسی.",
  "b3_t": "برنامه‌های وب",
  "b3_d": "وب‌سایت‌ها و پلتفرم‌های آمادهٔ بهره‌برداری با احراز هویت، پایگاه داده و پنل مدیریت.",
  "b4_t": "سیستم‌های آموزشی",
  "b4_d": "پلتفرم‌های آموزشی و سیستم‌های یادگیری شخصی — مانند پلتفرم Shokirov Math Academy.",
  "b5_t": "اتوماسیون",
  "b5_d": "گردش‌کارهای چندمرحله‌ای، ربات‌های تلگرام و یکپارچه‌سازی‌هایی که کارهای تکراری را از دوش افراد برمی‌دارند.",
  "b6_t": "محصولات دیجیتال",
  "b6_d": "از ایده تا استقرار: تفکر محصول، طراحی، ساخت و راه‌اندازی.",
  "ai_kicker": "مهندسی هوش مصنوعی",
  "ai_title": "هوش مصنوعی تزئین نیست. بخشی از مهندسی است.",
  "ai_sub": "این‌که واقعاً چطور با مدل‌ها کار می‌کنم — روش‌های پشت محصولات.",
  "pipe_title": "ایده چگونه به محصول تبدیل می‌شود",
  "p1": "ایده",
  "p1d": "یک مسئلهٔ واقعی",
  "p2": "پرامپت",
  "p2d": "دستورالعمل‌ها و محدودیت‌ها",
  "p3": "مدل",
  "p3d": "مدل مناسب برای هر مرحله",
  "p4": "منطق",
  "p4d": "کد، قوانین، داده",
  "p5": "سیستم",
  "p5d": "API، پایگاه داده، احراز هویت",
  "p6": "محصول",
  "p6d": "نرم‌افزار تحویل‌شده",
  "p7": "کاربر",
  "p7d": "آدم‌های واقعی از آن استفاده می‌کنند",
  "ai1_t": "مهندسی پرامپت",
  "ai1_d": "طراحی دستورالعمل‌های سطح سیستم، محدودیت‌ها، رفتار و ساختار خروجی برای برنامه‌های AI قابل‌اعتماد.",
  "ai2_t": "طراحی System Prompt",
  "ai2_d": "تعیین نقش، قوانین، لحن و رفتار هنگام خطا تا مدل درون محصول رفتاری پایدار داشته باشد.",
  "ai3_t": "RAG",
  "ai3_d": "اتصال مدل‌ها به منابع دانش کنترل‌شده تا پاسخ‌ها بر اطلاعات مرتبط تکیه کنند.",
  "ai4_t": "پاسخ‌های محدود به پایگاه دانش",
  "ai4_d": "نگه داشتن پاسخ‌ها در چارچوب پایگاه دانش تأییدشده — و گفتن «نمی‌دانم» وقتی منبع پاسخی ندارد.",
  "ai5_t": "ارکستراسیون گردش‌کار AI",
  "ai5_d": "زنجیره کردن مراحل — بازیابی، استدلال، تولید، بررسی — تا چند قابلیت با هم یک کار بزرگ‌تر را انجام دهند.",
  "ai6_t": "توسعهٔ نرم‌افزار با کمک AI",
  "ai6_d": "ساخت نرم‌افزار با Claude Code، Cursor و ابزارهای مشابه، در حالی که معماری، بازبینی و تست در دست انسان می‌ماند.",
  "ai7_t": "گردش‌کارهای چندمدلی",
  "ai7_d": "انتخاب مدل مناسب برای هر مرحله — استدلال، نوشتن، بینایی، صدا — به‌جای تحمیل همه‌چیز به یک مدل.",
  "ai8_t": "پایپ‌لاین‌های تولید محتوا",
  "ai8_d": "پایپ‌لاین‌های تکرارپذیر برای متن، تصویر، ویدیو و صدا با ابزارهایی مانند Midjourney، Runway، Kling و ElevenLabs.",
  "ai9_t": "اتوماسیون هوشمند",
  "ai9_d": "n8n، Zapier و کد سفارشی که به AI اجازه می‌دهند روی ابزارهای واقعی کار کند — فرم‌ها، پیام‌ها، جدول‌ها و APIها.",
  "brand_title": "برند فناوری و محصول دیجیتال با محوریت هوش مصنوعی.",
  "brand_lead": "UzLeeder برندی است که Max برای ساخت محصولات و سیستم‌ها با مهندسی نرم‌افزار مدرن و هوش مصنوعی بنیان گذاشت — برای رهبرانی که ابزار کارا می‌خواهند، نه تزئین.",
  "brand_what": "چه می‌سازیم",
  "bw1": "سیستم‌های AI",
  "bw2": "محصولات وب",
  "bw3": "پلتفرم‌های آموزشی",
  "bw4": "اتوماسیون",
  "bw5": "تجربه‌های دیجیتال",
  "brand_vision": "چشم‌انداز",
  "v1": "آغاز از ازبکستان.",
  "v2": "ساختن در سراسر آسیای مرکزی.",
  "v3": "گسترش جهانی.",
  "emblem_cap": "نشان رسمی",
  "max_kicker": "بنیان‌گذار",
  "max_roles": "مهندس پرامپت · توسعه‌دهنده با کمک AI · بنیان‌گذار UzLeeder",
  "max_quote": "«نمی‌خواهم فقط از ابزارهای هوش مصنوعی استفاده کنم. من پیرامون آن‌ها محصول می‌سازم.»",
  "about_p1": "من Max (مهرالدین عبدالعلیم) هستم، بنیان‌گذار UzLeeder و ساکن تاشکند، ازبکستان. مثل یک مهندس فکر می‌کنم: اول مسئله را می‌فهمم، بعد سیستم را طراحی می‌کنم و سپس از AI استفاده می‌کنم تا بدون کم گذاشتن از کیفیت، سریع‌تر پیش بروم.",
  "about_p2": "کار من جایی است که ساخت محصول با گردش‌کارهای AI تلاقی می‌کند — پلتفرم‌های فول‌استک، اتوماسیون و توسعه با کمک AI. با تحویل دادن یاد می‌گیرم: هر پروژه آزمایشی است که به نرم‌افزار کارا ختم می‌شود.",
  "about_p3": "گواهی مهندسی پرامپت را از برنامهٔ «پنج میلیون رهبر هوش مصنوعی» و گواهی هوش مصنوعی مولد را از Google Cloud دارم — و با هر پروژه به یادگیری ادامه می‌دهم.",
  "pr1": "ذهنیت مهندسی",
  "pr1d": "اول سیستم، بعد صفحه.",
  "pr2": "ساخت محصول",
  "pr2d": "تحویل‌شده بهتر از بی‌نقص.",
  "pr3": "گردش‌کارهای AI",
  "pr3d": "مدل‌ها ابزارند، نه جادو.",
  "pr4": "آزمایش",
  "pr4d": "آزمودن، سنجیدن، تکرار.",
  "photo_role": "بنیان‌گذار · UzLeeder",
  "soon": "به‌زودی",
  "stack_kicker": "فناوری",
  "stack_title": "دسته‌بندی بر اساس کاربرد.",
  "stack_sub": "فقط چیزهایی که در کار واقعی استفاده می‌کنم — هیچ‌چیز فقط به‌خاطر محبوبیت نیامده.",
  "st_ai": "AI و مدل‌ها",
  "st_lang": "زبان‌ها",
  "st_fb": "فرانت‌اند و بک‌اند",
  "st_data": "داده و امنیت",
  "st_deploy": "استقرار",
  "st_auto": "اتوماسیون",
  "st_media": "AI خلاق و طراحی",
  "st_work": "فضای کار",
  "proof_kicker": "شواهد",
  "proof_title": "عددهایی که می‌شود بررسی کرد.",
  "pf1": "محصول تحویل‌شده — یکی فعال، دیگری آمادهٔ استقرار",
  "pf2": "تمرین با تصحیح خودکار در Shokirov Math Academy",
  "pf3": "مبحث کتاب DTM برای آمادگی آزمون",
  "pf4": "ایرلاینی که خوانندهٔ GDS در MarketHub تشخیص می‌دهد",
  "pf5": "گواهی تأییدشده، از جمله Google Cloud",
  "certs_kicker": "گواهی‌ها",
  "certs_title": "یادگیری تأییدشده.",
  "certs_sub": "دوره‌ها و برنامه‌هایی که گذرانده‌ام — هر کدام به صفحهٔ تأیید رسمی خود لینک شده است.",
  "doc_title": "سند رسمی خدمات و قیمت‌ها",
  "price_kicker": "خدمات و قیمت‌ها",
  "price_title": "دامنهٔ کار روشن. قیمت شفاف.",
  "contact_title": "بیایید چیزی بسازیم.",
  "contact_sub": "بگویید چه می‌سازید. سریع پاسخ می‌دهم — معمولاً همان روز، از طریق ایمیل یا تلگرام.",
  "copy": "کپی",
  "copied": "کپی شد",
  "copy_fail": "کپی نشد — آدرس را انتخاب کنید.",
  "err_name": "لطفاً نام خود را وارد کنید.",
  "err_email": "لطفاً یک ایمیل معتبر وارد کنید.",
  "err_msg": "لطفاً یک پیام کوتاه بنویسید.",
  "foot_line": "فناوری عصر هوش مصنوعی. محصولات واقعی. مهندسی واقعی.",
  "cs_overview": "نمای کلی",
  "cs_challenge": "چالش",
  "cs_solution": "راه‌حل",
  "cs_tech": "فناوری",
  "cs_role": "نقش من",
  "cs_result": "نتیجه",
  "cs_media": "رسانه",
  "cs_arch": "معماری",
  "cs_close": "بستن مطالعهٔ موردی",
  "cs_label": "مطالعهٔ موردی",
  "roles": [
   "مهندس پرامپت",
   "توسعه‌دهنده با کمک AI",
   "سازندهٔ سیستم‌های AI",
   "بنیان‌گذار UzLeeder"
  ],
  "ai_tools_label": "ابزارهایی که این‌جا استفاده می‌کنم",
  "tx_1_claude": "system promptهای بلند و ساختاریافته",
  "tx_1_chatgpt": "آزمون و بهبود سریع پرامپت‌ها",
  "tx_1_gemini": "مقایسهٔ خروجی مدل‌ها",
  "tx_2_claude": "نقش، قوانین و لحن برای دستیارها",
  "tx_2_chatgpt": "تنظیم رفتار دستیار",
  "tx_2_gemini": "بررسی پایداری بین مدل‌ها",
  "tx_3_notebooklm": "پاسخ‌ها بر پایهٔ اسناد خودم",
  "tx_3_perplexity": "پژوهش مستند با منبع",
  "tx_3_claude": "استدلال بر پایهٔ متن داده‌شده",
  "tx_4_notebooklm": "پاسخ فقط از منابع بارگذاری‌شده",
  "tx_4_claude": "قانون «فقط از متن پاسخ بده»",
  "tx_4_chatgpt": "فایل‌های دانش با دستورالعمل سخت‌گیرانه",
  "tx_5_n8n": "گردش‌کارهای چندمرحله‌ای AI",
  "tx_5_zapier": "اتصال برنامه‌ها به مراحل AI",
  "tx_5_claude": "مرحلهٔ استدلال درون جریان",
  "tx_6_claudecode": "کارهای بزرگ کدنویسی از ترمینال",
  "tx_6_cursor": "برنامه‌نویسی جفتی با AI در ویرایشگر",
  "tx_6_replit": "ساخت و استقرار سریع در مرورگر",
  "tx_6_lovable": "از ایده تا نمونهٔ اولیهٔ کارا",
  "tx_7_claude": "استدلال و اسناد طولانی",
  "tx_7_chatgpt": "نوشتن و ایده‌پردازی",
  "tx_7_gemini": "پژوهش و تحلیل سریع",
  "tx_7_perplexity": "جست‌وجوی زندهٔ وب با منبع",
  "tx_8_midjourney": "تصویر و کانسپت‌آرت",
  "tx_8_runway": "ویرایش و تولید ویدیو با AI",
  "tx_8_kling": "کلیپ سینمایی از متن یا تصویر",
  "tx_8_elevenlabs": "صداگذاری طبیعی",
  "tx_8_heygen": "ویدیوهای آواتار AI",
  "tx_9_n8n": "اتوماسیون با گره‌های AI",
  "tx_9_zapier": "اتوماسیون بدون کد برنامه‌ها",
  "tx_9_openclaw": "دستیار شخصی AI برای کارهای واقعی",
  "nav_team": "تیم",
  "team_kicker": "تیم",
  "team_title": "تیم Max.",
  "team_sub": "یک بنیان‌گذار انسانی. تیمی از هوش مصنوعی که هر مدل در آن کاری دارد — و هیچ‌کس روز تعطیل نمی‌گیرد.",
  "team_count": "۱ انسان · ۱۲ هم‌تیمی AI",
  "team_human": "انسان",
  "team_ai": "AI",
  "team_online": "آنلاین",
  "team_note": "نقش‌ها نشان می‌دهند Max واقعاً از هر ابزار چطور استفاده می‌کند. تصمیم نهایی — و مسئولیت هر انتشار — با انسان است.",
  "tm_max_r": "بنیان‌گذار · مدیرعامل · توسعه‌دهندهٔ ارشد",
  "tm_max_d": "مسیر را تعیین می‌کند، سیستم‌ها را طراحی می‌کند و تصمیم نهایی را می‌گیرد — و پاسخ‌گوی هر انتشار است.",
  "tm_claude_r": "هم‌بنیان‌گذار · معمار ارشد",
  "tm_claude_d": "سیستم‌ها را با من فکر می‌کند، برنامه‌ها را به چالش می‌کشد و کدهای سنگین را می‌نویسد.",
  "tm_claudecode_r": "مهندس ارشد",
  "tm_claudecode_d": "کارهای بزرگ کدنویسی را مستقیم از ترمینال انجام می‌دهد.",
  "tm_codex_r": "مهندس نرم‌افزار",
  "tm_codex_d": "دست دوم در کد — بازسازی، تست و بازبینی.",
  "tm_chatgpt_r": "نویسنده و مشاور",
  "tm_chatgpt_d": "پیش‌نویس متن، ایمیل و ایده می‌نویسد — و نظر دوم می‌دهد.",
  "tm_gemini_r": "تحلیلگر پژوهش",
  "tm_gemini_d": "اطلاعات را سریع جست‌وجو، خلاصه و تحلیل می‌کند.",
  "tm_perplexity_r": "راستی‌آزما",
  "tm_perplexity_d": "ادعاها را با منابع زنده و مستند بررسی می‌کند.",
  "tm_cursor_r": "برنامه‌نویس جفت",
  "tm_cursor_d": "درون ویرایشگر کنار من کد می‌نویسد.",
  "tm_higgsfield_r": "مدیر خلاق · ویدیو",
  "tm_higgsfield_d": "حرکات سینمایی دوربین و افکت‌های ویدیویی AI.",
  "tm_midjourney_r": "طراح بصری",
  "tm_midjourney_d": "کانسپت‌آرت، تصاویر و تصویرسازی برند.",
  "tm_elevenlabs_r": "هنرمند صدا",
  "tm_elevenlabs_d": "صداگذاری طبیعی به هر زبانی.",
  "tm_notebooklm_r": "کتابدار دانش",
  "tm_notebooklm_d": "اسناد را به یادداشت و خلاصهٔ صوتی تبدیل می‌کند.",
  "tm_n8n_r": "مدیر عملیات",
  "tm_n8n_d": "اتوماسیون‌هایی را اداره می‌کند که همه‌چیز را به هم وصل می‌کنند.",
  "cases": {
   "shokirov": {
    "cat": "پلتفرم آموزشی · فعال",
    "lead": "پلتفرم آموزشی فول‌استک که برای یک آکادمی واقعی ریاضی ساخته شده — بسیار فراتر از یک صفحهٔ فرود.",
    "overview": "Shokirov Math Academy روی پلتفرمی با سه داشبورد نقش‌محور کار می‌کند — دانش‌آموز، معلم و مدیر. این پلتفرم چرخهٔ کامل آکادمی را پوشش می‌دهد: درخواست آنلاین، ثبت‌نام، حضور و غیاب، پرداخت‌ها، نمرات، بازخورد و تکالیف، به‌همراه بخش آموزشی برای آمادگی آزمون DTM.",
    "challenge": "آکادمی به یک سیستم واحد برای پذیرش، آموزش و پرداخت‌ها با سه نقش نیاز داشت — و تمرین‌های ساختاریافته و خودآزما برای دانش‌آموزان، نه فقط سایتی که دوره‌ها را معرفی کند.",
    "solution": "متقاضیان آنلاین درخواست می‌دهند؛ معلم آن‌ها را بررسی و ثبت‌نام می‌کند، سپس حضور و غیاب، پرداخت‌ها، نمرات، بازخورد و تکالیف را مدیریت می‌کند و مدیر بر پرداخت‌های کل آکادمی نظارت دارد. دانش‌آموزان روی ۳۱ مبحث کتاب DTM با ۵٬۶۵۳ تمرین تصحیح خودکار تمرین می‌کنند، در رتبه‌بندی رقابت می‌کنند و از زبان‌های UZ/EN و حالت تیره/روشن استفاده می‌کنند.",
    "role": "اجرای کامل توسط UzLeeder: برنامه‌ریزی محصول، UI، فرانت‌اند React، API با Node.js + Express، طراحی پایگاه داده و استقرار.",
    "result": "در shokirov-academy.vercel.app فعال است و بر اساس قرارداد امضاشدهٔ اتمام پروژه تحویل داده شده است.",
    "arch": [
     [
      "کاربران",
      "دانش‌آموزان · معلمان · مدیر"
     ],
     [
      "برنامهٔ وب",
      "رابط React · UZ/EN · تیره/روشن"
     ],
     [
      "منطق برنامه",
      "API بدون سرور Node.js + Express روی Vercel"
     ],
     [
      "احراز هویت و نقش‌ها",
      "دسترسی نقش‌محور با JWT"
     ],
     [
      "پایگاه داده",
      "PostgreSQL روی Neon"
     ],
     [
      "خروجی",
      "داشبوردها · تصحیح خودکار · رتبه‌بندی · ثبت پرداخت‌ها"
     ]
    ]
   },
   "markethub": {
    "cat": "B2B SaaS · سفر · برای فروش",
    "lead": "پورتال رزرو B2B کامل و آمادهٔ استقرار برای کنسولیداتورهای سفر و مراکز فروش بلیت.",
    "overview": "MarketHub به آژانس‌های همکار فضای اختصاصی برای ارسال درخواست رزرو می‌دهد و تیم کنسولیداتور هر سفارش را قیمت‌گذاری، تأیید و فاکتور می‌کند. این یک SaaS چندشرکتی با دسترسی نقش‌محور برای سوپرادمین، ادمین، اپراتور و آژانس است.",
    "challenge": "کنسولیداتورها از آژانس‌های زیادی درخواست دریافت می‌کنند. هر سفارش باید طبق قوانین تخفیف قیمت‌گذاری، به PNR ایرلاین متصل و فاکتور شود — امن، برای هر شرکت جداگانه و با ردپای ممیزی روشن.",
    "solution": "آژانس‌ها درخواست می‌فرستند؛ اپراتورها هر سفارش را طبق قوانین تخفیف کنسولیداتور قیمت‌گذاری می‌کنند، PNR را ثبت و فاکتور PDF برنددار را خودکار ارسال می‌کنند. خوانندهٔ مسیر GDS بیش از ۱٬۱۰۰ ایرلاین را از متن خام PNR تشخیص می‌دهد. 2FA، گزارش کامل ممیزی، تحلیل‌ها و موجودی حساب‌ها درون آن ساخته شده است. فقط با دعوت و خصوصی طراحی شده است.",
    "role": "نویسنده و توسعه‌دهندهٔ یگانه، همان‌طور که گواهی محصول UzLeeder تأیید می‌کند: طراحی محصول، بک‌اند Python/Flask، مدل داده، امنیت و رابط کاربری.",
    "result": "کامل و آمادهٔ استقرار. مالکیت و نویسندگی توسط UzLeeder تأیید شده؛ محصول برای فروش یا واگذاری مجوز در دسترس است.",
    "arch": [
     [
      "کاربران",
      "آژانس‌های همکار · اپراتورها · ادمین‌ها"
     ],
     [
      "برنامهٔ وب",
      "پورتال مبتنی بر دعوت با فضای اختصاصی آژانس‌ها"
     ],
     [
      "منطق برنامه",
      "Python + Flask — قوانین قیمت و جریان سفارش"
     ],
     [
      "امنیت",
      "نقش‌ها · 2FA · گزارش کامل ممیزی"
     ],
     [
      "داده",
      "SQLite · چندشرکتی"
     ],
     [
      "سرویس‌ها",
      "خوانندهٔ مسیر GDS · سازندهٔ فاکتور PDF"
     ],
     [
      "خروجی",
      "سفارش قیمت‌گذاری‌شده + فاکتور PDF برنددار"
     ]
    ]
   }
  }
 },
 "ar": {
  "tag_live": "مباشر",
  "tag_soon": "قريبًا",
  "tag_sale": "للبيع",
  "proj_buy": "استفسار",
  "proj_negotiable": "أو بالاتفاق",
  "proj_contract": "عرض العقد",
  "proj_certificate": "عرض الشهادة",
  "proj_view": "زيارة الموقع",
  "svc1_title": "موقع أكاديمية",
  "svc1": "موقع متكامل للأكاديميات ومراكز التدريس — الدورات والأسعار والتواصل والتسجيل.",
  "svc2_title": "مواقع احترافية",
  "svc2": "مواقع احترافية — من صفحة هبوط واحدة إلى موقع متعدد الصفحات بخلفية برمجية متكاملة، مصممة لعملك.",
  "svc9_title": "وكلاء الذكاء الاصطناعي وتكامل API",
  "svc9": "وكلاء ذكاء اصطناعي وروبوتات محادثة وتكاملات API تربط أدواتك وتؤتمت العمل الحقيقي.",
  "svc10_title": "بوابات ومنصات B2B",
  "svc10": "بوابات أعمال متكاملة بلوحات حسب الأدوار ومصادقة وقاعدة بيانات ولوحات تحكم — كمنصة SaaS حقيقية.",
  "svc11_title": "روبوت تيليجرام والأتمتة",
  "svc11": "روبوتات تيليجرام وأتمتة بدون كود تتولى الطلبات والعملاء المحتملين والمهام المتكررة.",
  "svc3_title": "تصميم ويب مخصص",
  "svc3": "تصميم مخصص بالكامل بهوية وألوان وتخطيط فريد — مصمم لك وحدك.",
  "svc4_title": "صيانة المواقع",
  "svc4": "تحديثات وإصلاحات وتحسينات للمواقع الحالية. مجانية دائمًا لعملائي.",
  "svc5_title": "تصميم الشعارات",
  "svc5": "شعارات فريدة واحترافية تعكس هوية علامتك وتميزك.",
  "svc6_title": "فيديو وصور بالذكاء الاصطناعي",
  "svc6": "فيديوهات وصور مذهلة مولّدة بالذكاء الاصطناعي لعلامتك وإعلاناتك ووسائل التواصل.",
  "svc7_title": "كتابة البريد الإلكتروني",
  "svc7": "رسائل بريد احترافية ومقنعة للتواصل والمبيعات والمراسلات التجارية.",
  "svc8_title": "العروض التقديمية",
  "svc8": "عروض تقديمية احترافية ولافتة للأعمال وعروض المستثمرين والتعليم.",
  "from250": "من $250",
  "free_clients": "مجانًا للعملاء",
  "price_academy": "$200 – $2000",
  "price_web": "$200 – $4000+",
  "price_ai": "من $500",
  "price_b2b": "من $1000",
  "price_bot": "من $100",
  "price_starter": "$200",
  "price_pro": "$600",
  "price_custom": "$1500+",
  "price_ent": "$4000+",
  "from15": "من $15",
  "from10": "من $10",
  "from10b": "من $10",
  "from15b": "من $15",
  "certs_verify": "تحقّق",
  "certs_featured_badge": "شهادة حكومية",
  "certs_featured_desc": "مبادرة مشتركة بين حكومتي الإمارات العربية المتحدة وجمهورية أوزبكستان لتدريب خمسة ملايين شخص على هندسة الأوامر — بما يتوافق مع استراتيجية أوزبكستان لتطوير تقنيات الذكاء الاصطناعي حتى 2030.",
  "certs_featured2_badge": "Google Cloud · AI",
  "certs_featured2_desc": "دورة من Google Cloud عن كيفية عمل الذكاء الاصطناعي التوليدي وتطبيقاته الواقعية والأدوات التي تقوم عليها أنظمة الذكاء الاصطناعي الحديثة.",
  "price_sub": "بلا رسوم خفية. ما تراه هو ما تدفعه.",
  "one_time": "دفعة واحدة",
  "based_req": "حسب المتطلبات",
  "popular": "الأكثر طلبًا",
  "get_started": "ابدأ الآن",
  "lets_talk": "لنتحدث",
  "f_landing": "صفحة هبوط (صفحة واحدة)",
  "f_mobile": "متوافق مع الجوال",
  "f_contact": "قسم التواصل",
  "f_tg": "ربط تيليجرام",
  "f_3day": "تسليم خلال 3 أيام",
  "f_support": "دعم مجاني",
  "f_multi": "موقع متعدد الصفحات",
  "f_custom": "تصميم وهوية مخصصة",
  "f_reg": "نموذج تسجيل",
  "f_tgphone": "ربط تيليجرام والهاتف",
  "f_cms": "CMS (محتوى قابل للتعديل)",
  "f_5day": "تسليم خلال 5 أيام",
  "f_forever": "دعم مجاني دائم",
  "f_everything": "كل مزايا Professional",
  "f_adv": "حركات متقدمة",
  "f_backend": "تكامل الخلفية البرمجية",
  "f_domain": "مساعدة في إعداد النطاق",
  "f_priority": "تسليم بأولوية",
  "f_lifetime": "دعم مجاني مدى الحياة",
  "f_everything_custom": "كل مزايا Custom",
  "f_platform": "منصة ويب متكاملة",
  "f_panels": "لوحات إدارة متعددة الأدوار",
  "f_dbapi": "قاعدة بيانات ومصادقة وAPI",
  "f_deploy": "النشر والتدريب",
  "msg_tg": "راسلني على تيليجرام",
  "phone_label": "الهاتف",
  "loc_city": "طشقند، أوزبكستان",
  "form_name": "اسمك",
  "form_name_ph": "مثال: أحمد محمد",
  "form_email": "البريد الإلكتروني",
  "form_email_ph": "you@example.com",
  "form_msg": "الرسالة",
  "form_msg_ph": "حدّثني عن مشروعك...",
  "form_send": "إرسال الرسالة",
  "form_sending": "جارٍ الإرسال...",
  "form_ok": "تم إرسال الرسالة — سأرد قريبًا.",
  "form_err": "حدث خطأ ما. حاول مرة أخرى أو راسلني على تيليجرام.",
  "form_invalid": "يرجى مراجعة الحقول المحددة.",
  "skip": "انتقل إلى المحتوى",
  "nav_work": "الأعمال",
  "nav_ai": "AI",
  "nav_about": "عنّي",
  "nav_contact": "تواصل",
  "nav_pricing": "الأسعار",
  "hero_eyebrow": "UzLeeder · عصر الذكاء الاصطناعي / 2026",
  "hero_title": "هندسة منتجات <em>لعصر الذكاء الاصطناعي.</em>",
  "hero_desc": "أنا Max — مهندس أوامر ومطوّر يعمل بمساعدة الذكاء الاصطناعي. أبني من خلال UzLeeder منتجات رقمية حقيقية وأنظمة ذكاء اصطناعي ومنصات تعليمية وتجارب ويب حديثة.",
  "btn_work": "شاهد الأعمال",
  "btn_about": "عن UzLeeder",
  "btn_contact": "تواصل",
  "hf_based": "المقر",
  "hf_city": "طشقند، أوزبكستان",
  "hf_shipped": "تم التسليم",
  "hf_products": "منتجان قيد التشغيل",
  "hf_focus": "التركيز",
  "hf_focus_v": "أنظمة AI · منتجات ويب",
  "sc_now": "يُعرض الآن",
  "cs_open": "عرض دراسة الحالة",
  "v_play": "تشغيل الفيديو",
  "v_pause": "إيقاف الفيديو",
  "work_kicker": "أعمال مختارة",
  "work_title": "منتجات حقيقية. هندسة حقيقية.",
  "port_sub": "كل مشروع هنا برنامج مُسلَّم يعمل فعلًا — وهو الدليل على كل ما في هذه الصفحة.",
  "certified": "معتمد من UzLeeder",
  "m_category": "الفئة",
  "m_role": "الدور",
  "m_tech": "التقنيات",
  "m_value": "قيمة المشروع",
  "m_why": "لماذا يهم",
  "w1_lead": "منصة تعليمية متكاملة لأكاديمية رياضيات حقيقية — لوحات للطالب والمعلم والمدير خلف مصادقة حسب الأدوار، مع قبول إلكتروني وحضور ومدفوعات ودرجات وواجبات.",
  "w1_cat": "منصة تعليمية",
  "w1_role": "متكامل: المنتج، الواجهة، API، قاعدة البيانات",
  "w1_why": "نظام واحد يدير القبول والتدريس والمدفوعات للأكاديمية كلها — ويمنح الطلاب 5,653 تمرينًا بتصحيح تلقائي في 31 موضوعًا من كتاب DTM.",
  "w2_lead": "بوابة حجز B2B جاهزة للنشر لموحّدي خدمات السفر. ترسل الوكالات طلباتها من مساحات خاصة؛ ويسعّر الفريق كل طلب وفق قواعد الخصم، ويسجّل رقم PNR لشركة الطيران، ويرسل فاتورة PDF بعلامته تلقائيًا.",
  "w2_cat": "B2B SaaS · سفر",
  "w2_role": "المؤلف الوحيد: المنتج، الخلفية، الأمان، الواجهة",
  "w2_why": "منصة SaaS متعددة الشركات بصلاحيات حسب الأدوار و2FA وسجل تدقيق كامل — إضافة إلى قارئ GDS يتعرف على أكثر من 1,100 شركة طيران من نص PNR الخام.",
  "next_k": "03 — التالي",
  "next_t": "قد يكون منتجك دراسة الحالة القادمة.",
  "build_kicker": "ماذا أبني",
  "build_title": "أنظمة، لا مجرد شاشات.",
  "b1_t": "أنظمة الذكاء الاصطناعي",
  "b1_d": "تطبيقات RAG ومساعدون قائمون على المعرفة وسير عمل AI وخطوط معالجة بوكلاء.",
  "b2_t": "منتجات بمساعدة AI",
  "b2_d": "تطبيقات حديثة مبنية بمشاركة AI — تكرار أسرع بنفس الانضباط الهندسي.",
  "b3_t": "تطبيقات الويب",
  "b3_d": "مواقع ومنصات جاهزة للتشغيل الفعلي بمصادقة وقواعد بيانات ولوحات إدارة.",
  "b4_t": "أنظمة التعلّم",
  "b4_d": "منصات تعليمية وأنظمة تعلّم شخصية — مثل منصة Shokirov Math Academy.",
  "b5_t": "الأتمتة",
  "b5_d": "سير عمل متعدد الخطوات وروبوتات تيليجرام وتكاملات ترفع العمل المتكرر عن الناس.",
  "b6_t": "منتجات رقمية",
  "b6_d": "من الفكرة إلى النشر: تفكير المنتج، التصميم، البناء والإطلاق.",
  "ai_kicker": "هندسة الذكاء الاصطناعي",
  "ai_title": "الذكاء الاصطناعي ليس زينة. إنه جزء من الهندسة.",
  "ai_sub": "كيف أعمل فعلًا مع النماذج — الأساليب التي تقف خلف المنتجات.",
  "pipe_title": "كيف تتحول الفكرة إلى منتج",
  "p1": "فكرة",
  "p1d": "مشكلة حقيقية",
  "p2": "الأمر",
  "p2d": "تعليمات وقيود",
  "p3": "النموذج",
  "p3d": "النموذج المناسب لكل خطوة",
  "p4": "المنطق",
  "p4d": "كود، قواعد، بيانات",
  "p5": "النظام",
  "p5d": "APIs، قواعد بيانات، مصادقة",
  "p6": "المنتج",
  "p6d": "برنامج مُسلَّم",
  "p7": "المستخدم",
  "p7d": "يستخدمه أناس حقيقيون",
  "ai1_t": "هندسة الأوامر",
  "ai1_d": "تصميم تعليمات على مستوى النظام وقيود وسلوك وبنية مخرجات لتطبيقات ذكاء اصطناعي موثوقة.",
  "ai2_t": "تصميم أوامر النظام",
  "ai2_d": "تحديد الدور والقواعد والنبرة وسلوك الفشل ليتصرف النموذج بثبات داخل المنتج.",
  "ai3_t": "RAG",
  "ai3_d": "ربط النماذج بمصادر معرفة مضبوطة لتستند الإجابات إلى معلومات ذات صلة.",
  "ai4_t": "إجابات مقيدة بقاعدة المعرفة",
  "ai4_d": "إبقاء الإجابات ضمن قاعدة معرفة معتمدة — وقول «لا أعرف» حين يصمت المصدر.",
  "ai5_t": "تنسيق سير عمل الذكاء الاصطناعي",
  "ai5_d": "ربط الخطوات — استرجاع، استدلال، توليد، تحقق — لتنجز عدة قدرات مهمة واحدة أكبر.",
  "ai6_t": "التطوير بمساعدة AI",
  "ai6_d": "بناء البرمجيات باستخدام Claude Code وCursor وأدوات مشابهة، مع بقاء المعمارية والمراجعة والاختبار بيد الإنسان.",
  "ai7_t": "سير عمل متعدد النماذج",
  "ai7_d": "اختيار النموذج المناسب لكل خطوة — استدلال، كتابة، رؤية، صوت — بدل تحميل نموذج واحد كل شيء.",
  "ai8_t": "خطوط إنتاج المحتوى",
  "ai8_d": "خطوط قابلة للتكرار للنص والصورة والفيديو والصوت بأدوات مثل Midjourney وRunway وKling وElevenLabs.",
  "ai9_t": "الأتمتة الذكية",
  "ai9_d": "n8n وZapier وكود مخصص يتيح للذكاء الاصطناعي العمل على أدوات حقيقية — نماذج ورسائل وجداول وAPIs.",
  "brand_title": "علامة تقنية ومنتجات رقمية تضع الذكاء الاصطناعي أولًا.",
  "brand_lead": "UzLeeder علامة أسسها Max لبناء منتجات وأنظمة بهندسة برمجيات حديثة وذكاء اصطناعي — للقادة الذين يريدون أدوات تعمل، لا زينة.",
  "brand_what": "ماذا نبني",
  "bw1": "أنظمة AI",
  "bw2": "منتجات ويب",
  "bw3": "منصات تعليمية",
  "bw4": "الأتمتة",
  "bw5": "تجارب رقمية",
  "brand_vision": "الرؤية",
  "v1": "البداية من أوزبكستان.",
  "v2": "البناء في أرجاء آسيا الوسطى.",
  "v3": "التوسع عالميًا.",
  "emblem_cap": "الشعار الرسمي",
  "max_kicker": "المؤسس",
  "max_roles": "مهندس أوامر · مطوّر بمساعدة AI · مؤسس UzLeeder",
  "max_quote": "«لا أريد مجرد استخدام أدوات الذكاء الاصطناعي. أنا أبني منتجات حولها.»",
  "about_p1": "أنا Max (مهر الدين عبد العليم)، مؤسس UzLeeder، أعيش في طشقند، أوزبكستان. أفكر بعقلية المهندس: أفهم المشكلة أولًا، ثم أصمم النظام، ثم أستخدم الذكاء الاصطناعي لأتحرك أسرع دون التفريط في الجودة.",
  "about_p2": "عملي حيث يلتقي بناء المنتجات بسير عمل الذكاء الاصطناعي — منصات متكاملة وأتمتة وتطوير بمساعدة AI. أتعلم بالتسليم: كل مشروع تجربة تنتهي ببرنامج يعمل.",
  "about_p3": "حاصل على شهادة في هندسة الأوامر من برنامج «خمسة ملايين قائد في الذكاء الاصطناعي» وفي الذكاء الاصطناعي التوليدي من Google Cloud — وأواصل التعلم مع كل مشروع.",
  "pr1": "عقلية هندسية",
  "pr1d": "النظام أولًا، ثم الشاشات.",
  "pr2": "بناء المنتجات",
  "pr2d": "المُسلَّم أفضل من المثالي.",
  "pr3": "سير عمل AI",
  "pr3d": "النماذج أدوات لا سحر.",
  "pr4": "التجريب",
  "pr4d": "اختبر، قِس، كرّر.",
  "photo_role": "المؤسس · UzLeeder",
  "soon": "قريبًا",
  "stack_kicker": "التقنيات",
  "stack_title": "مصنّفة حسب الغرض.",
  "stack_sub": "فقط ما أستخدمه في العمل الفعلي — لا شيء مُدرج لمجرد شهرته.",
  "st_ai": "AI والنماذج",
  "st_lang": "اللغات",
  "st_fb": "الواجهة والخلفية",
  "st_data": "البيانات والأمان",
  "st_deploy": "النشر",
  "st_auto": "الأتمتة",
  "st_media": "AI إبداعي وتصميم",
  "st_work": "بيئة العمل",
  "proof_kicker": "الأدلة",
  "proof_title": "أرقام يمكن التحقق منها.",
  "pf1": "منتجات مُسلَّمة — واحد قيد التشغيل وآخر جاهز للنشر",
  "pf2": "تمرينًا بتصحيح تلقائي في Shokirov Math Academy",
  "pf3": "موضوعًا من كتاب DTM للتحضير للامتحان",
  "pf4": "شركة طيران يتعرف عليها قارئ GDS في MarketHub",
  "pf5": "شهادات موثّقة، منها Google Cloud",
  "certs_kicker": "الشهادات",
  "certs_title": "تعلّم موثّق.",
  "certs_sub": "دورات وبرامج أكملتها — كل منها مرتبط بصفحة التحقق الرسمية.",
  "doc_title": "الوثيقة الرسمية للخدمات والأسعار",
  "price_kicker": "الخدمات والأسعار",
  "price_title": "نطاق واضح. أسعار شفافة.",
  "contact_title": "لنبنِ شيئًا معًا.",
  "contact_sub": "أخبرني بما تبنيه. أرد بسرعة — عادةً في اليوم نفسه، عبر البريد أو تيليجرام.",
  "copy": "نسخ",
  "copied": "تم النسخ",
  "copy_fail": "تعذّر النسخ — حدّد العنوان يدويًا.",
  "err_name": "يرجى إدخال اسمك.",
  "err_email": "يرجى إدخال بريد إلكتروني صحيح.",
  "err_msg": "يرجى كتابة رسالة قصيرة.",
  "foot_line": "تقنية عصر الذكاء الاصطناعي. منتجات حقيقية. هندسة حقيقية.",
  "cs_overview": "نظرة عامة",
  "cs_challenge": "التحدي",
  "cs_solution": "الحل",
  "cs_tech": "التقنيات",
  "cs_role": "دوري",
  "cs_result": "النتيجة",
  "cs_media": "الوسائط",
  "cs_arch": "المعمارية",
  "cs_close": "إغلاق دراسة الحالة",
  "cs_label": "دراسة حالة",
  "roles": [
   "مهندس أوامر",
   "مطوّر بمساعدة AI",
   "باني أنظمة AI",
   "مؤسس UzLeeder"
  ],
  "ai_tools_label": "الأدوات التي أستخدمها هنا",
  "tx_1_claude": "أوامر نظام طويلة ومنظمة",
  "tx_1_chatgpt": "تجربة الأوامر وتحسينها بسرعة",
  "tx_1_gemini": "مقارنة مخرجات النماذج",
  "tx_2_claude": "الأدوار والقواعد والنبرة للمساعدين",
  "tx_2_chatgpt": "ضبط سلوك المساعد",
  "tx_2_gemini": "التحقق من الثبات بين النماذج",
  "tx_3_notebooklm": "إجابات مستندة إلى مستنداتي",
  "tx_3_perplexity": "بحث موثّق بالمصادر",
  "tx_3_claude": "الاستدلال على السياق المقدَّم",
  "tx_4_notebooklm": "إجابات من المصادر المرفوعة فقط",
  "tx_4_claude": "قواعد «أجب من السياق فقط»",
  "tx_4_chatgpt": "ملفات معرفة بتعليمات صارمة",
  "tx_5_n8n": "سير عمل AI متعدد الخطوات",
  "tx_5_zapier": "ربط التطبيقات بخطوات AI",
  "tx_5_claude": "خطوة الاستدلال داخل التدفق",
  "tx_6_claudecode": "مهام برمجة كبيرة من الطرفية",
  "tx_6_cursor": "برمجة ثنائية مع AI داخل المحرر",
  "tx_6_replit": "بناء ونشر سريع في المتصفح",
  "tx_6_lovable": "من الفكرة إلى نموذج أولي يعمل",
  "tx_7_claude": "الاستدلال والمستندات الطويلة",
  "tx_7_chatgpt": "الكتابة والعصف الذهني",
  "tx_7_gemini": "بحث وتحليل سريع",
  "tx_7_perplexity": "بحث مباشر على الويب مع المصادر",
  "tx_8_midjourney": "صور وفن تصوّري",
  "tx_8_runway": "تحرير الفيديو وتوليده بالذكاء الاصطناعي",
  "tx_8_kling": "مقاطع سينمائية من نص أو صورة",
  "tx_8_elevenlabs": "تعليق صوتي طبيعي",
  "tx_8_heygen": "فيديوهات بشخصيات AI",
  "tx_9_n8n": "أتمتة بعُقد AI",
  "tx_9_zapier": "أتمتة التطبيقات بدون كود",
  "tx_9_openclaw": "مساعد AI شخصي لمهام حقيقية",
  "nav_team": "الفريق",
  "team_kicker": "الفريق",
  "team_title": "فريق Max.",
  "team_sub": "مؤسس بشري واحد. فريق من الذكاء الاصطناعي لكل نموذج فيه مهمة — ولا أحد يأخذ يوم إجازة.",
  "team_count": "إنسان واحد · 12 زميلًا من AI",
  "team_human": "إنسان",
  "team_ai": "AI",
  "team_online": "متصل",
  "team_note": "تصف الأدوار كيف يستخدم Max كل أداة فعلًا. القرارات النهائية — ومسؤولية كل إصدار — تبقى بيد الإنسان.",
  "tm_max_r": "المؤسس · الرئيس التنفيذي · كبير المطورين",
  "tm_max_d": "يحدد الاتجاه ويصمم الأنظمة ويتخذ القرار النهائي — ويتحمل مسؤولية كل إصدار.",
  "tm_claude_r": "شريك مؤسس · كبير المعماريين",
  "tm_claude_d": "يفكر في الأنظمة معي، ويناقش الخطط، ويكتب الكود الثقيل.",
  "tm_claudecode_r": "مهندس أول",
  "tm_claudecode_d": "ينجز مهام البرمجة الكبيرة مباشرة من الطرفية.",
  "tm_codex_r": "مهندس برمجيات",
  "tm_codex_d": "يد ثانية في الكود — إعادة هيكلة واختبارات ومراجعات.",
  "tm_chatgpt_r": "كاتب ومستشار",
  "tm_chatgpt_d": "يكتب مسودات النصوص والرسائل والأفكار — ويقدّم رأيًا ثانيًا.",
  "tm_gemini_r": "محلل أبحاث",
  "tm_gemini_d": "يبحث ويلخّص ويحلّل المعلومات بسرعة.",
  "tm_perplexity_r": "مدقق حقائق",
  "tm_perplexity_d": "يتحقق من الادعاءات بمصادر حية وموثّقة.",
  "tm_cursor_r": "مبرمج ثنائي",
  "tm_cursor_d": "يكتب الكود بجانبي داخل المحرر.",
  "tm_higgsfield_r": "مدير إبداعي · فيديو",
  "tm_higgsfield_d": "حركات كاميرا سينمائية ومؤثرات فيديو بالذكاء الاصطناعي.",
  "tm_midjourney_r": "مصمم بصري",
  "tm_midjourney_d": "فن تصوّري ومرئيات وصور للعلامة.",
  "tm_elevenlabs_r": "فنان صوت",
  "tm_elevenlabs_d": "تعليق صوتي طبيعي بأي لغة.",
  "tm_notebooklm_r": "أمين المعرفة",
  "tm_notebooklm_d": "يحوّل المستندات إلى ملاحظات وملخصات صوتية.",
  "tm_n8n_r": "مدير العمليات",
  "tm_n8n_d": "يدير الأتمتة التي تربط كل شيء ببعضه.",
  "cases": {
   "shokirov": {
    "cat": "منصة تعليمية · مباشر",
    "lead": "منصة تعليمية متكاملة بُنيت لأكاديمية رياضيات حقيقية — أكثر بكثير من صفحة هبوط.",
    "overview": "تعمل Shokirov Math Academy على منصة بثلاث لوحات حسب الأدوار — الطالب والمعلم والمدير. تغطي المنصة دورة الأكاديمية كاملة: الطلبات الإلكترونية والتسجيل والحضور والمدفوعات والدرجات والملاحظات والواجبات، إضافة إلى جزء تعليمي للتحضير لامتحان DTM.",
    "challenge": "احتاجت الأكاديمية إلى نظام واحد للقبول والتدريس والمدفوعات عبر ثلاثة أدوار — وإلى تدريب منظّم ذاتي التصحيح للطلاب، لا مجرد موقع يعرض الدورات.",
    "solution": "يتقدم الطلاب إلكترونيًا؛ يراجع المعلم الطلبات ويسجّلهم، ثم يدير الحضور والمدفوعات والدرجات والملاحظات والواجبات، بينما يشرف المدير على مدفوعات الأكاديمية كلها. يتدرب الطلاب على 31 موضوعًا من كتاب DTM عبر 5,653 تمرينًا بتصحيح تلقائي، ويتنافسون في نظام تصنيف، ويستخدمون لغتي UZ/EN والوضعين الداكن والفاتح.",
    "role": "تنفيذ كامل من UzLeeder: تخطيط المنتج، الواجهة، واجهة React الأمامية، API بـ Node.js + Express، تصميم قاعدة البيانات والنشر.",
    "result": "يعمل فعليًا على shokirov-academy.vercel.app، وتم تسليمه بموجب عقد إتمام مشروع موقّع.",
    "arch": [
     [
      "المستخدمون",
      "الطلاب · المعلمون · المدير"
     ],
     [
      "تطبيق الويب",
      "واجهة React · UZ/EN · داكن/فاتح"
     ],
     [
      "منطق التطبيق",
      "API بلا خادم بـ Node.js + Express على Vercel"
     ],
     [
      "المصادقة والأدوار",
      "صلاحيات حسب الأدوار عبر JWT"
     ],
     [
      "قاعدة البيانات",
      "PostgreSQL على Neon"
     ],
     [
      "المخرجات",
      "لوحات · تصحيح تلقائي · تصنيف · سجل المدفوعات"
     ]
    ]
   },
   "markethub": {
    "cat": "B2B SaaS · سفر · للبيع",
    "lead": "بوابة حجز B2B متكاملة وجاهزة للنشر لموحّدي خدمات السفر ومكاتب إصدار التذاكر.",
    "overview": "تمنح MarketHub الوكالات الشريكة مساحة خاصة لإرسال طلبات الحجز، بينما يسعّر فريق الموحِّد كل طلب ويؤكده ويصدر فاتورته. إنها منصة SaaS متعددة الشركات بصلاحيات حسب الأدوار للمشرف العام والمشرف والمشغّل والوكالة.",
    "challenge": "يتلقى الموحِّدون طلبات من وكالات كثيرة. يجب تسعير كل طلب وفق قواعد الخصم، وربطه برقم PNR لشركة الطيران، وإصدار فاتورته — بأمان، ولكل شركة على حدة، وبسجل تدقيق واضح.",
    "solution": "ترسل الوكالات طلباتها؛ ويسعّر المشغلون كل طلب وفق قواعد خصم الموحِّد، ويسجلون رقم PNR، ويرسلون فاتورة PDF بالعلامة تلقائيًا. يتعرف قارئ مسارات GDS على أكثر من 1,100 شركة طيران من نص PNR الخام. تتضمن المنصة 2FA وسجل تدقيق كاملًا وتحليلات وجردًا للحسابات. بالدعوة فقط وخاصة بالتصميم.",
    "role": "المؤلف والمطوّر الوحيد، كما تؤكد شهادة منتج UzLeeder: تصميم المنتج، خلفية Python/Flask، نموذج البيانات، الأمان والواجهة.",
    "result": "مكتمل وجاهز للنشر. التأليف والملكية معتمدان من UzLeeder؛ والمنتج متاح للبيع أو الترخيص.",
    "arch": [
     [
      "المستخدمون",
      "الوكالات الشريكة · المشغلون · المشرفون"
     ],
     [
      "تطبيق الويب",
      "بوابة بالدعوة مع مساحات خاصة للوكالات"
     ],
     [
      "منطق التطبيق",
      "Python + Flask — قواعد التسعير وتدفق الطلبات"
     ],
     [
      "الأمان",
      "الأدوار · 2FA · سجل تدقيق كامل"
     ],
     [
      "البيانات",
      "SQLite · متعدد الشركات"
     ],
     [
      "الخدمات",
      "قارئ مسارات GDS · مولّد فواتير PDF"
     ],
     [
      "المخرجات",
      "طلب مسعّر + فاتورة PDF بالعلامة"
     ]
    ]
   }
  }
 }
};

const LABELS = { en: "EN", uz: "UZ", fa: "FA", ar: "AR" };
const RTL = { fa: true, ar: true };
const LANG_KEY = "uzleeder_lang";
const THEME_KEY = "uzleeder_theme";
const THEME_COLORS = { dark: "#07090d", light: "#f6f7f9" };
const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const root = document.documentElement;
let curLang = "en";
const t = k => {
  const d = i18n[curLang] || {};
  return d[k] != null ? d[k] : (i18n.en[k] != null ? i18n.en[k] : "");
};
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
// Uzbek groups digits with spaces; the other languages use 1,234 (Western digits, as in the rest of the page)
const fmt = n => n.toLocaleString(curLang === "uz" ? "ru-RU" : "en-US");

/* ===== Intro (every load): <UzLeeder> + <For leaders> typed → brackets become the Λ mark → loading ===== */
const intro = $("#intro");
if (intro) {
  if (reduceMotion) intro.remove();
  else runIntro(intro);
}
function runIntro(el) {
  const fill = $("#introFill", el), pct = $("#introPct", el);
  const timers = [];
  const at = (ms, fn) => timers.push(setTimeout(fn, ms));
  let loaded = document.readyState === "complete", done = false, progress = 0, raf = 0;
  window.addEventListener("load", () => { loaded = true; }, { once: true });
  root.style.overflow = "hidden";                                  // no scrolling behind the intro

  const setP = p => { progress = p; fill.style.width = p + "%"; pct.textContent = Math.round(p) + "%"; };
  function finish() {
    if (done) return;
    done = true;
    timers.forEach(clearTimeout); cancelAnimationFrame(raf);
    setP(100);
    el.classList.add("out");
    root.style.overflow = "";
    setTimeout(() => el.remove(), 520);
  }
  el.addEventListener("click", finish);                            // click / any key skips the intro
  document.addEventListener("keydown", finish, { once: true });

  // bracket size in the text line: the sideways Λ (100px wide once upright) is as tall as its slot
  const s0 = +($(".ib-l", el).getBoundingClientRect().height / 100).toFixed(3) || .55;
  el.style.setProperty("--s0", s0);
  el.classList.add("play");
  at(2150, () => {
    // "<" folds into the outer Λ, ">" into the inner Λ (outer ×0.5, 9.5/44 of the mark lower),
    // each travelling from its slot in the text to the centre of the 100×92 mark
    const m = $(".intro-mark", el).getBoundingClientRect(), cx = m.left + m.width / 2, cy = m.top + m.height / 2;
    const innerDrop = 9.5 / 44 * 92;
    [["ib-l", -90, 1, 0], ["ib-r", 90, .5, innerDrop]].forEach(([cls, rot, scale, drop]) => {
      const slot = $("." + cls, el), r = slot.getBoundingClientRect();
      const dx = cx - (r.left + r.width / 2), dy = cy - (r.top + r.height / 2) + drop;
      $("svg", slot).animate([
        { transform: "translate(0px,0px) rotate(" + rot + "deg) scale(" + s0 + ")" },
        { transform: "translate(" + dx + "px," + dy + "px) rotate(0deg) scale(" + scale + ")" }
      ], { duration: 650, easing: "cubic-bezier(.2,.7,.2,1)", fill: "forwards" });
    });
    el.classList.add("merge");
  });
  at(2800, () => el.classList.add("logo"));
  at(3050, () => {
    el.classList.add("load");
    const t0 = performance.now();
    // runs up to 90% on its own; the last 10% waits for the real page load
    (function tick(now) {
      const goal = loaded ? 100 : 90;
      setP(Math.min(goal, progress + Math.max(.5, (goal - progress) * .07)));
      if (progress >= 100 && now - t0 > 700) { timers.push(setTimeout(finish, 220)); return; }
      raf = requestAnimationFrame(tick);
    })(t0);
  });
  at(9000, finish);                                                // never hold the page longer than this
}

/* ===== Language ===== */
function applyLang(lang) {
  if (!i18n[lang]) lang = "en";
  curLang = lang;
  const dict = i18n[lang];
  $$("[data-i18n]").forEach(el => {
    const v = dict[el.getAttribute("data-i18n")];
    if (v != null) el.innerHTML = v;
  });
  $$("[data-i18n-ph]").forEach(el => {
    const v = dict[el.getAttribute("data-i18n-ph")];
    if (v != null) el.setAttribute("placeholder", v);
  });
  $("#langLabel").textContent = LABELS[lang];
  root.lang = lang;
  root.dir = RTL[lang] ? "rtl" : "ltr";
  $$(".lang-opt").forEach(o => {
    const on = o.dataset.lang === lang;
    o.classList.toggle("active", on);
    o.setAttribute("aria-checked", on ? "true" : "false");
  });
  try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
  syncHeroButton();
  refreshCounts();
  if (window.__cmsProjects) translateProjects();
  if (openCaseId) renderCase(openCaseId);
  restartTyping();
}

const langWrap = $("#langWrap");
const langBtn = $("#langBtn");
function setLangMenu(open) {
  langWrap.classList.toggle("open", open);
  langBtn.setAttribute("aria-expanded", open ? "true" : "false");
}
langBtn.addEventListener("click", e => { e.stopPropagation(); setLangMenu(!langWrap.classList.contains("open")); });
$$(".lang-opt").forEach(o => o.addEventListener("click", () => { applyLang(o.dataset.lang); setLangMenu(false); langBtn.focus(); }));
document.addEventListener("click", () => setLangMenu(false));
langWrap.addEventListener("keydown", e => { if (e.key === "Escape") { setLangMenu(false); langBtn.focus(); } });

/* ===== Typed role line ===== */
const typedEl = $("#typed");
let typeTimer = null, rIdx = 0, cIdx = 0, deleting = false;
function typeLoop() {
  const roles = t("roles");
  if (!Array.isArray(roles) || !roles.length) return;
  const word = roles[rIdx % roles.length];
  if (!deleting) {
    typedEl.textContent = word.slice(0, ++cIdx);
    if (cIdx >= word.length) { deleting = true; typeTimer = setTimeout(typeLoop, 1800); return; }
  } else {
    typedEl.textContent = word.slice(0, --cIdx);
    if (cIdx <= 0) { deleting = false; rIdx = (rIdx + 1) % roles.length; }
  }
  typeTimer = setTimeout(typeLoop, deleting ? 40 : 80);
}
function restartTyping() {
  clearTimeout(typeTimer);
  const roles = t("roles");
  if (reduceMotion) { typedEl.textContent = Array.isArray(roles) ? roles.join(" · ") : ""; return; }
  rIdx = 0; cIdx = 0; deleting = false; typedEl.textContent = "";
  typeLoop();
}

/* ===== Theme ===== */
let theme = root.getAttribute("data-theme") || "dark";
function applyTheme(next) {
  theme = next === "light" ? "light" : "dark";
  root.setAttribute("data-theme", theme);
  const meta = $("#themeColor");
  if (meta) meta.setAttribute("content", THEME_COLORS[theme]);
  // project screenshots that exist in both themes
  $$("[data-dark][data-light]").forEach(img => {
    const src = img.getAttribute("data-" + theme);
    if (src && img.getAttribute("src") !== src) img.setAttribute("src", src);
  });
  try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
}
$("#themeToggle").addEventListener("click", () => applyTheme(theme === "dark" ? "light" : "dark"));

/* ===== Navigation: scrolled state, progress, mobile menu, active link ===== */
const nav = $("#navbar");
const progress = $("#progress");
let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const y = window.scrollY;
    nav.classList.toggle("scrolled", y > 24);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = "scaleX(" + (max > 0 ? Math.min(1, y / max) : 0) + ")";
    ticking = false;
  });
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const menuBtn = $("#menuBtn");
const navMenu = $("#navMenu");
function setMenu(open) {
  navMenu.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  document.body.style.overflow = open ? "hidden" : "";
}
menuBtn.addEventListener("click", () => setMenu(!navMenu.classList.contains("open")));
$$("a", navMenu).forEach(a => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", e => { if (e.key === "Escape" && navMenu.classList.contains("open")) { setMenu(false); menuBtn.focus(); } });
window.addEventListener("resize", () => { if (window.innerWidth > 900 && navMenu.classList.contains("open")) setMenu(false); });

const navMap = { work: "work", build: "work", ai: "ai", uzleeder: "uzleeder", about: "about", team: "team", contact: "contact" };
const navLinks = $$("a", navMenu);
const activeIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const id = navMap[e.target.id];
    navLinks.forEach(a => a.classList.toggle("active", !!id && a.getAttribute("href") === "#" + id));
  });
}, { rootMargin: "-45% 0px -50% 0px" });
$$("main > section[id]").forEach(s => activeIO.observe(s));

/* ===== Reveal on scroll (staggered within each group) ===== */
const revealIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("show");
    revealIO.unobserve(e.target);
    if (e.target.id === "pipeline") startPipeline();
    if (e.target.matches(".proof li")) countUp(e.target.querySelector("[data-count]"));
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
function observeReveal(scope) {
  $$(".reveal", scope).forEach(el => {
    const sibs = Array.from(el.parentElement.children).filter(c => c.classList.contains("reveal"));
    el.style.transitionDelay = (Math.max(0, sibs.indexOf(el)) % 6) * 0.07 + "s";
    revealIO.observe(el);
  });
}
observeReveal(document);

/* ===== AI pipeline: step highlight ===== */
let pipeTimer = null;
function startPipeline() {
  const steps = $$("#pipeline .pipe li");
  if (!steps.length || pipeTimer) return;
  if (reduceMotion) { steps.forEach(s => s.classList.add("on")); return; }
  let i = 0;
  pipeTimer = setInterval(() => {
    steps.forEach((s, j) => s.classList.toggle("on", j <= i));
    i = (i + 1) % (steps.length + 2);   // hold the full chain briefly, then restart
  }, 650);
}

/* ===== Proof: count-up ===== */
function countUp(el) {
  if (!el || el.dataset.done) return;
  el.dataset.done = "1";
  const target = +el.dataset.count, suffix = el.dataset.suffix || "";
  if (reduceMotion) { el.textContent = fmt(target) + suffix; return; }
  const start = performance.now(), dur = 1200;
  (function step(now) {
    const p = Math.min(1, (now - start) / dur), eased = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(Math.round(target * eased)) + suffix;
    if (p < 1) requestAnimationFrame(step);
  })(start);
}
function refreshCounts() {
  $$("[data-count]").forEach(el => { if (el.dataset.done || !root.classList.contains("js")) el.textContent = fmt(+el.dataset.count) + (el.dataset.suffix || ""); });
}

/* ===== Hero video ===== */
const heroVideo = $("#heroVideo");
const heroPlay = $("#heroPlay");
const heroFill = $("#heroFill");
let heroWanted = !reduceMotion;          // user intent; off-screen pausing doesn't change it
function syncHeroButton() {
  if (!heroVideo) return;
  const playing = !heroVideo.paused;
  heroPlay.setAttribute("aria-pressed", playing ? "true" : "false");
  heroPlay.setAttribute("aria-label", playing ? t("v_pause") : t("v_play"));
}
if (heroVideo) {
  const tryPlay = () => { const p = heroVideo.play(); if (p && p.catch) p.catch(() => { heroWanted = false; syncHeroButton(); }); };
  heroVideo.addEventListener("play", syncHeroButton);
  heroVideo.addEventListener("pause", syncHeroButton);
  heroVideo.addEventListener("timeupdate", () => {
    if (heroVideo.duration) heroFill.style.width = (heroVideo.currentTime / heroVideo.duration * 100) + "%";
  });
  heroPlay.addEventListener("click", () => {
    heroWanted = heroVideo.paused;
    if (heroWanted) tryPlay(); else heroVideo.pause();
  });
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && heroWanted) tryPlay(); else if (!e.isIntersecting) heroVideo.pause();
  }, { threshold: 0.25 }).observe(heroVideo);
  syncHeroButton();
}

/* ===== Lazy project videos ===== */
const lazyVideoIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    const v = e.target;
    if (e.isIntersecting) {
      if (!v.src && v.dataset.src) { v.src = v.dataset.src; v.preload = "metadata"; }
      if (!reduceMotion) { const p = v.play(); if (p && p.catch) p.catch(() => {}); }
    } else v.pause();
  });
}, { rootMargin: "200px 0px", threshold: 0.2 });
$$("video.lazy-video").forEach(v => lazyVideoIO.observe(v));

/* ===== Case studies ===== */
const CASE_STATIC = {
  shokirov: {
    title: "Shokirov Math Academy",
    tech: ["React", "Node.js", "Express", "PostgreSQL (Neon)", "JWT", "Vercel"],
    hero: () => ({ type: "img", src: theme === "light" ? "projects/shokirov-academy-light.png" : "projects/shokirov-academy-dark.png", alt: "Shokirov Math Academy platform" }),
    gallery: [
      { type: "img", src: "projects/shokirov-academy-dark.png", alt: "Shokirov Math Academy — dark theme" },
      { type: "img", src: "projects/shokirov-academy-light.png", alt: "Shokirov Math Academy — light theme" }
    ],
    links: [
      { href: "https://shokirov-academy.vercel.app", key: "proj_view", primary: true, ext: true },
      { href: "contract-shokirov.html", key: "proj_contract", ext: true }
    ]
  },
  markethub: {
    title: "MarketHub — B2B Travel Portal",
    tech: ["Python", "Flask", "SQLite", "2FA", "Docker", "PDF invoicing", "Multi-tenant"],
    hero: () => ({ type: "video", src: "projects/markethub-cover.mp4", poster: "projects/markethub-cover.png", alt: "MarketHub product walkthrough" }),
    gallery: [
      { type: "img", src: "projects/markethub-cover.png", alt: "MarketHub — portal overview" }
    ],
    links: [
      { href: "https://t.me/uzleeder", key: "proj_buy", primary: true, ext: true },
      { href: "certificate-markethub.html", key: "proj_certificate", ext: true }
    ]
  }
};
const caseDialog = $("#caseDialog");
const caseBody = $("#caseBody");
let openCaseId = null, caseOpener = null;

function mediaHTML(m, autoplay) {
  if (m.type === "video") {
    return '<video src="' + esc(m.src) + '" poster="' + esc(m.poster) + '" muted loop playsinline controls preload="metadata"' +
      (autoplay && !reduceMotion ? " autoplay" : "") + ' aria-label="' + esc(m.alt) + '"></video>';
  }
  return '<img src="' + esc(m.src) + '" alt="' + esc(m.alt) + '" loading="lazy" decoding="async"/>';
}
function renderCase(id) {
  const s = CASE_STATIC[id], c = (t("cases") || {})[id];
  if (!s || !c) return;
  const sec = (n, key, inner) => '<section class="case-sec"><h3><span>' + n + "</span>" + esc(t(key)) + "</h3><div>" + inner + "</div></section>";
  const arch = '<div class="arch">' + c.arch.map((row, i) =>
    (i ? '<span class="arch-arrow" aria-hidden="true"></span>' : "") +
    '<div class="arch-node"><b>' + esc(row[0]) + "</b><span>" + esc(row[1]) + "</span></div>").join("") + "</div>";
  const links = s.links.map(l => '<a class="' + (l.primary ? "btn btn-primary" : "btn btn-ghost") + '" href="' + esc(l.href) + '"' +
    (l.ext ? ' target="_blank" rel="noopener"' : "") + ">" + esc(t(l.key)) + '<svg class="ico" aria-hidden="true"><use href="#i-out"/></svg></a>').join("");
  caseBody.innerHTML =
    '<div class="case-top"><span>' + esc(t("cs_label")) + " · " + esc(c.cat) + '</span>' +
    '<button class="case-close" type="button" data-close aria-label="' + esc(t("cs_close")) + '"><svg class="ico" aria-hidden="true"><use href="#i-close"/></svg></button></div>' +
    '<header class="case-head"><span class="pill">' + esc(c.cat) + '</span><h2 id="caseTitle">' + esc(s.title) + "</h2><p>" + esc(c.lead) + "</p></header>" +
    '<div class="case-media">' + mediaHTML(s.hero(), true) + "</div>" +
    '<div class="case-sections">' +
      sec("01", "cs_overview", "<p>" + esc(c.overview) + "</p>") +
      sec("02", "cs_challenge", "<p>" + esc(c.challenge) + "</p>") +
      sec("03", "cs_solution", "<p>" + esc(c.solution) + "</p>") +
      sec("04", "cs_tech", "<ul>" + s.tech.map(x => "<li>" + esc(x) + "</li>").join("") + "</ul>") +
      sec("05", "cs_role", "<p>" + esc(c.role) + "</p>") +
      sec("06", "cs_result", "<p>" + esc(c.result) + "</p>") +
      sec("07", "cs_media", '<div class="case-gallery">' + s.gallery.map(m => mediaHTML(m, false)).join("") + "</div>") +
      sec("08", "cs_arch", arch) +
      '<div class="case-actions">' + links + "</div>" +
    "</div>";
}
function openCase(id, opener) {
  if (!CASE_STATIC[id] || !caseDialog.showModal) return;
  openCaseId = id; caseOpener = opener || document.activeElement;
  renderCase(id);
  if (heroVideo && !heroVideo.paused) heroVideo.pause();
  caseDialog.showModal();
  caseBody.scrollTop = 0;
  const close = $(".case-close", caseBody); if (close) close.focus();
  try { history.replaceState(null, "", "#case-" + id); } catch (e) {}
}
function closeDialogs(d) {
  if (d.open) d.close();
}
caseDialog.addEventListener("close", () => {
  $$("video", caseBody).forEach(v => v.pause());
  caseBody.innerHTML = "";
  openCaseId = null;
  try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {}
  if (heroVideo && heroWanted) { const p = heroVideo.play(); if (p && p.catch) p.catch(() => {}); }
  if (caseOpener && caseOpener.focus) caseOpener.focus();
});
document.addEventListener("click", e => {
  const b = e.target.closest("[data-open-case]");
  if (b) { e.preventDefault(); openCase(b.getAttribute("data-open-case"), b); }
});

/* ===== Certificate lightbox ===== */
const lightbox = $("#lightbox");
let lbOpener = null;
document.addEventListener("click", e => {
  const a = e.target.closest("[data-lightbox]");
  if (!a || !lightbox.showModal) return;
  e.preventDefault();
  lbOpener = a;
  const img = $("#lbImg");
  img.src = a.getAttribute("href");
  img.alt = a.dataset.title || "";
  $("#lbTitle").textContent = a.dataset.title || "";
  $("#lbMeta").textContent = a.dataset.meta || "";
  const v = $("#lbVerify");
  if (a.dataset.verify) { v.href = a.dataset.verify; v.hidden = false; } else v.hidden = true;
  lightbox.showModal();
  $(".lb-close", lightbox).focus();
});
lightbox.addEventListener("close", () => { if (lbOpener) lbOpener.focus(); });

// shared: close buttons + click on backdrop
[caseDialog, lightbox].forEach(d => {
  d.addEventListener("click", e => {
    if (e.target === d || e.target.closest("[data-close]")) closeDialogs(d);
  });
});

/* ===== Toast ===== */
function toast(message, type) {
  const wrap = $("#toastWrap");
  const el = document.createElement("div");
  el.className = "toast " + (type || "");
  el.innerHTML = '<svg class="ico" aria-hidden="true"><use href="' + (type === "err" ? "#i-alert" : "#i-check") + '"/></svg><span></span>';
  el.querySelector("span").textContent = message;
  wrap.appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));
  setTimeout(() => { el.classList.remove("show"); setTimeout(() => el.remove(), 350); }, 4200);
}

/* ===== Copy email ===== */
const copyBtn = $("#copyEmail");
if (copyBtn) {
  copyBtn.addEventListener("click", async () => {
    const text = copyBtn.dataset.copy;
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; }
    catch (e) {
      const ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { ok = document.execCommand("copy"); } catch (e2) {}
      ta.remove();
    }
    const label = $("[data-i18n]", copyBtn);
    if (ok) {
      copyBtn.classList.add("done"); label.textContent = t("copied");
      setTimeout(() => { copyBtn.classList.remove("done"); label.textContent = t("copy"); }, 2000);
    } else toast(t("copy_fail"), "err");
  });
}

/* ===== Contact form ===== */
const form = $("#contactForm");
const statusEl = $("#formStatus");
if (form) {
  const rules = {
    name: v => v.length > 0,
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    message: v => v.length > 0
  };
  const check = field => {
    const ok = rules[field.name](field.value.trim());
    field.closest(".field").classList.toggle("invalid", !ok);
    field.setAttribute("aria-invalid", ok ? "false" : "true");
    return ok;
  };
  $$("input, textarea", form).forEach(f => {
    f.addEventListener("blur", () => { if (f.value.trim()) check(f); });
    f.addEventListener("input", () => { if (f.closest(".field").classList.contains("invalid")) check(f); });
  });
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const fields = [form.elements.name, form.elements.email, form.elements.message];
    const bad = fields.filter(f => !check(f));
    statusEl.className = "form-status";
    if (bad.length) { statusEl.textContent = t("form_invalid"); statusEl.classList.add("err"); bad[0].focus(); return; }

    const btn = $(".form-submit", form);
    btn.classList.add("loading"); btn.disabled = true;
    statusEl.textContent = t("form_sending");
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fields[0].value.trim(), email: fields[1].value.trim(), message: fields[2].value.trim(), website: form.elements.website ? form.elements.website.value : "" })
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      statusEl.textContent = t("form_ok"); statusEl.classList.add("ok");
      toast(t("form_ok"), "ok");
      form.reset();
    } catch (err) {
      console.error("Contact form error:", err);  // details stay in the console, never in the UI
      statusEl.textContent = t("form_err"); statusEl.classList.add("err");
      toast(t("form_err"), "err");
    } finally {
      btn.classList.remove("loading"); btn.disabled = false;
    }
  });
}

/* ===== Admin CMS: remote text overrides + dynamic projects ===== */
const CMS_TAGS = { live: { cls: "pill-live", key: "tag_live" }, sale: { cls: "pill-sale", key: "tag_sale" }, soon: { cls: "", key: "tag_soon" } };
function translateProjects() {
  const list = window.__cmsProjects || [];
  $$("#workList [data-cmsproj]").forEach(card => {
    const p = list[+card.getAttribute("data-cmsproj")];
    if (!p) return;
    const pEl = $(".proj-p", card);
    if (pEl) pEl.textContent = (p.desc && (p.desc[curLang] || p.desc.en)) || "";
    const btn = $(".proj-btnlabel", card);
    if (btn) btn.textContent = t("proj_view") || "View";
  });
}
function renderProjects(list) {
  const wrap = $("#workList");
  if (!wrap) return;
  window.__cmsProjects = list;
  wrap.innerHTML = "";
  list.forEach((p, idx) => {
    const tag = CMS_TAGS[p.tag] || CMS_TAGS.live;
    const art = document.createElement("article");
    art.className = "work-item" + (idx % 2 ? " reverse" : "") + " reveal";
    art.setAttribute("data-cmsproj", idx);
    const num = String(idx + 1).padStart(2, "0");
    const media = p.image
      ? '<a class="media-frame" href="' + esc(p.link || "#") + '" target="_blank" rel="noopener"><img src="' + esc(p.image) + '" alt="' + esc((p.title || "") + " preview") + '" loading="lazy" decoding="async"/></a>'
      : '<div class="media-frame"><div class="media-empty"><svg viewBox="0 0 48 44" aria-hidden="true"><use href="#brand-mark"/></svg></div></div>';
    art.innerHTML =
      '<div class="work-media">' + media + '<span class="work-num" aria-hidden="true">' + num + "</span></div>" +
      '<div class="work-body"><div class="work-tags"><span class="pill ' + tag.cls + '" data-i18n="' + tag.key + '">' + esc(t(tag.key)) + "</span></div>" +
      '<h3 class="work-title"></h3><p class="proj-p"></p><div class="proj-tech"></div>' +
      (p.link ? '<div class="work-actions"><a class="btn btn-primary" href="' + esc(p.link) + '" target="_blank" rel="noopener"><span class="proj-btnlabel"></span><svg class="ico" aria-hidden="true"><use href="#i-out"/></svg></a></div>' : "") +
      "</div>";
    $(".work-title", art).textContent = p.title || "";
    const tech = $(".proj-tech", art);
    (p.tech || []).forEach(x => { const s = document.createElement("span"); s.textContent = x; tech.appendChild(s); });
    wrap.appendChild(art);
  });
  observeReveal(wrap);
}
async function loadRemoteContent() {
  try {
    const res = await fetch("/api/content", { cache: "no-store" });
    if (!res.ok) return;
    const content = await res.json();
    if (!content || typeof content !== "object") return;
    if (content.overrides) {
      Object.keys(LABELS).forEach(l => { if (content.overrides[l]) Object.assign(i18n[l], content.overrides[l]); });
    }
    if (Array.isArray(content.projects) && content.projects.length) renderProjects(content.projects);
    applyLang(curLang);
  } catch (e) { /* offline or not deployed yet: keep the built-in content */ }
}

/* ===== Init ===== */
(function init() {
  // footer copyright year follows the visitor's clock, so it never goes stale
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  let savedTheme;
  try { savedTheme = localStorage.getItem(THEME_KEY); } catch (e) {}
  if (!savedTheme && window.matchMedia) savedTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  applyTheme(savedTheme || theme);

  let savedLang;
  try { savedLang = localStorage.getItem(LANG_KEY); } catch (e) {}
  if (!savedLang) {
    const n = (navigator.language || "en").slice(0, 2);
    savedLang = i18n[n] ? n : "en";
  }
  applyLang(savedLang);

  const m = location.hash.match(/^#case-(\w+)$/);
  if (m && CASE_STATIC[m[1]]) openCase(m[1]);

  loadRemoteContent();
})();
})();
