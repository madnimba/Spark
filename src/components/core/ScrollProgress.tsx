"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useIsoLayoutEffect } from "@/lib/gsap";

/** Hairline progress bar plus a live percentage readout in the corner. */
export default function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate(self) {
          gsap.set(bar.current, { scaleX: self.progress });
          if (num.current) {
            num.current.textContent = String(Math.round(self.progress * 100)).padStart(3, "0");
          }
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <div aria-hidden className="fixed inset-x-0 top-0 z-[65] h-px bg-white/20">
        <div
          ref={bar}
          className="h-full origin-left scale-x-0 bg-yellow"
        />
      </div>
      <div
        aria-hidden
        className="t-label pointer-events-none fixed bottom-6 right-6 z-[65] hidden select-none text-[10px] lg:block"
      >
        <span ref={num} className="text-fg-soft">
          000
        </span>
        <span className="text-fg-faint"> / 100</span>
      </div>
    </>
  );
}
