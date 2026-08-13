"use client";

import { useEffect, useMemo, createContext, useContext, useRef, type RefObject } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

type ScrollCtx = {
  /**
   * Live handle on the Lenis instance. It's a ref rather than state on
   * purpose: Lenis is created in this component's effect, which runs *after*
   * every child's effect, so publishing it through state would only ever
   * cause an extra render that arrives too late to be useful.
   */
  lenisRef: RefObject<Lenis | null>;
};

const Ctx = createContext<ScrollCtx>({ lenisRef: { current: null } });

export const useSmoothScroll = () => useContext(Ctx);

/**
 * Wires Lenis into GSAP's ticker so ScrollTrigger and Lenis share a single
 * rAF loop. Without this the two run on separate clocks and pinned sections
 * visibly judder.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  // Stable identity so consumers never re-render when the instance appears.
  const ctxValue = useMemo<ScrollCtx>(() => ({ lenisRef }), []);

  useEffect(() => {
    if (prefersReducedMotion()) {
      // Native scrolling only — ScrollTrigger still works, animations self-disable.
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      lerp: 0.1,
      wheelMultiplier: 1.0,
      smoothWheel: true,
      // Touch is left to the OS on purpose. iOS and Android already scroll at
      // 120Hz with correct rubber-banding and momentum; intercepting that to
      // re-implement it in JS is the single most common cause of a site
      // feeling laggy on a phone. ScrollTrigger reads native scroll fine.
      syncTouch: false,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenisRef.current = lenis;

    lenis.on("scroll", (e: Lenis) => {
      ScrollTrigger.update();
      // Expose velocity as a CSS var so pure-CSS effects can react too.
      document.documentElement.style.setProperty(
        "--scroll-velocity",
        String(Math.max(-1, Math.min(1, e.velocity / 40)))
      );
    });

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Anchor links route through Lenis so they inherit the same easing.
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest?.('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -12, duration: 1.5 });
    };
    document.addEventListener("click", onClick);

    // Late-loading fonts change layout height; recalc once they settle.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <Ctx.Provider value={ctxValue}>{children}</Ctx.Provider>;
}
