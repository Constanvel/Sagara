import { HeroSection } from "@/components/sections/HeroSection";
import { MethodsSection, NeedsSection, BenefitsSection, HomecareSection, FAQSection, ConsultationSection, Footer } from "@/components/sections/HomeSections";

export default function HomePage() {
  return <><main id="main-content"><HeroSection /><MethodsSection /><NeedsSection /><BenefitsSection /><HomecareSection /><FAQSection /><ConsultationSection /></main><Footer /></>;
}
