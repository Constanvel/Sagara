import { expect, test } from "@playwright/test";

for (const width of [320, 375, 390, 412, 768, 1024, 1440, 1920]) {
  test(`updated Home artwork and About at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const about = page.locator("#tentang-sagara");
    await expect(about).toHaveAttribute("aria-labelledby", "about-title");
    await expect(about.getByRole("heading", { level: 2 })).toHaveText("Sagara RumahSunat Modern.");
    await expect(about.getByRole("button", { name: "Putar video cerita layanan Sagara" })).toBeVisible();
    await expect(about.getByText("Tidak perlu menemukan semuanya sendiri")).toBeVisible();
    for (const name of ["hero-mascot.png", "hero-mascot-outline.png", "about-chat.svg"]) {
      const image = page.locator(`img[src$="${name}"]`);
      await expect(image).toBeVisible();
      expect(await image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
    }
    const geometry = await page.locator("#hero-title").evaluate(element => {
      const box = element.getBoundingClientRect();
      return { left: box.left, right: box.right, width: element.scrollWidth, client: element.clientWidth, color: getComputedStyle(element).color };
    });
    expect(geometry.color).toBe("rgb(255, 255, 255)");
    expect(geometry.width).toBeLessThanOrEqual(geometry.client);
    const media = await about.getByRole("button", { name: "Putar video cerita layanan Sagara" }).boundingBox();
    expect(Math.abs(media!.width / media!.height - 366 / 216)).toBeLessThan(.01);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await about.scrollIntoViewIfNeeded();
    await page.screenshot({ path: `test-results/about-updated-${width}.png` });
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `test-results/home-updated-${width}.png`, fullPage: true });
    expect(errors).toEqual([]);
  });
}
