"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./ServicePackageNav.module.css";

export function ServicePackageNav() {
  const pathname = usePathname();
  const packageActive = pathname === "/paket";

  return (
    <nav aria-label="Layanan dan paket" className={`${styles.nav} mt-[37px] grid grid-cols-2 gap-2 text-[13px]`}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid grid-cols-2 gap-2">
        <span className="rounded-[10px] border border-[#7b7b7b] bg-white" />
        <span className="rounded-[10px] border border-[#7b7b7b] bg-white" />
      </div>
      <span aria-hidden="true" className={styles.indicator} data-package-active={packageActive} />
      {([
        ["/layanan", "Layanan"],
        ["/paket", "Paket khitan"],
      ] as const).map(([href, label]) => (
        <Link
          key={href}
          href={href}
          aria-current={pathname === href ? "page" : undefined}
          className={`relative inline-flex min-h-[45px] items-center justify-center rounded-[10px] border border-transparent px-3 transition-colors motion-reduce:transition-none ${pathname === href ? "font-bold text-white" : "text-[#666666] hover:text-primary"}`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
