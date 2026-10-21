"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { whatsappUrl } from "@/lib/whatsapp";
import styles from "./FloatingConsultation.module.css";

const storageKey = "sagara_consultation_dismissed";
export const consultationMessage = "Halo, Admin SAGARA! 👋 Saya ingin berkonsultasi mengenai layanan khitan di SAGARA Rumah Sunat Modern. Boleh saya mendapatkan informasi mengenai pilihan layanan, persiapan, jadwal yang tersedia, dan estimasi biaya? Terima kasih.";

export function FloatingConsultation() {
  const [visible, setVisible] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const link = useRef<HTMLAnchorElement>(null);
  const dismissed = useRef(false);
  const href = whatsappUrl(consultationMessage);

  useEffect(() => {
    let timer: number | undefined;
    try { dismissed.current = localStorage.getItem(storageKey) === "true"; } catch { /* Storage may be disabled. Keep the control usable. */ }
    const ready = () => {
      timer = window.setTimeout(() => { if (!dismissed.current) setVisible(true); }, 2000);
    };
    if (document.readyState === "complete") ready();
    else window.addEventListener("load", ready, { once: true });
    const storage = (event: StorageEvent) => {
      if (event.key === storageKey && event.newValue === "true") {
        dismissed.current = true;
        setVisible(false);
      }
    };
    window.addEventListener("storage", storage);
    return () => { window.clearTimeout(timer); window.removeEventListener("load", ready); window.removeEventListener("storage", storage); };
  }, []);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    // Integrate with existing menu/dialog state without changing their components.
    const update = () => {
      element.hidden = Boolean(document.querySelector('dialog[open], #mobile-menu[data-open="true"]'));
    };
    const observer = new MutationObserver(update);
    observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["open", "data-open"] });
    update();
    return () => observer.disconnect();
  }, []);

  function dismiss() {
    dismissed.current = true;
    setVisible(false);
    try { localStorage.setItem(storageKey, "true"); } catch { /* Persist only when browser storage is available. */ }
    link.current?.focus({ preventScroll: true });
  }

  if (!href) return null;
  return <div ref={root} data-testid="floating-consultation" className={styles.root}>
    {visible && <section aria-label="Konsultasi SAGARA" className={styles.bubble}>
      <Image src="/images/media/sagara-consultation-mascot.webp" width={64} height={64} alt="" className={styles.mascot} />
      <div className={styles.copy}><h2>Konsultasi</h2><p>Ada pertanyaan? Yuk, konsultasi langsung dengan admin SAGARA!</p></div>
      <button type="button" aria-label="Tutup notifikasi konsultasi" onClick={dismiss} className={styles.close}><span aria-hidden="true">×</span></button>
    </section>}
    <a ref={link} href={href} target="_blank" rel="noopener noreferrer" aria-label="Konsultasi melalui WhatsApp (dibuka di tab baru)" className={styles.button}>
      <Image src="/images/figma/consultation-phone.svg" width={26} height={28} alt="" />
    </a>
  </div>;
}
