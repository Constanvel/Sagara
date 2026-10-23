import { expect, test, type Page } from "@playwright/test";

const routes = ["/", "/layanan", "/paket", "/galeri", "/kontak"];
const widths = [360, 390, 412, 768, 1440];
const storageKey = "sagara_consultation_dismissed";
const message = "Halo, Admin SAGARA! 👋 Saya ingin berkonsultasi mengenai layanan khitan di SAGARA Rumah Sunat Modern. Boleh saya mendapatkan informasi mengenai pilihan layanan, persiapan, jadwal yang tersedia, dan estimasi biaya? Terima kasih.";
const whatsappUrl = `https://wa.me/6287899777219?text=${encodeURIComponent(message)}`;
const root = (page: Page) => page.getByTestId("floating-consultation");
const bubble = (page: Page) => page.getByRole("region", { name: "Konsultasi SAGARA", exact: true });
const whatsapp = (page: Page) => root(page).getByRole("link", { name: "Konsultasi melalui WhatsApp (dibuka di tab baru)", exact: true });
const close = (page: Page) => page.getByRole("button", { name: "Tutup notifikasi konsultasi", exact: true });

async function expectSafeGeometry(page: Page) {
  const bounds = await root(page).boundingBox();
  expect(bounds).not.toBeNull();
  const viewport = page.viewportSize()!;
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.y).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(viewport.width + 1);
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(viewport.height + 1);
  const navigation = page.getByRole("navigation", { name: "Navigasi bawah", exact: true });
  if (await navigation.isVisible()) {
    const navigationBounds = await navigation.boundingBox();
    expect(navigationBounds).not.toBeNull();
    expect(navigationBounds!.height).toBeGreaterThanOrEqual(69);
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(navigationBounds!.y + 1);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

for (const route of routes) {
  for (const width of widths) {
    test(`floating consultation on ${route} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(route);
      await expect(root(page)).toBeVisible();
      await expect(whatsapp(page)).toHaveAttribute("href", whatsappUrl);
      await expect(whatsapp(page)).toHaveAttribute("target", "_blank");
      const rel = (await whatsapp(page).getAttribute("rel"))?.split(/\s+/) ?? [];
      expect(rel).toEqual(expect.arrayContaining(["noopener", "noreferrer"]));
      const url = new URL((await whatsapp(page).getAttribute("href"))!);
      expect(url.hostname).toBe("wa.me");
      expect(url.pathname).toBe("/6287899777219");
      expect(url.searchParams.get("text")).toBe(message);
      await expect(bubble(page)).toBeVisible({ timeout: 7000 });
      await expect(close(page)).toBeVisible();
      await expectSafeGeometry(page);
      const target = await whatsapp(page).boundingBox();
      expect(target!.width).toBeGreaterThanOrEqual(44);
      expect(target!.height).toBeGreaterThanOrEqual(44);
      await whatsapp(page).focus();
      await expect(whatsapp(page)).toBeFocused();

      // The widget stays viewport anchored even when the footer enters view.
      const baseline = await root(page).boundingBox();
      expect(baseline).not.toBeNull();
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await expect(page.locator("footer")).toBeInViewport();
      await expect(root(page)).toBeVisible();
      await expect(whatsapp(page)).toBeVisible();
      await expect(bubble(page)).toBeVisible();
      await expect.poll(async () => {
        const widgetBounds = await root(page).boundingBox();
        return widgetBounds === null ? Infinity : Math.abs(widgetBounds.y - baseline!.y);
      }).toBeLessThan(2);
      await expectSafeGeometry(page);
    });
  }
}

test("consultation notification waits two seconds after window load", async ({ page }) => {
  const time = new Date("2026-10-21T12:00:00Z");
  await page.clock.install({ time });
  await page.clock.pauseAt(time);
  await page.goto("/", { waitUntil: "load" });
  await expect(root(page)).toBeVisible();
  await expect(whatsapp(page)).toBeVisible();
  await expect(bubble(page)).not.toBeVisible();
  await page.clock.runFor(1999);
  await expect(bubble(page)).not.toBeVisible();
  await page.clock.runFor(1);
  await expect(bubble(page)).toBeVisible();
});

test("dismissal persists through reload, client navigation and another tab", async ({ page, context }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/");
  await expect(bubble(page)).toBeVisible({ timeout: 7000 });
  await close(page).click();
  await expect(bubble(page)).not.toBeVisible();
  expect(await page.evaluate(key => localStorage.getItem(key), storageKey)).toBe("true");
  await expect(whatsapp(page)).toBeVisible();
  await page.reload();
  await expect(root(page)).toBeVisible();
  await page.waitForTimeout(2300);
  await expect(bubble(page)).not.toBeVisible();
  await expect(whatsapp(page)).toBeVisible();

  // A window marker distinguishes Next.js client navigation from a full reload.
  await page.evaluate(() => Object.assign(window, { consultationNavigationMarker: "retained" }));
  await page.getByRole("navigation", { name: "Navigasi bawah", exact: true })
    .getByRole("link", { name: "Galeri", exact: true }).click();
  await expect(page).toHaveURL(/\/galeri$/);
  expect(await page.evaluate(() => Reflect.get(window, "consultationNavigationMarker"))).toBe("retained");
  await page.waitForTimeout(2300);
  await expect(bubble(page)).not.toBeVisible();
  await expect(whatsapp(page)).toBeVisible();

  const anotherPage = await context.newPage();
  try {
    await anotherPage.goto("/kontak");
    await expect(root(anotherPage)).toBeVisible();
    await anotherPage.waitForTimeout(2300);
    await expect(bubble(anotherPage)).not.toBeVisible();
    await expect(whatsapp(anotherPage)).toBeVisible();
    expect(await anotherPage.evaluate(key => localStorage.getItem(key), storageKey)).toBe("true");
  } finally {
    await anotherPage.close();
  }
});

test("blocked localStorage does not break rendering or dismissal", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() { throw new DOMException("Storage access denied", "SecurityError"); },
    });
  });
  await page.goto("/");
  await expect(bubble(page)).toBeVisible({ timeout: 7000 });
  await close(page).click();
  await expect(bubble(page)).not.toBeVisible();
  await expect(whatsapp(page)).toBeVisible();
  await expect(whatsapp(page)).toHaveAttribute("href", whatsappUrl);
  await page.reload();
  await expect(bubble(page)).toBeVisible({ timeout: 7000 });
  expect(errors).toEqual([]);
});

test("mobile menu suppresses the entire widget and closing restores it", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/");
  await expect(bubble(page)).toBeVisible({ timeout: 7000 });
  const toggle = page.locator('[aria-controls="mobile-menu"]');
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(root(page)).not.toBeVisible();
  await expect(whatsapp(page)).not.toBeVisible();
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(root(page)).toBeVisible();
  await expect(bubble(page)).toBeVisible();
  expect(await page.evaluate(key => localStorage.getItem(key), storageKey)).toBeNull();
});

for (const width of [390, 1440]) {
  test(`media dialog suppresses the entire widget at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/galeri");
    await expect(bubble(page)).toBeVisible({ timeout: 7000 });
    const trigger = page.locator("article[data-media-type='photo'] button").first();
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(root(page)).not.toBeVisible();
    await expect(whatsapp(page)).not.toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(root(page)).toBeVisible();
    await expect(bubble(page)).toBeVisible();
    expect(await page.evaluate(key => localStorage.getItem(key), storageKey)).toBeNull();
  });
}
