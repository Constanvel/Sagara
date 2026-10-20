import { Asset } from "@/components/ui/Asset";
import { ContactAction } from "@/components/ui/ContactAction";
import type { KhitanPackage } from "@/data/packages";

const priceFormatter = new Intl.NumberFormat("id-ID");

export function PackageCard({ item }: { item: KhitanPackage }) {
  const isModern = item.tone === "blue";

  return (
    <article aria-labelledby={`package-${item.id}`} aria-describedby="package-price-status" data-price-status={item.priceStatus} className="flex min-h-[242px] min-w-0 flex-col rounded-[20px] border border-[rgba(123,123,123,0.3)] bg-white px-[18px] pt-[18px] pb-2">
      <h2 id={`package-${item.id}`} className={`inline-flex min-h-7 items-center self-start rounded-[5px] px-3 text-[10px] leading-[1.65] font-semibold uppercase ${isModern ? "bg-[rgba(0,40,105,0.2)] text-primary" : "bg-[#fff5e5] text-[#886326]"}`}>
        {item.name}
      </h2>
      <p className="mt-[7px] text-[clamp(30px,9.7vw,40px)] leading-[1.4] font-bold tracking-[-0.025em] text-primary">
        Rp{priceFormatter.format(item.price)}
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
      <ContactAction message={item.message} className={`relative z-0 mt-auto w-full !gap-0 !rounded-[10px] !p-0 !text-[12px] !font-semibold before:absolute before:inset-x-0 before:top-1/2 before:-z-10 before:h-8 before:-translate-y-1/2 before:rounded-[10px] ${isModern ? "text-white before:bg-[#1a5aa6]" : "text-primary before:bg-[#eef4fd]"}`}>
        {item.actionLabel}
        <Asset name={isModern ? "package-arrow-white.svg" : "package-arrow-blue.svg"} width={14} height={14} className="absolute right-[18%] shrink-0" />
      </ContactAction>
    </article>
  );
}
