import { expect, test } from "@playwright/test";
import { contact } from "../src/data/contact";
import { faqs } from "../src/data/home";
import { contactPageJsonLd, organizationJsonLd } from "../src/lib/seo";

test("contact schema connects the published organization and WhatsApp contact without invented facts", () => {
  expect(organizationJsonLd.contactPoint).toEqual({
    "@type": "ContactPoint",
    telephone: `+${contact.whatsappNumber}`,
    contactType: "Konsultasi dan pendaftaran melalui WhatsApp",
    url: "https://sagara-vert.vercel.app/kontak",
  });
  expect(contactPageJsonLd["@graph"][1]).toMatchObject({
    "@type": "ContactPage",
    mainEntity: { "@id": organizationJsonLd["@id"] },
  });
  expect(organizationJsonLd).not.toHaveProperty("openingHours");
  expect(organizationJsonLd).not.toHaveProperty("hasCredential");
});

test("published contact facts and schema are readable without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(`${baseURL}/kontak`);
    await expect(page.locator("main")).toContainText(contact.whatsappLabel);
    await expect(page.locator("main")).toContainText(contact.addressStatus);
    await expect(page.locator("main")).toContainText(contact.hours);
    const card = page.locator(`main a[href^="https://wa.me/${contact.whatsappNumber}"]`).first();
    await expect(card).toBeVisible();
    const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(schemas.map(value => JSON.parse(value))).toContainEqual(contactPageJsonLd);
    await page.goto(`${baseURL}/`);
    await expect(page.locator("footer")).toContainText(contact.whatsappLabel);
    await expect(page.locator("footer").getByRole("link", { name: /WhatsApp 0878/ })).toBeVisible();
    await expect(page.locator("[data-faq-interactive]")).toBeHidden();
    for (const faq of faqs) await expect(page.getByText(faq.answer, { exact: true }).filter({ visible: true })).toBeVisible();
    await page.goto(`${baseURL}/layanan`);
    await expect(page.getByRole("heading", { name: "Panduan konsultasi dan pendaftaran khitan" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Pertanyaan sebelum menentukan pilihan" })).toBeVisible();
    await expect(page.locator("main")).toContainText("Membuka tautan tidak otomatis mengirim pesan.");
    await expect(page.locator("main")).toContainText("bukan petunjuk tindakan atau perawatan medis");
    await expect(page.getByRole("navigation", { name: "Tautan panduan konsultasi" }).getByRole("link", { name: "Buka formulir pendaftaran" })).toHaveAttribute("href", "/pendaftaran");
  } finally {
    await context.close();
  }
});
