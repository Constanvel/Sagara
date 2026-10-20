import Link from "next/link";

type CatalogRoute = "/layanan" | "/paket";

export function ServicePackageNav({ current }: { current: CatalogRoute }) {
  return (
    <nav aria-label="Layanan dan paket" className="mt-[37px] grid grid-cols-2 gap-2 text-[13px]">
      {([
        ["/layanan", "Layanan"],
        ["/paket", "Paket khitan"],
      ] as const).map(([href, label]) => (
        <Link
          key={href}
          href={href}
          aria-current={current === href ? "page" : undefined}
          className={`inline-flex min-h-[45px] items-center justify-center rounded-[10px] border px-3 transition-colors ${current === href ? "border-primary bg-primary font-bold text-white" : "border-[#7b7b7b] bg-white text-[#666666] hover:bg-soft"}`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
