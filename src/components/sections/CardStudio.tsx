"use client";

import { useRef, useState, useCallback } from "react";
import { gsap, ScrollTrigger, useIsoLayoutEffect, prefersReducedMotion } from "@/lib/gsap";
import { DESIGNS, DEFAULT_DESIGN } from "../visuals/designs";
import SparkCard from "../visuals/SparkCard";

/* --- physics constants, tuned by feel on a phone ------------------------- */
const IDLE_SPIN = 0.28; // deg per 60fps frame ≈ one turn every ~21s
const DRAG_YAW = 0.42;
const DRAG_PITCH = 0.3;
const TORQUE = 0.045; // roll produced by grabbing away from the centre
const TAP_YAW = 3.2;
const TAP_PITCH = 2.6;
const SETTLE = 0.045; // how fast spin returns to idle after you let go
const DAMP = 0.9;
const MAX_PITCH = 34;
const MAX_ROLL = 22;

export default function CardStudio() {
  const root = useRef<HTMLElement>(null);
  const float = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const flash = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(DEFAULT_DESIGN);
  const design = DESIGNS[active];

  /* --- mutable motion state; never triggers a React render --- */
  const m = useRef({
    rx: -8,
    ry: -22,
    rz: 0,
    vrx: 0,
    vry: IDLE_SPIN,
    vrz: 0,
    dragging: false,
    axis: null as null | "x" | "y",
    lastX: 0,
    lastY: 0,
    gx: 0,
    gy: 0,
    touched: false,
  });

  /* ---------------------------------------------------------------- loop -- */
  useIsoLayoutEffect(() => {
    const el = card.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      gsap.set(el, { rotateX: -6, rotateY: -18 });
      return;
    }

    const tick = (_t: number, deltaTime: number) => {
      const f = Math.min(deltaTime / 16.667, 3);
      const s = m.current;

      if (!s.dragging) {
        // ease the yaw back to its resting spin, bleed off pitch and roll
        s.vry += (IDLE_SPIN - s.vry) * SETTLE * f;
        s.vrx *= Math.pow(DAMP, f);
        s.vrz *= Math.pow(DAMP, f);
        s.rx += -s.rx * 0.05 * f;
        s.rz += -s.rz * 0.07 * f;
      }

      s.rx = gsap.utils.clamp(-MAX_PITCH, MAX_PITCH, s.rx + s.vrx * f);
      s.ry += s.vry * f;
      s.rz = gsap.utils.clamp(-MAX_ROLL, MAX_ROLL, s.rz + s.vrz * f);

      gsap.set(el, { rotateX: s.rx, rotateY: s.ry, rotateZ: s.rz });
    };

    gsap.ticker.add(tick);

    // gentle bob, on a separate node so it never fights the physics transform
    const bob = gsap.to(float.current, {
      y: -14,
      duration: 2.8,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    return () => {
      gsap.ticker.remove(tick);
      bob.kill();
    };
  }, []);

  /* ------------------------------------------------------------ gestures -- */
  const dismissHint = useCallback(() => {
    if (m.current.touched) return;
    m.current.touched = true;
    gsap.to(hint.current, { autoAlpha: 0, y: 10, duration: 0.5, ease: "power2.out" });
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (prefersReducedMotion()) return;
      const s = m.current;
      const r = e.currentTarget.getBoundingClientRect();

      // where on the card was grabbed, normalised to -1..1 from the centre
      s.gx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      s.gy = ((e.clientY - r.top) / r.height - 0.5) * 2;

      s.dragging = true;
      s.axis = null;
      s.lastX = e.clientX;
      s.lastY = e.clientY;

      // Touching alone should do something — nudge away from the touch point
      // so a tap on a corner visibly swings that corner.
      s.vry += s.gx * TAP_YAW;
      s.vrx += -s.gy * TAP_PITCH;
      s.vrz += -s.gx * 1.6;

      e.currentTarget.setPointerCapture?.(e.pointerId);
      dismissHint();
    },
    [dismissHint]
  );

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const s = m.current;
    if (!s.dragging) return;

    const dx = e.clientX - s.lastX;
    const dy = e.clientY - s.lastY;

    // Decide once whether this gesture is a spin or a page scroll. `touch-action:
    // pan-y` lets the browser keep vertical scrolling; we must not also spin the
    // card while the page is moving under the finger.
    if (s.axis === null && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
      s.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    }
    if (s.axis === "y") return;

    s.lastX = e.clientX;
    s.lastY = e.clientY;

    s.vry += dx * DRAG_YAW;
    s.vrx += -dy * DRAG_PITCH;
    // grabbing off-centre converts drag into roll — the "sway"
    s.vrz += (s.gx * dy - s.gy * dx) * TORQUE;
  }, []);

  const endDrag = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    m.current.dragging = false;
    m.current.axis = null;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  }, []);

  /* -------------------------------------------------------- design swap -- */
  const pick = useCallback(
    (i: number) => {
      if (i === active) return;
      setActive(i);
      if (prefersReducedMotion()) return;

      // a quick "print" flash across the face plus a spring in scale
      gsap.fromTo(
        flash.current,
        { autoAlpha: 0.85, xPercent: -120 },
        { autoAlpha: 0, xPercent: 120, duration: 0.75, ease: "power2.inOut" }
      );
      gsap.fromTo(
        float.current,
        { scale: 0.94 },
        { scale: 1, duration: 0.9, ease: "elastic.out(1, 0.55)" }
      );
      m.current.vrz += 3.5;
    },
    [active]
  );

  /* ------------------------------------------------------ scroll arrival -- */
  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;

      // The card rushes toward the viewer as the section arrives.
      gsap.from(".cs-stage", {
        scale: 0.55,
        y: 90,
        autoAlpha: 0,
        duration: 1.3,
        ease: "expo",
        scrollTrigger: { trigger: root.current, start: "top 78%", once: true },
      });

      gsap.from(".cs-swatch", {
        y: 30,
        autoAlpha: 0,
        stagger: 0.05,
        duration: 0.7,
        ease: "back.out(1.6)",
        scrollTrigger: { trigger: ".cs-picker", start: "top 92%", once: true },
      });

      gsap.from(".cs-head > *", {
        y: 34,
        autoAlpha: 0,
        stagger: 0.09,
        duration: 0.9,
        ease: "expo",
        scrollTrigger: { trigger: ".cs-head", start: "top 88%", once: true },
      });
    }, root);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="card" className="relative py-16 sm:py-24">
      <div className="shell">
        <div className="cs-head mx-auto max-w-2xl text-center">
          <span className="t-label">02 — Make it yours</span>
          <h2 className="t-h1 mt-3">
            Six designs.
            <br />
            <span className="t-marker text-yellow">One is already yours.</span>
          </h2>
          <p className="t-body mx-auto mt-4 max-w-[38ch]">
            Tap a design and watch it print. Then grab the card and throw it
            around — it moves from wherever you touch it.
          </p>
        </div>

        {/* ------------------------------------------------ the big card -- */}
        <div className="cs-stage persp relative mx-auto mt-10 w-full max-w-[min(92vw,560px)] sm:mt-14">
          <div ref={float} className="relative will-change-transform">
            <div
              ref={card}
              className="grab-area tf3d relative w-full cursor-grab will-change-transform active:cursor-grabbing"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              role="img"
              aria-label={`Spark prepaid card, ${design.name} design. Drag to rotate.`}
            >
              <div className="bface">
                <SparkCard design={design} face="front" />
              </div>
              <div className="bface absolute inset-0" style={{ transform: "rotateY(180deg)" }}>
                <SparkCard design={design} face="back" />
              </div>

              {/* print flash */}
              <div
                ref={flash}
                className="pointer-events-none absolute inset-0 overflow-hidden rounded-[4.2cqw] opacity-0"
                style={{ containerType: "inline-size" }}
              >
                <div className="h-full w-full [background:linear-gradient(105deg,transparent_38%,rgba(255,255,255,0.95)_50%,transparent_62%)]" />
              </div>
            </div>
          </div>

          {/* contact shadow */}
          <div className="pointer-events-none mx-auto mt-6 h-8 w-[72%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(4,31,92,0.55),transparent_75%)] blur-md" />

          <div
            ref={hint}
            className="pointer-events-none mt-1 flex items-center justify-center gap-2 text-fg-dim"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M3 12h18M7 8l-4 4 4 4M17 8l4 4-4 4" />
            </svg>
            <span className="t-label">Drag the card</span>
          </div>
        </div>

        {/* --------------------------------------------------- the picker -- */}
        <div className="cs-picker mx-auto mt-10 w-full max-w-[560px]">
          <div className="flex items-baseline justify-between">
            <p className="t-h3">{design.name}</p>
            <p className="t-label">{design.tag}</p>
          </div>

          <div
            className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6"
            role="radiogroup"
            aria-label="Card design"
          >
            {DESIGNS.map((d, i) => (
              <button
                key={d.id}
                onClick={() => pick(i)}
                role="radio"
                aria-checked={i === active}
                aria-label={d.name}
                className={`cs-swatch group relative aspect-[1.586/1] overflow-hidden rounded-xl transition-transform duration-300 active:scale-95 ${
                  i === active
                    ? "ring-[3px] ring-yellow ring-offset-2 ring-offset-transparent"
                    : "ring-1 ring-white/35 hover:ring-white/80"
                }`}
                style={{ background: `linear-gradient(135deg, ${d.swatch[0]}, ${d.swatch[1]})` }}
              >
                <span className="sr-only">{d.name}</span>
                {i === active && (
                  <span className="absolute bottom-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-yellow">
                    <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none" stroke="#041f5c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
