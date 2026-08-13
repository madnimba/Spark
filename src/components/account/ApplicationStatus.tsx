"use client";

import { useRef } from "react";
import { gsap, useIsoLayoutEffect, prefersReducedMotion } from "@/lib/gsap";

const STAGES = [
  { k: "Application received", d: "Your documents landed with us." },
  { k: "Confirmed", d: "Identity verified, card approved and printed." },
  { k: "Ready for pickup", d: "Waiting for you at your branch." },
];

/**
 * Ordered stages, so the scale reads as progress rather than as three separate
 * states. The filled portion is a single hue — position in a sequence is
 * ordinal, not categorical.
 */
export default function ApplicationStatus({
  stage,
  branch,
  days,
}: {
  /** 0-indexed: 0 received · 1 confirmed · 2 ready */
  stage: 0 | 1 | 2;
  branch: string;
  days: number;
}) {
  const root = useRef<HTMLDivElement>(null);
  const pct = ((stage + 1) / STAGES.length) * 100;

  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".as-fill",
        { width: "0%" },
        { width: `${pct}%`, duration: 1.4, ease: "expo", delay: 0.2 }
      );
      gsap.from(".as-node", {
        scale: 0,
        duration: 0.6,
        ease: "back.out(2)",
        stagger: 0.14,
        delay: 0.3,
      });
    }, root);
    return () => ctx.revert();
  }, [pct]);

  const ready = stage === 2;

  return (
    <div
      ref={root}
      className="rounded-[22px] border-[3px] border-blue-ink bg-white p-5 shadow-[6px_6px_0_var(--blue-ink)] sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-blue-ink/50">
            Card application
          </p>
          <h2 className="mt-1 text-[1.15rem] font-extrabold uppercase tracking-tight text-blue-ink sm:text-[1.35rem]">
            {STAGES[stage].k}
          </h2>
        </div>

        <span
          className={`rounded-full border-[3px] border-blue-ink px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider ${
            ready ? "bg-yellow text-blue-ink" : "bg-[#D6E4FB] text-blue-ink"
          }`}
        >
          Step {stage + 1} of {STAGES.length}
        </span>
      </div>

      {/* the scale */}
      <div className="relative mt-7">
        <div className="absolute inset-x-0 top-[13px] h-[6px] rounded-full" style={{ background: "#D6E4FB" }}>
          <div className="as-fill h-full rounded-full bg-blue" style={{ width: `${pct}%` }} />
        </div>

        <ol className="relative flex justify-between">
          {STAGES.map((s, i) => {
            const done = i <= stage;
            return (
              <li key={s.k} className="flex flex-1 flex-col items-center text-center last:items-end first:items-start">
                <span
                  className={`as-node flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-blue-ink ${
                    done ? "bg-yellow" : "bg-white"
                  }`}
                  aria-hidden
                >
                  {done ? (
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-blue-ink" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-blue-ink/25" />
                  )}
                </span>
                <span
                  className={`mt-2 max-w-[10ch] text-[10.5px] font-extrabold uppercase leading-tight tracking-tight ${
                    done ? "text-blue-ink" : "text-blue-ink/40"
                  }`}
                >
                  {s.k}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <p className="mt-6 text-[13px] leading-relaxed text-blue-ink/65">{STAGES[stage].d}</p>

      {ready && (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border-[3px] border-blue-ink bg-yellow p-4">
          <svg viewBox="0 0 24 24" className="mt-[1px] h-5 w-5 shrink-0 text-blue-ink" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" />
            <circle cx="12" cy="10" r="2.6" />
          </svg>
          <p className="text-[13px] font-bold leading-snug text-blue-ink">
            Your card is available to pick up in {days} days from{" "}
            <span className="underline decoration-2 underline-offset-2">{branch}</span>.
            <span className="mt-1 block font-medium text-blue-ink/65">
              Bring your NID. Collection hours are 10am–4pm, Sunday to Thursday.
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
