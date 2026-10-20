import type { Metadata } from "next";
import { ServicesSection } from "@/components/sections/ServicesSection";

export const metadata: Metadata = {
  title: "Layanan Khitan",
  description: "Layanan khitan anak-anak, bayi, dewasa, dan kebutuhan khusus. Konsultasikan kebutuhan keluarga kepada admin Sagara.",
};

export default function LayananPage() {
  return <ServicesSection />;
}
