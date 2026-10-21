import { expect, test } from "@playwright/test";

const origin = "https://sagara-vert.vercel.app";
const paths = ["/", "/layanan", "/paket", "/galeri", "/kontak"];

test("all public routes expose unique metadata and headings without JavaScript", async ({ browser, baseURL, request }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  const links = new Set<string>();

  for (const path of paths) {
    const response = await page.goto(`${baseURL}${path}`);
    expect(response?.status()).toBe(200);
    const canonical = new URL(path, origin).href;
    expect(new URL((await page.locator('link[rel="canonical"]').getAttribute("href"))!).href).toBe(canonical);
    expect(new URL((await page.locator('meta[property="og:url"]').getAttribute("content"))!).href).toBe(canonical);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", `${origin}/images/media/sagara-rumah-sunat-modern-banteran-logo.webp`);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary");
    await expect(page.locator("html")).toHaveAttribute("lang", "id");
    await expect(page.locator("h1")).toHaveCount(1);
    expect(await page.locator("h1").innerText()).not.toBe("");
    titles.add(await page.title());
    descriptions.add((await page.locator('meta[name="description"]').getAttribute("content"))!);
    for (const href of await page.locator("a[href]").evaluateAll((anchors) => anchors.map((a) => a.getAttribute("href")!))) {
      if (href.startsWith("/") || href.startsWith("#")) links.add(new URL(href, `${baseURL}${path}`).href);
    }
    const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
    for (const schema of schemas) expect(() => JSON.parse(schema)).not.toThrow();
    if (path === "/") {
      const organization = JSON.parse(schemas[0]);
      expect(organization["@type"]).toBe("Organization");
      expect(organization.telephone).toBe("+6287899777219");
      expect(organization).not.toHaveProperty("address");
      expect(organization).not.toHaveProperty("aggregateRating");
      expect(organization.location.geo.latitude).toBe(-7.362495);
    }
    if (path === "/galeri") {
      const collection = JSON.parse(schemas[0]);
      expect(collection["@type"]).toBe("CollectionPage");
      expect(collection.hasPart.length).toBeGreaterThan(0);
      for (const image of collection.hasPart) {
        expect(image["@type"]).toBe("ImageObject");
        const response = await request.get(image.contentUrl.replace(origin, baseURL!));
        expect(response.status(), image.contentUrl).toBe(200);
        expect(response.headers()["content-type"]).toMatch(/^image\//);
      }
    }
  }
  expect(titles.size).toBe(5);
  expect(descriptions.size).toBe(5);
  for (const href of links) {
    const url = new URL(href);
    const response = await request.get(`${url.origin}${url.pathname}${url.search}`);
    expect(response.status(), href).toBe(200);
    if (url.hash) {
      await page.goto(`${url.origin}${url.pathname}${url.search}`);
      expect(await page.locator(`[id="${decodeURIComponent(url.hash.slice(1))}"]`).count(), href).toBeGreaterThan(0);
    }
  }
  await context.close();
});

test("robots and sitemap advertise only the five canonical routes", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain(`Sitemap: ${origin}/sitemap.xml`);
  expect(await robots.text()).toContain("Allow: /");
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  expect([...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])).toEqual(paths.map((path) => new URL(path, origin).href));
  expect(xml).not.toContain("<lastmod>");
});
