import { test, expect } from "@playwright/test";

test("gallery thumbnails use slot-specific responsive sizes and prioritize first image", async ({ page }) => {
  await page.goto("/galeri");
  const images = page.locator("article figure button img");
  await expect(images.first()).not.toHaveAttribute("loading", "lazy");
  await expect(images.first()).toHaveAttribute("fetchpriority", "high");
  const first = await images.first().getAttribute("sizes");
  const second = await images.nth(1).getAttribute("sizes");
  expect(first).not.toEqual(second);
  expect(second).toContain("/ 2");
});

test("carousel mounts only its first and adjacent photos before interaction", async ({ page }) => {
  await page.goto("/");
  const carousel = page.getByRole("region", { name: "Cerita jagoan Sagara" });
  await expect(carousel.locator('[aria-roledescription="slide"]')).toHaveCount(20);
  await expect(carousel.locator('[aria-roledescription="slide"] img')).toHaveCount(2);
});

test("initial media requests never include MP4 downloads", async ({ page }) => {
  for (const route of ["/", "/galeri"]) {
    const videos: string[] = [];
    const listener = (request: import("@playwright/test").Request) => { if (/\.mp4(?:\?|$)/.test(request.url())) videos.push(request.url()); };
    page.on("request", listener);
    await page.goto(route);
    await page.waitForTimeout(500);
    expect(videos).toEqual([]);
    page.off("request", listener);
  }
});
