import { expect, test } from "@playwright/test";

for (const width of [320, 375, 390, 412, 768, 1024, 1440, 1920]) {
  test(`hero CTA and original ribbon at ${width}px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const actions = page.locator(".hero-actions");
    const buttons = actions.locator("a");
    const first = await buttons.nth(0).boundingBox();
    const second = await buttons.nth(1).boundingBox();
    expect(first).not.toBeNull();
    expect(second).not.toBeNull();
    expect(first!.y).toBe(second!.y);
    if (width < 1024) {
      expect(first!.width).toBe(129);
      expect(second!.width).toBe(113);
      expect(first!.height).toBe(31);
      expect(second!.x - first!.x - first!.width).toBe(15);
    }
    const heading = await page.locator("#hero-title").boundingBox();
    const description = await page.locator(".hero-copy p").last().boundingBox();
    expect(heading).not.toBeNull();
    expect(description).not.toBeNull();
    expect(description!.y).toBeGreaterThanOrEqual(heading!.y + heading!.height);
    expect(first!.y - description!.y - description!.height).toBeGreaterThanOrEqual(20);
    expect(second!.x + second!.width).toBeLessThanOrEqual(width);
    const style = await buttons.nth(1).evaluate(el => {
      const css = getComputedStyle(el);
      return { border: css.borderTopWidth, background: css.backgroundColor, radius: css.borderRadius };
    });
    expect(style).toEqual({ border: "1px", background: "rgb(255, 255, 255)", radius: "100px" });
    await expect(buttons.nth(0)).toHaveAccessibleName("Daftar khitan");
    await expect(buttons.nth(0)).toHaveAttribute("href", "/pendaftaran");
    await expect(buttons.nth(1)).toHaveAttribute("href", "/paket");
    for (const name of ["hero-arrow-right.svg", "hero-package.svg"]) {
      const icon = actions.locator(`img[src$="${name}"]`);
      await expect(icon).toBeVisible();
      expect(await icon.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    }
    const ribbon = page.locator('.hero-section img[src$="hero-ribbon.png"]');
    if (width < 1024) {
      await expect(ribbon).toBeVisible();
      const box = await ribbon.boundingBox();
      expect(Math.abs(box!.width / box!.height - 412 / 31)).toBeLessThan(0.01);
      await ribbon.screenshot({ path: `test-results/ribbon-after-${width}.png` });
    } else await expect(ribbon).not.toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `test-results/hero-corrected-${width}.png`, fullPage: true });
    await buttons.nth(1).click();
    await expect(page).toHaveURL(/\/paket$/);
  });
}
