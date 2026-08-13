"use client";

import { useRef, useState } from "react";
import { gsap, useIsoLayoutEffect, prefersReducedMotion } from "@/lib/gsap";
import { emitReady } from "@/lib/bus";
import { useSmoothScroll } from "./SmoothScroll";
import Logo from "./Logo";

/**
 * Short on purpose — under two seconds. A long intro is a tax the visitor pays
 * before seeing anything, and on a phone over mobile data it reads as the page
 * being broken.
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);
  const { lenisRef } = useSmoothScroll();

  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) {
      setGone(true);
      emitReady();
      return;
    }

    document.documentElement.style.overflow = "hidden";
    const unlock = () => {
      document.documentElement.style.overflow = "";
      lenisRef.current?.start();
    };
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          unlock();
          setGone(true);
          emitReady();
        },
      });

      tl.from(".pl-bolt", { scale: 0, rotate: -40, duration: 0.7, ease: "back.out(2)" })
        .from(".pl-word", { xPercent: -40, autoAlpha: 0, duration: 0.5, ease: "expo" }, "-=0.3")
        .fromTo(bar.current, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "power2.inOut" }, "-=0.2")
        .to(".pl-mark", { scale: 1.15, autoAlpha: 0, duration: 0.45, ease: "power2.in" })
        .to(
          ".pl-panel",
          { yPercent: -101, duration: 0.75, ease: "quart", stagger: { each: 0.06 } },
          "-=0.25"
        );
    }, root);

    return () => {
      unlock();
      ctx.revert();
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[100] flex items-center justify-center" aria-hidden>
      <div className="absolute inset-0 flex">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="pl-panel h-full flex-1 bg-blue-ink" />
        ))}
      </div>

      <div className="pl-mark relative flex flex-col items-center gap-5 px-8">
        <span className="flex items-center gap-2">
          <span className="pl-bolt">
            <Logo className="h-12" showWordmark={false} color="var(--yellow)" />
          </span>
          <span className="pl-word font-display text-4xl font-extrabold tracking-[-0.04em] text-white">
            Spark
          </span>
        </span>

        <div className="h-[3px] w-40 overflow-hidden bg-white/20">
          <div ref={bar} className="h-full w-full origin-left bg-yellow" />
        </div>
      </div>
    </div>
  );
}
