import { CatalogIntro } from "@/components/ui/CatalogIntro";
import { ServicePackageNav } from "@/components/ui/ServicePackageNav";

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return (
    <main id="main-content" className="min-h-[calc(100dvh-56px)] bg-soft">
      <div className="mx-auto max-w-[1100px] px-6 pt-[25px] md:pt-12">
        <CatalogIntro headingId="catalog-heading" />
        <ServicePackageNav />
        {children}
      </div>
    </main>
  );
}
