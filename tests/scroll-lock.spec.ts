import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import ts from "typescript";

type ScrollLockModule = { acquireScrollLock: () => () => void };

// Run the actual utility in an isolated environment, without changing Node globals.
function loadScrollLock(document?: { body: { style: { overflow: string } } }) {
  const source = readFileSync(resolve(process.cwd(), "src/lib/scroll-lock.ts"), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  const exports = {} as ScrollLockModule;
  runInNewContext(outputText, document ? { exports, document } : { exports });
  return exports;
}

test("scroll lock imports and releases safely without a document", () => {
  const { acquireScrollLock } = loadScrollLock();
  const release = acquireScrollLock();
  expect(() => { release(); release(); }).not.toThrow();
});

for (const original of ["", "auto", "scroll", "hidden"]) {
  test(`scroll lock preserves original overflow ${JSON.stringify(original)} until the final owner releases`, () => {
    const document = { body: { style: { overflow: original } } };
    const { acquireScrollLock } = loadScrollLock(document);
    const releaseMenu = acquireScrollLock();
    const releaseGallery = acquireScrollLock();
    expect(document.body.style.overflow).toBe("hidden");

    releaseMenu();
    releaseMenu();
    expect(document.body.style.overflow).toBe("hidden");
    const releaseVideo = acquireScrollLock();
    releaseGallery();
    releaseGallery();
    expect(document.body.style.overflow).toBe("hidden");
    releaseVideo();
    expect(document.body.style.overflow).toBe(original);

    // An old cleanup cannot release a token acquired by a later effect cycle.
    document.body.style.overflow = "clip";
    const releaseNext = acquireScrollLock();
    releaseVideo();
    expect(document.body.style.overflow).toBe("hidden");
    releaseNext();
    releaseNext();
    expect(document.body.style.overflow).toBe("clip");
  });
}

test("scroll lock survives a Strict Mode setup-cleanup-setup cycle", () => {
  const document = { body: { style: { overflow: "auto" } } };
  const { acquireScrollLock } = loadScrollLock(document);
  const releaseFirst = acquireScrollLock();
  releaseFirst();
  expect(document.body.style.overflow).toBe("auto");
  const releaseSecond = acquireScrollLock();
  releaseFirst();
  expect(document.body.style.overflow).toBe("hidden");
  releaseSecond();
  expect(document.body.style.overflow).toBe("auto");
});

for (const kind of ["gallery", "video"] as const) {
  test(`${kind} releases its scroll lock on Escape and client navigation away`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/layanan");
    const nav = page.getByRole("navigation", { name: "Navigasi utama", exact: true });
    await nav.getByRole("link", { name: kind === "gallery" ? "Galeri" : "Beranda", exact: true }).click();
    await expect(page).toHaveURL(kind === "gallery" ? /\/galeri$/ : /\/$/);
    const trigger = kind === "gallery"
      ? page.locator("article[data-media-type='photo'] button").first()
      : page.getByRole("button", { name: "Putar video cerita layanan Sagara", exact: true });
    await trigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("hidden");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("");
    await expect(trigger).toBeFocused();
    await trigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.goBack();
    await expect(page).toHaveURL(/\/layanan$/);
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("");
  });
}

test("gallery stays scroll-locked when resizing closes an overlapping mobile menu", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/galeri");
  const trigger = page.locator("article[data-media-type='photo'] button").first();
  await expect(trigger).toBeVisible();
  await page.evaluate(() => { document.body.style.overflow = "auto"; });

  await page.getByRole("button", { name: "Buka menu", exact: true }).click();
  await expect(page.getByRole("button", { name: "Tutup menu", exact: true })).toHaveAttribute("aria-expanded", "true");
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("hidden");
  // Click the exposed portion outside the dropdown, leaving both overlays open.
  await trigger.click({ position: { x: 20, y: 100 } });
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("button", { name: "Tutup media", exact: true })).toBeFocused();

  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(page.locator("#mobile-menu")).toHaveAttribute("aria-hidden", "true");
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("hidden");
  await page.getByRole("button", { name: "Tutup media", exact: true }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("auto");
  await expect(trigger).toBeFocused();

  // A later mobile-menu lifecycle must not inherit the gallery's hidden value.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Buka menu", exact: true }).click();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("hidden");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Buka menu", exact: true })).toBeFocused();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("auto");
});

test("about video releases its scroll lock and restores trigger focus on close", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Putar video cerita layanan Sagara", exact: true });
  const dialog = page.getByRole("dialog", { name: "Cerita layanan Sagara", exact: true });
  // Complete a client interaction before changing body attributes, so the test
  // does not create a hydration mismatch while the page is still mounting.
  await trigger.click();
  await expect(dialog).toBeVisible();
  await page.getByRole("button", { name: "Tutup video ×", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await page.evaluate(() => { document.body.style.overflow = "scroll"; });
  await trigger.click();
  await expect(dialog).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("hidden");
  await page.getByRole("button", { name: "Tutup video ×", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("scroll");
  await expect(trigger).toBeFocused();
});
