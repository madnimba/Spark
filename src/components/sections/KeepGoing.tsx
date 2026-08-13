"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useIsoLayoutEffect, prefersReducedMotion } from "@/lib/gsap";
import Depth from "../ui/Depth";

const CARDS = [
  {
    q: "Use it 12 times a year?",
    a: "Your yearly charge is free.",
    bg: "var(--yellow)",
    ink: "#041f5c",
    big: "12×",
  },
  {
    q: "Travelling?",
    a: "Make the most of your lounge access.",
    bg: "var(--pink)",
    ink: "#ffffff",
    big: "4×",
  },
  {
    q: "Going international?",
    a: "0% markup, up to USD 12,000 transaction limit.",
    bg: "var(--cyan)",
    ink: "#041f5c",
    big: "0%",
  },
];

/**
 * The retention beat — the reasons to keep reaching for Spark once the novelty
 * of a new card has worn off.
 */
export default function KeepGoing() {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // The big number counts up its own tilt as the card arrives, and reacts
      // to a press like the rest of the tiles on the page.
      gsap.utils.toArray<HTMLElement>(".kg-card").forEach((el, i) => {
        gsap.fromTo(
          el,
          { rotate: i % 2 ? 3 : -3 },
          {
            rotate: 0,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 92%", end: "top 55%", scrub: 0.6 },
          }
        );
        const down = () => gsap.to(el, { scale: 0.96, duration: 0.18 });
        const up = () => gsap.to(el, { scale: 1, duration: 0.5, ease: "elastic.out(1,0.6)" });
        el.addEventListener("pointerdown", down);
        el.addEventListener("pointerup", up);
        el.addEventListener("pointercancel", up);
        el.addEventListener("pointerleave", up);
      });
    }, root);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="keep" className="relative py-16 sm:py-24">
      <div className="shell">
        <Depth variant="drop">
          <div className="mx-auto max-w-2xl text-center">
            <span className="t-label">06 — Keep it going</span>
            <h2 className="t-h1 mt-3">
              Keep your
              <br />
              <span className="t-marker text-yellow">Spark going</span>
            </h2>
          </div>
        </Depth>

        <Depth
          variant="fan"
          stagger
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {CARDS.map((c) => (
            <article
              key={c.q}
              className="kg-card relative overflow-hidden rounded-[22px] border-[3px] border-blue-ink p-6 shadow-[6px_6px_0_var(--blue-ink)] will-change-transform"
              style={{ background: c.bg, color: c.ink }}
            >
              <p
                className="font-display text-[clamp(2.6rem,11vw,3.6rem)] font-extrabold leading-none tracking-tighter"
                style={{ opacity: 0.9 }}
              >
                {c.big}
              </p>
              <h3 className="t-h3 mt-4">{c.q}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed" style={{ opacity: 0.78 }}>
                {c.a}
              </p>
            </article>
          ))}
        </Depth>

        <Depth variant="rise">
          <p className="mx-auto mt-10 max-w-[24ch] text-center text-[clamp(1.3rem,5.5vw,2rem)] font-extrabold uppercase leading-tight tracking-tight text-white">
            More benefits. More reasons to use Spark.
          </p>
        </Depth>
      </div>
    </section>
  );
}
