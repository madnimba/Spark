"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, SplitText, useIsoLayoutEffect, prefersReducedMotion } from "@/lib/gsap";
import Button from "../ui/Button";

const BEATS = [
  { n: "01", word: "Ur rhythm.", style: "plain" },
  { n: "02", word: "Ur rules.", style: "yellow" },
  { n: "03", word: "Ur Spark.", style: "pink" },
] as const;

const WORLDS = [
  "Travel",
  "Music",
  "Food",
  "Gadgets",
  "Education",
  "Fashion",
  "Entertainment",
];

const PROOF = [
  ["4×", "Lounge access"],
  ["0%", "Markup abroad"],
  ["9,500+", "Merchant outlets"],
];

/**
 * "Why Spark?" — the argument for the card, before the card appears.
 * Each beat is driven from a different side on scrub, so the block assembles
 * under the thumb rather than simply arriving.
 */
export default function Intro() {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;

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
            scrollTrigger: { trigger: el, start: "top 92%", end: "top 52%", scrub: 0.55 },
          }
        );
      });

      /* the message lights up word by word as you read it */
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

      /* the seven worlds pop in, then react to touch */
      gsap.from(".in-world", {
        scale: 0,
        autoAlpha: 0,
        duration: 0.55,
        ease: "back.out(2)",
        stagger: { each: 0.05, from: "random" },
        scrollTrigger: { trigger: ".in-worlds", start: "top 88%", once: true },
      });

      gsap.utils.toArray<HTMLElement>(".in-world").forEach((el) => {
        const down = () => gsap.to(el, { scale: 1.12, rotate: gsap.utils.random(-6, 6), duration: 0.2 });
        const up = () => gsap.to(el, { scale: 1, rotate: 0, duration: 0.6, ease: "elastic.out(1,0.5)" });
        el.addEventListener("pointerdown", down);
        el.addEventListener("pointerup", up);
        el.addEventListener("pointercancel", up);
        el.addEventListener("pointerleave", up);
      });

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
    <section ref={root} id="why" className="relative overflow-hidden py-16 sm:py-24">
      <p
        aria-hidden
        className="in-mark pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-center font-display font-extrabold uppercase leading-none tracking-[-0.05em] text-transparent"
        style={{ fontSize: "clamp(6rem, 34vw, 26rem)", WebkitTextStroke: "2px rgba(255,255,255,0.14)" }}
      >
        Spark
      </p>

      <div className="shell relative">
        <div className="in-head mx-auto max-w-3xl text-center">
          <span className="t-label">01 — Why Spark?</span>
          <h2 className="t-h1 mt-3">Why do you need another card?</h2>
        </div>

        <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-3 sm:mt-14 sm:gap-5">
          {BEATS.map((b) => (
            <div key={b.n} className="in-beat flex items-center gap-3 will-change-transform sm:gap-6">
              <span className="w-7 shrink-0 font-mono text-[11px] font-bold text-white/45 sm:w-10 sm:text-sm">
                {b.n}
              </span>
              {b.style === "plain" && <span className="t-display text-white">{b.word}</span>}
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

        <p className="in-msg t-body mx-auto mt-10 max-w-[44ch] text-center text-[clamp(1.05rem,4.4vw,1.35rem)]! leading-relaxed! text-white sm:mt-14">
          Because your life has its own rhythm. Your card should fit right in.
        </p>

        {/* the seven worlds */}
        <ul className="in-worlds mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-2 sm:gap-2.5">
          {WORLDS.map((w) => (
            <li
              key={w}
              className="in-world cursor-default rounded-full border-[3px] border-blue-ink bg-white px-4 py-2 text-[13px] font-extrabold uppercase tracking-tight text-blue-ink shadow-[3px_3px_0_var(--blue-ink)] will-change-transform sm:text-[15px]"
            >
              {w}
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-3 sm:gap-4">
          {PROOF.map(([v, l]) => (
            <div
              key={l}
              className="rounded-2xl border-[3px] border-blue-ink bg-yellow px-3 py-4 text-center shadow-[5px_5px_0_var(--blue-ink)]"
            >
              <p className="font-display text-[clamp(1.3rem,5.5vw,2rem)] font-extrabold leading-none tracking-tight text-blue-ink">
                {v}
              </p>
              <p className="mt-1.5 text-[10px] font-bold uppercase leading-tight tracking-[0.1em] text-blue-ink/60 sm:text-[11px]">
                {l}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button href="#card" tone="pink">
            Discover Spark →
          </Button>
        </div>
      </div>
    </section>
  );
}
