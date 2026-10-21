import { pageMetadata, siteName } from "@/lib/seo";
import { AboutSection } from "@/components/sections/AboutSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { MethodsSection, NeedsSection, BenefitsSection, HomecareSection, FAQSection, ConsultationSection } from "@/components/sections/HomeSections";

export const metadata = pageMetadata(siteName, "Informasi layanan, metode, dan paket khitan SAGARA di Banteran, Sumbang. Konsultasikan kebutuhan keluarga dan layanan homecare bersama admin.", "/");

export default function HomePage() {
  return <><main id="main-content"><HeroSection /><AboutSection /><MethodsSection /><NeedsSection /><BenefitsSection /><HomecareSection /><FAQSection /><ConsultationSection /></main></>;
}
