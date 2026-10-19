# AGI · UzLeeder — V5 (AGI-first: AGI = yo'nalish, UzLeeder = kompaniya, SALAAM NEW ERA. = falsafa)

Max (Mekhriddin Abdualim) va UzLeeder brendining sayti hamda **UzLeeder Control Center** (admin).
Brend: **Bold Red** (qizil Λ + to'q ko'k, "FOR LEADERS"). Rang shablonlari admin → Design sahifasida.

Asosiy deploy: **Vercel** — https://uzleeder.vercel.app (canonical domen). Netlify — zaxira (faqat eski API).

## Fayllar tuzilishi

```
uzleeder/
├── index.html              ← sayt: Hero → Proof → Services → Work → SALAAM NEW ERA → AI Engineering →
│                             How I build → UzLeeder → Max → AI Team → Technology → Certificates →
│                             How it works → FAQ → Project brief (Contact)
├── en.html uz.html ru.html fa.html ar.html ← til sahifalari (/en /uz /ru /fa /ar) — build-locales.js yaratadi
├── style.css / script.js   ← dizayn tizimi / xatti-harakat (script.js build-i18n.js dan yig'iladi)
├── startups.html           ← /startups va /startups/<slug> — `build/build-startups.js` yaratadi (startups-data.js + startups-render.js
│                             + startups-client.js + startups.template.html). Ma'lumot: GET /api/startups (faqat e'lon qilingan)
├── projects/pitches/       ← T-Port 2.0 va CAIBER Learn 2.0 pitch PDF'lari (startap sahifalaridan havola)
├── crafted.js              ← "Crafted by UzLeeder" imzosi (mijoz saytlariga: <script src=…/crafted.js> + <uzleeder-crafted>)
├── sign.html               ← imzo haqida hammasi bitta faylda (jonli belgi, harakat, ranglar, kodlar) — `node server/build-sign.cjs`
├── verify.html             ← /verify/<raqam>?c=<kod> — startap sertifikatini ochiq tekshirish (api/_lib/certs.js)
├── agi.html                ← /agi — AGI yo'nalishi: Vision · Currently implemented · Future research (5 til, o'z ichida)
├── workspace.html          ← Workspace (/workspace) — Control Center paroli bilan
├── admin.html              ← Control Center (/admin)
├── doc-theme.js            ← hujjatlar sayt dizayniga ergashadi
├── brand/                  ← barcha logo, emblema, muhr (7 shablon, SVG + PNG) — /brand galereya
├── api/                    ← VERCEL backend (serverless + Vercel Blob)
│   ├── contact.js (project brief → lead), content.js, login.js, save.js, upload.js, admin.js, media/[key].js
│   └── _lib/ (auth, http, store, notify)
├── build/                  ← sayt manbalari: script.template.js, tarjimalar, build skriptlari (deploy qilinmaydi)
├── server/                 ← lokal server (node server/local-dev.cjs), build-brand.cjs — deploy qilinmaydi
├── sitemap.xml, robots.txt ← build-locales.js yaratadi
└── archive/                ← eski versiyalar (deploy qilinmaydi)
```

### Build (sayt matni yoki index.html o'zgarganda)

`script.js` va til sahifalari `build/` papkasidan generatsiya qilinadi (`script.template.js`, `i18n-*.js` — V5 matnlari `i18n-v5.js` da,
`lang-fa.js`, `lang-ar.js`). Tartib:

1. `index.html` dagi `style.css?v=…` / `script.js?v=…` versiyasini oshiring
2. `npm run build:site` → en/uz/ru/fa/ar.html, sitemap.xml, robots.txt va script.js
   (har bir `data-i18n` kaliti 5 tilda borligini tekshiradi; yo'q bo'lsa xato beradi)

Lokal ko'rish (API bilan): `npm run dev` → http://localhost:8080 va http://localhost:8080/admin

## API

| Manzil | Vazifa | Kim uchun |
|---|---|---|
| `POST /api/contact` | Project brief: tekshiradi → **avval saqlaydi (lead)** → Telegram (1 qayta urinish). Takroriy yuborish 10 daqiqada bir marta qabul qilinadi | ochiq |
| `GET /api/content` | E'lon qilingan kontent (`?draft=1` — admin uchun qoralama) | ochiq |
| `POST /api/login` | Parol → 12 soatlik token | admin |
| `POST /api/save` | `draft` / `publish` / `discard` | admin |
| `POST /api/upload` | Rasm yoki PDF (max 3 MB) | admin |
| `GET/POST /api/admin` | overview, leads, messages, log, media, versions, version (ko'rish), version.restore, lead.update/delete/notify, message.*, media.delete, password.change | admin |
| `GET /api/media/<key>` | Yuklangan fayllar | ochiq |
| `POST /api/workspace` | Workspace (`/workspace`): requests, clients, projects, portfolio, tasks, files, websites, content, telegram, youtube, dev, deploy, activity, search, integrations.check | admin |
| `POST /api/bot` | @uzleeder_services_bot webhook (Telegram imzosi bilan) | Telegram |

Brief javobi: `{ ok, stored, code, notified }` — muvaffaqiyat faqat lead saqlangandan keyin
(yoki xotira yo'q bo'lsa, Telegram qabul qilgandan keyin) ko'rsatiladi. `code` — mijozga ko'rsatiladigan so'rov raqami (`UL-2026-XXXX`).
Admin'dagi lead statuslari: `new → contacted → qualified → proposal → won / lost`.

### Workspace V5 (AI'siz, kod asosida)

- **So'rov statusi:** `NEW → REVIEWING → QUALIFIED → WAITING_FOR_CLIENT → CONVERTED · DECLINED · ARCHIVED`. CONVERTED faqat "Create project" orqali qo'yiladi; eski yozuvlar avtomatik moslanadi.
- **Loyiha:** status (`PLANNING … COMPLETED · ARCHIVED`) + tur (client / product / demo / internal) + `UL-XXXX` ID. Imzo: `PROJECT COMPLETED` faqat COMPLETED bo'lsa; demo → `DEMONSTRATION`; product + READY_FOR_DELIVERY → `READY FOR DEPLOYMENT`. Bu sertifikat emas.
- **Portfolio:** COMPLETED loyiha → qoralama (bo'sh boshlanadi, brief matni ko'chirilmaydi) → Approve → Control Center **qoralamasiga** qo'shiladi. Jonli saytni faqat Admin'dagi Publish o'zgartiradi.
- **Vazifa:** `TODO → IN PROGRESS → REVIEW → DONE`, board va ro'yxat ko'rinishi.
- **Fayllar:** papkalar (Projects, Brand, Media, Documents, Development, Deliverables), status, versiyalar (kim/qachon/izoh), restore, duplicate, compare (matn), o'chirish faqat nom yozib tasdiqlanganda. Media library — rasm/video/brend fayllarini Content Studio'da qayta ishlatish.
- **Kontent:** `DRAFT → READY → PUBLISHING → PUBLISHED / PARTIAL / FAILED`, `ARCHIVED`. Nashr tarixi bor kontent o'chirilmaydi — faqat arxivlanadi. Send faqat Telegram tasdiqlagandan keyin `sent`; qayta urinish faqat muvaffaqiyatsiz manzillarga.
- **Integratsiyalar:** Command Center'da "Check connections" — Connected / Not configured / Expired / Error (har biri haqiqiy so'rov bilan tekshiriladi).
- Testlar: `npm test` (API + Workspace + bot oqimi + startaplar).

### Startaplar — bitta yozuv, uch xil ko'rinish

- **Yagona yozuv:** `ws/startups/<id>.json` (`api/_lib/startups.js`). Ichida: ochiq `draft`, e'lon qilingan `published` (versiyalar bilan),
  workflow holati, ichki ma'lumot (`internal`, `milestones`). Vazifa va fayllar Workspace kolleksiyalarida `startupId` bilan bog'lanadi.
- **Control Center → Startups:** ochiq kontent va e'lon: `Draft → Review → Approved → Published`, Reject (sabab bilan), Unpublish, Archive,
  versiyani qoralamaga tiklash. Qoralamani saqlash hech qachon e'lon qilmaydi; e'lon faqat Approved'dan (serverda tekshiriladi).
  Bir vaqtda tahrir: eski versiyadan saqlash 409 bilan rad etiladi.
- **Workspace → Startups:** kundalik ish — maqsadlar, ichki eslatmalar, milestone'lar, vazifalar, fayllar, development, faoliyat.
- **Ochiq sahifa:** `GET /api/startups` faqat e'lon qilingan, ko'rinadigan, arxivlanmagan yozuvlarning ochiq maydonlarini beradi.
  Import qilinmaguncha — `api/_lib/startups-seed.json` (build yaratadi). `/startups/uzport` → `/startups/t-port`.
- Rollar: hozircha bitta egasi (Max) — barcha amallar serverda token bilan tekshiriladi; ko'p foydalanuvchili rollar keyinroq.

### Startap sertifikatlari — UzLeeder Venture Record Certificates

**Ichki hujjat:** UzLeeder o'z ekotizimidagi loyihani qayd etadi. Bu davlat ro'yxatidan o'tkazish, litsenziya, IT Park rezidentligi,
akkreditatsiya, mulk/investitsiya isboti EMAS — har bir PDF va /verify sahifasi buni aytadi. Muhr, emblema, imzo rasmi yo'q.

- **Kod:** `api/_lib/certs.js` (yozuvlar, workflow, ruxsatlar, raqamlash, berish, bekor qilish, tekshiruv) · `api/_lib/certpdf.js` (PDF, A4 landscape,
  shriftlar ichida — PT Serif/PT Sans, OFL, `api/_lib/fonts/`) · Control Center → **Startup certificates** · Workspace → Startups → loyiha → **Certificates** · `verify.html`.
- **Turlar:** Venture Record (`UZL-VRC-…`), Development Stage Record (`UZL-DSR-…`), Founder / Team Association Record (`UZL-FTA-…`), Project Completion Record (`UZL-PCR-…`).
- **Workflow:** `Draft → Under review → Approved → Issued` · `Rejected` (sabab bilan) · Issued → `Suspended ⇄ Issued` · `Revoked` (sabab + raqamni yozib tasdiqlash, qaytarilmaydi) ·
  `Superseded` (tuzatilgan nusxa berilganda, yangisiga havola bilan). Berilgan sertifikat tahrirlanmaydi va o'chirilmaydi — tuzatish = Reissue.
- **Dalillar:** har bir da'vo (nom, asoschi/vakil, bosqich, …) `Submitted / Under review / Verified / Rejected / Not applicable`. Avtomatik "Verified" yo'q;
  qiymat o'zgarsa — yana Submitted. Majburiy da'volar Verified bo'lmaguncha Approve yo'q. Ixtiyoriy (bozor, tashqi ro'yxat) faqat Verified bo'lsa chop etiladi.
- **Raqam:** serverda, `ws/certno/<RAQAM>.json` faqat-yaratish (create-only) yozuvi bilan — bir vaqtdagi berishlarda ham takrorlanmaydi; raqamlar hech qachon qayta ishlatilmaydi.
  Bitta tasdiqni ikki marta berishdan `ws/certissue/<id>-<rev>` himoya qiladi.
- **Berish:** tasdiqlangan ma'lumotdan snapshot → PDF → SHA-256 → `wsc/<RAQAM>-….pdf` (maxfiy). Shablon versiyasi, beruvchi, vaqt yoziladi. Keyingi venture
  tahriri berilgan PDF'ni o'zgartirmaydi. SHA-256 — butunlik tekshiruvi, raqamli imzo emas.
- **Tekshiruv:** `/verify/<RAQAM>?c=<KOD>` (QR shu yerga olib boradi). Ma'lumot: `GET /api/startups?verify=…&c=…` — faqat tasdiqlangan ochiq maydonlar va jonli holat
  (Valid / Suspended / Revoked / Superseded / Not found). Noto'g'ri kod va noma'lum raqamga bir xil javob; IP bo'yicha 30/daqiqa cheklov; faqat sanoq (tashrifchi ma'lumoti yo'q).
- **Ruxsatlar (serverda):** `view, prepare, edit, request, evidence, approve, issue, reissue, revoke, templates, audit`. Rollar: `admin` (egasi — hammasi),
  `editor` (view, prepare, edit, request), `reviewer` (view, evidence, approve, audit), `auditor` (view, audit). Bugun faqat `admin` tizimga kira oladi.
- **Shablonlar:** har tur uchun bitta, versiyali (tarix bilan). Sarlavha, subtitr, matn (EN/UZ/RU), imzolovchi (ixtiyoriy, faqat ism/lavozim) o'zgartiriladi;
  yuridik eslatma, beruvchi, raqam, QR va kod olib tashlanmaydi; "government approved / accredited / licensed" kabi so'zlar rad etiladi.
- **Workspace API:** `certs.list/get/create/save/evidence/submit/requestInfo/respond/approve/reject/issue/suspend/reinstate/revoke/reissue/delete/preview/pdf/
  templates/templateSave/templatePreview/prepareAll/stats/perms`.
- Testlar: `node server/test-certs.cjs` (68 ta, `npm test` ichida).

### Hamkorlik dasturi (Partner Program)

Ariza — so'rov, sinov — dalil, tasdiq — qaror, hamkorlik — aniq belgilangan munosabat. Sertifikat bermaydi.

- **Sahifalar:** `/partners` (dastur, shartlar, maxfiylik) · `/partners/apply` (5 qadamli ariza sahifasi, `partner-apply.html/js`; ariza yopiq bo'lsa — ko'rib chiqish rejimi, yuborish o'chiq) · `/workspace/partners` (arizachining o'z arizasi — havola + shaxsiy kalit bilan) ·
  Control Center → **Partners** (ko'rib chiqish va qarorlar) · Workspace → **Partners** (sinov topshiriqlari, onboarding, loyihaga kirish).
- **Kod:** `api/_lib/partners.js` (`POST /api/contact?partner=1` orqali — Vercel funksiya limiti), `api/_lib/partner-notices.json` (shartlar va maxfiylik matni, versiyali),
  `partners.html/js`, `partner-ui.js` (Admin · Workspace · arizachi rejimlari), `partner.css`.
- **Holatlar:** Submitted → Under Review → (More Information Required) → Qualification → Trial Collaboration → Approved · Declined · Withdrawn · Closed. Vaqt o'tishi bilan avtomatik o'tmaydi.
- **Rollar (serverda):** admin (hammasi) · manager (qaror, onboarding, kirish, holat; sozlama/o'chirish yo'q) · reviewer (baholash, tavsiya, bosqich, topshiriq; qaror yo'q).
- **Qoidalar:** ochishdan oldin mas'ul tashkilot, maxfiylik email'i va huquqiy ko'rib chiqish tasdig'i shart; tasdiq uchun to'liq baholash, rol va hal qilingan topshiriqlar kerak;
  tasdiq hamkor profilini yaratadi, lekin **hech qanday** loyiha kirishini bermaydi; to'lanmagan topshiriq "Unpaid" deb ko'rsatilishi shart; to'xtatish kirishni darhol yopadi;
  har bir yozuv o'zgarmas reviziya (bir vaqtdagi tahrir 409), tarix himoyalangan; yopilgan arizalar saqlash muddatidan keyin o'chiriladi (qonuniy "hold" bo'lmasa).
- Testlar: `node server/test-partners.cjs` (58 ta, `npm test` ichida).

## Environment variables

| O'zgaruvchi | Izoh |
|---|---|
| `ADMIN_PASSWORD` | boshlang'ich parol (admin ichida almashtirilsa, hash Blob'da saqlanadi) |
| `ADMIN_SECRET` | ≥16 belgi, sessiyalarni imzolaydi (majburiy) |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | brief xabarnomalari (ixtiyoriy) |
| `BLOB_READ_WRITE_TOKEN` | Blob store ulanganda Vercel o'zi qo'shadi |
| `SITE_URL` | ixtiyoriy — sertifikat QR/tekshiruv havolalari uchun domen (standart: https://uzleeder.vercel.app) |

Hammasi bitta `.env` faylda (git/deploy'ga kirmaydi). Vercel'ga yuklash: `npm run setup`.

## Xavfsizlik

- Barcha admin amallari serverda token bilan tekshiriladi (`requireAuth`); parol o'zgarsa, eski sessiyalar bekor bo'ladi.
- Brief: server validatsiyasi, tozalash, honeypot, IP bo'yicha cheklov, takrorlanishdan himoya; lead ma'lumotlari hech qachon ochiq API orqali chiqmaydi.
- Analytics'ga faqat hodisa nomi, xizmat, til va manba yuboriladi — ism, kontakt va xabar yuborilmaydi.
- `admin.html` — `noindex`, keshlanmaydi; `robots.txt` `/admin` va `/api/` ni yopadi.

## Egasi tasdiqlashi kerak (owner action)

- Custom domen (hozir canonical: uzleeder.vercel.app).
- Narxlar (Services & pricing → Approved prices) va "30 kunlik xato tuzatish" taklifi.
- `contract-shokirov.html` ochiq havolasi — mijoz roziligi / maxfiylik tekshiruvi.
- UZ / RU / FA / AR tarjimalari — ona tilida so'zlashuvchi tekshiruvi.
- Telegram yetkazilishi — admin → Settings → System health "Delivered" ko'rsatguncha tasdiqlanmagan.
