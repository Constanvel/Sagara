import type { MetadataRoute } from "next";
import { absoluteUrl, sitePaths } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return sitePaths.map((path) => ({
    url: absoluteUrl(path),
    // Homepage WebSite JSON-LD added on 2026-11-01 (commit ee4d016).
    ...(path === "/" ? { lastModified: "2026-11-01" } : {}),
  }));
}
