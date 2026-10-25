import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("privacy information is readable without JavaScript and linked from registration", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    const response = await page.goto(`${baseURL}/kebijakan-privasi`);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveText("Kebijakan Privasi");
    await expect(page.locator("main")).toContainText("WhatsApp");
    await expect(page.locator("main")).toContainText("Google Maps");
    await expect(page.locator("main")).toContainText("localStorage");
    const requests = page.getByRole("region", { name: "Koreksi, penghapusan, dan penarikan media", exact: true });
    await expect(requests.locator("p")).toHaveCount(2);
    await expect(requests).toContainText("Hubungi admin melalui kontak WhatsApp yang digunakan situs");
    await expect(requests).toContainText("Admin perlu mengonfirmasi cakupan dan tindak lanjut permintaan Anda.");
    await expect(page.getByRole("link", { name: "Hubungi admin tentang privasi" })).toHaveCount(0);
    await expect(page.locator("main")).not.toContainText("Pesan awal ini tidak menyertakan isian formulir pendaftaran.");
    const relatedLinks = page.getByRole("navigation", { name: "Tautan terkait privasi" });
    await expect(relatedLinks.getByRole("link", { name: "Ke formulir pendaftaran", exact: true })).toHaveAttribute("href", "/pendaftaran");
    await expect(relatedLinks.getByRole("link", { name: "Lokasi & kontak", exact: true })).toHaveAttribute("href", "/kontak");
    await page.goto(`${baseURL}/pendaftaran`);
    await expect(page.locator("main").getByRole("link", { name: "Kebijakan Privasi", exact: true })).toHaveAttribute("href", "/kebijakan-privasi");
    await expect(page.locator("footer").getByRole("link", { name: "Kebijakan Privasi", exact: true })).toHaveAttribute("href", "/kebijakan-privasi");
  } finally {
    await context.close();
  }
});

test("opening privacy information in a new tab preserves the registration draft", async ({ page, context }) => {
  const identities = ["Wali Draf Sintetis", "Pasien Draf Sintetis", "081234560947"];
  const leaked: string[] = [];
  context.on("request", request => {
    const raw = `${request.url()} ${request.postData() ?? ""}`;
    let decoded = raw;
    try { decoded = decodeURIComponent(raw); } catch { /* Check raw values too. */ }
    if (identities.some(value => decoded.includes(value))) leaked.push(request.url());
  });
  await page.goto("/pendaftaran?layanan=bayi&paket=modern");
  await expect(page.getByLabel("Waktu yang diinginkan", { exact: true })).toHaveValue("");
  await page.getByLabel("Tanggal yang diinginkan").fill("2099-12-01");
  await page.getByLabel("Waktu yang diinginkan", { exact: true }).fill("10:00");
  await page.getByLabel("Nama orang tua / wali").fill(identities[0]);
  await page.getByLabel("Nama pasien", { exact: true }).fill(identities[1]);
  await page.getByLabel("Usia (tahun)").fill("7");
  await page.getByLabel("Nomor WhatsApp", { exact: true }).fill(identities[2]);
  await page.getByRole("checkbox").check();
  const link = page.locator("form").getByRole("link", { name: "Kebijakan Privasi", exact: true });
  await expect(link).toHaveAttribute("target", "_blank");
  await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  await expect(link).toHaveAccessibleDescription("(dibuka di tab baru)");
  const popupPromise = page.waitForEvent("popup");
  await link.click();
  const popup = await popupPromise;
  await expect(popup).toHaveURL(/\/kebijakan-privasi$/);
  await expect(popup.getByRole("heading", { level: 1 })).toHaveText("Kebijakan Privasi");
  expect(await popup.evaluate(() => window.opener === null)).toBe(true);
  await popup.close();
  await expect(page).toHaveURL(/\/pendaftaran\?layanan=bayi&paket=modern$/);
  await expect(page.getByLabel("Layanan", { exact: true })).toHaveValue("bayi");
  await expect(page.getByRole("button", { name: "Pilih Paket Modern" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByLabel("Tanggal yang diinginkan")).toHaveValue("2099-12-01");
  await expect(page.getByLabel("Waktu yang diinginkan", { exact: true })).toHaveValue("10:00");
  await expect(page.getByLabel("Nama orang tua / wali")).toHaveValue(identities[0]);
  await expect(page.getByLabel("Nama pasien", { exact: true })).toHaveValue(identities[1]);
  await expect(page.getByLabel("Usia (tahun)")).toHaveValue("7");
  await expect(page.getByLabel("Nomor WhatsApp", { exact: true })).toHaveValue(identities[2]);
  await expect(page.getByRole("checkbox")).toBeChecked();
  expect(await page.evaluate(values => {
    const stored = JSON.stringify({ local: { ...localStorage }, session: { ...sessionStorage }, cookie: document.cookie });
    return values.some(value => stored.includes(value));
  }, identities)).toBe(false);
  expect(leaked).toEqual([]);
});

test("privacy page fits narrow and desktop screens with accessible content", async ({ page }) => {
  await page.goto("/kebijakan-privasi");
  await page.evaluate(() => document.fonts.ready);
  for (const width of [320, 360, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Ruang lingkup informasi privasi" })).toBeVisible();
  }
  const results = await new AxeBuilder({ page }).include("main").analyze();
  expect(results.violations).toEqual([]);
});

test("synthetic registration identities stay out of requests and browser storage before WhatsApp handoff", async ({ page }) => {
  const identities = ["PrivasiUjiWali947", "PrivasiUjiPasien947", "081234560947"];
  const leaked: string[] = [];
  page.on("request", request => {
    const raw = `${request.url()} ${request.postData() ?? ""}`;
    let decoded = raw;
    try { decoded = decodeURIComponent(raw); } catch { /* Raw data still checked. */ }
    if (identities.some(value => raw.includes(value) || decoded.includes(value))) leaked.push(request.url());
  });
  await page.goto("/pendaftaran?paket=modern");
  await page.getByLabel("Tanggal yang diinginkan").fill("2099-12-01");
  await page.getByLabel("Waktu yang diinginkan", { exact: true }).fill("10:00");
  await page.getByLabel("Nama orang tua / wali").fill(identities[0]);
  await page.getByLabel("Nama pasien", { exact: true }).fill(identities[1]);
  await page.getByLabel("Usia (tahun)").fill("7");
  await page.getByLabel("Nomor WhatsApp", { exact: true }).fill(identities[2]);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Tinjau Pendaftaran" }).click();
  await expect(page.getByRole("heading", { name: "Tinjau pendaftaran Anda." })).toBeVisible();
  await expect(page.locator('main a[href*="wa.me"]')).toHaveCount(0);
  await page.getByRole("checkbox").check();
  const handoff = page.getByRole("link", { name: "Kirim Pendaftaran via WhatsApp" });
  const message = new URL((await handoff.getAttribute("href"))!).searchParams.get("text")!;
  for (const identity of identities.slice(0, 2)) expect(message).toContain(identity);
  expect(await page.evaluate(values => {
    const stored = JSON.stringify({ local: { ...localStorage }, session: { ...sessionStorage }, cookie: document.cookie });
    return values.some(value => stored.includes(value));
  }, identities)).toBe(false);
  expect(leaked).toEqual([]);
  await page.getByRole("button", { name: "Kembali & perbaiki" }).click();
  await page.getByLabel("Nama pasien", { exact: true }).fill("PrivasiUjiPasienBaru947");
  await page.getByRole("button", { name: "Tinjau Pendaftaran" }).click();
  await expect(page.getByRole("checkbox")).not.toBeChecked();
  await expect(handoff).toHaveCount(0);
  expect(leaked).toEqual([]);
});
