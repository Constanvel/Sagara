import { expect, test } from "@playwright/test";

for (const width of [412, 1440]) {
  test(`Paket is a CTA destination, not a navigation item at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(await page.locator('header a[href="/paket"]').count()).toBe(0);
    if (width >= 1024) {
      const nav = page.getByRole("navigation", { name: "Navigasi utama" });
      await expect(nav.getByRole("link", { name: "Beranda" })).toBeVisible();
      await expect(nav.getByRole("link", { name: "Layanan" })).toBeVisible();
      await expect(nav.getByText("Galeri")).toBeVisible();
      await expect(nav.getByRole("link", { name: "Kontak" })).toBeVisible();
    }
    await page.getByRole("link", { name: "Lihat paket" }).click();
    await expect(page).toHaveURL(/\/paket$/);
    await expect(page.getByRole("heading", { name: "Pilihan untuk keluarga." })).toBeVisible();
  });
}

test("reduced motion keeps content visible and stops entrance animations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  expect(await page.evaluate(() => document.getAnimations().filter(animation => animation.playState === "running").length)).toBe(0);
});
