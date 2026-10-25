import { readFile } from "node:fs/promises";
import path from "node:path";
import { expect, test } from "@playwright/test";

const icons = [
  { url: "/sagara-icon.png", size: 192, rel: "icon" },
  { url: "/sagara-apple-icon.png", size: 180, rel: "apple-touch-icon" },
];

test("SAGARA icons are declared in server-rendered metadata and publicly accessible", async ({ request }) => {
  const response = await request.get("/");
  expect(response.ok()).toBe(true);
  const html = await response.text();
  expect(html).toContain('<meta name="application-name" content="SAGARA"');
  const links = [...html.matchAll(/<link\b[^>]*>/g)].map(match => match[0]);
  for (const icon of icons) {
    const link = links.find(tag => tag.includes(`href="${icon.url}"`) && tag.includes(`rel="${icon.rel}"`));
    expect(link).toBeDefined();
    expect(link).toContain(`sizes="${icon.size}x${icon.size}"`);
    const image = await request.get(icon.url);
    expect(image.ok()).toBe(true);
    expect(image.headers()["content-type"]).toContain("image/png");
    const png = await image.body();
    expect(png.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    expect(png.readUInt32BE(16)).toBe(icon.size);
    expect(png.readUInt32BE(20)).toBe(icon.size);
  }
  const favicon = await request.get("/favicon.ico");
  expect(favicon.ok()).toBe(true);
  expect(await favicon.body()).toEqual(await readFile(path.join(process.cwd(), "public/favicon.ico")));
});

test("fallback favicon includes small browser sizes and a search-compatible square image", async () => {
  const ico = await readFile(path.join(process.cwd(), "public/favicon.ico"));
  expect(ico.readUInt16LE(0)).toBe(0);
  expect(ico.readUInt16LE(2)).toBe(1);
  const count = ico.readUInt16LE(4);
  expect(count).toBe(4);
  const sizes: number[] = [];
  for (let index = 0; index < count; index++) {
    const entry = 6 + index * 16;
    const width = ico[entry] || 256;
    expect(ico[entry + 1] || 256).toBe(width);
    sizes.push(width);
    const length = ico.readUInt32LE(entry + 8);
    const offset = ico.readUInt32LE(entry + 12);
    expect(offset + length).toBeLessThanOrEqual(ico.length);
    const png = ico.subarray(offset, offset + length);
    expect(png.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    expect(png.readUInt32BE(16)).toBe(width);
    expect(png.readUInt32BE(20)).toBe(width);
  }
  expect(sizes).toEqual([16, 32, 48, 192]);
});
