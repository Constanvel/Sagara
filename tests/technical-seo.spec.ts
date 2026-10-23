import { expect, test } from "@playwright/test";
import { contact } from "../src/data/contact";
import { absoluteUrl, organizationJsonLd, pageMetadata, serializeJsonLd, siteName, sitePaths, siteUrl } from "../src/lib/seo";

const origin = "https://sagara-vert.vercel.app";
const paths = ["/", "/layanan", "/paket", "/galeri", "/kontak", "/pendaftaran", "/kebijakan-privasi"];
const homepageTitle = "SAGARA — Khitan & Sunat Modern di Banteran, Sumbang";
const expectedHeadings: Record<string, string> = {
  "/": "SAGARA, Rumah Sunat Modern di Banteran, Sumbang",
  "/layanan": "Layanan Khitan SAGARA",
  "/paket": "Pilihan Paket Khitan SAGARA",
  "/kontak": "Lokasi dan Kontak SAGARA",
  "/pendaftaran": "Atur waktu untuk langkah berani.",
};

function expectVerifiedJsonLd(value: unknown): void {
  if (Array.isArray(value)) {
    for (const item of value) expectVerifiedJsonLd(item);
  } else if (value !== null && typeof value === "object") {
    const entity = value as Record<string, unknown>;
    for (const [key, nestedValue] of Object.entries(entity)) {
      expect(key, "JSON-LD must not invent ratings, credentials, or commercial offers").not.toMatch(/^(aggregateRating|ratingValue|ratingCount|reviewCount|review|reviews|hasCredential|hasCertification|credential|credentials|qualifications|offers|offer|makesOffer|price|priceRange|priceSpecification)$/i);
      if (/^address$/i.test(key)) {
        expect(entity["@type"]).toBe("Organization");
        expect(entity["@id"]).toBe(`${origin}/#organization`);
        expect(contact.verified.address, "An address needs an explicit verified source, not a map pin").toBeDefined();
        expect(nestedValue).toEqual({ "@type": "PostalAddress", ...contact.verified.address });
      }
      if (/^sameAs$/i.test(key)) {
        expect(entity["@type"]).toBe("Organization");
        expect(entity["@id"]).toBe(`${origin}/#organization`);
        expect(contact.verified.profiles?.length, "Profiles need explicit verified URLs").toBeGreaterThan(0);
        expect(nestedValue).toEqual(contact.verified.profiles);
      }
      if (/^(openingHours|openingHoursSpecification|specialOpeningHoursSpecification)$/i.test(key)) {
        // Hours are not emitted on Organization. Only regular, verified Place hours are modeled.
        expect(entity["@type"]).toBe("Place");
        expect(entity.name).toBe(contact.businessName);
        expect(entity.hasMap).toBe(contact.mapsUrl);
        expect(key).toBe("openingHoursSpecification");
        expect(contact.verified.hours?.length, "Confirmation copy is not a verified schedule").toBeGreaterThan(0);
        expect(nestedValue).toEqual(contact.verified.hours?.map(entry => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: entry.dayOfWeek.map(day => `https://schema.org/${day}`),
          opens: entry.opens,
          closes: entry.closes,
        })));
      }
      expectVerifiedJsonLd(nestedValue);
    }
  }
}

test("metadata helpers retain the official origin and use an absolute homepage title", () => {
  expect(siteUrl).toBe(origin);
  expect(sitePaths).toEqual(paths);
  const description = "Informasi layanan khitan SAGARA di Banteran, Sumbang.";
  for (const path of paths) {
    const title = path === "/" ? homepageTitle : "Layanan Khitan";
    const metadata = pageMetadata(title, description, path);
    expect(absoluteUrl(path)).toBe(new URL(path, origin).href);
    expect(metadata.title).toEqual(path === "/" ? { absolute: homepageTitle } : title);
    expect(metadata.alternates?.canonical).toBe(new URL(path, origin).href);
    expect(metadata.openGraph).toMatchObject({
      title: path === "/" ? homepageTitle : `${title} | SAGARA`,
      description,
      url: new URL(path, origin).href,
      siteName: contact.siteName,
    });
    expect(metadata.twitter).toMatchObject({
      title: path === "/" ? homepageTitle : `${title} | SAGARA`,
      description,
      card: "summary",
    });
    expect(metadata).not.toHaveProperty("keywords");
  }
});

test("organization schema includes exactly the available verified facts", () => {
  expectVerifiedJsonLd(organizationJsonLd);
  expect(organizationJsonLd.name).toBe(contact.businessName);
  expect(siteName).toBe(contact.siteName);
  if (contact.verified.address) {
    expect(organizationJsonLd).toHaveProperty("address", { "@type": "PostalAddress", ...contact.verified.address });
  } else {
    expect(organizationJsonLd).not.toHaveProperty("address");
  }
  if (contact.verified.profiles?.length) {
    expect(organizationJsonLd).toHaveProperty("sameAs", [...contact.verified.profiles]);
  } else {
    expect(organizationJsonLd).not.toHaveProperty("sameAs");
  }
  for (const key of ["openingHours", "openingHoursSpecification", "specialOpeningHoursSpecification"]) {
    expect(organizationJsonLd).not.toHaveProperty(key);
    expect(organizationJsonLd.location).not.toHaveProperty(key);
  }
});

test("schema validation rejects fabricated claims even when nested", () => {
  for (const key of ["aggregateRating", "ratingValue", "review", "hasCredential", "hasCertification", "qualifications", "offers", "priceSpecification"]) {
    expect(() => expectVerifiedJsonLd({ nested: [{ [key]: "unsupported" }] }), key).toThrow();
  }
  expect(() => expectVerifiedJsonLd({ ...organizationJsonLd, address: { "@type": "PostalAddress", streetAddress: "Unverified street" } })).toThrow();
  expect(() => expectVerifiedJsonLd({ ...organizationJsonLd, sameAs: ["https://example.com/unverified"] })).toThrow();
  expect(() => expectVerifiedJsonLd({ ...organizationJsonLd, openingHours: "Mo-Su 00:00-23:59" })).toThrow();
});

test("JSON-LD serialization escapes markup without changing the structured data", () => {
  const value = { name: "SAGARA </script><script>alert(1)</script>" };
  const serialized = serializeJsonLd(value);
  expect(serialized).not.toContain("<");
  expect(JSON.parse(serialized)).toEqual(value);
});

test("all public routes expose unique metadata and headings without JavaScript", async ({ browser, baseURL, request }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  const headings = new Set<string>();
  const links = new Set<string>();

  for (const path of paths) {
    const response = await page.goto(`${baseURL}${path}`);
    expect(response?.status()).toBe(200);
    expect(response?.headers()["x-robots-tag"] ?? "").not.toMatch(/\bnoindex\b/i);
    const verification = page.locator('head meta[name="google-site-verification"]');
    await expect(verification).toHaveCount(1);
    await expect(verification).toHaveAttribute("content", "BOHRfi9lMWki_GDKThknjkVUWErLg7SGAVYDshfmi-U");
    const canonical = new URL(path, origin).href;
    expect(new URL((await page.locator('link[rel="canonical"]').getAttribute("href"))!).href).toBe(canonical);
    expect(new URL((await page.locator('meta[property="og:url"]').getAttribute("content"))!).href).toBe(canonical);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", `${origin}/images/media/sagara-rumah-sunat-modern-banteran-logo.webp`);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary");
    await expect(page.locator('meta[name="keywords" i]')).toHaveCount(0);
    for (const content of await page.locator('meta[name="robots" i], meta[name="googlebot" i], meta[name="bingbot" i]').evaluateAll((elements) => elements.map(element => element.getAttribute("content") ?? ""))) {
      expect(content).not.toMatch(/\bnoindex\b/i);
    }
    await expect(page.locator("html")).toHaveAttribute("lang", "id");
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
    const heading = (await page.locator("h1").innerText()).replace(/\s+/g, " ").trim();
    expect(heading).not.toBe("");
    if (expectedHeadings[path]) expect(heading).toBe(expectedHeadings[path]);
    headings.add(heading);
    const title = await page.title();
    if (path === "/") expect(title).toBe(homepageTitle);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", title);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute("content", title);
    titles.add(title);
    descriptions.add((await page.locator('meta[name="description"]').getAttribute("content"))!);
    if (path === "/layanan" || path === "/paket") {
      const catalogNav = page.getByRole("navigation", { name: "Layanan dan paket" });
      await expect(catalogNav).toHaveCount(1);
      await expect(catalogNav.getByRole("link", { name: "Layanan", exact: true })).toHaveAttribute("href", "/layanan");
      await expect(catalogNav.getByRole("link", { name: "Paket khitan", exact: true })).toHaveAttribute("href", "/paket");
      await expect(catalogNav.locator('a[aria-current="page"]')).toHaveAttribute("href", path);
    }
    for (const href of await page.locator("a[href]").evaluateAll((anchors) => anchors.map((a) => a.getAttribute("href")!))) {
      if (href.startsWith("/") || href.startsWith("#")) links.add(new URL(href, `${baseURL}${path}`).href);
    }
    const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
    for (const schema of schemas) {
      expect(() => JSON.parse(schema)).not.toThrow();
      expectVerifiedJsonLd(JSON.parse(schema));
    }
    if (path === "/") {
      const organization = JSON.parse(schemas[0]);
      expect(organization["@type"]).toBe("Organization");
      expect(organization.telephone).toBe(`+${contact.whatsappNumber}`);
      expect(organization.name).toBe(contact.businessName);
      expect(organization).toEqual(organizationJsonLd);
      expect(organization["@id"]).toBe(`${origin}/#organization`);
      expect(organization.url).toBe(`${origin}/`);
      expect(organization.logo.url).toBe(`${origin}/images/media/sagara-rumah-sunat-modern-banteran-logo.webp`);
      expect(organization).not.toHaveProperty("aggregateRating");
      expect(organization.location.geo.latitude).toBe(contact.coordinates.latitude);
      expect(organization.location.geo.longitude).toBe(contact.coordinates.longitude);
    }
    if (path === "/kontak") {
      // Structured facts must also be public, not schema-only claims.
      const visibleContact = await page.locator("main").innerText();
      if (contact.verified.address) {
        for (const value of Object.values(contact.verified.address)) expect(visibleContact).toContain(value);
      }
      for (const profile of contact.verified.profiles ?? []) {
        await expect(page.locator("main").locator(`a[href=${JSON.stringify(profile)}]`)).toBeVisible();
      }
      for (const entry of contact.verified.hours ?? []) {
        expect(visibleContact).toContain(entry.opens);
        expect(visibleContact).toContain(entry.closes);
      }
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
  expect(titles.size).toBe(paths.length);
  expect(descriptions.size).toBe(paths.length);
  expect(headings.size).toBe(paths.length);
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

test("catalog intro changes with the page while shared navigation remains available", async ({ page }) => {
  await page.goto("/layanan");
  const heading = page.getByRole("heading", { level: 1 });
  const catalogNav = page.getByRole("navigation", { name: "Layanan dan paket" });
  await expect(heading).toHaveText(expectedHeadings["/layanan"]);
  await catalogNav.getByRole("link", { name: "Paket khitan", exact: true }).click();
  await expect(page).toHaveURL(/\/paket$/);
  await expect(heading).toHaveCount(1);
  await expect(heading).toHaveText(expectedHeadings["/paket"]);
  await expect(catalogNav).toHaveCount(1);
  await expect(catalogNav.getByRole("link", { name: "Paket khitan", exact: true })).toHaveAttribute("aria-current", "page");
  await catalogNav.getByRole("link", { name: "Layanan", exact: true }).click();
  await expect(page).toHaveURL(/\/layanan$/);
  await expect(heading).toHaveCount(1);
  await expect(heading).toHaveText(expectedHeadings["/layanan"]);
  await expect(catalogNav.getByRole("link", { name: "Layanan", exact: true })).toHaveAttribute("aria-current", "page");
});

test("robots and sitemap advertise only the published canonical routes", async ({ request }) => {
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
