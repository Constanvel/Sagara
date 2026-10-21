import { test, expect } from "@playwright/test";

for (const width of [360, 390, 412, 768, 1280, 1440, 1920]) {
  test(`footer logo and lightweight location preview at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const footer = page.locator("footer#kontak");
    await footer.scrollIntoViewIfNeeded();
    const logo = footer.getByAltText("Logo SAGARA Rumah Sunat Modern Banteran");
    await expect(logo).toHaveAttribute("src", /sagara-footer-logo-transparan/);
    await expect.poll(() => logo.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
    const geometry = await logo.boundingBox();
    expect(geometry).not.toBeNull();
    expect(geometry!.width / geometry!.height).toBeCloseTo(1920 / 819, 1);
    const preview = footer.getByRole("link", { name: "Lihat lokasi SAGARA di Google Maps (dibuka di tab baru)", exact: true });
    await expect(preview).toHaveAttribute("href", "https://maps.app.goo.gl/e89cFM6roqapjt3dA");
    await expect(preview.getByAltText("Preview peta lokasi SAGARA di Banteran")).toHaveAttribute("loading", "lazy");
    await expect(footer.locator("iframe")).toHaveCount(0);
    await expect(footer.getByRole("navigation", { name: "Tautan penutup" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const bottom = page.getByRole("navigation", { name: "Navigasi bawah", exact: true });
    if (width < 1024) {
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      const footerBox = await footer.boundingBox();
      const navBox = await bottom.boundingBox();
      expect(footerBox!.y + footerBox!.height).toBeLessThanOrEqual(navBox!.y + 1);
    }
  });
}
