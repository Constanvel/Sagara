import { expect, test, type Locator } from "@playwright/test";
import * as compatibility from "../src/data/media";
import { galleryMedia, serviceVideo } from "../src/data/media/gallery";
import { heroSlides } from "../src/data/media/hero";
import { carouselSlides } from "../src/data/media/hero-slides";
import type { MediaItem } from "../src/data/media/types";

// Keep patient imagery out of retained artifacts, including failed test runs.
test.use({ screenshot: "off", trace: "off", video: "off" });

const photos = galleryMedia.filter(item => item.type === "photo");

test("split media modules retain the same compatibility exports", () => {
  // Full publication order, metadata and captions are covered by
  // media-integrity.spec.ts and carousel-copy.spec.ts.
  expect(compatibility.galleryMedia).toBe(galleryMedia);
  expect(compatibility.heroSlides).toBe(heroSlides);
  expect(compatibility.serviceVideo).toBe(serviceVideo);
  expect(galleryMedia).toHaveLength(29);
  expect(photos).toHaveLength(24);
  expect(galleryMedia.filter(item => item.type === "video")).toHaveLength(5);
  expect(heroSlides).toHaveLength(20);
  expect(carouselSlides).toEqual(heroSlides.map(({ src, alt, heading, description }) => ({ src, alt, heading, description })));
  for (const slide of carouselSlides) expect(Object.keys(slide).sort()).toEqual(["alt", "description", "heading", "src"]);
  expect(serviceVideo).toBe(galleryMedia.find(item => item.id === "video-layanan"));
});

test("gallery entry scripts exclude hero captions without counting route prefetch", async ({ request }) => {
  const response = await request.get("/galeri");
  expect(response.ok()).toBe(true);
  const html = await response.text();
  const scripts = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)].map(match => match[1]);
  expect(scripts.length).toBeGreaterThan(0);
  for (const src of new Set(scripts)) {
    const script = await request.get(src);
    expect(script.ok()).toBe(true);
    const body = await script.text();
    for (const slide of heroSlides) expect(body.includes(slide.heading)).toBe(false);
  }
});

test("home entry scripts exclude unrelated gallery videos", async ({ request }) => {
  const response = await request.get("/");
  expect(response.ok()).toBe(true);
  const html = await response.text();
  const scripts = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)].map(match => match[1]);
  expect(scripts.length).toBeGreaterThan(0);
  for (const src of new Set(scripts)) {
    const script = await request.get(src);
    expect(script.ok()).toBe(true);
    expect((await script.text()).includes("sagara-suasana-dan-sertifikat.mp4")).toBe(false);
  }
});

async function expectResponsiveDialogImage(dialog: Locator, media: MediaItem, width: number, dpr: number) {
  await expect(dialog.getByRole("heading")).toHaveText(media.title);
  await expect(dialog.locator("figcaption p")).toHaveText(media.caption);
  const image = dialog.locator("img");
  await expect(image).toHaveAttribute("alt", media.alt);
  await expect(image).toHaveCSS("object-fit", "contain");
  await expect.poll(() => image.evaluate((element: HTMLImageElement) =>
    element.complete && element.naturalWidth > 0 && Boolean(element.currentSrc),
  )).toBe(true);

  const metrics = await image.evaluate(async (element: HTMLImageElement) => {
    await element.decode();
    const decoded = await createImageBitmap(element);
    const decodedWidth = decoded.width;
    decoded.close();
    const box = element.getBoundingClientRect();
    const modal = element.closest("dialog")!;
    const modalStyle = getComputedStyle(modal);
    const horizontalInset = parseFloat(modalStyle.paddingLeft) + parseFloat(modalStyle.paddingRight)
      + parseFloat(modalStyle.borderLeftWidth) + parseFloat(modalStyle.borderRightWidth);
    const selectedSize = element.sizes.split(/,\s*/).find(value => {
      const condition = value.match(/^(\(.*?\))\s+/);
      return !condition || matchMedia(condition[1]).matches;
    });
    if (!selectedSize) throw new Error("Dialog image must declare a matching responsive slot");
    const probe = document.createElement("div");
    probe.style.cssText = `position:fixed;width:${selectedSize.replace(/^\(.*?\)\s+/, "")};height:0;pointer-events:none;visibility:hidden`;
    document.body.append(probe);
    const declaredWidth = probe.getBoundingClientRect().width;
    // Reduced-motion CSS sets a tiny transition duration on every element;
    // a second fresh probe avoids sampling the previous width mid-transition.
    const clampProbe = document.createElement("div");
    clampProbe.style.cssText = `position:fixed;width:${modalStyle.maxWidth};height:0;pointer-events:none;visibility:hidden`;
    document.body.append(clampProbe);
    const maxDialogWidth = clampProbe.getBoundingClientRect().width;
    clampProbe.remove();
    probe.remove();
    const candidates = element.srcset.split(/,\s*/).map(candidate => {
      const match = candidate.trim().match(/^(.*)\s+(\d+)w$/);
      if (!match) throw new Error("Dialog image must expose width-based srcset candidates");
      return { url: new URL(match[1], location.href).href, width: Number(match[2]) };
    });
    return {
      boxWidth: box.width, boxHeight: box.height, declaredWidth, horizontalInset, maxDialogWidth,
      dialogWidth: modal.getBoundingClientRect().width, currentSrc: element.currentSrc,
      candidates, decodedWidth, dpr: devicePixelRatio,
    };
  });

  expect(metrics.dpr).toBe(dpr);
  // Resolve the browser's dialog max-width instead of assuming its UA margin.
  // Chromium 156 uses calc(100% - 38px), including its default border allowance.
  const expectedDialogWidth = Math.min(920, width * 0.94, metrics.maxDialogWidth);
  const expectedDeclaredWidth = Math.min(920, width * 0.94) - 40;
  expect(Math.abs(metrics.dialogWidth - expectedDialogWidth)).toBeLessThan(2);
  expect(metrics.horizontalInset).toBe(40);
  expect(Math.abs(metrics.boxWidth - (metrics.dialogWidth - metrics.horizontalInset))).toBeLessThan(2);
  // Evaluate the active sizes expression as CSS, rather than pinning its text.
  expect(Math.abs(metrics.declaredWidth - expectedDeclaredWidth)).toBeLessThan(2);
  expect(metrics.declaredWidth).toBeGreaterThanOrEqual(metrics.boxWidth - 2);
  expect(metrics.declaredWidth - metrics.boxWidth).toBeLessThanOrEqual(
    Math.max(0, Math.min(920, width * 0.94) - expectedDialogWidth) + 2,
  );

  const selected = metrics.candidates.find(candidate => candidate.url === metrics.currentSrc);
  expect(selected, "currentSrc must be one of the declared responsive candidates").toBeDefined();
  const selectedUrl = new URL(metrics.currentSrc);
  expect(selectedUrl.pathname).toBe("/_next/image");
  expect(selectedUrl.searchParams.get("url")).toBe(media.src);
  expect(Number(selectedUrl.searchParams.get("w"))).toBe(selected!.width);

  // object-fit:contain paints less than the fill box for portrait photographs.
  // Do not require decoded pixels beyond the original file.
  const visibleWidth = Math.min(metrics.boxWidth, metrics.boxHeight * media.width / media.height);
  const requiredWidth = Math.min(visibleWidth * dpr, media.width);
  expect(Math.max(...metrics.candidates.map(candidate => candidate.width))).toBeGreaterThanOrEqual(requiredWidth);
  expect(selected!.width + 1, "selected candidate must cover the visible photograph at this DPR").toBeGreaterThanOrEqual(requiredWidth);
  expect(metrics.decodedWidth + 1, "decoded pixels must cover the photograph up to its source resolution").toBeGreaterThanOrEqual(requiredWidth);
}

test.describe("source-resolution cap", () => {
  test.use({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 3 });

  test("dialog does not require pixels beyond the original photograph", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/galeri");
    await page.locator('article[data-media-id="sertifikat-dan-hadiah"] button').click();
    const dialog = page.getByRole("dialog");
    await expectResponsiveDialogImage(dialog, photos[0], 1440, 3);
    const box = await dialog.locator("img").boundingBox();
    expect(Math.min(box!.width, box!.height * photos[0].width / photos[0].height) * 3).toBeGreaterThan(photos[0].width);
  });
});

for (const dpr of [1, 2]) {
  for (const width of [390, 768, 1440, 1920]) {
    test.describe(`gallery dialog at ${width}px / DPR ${dpr}`, () => {
      test.use({ viewport: { width, height: 1000 }, deviceScaleFactor: dpr });

      test("responsive source covers the contained photograph and navigation restores focus", async ({ page }) => {
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto("/galeri");
        await page.getByRole("button", { name: "Foto", exact: true }).click();
        const trigger = page.locator('article[data-media-id="sertifikat-dan-hadiah"] button');
        await trigger.click();
        const dialog = page.getByRole("dialog");
        await expect(dialog).toBeVisible();
        await expectResponsiveDialogImage(dialog, photos[0], width, dpr);
        await expect(dialog.getByText("1 dari 24", { exact: true })).toBeVisible();

        await dialog.getByRole("button", { name: "Berikutnya", exact: true }).click();
        await expectResponsiveDialogImage(dialog, photos[1], width, dpr);
        await expect(dialog.getByText("2 dari 24", { exact: true })).toBeVisible();
        await dialog.getByRole("button", { name: "Sebelumnya", exact: true }).click();
        await expectResponsiveDialogImage(dialog, photos[0], width, dpr);
        await dialog.getByRole("button", { name: "Sebelumnya", exact: true }).click();
        await expectResponsiveDialogImage(dialog, photos[23], width, dpr);
        await expect(dialog.getByText("24 dari 24", { exact: true })).toBeVisible();

        await page.keyboard.press("Escape");
        await expect(dialog).not.toBeVisible();
        await expect(trigger).toBeFocused();
      });
    });
  }
}
