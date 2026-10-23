# Media publication decision and release checklist

Date: 2026-10-23.

## Current decision: original images, no redaction

The owner cancelled image redaction and requested that the original content remain visible. All 21 previously modified image paths were restored from baseline commit `62b3f0a`; each original checksum was verified before restoration. This includes 16 gallery photographs, two posters, one source hero PNG, and two compatibility aliases. No masking, blur, CSS cover, or replacement document is applied.

Patient document identifiers may therefore be readable in original images and their optimized versions. Do not describe the current media as anonymized, redacted, or free of personal identifiers. The owner subsequently authorized commit and push of the current work using the existing GitHub account; a push may trigger hosting auto-deployment. Historical removal is not part of this change.

The owner previously attested guardian permission for all current photo/video publication, faces, and healthcare context. That is an owner statement, not independent verification of private consent records. Keep evidence outside this repository; verify its exact scope, including documents/audio, and withhold an item if permission is unclear or withdrawn.

## Preserved behavior and safeguards

- Gallery remains 24 photos and five videos; hero retains its 20 photographs, order, and caption pairs.
- Source image URLs have no redaction revision query. Next Image permits `/images/**` without query parameters; arbitrary revision queries are rejected.
- Compatibility aliases retain byte-identical responses.
- Registration and complete WhatsApp messages are unchanged.
- Security headers, six-route SEO metadata/sitemap, CI, dependency audit, and weekly Dependabot configuration are retained.
- Fully redacted secret-scanner output remains enabled. Secret-output redaction is separate from the cancelled image masking.
- No automatic screenshot/trace/video capture uploads; explicit test captures remain ignored and are removed on CI runners.

## Inventory and outstanding media review

Public inventory: 153 images (57 raster, 96 SVG), five MP4 files, and one favicon. Image inventory previously reviewed all raster files and SVG embedded/external content. That review does not mean the restored original documents are private.

These unchanged video/audio sources still require detailed human review:

- `/videos/sagara-cerita-layanan.mp4`
- `/videos/sagara-kunjungan-rumah-ruang-hijau.mp4`
- `/videos/sagara-pendampingan-keluarga-ruang-kuning.mp4`
- `/videos/sagara-suasana-dan-sertifikat.mp4`
- `/videos/sagara-suasana-ruang-kuning.mp4`

Temporary processing/evidence remains outside Git at `C:\Users\IDEAPAD SLIM 3\AppData\Local\Temp\opencode\sagara-privacy-20261023`. Treat it as sensitive, restrict access, and decide private retention/removal separately. Do not upload it as artifacts.

## Validation status

- Previous masked-image build passed 285 production tests; that result is historical, not validation of this rollback.
- Original-file recovery: 21/21 baseline checksums verified.
- Lint, TypeScript, and clean production build: passed after restoration.
- Local preview at `http://127.0.0.1:3001`: homepage/gallery returned HTTP 200 at 390px and 1440px with no stale revision URLs or horizontal overflow. All public image files match baseline `62b3f0a` exactly.
- Original-image restoration passed all 282 production Playwright tests in 10.4 minutes.
- Subsequent branded-search SEO changes passed lint, TypeScript, production build, and 62 targeted production tests, including SEO, FAQ, hero, navigation, motion identity, and responsive overflow. The stale fixed hero position was replaced with non-overlap assertions; catalog navigation remains persistent through a server-rendered intro slot.
- A fresh 286-test production regression run was started after a server restart; its final result was still pending when the owner explicitly requested commit and push. Do not report the full SEO regression suite as passed until its final result is available.
- `tests/media-integrity.spec.ts` retains alias/access checks, full catalog digest, optimization availability, and query rejection; mask-enforcement tests and the redaction manifest/helper were removed.
- Production audit previously found zero vulnerabilities. The known development-only `GHSA-vfj7-8cjw-p6xm` remains explicitly reported; no forced downgrade.
- Checksum-verified Gitleaks history/source scans previously passed; generated ignored `.next` keys were not added to an allowlist.

## Repository automation and release gates

Dependabot alerts and automated security fixes are enabled in GitHub. The new workflow has not been published or verified remotely. Stable future required checks:

- `Lint, typecheck, build and Playwright`
- `Dependency audit`
- `Secret scan (redacted)`

Branch protection waits until those workflows are published and pass. Preserve an owner maintenance path; do not require sole-maintainer self-approval. Commit and push were separately authorized by the owner. No force push or history rewrite is included.

After a separately authorized deployment, verify direct images, aliases, and Next Image responses on the real deployment hosts. Local cache clearing does not purge hosting/CDN/browser caches. Historical URLs and downloaded copies are not revoked by source changes.
