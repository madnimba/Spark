"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, SplitText, useIsoLayoutEffect, prefersReducedMotion } from "@/lib/gsap";
import { onReady } from "@/lib/bus";
import { DESIGNS } from "../visuals/designs";
import SparkCard from "../visuals/SparkCard";
import Button from "../ui/Button";

/**
 * The opening statement: what Spark is, in three words and one card.
 * Everything here is pointer-driven, and pointer events cover touch, so the
 * parallax works identically under a finger.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set(".h-anim", { autoAlpha: 1 });
        return;
      }

      gsap.set(".h-anim", { autoAlpha: 0 });

      const off = onReady(() => {
        const title = SplitText.create(".h-title", { type: "lines,words", mask: "lines" });
        const tl = gsap.timeline({ defaults: { ease: "expo" } });

        tl.set(".h-anim", { autoAlpha: 1 })
          .from(".h-kicker", { yPercent: 130, duration: 0.9 })
          .from(title.words, { yPercent: 120, duration: 1.2, stagger: 0.06 }, "-=0.55")
          .from(".h-marker", { scale: 0.4, rotate: -14, autoAlpha: 0, duration: 1 }, "-=0.7")
          .from(".h-sub", { y: 24, autoAlpha: 0, duration: 0.9 }, "-=0.7")
          .from(".h-cta", { y: 22, autoAlpha: 0, duration: 0.8, stagger: 0.08 }, "-=0.65")
          .from(
            ".h-card",
            { yPercent: 26, rotate: 14, scale: 0.8, autoAlpha: 0, duration: 1.4 },
            "-=1.1"
          )
          .from(".h-chip", { scale: 0, autoAlpha: 0, duration: 0.7, stagger: 0.08 }, "-=0.9")
          .from(".h-scroll", { autoAlpha: 0, duration: 0.6 }, "-=0.4");
      });

      /* --- touch / pointer parallax --- */
      const cardTo = {
        rx: gsap.quickTo(".h-card-inner", "rotateX", { duration: 1.1, ease: "power3" }),
        ry: gsap.quickTo(".h-card-inner", "rotateY", { duration: 1.1, ease: "power3" }),
      };
      const onMove = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        cardTo.ry(nx * 26);
        cardTo.rx(-ny * 18);
        gsap.to(".h-chip", {
          x: (i: number) => nx * (26 + i * 16),
          y: (i: number) => ny * (20 + i * 12),
          duration: 1.4,
          ease: "power3.out",
        });
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      /* --- scroll exit: the hero recedes as it leaves ---
         End on `bottom top`, i.e. exactly when the section clears the screen.
         Finishing earlier (say `bottom 25%`) empties the hero while a quarter
         of it is still on screen, which reads as a hole in the page. */
      gsap.to(".h-stage", {
        scale: 0.88,
        y: -30,
        autoAlpha: 0.05,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.8 },
      });

      return () => {
        window.removeEventListener("pointermove", onMove);
        off?.();
      };
    }, root);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pb-16 pt-28 sm:pt-32"
    >
      <div className="h-stage shell relative">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
          {/* ---------------------------------------------------- copy --- */}
          <div className="relative z-10 text-center lg:text-left">
            <div className="h-anim mask mx-auto w-fit lg:mx-0">
              <p className="h-kicker inline-flex items-center gap-2 rounded-full border-2 border-white/50 px-3.5 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-yellow" />
                <span className="t-label text-[10px]! text-fg">Dhaka Bank PLC · Prepaid</span>
              </p>
            </div>

            <h1 className="h-anim h-title t-display mt-5">
              Spark
              <br />
              Prepaid
              <br />
              Card
            </h1>

            <p className="h-anim h-marker t-marker mt-4 text-[clamp(1.6rem,7vw,3rem)] text-white">
              <span className="slab">Follow ur spark</span>
            </p>

            <p className="h-anim h-sub t-body mx-auto mt-6 max-w-[40ch] lg:mx-0">
              Load it from your phone. Tap it anywhere Visa goes. Freeze it the
              second it goes missing. No salary slip, no minimum balance, no
              waiting at a counter.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <div className="h-anim h-cta">
                <Button href="#card" tone="yellow">
                  Design your card
                </Button>
              </div>
              <div className="h-anim h-cta">
                <Button href="#get" tone="outline">
                  How to get one
                </Button>
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------- card --- */}
          <div className="persp relative mx-auto w-full max-w-[min(78vw,420px)]">
            <div className="h-anim h-card tf3d relative">
              <div className="h-card-inner tf3d rotate-[-8deg]">
                <SparkCard design={DESIGNS[0]} face="front" />
              </div>
            </div>

            {/* floating call-outs */}
            <div className="h-anim h-chip pop-white absolute -left-3 top-[6%] rounded-full bg-yellow px-3 py-1.5 sm:-left-6">
              <span className="text-[11px] font-extrabold uppercase tracking-wide text-blue-ink sm:text-xs">
                ৳0 to open
              </span>
            </div>
            <div className="h-anim h-chip pop-white absolute -right-2 top-[44%] rounded-full bg-pink px-3 py-1.5 sm:-right-6">
              <span className="text-[11px] font-extrabold uppercase tracking-wide text-white sm:text-xs">
                Tap to pay
              </span>
            </div>
            <div className="h-anim h-chip pop-white absolute -left-1 bottom-[4%] rounded-full bg-white px-3 py-1.5 sm:-left-5">
              <span className="text-[11px] font-extrabold uppercase tracking-wide text-blue-ink sm:text-xs">
                Freeze anytime
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <a
        href="#intro"
        aria-label="Scroll down"
        className="h-anim h-scroll absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1.5"
      >
        <span className="t-label text-[9px]!">Scroll</span>
        <span className="flex h-8 w-5 items-start justify-center rounded-full border-2 border-white/55 p-1">
          <span className="h-1.5 w-1 animate-[spark-bob_1.6s_ease-in-out_infinite] rounded-full bg-yellow" />
        </span>
      </a>
    </section>
  );
}
