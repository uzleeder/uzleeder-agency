# UzLeeder Admin — sozlash qo'llanmasi

Admin panel: **`https://uzleeder.netlify.app/admin`** — parol bilan kirib, loyihalar qo'shasiz, matn/narxlarni o'zgartirasiz, rasm yuklaysiz. Kod tegmaysiz.

Kontent va rasmlar **Netlify Blobs**'da saqlanadi, sayt ularni `/api/content` orqali o'qiydi.

---

## 1. Deploydan OLDIN — kutubxonani o'rnatish (bir marta)

Funksiyalar `@netlify/blobs` kutubxonasidan foydalanadi. Uni deploydan oldin o'rnating:

```bash
cd "C:\Users\Mekhr\OneDrive\Desktop\my sites\uzleeder"
npm install
```

Bu `node_modules` papkasini yaratadi. **Netlify'ga yuklaganda `node_modules` ham papka ichida bo'lsin.**

## 2. Netlify'ga yuklash

`uzleeder` papkasini (ichida `netlify/`, `package.json`, `node_modules`, `admin.html` bilan) Netlify'ga tortib tashlang.

## 3. Environment variables (parol) — MUHIM

Netlify'da: **Site configuration → Environment variables → Add a variable**. Ikkitasini qo'shing:

| Key | Value |
|---|---|
| `ADMIN_PASSWORD` | o'zingiz tanlagan **maxfiy admin parol** |
| `ADMIN_SECRET` | uzun tasodifiy matn (masalan 30+ belgi, token imzosi uchun) |

> `TELEGRAM_BOT_TOKEN` va `TELEGRAM_CHAT_ID` (kontakt formasi uchun) avvalgidek qoladi.

Qo'shgach — **Deploys → Trigger deploy** (yoki papkani qayta tortib tashlang), toki funksiyalar yangi sozlamani olsin.

## 4. Ishlatish

1. **`https://uzleeder.netlify.app/admin`** ga kiring → parolni yozing → **Kirish**.
2. Uch bo'lim bor:
   - **Loyihalar** — portfolio kartalarini qo'shish/o'chirish: nom, tavsif (4 tilda), rasm (yuklash yoki URL), havola, texnologiyalar, Live/For Sale/Coming Soon belgisi. *Loyiha qo'shsangiz — saytdagi standart 3 karta o'rniga shular chiqadi.*
   - **Matnlar** — hero, about, bo'lim subtitrlari, xizmat nomlari/tavsiflari (bo'sh = asl matn, yozsangiz — ustidan yoziladi).
   - **Narxlar** — paket va xizmat narxlari.
3. Oxirida **💾 Saqlash** tugmasini bosing.
4. Saytni oching (`Ctrl+F5`) — o'zgarishlar ko'rinadi.

## Xavfsizlik
- `/admin` sahifasi qidiruv tizimlaridan yashirin (`noindex`).
- Kirish faqat parol bilan; funksiyalar har bir saqlashda tokenni tekshiradi.
- Rasm faqat 4MB gacha, faqat rasm formatlari qabul qilinadi.

## Muammo bo'lsa
- **"ADMIN_PASSWORD is not configured"** → 3-qadamdagi environment variable qo'shilmagan yoki qayta deploy qilinmagan.
- **Rasm yuklanmadi / saqlanmadi** → `npm install` qilib, `node_modules` bilan qayta yuklang (Blobs kutubxonasi kerak).
- Lokal (`python -m http.server`) da admin **ishlamaydi** — funksiyalar faqat Netlify'da ishlaydi. Sinash uchun Netlify'ga yuklang.
