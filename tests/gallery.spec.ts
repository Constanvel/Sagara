import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const width of [375, 390, 412, 768, 1024, 1440]) {
  test(`gallery responsive and accessible at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/galeri");
    await expect(page.getByRole("heading", { name: "Cerita para jagoan" })).toBeVisible();
    await expect(page.locator("main article")).toHaveCount(3);
    await page.getByRole("button", { name: "Foto", exact: true }).click();
    await expect(page.getByRole("button", { name: "Foto", exact: true })).toHaveAttribute("aria-pressed", "true");
    for (const image of await page.locator("main article img").all()) {
      await expect(image).toHaveAttribute("alt", /Seorang anak/);
      await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.screenshot({ path: `test-results/gallery-${width}.png`, fullPage: true });
  });
}

test("lightbox traps focus, navigates, closes with Escape and restores focus", async ({ page }) => {
  await page.goto("/galeri");
  const trigger = page.getByRole("button", { name: /Perbesar foto: Senyum setelah langkah berani/ });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(page.getByRole("button", { name: "Tutup foto" })).toBeFocused();
  await page.getByRole("button", { name: "Berikutnya" }).click();
  await expect(dialog.getByRole("heading")).toHaveText("Kenalan dengan Sagara");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Tutup foto" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
});

test("gallery navigation activates bottom indicator", async ({ page }) => {
  await page.setViewportSize({ width: 412, height: 900 });
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Navigasi bawah" });
  await nav.getByRole("link", { name: "Galeri", exact: true }).click();
  await expect(page).toHaveURL(/\/galeri$/);
  await expect(nav.getByRole("link", { name: "Galeri", exact: true })).toHaveAttribute("aria-current", "page");
});

test("fast scrolling and live reduced motion leave all reveals visible", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 500 });
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => page.evaluate(() => document.getAnimations().filter(a => a.playState === "running").length)).toBe(0);
  expect(await page.locator("main article").evaluateAll(elements => elements.every(el => getComputedStyle(el).opacity === "1"))).toBe(true);
  await page.goto("/galeri");
  await expect(page.getByRole("heading", { name: "Cerita para jagoan" })).toBeVisible();
});

test("gallery remains visible without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/galeri");
  await expect(page.getByRole("heading", { name: "Cerita para jagoan" })).toBeVisible();
  await expect(page.locator("main article")).toHaveCount(3);
  expect(await page.locator("main article").first().evaluate(el => getComputedStyle(el).opacity)).toBe("1");
  await context.close();
});
