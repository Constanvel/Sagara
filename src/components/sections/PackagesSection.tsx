import Link from "next/link";
import { Asset } from "@/components/ui/Asset";
import { ContactAction } from "@/components/ui/ContactAction";
import { packageCaveat, packages } from "@/data/packages";

const priceFormatter = new Intl.NumberFormat("id-ID");

export function PackagesSection() {
  return (
    <section aria-labelledby="packages-heading" className="mx-auto max-w-[1000px] px-6 pt-6 pb-8 md:py-12">
      <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.08em] text-primary">
        <span aria-hidden="true" className="h-[3px] w-[18px] rounded-full bg-red" />
        PAKET KHITAN
      </div>
      <h1 id="packages-heading" className="mt-3 max-w-[400px] text-[32px] leading-[1.23] font-extrabold tracking-[-0.035em] text-ink">
        Pilihan untuk keluarga.
      </h1>
      <p className="mt-3 max-w-[400px] text-[13px] leading-[1.65] text-muted">
        Tanyakan rincian paket sebelum menentukan pilihan.
      </p>

      <nav aria-label="Layanan dan paket" className="mt-9 flex gap-2.5 text-[13px] font-bold">
        <Link href="/#layanan" className="inline-flex min-h-[45px] items-center justify-center rounded-xl border border-line bg-white px-6 text-muted transition-colors hover:bg-soft">
          Layanan
        </Link>
        <Link href="/paket" aria-current="page" className="inline-flex min-h-[45px] items-center justify-center rounded-xl border border-primary bg-primary px-6 text-white">
          Paket khitan
        </Link>
      </nav>

      <div className="mt-[25px] grid gap-[23px] md:grid-cols-2">
        {packages.map((item) => {
          const isModern = item.tone === "blue";

          return (
            <article key={item.id} aria-labelledby={`package-${item.id}`} className="flex min-h-[242px] min-w-0 flex-col rounded-[20px] border border-[rgba(123,155,195,0.3)] bg-white p-[18px]">
              <h2 id={`package-${item.id}`} className={`self-start rounded-full px-3 py-1 text-[11px] leading-5 font-bold ${isModern ? "bg-[#eef4fd] text-primary" : "bg-[#fff5e5] text-[#886326]"}`}>
                {item.name}
              </h2>
              <p className="mt-2 text-[40px] leading-[1.2] font-bold tracking-[-0.04em] text-primary">
                Rp{priceFormatter.format(item.price)}
              </p>
              <p className="mt-0.5 text-[13px] leading-[1.65] text-muted">per pasien</p>
              <ul className="mt-3 mb-4 space-y-2 text-[11px] leading-[1.65] text-muted">
                {item.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Asset name="package-tick.svg" width={14} height={14} className="mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <ContactAction message={item.message} className={`mt-auto w-full !rounded-[10px] !text-[12px] ${isModern ? "bg-[#1a5aa6] text-white" : "bg-[#eef4fd] text-primary"}`}>
                {item.actionLabel}
                <Asset name={isModern ? "package-arrow-white.svg" : "package-arrow-blue.svg"} width={16} height={16} className="shrink-0" />
              </ContactAction>
            </article>
          );
        })}
      </div>

      <p className="mt-5 max-w-[640px] text-[11px] leading-[1.65] text-muted">
        {packageCaveat}
      </p>
    </section>
  );
}
