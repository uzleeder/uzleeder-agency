# UzLeeder Brand Kit

All brand artwork in every colour template of the Control Center → Design page.
Open `brand/index.html` (or https://uzleeder.vercel.app/brand/) to browse and download.

| Folder | Template |
|---|---|
| `bold-red/` | Bold Red — UzLeeder original (brand #f0384e) |
| `navy-gold/` | Navy + Gold — premium, classic (brand #c9a227) |
| `emerald/` | Emerald — calm, growth (brand #10b981) |
| `royal/` | Royal Purple — creative, AI (brand #8b5cf6) |
| `ocean/` | Ocean Blue — trust, tech (brand #3b82f6) |
| `sunset/` | Sunset Orange — energy, bold (brand #f97316) |
| `mono/` | Monochrome — minimal (brand #f2f4f8) |

Files in each folder:

- `logo-mark.svg` — Λ mark for light backgrounds
- `logo-mark-white.svg` — white Λ for dark backgrounds
- `logo-mark-mono.svg` — one-colour Λ (ink)
- `logo-lockup.svg` / `logo-lockup-dark.svg` — Λ + "UzLeeder" + "FOR LEADERS"
- `icon.svg` — app / favicon tile
- `emblem.svg` — official round emblem
- `emblem-stamp.svg` — document stamp (transparent)
- `*.png` — bitmap exports (logo 512, icon 512, emblem & stamp 1024, lockups 1320×384)
- `bold-red/og-image.png`, `bold-red/apple-touch-icon.png` — the images the live site uses

Regenerate after changing templates: `node server/build-brand.cjs --png`
