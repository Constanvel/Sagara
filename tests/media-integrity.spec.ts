import { test, expect } from "@playwright/test";
import { createHash } from "node:crypto";
import { galleryMedia } from "../src/data/media";

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
    expect(item.src).toMatch(/^\/(images|videos)\/[a-z0-9/.-]+$/);
    expect((await request.get(item.thumbnail)).ok(), item.thumbnail).toBe(true);
  }
});
