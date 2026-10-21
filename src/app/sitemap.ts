import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/layanan", "/paket", "/galeri", "/kontak"].map((path) => ({
    url: new URL(path, siteUrl).href,
  }));
}
