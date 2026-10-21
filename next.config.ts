import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  // Match small logo/mascot slots at 2x density instead of jumping to 256px.
  images: { imageSizes: [32, 48, 64, 80, 96, 128, 160, 256, 384] },
  async headers() {
    return [{ source: "/images/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }] }];
  },
};

export default nextConfig;
