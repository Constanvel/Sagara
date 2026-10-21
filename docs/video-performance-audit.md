# Video performance audit

Audited 2026-10-21, approximately 10:46–10:51 UTC. Read-only inspection of media, application source, localhost:3002, and https://sagara-vert.vercel.app. Only this report was created; no source/media changes, no `media.ts` changes, no commit. Existing working-tree edits were left intact.

## Scope and method

- All five `public/videos/*.mp4` files and all five originals in `D:\Sunatan\Sagara-foto\Video_Sagara` were inspected with FFprobe 9.0.1: format duration/size/bitrate/tags, stream codecs/dimensions/frame rate, and trace-level MP4 atom ordering.
- HTTP `HEAD` and actual `GET` with `Range: bytes=0-1023` were requested for every public video on both hosts. Range bodies were discarded; no full production video downloads were needed.
- Headless Playwright Chromium, fresh browser context per URL, observed media/MP4 requests through `networkidle` on `/` and `/galeri` on both hosts. Gallery Video filter was also selected, followed by a one-second observation.
- Source review covered gallery/about video mounting and cleanup, navigation listeners/timer, hero resize observer, and motion observers/animations. This is not a heap-profile or sustained playback test.

## File mapping and savings

Sizes below are exact bytes. MB means decimal MB. Original-to-public pairing is inferred from unique, effectively identical durations and compatible stream dimensions; no original-to-output manifest or visual identity comparison was performed.

| Public filename (under `/videos/`) | Matching original filename | Original bytes | Public bytes | Reduction | Duration (s, public) |
| --- | --- | ---: | ---: | ---: | ---: |
| `sagara-cerita-layanan.mp4` | `lv_7568543818006678789_20261020211417.mp4` | 194,367,530 | 21,776,590 | 88.8% | 122.903 |
| `sagara-kunjungan-rumah-ruang-hijau.mp4` | `VID-20261020-WA0064.mp4` | 8,117,777 | 3,776,096 | 53.5% | 38.235 |
| `sagara-suasana-ruang-kuning.mp4` | `VID-20261020-WA0069.mp4` | 8,788,366 | 3,086,580 | 64.9% | 41.232 |
| `sagara-pendampingan-keluarga-ruang-kuning.mp4` | `VID-20261020-WA0073.mp4` | 12,595,794 | 5,401,406 | 57.1% | 59.443 |
| `sagara-suasana-dan-sertifikat.mp4` | `VID-20261020-WA0076.mp4` | 11,603,788 | 5,462,855 | 52.9% | 51.383 |

Combined originals: **235,473,255 bytes**. Combined public outputs: **39,503,527 bytes**, approximately **83.2% smaller**. This total is the media library footprint, not initial page transfer.

## Codecs, dimensions, and faststart

All ten files contain H.264 High-profile video, `yuv420p`, and AAC-LC stereo audio at 44,100 Hz. No HEVC/AV1-only compatibility dependency was found.

| Public filename suffix | Dimensions | FFprobe `r_frame_rate` | Container bitrate (kb/s) | Audio bitrate (kb/s) | `moov` size (bytes) | Faststart |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| `cerita-layanan` | 720 × 1280 | 30 | 1,417.5 | 96.7 | 133,811 | Yes |
| `kunjungan-rumah-ruang-hijau` | 478 × 850 | 25 | 790.1 | 64.7 | 42,385 | Yes |
| `suasana-ruang-kuning` | 478 × 850 | 25 | 598.9 | 64.7 | 46,621 | Yes |
| `pendampingan-keluarga-ruang-kuning` | 478 × 850 | 25 | 726.9 | 64.8 | 66,901 | Yes |
| `suasana-dan-sertifikat` | 478 × 850 | 25 | 850.5 | 64.8 | 57,645 | Yes |

For every public output, FFprobe trace shows `ftyp`, then `moov`, then `mdat` (with a small intervening free atom possible). `moov` begins at byte 32. This is the useful faststart evidence: playback metadata precedes the media payload. A tag named “faststart” is not required. A 1,024-byte test range does not contain the complete `moov`; it tests range handling, not playback readiness.

Public files advertise `major_brand=isom`, `compatible_brands=isomiso2avc1mp41`, and `encoder=Lavf63.1.101`.

| Original | Dimensions | `r_frame_rate` | Container bitrate (kb/s) | Audio bitrate (kb/s) | Atom ordering |
| --- | --- | ---: | ---: | ---: | --- |
| `lv_7568543818006678789_20261020211417.mp4` | 1080 × 1920 | 30 | 12,651.8 | 130.8 | `mdat` before `moov`: not faststart |
| `VID-20261020-WA0064.mp4` | 478 × 850 | 30 | 1,698.5 | 62.7 | `moov` before `mdat` |
| `VID-20261020-WA0069.mp4` | 478 × 850 | 30 | 1,705.2 | 65.2 | `moov` before `mdat` |
| `VID-20261020-WA0073.mp4` | 478 × 850 | 60000/1001 | 1,695.2 | 64.6 | `moov` before `mdat` |
| `VID-20261020-WA0076.mp4` | 478 × 850 | 25 | 1,806.6 | 180.5 | `moov` before `mdat` |

The large original uses `isom` / `isomiso2avc1mp41` and encoder `bytevehwavc`; the other originals use `mp42` / `mp42isom`. Frame rates above are the reported nominal `r_frame_rate`, not proof of constant-frame-rate encoding. Matching durations do not establish visual quality; no quality score or listening test was performed.

## HTTP range and caching evidence

Every file on **both** hosts returned:

- `HEAD`: **200**, `Content-Type: video/mp4`, `Accept-Ranges: bytes`, and full `Content-Length` equal to the local public file size in the mapping table.
- Range GET: **206 Partial Content**, `Content-Length: 1024`, `Content-Range: bytes 0-1023/<exact public size>`.
- `ETag` and `Last-Modified` validators.

| File suffix | Local HEAD / range | Production HEAD / range | Production cache HEAD → range | Production ETag |
| --- | --- | --- | --- | --- |
| `cerita-layanan` | 200 / 206 | 200 / 206 | HIT → HIT | `740af7fd5a8ef91e85b5e1119426ce31` |
| `kunjungan-rumah-ruang-hijau` | 200 / 206 | 200 / 206 | MISS → HIT | `f846520005ac26adb41298b02294e1fa` |
| `suasana-ruang-kuning` | 200 / 206 | 200 / 206 | MISS → HIT | `34e269dc47810ecfa37f4da4a441db15` |
| `pendampingan-keluarga-ruang-kuning` | 200 / 206 | 200 / 206 | MISS → HIT | `386032d4e09a8a1baac39ced5d8889a5` |
| `suasana-dan-sertifikat` | 200 / 206 | 200 / 206 | MISS → HIT | `731fcef8499074984580ad0b8abcf63d` |

Local caching header: `Cache-Control: public, max-age=0`; weak ETags. Production caching header: `Cache-Control: public, max-age=0, must-revalidate`; strong quoted ETags, `Server: Vercel`, `Access-Control-Allow-Origin: *`, and inline content disposition. Production cache evidence came from `X-Vercel-Cache` and `Age`: service clip HEAD/range ages 722/730 seconds; other clips HEAD age 0, range age 7–8 seconds. Observed serving region identifier: `sin1`.

**Interpretation:** byte ranges work on the deployed static assets, and Vercel edge caching is demonstrably active despite a browser freshness lifetime of zero. Browser revalidation and edge caching are different concerns. These measurements do not establish long-term edge retention, every region's cache state, browser conditional-request behavior, or full-file byte identity with local files.

`next.config.ts:8–10` configures custom caching only for `/images/:path*`; no custom video caching rule is present. The videos use descriptive, non-content-hashed URLs. Do not blindly apply year-long `immutable` browser caching to URLs that may be replaced in place. If repeat-view revalidation becomes a measured problem, decide a versioned URL/content-hash strategy before changing browser freshness. No extra CDN, proxy route, service worker, or streaming infrastructure is justified by these results alone.

## Initial loading and interaction

### Source evidence

- `src/components/sections/GallerySection.tsx:28–34,67–77,84–88`: initial selection is `null`. Grid cards render thumbnail `Image` elements, not players. `GalleryVideo` mounts only inside the selected-media conditional. Switching to the Video filter resets selection and still renders thumbnails only.
- `GallerySection.tsx:12–24`: the selected player uses `controls`, `playsInline`, `preload="none"`, a poster, and a typed `video/mp4` source. No autoplay. Loading/error messages and direct-file fallback exist.
- `src/components/sections/AboutVideo.tsx:9,35–42`: initial `open=false`; its player/source mount only when opened. It also uses `preload="none"`, poster, controls, inline playback, and no autoplay.
- Gallery first-thumbnail `preload` is an **image** hint, not an MP4 preload. Thumbnail/image and JavaScript transfers still occur; “zero initial video” does not mean zero media-related page cost.

### Browser observations

| Host | Route/state | DOM `<video>` count | DOM MP4 `<source>` count | Observed MP4/media requests |
| --- | --- | ---: | ---: | ---: |
| localhost:3002 | `/`, initial | 0 | 0 | 0 |
| localhost:3002 | `/galeri`, initial | 0 | 0 | 0 |
| localhost:3002 | `/galeri`, Video filter | 0 | Not separately counted | 0 |
| sagara-vert.vercel.app | `/`, initial | 0 | 0 | 0 |
| sagara-vert.vercel.app | `/galeri`, initial | 0 | 0 | 0 |
| sagara-vert.vercel.app | `/galeri`, Video filter | 0 | Not separately counted | 0 |

Thus all five MP4 files contribute **zero observed initial video requests/bytes** in the tested Chromium runs. Their URLs can still be represented in application data; this is not a claim that their filename strings never occur in HTML/JavaScript. `preload="none"` is a browser hint once a player mounts; absence of the player/source before selection is the stronger initial-loading guarantee. No playback-throughput, mobile Safari, slow-network, seek, or visual-quality result is claimed.

## Memory, listeners, and lifecycle

Listener cleanup is present in the inspected source; no listener growth was observed. This is a listener-lifecycle finding, not evidence that the application has no memory leaks. A separate browser test confirmed that the `MotionEnhancer` IntersectionObserver retained **19 disconnected gallery cards after filtering**. The parent session fixed that retention issue and added regression tests; that browser finding and fix were reported separately, not independently verified by this audit.

- `GallerySection.tsx:38–49`: modal effect closes the dialog, restores body overflow, and restores trigger focus on cleanup. Closing/clearing selection unmounts the selected player; its keyed identity also replaces the player when switching videos. Only one selected player is rendered, not five persistent hidden players. There are no manually registered player listeners or recurring timers in this component.
- `AboutVideo.tsx:15–29`: cleanup explicitly pauses the captured player, closes the modal, restores overflow, and restores focus. Conditional rendering removes the player on close.
- `Navigation.tsx:33–38,49–73`: global popstate/hashchange listeners are removed. The menu keydown and media-query change listeners are removed; the focus timeout is cleared; body overflow is restored. Bottom-navigation animation is cancelled in effect cleanup (`100–110`).
- `HeroCarousel.tsx:19–30`: `ResizeObserver` disconnects on cleanup. Pointer/scroll handlers are React element handlers, not repeatedly registered global listeners. No carousel interval was found.
- `MotionEnhancer.tsx:10–66` (source snapshot originally inspected): intersecting targets are unobserved; the observer disconnects on effect cleanup; media-query listener is removed; active animations are cancelled and the set cleared. Finished/cancelled animations release themselves from the set. Those cleanup paths did not establish that disconnected cards were released while the same route effect remained active. The separate browser test confirmed 19 disconnected cards retained by the IntersectionObserver after filtering; the parent session subsequently fixed this and added regression tests.

**Verification scope:** this audit did not perform heap profiling or independently rerun the parent's retention regression tests. Listener cleanup/no observed listener growth must not be generalized to all retained memory. Further lifecycle checks can use repeated open/play/close, filtering, and route-navigation cycles with heap snapshots, detached-node inspection, and listener counts after garbage collection. Browser decoder/network buffers can outlive DOM changes briefly; source inspection cannot quantify them. The confirmed observer retention warranted its targeted fix; it does not by itself justify unrelated blanket `load()`/source-reset logic, listener abstractions, or a new media manager.

## Constraints and conclusion

- Largest on-demand file remains 21.78 MB / 122.9 s, approximately 1.42 Mb/s average container bitrate. Slower connections can still buffer. Average bitrate is not peak bitrate or measured startup time.
- Four smaller files are already 478 × 850; indiscriminate downscaling/recompression risks quality without addressing initial loading, which is already deferred.
- All outputs are faststart MP4 with range delivery; no faststart repair or custom range implementation is needed.
- Current browser cache freshness is conservative, but edge cache hits were observed. Any caching change needs explicit asset-versioning/invalidation decisions.
- No additional video-delivery implementation change is warranted by these media/loading measurements alone. The separately confirmed `MotionEnhancer` disconnected-card retention issue was fixed by the parent session with regression tests. Preserve click-to-mount behavior; use playback/quality and repeat-visit measurements before considering further encoding, adaptive streaming, or cache-policy work.
