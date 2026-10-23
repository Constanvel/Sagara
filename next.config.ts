import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  // Match small logo/mascot slots at 2x density instead of jumping to 256px.
  images: {
    imageSizes: [32, 48, 64, 80, 96, 128, 160, 256, 384],
    localPatterns: [
      { pathname: "/images/**", search: "" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Vercel environment is evaluated at build time, never from an untrusted Host header.
          ...(process.env.VERCEL_ENV === "preview" ? [{ key: "X-Robots-Tag", value: "noindex" }] : []),
          // Restrict framing without blocking Next.js inline scripts or forcing dynamic rendering.
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
        ],
      },
      { source: "/images/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }] },
    ];
  },
};

export default nextConfig;
