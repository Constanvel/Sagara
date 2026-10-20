import { CatalogIntro } from "@/components/ui/CatalogIntro";
import { PackageCard } from "@/components/ui/PackageCard";
import { ServicePackageNav } from "@/components/ui/ServicePackageNav";
import { packageCaveat, packages } from "@/data/packages";

export function PackagesSection() {
  return (
    <section aria-labelledby="packages-heading" className="mx-auto max-w-[1100px] px-6 pt-[25px] pb-5 md:py-12">
      <CatalogIntro headingId="packages-heading" />
      <ServicePackageNav current="/paket" />
      <div className="mt-[25px] grid gap-[23px] md:grid-cols-2">
        {packages.map((item) => <PackageCard key={item.id} item={item} />)}
      </div>
      <p className="mt-5 max-w-[640px] text-[13px] leading-[1.65] text-muted">
        {packageCaveat.split(". ").map((sentence, index) => (
          <span key={sentence} className="block">{sentence}{index === 0 ? "." : ""}</span>
        ))}
      </p>
      <p id="package-price-status" className="sr-only">
        Harga masih menunggu verifikasi bisnis dan bukan jaminan biaya akhir. Konfirmasikan harga, rincian biaya, dan fasilitas kepada admin sebelum menentukan pilihan.
      </p>
    </section>
  );
}
