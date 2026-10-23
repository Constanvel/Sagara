import { expect, test } from "@playwright/test";

for (const width of [320, 375, 390, 412, 768, 1024, 1280, 1440, 1920]) {
  for (const route of ["/", "/layanan", "/paket", "/kontak"]) {
    test(`${route} has no overflow at ${width}px`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setViewportSize({ width, height: 900 });
      const errors: string[] = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("h1")).toHaveCount(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect(errors).toEqual([]);
      for (const image of await page.locator("img").all()) {
        if (!(await image.isVisible())) continue;
        await image.scrollIntoViewIfNeeded();
        await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
      }
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.screenshot({ path: `test-results/${route === "/" ? "home" : route.slice(1)}-${width}.png`, fullPage: true });
    });
  }
}

test("mobile navigation, FAQ and approved contact links", async ({ page }) => {
  await page.setViewportSize({ width: 412, height: 900 });
  await page.goto("/");
  await page.getByRole("button", { name: "Buka menu" }).click();
  await expect(page.getByRole("navigation", { name: "Menu seluler" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Buka menu" })).toBeFocused();
  const question = page.getByRole("button", { name: "Metode mana yang cocok untuk saya atau anak saya?" });
  await expect(question).toHaveAttribute("aria-expanded", "false");
  await question.click();
  await expect(question).toHaveAttribute("aria-expanded", "true");
  await question.press("Enter");
  await expect(question).toHaveAttribute("aria-expanded", "false");
  expect(await page.locator('a[href="#"]').count()).toBe(0);
  const contacts = page.locator('a[href^="https://wa.me/"]');
  expect(await contacts.count()).toBeGreaterThan(0);
  for (const contact of await contacts.all()) await expect(contact).toHaveAttribute("href", /^https:\/\/wa\.me\/6287899777219\?text=/);
  await page.getByRole("link", { name: "Lihat paket" }).click();
  await expect(page).toHaveURL(/\/paket$/);
  await expect(page.getByText("Hubungi admin untuk biaya", { exact: true })).toHaveCount(2);
});
