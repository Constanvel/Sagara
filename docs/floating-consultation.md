# Floating consultation

Date: 2026-10-21. Scope: one reusable global component added in root layout; existing navbar, footer, carousel and gallery application source unchanged.

## Design and assets

Figma MCP inspected canvas `0:1`, then design context and screenshot for **44:11 — Konsultasi**. Reuses its navy `#002869`, white outlined 20px-radius bubble, original mascot and phone glyph, 54px circular button. Added requested support copy beneath the title; bubble is wider/taller than the compact Figma title-only reference to fit that text legibly. The phone icon follows Figma; the destination is WhatsApp.

Downloaded original Figma mascot and phone SVG to local files. Mascot optimized to 160 × 160 WebP for its 56px display; original PNG retained. No redraw, external runtime asset URL or new dependency.

## Behavior

- Global fixed link on five routes, existing official WhatsApp helper/number `6287899777219`, exact supplied message encoded with `encodeURIComponent`, safe new tab.
- Bubble appears two seconds after window load, without stealing focus or browser notification permissions.
- Close saves `sagara_consultation_dismissed=true`. Refresh, navigation and another same-origin tab retain dismissal. Storage events synchronize dismissal across tabs.
- Storage access is guarded. If blocked, dismissal lasts for the mounted session but cannot be promised across reloads; clearing site data also resets the preference.
- Mobile offset includes the existing 69px bottom navigation plus 16px gap and safe area. Desktop edge gap 24px.
- Widget moves above the footer on scroll; if a tall footer leaves insufficient room for the bubble, the prompt is temporarily hidden while the main link remains available.
- Existing menu/dialog open state temporarily hides the widget without modifying their components. MutationObserver, timer, event handlers and scheduled animation frame clean up on unmount.
- Keyboard-accessible link and 44px close control, visible focus, reduced-motion support, one entry animation only, no focus trap or autoplay.
- Browser-only APIs run in effects; server and initial client markup agree. Fixed positioning does not take up document layout space.

## Verification

Production build passed. ESLint, TypeScript and diff checks passed. Full production Playwright suite: **244 passed (3.6 minutes)**, including 31 dedicated consultation tests.

Coverage: all five routes at 360, 390, 412, 768 and 1440px; exact URL/message, delay, persistent dismissal, storage denial, keyboard, menu/dialog suppression, scrolling, viewport containment, footer and mobile navigation clearance. Existing responsive/media regressions also passed. Updated visual audit to wait for delayed-mounted images before classifying broken images; an in-flight mascot request was not an asset failure.

Browser screenshots captured at all five requested widths, before and at footer. Mobile/desktop screenshots reviewed directly: original mascot/phone, navy button, outlined bubble, readable support text and footer clearance. Evidence outside Git: `C:\Users\IDEAPAD SLIM 3\AppData\Local\Temp\opencode\sagara-floating-*.png` and `sagara-floating-verified-tests.log`.

No new Lighthouse/field Core Web Vitals claim, physical-device certification or automatic confirmation of post-push Vercel deployment. The overlay can temporarily cover underlying content while open; it is dismissible, constrained to the viewport, and does not block the whole page. User authorized commit and push with existing GitHub account.
