import { expect, test } from "@playwright/test";
import { methods } from "../src/data/home";
import { contact } from "../src/data/contact";

for (const width of [320, 412, 768, 1440]) {
  test(`Figma procedure explanations and consultation actions fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const section = page.locator("#metode");
    const cards = section.getByRole("article");
    await expect(cards).toHaveCount(3);
    for (const [index, method] of methods.entries()) {
      const card = cards.nth(index);
      await card.scrollIntoViewIfNeeded();
      await expect(card.getByRole("heading", { level: 3 })).toHaveText(method.title);
      await expect(card).toContainText(method.badge);
      await expect(card).toContainText(method.description);
      await expect(card.getByRole("listitem")).toHaveText([...method.bullets]);
      const action = card.getByRole("link");
      const url = new URL((await action.getAttribute("href"))!);
      expect(url.hostname).toBe("wa.me");
      expect(url.pathname).toBe(`/${contact.whatsappNumber}`);
      expect(url.searchParams.get("text")).toContain(method.action);
      expect(await card.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test("procedure descriptions remain server-rendered without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(baseURL!);
    const section = page.locator("#metode");
    for (const method of methods) {
      await expect(section).toContainText(method.description);
      for (const bullet of method.bullets) await expect(section).toContainText(bullet);
    }
  } finally {
    await context.close();
  }
});
