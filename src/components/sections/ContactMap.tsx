"use client";

import { useState, type ReactNode } from "react";

export function ContactMap({ src, children }: { src: string; children: ReactNode }) {
  const [active, setActive] = useState(false);

  if (active) return <iframe
    title="Peta lokasi SAGARA Rumah Sunat Modern Banteran"
    src={src}
    referrerPolicy="no-referrer"
    className="h-[220px] w-full rounded-[20px] border-0"
    allowFullScreen
  />;

  return <button
    type="button"
    aria-label="Muat peta interaktif Google Maps"
    onClick={() => setActive(true)}
    className="relative block h-[220px] w-full cursor-pointer overflow-hidden rounded-[20px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
  >
    {children}
    <span className="absolute inset-x-3 bottom-3 rounded-xl bg-white px-3 py-3 text-sm font-bold text-primary shadow-sm">Muat peta interaktif Google Maps</span>
  </button>;
}
