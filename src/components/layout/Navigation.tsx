"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { whatsappUrl } from "@/lib/whatsapp";

const links = [
  { label: "Beranda", href: "/", icon: "imgVector1.svg" },
  { label: "Layanan", href: "/#layanan", icon: "imgVector2.svg" },
  { label: "Galeri", href: null, icon: "imgVector3.svg" },
  { label: "Kontak", href: "/#kontak", icon: "imgGroup1.svg" },
];
export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    menu.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); }
      if (event.key === "Tab") {
        const items = [toggle.current, ...Array.from(menu.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [])].filter(Boolean) as HTMLElement[];
        const index = items.indexOf(document.activeElement as HTMLElement);
        if (event.shiftKey && index === 0) { event.preventDefault(); items.at(-1)?.focus(); }
        if (!event.shiftKey && index === items.length - 1) { event.preventDefault(); items[0]?.focus(); }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  return <header className="site-header relative z-40 bg-white shadow-[0_0_4px_rgba(0,0,0,0.25)] lg:sticky lg:top-0 lg:border-b lg:border-line/70 lg:bg-white/95 lg:shadow-none lg:backdrop-blur-xl">
    <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-[17px] lg:h-20 lg:px-6">
      <Link href="/" aria-label="SAGARA — Beranda" className="flex items-center gap-[7px]">
        <span className="relative block h-8 w-10 overflow-hidden"><Image src="/images/figma/imgImageRemovebgPreview82.png" alt="" width={40} height={40} className="absolute top-[0.5px] h-10 w-10" priority /></span>
        <span><span className="block text-[15px] leading-[25px] font-extrabold tracking-[-0.5px] text-navy">SAGARA</span><span className="block text-[8px] leading-4 font-bold tracking-[0.55px] text-[#db322f]">RUMAH SUNAT MODERN</span></span>
      </Link>
      <nav aria-label="Navigasi utama" className="hidden items-center gap-2 rounded-2xl border border-line/70 bg-soft/70 p-1.5 text-sm font-bold text-primary lg:flex">{links.map(link => {
        const active = pathname === "/paket" ? link.label === "Layanan" : link.label === "Beranda";
        const classes = `desktop-nav-item flex min-h-11 items-center gap-2 rounded-xl px-4 ${active ? "bg-white text-navy shadow-sm" : "text-muted"}`;
        const content = <><Image src={`/images/figma/${link.icon}`} alt="" width={18} height={18} /><span>{link.label}</span></>;
        return link.href ? <Link key={link.label} href={link.href} aria-current={active && pathname === "/" ? "page" : undefined} className={classes}>{content}</Link> : <span key={link.label} aria-disabled="true" title="Segera hadir" className={`${classes} cursor-not-allowed opacity-55`}>{content}<span className="sr-only"> — segera hadir</span></span>;
      })}</nav>
      <button ref={toggle} type="button" aria-label={open ? "Tutup menu" : "Buka menu"} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)} className="flex size-11 items-center justify-center text-navy lg:hidden">{open ? <span aria-hidden="true" className="text-[27px] leading-none">×</span> : <Image src="/images/figma/menu.svg" alt="" width={24} height={24} />}</button>
    </div>
    {open && <nav ref={menu} id="mobile-menu" aria-label="Menu seluler" className="absolute inset-x-0 top-14 grid gap-1 border-t border-line bg-white p-4 shadow-lg lg:hidden">{links.map(link => link.href ? <Link key={link.label} href={link.href} onClick={() => { setOpen(false); toggle.current?.focus(); }} className="rounded-lg p-3 text-sm font-bold text-primary">{link.label}</Link> : <span key={link.label} aria-disabled="true" className="p-3 text-sm text-muted">Galeri — segera hadir</span>)}</nav>}
  </header>;
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const items = [
    { label: "Beranda", href: "/", icon: "imgVector1.svg", active: pathname === "/" },
    { label: "Layanan", href: "/#layanan", icon: "imgVector2.svg", active: pathname === "/paket" },
    { label: "Galeri", href: null, icon: "imgVector3.svg", active: false },
    { label: "Kontak", href: whatsappUrl(), icon: "imgGroup1.svg", active: false },
  ];
  return <nav aria-label="Navigasi bawah" className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_0_4px_rgba(0,0,0,0.25)] lg:hidden"><div className="mx-auto grid h-[69px] max-w-[600px] grid-cols-4">{items.map(item => {
    const content = <><Image src={`/images/figma/${item.icon}`} alt="" width={19} height={19} className="h-[19px] w-auto" /><span>{item.label}</span></>;
    const classes = `relative flex flex-col items-center justify-center gap-1 text-[10px] ${item.active ? "font-extrabold text-primary before:absolute before:top-0 before:h-px before:w-12 before:bg-primary" : "font-medium text-[#5d718b]"}`;
    return item.href ? <Link key={item.label} href={item.href} aria-current={item.active ? "page" : undefined} className={classes}>{content}</Link> : <span key={item.label} aria-disabled="true" aria-label="Galeri — segera hadir" title="Segera hadir" className={classes}>{content}</span>;
  })}</div></nav>;
}
