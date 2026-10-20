import { Asset } from "@/components/ui/Asset";
import { ContactAction } from "@/components/ui/ContactAction";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { services } from "@/data/services";

export function ServicesSection() {
  return (
    <section data-page-content aria-labelledby="catalog-heading" className="flow-root pb-7 md:pb-12">
      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => <ServiceCard key={service.id} service={service} />)}
      </div>
      <aside aria-labelledby="service-help-heading" className="mt-[27px] min-h-[98px] rounded-[20px] bg-[#e5efff] px-[21px] pt-3 pb-1">
        <div className="flex items-center gap-3">
          <Asset name="service-message.svg" width={19} height={18} className="shrink-0" />
          <h2 id="service-help-heading" className="text-[16px] leading-[1.65] font-bold text-primary">Belum yakin memilih layanan?</h2>
        </div>
        <p className="mt-1 text-[13px] leading-[1.4] text-muted">Ceritakan kebutuhan keluarga kepada admin.</p>
        <ContactAction message="Halo admin Sagara, saya belum yakin memilih layanan khitan. Saya ingin menceritakan kebutuhan keluarga dan berkonsultasi." className="-my-[7px] !justify-start !gap-4 !rounded-none !px-0 !text-[13px] text-primary">
          Tanya admin Sagara
          <Asset name="service-arrow.svg" width={14} height={14} />
        </ContactAction>
      </aside>
    </section>
  );
}
