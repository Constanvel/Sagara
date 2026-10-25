"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./HeroCarousel.module.css";
import { carouselSlides as slides } from "@/data/media/hero-slides";

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const viewport = useRef<HTMLDivElement>(null);
  const dots = useRef<HTMLDivElement>(null);
  const activeIndex = useRef(0);
  const gesture = useRef<{ id: number; x: number; y: number; left: number; horizontal: boolean } | null>(null);
  function go(next: number) {
    const target = Math.max(0, Math.min(slides.length - 1, next));
    const element = viewport.current;
    if (element) element.scrollTo({ left: target * element.clientWidth, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    let width = element.clientWidth;
    const observer = new ResizeObserver(() => {
      if (width === element.clientWidth) return;
      width = element.clientWidth;
      element.scrollTo({ left: activeIndex.current * width, behavior: "instant" });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const container = dots.current;
    const dot = container?.children[index] as HTMLElement | undefined;
    if (container && dot) container.scrollLeft = dot.offsetLeft - container.offsetLeft - container.clientWidth / 2 + dot.clientWidth / 2;
  }, [index]);
  return <div className="hero-visual mx-auto mt-6 w-[calc(100%-58px)] max-w-[480px] lg:mt-0 lg:w-full lg:max-w-none" role="region" aria-roledescription="carousel" aria-label="Cerita jagoan Sagara" onKeyDown={event => {
    if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      go(event.key === "Home" ? 0 : event.key === "End" ? slides.length - 1 : index + (event.key === "ArrowRight" ? 1 : -1));
    }
  }}>
    <div className={styles.frame}>
      <div ref={viewport} className={styles.viewport} tabIndex={0} aria-label="Geser foto jagoan" onScroll={event => {
        const element = event.currentTarget;
        const nextIndex = Math.max(0, Math.min(slides.length - 1, Math.round(element.scrollLeft / element.clientWidth)));
        if (nextIndex !== activeIndex.current) {
          activeIndex.current = nextIndex;
          setIndex(nextIndex);
        }
      }} onPointerDown={event => {
        if (event.pointerType !== "mouse" || event.button !== 0) return;
        gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY, left: event.currentTarget.scrollLeft, horizontal: false };
      }} onPointerMove={event => {
        const state = gesture.current;
        if (!state || state.id !== event.pointerId) return;
        const dx = event.clientX - state.x;
        if (!state.horizontal && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(event.clientY - state.y) * 1.25) {
          state.horizontal = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          event.currentTarget.dataset.dragging = "true";
        }
        if (state.horizontal) event.currentTarget.scrollLeft = state.left - dx;
      }} onPointerUp={event => {
        const state = gesture.current;
        if (state?.horizontal) {
          delete event.currentTarget.dataset.dragging;
          const dx = event.clientX - state.x;
          const start = Math.round(state.left / event.currentTarget.clientWidth);
          go(start + (Math.abs(dx) > Math.min(80, event.currentTarget.clientWidth * .18) ? (dx < 0 ? 1 : -1) : 0));
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
        gesture.current = null;
      }} onPointerCancel={event => { delete event.currentTarget.dataset.dragging; gesture.current = null; }}>
        {slides.map((slide, i) => <div key={slide.src} className={styles.slide} role="group" aria-roledescription="slide" aria-label={`${i + 1} dari ${slides.length}`} aria-hidden={i !== index} data-image-src={slide.src}>
          {(i === 0 || Math.abs(i - index) <= 1) && <Image src={slide.src} alt={slide.alt} fill preload={i === 0} loading={i === 0 ? undefined : "lazy"} draggable={false} sizes="(min-width: 1200px) 507px, (min-width: 1024px) calc((100vw - 164px) / 2.08), (min-width: 548px) 470px, calc(100vw - 68px)" className={styles.photo} />}
        </div>)}
      </div>
      <button type="button" className={`${styles.arrow} ${styles.previous}`} aria-label="Foto sebelumnya" aria-disabled={index === 0} onClick={() => go(index - 1)}><Image src="/images/figma/hero-arrow-right.svg" width={21} height={21} alt="" /></button>
      <button type="button" className={`${styles.arrow} ${styles.next}`} aria-label="Foto berikutnya" aria-disabled={index === slides.length - 1} onClick={() => go(index + 1)}><Image src="/images/figma/hero-arrow-right.svg" width={21} height={21} alt="" /></button>
      <div className={styles.caption} aria-live="polite" aria-atomic="true"><div className={styles.captionText}><p className="font-extrabold">{slides[index].heading}</p><p>{slides[index].description}</p></div></div>
    </div>
    <div className={styles.pagination}>
      <div ref={dots} className={styles.dots} role="group" aria-label="Pilih foto hero">{slides.map((_, i) => <button type="button" key={i} aria-label={`Tampilkan foto ${i + 1}`} aria-pressed={i === index} onClick={() => go(i)}><span /></button>)}</div>
      <p className={styles.counter} aria-live="polite" aria-atomic="true">Foto {index + 1} dari {slides.length}</p>
    </div>
  </div>;
}
