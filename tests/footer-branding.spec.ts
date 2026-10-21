import { expect, test } from "@playwright/test";

const widths = [360, 390, 412, 768, 1280, 1440, 1920];
const routes = ["/", "/layanan", "/paket", "/galeri", "/kontak"];
const footerSource = "/images/media/sagara-rumah-sunat-modern-banteran-logo.webp";
const footerAlt = "Logo SAGARA Rumah Sunat Modern Banteran";

for (const width of widths) {
  for (const route of routes) {
    test(`footer branding and unchanged header on ${route} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(route);
      const headerLogo = page.locator("header.site-header").getByRole("link", { name: "SAGARA RUMAH SUNAT MODERN — Beranda", exact: true }).locator("img");
      const originalHeader = await headerLogo.getAttribute("src");
      expect(originalHeader).not.toBeNull();
      const headerUrl = new URL(originalHeader!, page.url());
      expect(headerUrl.searchParams.get("url") ?? headerUrl.pathname).toBe("/images/figma/sagara-header-logo.png");
      await expect(headerLogo).toHaveAttribute("alt", "");
      await expect(headerLogo).toHaveAttribute("width", "40");
      await expect(headerLogo).toHaveAttribute("height", "40");

      const footer = page.getByRole("contentinfo");
      const logo = footer.getByRole("img", { name: footerAlt, exact: true });
      await expect(logo).toHaveCount(1);
      await logo.scrollIntoViewIfNeeded();
      await expect(logo).toBeVisible();
      await expect(logo).toHaveAttribute("width", "340");
      await expect(logo).toHaveAttribute("height", "152");
      const source = await logo.getAttribute("src");
      expect(source).not.toBeNull();
      // next/image may wrap the exact asset path in its optimizer URL.
      const sourceUrl = new URL(source!, page.url());
      expect(sourceUrl.searchParams.get("url") ?? sourceUrl.pathname).toBe(footerSource);
      await expect.poll(() => logo.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
      const geometry = await logo.evaluate((image: HTMLImageElement) => {
        const box = image.getBoundingClientRect();
        const clippingAncestors: string[] = [];
        for (let ancestor = image.parentElement; ancestor; ancestor = ancestor.parentElement) {
          const style = getComputedStyle(ancestor);
          const bounds = ancestor.getBoundingClientRect();
          const clipsX = /hidden|clip|auto|scroll/.test(style.overflowX);
          const clipsY = /hidden|clip|auto|scroll/.test(style.overflowY);
          if ((clipsX && (box.left < bounds.left - 1 || box.right > bounds.right + 1)) || (clipsY && (box.top < bounds.top - 1 || box.bottom > bounds.bottom + 1))) {
            clippingAncestors.push(`${ancestor.tagName}.${ancestor.className}`);
          }
        }
        return { width: box.width, height: box.height, naturalRatio: image.naturalWidth / image.naturalHeight, objectFit: getComputedStyle(image).objectFit, clippingAncestors };
      });
      expect(geometry.width).toBeGreaterThan(0);
      expect(geometry.height).toBeGreaterThan(0);
      expect(geometry.width / geometry.height).toBeCloseTo(340 / 152, 2);
      expect(geometry.naturalRatio).toBeCloseTo(340 / 152, 2);
      expect(geometry.objectFit).toBe("contain");
      expect(geometry.clippingAncestors, "footer logo must not be clipped by its containers").toEqual([]);
      await expect(headerLogo).toHaveAttribute("src", originalHeader!);
    });
  }
}
