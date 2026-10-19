// Case study: UzLeeder Academy — facts only from the project description published in the Control Center.
// Merged into each language's `cases` by build-i18n.js. UZ/RU/FA/AR: drafts for native review.
module.exports = {
en: {
  cat: "Education · Personal learning system · UzLeeder product",
  lead: "A private, single-learner study system — not a public LMS — with human-written courses and human feedback.",
  overview: "One student follows a fixed loop: plan → lesson → practice → quiz → mistake → repeat → mastery → project → feedback. Three staff roles — controller, teacher and English teacher — monitor, assign and review from a separate panel. The content is written, not generated: a 30-day Python course with 300 quiz questions, a 140-day IELTS 8.0 track with 20 weekly tests, 44 grammar topics with exercises, 72 IELTS-format reading passages, 600 vocabulary words, a 14-chapter DataCamp track, a 30-day speaking program and a 154-day daily schedule built around astronomically computed prayer times.",
  challenge: "Preparing for Python and IELTS 8.0 at the same time needs one place that plans every day, keeps lessons, practice and mistakes together, works without internet, and lets teachers assign and review — without the noise of a public course platform and without automatic AI scoring.",
  solution: "A framework-free progressive web app (~41,000 lines of JavaScript, most of it hand-written course content) with 9 Vercel serverless functions. It is offline-first: localStorage is always the source of truth and the cloud is a copy, so two devices merge instead of overwriting each other. Every route sits behind an HMAC-signed session cookie checked at the edge, and all four roles are enforced on the server. Every assignment and every piece of feedback is written by a human.",
  role: "Sole designer, architect and developer — built with an AI-assisted workflow, directed and validated by Max.",
  result: "Live at uzleeder-academy.vercel.app. Automated checks: API tests 72/72 passed, edge middleware tests 14/14 passed, schedule validation — every day template covers exactly 1,440 minutes with no overlaps, English track audit — 140/140 days and 20 weekly tests present.",
  arch: [
    ["Users", "Student · controller · teacher · English teacher"],
    ["App", "Offline-first PWA — vanilla JavaScript, Service Worker, IndexedDB"],
    ["Learning loop", "Plan → lesson → practice → quiz → mistakes → mastery → project → feedback"],
    ["Security", "HMAC-signed session cookie at the edge · roles enforced server-side · PBKDF2"],
    ["API", "9 Vercel serverless functions"],
    ["Data", "localStorage as source of truth → Neon Postgres copy · Vercel Blob for media"],
    ["Output", "Human-written assignments and feedback — no AI scoring"]
  ]
},
uz: {
  cat: "Ta'lim · Shaxsiy o'quv tizimi · UzLeeder mahsuloti",
  lead: "Bitta o'quvchi uchun yopiq o'quv tizimi — ommaviy LMS emas — kurslari va fikr-mulohazalari inson tomonidan yozilgan.",
  overview: "Bitta o'quvchi qat'iy sikl bo'yicha o'qiydi: reja → dars → mashq → test → xato → takror → o'zlashtirish → loyiha → fikr-mulohaza. Uchta xodim roli — nazoratchi, o'qituvchi va ingliz tili o'qituvchisi — alohida paneldan kuzatadi, topshiriq beradi va tekshiradi. Kontent yaratilmagan, yozilgan: 300 ta test savolli 30 kunlik Python kursi, 20 ta haftalik testli 140 kunlik IELTS 8.0 yo'nalishi, mashqli 44 ta grammatika mavzusi, IELTS formatidagi 72 ta o'qish matni, 600 ta so'z, 14 bobli DataCamp yo'nalishi, 30 kunlik speaking dasturi va astronomik hisoblangan namoz vaqtlari atrofida qurilgan 154 kunlik kundalik jadval.",
  challenge: "Python va IELTS 8.0 ga bir vaqtda tayyorlanish uchun har kunni rejalaydigan, dars, mashq va xatolarni bir joyda saqlaydigan, internetsiz ishlaydigan va o'qituvchilarga topshiriq berib tekshirishga imkon beradigan bitta joy kerak — ommaviy kurs platformasining shovqinisiz va AI avtomatik baholashisiz.",
  solution: "Frameworksiz progressiv veb-ilova (~41 000 qator JavaScript, asosan qo'lda yozilgan kurs kontenti) va 9 ta Vercel serverless funksiyasi. Offline-first: localStorage doim asosiy manba, bulut esa nusxa — shuning uchun ikki qurilma bir-birini o'chirmaydi, birlashadi. Har bir yo'l edge'da tekshiriladigan HMAC imzoli sessiya cookie'si ortida, to'rtala rol serverda nazorat qilinadi. Har bir topshiriq va har bir fikr-mulohazani inson yozadi.",
  role: "Yagona dizayner, arxitektor va dasturchi — AI yordamidagi jarayon bilan, Max yo'naltirgan va tekshirgan.",
  result: "uzleeder-academy.vercel.app manzilida ishlamoqda. Avtomatik tekshiruvlar: API testlari 72/72 o'tdi, edge middleware testlari 14/14 o'tdi, jadval tekshiruvi — har bir kun shabloni aniq 1 440 daqiqani qamraydi, ustma-ust tushish yo'q, ingliz tili yo'nalishi auditi — 140/140 kun va 20 ta haftalik test mavjud.",
  arch: [
    ["Foydalanuvchilar", "O'quvchi · nazoratchi · o'qituvchi · ingliz tili o'qituvchisi"],
    ["Ilova", "Offline-first PWA — vanilla JavaScript, Service Worker, IndexedDB"],
    ["O'quv sikli", "Reja → dars → mashq → test → xatolar → o'zlashtirish → loyiha → fikr-mulohaza"],
    ["Xavfsizlik", "Edge'da HMAC imzoli sessiya cookie · rollar serverda · PBKDF2"],
    ["API", "9 ta Vercel serverless funksiya"],
    ["Ma'lumotlar", "localStorage asosiy manba → Neon Postgres nusxasi · media uchun Vercel Blob"],
    ["Natija", "Inson yozgan topshiriq va fikr-mulohazalar — AI baholash yo'q"]
  ]
},
ru: {
  cat: "Образование · Личная учебная система · Продукт UzLeeder",
  lead: "Закрытая учебная система для одного ученика — не публичная LMS — с курсами и обратной связью, написанными людьми.",
  overview: "Один ученик проходит фиксированный цикл: план → урок → практика → тест → ошибка → повтор → освоение → проект → обратная связь. Три роли сотрудников — контролёр, преподаватель и преподаватель английского — наблюдают, назначают задания и проверяют их из отдельной панели. Контент написан, а не сгенерирован: 30-дневный курс Python с 300 вопросами, 140-дневная программа IELTS 8.0 с 20 еженедельными тестами, 44 темы грамматики с упражнениями, 72 текста для чтения в формате IELTS, 600 слов, 14 глав DataCamp, 30-дневная программа speaking и 154-дневное расписание, построенное вокруг астрономически рассчитанного времени намаза.",
  challenge: "Для одновременной подготовки к Python и IELTS 8.0 нужно одно место, которое планирует каждый день, хранит уроки, практику и ошибки вместе, работает без интернета и позволяет преподавателям назначать и проверять задания — без шума публичной платформы и без автоматической AI-оценки.",
  solution: "Прогрессивное веб-приложение без фреймворка (~41 000 строк JavaScript, в основном написанный вручную контент курсов) и 9 серверных функций Vercel. Offline-first: localStorage всегда основной источник, облако — копия, поэтому два устройства объединяются, а не перезаписывают друг друга. Каждый маршрут защищён сессионной cookie с HMAC-подписью, проверяемой на edge, все четыре роли проверяются на сервере. Каждое задание и каждый отзыв пишет человек.",
  role: "Единственный дизайнер, архитектор и разработчик — AI-ассистированная разработка под руководством и с проверкой Макса.",
  result: "Работает на uzleeder-academy.vercel.app. Автоматические проверки: тесты API 72/72, тесты edge middleware 14/14, проверка расписания — каждый шаблон дня покрывает ровно 1 440 минут без пересечений, аудит английской программы — 140/140 дней и 20 еженедельных тестов на месте.",
  arch: [
    ["Пользователи", "Ученик · контролёр · преподаватель · преподаватель английского"],
    ["Приложение", "Offline-first PWA — vanilla JavaScript, Service Worker, IndexedDB"],
    ["Учебный цикл", "План → урок → практика → тест → ошибки → освоение → проект → отзыв"],
    ["Безопасность", "Сессионная cookie с HMAC на edge · роли на сервере · PBKDF2"],
    ["API", "9 серверных функций Vercel"],
    ["Данные", "localStorage как источник → копия в Neon Postgres · Vercel Blob для медиа"],
    ["Результат", "Задания и отзывы пишут люди — без AI-оценки"]
  ]
},
fa: {
  cat: "آموزش · سامانهٔ یادگیری شخصی · محصول UzLeeder",
  lead: "سامانهٔ آموزشی خصوصی برای یک یادگیرنده — نه یک LMS عمومی — با دوره‌ها و بازخوردهایی که انسان نوشته است.",
  overview: "یک دانش‌آموز چرخه‌ای ثابت را دنبال می‌کند: برنامه ← درس ← تمرین ← آزمون ← اشتباه ← تکرار ← تسلط ← پروژه ← بازخورد. سه نقش کارکنان — ناظر، معلم و معلم زبان انگلیسی — از پنلی جداگانه پایش، تکلیف و بازبینی می‌کنند. محتوا نوشته شده، نه تولیدشده: دورهٔ ۳۰ روزهٔ پایتون با ۳۰۰ سؤال، مسیر ۱۴۰ روزهٔ IELTS 8.0 با ۲۰ آزمون هفتگی، ۴۴ موضوع گرامر با تمرین، ۷۲ متن خواندن در قالب IELTS، ۶۰۰ واژه، مسیر ۱۴ فصلی DataCamp، برنامهٔ ۳۰ روزهٔ speaking و برنامهٔ روزانهٔ ۱۵۴ روزه بر پایهٔ اوقات نماز محاسبه‌شده به‌صورت نجومی.",
  challenge: "آمادگی هم‌زمان برای پایتون و IELTS 8.0 به یک جا نیاز دارد که هر روز را برنامه‌ریزی کند، درس و تمرین و اشتباه‌ها را کنار هم نگه دارد، بدون اینترنت کار کند و به معلمان اجازهٔ تکلیف و بازبینی بدهد — بدون شلوغی یک پلتفرم عمومی و بدون نمره‌دهی خودکار هوش مصنوعی.",
  solution: "یک وب‌اپلیکیشن پیش‌رونده بدون فریم‌ورک (حدود ۴۱٬۰۰۰ خط جاوااسکریپت، بیشتر محتوای دستیِ دوره‌ها) و ۹ تابع serverless در Vercel. Offline-first است: localStorage همیشه منبع اصلی است و ابر یک نسخه — پس دو دستگاه به‌جای بازنویسی، ادغام می‌شوند. هر مسیر پشت کوکی نشستِ امضاشده با HMAC است که در edge بررسی می‌شود و هر چهار نقش در سرور اعمال می‌شوند. هر تکلیف و هر بازخورد را انسان می‌نویسد.",
  role: "تنها طراح، معمار و توسعه‌دهنده — با گردش‌کار به‌کمک هوش مصنوعی، با هدایت و اعتبارسنجی مکس.",
  result: "در uzleeder-academy.vercel.app فعال است. بررسی‌های خودکار: آزمون‌های API ‏۷۲/۷۲، آزمون‌های edge middleware ‏۱۴/۱۴، اعتبارسنجی برنامه — هر قالب روز دقیقاً ۱٬۴۴۰ دقیقه بدون هم‌پوشانی، ممیزی مسیر انگلیسی — ۱۴۰/۱۴۰ روز و ۲۰ آزمون هفتگی.",
  arch: [
    ["کاربران", "دانش‌آموز · ناظر · معلم · معلم انگلیسی"],
    ["اپلیکیشن", "PWA آفلاین‌محور — جاوااسکریپت خالص، Service Worker، IndexedDB"],
    ["چرخهٔ یادگیری", "برنامه ← درس ← تمرین ← آزمون ← اشتباه‌ها ← تسلط ← پروژه ← بازخورد"],
    ["امنیت", "کوکی نشست امضاشده با HMAC در edge · نقش‌ها در سرور · PBKDF2"],
    ["API", "۹ تابع serverless در Vercel"],
    ["داده", "localStorage منبع اصلی ← نسخه در Neon Postgres · Vercel Blob برای رسانه"],
    ["خروجی", "تکلیف و بازخورد نوشتهٔ انسان — بدون نمره‌دهی هوش مصنوعی"]
  ]
},
ar: {
  cat: "التعليم · نظام تعلّم شخصي · منتج UzLeeder",
  lead: "نظام دراسي خاص لمتعلّم واحد — وليس منصة تعليم عامة — بدورات وملاحظات يكتبها البشر.",
  overview: "يتبع طالب واحد حلقة ثابتة: خطة ← درس ← تدريب ← اختبار ← خطأ ← تكرار ← إتقان ← مشروع ← ملاحظات. ثلاثة أدوار للموظفين — المراقب والمعلّم ومعلّم الإنجليزية — تتابع وتكلّف وتراجع من لوحة منفصلة. المحتوى مكتوب وليس مولّدًا: دورة بايثون لمدة 30 يومًا مع 300 سؤال، ومسار IELTS 8.0 لمدة 140 يومًا مع 20 اختبارًا أسبوعيًا، و44 موضوعًا في القواعد مع تمارين، و72 نصًا للقراءة بصيغة IELTS، و600 كلمة، ومسار DataCamp من 14 فصلًا، وبرنامج محادثة لمدة 30 يومًا، وجدول يومي لمدة 154 يومًا مبني حول أوقات الصلاة المحسوبة فلكيًا.",
  challenge: "يتطلب الاستعداد لبايثون وIELTS 8.0 معًا مكانًا واحدًا يخطط لكل يوم، ويجمع الدروس والتدريب والأخطاء، ويعمل دون إنترنت، ويسمح للمعلمين بالتكليف والمراجعة — دون ضجيج منصة عامة ودون تقييم آلي بالذكاء الاصطناعي.",
  solution: "تطبيق ويب تقدّمي دون إطار عمل (نحو 41,000 سطر JavaScript، معظمها محتوى دورات مكتوب يدويًا) و9 دوال serverless على Vercel. يعمل دون اتصال أولًا: localStorage هو المصدر الأساسي دائمًا والسحابة نسخة، لذلك يندمج جهازان بدل أن يكتب أحدهما فوق الآخر. كل مسار محمي بملف تعريف جلسة موقّع بـ HMAC يُفحص على الحافة، وتُفرض الأدوار الأربعة على الخادم. كل تكليف وكل ملاحظة يكتبها إنسان.",
  role: "المصمم والمهندس والمطوّر الوحيد — بسير عمل بمساعدة الذكاء الاصطناعي، بتوجيه ماكس وتحقّقه.",
  result: "يعمل على uzleeder-academy.vercel.app. الفحوص الآلية: اختبارات API ‏72/72، واختبارات edge middleware ‏14/14، والتحقق من الجدول — كل قالب يوم يغطي 1,440 دقيقة بالضبط دون تداخل، وتدقيق مسار الإنجليزية — 140/140 يومًا و20 اختبارًا أسبوعيًا.",
  arch: [
    ["المستخدمون", "طالب · مراقب · معلّم · معلّم إنجليزية"],
    ["التطبيق", "PWA يعمل دون اتصال — JavaScript خالص وService Worker وIndexedDB"],
    ["حلقة التعلّم", "خطة ← درس ← تدريب ← اختبار ← أخطاء ← إتقان ← مشروع ← ملاحظات"],
    ["الأمان", "جلسة موقّعة بـ HMAC على الحافة · الأدوار على الخادم · PBKDF2"],
    ["API", "9 دوال serverless على Vercel"],
    ["البيانات", "localStorage مصدرًا أساسيًا ← نسخة في Neon Postgres · Vercel Blob للوسائط"],
    ["المخرجات", "تكليفات وملاحظات يكتبها البشر — دون تقييم بالذكاء الاصطناعي"]
  ]
}
};
