"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useIsoLayoutEffect, prefersReducedMotion } from "@/lib/gsap";

/**
 * The page's only background.
 *
 * Rather than each section painting itself, one fixed layer shifts hue across
 * the whole scroll — blue into deep blue, through violet, into hot pink and
 * back. Because the colour is always mid-transition, no section boundary ever
 * lands as a visible edge.
 *
 * Everything here is transform/opacity only. No `filter: blur()` — on mobile
 * GPUs a full-screen blurred layer is the single most expensive thing you can
 * paint, and this page is mobile-first.
 */

const STOPS = [
  { at: 0.0, c: "#1f6fea" },
  { at: 0.2, c: "#1450c8" },
  { at: 0.42, c: "#5c28cf" },
  { at: 0.62, c: "#c4155f" },
  { at: 0.78, c: "#8d1fb0" },
  { at: 1.0, c: "#1f6fea" },
];

/** The spiky comic starburst from the key visual. */
function Burst({ className, fill }: { className?: string; fill: string }) {
  const pts: string[] = [];
  const spikes = 14;
  for (let i = 0; i < spikes * 2; i++) {
    const rad = i % 2 === 0 ? 100 : 62;
    const deg = (i / (spikes * 2)) * 360 - 90;
    const x = 100 + Math.cos((deg * Math.PI) / 180) * rad;
    const y = 100 + Math.sin((deg * Math.PI) / 180) * rad;
    pts.push(`${Math.round(x * 100) / 100},${Math.round(y * 100) / 100}`);
  }
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <polygon points={pts.join(" ")} fill={fill} />
    </svg>
  );
}

function Bolt({ className, fill }: { className?: string; fill: string }) {
  return (
    <svg viewBox="0 0 40 64" className={className} aria-hidden>
      <path d="M24 0 2 36h13L14 64 38 26H24l6-26Z" fill={fill} />
    </svg>
  );
}

export default function Atmosphere() {
  const root = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = prefersReducedMotion();
      const ground = root.current?.querySelector<HTMLElement>(".atm-ground");

      /* ---- hue travels with total page progress ---- */
      if (ground && !reduced) {
        const tl = gsap.timeline({ scrollTrigger: { start: 0, end: "max", scrub: 1.1 } });
        STOPS.slice(1).forEach((s, i) => {
          tl.to(
            ground,
            { backgroundColor: s.c, ease: "none", duration: s.at - STOPS[i].at },
            STOPS[i].at
          );
        });

        // Keep the browser chrome in step with the page on mobile.
        const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
        if (meta) {
          ScrollTrigger.create({
            start: 0,
            end: "max",
            onUpdate: () => {
              const bg = getComputedStyle(ground).backgroundColor;
              if (bg) meta.setAttribute("content", bg);
            },
          });
        }
      }

      if (reduced) return;

      /* ---- shapes drift on scroll at different depths ---- */
      gsap.utils.toArray<HTMLElement>(".atm-shape").forEach((el, i) => {
        const depth = 1 + (i % 4) * 0.55;
        gsap.to(el, {
          yPercent: -14 * depth,
          rotate: (i % 2 ? 1 : -1) * 24 * depth,
          ease: "none",
          scrollTrigger: { start: 0, end: "max", scrub: 1.4 },
        });
      });

      gsap.to(".atm-burst", {
        rotate: 160,
        scale: 1.35,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 1.6 },
      });

      /* ---- touch / pointer parallax ----
         Pointer events cover mouse and touch in one path, so a finger drag on
         a phone nudges the field exactly like a cursor does on desktop. */
      const layers = gsap.utils.toArray<HTMLElement>(".atm-layer");
      const setters = layers.map((el) => ({
        x: gsap.quickTo(el, "x", { duration: 1.3, ease: "power3" }),
        y: gsap.quickTo(el, "y", { duration: 1.3, ease: "power3" }),
      }));

      const onMove = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        setters.forEach((s, i) => {
          const d = (i + 1) * 13;
          s.x(nx * d);
          s.y(ny * d);
        });
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      return () => window.removeEventListener("pointermove", onMove);
    }, root);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* the colour that shifts under everything */}
      <div className="atm-ground absolute inset-0" style={{ backgroundColor: STOPS[0].c }} />

      {/* giant starburst */}
      <div className="atm-layer absolute inset-0">
        <Burst
          className="atm-burst absolute left-1/2 top-1/2 h-[150vmax] w-[150vmax] -translate-x-1/2 -translate-y-1/2 opacity-[0.16]"
          fill="var(--yellow)"
        />
      </div>

      {/* pale blue shards, as in the key visual */}
      <div className="atm-layer absolute inset-0 opacity-[0.5]">
        <div className="atm-shape absolute -left-[6%] top-[8%] h-[42vh] w-[26vw] -rotate-12 bg-sky/35 [clip-path:polygon(38%_0,100%_18%,62%_100%,0_74%)]" />
        <div className="atm-shape absolute -right-[8%] top-[46%] h-[38vh] w-[30vw] rotate-6 bg-sky/30 [clip-path:polygon(0_12%,100%_0,74%_100%,18%_82%)]" />
        <div className="atm-shape absolute bottom-[6%] left-[22%] h-[30vh] w-[22vw] bg-sky/25 [clip-path:polygon(50%_0,100%_62%,52%_100%,0_58%)]" />
      </div>

      {/* bolts + dots */}
      <div className="atm-layer absolute inset-0">
        <Bolt className="atm-shape absolute left-[12%] top-[22%] h-[8vh] w-auto opacity-30" fill="var(--yellow)" />
        <Bolt className="atm-shape absolute right-[14%] top-[68%] h-[11vh] w-auto -rotate-12 opacity-25" fill="var(--cyan)" />
        <Bolt className="atm-shape absolute left-[68%] top-[12%] h-[6vh] w-auto rotate-[18deg] opacity-20" fill="var(--white)" />
        <div className="atm-shape absolute right-[8%] top-[16%] h-[16vw] max-h-32 w-[16vw] max-w-32 rounded-full border-[6px] border-yellow/25" />
        <div className="atm-shape absolute bottom-[18%] left-[6%] h-[11vw] max-h-24 w-[11vw] max-w-24 rounded-full bg-pink/25" />
      </div>

      {/* halftone texture + vignette keep white type legible over the lot */}
      <div className="halftone absolute inset-0 opacity-[0.16]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_115%_75%_at_50%_45%,transparent_38%,rgb(4_31_92/0.5)_100%)]" />
    </div>
  );
}
