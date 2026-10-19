/* ===== Configuration ===== */
// Backend endpoint that receives the contact form. When you deploy the
// server (see server/ folder), change this to its full URL, e.g.
// "https://your-api.onrender.com/api/contact". Empty string = same origin.
const API_BASE = "";
const CONTACT_ENDPOINT = API_BASE + "/api/contact";

/* ===== Translations ===== */
const i18n = {
  en: {
    tag: "For Leaders", nav_about: "About", nav_portfolio: "Portfolio", nav_services: "Services", nav_pricing: "Pricing", nav_contact: "Contact",
    hero_title: 'Hi, I\'m <span>Mekhriddin</span> Abdualim', hero_desc: "I build modern, fast, and beautiful websites for businesses, academies, and brands — powered by clean code and smart AI tools.",
    btn_work: "View My Work", btn_contact: "Contact Me", stat_projects: "Projects", stat_support: "Client Support", stat_delivery: "Delivery",
    photo_role: "Founder · AI Web Developer", soon: "Soon",
    about_kicker: "About Me", about_title: "Who is Mekhriddin?", about_sub: "A young AI web developer from Tashkent City, Uzbekistan 🇺🇿 — building the future one website at a time.",
    about_p1: 'I\'m Mekhriddin Abdualim, founder of <strong style="color:var(--gold)">UzLeeder</strong> — a web development brand built for leaders. I specialize in creating modern, professional websites for English academies, tutoring centers, and small businesses, using the latest AI-powered tools.',
    about_p2: "My goal is simple: to give every business a strong online presence — fast, beautiful, and affordable. I handle everything from design to delivery, with free support after launch.",
    about_p3: "Based in Tashkent City, Uzbekistan 🇺🇿 — working with clients across the country.",
    skill_resp: "Responsive Design", skill_ai: "AI Tools", skill_tg: "Telegram Integration",
    as_delivered: "Websites delivered", as_satisfaction: "Client satisfaction", as_days: "Days average delivery", as_support: "Free post-launch support",
    port_kicker: "Portfolio", port_title: "My Recent Projects", port_sub: "Every project is built with care, clean code, and a focus on results.",
    tag_live: "Live", tag_soon: "Coming Soon",
    proj1: "A fully featured website for an English language academy in Sariosiyo — with course listings, registration form, Telegram integration and CMS support.",
    proj2_title: "Math Tutoring", proj2: "Premium math tutoring website with gold & navy branding, course info, pricing section, and contact integration for School No. 38.",
    proj3_title: "Your Project", proj3: "This could be your website! I'm ready to build a professional online presence for your business — fast, beautiful, and affordable.",
    tech_anim: "Animations", tech_resp: "Responsive", tech_custom: "Custom Design", tech_mobile: "Mobile Ready", tech_fast: "Fast Delivery",
    svc_kicker: "Services", svc_title: "What I Can Build For You", svc_sub: "Professional websites tailored to your business needs.",
    svc1_title: "Academy Website", svc1: "Full website for English academies and tutoring centers — courses, pricing, contact & registration.",
    svc2_title: "Business Landing Page", svc2: "Clean, professional one-page site for any small business to attract more customers online.",
    svc3_title: "Custom Web Design", svc3: "Fully custom design with unique branding, colors, and layout — built just for you.",
    svc4_title: "Website Maintenance", svc4: "Updates, fixes, and improvements for existing websites. Always free for my clients.",
    svc5_title: "Logo Design", svc5: "Unique, professional logos that capture your brand identity and make you stand out.",
    svc6_title: "AI Video & Photo", svc6: "Stunning AI-generated videos and images for your brand, ads, and social media.",
    svc7_title: "Email Writing", svc7: "Professional, persuasive emails for outreach, sales, and business communication.",
    svc8_title: "Presentations", svc8: "Eye-catching, professional slide decks for business, pitches, and education.",
    from200: "from $200", from150: "from $150", from250: "from $250", free_clients: "Free for clients",
    from15: "from $15", from10: "from $10", from10b: "from $10", from15b: "from $15",
    creative_kicker: "Creative Services", creative_title: "More Than Just Websites", creative_sub: "Logos, AI media, emails and presentations — everything your brand needs.", starting_from: "starting from",
    price_kicker: "Pricing", price_title: "Simple, Transparent Pricing", price_sub: "No hidden fees. What you see is what you pay.",
    one_time: "one-time payment", based_req: "based on requirements", popular: "Most Popular", get_started: "Get Started", lets_talk: "Let's Talk",
    f_landing: "Landing page (1 page)", f_mobile: "Mobile responsive", f_contact: "Contact section", f_tg: "Telegram integration", f_3day: "3-day delivery", f_support: "Free support",
    f_multi: "Multi-page website", f_custom: "Custom design & branding", f_reg: "Registration form", f_tgphone: "Telegram + phone integration", f_cms: "CMS (editable content)", f_5day: "5-day delivery", f_forever: "Free support forever",
    f_everything: "Everything in Professional", f_adv: "Advanced animations", f_backend: "Backend integration", f_domain: "Domain setup help", f_priority: "Priority delivery", f_lifetime: "Lifetime free support",
    contact_title: "Let's Work Together", contact_sub: "Ready to get your business online? Send me a message below, or reach me on Telegram — I'll get back to you fast and we'll build something great together.",
    msg_tg: "Message on Telegram", send_email: "Send Email", phone_label: "Phone", loc_city: "Tashkent City, Uzbekistan 🇺🇿", loc_label: "Location",
    form_name: "Your name", form_name_ph: "e.g. John Doe", form_email: "Email", form_email_ph: "you@example.com",
    form_msg: "Message", form_msg_ph: "Tell me about your project...", form_send: "Send Message", form_sending: "Sending...",
    form_ok: "Message sent! I'll reply soon. 🎉", form_err: "Something went wrong. Please try again or use Telegram.",
    form_invalid: "Please fill in all fields with a valid email.",
    roles: ["AI Web Developer", "Founder of UzLeeder", "UI/UX Designer", "Freelance Developer"]
  },
  uz: {
    tag: "Liderlar uchun", nav_about: "Men haqimda", nav_portfolio: "Portfolio", nav_services: "Xizmatlar", nav_pricing: "Narxlar", nav_contact: "Aloqa",
    hero_title: 'Salom, men <span>Mekhriddin</span> Abdualim', hero_desc: "Men biznes, akademiya va brendlar uchun zamonaviy, tez va chiroyli saytlar yarataman — toza kod va aqlli AI vositalari yordamida.",
    btn_work: "Ishlarimni ko'rish", btn_contact: "Bog'lanish", stat_projects: "Loyihalar", stat_support: "Mijozlarga yordam", stat_delivery: "Yetkazib berish",
    photo_role: "Asoschi · AI Veb-dasturchi", soon: "Tez kunda",
    about_kicker: "Men haqimda", about_title: "Mekhriddin kim?", about_sub: "Toshkent Citylik yosh AI veb-dasturchi — har bir sayt bilan kelajakni quruvchi. 🇺🇿",
    about_p1: 'Men Mekhriddin Abdualim, <strong style="color:var(--gold)">UzLeeder</strong> asoschisiman — liderlar uchun yaratilgan veb-dasturlash brendi. Men ingliz tili akademiyalari, o\'quv markazlari va kichik bizneslar uchun zamonaviy, professional saytlar yarataman, eng so\'nggi AI vositalaridan foydalanib.',
    about_p2: "Maqsadim oddiy: har bir biznesga kuchli onlayn mavjudlik berish — tez, chiroyli va hamyonbop. Dizayndan to yetkazib berishgacha hammasini o'zim qilaman, ishga tushirgandan keyin bepul yordam bilan.",
    about_p3: "Toshkent City, O'zbekistonda 🇺🇿 joylashganman — butun mamlakat bo'ylab mijozlar bilan ishlayman.",
    skill_resp: "Moslashuvchan dizayn", skill_ai: "AI vositalari", skill_tg: "Telegram integratsiya",
    as_delivered: "Yetkazilgan saytlar", as_satisfaction: "Mijoz mamnuniyati", as_days: "O'rtacha yetkazib berish kuni", as_support: "Bepul keyingi yordam",
    port_kicker: "Portfolio", port_title: "So'nggi loyihalarim", port_sub: "Har bir loyiha g'amxo'rlik, toza kod va natijaga e'tibor bilan quriladi.",
    tag_live: "Faol", tag_soon: "Tez kunda",
    proj1: "Sariosiyodagi ingliz tili akademiyasi uchun to'liq sayt — kurslar ro'yxati, ro'yxatdan o'tish formasi, Telegram integratsiyasi va CMS qo'llab-quvvatlash bilan.",
    proj2_title: "Matematika to'garagi", proj2: "Oltin va navy brending bilan premium matematika sayti, kurs ma'lumotlari, narx bo'limi va 38-maktab uchun aloqa integratsiyasi.",
    proj3_title: "Sizning loyihangiz", proj3: "Bu sizning saytingiz bo'lishi mumkin! Men biznesingiz uchun professional onlayn mavjudlik yaratishga tayyorman — tez, chiroyli va hamyonbop.",
    tech_anim: "Animatsiyalar", tech_resp: "Moslashuvchan", tech_custom: "Maxsus dizayn", tech_mobile: "Mobil tayyor", tech_fast: "Tez yetkazish",
    svc_kicker: "Xizmatlar", svc_title: "Siz uchun nima yarata olaman", svc_sub: "Biznesingiz ehtiyojlariga moslashtirilgan professional saytlar.",
    svc1_title: "Akademiya sayti", svc1: "Ingliz tili akademiyalari va o'quv markazlari uchun to'liq sayt — kurslar, narxlar, aloqa va ro'yxat.",
    svc2_title: "Biznes landing sahifa", svc2: "Har qanday kichik biznes uchun toza, professional bir sahifali sayt — ko'proq mijoz jalb qilish uchun.",
    svc3_title: "Maxsus veb-dizayn", svc3: "Noyob brending, ranglar va tartib bilan to'liq maxsus dizayn — faqat siz uchun.",
    svc4_title: "Sayt texnik xizmati", svc4: "Mavjud saytlar uchun yangilanishlar, tuzatishlar va yaxshilanishlar. Mijozlarim uchun har doim bepul.",
    svc5_title: "Logo dizayni", svc5: "Brendingizni aks ettiruvchi noyob, professional logolar — ajralib turishingiz uchun.",
    svc6_title: "AI Video va Rasm", svc6: "Brendingiz, reklama va ijtimoiy tarmoqlar uchun ajoyib AI video va rasmlar.",
    svc7_title: "Email yozish", svc7: "Murojaat, savdo va biznes muloqoti uchun professional, ishonarli emaillar.",
    svc8_title: "Taqdimotlar", svc8: "Biznes, pitch va ta'lim uchun e'tiborni tortadigan professional slaydlar.",
    from200: "$200 dan", from150: "$150 dan", from250: "$250 dan", free_clients: "Mijozlar uchun bepul",
    from15: "$15 dan", from10: "$10 dan", from10b: "$10 dan", from15b: "$15 dan",
    creative_kicker: "Ijodiy xizmatlar", creative_title: "Faqat saytlar emas", creative_sub: "Logolar, AI media, emaillar va taqdimotlar — brendingizga kerak bo'lgan hamma narsa.", starting_from: "boshlang'ich narx",
    price_kicker: "Narxlar", price_title: "Oddiy va shaffof narxlar", price_sub: "Yashirin to'lovlar yo'q. Ko'rganingiz — to'laganingiz.",
    one_time: "bir martalik to'lov", based_req: "talablarga asoslangan", popular: "Eng ommabop", get_started: "Boshlash", lets_talk: "Gaplashamiz",
    f_landing: "Landing sahifa (1 sahifa)", f_mobile: "Mobil moslashuvchan", f_contact: "Aloqa bo'limi", f_tg: "Telegram integratsiya", f_3day: "3 kunda yetkazish", f_support: "Bepul yordam",
    f_multi: "Ko'p sahifali sayt", f_custom: "Maxsus dizayn va brending", f_reg: "Ro'yxatdan o'tish formasi", f_tgphone: "Telegram + telefon integratsiya", f_cms: "CMS (tahrirlanadigan kontent)", f_5day: "5 kunda yetkazish", f_forever: "Abadiy bepul yordam",
    f_everything: "Professional'dagi hamma narsa", f_adv: "Ilg'or animatsiyalar", f_backend: "Backend integratsiya", f_domain: "Domen sozlash yordami", f_priority: "Ustuvor yetkazish", f_lifetime: "Umrbod bepul yordam",
    contact_title: "Keling, birga ishlaymiz", contact_sub: "Biznesingizni onlayn qilishga tayyormisiz? Quyida xabar qoldiring yoki Telegram orqali yozing — tez javob beraman va birga zo'r narsa quramiz.",
    msg_tg: "Telegram orqali yozish", send_email: "Email yuborish", phone_label: "Telefon", loc_city: "Toshkent City, O'zbekiston 🇺🇿", loc_label: "Manzil",
    form_name: "Ismingiz", form_name_ph: "masalan, Akmal Valiyev", form_email: "Email", form_email_ph: "siz@example.com",
    form_msg: "Xabar", form_msg_ph: "Loyihangiz haqida yozing...", form_send: "Xabar yuborish", form_sending: "Yuborilmoqda...",
    form_ok: "Xabaringiz yuborildi! Tez orada javob beraman. 🎉", form_err: "Xatolik yuz berdi. Qayta urinib ko'ring yoki Telegramdan foydalaning.",
    form_invalid: "Iltimos, barcha maydonlarni to'g'ri email bilan to'ldiring.",
    roles: ["AI Veb-dasturchi", "UzLeeder asoschisi", "UI/UX Dizayner", "Frilanser dasturchi"]
  },
  tg: {
    tag: "Барои пешвоён", nav_about: "Дар бораи ман", nav_portfolio: "Портфолио", nav_services: "Хизматрасонӣ", nav_pricing: "Нархҳо", nav_contact: "Тамос",
    hero_title: 'Салом, ман <span>Меҳриддин</span> Абдуалим', hero_desc: "Ман барои бизнес, академия ва брендҳо сайтҳои муосир, зуд ва зебо месозам — бо коди тоза ва абзорҳои зеҳни сунъӣ.",
    btn_work: "Корҳои ман", btn_contact: "Тамос гиред", stat_projects: "Лоиҳаҳо", stat_support: "Дастгирии муштарӣ", stat_delivery: "Расонидан",
    photo_role: "Асосгузор · Барномасози AI", soon: "Ба зудӣ",
    about_kicker: "Дар бораи ман", about_title: "Меҳриддин кист?", about_sub: "Барномасози ҷавони AI аз Тошканд Сити, Ӯзбекистон 🇺🇿 — бо ҳар сайт ояндаро месозад.",
    about_p1: 'Ман Меҳриддин Абдуалим, асосгузори <strong style="color:var(--gold)">UzLeeder</strong> — бренди веб-барномасозӣ барои пешвоён. Ман дар сохтани сайтҳои муосир ва касбӣ барои академияҳои забони англисӣ, марказҳои таълимӣ ва бизнесҳои хурд тахассус дорам, бо истифода аз абзорҳои навтарини AI.',
    about_p2: "Мақсади ман содда аст: ба ҳар бизнес ҳузури қавии онлайн додан — зуд, зебо ва арзон. Ман ҳама чизро аз тарроҳӣ то расонидан худам иҷро мекунам, бо дастгирии ройгон пас аз оғоз.",
    about_p3: "Дар Тошканд Сити, Ӯзбекистон 🇺🇿 ҷойгир — бо муштариён дар саросари кишвар кор мекунам.",
    skill_resp: "Тарроҳии мутобиқшаванда", skill_ai: "Абзорҳои AI", skill_tg: "Интегратсияи Telegram",
    as_delivered: "Сайтҳои расонидашуда", as_satisfaction: "Қаноатмандии муштарӣ", as_days: "Рӯзҳои миёнаи расонидан", as_support: "Дастгирии ройгони баъдӣ",
    port_kicker: "Портфолио", port_title: "Лоиҳаҳои охирини ман", port_sub: "Ҳар лоиҳа бо ғамхорӣ, коди тоза ва диққат ба натиҷа сохта мешавад.",
    tag_live: "Фаъол", tag_soon: "Ба зудӣ",
    proj1: "Сайти пурра барои академияи забони англисӣ дар Сариосиё — бо рӯйхати курсҳо, шакли сабт, интегратсияи Telegram ва дастгирии CMS.",
    proj2_title: "Маркази математика", proj2: "Сайти премиуми математика бо брендинги тилло ва navy, маълумоти курс, бахши нарх ва интегратсияи тамос барои мактаби №38.",
    proj3_title: "Лоиҳаи шумо", proj3: "Ин метавонад сайти шумо бошад! Ман омодаам барои бизнеси шумо ҳузури касбии онлайн созам — зуд, зебо ва арзон.",
    tech_anim: "Анимуатсияҳо", tech_resp: "Мутобиқшаванда", tech_custom: "Тарроҳии махсус", tech_mobile: "Барои мобил омода", tech_fast: "Расонидани зуд",
    svc_kicker: "Хизматрасонӣ", svc_title: "Барои шумо чӣ сохта метавонам", svc_sub: "Сайтҳои касбӣ мутобиқ ба ниёзҳои бизнеси шумо.",
    svc1_title: "Сайти академия", svc1: "Сайти пурра барои академияҳои англисӣ ва марказҳои таълимӣ — курсҳо, нархҳо, тамос ва сабт.",
    svc2_title: "Саҳифаи фуруди бизнес", svc2: "Сайти тоза ва касбии яксаҳифагӣ барои ҳар бизнеси хурд — барои ҷалби муштариёни бештар.",
    svc3_title: "Тарроҳии махсуси веб", svc3: "Тарроҳии комилан махсус бо брендинг, рангҳо ва тартиби нодир — танҳо барои шумо.",
    svc4_title: "Хизмати техникии сайт", svc4: "Навсозӣ, ислоҳ ва беҳсозӣ барои сайтҳои мавҷуда. Барои муштариёни ман ҳамеша ройгон.",
    svc5_title: "Тарроҳии лого", svc5: "Логоҳои нодир ва касбӣ, ки ҳувияти брендатонро инъикос мекунанд ва шуморо барҷаста месозанд.",
    svc6_title: "Видео ва Аксҳои AI", svc6: "Видео ва аксҳои аҷоиби AI барои бренд, реклама ва шабакаҳои иҷтимоии шумо.",
    svc7_title: "Навиштани Email", svc7: "Email-ҳои касбӣ ва бовариноки барои муроҷиат, фурӯш ва иртиботи тиҷоратӣ.",
    svc8_title: "Презентатсияҳо", svc8: "Слайдҳои касбӣ ва ҷолиб барои тиҷорат, пешниҳод ва таълим.",
    from200: "аз $200", from150: "аз $150", from250: "аз $250", free_clients: "Барои муштариён ройгон",
    from15: "аз $15", from10: "аз $10", from10b: "аз $10", from15b: "аз $15",
    creative_kicker: "Хизматҳои эҷодӣ", creative_title: "На танҳо сайтҳо", creative_sub: "Логоҳо, медиаи AI, email-ҳо ва презентатсияҳо — ҳама чизе ки брендатон ниёз дорад.", starting_from: "аз нарх",
    price_kicker: "Нархҳо", price_title: "Нархҳои содда ва шаффоф", price_sub: "Пардохтҳои пинҳон нест. Он чӣ мебинед — ҳамон пардохт мекунед.",
    one_time: "пардохти яккарата", based_req: "вобаста ба талабот", popular: "Маъмултарин", get_started: "Оғоз кардан", lets_talk: "Сӯҳбат мекунем",
    f_landing: "Саҳифаи фуруд (1 саҳифа)", f_mobile: "Мутобиқ ба мобил", f_contact: "Бахши тамос", f_tg: "Интегратсияи Telegram", f_3day: "Расонидан дар 3 рӯз", f_support: "Дастгирии ройгон",
    f_multi: "Сайти бисёрсаҳифагӣ", f_custom: "Тарроҳӣ ва брендинги махсус", f_reg: "Шакли сабт", f_tgphone: "Интегратсияи Telegram + телефон", f_cms: "CMS (мундариҷаи таҳриршаванда)", f_5day: "Расонидан дар 5 рӯз", f_forever: "Дастгирии ройгони абадӣ",
    f_everything: "Ҳама чизи Professional", f_adv: "Анимуатсияҳои пешрафта", f_backend: "Интегратсияи backend", f_domain: "Кӯмак дар танзими домен", f_priority: "Расонидани афзалиятнок", f_lifetime: "Дастгирии ройгони якумрӣ",
    contact_title: "Биёед якҷоя кор кунем", contact_sub: "Омодаед бизнесатонро онлайн кунед? Дар поён паём гузоред ё тавассути Telegram нависед — зуд ҷавоб медиҳам ва якҷоя чизи аъло месозем.",
    msg_tg: "Тавассути Telegram навиштан", send_email: "Email фиристодан", phone_label: "Телефон", loc_city: "Тошканд Сити, Ӯзбекистон 🇺🇿", loc_label: "Ҷойгиршавӣ",
    form_name: "Номи шумо", form_name_ph: "масалан, Аҳмад Валиев", form_email: "Email", form_email_ph: "shumo@example.com",
    form_msg: "Паём", form_msg_ph: "Дар бораи лоиҳаи худ нависед...", form_send: "Паём фиристодан", form_sending: "Фиристода истодааст...",
    form_ok: "Паёми шумо фиристода шуд! Ба зудӣ ҷавоб медиҳам. 🎉", form_err: "Хатогӣ рух дод. Бори дигар кӯшиш кунед ё аз Telegram истифода баред.",
    form_invalid: "Лутфан ҳама майдонҳоро бо email-и дуруст пур кунед.",
    roles: ["Барномасози AI", "Асосгузори UzLeeder", "Тарроҳи UI/UX", "Барномасози фриланс"]
  },
  ru: {
    tag: "Для лидеров", nav_about: "Обо мне", nav_portfolio: "Портфолио", nav_services: "Услуги", nav_pricing: "Цены", nav_contact: "Контакты",
    hero_title: 'Привет, я <span>Мехриддин</span> Абдуалим', hero_desc: "Я создаю современные, быстрые и красивые сайты для бизнеса, академий и брендов — на основе чистого кода и умных AI-инструментов.",
    btn_work: "Мои работы", btn_contact: "Связаться", stat_projects: "Проекты", stat_support: "Поддержка клиентов", stat_delivery: "Доставка",
    photo_role: "Основатель · AI Веб-разработчик", soon: "Скоро",
    about_kicker: "Обо мне", about_title: "Кто такой Мехриддин?", about_sub: "Молодой AI веб-разработчик из Ташкент Сити, Узбекистан 🇺🇿 — создающий будущее по одному сайту.",
    about_p1: 'Я Мехриддин Абдуалим, основатель <strong style="color:var(--gold)">UzLeeder</strong> — бренда веб-разработки для лидеров. Я специализируюсь на создании современных, профессиональных сайтов для академий английского языка, учебных центров и малого бизнеса, используя новейшие AI-инструменты.',
    about_p2: "Моя цель проста: дать каждому бизнесу сильное онлайн-присутствие — быстро, красиво и доступно. Я делаю всё от дизайна до запуска, с бесплатной поддержкой после старта.",
    about_p3: "Нахожусь в Ташкент Сити, Узбекистан 🇺🇿 — работаю с клиентами по всей стране.",
    skill_resp: "Адаптивный дизайн", skill_ai: "AI-инструменты", skill_tg: "Интеграция Telegram",
    as_delivered: "Сданных сайтов", as_satisfaction: "Удовлетворённость клиентов", as_days: "Дней в среднем на доставку", as_support: "Бесплатная поддержка после запуска",
    port_kicker: "Портфолио", port_title: "Мои недавние проекты", port_sub: "Каждый проект создаётся с заботой, чистым кодом и фокусом на результат.",
    tag_live: "Активен", tag_soon: "Скоро",
    proj1: "Полноценный сайт для академии английского языка в Сариосие — с курсами, формой регистрации, интеграцией Telegram и поддержкой CMS.",
    proj2_title: "Курсы математики", proj2: "Премиум-сайт по математике с золото-синим брендингом, информацией о курсах, разделом цен и контактами для школы №38.",
    proj3_title: "Ваш проект", proj3: "Это может быть ваш сайт! Я готов создать профессиональное онлайн-присутствие для вашего бизнеса — быстро, красиво и доступно.",
    tech_anim: "Анимации", tech_resp: "Адаптивный", tech_custom: "Индивидуальный дизайн", tech_mobile: "Готов для мобильных", tech_fast: "Быстрая доставка",
    svc_kicker: "Услуги", svc_title: "Что я могу создать для вас", svc_sub: "Профессиональные сайты под нужды вашего бизнеса.",
    svc1_title: "Сайт академии", svc1: "Полный сайт для академий английского и учебных центров — курсы, цены, контакты и регистрация.",
    svc2_title: "Лендинг для бизнеса", svc2: "Чистый, профессиональный одностраничный сайт для любого малого бизнеса — для привлечения клиентов.",
    svc3_title: "Индивидуальный веб-дизайн", svc3: "Полностью индивидуальный дизайн с уникальным брендингом, цветами и макетом — только для вас.",
    svc4_title: "Обслуживание сайта", svc4: "Обновления, исправления и улучшения для существующих сайтов. Всегда бесплатно для моих клиентов.",
    svc5_title: "Дизайн логотипа", svc5: "Уникальные, профессиональные логотипы, отражающие айдентику вашего бренда.",
    svc6_title: "AI Видео и Фото", svc6: "Потрясающие AI-видео и изображения для вашего бренда, рекламы и соцсетей.",
    svc7_title: "Написание Email", svc7: "Профессиональные, убедительные письма для рассылок, продаж и бизнес-общения.",
    svc8_title: "Презентации", svc8: "Яркие, профессиональные слайды для бизнеса, питчей и образования.",
    from200: "от $200", from150: "от $150", from250: "от $250", free_clients: "Бесплатно для клиентов",
    from15: "от $15", from10: "от $10", from10b: "от $10", from15b: "от $15",
    creative_kicker: "Креативные услуги", creative_title: "Не только сайты", creative_sub: "Логотипы, AI-медиа, письма и презентации — всё, что нужно вашему бренду.", starting_from: "от",
    price_kicker: "Цены", price_title: "Простые, прозрачные цены", price_sub: "Никаких скрытых платежей. Что видите — то и платите.",
    one_time: "разовый платёж", based_req: "по требованиям", popular: "Самый популярный", get_started: "Начать", lets_talk: "Обсудим",
    f_landing: "Лендинг (1 страница)", f_mobile: "Адаптивный под мобильные", f_contact: "Раздел контактов", f_tg: "Интеграция Telegram", f_3day: "Доставка за 3 дня", f_support: "Бесплатная поддержка",
    f_multi: "Многостраничный сайт", f_custom: "Индивидуальный дизайн и брендинг", f_reg: "Форма регистрации", f_tgphone: "Интеграция Telegram + телефон", f_cms: "CMS (редактируемый контент)", f_5day: "Доставка за 5 дней", f_forever: "Бесплатная поддержка навсегда",
    f_everything: "Всё из Professional", f_adv: "Продвинутые анимации", f_backend: "Интеграция backend", f_domain: "Помощь с доменом", f_priority: "Приоритетная доставка", f_lifetime: "Пожизненная бесплатная поддержка",
    contact_title: "Давайте работать вместе", contact_sub: "Готовы вывести бизнес в онлайн? Напишите мне ниже или свяжитесь в Telegram — отвечу быстро, и мы создадим нечто отличное.",
    msg_tg: "Написать в Telegram", send_email: "Отправить Email", phone_label: "Телефон", loc_city: "Ташкент Сити, Узбекистан", loc_label: "Локация",
    form_name: "Ваше имя", form_name_ph: "например, Иван Петров", form_email: "Email", form_email_ph: "you@example.com",
    form_msg: "Сообщение", form_msg_ph: "Расскажите о вашем проекте...", form_send: "Отправить сообщение", form_sending: "Отправка...",
    form_ok: "Сообщение отправлено! Скоро отвечу. 🎉", form_err: "Что-то пошло не так. Попробуйте снова или напишите в Telegram.",
    form_invalid: "Пожалуйста, заполните все поля и укажите корректный email.",
    roles: ["AI Веб-разработчик", "Основатель UzLeeder", "UI/UX Дизайнер", "Фриланс-разработчик"]
  }
};

const labels = { en: "EN", uz: "UZ", tg: "TJ", ru: "RU" };
const LANG_KEY = "uzleeder_lang";
const THEME_KEY = "uzleeder_theme";

let curLang = "en";
let typeTimer = null, rIdx = 0, cIdx = 0, deleting = false;
const typedEl = document.getElementById("typed");

/* ===== Language ===== */
function applyLang(lang) {
  if (!i18n[lang]) lang = "en";
  curLang = lang;
  const dict = i18n[lang];
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key] != null) el.innerHTML = dict[key];
  });
  // placeholders
  document.querySelectorAll("[data-i18n-ph]").forEach(el => {
    const key = el.getAttribute("data-i18n-ph");
    if (dict[key] != null) el.setAttribute("placeholder", dict[key]);
  });
  document.getElementById("langLabel").textContent = labels[lang];
  document.documentElement.lang = lang;
  document.querySelectorAll(".lang-opt").forEach(o => o.classList.toggle("active", o.dataset.lang === lang));
  try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
  // restart typing with new roles
  clearTimeout(typeTimer); rIdx = 0; cIdx = 0; deleting = false; typedEl.textContent = "";
  typeLoop();
}

function typeLoop() {
  const roles = i18n[curLang].roles;
  const word = roles[rIdx];
  if (!deleting) {
    typedEl.textContent = word.slice(0, ++cIdx);
    if (cIdx === word.length) { deleting = true; typeTimer = setTimeout(typeLoop, 1600); return; }
  } else {
    typedEl.textContent = word.slice(0, --cIdx);
    if (cIdx === 0) { deleting = false; rIdx = (rIdx + 1) % roles.length; }
  }
  typeTimer = setTimeout(typeLoop, deleting ? 55 : 95);
}

// language dropdown
const langWrap = document.getElementById("langWrap");
document.getElementById("langBtn").addEventListener("click", e => { e.stopPropagation(); langWrap.classList.toggle("open"); });
document.querySelectorAll(".lang-opt").forEach(o => o.addEventListener("click", () => { applyLang(o.dataset.lang); langWrap.classList.remove("open"); }));
document.addEventListener("click", () => langWrap.classList.remove("open"));

/* ===== Theme ===== */
const root = document.documentElement;
let theme = root.getAttribute("data-theme") || "dark";
// Address-bar / status-bar color on Android Chrome & iOS Safari
const THEME_COLORS = { dark: "#0b0f1a", light: "#f7f5ef" };
function applyTheme(t) {
  theme = t === "light" ? "light" : "dark";
  root.setAttribute("data-theme", theme);
  const meta = document.getElementById("themeColor");
  if (meta) meta.setAttribute("content", THEME_COLORS[theme]);
  try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
}
document.getElementById("themeToggle").addEventListener("click", () => applyTheme(theme === "dark" ? "light" : "dark"));

/* ===== Mobile menu ===== */
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
menuBtn.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
});
navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
}));

/* ===== Navbar scroll ===== */
window.addEventListener("scroll", () => {
  document.getElementById("navbar").style.padding = window.scrollY > 60 ? ".7rem 2.5rem" : "1rem 2.5rem";
});

/* ===== Reveal on scroll ===== */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("show"); io.unobserve(e.target); } });
}, { threshold: .12 });
document.querySelectorAll(".reveal").forEach((el, i) => { el.style.transitionDelay = (i % 4 * .08) + "s"; io.observe(el); });

/* ===== Toast notifications ===== */
function toast(message, type) {
  const wrap = document.getElementById("toastWrap");
  const el = document.createElement("div");
  el.className = "toast " + (type || "");
  const icon = type === "err" ? "#i-alert" : "#i-check";
  el.innerHTML = '<svg class="ico"><use href="' + icon + '"/></svg><span></span>';
  el.querySelector("span").textContent = message;
  wrap.appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));
  setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 400);
  }, 4500);
}

/* ===== Contact form ===== */
const form = document.getElementById("contactForm");
if (form) {
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const dict = i18n[curLang];
    const data = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      message: form.elements.message.value.trim()
    };

    // client-side validation
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
    if (!data.name || !data.message || !emailOk) {
      toast(dict.form_invalid, "err");
      return;
    }

    const btn = form.querySelector(".form-submit");
    btn.classList.add("loading");
    btn.disabled = true;

    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      toast(dict.form_ok, "ok");
      form.reset();
    } catch (err) {
      console.error("Contact form error:", err);
      toast(dict.form_err, "err");
    } finally {
      btn.classList.remove("loading");
      btn.disabled = false;
    }
  });
}

/* ===== Init ===== */
(function init() {
  // restore theme — fall back to the phone's system setting on first visit
  let savedTheme;
  try { savedTheme = localStorage.getItem(THEME_KEY); } catch (e) {}
  if (!savedTheme && window.matchMedia) {
    savedTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  applyTheme(savedTheme || theme);

  // restore language (fall back to browser language, then English)
  let savedLang;
  try { savedLang = localStorage.getItem(LANG_KEY); } catch (e) {}
  if (!savedLang) {
    const nav = (navigator.language || "en").slice(0, 2);
    savedLang = i18n[nav] ? nav : "en";
  }
  applyLang(savedLang);
})();
