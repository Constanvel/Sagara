import { expect, test } from "@playwright/test";

for (const width of [320, 375, 390, 412, 768, 1440]) {
  test(`carousel controls and overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const carousel = page.getByRole("region", { name: "Cerita jagoan Sagara" });
    await carousel.getByRole("button", { name: "Foto berikutnya" }).click();
    await expect(carousel.getByRole("button", { name: "Tampilkan foto 2" })).toHaveAttribute("aria-pressed", "true");
    await carousel.getByRole("button", { name: "Foto sebelumnya" }).click();
    await expect(carousel.getByRole("button", { name: "Tampilkan foto 1" })).toHaveAttribute("aria-pressed", "true");
    await carousel.getByRole("button", { name: "Tampilkan foto 2" }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.screenshot({ path: `test-results/carousel-${width}.png`, fullPage: true });
  });
}

test("mobile menu links, anchors, focus, history and swipe close", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 700 });
  await page.goto("/");
  const toggle = page.locator('[aria-controls="mobile-menu"]');
  const menu = page.getByRole("navigation", { name: "Menu seluler" });
  await toggle.click();
  await expect(menu.getByRole("link")).toHaveText(["Beranda", "Tentang Sagara", "Layanan & Paket", "Galeri", "FAQ", "Lokasi & Kontak"]);
  await expect(menu.getByRole("link").first()).toBeFocused();
  await page.waitForTimeout(450);
  await page.screenshot({ path: "test-results/menu-open-390.png" });
  await page.keyboard.press("Shift+Tab");
  await expect(toggle).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(menu.getByRole("link").last()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  for (const [name, suffix] of [["Tentang Sagara", "/#tentang-sagara"], ["Layanan & Paket", "/layanan"], ["Galeri", "/galeri"], ["FAQ", "/#faq"], ["Lokasi & Kontak", "/kontak"], ["Beranda", "/"]]) {
    await toggle.click();
    await menu.getByRole("link", { name, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(suffix.replaceAll("/", "\\/") + "$"));
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
  }
  await toggle.click();
  await menu.evaluate(element => {
    const start = new Event("touchstart", { bubbles: true });
    Object.defineProperty(start, "touches", { value: [{ clientX: 250, clientY: 180 }] });
    element.dispatchEvent(start);
    const end = new Event("touchend", { bubbles: true });
    Object.defineProperty(end, "changedTouches", { value: [{ clientX: 250, clientY: 70 }] });
    element.dispatchEvent(end);
  });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await page.goBack();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await page.goForward();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
});

test("mouse drag changes slides while vertical gestures do not", async ({ page }) => {
  await page.goto("/");
  const carousel = page.getByRole("region", { name: "Cerita jagoan Sagara" });
  const box = await carousel.boundingBox();
  const x = box!.x + box!.width * .7;
  const y = box!.y + 65;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x - 140, y + 3, { steps: 12 });
  await page.mouse.up();
  await expect(carousel.getByRole("button", { name: "Tampilkan foto 2" })).toHaveAttribute("aria-pressed", "true");
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + 5, y + 100, { steps: 10 });
  await page.mouse.up();
  await expect(carousel.getByRole("button", { name: "Tampilkan foto 2" })).toHaveAttribute("aria-pressed", "true");
});
