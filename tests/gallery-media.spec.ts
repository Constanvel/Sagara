import { expect, test } from "@playwright/test";
import { galleryMedia } from "../src/data/media";

const photos = galleryMedia.filter(item => item.type === "photo");
const videos = galleryMedia.filter(item => item.type === "video");

test("gallery data has 24 unique photos and one playable video", () => {
  expect(photos).toHaveLength(24);
  expect(videos).toHaveLength(1);
  expect(new Set(galleryMedia.map(item => item.id)).size).toBe(galleryMedia.length);
  expect(new Set(galleryMedia.map(item => item.src)).size).toBe(galleryMedia.length);
  expect(videos[0].src).toBe("/videos/sagara-cerita-layanan.mp4");
  expect(videos[0].thumbnail).toBe("/images/media/sagara-video-layanan-poster.webp");
});

test("filters show accurate counts and lightbox navigates only the filtered collection", async ({ page }) => {
  await page.goto("/galeri");
  const cards = page.locator("article[data-media-id]");
  await expect(cards).toHaveCount(galleryMedia.length);
  expect(await cards.evaluateAll(elements => new Set(elements.map(el => el.getAttribute("data-media-id"))).size)).toBe(galleryMedia.length);
  await page.getByRole("button", { name: "Foto", exact: true }).click();
  await expect(cards).toHaveCount(photos.length);
  await expect(page.getByRole("status")).toHaveText(`Foto: ${photos.length} foto, 0 video.`);
  await cards.last().getByRole("button").click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading")).toHaveText(photos.at(-1)!.title);
  await expect(dialog.locator("img")).toHaveCSS("object-fit", "contain");
  await dialog.getByRole("button", { name: "Berikutnya" }).click();
  await expect(dialog.getByRole("heading")).toHaveText(photos[0].title);
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Video", exact: true }).click();
  await expect(cards).toHaveCount(videos.length);
  await expect(page.getByRole("status")).toHaveText("Video: 0 foto, 1 video.");
  await cards.first().getByRole("button").click();
  await expect(dialog.getByRole("heading")).toHaveText(videos[0].title);
  await expect(dialog.locator("video")).toHaveCount(1);
  await expect(dialog.getByText("1 dari 1", { exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(cards.first().getByRole("button")).toBeFocused();
  await page.getByRole("button", { name: "Semua", exact: true }).click();
  await cards.first().getByRole("button").click();
  await expect(dialog.getByRole("heading")).toHaveText(galleryMedia[0].title);
});

test("video uses native controls, loads on demand and plays when codec is supported", async ({ page, request }) => {
  const response = await request.get(videos[0].src);
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("video/mp4");
  await page.goto("/galeri");
  await expect(page.locator("video")).toHaveCount(0);
  await page.getByRole("button", { name: "Video", exact: true }).click();
  const trigger = page.locator("article[data-media-type='video'] button");
  await trigger.click();
  const dialog = page.getByRole("dialog");
  const video = dialog.locator("video");
  await expect(video).toHaveAttribute("controls", "");
  await expect(video).toHaveAttribute("playsinline", "");
  await expect(video).toHaveAttribute("preload", "none");
  await expect(video).toHaveAttribute("poster", videos[0].thumbnail);
  await expect(video.locator("source")).toHaveAttribute("src", videos[0].src);
  const supported = await video.evaluate((el: HTMLVideoElement) => Boolean(el.canPlayType('video/mp4; codecs="avc1.42E01E"')));
  test.skip(!supported, "Browser does not support H.264 playback");
  const playback = await video.evaluate(async (el: HTMLVideoElement) => {
    return await Promise.race([
      el.play().then(() => "playing").catch(() => `error:${el.error?.code ?? 0}`),
      new Promise<string>(resolve => {
        el.addEventListener("error", () => resolve(`error:${el.error?.code ?? 0}`), { once: true });
        el.querySelector("source")?.addEventListener("error", () => resolve("unsupported-source"), { once: true });
        setTimeout(() => resolve(el.currentTime > 0 ? "playing" : "timeout"), 10000);
      }),
    ]);
  });
  test.skip(playback === "error:4" || playback === "unsupported-source", "Runtime cannot decode the supplied H.264/AAC source");
  expect(playback).toBe("playing");
  await expect.poll(() => video.evaluate((el: HTMLVideoElement) => el.currentTime), { timeout: 15000 }).toBeGreaterThan(0);
  await expect(video).toHaveJSProperty("paused", false);
  await expect(video).toHaveJSProperty("error", null);
  await dialog.getByRole("button", { name: "Tutup media" }).focus();
  await page.keyboard.press("Tab");
  expect(await video.evaluate(el => el === document.activeElement)).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(page.locator("video")).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("video playback failure displays an accessible recovery link", async ({ page }) => {
  await page.route("**/videos/sagara-cerita-layanan.mp4", route => route.abort());
  await page.goto("/galeri");
  await page.getByRole("button", { name: "Video", exact: true }).click();
  await page.locator("article[data-media-type='video'] button").click();
  const dialog = page.getByRole("dialog");
  await dialog.locator("video").evaluate((el: HTMLVideoElement) => { void el.play().catch(() => {}); });
  await expect(dialog.getByRole("status")).toContainText("Video tidak dapat diputar", { timeout: 15000 });
  await expect(dialog.getByRole("link", { name: "Buka video langsung" })).toHaveAttribute("href", videos[0].src);
});
