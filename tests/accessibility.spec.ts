import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const route of ["/", "/layanan", "/paket", "/kontak", "/galeri", "/pendaftaran"]) {
  test(`${route} passes automated WCAG checks`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 412, height: 900 });
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    // Include content behind native disclosures in the automated audit.
    await page.locator("main details").evaluateAll(items => items.forEach(item => { (item as HTMLDetailsElement).open = true; }));
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(results.violations.map(({ id, nodes }) => ({ id, nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })) }))).toEqual([]);
  });
}
