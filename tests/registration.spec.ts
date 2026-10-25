import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { formatDate, jakartaToday, validateRegistration, type RegistrationData } from "../src/components/registration/validation";
import { packageForService, packagePriceLabel, packages } from "../src/data/packages";

const valid: RegistrationData = { service: "anak-anak", package: "modern", date: "2099-12-01", time: "10:00", guardian: "Wali Uji", patient: "Pasien Uji", age: "7", whatsapp: "081234567890", consent: true };
test("service price resolution preserves base prices and never borrows special-needs prices for Gemuk", () => {
  for (const item of packages) {
    for (const service of ["anak-anak", "bayi"]) expect(packageForService(item, service)).toBe(item);
    const gemuk = packageForService(item, "khitan-gemuk");
    expect(gemuk.price).toBeNull();
    expect(gemuk.priceStatus).toBe("confirmation-required");
    expect(packagePriceLabel(gemuk)).toBe("Konfirmasi admin");
  }
  expect(packages.map(item => item.price)).toEqual([1100000, 900000]);
});

test("validation rejects missing, past, impossible and malformed data", () => {
  expect(validateRegistration(valid, ["anak-anak"], ["modern"])).toEqual({});
  const errors = validateRegistration({ ...valid, service: "invalid", package: "", date: "2000-01-01", time: "24:00", guardian: "", patient: "", age: "121", whatsapp: "123", consent: false }, ["anak-anak"], ["modern"]);
  expect(Object.keys(errors)).toHaveLength(9);
  expect(validateRegistration({ ...valid, date: "2099-02-31" }, ["anak-anak"], ["modern"]).date).toBeTruthy();
  for (const age of ["-1", "1.5", "", "abc"]) expect(validateRegistration({ ...valid, age }, ["anak-anak"], ["modern"]).age).toBeTruthy();
  for (const whatsapp of ["+6281234567890", "6281234567890", "0812-3456-7890"]) expect(validateRegistration({ ...valid, whatsapp }, ["anak-anak"], ["modern"]).whatsapp).toBeUndefined();
  for (const time of ["00:00", "08:17", "12:00", "16:43", "23:59"]) expect(validateRegistration({ ...valid, time }, ["anak-anak"], ["modern"]).time).toBeUndefined();
  for (const time of ["", "24:00", "12:60", "9:30", "09.30", "12:00 PM", "-1:00"]) expect(validateRegistration({ ...valid, time }, ["anak-anak"], ["modern"]).time).toBeTruthy();
  const now = new Date("2026-10-25T03:00:00Z");
  for (const time of ["09:59", "10:00"]) expect(validateRegistration({ ...valid, date: "2026-10-25", time }, ["anak-anak"], ["modern"], now).time).toContain("belum lewat");
  expect(validateRegistration({ ...valid, date: "2026-10-25", time: "10:01" }, ["anak-anak"], ["modern"], now).time).toBeUndefined();
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

test("original package names and prices match across public and registration cards", async ({ page }) => {
  for (const route of ["/paket", "/pendaftaran"]) {
    await page.goto(route);
    for (const [name, price] of [["Paket Modern", "Rp1.100.000"], ["Paket Top Seller", "Rp900.000"]]) {
      const card = page.locator("article").filter({ has: page.getByRole("heading", { name, exact: true }) });
      await expect(card.getByText(price, { exact: true })).toBeVisible();
      await expect(card.getByText("per pasien", { exact: true })).toBeVisible();
      await expect(card.locator("li")).toHaveCount(2);
    }
    await expect(page.getByText("Hubungi admin untuk biaya", { exact: true })).toHaveCount(0);
    await expect(page.locator("main")).toContainText("Rincian biaya dan fasilitas dikonfirmasi oleh admin.");
  }
});

test("preferred time starts empty, accepts arbitrary 24-hour times and shows scheduling note", async ({ page }) => {
  await page.goto("/pendaftaran");
  const time = page.getByLabel("Waktu yang diinginkan", { exact: true });
  await expect(time).toHaveValue("");
  await expect(page.getByRole("button", { name: /^(09|10|11|13|14|15)\.00$/ })).toHaveCount(0);
  await expect(page.getByText("Waktu yang dipilih merupakan preferensi pasien. Ketersediaan jadwal akan dikonfirmasi oleh admin.", { exact: true })).toBeVisible();
  await time.fill("16:43");
  await expect(time).toHaveValue("16:43");
  await page.getByRole("button", { name: "Tinjau Pendaftaran" }).click();
  await expect(time).toHaveAttribute("aria-invalid", "false");
  await time.fill("24:00");
  await page.getByRole("button", { name: "Tinjau Pendaftaran" }).click();
  await expect(time).toHaveAttribute("aria-invalid", "true");
});

for (const [serviceId, title, modern, topSealer] of [
  ["dewasa", "Khitan Dewasa", "Rp2.500.000", "Rp1.750.000"],
  ["kebutuhan-khusus", "Khitan Kebutuhan Khusus", "Rp2.000.000", "Rp1.500.000"],
  ["khitan-gemuk", "Khitan Gemuk", "Konfirmasi admin", "Konfirmasi admin"],
] as const) {
  test(`service prices stay consistent through cards, review and WhatsApp: ${serviceId}`, async ({ page }) => {
    await page.setViewportSize({ width: serviceId === "khitan-gemuk" ? 320 : 390, height: 900 });
    await page.goto(`/pendaftaran?layanan=${serviceId}`);
    await page.screenshot({ path: `test-results/registration-prices-${serviceId}.png`, fullPage: true });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByLabel("Layanan", { exact: true })).toHaveValue(serviceId);
    for (const [name, price] of [["Paket Modern", modern], ["Paket Top Seller", topSealer]]) {
      const card = page.locator("article").filter({ has: page.getByRole("heading", { name, exact: true }) });
      await expect(card.getByText(price, { exact: true })).toBeVisible();
    }
    await page.getByLabel("Tanggal yang diinginkan").fill(valid.date);
    await page.getByLabel("Waktu yang diinginkan", { exact: true }).fill("18:37");
    await page.getByLabel("Nama orang tua / wali").fill(valid.guardian);
    await page.getByLabel("Nama pasien", { exact: true }).fill(valid.patient);
    await page.getByLabel("Usia (tahun)").fill(valid.age);
    await page.getByLabel("Nomor WhatsApp", { exact: true }).fill(valid.whatsapp);
    await page.getByRole("checkbox").check();
    for (const [name, price] of [["Paket Modern", modern], ["Paket Top Seller", topSealer]]) {
      await page.getByRole("button", { name: `Pilih ${name}`, exact: true }).click();
      await page.getByRole("button", { name: "Tinjau Pendaftaran" }).click();
      await expect(page.locator("dd").getByText(title, { exact: true })).toBeVisible();
      await expect(page.locator("dd").getByText(price, { exact: true })).toBeVisible();
      await expect(page.locator("dd").getByText("18:37 WIB", { exact: true })).toBeVisible();
      await expect(page.getByText("Pesan yang telah diisi otomatis berada di parameter tautan WhatsApp.", { exact: false })).toBeVisible();
      await page.getByRole("checkbox").check();
      const message = new URL((await page.getByRole("link", { name: "Kirim Pendaftaran via WhatsApp" }).getAttribute("href"))!).searchParams.get("text")!;
      expect(message).toContain(`Layanan: ${title}\nPaket: ${name}\nBiaya: ${price}`);
      expect(message).toContain("Waktu yang diinginkan: 18:37 WIB");
      if (serviceId === "khitan-gemuk") expect(message).not.toMatch(/Rp[0-9]/);
      await page.getByRole("button", { name: "Kembali & perbaiki" }).click();
    }
    // Changing services must update prices even when the selected package is retained.
    for (const id of ["dewasa", "kebutuhan-khusus", "bayi", "anak-anak", serviceId]) {
      await page.getByLabel("Layanan", { exact: true }).selectOption(id);
      const expected = id === "dewasa" ? "Rp1.750.000" : id === "kebutuhan-khusus" ? "Rp1.500.000" : id === "khitan-gemuk" ? "Konfirmasi admin" : "Rp900.000";
      const card = page.locator("article").filter({ has: page.getByRole("heading", { name: "Paket Top Seller", exact: true }) });
      await expect(card.getByText(expected, { exact: true })).toBeVisible();
      await expect(page.getByRole("button", { name: "Pilih Paket Top Seller", exact: true })).toHaveAttribute("aria-pressed", "true");
    }
  });
}

test("registration CTAs preselect options and widget returns outside form", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Daftar khitan", exact: true }).first().click();
  await expect(page).toHaveURL(/\/pendaftaran$/);
  await expect(page.getByTestId("floating-consultation")).toBeVisible();
  await page.getByRole("link", { name: "Kembali Beranda", exact: true }).click();
  await expect(page.getByTestId("floating-consultation")).toBeVisible();
  for (const [route, key, ids] of [["/paket", "paket", ["modern", "top-sealer"]], ["/layanan", "layanan", ["anak-anak", "bayi", "dewasa", "kebutuhan-khusus", "khitan-gemuk"]]] as const) {
    await page.goto(route);
    for (const id of ids) await expect(page.locator(`a[href="/pendaftaran?${key}=${id}"]`)).toHaveCount(1);
  }
  await page.goto("/pendaftaran?layanan=kebutuhan-khusus-pendampingan&paket=modern");
  await expect(page.getByLabel("Layanan", { exact: true })).toHaveValue("khitan-gemuk");
  await expect(page.getByRole("button", { name: "Pilih Paket Modern" })).toHaveAttribute("aria-pressed", "true");
});

for (const query of ["layanan=invalid&paket=invalid", "layanan=&paket="]) {
  test(`invalid or empty preselection falls back safely: ${query}`, async ({ page }) => {
    await page.goto(`/pendaftaran?${query}`);
    await expect(page.getByLabel("Layanan", { exact: true })).toHaveValue("anak-anak");
    await expect(page.locator('main button[aria-label^="Pilih Paket"][aria-pressed="true"]')).toHaveCount(0);
  });
}

test("client query navigation preserves entered data, selections and both consent stages", async ({ page }) => {
  await page.goto("/pendaftaran?layanan=bayi&paket=modern");
  // Server-rendered inputs are editable before React attaches their change handlers.
  // Wait for an observable state change, not the already-preselected package or a timeout.
  await page.getByRole("button", { name: "Pilih Paket Top Seller", exact: true }).click();
  await expect(page.getByRole("button", { name: "Pilih Paket Top Seller", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Pilih Paket Modern", exact: true }).click();
  await expect(page.getByRole("button", { name: "Pilih Paket Modern", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByLabel("Tanggal yang diinginkan").fill(valid.date);
  await page.getByLabel("Waktu yang diinginkan", { exact: true }).fill(valid.time);
  await page.getByLabel("Nama orang tua / wali").fill(valid.guardian);
  await page.getByLabel("Nama pasien", { exact: true }).fill(valid.patient);
  await page.getByLabel("Usia (tahun)").fill(valid.age);
  await page.getByLabel("Nomor WhatsApp", { exact: true }).fill(valid.whatsapp);
  await page.getByRole("checkbox").check();
  await expect(page.getByLabel("Tanggal yang diinginkan")).toHaveValue(valid.date);
  await page.evaluate(() => window.history.pushState(null, "", "/pendaftaran?layanan=dewasa&paket=top-sealer"));
  await expect(page).toHaveURL(/layanan=dewasa&paket=top-sealer$/);
  await expect(page.getByLabel("Layanan", { exact: true })).toHaveValue("bayi");
  await expect(page.getByRole("button", { name: "Pilih Paket Modern" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByLabel("Tanggal yang diinginkan")).toHaveValue(valid.date);
  await expect(page.getByLabel("Waktu yang diinginkan", { exact: true })).toHaveValue(valid.time);
  await expect(page.getByLabel("Nama orang tua / wali")).toHaveValue(valid.guardian);
  await expect(page.getByLabel("Nama pasien", { exact: true })).toHaveValue(valid.patient);
  await expect(page.getByLabel("Usia (tahun)")).toHaveValue(valid.age);
  await expect(page.getByLabel("Nomor WhatsApp", { exact: true })).toHaveValue(valid.whatsapp);
  await expect(page.getByRole("checkbox")).toBeChecked();
  await page.getByRole("button", { name: "Tinjau Pendaftaran" }).click();
  await expect(page.getByRole("heading", { name: "Tinjau pendaftaran Anda." })).toBeFocused();
  await expect(page.locator('main a[href*="wa.me"]')).toHaveCount(0);
  await page.getByRole("checkbox").check();
  const href = await page.getByRole("link", { name: "Kirim Pendaftaran via WhatsApp" }).getAttribute("href");
  await page.goBack();
  await expect(page).toHaveURL(/layanan=bayi&paket=modern$/);
  await expect(page.getByRole("heading", { name: "Tinjau pendaftaran Anda." })).toBeVisible();
  await expect(page.getByRole("checkbox")).toBeChecked();
  await expect(page.getByRole("link", { name: "Kirim Pendaftaran via WhatsApp" })).toHaveAttribute("href", href!);
  await page.goForward();
  await expect(page).toHaveURL(/layanan=dewasa&paket=top-sealer$/);
  await expect(page.getByRole("link", { name: "Kirim Pendaftaran via WhatsApp" })).toHaveAttribute("href", href!);
});

for (const width of [320, 360, 390, 412, 768, 1280, 1440, 1920]) {
test(`three-step flow shares all latest data only after explicit consent at ${width}px`, async ({ page, context }) => {
  await page.setViewportSize({ width, height: 850 });
  await page.goto("/pendaftaran?paket=top-sealer&layanan=bayi");
  await expect(page.getByLabel("Layanan", { exact: true })).toHaveValue("bayi");
  await expect(page.getByRole("button", { name: "Pilih Paket Top Seller" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Tinjau Pendaftaran" }).click();
  await expect(page.locator("main").getByRole("alert")).toBeVisible();
  await expect(page.getByLabel("Tanggal yang diinginkan")).toBeFocused();
  await page.getByRole("button", { name: "Pilih Paket Modern" }).click();
  await expect(page.getByRole("button", { name: "Pilih Paket Top Seller" })).toHaveAttribute("aria-pressed", "false");
  await page.getByLabel("Tanggal yang diinginkan").fill("2099-12-01");
  await page.getByLabel("Waktu yang diinginkan", { exact: true }).fill("10:00");
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
  await expect(page.getByRole("heading", { name: "Tinjau pendaftaran Anda." })).toBeFocused();
  const link = page.getByRole("link", { name: "Kirim Pendaftaran via WhatsApp" });
  await expect(page.getByRole("button", { name: "Kirim Pendaftaran via WhatsApp" })).toBeDisabled();
  await expect(page.locator('main a[href*="wa.me"]')).toHaveCount(0);
  for (const value of [valid.guardian, valid.patient, valid.whatsapp, "7 tahun", "Khitan bayi", "Paket Modern", "Rp1.100.000", "1 Desember 2099", "10:00 WIB"]) await expect(page.locator("dd").filter({ hasText: value })).toBeVisible();
  await page.getByRole("checkbox").check();
  const modernMessage = new URL((await link.getAttribute("href"))!).searchParams.get("text")!;
  expect(modernMessage).toContain(valid.patient);
  expect(modernMessage).toContain("Paket: Paket Modern\nBiaya: Rp1.100.000");
  expect(modernMessage).not.toContain("Rp900.000");
  await page.getByRole("button", { name: "Kembali & perbaiki" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Atur waktuuntuk langkah berani.");
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  await expect(page.getByLabel("Nama pasien", { exact: true })).toHaveValue(valid.patient);
  await expect(page.getByLabel("Waktu yang diinginkan", { exact: true })).toHaveValue("10:00");
  await page.getByLabel("Nama pasien", { exact: true }).fill("Pasien Baru & Putra + / é");
  await page.getByLabel("Nama orang tua / wali").fill("Wali Baru & Ibu");
  await page.getByLabel("Usia (tahun)").fill("8");
  await page.getByLabel("Nomor WhatsApp", { exact: true }).fill("+62 812-9999-8888");
  await page.getByLabel("Layanan", { exact: true }).selectOption("dewasa");
  await page.getByRole("button", { name: "Pilih Paket Top Seller" }).click();
  await page.getByLabel("Tanggal yang diinginkan").fill("2099-12-02");
  await page.getByLabel("Waktu yang diinginkan", { exact: true }).fill("14:27");
  await page.getByRole("button", { name: "Tinjau Pendaftaran" }).click();
  await expect(page.getByRole("checkbox")).not.toBeChecked();
  await expect(link).toHaveCount(0);
  await page.getByRole("checkbox").check();
  const url = new URL((await link.getAttribute("href"))!);
  expect(url.hostname).toBe("wa.me");
  expect(url.pathname).toBe("/6287899777219");
  const message = url.searchParams.get("text")!;
  for (const value of ["Halo Admin SAGARA! 👋", "📋 INFORMASI PENDAFTARAN", "👤 DATA PENDAFTAR", "Layanan: Khitan Dewasa", "Paket: Paket Top Seller", "Biaya: Rp1.750.000", "Tanggal yang diinginkan: 2 Desember 2099", "Waktu yang diinginkan: 14:27 WIB", "Nama Orang Tua/Wali: Wali Baru & Ibu", "Nama Pasien: Pasien Baru & Putra + / é", "Usia Pasien: 8 tahun", "Nomor WhatsApp: +6281299998888", "Terima kasih! 🙏"]) expect(message).toContain(value);
  for (const value of [valid.patient, valid.guardian, valid.whatsapp, "undefined", "null", "Rp0", "1.100.000", "Hubungi admin untuk biaya"]) expect(message).not.toContain(value);
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
  // Popup focus is browser-controlled; returning to the summary must focus the persistent heading.
  await page.getByRole("button", { name: "Lihat ringkasan kembali" }).click();
  await expect(page.getByRole("heading", { name: "Tinjau pendaftaran Anda." })).toBeFocused();
  await expect(page.locator("main h1")).toHaveCount(1);
});
}
