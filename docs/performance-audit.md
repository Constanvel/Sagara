# Production performance audit

**Report status: three measured phases.** The before/after tables below preserve the baseline and intermediate build, including its gallery regression. The final-build section at the end records the subsequent explicit gallery fetch-priority fix and final media names. Do not treat intermediate metrics as final results.

## Scope and reproducibility

Measured existing production server http://localhost:3002 without rebuilding during either measurement window. Before: commit e259ad2074f7ac1a086ed87d27c575ab02921650, build eDrR3pzvYszmYUU6XDyNY. After: same HEAD plus working-tree changes, build pQGP29dqHMohsL_ca3xsV. Source snapshots and provenance are retained with reports. **The measured after build predates four final canonical photo filename/caption tweaks.** Parent reports those renamed photos are byte-identical copies; no performance effect is expected from the file content, but these measurements are not a measurement of the final rebuilt snapshot. Parent will rebuild afterward for functional validation.

Each phase contains **30 successful Lighthouse navigation runs: 3 runs × 5 routes × 2 devices**. Lighthouse 13.5.0 from the same npm cache, Chrome at C:/Program Files/Google/Chrome/Application/chrome.exe. All runs sequential, mobile then desktop, routes /, /galeri, /layanan, /paket, /kontak. Mobile uses defaults; desktop uses --preset=desktop; categories performance, accessibility, best-practices, seo. Default simulated throttling. No concurrent Playwright checks during Lighthouse. Each navigation launches a fresh isolated Chrome process/profile; the existing server and Next.js image optimizer disk caches were **not cleared**, including baseline. This is a fresh-browser comparison, not a guaranteed cold-origin/image-optimizer benchmark. Small localhost TTFB values do not predict deployed TTFB.

All values below are independently calculated medians of three runs, not metrics from a single representative report. Times are milliseconds; bytes are decimal bytes. **Before / after** notation. TTFB is specifically server-response-time.numericValue.

## Scores and timing medians

| Device | Route | Performance | SEO | Accessibility | Best Practices | LCP ms | CLS | FCP ms | TTFB ms | TBT ms |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| mobile | / | 91 / 96 | 100 / 100 | 100 / 100 | 100 / 100 | 3372.65 / 2723.37 | 0 / 0 | 1066.73 / 1065.84 | 8 / 5 | 86.50 / 51 |
| mobile | /galeri | 98 / 93 | 100 / 100 | 100 / 100 | 100 / 100 | 2135.59 / 3147.35 | 0 / 0 | 923.05 / 915.06 | 8 / 4 | 94.50 / 73 |
| mobile | /layanan | 96 / 99 | 100 / 100 | 100 / 100 | 100 / 100 | 2696.12 / 2122.99 | 0 / 0 | 909.79 / 913.14 | 3 / 6 | 47 / 43.50 |
| mobile | /paket | 99 / 99 | 100 / 100 | 100 / 100 | 100 / 100 | 2047.53 / 2043.64 | 0 / 0 | 909.07 / 910.65 | 5 / 5 | 43 / 48 |
| mobile | /kontak | 97 / 99 | 100 / 100 | 100 / 100 | 100 / 100 | 2619.76 / 2047.95 | 0 / 0 | 911.38 / 908.52 | 4 / 5 | 39 / 48.50 |
| desktop | / | 100 / 100 | 100 / 100 | 100 / 100 | 100 / 100 | 558.74 / 557.69 | 0 / 0 | 289.07 / 293.60 | 5 / 4 | 0 / 0 |
| desktop | /galeri | 100 / 100 | 100 / 100 | 100 / 100 | 100 / 100 | 627.40 / 621.76 | 0 / 0 | 255.60 / 257.18 | 4 / 4 | 0 / 0 |
| desktop | /layanan | 100 / 100 | 100 / 100 | 100 / 100 | 100 / 100 | 583.72 / 590.28 | 0 / 0 | 248.48 / 253.29 | 3 / 3 | 0 / 0 |
| desktop | /paket | 100 / 100 | 100 / 100 | 100 / 100 | 100 / 100 | 577.18 / 573.87 | 0 / 0 | 249.55 / 254.58 | 2 / 3 | 0 / 0 |
| desktop | /kontak | 100 / 100 | 100 / 100 | 100 / 100 | 100 / 100 | 562.89 / 572.81 | 0 / 0 | 249.51 / 254.64 | 5 / 3 | 0 / 0 |

## Findings and unresolved regression

- Mobile home Performance improves **91 to 96**, LCP **3372.65 to 2723.37 ms**, total-byte-weight **704131 to 458236 bytes** (34.9% reduction). LCP remains above the 2500 ms good threshold.
- Mobile gallery image transfer falls **1834613 to 842994 bytes** (54.0% reduction), but **simulated LCP regresses 2135.59 to 3147.35 ms and Performance 98 to 93**. This is a real recorded lab regression, not an overall pass.
- Gallery mobile simulated LCP run values: before **2065.34, 3272.78, 2135.59 ms**; after **3174.12, 3147.35, 3125.13 ms**. Observed unthrottled LCP values are before **260, 1215, 206 ms**, after **145, 174, 160 ms**. Thus observed paint improves while Lighthouse simulation worsens; these measurements must not be conflated.
- Gallery first image changes from **w=750, 75060 transfer bytes** to **w=640, 61472 bytes**. However after network requests still record its priority as **Low**, and the LCP discovery priority hint check still fails. Next.js preload alone did not establish an explicit high fetch priority in this measured build. Investigate an explicit fetchPriority="high" and repeat controlled Lighthouse measurements rather than claiming this is resolved.
- Desktop Performance remains 100 on every route. SEO, Accessibility and Best Practices remain 100, CLS remains zero throughout. Shared initial JS transfer grows **506 bytes**, decoded JS **1208 bytes**; this was image-transfer optimization, not a bundle-size reduction.

## Initial-load transfer medians

No scroll or interaction. Video denotes resource-summary media; posters count as images. total-byte-weight and resource-summary total are distinct Lighthouse audits and are preserved separately, not forced to match.

| Device | Route | Total-byte-weight | Resource total bytes | Requests | JS bytes | Image bytes | Video bytes |
|---|---|---:|---:|---:|---:|---:|---:|
| mobile | / | 704131 / 458236 | 700662 / 454767 | 55 / 51 | 159505 / 160011 | 449813 / 203003 | 0 / 0 |
| mobile | /galeri | 2075342 / 1087599 | 2071873 / 1084130 | 60 / 60 | 159505 / 160011 | 1834613 / 842994 | 0 / 0 |
| mobile | /layanan | 279532 / 279879 | 276063 / 276410 | 40 / 40 | 159505 / 160011 | 36830 / 35700 | 0 / 0 |
| mobile | /paket | 273611 / 273834 | 270142 / 270365 | 37 / 37 | 159505 / 160011 | 31236 / 30001 | 0 / 0 |
| mobile | /kontak | 861646 / 862435 | 858177 / 858966 | 70 / 70 | 613817 / 614321 | 114832 / 114222 | 0 / 0 |
| desktop | / | 610738 / 474287 | 607269 / 470818 | 68 / 66 | 159505 / 160011 | 356420 / 219054 | 0 / 0 |
| desktop | /galeri | 1060124 / 1095270 | 1056655 / 1091801 | 62 / 62 | 159505 / 160011 | 819395 / 850665 | 0 / 0 |
| desktop | /layanan | 271016 / 272878 | 267547 / 269409 | 39 / 39 | 159505 / 160011 | 28314 / 28699 | 0 / 0 |
| desktop | /paket | 265095 / 266833 | 261626 / 263364 | 36 / 36 | 159505 / 160011 | 22720 / 23000 | 0 / 0 |
| desktop | /kontak | 876628 / 878497 | 873159 / 875028 | 71 / 71 | 613816 / 614321 | 129109 / 129526 | 0 / 0 |

## Decoded initial JavaScript versus emitted bundles

The network-requests resourceSize is decoded response body size, distinct from transferSize and from JavaScript heap memory. These totals include iframe JavaScript where Lighthouse records it (notably /kontak).

| Device | Route | Decoded JS bytes before / after |
|---|---|---:|
| mobile | / | 516322 / 517530 |
| mobile | /galeri | 516322 / 517530 |
| mobile | /layanan | 516322 / 517530 |
| mobile | /paket | 516322 / 517530 |
| mobile | /kontak | 2315687 / 2316895 |
| desktop | / | 516322 / 517530 |
| desktop | /galeri | 516322 / 517530 |
| desktop | /layanan | 516322 / 517530 |
| desktop | /paket | 516322 / 517530 |
| desktop | /kontak | 2315687 / 2316895 |

After-build emitted client JS totals: **643946 decoded bytes**, 199115 locally gzip-compressed bytes, 172542 locally Brotli-compressed bytes across 12 chunks. These are **all emitted chunks**, not initial route payloads. Compression computed locally, not observed HTTP transfer. Before-build emitted chunks were not snapshotted before replacement, so no invented disk-bundle baseline is provided. Per-chunk after data: built-chunks.json.

## LCP and loading evidence

Baseline home mobile LCP is the .hero-copy background /images/media/sagara-hero-landscape.webp, not the carousel photo. Its high-priority preload is already discoverable/eager. Baseline mobile run 2 observed trace-derived breakdown: TTFB 8.2 ms, resource load delay 9.5 ms, download 9.2 ms, render delay 134.9 ms. Observed trace timing is not the simulated metric; do not sum these values to explain the simulated LCP median.

Baseline home mobile run 2 initially fetched six carousel photos at w=640 (~348 KB) despite lazy loading. HeroCarousel.tsx previously mounted every slide; after it mounts slide 0 plus current/adjacent slides (two at initial index 0), retaining the carousel slots. Updated sizes track actual layout.

Baseline gallery mobile requested w=750 for narrow cards measuring 155×120 CSS pixels because every card declared 90vw. GallerySection.tsx now distinguishes featured and grid-card sizes, with preload for the first image. Baseline gallery mobile run 2 LCP image was eager/discoverable but failed the fetch-priority hint check; observed trace-derived render delay was 1100.9 ms versus 50.3 ms resource download. MotionEnhancer.tsx no longer fades the entire main/page container from opacity 0 after hydration, preserving initial server paint; reveal animation remains for below-fold content. Changes were measured together, so this is not an isolated causal attribution to any one change.

next.config.ts adds imageSizes 80 and 160 for small logo/mascot density slots and Cache-Control for /images/:path*: public, max-age=86400, stale-while-revalidate=604800. Asset.tsx exposes optional loading and sizes props; unspecified loading retains Next.js defaults. SEO changes add absolute canonical/social URLs, brand social imagery and Organization/CollectionPage structured data. Lighthouse SEO was already 100, so a ceiling score cannot quantify these semantic improvements.

Representative after run 2 trace-derived LCP details (not simulated timings):

- home/mobile: main#main-content > section.hero-section > div.mx-auto > div.hero-copy; Time to first byte 9.0 ms, Resource load delay 14.2 ms, Resource load duration 17.3 ms, Element render delay 1118.4 ms.

- galeri/mobile: figure > button > span.VSAyyG_image > img; Time to first byte 9.1 ms, Resource load delay 19.2 ms, Resource load duration 29.5 ms, Element render delay 116.5 ms.

- home/desktop: div.vPDFaq_frame > div.vPDFaq_viewport > div.vPDFaq_slide > img.vPDFaq_photo; Time to first byte 12.0 ms, Resource load delay 13.6 ms, Resource load duration 47.7 ms, Element render delay 120.7 ms.

- galeri/desktop: figure > button > span.VSAyyG_image > img; Time to first byte 5.8 ms, Resource load delay 7.6 ms, Resource load duration 26.3 ms, Element render delay 118.6 ms.

## Browser integrity and video

Each phase additionally ran ten Playwright checks, one per route/device, after Lighthouse completed. Initial viewport only: no scrolling and no media activation. After checks: 0 broken completed images and 0 failed requests. Unrequested lazy images are not classified as broken. No mounted video elements before interaction; Lighthouse media transfer is zero before and after. This does not certify every offscreen image or interactive video.

## Field Core Web Vitals and remaining verification

**Field INP unavailable.** Read-only unauthenticated API checks for https://sagara-vert.vercel.app: CrUX records endpoint returned HTTP 403 requiring API key/caller identity; public PageSpeed endpoint returned HTTP 429 quota exceeded. Raw responses are in the before directory. No field INP, field percentile, or CrUX pass is inferred from Lighthouse TBT. A credentialed CrUX/PSI query or real-user monitoring is required.

Remaining goals: repeat on the deployed public origin; measure real-user INP; check cold-origin/image optimizer separately if operationally relevant; validate all lazy images after scrolling and video playback after interaction; assess /kontak third-party map JavaScript if further payload reduction is required. Performance-score ceilings do not establish absence of future optimization work.

## Artifact locations

- Before: C:/Users/IDEAPAD SLIM 3/AppData/Local/Temp/opencode/sagara-ultimate-before
- After: C:/Users/IDEAPAD SLIM 3/AppData/Local/Temp/opencode/sagara-ultimate-after
- Each contains {route}-{device}-{1,2,3}.json, summary.json, lcp-evidence.json, browser-evidence.json and provenance.json.
- Before baseline-source.json captures relevant source at e259ad2. After source-evidence.json captures changed source and built-chunks.json records emitted JavaScript.
- The unchanged runner copied into the after directory retains the filename server-home-before.html for its HTML snapshot; within that directory it contains the **after** server HTML.

No application source changes, rebuilds, or commits were made by the measurement task. This document is the requested report addition.

## Final measured build: baseline / intermediate / final

Final build **3gCOLNCwM5SII3LOkg50T**, production server PID 28636, includes final photo names/captions and the first gallery image with explicit fetchPriority="high", loading="eager", without preload. No source modifications or rebuild during measurement. Same runner, same Chrome, 30 sequential isolated Lighthouse runs (3 × 5 routes × 2 devices), followed by ten Playwright initial-load checks. Parent deferred its suite during this exclusive measurement window. Existing optimizer/server caches retained, fresh browser per run; same cache caveat as baseline.

Every final row has exactly three runs. Values below are **baseline / intermediate / final**. Times in ms, bytes decimal. TTFB remains server-response-time.numericValue.

### Final score and timing medians

| Device | Route | Performance | SEO | Accessibility | BP | LCP | CLS | FCP | TTFB | TBT |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| mobile | / | 91 / 96 / 90 | 100 / 100 / 100 | 100 / 100 / 100 | 100 / 100 / 100 | 3372.65 / 2723.37 / 3121.52 | 0 / 0 / 0 | 1066.73 / 1065.84 / 1156.36 | 8 / 5 / 20 | 86.50 / 51 / 278.50 |
| mobile | /galeri | 98 / 93 / 89 | 100 / 100 / 100 | 100 / 100 / 100 | 100 / 100 / 100 | 2135.59 / 3147.35 / 2414.76 | 0 / 0 / 0 | 923.05 / 915.06 / 977.38 | 8 / 4 / 16 | 94.50 / 73 / 304 |
| mobile | /layanan | 96 / 99 / 95 | 100 / 100 / 100 | 100 / 100 / 100 | 100 / 100 / 100 | 2696.12 / 2122.99 / 2048.30 | 0 / 0 / 0 | 909.79 / 913.14 / 943.08 | 3 / 6 / 8 | 47 / 43.50 / 157.00 |
| mobile | /paket | 99 / 99 / 97 | 100 / 100 / 100 | 100 / 100 / 100 | 100 / 100 / 100 | 2047.53 / 2043.64 / 2077.54 | 0 / 0 / 0 | 909.07 / 910.65 / 957.79 | 5 / 5 / 19 | 43 / 48 / 161.50 |
| mobile | /kontak | 97 / 99 / 99 | 100 / 100 / 100 | 100 / 100 / 100 | 100 / 100 / 100 | 2619.76 / 2047.95 / 1969.75 | 0 / 0 / 0 | 911.38 / 908.52 / 913.17 | 4 / 5 / 6 | 39 / 48.50 / 57.50 |
| desktop | / | 100 / 100 / 100 | 100 / 100 / 100 | 100 / 100 / 100 | 100 / 100 / 100 | 558.74 / 557.69 / 558.92 | 0 / 0 / 0 | 289.07 / 293.60 / 289.46 | 5 / 4 / 8 | 0 / 0 / 0 |
| desktop | /galeri | 100 / 100 / 100 | 100 / 100 / 100 | 100 / 100 / 100 | 100 / 100 / 100 | 627.40 / 621.76 / 623.40 | 0 / 0 / 0 | 255.60 / 257.18 / 250.82 | 4 / 4 / 4 | 0 / 0 / 0 |
| desktop | /layanan | 100 / 100 / 100 | 100 / 100 / 100 | 100 / 100 / 100 | 100 / 100 / 100 | 583.72 / 590.28 / 579.04 | 0 / 0 / 0 | 248.48 / 253.29 / 248.69 | 3 / 3 / 3 | 0 / 0 / 0 |
| desktop | /paket | 100 / 100 / 100 | 100 / 100 / 100 | 100 / 100 / 100 | 100 / 100 / 100 | 577.18 / 573.87 / 558.35 | 0 / 0 / 0 | 249.55 / 254.58 / 247.91 | 2 / 3 / 2 | 0 / 0 / 0 |
| desktop | /kontak | 100 / 100 / 100 | 100 / 100 / 100 | 100 / 100 / 100 | 100 / 100 / 100 | 562.89 / 572.81 / 450.77 | 0 / 0 / 0 | 249.51 / 254.64 / 248.56 | 5 / 3 / 3 | 0 / 0 / 0 |

### Final interpretation and host-speed limitation

**The priority fix is verified:** all six final gallery runs record network priority High and all three LCP discovery checks pass (high priority, initial-document discovery, eager loading). Mobile gallery median simulated LCP improves from intermediate 3147.35 to **2414.76 ms**, below 2500 ms, but remains slower than baseline 2135.59 ms. Its Performance score falls to 89 because median TBT rises to 304 ms. Home mobile remains **3121.52 ms LCP**, Performance 90. These are not all-target passes.

**Cross-phase CPU timing comparability is limited by measured host-speed drift.** Although parent deferred its suite, Lighthouse environment.benchmarkIndex is substantially lower during early final mobile runs: home final **1421.5, 813, 969** versus intermediate **2757.5, 1889, 2226.5**; gallery final **1105, 753.5, 763.5** versus intermediate **2281.5, 2264, 2258.5**. Final gallery main-thread work rises to **2557.84, 2787.97, 2453.66 ms**, versus intermediate **1034.11, 1186.86, 1205.44 ms**, while initial decoded JS changes by only 67 bytes between those builds. This is evidence of different effective host performance, not proof of its cause. No power/thermal/background-process diagnosis was captured. Preserve the raw final scores, but do not attribute the TBT regression solely to the gallery priority/source change. A same-host-speed repeat is needed for strong CPU-score comparisons; no runs were discarded or silently substituted.

### Final initial resource transfer medians

| Device | Route | Total-byte-weight | Resource total bytes | Requests | JS bytes | Image bytes | Media/video bytes |
|---|---|---:|---:|---:|---:|---:|---:|
| mobile | / | 704131 / 458236 / 458286 | 700662 / 454767 / 454817 | 55 / 51 / 51 | 159505 / 160011 / 160026 | 449813 / 203003 / 203003 | 0 / 0 / 0 |
| mobile | /galeri | 2075342 / 1087599 / 1087632 | 2071873 / 1084130 / 1084163 | 60 / 60 / 60 | 159505 / 160011 / 160026 | 1834613 / 842994 / 842994 | 0 / 0 / 0 |
| mobile | /layanan | 279532 / 279879 / 279924 | 276063 / 276410 / 276455 | 40 / 40 / 40 | 159505 / 160011 / 160026 | 36830 / 35700 / 35700 | 0 / 0 / 0 |
| mobile | /paket | 273611 / 273834 / 273883 | 270142 / 270365 / 270414 | 37 / 37 / 37 | 159505 / 160011 / 160026 | 31236 / 30001 / 30001 | 0 / 0 / 0 |
| mobile | /kontak | 861646 / 862435 / 864907 | 858177 / 858966 / 861438 | 70 / 70 / 70 | 613817 / 614321 / 614334 | 114832 / 114222 / 116626 | 0 / 0 / 0 |
| desktop | / | 610738 / 474287 / 474337 | 607269 / 470818 / 470868 | 68 / 66 / 66 | 159505 / 160011 / 160026 | 356420 / 219054 / 219054 | 0 / 0 / 0 |
| desktop | /galeri | 1060124 / 1095270 / 1095303 | 1056655 / 1091801 / 1091834 | 62 / 62 / 62 | 159505 / 160011 / 160026 | 819395 / 850665 / 850665 | 0 / 0 / 0 |
| desktop | /layanan | 271016 / 272878 / 272923 | 267547 / 269409 / 269454 | 39 / 39 / 39 | 159505 / 160011 / 160026 | 28314 / 28699 / 28699 | 0 / 0 / 0 |
| desktop | /paket | 265095 / 266833 / 266882 | 261626 / 263364 / 263413 | 36 / 36 / 36 | 159505 / 160011 / 160026 | 22720 / 23000 / 23000 | 0 / 0 / 0 |
| desktop | /kontak | 876628 / 878497 / 876361 | 873159 / 875028 / 872892 | 71 / 71 / 71 | 613816 / 614321 / 614336 | 129109 / 129526 / 127352 | 0 / 0 / 0 |

### Final gallery priority and LCP evidence

Actual priority is checked from network-requests, not inferred from JSX. Simulated LCP is distinct from observed unthrottled LCP.

- mobile run 1: simulated LCP **3256.51 ms**, observed **471 ms**, first image priority **High**, transfer **61472 bytes**, request start/end **65.95 / 221.41 ms**.

- mobile run 2: simulated LCP **2414.76 ms**, observed **435 ms**, first image priority **High**, transfer **61472 bytes**, request start/end **89.59 / 177.45 ms**.

- mobile run 3: simulated LCP **2176.40 ms**, observed **400 ms**, first image priority **High**, transfer **61472 bytes**, request start/end **48.67 / 127.09 ms**.

- desktop run 1: simulated LCP **622.44 ms**, observed **102 ms**, first image priority **High**, transfer **61472 bytes**, request start/end **10.96 / 24.76 ms**.

- desktop run 2: simulated LCP **625.24 ms**, observed **109 ms**, first image priority **High**, transfer **61472 bytes**, request start/end **10.65 / 23.99 ms**.

- desktop run 3: simulated LCP **623.40 ms**, observed **95 ms**, first image priority **High**, transfer **61472 bytes**, request start/end **13.41 / 24.52 ms**.

The recorded intermediate gallery regression remains above; the final results must be assessed from these new runs, not replaced with an expectation that a priority hint must improve simulation. No speculative source changes were made during measurement. The per-run discovery checklist and observed LCP breakdown are saved in gallery-priority-evidence.json.

### Final decoded JavaScript and emitted chunks

| Device | Route | Final decoded initial JS bytes |
|---|---|---:|
| mobile | / | 517597 |
| mobile | /galeri | 517597 |
| mobile | /layanan | 517597 |
| mobile | /paket | 517597 |
| mobile | /kontak | 2316962 |
| desktop | / | 517597 |
| desktop | /galeri | 517597 |
| desktop | /layanan | 517597 |
| desktop | /paket | 517597 |
| desktop | /kontak | 2316962 |

Final all-emitted client JS: 12 chunks, **644013 decoded bytes**, 199130 local gzip bytes, 172496 local Brotli bytes. Disk chunks are not initial-route payloads or heap measurements.

### Final browser checks and remaining goals

Ten final checks: **0 broken completed images**, **0 failed requests**. Initial viewport only, no full-scroll/video-activation certification. Field INP remains unavailable (CrUX 403, public PSI 429); no field claim is inferred from TBT. Remaining goals: parent functional suite for this final build, deployed-origin verification, credentialed field data/RUM, and further investigation of any remaining mobile LCP above 2500 ms.

Final artifacts: C:/Users/IDEAPAD SLIM 3/AppData/Local/Temp/opencode/sagara-ultimate-final. Includes all 30 reports, exact summary.json, lcp-evidence.json, gallery-priority-evidence.json, browser-evidence.json, built-chunks.json, source-evidence.json, provenance.json. The copied runner's server-home-before.html filename contains the final-phase HTML within this directory.

## Incremental performance follow-up — 2026-10-23

This section is a separate measurement, not a replacement for the Lighthouse phases above.

### Changes, smallest to largest

1. `81a509d`: video-poster and footer-map `sizes` now follow their actual mobile, tablet and desktop slots, including borders. Regression coverage compares declared sizes with rendered widths.
2. `a7b4e88`: reveal bookkeeping retains only pending targets. Completed/initially visible targets are released; addition-only DOM mutations skip detached-target sweeps. Existing stagger, first-viewport visibility, reduced-motion behavior and cleanup remain intact.
3. `42a723a`: server-only Footer and DecorativeRibbon modules no longer import the home FAQ/carousel through the root layout. Contact-page initial HTML no longer lists the carousel implementation chunk. This changes chunk boundaries, not necessarily all resources fetched during prefetch.
4. `252fb28`: the contact page renders the existing local map preview; Google Maps is mounted only after explicit keyboard or pointer activation. The directions link still works without JavaScript. Preview/player height stays 220px, and the iframe retains `no-referrer`. Privacy wording and existing tests now reflect activation.

### Observed production network comparison

Baseline: `a352d29`. After: `252fb28`, build `T25-7tr8byb-YoqzauJLB`. Both measured using `next build` / `next start`, Chromium through Playwright, a fresh browser context per route, 390×844 CSS pixels, DPR 2, no scroll/interaction, and a 1.2-second observation window after navigation. Browser cache is fresh; server/image-optimizer caches are retained. One run per route per phase; no throttling, timing medians, Lighthouse scores, field INP or Core Web Vitals claims. Automatic route prefetch remains enabled.

CDP `Network.loadingFinished.encodedDataLength` is summed for Script resources, including iframe scripts. This is transferred data, not decoded source or heap memory. Resource counts include prefetch and can vary with scheduling or third-party responses.

| Route | Script transfer before / after, bytes | Third-party requests before / after |
|---|---:|---:|
| `/` | 170635 / 174821 | 0 / 0 |
| `/galeri` | 163930 / 168116 | 0 / 0 |
| `/kontak` | 622081 / 168116 | 59 / 0 |
| `/pendaftaran` | 170635 / 174821 | 1 / 1 |

Contact-page observed script transfer falls **453965 bytes (73.0%)**. Total observed requests fall **102 to 43**. Map code is deferred, not removed: activation still downloads Google resources. The other routes gain **4186 transferred script bytes** in this window as chunking/prefetch changes; do not describe this work as a universal initial-JavaScript reduction. Main-frame decoded script totals increase by 14278 bytes in this observation window. They exclude cross-origin iframe bodies and must not be compared directly with the contact-page transferred-script total.

Image sizing is verified against layout at representative widths; this initial-view mobile sample does not establish substantial image-byte savings. No images or videos were recompressed or removed.

Local evidence, without screenshots or patient-form payloads: `C:/Users/IDEAPAD SLIM 3/AppData/Local/Temp/opencode/sagara-perf-before.json`, `sagara-perf-after.json`, and runner `sagara-perf-measure.cjs`.

### Verification and remaining work

Lint, typecheck and production build pass. The targeted production suite passes 47 tests, including map activation/no-JavaScript fallback, iframe referrer policy, privacy handoff, footer, hero, FAQ, reveal retention, navigation and security headers. The subsequent complete production suite passes **305/305 tests in 5.4 minutes**, without retries. `npm audit --omit=dev --audit-level=low` reports **0 vulnerabilities**.

Earlier development-mode runs were not release evidence: privacy date entry failed there while passing in production; a concurrent refactor also invalidated one live-development test run. Production was rebuilt and the targeted suite rerun after edits completed.

At the end of that phase, remaining candidates were the registration query boundary, floating-widget mutation filtering, form render profiling and route-prefetch measurement. The next section covers the first two; the latter two still require profiling before changing behavior.

## Registration and observer follow-up — 2026-10-23

### Changes, smallest to largest

1. `cf60c4e`: reuse two module-scoped `Intl.DateTimeFormat` instances rather than constructing formatters on every validation/display call. `new Date()` remains evaluated per `jakartaToday()` call; the date itself is not cached. Tests cover repeated formatting, the WIB year boundary and leap-day display.
2. `600f4e4`: the consultation observer filters mutation records before scanning the document for open overlays. Unrelated child/attribute mutations skip that global scan. Inserted/removed overlay ancestors and dialog/menu state attributes still refresh visibility. A browser regression counts zero overlay document scans for its unrelated-mutation batch and checks insertion/removal; existing menu/dialog tests pass.
3. `dbb63ed`: a persistent registration shell owns the heading and step navigation. Only the query-dependent fields sit below `Suspense`. Lazy query initialization, aliases, entered data, separate consultation/sharing consents and WhatsApp handoff remain unchanged. Query history navigation does not reset the form. No server `searchParams`, dynamic-rendering opt-in or query-keyed remount was introduced.

### Production evidence and scope

Build `Ri5Ri3Lh1Jw--iKMRB0X5` includes `/pendaftaran` in `prerender-manifest.json`. Its generated HTML contains exactly one `<main>` and the real initial `<h1>` (`Atur waktu<br/>untuk langkah berani.`), not the old loading heading. The shell is a prerendered Client Component; the interactive fields still require JavaScript. The fallback retains the privacy link and JavaScript instruction without adding another main landmark or heading.

Lint, typecheck and production build pass. The targeted registration/privacy/SEO production suite passes **33/33 tests**. Coverage includes no-JavaScript headings, invalid/empty/alias preselection, client history changes preserving inputs and consent, responsive Axe checks, heading focus on review/edit/return, and privacy request/storage safeguards. Five targeted widget tests also pass in development. The first full production run finished **309 passed / 1 failed**: the new overlay scan counter could start before the hydration effect's initial scan. `3e003b2` waits for the post-load bubble state before instrumentation; five repeated production runs of that test pass. This changes test synchronization, not widget behavior. The subsequent full production run, including search-trust changes, passes **312/312 tests in 9.2 minutes** without retries. Production dependency audit reports **0 vulnerabilities**.

A separate read-only review found no concrete correctness regression. Additional coverage opportunities remain for same-path Next.js Link/router query navigation, simultaneous overlays, browser-clock rollover at WIB midnight and complete personal-data reset on reload. Existing no-JavaScript privacy coverage already asserts the registration privacy link.

These are structural and regression results, not new Lighthouse scores, measured render-time savings, initial-JavaScript reductions or field Core Web Vitals improvements. Form render memoization, footer navigation changes and prefetch policy changes remain deferred pending profiling.

## Scroll-reveal follow-up — 2026-10-23

The old observer started a zero-opacity animation only after a visible element crossed 24px into the viewport. Global group indices also added up to 225ms delay, including cards unrelated to the current row. This can create a visible flash/re-hide and a delayed entrance; a static screenshot cannot establish actual dropped frames.

- `3723b01`: offscreen-below candidates get a paused first frame before entry, then play at a 32px positive bottom margin. First-viewport/above-viewport content stays painted. Deep scroll jumps cancel the reveal and expose the underlying content immediately. No scroll event loop, blur, permanent `will-change`, dependency, media or layout change is introduced. New filter nodes register from added subtrees; removed/routed-out targets release their observer and animation references. Keyboard focus releases a containing animation.
- `cbb7ded`: reveal travel drops from 24px to 12px and duration from 700ms to 500ms. Delay is zero rather than an index-based cascade. Navigation/FAQ timings are unchanged.
- `98209c3`: unsupported media-query event listeners fail open before any opacity change. Regression coverage adds true instant scroll jumps, reinserted filter cards, desktop same-row zero delays, reduced-motion cancellation, missing/throwing APIs, keyboard focus and restored client navigation.

Lint, typecheck and production build pass on the implementation. The expanded reveal/retention/gallery suite passes **23/23 tests**, including running-reveal cancellation, true instant jumps in both directions without reduced motion, detached-animation cancellation and route cleanup. `efbeef4` also masks images/videos in existing home/gallery audit captures so subsequent test screenshots do not retain patient media, and waits for image completion instead of asserting synchronously after visibility. A static review of `efbeef4` finds no concrete blockers. The first full reveal-phase run ends **321 passed / 1 failed**: the existing home-artwork test checked image completion synchronously after element visibility. The image-loading synchronization fix in `efbeef4` replaces that assertion with polling; no production image-loading behavior was changed. The subsequent full production run on the corrected source passes **323/323 tests in 8.5 minutes**, without failures. This result predates the dependency-only changes merged in `07692d3`; those changes require separate verification.

### Local frame sample

Runner: `C:/Users/IDEAPAD SLIM 3/AppData/Local/Temp/opencode/sagara-reveal-measure.cjs`; numeric evidence: `sagara-reveal-before.json` / `sagara-reveal-after.json` in the same directory. Fresh Chromium contexts, production server, 900px viewport height, widths 390/768/1440, 2.5s settle then 6s scripted scroll at 1.4 CSS px/ms. Browser animation-frame intervals, not compositor frame tracing; one sample per condition, unthrottled local hardware, server image cache retained. No screenshots, video, page payloads or patient-form data retained.

| Width | Normal-motion p95 interval before / after | Intervals >34ms before / after |
|---|---:|---:|
| 390 | 16.8 / 16.7 ms | 0 / 0 |
| 768 | 16.8 / 16.7 ms | 0 / 0 |
| 1440 | 33.3 / 16.8 ms | 3 / 1 |

No long tasks were recorded in either phase, and 31 main images were loaded at the end of each sample. Desktop reduced-motion control still varied (2 / 7 intervals >34ms), so the table is not proof of a repeatable FPS gain or image-decoding optimization. The direct improvement is eliminating late opacity resets, index delays and excessive travel. Real-device review remains necessary; no universal smoothness, Lighthouse or field Web Vitals claim is inferred. Repeat mobile/desktop Lighthouse on the deployed build and collect consent-appropriate real-user Web Vitals before claiming field improvements.

### Toolchain synchronization — 2026-10-23

Local `main` was fast-forwarded to `07692d3`, retaining the remote ESLint merge history. ESLint 10 runs with Next.js 16.4.2, whose bundled documentation explicitly acknowledges incomplete plugin peer declarations. However, `npm ls --all` reports `ELSPROBLEMS` because the bundled import, React and accessibility plugins exclude ESLint 10. ESLint is temporarily pinned back to **9.39.5**, with TypeScript retained at **5.9.3**. ESLint 9 is upstream end-of-life; this is a compatibility bridge, not a claim of ongoing upstream support. No peer override, forced install, lint suppression or runtime dependency change is introduced.

PR #1's TypeScript 7.0.2 update fails in CI at lint: the locked `typescript-eslint` requires the JavaScript compiler API, which TypeScript 7.0 does not provide. Dependabot holds ESLint >=10 and TypeScript >=7 until toolchain compatibility is reassessed, **no later than 2026-11-23**. Recheck the bundled plugin peer ranges, Next.js guidance and typescript-eslint compiler API support before lifting either hold. Minor/patch updates and other dependency proposals remain enabled.

CI now installs with `--strict-peer-deps` and validates `npm ls --all` before lint. Local strict installation, dependency graph validation, lint, route type generation, typecheck and production build pass. The full dependency audit reports **0 vulnerabilities**.

The first full run after the dependency repair finishes **322 passed / 1 failed**: the visual audit can inspect images before the delayed consultation widget mounts, then capture its still-loading mascot. The audit now explicitly waits for the consultation region before polling image completion. It retains the existing broken-image, network-error and layout assertions; no application image-loading behavior changes. The previously failing gallery audit passes **5/5 repeated production runs**. A full-suite rerun on the corrected tests is pending.

## Pure performance implementation — 2026-10-25

### Scope and reproducibility

Source baseline: `5b7f15f990c6cb5902939aff028171fa3d73e3e2`, clean working tree before this phase. Baseline production build: `HQvDzXtre7kRxtbSotKz-`. Installed Next.js **16.4.2** Server/Client Components, Image and Link documentation was read before editing. No dependency, CSS, original media, encoding, package ID, price, consent, navigation policy or animation change is retained. No commit or push is part of this phase.

Audit artifacts are local-only under `C:/Users/IDEAPAD SLIM 3/AppData/Local/Temp/opencode/sagara-opt-20261025/`. Production uses `http://localhost:3100`, not the user's development server on port 3000. Standalone harnesses require the existing Playwright installation; no package is added.

Main sampling uses Chromium **156.0.8078.4**, Playwright **1.64.1**, Node **24.16.0**, Windows x64, viewport height **900px**, CPU throttle **4×**, network latency **150ms**, download **200,000 B/s**, upload **93,750 B/s**. Each build has **80 observations**: four routes (`/`, `/galeri`, `/kontak`, `/pendaftaran`) × widths **390/1440** × five repetitions × first/repeat visits. The observation window ends 1,800ms after `load`. A first visit has a fresh browser context; a repeat reloads the same context after a safe carousel/filter/package interaction. Server/image-optimizer cache is retained; this is not a cold-origin benchmark. Measurements run separately from regression suites.

Report Resource Timing compressed entity bytes separately from `transferSize` (which includes header accounting). Cached `encodedBodySize` is not network traffic. Initial navigation HTML already contains embedded Flight data: count that HTML once, then add only separate RSC requests. Route HTML-listed JavaScript is reported separately from chunks fetched by navigation prefetch. CDP transfer is an independent cross-check, never added to Resource Timing totals. Five-run medians and min–max ranges are used, not a best run.

Local LCP, session-window CLS, long tasks and click/Event Timing samples are diagnostics, not Lighthouse scores, INP, field Core Web Vitals or a universal CPU improvement. Contact-map activation is omitted from performance sampling to avoid unrelated third-party traffic; regression tests cover its function. Registration's pre-existing client-form boundary contributes substantial sampled CLS (approximately 0.638 mobile / 0.307 desktop); this is present in both builds and not fixed by changing media imports.

### Implementation and rejected alternatives

- Split `media/types.ts`, `media/gallery.ts`, `media/hero.ts`; `media.ts` remains a compatibility facade. Full media/hero metadata, 29 catalog items, 20 caption pairs, IDs and ordering retain integrity SHA-256 `a1c2a8f48a96202043efaa6c221f63429b63bc66720918788e0a9ef8d2bf7088`.
- Gallery imports its collection directly; hero captions do not enter its route entry chunk. `AboutSection` passes only video `src`/`poster` to `AboutVideo`; player and scroll-lock behavior are unchanged.
- **Rejected server-prop hero candidate** (`o3U-AnwP8bsSfCeh9O2np`): home route-specific entry chunk gzip fell 6,349 → 3,876 B, but HTML rose 20,369 → 21,930 B and sampled RSC rose 29,311 → 30,737 B. With prefetch included, home JS + HTML + RSC fell only **428 B**, while repeat network transfer rose **1,426 B** (34,111 → 35,537 B). Other routes also fetched the larger home RSC through prefetch. Smaller JavaScript alone did not justify the cache regression.
- **Measured fallback:** `media/hero-slides.ts` contains only static `src`, `alt`, `heading`, `description` fields, imported by `HeroCarousel`. Captions have one source; `media/hero.ts` reconstructs the full compatibility objects from that narrow module and the gallery. No full catalog is imported by the carousel. This deliberately departs from passing hero data as server props because the approved acceptance condition requires avoiding payload displacement.
- Dialog image `sizes` changes from `90vw` to `(min-width: 979px) 880px, calc(94vw - 40px)`. Actual border-box dialog widths at 390/768/1440/1920 are 352/721.906/920/920px, with 40px horizontal padding. Chromium's default dialog max-width clamps the smallest viewport; the declaration safely overestimates its 312px inner slot by about 15px. CSS, height, contain behavior, quality and source files are unchanged.

### Conditional experiments not retained

**Gallery prefetch:** five slow-network trials per width on the server-prop candidate. Disabling prefetch only for `/galeri` removed its initial requests and reduced sampled JS + RSC by approximately **7,002 B**, but navigation's click-to-two-animation-frames proxy worsened. Mobile default/disabled medians: **672.6 / 1,058.0ms** (ranges 387.3–1,352.9 / 959.5–1,237.1). Desktop: **471.4 / 1,158.5ms** (420.0–660.8 / 946.2–1,279.4). The original policy was restored exactly in `Navigation.tsx`; registration CTA prefetch was never disabled. These are navigation proxies, not INP.

**Mobile first-carousel preload:** response-rewrite control versus desktop-only preload, five repetitions at heights 680/1100 and width 390. Both variants use interception, so browser HTTP caching is disabled equally and results are separate from primary measurements. Median LCP original/desktop-only: **1,264/1,268ms** at height 680; **1,304/1,236ms** at height 1100. All first images were complete before scrolling; median image response-end was 906/896ms and 904/915ms respectively. No consistent benefit supports changing preload. Original mobile/desktop priority and initial/neighbor mounting remain intact; no orientation-specific candidate is shipped.

**CPU:** separate production profiles cover reveal, carousel, gallery filtering and synthetic registration input. Identifiable samples include Turbopack and React/Next.js; shared minified chunks cannot reliably attribute every frame to a component. Five instrumented runs at 4× CPU measured initial aggregate `getBoundingClientRect` medians of **0.6ms home**, **62.2ms gallery**, **55.1ms registration**; home animation creation median **10.6ms**. A forced layout call can absorb prior style/layout work; this does not prove that a particular callback owns all cost. Gallery layout and registration observer/form setup merit a separate attributed investigation. No speculative `memo`, cached carousel width, reveal delay or form rewrite is applied. Instrumentation overhead and single-profile variability preclude a CPU improvement claim.

### Final validation

Final measured build: `P_VEjsbxvyGhJ0KmqWERs`. Baseline, rejected server-prop candidate and final each completed 80 main observations. Final retains default prefetch/preload. Route-specific chunk gzip: home **6,349 → 5,280 B** (raw 23,737 → 16,265 B), gallery **5,441 → 4,499 B** (raw 21,469 → 19,094 B). Home HTML gzip is **20,369 → 20,404 B**. All HTML-listed scripts plus HTML, excluding the unchanged `nomodule` legacy script, total **175,028 → 173,994 B** on home and **167,957 → 167,018 B** on gallery. These artifact sizes are not HTTP visit totals.

Observed initial JS drops **2,011 B** on all four routes when prefetch is included. The unchanged contact/registration entry scripts benefit only from fetching smaller home/gallery chunks; do not attribute this to their own components. Initial image bytes and request-count medians are unchanged. JS + HTML + separately requested RSC falls **1,915 B home**, **1,951–1,955 B gallery**, **1,954–1,958 B contact**, **1,956 B registration**.

| Route | First network bytes, 390px before / final | First network bytes, 1440px before / final | Repeat network bytes, 390px before / final | Repeat network bytes, 1440px before / final |
|---|---:|---:|---:|---:|
| `/` | 379,232 / 377,317 | 440,176 / 438,261 | 34,111 / 34,172 | 34,111 / 34,172 |
| `/galeri` | 333,261 / 331,306 | 411,574 / 409,623 | 26,251 / 26,304 | 31,292 / 31,349 |
| `/kontak` | 284,303 / 282,345 | 303,534 / 301,580 | 26,251 / 26,304 | 31,292 / 31,349 |
| `/pendaftaran` | 289,566 / 287,610 | 285,996 / 284,040 | 26,251 / 26,304 | 26,251 / 26,304 |

The final narrow static module restores cacheable hero data. Repeat visits still transfer **53–61 B more RSC** (approximately 0.18–0.20%), including the small video props/Flight and build-reference changes. This is a disclosed trade-off, not a repeat-transfer saving. One first plus one repeat visit remains **1,854–1,905 B smaller**; no traffic-weighted universal saving is claimed. Substantial repeat-only gains are not established.

| Route/width | First LCP ms: baseline median [min–max] | Final median [min–max] | Repeat LCP ms: baseline / final median |
|---|---:|---:|---:|
| `/` 390 | 1,548 [1,416–1,812] | 1,252 [1,112–1,368] | 344 / 328 |
| `/` 1440 | 1,848 [1,772–1,884] | 1,748 [1,728–1,780] | 468 / 392 |
| `/galeri` 390 | 1,204 [1,080–1,412] | 1,108 [1,076–1,128] | 324 / 324 |
| `/galeri` 1440 | 1,760 [1,720–1,768] | 1,752 [1,696–1,772] | 432 / 336 |
| `/kontak` 390 | 1,216 [1,044–1,304] | 1,100 [1,004–1,256] | 456 / 328 |
| `/kontak` 1440 | 1,628 [1,276–1,764] | 1,072 [1,016–1,108] | 508 / 372 |
| `/pendaftaran` 390 | 1,580 [1,560–1,832] | 1,508 [1,416–1,560] | 488 / 320 |
| `/pendaftaran` 1440 | 1,116 [1,004–1,232] | 932 [904–1,052] | 424 / 296 |

LCP reductions on unchanged routes show why the complete timing improvement cannot be assigned to this approximately 2 KB reduction: sequential local samples remain sensitive to hardware/runtime conditions. Session-window CLS is effectively unchanged: first home approximately 0.000089/0.000108 (mobile/desktop), gallery 0.000427/0.000082, contact 0.000099/0.000108; registration approximately 0.638/0.307 remains high. Desktop repeat home CLS varies with restored scroll/reveal timing (0.0299 → 0.0121); this is not claimed as a layout fix.

Observed initial long-task total medians before/final (mobile, desktop): home **518/303, 470/248ms**; gallery **424/351, 453/342ms**; contact **370/336, 606/279ms**; registration **736/505, 680/423ms**. CPU source is unchanged and ranges vary; these totals do not establish a CPU refactor benefit. All measured safe interactions confirmed their expected state. First-visit Event Timing median before/final: carousel **56/32ms mobile, 48/40ms desktop**; gallery filter **112/88ms, 120/112ms**; package choice **120/72ms, 136/88ms**. Click-to-two-rAF proxies also show no final median regression. These are sampled local interactions, not INP.

Settled visual comparison and complete production regression results follow after validation.
