import { pageMetadata } from "@/lib/seo";
import { ServicesSection } from "@/components/sections/ServicesSection";

export const metadata = pageMetadata(
  "Layanan Khitan",
  "Layanan khitan anak-anak, bayi, dewasa, dan kebutuhan khusus. Konsultasikan kebutuhan keluarga kepada admin Sagara.",
  "/layanan",
);

export default function LayananPage() {
  return <ServicesSection />;
}
