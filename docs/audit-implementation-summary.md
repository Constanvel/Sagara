# Audit implementation summary

Date: 2026-10-21. Repository: `D:\Sunatan\Sunatan`. Baseline commit: `e259ad2`. User authorized add, commit and push after validation. Measurements below were captured locally before that push; the resulting deployed origin has not been re-audited.

## Implemented

- Gallery responsive image sizes match individual card slots; first photo uses explicit high fetch priority and eager loading. The intermediate preload-only build left its recorded priority Low and regressed simulated mobile LCP; final controlled measurement is recorded in the performance report.
- Carousel retains 20 slide containers but initially mounts only the first and adjacent photo. Index state changes only when the calculated index changes.
- Removed hydration-time whole-main opacity entrance; retained offscreen reveal behavior.
- Added cleanup for gallery cards removed during filtering. A browser reproduction established 19 detached cards retained by IntersectionObserver; this was not a confirmed event-listener leak.
- Added small responsive image widths and image caching: one-day max-age plus seven-day stale-while-revalidate. Existing URLs can change, so no immutable claim is made.
- Audited every public image, corrected factual Indonesian alternatives and four misleading active filenames, preserving old URLs.
- Added a descriptive vehicle WebP without deleting originals or claiming raw-file savings as browser savings.
- Added verified original-logo social metadata, factual Organization JSON-LD, safe JSON-LD serialization and a shared sitemap route inventory. No invented street address, operating hours, ratings or video publication dates.
- No new runtime dependency.

## Asset accounting

144 images: 88 active URLs, 37 compatibility aliases, 19 source-unused. Original files retained. Vehicle active-origin source changes from 2,023,825 to 188,372 bytes (90.69% smaller). Storage increases 881,612 bytes because originals and four byte-identical photo aliases remain. Five videos total 39.50 MB; their existing encoding is 83.2% smaller than originals. This audit did not re-encode the videos.

## Evidence and reports

- `docs/image-seo-audit.md`: complete 144-image inventory and factual filename/alt decisions.
- `docs/technical-seo-audit.md`: server-readable metadata, links, robots, sitemap, structured data and limitations.
- `docs/video-performance-audit.md`: five-video codecs, faststart, range, cache and loading evidence.
- `docs/browser-verification.md`: identical-method browser before/after transfers, screenshots and scoped runtime profiling.
- `docs/performance-audit.md`: Lighthouse measurement report, produced after all 30 after runs complete.

Browser measurement: Home initial total transfer 656,843 to 368,815 bytes (−43.85%); Gallery 1,047,007 to 505,927 bytes (−51.68%). JavaScript network transfer increased by 506 bytes on both routes; no bundle reduction claimed. Initial video downloads remain zero.

## Measurement provenance

Baseline and optimization snapshots use isolated production builds at port 3002. Lighthouse uses three runs × five routes × mobile/desktop per phase. Browser initial transfer uses three fresh-context runs at 412 × 924, cache disabled, no throttling, no scrolling, networkidle plus one second. These methods count different request sets and must not be mixed.

The intermediate optimization measurement build predates the last four byte-identical photo URL/caption corrections. Final build `3gCOLNCwM5SII3LOkg50T` includes those corrections and explicit gallery high fetch priority, and was measured with a further 30 Lighthouse runs. The browser transfer/screenshot comparison describes the intermediate snapshot, not a fresh capture of the final build. Final build functional coverage is recorded below.

Final mobile median Performance / LCP: Home 90 / 3121.52 ms; Gallery 89 / 2414.76 ms; Layanan 95 / 2048.30 ms; Paket 97 / 2077.54 ms; Kontak 99 / 1969.75 ms. Desktop Performance is 100 throughout. All routes/devices retain SEO, Accessibility and Best Practices 100, CLS 0. Home misses the 2500 ms LCP target; Gallery misses the Performance ≥90 target. Gallery LCP meets the target by median, not in every run. Final mobile CPU-sensitive results show materially lower Lighthouse host benchmark values than the intermediate phase; do not attribute score changes solely to code. See the performance report for all runs and limitations.

## Validation status

- Optimization snapshot production suite: 190 passed.
- Lint and TypeScript: passed after final photo corrections and legacy-URL regression-test addition.
- Browser screenshot comparison: all five routes at 412 and 1440 pixels; preserved layout, no broken images or missing alt attributes after scrolling.
- Responsive production suite covers 360, 390, 412, 768, 1280, 1440 and 1920 pixels.
- Final-source production build `3gCOLNCwM5SII3LOkg50T`: passed. Final production suite: **191 passed (2.8 minutes)**, including canonical/legacy photo byte equality, full-scroll responsive checks, media interactions and observer cleanup. Log: `C:\Users\IDEAPAD SLIM 3\AppData\Local\Temp\opencode\sagara-final-source-tests.log`.

## Limits

Field INP/CrUX: **Not Measured**. Public CrUX API returned 403 requiring caller identity/API key; PageSpeed API returned 429 quota exceeded. Synthetic interaction timings and TBT are not substitutes for field INP. Localhost TTFB does not certify deployment TTFB. Physical-device tests, full manual assistive-technology review, Search Console/indexing evidence and real-user monitoring remain unavailable. Automated SEO scores do not establish indexation or rankings.
