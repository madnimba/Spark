"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useIsoLayoutEffect, prefersReducedMotion } from "@/lib/gsap";

type Variant = "depth" | "swing" | "rise" | "fan" | "drop";

/**
 * Scroll-linked entrance/exit, scrubbed rather than played.
 *
 * Content approaches the viewer as it reaches the middle of the screen and
 * recedes as it leaves, so scrolling reads as travelling through the page
 * rather than past it. Each variant gives a section its own character — a page
 * where every block enters identically stops feeling authored very quickly.
 *
 * Note this applies a transform to its wrapper, so never wrap anything that
 * relies on `position: sticky` or `fixed` inside it.
 */
export default function Depth({
  children,
  variant = "depth",
  className = "",
  /** Stagger direct children instead of moving the block as one. */
  stagger = false,
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  stagger?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const targets = stagger ? Array.from(el.children) : [el];

      const IN: Record<Variant, gsap.TweenVars> = {
        depth: { scale: 0.78, y: 70, autoAlpha: 0.15 },
        swing: { rotateY: 26, rotateZ: -4, x: 60, autoAlpha: 0.1 },
        rise: { y: 110, autoAlpha: 0.1 },
        fan: { rotateZ: -7, y: 80, scale: 0.9, autoAlpha: 0.1 },
        drop: { y: -70, scale: 1.12, autoAlpha: 0.1 },
      };
      const OUT: Record<Variant, gsap.TweenVars> = {
        depth: { scale: 0.9, y: -45, autoAlpha: 0.3 },
        swing: { rotateY: -18, rotateZ: 2, x: -40, autoAlpha: 0.28 },
        rise: { y: -65, autoAlpha: 0.28 },
        fan: { rotateZ: 4, y: -50, scale: 0.94, autoAlpha: 0.28 },
        drop: { y: 50, scale: 0.93, autoAlpha: 0.28 },
      };

      const common = { ease: "none", stagger: stagger ? 0.06 : 0 };

      gsap.fromTo(
        targets,
        IN[variant],
        {
          ...common,
          scale: 1,
          x: 0,
          y: 0,
          rotateY: 0,
          rotateZ: 0,
          autoAlpha: 1,
          // Arrive early and finish well before centre. Holding content faint
          // until it reaches mid-screen leaves half a viewport of empty
          // background, which looks like a broken section rather than a
          // transition.
          scrollTrigger: {
            trigger: el,
            start: "top 96%",
            end: "top 66%",
            scrub: 0.6,
          },
        }
      );

      // Leave late, and only partly — a tall block must stay readable until
      // it is genuinely on its way off screen.
      gsap.to(targets, {
        ...common,
        ...OUT[variant],
        scrollTrigger: {
          trigger: el,
          start: "bottom 38%",
          end: "bottom -8%",
          scrub: 0.6,
        },
      });
    }, ref);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [variant, stagger]);

  return (
    <div ref={ref} className={`persp ${className}`}>
      {children}
    </div>
  );
}
