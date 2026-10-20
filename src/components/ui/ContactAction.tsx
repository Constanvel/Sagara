import type { ReactNode } from "react";
import { whatsappUrl } from "@/lib/whatsapp";

export function ContactAction({ children, message, className = "" }: { children: ReactNode; message?: string; className?: string }) {
  const href = whatsappUrl(message);
  const classes = `cta-motion inline-flex min-h-11 items-center justify-center gap-2.5 rounded-xl px-4 py-2.5 text-center text-sm font-bold transition-colors hover:brightness-95 ${className}`;
  if (!href) return <span aria-disabled="true" className={classes}>{children} — Kontak belum tersedia</span>;
  return <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>{children}<span className="sr-only"> (WhatsApp, tab baru)</span></a>;
}
