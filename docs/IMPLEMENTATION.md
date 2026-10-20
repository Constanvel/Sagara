# SAGARA implementation

## Run locally

Requires Node.js 20.9 or newer and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Production verification:

```sh
npm run lint
npm run typecheck
npm run build
npx playwright install chromium
npx playwright test
```

## Routes and approved content

- `/`: Home, methods, service needs, benefits, homecare, FAQ, consultation, footer.
- `/paket`: Paket Modern Rp1.100.000 and Paket Top Sealer Rp900.000 per patient.
- Official WhatsApp: `6287899777219`, centralized in `src/lib/whatsapp.ts`. Optional `NEXT_PUBLIC_WHATSAPP_NUMBER` accepts only international digits; invalid values disable contact actions.
- Galeri remains unavailable with an accessible “segera hadir” state.
- Shared mobile navigation is fixed, with safe-area padding. Desktop uses header navigation.
- Medical/promotional copy, prices, package spelling corrections, and publication of the hero photograph were approved by the owner.

## Design and asset inventory

Source: https://www.figma.com/design/4uOzAoUAwIBh6TL7f9cGsN/Sagara-MCP

Reference nodes: Home `2:670`, hero `2:1016`, photograph `2:1066`, Paket `2:1337`.

All design images are local in `public/images/figma`; no runtime Figma asset requests or full-page screenshot backgrounds.

| Assets | Purpose |
| --- | --- |
| `hero.png` | Approved hero photograph with design crop |
| `imgImageRemovebgPreview82.png` | Header logo |
| `imgArtworkAsli.png` | Footer artwork |
| `imgImage16.png` | Homecare vehicle |
| `imgWaveRibbon*` | Decorative ribbon source assets |
| `cauter.svg`, `imgContainer*.svg` | Method illustrations |
| `imgBaby.svg`, `imgUserRound.svg`, `imgAccessibility.svg` and related icons | Service and benefit illustrations |
| `package-tick.svg`, `package-arrow-*.svg` | Package list and consultation actions |
| `menu.svg`, `imgVector*.svg`, `imgGroup1.svg` | Shared navigation |

Original export filenames are retained for traceability. Next Image provides responsive optimization for raster assets. Plus Jakarta Sans uses Next Font; a build needs access to its Google Fonts source unless already cached.

## Validation scope

Playwright covers both routes at 320, 360, 375, 390, 412, 768, 1024, 1280, and 1440 px: horizontal overflow, visible image loading, one H1, browser errors, full-page screenshots, menu Escape/focus behavior, FAQ keyboard toggling, contact number, and package navigation/pricing.

Axe checks WCAG 2 A/AA and WCAG 2.1 AA at 412 px on both routes. Automated checks do not establish complete accessibility conformance. Inactive navigation text and the gold package badge are slightly darker than the reference to meet text contrast requirements.

Screenshots are generated under ignored `test-results/`. Desktop is a conservative responsive adaptation, not a separately approved desktop design. No pixel-diff threshold is asserted.

## Recorded verification — 20 October 2026

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: exited successfully.
- `npx playwright test`: 24 passed; nine widths on both routes plus interaction, navigation, reduced-motion, and automated accessibility checks.
- Desktop revision: navigation matches mobile destinations (Beranda, Layanan, disabled Galeri, Kontak); Paket is accessed through the Lihat paket CTA, not the header menu. Hero, section spacing, method cards, benefits, and homecare use a denser desktop composition.
- Motion: one-time entrance animations using IntersectionObserver and the Web Animations API; hover/press feedback uses CSS. No animation dependency. Content remains visible without JavaScript, and reduced-motion preferences disable movement. Screenshot and contrast checks disable motion for deterministic results.
- The development indicator is disabled because it overlapped mobile controls during local testing.
- `npm audit --omit=dev`: zero vulnerabilities.
- Manual screenshot inspection: Home at 412 and 1440 px; Paket at 412 px. Exact pixel parity is not certified. Decorative ribbon folds/textures and the third method badge colors still need final comparison with the approved Figma frame.

## Release limitations

- No production domain was supplied. Domain-specific canonical, sitemap host, and social image URLs are intentionally omitted.
- Lighthouse scores have not been recorded. Browser/device coverage is Chromium only.
- Development dependency audit reports five high-severity findings through the ESLint dependency chain; no forced breaking downgrade was applied. Production dependency audit reports zero vulnerabilities.
- No deployment has been performed or authorized by this implementation task.
