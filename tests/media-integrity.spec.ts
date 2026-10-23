import { test, expect } from "@playwright/test";
import { createHash } from "node:crypto";
import { galleryMedia, heroSlides } from "../src/data/media";
import sharp from "sharp";

test("all published video files support byte ranges without downloading whole files", async ({ request }) => {
  for (const item of galleryMedia.filter(item => item.type === "video")) {
    const response = await request.get(item.src, { headers: { Range: "bytes=0-1023" } });
    expect(response.status(), item.src).toBe(206);
    expect(response.headers()["content-type"]).toContain("video/mp4");
    expect(response.headers()["content-range"]).toMatch(/^bytes 0-1023\//);
    expect((await response.body()).byteLength).toBe(1024);
    expect((await request.get(item.thumbnail)).ok()).toBe(true);
  }
});

test("renamed photo URLs preserve byte-identical legacy responses", async ({ request }) => {
  const names = [
    ["sagara-kebersamaan-tiga-pendamping", "sagara-kebersamaan-dua-pendamping"],
    ["sagara-momen-bersama-orang-tua", "sagara-anak-berpeci-dua-pendamping"],
    ["sagara-momen-bersama-ibu", "sagara-anak-baju-hitam-bersama-pendamping"],
    ["sagara-bingkisan-berlatar-merah", "sagara-sertifikat-ruang-kuning-latar-merah"],
  ];
  for (const [legacy, canonical] of names) {
    const responses = await Promise.all([legacy, canonical].map(name => request.get(`/images/media/${name}.webp`)));
    const hashes = await Promise.all(responses.map(async response => {
      expect(response.ok()).toBe(true);
      expect(response.headers()["content-type"]).toContain("image/webp");
      return createHash("sha256").update(await response.body()).digest("hex");
    }));
    expect(hashes[0]).toBe(hashes[1]);
  }
});

test("all gallery source images are accessible and descriptions are present", async ({ request }) => {
  for (const item of galleryMedia) {
    expect(item.alt.trim().length).toBeGreaterThan(10);
    const source = new URL(item.src, "https://media-test.invalid");
    expect(source.origin).toBe("https://media-test.invalid");
    expect(source.pathname).toMatch(/^\/(images|videos)\/[a-z0-9/.-]+$/);
    expect(source.search).toBe("");
    expect((await request.get(item.thumbnail)).ok(), item.thumbnail).toBe(true);
  }
});

test("gallery and hero retain the original catalog without revision queries", () => {
  expect(galleryMedia.filter(item => item.type === "photo")).toHaveLength(24);
  expect(galleryMedia.filter(item => item.type === "video")).toHaveLength(5);
  expect(heroSlides).toHaveLength(20);
  const catalog = { gallery: galleryMedia, hero: heroSlides };
  expect(createHash("sha256").update(JSON.stringify(catalog)).digest("hex"))
    .toBe("a1c2a8f48a96202043efaa6c221f63429b63bc66720918788e0a9ef8d2bf7088");
  for (const item of galleryMedia) {
    expect(new URL(item.thumbnail, "https://media-test.invalid").search).toBe("");
  }
});

test("original gallery images remain accessible through Next Image optimization", async ({ request }) => {
  test.setTimeout(120_000);
  for (const item of galleryMedia.filter(item => item.type === "photo")) {
    const response = await request.get(`/_next/image?url=${encodeURIComponent(item.src)}&w=640&q=75`);
    expect(response.status(), item.src).toBe(200);
    const metadata = await sharp(await response.body()).metadata();
    expect(metadata.width, item.src).toBe(640);
    expect(Math.abs(metadata.width! / metadata.height! - item.width / item.height), item.src).toBeLessThan(0.01);
  }
});

test("image optimization rejects revision queries", async ({ request }) => {
  for (const revision of ["privacy-20261023", "unapproved"]) {
    const source = `/images/media/sagara-sertifikat-dan-hadiah.webp?v=${revision}`;
    const response = await request.get(`/_next/image?url=${encodeURIComponent(source)}&w=640&q=75`);
    expect(response.status()).toBe(400);
  }
});
