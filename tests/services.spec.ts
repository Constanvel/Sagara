import { expect, test } from "@playwright/test";
import { services } from "../src/data/services";
import { contact } from "../src/data/contact";
import { needs } from "../src/data/home";

test("confirmed service identities are distinct and match home labels", () => {
  expect(services.map(service => service.id)).toEqual([
    "anak-anak", "bayi", "dewasa", "kebutuhan-khusus", "khitan-gemuk",
  ]);
  expect(new Set(services.map(service => service.title)).size).toBe(services.length);
  expect(services.map(service => service.title)).toEqual(needs.map(need => need.title));
  expect(services.find(service => service.id === "dewasa")?.title).toBe("Khitan Dewasa");
  expect(services.find(service => service.id === "kebutuhan-khusus")?.title).toBe("Khitan Kebutuhan Khusus");
  expect(services.find(service => service.id === "khitan-gemuk")).toMatchObject({
    title: "Khitan Gemuk",
    description: "Penilaian kondisi untuk memilih pendekatan yang sesuai.",
    icon: "imgAccessibility.svg",
  });
});

test("services retain distinct registration and WhatsApp actions", async ({ page }) => {
  await page.goto("/layanan");
  await expect(page.getByRole("heading", { level: 1, name: "Pilihan layanan untuk keluarga.", exact: true })).toBeVisible();
  await expect(page.locator("main")).toContainText("layanan khitan SAGARA");
  for (const service of services) {
    const card = page.locator(`article[aria-labelledby="service-${service.id}"]`);
    await expect(card).toBeVisible();
    const register = card.getByRole("link", { name: `Daftar layanan ${service.title}`, exact: true });
    await expect(register).toHaveAttribute("href", `/pendaftaran?layanan=${service.id}`);
    const consultation = card.locator('a[target="_blank"]');
    const href = new URL((await consultation.getAttribute("href"))!);
    expect(href.pathname).toBe(`/${contact.whatsappNumber}`);
    expect(href.searchParams.get("text")).toBe(service.message);
    await expect(card.locator("a a")).toHaveCount(0);
    for (const action of [register, consultation]) {
      const bounds = await action.boundingBox();
      expect(bounds!.height).toBeGreaterThanOrEqual(44);
    }
  }
  await expect(page.locator('article[aria-labelledby="service-kebutuhan-khusus"]')).toHaveCount(1);
  const gemuk = page.locator('article[aria-labelledby="service-khitan-gemuk"]');
  await expect(gemuk).toHaveCount(1);
  await expect(gemuk.locator("img").first()).toHaveAttribute("src", "/images/figma/service-body-assessment.svg");
  await expect(gemuk.locator("img").first()).toHaveJSProperty("naturalWidth", 22);
  await expect(page.locator('article[aria-labelledby="service-kebutuhan-khusus-pendampingan"]')).toHaveCount(0);
});

test("desktop service registration actions align within each grid row", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/layanan");
  await page.evaluate(() => document.fonts.ready);
  const positions = await page.locator('article[aria-labelledby^="service-"]').evaluateAll(cards => cards.map(card => ({
    row: card.getBoundingClientRect().top,
    action: card.querySelector('a[href^="/pendaftaran"]')!.getBoundingClientRect().top,
  })));
  for (const first of positions) {
    for (const second of positions.filter(item => Math.abs(item.row - first.row) < 1)) {
      expect(Math.abs(first.action - second.action)).toBeLessThanOrEqual(1);
    }
  }
});
