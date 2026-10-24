"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ContactAction } from "@/components/ui/ContactAction";
import { galleryMedia } from "@/data/media";
import { acquireScrollLock } from "@/lib/scroll-lock";
import styles from "./GallerySection.module.css";

const filters = ["Semua", "Foto", "Video"] as const;
type Filter = typeof filters[number];

const photos = galleryMedia.filter(item => item.type === "photo");
const videos = galleryMedia.filter(item => item.type === "video");
// Keep the overview varied without changing the source collection or filtered order.
const overviewMedia = Array.from({ length: Math.max(Math.ceil(photos.length / 5), videos.length) }, (_, index) => [
  ...photos.slice(index * 5, (index + 1) * 5),
  ...(videos[index] ? [videos[index]] : []),
]).flat();

function imageSizes(filter: Filter, index: number) {
  if (filter === "Video") return "(min-width: 1200px) 556px, (min-width: 768px) calc((100vw - 88px) / 2), calc(100vw - 70px)";
  if (filter === "Foto") return "(min-width: 1200px) 362px, (min-width: 1024px) calc((100vw - 112px) / 3), (min-width: 768px) calc((100vw - 88px) / 2), calc((100vw - 98px) / 2)";
  return index === 0
    ? "(min-width: 1200px) 446px, (min-width: 1024px) calc((100vw - 112px) * .412), (min-width: 768px) calc((100vw - 88px) / 2), calc(100vw - 70px)"
    : "(min-width: 1200px) 318px, (min-width: 1024px) calc((100vw - 112px) * .294), (min-width: 768px) calc((100vw - 88px) / 2), calc((100vw - 98px) / 2)";
}

function GalleryVideo({ src, poster, title }: { src: string; poster: string; title: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = video.current;
    const source = element?.querySelector("source");
    // Restore the source after Strict Mode cleanup without fetching before play.
    source?.setAttribute("src", src);
    return () => {
      element?.pause();
      source?.removeAttribute("src");
      element?.load();
    };
  }, [src]);

  return <div className={styles.videoPlayer}>
    <video ref={video} controls playsInline preload="none" poster={poster} aria-label={title}
      onLoadStart={() => setStatus(current => current === "error" ? current : "loading")} onWaiting={() => setStatus(current => current === "error" ? current : "loading")}
      onCanPlay={() => setStatus(current => current === "error" ? current : "ready")} onPlaying={() => setStatus(current => current === "error" ? current : "ready")}
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
  const additional = useRef<HTMLDetailsElement>(null);
  const summary = useRef<HTMLElement>(null);
  const initialCount = filter === "Semua" ? 3 : filter === "Foto" ? 6 : 2;
  const visibleMedia = filter === "Semua" ? overviewMedia : filter === "Foto" ? photos : videos;
  const selectedMedia = selected === null ? null : visibleMedia[selected];
  const photoCount = visibleMedia.filter(item => item.type === "photo").length;
  const videoCount = visibleMedia.filter(item => item.type === "video").length;
  const isOpen = Boolean(selectedMedia);

  useEffect(() => {
    if (!isOpen) return;
    const modal = dialog.current;
    const fallback = summary.current;
    modal?.showModal();
    const releaseScrollLock = acquireScrollLock();
    return () => {
      modal?.close();
      releaseScrollLock();
      const launcher = trigger.current;
      const collection = launcher?.closest("details");
      if (launcher?.isConnected && (!collection || collection.open)) launcher.focus({ preventScroll: true });
      else fallback?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  function changeFilter(value: Filter) {
    setSelected(null);
    if (additional.current) additional.current.open = false;
    setFilter(value);
  }

  function renderGrid(items: typeof visibleMedia, offset = 0) {
    return <div className={`${styles.grid} ${filter === "Foto" ? styles.photoGrid : filter === "Video" ? styles.videoGrid : styles.overviewGrid}`} data-gallery-mode={filter} data-reveal-group>
      {items.map((item, localIndex) => {
        const index = offset + localIndex;
        return <article key={item.id} className={`${styles.card} ${filter === "Semua" && localIndex === 0 ? styles.featured : ""}`} data-reveal data-media-id={item.id} data-media-type={item.type}>
          <figure>
            <button type="button" aria-label={`${item.type === "video" ? "Putar video" : "Perbesar foto"}: ${item.title}. ${item.caption}`} aria-haspopup="dialog" onClick={event => { trigger.current = event.currentTarget; setSelected(index); }}>
              <span className={styles.image}>
                <Image src={item.thumbnail} alt={item.alt} fill sizes={imageSizes(filter, localIndex)} fetchPriority={index === 0 ? "high" : undefined} loading={index === 0 ? "eager" : "lazy"} style={{ objectPosition: item.height > item.width ? "center 35%" : "center" }} />
                {item.type === "video" && <span className={styles.playBadge} aria-hidden="true">▶ Video</span>}
              </span>
            </button>
            <figcaption className={styles.copy}><span className={styles.title}>{item.title}</span><span className={styles.caption}>{item.caption}</span></figcaption>
          </figure>
        </article>;
      })}
    </div>;
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
    {filter === "Video" && <p className={styles.videoIntro}>{videos.length} video cerita dan suasana Sagara. Pilih video untuk menonton.</p>}
    {visibleMedia.length === 0 ? <p className={styles.empty} role="status">Belum ada media untuk filter ini.</p> : renderGrid(visibleMedia.slice(0, initialCount))}
    <aside className={styles.contact} data-reveal>
      <h2><Image src="/images/figma/gallery-chat.svg" alt="" width={19} height={17.9314} style={{ height: "auto", flexShrink: 0 }} />Punya pertanyaan tentang layanan?</h2>
      <p>Admin Sagara siap membantu Anda</p>
      <ContactAction className={styles.contactLink}>Hubungi admin <Image src="/images/figma/gallery-arrow.svg" alt="" width={14} height={14} /></ContactAction>
    </aside>
    {visibleMedia.length > initialCount && <details ref={additional} className={styles.additional}>
      <summary ref={summary}>Lihat media lainnya <span>({visibleMedia.length - initialCount} media)</span></summary>
      {renderGrid(visibleMedia.slice(initialCount), initialCount)}
    </details>}
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
