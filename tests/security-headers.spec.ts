import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { expect, test } from "@playwright/test";

const pages = ["/", "/layanan", "/paket", "/galeri", "/kontak", "/pendaftaran"];

for (const path of [...pages, "/security-header-missing-page", "/favicon.ico", "/images/media/sagara-rumah-sunat-modern-banteran-logo.webp"]) {
  test(`security headers apply to ${path}`, async ({ request }) => {
    const response = await request.get(path);
    expect(response.status()).toBe(path === "/security-header-missing-page" ? 404 : 200);
    const headers = response.headers();
    expect(headers["content-security-policy"]).toBe("frame-ancestors 'none'; base-uri 'self'; object-src 'none'");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("no-referrer");
    expect(headers["permissions-policy"]).toBe("camera=(), microphone=(), geolocation=(), payment=(), usb=()");
    if (path.startsWith("/images/")) {
      expect(headers["cache-control"]).toBe("public, max-age=86400, stale-while-revalidate=604800");
    }
  });
}

test("a different origin cannot frame the registration form", async ({ page, baseURL }) => {
  const target = new URL("/pendaftaran", baseURL!).href;
  // A real loopback origin avoids private-network restrictions masking CSP refusal.
  const wrapper = createServer((_request, response) => {
    response.writeHead(200, { "Content-Type": "text/html" });
    response.end(`<!doctype html><title>Framing regression</title><iframe title="Registration" src="${target}"></iframe>`);
  });
  await new Promise<void>((resolve, reject) => {
    wrapper.once("error", reject);
    wrapper.listen(0, "127.0.0.1", resolve);
  });
  try {
    const refusal = page.waitForEvent("console", {
      predicate: message => /frame-ancestors|X-Frame-Options/i.test(message.text()) && /refused|violates|blocked/i.test(message.text()),
    });
    const { port } = wrapper.address() as AddressInfo;
    await Promise.all([page.goto(`http://127.0.0.1:${port}/`), refusal]);
    await expect(page.frameLocator('iframe[title="Registration"]').locator("#patient")).toHaveCount(0);
  } finally {
    await page.goto("about:blank");
    wrapper.closeAllConnections();
    await new Promise<void>((resolve, reject) => wrapper.close(error => error ? reject(error) : resolve()));
  }
});

test("security policy preserves page rendering and hydration", async ({ page }) => {
  const errors: string[] = [];
  const policyErrors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => {
    if (message.type() === "error" && /content security policy|content-security-policy/i.test(message.text())) policyErrors.push(message.text());
  });
  // No real map requests are needed to verify application hydration.
  await page.route("https://www.google.com/maps/**", route => route.fulfill({ contentType: "text/html", body: "Map test fixture" }));
  for (const path of pages) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
  await page.getByRole("button", { name: "Pilih Paket Modern" }).click();
  await expect(page.getByRole("button", { name: "Pilih Paket Modern" })).toHaveAttribute("aria-pressed", "true");
  expect(errors).toEqual([]);
  expect(policyErrors).toEqual([]);
});

test("the contact map does not send a referrer", async ({ page }) => {
  const referrers: (string | undefined)[] = [];
  await page.route("https://www.google.com/maps/**", async route => {
    referrers.push((await route.request().allHeaders()).referer);
    await route.fulfill({ contentType: "text/html", body: "Map test fixture" });
  });
  await page.goto("/kontak?source=privacy-regression");
  await page.getByRole("button", { name: "Muat peta interaktif Google Maps" }).click();
  const map = page.getByTitle("Peta lokasi SAGARA Rumah Sunat Modern Banteran");
  await expect(map).toHaveAttribute("referrerpolicy", "no-referrer");
  await map.scrollIntoViewIfNeeded();
  await expect.poll(() => referrers.length).toBeGreaterThan(0);
  expect(referrers.every(referrer => referrer === undefined)).toBe(true);
});
