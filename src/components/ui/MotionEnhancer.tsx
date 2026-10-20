"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Progressive enhancement: content remains visible without JavaScript. */
export function MotionEnhancer() {
  const pathname = usePathname();

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches || !("IntersectionObserver" in window)) return;
    const animations = new Set<Animation>();
    const isCatalog = pathname !== "/";
    const reveal = (element: Element, delay = 0) => {
      const animation = element.animate(
        [{ opacity: 0.25, transform: "translateY(18px)" }, { opacity: 1, transform: "translateY(0)" }],
        { duration: isCatalog ? 420 : 600, delay, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
      );
      animations.add(animation);
      animation.onfinish = () => animations.delete(animation);
    };
    if (isCatalog) {
      const intro = document.querySelector("main h1");
      if (intro) reveal(intro);
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        if (preference.matches) return;
        const siblings = Array.from(entry.target.parentElement?.children ?? []);
        const delay = isCatalog ? (siblings.indexOf(entry.target) % 3) * 65 : 0;
        reveal(entry.target, delay);
      });
    }, { threshold: 0.08 });
    const selector = isCatalog
      ? "main article, main [data-reveal]"
      : ".hero-copy, .hero-visual, .feature-grid, main > section:not(:first-child) > div, main article";
    document.querySelectorAll(selector).forEach(element => observer.observe(element));
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
