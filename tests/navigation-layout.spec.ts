import { expect, test } from "@playwright/test";

for (const height of [900, 360]) {
  test(`mobile chrome stays reachable while scrolling at ${height}px`, async ({ page }) => {
    await page.setViewportSize({ width: 412, height });
    await page.goto("/layanan");
    await page.evaluate(() => window.scrollTo({ top: 400, behavior: "instant" }));
    const header = page.locator(".site-header");
    const bottom = page.getByRole("navigation", { name: "Navigasi bawah" });
    await expect.poll(async () => (await header.boundingBox())?.y).toBe(0);
    const bar = await bottom.boundingBox();
    expect(bar!.y + bar!.height).toBe(height);
    expect(await page.evaluate(() => parseFloat(getComputedStyle(document.body).paddingBottom))).toBeGreaterThanOrEqual(bar!.height);
    await page.getByRole("button", { name: "Buka menu" }).click();
    const menu = page.getByRole("navigation", { name: "Menu seluler" });
    const menuBox = await menu.boundingBox();
    expect(menuBox!.y + menuBox!.height).toBeLessThanOrEqual(bar!.y);
    await menu.evaluate(element => { element.scrollTop = element.scrollHeight; });
    await expect(menu.getByRole("link", { name: "Lokasi & Kontak" })).toBeInViewport();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Buka menu" })).toBeFocused();
  });
}

test("menu closes on desktop resize and releases scroll lock", async ({ page }) => {
  await page.setViewportSize({ width: 412, height: 900 });
  await page.goto("/paket");
  await page.getByRole("button", { name: "Buka menu" }).click();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
  await expect(page.getByRole("navigation", { name: "Navigasi utama" }).getByRole("link", { name: "Layanan", exact: true })).toHaveAttribute("aria-current", "true");
});

test("every route renders one shared footer outside main", async ({ page }) => {
  for (const route of ["/", "/layanan", "/paket", "/galeri", "/kontak"]) {
    await page.goto(route);
    await expect(page.getByRole("contentinfo")).toHaveCount(1);
    await expect(page.locator("main footer")).toHaveCount(0);
  }
});

test("service shield viewport centers the actual artwork without offsets", async ({ page }) => {
  await page.goto("/layanan");
  const shield = page.locator('img[src$="/service-security.svg"]');
  await expect(shield).toHaveAttribute("width", "22");
  await expect(shield).toHaveAttribute("height", "28");
  const centering = await shield.evaluate(image => {
    const icon = image.getBoundingClientRect();
    const slot = image.parentElement!.getBoundingClientRect();
    return { x: Math.abs(icon.x + icon.width / 2 - slot.x - slot.width / 2), y: Math.abs(icon.y + icon.height / 2 - slot.y - slot.height / 2) };
  });
  expect(centering.x).toBeLessThanOrEqual(1);
  expect(centering.y).toBeLessThanOrEqual(1);
  const svg = await (await page.request.get("/images/figma/service-security.svg")).text();
  expect(svg).toContain('viewBox="0 3 24 30"');
  expect(svg).toContain('preserveAspectRatio="xMidYMid meet"');
});
