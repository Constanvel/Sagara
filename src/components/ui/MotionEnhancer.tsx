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
    // Keep server-rendered first-viewport content painted during hydration;
    // fading main restarts the LCP candidate after JavaScript loads.

    const selector = "main article, main [data-reveal], main h2, [data-faq-item], .contact-card";
    // Select the outermost candidate, never animate a container and its children.
    const candidates = Array.from(document.querySelectorAll(selector)).filter(element => !element.parentElement?.closest(selector));
    const counts = new Map<Element, number>();
    const order = new Map<Element, number>();
    for (const element of candidates) {
      const group = element.closest("[data-reveal-group]") ?? element.parentElement;
      if (!group) continue;
      const index = counts.get(group) ?? 0;
      order.set(element, index);
      counts.set(group, index + 1);
    }
    counts.clear();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        const index = order.get(entry.target) ?? 0;
        order.delete(entry.target);
        if (!preference.matches) play(entry.target, 24, motion.reveal, Math.min(index, 3) * motion.stagger);
      }
    }, { threshold: 0, rootMargin: "0px 0px -24px 0px" });
    // Filters remove cards without changing pathname. Release detached targets
    // instead of retaining their DOM through the observer and stagger maps.
    const mutations = new MutationObserver(records => {
      if (!records.some(record => record.removedNodes.length > 0)) return;
      for (const element of order.keys()) {
        if (element.isConnected) continue;
        observer.unobserve(element);
        order.delete(element);
      }
    });
    const main = document.querySelector("main");
    if (main) mutations.observe(main, { childList: true, subtree: true });
    // Snapshot the initial viewport instead of discarding entries by timestamp.
    // Initial content stays painted; only offscreen sections receive reveals.
    for (const element of candidates) {
      const bounds = element.getBoundingClientRect();
      if (bounds.top >= window.innerHeight || bounds.bottom <= 0) observer.observe(element);
      else order.delete(element);
    }
    const stop = () => {
      if (!preference.matches) return;
      observer.disconnect();
      mutations.disconnect();
      order.clear();
      animations.forEach(animation => animation.cancel());
      animations.clear();
    };
    preference.addEventListener("change", stop);
    return () => {
      observer.disconnect();
      mutations.disconnect();
      order.clear();
      preference.removeEventListener("change", stop);
      animations.forEach(animation => animation.cancel());
      animations.clear();
    };
  }, [pathname]);
  return null;
}
