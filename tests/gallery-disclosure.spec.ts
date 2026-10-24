import { expect, test } from "@playwright/test";
import { galleryMedia } from "../src/data/media";

for (const [filter, initial, total] of [["Semua", 3, 29], ["Foto", 6, 24], ["Video", 2, 5]] as const) {
  test(`${filter} keeps the complete collection behind a native disclosure`, async ({ page }) => {
    await page.goto("/galeri");
    await page.getByRole("button", { name: filter, exact: true }).click();
    const cards = page.locator("article[data-media-id]");
    const details = page.locator("main details");
    const summary = details.locator("summary");
    await expect(cards).toHaveCount(total);
    await expect(page.locator("article[data-media-id]:visible")).toHaveCount(initial);
    await expect(summary).toHaveText(`Lihat media lainnya (${total - initial} media)`);
    await expect(details.locator("img[loading='lazy']")).toHaveCount(total - initial);
    expect(await details.evaluate(el => el.previousElementSibling?.tagName)).toBe("ASIDE");
    expect(await page.locator("[data-gallery-mode]").evaluateAll(elements => elements.map(el => el.getAttribute("data-gallery-mode")))).toEqual([filter, filter]);
    await summary.click();
    await expect(page.locator("article[data-media-id]:visible")).toHaveCount(total);
    await summary.click();
    await cards.first().getByRole("button").click();
    const dialog = page.getByRole("dialog");
    await dialog.getByRole("button", { name: "Sebelumnya" }).click();
    await expect(dialog.getByText(`${total} dari ${total}`, { exact: true })).toBeVisible();
    const filtered = filter === "Foto" ? galleryMedia.filter(item => item.type === "photo") : filter === "Video" ? galleryMedia.filter(item => item.type === "video") : null;
    if (filtered) await expect(dialog.getByRole("heading")).toHaveText(filtered.at(-1)!.title);
    await page.keyboard.press("Escape");
    await expect(cards.first().getByRole("button")).toBeFocused();
    await expect(details).not.toHaveAttribute("open", "");
    await summary.click();
    await page.getByRole("button", { name: "Foto", exact: true }).click();
    await expect(details).not.toHaveAttribute("open", "");
  });
}

test("a launcher hidden while its modal is open restores focus to the summary", async ({ page }) => {
  await page.goto("/galeri");
  const summary = page.locator("main details > summary");
  await summary.click();
  await page.locator("main details article button").first().click();
  await page.locator("main details").evaluate((el: HTMLDetailsElement) => { el.open = false; });
  await page.keyboard.press("Escape");
  await expect(summary).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
});
