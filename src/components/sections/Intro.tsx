"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, SplitText, useIsoLayoutEffect, prefersReducedMotion } from "@/lib/gsap";

const BEATS = [
  { n: "01", word: "Load it.", style: "plain" },
  { n: "02", word: "Tap it.", style: "yellow" },
  { n: "03", word: "Own it.", style: "pink" },
] as const;

/**
 * The product introduction — three beats that explain the card before the card
 * itself appears. Each line is driven from a different side on scrub, so the
 * block assembles under the thumb rather than simply arriving.
 */
export default function Intro() {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;

      /* --- the three beats swing in from alternating sides --- */
      gsap.utils.toArray<HTMLElement>(".in-beat").forEach((el, i) => {
        const fromLeft = i % 2 === 0;
        gsap.fromTo(
          el,
          { xPercent: fromLeft ? -34 : 34, autoAlpha: 0, rotate: fromLeft ? -3 : 3 },
          {
            xPercent: 0,
            autoAlpha: 1,
            rotate: 0,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              end: "top 52%",
              scrub: 0.55,
            },
          }
        );
      });

      /* --- the message lights up word by word as you read it --- */
      SplitText.create(".in-msg", {
        type: "words,lines",
        autoSplit: true,
        onSplit(self) {
          gsap.set(self.words, { opacity: 0.22 });
          return gsap.to(self.words, {
            opacity: 1,
            ease: "none",
            stagger: 0.3,
            scrollTrigger: {
              trigger: ".in-msg",
              start: "top 86%",
              end: "bottom 66%",
              scrub: 0.5,
            },
          });
        },
      });

      /* --- watermark drifts the other way for depth --- */
      gsap.to(".in-mark", {
        yPercent: -22,
        rotate: 6,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1.2 },
      });

      gsap.from(".in-head", {
        y: 40,
        autoAlpha: 0,
        duration: 0.9,
        ease: "expo",
        scrollTrigger: { trigger: root.current, start: "top 82%", once: true },
      });

      /* --- beats lean toward the finger / cursor --- */
      const beats = gsap.utils.toArray<HTMLElement>(".in-beat");
      const setters = beats.map((el) => gsap.quickTo(el, "x", { duration: 1.2, ease: "power3" }));
      const onMove = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        setters.forEach((s, i) => s(nx * (14 + i * 9)));
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      return () => window.removeEventListener("pointermove", onMove);
    }, root);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="intro"
      className="relative overflow-hidden py-16 sm:py-24"
    >
      {/* outlined watermark */}
      <p
        aria-hidden
        className="in-mark pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-center font-display font-extrabold uppercase leading-none tracking-[-0.05em] text-transparent"
        style={{
          fontSize: "clamp(6rem, 34vw, 26rem)",
          WebkitTextStroke: "2px rgba(255,255,255,0.14)",
        }}
      >
        Spark
      </p>

      <div className="shell relative">
        <div className="in-head mx-auto max-w-3xl text-center">
          <span className="t-label">01 — Introducing</span>
          <h2 className="t-h2 mt-3 text-white/85">
            Spark Prepaid Cards
          </h2>
        </div>

        {/* three beats */}
        <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-3 sm:mt-14 sm:gap-5">
          {BEATS.map((b) => (
            <div
              key={b.n}
              className="in-beat flex items-center gap-3 will-change-transform sm:gap-6"
            >
              <span className="w-7 shrink-0 font-mono text-[11px] font-bold text-white/45 sm:w-10 sm:text-sm">
                {b.n}
              </span>

              {b.style === "plain" && (
                <span className="t-display text-white">{b.word}</span>
              )}
              {b.style === "yellow" && (
                <span className="t-marker slab slab-yellow text-[clamp(2.4rem,11vw,6.5rem)]">
                  {b.word}
                </span>
              )}
              {b.style === "pink" && (
                <span className="t-marker slab text-[clamp(2.4rem,11vw,6.5rem)] text-white">
                  {b.word}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* the message */}
        <p className="in-msg t-body mx-auto mt-10 max-w-[46ch] text-center text-[clamp(1.05rem,4.4vw,1.35rem)]! leading-relaxed! text-white sm:mt-14">
          Spark is a prepaid card from Dhaka Bank PLC. It spends only what you
          put on it — no credit check, no interest, no bill waiting at the end of
          the month. Top it up from your phone and it&apos;s live before you
          lock the screen.
        </p>

        {/* three quick proof points */}
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-3 sm:mt-12 sm:gap-4">
          {[
            ["৳0", "to open"],
            ["18+", "no salary slip"],
            ["3 min", "to your first tap"],
          ].map(([v, l]) => (
            <div
              key={l}
              className="rounded-2xl border-[3px] border-blue-ink bg-white/95 px-3 py-4 text-center shadow-[5px_5px_0_var(--blue-ink)]"
            >
              <p className="font-display text-[clamp(1.3rem,5.5vw,2rem)] font-extrabold leading-none tracking-tight text-blue-ink">
                {v}
              </p>
              <p className="mt-1.5 text-[10px] font-bold uppercase leading-tight tracking-[0.1em] text-blue-ink/55 sm:text-[11px]">
                {l}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
