const locks = new Set<symbol>();
let lockedBody: HTMLElement | null = null;
let originalOverflow = "";

/** Keep scrolling locked until every owner has released its own token. */
export function acquireScrollLock(): () => void {
  if (typeof document === "undefined" || !document.body) return () => {};

  const token = Symbol("scroll-lock");
  if (locks.size === 0) {
    lockedBody = document.body;
    originalOverflow = lockedBody.style.overflow;
    lockedBody.style.overflow = "hidden";
  }
  locks.add(token);

  return () => {
    if (!locks.delete(token)) return;
    if (locks.size === 0 && lockedBody) {
      lockedBody.style.overflow = originalOverflow;
      lockedBody = null;
    }
  };
}
