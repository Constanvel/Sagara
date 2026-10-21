import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { siteUrl } from "@/lib/seo";
import { Header, MobileBottomNav } from "@/components/layout/Navigation";
import { MotionEnhancer } from "@/components/ui/MotionEnhancer";
import { Footer } from "@/components/sections/HomeSections";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SAGARA — Rumah Sunat Modern Banteran",
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
      </body>
    </html>
  );
}
