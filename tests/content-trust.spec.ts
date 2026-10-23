import { expect, test } from "@playwright/test";
import { benefits, methods } from "../src/data/home";
import { packages, packagePriceLabel } from "../src/data/packages";

test("unconfirmed costs stay absent and packages retain legacy registration IDs", () => {
  expect(packages.map(item => item.id)).toEqual(["modern", "top-sealer"]);
  for (const item of packages) {
    expect(item.priceStatus).toBe("pending-business-verification");
    expect(item.price).toBeNull();
  }
  expect(packagePriceLabel).toBe("Hubungi admin untuk biaya");
});

test("unreviewed promotional copy does not guarantee free follow-up or equate laser and cauter", () => {
  const cauter = methods.find(item => item.icon === "cauter.svg")!;
  expect(cauter.title).not.toMatch(/laser\s*\//i);
  expect(cauter.description).toContain("perbedaan istilah laser dan cauter");
  expect(JSON.stringify(benefits)).not.toMatch(/gratis|obat-obatan 3 hari|konsultasi sampai sembuh/i);
});

test("no empty clinical or education routes are published before review", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const path of ["/tenaga-medis", "/persiapan-khitan", "/perawatan-setelah-khitan"]) {
    expect(sitemap).not.toContain(path);
    expect((await request.get(path)).status()).toBe(404);
  }
});
