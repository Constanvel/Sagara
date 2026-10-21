import { AboutSection } from "@/components/sections/AboutSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { MethodsSection, NeedsSection, BenefitsSection, HomecareSection, FAQSection, ConsultationSection, Footer } from "@/components/sections/HomeSections";

export default function HomePage() {
  return <><main id="main-content"><HeroSection /><AboutSection /><MethodsSection /><NeedsSection /><BenefitsSection /><HomecareSection /><FAQSection /><ConsultationSection /></main><Footer /></>;
}
