# Technical SEO audit

## Search-trust follow-up — 2026-10-23

The earlier sections below are historical, not a description of the current deployment.

A user-supplied Lightsite screenshot reports risk 53/100 and claims there are no contacts, minimal schema and no substantive articles. Direct text fetches of the deployed homepage and `/kontak` on this date both expose WhatsApp **0878 9977 7219**, Banteran/Sumbang, a Google Maps link and the privacy link. The no-contact assertion does not match that evidence. The audit's crawl time, raw responses and scoring method were not supplied; its score is not a Google ranking or Core Web Vitals metric.

The owner chose to use existing data only. Changes are committed separately:

- `2e08309`: add a factual `ContactPoint` to the existing Organization and emit an Organization/ContactPage graph on `/kontak`. The graph connects the canonical contact page to the same stable organization ID and published WhatsApp number. No medical-business classification, street address, hours, credentials, ratings, prices or profiles are invented.
- `a3e7e7b`: expand `/layanan` with a server-rendered consultation/registration guide. It covers questions to ask, costs and confirmation, form steps, data sharing and the limits of site information. It is operational guidance, not medically reviewed treatment advice. It links to registration, contacts and privacy; no empty article route or fictional author/review date is created.
- The same content commit makes existing FAQ answers readable without JavaScript using a no-script fallback, while retaining the tested interactive accordion. It also replaces the unsupported “Metode Khitan Unggulan” heading with “Pilihan Metode Khitan”. Previously requested exact carousel captions remain unchanged.

Verification: production build, lint and typecheck pass. The schema/contact/technical-SEO suite passes **13/13 tests**; the content/FAQ/accessibility suite also passes **13/13 tests**. These include actual no-JavaScript contact and FAQ visibility, schema consistency, canonical routes, sitemap, keyboard interaction and automated accessibility. A separate read-only review found no blockers in graph linkage, current CSP compatibility for the no-script fallback or factual guide wording. Build `N_rDfwOJjPGsN5UJiM-qG` retains prerendering for all seven public routes. The subsequent complete production suite passes **312/312 tests in 9.2 minutes**, without retries. No new external schema-validator certification or improved third-party score is claimed.

Still needed: owner-confirmed full address, operational hours, legal/practitioner identity and qualifications with permission to publish; qualified review and reliable references before publishing substantive medical articles. After deployment, rerun the same third-party crawl with its URL/date/CSV retained and check live HTML/Search Console. Schema volume alone cannot establish trust or guarantee ranking.

---

Audit date: 2026-10-21. Scope: five public routes, server-rendered metadata and headings, internal links, robots, sitemap, image collection JSON-LD, and factual organization data. No layout, navigation, or media-component changes. `src/data/media.ts` and its source-image report belong to the media audit agent.

## Method and evidence

- Read `AGENTS.md` and installed Next.js 16.4.2 documentation: metadata/OG images, JSON-LD, sitemap, and robots conventions before editing.
- Fetched production HTML directly from `https://sagara-vert.vercel.app`, not only the hydrated DOM. Also browsed all five production routes with JavaScript disabled.
- Production observations below describe the deployment **before these local changes**. No deployment was performed.
- Followed the existing Google Maps short URL. It returned HTTP 200 and resolved to a listing named **SAGARA Rumah Sunat Modern Banteran**, with the exact place coordinates `-7.362495,109.2655145` in its URL and page data. This verifies the listing link/point, not a full street address, medical license, or operating schedule.
- The original local logo `/images/media/sagara-rumah-sunat-modern-banteran-logo.webp` was visually inspected: SAGARA / Rumah Sunat Modern / BANTERAN, 340 × 152. The production asset returns HTTP 200 and `image/webp`.

## Production route audit

All five routes returned HTTP 200, had Indonesian `lang="id"`, one nonempty H1, unique titles and descriptions, and self-referencing canonical URLs on the production origin. The homepage canonical omits the trailing slash; it represents the same root URL as the sitemap's slash form.

| Route | Title | Server-rendered H1 | Image elements / missing alt attributes |
| --- | --- | --- | --- |
| `/` | SAGARA — Rumah Sunat Modern Banteran | Langkah berani si jagoan, dimulai di sini. | 76 / 0 |
| `/layanan` | Layanan Khitan \| SAGARA | Pilihan untuk keluarga. | 18 / 0 |
| `/paket` | Paket Khitan \| SAGARA | Pilihan untuk keluarga. | 12 / 0 |
| `/galeri` | Galeri \| SAGARA | Cerita para jagoan | 37 / 0 |
| `/kontak` | Lokasi & Kontak \| SAGARA | Mari berkunjung. | 13 / 0 |

Image-element counts include shared/decorative/carousel content, not unique media inventory. Having an `alt` attribute is not proof that its wording is appropriate; source-image descriptions are covered by the separate media review.

### Existing strengths

- Titles, descriptions, canonical links, OG title/description/URL, and Twitter summary metadata exist in the response HTML, without relying on JavaScript.
- H1/H2/H3 content is server-rendered. The shared catalog H1 is generic and identical across two routes, but their document titles and descriptions distinguish them. Heading copy is outside this metadata-only change scope.
- Twelve distinct same-origin URLs/fragments collected from production anchors were checked: no HTTP failures or missing fragment targets found. This is a finite crawl of rendered anchors, not a claim about every possible URL.
- `/robots.txt` and `/sitemap.xml` returned HTTP 200. Robots allows crawling and points to the canonical sitemap. The sitemap contains exactly the five public routes.
- Gallery HTML contains a `CollectionPage` with 24 `ImageObject` records. All 24 production `contentUrl` resources returned HTTP 200 and image content types. This verifies availability, not patient consent, ownership, or accuracy of every caption.

### Findings and fixes

1. **No OG/Twitter image in production metadata.** Added the verified existing original logo to shared page metadata, with real dimensions and descriptive alt text. Kept Twitter `summary`; the small logo is not presented as 1200 × 630 social artwork. No new image was generated and no patient photograph was used for the social preview. Actual platform cropping/caching remains platform-dependent.
2. **No organization structured data in production homepage HTML.** Added a homepage `Organization` entity with stable ID, factual name, canonical URL, logo, existing public WhatsApp telephone, and a `Place` pointing to the verified map/coordinates. The telephone is normalized from `contact.whatsappLabel` (existing visible contact data); independent ownership or reachability of the number was not tested. No street address, opening hours, ratings, reviews, prices, staff qualifications, guarantees, or medical accreditation were invented. Used `Organization`, not a more specific unverified medical-business classification.
3. **Gallery schema duplicated production-origin literals.** Reused one absolute-URL helper and safe JSON-LD serializer, retained the existing photo-only collection, added stable collection identity, Indonesian language, and publisher reference. Image fields continue to come from `galleryMedia`; no source media data was edited.
4. **Route inventory duplicated in sitemap code.** Exported the five canonical paths from `src/lib/seo.ts` and reused them in the sitemap. Existing robots behavior is already appropriate and was left unchanged. No artificial modification dates or priorities were introduced.
5. **No automated server-rendered SEO coverage.** Added `tests/technical-seo.spec.ts` for unique metadata, canonical/OG URL equivalence, shared logo, Indonesian language, exactly one H1, JSON parsing, factual organization fields, gallery image availability, internal paths/fragments, robots, and sitemap.

Breadcrumb markup was not added: these are shallow top-level routes and there is no visible breadcrumb trail. Adding markup solely for search presentation would not improve the factual page model.

## Local validation

- `npx playwright test tests/technical-seo.spec.ts`: **2 passed**. Uses Chromium with JavaScript disabled against local Next.js development server. Gallery image resources and all discovered internal paths/fragments passed.
- `npm run typecheck`: **passed** (`tsc --noEmit`).
- Targeted ESLint on changed TypeScript/TSX files: **passed**.
- Initial test expected a literal root trailing slash; Next.js normalizes the root metadata URL without it. Corrected the assertion to compare normalized absolute URLs rather than treating equivalent root forms as different pages.
- Production link, schema-photo, metadata, heading, and original-logo checks passed as described above. New local organization/social-image metadata is not yet deployed or verified on production.

## Limitations and follow-up

- No search-ranking, indexing, rich-result, or conversion guarantees. `Organization` and `CollectionPage` do not imply eligibility for a special Google result.
- Google Rich Results Test, Schema Markup Validator, Search Console ownership/indexing, crawl logs, and social-platform debugger previews were not run. JSON syntax and factual fields were tested locally; this is not external schema-validator certification.
- Full street address, exact service hours, legal identity, licensing, prices, social accounts, patient consent, and ownership of assets were not independently established. Do not add those claims until the owner supplies reliable evidence. Existing gallery publication-approval comment is a repository assertion, not independent consent verification.
- Production medical/promotional headings and benefit claims were observed, not clinically validated. Metadata changes do not validate treatment claims; the owner should review these separately.
- The canonical origin remains the existing public production origin. If a custom domain becomes authoritative, update the central `siteUrl`, redeploy, and verify redirects/canonical/sitemap consistency.
- Recheck five production routes, shared logo, robots, sitemap, schema, and social previews after deployment. Run the complete project suite in the integrating session; this subtask ran its focused SEO suite and typecheck only.
