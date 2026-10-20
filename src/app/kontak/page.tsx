import type { Metadata } from "next";
import { ContactSection } from "@/components/sections/ContactSection";

export const metadata: Metadata = {
  title: "Lokasi & Kontak",
  description:
    "Hubungi tim Sagara melalui WhatsApp untuk konsultasi khitan, konfirmasi lokasi Banteran, Sumbang, jam layanan, dan layanan khitan di rumah.",
};

export default function KontakPage() {
  return (
    <main id="main-content" className="min-h-[calc(100dvh-56px)] bg-soft">
      <ContactSection />
    </main>
  );
}
