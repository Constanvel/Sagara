import { test, expect } from "@playwright/test";
import { packageCaveat, packagePriceLabel, packages } from "../src/data/packages";

test("package copy keeps reference prices, features, and both actions", async ({ page }) => {
  await page.goto("/paket");
  await expect(page.getByRole("heading", { level: 1, name: "Pilihan untuk keluarga.", exact: true })).toBeVisible();
  await expect(page.locator("main")).toContainText("paket khitan SAGARA");
  for (const sentence of packageCaveat.split(". ")) await expect(page.locator("main")).toContainText(sentence);
  for (const item of packages) {
    const card = page.getByRole("article", { name: item.name, exact: true });
    await expect(card).toContainText(packagePriceLabel(item));
    await expect(card.getByRole("listitem")).toHaveCount(2);
    for (const feature of item.features) await expect(card).toContainText(feature);
    const registration = card.getByRole("link", { name: `Daftar ${item.name}` });
    await expect(registration).toHaveAttribute("href", `/pendaftaran?paket=${item.id}`);
    expect((await registration.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    await expect(card.getByRole("link", { name: item.actionLabel })).toHaveAttribute("href", /^https:\/\/wa\.me\//);
    await expect(card.locator("a a")).toHaveCount(0);
  }
});

for (const width of [360, 390, 412, 768, 1280, 1440, 1920]) {
  test(`package actions align within their background at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/paket");
    const actions = page.locator('article a[target="_blank"]');
    await expect(actions).toHaveCount(2);
    for (const action of await actions.all()) {
      const geometry = await action.evaluate(element => {
        const box = element.getBoundingClientRect();
        const icon = element.querySelector("img")!.getBoundingClientRect();
        const text = document.createRange(); text.selectNode(element.firstChild!);
        const label = text.getBoundingClientRect();
        return { height: box.height, iconCenter: (icon.top + icon.bottom) / 2, textCenter: (label.top + label.bottom) / 2, center: (box.top + box.bottom) / 2 };
      });
      expect(geometry.height).toBeGreaterThanOrEqual(44);
      expect(Math.abs(geometry.iconCenter - geometry.center)).toBeLessThan(2);
      expect(Math.abs(geometry.textCenter - geometry.center)).toBeLessThan(4);
    }
  });
}
