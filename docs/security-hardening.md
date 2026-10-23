# Browser security hardening

Date: 2026-10-23. Scope: application headers, contact-map referrer policy, regression tests. No media removal, dependency update, GitHub setting change, or deployment.

## Changes

`next.config.ts` applies these headers to all matched paths, including pages, missing pages, and public assets:

- `Content-Security-Policy: frame-ancestors 'none'; base-uri 'self'; object-src 'none'` prevents framing, restricts base URLs, and disables object embeds.
- `X-Frame-Options: DENY` provides fallback framing protection.
- `X-Content-Type-Options: nosniff` disables MIME sniffing.
- `Referrer-Policy: no-referrer` avoids sending referring URLs.
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()` disables unused browser capabilities.

The existing image cache rule remains unchanged. No nonce, Proxy, request-time rendering, or runtime dependency was added. Google Maps remains an allowed child iframe: `frame-ancestors` controls who embeds SAGARA, not what SAGARA embeds. Its explicit iframe referrer policy is now `no-referrer`, so it cannot override the global policy with a weaker value.

## Deliberate limits

This is a limited CSP, **not a strict script-source policy or a complete XSS defense**. Scripts, styles, media, and Maps loading retain their previous behavior. A strict CSP needs a separate compatibility and caching assessment; Next.js nonce-based policies require dynamic rendering. HSTS remains supplied by the production hosting provider rather than forcing HTTPS on local development.

The audit's media-publication risks, full WhatsApp message contents, consent/retention processes, dependency advisory, and repository governance remain outstanding. Maps still loads lazily without a separate user-action gate.

## Regression checks

`tests/security-headers.spec.ts` checks headers on six pages, a 404, and public assets; preserves image caching; verifies cross-origin framing is refused; exercises registration hydration; and intercepts Maps requests to confirm no Referer is sent. Maps responses are mocked, so this is not certification of Google's live embed behavior.

Run:

```sh
npm run lint
npm run typecheck
npx playwright test tests/security-headers.spec.ts
npm run build
```

## Recorded validation

- ESLint and TypeScript: passed.
- Production build: passed; all application routes remain statically prerendered.
- Production-mode Playwright on an isolated loopback server: **40 passed**, covering the 12 new security checks plus registration, navigation, gallery media, and initial media loading. Registration coverage includes seven viewport widths from 360 to 1920 pixels.
- Cross-origin registration framing was refused by the browser. Direct rendering/hydration and mocked Maps requests passed; Maps sent no Referer. Image caching was preserved.
- The first development framing fixture used a synthetic public hostname and timed out before reaching the local target. It was replaced by a real loopback server on a dynamically assigned port, so private-network restrictions cannot masquerade as framing protection.
- The complete historical suite was not run; no claim is made that unrelated existing failures are fixed.

The Playwright configuration defaults to the development server. Production verification used a temporary configuration pointing at `next start` on port 3017; no project runner configuration was changed. After deployment, recheck actual GET response headers and iframe refusal: local validation alone does not secure the currently deployed site.
