# Az Orta – Pre-Launch Production Audit

**Date:** 14 July 2026
**Scope:** Full repo + live deployment at https://ggmax-lab.github.io/Az-Orta-restaurant-website/
**Auditor:** Automated audit (Claude Code)

> **Note:** This file is for you, not the client. Don't commit it if you don't want it publicly served on the site (everything in this repo root is public once pushed).

---

## CRITICAL

### C1. `azorta.com` is not your domain — it's an Indian men's-clothing Shopify store
- **What:** Every canonical tag, hreflang tag, `og:url`, sitemap URL, and schema.org URL on all 8 pages points to `https://azorta.com/`. That domain currently resolves to a Shopify store ("Azorta – premium men's clothing", contact `azortaindia@gmail.com`, ships across India). There is also **no `CNAME` file** in the repo, so GitHub Pages has no custom domain configured — the site is only reachable at the github.io URL.
- **Why it matters:**
  - SEO: the canonical tags literally tell Google "the real copy of this page lives at azorta.com" — Google will credit/index the clothing store, and may refuse to index the restaurant site at all.
  - The sitemap in `robots.txt` points to `https://azorta.com/sitemap.xml`, which serves the *clothing store's* domain.
  - Business: if the client was told the site would live at azorta.com, that domain is **taken** and not for sale cheaply. This needs to be resolved *before* payment/handover.
- **Where:** `index.html:16-19`, `index-en.html:16-19`, `menu.html:15-18`, `menu-en.html:15-18`, `about.html:15-18`, `about-en.html:15-18`, `contact.html:15-18`, `contact-en.html:15-18`, `sitemap.xml` (all URLs), `robots.txt:4`, all JSON-LD blocks.
- **Status:** ⚠️ **Flagged for manual decision — not auto-fixed.** Options:
  1. Register a domain that's actually available (e.g. `azorta.com.tr`, `azortamaslak.com`, `azorta.ist`) — `.com.tr` fits a Turkish restaurant well.
  2. Once chosen: add a `CNAME` file, configure DNS + custom domain + "Enforce HTTPS" in GitHub Pages settings, then find-and-replace `https://azorta.com` → the new domain across all 8 HTML files, `sitemap.xml`, and `robots.txt`.
  3. Until then the canonicals actively harm the site's SEO. If launch on github.io is intended even temporarily, the URLs should point at the github.io address instead.

---

## HIGH

### H1. Phone number needs verification: +90 555 200 9999
- **What:** The click-to-call number `tel:+905552009999` appears on every page (footers, sticky CTAs, contact page, schema `telephone`). The pattern (555 … 9999) looks placeholder-ish.
- **Why:** If it's wrong, every "Call" button on the site dials a stranger. This is the single most-used action on a restaurant site.
- **Where:** all pages, e.g. `contact.html:106`, `index.html:418,430`.
- **Status:** ⚠️ **Flagged — verify with the client before launch.** (I confirmed the link format itself is correct; I cannot verify the number is really the restaurant's.)

### H2. ~93 MB of unused private/dev media was publicly served
- **What:** 17 tracked files were referenced by no page but deployed publicly, including:
  - `videos/az-orta-alpha-animasyon.mov` — **89 MB** raw animation source
  - `Images/Photo_on_11-02-2026_at_21.34.webp` — a **webcam selfie** (personal photo, publicly downloadable)
  - 13 unused images (~3 MB) and 3 unused videos, incl. duplicates (`az-orta-menu-temp.png`, `storefront.png` = byte-identical copy of `contact-street.png`, `Kerem.jpeg`)
- **Why:** Public exposure of a personal photo; repo bloat (slow clones/deploys); unprofessional if discovered.
- **Status:** ✅ **Fixed** — all 17 files deleted from the working tree. They remain in git history (recoverable with `git checkout HEAD~1 -- <path>`). If you want the 89 MB `.mov` and the selfie scrubbed from *history* too, that needs `git filter-repo` + force-push — flagged as optional follow-up (see D2).

### H3. Orphan dev page `menu-en-Max.html` was live and indexable
- **What:** A leftover development copy of the EN menu (older prices/branding, no canonical, no hreflang, no robots directives) was deployed and returning HTTP 200. Nothing linked to it, but it was crawlable and could appear in search results as duplicate/stale content showing **wrong menu information**.
- **Status:** ✅ **Fixed** — deleted. After pushing, it will 404. Optionally request removal in Google Search Console if it was ever indexed.

---

## MEDIUM

### M1. Third-party scripts loaded without integrity protection (GSAP)
- **What:** `about.html` / `about-en.html` load `gsap.min.js` and `ScrollTrigger.min.js` from cdnjs with no SRI hash — if the CDN were compromised, arbitrary JS would run on your page.
- **Status:** ✅ **Fixed** — added `integrity="sha512-…"` + `crossorigin="anonymous"` + `referrerpolicy="no-referrer"` to both tags (`about.html:270-271`, `about-en.html:270-271`). I verified the hashes independently against the served files before pinning. Self-hosting the two files would be even better (they're ~100 KB total) — optional.

### M2. Elfsight Instagram widget (`elfsightcdn.com/platform.js`)
- **What:** The homepage Instagram feed is an Elfsight embed — a third-party script with full DOM access, no SRI possible (it self-updates), and it sets third-party requests on every visit. It's also a freemium service: if the client's Elfsight subscription lapses, the widget shows Elfsight branding or stops.
- **Why:** This is the site's only real supply-chain exposure and a GDPR/KVKK consideration (loads for all visitors with no consent gate).
- **Where:** `index.html:392-394`, `index-en.html:391-393`.
- **Status:** ⚠️ **Flagged.** Acceptable trade-off for a static site, but tell the client: (a) the widget depends on an active Elfsight account, (b) the simplest more-trustworthy alternative is a static grid of 3–6 photos linking to the Instagram profile. The widget ID in the HTML is public by design — it is **not a secret/API key** and cannot be abused to run up costs.

### M3. Hero/menu video is 7.9 MB and starts downloading on every visit
- **What:** `videos/restaurant-edit.mp4` (7.9 MB, served with `autoplay loop muted playsinline`). `preload="metadata"` and a poster are correctly set, but autoplay means the full file streams on mobile data anyway, on all 4 pages that embed it.
- **Why:** Biggest single performance cost on the site; on 4G this delays everything else.
- **Status:** ⚠️ **Flagged** (re-encoding is a quality judgment call). Recommendation: re-export at 720p / H.264 CRF 28 / 24fps, target 2–3 MB — visually indistinguishable behind the dark overlay. Command: `ffmpeg -i restaurant-edit.mp4 -vf scale=-2:720 -c:v libx264 -crf 28 -preset slow -an restaurant-edit-720.mp4`.
- Good news otherwise: poster ✅, muted+playsinline (autoplays correctly on iOS/Android without blocking) ✅, JS fallback on video error ✅.

### M4. TR pages were missing content the EN pages had
- **What:** EN pages had salad descriptions ("White beans, tomatoes and egg with tahini dressing", "Tomatoes, cucumbers, red onions, peppers and house blend dressing") that were absent from both TR pages; the EN menu page CTA had a "Call Us" button the TR page lacked. TR Menu JSON-LD was also missing the salad descriptions present in the EN JSON-LD.
- **Status:** ✅ **Fixed** — added Turkish equivalents to `index.html`, `menu.html` (visible text + JSON-LD) and added a "Bizi Arayın" call button to `menu.html`'s CTA. **Have the client sanity-check the two Turkish descriptions** ("Tahinli soslu kuru fasulye, domates ve yumurta" / "Domates, salatalık, kırmızı soğan, biber ve ev harmanı sos") since I authored them as translations of the existing EN copy.

### M5. Empty `src=""` on lightbox placeholder images
- **What:** All lightbox `<img src="">` placeholders (menu lightbox ×4 pages, about collage lightbox ×2 pages, allergen lightbox built in `script.js`) — an empty `src` makes browsers issue a **second request for the page itself** on every page load (confirmed in the live browser: 2 phantom requests per page).
- **Status:** ✅ **Fixed** — removed the empty `src` attributes; JS sets the real `src` when a lightbox opens. Verified all three lightboxes still open/close correctly on the local copy.

---

## LOW

### L1. Social preview image is a small square logo
- `og:image` / `twitter:image` on the homepages is `Images/logo.png` with `twitter:card = summary_large_image`, which expects ~1200×630. Shares on WhatsApp/Twitter/iMessage will show a tiny or cropped logo. **Flagged:** consider a 1200×630 export of a food/hero photo instead. (Menu pages already use the food image — good.)

### L2. Copyright said “© 2025”
- ✅ **Fixed** — updated to © 2026 on all 8 pages.

### L3. `GITHUB_SETUP.md` and `README.md` are publicly served
- They contain no secrets (verified — see Security below), but `azorta.com/GITHUB_SETUP.md` returning your personal Git tutorial is untidy for a client site. **Flagged:** consider deleting `GITHUB_SETUP.md` from the repo (or moving both out of the deploy root).

### L4. hreflang `x-default` inconsistency (cosmetic, valid)
- The homepage pair uses `x-default → https://azorta.com/` while subpages use `x-default →` their own TR version. Both are valid per Google's spec and fully reciprocal (verified all 4 pairs + sitemap annotations). No action needed beyond the C1 domain fix.

### L5. Sitemap `lastmod` was stale
- ✅ **Fixed** — bumped to 2026-07-14 (matches this change set).

---

## VERIFIED CLEAN (no action needed)

| Check | Result |
|---|---|
| Secrets in working tree & **full git history** | ✅ Clean — scanned every commit for API-key/token/password patterns (AWS, Google, Stripe, GitHub PAT, private keys). Only hit was the word "token" in the GITHUB_SETUP.md tutorial text. No deleted files hiding secrets. **There are no API keys in this project at all** — nothing for anyone to spam. |
| Contact form leftovers | ✅ None — zero `<form>`/`<input>`/`<textarea>` elements or form-handling JS anywhere. Form-validation checks correctly skipped. |
| Mixed HTTP/HTTPS content | ✅ None — every external reference is HTTPS (the only `http://` string is the W3C SVG namespace, which is correct). |
| `rel="noopener noreferrer"` | ✅ Present on **every** `target="_blank"` link (all 30+ checked). |
| HTTPS enforcement | ✅ github.io URL: HTTP 301→HTTPS with HSTS. (Custom domain: n/a until C1 is resolved.) |
| Console errors | ✅ Zero on index, menu, about (TR pages tested live; EN pages share identical JS). GSAP loads and the collage ring animates. |
| Broken links/images | ✅ All internal links resolve; all images load (live check). Instagram profile (`instagram.com/az.orta`), Instagram post link, and Google Maps place link (name "Az Orta", pinned at 41.1129768, 29.0222225 Maslak) all respond correctly. Maps link verified to carry the correct place ID; **do a final tap-test on a phone** since Google served me a consent wall. |
| Menu/price/allergen consistency | ✅ Cross-checked all items TR↔EN↔JSON-LD: prices identical everywhere (660/500/540/730 mains, 130/260 salads, 110 dessert, 100/90/50/40 drinks, +1 skewer 110/135/195). Allergen legend contains exactly the 6 symbols used (🌾🥛🥚🌰🫛🥜) and every badge on every dish has a matching legend entry, in both languages, matching on both homepage and menu page. |
| Allergen icons for screen readers | ✅ `script.js` adds `role="img"` + `aria-label` from each badge's `title` — icons are announced as "Gluten İçeren Tahıllar" etc., not as raw emoji. Legend text + `<details>` fallback also present. |
| Schema.org Restaurant | ✅ Parses as valid JSON-LD (all 16 blocks on 8 pages re-validated after my edits). Includes `hasMenu`, `openingHoursSpecification` (Mon–Fri 11:30–21:00, Sat–Sun 12:00–21:00 — matches visible text), `geo`, `priceRange`, address, phone, `sameAs`. Menu pages have full `Menu`/`MenuSection`/`MenuItem` markup with prices. |
| Titles / meta descriptions / OG / Twitter | ✅ Unique, sensible, localized on all 8 pages. |
| Heading hierarchy | ✅ One `h1` per page (visually-hidden on home — acceptable), logical h2→h3→h4 nesting. |
| Alt text | ✅ Every content image has meaningful alt text (TR on TR pages, EN on EN pages); decorative hero wordmark correctly `alt=""` + `aria-hidden`. |
| Keyboard navigation | ✅ Tab order follows page order; visible 2px orange focus outline (verified live); no `outline: none` anywhere in CSS; Escape closes menus/lightboxes; collage tiles are `role="button"` + `tabindex="0"` with Enter/Space handlers. |
| Contrast (WCAG AA) | ✅ Key combinations pass: hero text is white on a dark overlay (screenshot-verified); menu body text `rgba(255,255,255,.68)` on `#141414` ≈ 9:1; orange accent `#EA580C` on charcoal ≈ 5.3:1; `#5c5c5c` body on `#f0ebe4` ≈ 5.6:1. |
| Mobile layout | ✅ 375px viewport: no horizontal overflow (`scrollWidth == innerWidth`), menu cards stack cleanly, prices/allergen icons don't wrap awkwardly, hamburger menu works, sticky call/menu/location CTA behaves. |
| Lazy loading | ✅ `loading="lazy"` on all below-the-fold images; hero assets `eager` + preloaded; explicit width/height on nav logo. |
| Fonts | ✅ Google Fonts with `display=swap` (no FOIT) + `preconnect`. Optional hardening: self-host via fontsource to remove the Google dependency — not required. |
| robots.txt / sitemap | ✅ Present and well-formed (sitemap URL domain pending C1). |

---

## Changes made in this audit (all uncommitted, in your working tree)

1. **Deleted** `menu-en-Max.html` (orphan stale dev page).
2. **Deleted** 17 unreferenced media files (~93 MB) incl. the 89 MB `.mov` and a personal webcam photo.
3. **Added SRI integrity + crossorigin** to both GSAP script tags (`about.html`, `about-en.html`).
4. **Removed empty `src=""`** from 6 lightbox images + 1 in `script.js` (kills 2 phantom self-requests per page-load).
5. **Added TR salad descriptions** (visible + JSON-LD) and a **"Bizi Arayın" call button** to match EN content (`index.html`, `menu.html`).
6. **Updated copyright** to © 2026 (8 pages).
7. **Bumped sitemap `lastmod`** to 2026-07-14.

Everything verified locally after the changes: JSON-LD parses, lightboxes work, no empty-src requests, no console errors.

**To ship:** review the diff (`git diff`), then commit and push. Consider bumping the `?v=` query on `script.js` references (it changed) so cached visitors pick it up: currently `script.js?v=20260616-1` → `?v=20260714-1` in all 8 HTML files.

## Before you invoice — the 3 things that actually block launch

1. **C1 — the domain.** Decide the real domain with the client; azorta.com is not available.
2. **H1 — confirm the phone number** with the client.
3. **M4 — have the client read the two Turkish salad descriptions** I added.
