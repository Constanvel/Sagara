"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "@/lib/motion";

/** Content stays visible without JavaScript, an observer, or animation support. */
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
      ], { duration, delay, easing: motion.ease, fill: "backwards" });
      animations.add(animation);
      const release = () => animations.delete(animation);
      animation.onfinish = release;
      animation.oncancel = release;
    };
    const page = document.querySelector("[data-page-content]") ?? document.querySelector("main");
    if (page) play(page, 10, motion.page);

    const selector = "main article, main [data-reveal], main h2, [data-faq-item], .contact-card";
    // Select the outermost candidate, never animate a container and its children.
    const candidates = Array.from(document.querySelectorAll(selector)).filter(element => !element.parentElement?.closest(selector));
    const groups = new Map<Element, Element[]>();
    const order = new Map<Element, number>();
    for (const element of candidates) {
      const group = element.closest("[data-reveal-group]") ?? element.parentElement;
      if (!group) continue;
      const items = groups.get(group) ?? [];
      order.set(element, items.length);
      items.push(element);
      groups.set(group, items);
    }
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (!preference.matches) play(entry.target, 24, motion.reveal, Math.min(order.get(entry.target) ?? 0, 3) * motion.stagger);
      }
    }, { threshold: 0, rootMargin: "0px 0px -24px 0px" });
    // Snapshot the initial viewport instead of discarding entries by timestamp.
    // Its content uses only the page entrance, avoiding competing animations.
    for (const element of candidates) {
      const bounds = element.getBoundingClientRect();
      if (bounds.top >= window.innerHeight || bounds.bottom <= 0) observer.observe(element);
    }
    const stop = () => {
      if (!preference.matches) return;
      observer.disconnect();
      animations.forEach(animation => animation.cancel());
      animations.clear();
    };
    preference.addEventListener("change", stop);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", stop);
      animations.forEach(animation => animation.cancel());
      animations.clear();
    };
  }, [pathname]);
  return null;
}
