import { contactPageJsonLd, pageMetadata, serializeJsonLd } from "@/lib/seo";
import { ContactSection } from "@/components/sections/ContactSection";

export const metadata = pageMetadata(
  "Lokasi & Kontak",
  "Hubungi tim Sagara melalui WhatsApp untuk konsultasi khitan, konfirmasi lokasi Banteran, Sumbang, jam layanan, dan layanan khitan di rumah.",
  "/kontak",
);

export default function KontakPage() {
  return (
    <main id="main-content" className="min-h-[calc(100dvh-56px)] bg-soft">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(contactPageJsonLd) }} />
      <ContactSection />
    </main>
  );
}
