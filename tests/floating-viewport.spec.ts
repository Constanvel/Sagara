import { expect, test } from "@playwright/test";

for (const width of [360, 390, 412, 768, 1280, 1440, 1920]) {
  test(`floating stays viewport anchored on every page at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    for (const route of ["/", "/layanan", "/galeri", "/kontak", "/pendaftaran"]) {
      await page.goto(route);
      const root = page.getByTestId("floating-consultation");
      const button = root.getByRole("link");
      await expect(button).toBeVisible();
      await expect(button).toHaveAttribute("href", /https:\/\/wa.me\/6287899777219\?text=/);
      const baseline = await button.boundingBox();
      expect(baseline).not.toBeNull();
      for (const fraction of [0.5, 1]) {
        await page.evaluate(f => window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * f), fraction);
        await expect.poll(async () => Math.abs((await button.boundingBox())!.y - baseline!.y)).toBeLessThan(2);
        const box = (await button.boundingBox())!;
        expect(box.x + box.width).toBeLessThan(width);
        expect(box.y + box.height).toBeLessThan(900);
        if (width < 1024) expect(box.y + box.height).toBeLessThanOrEqual(830);
        expect(await button.evaluate(element => { const r = element.getBoundingClientRect(); return element.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)); })).toBe(true);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await expect(root.getByRole("region", { name: "Konsultasi SAGARA" })).toBeVisible({ timeout: 6000 });
      if (route === "/pendaftaran") await page.screenshot({ path: `test-results/floating-footer-${width}.png` });
      await root.getByRole("button", { name: "Tutup notifikasi konsultasi" }).click();
      await expect(root.getByRole("region")).toHaveCount(0);
      await expect(button).toBeVisible();
      expect(await page.evaluate(() => localStorage.getItem("sagara_consultation_dismissed"))).toBe("true");
      await page.reload();
      await expect(page.getByTestId("floating-consultation").getByRole("link")).toBeVisible();
      await expect(page.getByRole("region", { name: "Konsultasi SAGARA" })).toHaveCount(0);
      await page.evaluate(() => localStorage.removeItem("sagara_consultation_dismissed"));
    }
    expect(errors).toEqual([]);
  });
}
