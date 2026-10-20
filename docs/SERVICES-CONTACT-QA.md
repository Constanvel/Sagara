# Services, packages, contact — 20 October 2026

## Scope

Added `/layanan` and `/kontak`; refined existing `/paket`. Home content and section source files are unchanged. Shared navigation now points to actual routes. Desktop/header menu includes Paket Khitan per the latest specification; four-item mobile bottom navigation retains the Figma layout and groups Paket under Layanan. Galeri remains disabled.

## Figma references

File `4uOzAoUAwIBh6TL7f9cGsN`, latest frames: Layanan `9:792` (412×1025), Paket `9:731` (412×927), Kontak `9:669` (412×1031). Context and screenshots retrieved through Figma MCP.

- Preserved the two separate Kebutuhan khusus cards rather than inventing a replacement. Their business intent still needs confirmation.
- Corrected obvious service spelling errors, keeping meaning. Omitted the stray “Tanya paket Modern” text on Layanan.
- Downloaded exact service icons, contact icons, and map preview under `public/images/figma/service-*` and `contact-*`.
- Mobile geometry follows the references with fluid widths to prevent clipping at 320px. Package CTAs retain a compact visual height with larger hit areas. Minor contrast adjustments prioritize accessibility.
- Desktop uses a shared bounded container, service grid, two-column prices, and two-column contact/location layout. This is an adaptation requiring review, not an approved desktop reference.

## Data and limitations

- WhatsApp remains the previously verified `6287899777219` with service/package/homecare-specific inquiry messages.
- Prices remain numeric centralized data in `src/data/packages.ts`; status is pending business verification. The disclaimer and accessible explanation avoid guaranteed final pricing.
- No verified Google Maps URL exists. `src/data/contact.ts` records `mapsUrl: null`. The original map preview is displayed, but Petunjuk Arah is disabled and explains why to assistive technology. No invented address, coordinates, or hours.
- `PRD.md` was not found in the workspace. `AGENTS.md` and installed Next.js documentation were read.
- No production domain was supplied; domain-specific metadata remains omitted.

## Motion

Existing dependency-free Web Animations API system extended for new pages: 420ms entrance, 18px translation, 65ms card staggering. CSS handles hover, arrow feedback, press states, and menu open/close. Reduced motion disables movement. Content is never hidden waiting for JavaScript. Mobile menu locks background scrolling and supports Escape, focus containment, focus restoration, and desktop breakpoint cleanup.

## Verification

- Lint, strict TypeScript, production build: passed.
- Playwright: 46 passed across all four routes at 320, 375, 390, 412, 768, 1024, 1280, 1440, 1920px; checks overflow, visible images, H1, page errors, navigation/history, WhatsApp, menu scroll locking, reduced motion, and Home regression.
- Axe: no automated WCAG 2 A/AA or 2.1 AA violations on all four routes at 412px. This is not full accessibility certification.
- Visual screenshots inspected at 412px and desktop. Fixed mobile navigation overlays the viewport by design; bottom document padding makes underlying content reachable by scrolling. Full-page captures do not represent that scrolling interaction.
- Google Maps navigation cannot be verified until an official URL is supplied. WhatsApp URLs are checked without sending messages.

### Lighthouse — local production build, default mobile simulation

| Route | Performance | Accessibility | Best Practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| `/layanan` | 94 | 100 | 96 | 100 |
| `/paket` | 97 | 100 | 96 | 100 |
| `/kontak` | 94 | 100 | 96 | 100 |

Scores are single local measurements, not production guarantees. Reports are in ignored `test-results/lighthouse-*.json`. Lighthouse was run through npx without adding a project dependency.

No push or deployment performed for this task.
