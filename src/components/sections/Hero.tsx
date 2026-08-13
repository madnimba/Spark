"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useIsoLayoutEffect, prefersReducedMotion } from "@/lib/gsap";
import { onReady } from "@/lib/bus";
import { DESIGNS } from "../visuals/designs";
import SparkCard from "../visuals/SparkCard";
import Button from "../ui/Button";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      if (prefersReducedMotion()) {
        gsap.set(".h-anim", { autoAlpha: 1 });
        return;
      }

      gsap.set(".h-anim", { autoAlpha: 0 });

      let played = false;
      const play = () => {
        if (played) return;
        played = true;
        window.clearTimeout(failsafe);

        // `self.add` runs this inside the context even though it fires long
        // after the context function returned — without it these selectors go
        // global and the animations aren't tracked for cleanup.
        self.add(() => {
          // Reveal BEFORE the timeline is built, not as its first step.
          //
          // `from()` tweens render immediately on creation and record the
          // target's value *at that moment* as their destination. With the
          // reveal sitting inside the timeline, these targets were still at
          // autoAlpha 0 when the from-tweens were constructed, so 0 became
          // their end value — the copy, buttons and card animated in and then
          // straight back out. Hoisting the set fixes the captured value.
          gsap.set(".h-anim", { autoAlpha: 1 });

          // The reveal must survive anything going wrong below it. If a tween
          // throws, the copy still ends up visible rather than stuck at zero
          // opacity, which is the one failure mode that loses the whole page.
          try {
            const tl = gsap.timeline({
              defaults: { ease: "expo" },
              // Hard guarantee: whatever the tweens did, everything is visible
              // once they finish.
              onComplete: () => gsap.set(".h-anim", { autoAlpha: 1 }),
            });
            tl.from(".h-kicker", { yPercent: 130, duration: 0.9 })
              .from(".h-l1", { yPercent: 115, duration: 1.1 }, "-=0.55")
              .from(
                ".h-l2",
                { yPercent: 115, rotate: 8, scale: 0.9, duration: 1.15 },
                "-=0.85"
              )
              .from(".h-sub", { y: 24, autoAlpha: 0, duration: 0.9 }, "-=0.7")
              .from(".h-cta", { y: 22, autoAlpha: 0, duration: 0.8, stagger: 0.08 }, "-=0.6")
              .from(
                ".h-card",
                { yPercent: 26, rotate: 14, scale: 0.8, autoAlpha: 0, duration: 1.4 },
                "-=1.3"
              )
              .from(".h-chip", { scale: 0, autoAlpha: 0, duration: 0.7, stagger: 0.08 }, "-=0.9");
          } catch {
            gsap.set(".h-anim", { autoAlpha: 1, clearProps: "transform" });
          }
        });
      };

      // Belt and braces: the intro event is the normal trigger, the timer is
      // the guarantee. Whichever lands first wins; the other is a no-op.
      const failsafe = window.setTimeout(play, 3500);
      const off = onReady(play);

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

      /* --- scroll exit ---
         Parallax only. No opacity and no scale: the copy, buttons and card
         must stay fully visible for as long as they are on screen. Anything
         that dims them reads as content breaking rather than as a transition. */
      gsap.to(".h-stage", {
        y: -50,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.8 },
      });

      return () => {
        window.clearTimeout(failsafe);
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
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pb-[var(--nav-h)] pt-[var(--nav-h)]"
    >
      <div className="h-stage shell relative">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
          {/* ---------------------------------------------------- copy --- */}
          <div className="relative z-10 text-center lg:text-left">
            <div className="h-anim mask mx-auto w-fit lg:mx-0">
              <p className="h-kicker inline-flex items-center gap-2 rounded-full border-2 border-white/50 px-3.5 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-yellow" />
                <span className="t-label text-[10px]! text-fg">Dhaka Bank PLC · Spark Card</span>
              </p>
            </div>

            <h1 className="mt-5">
              <span className="h-anim mask block">
                <span className="h-l1 t-marker block text-[clamp(2.9rem,14vw,7.5rem)] text-white">
                  Follow ur
                </span>
              </span>
              <span className="h-anim mask mt-1 block overflow-visible">
                <span className="h-l2 t-marker slab inline-block text-[clamp(3.2rem,16vw,8.5rem)] text-white">
                  Spark
                </span>
              </span>
            </h1>

            {/* One hook, nothing more. The argument for the card lives in the
                Why Spark section directly below; repeating it here just makes
                the visitor read the same sentence twice. */}
            <p className="h-anim h-sub mx-auto mt-7 max-w-[20ch] text-[clamp(1.15rem,5vw,1.7rem)] font-extrabold uppercase leading-[1.15] tracking-tight text-white lg:mx-0">
              One prepaid card.
              <br />
              <span className="text-yellow">Every version of you.</span>
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <div className="h-anim h-cta">
                <Button href="/apply" tone="yellow">
                  Apply now →
                </Button>
              </div>
              <div className="h-anim h-cta">
                <Button href="#why" tone="outline">
                  Discover Spark
                </Button>
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------- card --- */}
          <div className="persp relative mx-auto w-full max-w-[min(52vw,250px)]">
            <div className="h-anim h-card tf3d relative">
              <div className="h-card-inner tf3d rotate-[-8deg]">
                <SparkCard design={DESIGNS[0]} face="front" />
              </div>
            </div>

            <div className="h-anim h-chip pop-white absolute -left-3 top-[6%] rounded-full bg-yellow px-3 py-1.5 sm:-left-6">
              <span className="text-[11px] font-extrabold uppercase tracking-wide text-blue-ink sm:text-xs">
                4× lounge access
              </span>
            </div>
            <div className="h-anim h-chip pop-white absolute -right-2 top-[44%] rounded-full bg-pink px-3 py-1.5 sm:-right-6">
              <span className="text-[11px] font-extrabold uppercase tracking-wide text-white sm:text-xs">
                0% markup
              </span>
            </div>
            <div className="h-anim h-chip pop-white absolute -left-1 bottom-[4%] rounded-full bg-white px-3 py-1.5 sm:-left-5">
              <span className="text-[11px] font-extrabold uppercase tracking-wide text-blue-ink sm:text-xs">
                Dual currency
              </span>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
