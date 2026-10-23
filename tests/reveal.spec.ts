import { expect, test } from "@playwright/test";
import { motion } from "../src/lib/motion";

async function ready(page: import("@playwright/test").Page) {
  await page.goto("/galeri");
  // Wait for client effects, not merely server-rendered card visibility.
  await expect(page.getByRole("region", { name: "Konsultasi SAGARA", exact: true })).toBeVisible({ timeout: 7000 });
}

test("offscreen reveals are prepared before entry, have no stagger and run once", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 500 });
  await ready(page);
  const cards = page.locator("main article[data-media-id]");
  const card = cards.nth(6);
  await expect.poll(() => card.evaluate(el => el.getAnimations()[0]?.playState)).toBe("paused");
  const timing = await card.evaluate(el => {
    const animation = el.getAnimations()[0];
    const effect = animation.effect as KeyframeEffect;
    const timing = effect.getTiming();
    return { duration: timing.duration, delay: timing.delay, fill: timing.fill, easing: timing.easing, translate: effect.getKeyframes()[0].translate, opacity: getComputedStyle(el).opacity };
  });
  expect(timing).toEqual({ duration: motion.reveal, delay: 0, fill: "backwards", easing: motion.ease, translate: `0px ${motion.revealDistance}px`, opacity: "0" });
  await card.evaluate((el, distance) => {
    const naturalTop = el.getBoundingClientRect().top + scrollY - distance;
    scrollTo({ top: naturalTop - (innerHeight - 20), behavior: "instant" });
  }, motion.revealDistance);
  await expect.poll(() => card.evaluate(el => el.getAnimations()[0]?.playState)).toBe("running");
  await expect.poll(() => card.evaluate(el => el.getAnimations().length)).toBe(0);
  await expect(card).toHaveCSS("opacity", "1");
  await page.evaluate(() => scrollTo(0, 0));
  await card.scrollIntoViewIfNeeded();
  expect(await card.evaluate(el => el.getAnimations().length)).toBe(0);
});

test("initial viewport stays painted and scroll jumps reveal content immediately", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await ready(page);
  await expect(page.locator("main article").first()).toHaveCSS("opacity", "1");
  expect(await page.locator("main article").first().evaluate(el => el.getAnimations().length)).toBe(0);
  const card = page.locator("main article[data-media-id]").nth(12);
  await card.evaluate(el => el.scrollIntoView({ block: "center", behavior: "instant" }));
  await expect(card).toHaveCSS("opacity", "1");
  await expect.poll(() => card.evaluate(el => el.getAnimations().length)).toBe(0);
});

test("new filter cards are registered and live reduced motion clears paused reveals", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 500 });
  await ready(page);
  await page.getByRole("button", { name: "Foto", exact: true }).click();
  await expect(page.locator('main article[data-media-type="video"]')).toHaveCount(0);
  await page.getByRole("button", { name: "Video", exact: true }).click();
  const last = page.locator('main article[data-media-type="video"]').last();
  await expect.poll(() => last.evaluate(el => el.getAnimations()[0]?.playState)).toBe("paused");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => page.locator("main article").evaluateAll(elements => elements.every(el => getComputedStyle(el).opacity === "1" && el.getAnimations().length === 0))).toBe(true);
});

test("live reduced motion clears running reveals as well as pending targets", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 500 });
  await ready(page);
  const card = page.locator("main article[data-media-id]").nth(6);
  await card.evaluate((el, distance) => {
    scrollTo({ top: el.getBoundingClientRect().top + scrollY - distance - (innerHeight - 20), behavior: "instant" });
  }, motion.revealDistance);
  await expect.poll(() => card.evaluate(el => el.getAnimations()[0]?.playState)).toBe("running");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(card).toHaveCSS("opacity", "1");
  await expect.poll(() => page.locator("main article").evaluateAll(elements => elements.every(el => el.getAnimations().length === 0))).toBe(true);
});

for (const support of ["missing", "throws", "no-observer", "legacy-media-query"] as const) {
  test(`reveal fails open when animation support is ${support}`, async ({ page }) => {
    await page.addInitScript(value => {
      if (value === "legacy-media-query") {
        const original = window.matchMedia.bind(window);
        window.matchMedia = query => {
          const result = original(query);
          Object.defineProperty(result, "addEventListener", { value: undefined });
          return result;
        };
      } else if (value === "no-observer") Reflect.deleteProperty(window, "IntersectionObserver");
      else Object.defineProperty(Element.prototype, "animate", { configurable: true, value: value === "missing" ? undefined : () => { throw new Error("Animation unavailable"); } });
    }, support);
    await ready(page);
    expect(await page.locator("main article").evaluateAll(elements => elements.every(el => getComputedStyle(el).opacity === "1"))).toBe(true);
  });
}

test("cards in the same desktop row enter together without index delays", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await ready(page);
  const pair = await page.locator("main article[data-media-id]").evaluateAll(elements => {
    for (let index = 1; index < elements.length - 1; index++) {
      const a = elements[index].getBoundingClientRect();
      const b = elements[index + 1].getBoundingClientRect();
      if (a.top > innerHeight + 100 && Math.abs(a.top - b.top) < 2) return [index, index + 1];
    }
    return [];
  });
  expect(pair).toHaveLength(2);
  await page.locator("main article[data-media-id]").nth(pair[0]).evaluate((el, distance) => {
    scrollTo({ top: el.getBoundingClientRect().top + scrollY - distance - (innerHeight - 20), behavior: "instant" });
  }, motion.revealDistance);
  const times = await page.locator("main article[data-media-id]").evaluateAll((elements, indices) => indices.map(index => {
    const animation = elements[index].getAnimations()[0];
    return { delay: animation.effect!.getTiming().delay };
  }), pair);
  expect(times.map(timing => timing.delay)).toEqual([0, 0]);
  await expect.poll(() => page.locator("main article[data-media-id]").evaluateAll((elements, indices) => indices.every(index => getComputedStyle(elements[index]).opacity === "1"), pair)).toBe(true);
});

test("client navigation and restored gallery scroll leave viewport cards visible", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 500 });
  await ready(page);
  await page.locator("main article[data-media-id]").nth(12).scrollIntoViewIfNeeded();
  await page.locator('footer a[href="/kebijakan-privasi"]').click();
  await expect(page).toHaveURL(/kebijakan-privasi$/);
  await page.goBack();
  await expect(page).toHaveURL(/galeri$/);
  await expect.poll(() => page.locator("main article[data-media-id]").evaluateAll(elements => {
    const visible = elements.filter(el => { const box = el.getBoundingClientRect(); return box.top < innerHeight - 120 && box.bottom > 0; });
    return visible.length > 0 && visible.every(el => getComputedStyle(el).opacity === "1");
  })).toBe(true);
});

test("keyboard focus releases an offscreen reveal", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 500 });
  await ready(page);
  const card = page.locator("main article[data-media-id]").nth(6);
  await card.locator("button").focus();
  await expect(card).toHaveCSS("opacity", "1");
  expect(await card.evaluate(el => el.getAnimations().length)).toBe(0);
});
