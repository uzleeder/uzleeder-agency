/* =========================================================
   UzLeeder — Portfolio V3 · behaviour
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
  "svc9_title": "AGI Agent & API Integration",
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
  "f_3day": "Delivery date agreed in the scope",
  "f_support": "Help with launch",
  "f_multi": "Multi-page website",
  "f_custom": "Custom design & branding",
  "f_reg": "Registration form",
  "f_tgphone": "Telegram + phone integration",
  "f_cms": "CMS (editable content)",
  "f_5day": "Delivery date agreed in the scope",
  "f_forever": "Maintenance plan available",
  "f_everything": "Everything in Professional",
  "f_adv": "Advanced animations",
  "f_backend": "Backend integration",
  "f_domain": "Domain setup help",
  "f_priority": "Priority in the schedule",
  "f_lifetime": "Maintenance plan available",
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
  "form_ok": "Thank you — your brief is received. I'll reply on your chosen channel.",
  "form_err": "The brief could not be sent. Your text is kept — try again or write directly.",
  "form_invalid": "Please check the highlighted fields.",
  "skip": "Skip to content",
  "nav_work": "Work",
  "nav_ai": "AGI Engineering",
  "nav_about": "About",
  "nav_contact": "Contact",
  "nav_pricing": "Pricing",
  "hero_eyebrow": "AGI · UzLeeder · 2026",
  "hero_title": "Engineering products for the <em>AI era.</em>",
  "hero_desc": "I'm Max, founder &amp; CEO of UzLeeder in Tashkent. AGI is the direction we build toward; what we deliver today is real, tested software — with scope, price and delivery plan agreed before development begins.",
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
  "ai_kicker": "AGI engineering",
  "ai_title": "AGI isn't decoration. It's part of the engineering.",
  "ai_sub": "How I actually work with models — the methods behind the products.",
  "pipe_title": "How an idea becomes a product",
  "p1": "Idea",
  "p1d": "problem & objective",
  "p2": "Prompt",
  "p2d": "instructions & constraints",
  "p3": "Model",
  "p3d": "reasoning & generation",
  "p4": "Logic",
  "p4d": "application logic",
  "p5": "System",
  "p5d": "integration & workflow",
  "p6": "Product",
  "p6d": "production implementation",
  "p7": "User",
  "p7d": "real-world result",
  "ai1_t": "Prompt Engineering",
  "ai1_d": "Designing system-level instructions, constraints, behaviour and output structures for reliable AGI applications.",
  "ai2_t": "System Prompt Design",
  "ai2_d": "Defining roles, rules, tone and failure behaviour so a model acts consistently inside a product.",
  "ai3_t": "RAG",
  "ai3_d": "Connecting models to controlled knowledge sources so answers are grounded in relevant information.",
  "ai4_t": "Knowledge-Base-Constrained Responses",
  "ai4_d": "Keeping answers inside an approved knowledge base — and saying \"I don't know\" when the source is silent.",
  "ai5_t": "AGI Workflow Orchestration",
  "ai5_d": "Chaining steps — retrieve, reason, generate, check — so several capabilities complete one larger task.",
  "ai6_t": "AI-Assisted Development",
  "ai6_d": "Building software with Claude Code, Cursor and similar tools, while architecture, review and testing stay human-owned.",
  "ai7_t": "Multi-Model Workflows",
  "ai7_d": "Choosing the right model for each step — reasoning, writing, vision, voice — instead of forcing one model to do everything.",
  "ai8_t": "Content Generation Pipelines",
  "ai8_d": "Repeatable pipelines for text, image, video and voice with tools like Midjourney, Runway, Kling and ElevenLabs.",
  "ai9_t": "Intelligent Automation",
  "ai9_d": "n8n, Zapier and custom code that let AGI act on real tools — forms, messages, spreadsheets and APIs.",
  "brand_title": "An AGI-first technology and digital product brand.",
  "brand_lead": "UzLeeder is the brand Max founded to build products and systems with modern software engineering and AGI — for leaders who want working tools, not decoration.",
  "brand_what": "What we build",
  "bw1": "AGI systems",
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
  "about_p2": "My work sits where product building meets AGI workflows — full-stack platforms, automation and AI-assisted development. I learn by shipping: every project is an experiment that ends as working software.",
  "about_p3": "I'm certified in AI prompt engineering through the Five Million AI Leaders programme and in generative AI through Google Cloud — and I keep learning with every build.",
  "pr1": "Engineering mindset",
  "pr1d": "Systems first, screens second.",
  "pr2": "Product building",
  "pr2d": "Shipped beats perfect.",
  "pr3": "AGI workflows",
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
  "price_kicker": "Services &amp; pricing",
  "price_title": "Clear scope. Transparent pricing.",
  "contact_title": "Discuss your project.",
  "contact_sub": "Tell me what you're building. I reply fast — usually the same day, on email or Telegram.",
  "copy": "Copy",
  "copied": "Copied",
  "copy_fail": "Couldn't copy — select the address instead.",
  "err_name": "Please enter your name.",
  "err_email": "Please enter a valid email address.",
  "err_msg": "Please write a short message.",
  "foot_line": "AGI-era technology. Real products. Real engineering.",
  "cs_overview": "Overview",
  "cs_challenge": "Problem",
  "cs_solution": "What was built",
  "cs_tech": "Technology",
  "cs_role": "My role",
  "cs_result": "Evidence",
  "cs_media": "Media",
  "cs_arch": "How it works",
  "cs_close": "Close case study",
  "cs_label": "Case study",
  "roles": [
   "Prompt Engineer",
   "AI-Assisted Developer",
   "AGI Systems Builder",
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
   },
   "academy": {
    "cat": "Education · Personal learning system · UzLeeder product",
    "lead": "A private, single-learner study system — not a public LMS — with human-written courses and human feedback.",
    "overview": "One student follows a fixed loop: plan → lesson → practice → quiz → mistake → repeat → mastery → project → feedback. Three staff roles — controller, teacher and English teacher — monitor, assign and review from a separate panel. The content is written, not generated: a 30-day Python course with 300 quiz questions, a 140-day IELTS 8.0 track with 20 weekly tests, 44 grammar topics with exercises, 72 IELTS-format reading passages, 600 vocabulary words, a 14-chapter DataCamp track, a 30-day speaking program and a 154-day daily schedule built around astronomically computed prayer times.",
    "challenge": "Preparing for Python and IELTS 8.0 at the same time needs one place that plans every day, keeps lessons, practice and mistakes together, works without internet, and lets teachers assign and review — without the noise of a public course platform and without automatic AI scoring.",
    "solution": "A framework-free progressive web app (~41,000 lines of JavaScript, most of it hand-written course content) with 9 Vercel serverless functions. It is offline-first: localStorage is always the source of truth and the cloud is a copy, so two devices merge instead of overwriting each other. Every route sits behind an HMAC-signed session cookie checked at the edge, and all four roles are enforced on the server. Every assignment and every piece of feedback is written by a human.",
    "role": "Sole designer, architect and developer — built with an AI-assisted workflow, directed and validated by Max.",
    "result": "Live at uzleeder-academy.vercel.app. Automated checks: API tests 72/72 passed, edge middleware tests 14/14 passed, schedule validation — every day template covers exactly 1,440 minutes with no overlaps, English track audit — 140/140 days and 20 weekly tests present.",
    "arch": [
     [
      "Users",
      "Student · controller · teacher · English teacher"
     ],
     [
      "App",
      "Offline-first PWA — vanilla JavaScript, Service Worker, IndexedDB"
     ],
     [
      "Learning loop",
      "Plan → lesson → practice → quiz → mistakes → mastery → project → feedback"
     ],
     [
      "Security",
      "HMAC-signed session cookie at the edge · roles enforced server-side · PBKDF2"
     ],
     [
      "API",
      "9 Vercel serverless functions"
     ],
     [
      "Data",
      "localStorage as source of truth → Neon Postgres copy · Vercel Blob for media"
     ],
     [
      "Output",
      "Human-written assignments and feedback — no AI scoring"
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
  "team_sub": "One human decision-maker. An AI team where every model has a defined job inside the workflow.",
  "team_count": "1 human · 12 AI teammates",
  "team_human": "Human",
  "team_ai": "AI",
  "team_online": "online",
  "team_note": "AI systems are used as part of Max's AI-assisted engineering workflow. They are not employees or owners — Max makes the decisions and is responsible for every release.",
  "tm_max_r": "Founder &amp; CEO · UzLeeder",
  "tm_max_d": "The human decision-maker. Sets the direction, designs the systems and owns every final product decision.",
  "tm_claude_r": "Chief Architect",
  "tm_claude_d": "Within the AI-assisted workflow: architecture exploration, system design support, technical reasoning and implementation guidance.",
  "tm_claudecode_r": "Senior Engineer",
  "tm_claudecode_d": "Ships large coding tasks straight from the terminal.",
  "tm_codex_r": "AI Coding Engineer",
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
  "tm_n8n_d": "Runs the automations that connect everything.",
  "nav_max": "Max",
  "nav_admin": "Admin",
  "nav_build": "Build with UzLeeder",
  "era_k": "The age of building with intelligence",
  "era_line": "AI changed how software is built. <b>UzLeeder is building with it.</b>",
  "pipe_hint": "Select a stage to see what happens there.",
  "px1": "Every build starts with a real problem, a real user and a clear objective — written down before any model is opened.",
  "px2": "The problem becomes precise instructions: role, context, constraints, output format and what the model must never do.",
  "px3": "The right model for each step — reasoning, generation, vision or voice — compared on real inputs, not on hype.",
  "px4": "Application logic lives in code: validation, business rules and data handling are written, read and owned by a human.",
  "px5": "APIs, databases, auth and workflows connect the parts, so AI output lands inside a system that can be trusted.",
  "px6": "A production implementation — deployed, tested on real devices, with security and performance checked before release.",
  "px7": "Real people use it. Their feedback and results flow back into the next iteration.",
  "hb_kicker": "Method",
  "hb_title": "How I build with AGI.",
  "hb_sub": "Designed, directed, validated, shipped.",
  "hb1_t": "Understand",
  "hb1_d": "Talk to the people who will use it. Define the problem, the scope and what success means.",
  "hb2_t": "Architect",
  "hb2_d": "Design the data, the flows and the system boundaries before a line of code is generated.",
  "hb3_t": "Direct AI",
  "hb3_d": "Give the AI team precise instructions, context and constraints — one clear task at a time.",
  "hb4_t": "Generate",
  "hb4_d": "AI drafts code, copy and media fast — with several options where the choice matters.",
  "hb5_t": "Review",
  "hb5_d": "Every change is read, questioned and corrected. Nothing ships because a model sounded confident.",
  "hb6_t": "Test",
  "hb6_d": "Real devices, real data, edge cases and security checks — then fix and test again.",
  "hb7_t": "Ship",
  "hb7_d": "Deploy, monitor and hand over — with documentation and support after launch.",
  "hb_msg": "AI accelerates implementation. <b>Human judgment</b> remains responsible for architecture, validation, security, quality and final product decisions.",
  "team_human_k": "Human team",
  "team_human_n": "Decision-maker",
  "team_ai_k": "AI team",
  "team_ai_n": "Assists inside the workflow",
  "tm_max_rule": "AI assists. Max directs. Max validates.",
  "st_core": "Core engineering",
  "st_aie": "AI-assisted engineering",
  "st_aii": "AGI &amp; intelligence",
  "st_infra": "Infrastructure",
  "st_design": "Design &amp; workspace",
  "st_aie_note": "AI-assisted workflow",
  "bw_title": "Build with UzLeeder.",
  "bw_sub": "Three kinds of work — each one designed, directed, validated and shipped.",
  "bg1_t": "Digital Products",
  "bg1_d": "Websites, platforms and learning systems — from concept to deployment.",
  "bg2_t": "AI Systems",
  "bg2_d": "Assistants, RAG and AI workflows that work inside real products.",
  "bg3_t": "Business Systems",
  "bg3_d": "Portals, admin panels and automations that take repetitive work off people.",
  "bi_ai": "Assistants &amp; RAG",
  "rv_title": "What clients say",
  "rv_sub": "Published with each client's permission.",
  "pv_bar": "Draft preview — this version is not published.",
  "pv_exit": "Exit preview",
  "pv_fail": "Draft preview needs an active admin session.",
  "st_live_own": "Live UzLeeder product",
  "st_delivered": "Delivered to the client",
  "own_uzleeder": "UzLeeder product",
  "own_client": "Client project",
  "st_demo": "Demonstration",
  "st_dev": "In development",
  "st_private": "Private project",
  "st_concept": "Concept",
  "st_archived": "Archived",
  "nav_services": "Services",
  "nav_how": "How it works",
  "btn_discuss": "Discuss your project",
  "btn_projects": "See real projects",
  "hero_sub": "Intelligent digital products, business systems, websites and automation — with human-controlled engineering.",
  "hero_base": "Based in Uzbekistan. Available for projects worldwide.",
  "pf_k": "Product &amp; capability data from shipped projects",
  "st_live_client": "Live client project",
  "st_product": "Product available for deployment",
  "svc_title": "Three things UzLeeder builds.",
  "svc_sub": "Each project starts with an agreed scope, price and delivery plan.",
  "svc_example": "Example",
  "svc_start": "Start a brief",
  "s1_t": "Business websites",
  "s1_d": "Marketing websites that explain your offer, build trust, show proof and capture inquiries.",
  "s1_i1": "Clear offer and service pages",
  "s1_i2": "Proof: projects, certificates, reviews",
  "s1_i3": "Inquiry forms sent to Telegram or email",
  "s1_i4": "Multilingual, fast and mobile-first",
  "s1_ev": "This website — built and run by UzLeeder.",
  "s1_from": "from $200",
  "s2_t": "Business systems",
  "s2_d": "Portals, academies, dashboards and internal workflows behind a secure login.",
  "s2_i1": "Role-based access for staff, clients or students",
  "s2_i2": "Admissions, payments, records and reports",
  "s2_i3": "Dashboards and admin panels",
  "s2_i4": "Your data in your own database",
  "s2_ev": "Shokirov Math Academy · MarketHub",
  "s2_from": "from $1000",
  "s3_t": "AGI systems",
  "s3_d": "AGI automation, knowledge assistants (RAG) and Telegram workflows — with human checks where it matters.",
  "aiw1": "Input",
  "aiw2": "Approved knowledge",
  "aiw3": "AGI processing",
  "aiw4": "Validation",
  "aiw5": "Human handoff",
  "aiw6": "Output",
  "s3_note": "Errors are handled and tested. AI is not perfect, so critical answers keep a person in the loop.",
  "s3_from": "from $500",
  "price_request": "Price after scoping",
  "scope_t": "Every scope is agreed in writing before development",
  "scope_1": "Deliverables — pages, features, integrations",
  "scope_2": "What is not included",
  "scope_3": "Number of revision rounds",
  "scope_4": "Content and access you provide",
  "scope_5": "Third-party costs: domain, hosting, paid APIs",
  "scope_6": "Maintenance after launch",
  "pkg_t": "Packages &amp; starting prices",
  "pkg_sub": "Final price depends on the agreed scope.",
  "price_all": "All services and starting prices",
  "extras_t": "Creative extras",
  "defect30": "30-day defect fixes after launch",
  "doc_self": "UzLeeder document · self-issued",
  "certs_note": "Third-party certificates link to the issuer's own verification page. UzLeeder documents are issued by UzLeeder itself and are not independent validation.",
  "pr_title": "From first message to launch.",
  "pr1_t": "Discuss",
  "pr1_d": "You describe the business and the goal. I ask questions until the problem is clear.",
  "pr2_t": "Scope",
  "pr2_d": "We agree deliverables, exclusions, dependencies, price and a delivery plan — in writing.",
  "pr3_t": "Build",
  "pr3_d": "Development with regular previews. Everything is reviewed and tested before you see it.",
  "pr4_t": "Deliver",
  "pr4_d": "Deployment, handover of access and documentation, and an agreed maintenance option.",
  "pr_note": "No development starts before the scope, price and delivery plan are clear to both sides.",
  "faq_title": "Questions before we start.",
  "faq1_q": "What does UzLeeder build?",
  "faq1_a": "Three things: business websites that bring inquiries, business systems such as portals, academies and dashboards, and AGI systems that automate repetitive work with human checks.",
  "faq2_q": "How does the process work?",
  "faq2_a": "Discuss → scope → build → deliver. Development starts only after the scope, price and delivery plan are agreed in writing.",
  "faq3_q": "How is AI used?",
  "faq3_a": "AI helps to design, write and test faster. Max reviews every change and is responsible for the architecture, security and the final result. AI is never shipped unchecked.",
  "faq4_q": "What do I receive?",
  "faq4_a": "A working, deployed product, access to it (domain, hosting, admin), the source code and short documentation — exactly as listed in the agreed scope.",
  "faq5_q": "How is pricing determined?",
  "faq5_a": "By scope: the number of pages or features, integrations, content and deadlines. Starting prices are listed above; the final price is fixed in the scope before work begins.",
  "faq6_q": "Do you work internationally?",
  "faq6_a": "Yes. UzLeeder is based in Tashkent and works remotely with clients in other countries in English, Russian and Uzbek.",
  "faq7_q": "How do maintenance and support work?",
  "faq7_a": "Support after launch is agreed in the scope — either a defined period of fixes or a paid maintenance plan. There are no open-ended promises.",
  "brief_intro": "A short project brief — I reply on the channel you choose.",
  "brief_channel": "Preferred reply channel",
  "brief_c_telegram": "Telegram username or phone",
  "brief_c_whatsapp": "WhatsApp number",
  "brief_c_email": "Email address",
  "err_telegram": "Enter a Telegram @username or phone number.",
  "err_whatsapp": "Enter a WhatsApp number with country code.",
  "brief_service": "What do you need?",
  "brief_choose": "Choose a service…",
  "brief_other": "Other",
  "err_service": "Please choose a service.",
  "brief_msg": "Project description",
  "brief_msg_ph": "What is the business, and what should the website or system do?",
  "err_msg10": "Please describe the project in a sentence or two.",
  "brief_optional": "Budget and timeline (optional)",
  "brief_budget": "Budget",
  "brief_timeline": "Timeline",
  "brief_skip": "Prefer not to say",
  "bud_1": "Under $500",
  "bud_4": "Over $4,000",
  "bud_5": "Not sure yet",
  "tl_1": "As soon as possible",
  "tl_2": "Within a month",
  "tl_3": "1–3 months",
  "tl_4": "Flexible",
  "brief_send": "Send project brief",
  "brief_fallback": "You can also write directly:",
  "brief_privacy": "Your details are used only to reply to this request.",
  "form_dup": "This brief was already received — no need to send it again.",
  "form_rate": "Too many attempts. Please wait a few minutes or write directly.",
  "foot_founder": "Founded and led by Max (Mekhriddin Abdualim)",
  "cs_status": "Status",
  "cs_cta": "Discuss a similar project",
  "cs_status_shokirov": "Live client project — in daily use by the academy at shokirov-academy.vercel.app.",
  "cs_status_markethub": "Product available for deployment — offered for sale; a walkthrough is available on request.",
  "pf1x": "products shipped — {live} live, {ready} ready to deploy",
  "pf6": "startup projects & research directions — see Startups →",
  "nav_partners": "Partners",
  "nav_startups": "Startups",
  "su_eyebrow": "UzLeeder Ventures",
  "su_h": "Building What <em>Comes Next.</em>",
  "su_lead": "We build and explore technology ventures designed to solve real problems, create useful digital products, and open new possibilities for the AI era.",
  "su_cta1": "Explore Startups",
  "su_cta2": "Discuss a Venture",
  "su_v_k": "Founder's vision",
  "su_v_h": "Ideas become products. Products become possibilities.",
  "su_v_p": "Every venture begins with a problem worth solving. Our approach is to explore the opportunity, design a practical solution, build the product, and improve it through real-world feedback.",
  "su_p1_t": "Identify",
  "su_p1_d": "Discover meaningful problems and underserved opportunities.",
  "su_p2_t": "Build",
  "su_p2_d": "Turn validated concepts into usable products through thoughtful engineering and product design.",
  "su_p3_t": "Evolve",
  "su_p3_d": "Test, learn, improve, and expand when the evidence supports the next step.",
  "su_d_k": "Directory",
  "su_d_h": "Our Ventures",
  "su_d_p": "Explore the products and initiatives we are developing, researching, and bringing to life.",
  "su_filter": "Filter by category",
  "su_kicker": "Startups",
  "su_title": "Ventures we are building for ourselves.",
  "su_sub": "UzLeeder's own products — early, and described as they really are. Every venture has its pitch deck.",
  "su_all": "Explore the Startups page",
  "su_note": "“Research” means there is no public product yet. Figures in the decks are hypotheses, not results.",
  "form_code": "Request ID:",
  "btn_view": "View projects"
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
  "svc9_title": "AGI Agent & API integratsiya",
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
  "f_3day": "Topshirish muddati doirada kelishiladi",
  "f_support": "Ishga tushirishda yordam",
  "f_multi": "Ko'p sahifali sayt",
  "f_custom": "Maxsus dizayn va brending",
  "f_reg": "Ro'yxatdan o'tish formasi",
  "f_tgphone": "Telegram + telefon integratsiya",
  "f_cms": "CMS (tahrirlanadigan kontent)",
  "f_5day": "Topshirish muddati doirada kelishiladi",
  "f_forever": "Xizmat ko'rsatish rejasi mavjud",
  "f_everything": "Professional'dagi hamma narsa",
  "f_adv": "Ilg'or animatsiyalar",
  "f_backend": "Backend integratsiya",
  "f_domain": "Domen sozlash yordami",
  "f_priority": "Jadvalda ustuvorlik",
  "f_lifetime": "Xizmat ko'rsatish rejasi mavjud",
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
  "form_ok": "Rahmat — brifingiz qabul qilindi. Tanlagan kanalingiz orqali javob beraman.",
  "form_err": "Brif yuborilmadi. Matningiz saqlandi — qayta urinib ko'ring yoki to'g'ridan-to'g'ri yozing.",
  "form_invalid": "Belgilangan maydonlarni tekshiring.",
  "skip": "Asosiy qismga o'tish",
  "nav_work": "Ishlar",
  "nav_ai": "AGI muhandislik",
  "nav_about": "Haqida",
  "nav_contact": "Aloqa",
  "nav_pricing": "Narxlar",
  "hero_eyebrow": "AGI · UzLeeder · 2026",
  "hero_title": "<em>AI davri</em> uchun mahsulotlar muhandisligi.",
  "hero_desc": "Men Max — Toshkentdagi UzLeeder asoschisi va CEO'siman. AGI — biz intilayotgan yo'nalish; bugun topshiradiganimiz esa real, sinovdan o'tgan dasturiy ta'minot. Hajm, narx va topshirish rejasi ish boshlanishidan oldin kelishiladi.",
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
  "ai_kicker": "AGI muhandisligi",
  "ai_title": "AGI bezak emas. U muhandislikning bir qismi.",
  "ai_sub": "Modellar bilan qanday ishlayman — mahsulotlar ortidagi usullar.",
  "pipe_title": "G'oya qanday qilib mahsulotga aylanadi",
  "p1": "G'oya",
  "p1d": "muammo va maqsad",
  "p2": "Prompt",
  "p2d": "ko'rsatma va cheklovlar",
  "p3": "Model",
  "p3d": "fikrlash va yaratish",
  "p4": "Mantiq",
  "p4d": "ilova mantig'i",
  "p5": "Tizim",
  "p5d": "integratsiya va jarayon",
  "p6": "Mahsulot",
  "p6d": "production'dagi yechim",
  "p7": "Foydalanuvchi",
  "p7d": "real natija",
  "ai1_t": "Prompt Engineering",
  "ai1_d": "Ishonchli AGI ilovalar uchun tizim darajasidagi ko'rsatmalar, cheklovlar, xulq-atvor va javob tuzilmalarini loyihalash.",
  "ai2_t": "System Prompt dizayni",
  "ai2_d": "Model mahsulot ichida barqaror ishlashi uchun rol, qoidalar, ohang va xatoga munosabatni belgilash.",
  "ai3_t": "RAG",
  "ai3_d": "Javoblar tegishli ma'lumotga tayanishi uchun modellarni nazorat qilinadigan bilim manbalariga ulash.",
  "ai4_t": "Bilim bazasi bilan cheklangan javoblar",
  "ai4_d": "Javoblarni tasdiqlangan bilim bazasi doirasida saqlash — manbada javob bo'lmasa, \"bilmayman\" deyish.",
  "ai5_t": "AGI workflow orkestratsiyasi",
  "ai5_d": "Bosqichlarni zanjirga ulash — topish, fikrlash, yaratish, tekshirish — bir nechta imkoniyat bitta katta vazifani bajaradi.",
  "ai6_t": "AI yordamida dasturlash",
  "ai6_d": "Claude Code, Cursor kabi vositalar bilan dastur yozish — arxitektura, review va test esa inson nazoratida.",
  "ai7_t": "Ko'p modelli workflow'lar",
  "ai7_d": "Har bir bosqich uchun mos modelni tanlash — fikrlash, yozish, ko'rish, ovoz — hammasini bitta modelga yuklamaslik.",
  "ai8_t": "Kontent yaratish pipeline'lari",
  "ai8_d": "Midjourney, Runway, Kling va ElevenLabs kabi vositalar bilan matn, rasm, video va ovoz uchun takrorlanadigan pipeline'lar.",
  "ai9_t": "Aqlli avtomatlashtirish",
  "ai9_d": "AGI'ga real vositalar — formalar, xabarlar, jadvallar va API'lar ustida ishlash imkonini beruvchi n8n, Zapier va maxsus kod.",
  "brand_title": "AGI'ga tayanuvchi texnologiya va raqamli mahsulot brendi.",
  "brand_lead": "UzLeeder — Max zamonaviy dasturiy muhandislik va AGI bilan mahsulot va tizimlar qurish uchun asos solgan brend. Bezak emas, ishlaydigan vosita istagan liderlar uchun.",
  "brand_what": "Nima quramiz",
  "bw1": "AGI tizimlar",
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
  "about_p2": "Ishim mahsulot qurish va AGI workflow'lari kesishgan joyda — full-stack platformalar, avtomatlashtirish va AI yordamida dasturlash. Topshirish orqali o'rganaman: har bir loyiha ishlaydigan dastur bilan tugaydigan tajriba.",
  "about_p3": "\"Besh million AI yetakchilari\" dasturi orqali AI prompt engineering va Google Cloud orqali generativ AI bo'yicha sertifikatlarim bor — va har bir loyiha bilan o'rganishda davom etaman.",
  "pr1": "Muhandislik fikrlashi",
  "pr1d": "Avval tizim, keyin ekran.",
  "pr2": "Mahsulot qurish",
  "pr2d": "Topshirilgani mukammalidan afzal.",
  "pr3": "AGI workflow'lar",
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
  "contact_title": "Loyihangizni muhokama qilamiz.",
  "contact_sub": "Nima qurayotganingizni yozing. Tez javob beraman — odatda o'sha kuni, email yoki Telegram orqali.",
  "copy": "Nusxalash",
  "copied": "Nusxalandi",
  "copy_fail": "Nusxalab bo'lmadi — manzilni belgilab oling.",
  "err_name": "Ismingizni kiriting.",
  "err_email": "To'g'ri email manzil kiriting.",
  "err_msg": "Qisqa xabar yozing.",
  "foot_line": "AGI davri texnologiyasi. Haqiqiy mahsulotlar. Haqiqiy muhandislik.",
  "cs_overview": "Umumiy ma'lumot",
  "cs_challenge": "Muammo",
  "cs_solution": "Nima qurildi",
  "cs_tech": "Texnologiyalar",
  "cs_role": "Mening rolim",
  "cs_result": "Isbot",
  "cs_media": "Media",
  "cs_arch": "Qanday ishlaydi",
  "cs_close": "Case study'ni yopish",
  "cs_label": "Case study",
  "roles": [
   "Prompt Engineer",
   "AI yordamida dasturchi",
   "AGI tizimlar quruvchisi",
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
   },
   "academy": {
    "cat": "Ta'lim · Shaxsiy o'quv tizimi · UzLeeder mahsuloti",
    "lead": "Bitta o'quvchi uchun yopiq o'quv tizimi — ommaviy LMS emas — kurslari va fikr-mulohazalari inson tomonidan yozilgan.",
    "overview": "Bitta o'quvchi qat'iy sikl bo'yicha o'qiydi: reja → dars → mashq → test → xato → takror → o'zlashtirish → loyiha → fikr-mulohaza. Uchta xodim roli — nazoratchi, o'qituvchi va ingliz tili o'qituvchisi — alohida paneldan kuzatadi, topshiriq beradi va tekshiradi. Kontent yaratilmagan, yozilgan: 300 ta test savolli 30 kunlik Python kursi, 20 ta haftalik testli 140 kunlik IELTS 8.0 yo'nalishi, mashqli 44 ta grammatika mavzusi, IELTS formatidagi 72 ta o'qish matni, 600 ta so'z, 14 bobli DataCamp yo'nalishi, 30 kunlik speaking dasturi va astronomik hisoblangan namoz vaqtlari atrofida qurilgan 154 kunlik kundalik jadval.",
    "challenge": "Python va IELTS 8.0 ga bir vaqtda tayyorlanish uchun har kunni rejalaydigan, dars, mashq va xatolarni bir joyda saqlaydigan, internetsiz ishlaydigan va o'qituvchilarga topshiriq berib tekshirishga imkon beradigan bitta joy kerak — ommaviy kurs platformasining shovqinisiz va AI avtomatik baholashisiz.",
    "solution": "Frameworksiz progressiv veb-ilova (~41 000 qator JavaScript, asosan qo'lda yozilgan kurs kontenti) va 9 ta Vercel serverless funksiyasi. Offline-first: localStorage doim asosiy manba, bulut esa nusxa — shuning uchun ikki qurilma bir-birini o'chirmaydi, birlashadi. Har bir yo'l edge'da tekshiriladigan HMAC imzoli sessiya cookie'si ortida, to'rtala rol serverda nazorat qilinadi. Har bir topshiriq va har bir fikr-mulohazani inson yozadi.",
    "role": "Yagona dizayner, arxitektor va dasturchi — AI yordamidagi jarayon bilan, Max yo'naltirgan va tekshirgan.",
    "result": "uzleeder-academy.vercel.app manzilida ishlamoqda. Avtomatik tekshiruvlar: API testlari 72/72 o'tdi, edge middleware testlari 14/14 o'tdi, jadval tekshiruvi — har bir kun shabloni aniq 1 440 daqiqani qamraydi, ustma-ust tushish yo'q, ingliz tili yo'nalishi auditi — 140/140 kun va 20 ta haftalik test mavjud.",
    "arch": [
     [
      "Foydalanuvchilar",
      "O'quvchi · nazoratchi · o'qituvchi · ingliz tili o'qituvchisi"
     ],
     [
      "Ilova",
      "Offline-first PWA — vanilla JavaScript, Service Worker, IndexedDB"
     ],
     [
      "O'quv sikli",
      "Reja → dars → mashq → test → xatolar → o'zlashtirish → loyiha → fikr-mulohaza"
     ],
     [
      "Xavfsizlik",
      "Edge'da HMAC imzoli sessiya cookie · rollar serverda · PBKDF2"
     ],
     [
      "API",
      "9 ta Vercel serverless funksiya"
     ],
     [
      "Ma'lumotlar",
      "localStorage asosiy manba → Neon Postgres nusxasi · media uchun Vercel Blob"
     ],
     [
      "Natija",
      "Inson yozgan topshiriq va fikr-mulohazalar — AI baholash yo'q"
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
  "team_sub": "Bitta inson — qaror qabul qiluvchi. AI jamoasida esa har bir modelning ish jarayonida aniq vazifasi bor.",
  "team_count": "1 inson · 12 AI jamoadosh",
  "team_human": "Inson",
  "team_ai": "AI",
  "team_online": "onlayn",
  "team_note": "AI tizimlari Max'ning AI yordamidagi muhandislik jarayonining bir qismi sifatida ishlatiladi. Ular xodim yoki egalar emas — qarorlarni Max qabul qiladi va har bir reliz uchun javob beradi.",
  "tm_max_r": "Asoschi va CEO · UzLeeder",
  "tm_max_d": "Qaror qabul qiluvchi inson. Yo'nalishni belgilaydi, tizimlarni loyihalaydi va har bir yakuniy mahsulot qarori uchun javob beradi.",
  "tm_claude_r": "Bosh arxitektor",
  "tm_claude_d": "AI yordamidagi ish jarayonida: arxitekturani o'rganish, tizim dizayniga yordam, texnik mulohaza va amalga oshirish bo'yicha yo'l-yo'riq.",
  "tm_claudecode_r": "Senior muhandis",
  "tm_claudecode_d": "Katta dasturlash vazifalarini to'g'ridan-to'g'ri terminaldan bajaradi.",
  "tm_codex_r": "AI dasturchi muhandis",
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
  "tm_n8n_d": "Hammasini bog'lab turuvchi avtomatlashtirishlarni boshqaradi.",
  "nav_max": "Max",
  "nav_admin": "Admin",
  "nav_build": "UzLeeder bilan quring",
  "era_k": "Intellekt bilan qurish davri",
  "era_line": "AI dasturiy ta'minot qanday qurilishini o'zgartirdi. <b>UzLeeder u bilan quryapti.</b>",
  "pipe_hint": "Bosqichni tanlang — u yerda nima bo'lishini ko'rasiz.",
  "px1": "Har bir loyiha real muammo, real foydalanuvchi va aniq maqsaddan boshlanadi — hech qanday model ochilmasdan oldin yozib qo'yiladi.",
  "px2": "Muammo aniq ko'rsatmalarga aylanadi: rol, kontekst, cheklovlar, javob formati va model hech qachon qilmasligi kerak bo'lgan narsalar.",
  "px3": "Har bir qadam uchun to'g'ri model — fikrlash, yaratish, ko'rish yoki ovoz — shov-shuvga emas, real ma'lumotlarga qarab tanlanadi.",
  "px4": "Ilova mantig'i kodda yashaydi: tekshiruv, biznes qoidalari va ma'lumotlar bilan ishlashni inson yozadi, o'qiydi va javob beradi.",
  "px5": "API, ma'lumotlar bazasi, autentifikatsiya va jarayonlar qismlarni bog'laydi — AI natijasi ishonchli tizim ichiga tushadi.",
  "px6": "Production'dagi yechim — joylashtirilgan, real qurilmalarda sinalgan, xavfsizlik va tezlik chiqarishdan oldin tekshirilgan.",
  "px7": "Real odamlar foydalanadi. Ularning fikri va natijalari keyingi bosqichga qaytadi.",
  "hb_kicker": "Usul",
  "hb_title": "AGI bilan qanday quraman.",
  "hb_sub": "Loyihalangan, yo'naltirilgan, tekshirilgan, chiqarilgan.",
  "hb1_t": "Tushunish",
  "hb1_d": "Foydalanadigan odamlar bilan gaplashaman. Muammo, doira va muvaffaqiyat nimaligini aniqlayman.",
  "hb2_t": "Arxitektura",
  "hb2_d": "Birorta kod yaratilishidan oldin ma'lumotlar, oqimlar va tizim chegaralarini loyihalayman.",
  "hb3_t": "AI'ni yo'naltirish",
  "hb3_d": "AI jamoasiga aniq ko'rsatma, kontekst va cheklovlar beraman — bir vaqtda bitta aniq vazifa.",
  "hb4_t": "Yaratish",
  "hb4_d": "AI kod, matn va mediani tez tayyorlaydi — tanlov muhim joyda bir nechta variant bilan.",
  "hb5_t": "Ko'rib chiqish",
  "hb5_d": "Har bir o'zgarish o'qiladi, so'roq qilinadi va tuzatiladi. Model ishonchli gapirgani uchun hech narsa chiqmaydi.",
  "hb6_t": "Sinov",
  "hb6_d": "Real qurilmalar, real ma'lumotlar, chekka holatlar va xavfsizlik tekshiruvi — keyin tuzatib, yana sinov.",
  "hb7_t": "Chiqarish",
  "hb7_d": "Joylashtirish, kuzatish va topshirish — hujjatlar va ishga tushgandan keyingi yordam bilan.",
  "hb_msg": "AI amalga oshirishni tezlashtiradi. Arxitektura, tekshiruv, xavfsizlik, sifat va yakuniy mahsulot qarorlari uchun <b>inson mulohazasi</b> javob beradi.",
  "team_human_k": "Inson jamoasi",
  "team_human_n": "Qaror qabul qiluvchi",
  "team_ai_k": "AI jamoasi",
  "team_ai_n": "Ish jarayonida yordam beradi",
  "tm_max_rule": "AI yordam beradi. Max yo'naltiradi. Max tasdiqlaydi.",
  "st_core": "Asosiy muhandislik",
  "st_aie": "AI yordamidagi muhandislik",
  "st_aii": "AGI va intellekt",
  "st_infra": "Infratuzilma",
  "st_design": "Dizayn va ish muhiti",
  "st_aie_note": "AI yordamidagi jarayon",
  "bw_title": "UzLeeder bilan quring.",
  "bw_sub": "Uch turdagi ish — har biri loyihalangan, yo'naltirilgan, tekshirilgan va chiqarilgan.",
  "bg1_t": "Raqamli mahsulotlar",
  "bg1_d": "Saytlar, platformalar va o'quv tizimlari — g'oyadan ishga tushirishgacha.",
  "bg2_t": "AI tizimlari",
  "bg2_d": "Real mahsulotlar ichida ishlaydigan assistentlar, RAG va AI jarayonlari.",
  "bg3_t": "Biznes tizimlari",
  "bg3_d": "Takroriy ishni odamlardan oladigan portallar, admin panellar va avtomatlashtirish.",
  "bi_ai": "Assistentlar va RAG",
  "rv_title": "Mijozlar fikri",
  "rv_sub": "Har bir mijozning roziligi bilan e'lon qilingan.",
  "pv_bar": "Qoralama ko'rinishi — bu versiya hali e'lon qilinmagan.",
  "pv_exit": "Ko'rinishdan chiqish",
  "pv_fail": "Qoralamani ko'rish uchun admin sessiyasi kerak.",
  "st_live_own": "Ishlayotgan UzLeeder mahsuloti",
  "st_delivered": "Mijozga topshirilgan",
  "own_uzleeder": "UzLeeder mahsuloti",
  "own_client": "Mijoz loyihasi",
  "st_demo": "Namoyish",
  "st_dev": "Ishlab chiqilmoqda",
  "st_private": "Yopiq loyiha",
  "st_concept": "Konsepsiya",
  "st_archived": "Arxivlangan",
  "nav_services": "Xizmatlar",
  "nav_how": "Qanday ishlaymiz",
  "btn_discuss": "Loyihani muhokama qilish",
  "btn_projects": "Real loyihalarni ko'rish",
  "hero_sub": "Aqlli raqamli mahsulotlar, biznes tizimlar, saytlar va avtomatlashtirish — inson nazoratidagi muhandislik bilan.",
  "hero_base": "O'zbekistonda joylashgan. Butun dunyo bo'ylab loyihalar uchun ochiq.",
  "pf_k": "Topshirilgan loyihalardagi mahsulot va imkoniyat ma'lumotlari",
  "st_live_client": "Ishlayotgan mijoz loyihasi",
  "st_product": "Joylashtirishga tayyor mahsulot",
  "svc_title": "UzLeeder quradigan uch narsa.",
  "svc_sub": "Har bir loyiha kelishilgan doira, narx va topshirish rejasi bilan boshlanadi.",
  "svc_example": "Misol",
  "svc_start": "Brif yuborish",
  "s1_t": "Biznes saytlar",
  "s1_d": "Taklifingizni tushuntiradigan, ishonch uyg'otadigan, isbot ko'rsatadigan va murojaat yig'adigan marketing saytlari.",
  "s1_i1": "Aniq taklif va xizmat sahifalari",
  "s1_i2": "Isbot: loyihalar, sertifikatlar, fikrlar",
  "s1_i3": "Telegram yoki emailga keladigan murojaat formalari",
  "s1_i4": "Ko'p tilli, tez va mobilga mos",
  "s1_ev": "Shu sayt — UzLeeder tomonidan qurilgan va boshqariladi.",
  "s1_from": "$200 dan",
  "s2_t": "Biznes tizimlar",
  "s2_d": "Xavfsiz login ortidagi portallar, akademiyalar, dashboardlar va ichki jarayonlar.",
  "s2_i1": "Xodim, mijoz yoki talabalar uchun rolga asoslangan kirish",
  "s2_i2": "Qabul, to'lovlar, hisob va hisobotlar",
  "s2_i3": "Dashboardlar va admin panellar",
  "s2_i4": "Ma'lumotlaringiz o'z bazangizda",
  "s2_ev": "Shokirov Math Academy · MarketHub",
  "s2_from": "$1000 dan",
  "s3_t": "AGI tizimlar",
  "s3_d": "AGI avtomatlashtirish, bilim assistentlari (RAG) va Telegram jarayonlari — muhim joylarda inson nazorati bilan.",
  "aiw1": "Kirish",
  "aiw2": "Tasdiqlangan bilim",
  "aiw3": "AGI ishlovi",
  "aiw4": "Tekshiruv",
  "aiw5": "Insonga uzatish",
  "aiw6": "Natija",
  "s3_note": "Xatolar qayta ishlanadi va sinovdan o'tadi. AI mukammal emas, shuning uchun muhim javoblarda inson ishtirok etadi.",
  "s3_from": "$500 dan",
  "price_request": "Narx doira kelishilgach",
  "scope_t": "Har bir doira ish boshlanishidan oldin yozma kelishiladi",
  "scope_1": "Natijalar — sahifalar, funksiyalar, integratsiyalar",
  "scope_2": "Nimalar kirmaydi",
  "scope_3": "Tuzatishlar soni",
  "scope_4": "Siz beradigan kontent va kirishlar",
  "scope_5": "Uchinchi tomon xarajatlari: domen, hosting, pullik API",
  "scope_6": "Ishga tushgandan keyingi xizmat",
  "pkg_t": "Paketlar va boshlang'ich narxlar",
  "pkg_sub": "Yakuniy narx kelishilgan doiraga bog'liq.",
  "price_all": "Barcha xizmatlar va boshlang'ich narxlar",
  "extras_t": "Qo'shimcha ijodiy xizmatlar",
  "defect30": "Ishga tushgandan keyin 30 kunlik xato tuzatish",
  "doc_self": "UzLeeder hujjati · o'zi bergan",
  "certs_note": "Uchinchi tomon sertifikatlari beruvchining o'z tekshirish sahifasiga olib boradi. UzLeeder hujjatlarini UzLeeder o'zi beradi — ular mustaqil tasdiq emas.",
  "pr_title": "Birinchi xabardan ishga tushirishgacha.",
  "pr1_t": "Muhokama",
  "pr1_d": "Siz biznes va maqsadni aytasiz. Muammo aniq bo'lguncha savol beraman.",
  "pr2_t": "Doira",
  "pr2_d": "Natijalar, istisnolar, bog'liqliklar, narx va topshirish rejasini yozma kelishamiz.",
  "pr3_t": "Qurish",
  "pr3_d": "Muntazam ko'rsatib borgan holda ishlab chiqish. Siz ko'rishdan oldin hammasi tekshiriladi va sinovdan o'tadi.",
  "pr4_t": "Topshirish",
  "pr4_d": "Joylashtirish, kirishlar va hujjatlarni topshirish hamda kelishilgan xizmat ko'rsatish varianti.",
  "pr_note": "Doira, narx va topshirish rejasi ikki tomonga ham aniq bo'lmaguncha ish boshlanmaydi.",
  "faq_title": "Boshlashdan oldingi savollar.",
  "faq1_q": "UzLeeder nima quradi?",
  "faq1_a": "Uch narsa: murojaat olib keladigan biznes saytlar, portal, akademiya va dashboard kabi biznes tizimlar hamda takroriy ishni inson nazorati bilan avtomatlashtiradigan AGI tizimlar.",
  "faq2_q": "Jarayon qanday?",
  "faq2_a": "Muhokama → doira → qurish → topshirish. Ish faqat doira, narx va topshirish rejasi yozma kelishilgandan keyin boshlanadi.",
  "faq3_q": "AI qanday ishlatiladi?",
  "faq3_a": "AI loyihalash, yozish va sinashni tezlashtiradi. Max har bir o'zgarishni ko'rib chiqadi va arxitektura, xavfsizlik hamda yakuniy natija uchun javob beradi. Tekshirilmagan AI natijasi hech qachon chiqarilmaydi.",
  "faq4_q": "Men nima olaman?",
  "faq4_a": "Ishlaydigan, joylashtirilgan mahsulot, unga kirish (domen, hosting, admin), manba kod va qisqa hujjatlar — kelishilgan doirada yozilganidek.",
  "faq5_q": "Narx qanday belgilanadi?",
  "faq5_a": "Doiraga qarab: sahifa yoki funksiyalar soni, integratsiyalar, kontent va muddatlar. Boshlang'ich narxlar yuqorida; yakuniy narx ish boshlanishidan oldin doirada qayd etiladi.",
  "faq6_q": "Xalqaro loyihalar bilan ishlaysizmi?",
  "faq6_a": "Ha. UzLeeder Toshkentda joylashgan va boshqa davlatlardagi mijozlar bilan masofadan ingliz, rus va o'zbek tillarida ishlaydi.",
  "faq7_q": "Xizmat ko'rsatish va yordam qanday?",
  "faq7_a": "Ishga tushgandan keyingi yordam doirada kelishiladi — belgilangan muddatli tuzatishlar yoki pullik xizmat rejasi. Chegarasiz va'dalar yo'q.",
  "brief_intro": "Qisqa loyiha brifi — siz tanlagan kanal orqali javob beraman.",
  "brief_channel": "Javob uchun qulay kanal",
  "brief_c_telegram": "Telegram username yoki telefon",
  "brief_c_whatsapp": "WhatsApp raqami",
  "brief_c_email": "Email manzil",
  "err_telegram": "Telegram @username yoki telefon raqamini kiriting.",
  "err_whatsapp": "WhatsApp raqamini davlat kodi bilan kiriting.",
  "brief_service": "Sizga nima kerak?",
  "brief_choose": "Xizmatni tanlang…",
  "brief_other": "Boshqa",
  "err_service": "Iltimos, xizmatni tanlang.",
  "brief_msg": "Loyiha tavsifi",
  "brief_msg_ph": "Biznes nima bilan shug'ullanadi va sayt yoki tizim nima qilishi kerak?",
  "err_msg10": "Loyihani bir-ikki gap bilan tushuntiring.",
  "brief_optional": "Byudjet va muddat (ixtiyoriy)",
  "brief_budget": "Byudjet",
  "brief_timeline": "Muddat",
  "brief_skip": "Aytmaslikni afzal ko'raman",
  "bud_1": "$500 dan kam",
  "bud_4": "$4,000 dan ko'p",
  "bud_5": "Hali aniq emas",
  "tl_1": "Imkon qadar tez",
  "tl_2": "Bir oy ichida",
  "tl_3": "1–3 oy",
  "tl_4": "Moslashuvchan",
  "brief_send": "Brifni yuborish",
  "brief_fallback": "To'g'ridan-to'g'ri ham yozishingiz mumkin:",
  "brief_privacy": "Ma'lumotlaringiz faqat shu so'rovga javob berish uchun ishlatiladi.",
  "form_dup": "Bu brif allaqachon qabul qilingan — qayta yuborish shart emas.",
  "form_rate": "Juda ko'p urinish. Bir necha daqiqa kuting yoki to'g'ridan-to'g'ri yozing.",
  "foot_founder": "Asoschisi va rahbari — Max (Mekhriddin Abdualim)",
  "cs_status": "Holat",
  "cs_cta": "Shunga o'xshash loyihani muhokama qilish",
  "cs_status_shokirov": "Ishlayotgan mijoz loyihasi — akademiya har kuni shokirov-academy.vercel.app manzilida foydalanadi.",
  "cs_status_markethub": "Joylashtirishga tayyor mahsulot — sotuvda; so'rov bo'yicha namoyish qilinadi.",
  "pf1x": "ta mahsulot topshirilgan — {live} tasi ishlab turibdi, {ready} tasi deploy'ga tayyor",
  "pf6": "ta startap va tadqiqot yo'nalishi — Startaplar sahifasida →",
  "nav_partners": "Hamkorlar",
  "nav_startups": "Startaplar",
  "su_eyebrow": "UzLeeder Ventures",
  "su_h": "Keyingi bosqichni <em>quramiz.</em>",
  "su_lead": "Real muammolarni hal qiladigan, foydali raqamli mahsulotlar yaratadigan va AI davrida yangi imkoniyatlar ochadigan texnologik loyihalarni quramiz va o'rganamiz.",
  "su_cta1": "Startaplarni ko'rish",
  "su_cta2": "Loyihani muhokama qilish",
  "su_v_k": "Asoschi qarashi",
  "su_v_h": "G'oyalar mahsulotga, mahsulotlar imkoniyatga aylanadi.",
  "su_v_p": "Har bir loyiha hal qilishga arziydigan muammodan boshlanadi. Biz imkoniyatni o'rganamiz, amaliy yechimni loyihalaymiz, mahsulotni quramiz va real foydalanuvchilar fikri asosida yaxshilaymiz.",
  "su_p1_t": "Aniqlash",
  "su_p1_d": "Muhim muammolar va e'tibordan chetda qolgan imkoniyatlarni topish.",
  "su_p2_t": "Qurish",
  "su_p2_d": "Tasdiqlangan g'oyalarni puxta muhandislik va mahsulot dizayni orqali foydali mahsulotga aylantirish.",
  "su_p3_t": "Rivojlantirish",
  "su_p3_d": "Sinash, o'rganish, yaxshilash — va dalillar tasdiqlaganda kengaytirish.",
  "su_d_k": "Katalog",
  "su_d_h": "Bizning loyihalar",
  "su_d_p": "Ishlab chiqayotgan, o'rganayotgan va hayotga tatbiq etayotgan mahsulot va tashabbuslarimiz.",
  "su_filter": "Kategoriya bo'yicha saralash",
  "su_kicker": "Startaplar",
  "su_title": "O'zimiz uchun qurayotgan loyihalar.",
  "su_sub": "UzLeeder'ning o'z mahsulotlari — erta bosqichda va borligicha tasvirlangan. Har birining pitch taqdimoti bor.",
  "su_all": "Startaplar sahifasini ochish",
  "su_note": "“Tadqiqot” — hali ochiq mahsulot yo'q degani. Taqdimotlardagi raqamlar natija emas, faraz.",
  "form_code": "So'rov raqami:",
  "btn_view": "Loyihalarni ko'rish"
 },
 "ru": {
  "tag_live": "Активен",
  "tag_soon": "Скоро",
  "tag_sale": "На продажу",
  "proj_buy": "Запросить",
  "proj_negotiable": "или обсудим",
  "proj_contract": "Открыть договор",
  "proj_certificate": "Открыть сертификат",
  "proj_view": "Открыть сайт",
  "svc1_title": "Сайт академии",
  "svc1": "Полный сайт для академий английского и учебных центров — курсы, цены, контакты и регистрация.",
  "svc2_title": "Профессиональные сайты",
  "svc2": "Профессиональные сайты — от одностраничного лендинга до полноценного многостраничного сайта с бэкендом, для вашего бизнеса.",
  "svc9_title": "AGI-агент и интеграция API",
  "svc9": "Кастомные AI-агенты, чат-боты и интеграции API — соединяют ваши инструменты и автоматизируют работу.",
  "svc10_title": "B2B-портал и платформа",
  "svc10": "Full-stack бизнес-порталы с ролевыми панелями, авторизацией, базой и дашбордами — как настоящий SaaS.",
  "svc11_title": "Telegram-бот и автоматизация",
  "svc11": "Telegram-боты и no-code автоматизации для заказов, заявок и рутинных задач.",
  "svc3_title": "Индивидуальный веб-дизайн",
  "svc3": "Полностью индивидуальный дизайн с уникальным брендингом, цветами и макетом — только для вас.",
  "svc4_title": "Обслуживание сайта",
  "svc4": "Обновления, исправления и улучшения для существующих сайтов. Всегда бесплатно для моих клиентов.",
  "svc5_title": "Дизайн логотипа",
  "svc5": "Уникальные, профессиональные логотипы, отражающие айдентику вашего бренда.",
  "svc6_title": "AI Видео и Фото",
  "svc6": "Потрясающие AI-видео и изображения для вашего бренда, рекламы и соцсетей.",
  "svc7_title": "Написание Email",
  "svc7": "Профессиональные, убедительные письма для рассылок, продаж и бизнес-общения.",
  "svc8_title": "Презентации",
  "svc8": "Яркие, профессиональные слайды для бизнеса, питчей и образования.",
  "from250": "от $250",
  "free_clients": "Бесплатно для клиентов",
  "price_academy": "$200 – $2000",
  "price_web": "$200 – $4000+",
  "price_ai": "от $500",
  "price_b2b": "от $1000",
  "price_bot": "от $100",
  "price_starter": "$200",
  "price_pro": "$600",
  "price_custom": "$1500+",
  "price_ent": "$4000+",
  "from15": "от $15",
  "from10": "от $10",
  "from10b": "от $10",
  "from15b": "от $15",
  "certs_verify": "Проверить",
  "certs_featured_badge": "Государственная сертификация",
  "certs_featured_desc": "Совместная инициатива правительств ОАЭ и Республики Узбекистан по обучению и развитию пяти миллионов человек в области промпт-инжиниринга для ИИ — в рамках Стратегии развития технологий ИИ Узбекистана до 2030 года.",
  "certs_featured2_badge": "Google Cloud · AI",
  "certs_featured2_desc": "Курс от Google Cloud о том, как работает генеративный ИИ, его практическое применение и инструменты за современными ИИ-системами — фундамент сайтов и решений на базе ИИ, которые я создаю.",
  "price_sub": "Никаких скрытых платежей. Что видите — то и платите.",
  "one_time": "разовый платёж",
  "based_req": "по требованиям",
  "popular": "Самый популярный",
  "get_started": "Начать",
  "lets_talk": "Обсудим",
  "f_landing": "Лендинг (1 страница)",
  "f_mobile": "Адаптивный под мобильные",
  "f_contact": "Раздел контактов",
  "f_tg": "Интеграция Telegram",
  "f_3day": "Срок сдачи согласуется в объёме работ",
  "f_support": "Помощь с запуском",
  "f_multi": "Многостраничный сайт",
  "f_custom": "Индивидуальный дизайн и брендинг",
  "f_reg": "Форма регистрации",
  "f_tgphone": "Интеграция Telegram + телефон",
  "f_cms": "CMS (редактируемый контент)",
  "f_5day": "Срок сдачи согласуется в объёме работ",
  "f_forever": "Доступен план поддержки",
  "f_everything": "Всё из Professional",
  "f_adv": "Продвинутые анимации",
  "f_backend": "Интеграция backend",
  "f_domain": "Помощь с доменом",
  "f_priority": "Приоритет в графике",
  "f_lifetime": "Доступен план поддержки",
  "f_everything_custom": "Всё из Custom",
  "f_platform": "Full-stack веб-платформа",
  "f_panels": "Админ-панели с ролями",
  "f_dbapi": "База данных, auth и API",
  "f_deploy": "Развёртывание и обучение",
  "msg_tg": "Написать в Telegram",
  "phone_label": "Телефон",
  "loc_city": "Ташкент Сити, Узбекистан",
  "form_name": "Ваше имя",
  "form_name_ph": "например, Иван Петров",
  "form_email": "Email",
  "form_email_ph": "you@example.com",
  "form_msg": "Сообщение",
  "form_msg_ph": "Расскажите о вашем проекте...",
  "form_send": "Отправить сообщение",
  "form_sending": "Отправка...",
  "form_ok": "Спасибо — бриф получен. Я отвечу в выбранном канале.",
  "form_err": "Не удалось отправить бриф. Ваш текст сохранён — попробуйте ещё раз или напишите напрямую.",
  "form_invalid": "Проверьте выделенные поля.",
  "skip": "Перейти к содержанию",
  "nav_work": "Работы",
  "nav_ai": "AGI-инженерия",
  "nav_about": "О нас",
  "nav_contact": "Контакты",
  "nav_pricing": "Цены",
  "hero_eyebrow": "AGI · UzLeeder · 2026",
  "hero_title": "Инженерия продуктов для <em>эпохи AI.</em>",
  "hero_desc": "Я Макс, основатель и CEO UzLeeder в Ташкенте. AGI — направление, к которому мы движемся; а сдаём мы сегодня реальное, протестированное ПО. Объём, цена и план сдачи согласуются до начала разработки.",
  "btn_work": "Смотреть работы",
  "btn_about": "О UzLeeder",
  "btn_contact": "Связаться",
  "hf_based": "Где",
  "hf_city": "Ташкент, Узбекистан",
  "hf_shipped": "Запущено",
  "hf_products": "2 рабочих продукта",
  "hf_focus": "Фокус",
  "hf_focus_v": "AI-системы · Веб-продукты",
  "sc_now": "Сейчас на экране",
  "cs_open": "Смотреть кейс",
  "v_play": "Воспроизвести видео",
  "v_pause": "Поставить видео на паузу",
  "work_kicker": "Избранные работы",
  "work_title": "Реальные продукты. Реальная инженерия.",
  "port_sub": "Каждый проект здесь — запущенное, работающее ПО. Это доказательство всего остального на этой странице.",
  "certified": "Сертифицировано UzLeeder",
  "m_category": "Категория",
  "m_role": "Роль",
  "m_tech": "Технологии",
  "m_value": "Стоимость проекта",
  "m_why": "Почему это важно",
  "w1_lead": "Full-stack образовательная платформа для реальной математической академии — панели студента, преподавателя и директора за ролевой авторизацией, с онлайн-приёмом, посещаемостью, оплатами, оценками и домашними заданиями.",
  "w1_cat": "Образовательная платформа",
  "w1_role": "Full-stack: продукт, UI, API, база данных",
  "w1_why": "Одна система ведёт приём, обучение и оплаты всей академии — и даёт студентам 5 653 автоматически проверяемых упражнения по 31 теме книги DTM.",
  "w2_lead": "Готовый к развёртыванию B2B-портал бронирования для авиаконсолидаторов. Агентства отправляют заявки из личных кабинетов; команда рассчитывает цену по правилам скидок, вносит PNR авиакомпании и автоматически отправляет фирменный PDF-счёт.",
  "w2_cat": "B2B SaaS · Путешествия",
  "w2_role": "Единственный автор: продукт, backend, безопасность, UI",
  "w2_why": "Мультикомпанейский SaaS с ролевым доступом, 2FA и полным журналом аудита — плюс GDS-парсер, который распознаёт 1 100+ авиакомпаний по сырому тексту PNR.",
  "next_k": "03 — Далее",
  "next_t": "Следующим кейсом может стать ваш продукт.",
  "build_kicker": "Что я создаю",
  "build_title": "Системы, а не просто экраны.",
  "b1_t": "AI-системы",
  "b1_d": "RAG-приложения, ассистенты на базе знаний, AI-воркфлоу и агентные пайплайны.",
  "b2_t": "Продукты с AI",
  "b2_d": "Современные приложения, созданные с AI в процессе — быстрее итерации, та же инженерная дисциплина.",
  "b3_t": "Веб-приложения",
  "b3_d": "Сайты и платформы для реальной эксплуатации — с авторизацией, базами данных и админ-панелями.",
  "b4_t": "Обучающие системы",
  "b4_d": "Образовательные платформы и персональные системы обучения — как платформа Shokirov Math Academy.",
  "b5_t": "Автоматизация",
  "b5_d": "Многошаговые воркфлоу, Telegram-боты и интеграции, которые снимают с людей рутину.",
  "b6_t": "Цифровые продукты",
  "b6_d": "От идеи до развёртывания: продуктовое мышление, дизайн, разработка и запуск.",
  "ai_kicker": "AGI-инженерия",
  "ai_title": "AGI — не украшение. Это часть инженерии.",
  "ai_sub": "Как я на самом деле работаю с моделями — методы, стоящие за продуктами.",
  "pipe_title": "Как идея становится продуктом",
  "p1": "Идея",
  "p1d": "задача и цель",
  "p2": "Промпт",
  "p2d": "инструкции и ограничения",
  "p3": "Модель",
  "p3d": "рассуждение и генерация",
  "p4": "Логика",
  "p4d": "логика приложения",
  "p5": "Система",
  "p5d": "интеграция и процессы",
  "p6": "Продукт",
  "p6d": "продакшн-реализация",
  "p7": "Пользователь",
  "p7d": "реальный результат",
  "ai1_t": "Промпт-инженерия",
  "ai1_d": "Проектирование системных инструкций, ограничений, поведения и структуры ответов для надёжных AGI-приложений.",
  "ai2_t": "Дизайн системных промптов",
  "ai2_d": "Определение роли, правил, тона и поведения при ошибках, чтобы модель работала в продукте стабильно.",
  "ai3_t": "RAG",
  "ai3_d": "Подключение моделей к контролируемым источникам знаний, чтобы ответы опирались на релевантную информацию.",
  "ai4_t": "Ответы в рамках базы знаний",
  "ai4_d": "Удержание ответов в пределах одобренной базы знаний — и честное «не знаю», когда в источнике ответа нет.",
  "ai5_t": "Оркестрация AGI-воркфлоу",
  "ai5_d": "Связка шагов — поиск, рассуждение, генерация, проверка — чтобы несколько возможностей решали одну большую задачу.",
  "ai6_t": "Разработка с AI",
  "ai6_d": "Создание ПО с Claude Code, Cursor и похожими инструментами — архитектура, ревью и тестирование остаются за человеком.",
  "ai7_t": "Мультимодельные воркфлоу",
  "ai7_d": "Выбор подходящей модели для каждого шага — рассуждение, текст, зрение, голос — вместо одной модели на всё.",
  "ai8_t": "Пайплайны генерации контента",
  "ai8_d": "Повторяемые пайплайны для текста, изображений, видео и голоса с Midjourney, Runway, Kling и ElevenLabs.",
  "ai9_t": "Интеллектуальная автоматизация",
  "ai9_d": "n8n, Zapier и собственный код, которые позволяют AGI работать с реальными инструментами — формами, сообщениями, таблицами и API.",
  "brand_title": "Технологический бренд цифровых продуктов, построенный вокруг AGI.",
  "brand_lead": "UzLeeder — бренд, который Max основал, чтобы создавать продукты и системы с помощью современной программной инженерии и AGI. Для лидеров, которым нужны рабочие инструменты, а не украшения.",
  "brand_what": "Что мы создаём",
  "bw1": "AGI-системы",
  "bw2": "Веб-продукты",
  "bw3": "Образовательные платформы",
  "bw4": "Автоматизация",
  "bw5": "Цифровой опыт",
  "brand_vision": "Видение",
  "v1": "Начать с Узбекистана.",
  "v2": "Строить по всей Центральной Азии.",
  "v3": "Масштабироваться глобально.",
  "emblem_cap": "Официальная эмблема",
  "max_kicker": "Основатель",
  "max_roles": "Промпт-инженер · Разработчик с AI · Основатель UzLeeder",
  "max_quote": "«Я не хочу просто пользоваться AI-инструментами. Я строю вокруг них продукты.»",
  "about_p1": "Я Max (Мехриддин Абдуалим), основатель UzLeeder, живу в Ташкенте. Я мыслю как инженер: сначала понимаю проблему, затем проектирую систему, а потом использую AI, чтобы двигаться быстрее без потери качества.",
  "about_p2": "Моя работа — на стыке создания продуктов и AGI-воркфлоу: full-stack платформы, автоматизация и разработка с AI. Я учусь, запуская: каждый проект — эксперимент, который заканчивается работающим ПО.",
  "about_p3": "У меня есть сертификаты по промпт-инженерии в программе «Пять миллионов AI-лидеров» и по генеративному AI от Google Cloud — и я продолжаю учиться с каждым проектом.",
  "pr1": "Инженерное мышление",
  "pr1d": "Сначала система, потом экраны.",
  "pr2": "Создание продуктов",
  "pr2d": "Запущенное лучше идеального.",
  "pr3": "AGI-воркфлоу",
  "pr3d": "Модели — инструмент, а не магия.",
  "pr4": "Эксперименты",
  "pr4d": "Проверить, измерить, повторить.",
  "photo_role": "Основатель · UzLeeder",
  "soon": "Скоро",
  "stack_kicker": "Технологии",
  "stack_title": "Сгруппировано по назначению.",
  "stack_sub": "Только то, чем я пользуюсь в реальной работе — ничего ради моды.",
  "st_ai": "AI и модели",
  "st_lang": "Языки",
  "st_fb": "Frontend и backend",
  "st_data": "Данные и безопасность",
  "st_deploy": "Развёртывание",
  "st_auto": "Автоматизация",
  "st_media": "Креативный AI и дизайн",
  "st_work": "Рабочая среда",
  "proof_kicker": "Факты",
  "proof_title": "Цифры, которые можно проверить.",
  "pf1": "запущенных продукта — один работает, второй готов к развёртыванию",
  "pf2": "автоматически проверяемых упражнений в Shokirov Math Academy",
  "pf3": "тема книги DTM для подготовки к экзамену",
  "pf4": "авиакомпаний распознаёт GDS-парсер MarketHub",
  "pf5": "подтверждённых сертификатов, включая Google Cloud",
  "certs_kicker": "Сертификаты",
  "certs_title": "Подтверждённые знания.",
  "certs_sub": "Пройденные курсы и программы — каждый ведёт на официальную страницу проверки.",
  "doc_title": "Официальный документ об услугах и ценах",
  "price_kicker": "Услуги и цены",
  "price_title": "Чёткий объём. Прозрачные цены.",
  "contact_title": "Обсудим ваш проект.",
  "contact_sub": "Расскажите, что вы строите. Отвечаю быстро — обычно в тот же день, по email или в Telegram.",
  "copy": "Копировать",
  "copied": "Скопировано",
  "copy_fail": "Не удалось скопировать — выделите адрес вручную.",
  "err_name": "Введите ваше имя.",
  "err_email": "Введите корректный email.",
  "err_msg": "Напишите короткое сообщение.",
  "foot_line": "Технологии эпохи AGI. Реальные продукты. Реальная инженерия.",
  "cs_overview": "Обзор",
  "cs_challenge": "Задача",
  "cs_solution": "Что создано",
  "cs_tech": "Технологии",
  "cs_role": "Моя роль",
  "cs_result": "Доказательства",
  "cs_media": "Медиа",
  "cs_arch": "Как это работает",
  "cs_close": "Закрыть кейс",
  "cs_label": "Кейс",
  "roles": [
   "Промпт-инженер",
   "Разработчик с AI",
   "Создатель AGI-систем",
   "Основатель UzLeeder"
  ],
  "cases": {
   "shokirov": {
    "cat": "Образовательная платформа · Работает",
    "lead": "Full-stack образовательная платформа для реальной математической академии — гораздо больше, чем лендинг.",
    "overview": "Shokirov Math Academy работает на платформе с тремя ролевыми панелями — студента, преподавателя и директора. Она покрывает весь цикл академии: онлайн-заявки, зачисление, посещаемость, оплаты, оценки, обратную связь и домашние задания, а также учебное ядро для подготовки к экзамену DTM.",
    "challenge": "Академии была нужна одна система для приёма, обучения и оплат с тремя ролями — и структурированная самопроверяемая подготовка к экзамену для студентов, а не просто сайт с описанием курсов.",
    "solution": "Абитуриенты подают заявку онлайн; преподаватель рассматривает и зачисляет их, затем ведёт посещаемость, оплаты, оценки, обратную связь и домашние задания, а директор контролирует оплаты по всей академии. Студенты решают 5 653 автоматически проверяемых упражнения по 31 теме книги DTM, соревнуются в рейтинге и пользуются языками UZ/EN и тёмной/светлой темой.",
    "role": "Полный цикл силами UzLeeder: планирование продукта, UI, frontend на React, API на Node.js + Express, проектирование базы данных и развёртывание.",
    "result": "Работает в продакшене на shokirov-academy.vercel.app и сдан по подписанному акту о завершении проекта.",
    "arch": [
     [
      "Пользователи",
      "Студенты · преподаватели · директор"
     ],
     [
      "Веб-приложение",
      "Интерфейс на React · UZ/EN · тёмная/светлая тема"
     ],
     [
      "Логика приложения",
      "Serverless API на Node.js + Express в Vercel"
     ],
     [
      "Авторизация и роли",
      "Ролевой доступ на JWT"
     ],
     [
      "База данных",
      "PostgreSQL в Neon"
     ],
     [
      "Результат",
      "Панели · автопроверка · рейтинг · учёт оплат"
     ]
    ]
   },
   "markethub": {
    "cat": "B2B SaaS · Путешествия · Продаётся",
    "lead": "Полностью готовый к развёртыванию B2B-портал бронирования для авиаконсолидаторов и билетных касс.",
    "overview": "MarketHub даёт агентствам-партнёрам личный кабинет для отправки заявок на бронирование, а команда консолидатора рассчитывает, подтверждает и выставляет счёт по каждому заказу. Это мультикомпанейский SaaS с ролевым доступом для супер-админов, админов, операторов и агентств.",
    "challenge": "Консолидаторы получают заявки от множества агентств. Каждый заказ нужно рассчитать по правилам скидок, связать с PNR авиакомпании и выставить счёт — безопасно, отдельно для каждой компании и с понятным журналом аудита.",
    "solution": "Агентства отправляют заявки; операторы рассчитывают каждый заказ по правилам скидок консолидатора, вносят PNR и автоматически отправляют фирменный PDF-счёт. GDS-парсер распознаёт 1 100+ авиакомпаний по сырому тексту PNR. Встроены 2FA, полный журнал аудита, аналитика и учёт аккаунтов. Доступ только по приглашению, приватность заложена в дизайн.",
    "role": "Единственный автор и разработчик, что подтверждает сертификат продукта UzLeeder: дизайн продукта, backend на Python/Flask, модель данных, безопасность и интерфейс.",
    "result": "Полностью готов к развёртыванию. Авторство и право собственности подтверждены UzLeeder; продукт доступен для продажи или лицензирования.",
    "arch": [
     [
      "Пользователи",
      "Агентства-партнёры · операторы · админы"
     ],
     [
      "Веб-приложение",
      "Портал по приглашениям с личными кабинетами агентств"
     ],
     [
      "Логика приложения",
      "Python + Flask — правила цен и поток заказов"
     ],
     [
      "Безопасность",
      "Роли · 2FA · полный журнал аудита"
     ],
     [
      "Данные",
      "SQLite · мультикомпанейность"
     ],
     [
      "Сервисы",
      "GDS-парсер маршрутов · генератор PDF-счетов"
     ],
     [
      "Результат",
      "Рассчитанный заказ + фирменный PDF-счёт"
     ]
    ]
   },
   "academy": {
    "cat": "Образование · Личная учебная система · Продукт UzLeeder",
    "lead": "Закрытая учебная система для одного ученика — не публичная LMS — с курсами и обратной связью, написанными людьми.",
    "overview": "Один ученик проходит фиксированный цикл: план → урок → практика → тест → ошибка → повтор → освоение → проект → обратная связь. Три роли сотрудников — контролёр, преподаватель и преподаватель английского — наблюдают, назначают задания и проверяют их из отдельной панели. Контент написан, а не сгенерирован: 30-дневный курс Python с 300 вопросами, 140-дневная программа IELTS 8.0 с 20 еженедельными тестами, 44 темы грамматики с упражнениями, 72 текста для чтения в формате IELTS, 600 слов, 14 глав DataCamp, 30-дневная программа speaking и 154-дневное расписание, построенное вокруг астрономически рассчитанного времени намаза.",
    "challenge": "Для одновременной подготовки к Python и IELTS 8.0 нужно одно место, которое планирует каждый день, хранит уроки, практику и ошибки вместе, работает без интернета и позволяет преподавателям назначать и проверять задания — без шума публичной платформы и без автоматической AI-оценки.",
    "solution": "Прогрессивное веб-приложение без фреймворка (~41 000 строк JavaScript, в основном написанный вручную контент курсов) и 9 серверных функций Vercel. Offline-first: localStorage всегда основной источник, облако — копия, поэтому два устройства объединяются, а не перезаписывают друг друга. Каждый маршрут защищён сессионной cookie с HMAC-подписью, проверяемой на edge, все четыре роли проверяются на сервере. Каждое задание и каждый отзыв пишет человек.",
    "role": "Единственный дизайнер, архитектор и разработчик — AI-ассистированная разработка под руководством и с проверкой Макса.",
    "result": "Работает на uzleeder-academy.vercel.app. Автоматические проверки: тесты API 72/72, тесты edge middleware 14/14, проверка расписания — каждый шаблон дня покрывает ровно 1 440 минут без пересечений, аудит английской программы — 140/140 дней и 20 еженедельных тестов на месте.",
    "arch": [
     [
      "Пользователи",
      "Ученик · контролёр · преподаватель · преподаватель английского"
     ],
     [
      "Приложение",
      "Offline-first PWA — vanilla JavaScript, Service Worker, IndexedDB"
     ],
     [
      "Учебный цикл",
      "План → урок → практика → тест → ошибки → освоение → проект → отзыв"
     ],
     [
      "Безопасность",
      "Сессионная cookie с HMAC на edge · роли на сервере · PBKDF2"
     ],
     [
      "API",
      "9 серверных функций Vercel"
     ],
     [
      "Данные",
      "localStorage как источник → копия в Neon Postgres · Vercel Blob для медиа"
     ],
     [
      "Результат",
      "Задания и отзывы пишут люди — без AI-оценки"
     ]
    ]
   }
  },
  "ai_tools_label": "Инструменты, которые я здесь использую",
  "tx_1_claude": "длинные структурированные системные промпты",
  "tx_1_chatgpt": "быстрые итерации и тесты промптов",
  "tx_1_gemini": "сравнение ответов разных моделей",
  "tx_2_claude": "роли, правила и тон для ассистентов",
  "tx_2_chatgpt": "настройка поведения ассистента",
  "tx_2_gemini": "проверка стабильности между моделями",
  "tx_3_notebooklm": "ответы на основе моих документов",
  "tx_3_perplexity": "исследования с источниками и цитатами",
  "tx_3_claude": "рассуждение по заданному контексту",
  "tx_4_notebooklm": "ответы только по загруженным источникам",
  "tx_4_claude": "правила «отвечай только из контекста»",
  "tx_4_chatgpt": "файлы знаний со строгими инструкциями",
  "tx_5_n8n": "многошаговые AI-воркфлоу",
  "tx_5_zapier": "связка приложений с AI-шагами",
  "tx_5_claude": "шаг рассуждения внутри процесса",
  "tx_6_claudecode": "крупные задачи прямо из терминала",
  "tx_6_cursor": "парное программирование с AI в редакторе",
  "tx_6_replit": "быстрая сборка и деплой в браузере",
  "tx_6_lovable": "от идеи до рабочего прототипа",
  "tx_7_claude": "рассуждения и длинные документы",
  "tx_7_chatgpt": "тексты и мозговой штурм",
  "tx_7_gemini": "быстрый поиск и анализ",
  "tx_7_perplexity": "живой веб-поиск с цитатами",
  "tx_8_midjourney": "изображения и концепт-арт",
  "tx_8_runway": "монтаж и генерация видео",
  "tx_8_kling": "кинематографичные клипы из текста или фото",
  "tx_8_elevenlabs": "реалистичная озвучка",
  "tx_8_heygen": "видео с AI-аватарами",
  "tx_9_n8n": "автоматизации с AI-узлами",
  "tx_9_zapier": "no-code автоматизация приложений",
  "tx_9_openclaw": "личный AI-ассистент для реальных задач",
  "nav_team": "Команда",
  "team_kicker": "Команда",
  "team_title": "Команда Max.",
  "team_sub": "Один человек принимает решения. AI-команда, где у каждой модели есть своя задача в процессе.",
  "team_count": "1 человек · 12 AI-коллег",
  "team_human": "Человек",
  "team_ai": "AI",
  "team_online": "онлайн",
  "team_note": "AI-системы используются в процессе AI-ассистированной разработки Макса. Это не сотрудники и не владельцы — решения принимает Макс, и он отвечает за каждый релиз.",
  "tm_max_r": "Основатель и CEO · UzLeeder",
  "tm_max_d": "Человек, принимающий решения. Задаёт направление, проектирует системы и отвечает за каждое финальное решение о продукте.",
  "tm_claude_r": "Главный архитектор",
  "tm_claude_d": "В рамках AI-ассистированного процесса: исследование архитектуры, помощь в проектировании систем, техническое рассуждение и рекомендации по реализации.",
  "tm_claudecode_r": "Senior-инженер",
  "tm_claudecode_d": "Делает крупные задачи по коду прямо из терминала.",
  "tm_codex_r": "AI-инженер по коду",
  "tm_codex_d": "Вторая пара рук в коде — рефакторинг, тесты и ревью.",
  "tm_chatgpt_r": "Автор и советник",
  "tm_chatgpt_d": "Пишет черновики текстов, писем и идей — и даёт второе мнение.",
  "tm_gemini_r": "Аналитик-исследователь",
  "tm_gemini_d": "Быстро ищет, сжимает и анализирует информацию.",
  "tm_perplexity_r": "Фактчекер",
  "tm_perplexity_d": "Проверяет утверждения по живым источникам с цитатами.",
  "tm_cursor_r": "Парный программист",
  "tm_cursor_d": "Пишет код вместе со мной прямо в редакторе.",
  "tm_higgsfield_r": "Креативный директор · Видео",
  "tm_higgsfield_d": "Кинематографичные движения камеры и AI-видеоэффекты.",
  "tm_midjourney_r": "Визуальный дизайнер",
  "tm_midjourney_d": "Концепт-арт, визуалы и изображения для бренда.",
  "tm_elevenlabs_r": "Голосовой артист",
  "tm_elevenlabs_d": "Реалистичная озвучка на любом языке.",
  "tm_notebooklm_r": "Библиотекарь знаний",
  "tm_notebooklm_d": "Превращает документы в заметки и аудиообзоры.",
  "tm_n8n_r": "Операционный менеджер",
  "tm_n8n_d": "Управляет автоматизациями, которые связывают всё вместе.",
  "nav_max": "Макс",
  "nav_admin": "Админ",
  "nav_build": "Создать с UzLeeder",
  "era_k": "Эпоха создания с помощью интеллекта",
  "era_line": "AI изменил то, как создаётся софт. <b>UzLeeder создаёт вместе с ним.</b>",
  "pipe_hint": "Выберите этап, чтобы увидеть, что на нём происходит.",
  "px1": "Каждая разработка начинается с реальной задачи, реального пользователя и ясной цели — они записываются до того, как открыта любая модель.",
  "px2": "Задача превращается в точные инструкции: роль, контекст, ограничения, формат ответа и то, чего модель делать не должна.",
  "px3": "Подходящая модель для каждого шага — рассуждение, генерация, зрение или голос — сравнивается на реальных данных, а не по хайпу.",
  "px4": "Логика приложения живёт в коде: валидацию, бизнес-правила и работу с данными пишет, читает и отвечает за них человек.",
  "px5": "API, базы данных, авторизация и процессы связывают части, чтобы результат AI попадал в систему, которой можно доверять.",
  "px6": "Продакшн-реализация — развёрнута, протестирована на реальных устройствах, безопасность и скорость проверены до релиза.",
  "px7": "Ею пользуются реальные люди. Их отзывы и результаты возвращаются в следующую итерацию.",
  "hb_kicker": "Метод",
  "hb_title": "Как я создаю с AGI.",
  "hb_sub": "Спроектировано, направлено, проверено, выпущено.",
  "hb1_t": "Понять",
  "hb1_d": "Поговорить с теми, кто будет пользоваться. Определить задачу, объём и что считать успехом.",
  "hb2_t": "Спроектировать",
  "hb2_d": "Продумать данные, потоки и границы системы до того, как сгенерирована первая строка кода.",
  "hb3_t": "Направить AI",
  "hb3_d": "Дать AI-команде точные инструкции, контекст и ограничения — одна ясная задача за раз.",
  "hb4_t": "Сгенерировать",
  "hb4_d": "AI быстро готовит черновики кода, текстов и медиа — с несколькими вариантами там, где важен выбор.",
  "hb5_t": "Проверить",
  "hb5_d": "Каждое изменение читается, ставится под вопрос и исправляется. Ничего не выпускается только потому, что модель звучала уверенно.",
  "hb6_t": "Протестировать",
  "hb6_d": "Реальные устройства, реальные данные, граничные случаи и проверки безопасности — затем исправление и новый тест.",
  "hb7_t": "Выпустить",
  "hb7_d": "Развернуть, наблюдать и передать — с документацией и поддержкой после запуска.",
  "hb_msg": "AI ускоряет реализацию. <b>Человеческое суждение</b> по-прежнему отвечает за архитектуру, проверку, безопасность, качество и финальные решения о продукте.",
  "team_human_k": "Человек",
  "team_human_n": "Принимает решения",
  "team_ai_k": "AI-команда",
  "team_ai_n": "Помогает внутри процесса",
  "tm_max_rule": "AI помогает. Макс направляет. Макс проверяет.",
  "st_core": "Базовая инженерия",
  "st_aie": "AI-ассистированная инженерия",
  "st_aii": "AGI и интеллект",
  "st_infra": "Инфраструктура",
  "st_design": "Дизайн и рабочие инструменты",
  "st_aie_note": "AI-ассистированный процесс",
  "bw_title": "Создать с UzLeeder.",
  "bw_sub": "Три вида работ — каждый спроектирован, направлен, проверен и выпущен.",
  "bg1_t": "Цифровые продукты",
  "bg1_d": "Сайты, платформы и обучающие системы — от идеи до запуска.",
  "bg2_t": "AI-системы",
  "bg2_d": "Ассистенты, RAG и AI-процессы внутри реальных продуктов.",
  "bg3_t": "Бизнес-системы",
  "bg3_d": "Порталы, админ-панели и автоматизация, которые снимают с людей рутину.",
  "bi_ai": "Ассистенты и RAG",
  "rv_title": "Что говорят клиенты",
  "rv_sub": "Опубликовано с разрешения каждого клиента.",
  "pv_bar": "Предпросмотр черновика — эта версия не опубликована.",
  "pv_exit": "Выйти из предпросмотра",
  "pv_fail": "Для предпросмотра черновика нужна активная сессия администратора.",
  "st_live_own": "Работающий продукт UzLeeder",
  "st_delivered": "Сдан клиенту",
  "own_uzleeder": "Продукт UzLeeder",
  "own_client": "Клиентский проект",
  "st_demo": "Демонстрация",
  "st_dev": "В разработке",
  "st_private": "Закрытый проект",
  "st_concept": "Концепция",
  "st_archived": "В архиве",
  "nav_services": "Услуги",
  "nav_how": "Как мы работаем",
  "btn_discuss": "Обсудить проект",
  "btn_projects": "Смотреть реальные проекты",
  "hero_sub": "Интеллектуальные цифровые продукты, бизнес-системы, сайты и автоматизация — с инженерией под контролем человека.",
  "hero_base": "Базируемся в Узбекистане. Работаем с проектами по всему миру.",
  "pf_k": "Данные о продуктах и возможностях из сданных проектов",
  "st_live_client": "Действующий клиентский проект",
  "st_product": "Продукт, готовый к развёртыванию",
  "svc_title": "Три вещи, которые делает UzLeeder.",
  "svc_sub": "Каждый проект начинается с согласованного объёма работ, цены и плана сдачи.",
  "svc_example": "Пример",
  "svc_start": "Отправить бриф",
  "s1_t": "Бизнес-сайты",
  "s1_d": "Маркетинговые сайты, которые объясняют ваше предложение, вызывают доверие, показывают доказательства и собирают заявки.",
  "s1_i1": "Понятное предложение и страницы услуг",
  "s1_i2": "Доказательства: проекты, сертификаты, отзывы",
  "s1_i3": "Формы заявок с отправкой в Telegram или на email",
  "s1_i4": "Мультиязычность, скорость, адаптация под мобильные",
  "s1_ev": "Этот сайт — создан и поддерживается UzLeeder.",
  "s1_from": "от $200",
  "s2_t": "Бизнес-системы",
  "s2_d": "Порталы, академии, дашборды и внутренние процессы за защищённым входом.",
  "s2_i1": "Доступ по ролям для сотрудников, клиентов или студентов",
  "s2_i2": "Приём заявок, оплаты, учёт и отчёты",
  "s2_i3": "Дашборды и админ-панели",
  "s2_i4": "Ваши данные — в вашей собственной базе",
  "s2_ev": "Shokirov Math Academy · MarketHub",
  "s2_from": "от $1000",
  "s3_t": "AGI-системы",
  "s3_d": "AGI-автоматизация, ассистенты на базе знаний (RAG) и процессы в Telegram — с проверкой человеком там, где это важно.",
  "aiw1": "Вход",
  "aiw2": "Проверенные знания",
  "aiw3": "Обработка AGI",
  "aiw4": "Проверка",
  "aiw5": "Передача человеку",
  "aiw6": "Результат",
  "s3_note": "Ошибки обрабатываются и тестируются. AI не идеален, поэтому в критичных ответах участвует человек.",
  "s3_from": "от $500",
  "price_request": "Цена после согласования объёма",
  "scope_t": "Объём работ согласуется письменно до начала разработки",
  "scope_1": "Результаты — страницы, функции, интеграции",
  "scope_2": "Что не входит",
  "scope_3": "Количество раундов правок",
  "scope_4": "Контент и доступы с вашей стороны",
  "scope_5": "Сторонние расходы: домен, хостинг, платные API",
  "scope_6": "Поддержка после запуска",
  "pkg_t": "Пакеты и стартовые цены",
  "pkg_sub": "Итоговая цена зависит от согласованного объёма.",
  "price_all": "Все услуги и стартовые цены",
  "extras_t": "Дополнительные креативные услуги",
  "defect30": "30 дней исправления ошибок после запуска",
  "doc_self": "Документ UzLeeder · выдан самой компанией",
  "certs_note": "Сертификаты третьих сторон ведут на страницу проверки у выдавшей организации. Документы UzLeeder выдаёт сама UzLeeder — это не независимое подтверждение.",
  "pr_title": "От первого сообщения до запуска.",
  "pr1_t": "Обсуждение",
  "pr1_d": "Вы рассказываете о бизнесе и цели. Я задаю вопросы, пока задача не станет понятной.",
  "pr2_t": "Объём работ",
  "pr2_d": "Письменно согласуем результаты, исключения, зависимости, цену и план сдачи.",
  "pr3_t": "Разработка",
  "pr3_d": "Разработка с регулярными показами. Всё проверяется и тестируется до того, как вы это увидите.",
  "pr4_t": "Сдача",
  "pr4_d": "Развёртывание, передача доступов и документации и согласованный вариант поддержки.",
  "pr_note": "Разработка не начинается, пока объём работ, цена и план сдачи не понятны обеим сторонам.",
  "faq_title": "Вопросы перед началом.",
  "faq1_q": "Что делает UzLeeder?",
  "faq1_a": "Три вещи: бизнес-сайты, которые приводят заявки, бизнес-системы — порталы, академии и дашборды, — и AGI-системы, которые автоматизируют рутину с проверкой человеком.",
  "faq2_q": "Как устроен процесс?",
  "faq2_a": "Обсуждение → объём работ → разработка → сдача. Работа начинается только после письменного согласования объёма, цены и плана сдачи.",
  "faq3_q": "Как используется AI?",
  "faq3_a": "AI помогает быстрее проектировать, писать и тестировать. Макс проверяет каждое изменение и отвечает за архитектуру, безопасность и итоговый результат. Непроверенный результат AI никогда не выпускается.",
  "faq4_q": "Что я получу?",
  "faq4_a": "Работающий развёрнутый продукт, доступы к нему (домен, хостинг, админка), исходный код и краткую документацию — ровно так, как указано в согласованном объёме.",
  "faq5_q": "Как определяется цена?",
  "faq5_a": "По объёму работ: количество страниц или функций, интеграции, контент и сроки. Стартовые цены указаны выше; итоговая цена фиксируется в объёме работ до начала.",
  "faq6_q": "Работаете ли вы с другими странами?",
  "faq6_a": "Да. UzLeeder находится в Ташкенте и удалённо работает с клиентами из других стран на английском, русском и узбекском.",
  "faq7_q": "Как устроены поддержка и обслуживание?",
  "faq7_a": "Поддержка после запуска согласуется в объёме работ — определённый период исправлений или платный план обслуживания. Бессрочных обещаний нет.",
  "brief_intro": "Короткий бриф проекта — я отвечу в выбранном вами канале.",
  "brief_channel": "Удобный канал для ответа",
  "brief_c_telegram": "Username в Telegram или телефон",
  "brief_c_whatsapp": "Номер WhatsApp",
  "brief_c_email": "Адрес email",
  "err_telegram": "Укажите @username в Telegram или номер телефона.",
  "err_whatsapp": "Укажите номер WhatsApp с кодом страны.",
  "brief_service": "Что вам нужно?",
  "brief_choose": "Выберите услугу…",
  "brief_other": "Другое",
  "err_service": "Пожалуйста, выберите услугу.",
  "brief_msg": "Описание проекта",
  "brief_msg_ph": "Чем занимается бизнес и что должен делать сайт или система?",
  "err_msg10": "Опишите проект в одном-двух предложениях.",
  "brief_optional": "Бюджет и сроки (необязательно)",
  "brief_budget": "Бюджет",
  "brief_timeline": "Сроки",
  "brief_skip": "Предпочитаю не указывать",
  "bud_1": "До $500",
  "bud_4": "Более $4,000",
  "bud_5": "Пока не знаю",
  "tl_1": "Как можно скорее",
  "tl_2": "В течение месяца",
  "tl_3": "1–3 месяца",
  "tl_4": "Гибко",
  "brief_send": "Отправить бриф",
  "brief_fallback": "Можно написать и напрямую:",
  "brief_privacy": "Ваши данные используются только для ответа на этот запрос.",
  "form_dup": "Этот бриф уже получен — отправлять повторно не нужно.",
  "form_rate": "Слишком много попыток. Подождите несколько минут или напишите напрямую.",
  "foot_founder": "Основатель и руководитель — Макс (Мехриддин Абдуалим)",
  "cs_status": "Статус",
  "cs_cta": "Обсудить похожий проект",
  "cs_status_shokirov": "Действующий клиентский проект — академия ежедневно использует его на shokirov-academy.vercel.app.",
  "cs_status_markethub": "Продукт, готовый к развёртыванию — продаётся; демонстрация по запросу.",
  "pf1x": "продуктов запущено — {live} работают, {ready} готовы к развёртыванию",
  "pf6": "стартап-проекты и исследовательские направления — на странице «Стартапы» →",
  "nav_partners": "Партнёры",
  "nav_startups": "Стартапы",
  "su_eyebrow": "UzLeeder Ventures",
  "su_h": "Строим то, что <em>будет дальше.</em>",
  "su_lead": "Мы создаём и исследуем технологические проекты, которые решают реальные задачи, дают полезные цифровые продукты и открывают новые возможности эпохи AI.",
  "su_cta1": "Смотреть стартапы",
  "su_cta2": "Обсудить проект",
  "su_v_k": "Взгляд основателя",
  "su_v_h": "Идеи становятся продуктами. Продукты — возможностями.",
  "su_v_p": "Каждый проект начинается с проблемы, которую стоит решить. Мы изучаем возможность, проектируем практичное решение, строим продукт и улучшаем его по реальной обратной связи.",
  "su_p1_t": "Найти",
  "su_p1_d": "Находить значимые проблемы и недооценённые возможности.",
  "su_p2_t": "Построить",
  "su_p2_d": "Превращать проверенные идеи в рабочие продукты через продуманную инженерию и дизайн.",
  "su_p3_t": "Развивать",
  "su_p3_d": "Тестировать, учиться, улучшать и расширяться, когда это подтверждают факты.",
  "su_d_k": "Каталог",
  "su_d_h": "Наши проекты",
  "su_d_p": "Продукты и инициативы, которые мы разрабатываем, исследуем и воплощаем.",
  "su_filter": "Фильтр по категории",
  "su_kicker": "Стартапы",
  "su_title": "Проекты, которые мы строим для себя.",
  "su_sub": "Собственные продукты UzLeeder — на раннем этапе и описаны как есть. У каждого есть питч.",
  "su_all": "Открыть страницу стартапов",
  "su_note": "«Исследование» значит, что публичного продукта пока нет. Цифры в презентациях — гипотезы, а не результаты.",
  "form_code": "Номер заявки:",
  "btn_view": "Смотреть проекты"
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
  "svc9_title": "ایجنت AGI و یکپارچه‌سازی API",
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
  "f_3day": "زمان تحویل در دامنهٔ کار توافق می‌شود",
  "f_support": "کمک در راه‌اندازی",
  "f_multi": "وب‌سایت چندصفحه‌ای",
  "f_custom": "طراحی و برندینگ اختصاصی",
  "f_reg": "فرم ثبت‌نام",
  "f_tgphone": "اتصال تلگرام و تلفن",
  "f_cms": "CMS (محتوای قابل ویرایش)",
  "f_5day": "زمان تحویل در دامنهٔ کار توافق می‌شود",
  "f_forever": "برنامهٔ نگهداری موجود است",
  "f_everything": "همهٔ امکانات Professional",
  "f_adv": "انیمیشن‌های پیشرفته",
  "f_backend": "یکپارچه‌سازی بک‌اند",
  "f_domain": "کمک در راه‌اندازی دامنه",
  "f_priority": "اولویت در زمان‌بندی",
  "f_lifetime": "برنامهٔ نگهداری موجود است",
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
  "form_ok": "سپاس — شرح پروژهٔ شما دریافت شد. در کانال انتخابی شما پاسخ می‌دهم.",
  "form_err": "ارسال انجام نشد. متن شما حفظ شده است — دوباره تلاش کنید یا مستقیم بنویسید.",
  "form_invalid": "لطفاً فیلدهای مشخص‌شده را بررسی کنید.",
  "skip": "رفتن به محتوا",
  "nav_work": "کارها",
  "nav_ai": "مهندسی AGI",
  "nav_about": "درباره",
  "nav_contact": "تماس",
  "nav_pricing": "قیمت‌ها",
  "hero_eyebrow": "AGI · UzLeeder · 2026",
  "hero_title": "مهندسی محصول برای <em>عصر هوش مصنوعی.</em>",
  "hero_desc": "من مکس هستم، بنیان‌گذار و مدیرعامل UzLeeder در تاشکند. AGI جهتی است که به سوی آن می‌سازیم؛ آنچه امروز تحویل می‌دهیم نرم‌افزار واقعی و آزموده است — دامنه، قیمت و برنامهٔ تحویل پیش از شروع توسعه توافق می‌شود.",
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
  "ai_kicker": "مهندسی AGI",
  "ai_title": "AGI تزئین نیست. بخشی از مهندسی است.",
  "ai_sub": "این‌که واقعاً چطور با مدل‌ها کار می‌کنم — روش‌های پشت محصولات.",
  "pipe_title": "ایده چگونه به محصول تبدیل می‌شود",
  "p1": "ایده",
  "p1d": "مسئله و هدف",
  "p2": "پرامپت",
  "p2d": "دستورها و محدودیت‌ها",
  "p3": "مدل",
  "p3d": "استدلال و تولید",
  "p4": "منطق",
  "p4d": "منطق برنامه",
  "p5": "سیستم",
  "p5d": "یکپارچه‌سازی و گردش کار",
  "p6": "محصول",
  "p6d": "پیاده‌سازی در محیط واقعی",
  "p7": "کاربر",
  "p7d": "نتیجهٔ واقعی",
  "ai1_t": "مهندسی پرامپت",
  "ai1_d": "طراحی دستورالعمل‌های سطح سیستم، محدودیت‌ها، رفتار و ساختار خروجی برای برنامه‌های AGI قابل‌اعتماد.",
  "ai2_t": "طراحی System Prompt",
  "ai2_d": "تعیین نقش، قوانین، لحن و رفتار هنگام خطا تا مدل درون محصول رفتاری پایدار داشته باشد.",
  "ai3_t": "RAG",
  "ai3_d": "اتصال مدل‌ها به منابع دانش کنترل‌شده تا پاسخ‌ها بر اطلاعات مرتبط تکیه کنند.",
  "ai4_t": "پاسخ‌های محدود به پایگاه دانش",
  "ai4_d": "نگه داشتن پاسخ‌ها در چارچوب پایگاه دانش تأییدشده — و گفتن «نمی‌دانم» وقتی منبع پاسخی ندارد.",
  "ai5_t": "ارکستراسیون گردش‌کار AGI",
  "ai5_d": "زنجیره کردن مراحل — بازیابی، استدلال، تولید، بررسی — تا چند قابلیت با هم یک کار بزرگ‌تر را انجام دهند.",
  "ai6_t": "توسعهٔ نرم‌افزار با کمک AI",
  "ai6_d": "ساخت نرم‌افزار با Claude Code، Cursor و ابزارهای مشابه، در حالی که معماری، بازبینی و تست در دست انسان می‌ماند.",
  "ai7_t": "گردش‌کارهای چندمدلی",
  "ai7_d": "انتخاب مدل مناسب برای هر مرحله — استدلال، نوشتن، بینایی، صدا — به‌جای تحمیل همه‌چیز به یک مدل.",
  "ai8_t": "پایپ‌لاین‌های تولید محتوا",
  "ai8_d": "پایپ‌لاین‌های تکرارپذیر برای متن، تصویر، ویدیو و صدا با ابزارهایی مانند Midjourney، Runway، Kling و ElevenLabs.",
  "ai9_t": "اتوماسیون هوشمند",
  "ai9_d": "n8n، Zapier و کد سفارشی که به AGI اجازه می‌دهند روی ابزارهای واقعی کار کند — فرم‌ها، پیام‌ها، جدول‌ها و APIها.",
  "brand_title": "برند فناوری و محصول دیجیتال با محوریت AGI.",
  "brand_lead": "UzLeeder برندی است که Max برای ساخت محصولات و سیستم‌ها با مهندسی نرم‌افزار مدرن و AGI بنیان گذاشت — برای رهبرانی که ابزار کارا می‌خواهند، نه تزئین.",
  "brand_what": "چه می‌سازیم",
  "bw1": "سیستم‌های AGI",
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
  "about_p2": "کار من جایی است که ساخت محصول با گردش‌کارهای AGI تلاقی می‌کند — پلتفرم‌های فول‌استک، اتوماسیون و توسعه با کمک AI. با تحویل دادن یاد می‌گیرم: هر پروژه آزمایشی است که به نرم‌افزار کارا ختم می‌شود.",
  "about_p3": "گواهی مهندسی پرامپت را از برنامهٔ «پنج میلیون رهبر هوش مصنوعی» و گواهی هوش مصنوعی مولد را از Google Cloud دارم — و با هر پروژه به یادگیری ادامه می‌دهم.",
  "pr1": "ذهنیت مهندسی",
  "pr1d": "اول سیستم، بعد صفحه.",
  "pr2": "ساخت محصول",
  "pr2d": "تحویل‌شده بهتر از بی‌نقص.",
  "pr3": "گردش‌کارهای AGI",
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
  "contact_title": "دربارهٔ پروژهٔ شما گفت‌وگو کنیم.",
  "contact_sub": "بگویید چه می‌سازید. سریع پاسخ می‌دهم — معمولاً همان روز، از طریق ایمیل یا تلگرام.",
  "copy": "کپی",
  "copied": "کپی شد",
  "copy_fail": "کپی نشد — آدرس را انتخاب کنید.",
  "err_name": "لطفاً نام خود را وارد کنید.",
  "err_email": "لطفاً یک ایمیل معتبر وارد کنید.",
  "err_msg": "لطفاً یک پیام کوتاه بنویسید.",
  "foot_line": "فناوری عصر AGI. محصولات واقعی. مهندسی واقعی.",
  "cs_overview": "نمای کلی",
  "cs_challenge": "مسئله",
  "cs_solution": "آنچه ساخته شد",
  "cs_tech": "فناوری",
  "cs_role": "نقش من",
  "cs_result": "مدرک",
  "cs_media": "رسانه",
  "cs_arch": "چگونه کار می‌کند",
  "cs_close": "بستن مطالعهٔ موردی",
  "cs_label": "مطالعهٔ موردی",
  "roles": [
   "مهندس پرامپت",
   "توسعه‌دهنده با کمک AI",
   "سازندهٔ سیستم‌های AGI",
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
  "team_sub": "یک انسان تصمیم‌گیرنده. یک تیم AI که هر مدل در آن وظیفه‌ای مشخص در گردش کار دارد.",
  "team_count": "۱ انسان · ۱۲ هم‌تیمی AI",
  "team_human": "انسان",
  "team_ai": "AI",
  "team_online": "آنلاین",
  "team_note": "سیستم‌های AI بخشی از روند مهندسی مکس با کمک AI هستند. آن‌ها کارمند یا مالک نیستند — تصمیم‌ها را مکس می‌گیرد و مسئول هر انتشار است.",
  "tm_max_r": "بنیان‌گذار و مدیرعامل · UzLeeder",
  "tm_max_d": "تصمیم‌گیرندهٔ انسانی. مسیر را تعیین می‌کند، سیستم‌ها را طراحی می‌کند و مسئول هر تصمیم نهایی محصول است.",
  "tm_claude_r": "معمار ارشد",
  "tm_claude_d": "درون گردش کار مبتنی بر AI: کاوش معماری، پشتیبانی طراحی سیستم، استدلال فنی و راهنمایی پیاده‌سازی.",
  "tm_claudecode_r": "مهندس ارشد",
  "tm_claudecode_d": "کارهای بزرگ کدنویسی را مستقیم از ترمینال انجام می‌دهد.",
  "tm_codex_r": "مهندس کدنویسی AI",
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
   },
   "academy": {
    "cat": "آموزش · سامانهٔ یادگیری شخصی · محصول UzLeeder",
    "lead": "سامانهٔ آموزشی خصوصی برای یک یادگیرنده — نه یک LMS عمومی — با دوره‌ها و بازخوردهایی که انسان نوشته است.",
    "overview": "یک دانش‌آموز چرخه‌ای ثابت را دنبال می‌کند: برنامه ← درس ← تمرین ← آزمون ← اشتباه ← تکرار ← تسلط ← پروژه ← بازخورد. سه نقش کارکنان — ناظر، معلم و معلم زبان انگلیسی — از پنلی جداگانه پایش، تکلیف و بازبینی می‌کنند. محتوا نوشته شده، نه تولیدشده: دورهٔ ۳۰ روزهٔ پایتون با ۳۰۰ سؤال، مسیر ۱۴۰ روزهٔ IELTS 8.0 با ۲۰ آزمون هفتگی، ۴۴ موضوع گرامر با تمرین، ۷۲ متن خواندن در قالب IELTS، ۶۰۰ واژه، مسیر ۱۴ فصلی DataCamp، برنامهٔ ۳۰ روزهٔ speaking و برنامهٔ روزانهٔ ۱۵۴ روزه بر پایهٔ اوقات نماز محاسبه‌شده به‌صورت نجومی.",
    "challenge": "آمادگی هم‌زمان برای پایتون و IELTS 8.0 به یک جا نیاز دارد که هر روز را برنامه‌ریزی کند، درس و تمرین و اشتباه‌ها را کنار هم نگه دارد، بدون اینترنت کار کند و به معلمان اجازهٔ تکلیف و بازبینی بدهد — بدون شلوغی یک پلتفرم عمومی و بدون نمره‌دهی خودکار هوش مصنوعی.",
    "solution": "یک وب‌اپلیکیشن پیش‌رونده بدون فریم‌ورک (حدود ۴۱٬۰۰۰ خط جاوااسکریپت، بیشتر محتوای دستیِ دوره‌ها) و ۹ تابع serverless در Vercel. Offline-first است: localStorage همیشه منبع اصلی است و ابر یک نسخه — پس دو دستگاه به‌جای بازنویسی، ادغام می‌شوند. هر مسیر پشت کوکی نشستِ امضاشده با HMAC است که در edge بررسی می‌شود و هر چهار نقش در سرور اعمال می‌شوند. هر تکلیف و هر بازخورد را انسان می‌نویسد.",
    "role": "تنها طراح، معمار و توسعه‌دهنده — با گردش‌کار به‌کمک هوش مصنوعی، با هدایت و اعتبارسنجی مکس.",
    "result": "در uzleeder-academy.vercel.app فعال است. بررسی‌های خودکار: آزمون‌های API ‏۷۲/۷۲، آزمون‌های edge middleware ‏۱۴/۱۴، اعتبارسنجی برنامه — هر قالب روز دقیقاً ۱٬۴۴۰ دقیقه بدون هم‌پوشانی، ممیزی مسیر انگلیسی — ۱۴۰/۱۴۰ روز و ۲۰ آزمون هفتگی.",
    "arch": [
     [
      "کاربران",
      "دانش‌آموز · ناظر · معلم · معلم انگلیسی"
     ],
     [
      "اپلیکیشن",
      "PWA آفلاین‌محور — جاوااسکریپت خالص، Service Worker، IndexedDB"
     ],
     [
      "چرخهٔ یادگیری",
      "برنامه ← درس ← تمرین ← آزمون ← اشتباه‌ها ← تسلط ← پروژه ← بازخورد"
     ],
     [
      "امنیت",
      "کوکی نشست امضاشده با HMAC در edge · نقش‌ها در سرور · PBKDF2"
     ],
     [
      "API",
      "۹ تابع serverless در Vercel"
     ],
     [
      "داده",
      "localStorage منبع اصلی ← نسخه در Neon Postgres · Vercel Blob برای رسانه"
     ],
     [
      "خروجی",
      "تکلیف و بازخورد نوشتهٔ انسان — بدون نمره‌دهی هوش مصنوعی"
     ]
    ]
   }
  },
  "nav_max": "مکس",
  "nav_admin": "مدیریت",
  "nav_build": "با UzLeeder بسازید",
  "era_k": "عصر ساختن با هوش",
  "era_line": "AI شیوهٔ ساختن نرم‌افزار را تغییر داد. <b>UzLeeder با آن می‌سازد.</b>",
  "pipe_hint": "یک مرحله را انتخاب کنید تا ببینید آنجا چه اتفاقی می‌افتد.",
  "px1": "هر ساخت با یک مسئلهٔ واقعی، یک کاربر واقعی و یک هدف روشن شروع می‌شود — پیش از آنکه هیچ مدلی باز شود، نوشته می‌شود.",
  "px2": "مسئله به دستورهای دقیق تبدیل می‌شود: نقش، زمینه، محدودیت‌ها، قالب خروجی و کارهایی که مدل هرگز نباید انجام دهد.",
  "px3": "مدل مناسب برای هر مرحله — استدلال، تولید، تصویر یا صدا — بر اساس ورودی‌های واقعی مقایسه می‌شود، نه هیاهو.",
  "px4": "منطق برنامه در کد می‌ماند: اعتبارسنجی، قواعد کسب‌وکار و مدیریت داده را انسان می‌نویسد، می‌خواند و مسئولیتش را می‌پذیرد.",
  "px5": "APIها، پایگاه داده، احراز هویت و گردش‌کارها بخش‌ها را به هم وصل می‌کنند تا خروجی AI درون سیستمی قابل‌اعتماد قرار گیرد.",
  "px6": "پیاده‌سازی واقعی — منتشرشده، آزموده روی دستگاه‌های واقعی، با بررسی امنیت و کارایی پیش از انتشار.",
  "px7": "آدم‌های واقعی از آن استفاده می‌کنند. بازخورد و نتایجشان به تکرار بعدی برمی‌گردد.",
  "hb_kicker": "روش",
  "hb_title": "چگونه با AGI می‌سازم.",
  "hb_sub": "طراحی‌شده، هدایت‌شده، تأییدشده، منتشرشده.",
  "hb1_t": "درک",
  "hb1_d": "با کسانی که از آن استفاده می‌کنند حرف می‌زنم. مسئله، دامنه و معنای موفقیت را تعریف می‌کنم.",
  "hb2_t": "معماری",
  "hb2_d": "پیش از تولید حتی یک خط کد، داده‌ها، جریان‌ها و مرزهای سیستم را طراحی می‌کنم.",
  "hb3_t": "هدایت AI",
  "hb3_d": "به تیم AI دستور، زمینه و محدودیت دقیق می‌دهم — هر بار یک کار روشن.",
  "hb4_t": "تولید",
  "hb4_d": "AI کد، متن و رسانه را سریع آماده می‌کند — و جایی که انتخاب مهم است، چند گزینه.",
  "hb5_t": "بازبینی",
  "hb5_d": "هر تغییر خوانده، پرسیده و اصلاح می‌شود. هیچ چیز فقط چون مدل مطمئن به نظر رسید منتشر نمی‌شود.",
  "hb6_t": "آزمون",
  "hb6_d": "دستگاه‌های واقعی، دادهٔ واقعی، حالت‌های مرزی و بررسی امنیت — سپس اصلاح و آزمون دوباره.",
  "hb7_t": "انتشار",
  "hb7_d": "استقرار، پایش و تحویل — همراه با مستندات و پشتیبانی پس از راه‌اندازی.",
  "hb_msg": "AI پیاده‌سازی را سریع‌تر می‌کند. <b>قضاوت انسانی</b> مسئول معماری، اعتبارسنجی، امنیت، کیفیت و تصمیم‌های نهایی محصول است.",
  "team_human_k": "تیم انسانی",
  "team_human_n": "تصمیم‌گیرنده",
  "team_ai_k": "تیم AI",
  "team_ai_n": "کمک درون گردش کار",
  "tm_max_rule": "AI کمک می‌کند. مکس هدایت می‌کند. مکس تأیید می‌کند.",
  "st_core": "مهندسی پایه",
  "st_aie": "مهندسی با کمک AI",
  "st_aii": "AGI و هوش",
  "st_infra": "زیرساخت",
  "st_design": "طراحی و فضای کار",
  "st_aie_note": "گردش کار با کمک AI",
  "bw_title": "با UzLeeder بسازید.",
  "bw_sub": "سه نوع کار — هر کدام طراحی‌شده، هدایت‌شده، تأییدشده و منتشرشده.",
  "bg1_t": "محصولات دیجیتال",
  "bg1_d": "وب‌سایت‌ها، پلتفرم‌ها و سیستم‌های آموزشی — از ایده تا استقرار.",
  "bg2_t": "سیستم‌های AI",
  "bg2_d": "دستیارها، RAG و گردش‌کارهای AI که درون محصولات واقعی کار می‌کنند.",
  "bg3_t": "سیستم‌های کسب‌وکار",
  "bg3_d": "پورتال‌ها، پنل‌های مدیریت و اتوماسیون‌هایی که کارهای تکراری را از دوش افراد برمی‌دارند.",
  "bi_ai": "دستیارها و RAG",
  "rv_title": "نظر مشتریان",
  "rv_sub": "با اجازهٔ هر مشتری منتشر شده است.",
  "pv_bar": "پیش‌نمایش پیش‌نویس — این نسخه منتشر نشده است.",
  "pv_exit": "خروج از پیش‌نمایش",
  "pv_fail": "پیش‌نمایش پیش‌نویس به نشست فعال مدیر نیاز دارد.",
  "st_live_own": "محصول فعال UzLeeder",
  "st_delivered": "تحویل‌شده به مشتری",
  "own_uzleeder": "محصول UzLeeder",
  "own_client": "پروژهٔ مشتری",
  "st_demo": "نمایشی",
  "st_dev": "در حال توسعه",
  "st_private": "پروژهٔ خصوصی",
  "st_concept": "مفهومی",
  "st_archived": "بایگانی‌شده",
  "nav_services": "خدمات",
  "nav_how": "روند کار",
  "btn_discuss": "گفت‌وگو دربارهٔ پروژه",
  "btn_projects": "دیدن پروژه‌های واقعی",
  "hero_sub": "محصولات دیجیتال هوشمند، سیستم‌های کسب‌وکار، وب‌سایت و اتوماسیون — با مهندسی تحت کنترل انسان.",
  "hero_base": "مستقر در ازبکستان. آماده برای پروژه‌هایی در سراسر جهان.",
  "pf_k": "داده‌های محصول و توانایی از پروژه‌های تحویل‌شده",
  "st_live_client": "پروژهٔ فعال مشتری",
  "st_product": "محصول آمادهٔ استقرار",
  "svc_title": "سه چیزی که UzLeeder می‌سازد.",
  "svc_sub": "هر پروژه با دامنهٔ کار، قیمت و برنامهٔ تحویلِ توافق‌شده آغاز می‌شود.",
  "svc_example": "نمونه",
  "svc_start": "ارسال شرح پروژه",
  "s1_t": "وب‌سایت‌های کسب‌وکار",
  "s1_d": "وب‌سایت‌های بازاریابی که پیشنهاد شما را توضیح می‌دهند، اعتماد می‌سازند، مدرک نشان می‌دهند و درخواست جذب می‌کنند.",
  "s1_i1": "صفحه‌های روشن پیشنهاد و خدمات",
  "s1_i2": "مدرک: پروژه‌ها، گواهی‌ها، نظرها",
  "s1_i3": "فرم‌های درخواست با ارسال به تلگرام یا ایمیل",
  "s1_i4": "چندزبانه، سریع و سازگار با موبایل",
  "s1_ev": "همین وب‌سایت — ساخته و ادارهٔ UzLeeder.",
  "s1_from": "از $200",
  "s2_t": "سیستم‌های کسب‌وکار",
  "s2_d": "پورتال‌ها، آکادمی‌ها، داشبوردها و فرایندهای داخلی پشت ورود امن.",
  "s2_i1": "دسترسی بر اساس نقش برای کارکنان، مشتریان یا دانشجویان",
  "s2_i2": "پذیرش، پرداخت، سوابق و گزارش‌ها",
  "s2_i3": "داشبوردها و پنل‌های مدیریت",
  "s2_i4": "داده‌های شما در پایگاه‌دادهٔ خودتان",
  "s2_ev": "Shokirov Math Academy · MarketHub",
  "s2_from": "از $1000",
  "s3_t": "سیستم‌های AGI",
  "s3_d": "اتوماسیون AGI، دستیارهای دانش (RAG) و فرایندهای تلگرامی — با بررسی انسانی هر جا که مهم است.",
  "aiw1": "ورودی",
  "aiw2": "دانش تأییدشده",
  "aiw3": "پردازش AGI",
  "aiw4": "اعتبارسنجی",
  "aiw5": "واگذاری به انسان",
  "aiw6": "خروجی",
  "s3_note": "خطاها مدیریت و آزمایش می‌شوند. AI بی‌نقص نیست، پس در پاسخ‌های حساس یک انسان حضور دارد.",
  "s3_from": "از $500",
  "price_request": "قیمت پس از تعیین دامنه",
  "scope_t": "دامنهٔ هر کار پیش از توسعه به‌صورت کتبی توافق می‌شود",
  "scope_1": "خروجی‌ها — صفحه‌ها، قابلیت‌ها، یکپارچه‌سازی‌ها",
  "scope_2": "آنچه شامل نمی‌شود",
  "scope_3": "تعداد دورهای اصلاح",
  "scope_4": "محتوا و دسترسی‌هایی که شما فراهم می‌کنید",
  "scope_5": "هزینه‌های شخص ثالث: دامنه، میزبانی، APIهای پولی",
  "scope_6": "نگهداری پس از راه‌اندازی",
  "pkg_t": "بسته‌ها و قیمت‌های شروع",
  "pkg_sub": "قیمت نهایی به دامنهٔ توافق‌شده بستگی دارد.",
  "price_all": "همهٔ خدمات و قیمت‌های شروع",
  "extras_t": "خدمات خلاقانهٔ جانبی",
  "defect30": "۳۰ روز رفع خطا پس از راه‌اندازی",
  "doc_self": "سند UzLeeder · صادرشده توسط خود شرکت",
  "certs_note": "گواهی‌های شخص ثالث به صفحهٔ تأیید صادرکننده پیوند دارند. اسناد UzLeeder را خود UzLeeder صادر می‌کند و تأیید مستقل نیستند.",
  "pr_title": "از اولین پیام تا راه‌اندازی.",
  "pr1_t": "گفت‌وگو",
  "pr1_d": "شما کسب‌وکار و هدف را شرح می‌دهید. تا روشن شدن مسئله سؤال می‌پرسم.",
  "pr2_t": "دامنهٔ کار",
  "pr2_d": "خروجی‌ها، استثناها، وابستگی‌ها، قیمت و برنامهٔ تحویل را کتبی توافق می‌کنیم.",
  "pr3_t": "ساخت",
  "pr3_d": "توسعه با پیش‌نمایش‌های منظم. همه‌چیز پیش از دیدن شما بررسی و آزمایش می‌شود.",
  "pr4_t": "تحویل",
  "pr4_d": "استقرار، تحویل دسترسی‌ها و مستندات و یک گزینهٔ نگهداریِ توافق‌شده.",
  "pr_note": "تا زمانی که دامنه، قیمت و برنامهٔ تحویل برای هر دو طرف روشن نباشد، توسعه آغاز نمی‌شود.",
  "faq_title": "پرسش‌ها پیش از شروع.",
  "faq1_q": "UzLeeder چه می‌سازد؟",
  "faq1_a": "سه چیز: وب‌سایت‌های کسب‌وکار که درخواست جذب می‌کنند، سیستم‌های کسب‌وکار مانند پورتال، آکادمی و داشبورد، و سیستم‌های AGI که کارهای تکراری را با بررسی انسانی خودکار می‌کنند.",
  "faq2_q": "روند کار چگونه است؟",
  "faq2_a": "گفت‌وگو ← دامنهٔ کار ← ساخت ← تحویل. توسعه تنها پس از توافق کتبی بر دامنه، قیمت و برنامهٔ تحویل آغاز می‌شود.",
  "faq3_q": "AI چگونه استفاده می‌شود؟",
  "faq3_a": "AI طراحی، نوشتن و آزمایش را سریع‌تر می‌کند. مکس هر تغییر را بررسی می‌کند و مسئول معماری، امنیت و نتیجهٔ نهایی است. خروجی AI هرگز بدون بررسی منتشر نمی‌شود.",
  "faq4_q": "چه چیزی دریافت می‌کنم؟",
  "faq4_a": "محصولی کارا و مستقرشده، دسترسی به آن (دامنه، میزبانی، پنل مدیریت)، کد منبع و مستندات کوتاه — دقیقاً مطابق دامنهٔ توافق‌شده.",
  "faq5_q": "قیمت چگونه تعیین می‌شود؟",
  "faq5_a": "بر اساس دامنه: تعداد صفحه‌ها یا قابلیت‌ها، یکپارچه‌سازی‌ها، محتوا و مهلت‌ها. قیمت‌های شروع در بالا آمده‌اند؛ قیمت نهایی پیش از شروع در دامنهٔ کار ثبت می‌شود.",
  "faq6_q": "با کشورهای دیگر کار می‌کنید؟",
  "faq6_a": "بله. UzLeeder در تاشکند است و از راه دور با مشتریان کشورهای دیگر به انگلیسی، روسی و ازبکی کار می‌کند.",
  "faq7_q": "نگهداری و پشتیبانی چگونه است؟",
  "faq7_a": "پشتیبانی پس از راه‌اندازی در دامنهٔ کار توافق می‌شود — دوره‌ای مشخص برای رفع خطا یا برنامهٔ نگهداری پولی. هیچ وعدهٔ بی‌پایانی وجود ندارد.",
  "brief_intro": "شرح کوتاه پروژه — در کانالی که انتخاب می‌کنید پاسخ می‌دهم.",
  "brief_channel": "کانال پاسخ دلخواه",
  "brief_c_telegram": "نام کاربری تلگرام یا تلفن",
  "brief_c_whatsapp": "شمارهٔ واتس‌اپ",
  "brief_c_email": "نشانی ایمیل",
  "err_telegram": "‏@username تلگرام یا شمارهٔ تلفن را وارد کنید.",
  "err_whatsapp": "شمارهٔ واتس‌اپ را با کد کشور وارد کنید.",
  "brief_service": "به چه چیزی نیاز دارید؟",
  "brief_choose": "یک خدمت انتخاب کنید…",
  "brief_other": "دیگر",
  "err_service": "لطفاً یک خدمت انتخاب کنید.",
  "brief_msg": "شرح پروژه",
  "brief_msg_ph": "کسب‌وکار چیست و وب‌سایت یا سیستم باید چه کاری انجام دهد؟",
  "err_msg10": "لطفاً پروژه را در یکی دو جمله شرح دهید.",
  "brief_optional": "بودجه و زمان‌بندی (اختیاری)",
  "brief_budget": "بودجه",
  "brief_timeline": "زمان‌بندی",
  "brief_skip": "ترجیح می‌دهم نگویم",
  "bud_1": "کمتر از $500",
  "bud_4": "بیش از $4,000",
  "bud_5": "هنوز مطمئن نیستم",
  "tl_1": "هرچه زودتر",
  "tl_2": "ظرف یک ماه",
  "tl_3": "۱ تا ۳ ماه",
  "tl_4": "انعطاف‌پذیر",
  "brief_send": "ارسال شرح پروژه",
  "brief_fallback": "می‌توانید مستقیم هم بنویسید:",
  "brief_privacy": "اطلاعات شما فقط برای پاسخ به همین درخواست استفاده می‌شود.",
  "form_dup": "این شرح پروژه قبلاً دریافت شده است — نیازی به ارسال دوباره نیست.",
  "form_rate": "تلاش‌های زیاد. چند دقیقه صبر کنید یا مستقیم بنویسید.",
  "foot_founder": "بنیان‌گذار و مدیر: مکس (مهرالدین عبدالعلیم)",
  "cs_status": "وضعیت",
  "cs_cta": "گفت‌وگو دربارهٔ پروژه‌ای مشابه",
  "cs_status_shokirov": "پروژهٔ فعال مشتری — آکادمی هر روز در shokirov-academy.vercel.app از آن استفاده می‌کند.",
  "cs_status_markethub": "محصول آمادهٔ استقرار — برای فروش عرضه شده؛ نمایش حضوری در صورت درخواست.",
  "pf1x": "محصول تحویل‌شده — {live} فعال، {ready} آمادهٔ استقرار",
  "pf6": "پروژهٔ استارتاپی و مسیر پژوهشی — در صفحهٔ استارتاپ‌ها ←",
  "nav_partners": "همکاران",
  "nav_startups": "استارتاپ‌ها",
  "su_eyebrow": "UzLeeder Ventures",
  "su_h": "ساختن <em>آنچه در راه است.</em>",
  "su_lead": "ما پروژه‌های فناوری می‌سازیم و بررسی می‌کنیم که مشکلات واقعی را حل کنند، محصولات دیجیتال مفید بسازند و امکانات تازه‌ای در عصر AI بگشایند.",
  "su_cta1": "مشاهدهٔ استارتاپ‌ها",
  "su_cta2": "گفت‌وگو دربارهٔ یک پروژه",
  "su_v_k": "دیدگاه بنیان‌گذار",
  "su_v_h": "ایده‌ها محصول می‌شوند. محصولات، امکان.",
  "su_v_p": "هر پروژه با مشکلی آغاز می‌شود که ارزش حل کردن دارد. فرصت را بررسی می‌کنیم، راه‌حلی عملی طراحی می‌کنیم، محصول را می‌سازیم و با بازخورد واقعی بهبود می‌دهیم.",
  "su_p1_t": "شناسایی",
  "su_p1_d": "یافتن مشکلات مهم و فرصت‌های نادیده‌گرفته‌شده.",
  "su_p2_t": "ساختن",
  "su_p2_d": "تبدیل ایده‌های سنجیده به محصولات کاربردی با مهندسی و طراحی دقیق.",
  "su_p3_t": "تکامل",
  "su_p3_d": "آزمودن، یادگرفتن، بهبود و گسترش وقتی شواهد آن را تأیید کنند.",
  "su_d_k": "فهرست",
  "su_d_h": "پروژه‌های ما",
  "su_d_p": "محصولات و ابتکاراتی که در حال توسعه، پژوهش و تحقق آن‌ها هستیم.",
  "su_filter": "فیلتر بر اساس دسته",
  "su_kicker": "استارتاپ‌ها",
  "su_title": "پروژه‌هایی که برای خودمان می‌سازیم.",
  "su_sub": "محصولات خود UzLeeder — در مراحل اولیه و همان‌طور که هستند. هر کدام ارائهٔ پیچ دارد.",
  "su_all": "مشاهدهٔ صفحهٔ استارتاپ‌ها",
  "su_note": "«پژوهش» یعنی هنوز محصول عمومی وجود ندارد. اعداد ارائه‌ها فرضیه‌اند، نه نتیجه.",
  "form_code": "شمارهٔ درخواست:",
  "btn_view": "دیدن پروژه‌ها"
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
  "svc9_title": "وكلاء AGI وتكامل API",
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
  "f_3day": "موعد التسليم يُحدَّد في نطاق العمل",
  "f_support": "مساعدة في الإطلاق",
  "f_multi": "موقع متعدد الصفحات",
  "f_custom": "تصميم وهوية مخصصة",
  "f_reg": "نموذج تسجيل",
  "f_tgphone": "ربط تيليجرام والهاتف",
  "f_cms": "CMS (محتوى قابل للتعديل)",
  "f_5day": "موعد التسليم يُحدَّد في نطاق العمل",
  "f_forever": "خطة صيانة متاحة",
  "f_everything": "كل مزايا Professional",
  "f_adv": "حركات متقدمة",
  "f_backend": "تكامل الخلفية البرمجية",
  "f_domain": "مساعدة في إعداد النطاق",
  "f_priority": "أولوية في الجدول",
  "f_lifetime": "خطة صيانة متاحة",
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
  "form_ok": "شكرًا — استلمنا وصف مشروعك. سأرد عبر القناة التي اخترتها.",
  "form_err": "تعذّر الإرسال. نصّك محفوظ — حاول مرة أخرى أو اكتب مباشرة.",
  "form_invalid": "يرجى مراجعة الحقول المحددة.",
  "skip": "انتقل إلى المحتوى",
  "nav_work": "الأعمال",
  "nav_ai": "هندسة AGI",
  "nav_about": "من نحن",
  "nav_contact": "تواصل",
  "nav_pricing": "الأسعار",
  "hero_eyebrow": "AGI · UzLeeder · 2026",
  "hero_title": "هندسة منتجات <em>لعصر الذكاء الاصطناعي.</em>",
  "hero_desc": "أنا ماكس، مؤسس UzLeeder ورئيسها التنفيذي في طشقند. AGI هو الاتجاه الذي نبني نحوه؛ أما ما نسلّمه اليوم فهو برمجيات حقيقية ومختبرة — مع الاتفاق على النطاق والسعر وخطة التسليم قبل بدء التطوير.",
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
  "ai_kicker": "هندسة AGI",
  "ai_title": "AGI ليس زينة. إنه جزء من الهندسة.",
  "ai_sub": "كيف أعمل فعلًا مع النماذج — الأساليب التي تقف خلف المنتجات.",
  "pipe_title": "كيف تتحول الفكرة إلى منتج",
  "p1": "فكرة",
  "p1d": "المشكلة والهدف",
  "p2": "الأمر",
  "p2d": "التعليمات والقيود",
  "p3": "النموذج",
  "p3d": "الاستدلال والتوليد",
  "p4": "المنطق",
  "p4d": "منطق التطبيق",
  "p5": "النظام",
  "p5d": "التكامل وسير العمل",
  "p6": "المنتج",
  "p6d": "التنفيذ الإنتاجي",
  "p7": "المستخدم",
  "p7d": "نتيجة حقيقية",
  "ai1_t": "هندسة الأوامر",
  "ai1_d": "تصميم تعليمات على مستوى النظام وقيود وسلوك وبنية مخرجات لتطبيقات ذكاء اصطناعي موثوقة.",
  "ai2_t": "تصميم أوامر النظام",
  "ai2_d": "تحديد الدور والقواعد والنبرة وسلوك الفشل ليتصرف النموذج بثبات داخل المنتج.",
  "ai3_t": "RAG",
  "ai3_d": "ربط النماذج بمصادر معرفة مضبوطة لتستند الإجابات إلى معلومات ذات صلة.",
  "ai4_t": "إجابات مقيدة بقاعدة المعرفة",
  "ai4_d": "إبقاء الإجابات ضمن قاعدة معرفة معتمدة — وقول «لا أعرف» حين يصمت المصدر.",
  "ai5_t": "تنسيق سير عمل AGI",
  "ai5_d": "ربط الخطوات — استرجاع، استدلال، توليد، تحقق — لتنجز عدة قدرات مهمة واحدة أكبر.",
  "ai6_t": "التطوير بمساعدة AI",
  "ai6_d": "بناء البرمجيات باستخدام Claude Code وCursor وأدوات مشابهة، مع بقاء المعمارية والمراجعة والاختبار بيد الإنسان.",
  "ai7_t": "سير عمل متعدد النماذج",
  "ai7_d": "اختيار النموذج المناسب لكل خطوة — استدلال، كتابة، رؤية، صوت — بدل تحميل نموذج واحد كل شيء.",
  "ai8_t": "خطوط إنتاج المحتوى",
  "ai8_d": "خطوط قابلة للتكرار للنص والصورة والفيديو والصوت بأدوات مثل Midjourney وRunway وKling وElevenLabs.",
  "ai9_t": "الأتمتة الذكية",
  "ai9_d": "n8n وZapier وكود مخصص يتيح للذكاء الاصطناعي العمل على أدوات حقيقية — نماذج ورسائل وجداول وAPIs.",
  "brand_title": "علامة تقنية ومنتجات رقمية تضع AGI أولًا.",
  "brand_lead": "UzLeeder علامة أسسها Max لبناء منتجات وأنظمة بهندسة برمجيات حديثة وذكاء اصطناعي — للقادة الذين يريدون أدوات تعمل، لا زينة.",
  "brand_what": "ماذا نبني",
  "bw1": "أنظمة AGI",
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
  "about_p2": "عملي حيث يلتقي بناء المنتجات بسير عمل AGI — منصات متكاملة وأتمتة وتطوير بمساعدة AI. أتعلم بالتسليم: كل مشروع تجربة تنتهي ببرنامج يعمل.",
  "about_p3": "حاصل على شهادة في هندسة الأوامر من برنامج «خمسة ملايين قائد في الذكاء الاصطناعي» وفي الذكاء الاصطناعي التوليدي من Google Cloud — وأواصل التعلم مع كل مشروع.",
  "pr1": "عقلية هندسية",
  "pr1d": "النظام أولًا، ثم الشاشات.",
  "pr2": "بناء المنتجات",
  "pr2d": "المُسلَّم أفضل من المثالي.",
  "pr3": "سير عمل AGI",
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
  "contact_title": "لنناقش مشروعك.",
  "contact_sub": "أخبرني بما تبنيه. أرد بسرعة — عادةً في اليوم نفسه، عبر البريد أو تيليجرام.",
  "copy": "نسخ",
  "copied": "تم النسخ",
  "copy_fail": "تعذّر النسخ — حدّد العنوان يدويًا.",
  "err_name": "يرجى إدخال اسمك.",
  "err_email": "يرجى إدخال بريد إلكتروني صحيح.",
  "err_msg": "يرجى كتابة رسالة قصيرة.",
  "foot_line": "تقنية عصر AGI. منتجات حقيقية. هندسة حقيقية.",
  "cs_overview": "نظرة عامة",
  "cs_challenge": "المشكلة",
  "cs_solution": "ما الذي بُني",
  "cs_tech": "التقنيات",
  "cs_role": "دوري",
  "cs_result": "الأدلة",
  "cs_media": "الوسائط",
  "cs_arch": "كيف يعمل",
  "cs_close": "إغلاق دراسة الحالة",
  "cs_label": "دراسة حالة",
  "roles": [
   "مهندس أوامر",
   "مطوّر بمساعدة AI",
   "باني أنظمة AGI",
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
  "team_sub": "إنسان واحد يتخذ القرار. وفريق AI لكل نموذج فيه دور محدد داخل سير العمل.",
  "team_count": "إنسان واحد · 12 زميلًا من AI",
  "team_human": "إنسان",
  "team_ai": "AI",
  "team_online": "متصل",
  "team_note": "تُستخدم أنظمة الذكاء الاصطناعي ضمن سير عمل ماكس الهندسي بمساعدة AI. إنها ليست موظفين ولا مالكين — ماكس يتخذ القرارات ويتحمل مسؤولية كل إصدار.",
  "tm_max_r": "المؤسس والرئيس التنفيذي · UzLeeder",
  "tm_max_d": "صاحب القرار البشري. يحدد الاتجاه ويصمم الأنظمة ويتحمل مسؤولية كل قرار نهائي للمنتج.",
  "tm_claude_r": "كبير المعماريين",
  "tm_claude_d": "داخل سير العمل بمساعدة AI: استكشاف المعمارية ودعم تصميم الأنظمة والاستدلال التقني وإرشاد التنفيذ.",
  "tm_claudecode_r": "مهندس أول",
  "tm_claudecode_d": "ينجز مهام البرمجة الكبيرة مباشرة من الطرفية.",
  "tm_codex_r": "مهندس برمجة AI",
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
   },
   "academy": {
    "cat": "التعليم · نظام تعلّم شخصي · منتج UzLeeder",
    "lead": "نظام دراسي خاص لمتعلّم واحد — وليس منصة تعليم عامة — بدورات وملاحظات يكتبها البشر.",
    "overview": "يتبع طالب واحد حلقة ثابتة: خطة ← درس ← تدريب ← اختبار ← خطأ ← تكرار ← إتقان ← مشروع ← ملاحظات. ثلاثة أدوار للموظفين — المراقب والمعلّم ومعلّم الإنجليزية — تتابع وتكلّف وتراجع من لوحة منفصلة. المحتوى مكتوب وليس مولّدًا: دورة بايثون لمدة 30 يومًا مع 300 سؤال، ومسار IELTS 8.0 لمدة 140 يومًا مع 20 اختبارًا أسبوعيًا، و44 موضوعًا في القواعد مع تمارين، و72 نصًا للقراءة بصيغة IELTS، و600 كلمة، ومسار DataCamp من 14 فصلًا، وبرنامج محادثة لمدة 30 يومًا، وجدول يومي لمدة 154 يومًا مبني حول أوقات الصلاة المحسوبة فلكيًا.",
    "challenge": "يتطلب الاستعداد لبايثون وIELTS 8.0 معًا مكانًا واحدًا يخطط لكل يوم، ويجمع الدروس والتدريب والأخطاء، ويعمل دون إنترنت، ويسمح للمعلمين بالتكليف والمراجعة — دون ضجيج منصة عامة ودون تقييم آلي بالذكاء الاصطناعي.",
    "solution": "تطبيق ويب تقدّمي دون إطار عمل (نحو 41,000 سطر JavaScript، معظمها محتوى دورات مكتوب يدويًا) و9 دوال serverless على Vercel. يعمل دون اتصال أولًا: localStorage هو المصدر الأساسي دائمًا والسحابة نسخة، لذلك يندمج جهازان بدل أن يكتب أحدهما فوق الآخر. كل مسار محمي بملف تعريف جلسة موقّع بـ HMAC يُفحص على الحافة، وتُفرض الأدوار الأربعة على الخادم. كل تكليف وكل ملاحظة يكتبها إنسان.",
    "role": "المصمم والمهندس والمطوّر الوحيد — بسير عمل بمساعدة الذكاء الاصطناعي، بتوجيه ماكس وتحقّقه.",
    "result": "يعمل على uzleeder-academy.vercel.app. الفحوص الآلية: اختبارات API ‏72/72، واختبارات edge middleware ‏14/14، والتحقق من الجدول — كل قالب يوم يغطي 1,440 دقيقة بالضبط دون تداخل، وتدقيق مسار الإنجليزية — 140/140 يومًا و20 اختبارًا أسبوعيًا.",
    "arch": [
     [
      "المستخدمون",
      "طالب · مراقب · معلّم · معلّم إنجليزية"
     ],
     [
      "التطبيق",
      "PWA يعمل دون اتصال — JavaScript خالص وService Worker وIndexedDB"
     ],
     [
      "حلقة التعلّم",
      "خطة ← درس ← تدريب ← اختبار ← أخطاء ← إتقان ← مشروع ← ملاحظات"
     ],
     [
      "الأمان",
      "جلسة موقّعة بـ HMAC على الحافة · الأدوار على الخادم · PBKDF2"
     ],
     [
      "API",
      "9 دوال serverless على Vercel"
     ],
     [
      "البيانات",
      "localStorage مصدرًا أساسيًا ← نسخة في Neon Postgres · Vercel Blob للوسائط"
     ],
     [
      "المخرجات",
      "تكليفات وملاحظات يكتبها البشر — دون تقييم بالذكاء الاصطناعي"
     ]
    ]
   }
  },
  "nav_max": "ماكس",
  "nav_admin": "الإدارة",
  "nav_build": "ابنِ مع UzLeeder",
  "era_k": "عصر البناء بالذكاء",
  "era_line": "غيّر AI طريقة بناء البرمجيات. <b>وUzLeeder يبني به.</b>",
  "pipe_hint": "اختر مرحلة لترى ما يحدث فيها.",
  "px1": "يبدأ كل بناء بمشكلة حقيقية ومستخدم حقيقي وهدف واضح — يُكتب قبل فتح أي نموذج.",
  "px2": "تتحول المشكلة إلى تعليمات دقيقة: الدور والسياق والقيود وصيغة المخرجات وما يجب ألا يفعله النموذج أبدًا.",
  "px3": "النموذج المناسب لكل خطوة — استدلال أو توليد أو رؤية أو صوت — يُقارن على مدخلات حقيقية لا على الضجيج.",
  "px4": "يبقى منطق التطبيق في الكود: التحقق وقواعد العمل ومعالجة البيانات يكتبها إنسان ويقرؤها ويتحمل مسؤوليتها.",
  "px5": "تربط الواجهات البرمجية وقواعد البيانات والمصادقة وسير العمل الأجزاء، لتصل مخرجات AI إلى نظام موثوق.",
  "px6": "تنفيذ إنتاجي — منشور ومُختبر على أجهزة حقيقية، مع فحص الأمان والأداء قبل الإطلاق.",
  "px7": "يستخدمه أناس حقيقيون. وتعود ملاحظاتهم ونتائجهم إلى الدورة التالية.",
  "hb_kicker": "المنهج",
  "hb_title": "كيف أبني مع AGI.",
  "hb_sub": "مُصمَّم، مُوجَّه، مُتحقَّق منه، مُطلَق.",
  "hb1_t": "الفهم",
  "hb1_d": "أتحدث مع من سيستخدمونه. أحدد المشكلة والنطاق ومعنى النجاح.",
  "hb2_t": "المعمارية",
  "hb2_d": "أصمم البيانات والتدفقات وحدود النظام قبل توليد أي سطر من الكود.",
  "hb3_t": "توجيه AI",
  "hb3_d": "أعطي فريق AI تعليمات وسياقًا وقيودًا دقيقة — مهمة واضحة واحدة في كل مرة.",
  "hb4_t": "التوليد",
  "hb4_d": "يصيغ AI الكود والنصوص والوسائط بسرعة — مع عدة خيارات حيث يهم الاختيار.",
  "hb5_t": "المراجعة",
  "hb5_d": "كل تغيير يُقرأ ويُسأل عنه ويُصحح. لا شيء يُطلق لمجرد أن النموذج بدا واثقًا.",
  "hb6_t": "الاختبار",
  "hb6_d": "أجهزة حقيقية وبيانات حقيقية وحالات حدّية وفحوص أمان — ثم إصلاح واختبار من جديد.",
  "hb7_t": "الإطلاق",
  "hb7_d": "النشر والمراقبة والتسليم — مع التوثيق والدعم بعد الإطلاق.",
  "hb_msg": "يسرّع AI التنفيذ. ويبقى <b>الحكم البشري</b> مسؤولًا عن المعمارية والتحقق والأمان والجودة وقرارات المنتج النهائية.",
  "team_human_k": "الفريق البشري",
  "team_human_n": "صاحب القرار",
  "team_ai_k": "فريق AI",
  "team_ai_n": "يساعد داخل سير العمل",
  "tm_max_rule": "AI يساعد. ماكس يوجّه. ماكس يتحقق.",
  "st_core": "الهندسة الأساسية",
  "st_aie": "هندسة بمساعدة AI",
  "st_aii": "AGI والذكاء",
  "st_infra": "البنية التحتية",
  "st_design": "التصميم وبيئة العمل",
  "st_aie_note": "سير عمل بمساعدة AI",
  "bw_title": "ابنِ مع UzLeeder.",
  "bw_sub": "ثلاثة أنواع من العمل — كلٌّ منها مُصمَّم ومُوجَّه ومُتحقَّق منه ومُطلَق.",
  "bg1_t": "المنتجات الرقمية",
  "bg1_d": "مواقع ومنصات وأنظمة تعليمية — من الفكرة إلى النشر.",
  "bg2_t": "أنظمة AI",
  "bg2_d": "مساعدون وRAG وسير عمل AI يعمل داخل منتجات حقيقية.",
  "bg3_t": "أنظمة الأعمال",
  "bg3_d": "بوابات ولوحات إدارة وأتمتة ترفع العمل المتكرر عن الناس.",
  "bi_ai": "المساعدون وRAG",
  "rv_title": "آراء العملاء",
  "rv_sub": "منشورة بإذن كل عميل.",
  "pv_bar": "معاينة المسودة — هذه النسخة غير منشورة.",
  "pv_exit": "الخروج من المعاينة",
  "pv_fail": "تتطلب معاينة المسودة جلسة إدارة نشطة.",
  "st_live_own": "منتج UzLeeder قيد التشغيل",
  "st_delivered": "سُلِّم إلى العميل",
  "own_uzleeder": "منتج UzLeeder",
  "own_client": "مشروع عميل",
  "st_demo": "عرض توضيحي",
  "st_dev": "قيد التطوير",
  "st_private": "مشروع خاص",
  "st_concept": "مفهوم",
  "st_archived": "مؤرشف",
  "nav_services": "الخدمات",
  "nav_how": "طريقة العمل",
  "btn_discuss": "ناقش مشروعك",
  "btn_projects": "شاهد مشاريع حقيقية",
  "hero_sub": "منتجات رقمية ذكية وأنظمة أعمال ومواقع وأتمتة — بهندسة يتحكم بها الإنسان.",
  "hero_base": "مقرّنا في أوزبكستان. متاحون للمشاريع حول العالم.",
  "pf_k": "بيانات المنتجات والقدرات من مشاريع مسلَّمة",
  "st_live_client": "مشروع عميل قيد التشغيل",
  "st_product": "منتج جاهز للنشر",
  "svc_title": "ثلاثة أشياء تبنيها UzLeeder.",
  "svc_sub": "يبدأ كل مشروع بنطاق عمل وسعر وخطة تسليم متفق عليها.",
  "svc_example": "مثال",
  "svc_start": "أرسل وصف المشروع",
  "s1_t": "مواقع الأعمال",
  "s1_d": "مواقع تسويقية تشرح عرضك وتبني الثقة وتعرض الأدلة وتجمع الطلبات.",
  "s1_i1": "صفحات واضحة للعرض والخدمات",
  "s1_i2": "أدلة: مشاريع وشهادات وآراء",
  "s1_i3": "نماذج طلبات تُرسل إلى تيليجرام أو البريد",
  "s1_i4": "متعدد اللغات وسريع ومناسب للجوال",
  "s1_ev": "هذا الموقع — بنته UzLeeder وتديره.",
  "s1_from": "من $200",
  "s2_t": "أنظمة الأعمال",
  "s2_d": "بوابات وأكاديميات ولوحات تحكم وسير عمل داخلي خلف تسجيل دخول آمن.",
  "s2_i1": "صلاحيات حسب الدور للموظفين أو العملاء أو الطلاب",
  "s2_i2": "القبول والمدفوعات والسجلات والتقارير",
  "s2_i3": "لوحات تحكم ولوحات إدارة",
  "s2_i4": "بياناتك في قاعدة بياناتك الخاصة",
  "s2_ev": "Shokirov Math Academy · MarketHub",
  "s2_from": "من $1000",
  "s3_t": "أنظمة AGI",
  "s3_d": "أتمتة بـAGI ومساعدو معرفة (RAG) وسير عمل عبر تيليجرام — مع مراجعة بشرية حيث يهم الأمر.",
  "aiw1": "المدخلات",
  "aiw2": "معرفة معتمدة",
  "aiw3": "معالجة AGI",
  "aiw4": "التحقق",
  "aiw5": "التسليم لإنسان",
  "aiw6": "المخرجات",
  "s3_note": "تُعالَج الأخطاء وتُختبر. الذكاء الاصطناعي ليس مثاليًا، لذلك يشارك إنسان في الإجابات الحساسة.",
  "s3_from": "من $500",
  "price_request": "السعر بعد تحديد النطاق",
  "scope_t": "يُتفق على نطاق كل عمل كتابيًا قبل التطوير",
  "scope_1": "المخرجات — الصفحات والميزات والتكاملات",
  "scope_2": "ما لا يشمله العمل",
  "scope_3": "عدد جولات التعديل",
  "scope_4": "المحتوى والصلاحيات التي تقدمها",
  "scope_5": "تكاليف الأطراف الثالثة: النطاق والاستضافة وواجهات API المدفوعة",
  "scope_6": "الصيانة بعد الإطلاق",
  "pkg_t": "الباقات وأسعار البداية",
  "pkg_sub": "يعتمد السعر النهائي على النطاق المتفق عليه.",
  "price_all": "كل الخدمات وأسعار البداية",
  "extras_t": "خدمات إبداعية إضافية",
  "defect30": "30 يومًا لإصلاح الأخطاء بعد الإطلاق",
  "doc_self": "وثيقة UzLeeder · صادرة عن الشركة نفسها",
  "certs_note": "روابط شهادات الجهات الخارجية تقود إلى صفحة التحقق لدى الجهة المصدِرة. وثائق UzLeeder تصدرها UzLeeder نفسها وليست تحققًا مستقلًا.",
  "pr_title": "من أول رسالة حتى الإطلاق.",
  "pr1_t": "النقاش",
  "pr1_d": "تصف العمل والهدف، وأطرح الأسئلة حتى تتضح المشكلة.",
  "pr2_t": "النطاق",
  "pr2_d": "نتفق كتابيًا على المخرجات والاستثناءات والاعتماديات والسعر وخطة التسليم.",
  "pr3_t": "البناء",
  "pr3_d": "تطوير مع عروض منتظمة. كل شيء يُراجع ويُختبر قبل أن تراه.",
  "pr4_t": "التسليم",
  "pr4_d": "النشر وتسليم الصلاحيات والتوثيق وخيار صيانة متفق عليه.",
  "pr_note": "لا يبدأ التطوير قبل أن يتضح النطاق والسعر وخطة التسليم للطرفين.",
  "faq_title": "أسئلة قبل أن نبدأ.",
  "faq1_q": "ماذا تبني UzLeeder؟",
  "faq1_a": "ثلاثة أشياء: مواقع أعمال تجلب الطلبات، وأنظمة أعمال مثل البوابات والأكاديميات ولوحات التحكم، وأنظمة ذكاء اصطناعي تؤتمت العمل المتكرر مع مراجعة بشرية.",
  "faq2_q": "كيف تسير العملية؟",
  "faq2_a": "النقاش ← النطاق ← البناء ← التسليم. يبدأ التطوير فقط بعد الاتفاق كتابيًا على النطاق والسعر وخطة التسليم.",
  "faq3_q": "كيف يُستخدم الذكاء الاصطناعي؟",
  "faq3_a": "يساعد الذكاء الاصطناعي على التصميم والكتابة والاختبار بسرعة أكبر. يراجع ماكس كل تغيير ويتحمل مسؤولية المعمارية والأمان والنتيجة النهائية. لا يُنشر ناتج الذكاء الاصطناعي دون مراجعة.",
  "faq4_q": "ماذا سأستلم؟",
  "faq4_a": "منتجًا يعمل ومنشورًا، وصلاحيات الوصول إليه (النطاق والاستضافة ولوحة الإدارة)، والشيفرة المصدرية وتوثيقًا مختصرًا — كما هو محدد في النطاق المتفق عليه.",
  "faq5_q": "كيف يُحدَّد السعر؟",
  "faq5_a": "حسب النطاق: عدد الصفحات أو الميزات والتكاملات والمحتوى والمواعيد. أسعار البداية مذكورة أعلاه؛ ويُثبَّت السعر النهائي في نطاق العمل قبل البدء.",
  "faq6_q": "هل تعملون مع دول أخرى؟",
  "faq6_a": "نعم. مقر UzLeeder في طشقند، وتعمل عن بُعد مع عملاء في دول أخرى بالإنجليزية والروسية والأوزبكية.",
  "faq7_q": "كيف تعمل الصيانة والدعم؟",
  "faq7_a": "يُتفق على الدعم بعد الإطلاق في نطاق العمل — فترة محددة لإصلاح الأخطاء أو خطة صيانة مدفوعة. لا توجد وعود مفتوحة.",
  "brief_intro": "وصف قصير للمشروع — أردّ عبر القناة التي تختارها.",
  "brief_channel": "قناة الرد المفضلة",
  "brief_c_telegram": "اسم المستخدم في تيليجرام أو الهاتف",
  "brief_c_whatsapp": "رقم واتساب",
  "brief_c_email": "البريد الإلكتروني",
  "err_telegram": "أدخل ‎@username في تيليجرام أو رقم هاتف.",
  "err_whatsapp": "أدخل رقم واتساب مع رمز الدولة.",
  "brief_service": "ماذا تحتاج؟",
  "brief_choose": "اختر خدمة…",
  "brief_other": "أخرى",
  "err_service": "يرجى اختيار خدمة.",
  "brief_msg": "وصف المشروع",
  "brief_msg_ph": "ما هو العمل، وماذا يجب أن يفعل الموقع أو النظام؟",
  "err_msg10": "يرجى وصف المشروع في جملة أو جملتين.",
  "brief_optional": "الميزانية والمدة (اختياري)",
  "brief_budget": "الميزانية",
  "brief_timeline": "المدة",
  "brief_skip": "أفضّل عدم الذكر",
  "bud_1": "أقل من $500",
  "bud_4": "أكثر من $4,000",
  "bud_5": "لست متأكدًا بعد",
  "tl_1": "في أقرب وقت",
  "tl_2": "خلال شهر",
  "tl_3": "من 1 إلى 3 أشهر",
  "tl_4": "مرن",
  "brief_send": "إرسال وصف المشروع",
  "brief_fallback": "يمكنك الكتابة مباشرة أيضًا:",
  "brief_privacy": "تُستخدم بياناتك فقط للرد على هذا الطلب.",
  "form_dup": "تم استلام هذا الوصف مسبقًا — لا حاجة لإرساله مرة أخرى.",
  "form_rate": "محاولات كثيرة. انتظر بضع دقائق أو اكتب مباشرة.",
  "foot_founder": "أسسها ويديرها ماكس (مهر الدين عبد العليم)",
  "cs_status": "الحالة",
  "cs_cta": "ناقش مشروعًا مشابهًا",
  "cs_status_shokirov": "مشروع عميل قيد التشغيل — تستخدمه الأكاديمية يوميًا على shokirov-academy.vercel.app.",
  "cs_status_markethub": "منتج جاهز للنشر — معروض للبيع؛ يتوفر عرض توضيحي عند الطلب.",
  "pf1x": "منتجات مُسلَّمة — {live} قيد التشغيل و{ready} جاهزة للنشر",
  "pf6": "مشاريع ناشئة ومسارات بحثية — في صفحة الشركات الناشئة ←",
  "nav_partners": "الشركاء",
  "nav_startups": "الشركات الناشئة",
  "su_eyebrow": "UzLeeder Ventures",
  "su_h": "نبني <em>ما هو قادم.</em>",
  "su_lead": "نبني ونستكشف مشاريع تقنية تهدف إلى حل مشكلات حقيقية وإنشاء منتجات رقمية مفيدة وفتح آفاق جديدة في عصر الذكاء الاصطناعي.",
  "su_cta1": "استكشف الشركات الناشئة",
  "su_cta2": "ناقش مشروعاً",
  "su_v_k": "رؤية المؤسس",
  "su_v_h": "الأفكار تصبح منتجات، والمنتجات تصبح إمكانات.",
  "su_v_p": "يبدأ كل مشروع بمشكلة تستحق الحل. نستكشف الفرصة، ونصمم حلاً عملياً، ونبني المنتج، ونحسّنه بناءً على ملاحظات حقيقية.",
  "su_p1_t": "اكتشاف",
  "su_p1_d": "اكتشاف المشكلات المهمة والفرص غير المستغلة.",
  "su_p2_t": "بناء",
  "su_p2_d": "تحويل الأفكار المُثبتة إلى منتجات قابلة للاستخدام عبر هندسة وتصميم مدروسين.",
  "su_p3_t": "تطوير",
  "su_p3_d": "الاختبار والتعلّم والتحسين والتوسع عندما تدعم الأدلة الخطوة التالية.",
  "su_d_k": "الدليل",
  "su_d_h": "مشاريعنا",
  "su_d_p": "المنتجات والمبادرات التي نطوّرها ونبحثها ونحوّلها إلى واقع.",
  "su_filter": "التصفية حسب الفئة",
  "su_kicker": "الشركات الناشئة",
  "su_title": "مشاريع نبنيها لأنفسنا.",
  "su_sub": "منتجات UzLeeder الخاصة — في مرحلة مبكرة وموصوفة كما هي. لكل مشروع عرض تقديمي.",
  "su_all": "استكشف صفحة الشركات الناشئة",
  "su_note": "«بحث» يعني أنه لا يوجد منتج عام بعد. الأرقام في العروض فرضيات وليست نتائج.",
  "form_code": "رقم الطلب:",
  "btn_view": "شاهد المشاريع"
 }
};

const LABELS = { en: "EN", uz: "UZ", ru: "RU", fa: "FA", ar: "AR" };
// /en /uz /ru /fa /ar pages carry <meta name="uzl-lang">; "/" follows the visitor's saved choice (no forced redirects)
const PAGE_LANG = (document.querySelector('meta[name="uzl-lang"]') || {}).content || "";
const LOCALE_PATH = /^\/(en|uz|ru|fa|ar)\/?$/;
// privacy-safe analytics: event names + service/language/source only — never names, contacts or messages
function track(name, params) {
  try { if (typeof window.gtag === "function") window.gtag("event", name, params || {}); } catch (e) {}
  try { if (window.uzla) { const p = params || {}; window.uzla.event(name, p.source || p.service || p.channel || p.reason || p.id || ""); } } catch (e) {}
}
// what visitors actually do: CTA clicks, case studies, language/theme changes, outbound links
document.addEventListener("click", e => {
  const a = e.target.closest("a, button");
  if (!a) return;
  if (a.matches(".btn-primary, .nav-cta, [data-source]") && a.getAttribute("href") === "#contact") track("cta_click", { source: a.dataset.source || "contact" });
  else if (a.matches('a[href="#work"]')) track("cta_click", { source: "see_projects" });
  else if (a.matches('a[target="_blank"]') && !/t\.me|wa\.me|mailto:/.test(a.href)) { try { track("outbound", { source: new URL(a.href).hostname.replace(/^www\./, "") }); } catch (err) {} }
  if (a.matches(".lang-opt")) track("lang_change", { source: a.dataset.lang });
  if (a.matches("#themeToggle")) track("theme_change", { source: root.getAttribute("data-theme") === "dark" ? "light" : "dark" });
}, true);
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

/* ===== Intro (every load): <UzLeeder> + <For leaders> typed → brackets become the Λ mark → AGI system initialization ===== */
// The brand animation itself is locked; only the loading line below it changed (V5):
// "AGI //" + real boot states on a five-segment rail — each state lights one segment. No percentage.
const INTRO_STATES = ["SYSTEM INITIALIZATION", "LOADING UZLEEDER", "CONNECTING SYSTEMS", "HUMAN CONTROL · ON", "READY"];
const intro = $("#intro");
const cachedDesign = (() => { try { return JSON.parse(localStorage.getItem("uzleeder_design") || "null") || {}; } catch (e) { return {}; } })();
if (intro) {
  let seen = false;
  try { seen = sessionStorage.getItem("uzleeder_intro_seen") === "1"; sessionStorage.setItem("uzleeder_intro_seen", "1"); } catch (e) {}
  if (cachedDesign.intro === "off" || (cachedDesign.intro === "session" && seen)) intro.remove();
  else if (reduceMotion) stillIntro(intro);
  else runIntro(intro);
}
function introCloser(el, extra) {
  let done = false;
  return function finish() {
    if (done) return;
    done = true;
    if (extra) extra();
    el.classList.add("out");
    root.style.overflow = "";
    setTimeout(() => el.remove(), 520);
  };
}
// reduced motion: keep the identity (mark + READY), no movement, open quickly
function stillIntro(el) {
  const finish = introCloser(el);
  $("#introState", el).textContent = "READY";
  $$(".boot i", el).forEach(s => s.classList.add("on"));
  el.classList.add("still", "ready");
  el.addEventListener("click", finish);
  setTimeout(finish, 700);
}
function runIntro(el) {
  const state = $("#introState", el);
  const timers = [];
  const at = (ms, fn) => timers.push(setTimeout(fn, ms));
  let loaded = document.readyState === "complete";
  window.addEventListener("load", () => { loaded = true; }, { once: true });
  // a page served from cache (or already loaded) steps through the states quickly
  const nav = performance.getEntriesByType && performance.getEntriesByType("navigation")[0];
  const cached = !!(nav && nav.transferSize === 0 && nav.decodedBodySize > 0);
  root.style.overflow = "hidden";                                  // no scrolling behind the intro

  const finish = introCloser(el, () => timers.forEach(clearTimeout));
  el.addEventListener("click", finish);                            // click / any key skips the intro
  document.addEventListener("keydown", finish, { once: true });

  const setState = i => {
    $$(".boot i", el).forEach((s, k) => s.classList.toggle("on", k <= i));   // one rail segment per state
    state.classList.add("swap");
    at(160, () => { state.textContent = INTRO_STATES[i]; state.classList.remove("swap"); });
  };

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
    $(".boot i", el).classList.add("on");
    el.classList.add("load");
    let i = 0, waited = 0;
    // INITIALIZING … PREPARING SYSTEM, then READY once the page has loaded (videos can hold the load event, so wait ≤ 1 s)
    const gap = () => (cached || loaded ? 160 : 300);
    function step() {
      if (i < INTRO_STATES.length - 2) { setState(++i); at(gap(), step); return; }
      if (!loaded && waited < 1000) { waited += 120; at(120, step); return; }
      setState(INTRO_STATES.length - 1);
      at(160, () => el.classList.add("ready"));
      // brand moment: the new era, then the homepage
      at(300, () => el.classList.add("era"));
      at(1000, finish);
    }
    at(gap(), step);
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
  // keep the address shareable: /ru shows Russian, etc. (only on "/" and the locale pages)
  if (LOCALE_PATH.test(location.pathname) || location.pathname === "/" || location.pathname === "/index.html") {
    const want = "/" + lang;
    if (location.pathname !== want && (PAGE_LANG || location.pathname !== "/")) { try { history.replaceState(null, "", want + location.search + location.hash); } catch (e) {} }
  }
  $$("[data-lang-link]").forEach(a => a.classList.toggle("on", a.dataset.langLink === lang));
  if (typeof syncBrief === "function") syncBrief();
  syncHeroButton();
  refreshCounts();
  updateProof();
  renderStartups();
  if (window.__cmsProjects) translateProjects();
  if (window.__cmsTeam) translateTeam();
  if (window.__cmsReviews) translateReviews();
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
window.addEventListener("resize", () => { if (window.innerWidth > 1100 && navMenu.classList.contains("open")) setMenu(false); });

const navMap = { services: "services", work: "work", process: "process", faq: "process", about: "about", uzleeder: "about", team: "about", contact: "contact" };
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
    if (e.target.matches(".era-title")) e.target.closest(".era").classList.add("seen");
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

/* ===== AI pipeline: interactive stages ===== */
// Runs through the chain on its own until the visitor picks a stage; then it follows the visitor.
let pipeTimer = null, pipeManual = false;
const pipeBtns = $$("#pipeline .pipe-btn");
function selectStage(n, fromUser) {
  if (!pipeBtns.length) return;
  pipeBtns.forEach((b, j) => {
    const on = j + 1 === n;
    b.setAttribute("aria-selected", on ? "true" : "false");
    b.tabIndex = on ? 0 : -1;
    b.parentElement.classList.toggle("on", j < n);
    b.parentElement.classList.toggle("cur", on);
  });
  $("#pipeN").textContent = String(n).padStart(2, "0") + " / " + String(pipeBtns.length).padStart(2, "0");
  $("#pipeH").setAttribute("data-i18n", "p" + n); $("#pipeH").innerHTML = t("p" + n);
  $("#pipeX").setAttribute("data-i18n", "px" + n); $("#pipeX").innerHTML = t("px" + n);
  $("#pipePanel").setAttribute("aria-labelledby", "pipeTab" + n);
  if (fromUser) { pipeManual = true; clearInterval(pipeTimer); $("#pipeline").classList.add("manual"); }
}
pipeBtns.forEach((b, i) => {
  b.addEventListener("click", () => selectStage(i + 1, true));
  b.addEventListener("keydown", e => {
    const k = e.key, last = pipeBtns.length - 1;
    let to = null;
    if (k === "ArrowRight" || k === "ArrowDown") to = i === last ? 0 : i + 1;
    if (k === "ArrowLeft" || k === "ArrowUp") to = i === 0 ? last : i - 1;
    if (k === "Home") to = 0;
    if (k === "End") to = last;
    if (to == null) return;
    e.preventDefault();
    if (root.dir === "rtl" && (k === "ArrowRight" || k === "ArrowLeft")) to = k === "ArrowRight" ? (i === 0 ? last : i - 1) : (i === last ? 0 : i + 1);
    selectStage(to + 1, true); pipeBtns[to].focus();
  });
});
function startPipeline() {
  if (!pipeBtns.length || pipeTimer || pipeManual) return;
  selectStage(1);
  if (reduceMotion) return;
  let n = 1;
  pipeTimer = setInterval(() => {
    if (pipeManual) return clearInterval(pipeTimer);
    n = n % pipeBtns.length + 1;
    selectStage(n);
  }, 2600);
}
/* ===== Proof: count-up ===== */
function countUp(el) {
  if (!el || el.dataset.done) return;
  el.dataset.done = "1";
  const suffix = el.dataset.suffix || "";
  if (reduceMotion) { el.textContent = fmt(+el.dataset.count) + suffix; return; }
  const start = performance.now(), dur = 1200;
  (function step(now) {
    // the target is read every frame: live numbers (projects, startups) may arrive while it is counting
    const p = Math.min(1, (now - start) / dur), eased = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(Math.round(+el.dataset.count * eased)) + suffix;
    if (p < 1) requestAnimationFrame(step);
  })(start);
}
function refreshCounts() {
  $$("[data-count]").forEach(el => { if (el.dataset.done || !root.classList.contains("js")) el.textContent = fmt(+el.dataset.count) + (el.dataset.suffix || ""); });
}
/* ===== Proof: live numbers =====
   products shipped = visible built-in projects + published Control Center projects whose status means shipped
   (live → "live"; product for deployment → "ready"); demos, concepts and projects in development are not counted.
   startups = published ventures from /api/startups; certificates = the 9 built-in + those added in the Control Center. */
const SHIP = { "live-own": "live", "live-client": "live", live: "live", delivered: "live", product: "ready", sale: "ready" };
let ventureCount = null, extraCerts = 0;
function setCount(el, n) {
  if (!el) return;
  el.dataset.count = n;
  el.textContent = fmt(n) + (el.dataset.suffix || "");      // right number at once; the count-up still plays when it scrolls into view
}
function updateProof() {
  let live = 0, ready = 0;
  $$("#workList [data-case]").forEach(a => { if (!a.hidden) { if (a.dataset.ship === "live") live++; else if (a.dataset.ship === "ready") ready++; } });
  (window.__cmsProjects || []).forEach(p => { const s = SHIP[p.tag]; if (s === "live") live++; else if (s === "ready") ready++; });
  setCount($("#pfShipped"), live + ready);
  const txt = $("#pfShippedTxt"); if (txt) txt.textContent = t("pf1x").replace("{live}", live).replace("{ready}", ready);
  if (ventureCount != null) setCount($("#pfVentures"), ventureCount);
  const vt = $("#pfVenturesTxt"); if (vt) vt.textContent = t("pf6");
  setCount($("#pfCerts"), 9 + extraCerts);
}
/* ===== Startups preview (#startups) — the full page is /startups =====
   The cards are pre-rendered in English at build time; the published ventures from /api/startups replace them
   (with ?preview=1 and an admin session: the drafts) and follow the language. Rendering: /startups-render.js (window.SU). */
let startupList = null;
function renderStartups() {
  const grid = $("#suGrid");
  if (!grid || !startupList || !window.SU) return;
  const shown = !!grid.querySelector(".su-card.show"), lang = SU.LANGS.indexOf(curLang) >= 0 ? curLang : "en";
  grid.innerHTML = SU.directory(startupList, lang, { home: true });
  if (shown) $$(".reveal", grid).forEach(el => el.classList.add("show")); else observeReveal(grid);
}
// a click anywhere on a venture card (not on its links) opens the venture's page on /startups
document.addEventListener("click", e => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const card = e.target.closest(".su-card[data-href]");
  if (card && !e.target.closest("a, button, input, select, textarea") && !String(getSelection && getSelection()).trim()) location.href = card.getAttribute("data-href");
});
function loadVentureCount() {
  const token = PREVIEW ? adminToken() : "";
  fetch(token ? "/api/startups?preview=1" : "/api/startups", { cache: "no-store", headers: token ? { Authorization: "Bearer " + token } : {} })
    .then(r => (r.ok ? r.json() : null)).then(j => {
      if (!j || !Array.isArray(j.startups)) return;
      startupList = j.startups.slice().sort((a, b) => (a.order || 0) - (b.order || 0));
      ventureCount = window.SU ? SU.visible(startupList).length : startupList.length;
      updateProof(); renderStartups();
    }).catch(() => { /* keep the built-in cards and number */ });
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
    title: "Shokirov Math Academy", statusKey: "st_live_client", statusCls: "pill-live", service: "system",
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
    title: "MarketHub — B2B Travel Portal", statusKey: "st_product", statusCls: "pill-sale", service: "system",
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
CASE_STATIC.academy = {
  title: "UzLeeder Academy", statusKey: "st_live_own", statusCls: "pill-live", service: "system",
  tech: ["Vanilla JavaScript", "PWA", "Service Worker", "IndexedDB", "Vercel Serverless Functions", "Vercel Edge Middleware", "Neon Postgres", "Vercel Blob", "Web Crypto (PBKDF2, HMAC)", "Pyodide", "SVG"],
  media: { video: "/api/media/med_mui0q5kipfy5aiau.mp4", image: "/api/media/med_mui0pjiofm744u73.png" },
  hero() { return this.media.video ? { type: "video", src: this.media.video, poster: this.media.image, alt: "UzLeeder Academy walkthrough" } : { type: "img", src: this.media.image, alt: "UzLeeder Academy" }; },
  get gallery() { return this.media.image ? [{ type: "img", src: this.media.image, alt: "UzLeeder Academy — overview" }] : []; },
  links: [{ href: "https://uzleeder-academy.vercel.app", key: "proj_view", primary: true, ext: true }]
};
// which Control Center project has which built-in case study
const CASE_MATCH = { academy: p => /uzleeder-academy\.vercel\.app/i.test(p.link || "") || /^uzleeder academy$/i.test((p.title || "").trim()) };
const caseFor = p => Object.keys(CASE_MATCH).find(id => CASE_MATCH[id](p)) || "";
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
    '<div class="case-media">' + mediaHTML(s.hero.call(s), true) + "</div>" +
    '<div class="case-sections">' +
      sec("01", "cs_overview", "<p>" + esc(c.overview) + "</p>") +
      sec("02", "cs_challenge", "<p>" + esc(c.challenge) + "</p>") +
      sec("03", "cs_solution", "<p>" + esc(c.solution) + "</p>") +
      sec("04", "cs_arch", arch) +
      sec("05", "cs_tech", "<ul>" + s.tech.map(x => "<li>" + esc(x) + "</li>").join("") + "</ul>") +
      sec("06", "cs_role", "<p>" + esc(c.role) + "</p>") +
      sec("07", "cs_result", "<p>" + esc(c.result) + '</p><div class="case-gallery">' + s.gallery.map(m => mediaHTML(m, false)).join("") + "</div>") +
      sec("08", "cs_status", '<p><span class="pill ' + (s.statusCls || "") + '">' + esc(t(s.statusKey)) + "</span></p><p>" + esc(t("cs_status_" + id)) + "</p>") +
      '<div class="case-actions"><a class="btn btn-primary" href="#contact" data-close data-service="' + esc(s.service) + '" data-source="project_page">' + esc(t("cs_cta")) + '<svg class="ico" aria-hidden="true"><use href="#i-arrow"/></svg></a>' +
        links.replace(/btn btn-primary/g, "btn btn-ghost") + "</div>" +
    "</div>";
}
function openCase(id, opener) {
  if (!CASE_STATIC[id] || !caseDialog.showModal) return;
  track("case_open", { id });
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

/* ===== Project brief (contact) ===== */
// Validation mirrors /api/contact. Success is shown only after the server has saved the brief;
// on any failure the text stays in the form (and in sessionStorage) with a direct-contact fallback.
const form = $("#contactForm");
const statusEl = $("#formStatus");
const BRIEF_KEY = "uzleeder_brief";
const RULES = {
  telegram: v => /^@?[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(v) || /^\+?[\d\s().-]{7,20}$/.test(v),
  whatsapp: v => /^\+?[\d\s().-]{7,20}$/.test(v),
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
};
const CONTACT_UI = {
  telegram: { label: "brief_c_telegram", err: "err_telegram", ph: "@username", type: "text", mode: "text", ac: "off" },
  whatsapp: { label: "brief_c_whatsapp", err: "err_whatsapp", ph: "+998 90 123 45 67", type: "tel", mode: "tel", ac: "tel" },
  email: { label: "brief_c_email", err: "err_email", ph: "you@example.com", type: "email", mode: "email", ac: "email" }
};
let briefSource = "direct", briefStarted = false;
function channel() { const c = form && form.querySelector('input[name="channel"]:checked'); return c ? c.value : "telegram"; }
function syncBrief() {
  if (!form) return;
  const ui = CONTACT_UI[channel()], inp = form.elements.contact;
  const lab = $("#cf-contact-label"), err = $("#cf-contact-err");
  lab.setAttribute("data-i18n", ui.label); lab.innerHTML = t(ui.label);
  err.setAttribute("data-i18n", ui.err); err.innerHTML = t(ui.err);
  inp.type = ui.type; inp.inputMode = ui.mode; inp.autocomplete = ui.ac; inp.placeholder = ui.ph;
}
if (form) {
  const f = form.elements;
  const saveDraft = () => { try { sessionStorage.setItem(BRIEF_KEY, JSON.stringify({ name: f.name.value, channel: channel(), contact: f.contact.value, service: f.service.value, message: f.message.value, budget: f.budget.value, timeline: f.timeline.value })); } catch (e) {} };
  try {                                                     // restore an unsent brief after a reload
    const d = JSON.parse(sessionStorage.getItem(BRIEF_KEY) || "null");
    if (d) { ["name", "contact", "service", "message", "budget", "timeline"].forEach(k => { if (d[k]) f[k].value = d[k]; }); const r = form.querySelector('input[name="channel"][value="' + d.channel + '"]'); if (r) r.checked = true; }
  } catch (e) {}
  syncBrief();
  const check = field => {
    const v = field.value.trim();
    const ok = field.name === "name" ? v.length >= 2 : field.name === "contact" ? RULES[channel()](v) : field.name === "service" ? !!v : v.length >= 10;
    field.closest(".field").classList.toggle("invalid", !ok);
    field.setAttribute("aria-invalid", ok ? "false" : "true");
    return ok;
  };
  const fields = [f.name, f.contact, f.service, f.message];
  fields.forEach(x => {
    x.addEventListener("blur", () => { if (x.value.trim()) check(x); });
    x.addEventListener("input", () => { if (x.closest(".field").classList.contains("invalid")) check(x); });
  });
  form.addEventListener("input", () => { saveDraft(); if (!briefStarted) { briefStarted = true; track("lead_form_start", { source: briefSource, language: curLang }); } });
  form.addEventListener("change", e => { if (e.target.name === "channel") { syncBrief(); f.contact.closest(".field").classList.remove("invalid"); f.contact.focus(); } saveDraft(); });
  // CTAs remember where the visitor came from and can preselect the service
  document.addEventListener("click", e => {
    const el = e.target.closest("[data-source], [data-service]");
    if (!el) return;
    if (el.dataset.source) briefSource = el.dataset.source;
    if (el.dataset.service && !f.service.value) { f.service.value = el.dataset.service; saveDraft(); }
    if (el.closest("#caseDialog")) setTimeout(() => $("#contact").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }), 60);
  });
  $$('a[href^="https://t.me/"], a[href^="https://wa.me/"], a[href^="mailto:"]').forEach(a => a.addEventListener("click", () => track("contact_click", { channel: a.href.startsWith("mailto") ? "email" : a.href.includes("wa.me") ? "whatsapp" : "telegram" })));

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const bad = fields.filter(x => !check(x));
    statusEl.className = "form-status";
    $("#briefFallback").hidden = true;
    if (bad.length) { statusEl.textContent = t("form_invalid"); statusEl.classList.add("err"); bad[0].focus(); return; }
    const btn = $(".form-submit", form);
    btn.classList.add("loading"); btn.disabled = true;
    statusEl.textContent = t("form_sending");
    const payload = { name: f.name.value.trim(), channel: channel(), contact: f.contact.value.trim(), service: f.service.value, message: f.message.value.trim(),
      budget: f.budget.value, timeline: f.timeline.value, lang: curLang, source: briefSource, website: f.website ? f.website.value : "" };
    let res = null, data = {};
    try {
      res = await fetch(CONTACT_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      data = await res.json().catch(() => ({}));
    } catch (err) { res = null; }
    btn.classList.remove("loading"); btn.disabled = false;
    if (res && res.ok && data.ok) {
      statusEl.textContent = t(data.duplicate ? "form_dup" : "form_ok") + (data.code ? " " + t("form_code") + " " + data.code : ""); statusEl.classList.add("ok");
      toast(t(data.duplicate ? "form_dup" : "form_ok"), "ok");
      track("lead_submit_success", { service: payload.service, language: curLang, source: briefSource });
      form.reset(); syncBrief(); briefStarted = false;
      try { sessionStorage.removeItem(BRIEF_KEY); } catch (e2) {}
      return;
    }
    // nothing is cleared: the visitor can retry or use the direct links
    const key = res && res.status === 429 ? "form_rate" : res && res.status === 400 ? "form_invalid" : "form_err";
    if (res && res.status === 400 && data.fields) Object.keys(data.fields).forEach(k => { const x = f[k]; if (x && x.closest(".field")) x.closest(".field").classList.add("invalid"); });
    statusEl.textContent = t(key); statusEl.classList.add("err");
    $("#briefFallback").hidden = false;
    track("lead_submit_error", { reason: res ? String(res.status) : "network", service: payload.service, language: curLang });
    console.error("Brief not delivered:", res ? res.status : "network error");
  });
}

/* ===== Admin CMS: remote text overrides + dynamic projects ===== */
// honest statuses — only what the evidence supports (set per project in the Control Center)
const CMS_TAGS = {
  "live-own": { cls: "pill-live", key: "st_live_own" }, "live-client": { cls: "pill-live", key: "st_live_client" }, product: { cls: "pill-sale", key: "st_product" }, delivered: { cls: "", key: "st_delivered" },
  demo: { cls: "", key: "st_demo" }, dev: { cls: "", key: "st_dev" }, private: { cls: "", key: "st_private" }, concept: { cls: "", key: "st_concept" }, archived: { cls: "", key: "st_archived" },
  live: { cls: "pill-live", key: "tag_live" }, sale: { cls: "pill-sale", key: "tag_sale" }, soon: { cls: "", key: "tag_soon" }
};
function translateProjects() {
  const list = window.__cmsProjects || [];
  $$("#workList [data-cmsproj]").forEach(card => {
    const p = list[+card.getAttribute("data-cmsproj")];
    if (!p) return;
    const pick = o => (o && (o[curLang] || o.en)) || "";
    const pEl = $(".proj-p", card);
    if (pEl) pEl.textContent = pick(p.desc);
    [["cat", "m_category"], ["role", "m_role"]].forEach(([f, k]) => {
      const dd = $('[data-pf="' + f + '"]', card);
      if (dd) { dd.textContent = pick(p[f]); dd.parentElement.hidden = !dd.textContent; $("dt", dd.parentElement).textContent = t(k); }
    });
    const why = $(".work-why", card);
    if (why) { $("span", why).textContent = pick(p.why); $("b", why).textContent = t("m_why"); why.hidden = !pick(p.why); }
    const btn = $(".proj-btnlabel", card);
    if (btn) btn.textContent = t("proj_view") || "View";
  });
}
// the built-in projects (Shokirov, MarketHub — with full case studies) stay unless hidden in the Control Center;
// projects added in the Control Center appear after them
function renderProjects(list, hide) {
  const wrap = $("#workList");
  if (!wrap) return;
  hide = hide || {};
  $$("[data-case]", wrap).forEach(a => { a.hidden = !!hide[a.dataset.case]; });
  $$("[data-cmsproj]", wrap).forEach(a => a.remove());
  list = (list || []).filter(p => p && !p.archived);
  window.__cmsProjects = list;
  const builtIn = $$("[data-case]", wrap).filter(a => !a.hidden);
  builtIn.forEach((a, i) => { a.classList.toggle("reverse", i % 2 === 1); const n = $(".work-num", a); if (n) n.textContent = String(i + 1).padStart(2, "0"); });
  list.forEach((p, i) => {
    const idx = builtIn.length + i;
    const tag = CMS_TAGS[p.tag] || CMS_TAGS.live;
    const art = document.createElement("article");
    art.className = "work-item" + (idx % 2 ? " reverse" : "") + " reveal";
    art.setAttribute("data-cmsproj", i);
    const num = String(idx + 1).padStart(2, "0");
    const yt = /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/.exec(p.video || "");
    const media = yt
      ? '<div class="media-frame"><iframe src="https://www.youtube-nocookie.com/embed/' + yt[1] + '" title="' + esc((p.title || "") + " video") + '" loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" style="width:100%;height:100%;border:0"></iframe></div>'
      : p.video && /^(\/api\/media\/|https:\/\/)/.test(p.video)
      ? '<div class="media-frame"><video class="lazy-video" data-src="' + esc(p.video) + '"' + (p.image ? ' poster="' + esc(p.image) + '"' : "") + ' muted loop playsinline preload="none" aria-label="' + esc((p.title || "") + " video") + '"></video></div>'
      : p.image
      ? '<a class="media-frame" href="' + esc(p.link || "#") + '" target="_blank" rel="noopener"><img src="' + esc(p.image) + '" alt="' + esc((p.title || "") + " preview") + '" loading="lazy" decoding="async"/></a>'
      : '<div class="media-frame"><div class="media-empty"><svg viewBox="0 0 48 44" aria-hidden="true"><use href="#brand-mark"/></svg></div></div>';
    art.innerHTML =
      '<div class="work-media">' + media + '<span class="work-num" aria-hidden="true">' + num + "</span></div>" +
      '<div class="work-body"><div class="work-tags"><span class="pill ' + tag.cls + '" data-i18n="' + tag.key + '">' + esc(t(tag.key)) + "</span>" +
        // who it was built for: UzLeeder's own product, or a client (named only with permission)
        (p.owner === "client" ? '<span class="pill"><span data-i18n="own_client">' + esc(t("own_client")) + "</span>" + (p.clientPublic && p.client ? " · " + esc(p.client) : "") + "</span>"
          : p.owner === "uzleeder" ? '<span class="pill" data-i18n="own_uzleeder">' + esc(t("own_uzleeder")) + "</span>" : "") + "</div>" +
      '<h3 class="work-title"></h3><p class="work-lead proj-p"></p>' +
      '<dl class="work-meta"><div hidden><dt></dt><dd data-pf="cat"></dd></div><div hidden><dt></dt><dd data-pf="role"></dd></div>' +
      (p.value ? '<div><dt data-i18n="m_value">' + esc(t("m_value")) + "</dt><dd>" + esc(p.value) + "</dd></div>" : "") + "</dl>" +
      '<div class="proj-tech"></div><p class="work-why" hidden><b></b><span></span></p>' +
      (caseFor(p) ? (() => { const id = caseFor(p); if (p.video || p.image) CASE_STATIC[id].media = { video: p.video && /^(\/api\/media\/|https:\/\/)/.test(p.video) && !/youtu/.test(p.video) ? p.video : "", image: p.image || "" }; return ""; })() : "") +
      (p.link || p.certificate || caseFor(p) ? '<div class="work-actions">' +
        (caseFor(p) ? '<button class="btn btn-primary" type="button" data-open-case="' + caseFor(p) + '"><span data-i18n="cs_open">' + esc(t("cs_open")) + '</span><svg class="ico" aria-hidden="true"><use href="#i-arrow"/></svg></button>' : "") +
        (p.link ? '<a class="btn ' + (caseFor(p) ? "btn-ghost" : "btn-primary") + '" href="' + esc(p.link) + '" target="_blank" rel="noopener"><span class="proj-btnlabel"></span><svg class="ico" aria-hidden="true"><use href="#i-out"/></svg></a>' : "") +
        (p.certificate ? '<a class="btn-link" href="/certified?d=' + encodeURIComponent(p.certificate) + '" target="_blank" rel="noopener" data-i18n="proj_certificate">' + esc(t("proj_certificate")) + "</a>" : "") + "</div>" : "") +
      "</div>";
    $(".work-title", art).textContent = p.title || "";
    const tech = $(".proj-tech", art);
    const chips = [];
    (p.tech || []).forEach(x => { const last = chips[chips.length - 1]; if (last && (last.split("(").length > last.split(")").length)) chips[chips.length - 1] = last + ", " + x; else chips.push(x); });
    chips.forEach(x => { const s = document.createElement("span"); s.textContent = x; tech.appendChild(s); });
    wrap.appendChild(art);
    $$("video.lazy-video", art).forEach(v => lazyVideoIO.observe(v));
  });
  observeReveal(wrap);
  updateProof();
}
// AI team managed in the Control Center: [{ name, icon, role:{en,..}, desc:{en,..}, archived, order }]
// (Claude stays first as Chief Architect unless the admin reorders it.)
function renderTeam(list) {
  const wrap = $("#aiTeam");
  if (!wrap) return;
  const live = list.filter(m => m && m.name && !m.archived).sort((a, b) => (a.order || 0) - (b.order || 0));
  if (!live.length) return;
  window.__cmsTeam = live;
  wrap.innerHTML = live.map((m, i) =>
    '<li class="tm-card' + (i === 0 && /claude/i.test(m.name) ? " tm-architect" : "") + ' reveal" data-cmsteam="' + i + '"><span class="tm-avatar">' +
    (m.icon ? '<img src="' + esc(m.icon) + '" alt="" width="40" height="40" loading="lazy" decoding="async"/>' : '<svg viewBox="0 0 48 44" width="30" height="28" aria-hidden="true"><use href="#brand-mark"/></svg>') +
    '</span><div class="tm-body"><h3>' + esc(m.name) + '</h3><p class="tm-role"></p><p class="tm-desc"></p>' +
    '<span class="tm-status"><i aria-hidden="true"></i><span data-i18n="team_ai">' + esc(t("team_ai")) + '</span> · <span data-i18n="team_online">' + esc(t("team_online")) + "</span></span></div></li>").join("");
  translateTeam();
  observeReveal(wrap);
  const count = $(".team-count");
  if (count) count.removeAttribute("data-i18n"), count.textContent = count.textContent.replace(/\d+(?=\D*$)/, live.length);
}
function translateTeam() {
  (window.__cmsTeam || []).forEach((m, i) => {
    const card = $('[data-cmsteam="' + i + '"]');
    if (!card) return;
    // empty language → the built-in translation for known teammates, then English
    const pick = (o, k) => (o && o[curLang]) || (m.key && t("tm_" + m.key + "_" + k)) || (o && o.en) || "";
    $(".tm-role", card).textContent = pick(m.role, "r");
    $(".tm-desc", card).textContent = pick(m.desc, "d");
  });
}
// extra certificates added in the Control Center: [{ title, meta, image, verify, archived }]
function renderCerts(list) {
  const grid = $(".cert-grid");
  if (!grid) return;
  $$("[data-cmscert]", grid).forEach(n => n.remove());
  const doc = $(".cert-doc", grid);
  extraCerts = list.filter(c => c && c.title && c.image && !c.archived).length; updateProof();
  list.filter(c => c && c.title && c.image && !c.archived).forEach(c => {
    const li = document.createElement("li");
    li.className = "reveal"; li.setAttribute("data-cmscert", "");
    li.innerHTML = '<a class="cert-card" href="' + esc(c.image) + '" data-lightbox data-title="' + esc(c.title) + '" data-meta="' + esc(c.meta || "") + '"' +
      (c.verify ? ' data-verify="' + esc(c.verify) + '"' : "") + '><img src="' + esc(c.image) + '" alt="' + esc(c.title) + ' certificate" loading="lazy" decoding="async"/>' +
      '<span class="cc-t">' + esc(c.title) + '</span><span class="cc-m">' + esc(c.meta || "") + "</span></a>";
    grid.insertBefore(li, doc ? doc.parentElement : null);
  });
  observeReveal(grid);
}

// client reviews from the Control Center: [{ name, role:{en,..}, text:{en,..}, project, photo, rating, archived, consent }]
// Only reviews the client agreed to publish are shown; without any, the block stays hidden.
function renderReviews(list) {
  const box = $("#reviews"), ul = $("#reviewsList");
  if (!box || !ul) return;
  const live = (list || []).filter(r => r && r.name && r.consent && !r.archived && r.text && Object.keys(r.text).length);
  window.__cmsReviews = live;
  box.hidden = !live.length;
  ul.innerHTML = live.map((r, i) => {
    const stars = r.rating >= 1 && r.rating <= 5 ? '<span class="review-stars" aria-label="' + r.rating + ' / 5">' + "★".repeat(r.rating) + "</span>" : "";
    const ava = r.photo ? '<img class="review-ava" src="' + esc(r.photo) + '" alt="" loading="lazy" decoding="async"/>' : '<span class="review-ava" aria-hidden="true">' + esc(r.name.trim()[0].toUpperCase()) + "</span>";
    return '<li class="review reveal" data-cmsrev="' + i + '">' + stars + '<blockquote dir="auto"></blockquote><div class="review-who">' + ava +
      '<div><b>' + esc(r.name) + '</b><span class="rv-role"></span>' + (r.project ? '<div class="review-proj">' + esc(r.project) + "</div>" : "") + "</div></div></li>";
  }).join("");
  translateReviews();
  observeReveal(ul);
}
function translateReviews() {
  (window.__cmsReviews || []).forEach((r, i) => {
    const li = $('[data-cmsrev="' + i + '"]'); if (!li) return;
    const pick = o => (o && (o[curLang] || o.en || o[Object.keys(o)[0]])) || "";
    $("blockquote", li).textContent = pick(r.text);
    $(".rv-role", li).textContent = pick(r.role);
  });
}

// contact details edited in the Control Center replace the built-in ones everywhere on the page
function applyContact(c) {
  if (!c || typeof c !== "object") return;
  const digits = v => String(v || "").replace(/[^\d+]/g, "");
  const handle = v => String(v || "").trim().replace(/^@/, "").replace(/^https?:\/\/[^/]+\//, "").replace(/\/.*$/, "");
  const rules = [];
  if (c.email) rules.push({ href: "mailto:uzleeder@gmail.com", to: "mailto:" + c.email, text: [["uzleeder@gmail.com", c.email]] });
  if (c.phone) rules.push({ href: "tel:+998916395110", to: "tel:" + digits(c.phone), text: [["+998 91 639 51 10", c.phone]] });
  const wa = c.whatsapp || c.phone;
  if (wa) rules.push({ href: "https://wa.me/998916395110", to: "https://wa.me/" + digits(wa).replace(/^\+/, ""), text: [["+998 91 639 51 10", wa]] });
  if (c.telegram) rules.push({ href: "https://t.me/uzleeder", to: "https://t.me/" + handle(c.telegram), text: [["@uzleeder", "@" + handle(c.telegram)]] });
  if (c.github) rules.push({ href: "https://github.com/uzleeder", to: "https://github.com/" + handle(c.github), text: [["github.com/uzleeder", "github.com/" + handle(c.github)], ["uzleeder", handle(c.github)]] });
  if (c.youtube) rules.push({ href: "https://www.youtube.com/@uzleeder", to: "https://www.youtube.com/@" + handle(c.youtube).replace(/^@/, ""), text: [] });
  $$("a[href]").forEach(a => rules.forEach(r => {
    if (a.getAttribute("href") !== r.href) return;
    a.setAttribute("href", r.to);
    const walk = document.createTreeWalker(a, NodeFilter.SHOW_TEXT);
    for (let n = walk.nextNode(); n; n = walk.nextNode()) r.text.forEach(([from, to]) => { if (n.nodeValue.trim() === from || n.nodeValue.includes(from) && from.length > 8) n.nodeValue = n.nodeValue.split(from).join(to); });
  }));
  if (c.email) { const cp = $("#copyEmail"); if (cp) cp.dataset.copy = c.email; }
}
// prices not approved by the owner are replaced by "Price after scoping"; defect-fix line only when approved
function applyPricing(p) {
  if (!p || typeof p !== "object") return;
  const hide = p.hide || {};
  $$("[data-price]").forEach(el => {
    const k = el.getAttribute("data-price"), base = el.getAttribute("data-i18n-base") || el.getAttribute("data-i18n");
    el.setAttribute("data-i18n-base", base);
    el.setAttribute("data-i18n", hide[k] ? "price_request" : base);
    el.innerHTML = t(hide[k] ? "price_request" : base);
  });
  const scope = $(".scope ul");
  if (scope && p.defect30 && !$("[data-defect30]", scope)) { const li = document.createElement("li"); li.setAttribute("data-i18n", "defect30"); li.setAttribute("data-defect30", ""); li.innerHTML = t("defect30"); scope.appendChild(li); }
}

/* ===== Site design from the Control Center: palette, cursor, fonts, sections, intro ===== */
// The admin sends a fully resolved palette; every value is validated before it reaches CSS.
const okColor = v => typeof v === "string" && /^(#[0-9a-f]{3,8}|rgba?\([\d.,\s%]+\))$/i.test(v.trim());
const okRgb = v => typeof v === "string" && /^\d{1,3},\s*\d{1,3},\s*\d{1,3}$/.test(v.trim());
const okFont = v => typeof v === "string" && /^[\w\s'"-]{1,60}$/.test(v);
function cursorCSS(outer, inner, halo, fallback) {
  const svg = "<svg xmlns='http://www.w3.org/2000/svg' width='22' height='24' viewBox='12 -6 56 60'><defs><filter id='s' x='-30%' y='-30%' width='160%' height='160%'><feDropShadow dx='0' dy='1.6' stdDeviation='1.6' flood-color='#000' flood-opacity='.4'/></filter></defs>" +
    "<g fill='none' stroke-miterlimit='10' transform='rotate(-28 24 5)' filter='url(#s)'><path d='M4 41 24 5l20 36' stroke='" + halo + "' stroke-width='11'/><path d='M14 41 24 23l10 18' stroke='" + halo + "' stroke-width='9.5'/>" +
    "<path d='M4 41 24 5l20 36' stroke='" + outer + "' stroke-width='7'/><path d='M14 41 24 23l10 18' stroke='" + inner + "' stroke-width='5.5'/></g></svg>";
  return 'url("data:image/svg+xml,' + encodeURIComponent(svg).replace(/'/g, "%27") + '") 3 1,' + fallback;
}
function designToCSS(d) {
  const p = d && d.palette;
  if (!p) return "";
  const vars = (o, map) => Object.keys(map).filter(k => o && (map[k][1] ? okRgb(o[k]) : okColor(o[k]))).map(k => map[k][0] + ":" + o[k].trim()).join(";");
  const ROOT = { brand: ["--brand"], brandRgb: ["--brand-rgb", 1], brand2: ["--brand-2"], brandDeep: ["--brand-deep"], brandSoft: ["--brand-soft"], ink: ["--ink"], deep: ["--deep"], panel: ["--brand-panel"], panelDark: ["--brand-panel-dark"], media: ["--media-bg"] };
  const MODE = { accent: ["--accent"], accentRgb: ["--accent-rgb", 1], onAccent: ["--on-accent"], bg: ["--bg"], bg2: ["--bg-2"], surface: ["--surface"], surface2: ["--surface-2"], line: ["--line"], line2: ["--line-2"], text: ["--text"], muted: ["--muted"], faint: ["--faint"], markInner: ["--mark-inner"], inkText: ["--ink-text"] };
  let css = ":root{" + vars(p, ROOT) + "}" +
    ':root[data-theme="dark"]{' + vars(p.dark, MODE) + "}" +
    ':root[data-theme="light"]{' + vars(p.light, MODE) + "}";
  const dk = p.dark || {}, lt = p.light || {};
  if (okColor(dk.accent) && okColor(lt.accent) && okColor(p.ink) && okColor(p.deep)) {
    const dIn = okColor(dk.markInner) ? dk.markInner : "#ffffff", lIn = okColor(lt.markInner) ? lt.markInner : p.ink;
    const hit = ":is(a,button,summary,label[for],.lang-opt,[data-lightbox],[data-open-case])";
    css += "@media (hover:hover) and (pointer:fine){" +
      ':root[data-theme="dark"] body{cursor:' + cursorCSS(dk.accent, dIn, p.deep, "auto") + "}" +
      ':root[data-theme="light"] body{cursor:' + cursorCSS(lt.accent, lIn, "#ffffff", "auto") + "}" +
      ':root[data-theme="dark"] ' + hit + "{cursor:" + cursorCSS(dIn, dk.accent, p.deep, "pointer") + "}" +
      ':root[data-theme="light"] ' + hit + "{cursor:" + cursorCSS(lIn, lt.accent, "#ffffff", "pointer") + "}}";
  }
  const f = d.font || {};
  if (okFont(f.display) && okFont(f.body)) css += ':root:not([dir="rtl"]){--display:' + f.display + ",'Segoe UI',system-ui,sans-serif;--font:" + f.body + ",'Segoe UI',system-ui,sans-serif}";
  return css;
}
const SECTION_IDS = ["proof", "era", "ai", "method", "uzleeder", "about", "team", "stack", "certificates", "process", "faq"];
function applySections(hide) {
  SECTION_IDS.forEach(id => {
    const sec = document.getElementById(id); if (!sec) return;
    const off = !!(hide && hide[id]);
    sec.hidden = off;
    $$('a[href="#' + id + '"]').forEach(a => { if (a.closest(".nav-menu, .footer-nav")) a.hidden = off; });
  });
  // keep the section numbers continuous (01, 02, …) after hiding some
  let n = 0;
  $$("main > section").forEach(sec => { const num = $(".sec-num", sec); if (num && !sec.hidden) num.textContent = String(++n).padStart(2, "0"); });
}
// custom design: one ready-made option per part of the site → data-ds-* attributes (see style.css)
const DS = { btn: ["pill", "square", "outline"], card: ["filled", "elevated", "glass"], radius: ["sharp", "round"], hero: ["centered", "text"],
  nav: ["solid", "pill"], sections: ["flat", "lines"], space: ["compact", "spacious"], heads: ["light", "upper"] };
function applyCustom(c) {
  const attrs = {};
  Object.keys(DS).forEach(k => {
    const v = c && c[k];
    if (DS[k].includes(v)) { attrs["data-ds-" + k] = v; root.setAttribute("data-ds-" + k, v); } else root.removeAttribute("data-ds-" + k);
  });
  return attrs;
}
function applyDesign(d) {
  d = d && typeof d === "object" ? d : {};
  const css = designToCSS(d);
  let st = $("#cmsDesign");
  if (css) { if (!st) { st = document.createElement("style"); st.id = "cmsDesign"; document.head.appendChild(st); } st.textContent = css; }
  else if (st) st.remove();
  const f = d.font || {};
  const fontHref = typeof f.href === "string" && /^https:\/\/fonts\.googleapis\.com\/css2\?[\w=&:;@,.+%-]+$/.test(f.href) ? f.href : "";
  let fl = $("#cmsFont");
  if (fontHref) { if (!fl) { fl = document.createElement("link"); fl.rel = "stylesheet"; fl.id = "cmsFont"; document.head.appendChild(fl); } if (fl.href !== fontHref) fl.href = fontHref; }
  else if (fl) fl.remove();
  applySections(d.hide);
  const attrs = applyCustom(d.parts);
  // favicon in the chosen colours (the Λ tile)
  const icon = $('link[rel="icon"][type="image/svg+xml"]') || $('link[rel="icon"]');
  const p = d.palette;
  if (icon && p && okColor(p.brand) && okColor(p.ink)) {
    fetch("/icon.svg").then(r => r.text()).then(svg => {
      svg = svg.split("#1c2233").join(p.ink).split("#e5243b").join(p.brand);
      icon.setAttribute("href", "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg));
    }).catch(() => {});
  }
  const tc = $('meta[name="theme-color"]');
  if (tc && d.palette) { const m = d.palette[theme === "light" ? "light" : "dark"]; if (m && okColor(m.bg)) tc.setAttribute("content", m.bg); }
  // remember for the next visit (not while previewing a draft)
  if (!PREVIEW) try {
    const cache = { css, fontHref, mode: d.mode, intro: d.intro, attrs };
    if (css || fontHref || d.mode || d.intro || Object.keys(attrs).length) localStorage.setItem("uzleeder_design", JSON.stringify(cache)); else localStorage.removeItem("uzleeder_design");
  } catch (e) {}
}
// ?preview=1 — the Control Center opens the site with the unpublished draft (admin token required)
const PREVIEW = /[?&]preview=1\b/.test(location.search);
function adminToken() { try { return sessionStorage.getItem("uz_admin_token") || ""; } catch (e) { return ""; } }
function previewBar(ok) {
  const bar = document.createElement("div");
  bar.className = "preview-bar" + (ok ? "" : " err");
  bar.setAttribute("role", "status");
  bar.innerHTML = '<span data-i18n="' + (ok ? "pv_bar" : "pv_fail") + '"></span><a href="' + esc(location.pathname) + '" data-i18n="pv_exit"></a>';
  $$("[data-i18n]", bar).forEach(el => { el.innerHTML = t(el.getAttribute("data-i18n")); });
  document.body.appendChild(bar);
  root.classList.add("has-preview");
}
async function loadRemoteContent() {
  try {
    const token = PREVIEW ? adminToken() : "";
    const res = await fetch(PREVIEW && token ? "/api/content?draft=1" : "/api/content", {
      cache: "no-store", headers: token ? { Authorization: "Bearer " + token } : {}
    });
    if (PREVIEW) previewBar(res.ok && !!token);
    if (!res.ok) return;
    const content = await res.json();
    if (!content || typeof content !== "object") return;
    if (content.overrides) {
      Object.keys(LABELS).forEach(l => { if (content.overrides[l]) Object.assign(i18n[l], content.overrides[l]); });
    }
    const hideBuiltin = content.settings && content.settings.hideBuiltin;
    if ((Array.isArray(content.projects) && content.projects.length) || hideBuiltin) renderProjects(content.projects, hideBuiltin);
    if (Array.isArray(content.team) && content.team.length) renderTeam(content.team);
    if (Array.isArray(content.certificates)) renderCerts(content.certificates);
    if (Array.isArray(content.testimonials)) renderReviews(content.testimonials);
    if (content.settings && content.settings.contact) applyContact(content.settings.contact);
    applyDesign(content.settings && content.settings.design);
    applyPricing(content.settings && content.settings.pricing);
    applyLang(curLang);
  } catch (e) {
    if (PREVIEW) previewBar(false);
    /* offline or not deployed yet: keep the built-in content */
  }
}

// the Admin link is shown only while this browser tab holds a signed-in admin session
(function adminLink() {
  const a = $("#navAdmin");
  const tok = adminToken();
  if (!a || !tok) return;
  // token = base64url(payload).signature — show the link only until the session expires
  try {
    const p = JSON.parse(atob(tok.split(".")[0].replace(/-/g, "+").replace(/_/g, "/")));
    if (p.exp && p.exp * (p.exp < 1e12 ? 1000 : 1) < Date.now()) return;
  } catch (e) { /* unknown token shape: the admin page validates it anyway */ }
  a.hidden = false;
})();
/* ===== Init ===== */
(function init() {
  // footer copyright year follows the visitor's clock, so it never goes stale
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  let savedTheme;
  try { savedTheme = localStorage.getItem(THEME_KEY); } catch (e) {}
  if (!savedTheme && (cachedDesign.mode === "light" || cachedDesign.mode === "dark")) savedTheme = cachedDesign.mode;
  if (!savedTheme && window.matchMedia) savedTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  applyTheme(savedTheme || theme);

  let savedLang = PAGE_LANG;
  if (!savedLang) try { savedLang = localStorage.getItem(LANG_KEY); } catch (e) {}
  if (!savedLang) {
    const n = (navigator.language || "en").slice(0, 2);
    savedLang = i18n[n] ? n : "en";
  }
  applyLang(savedLang);

  const m = location.hash.match(/^#case-(\w+)$/);
  if (m && CASE_STATIC[m[1]]) openCase(m[1]);
  // older shared links (/#startup-t-port) now live on the venture's own page
  const sm = location.hash.match(/^#startup-([a-z0-9-]+)$/);
  if (sm) location.replace("/startups/" + sm[1]);

  loadRemoteContent();
  loadVentureCount();
})();
})();
