import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";

// Keep explicit audit captures inside ignored output that CI removes after testing.
const auditDirectory = path.join(process.cwd(), "test-results", "visual-audit");
const widths = [360, 390, 412, 768, 1280, 1440, 1920];

test.beforeAll(async () => {
  await mkdir(auditDirectory, { recursive: true });
});
const routes = ["/", "/layanan", "/paket", "/galeri", "/kontak"];
test.setTimeout(300_000);

function watchErrors(page: Page) {
  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];
  const failedRequests: string[] = [];
  const httpErrors: string[] = [];
  page.on("pageerror", error => pageErrors.push(error.message));
  page.on("console", message => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("requestfailed", request => {
    // Next route prefetches can be cancelled normally; retain all other failures.
    if (!request.failure()?.errorText.includes("ERR_ABORTED")) {
      failedRequests.push(`${request.method()} ${request.url()}: ${request.failure()?.errorText}`);
    }
  });
  page.on("response", response => {
    if (response.status() >= 400) httpErrors.push(`${response.status()} ${response.url()}`);
  });
  return { pageErrors, consoleErrors, failedRequests, httpErrors };
}

async function scrollEntirePage(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  let y = 0;
  for (let step = 0; step < 100; step++) {
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    await page.evaluate(top => window.scrollTo(0, top), y);
    await page.waitForTimeout(100);
    if (y >= height) break;
    y += 650;
  }
  // Hidden carousel slides also need verification, not only the visible slide.
  await page.locator("img").evaluateAll(images => images.forEach(element => { (element as HTMLImageElement).loading = "eager"; }));
  await expect.poll(() => page.locator("img").evaluateAll(elements => elements.map(element => element as HTMLImageElement).filter(image => !image.complete || image.naturalWidth === 0).map(image => image.currentSrc || image.src)), { timeout: 30_000 }).toEqual([]);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(350);
}

for (const width of widths) {
  for (const route of routes) {
    test(`audit ${route} at ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      const errors = watchErrors(page);
      const videoRequests: string[] = [];
      page.on("request", request => {
        if (request.resourceType() === "media" || /\.(mp4|webm|mov|m3u8)(?:[?#]|$)/i.test(request.url())) videoRequests.push(request.url());
      });
      const response = await page.goto(route, { waitUntil: "networkidle" });
      expect(response?.status()).toBe(200);
      if (route === "/galeri") {
        expect(videoRequests, "gallery must not request video before user interaction").toEqual([]);
        expect(await page.locator("video").evaluateAll(videos => videos.flatMap(video => [video.getAttribute("src"), ...Array.from(video.querySelectorAll("source"), source => source.getAttribute("src"))]).filter(Boolean)), "gallery videos must have no initial source").toEqual([]);
      }
      const header = page.locator("header.site-header");
      const bottomNav = page.getByRole("navigation", { name: "Navigasi bawah", exact: true });
      for (const height of [900, 680]) {
        await page.setViewportSize({ width, height });
        await page.evaluate(() => window.scrollTo(0, 700));
        await expect.poll(async () => Math.abs((await header.boundingBox())?.y ?? Infinity), { message: "header remains at viewport top after scrolling and resizing" }).toBeLessThanOrEqual(1);
        if (width < 1024) {
          await expect(bottomNav).toBeVisible();
          await expect.poll(async () => {
            const box = await bottomNav.boundingBox();
            return box ? Math.abs(box.y + box.height - height) : Infinity;
          }, { message: "mobile navigation remains at viewport bottom after scrolling and resizing" }).toBeLessThanOrEqual(1);
        } else {
          await expect(bottomNav).toBeHidden();
          await expect(page.getByRole("navigation", { name: "Navigasi utama", exact: true })).toBeVisible();
        }
      }
      await page.setViewportSize({ width, height: 900 });
      await scrollEntirePage(page);
      // Wait for the delayed widget before checking images; an empty image queue
      // before it mounts does not mean its mascot has finished loading.
      await expect(page.getByRole("region", { name: "Konsultasi SAGARA", exact: true })).toBeVisible({ timeout: 10_000 });
      await expect.poll(() => page.locator("img").evaluateAll(elements => elements.filter(element => { const image = element as HTMLImageElement; return !image.complete || !image.naturalWidth; }).length), { timeout: 30_000 }).toBe(0);
      const media = await page.locator("img, video").evaluateAll(elements => elements.map(element => {
        const box = element.getBoundingClientRect();
        const css = getComputedStyle(element);
        const image = element instanceof HTMLImageElement;
        return {
          tag: element.tagName,
          src: image ? element.currentSrc || element.src : (element as HTMLVideoElement).currentSrc,
          alt: element.getAttribute("alt"),
          width: box.width,
          height: box.height,
          visible: element.getClientRects().length > 0 && css.visibility !== "hidden" && css.display !== "none",
          objectFit: css.objectFit,
          complete: image ? element.complete : undefined,
          naturalWidth: image ? element.naturalWidth : undefined,
        };
      }));
      const overflow = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
      const artifactName = `audit-${route === "/" ? "home" : route.slice(1)}-${width}`;
      await page.screenshot({ path: path.join(auditDirectory, `${artifactName}.png`), fullPage: true, animations: "disabled", mask: [page.locator("img, video")] });
      const details = JSON.stringify({ route, width, overflow, media, ...errors }, null, 2);
      await writeFile(path.join(auditDirectory, `${artifactName}.json`), details);
      await testInfo.attach("audit-details", { body: details, contentType: "application/json" });
      expect.soft(media.filter(item => item.tag === "IMG" && (!item.complete || !item.naturalWidth)), "broken images").toEqual([]);
      expect.soft(media.filter(item => item.visible && (item.width <= 0 || item.height <= 0)), "collapsed visible media").toEqual([]);
      expect.soft(overflow.document, "document horizontal overflow").toBeLessThanOrEqual(width);
      expect.soft(overflow.body, "body horizontal overflow").toBeLessThanOrEqual(width);
      expect.soft(errors.pageErrors, "uncaught browser errors").toEqual([]);
      expect.soft(errors.consoleErrors, "console and hydration errors").toEqual([]);
      expect.soft(errors.failedRequests, "failed network requests excluding intentional aborts").toEqual([]);
      expect.soft(errors.httpErrors, "HTTP errors").toEqual([]);
    });
  }

  test(`audit hero and actual About playback at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors = watchErrors(page);
    await page.goto("/", { waitUntil: "networkidle" });
    const hero = page.getByRole("region", { name: "Cerita jagoan Sagara" });
    const slides = hero.locator('[aria-roledescription="slide"]');
    await expect(slides).toHaveCount(20);
    const sources = await slides.evaluateAll(elements => elements.map(element => element.getAttribute("data-image-src")));
    expect(new Set(sources).size).toBe(20);
    const captions: string[] = [];
    // Jump directly to representative slides; do not animate through all 19 transitions.
    for (const index of [0, 10, 19]) {
      await hero.getByRole("button", { name: `Tampilkan foto ${index + 1}`, exact: true }).click();
      await expect(slides.nth(index)).toHaveAttribute("aria-hidden", "false");
      await expect(hero.getByRole("button", { name: `Tampilkan foto ${index + 1}`, exact: true })).toHaveAttribute("aria-pressed", "true");
      const caption = hero.locator('[aria-live="polite"]').first();
      await expect(caption).not.toBeEmpty();
      captions.push((await caption.innerText()).trim());
    }
    expect(new Set(captions).size, "caption must change at every hero index").toBe(3);
    await page.getByRole("button", { name: "Putar video cerita layanan Sagara", exact: true }).click();
    const dialog = page.getByRole("dialog", { name: "Cerita layanan Sagara", exact: true });
    await expect(dialog).toBeVisible();
    const video = dialog.locator("video");
    // preload=none intentionally leaves metadata unloaded until playback is requested.
    await video.evaluate(async (element: HTMLVideoElement) => { element.muted = true; await element.play(); });
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => ({ ready: element.readyState >= 1, duration: element.duration > 0, error: element.error?.message ?? null })), { timeout: 60_000 }).toEqual({ ready: true, duration: true, error: null });
    // Exercise the actual media element and decoder; no mocked network or timers.
    await video.evaluate(async (element: HTMLVideoElement) => { element.muted = true; await element.play(); });
    const startTime = await video.evaluate((element: HTMLVideoElement) => element.currentTime);
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime), { timeout: 30_000 }).toBeGreaterThan(startTime + 0.5);
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.videoWidth)).toBeGreaterThan(0);
    await page.screenshot({ path: path.join(auditDirectory, `audit-about-playing-${width}.png`), animations: "disabled", mask: [page.locator("img, video")] });
    const playbackDetails = JSON.stringify({ sources, captions, playback: await video.evaluate((element: HTMLVideoElement) => ({ src: element.currentSrc, duration: element.duration, currentTime: element.currentTime, videoWidth: element.videoWidth, videoHeight: element.videoHeight, paused: element.paused })), ...errors }, null, 2);
    await writeFile(path.join(auditDirectory, `audit-about-playing-${width}.json`), playbackDetails);
    await testInfo.attach("playback-details", { body: playbackDetails, contentType: "application/json" });
    await dialog.getByRole("button", { name: "Tutup video" }).click();
    await expect(dialog).not.toBeVisible();
    expect.soft(errors.pageErrors).toEqual([]);
    expect.soft(errors.consoleErrors).toEqual([]);
    expect.soft(errors.failedRequests).toEqual([]);
    expect.soft(errors.httpErrors).toEqual([]);
  });
}
