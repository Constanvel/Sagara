import { expect, test } from "@playwright/test";
import { benefits, methods } from "../src/data/home";
import { packages, packagePriceLabel } from "../src/data/packages";

test("packages restore the original Figma prices and retain registration IDs", () => {
  expect(packages.map(item => [item.id, item.name, item.price])).toEqual([
    ["modern", "Paket Modern", 1100000],
    ["top-sealer", "Paket Top Seller", 900000],
  ]);
  expect(packages.map(packagePriceLabel)).toEqual(["Rp1.100.000", "Rp900.000"]);
  for (const item of packages) expect(item.priceStatus).toBe("reference-price");
});

// These cards retain the requested Figma copy with confirmed spelling corrections.
// This checks editorial fidelity, not clinical verification of the claims.
test("procedure cards preserve the requested explanations with spelling corrections", () => {
  expect(methods.map(({ title, badge, description, bullets, action }) => ({ title, badge, description, bullets, action }))).toEqual([
    {
      title: "Tekhno Klamp / Smart Klamp",
      badge: "Terpopuler Anak",
      description: "Tabung pelindung sekali pakai (disposable). Perlindungan optimal dari gesekan pampers & celana.",
      bullets: ["Antiair, bisa mandi langsung", "Tanpa perban atau jahitan", "Usia: 0 Bulan - 12 Tahun"],
      action: "Tanya Metode Klamp",
    },
    {
      title: "Bius Comfort-In (Needle Free)",
      badge: "Pilihan Pembiusan",
      description: "Menembakkan cairan anestesi berkecepatan tinggi melalui pori-pori kulit secara instan dan tanpa jarum.",
      bullets: ["Hilangkan fobia suntikan", "Reaksi kebas cepat (hitungan detik)", "Dapat dikombinasi ke semua metode"],
      action: "Tanya Pilihan Pembiusan",
    },
    {
      title: "Laser / Flash Cauter Medis",
      badge: "Minim Perdarahan",
      description: "Menggunakan generator panas mikro presisi untuk memotong sekaligus menutup pembuluh darah kecil.",
      bullets: ["Tindakan cepat (10–15 menit)", "Cocok anak usia SD hingga Remaja", "Hemat & efisien biaya"],
      action: "Tanya Metode Cauter",
    },
  ]);
});

test("confirmed spelling corrections appear on the home and package pages", async ({ page }) => {
  await page.goto("/");
  const about = page.locator("#tentang-sagara");
  await expect(about).toContainText("Hadir di Banteran, Sumbang,");
  await expect(about).toContainText("kebutuhan, kesiapan, dan pertanyaan");
  await expect(page.getByText("Antiair, bisa mandi langsung", { exact: true })).toBeVisible();
  await expect(page.getByText("Hilangkan fobia suntikan", { exact: true })).toBeVisible();
  const hero = page.locator('[aria-labelledby="hero-title"]');
  await expect(hero.locator('span[aria-hidden="true"]').filter({ hasText: "”" })).toHaveCount(1);

  await page.goto("/paket");
  const card = page.locator("article").filter({ has: page.getByRole("heading", { name: "Paket Top Seller", exact: true }) });
  await expect(card.getByText("Metode Top Seller", { exact: true })).toBeVisible();
  await expect(card.getByRole("link", { name: "Daftar Paket Top Seller", exact: true })).toHaveAttribute("href", "/pendaftaran?paket=top-sealer");
  const inquiry = card.getByRole("link", { name: "Tanya paket Top Seller", exact: true });
  expect(new URL((await inquiry.getAttribute("href"))!).searchParams.get("text")).toContain("rincian paket Top Seller.");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /Pilihan Paket Modern dan Top Seller\./);
  await expect(page.locator("main")).not.toContainText("Top Sealer");
});

test("unreviewed benefit copy does not guarantee free follow-up", () => {
  expect(JSON.stringify(benefits)).not.toMatch(/gratis|obat-obatan 3 hari|konsultasi sampai sembuh/i);
});

test("no empty clinical or education routes are published before review", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const path of ["/tenaga-medis", "/persiapan-khitan", "/perawatan-setelah-khitan"]) {
    expect(sitemap).not.toContain(path);
    expect((await request.get(path)).status()).toBe(404);
  }
});
