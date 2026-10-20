import type { Metadata } from "next";
import { PackagesSection } from "@/components/sections/PackagesSection";

export const metadata: Metadata = {
  title: "Paket Khitan",
  description:
    "Pilihan Paket Modern dan Top Sealer. Tanyakan rincian biaya dan fasilitas paket khitan kepada admin Sagara sebelum menentukan pilihan.",
};

export default function PaketPage() {
  return (
    <main id="main-content" className="min-h-[calc(100dvh-56px)] bg-soft">
      <PackagesSection />
    </main>
  );
}
