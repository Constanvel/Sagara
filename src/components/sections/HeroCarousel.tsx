"use client";

import Image from "next/image";
import { useRef, useState, type PointerEvent } from "react";
import styles from "./HeroCarousel.module.css";

const slides = [
  { src: "/images/figma/hero.png", alt: "Seorang anak bersama pendamping memegang sertifikat dan hadiah SAGARA.", original: true },
  { src: "/images/figma/gallery-family.png", alt: "Seorang anak bersama pendamping berfoto di Sagara setelah khitan.", original: false },
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState(0);
  const gesture = useRef<{ id: number; x: number; y: number; dx: number; axis: "x" | "y" | null } | null>(null);
  const viewport = useRef<HTMLDivElement>(null);
  function go(next: number) { gesture.current = null; setDrag(0); setIndex(Math.max(0, Math.min(slides.length - 1, next))); }
  function move(event: PointerEvent<HTMLDivElement>) {
    const state = gesture.current;
    if (!state || state.id !== event.pointerId) return;
    const dx = event.clientX - state.x;
    const dy = event.clientY - state.y;
    if (!state.axis && Math.max(Math.abs(dx), Math.abs(dy)) > 8) state.axis = Math.abs(dx) > Math.abs(dy) * 1.25 ? "x" : "y";
    if (state.axis !== "x") return;
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.setPointerCapture(event.pointerId);
    state.dx = dx;
    const edge = (index === 0 && dx > 0) || (index === slides.length - 1 && dx < 0);
    setDrag(edge ? dx * .22 : dx);
  }
  function end(event: PointerEvent<HTMLDivElement>, cancelled = false) {
    const state = gesture.current;
    if (!state || state.id !== event.pointerId) return;
    const threshold = Math.min(80, (viewport.current?.clientWidth ?? 344) * .18);
    if (!cancelled && state.axis === "x" && Math.abs(state.dx) > threshold) go(index + (state.dx < 0 ? 1 : -1));
    else { gesture.current = null; setDrag(0); }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }
  return <div className="hero-visual mx-auto mt-6 w-[calc(100%-58px)] max-w-[480px] lg:mt-0 lg:w-full lg:max-w-none" role="region" aria-roledescription="carousel" aria-label="Cerita jagoan Sagara" onKeyDown={event => {
    if (event.key === "ArrowRight") { event.preventDefault(); go(index + 1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); go(index - 1); }
  }}>
    <div className={styles.frame}>
      <div ref={viewport} className={styles.viewport} onPointerDown={event => {
        if (!event.isPrimary || event.button !== 0) return;
        gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY, dx: 0, axis: null };
      }} onPointerMove={move} onPointerUp={event => end(event)} onPointerCancel={event => end(event, true)} onLostPointerCapture={event => { if (event.target === event.currentTarget) { gesture.current = null; setDrag(0); } }}>
        <div className={styles.track} data-dragging={drag !== 0} style={{ transform: `translateX(calc(-${index * 100}% + ${drag}px))` }}>
          {slides.map((slide, i) => <div key={slide.src} className={styles.slide} role="group" aria-roledescription="slide" aria-label={`${i + 1} dari ${slides.length}`} aria-hidden={i !== index}>
            <Image src={slide.src} alt={slide.alt} fill priority={i === 0} draggable={false} sizes="(min-width: 1024px) 470px, (max-width: 412px) 85vw, 480px" className={slide.original ? styles.original : styles.photo} />
          </div>)}
        </div>
      </div>
      <button type="button" className={`${styles.arrow} ${styles.previous}`} aria-label="Foto sebelumnya" aria-disabled={index === 0} onClick={() => go(index - 1)}><Image src="/images/figma/hero-arrow-right.svg" width={21} height={21} alt="" /></button>
      <button type="button" className={`${styles.arrow} ${styles.next}`} aria-label="Foto berikutnya" aria-disabled={index === slides.length - 1} onClick={() => go(index + 1)}><Image src="/images/figma/hero-arrow-right.svg" width={21} height={21} alt="" /></button>
      <div className={styles.caption}><p className="font-extrabold">Setiap anak punya cerita beraninya.</p><p>Kami hadir untuk menemani langkahnya.</p></div>
    </div>
    <div className={styles.dots} role="group" aria-label="Pilih foto hero">{slides.map((_, i) => <button type="button" key={i} aria-label={`Tampilkan foto ${i + 1}`} aria-pressed={i === index} onClick={() => go(i)}><span /></button>)}</div>
    <p className="sr-only" aria-live="polite" aria-atomic="true">Foto {index + 1} dari {slides.length}</p>
  </div>;
}
