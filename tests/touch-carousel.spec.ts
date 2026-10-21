import { expect, test } from "@playwright/test";

test("native touch swipe changes slides; vertical touch scroll preserves slide", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto("/");
  const carousel = page.getByRole("region", { name: "Cerita jagoan Sagara" });
  await carousel.scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  const box = await carousel.boundingBox();
  const y = box!.y + 80;
  const session = await context.newCDPSession(page);
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 280, y }] });
  for (let x = 260; x >= 100; x -= 20) await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y }] });
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect(carousel.getByRole("button", { name: "Tampilkan foto 2", exact: true })).toHaveAttribute("aria-pressed", "true");
  const before = await page.evaluate(() => scrollY);
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 180, y: y + 100 }] });
  for (let delta = 20; delta <= 100; delta += 20) await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 182, y: y + 100 - delta }] });
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before);
  await expect(carousel.getByRole("button", { name: "Tampilkan foto 2", exact: true })).toHaveAttribute("aria-pressed", "true");
  await context.close();
});
