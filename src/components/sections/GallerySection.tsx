"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ContactAction } from "@/components/ui/ContactAction";
import styles from "./GallerySection.module.css";

// Figma intentionally reuses one photograph across all three editorial slots.
const photos = [
  { title: "Senyum setelah langkah berani", caption: "Momen keluarga Sagara" },
  { title: "Kenalan dengan Sagara", caption: "Momen di Sagara" },
  { title: "Fasilitas Sagara", caption: "Suasana Sagara" },
];
const image = "/images/figma/gallery-family.png";
const alt = "Seorang anak bersama pendamping berfoto di depan latar ucapan keberanian setelah khitan di Sagara";

export function GallerySection() {
  const [filter, setFilter] = useState("Semua");
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);

  const isOpen = selected !== null;
  useEffect(() => {
    if (!isOpen) return;
    const modal = dialog.current;
    modal?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      modal?.close();
      document.body.style.overflow = previous;
      trigger.current?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  return <section className={styles.section} aria-labelledby="gallery-title">
    <div className={styles.intro}>
      <p className={styles.label}><span aria-hidden="true" />Galeri Sagara</p>
      <h1 id="gallery-title">Cerita para jagoan</h1>
      <p className={styles.description}>Momen keluarga, suasana, dan cerita Sagara</p>
      <div className={styles.filters} role="group" aria-label="Filter galeri">
        {["Semua", "Foto"].map(value => <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)}>{value}</button>)}
      </div>
      <p className="sr-only" role="status">{filter}: 3 foto. Seluruh koleksi saat ini berupa foto.</p>
    </div>
    <div className={styles.grid} data-reveal-group>
      {photos.map((photo, index) => <article key={photo.title} className={`${styles.card} ${index === 0 ? styles.featured : ""}`} data-reveal>
        <button type="button" aria-label={`Perbesar foto: ${photo.title}. ${photo.caption}`} onClick={event => { trigger.current = event.currentTarget; setSelected(index); }}>
          <span className={styles.image}><Image src={image} alt={alt} fill sizes="(min-width: 1024px) 520px, (min-width: 768px) 45vw, 90vw" priority={index === 0} /></span>
          <span className={styles.copy}><span className={styles.title}>{photo.title}</span><span className={styles.caption}>{photo.caption}</span></span>
        </button>
      </article>)}
    </div>
    <aside className={styles.contact} data-reveal>
      <h2><Image src="/images/figma/gallery-chat.svg" alt="" width={19} height={17.9314} />Punya pertanyaan tentang layanan?</h2>
      <p>Admin Sagara siap membantu Anda</p>
      <ContactAction className={styles.contactLink}>Hubungi admin <Image src="/images/figma/gallery-arrow.svg" alt="" width={14} height={14} /></ContactAction>
    </aside>
    <dialog ref={dialog} className={styles.dialog} aria-labelledby="gallery-dialog-title" onKeyDown={event => {
      if (event.key !== "Tab") return;
      const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button"));
      const first = buttons[0];
      const last = buttons.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }} onCancel={() => setSelected(null)} onClick={event => { if (event.target === event.currentTarget) setSelected(null); }}>
      {selected !== null && <div className={styles.dialogContent}>
        <button type="button" autoFocus onClick={() => setSelected(null)} aria-label="Tutup foto" className={styles.close}>Tutup ×</button>
        <div className={styles.fullImage}><Image src={image} alt={alt} fill sizes="90vw" className="object-contain" /></div>
        <h2 id="gallery-dialog-title">{photos[selected].title}</h2>
        <p>{selected + 1} dari {photos.length}</p>
        <div className={styles.controls}>
          <button type="button" onClick={() => setSelected((selected + photos.length - 1) % photos.length)}>Sebelumnya</button>
          <button type="button" onClick={() => setSelected((selected + 1) % photos.length)}>Berikutnya</button>
        </div>
      </div>}
    </dialog>
  </section>;
}
