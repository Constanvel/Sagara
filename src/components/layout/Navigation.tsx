"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "@/lib/motion";
import styles from "./Navigation.module.css";

const mobileLinks = [
  { label: "Beranda", href: "/" },
  { label: "Tentang Sagara", href: "/#tentang-sagara" },
  { label: "Layanan & Paket", href: "/layanan" },
  { label: "Galeri", href: "/galeri" },
  { label: "FAQ", href: "/#faq" },
  { label: "Lokasi & Kontak", href: "/kontak" },
];

const links = [
  { label: "Beranda", href: "/", icon: "imgVector1.svg" },
  { label: "Layanan", href: "/layanan", icon: "imgVector2.svg" },
  { label: "Paket Khitan", href: "/paket", icon: "imgVector2.svg" },
  { label: "Galeri", href: "/galeri", icon: "imgVector3.svg" },
  { label: "Kontak", href: "/kontak", icon: "imgGroup1.svg" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLElement>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("popstate", close);
    window.addEventListener("hashchange", close);
    return () => { window.removeEventListener("popstate", close); window.removeEventListener("hashchange", close); };
  }, []);

  // A route change also closes menus opened immediately before browser navigation.
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) { setMenuPath(pathname); setOpen(false); }

  function closeMenu() {
    setOpen(false);
    toggle.current?.focus({ preventScroll: true });
  }

  useEffect(() => {
    if (!open) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => menu.current?.querySelector<HTMLAnchorElement>("a")?.focus({ preventScroll: true }), 50);
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") { setOpen(false); toggle.current?.focus({ preventScroll: true }); }
      if (event.key === "Tab") {
        const items = [toggle.current, ...Array.from(menu.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [])].filter(Boolean) as HTMLElement[];
        const index = items.indexOf(document.activeElement as HTMLElement);
        if (event.shiftKey && index === 0) { event.preventDefault(); items.at(-1)?.focus(); }
        if (!event.shiftKey && index === items.length - 1) { event.preventDefault(); items[0]?.focus(); }
      }
    }
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onResize = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", onResize);
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = overflow;
      desktop.removeEventListener("change", onResize);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return <header className="site-header relative z-40 bg-white shadow-[0_0_4px_rgba(0,0,0,0.25)] lg:sticky lg:top-0 lg:border-b lg:border-line/70 lg:bg-white/95 lg:shadow-none lg:backdrop-blur-xl">
    <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-[17px] lg:h-20 lg:px-6">
      <Link href="/" aria-label="SAGARA — Beranda" className="flex items-center gap-[7px]">
        <span className="relative block h-8 w-10 overflow-hidden"><Image src="/images/figma/imgImageRemovebgPreview82.png" alt="" width={40} height={40} className="absolute top-[0.5px] h-10 w-10" priority /></span>
        <span><span className="block text-[15px] leading-[25px] font-extrabold tracking-[-0.5px] text-navy">SAGARA</span><span className="block text-[8px] leading-4 font-bold tracking-[0.55px] text-[#db322f]">RUMAH SUNAT MODERN</span></span>
      </Link>
      <nav aria-label="Navigasi utama" className="hidden items-center gap-1 rounded-2xl border border-line/70 bg-soft/70 p-1.5 text-sm font-bold text-primary lg:flex">{links.map(link => {
        const active = pathname === link.href;
        const classes = `desktop-nav-item flex min-h-11 items-center gap-2 rounded-xl px-3 ${active ? "bg-white text-navy shadow-sm" : "text-muted"}`;
        const content = <><Image src={`/images/figma/${link.icon}`} alt="" width={18} height={18} /><span>{link.label}</span></>;
        return link.href ? <Link key={link.label} href={link.href} aria-current={active ? "page" : undefined} className={classes}>{content}</Link> : <span key={link.label} aria-disabled="true" title="Segera hadir" className={`${classes} cursor-not-allowed opacity-55`}>{content}<span className="sr-only"> — segera hadir</span></span>;
      })}</nav>
      <button ref={toggle} type="button" aria-label={open ? "Tutup menu" : "Buka menu"} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)} className={`flex size-11 items-center justify-center text-navy lg:hidden ${styles.toggle}`} data-open={open}><span aria-hidden="true" className={styles.lines}><span /><span /><span /></span></button>
    </div>
    <nav ref={menu} id="mobile-menu" aria-label="Menu seluler" aria-hidden={!open} inert={!open} data-open={open} className={`${styles.menu} lg:hidden`} onTouchStart={event => { const touch = event.touches[0]; swipe.current = { x: touch.clientX, y: touch.clientY }; }} onTouchEnd={event => {
        const start = swipe.current;
        swipe.current = null;
        if (!start) return;
        const touch = event.changedTouches[0];
        const dy = touch.clientY - start.y;
        if (dy < -60 && Math.abs(dy) > Math.abs(touch.clientX - start.x) * 1.5 && (menu.current?.scrollTop ?? 0) === 0) closeMenu();
      }} onTouchCancel={() => { swipe.current = null; }}>{mobileLinks.map((link, index) => <Link key={link.label} href={link.href} aria-current={pathname === link.href ? "page" : undefined} onClick={closeMenu} style={{ transitionDelay: open ? `${index * 20}ms` : "0ms" }}>{link.label}</Link>)}</nav>
  </header>;
}

export function MobileBottomNav() {
  const pathname = usePathname();
  // Paket belongs to the Layanan catalog; its own link is in the menu and catalog tabs.
  const items = links.filter(item => item.href !== "/paket");
  const activeIndex = Math.max(0, items.findIndex(item => pathname === item.href || (pathname === "/paket" && item.href === "/layanan")));
  const iconRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const previousIndex = useRef(activeIndex);
  useEffect(() => {
    if (previousIndex.current === activeIndex) return;
    previousIndex.current = activeIndex;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const element = iconRefs.current[activeIndex];
    const animation = element?.animate([
      { scale: "0.94", translate: "0 0" },
      { scale: "1.06", translate: "0 -3px", offset: 0.55 },
      { scale: "1", translate: "0 -2px" },
    ], { duration: motion.icon, easing: motion.ease });
    return () => animation?.cancel();
  }, [activeIndex]);
  return <nav aria-label="Navigasi bawah" className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_0_4px_rgba(0,0,0,0.25)] lg:hidden"><div className="bottom-nav-track relative mx-auto grid h-[69px] max-w-[600px] grid-cols-4">
    <span aria-hidden="true" data-testid="bottom-nav-indicator" className="bottom-nav-indicator pointer-events-none absolute top-0 left-0 h-px w-1/4" style={{ transform: `translateX(${activeIndex * 100}%)`, transitionDuration: `${motion.indicator}ms`, transitionTimingFunction: motion.spring }}><span className="mx-auto block h-px w-12 bg-primary" /></span>
    {items.map((item, index) => {
    const active = pathname === item.href || (pathname === "/paket" && item.href === "/layanan");
    const content = <><span ref={element => { iconRefs.current[index] = element; }} aria-hidden="true" className="bottom-nav-icon relative block h-[19px] w-[19px]" data-active={active}><span className="nav-icon-layer absolute inset-0 block bg-current" style={{ maskImage: `url(/images/figma/${item.icon})`, maskSize: "contain", maskPosition: "center", maskRepeat: "no-repeat" }} /></span><span>{item.label}</span></>;
    const classes = `bottom-nav-item relative flex flex-col items-center justify-center gap-1 text-[10px] ${active ? "font-extrabold text-primary" : "font-medium text-[#5d718b]"}`;
    return item.href ? <Link key={item.label} href={item.href} aria-current={active ? (pathname === item.href ? "page" : "true") : undefined} className={classes}>{content}</Link> : <span key={item.label} aria-disabled="true" aria-label="Galeri — segera hadir" title="Segera hadir" className={classes}>{content}</span>;
  })}</div></nav>;
}
