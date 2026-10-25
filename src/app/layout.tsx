import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { siteName, siteUrl } from "@/lib/seo";
import { Header, MobileBottomNav } from "@/components/layout/Navigation";
import { MotionEnhancer } from "@/components/ui/MotionEnhancer";
import { Footer } from "@/components/layout/Footer";
import { FloatingConsultation } from "@/components/ui/FloatingConsultation";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "SAGARA",
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon", sizes: "16x16 32x32 48x48 192x192" },
      { url: "/sagara-icon.png", type: "image/png", sizes: "192x192" },
    ],
    apple: { url: "/sagara-apple-icon.png", type: "image/png", sizes: "180x180" },
  },
  verification: {
    google: "BOHRfi9lMWki_GDKThknjkVUWErLg7SGAVYDshfmi-U",
  },
  title: {
    default: siteName,
    template: "%s | SAGARA",
  },
  description:
    "Informasi layanan khitan untuk membantu keluarga mempersiapkan pengalaman sunat anak dengan nyaman dan tenang.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" data-scroll-behavior="smooth" className={jakarta.variable}>
      <body>
        <a className="skip-link" href="#main-content">
          Lewati ke konten utama
        </a>
        <Header />
        {children}
        <Footer />
        <MobileBottomNav />
        <MotionEnhancer />
        <FloatingConsultation />
      </body>
    </html>
  );
}
