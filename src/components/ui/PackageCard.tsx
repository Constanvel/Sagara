import Link from "next/link";
import { Asset } from "@/components/ui/Asset";
import { ContactAction } from "@/components/ui/ContactAction";
import { packagePriceLabel, type KhitanPackage } from "@/data/packages";

export function PackageCard({ item }: { item: KhitanPackage }) {
  const isModern = item.tone === "blue";

  return (
    <article aria-labelledby={`package-${item.id}`} aria-describedby="package-price-status" data-price-status={item.priceStatus} className="flex min-h-[242px] min-w-0 flex-col rounded-[20px] border border-[rgba(123,123,123,0.3)] bg-white px-[18px] pt-[18px] pb-2">
      <h2 id={`package-${item.id}`} className={`inline-flex min-h-7 items-center self-start rounded-[5px] px-3 text-[10px] leading-[1.65] font-semibold uppercase ${isModern ? "bg-[rgba(0,40,105,0.2)] text-primary" : "bg-[#fff5e5] text-[#886326]"}`}>
        {item.name}
      </h2>
      <p className="mt-[7px] text-[40px] leading-[1.2] font-bold tracking-[-0.025em] text-primary">
        {packagePriceLabel(item)}
      </p>
      <p className="text-[13px] leading-[1.65] text-muted">per pasien</p>
      <ul className="mt-[14px] text-[13px] leading-[1.65] text-muted">
        {item.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <Asset name="package-tick.svg" width={16} height={16} className="mt-[3px] shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <ContactAction message={item.message} className={`mt-5 flex min-h-11 w-full items-center justify-center gap-3 rounded-[10px] px-3 py-2.5 text-[12px] font-semibold ${isModern ? "bg-[#1a5aa6] text-white" : "bg-[#eef4fd] text-primary"}`}>
        {item.actionLabel}
        <Asset name={isModern ? "package-arrow-white.svg" : "package-arrow-blue.svg"} width={14} height={14} className="shrink-0" />
      </ContactAction>
      <Link href={{ pathname: "/pendaftaran", query: { paket: item.id } }} className="cta-motion mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[10px] px-3 py-2 text-[12px] font-semibold text-primary underline underline-offset-4">
        Daftar {item.name}
        <Asset name="package-arrow-blue.svg" width={14} height={14} className="shrink-0" />
      </Link>
    </article>
  );
}
