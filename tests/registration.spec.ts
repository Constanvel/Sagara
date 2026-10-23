import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { formatDate, jakartaToday, validateRegistration, type RegistrationData } from "../src/components/registration/validation";

const valid: RegistrationData = { service: "anak-anak", package: "modern", date: "2099-12-01", time: "10.00", guardian: "Wali Uji", patient: "Pasien Uji", age: "7", whatsapp: "081234567890", consent: true };
test("validation rejects missing, past, impossible and malformed data", () => {
  expect(validateRegistration(valid, ["anak-anak"], ["modern"])).toEqual({});
  const errors = validateRegistration({ ...valid, service: "invalid", package: "", date: "2000-01-01", time: "12.00", guardian: "", patient: "", age: "121", whatsapp: "123", consent: false }, ["anak-anak"], ["modern"]);
  expect(Object.keys(errors)).toHaveLength(9);
  expect(validateRegistration({ ...valid, date: "2099-02-31" }, ["anak-anak"], ["modern"]).date).toBeTruthy();
  for (const age of ["-1", "1.5", "", "abc"]) expect(validateRegistration({ ...valid, age }, ["anak-anak"], ["modern"]).age).toBeTruthy();
  for (const whatsapp of ["+6281234567890", "6281234567890", "0812-3456-7890"]) expect(validateRegistration({ ...valid, whatsapp }, ["anak-anak"], ["modern"]).whatsapp).toBeUndefined();
  expect(jakartaToday(new Date("2026-01-01T18:00:00Z"))).toBe("2026-01-02");
});

test("reused date formatters preserve WIB boundaries and Indonesian display dates", () => {
  for (let index = 0; index < 3; index++) {
    expect(jakartaToday(new Date("2026-12-31T16:59:59Z"))).toBe("2026-12-31");
    expect(jakartaToday(new Date("2026-12-31T17:00:00Z"))).toBe("2027-01-01");
    expect(formatDate("2028-02-29")).toBe("29 Februari 2028");
    expect(formatDate("2099-12-01")).toBe("1 Desember 2099");
  }
});

for (const width of [320, 360, 390, 412, 768, 1280, 1440, 1920]) {
  test(`registration responsive and assets at ${width}px`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/pendaftaran");
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    for (const image of await page.locator("main img").all()) {
      await expect.poll(() => image.evaluate((item: HTMLImageElement) => item.complete && item.naturalWidth > 0)).toBe(true);
    }
    await expect(page.getByTestId("floating-consultation")).toBeVisible();
    await page.screenshot({ path: `test-results/registration-${width}.png`, fullPage: true });
    const results = await new AxeBuilder({ page }).include("main").analyze();
    expect(results.violations).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test("unconfirmed costs never appear as numeric prices on package or registration pages", async ({ page }) => {
  for (const route of ["/paket", "/pendaftaran"]) {
    await page.goto(route);
    await expect(page.getByText("Hubungi admin untuk biaya", { exact: true })).toHaveCount(2);
    await expect(page.locator("main")).not.toContainText(/Rp\s*[\d.,]+/);
    await expect(page.getByText("Harga belum dikonfirmasi", { exact: true })).toHaveCount(2);
  }
});

test("registration CTAs preselect options and widget returns outside form", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Daftar khitan", exact: true }).first().click();
  await expect(page).toHaveURL(/\/pendaftaran$/);
  await expect(page.getByTestId("floating-consultation")).toBeVisible();
  await page.getByRole("link", { name: "Kembali Beranda", exact: true }).click();
  await expect(page.getByTestId("floating-consultation")).toBeVisible();
  for (const [route, key, ids] of [["/paket", "paket", ["modern", "top-sealer"]], ["/layanan", "layanan", ["anak-anak", "bayi", "dewasa", "kebutuhan-khusus", "kebutuhan-khusus-pendampingan"]]] as const) {
    await page.goto(route);
    for (const id of ids) await expect(page.locator(`a[href="/pendaftaran?${key}=${id}"]`)).toHaveCount(1);
  }
  await page.goto("/pendaftaran?layanan=kebutuhan-khusus-pendampingan&paket=modern");
  await expect(page.getByLabel("Layanan", { exact: true })).toHaveValue("kebutuhan-khusus");
  await expect(page.getByRole("button", { name: "Pilih Paket Modern" })).toHaveAttribute("aria-pressed", "true");
});

for (const width of [320, 360, 390, 412, 768, 1280, 1440, 1920]) {
test(`three-step flow shares all latest data only after explicit consent at ${width}px`, async ({ page, context }) => {
  await page.setViewportSize({ width, height: 850 });
  await page.goto("/pendaftaran?paket=top-sealer&layanan=bayi");
  await expect(page.getByLabel("Layanan", { exact: true })).toHaveValue("bayi");
  await expect(page.getByRole("button", { name: "Pilih Paket Top Sealer" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Tinjau Pendaftaran" }).click();
  await expect(page.locator("main").getByRole("alert")).toBeVisible();
  await expect(page.getByLabel("Tanggal yang diinginkan")).toBeFocused();
  await page.getByRole("button", { name: "Pilih Paket Modern" }).click();
  await expect(page.getByRole("button", { name: "Pilih Paket Top Sealer" })).toHaveAttribute("aria-pressed", "false");
  await page.getByLabel("Tanggal yang diinginkan").fill("2099-12-01");
  await page.getByRole("button", { name: "10.00", exact: true }).click();
  await page.getByLabel("Nama orang tua / wali").fill(valid.guardian);
  await page.getByLabel("Nama pasien", { exact: true }).fill(valid.patient);
  await page.getByLabel("Usia (tahun)").fill(valid.age);
  await page.getByLabel("Nomor WhatsApp", { exact: true }).fill("123");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Tinjau Pendaftaran" }).click();
  await expect(page.getByText("Gunakan nomor Indonesia yang valid", { exact: false })).toBeVisible();
  await expect(page.getByLabel("Nama pasien", { exact: true })).toHaveValue(valid.patient);
  await page.getByLabel("Nomor WhatsApp", { exact: true }).fill(valid.whatsapp);
  await page.getByRole("button", { name: "Tinjau Pendaftaran" }).click();
  await expect(page.getByRole("heading", { name: "Tinjau pendaftaran Anda." })).toBeVisible();
  const link = page.getByRole("link", { name: "Kirim Pendaftaran via WhatsApp" });
  await expect(page.getByRole("button", { name: "Kirim Pendaftaran via WhatsApp" })).toBeDisabled();
  await expect(page.locator('main a[href*="wa.me"]')).toHaveCount(0);
  for (const value of [valid.guardian, valid.patient, valid.whatsapp, "7 tahun", "Khitan bayi", "Paket Modern", "Hubungi admin untuk biaya", "1 Desember 2099", "10.00 WIB"]) await expect(page.locator("dd").filter({ hasText: value })).toBeVisible();
  await page.getByRole("checkbox").check();
  expect(new URL((await link.getAttribute("href"))!).searchParams.get("text")).toContain(valid.patient);
  await page.getByRole("button", { name: "Kembali & perbaiki" }).click();
  await expect(page.getByLabel("Nama pasien", { exact: true })).toHaveValue(valid.patient);
  await expect(page.getByRole("button", { name: "10.00", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByLabel("Nama pasien", { exact: true }).fill("Pasien Baru & Putra + / é");
  await page.getByLabel("Nama orang tua / wali").fill("Wali Baru & Ibu");
  await page.getByLabel("Usia (tahun)").fill("8");
  await page.getByLabel("Nomor WhatsApp", { exact: true }).fill("+62 812-9999-8888");
  await page.getByLabel("Layanan", { exact: true }).selectOption("dewasa");
  await page.getByRole("button", { name: "Pilih Paket Top Sealer" }).click();
  await page.getByLabel("Tanggal yang diinginkan").fill("2099-12-02");
  await page.getByRole("button", { name: "14.00", exact: true }).click();
  await page.getByRole("button", { name: "Tinjau Pendaftaran" }).click();
  await expect(page.getByRole("checkbox")).not.toBeChecked();
  await expect(link).toHaveCount(0);
  await page.getByRole("checkbox").check();
  const url = new URL((await link.getAttribute("href"))!);
  expect(url.hostname).toBe("wa.me");
  expect(url.pathname).toBe("/6287899777219");
  const message = url.searchParams.get("text")!;
  for (const value of ["Halo Admin SAGARA! 👋", "📋 INFORMASI PENDAFTARAN", "👤 DATA PENDAFTAR", "Layanan: Khitan dewasa", "Paket: Paket Top Sealer", "Biaya: Hubungi admin untuk biaya", "Tanggal yang diinginkan: 2 Desember 2099", "Waktu yang diinginkan: 14.00 WIB", "Nama Orang Tua/Wali: Wali Baru & Ibu", "Nama Pasien: Pasien Baru & Putra + / é", "Usia Pasien: 8 tahun", "Nomor WhatsApp: +6281299998888", "Terima kasih! 🙏"]) expect(message).toContain(value);
  for (const value of [valid.patient, valid.guardian, valid.whatsapp, "undefined", "null", "Rp0", "1.100.000", "900.000"]) expect(message).not.toContain(value);
  expect(page.url()).not.toContain("Pasien");
  await context.route("https://wa.me/**", route => route.fulfill({ status: 200, body: "WhatsApp mock" }));
  await page.getByText("Tinjau pesan WhatsApp lengkap", { exact: true }).click();
  await expect(page.locator("pre")).toHaveText(message);
  await page.screenshot({ path: `test-results/registration-review-${width}.png`, fullPage: true });
  const popup = page.waitForEvent("popup");
  await link.click();
  await (await popup).close();
  await expect(page.getByRole("heading", { name: "Lanjutkan bersama admin." })).toBeVisible();
  await expect(page.getByText("Menunggu tindakan & konfirmasi admin", { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.getByRole("link", { name: "Kembali ke Beranda", exact: true })).toHaveAttribute("href", "/");
  expect(await page.evaluate(() => Object.keys(localStorage).filter(key => /patient|registration|pendaftaran/i.test(key)))).toEqual([]);
});
}
