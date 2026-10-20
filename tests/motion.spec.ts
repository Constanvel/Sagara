import { expect, test } from "@playwright/test";

test("persistent indicators follow routes, history, and resize", async ({ page }) => {
  await page.setViewportSize({ width: 412, height: 900 });
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Navigasi bawah" });
  const indicator = page.getByTestId("bottom-nav-indicator");
  await indicator.evaluate(el => { Object.assign(el, { motionIdentity: "bottom" }); });
  for (const name of ["Layanan", "Kontak", "Beranda", "Layanan"]) {
    await nav.getByRole("link", { name, exact: true }).click();
    await expect(nav.getByRole("link", { name, exact: true })).toHaveAttribute("aria-current", "page");
    expect(await indicator.evaluate(el => Reflect.get(el, "motionIdentity"))).toBe("bottom");
  }
  const tabs = page.getByRole("navigation", { name: "Layanan dan paket" });
  await tabs.evaluate(el => { Object.assign(el, { motionIdentity: "tabs" }); });
  for (let i = 0; i < 3; i++) {
    await tabs.getByRole("link", { name: "Paket khitan", exact: true }).click();
    await expect(page).toHaveURL(/\/paket$/);
    await tabs.getByRole("link", { name: "Layanan", exact: true }).click();
    await expect(page).toHaveURL(/\/layanan$/);
  }
  expect(await tabs.evaluate(el => Reflect.get(el, "motionIdentity"))).toBe("tabs");
  await page.goBack();
  await expect(page).toHaveURL(/\/paket$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/layanan$/);
  for (const width of [320, 768, 412]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(async () => {
      const line = await indicator.boundingBox();
      const item = await nav.getByRole("link", { name: "Layanan", exact: true }).boundingBox();
      return Math.abs((line?.x ?? 0) - (item?.x ?? 0));
    }).toBeLessThan(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test("FAQ animates while preserving accessible state", async ({ page }) => {
  await page.goto("/");
  const button = page.locator('[aria-controls="faq-answer-0"]');
  await button.scrollIntoViewIfNeeded();
  await button.click();
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#faq-answer-0")).toHaveAttribute("inert", "");
  await button.click();
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#faq-answer-0")).toBeVisible();
});

test("reduced motion removes movement and reveals remain visible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/layanan");
  const card = page.locator(".service-card").first();
  await expect(card).toBeVisible();
  expect(await page.evaluate(() => document.getAnimations().filter(a => a.playState === "running").length)).toBe(0);
  await card.focus();
  await expect(card).toBeFocused();
});
