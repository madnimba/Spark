"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useIsoLayoutEffect, prefersReducedMotion } from "@/lib/gsap";
import Depth from "../ui/Depth";
import Button from "../ui/Button";

const STEPS = [
  {
    n: "01",
    t: "Grab the app",
    b: "Download Spark from the App Store or Google Play. It's 40-odd megabytes and free.",
    time: "1 min",
  },
  {
    n: "02",
    t: "Scan your NID",
    b: "Photograph your NID, blink at the camera. e-KYC checks you against the national register while you wait.",
    time: "2 min",
  },
  {
    n: "03",
    t: "Pick your design",
    b: "Choose one of the six skins. Your digital card goes live instantly — the physical one posts out the same week.",
    time: "30 sec",
  },
  {
    n: "04",
    t: "Load and go",
    b: "Top up from your bank or a mobile wallet, then start tapping. No minimum balance to keep it open.",
    time: "Instant",
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

      // The rail fills as you scroll and lights each step as it passes.
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
    <section ref={root} id="get" className="relative py-16 sm:py-24">
      <div className="shell">
        <Depth variant="rise">
          <div className="mx-auto max-w-2xl text-center">
            <span className="t-label">04 — Getting one</span>
            <h2 className="t-h1 mt-3">
              Four steps.
              <br />
              <span className="t-marker text-yellow">Under four minutes.</span>
            </h2>
          </div>
        </Depth>

        <div className="ht-list relative mx-auto mt-12 max-w-2xl pl-12 sm:pl-16">
          {/* rail */}
          <div className="absolute bottom-6 left-4 top-6 w-[3px] bg-white/22 sm:left-6">
            <div className="ht-fill h-full w-full origin-top bg-yellow" />
          </div>

          {STEPS.map((s, i) => {
            const on = reached > i;
            return (
              <div key={s.n} className="relative pb-9 last:pb-0">
                {/* node */}
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
                  <p
                    className="mt-2 text-[0.95rem] leading-relaxed"
                    style={{ opacity: on ? 0.72 : 0.82 }}
                  >
                    {s.b}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <Button href="#download" tone="pink">
            Start now
          </Button>
        </div>
      </div>
    </section>
  );
}
