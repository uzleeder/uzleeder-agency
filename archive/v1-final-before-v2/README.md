# UzLeeder — Portfolio sayti

Mekhriddin Abdualim portfolio sayti. Endi kod toza fayllarga ajratilgan va kontakt
formasi backend (Telegram) bilan ulanadi.

## Fayllar tuzilishi

```
uzleeder/
├── index.html              ← sayt (HTML)
├── style.css               ← barcha CSS (mobil + Android/iOS moslamalari)
├── script.js               ← barcha JavaScript (til/mavzu xotirasi, forma)
├── manifest.webmanifest    ← PWA manifest (Android "Add to Home Screen")
├── icon.svg                ← ilova ikonkasi (home-screen va address-bar)
├── README.md               ← shu fayl
└── server/                 ← backend (kontakt formasi uchun)
    ├── server.js
    ├── package.json
    └── .env.example
```

> **Eslatma:** `manifest.webmanifest` va relativ yo'llar to'g'ri ishlashi uchun
> saytni HTTP-server orqali oching (faylni to'g'ridan `file://` bilan emas).
> Lokalda sinash: `cd uzleeder && python -m http.server 8080` → `http://localhost:8080`.

## 1-qism: Frontend (bajarildi ✅)

- ✅ Kod 3 faylga ajratildi: `index.html`, `style.css`, `script.js`
- ✅ **Mavzu** (qora/yorug') `localStorage`ga saqlanadi — sahifa yangilanganda o'chmaydi
- ✅ **Til** ham `localStorage`ga saqlanadi; birinchi kelganda brauzer tili aniqlanadi
- ✅ Til o'zgarganda `<html lang>` atributi ham yangilanadi (`uz`, `ru`, `tg`, `en`)
- ✅ SEO: `meta description`, `keywords`, Open Graph va Twitter teglari qo'shildi
- ✅ Rasmlarga `loading="lazy"` va `width/height` berildi
- ✅ Accessibility: tugmalarga `aria-label`, `aria-expanded`, `role` qo'shildi

Saytni shunchaki ko'rish uchun `index.html` ni brauzerda ochsangiz kifoya.
Forma ishlashi uchun esa quyidagi backendni ishga tushiring.

## 2-qism: Backend (kontakt formasi → Telegram)

Forma yuborilganda xabar to'g'ridan-to'g'ri Telegramingizga keladi.

### Sozlash

1. **Telegram bot yarating**
   - Telegramda **@BotFather** ga `/newbot` yozing va ko'rsatmalarga amal qiling.
   - U bergan **tokenni** nusxalang.

2. **Chat ID ni oling**
   - **@userinfobot** ga yozing — u sizning `id` raqamingizni qaytaradi.
   - Avval o'z botingizga bir marta `/start` bosing (aks holda bot sizga yoza olmaydi).

3. **.env faylini to'ldiring**
   ```bash
   cd server
   cp .env.example .env       # Windows: copy .env.example .env
   ```
   `.env` ichida `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` va `ALLOWED_ORIGINS` ni yozing.

4. **O'rnatish va ishga tushirish** (Node.js 18+ kerak)
   ```bash
   cd server
   npm install
   npm start
   ```
   `http://localhost:3000` da server ishlaydi va shu manzilda saytni ham ochadi.

### script.js dagi API manzili

`script.js` boshidagi `API_BASE` ni sozlang:

- **Bir xil domen** (server saytni ham tarqatsa): `API_BASE = ""` — o'zgartirmang.
- **Alohida backend** (masalan Render/Railway): `API_BASE = "https://sizning-api.onrender.com"`.

### Xavfsizlik (bajarildi ✅)

- ✅ **Validatsiya** — server emailni va bo'sh maydonlarni tekshiradi
- ✅ **CORS** — faqat `ALLOWED_ORIGINS` dagi saytlar so'rov yubora oladi
- ✅ **Rate limiting** — bir IP daqiqasiga 5 ta xabar (spamga qarshi)
- ✅ **Honeypot** — botlarni tutadigan yashirin maydon

### UI/UX (bajarildi ✅)

- ✅ Yuborilayotganda tugmada **loader** aylanadi ("Yuborilmoqda...")
- ✅ Muvaffaqiyat/xatolikda chiroyli **toast** bildirishnoma chiqadi

## Deploy qilish

- **Frontend** (statik): GitHub Pages, Netlify yoki Vercel.
- **Backend**: Render, Railway yoki VPS. `.env` o'zgaruvchilarini o'sha platformaning
  sozlamalariga qo'ying. So'ng frontend `API_BASE` ni backend manziliga moslang va
  backend `.env` dagi `ALLOWED_ORIGINS` ga frontend domeningizni qo'shing.
