# Browser verification

Date: 2026-10-21. Baseline: isolated production build from `e259ad2`; after: optimization production build, before the final four byte-identical photo filename/caption corrections. No deployment occurred. Final-source validation is recorded separately in the implementation summary.

## Method

Playwright Chromium, 412 × 924, JavaScript enabled, normal motion, fresh context and disabled browser cache per run, localhost without CPU/network throttling. Three initial-waterfall runs per route for Home and Gallery, `networkidle + 1 second`, no scrolling. CDP network bytes include protocol overhead; these are not Lighthouse resource-summary bytes. Full-page visual and broken-image checks covered all five routes at 412 and 1440 pixels.

## Initial transfer

| Metric | Before bytes | After bytes | Change |
|---|---:|---:|---:|
| Home total | 656,843 | 368,815 | −43.85% |
| Home images | 405,994 | 117,051 | −71.17% |
| Gallery total | 1,047,007 | 505,927 | −51.68% |
| Gallery images | 809,747 | 264,791 | −67.30% |
| JavaScript network, either route | 159,505 | 160,011 | +506 bytes |
| JavaScript encoded body | 153,433 | 153,939 | +506 bytes |
| JavaScript decoded body | 510,738 | 511,946 | +1,208 bytes |

Totals were identical across three runs within each build. Home initial image requests decreased from 28 to 24; Gallery stayed at 36. This is an image-transfer improvement, not a bundle-size reduction.

## Visual and functional evidence

- Ten before/after screenshot pairs reviewed. Corresponding dimensions match.
- Home layout unchanged at both widths. Desktop first carousel photo, crop, caption placement, controls and dimensions preserved.
- Layanan and Paket pixel-identical at both widths.
- Gallery grid geometry and full-page height unchanged. Factual visible captions changed, not only alt attributes.
- Kontak layout unchanged; small differences were confined to the third-party map.
- Carousel retains 20 slide slots and 20 dots; only first and adjacent image mount initially.
- All five routes at both widths after scrolling: zero missing alt attributes and zero broken images. No errors recorded by this capture.
- Video dialog still creates a paused `video` with `preload="none"`; no video response observed in the following 1.5 seconds.

## Scoped runtime profiling

Two-second carousel rAF trace before and after: 121 samples, p50/p95 16.7 ms, maximum 16.8 ms, no intervals above 33.3 ms. This is laboratory scheduling, not physical-device FPS.

| Synthetic gallery interaction | Before | After |
|---|---:|---:|
| Foto | 40 ms | 16 ms |
| Video | 32 ms | 16 ms |
| Semua | 24 ms | 16 ms |
| Open video dialog | 64 ms | 24 ms |

Single-run PerformanceObserver event durations are not field INP and do not establish a population-level responsiveness improvement.

Clean listener counts stayed at 8 window / 144 document / 1 carousel after scrolling and ten menu cycles in both builds. No observed growth is not proof of no memory leak. A separate test confirmed retention of 19 disconnected gallery cards by the motion IntersectionObserver; source cleanup and `tests/motion-retention.spec.ts` address that specific issue.

Baseline axe checks found zero violations on all five routes at 360 and 1920 pixels, plus open mobile-menu and About/gallery-dialog states. Focus, Escape and scroll restoration passed. These are automated/browser checks, not a complete manual assistive-technology or physical-device certification.

## Evidence location

`C:\Users\IDEAPAD SLIM 3\AppData\Local\Temp\opencode\`

- `sagara-ultimate-browser-before.json`, `sagara-ultimate-browser-after.json`
- `sagara-before-*.png`, `sagara-after-*.png`
- `sagara-compare-*.jpg`, `sagara-visual-diff.json`

Temporary evidence is outside version control. Retain it separately if reproducibility across machines is required.
