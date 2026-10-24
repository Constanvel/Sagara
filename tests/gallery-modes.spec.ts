import { expect, test } from "@playwright/test";
import { galleryMedia } from "../src/data/media";

const photos = galleryMedia.filter(item => item.type === "photo");
const videos = galleryMedia.filter(item => item.type === "video");
const overviewIds = Array.from({ length: 5 }, (_, index) => [
  ...photos.slice(index * 5, (index + 1) * 5), videos[index],
]).flat().map(item => item.id);

for (const width of [360, 390, 412, 768, 1280, 1440, 1920]) {
  test(`gallery modes have distinct layouts and complete media at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const videoRequests: string[] = [];
    page.on("request", request => { if (/\.mp4(?:\?|$)/.test(request.url())) videoRequests.push(request.url()); });
    await page.goto("/galeri");
    const cards = page.locator("article[data-media-id]");
    const ids = () => cards.evaluateAll(elements => elements.map(el => el.getAttribute("data-media-id")));
    const boxes = () => page.locator("article[data-media-id]:visible").evaluateAll(elements => elements.map(el => {
      const { x, y, width, height } = el.querySelector("img")!.getBoundingClientRect();
      return { x, y, width, height };
    }));
    const noOverflow = async () => expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

    await expect(cards).toHaveCount(29);
    expect(await ids()).toEqual(overviewIds);
    expect(new Set(await ids()).size).toBe(29);
    await expect(page.getByRole("status")).toHaveText("Semua: 24 foto, 5 video.");
    const overview = await boxes();
    if (width >= 768 && width < 1024) expect(overview[0].height).toBeGreaterThan(overview[1].height);
    else expect(overview[0].width).toBeGreaterThan(overview[1].width);
    await noOverflow();

    await page.getByRole("button", { name: "Foto", exact: true }).click();
    await expect(cards).toHaveCount(24);
    expect(await ids()).toEqual(photos.map(item => item.id));
    await expect(page.locator("article[data-media-type='video']")).toHaveCount(0);
    await expect(page.getByRole("status")).toHaveText("Foto: 24 foto, 0 video.");
    await page.locator("details > summary").click();
    const photoBoxes = await boxes();
    for (const box of photoBoxes) {
      expect(Math.abs(box.width - photoBoxes[0].width)).toBeLessThan(1);
      expect(Math.abs(box.height - box.width)).toBeLessThan(1);
    }
    await expect(cards.first().locator("img")).toHaveAttribute("fetchpriority", "high");
    await noOverflow();

    await page.getByRole("button", { name: "Video", exact: true }).click();
    await expect(cards).toHaveCount(5);
    expect(await ids()).toEqual(videos.map(item => item.id));
    await expect(page.getByRole("status")).toHaveText("Video: 0 foto, 5 video.");
    await expect(page.getByText("5 video cerita dan suasana Sagara. Pilih video untuk menonton.")).toBeVisible();
    await page.locator("details > summary").click();
    const videoBoxes = await boxes();
    for (const box of videoBoxes) expect(Math.abs(box.width / box.height - 16 / 9)).toBeLessThan(0.01);
    if (width < 768) expect(videoBoxes[1].y).toBeGreaterThan(videoBoxes[0].y);
    else expect(videoBoxes[1].y).toBe(videoBoxes[0].y);
    for (const card of await cards.all()) {
      await expect(card.getByRole("button")).toHaveAccessibleName(/^Putar video:/);
      await expect(card.getByText("▶ Video", { exact: true })).toBeVisible();
    }
    await expect(page.locator("video")).toHaveCount(0);
    expect(videoRequests).toEqual([]);
    await noOverflow();

    const trigger = cards.first().getByRole("button");
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.locator("video")).toHaveAttribute("preload", "none");
    await expect(dialog.locator("video")).not.toHaveAttribute("autoplay");
    expect(videoRequests).toEqual([]);
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
    await page.getByRole("button", { name: "Semua", exact: true }).click();
    expect(await ids()).toEqual(overviewIds);
    await noOverflow();
  });
}
