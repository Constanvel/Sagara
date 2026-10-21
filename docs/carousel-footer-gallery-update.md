# Carousel, footer and gallery update

Date: 2026-10-21. Baseline commit: `849e15d`. Scope limited to requested carousel copy, footer branding/location preview, and gallery presentation.

## Carousel

All 20 user-supplied headline/subtext pairs installed verbatim, in order. Photo ordering, factual alt text and gallery metadata remain separate. Existing swipe, keyboard, arrows and dots retained. Caption uses readable 14px text, line-height 1.5, natural wrapping, paragraph spacing and a reserved minimum height of 164px. The larger reserved area accommodates longer supplied copy without per-slide movement; no truncation or line clamping.

Regression tests cycle all 20 slides at 360, 390, 412, 768, 1280, 1440 and 1920px, checking exact text, synchronized active controls, clipping, stable geometry and overflow. All passed against final production build.

## Footer

Source asset: `D:\Sunatan\Sagara-foto\logo footer.png`, visually verified as the supplied transparent SAGARA/BANTERAN wordmark, 1920 × 819. Generated `public/images/media/sagara-footer-logo-transparan.webp` at 960px width, quality 92 with full alpha quality, 103,068 source bytes. No redraw, trim or crop; original ratio retained. Next Image optimizes responsive delivery; display remains 210px mobile / 240px tablet and desktop with `object-fit: contain`. Old logo URL and original source remain intact; header branding and social metadata are unchanged.

Desktop footer uses a restrained third column for the location card. Tablet uses two columns with the card below; mobile remains stacked. Existing description, navigation, map link, WhatsApp, divider and copyright are retained.

Location preview: existing visually inspected `public/images/figma/contact-map.png`, a supplied historical location screenshot, converted without content edits to `public/images/media/sagara-banteran-map-preview.webp` (640 × 734, 21,706 bytes). The card links to verified `https://maps.app.goo.gl/e89cFM6roqapjt3dA`. This static preview is not a live map; current information is available through that link. No new map script or iframe. Existing Contact embed is untouched.

Browser inspection caught an initial oversized map rendering caused by image height behavior. A positioned wrapper now reserves 140px mobile / 160px larger-screen height, with a fill image inside. This keeps the card compact and reserves geometry before loading. The screenshot's original content is preserved in the source; the card viewport uses cover positioning toward the SAGARA marker.

## Gallery modes

- **Semua:** all 29 unique media, with videos deterministically interleaved after every five photos and remaining video appended. Existing featured overview composition retained.
- **Foto:** all 24 photos, original order, uniform square grid without the overview's featured first card.
- **Video:** all five videos, dedicated landscape poster cards, visible play/video label, explanatory count, two columns on desktop and one on mobile.

Dialogs, collection-specific previous/next navigation, native controls, focus return and Escape behavior retained. Correct responsive image sizes are selected per mode. No autoplay or MP4 download on initial display or filter change. No runtime dependencies added.

## Verification

- Production build: passed.
- ESLint: passed.
- TypeScript: passed.
- `git diff --check`: passed (Git line-ending normalization warnings only).
- Full final production Playwright suite: **213 passed, 3.1 minutes**.
- Responsive coverage: 360, 390, 412, 768, 1280, 1440 and 1920px.
- Exact carousel copy and all-slide geometry checks passed, including desktop rerun against final production build.
- Footer/header branding checks across all five routes and seven widths passed; new logo ratio preserved, no clipping, footer stays above mobile bottom navigation at page end.
- Filters, unique item counts, differentiated composition, zero initial MP4 requests, dialogs, playback and media error recovery passed.
- Existing full-scroll visual/browser checks cover broken images, document overflow, runtime errors and responsive layout.
- Final screenshots captured at 360, 768 and 1440px for carousel, footer and each gallery mode. Desktop and mobile footer, plus desktop photo/video presentation, reviewed directly. Initial capture without waiting for images showed unloaded posters; final review waited for all card images to finish.

Evidence outside Git: `C:\Users\IDEAPAD SLIM 3\AppData\Local\Temp\opencode\sagara-copy-footer-gallery-final-tests.log` and `sagara-*-final-*.png` / `sagara-mode-final-*.png`.

## Limits

No new Lighthouse comparison, field INP, physical-device benchmark or deployed-origin CLS claim is made for this task. Fixed preview geometry and all-slide position assertions prevent the tested overflow/slide-height regressions; they do not establish field Core Web Vitals. Figma canvas lookup returned no selected layer; existing carousel node `25:432` was retrieved successfully for the original photo reference. User-requested new copy and differentiated modes intentionally extend the existing design rather than claiming pixel-identical new Figma layouts.

User authorized commit and push using their existing GitHub account. Deployment completion is separate from a successful push.
