import { test, expect } from "@playwright/test";

test("gallery filtering releases detached intersection targets", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 900 });
  await page.addInitScript(() => {
    const Native = window.IntersectionObserver;
    const targets = new Set<Element>();
    (window as unknown as { __observed: Set<Element> }).__observed = targets;
    window.IntersectionObserver = class extends Native {
      private own = new Set<Element>();
      observe(element: Element) { this.own.add(element); targets.add(element); super.observe(element); }
      unobserve(element: Element) { this.own.delete(element); targets.delete(element); super.unobserve(element); }
      disconnect() { this.own.forEach(element => targets.delete(element)); this.own.clear(); super.disconnect(); }
    };
  });
  await page.goto("/galeri");
  await expect(page.getByRole("region", { name: "Konsultasi SAGARA", exact: true })).toBeVisible({ timeout: 7000 });
  await page.evaluate(() => {
    const cards = [...document.querySelectorAll("main article")];
    Object.assign(window, { __removedRevealCards: cards, __oldRevealAnimations: cards.flatMap(card => card.getAnimations()) });
  });
  await page.getByRole("button", { name: "Video", exact: true }).click();
  await expect.poll(() => page.evaluate(() => [...(window as unknown as { __observed: Set<Element> }).__observed].filter(element => !element.isConnected).length)).toBe(0);
  await expect.poll(() => page.evaluate(() => {
    const cards = Reflect.get(window, "__removedRevealCards") as Element[];
    return cards.filter(card => !card.isConnected).every(card => card.getAnimations().length === 0);
  })).toBe(true);
  // Completed reveals also stop retaining targets after scrolling through the page.
  for (let index = 0; index < 6; index++) {
    await page.evaluate(() => window.scrollBy(0, innerHeight));
    await page.waitForTimeout(100);
  }
  await expect.poll(() => page.evaluate(() => [...(window as unknown as { __observed: Set<Element> }).__observed].filter(element => !element.isConnected).length)).toBe(0);
  await expect.poll(() => page.evaluate(() => [...(window as unknown as { __observed: Set<Element> }).__observed].filter(element => element.closest("main")).length)).toBe(0);
  await page.locator('footer a[href="/kebijakan-privasi"]').click();
  await expect(page).toHaveURL(/kebijakan-privasi$/);
  await expect.poll(() => page.evaluate(() => {
    const animations = Reflect.get(window, "__oldRevealAnimations") as Animation[];
    return animations.every(animation => animation.playState === "idle");
  })).toBe(true);
  await page.evaluate(() => {
    Reflect.deleteProperty(window, "__removedRevealCards");
    Reflect.deleteProperty(window, "__oldRevealAnimations");
  });
});
