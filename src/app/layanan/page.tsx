import type { Metadata } from "next";
import { ServicesSection } from "@/components/sections/ServicesSection";

export const metadata: Metadata = {
  title: "Layanan Khitan",
  description: "Layanan khitan anak-anak, bayi, dewasa, dan kebutuhan khusus. Konsultasikan kebutuhan keluarga kepada admin Sagara.",
};

export default function LayananPage() {
  return (
    <main id="main-content" className="min-h-[calc(100dvh-56px)] bg-soft">
      <ServicesSection />
    </main>
  );
}
