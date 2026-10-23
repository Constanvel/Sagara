import { expect, test, type Page } from "@playwright/test";

async function expectActiveFAQ(page: Page, activeIndex: number | null) {
  const items = page.locator("[data-faq-item]");
  expect(await items.count()).toBeGreaterThan(1);
  for (let index = 0; index < await items.count(); index++) {
    const open = index === activeIndex;
    const button = items.nth(index).getByRole("button");
    const panel = items.nth(index).locator(".faq-panel");
    await expect(button).toHaveAttribute("aria-expanded", String(open));
    await expect(button).toHaveAttribute("aria-controls", `faq-answer-${index}`);
    await expect(panel).toHaveAttribute("aria-labelledby", `faq-question-${index}`);
    await expect(panel).toHaveAttribute("aria-hidden", String(!open));
    await expect(panel).toHaveAttribute("data-open", String(open));
    if (open) {
      await expect(panel).not.toHaveAttribute("inert");
      await expect(panel).toBeVisible();
      await expect.poll(() => panel.evaluate(el => el.getBoundingClientRect().height)).toBeGreaterThan(0);
    } else {
      await expect(panel).toHaveAttribute("inert", "");
      await expect(panel).toBeHidden();
      await expect.poll(() => panel.evaluate(el => el.getBoundingClientRect().height)).toBe(0);
    }
  }
}

test("FAQ explains preparation, aftercare boundaries, and booking confirmation", async ({ page }) => {
  await page.goto("/");
  const preparation = page.getByRole("button", { name: "Apa yang perlu disiapkan sebelum kunjungan?", exact: true });
  await preparation.click();
  await expect(page.locator(".faq-panel[aria-hidden='false']")).toContainText("jangan mengubah obat atau berpuasa tanpa arahan tenaga medis");
  await page.getByRole("button", { name: "Apakah mengisi formulir langsung memastikan jadwal?", exact: true }).click();
  await expect(page.locator(".faq-panel[aria-hidden='false']")).toContainText("setelah menyetujui berbagi data");
  await expect(page.locator(".faq-panel[aria-hidden='false']")).toContainText("perlu dikonfirmasi oleh admin");
  await page.getByRole("button", { name: "Bagaimana perawatan setelah khitan?", exact: true }).click();
  await expect(page.locator(".faq-panel[aria-hidden='false']")).toContainText("kondisi darurat memerlukan pertolongan medis segera");
});

test("FAQ starts entirely closed and only one answer can open", async ({ page }) => {
  await page.goto("/");
  await expectActiveFAQ(page, null);
  const buttons = page.locator("[data-faq-item] button");
  await buttons.nth(0).click();
  await expectActiveFAQ(page, 0);
  await buttons.nth(1).click();
  await expectActiveFAQ(page, 1);
  await buttons.nth(1).click();
  await expectActiveFAQ(page, null);
  await buttons.nth(0).click();
  await expectActiveFAQ(page, 0);
});

test("FAQ supports Tab, Enter and Space without moving focus on switching", async ({ page }) => {
  await page.goto("/");
  const buttons = page.locator("[data-faq-item] button");
  await buttons.nth(0).focus();
  await page.keyboard.press("Enter");
  await expectActiveFAQ(page, 0);
  await expect(buttons.nth(0)).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(buttons.nth(1)).toBeFocused();
  await page.keyboard.press("Space");
  await expectActiveFAQ(page, 1);
  await expect(buttons.nth(1)).toBeFocused();
  await page.keyboard.press("Space");
  await expectActiveFAQ(page, null);
  await expect(buttons.nth(1)).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(buttons.nth(0)).toBeFocused();
  await page.keyboard.press("Enter");
  await expectActiveFAQ(page, 0);
  await page.keyboard.press("Enter");
  await expectActiveFAQ(page, null);
});

test("FAQ preserves exclusive toggling with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expectActiveFAQ(page, null);
  const buttons = page.locator("[data-faq-item] button");
  for (const index of [0, 1]) {
    await buttons.nth(index).click();
    await expectActiveFAQ(page, index);
  }
  const durations = await page.locator(".faq-panel, .faq-symbol-vertical").evaluateAll(elements =>
    elements.flatMap(el => getComputedStyle(el).transitionDuration.split(",").map(value => Number.parseFloat(value))),
  );
  expect(durations.length).toBeGreaterThan(0);
  expect(durations.every(duration => duration <= 0.001)).toBe(true);
  await buttons.nth(1).press("Enter");
  await expectActiveFAQ(page, null);
});
