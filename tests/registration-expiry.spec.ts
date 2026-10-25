import { expect, test } from "@playwright/test";

test("a requested time that expires during review cannot open WhatsApp", async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-10-24T01:59:00Z"));
  await page.goto("/pendaftaran?paket=modern");
  await page.getByLabel("Tanggal yang diinginkan").fill("2026-10-24");
  await page.getByLabel("Waktu yang diinginkan", { exact: true }).fill("09:00");
  await page.getByLabel("Nama orang tua / wali").fill("Wali Uji Sintetis");
  await page.getByLabel("Nama pasien", { exact: true }).fill("Pasien Uji Sintetis");
  await page.getByLabel("Usia (tahun)").fill("7");
  await page.getByLabel("Nomor WhatsApp", { exact: true }).fill("081234567890");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Tinjau Pendaftaran" }).click();
  await expect(page.getByRole("heading", { name: "Tinjau pendaftaran Anda." })).toBeVisible();
  await page.getByRole("checkbox").check();
  const popups: string[] = [];
  page.on("popup", popup => popups.push(popup.url()));
  const requests: string[] = [];
  await page.context().route("https://wa.me/**", route => {
    requests.push(route.request().url());
    return route.fulfill({ status: 200, body: "Unexpected WhatsApp handoff" });
  });
  await page.clock.setFixedTime(new Date("2026-10-24T02:00:00Z"));
  await page.getByRole("link", { name: "Kirim Pendaftaran via WhatsApp" }).click();
  await expect(page.getByRole("button", { name: "Tinjau Pendaftaran" })).toBeVisible();
  await expect(page.locator("#error-time")).toBeVisible();
  await expect(page.getByLabel("Waktu yang diinginkan", { exact: true })).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByLabel("Nama pasien", { exact: true })).toHaveValue("Pasien Uji Sintetis");
  expect(popups).toEqual([]);
  expect(requests).toEqual([]);
});
