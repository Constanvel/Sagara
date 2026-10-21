import Link from "next/link";
import { Asset } from "@/components/ui/Asset";
import { ContactAction } from "@/components/ui/ContactAction";
import type { KhitanService } from "@/data/services";

export function ServiceCard({ service }: { service: KhitanService }) {
  return (
    <article aria-labelledby={`service-${service.id}`} className="min-w-0">
      <ContactAction message={service.message} className="service-card relative min-h-[91px] w-full !justify-start !gap-[11px] !rounded-[20px] border border-[rgba(123,123,123,0.3)] bg-white !px-[18px] !py-[10px] !text-left !font-normal">
        <span aria-hidden="true" className="mt-2 flex size-[41px] shrink-0 items-center justify-center self-start rounded-[10px] bg-[#eef5ff]">
          <Asset name={service.icon} width={service.iconWidth} height={service.iconHeight} className="shrink-0" />
        </span>
        <span className="min-w-0 flex-1 self-start">
          <span id={`service-${service.id}`} className="block pr-4 text-[16px] leading-[1.65] font-bold text-primary">{service.title}</span>
          <span className="block pr-10 text-[13px] leading-[1.4] text-muted">{service.description}</span>
        </span>
        <Asset name="service-arrow.svg" width={14} height={14} className="card-arrow absolute top-[18px] right-[18px]" />
      </ContactAction>
      <Link href={{ pathname: "/pendaftaran", query: { layanan: service.id } }} className="cta-motion mt-2 inline-flex min-h-11 items-center gap-2 rounded-[10px] px-3 py-2 text-[13px] font-semibold text-primary underline underline-offset-4">
        Daftar layanan<span className="sr-only"> {service.title}</span>
        <Asset name="service-arrow.svg" width={14} height={14} className="shrink-0" />
      </Link>
    </article>
  );
}
