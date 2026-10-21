"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ContactAction } from "@/components/ui/ContactAction";
import { galleryMedia } from "@/data/media";
import styles from "./GallerySection.module.css";

const filters = ["Semua", "Foto", "Video"] as const;
type Filter = typeof filters[number];

function GalleryVideo({ src, poster, title }: { src: string; poster: string; title: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");

  return <div className={styles.videoPlayer}>
    <video controls playsInline preload="none" poster={poster} aria-label={title}
      onLoadStart={() => setStatus("loading")} onWaiting={() => setStatus("loading")}
      onCanPlay={() => setStatus("ready")} onPlaying={() => setStatus("ready")}
      onError={() => setStatus("error")}>
      <source src={src} type="video/mp4" onError={() => setStatus("error")} />
      Browser Anda tidak mendukung video. <a href={src}>Buka video</a>.
    </video>
    <p className={styles.videoStatus} role="status">{status === "loading" ? "Memuat video…" : status === "error" ? <>Video tidak dapat diputar. <a href={src}>Buka video langsung</a>.</> : status === "idle" ? "Tekan putar untuk menonton video." : ""}</p>
  </div>;
}

export function GallerySection() {
  const [filter, setFilter] = useState<Filter>("Semua");
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const visibleMedia = galleryMedia.filter(item => filter === "Semua" || item.type === (filter === "Foto" ? "photo" : "video"));
  const selectedMedia = selected === null ? null : visibleMedia[selected];
  const photoCount = visibleMedia.filter(item => item.type === "photo").length;
  const videoCount = visibleMedia.filter(item => item.type === "video").length;
  const isOpen = Boolean(selectedMedia);

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

  function changeFilter(value: Filter) {
    setSelected(null);
    setFilter(value);
  }

  return <section className={styles.section} aria-labelledby="gallery-title">
    <div className={styles.intro}>
      <p className={styles.label}><span aria-hidden="true" />Galeri Sagara</p>
      <h1 id="gallery-title">Cerita para jagoan</h1>
      <p className={styles.description}>Momen keluarga, suasana, dan cerita Sagara</p>
      <div className={styles.filters} role="group" aria-label="Filter galeri">
        {filters.map(value => <button key={value} type="button" aria-pressed={filter === value} onClick={() => changeFilter(value)}>{value}</button>)}
      </div>
      <p className="sr-only" role="status">{filter}: {photoCount} foto, {videoCount} video.</p>
    </div>
    {visibleMedia.length === 0 ? <p className={styles.empty} role="status">Belum ada media untuk filter ini.</p> : <div className={styles.grid} data-reveal-group>
      {visibleMedia.map((item, index) => <article key={item.id} className={`${styles.card} ${index === 0 ? styles.featured : ""}`} data-reveal data-media-id={item.id} data-media-type={item.type}>
        <figure>
          <button type="button" aria-label={`${item.type === "video" ? "Putar video" : "Perbesar foto"}: ${item.title}. ${item.caption}`} aria-haspopup="dialog" onClick={event => { trigger.current = event.currentTarget; setSelected(index); }}>
            <span className={styles.image}>
              <Image src={item.thumbnail} alt={item.alt} fill sizes="(min-width: 1024px) 380px, (min-width: 768px) 45vw, 90vw" loading={index === 0 ? "eager" : "lazy"} style={{ objectPosition: item.height > item.width ? "center 35%" : "center" }} />
              {item.type === "video" && <span className={styles.playBadge} aria-hidden="true">▶ Video</span>}
            </span>
          </button>
          <figcaption className={styles.copy}><span className={styles.title}>{item.title}</span><span className={styles.caption}>{item.caption}</span></figcaption>
        </figure>
      </article>)}
    </div>}
    <aside className={styles.contact} data-reveal>
      <h2><Image src="/images/figma/gallery-chat.svg" alt="" width={19} height={17.9314} />Punya pertanyaan tentang layanan?</h2>
      <p>Admin Sagara siap membantu Anda</p>
      <ContactAction className={styles.contactLink}>Hubungi admin <Image src="/images/figma/gallery-arrow.svg" alt="" width={14} height={14} /></ContactAction>
    </aside>
    <dialog ref={dialog} className={styles.dialog} aria-labelledby="gallery-dialog-title" aria-describedby="gallery-dialog-caption" onClose={() => setSelected(null)} onCancel={() => setSelected(null)} onClick={event => { if (event.target === event.currentTarget) setSelected(null); }}>
      {selectedMedia && selected !== null && <div className={styles.dialogContent}>
        <button type="button" autoFocus onClick={() => setSelected(null)} aria-label="Tutup media" className={styles.close}>Tutup ×</button>
        <figure>
          {selectedMedia.type === "video" ? <GalleryVideo key={selectedMedia.id} src={selectedMedia.src} poster={selectedMedia.thumbnail} title={selectedMedia.title} /> : <div className={styles.fullImage}><Image key={selectedMedia.id} src={selectedMedia.src} alt={selectedMedia.alt} fill sizes="90vw" /></div>}
          <figcaption>
            <h2 id="gallery-dialog-title">{selectedMedia.title}</h2>
            <p id="gallery-dialog-caption">{selectedMedia.caption}</p>
          </figcaption>
        </figure>
        <p className={styles.counter} aria-live="polite">{selected + 1} dari {visibleMedia.length}</p>
        <div className={styles.controls}>
          <button type="button" onClick={() => setSelected((selected + visibleMedia.length - 1) % visibleMedia.length)}>Sebelumnya</button>
          <button type="button" onClick={() => setSelected((selected + 1) % visibleMedia.length)}>Berikutnya</button>
        </div>
      </div>}
    </dialog>
  </section>;
}
