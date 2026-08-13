"use client";

import { useRef, useEffect } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Pulls its child toward the pointer while hovered, then springs back.
 * `strength` is the fraction of the distance-to-centre the element travels.
 */
export default function Magnetic({
  children,
  strength = 0.35,
  className = "",
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el || prefersReducedMotion()) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.9, ease: "elastic.out(1, 0.42)" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.9, ease: "elastic.out(1, 0.42)" });

    const move = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      xTo((e.clientX - (rect.left + rect.width / 2)) * strength);
      yTo((e.clientY - (rect.top + rect.height / 2)) * strength);
    };
    const reset = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", reset);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", reset);
    };
  }, [strength]);

  return (
    <div ref={wrap} className={`inline-block will-change-transform ${className}`}>
      {children}
    </div>
  );
}
