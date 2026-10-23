import { organizationJsonLd, pageMetadata, serializeJsonLd } from "@/lib/seo";
import { AboutSection } from "@/components/sections/AboutSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { MethodsSection, NeedsSection, BenefitsSection, HomecareSection, FAQSection, ConsultationSection } from "@/components/sections/HomeSections";

export const metadata = pageMetadata("SAGARA — Khitan & Sunat Modern di Banteran, Sumbang", "Kenali layanan khitan dan sunat modern SAGARA di Banteran, Sumbang. Lihat pilihan layanan, paket, lokasi, dan konsultasikan jadwal melalui WhatsApp.", "/");

export default function HomePage() {
  return <><main id="main-content"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(organizationJsonLd) }} /><HeroSection /><AboutSection /><MethodsSection /><NeedsSection /><BenefitsSection /><HomecareSection /><FAQSection /><ConsultationSection /></main></>;
}
