import { test, expect } from "@playwright/test";

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
