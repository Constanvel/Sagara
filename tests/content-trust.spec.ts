import { expect, test } from "@playwright/test";
import { benefits, methods } from "../src/data/home";
import { packages, packagePriceLabel } from "../src/data/packages";

test("packages restore the original Figma prices and retain registration IDs", () => {
  expect(packages.map(item => [item.id, item.name, item.price])).toEqual([
    ["modern", "Paket Modern", 1100000],
    ["top-sealer", "Paket Top Sealer", 900000],
  ]);
  expect(packages.map(packagePriceLabel)).toEqual(["Rp1.100.000", "Rp900.000"]);
  for (const item of packages) expect(item.priceStatus).toBe("reference-price");
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
