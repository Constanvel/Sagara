import { pageMetadata } from "@/lib/seo";
import { PackagesSection } from "@/components/sections/PackagesSection";

export const metadata = pageMetadata(
  "Paket Khitan",
  "Pilihan Paket Modern dan Top Seller. Tanyakan rincian biaya dan fasilitas paket khitan kepada admin Sagara sebelum menentukan pilihan.",
  "/paket",
);

export default function PaketPage() {
  return <PackagesSection />;
}
