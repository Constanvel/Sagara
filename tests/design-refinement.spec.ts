import { expect, test } from "@playwright/test";

for (const width of [320, 360, 390, 412, 768, 1024, 1280, 1440, 1920]) {
  test(`refined layouts remain readable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const route of ["/", "/layanan", "/paket", "/galeri", "/kontak", "/pendaftaran"]) {
      await page.goto(route);
      await expect(page.locator("h1")).toHaveCount(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      if (route === "/") {
        await expect(page.getByRole("heading", { name: "Tenang Bersama Sagara", exact: true })).toBeVisible();
        const highlights = page.getByRole("region", { name: "Tenang Bersama Sagara", exact: true });
        await expect(highlights.getByRole("heading", { level: 3 })).toHaveCount(4);
        const title = await page.locator("#hero-title").boundingBox();
        const mascot = await page.locator('[src*="sagara-hero-mascot.webp"]').boundingBox();
        expect(title).not.toBeNull();
        expect(mascot).not.toBeNull();
        // The mascot stays inside the hero, above the description and actions.
        const description = await page.locator(".hero-copy p").last().boundingBox();
        expect(mascot!.y + mascot!.height).toBeLessThanOrEqual(description!.y);
        const overlappingCharacters = await page.locator("#hero-title").evaluate(heading => {
          // The visible mascot is clipped by its wrapper, not its source image.
          const mascot = document.querySelector('[src*="sagara-hero-mascot.webp"]')!.parentElement!.getBoundingClientRect();
          const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
          let overlaps = 0;
          while (walker.nextNode()) {
            const node = walker.currentNode as Text;
            for (let index = 0; index < node.length; index++) {
              if (!node.data[index].trim()) continue;
              const range = document.createRange();
              range.setStart(node, index);
              range.setEnd(node, index + 1);
              const box = range.getBoundingClientRect();
              if (box.left < mascot.right && box.right > mascot.left && box.top < mascot.bottom && box.bottom > mascot.top) overlaps++;
            }
          }
          return overlaps;
        });
        expect(overlappingCharacters).toBe(0);
      }
      if (route === "/pendaftaran") {
        const steps = await page.locator('ol[aria-label="Tahap pendaftaran"] li').all();
        for (let index = 1; index < steps.length; index++) {
          const previous = await steps[index - 1].boundingBox();
          const current = await steps[index].boundingBox();
          expect(previous!.x + previous!.width).toBeLessThanOrEqual(current!.x);
        }
        await expect(page.getByText("Rp1.100.000", { exact: true })).toBeVisible();
        await expect(page.getByText("Rp900.000", { exact: true })).toBeVisible();
      }
    }
  });
}

for (const [label, width, height] of [
  ["mobile landscape", 844, 390],
  ["tablet landscape", 1024, 600],
  ["desktop 200% equivalent reflow", 720, 450],
] as const) {
  test(`six pages retain readable layout in ${label}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const route of ["/", "/layanan", "/paket", "/galeri", "/kontak", "/pendaftaran"]) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("h1")).toHaveCount(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    }
  });
}

test("short visual headings retain visible local identity and server-rendered metadata", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(`${baseURL}/`);
    await expect(page.locator("h1")).toHaveText("Langkah berani si jagoan, dimulai di sini.");
    await expect(page.locator(".hero-copy")).toContainText("SAGARA di Banteran, Sumbang");
    await expect(page).toHaveTitle("SAGARA — Khitan & Sunat Modern di Banteran, Sumbang");
    expect(new URL((await page.locator('link[rel="canonical"]').getAttribute("href"))!).href).toBe("https://sagara-vert.vercel.app/");
  } finally {
    await context.close();
  }
});
