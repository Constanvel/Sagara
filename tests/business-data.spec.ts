import { expect, test } from "@playwright/test";
import { contact } from "../src/data/contact";
import { organizationJsonLd, siteName } from "../src/lib/seo";
import { whatsappUrl } from "../src/lib/whatsapp";
import nextConfig from "../next.config";

test("visible contact, schema and WhatsApp share one official number", () => {
  expect(contact.whatsappNumber).toMatch(/^[1-9]\d{7,14}$/);
  expect(`62${contact.whatsappLabel.replace(/\D/g, "").replace(/^0/, "")}`).toBe(contact.whatsappNumber);
  expect(organizationJsonLd.telephone).toBe(`+${contact.whatsappNumber}`);
  const message = "Halo SAGARA, konsultasi & jadwal?";
  const url = new URL(whatsappUrl(message)!);
  expect(url.pathname).toBe(`/${contact.whatsappNumber}`);
  expect(url.searchParams.get("text")).toBe(message);
});

test("business identity and optional schema facts match the public contact source", () => {
  expect(contact.businessName).toBe("SAGARA Rumah Sunat Modern Banteran");
  expect(siteName).toBe(contact.siteName);
  expect(siteName.replace(" — ", " ")).toBe(contact.businessName);
  expect(organizationJsonLd.name).toBe(contact.businessName);
  expect(organizationJsonLd.location.name).toBe(contact.businessName);
  expect(organizationJsonLd.location.hasMap).toBe(contact.mapsUrl);
  expect(organizationJsonLd.location.geo).toEqual({ "@type": "GeoCoordinates", ...contact.coordinates });
  expect(Number.isFinite(contact.coordinates.latitude)).toBe(true);
  expect(Number.isFinite(contact.coordinates.longitude)).toBe(true);
  expect(Math.abs(contact.coordinates.latitude)).toBeLessThanOrEqual(90);
  expect(Math.abs(contact.coordinates.longitude)).toBeLessThanOrEqual(180);
  expect(new URL(contact.mapsUrl).protocol).toBe("https:");

  const { address, profiles, hours } = contact.verified;
  if (address) {
    for (const value of Object.values(address)) expect(value.trim()).not.toBe("");
    expect(address.streetAddress).toBeTruthy();
    expect(address.addressLocality).toBeTruthy();
    expect(address.addressRegion).toBeTruthy();
    expect(address.addressCountry).toMatch(/^[A-Z]{2}$/);
    expect(organizationJsonLd).toHaveProperty("address", { "@type": "PostalAddress", ...address });
  } else {
    expect(organizationJsonLd).not.toHaveProperty("address");
  }
  if (profiles?.length) {
    expect(new Set(profiles).size).toBe(profiles.length);
    for (const profile of profiles) expect(new URL(profile).protocol).toBe("https:");
    expect(organizationJsonLd).toHaveProperty("sameAs", [...profiles]);
  } else {
    expect(organizationJsonLd).not.toHaveProperty("sameAs");
  }
  if (hours) {
    expect(hours.length).toBeGreaterThan(0);
    for (const entry of hours) {
      expect(entry.dayOfWeek.length).toBeGreaterThan(0);
      expect(new Set(entry.dayOfWeek).size).toBe(entry.dayOfWeek.length);
      for (const day of entry.dayOfWeek) expect(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]).toContain(day);
      expect(entry.opens).toMatch(/^(?:[01]\d|2[0-3]):[0-5]\d$/);
      expect(entry.closes).toMatch(/^(?:[01]\d|2[0-3]):[0-5]\d$/);
      expect(entry.opens).not.toBe(entry.closes);
    }
  }
  // Organization is intentionally retained; verified hours alone cannot justify a new entity type.
  expect(organizationJsonLd["@type"]).toBe("Organization");
  for (const property of ["openingHours", "openingHoursSpecification", "specialOpeningHoursSpecification"]) {
    expect(organizationJsonLd).not.toHaveProperty(property);
  }
});

test("legacy environment override cannot silently change the contact destination", () => {
  const previous = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  try {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = "621234567890";
    expect(new URL(whatsappUrl()!).pathname).toBe(`/${contact.whatsappNumber}`);
  } finally {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    else process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = previous;
  }
});

test("only preview builds receive noindex without relaxing security headers", async () => {
  const previous = process.env.VERCEL_ENV;
  try {
    for (const environment of [undefined, "development", "production", "preview"]) {
      if (environment === undefined) delete process.env.VERCEL_ENV;
      else process.env.VERCEL_ENV = environment;
      const rules = await nextConfig.headers!();
      const headers = rules.find(rule => rule.source === "/:path*")!.headers;
      expect(headers.find(header => header.key === "X-Robots-Tag")?.value).toBe(environment === "preview" ? "noindex" : undefined);
      expect(headers).toContainEqual({ key: "X-Frame-Options", value: "DENY" });
    }
  } finally {
    if (previous === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = previous;
  }
});
