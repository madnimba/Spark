"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useIsoLayoutEffect, prefersReducedMotion } from "@/lib/gsap";

/**
 * Seamless marquee whose speed and direction are driven by scroll velocity —
 * scroll down and it accelerates, scroll up and it reverses. That coupling is
 * what makes the page feel physically connected to the wheel.
 */
export default function Marquee({
  children,
  baseSpeed = 22,
  reverse = false,
  velocityFactor = 0.22,
  slowOnHover = false,
  className = "",
}: {
  children: React.ReactNode;
  /** Seconds for one full pass. Lower = faster. */
  baseSpeed?: number;
  reverse?: boolean;
  velocityFactor?: number;
  /** Ease almost to a stop while hovered, so the content can be read. */
  slowOnHover?: boolean;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const el = track.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tween = gsap.to(el, {
        xPercent: reverse ? 50 : -50,
        repeat: -1,
        duration: baseSpeed,
        ease: "none",
      });

      // `target` is recomputed on scroll; `current` chases it on the ticker so
      // a flick of the wheel reads as momentum instead of a jump.
      let target = 1;
      let current = 1;

      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate(self) {
          const boost = gsap.utils.clamp(
            0,
            9,
            Math.abs(self.getVelocity() / 260) * velocityFactor * 9
          );
          target = (self.direction === 1 ? 1 : -1) * (1 + boost);
        },
      });

      // Hover damping is a separate multiplier so it composes with velocity
      // rather than overwriting it.
      let hover = 1;
      let hoverEased = 1;
      const enter = () => (hover = 0.08);
      const leave = () => (hover = 1);
      if (slowOnHover) {
        root.current?.addEventListener("pointerenter", enter);
        root.current?.addEventListener("pointerleave", leave);
      }

      const tick = () => {
        // decay toward a steady drift in whichever direction we last moved
        const rest = target >= 0 ? 1 : -1;
        target += (rest - target) * 0.045;
        current += (target - current) * 0.12;
        hoverEased += (hover - hoverEased) * 0.08;
        tween.timeScale(current * hoverEased);
      };
      gsap.ticker.add(tick);

      return () => {
        gsap.ticker.remove(tick);
        root.current?.removeEventListener("pointerenter", enter);
        root.current?.removeEventListener("pointerleave", leave);
        st.kill();
        tween.kill();
      };
    }, root);

    return () => ctx.revert();
  }, [baseSpeed, reverse, velocityFactor, slowOnHover]);

  return (
    <div ref={root} className={`relative w-full overflow-hidden ${className}`}>
      <div ref={track} className="flex w-max will-change-transform">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
