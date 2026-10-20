import { expect, test } from "@playwright/test";

test("scroll reveal uses backwards fill, 700ms easing, group stagger and runs once", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 500 });
  await page.goto("/galeri");
  await page.waitForTimeout(350);
  const cards = page.locator("main article");
  await cards.nth(1).evaluate(el => el.scrollIntoView({ block: "center" }));
  await expect.poll(() => cards.nth(1).evaluate(el => el.getAnimations().length)).toBeGreaterThan(0);
  const timing = await cards.nth(1).evaluate(el => {
    const animation = el.getAnimations()[0];
    const effect = animation.effect!;
    const timing = effect.getTiming();
    const frames = (effect as KeyframeEffect).getKeyframes();
    return { duration: timing.duration, delay: timing.delay, fill: timing.fill, easing: timing.easing, translate: frames[0].translate };
  });
  expect(timing).toEqual({ duration: 700, delay: 75, fill: "backwards", easing: "cubic-bezier(0.22, 1, 0.36, 1)", translate: "0px 24px" });
  await page.waitForTimeout(1000);
  await page.evaluate(() => scrollTo(0, 0));
  await cards.nth(1).scrollIntoViewIfNeeded();
  expect(await cards.nth(1).evaluate(el => el.getAnimations().length)).toBe(0);
});
