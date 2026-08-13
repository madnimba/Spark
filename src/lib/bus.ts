/** Tiny decoupled event bus so the preloader can start the hero without prop drilling. */

export const APP_READY = "dbgo:ready";

export function emitReady() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(APP_READY));
  (window as Window & { __dbgoReady?: boolean }).__dbgoReady = true;
}

/**
 * Runs `cb` when the intro finishes. If the intro already completed (fast
 * refresh, reduced motion) it fires on the next frame instead of hanging.
 */
export function onReady(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  if ((window as Window & { __dbgoReady?: boolean }).__dbgoReady) {
    const id = requestAnimationFrame(cb);
    return () => cancelAnimationFrame(id);
  }
  window.addEventListener(APP_READY, cb, { once: true });
  return () => window.removeEventListener(APP_READY, cb);
}
