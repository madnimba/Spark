"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Two-part cursor: a small solid dot that tracks 1:1, and a larger ring that
 * trails behind. Elements opt into states with `data-cursor="view|drag|..."`
 * and can push a caption with `data-cursor-label="Explore"`.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    // Pointer-coarse devices (phones, tablets) have no cursor to replace.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.documentElement.classList.add("custom-cursor");

    const d = dot.current!;
    const r = ring.current!;
    const l = label.current!;

    gsap.set([d, r], { xPercent: -50, yPercent: -50, opacity: 0 });

    const dx = gsap.quickTo(d, "x", { duration: 0.18, ease: "power3" });
    const dy = gsap.quickTo(d, "y", { duration: 0.18, ease: "power3" });
    const rx = gsap.quickTo(r, "x", { duration: 0.55, ease: "power3" });
    const ry = gsap.quickTo(r, "y", { duration: 0.55, ease: "power3" });

    let shown = false;

    const move = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.to([d, r], { opacity: 1, duration: 0.4 });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };

    const setState = (state: string | null, text?: string | null) => {
      const interactive = state !== null;
      gsap.to(r, {
        width: interactive ? 72 : 30,
        height: interactive ? 72 : 30,
        borderColor: interactive ? "rgba(255,224,27,0.95)" : "rgba(255,255,255,0.7)",
        backgroundColor: interactive ? "rgba(255,224,27,0.16)" : "rgba(0,0,0,0)",
        duration: 0.45,
        ease: "expo",
      });
      gsap.to(d, { scale: interactive ? 0 : 1, duration: 0.35, ease: "expo" });
      if (text) {
        l.textContent = text;
        gsap.to(l, { opacity: 1, y: 0, duration: 0.35, ease: "expo" });
      } else {
        gsap.to(l, { opacity: 0, y: 4, duration: 0.25 });
      }
    };

    const over = (e: PointerEvent) => {
      const el = (e.target as HTMLElement)?.closest?.(
        "[data-cursor], a, button, input, textarea, select, [role='button']"
      ) as HTMLElement | null;
      if (!el) return setState(null);
      setState(el.dataset.cursor ?? "link", el.dataset.cursorLabel ?? null);
    };

    const leaveWindow = () => gsap.to([d, r, l], { opacity: 0, duration: 0.3 });

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("pointerleave", leaveWindow);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.removeEventListener("pointerleave", leaveWindow);
      document.documentElement.classList.remove("custom-cursor");
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[70] hidden md:block">
      <div
        ref={ring}
        className="fixed left-0 top-0 h-[30px] w-[30px] rounded-full border-2"
        style={{ borderColor: "rgba(255,255,255,0.7)" }}
      >
        <div
          ref={label}
          className="t-label absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-[10px] text-yellow opacity-0"
        />
      </div>
      <div ref={dot} className="fixed left-0 top-0 h-[6px] w-[6px] rounded-full bg-yellow" />
    </div>
  );
}
