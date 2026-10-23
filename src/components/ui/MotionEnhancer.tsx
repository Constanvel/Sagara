"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "@/lib/motion";

/** Content stays visible without JavaScript, an observer, or animation support. */
export function MotionEnhancer() {
  const pathname = usePathname();
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches || typeof preference.addEventListener !== "function" || !("IntersectionObserver" in window) || typeof Element.prototype.animate !== "function") return;
    const selector = "main article, main [data-reveal], main h2, [data-faq-item], .contact-card";
    const seen = new WeakSet<Element>();
    const pending = new Map<Element, Animation>();
    const animations = new Map<Element, Animation>();
    const release = (element: Element) => {
      observer.unobserve(element);
      pending.delete(element);
      const animation = animations.get(element);
      animations.delete(element);
      animation?.cancel();
    };
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const animation = pending.get(entry.target);
        if (!animation) continue;
        observer.unobserve(entry.target);
        pending.delete(entry.target);
        // A scroll jump/history restore must not hide content already well inside
        // the viewport. The entry bounds include the initial animated translate.
        if (preference.matches || entry.boundingClientRect.top - motion.revealDistance < window.innerHeight - 120) {
          release(entry.target);
        } else {
          animation.play();
        }
      }
    }, { threshold: 0, rootMargin: "0px 0px 32px 0px" });

    const register = (elements: Element[]) => {
      // Read layout before writing animation state, and never animate nested targets.
      const candidates = [...new Set(elements)].filter(element => element.isConnected && !seen.has(element) && !element.parentElement?.closest(selector));
      const positions = candidates.map(element => ({ element, bounds: element.getBoundingClientRect() }));
      for (const { element, bounds } of positions) {
        seen.add(element);
        // Preserve first paint, restored scroll positions and content above the viewport.
        if (bounds.top < window.innerHeight || preference.matches) continue;
        try {
          const animation = element.animate([
            { opacity: 0, translate: `0 ${motion.revealDistance}px` },
            { opacity: 1, translate: "0 0" },
          ], { duration: motion.reveal, easing: motion.ease, fill: "backwards" });
          animation.pause();
          animation.currentTime = 0;
          pending.set(element, animation);
          animations.set(element, animation);
          animation.onfinish = () => release(element);
          animation.oncancel = () => {
            if (animations.get(element) !== animation) return;
            observer.unobserve(element);
            pending.delete(element);
            animations.delete(element);
          };
          observer.observe(element);
        } catch {
          // A failed enhancement must not leave the underlying content hidden.
          release(element);
        }
      }
    };
    const mutations = new MutationObserver(records => {
      if (records.some(record => record.removedNodes.length > 0)) {
        for (const element of animations.keys()) if (!element.isConnected) release(element);
      }
      const added: Element[] = [];
      for (const record of records) for (const node of record.addedNodes) {
        if (!(node instanceof Element)) continue;
        if (node.matches(selector)) added.push(node);
        added.push(...node.querySelectorAll(selector));
      }
      register(added);
    });
    const main = document.querySelector("main");
    if (main) mutations.observe(main, { childList: true, subtree: true });
    register(Array.from(document.querySelectorAll(selector)));
    // Keyboard focus must never land on content hidden by a pending reveal.
    const focus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      for (const element of animations.keys()) if (element.contains(event.target)) release(element);
    };
    const stop = () => {
      if (!preference.matches) return;
      observer.disconnect();
      mutations.disconnect();
      for (const element of animations.keys()) release(element);
    };
    document.addEventListener("focusin", focus);
    preference.addEventListener("change", stop);
    return () => {
      observer.disconnect();
      mutations.disconnect();
      preference.removeEventListener("change", stop);
      document.removeEventListener("focusin", focus);
      for (const element of animations.keys()) release(element);
    };
  }, [pathname]);
  return null;
}
