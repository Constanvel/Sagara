"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { serviceVideo } from "@/data/media";
import styles from "./AboutVideo.module.css";

export function AboutVideo() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!open) return;
    const modal = dialog.current;
    const player = video.current;
    const button = trigger.current;
    modal?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      player?.pause();
      modal?.close();
      document.body.style.overflow = overflow;
      button?.focus({ preventScroll: true });
    };
  }, [open]);
  return <>
    <button ref={trigger} type="button" className={styles.poster} aria-label="Putar video cerita layanan Sagara" onClick={() => { setError(false); setLoading(true); setOpen(true); }}>
      <Image src={serviceVideo.thumbnail} alt="Petugas Sagara mengenakan lampu kepala saat memberikan layanan." fill sizes="(min-width: 768px) 550px, 90vw" />
      <Image className={styles.play} src="/images/media/sagara-video-play.svg" alt="" width={66} height={66} />
    </button>
    <dialog ref={dialog} className={styles.dialog} aria-labelledby="about-video-title" onCancel={() => setOpen(false)} onClick={event => { if (event.target === event.currentTarget) setOpen(false); }}>
      {open && <div className={styles.content}>
        <button type="button" autoFocus onClick={() => setOpen(false)} className={styles.close}>Tutup video ×</button>
        <h2 id="about-video-title">Cerita layanan Sagara</h2>
        <video ref={video} controls playsInline preload="metadata" poster={serviceVideo.thumbnail} onLoadedData={() => setLoading(false)} onError={() => { setError(true); setLoading(false); }} aria-label="Video cerita layanan Sagara">
          <source src={serviceVideo.src} type="video/mp4" />
          Browser Anda tidak mendukung video. <a href={serviceVideo.src}>Buka video</a>.
        </video>
        {loading && !error && <p role="status">Menyiapkan video…</p>}
        {error && <p role="alert">Video belum dapat dimuat. <a href={serviceVideo.src}>Buka file video</a> atau coba lagi.</p>}
        <p>Video suasana dan layanan Sagara. Pemutaran dimulai melalui kontrol video.</p>
      </div>}
    </dialog>
  </>;
}
