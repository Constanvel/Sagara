import { expect, test } from "@playwright/test";

for (const width of [412, 1440]) {
  test(`catalog navigation and browser history at ${width}px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: width < 1024 ? "Navigasi bawah" : "Navigasi utama" });
    await nav.getByRole("link", { name: "Layanan", exact: true }).click();
    await expect(page).toHaveURL(/\/layanan$/);
    await expect(nav.getByRole("link", { name: "Layanan", exact: true })).toHaveAttribute("aria-current", "page");
    const tabs = page.getByRole("navigation", { name: "Layanan dan paket" });
    await tabs.getByRole("link", { name: /Paket khitan/i }).click();
    await expect(page).toHaveURL(/\/paket$/);
    await expect(nav.getByRole("link", { name: "Layanan", exact: true })).toHaveAttribute("aria-current", "true");
    await expect(nav.getByRole("link", { name: "Paket Khitan", exact: true })).toHaveCount(0);
    await expect(tabs.getByRole("link", { name: /Paket khitan/i })).toHaveAttribute("aria-current", "page");
    await expect(page.getByText("Rp1.100.000", { exact: true })).toBeVisible();
    await page.goBack();
    await expect(page).toHaveURL(/\/layanan$/);
    await nav.getByRole("link", { name: "Kontak", exact: true }).click();
    await expect(page).toHaveURL(/\/kontak$/);
    await expect(nav.getByRole("link", { name: "Kontak", exact: true })).toHaveAttribute("aria-current", "page");
  });
}

test("mobile menu locks scroll and restores focus", async ({ page }) => {
  await page.setViewportSize({ width: 412, height: 900 });
  await page.goto("/layanan");
  const button = page.getByRole("button", { name: "Buka menu" });
  await button.click();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");
  await page.keyboard.press("Escape");
  await expect(button).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
  await button.click();
  await page.getByRole("navigation", { name: "Menu seluler" }).getByRole("link", { name: "Kontak" }).click();
  await expect(page).toHaveURL(/\/kontak$/);
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
});

test("consultation links use verified number and distinct messages", async ({ page }) => {
  for (const route of ["/layanan", "/paket", "/kontak"]) {
    await page.goto(route);
    const links = await page.locator('main a[href^="https://wa.me/"]').all();
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) await expect(link).toHaveAttribute("href", /^https:\/\/wa\.me\/6287899777219\?text=.+/);
    if (route === "/paket") {
      const urls = await Promise.all(links.map(link => link.getAttribute("href")));
      expect(new Set(urls).size).toBe(2);
    }
  }
  await expect(page.getByText("Petunjuk Arah", { exact: false }).first()).toBeVisible();
  const directions = page.getByRole("link", { name: "Petunjuk Arah" });
  await expect(directions).toHaveAttribute("href", "https://maps.app.goo.gl/e89cFM6roqapjt3dA");
  await expect(directions).toHaveAttribute("target", "_blank");
  await expect(directions).toHaveAttribute("rel", "noopener noreferrer");
  await expect(page.getByTitle("Peta lokasi SAGARA Rumah Sunat Modern Banteran")).toHaveAttribute(
    "src",
    "https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1s-7.362495,109.2655145!6i16",
  );
  await expect(page.getByText("Konfirmasi alamat lengkap kepada admin sebelum berkunjung.", { exact: false })).toBeVisible();
});

test("reduced motion keeps content visible and stops entrance animations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of ["/", "/layanan", "/paket", "/kontak"]) {
    await page.goto(route);
    await expect(page.locator("h1")).toBeVisible();
    expect(await page.evaluate(() => document.getAnimations().filter(animation => animation.playState === "running").length)).toBe(0);
  }
});
