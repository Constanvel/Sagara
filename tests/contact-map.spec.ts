import { expect, test } from "@playwright/test";

test("contact map makes no third-party requests until explicitly activated", async ({ page }) => {
  const thirdParty: string[] = [];
  page.on("request", request => {
    if (new URL(request.url()).hostname !== "localhost") thirdParty.push(request.url());
  });
  await page.route("https://www.google.com/maps/**", route => route.fulfill({ contentType: "text/html", body: "Map fixture" }));
  await page.goto("/kontak");
  await expect(page.getByRole("heading", { level: 1, name: "Mari berkunjung.", exact: true })).toBeVisible();
  await expect(page.locator("main")).toContainText("SAGARA di Banteran, Sumbang");
  const trigger = page.getByRole("button", { name: "Muat peta interaktif Google Maps" });
  await trigger.scrollIntoViewIfNeeded();
  await expect(trigger.getByRole("img")).toBeVisible();
  await expect(page.locator("iframe")).toHaveCount(0);
  await page.waitForTimeout(500);
  expect(thirdParty).toEqual([]);
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByTitle("Peta lokasi SAGARA Rumah Sunat Modern Banteran")).toHaveAttribute("src", /^https:\/\/www\.google\.com\/maps\/embed/);
  await expect.poll(() => thirdParty.length).toBe(1);
});

test("contact preview and active map keep the same responsive geometry", async ({ page }) => {
  await page.route("https://www.google.com/maps/**", route => route.fulfill({ contentType: "text/html", body: "Map fixture" }));
  for (const width of [360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/kontak");
    const image = page.locator("main").getByAltText("Preview peta lokasi SAGARA di Banteran");
    await expect(image).toHaveAttribute("fetchpriority", "high");
    const bounds = await image.boundingBox();
    expect(bounds?.height).toBe(width >= 768 ? 220 : 160);
    const declared = width >= 1100 ? 455 : width >= 1024 ? (width - 190) / 2 : width >= 390 ? 295 : width - 95;
    expect(Math.abs(bounds!.width - declared)).toBeLessThan(2);
    await page.getByRole("button", { name: "Muat peta interaktif Google Maps" }).click();
    const iframe = page.getByTitle("Peta lokasi SAGARA Rumah Sunat Modern Banteran");
    await expect(iframe).toBeVisible();
    const activeBounds = await iframe.boundingBox();
    expect(activeBounds?.height).toBe(bounds?.height);
    expect(activeBounds?.width).toBe(bounds?.width);
  }
});

test("directions and local preview remain usable without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(`${baseURL}/kontak`);
    await expect(page.locator("main").getByAltText("Preview peta lokasi SAGARA di Banteran")).toBeVisible();
    await expect(page.getByRole("link", { name: "Petunjuk Arah" })).toHaveAttribute("href", "https://maps.app.goo.gl/e89cFM6roqapjt3dA");
    await expect(page.locator("iframe")).toHaveCount(0);
  } finally {
    await context.close();
  }
});
