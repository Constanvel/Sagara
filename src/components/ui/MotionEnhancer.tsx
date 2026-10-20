"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "@/lib/motion";

/** Progressive enhancement: no hidden content, route blocking, or animation dependency. */
export function MotionEnhancer() {
  const pathname = usePathname();
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches || !("IntersectionObserver" in window)) return;
    const animations = new Set<Animation>();
    const play = (element: Element, distance: number, duration: number, delay = 0) => {
      const animation = element.animate([
        { opacity: 0, translate: `0 ${distance}px` },
        { opacity: 1, translate: "0 0" },
      ], { duration, delay, easing: motion.ease });
      animations.add(animation);
      animation.onfinish = () => animations.delete(animation);
    };
    const page = document.querySelector("[data-page-content]") ?? document.querySelector("main");
    if (page) play(page, 10, motion.page);
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        // Initial viewport is handled by page entrance, not a second reveal.
        if (preference.matches || entry.time < started + motion.page) continue;
        const siblings = Array.from(entry.target.parentElement?.children ?? []);
        play(entry.target, 18, motion.reveal, (siblings.indexOf(entry.target) % 3) * motion.stagger);
      }
    }, { threshold: 0.08 });
    const started = performance.now();
    document.querySelectorAll("main article, main [data-reveal], main h2, [data-faq-item], .contact-card").forEach(element => {
      // Animate the card or its heading, never both.
      if (element.matches("h2") && element.closest("article, [data-faq-item], .contact-card")) return;
      observer.observe(element);
    });
    const stop = () => { if (preference.matches) animations.forEach(animation => animation.cancel()); };
    preference.addEventListener("change", stop);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", stop);
      animations.forEach(animation => animation.cancel());
    };
  }, [pathname]);
  return null;
}
