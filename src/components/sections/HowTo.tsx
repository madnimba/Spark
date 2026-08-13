"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useIsoLayoutEffect, prefersReducedMotion } from "@/lib/gsap";
import Depth from "../ui/Depth";
import Button from "../ui/Button";

const STEPS = [
  {
    n: "01",
    t: "Upload",
    b: "Three documents, photographed on your phone. No forms to print, no branch to find.",
    time: "2 min",
  },
  {
    n: "02",
    t: "Verify",
    b: "We check your identity digitally. You don't need an existing Dhaka Bank account to start.",
    time: "Same day",
  },
  {
    n: "03",
    t: "Get Spark",
    b: "Your card is issued and posted out. Activate it and set your PIN from your phone.",
    time: "Done",
  },
];

export default function HowTo() {
  const root = useRef<HTMLElement>(null);
  const [reached, setReached] = useState(0);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        setReached(STEPS.length);
        return;
      }

      gsap.fromTo(
        ".ht-fill",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".ht-list",
            start: "top 74%",
            end: "bottom 82%",
            scrub: 0.6,
            onUpdate: (self) => setReached(Math.round(self.progress * STEPS.length)),
          },
        }
      );
    }, root);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="apply" className="relative py-16 sm:py-24">
      <div className="shell">
        <Depth variant="rise">
          <div className="mx-auto max-w-2xl text-center">
            <span className="t-label">04 — Getting one</span>
            <h2 className="t-h1 mt-3">
              Get your Spark
              <br />
              <span className="t-marker text-yellow">from home</span>
            </h2>
            <p className="t-body mx-auto mt-5 max-w-[36ch]">
              No branch. No hassle. Apply digitally — and you don&apos;t need an
              existing Dhaka Bank account.
            </p>
          </div>
        </Depth>

        <Depth variant="depth" className="mx-auto mt-8 w-fit">
          <p className="rounded-full border-[3px] border-blue-ink bg-white px-5 py-2.5 text-center text-[15px] font-extrabold uppercase tracking-tight text-blue-ink shadow-[5px_5px_0_var(--blue-ink)]">
            Just 3 documents
          </p>
        </Depth>

        <div className="ht-list relative mx-auto mt-12 max-w-2xl pl-12 sm:pl-16">
          <div className="absolute bottom-6 left-4 top-6 w-[3px] bg-white/22 sm:left-6">
            <div className="ht-fill h-full w-full origin-top bg-yellow" />
          </div>

          {STEPS.map((s, i) => {
            const on = reached > i;
            return (
              <div key={s.n} className="relative pb-9 last:pb-0">
                <span
                  className={`absolute -left-12 top-1 flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-blue-ink font-mono text-[11px] font-bold transition-all duration-500 sm:-left-16 ${
                    on ? "scale-110 bg-yellow text-blue-ink" : "bg-white/20 text-white"
                  }`}
                >
                  {s.n}
                </span>

                <div
                  className={`rounded-2xl border-[3px] border-blue-ink p-5 transition-colors duration-500 sm:p-6 ${
                    on ? "bg-white text-blue-ink" : "bg-white/10 text-white"
                  }`}
                  style={{ boxShadow: on ? "6px 6px 0 var(--blue-ink)" : "none" }}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="t-h3">{s.t}</h3>
                    <span
                      className={`rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider ${
                        on ? "bg-pink text-white" : "bg-white/20 text-white"
                      }`}
                    >
                      {s.time}
                    </span>
                  </div>
                  <p className="mt-2 text-[0.95rem] leading-relaxed" style={{ opacity: on ? 0.72 : 0.82 }}>
                    {s.b}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <Button href="#download" tone="pink">
            Apply now →
          </Button>
        </div>
      </div>
    </section>
  );
}
