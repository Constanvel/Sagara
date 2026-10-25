import { PackageCard } from "@/components/ui/PackageCard";
import { packageCaveat, packages } from "@/data/packages";

export function PackagesSection() {
  return (
    <section data-page-content aria-labelledby="catalog-heading" className="flow-root pb-5 md:pb-12">
      <div className="mt-[25px] grid gap-[23px] md:grid-cols-2">
        {packages.map((item) => <PackageCard key={item.id} item={item} />)}
      </div>
      <p className="mt-5 max-w-[640px] text-[13px] leading-[1.65] text-muted">
        Harga kartu berlaku untuk Khitan anak-anak, Khitan bayi, dan Khitan Gemuk. Pilih layanan pada formulir pendaftaran untuk melihat harga Khitan Dewasa dan Khitan Kebutuhan Khusus.
      </p>
      <p className="mt-3 max-w-[640px] text-[13px] leading-[1.65] text-muted">
        {packageCaveat.split(". ").map((sentence, index) => (
          <span key={sentence} className="block">{sentence}{index === 0 ? "." : ""}</span>
        ))}
      </p>
      <p id="package-price-status" className="sr-only">
        Harga referensi per pasien, bukan jaminan biaya akhir. Konfirmasikan rincian biaya dan fasilitas kepada admin sebelum menentukan pilihan.
      </p>
    </section>
  );
}
