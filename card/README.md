# Max — UzLeeder digital business card

A single, standalone `index.html`. No framework, no build step, no backend, no
external JavaScript. HTML5 + CSS3 + vanilla JS with inline SVG icons.

Visual identity follows **UzLeeder Official Design v2026.09** (Bold Red): the Λ
mark drawn to the official 48×44 geometry, Brand Red `#E5243B` / accent
`#F0384E`, Ink Navy `#1C2233`, Deep Black `#07090D`, Outfit for display and
Manrope for body text.

---

## 0. It is live

Published at **https://uzleeder.vercel.app/card** — that is what the QR code
encodes, what the canonical and `og:` tags point at, and what Copy link and
Share hand out. `/card` is wired in `vercel.json` (and `netlify.toml` for the
other host) and listed in `sitemap.xml`.

### It follows the site's design template

Pick a different template on Admin → **Design** (Ocean Blue, Navy + Gold,
Emerald, Royal Purple, Sunset, Monochrome, or a custom colour) and the card
repaints with it: the lockup, the mark, the wordmark, buttons, icons, the
portrait ring, the background and the QR code. The artwork keeps its brand-kit
colours as attributes and takes the live palette from CSS, so with no palette
saved it stays Bold Red.

**The QR code has a guard.** It sits on a white tile, so a brand colour that is
too light would make it unscannable — the Monochrome template's `#F2F4F8` is
exactly that case. Any colour below a 3.5:1 contrast against white is rejected
and the dark ink is used instead. Verified: under Monochrome the finder squares
render `#10141F`, not near-white, and the code still decodes.

### Editing it from the Control Center

Admin → **Contact** now has a *Digital business card* section: replace the
photo, and change the display name, full name, job title, disciplines,
description, city, country, website, LinkedIn, availability line and the
published address. Email, phone, Telegram, GitHub, YouTube and WhatsApp come
from the Contact fields directly above it, so they stay in step with the rest
of the site.

How it fits together: the card ships complete and renders entirely from its own
file. After it is on screen it asks `/api/content` once; if that returns a
`card` block, the values are laid on top. No network, no storage connected, bad
JSON, or opened straight from disk — the built-in card stands and nothing
breaks. Edits are saved as a draft and only reach the card when you **Publish**,
like the rest of the site.

**Extra cards.** The same section has an *Extra cards* list: add a row, pick an
icon, give it a label, the text shown underneath and a link. Each one appears in
the grid after the four built-in rows, and is added to the downloadable contact
as a `URL` entry. A row with no label or no link is skipped rather than rendered
empty. Icons available: link, mail, phone, globe, location, calendar, file,
telegram, whatsapp, github, youtube, linkedin, instagram, facebook, x — the
admin list matches `TILE_ICONS` in the card, so keep them in step if you add to
either.

Two details worth knowing:

- A replaced photo is re-fetched and re-inlined as a data URI, so it also
  becomes the picture inside the downloadable contact file. Without that step
  the vCard would quietly lose its photo.
- Only `http(s):`, `mailto:`, `tel:` and same-origin paths are accepted from the
  API into any link, so a bad value cannot put a `javascript:` URL on the card.

## 1. The one setting you must change

Open `index.html`, find this line near the top of the `<script>` block
(around line 821):

```js
const CARD_URL = "https://YOUR-PUBLISHED-CARD-URL";
```

Replace it with the real public address of this page, e.g.
`https://uzleeder.vercel.app/card/`.

That single value drives the QR code, the **Copy link** button and the
**Share card** button. Keep the `canonical` and `og:` tags in `<head>` in step
with it. The Control Center's *Published address* field overrides it at runtime
and re-draws the QR code, which is the quicker way to move the card.

### Optional settings (same `PROFILE` object)

| Key | Default | Effect |
|---|---|---|
| `availability` | `null` | Set to a short truthful sentence (e.g. `"Open to new projects"`) to show the pill under the location. Left `null`, nothing is displayed — the card never shows an invented status. |
| `videoUrl` | `null` | Set to a real video URL to add a **Watch Founder Introduction** link inside the founder section. |

Name, role, company, email, website, LinkedIn, Telegram and location all live in
the same `PROFILE` object, and the visible card text sits in plain HTML above it.

### Identity shown on the card

- **Max** as the display name, with **Mehriddin Abdualim** beneath it.
- **Founder & AI Engineer** as the title, with the disciplines it covers on the
  line under it: Prompt engineering · Full-stack development · AI-assisted
  delivery.

That line is set in body type, sentence case — not uppercase monospace. The
brand guide reserves monospace caps for short labels and says never to set
phrases that way, and three long phrases in caps wrapped into a ragged block.
Each separator is attached to the phrase that follows it with a non-breaking
space, so a line never ends on a dangling dot; it wraps down with its phrase
instead.

In the vCard these map onto the right fields rather than being crammed into one:
`N:Abdualim;Mehriddin`, `FN:Max (Mehriddin Abdualim)`, `NICKNAME:Max`,
`TITLE:Founder & AI Engineer`, `ROLE:Prompt Engineer, Full-Stack Developer,
AI-Assisted Developer`.

### Logos

Every mark on the page is the official artwork from `/brand`, inlined, not
redrawn — the brand guide is explicit about that:

| Where | Source |
|---|---|
| Lockup at the top of the card | `brand/bold-red/logo-lockup-dark.svg`, verbatim, minus its backing rectangle so it sits on the card surface |
| Mark in the UzLeeder chip | `brand/bold-red/logo-mark-white.svg` (the one-colour version for dark backgrounds), drawn at 16 px — the minimum size the guide allows |
| Watermark in the card corner | the Λ mark at the official 48×44 geometry |
| Λ field in the page background | the same official two-stroke path, tiled at 2.2% opacity |

Stroke weights, colours and proportions are the brand-kit values. If the kit is
ever regenerated (`node server/build-brand.cjs --png`), re-copy the lockup path
data rather than adjusting it by eye.

### Channel buttons

The button row is **Website · GitHub · YouTube**, and the contact grid below it
is **Email · LinkedIn · WhatsApp · Telegram** — WhatsApp sits in the grid with
the number spelled out, where Website used to be. The GitHub, YouTube and
WhatsApp links come from the ones published on uzleeder.vercel.app:

```js
channels: {
  whatsapp: "https://wa.me/998916395110",
  github:   "https://github.com/uzleeder",
  youtube:  "https://www.youtube.com/@uzleeder"
}
```

Each link appears only once its URL is set, so blanking one hides it rather than
leaving a dead link, and a notice names any that are still empty. GitHub, YouTube
and WhatsApp are also written into the vCard as `X-SOCIALPROFILE` / `URL`
entries; the Website button is skipped there, because the vCard already carries
it as plain `URL:` and listing it twice would duplicate it in the contacts app.

### Phone number

`PROFILE.phone` is `+998916395110` — the business number already published on
the site. It goes into the saved contact as `TEL;TYPE=CELL,WORK,VOICE` so the
card dials. It is now also visible on the card face, as the value under the
WhatsApp tile. Set `PROFILE.phone` to `""` to drop it from the vCard; the tile's
printed number is plain text in the markup.

The row sits three-across from 420 px up and stacks on narrower phones.

### The founder portrait

The circular portrait above the name is cropped from the Bold Red studio shot
(dark suit, red Λ wall) — the edition that matches the current identity, rather
than the navy/gold headshot at `projects/max-founder.jpg` used elsewhere on the
site.

The framing is the one Max picked: the full width of the source photo — a
**974 px circle at (1, 154)** — so the whole **UzLeeder / FOR LEADERS** lockup,
the Λ wall and the crossed-arms pose all stay in shot. Exported at 560×560 (not
480) because that composition carries fine detail, and the circle on the card was
enlarged to match: 142 px on a 320 px screen, 176 px on desktop.

One thing worth knowing: the card's own lockup now sits directly above a portrait
that contains the same lockup. It still reads fine, but if you want it tighter,
dropping the lockup at the top of the card is a two-line change — say the word.

It is **inlined as a data URI**, so `index.html` is still one self-contained file
you can email or open from a USB stick. The same JPEG also sits beside it as
`max-founder.jpg`; to let the browser cache it instead, change the `<img>` to:

```html
<img id="portraitImg" width="560" height="560" decoding="async"
     alt="Max, founder of UzLeeder" src="max-founder.jpg"/>
```

One caveat if you do: the vCard photo is read out of that `<img>` as base64, so
with an external `src` the **PHOTO** line is dropped from the `.vcf` (everything
else is unaffected). Keep the data URI if you want the picture to travel with
the contact.

A black-and-white edition of the same shot exists if you ever want a more
restrained look — say the word and I will swap it in.

---

## 2. Running it locally

Just double-click `index.html` — it works straight from the file system, QR code
included.

To serve it over HTTP instead (recommended, because the clipboard API needs a
secure context):

```bash
npx serve card
```

Or, since this folder sits inside the UzLeeder site, use the project's own dev
server from the repository root:

```bash
npm run dev
```

Then open <http://localhost:8080/card/>.

---

## 3. Publishing

The card deploys as part of the existing UzLeeder site with no config changes —
`card/index.html` is served at `/card/` on both Netlify and Vercel.

**As part of this site:** commit and push; the normal deploy publishes
`/card/`. Set `CARD_URL` to `https://<your-domain>/card/`.

**As its own site on Netlify:** drag this `card/` folder onto
<https://app.netlify.com/drop>, or `netlify deploy --dir=card --prod`. Netlify
serves `index.html` at the root of the new site.

**As its own site on Vercel:** run `vercel --prod` from inside `card/`, or
import the repo and set the project root to `card/`. No build command, no
output directory — it is a static file.

Afterwards, set `CARD_URL` to whatever URL you were given and redeploy, so the
QR code encodes the live address.

---

## 4. About the QR code

The QR code is generated by a small encoder written directly into the page —
byte mode, error-correction levels M and H, versions 1–12. There is **no CDN and
no library**, so the code still generates with no network at all, including from
`file://`.

### The branded look

It is drawn in the identity rather than plain black on white:

- **Ink Navy** `#1C2233` data modules, with a slight corner radius.
- **Brand Red** `#E5243B` finder patterns — the three corner eyes — with rounded
  corners, matching the card's radius system.
- The **official Λ mark** knocked out of the centre, in the light-background
  colourway the guide specifies: red outer stroke, Ink Navy inner chevron.

Only the colour and the radii are brand-led. Module positions are untouched.

This is where the error-correction level matters: the card encodes at **level H**
(30% recovery) so the centre knock-out is rebuildable. If a URL is ever too long
for level H at version 12, the code falls back to level M automatically and drops
the centre mark rather than producing something that will not scan.

**The knock-out is deliberately small.** At the first size I tried it looked
better but ate 75% of the correction budget, leaving almost nothing for glare or
a print smudge. It is now 5 modules square, measured at **38%** — so roughly
three fifths of the recovery capacity is still spare for real-world damage.

It was verified three ways before shipping:

- Its output is **bit-for-bit identical** to the reference encoder
  (`qrcode-generator`, already used by this project for certificates) when both
  apply the same mask.
- **532 strings** across both levels M and H — the real card URLs, every capacity
  boundary from version 1 to 12, Unicode, and 500 random strings — were encoded
  and then **decoded back** by an independent decoder. All 532 returned their
  exact input.
- The branded code was then read back **from the pixels the browser actually
  painted**, binarised by luminance the way a camera does, and run through a
  decoder with full Reed-Solomon error correction. It returns the right URL, and
  reports exactly how much of the correction budget the centre mark costs.

The exported PNG was put through the same pixel-level decode, with the same
result.

The code sits on a white tile with the full four-module quiet zone, so it scans
on a dark screen and on light paper alike. **Download PNG** exports at 16 px per
module (656×656 for a version-4 code), which is comfortable for print.

If the encoder ever fails, the QR tile is replaced by a short message and the
download button is disabled — the rest of the card keeps working.

---

## 5. What was tested

Verified in the browser against the running page, not by inspection:

| Check | Result |
|---|---|
| **Save Contact** downloads a valid vCard | `Max-UzLeeder.vcf`, `text/vcard;charset=utf-8`, vCard 3.0, CRLF line endings, `N`/`FN`/`ORG`/`TITLE`/`EMAIL`/`URL`/`ADR`/`NOTE`/`REV`/`PHOTO` — no invented phone number |
| vCard photo | 62 KB `.vcf`; the embedded `PHOTO` unfolds and decodes to a valid 560×560 JPEG (correct SOI/EOI markers) |
| vCard line folding | none over 75 octets, every continuation prefixed with a space, unfolds back to a well-formed card |
| Portrait renders | 560×560 natural, drawn at 142 px (320 px screen) to 176 px (desktop), alt text present, shape held by a fallback colour if the image ever fails |
| vCard special characters escaped | backslash, comma, semicolon and newline escaped; structured `N` and `ADR` fields keep their real separators |
| QR encodes the configured URL | decoded from the pixels the browser actually painted → exact match, with the placeholder and with `https://uzleeder.vercel.app/card/` |
| Theme follows the site | Ocean Blue applied from a real palette repaints the lockup, buttons, icons, ring, background and QR; tokens verified against the computed styles |
| QR contrast guard | under Monochrome (brand `#F2F4F8`) the finders fall back to `#10141F`; both Ocean and Monochrome codes decode to the right URL with the same 38% headroom |
| Extra cards | two added rows render in order with their icons; one with no URL is skipped |
| Branded QR still scans (verified again against the live page) | pixel-level decode with Reed-Solomon correction returns the right URL; worst block uses 38% of its capacity, so 62% is spare |
| QR falls back safely | a URL too long for level H drops to level M and omits the centre mark rather than failing |
| QR download works | valid PNG signature, 656×656, white quiet zone, decodes to the same URL with identical correction headroom |
| Setup notice | shown while `CARD_URL` is the placeholder, gone once a real URL is set |
| Copy email | real click → clipboard written, "Email copied" |
| Copy link | real click → "Card link copied" |
| Share fallback | no `navigator.share` in the test browser → copied the link and said so; a cancelled native share returns silently and never claims success |
| Clipboard failure path | reports "Could not copy" rather than a false success |
| All link destinations | website, LinkedIn, Telegram, `mailto:` — all correct, all external links `target="_blank" rel="noopener noreferrer"` |
| Channel buttons | Website / GitHub / YouTube live and linked, `target="_blank" rel="noopener noreferrer"`; three-across at 768 px (123 px each, no clipping), stacked at 320 and 375 px |
| Contact grid | Email / LinkedIn / WhatsApp / Telegram; no value string clipped at 320 or 375 px |
| No duplicated vCard URL | the website appears once as `URL:`, not again as a social profile |
| Channel URLs match the site | cross-checked against both the local source and the live page at uzleeder.vercel.app |
| Mobile layout | at 320 / 360 / 375 / 430 px: nothing escapes its panel, no clipped label, no touch target under 44 px, no horizontal scroll |
| Horizontal overflow | 0 px at 320, 375, 768, 1024 and 1440 px, re-checked after the portrait was added |
| Touch targets | primary/secondary buttons 48 px tall, quiet buttons 44 px, contact rows 52 px |
| Narrow phones | paired buttons and contact grid collapse to one column below 360 px |
| Card centring | exactly centred in the content area at 1440 px |
| Keyboard navigation | 12 focusable controls in reading order, visible `:focus-visible` ring on every one |
| Identity fields | vCard carries `N`/`FN`/`NICKNAME`/`TITLE`/`ROLE`/`TEL` separately; commas inside `ROLE` escaped per spec |
| Disciplines line | each phrase stays whole at every width (no mid-word break at "Full-stack" or "AI-assisted"), nothing clipped by the card, and no line ends on a separator: 2 lines at 375 px and above, 3 at 320 px |
| Official logos | lockup renders at 188 px (320 px screen) to 228 px (desktop), above the 120 px minimum; chip mark at 16 px |
| Founder disclosure | `aria-expanded` toggles, panel animates 0 → 130 px, collapsed content is `inert` so it leaves the tab order and the accessibility tree |
| Console | no errors on load or during any interaction |
| No backend | every feature runs client-side; no network request leaves the page |

Still worth doing on real hardware: scan the printed QR with a phone, and open
the downloaded `.vcf` on iOS and Android to confirm it lands in Contacts the way
you want.

---

## 6. On phones

Checked on an emulated touch device (mobile user agent, 5 touch points), not
just a narrow window:

- Contact rows go **full width below 430px**. Two columns leave about 70px for
  the value, which is not enough for `uzleeder@gmail.com` or the phone number —
  they came out as "uzleeder@g…". Height is the cheaper thing to spend.
- The three channel buttons stay **on one row** down to 340px, which saves a
  screenful over stacking them. Below that they stack.
- `100dvh` as well as `100vh`, so a phone's collapsing toolbar does not leave a
  gap or an extra scroll.
- `env(safe-area-inset-*)` on the page padding and on the toast, so nothing
  hides under a notch or the home indicator.
- The blue tap flash is off; buttons and contact rows have their own pressed
  state instead, since touch has no hover to answer with.
- Labels never wrap inside a button.

Three bugs this caught, all of which looked fine on desktop:

1. **The contact grid overflowed the card by 47px** and got clipped. `1fr`
   columns cannot shrink below their content, and the nowrap values forced them
   wide. Fixed with `minmax(0, 1fr)`.
2. **The values never truncated.** `.contact__value` is a `<span>`, and
   `overflow` / `text-overflow` do not apply to inline boxes — so instead of an
   ellipsis the text simply spilled out. Fixed by blockifying it.
3. **"Download PNG" wrapped onto two lines** inside its own button, leaving the
   pair uneven.

A note on how the earlier checks missed the first two: they measured
`scrollWidth > clientWidth` on the value, which was false precisely *because*
the column grew instead of truncating, and they measured document overflow,
which stayed zero because the card clips with `overflow: hidden`. The probe now
measures every element against its panel's padding box.

## 7. Privacy and security

- No analytics, no tracking, no third-party scripts.
- Nothing is collected from visitors; there is no form.
- The vCard and the QR code are built in the browser — contact details are never
  sent anywhere.
- No `eval`, no `innerHTML` with dynamic data; the one JS-built element (the
  optional video link) uses `createElement` and `textContent`.
- The only external request is the Google Fonts stylesheet, and the page falls
  back to system fonts without it. The portrait is inlined, so no image request
  leaves the page either.
