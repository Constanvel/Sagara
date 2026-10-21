import type { MetadataRoute } from "next";
import { absoluteUrl, sitePaths } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return sitePaths.map((path) => ({
    url: absoluteUrl(path),
  }));
}
