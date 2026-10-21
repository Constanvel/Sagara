import { expect, test } from "@playwright/test";
import { heroSlides } from "../src/data/media";

test("native scroll, keyboard, dots and captions stay synchronized across 20 photos", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const carousel = page.getByRole("region", { name: "Cerita jagoan Sagara" });
  const viewport = carousel.getByLabel("Geser foto jagoan");
  const slides = carousel.locator('[aria-roledescription="slide"]');
  await expect(slides).toHaveCount(20);
  // Next.js emits a preload link for the first image, not lazy loading.
  await expect(slides.first().locator("img")).not.toHaveAttribute("loading", "lazy");
  await expect(page.locator('link[rel="preload"][as="image"]')).not.toHaveCount(0);
  await expect(slides.nth(19).locator("img")).toHaveAttribute("loading", "lazy");
  await viewport.focus();
  await page.keyboard.press("End");
  await expect(carousel.getByRole("button", { name: "Tampilkan foto 20", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(carousel.getByText(heroSlides[19].description, { exact: true })).toBeVisible();
  await expect(carousel.getByRole("button", { name: "Foto berikutnya" })).toHaveAttribute("aria-disabled", "true");
  await page.keyboard.press("Home");
  await expect(carousel.getByRole("button", { name: "Tampilkan foto 1", exact: true })).toHaveAttribute("aria-pressed", "true");
  await viewport.evaluate(element => { element.scrollLeft = element.clientWidth * 11; });
  await expect(carousel.getByRole("button", { name: "Tampilkan foto 12", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(carousel.getByText(heroSlides[11].description, { exact: true })).toBeVisible();
  await expect(slides.nth(11)).toHaveAttribute("aria-hidden", "false");
  await page.keyboard.press("ArrowLeft");
  await expect(carousel.getByRole("button", { name: "Tampilkan foto 11", exact: true })).toHaveAttribute("aria-pressed", "true");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
