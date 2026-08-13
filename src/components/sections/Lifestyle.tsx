"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useIsoLayoutEffect, prefersReducedMotion } from "@/lib/gsap";
import Depth from "../ui/Depth";

type Tile = { q: string; a: string; bg: string; ink: string; icon: string };
type Group = { kicker: string; title: string; accent: string; tiles: Tile[] };

const GROUPS: Group[] = [
  {
    kicker: "Spark your travel",
    title: "Travel. Chill. Repeat.",
    accent: "var(--yellow)",
    tiles: [
      {
        q: "Lounge access",
        a: "4× Balaka Express Lounge access, every year.",
        bg: "var(--yellow)",
        ink: "#041f5c",
        icon: "lounge",
      },
      {
        q: "Going beyond borders?",
        a: "Up to USD 12,000 transaction limit, with 0% markup.",
        bg: "#ffffff",
        ink: "#041f5c",
        icon: "globe",
      },
    ],
  },
  {
    kicker: "Spark your everyday",
    title: "Spend on what you love.",
    accent: "var(--pink)",
    tiles: [
      {
        q: "Cashback",
        a: "Earn it back on selected youth lifestyle categories.",
        bg: "var(--pink)",
        ink: "#ffffff",
        icon: "cash",
      },
      {
        q: "More to explore",
        a: "Privileges across travel, dining, education, fashion, gadgets and entertainment.",
        bg: "var(--cyan)",
        ink: "#041f5c",
        icon: "star",
      },
    ],
  },
  {
    kicker: "Spark your plans",
    title: "Big plans? Go for them.",
    accent: "var(--cyan)",
    tiles: [
      {
        q: "Test fees, discounted",
        a: "Save on selected IELTS, TOEFL, SAT and GMAT fees.",
        bg: "#ffffff",
        ink: "#041f5c",
        icon: "book",
      },
      {
        q: "One card. Two worlds.",
        a: "Dual-currency, for local and international transactions alike.",
        bg: "var(--orange)",
        ink: "#041f5c",
        icon: "swap",
      },
      {
        q: "Wherever you go",
        a: "Accepted at 9,500+ Mastercard merchant partner outlets across Bangladesh.",
        bg: "var(--yellow)",
        ink: "#041f5c",
        icon: "pin",
      },
    ],
  },
];

const ICONS: Record<string, React.ReactNode> = {
  lounge: (
    <>
      <path d="M4 18v-6a2 2 0 0 1 4 0v3h8v-3a2 2 0 0 1 4 0v6" />
      <path d="M3 18h18M6 21v-3M18 21v-3M8 9V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18-2.5-2.7-2.5-15.3 0-18Z" />
    </>
  ),
  cash: (
    <>
      <rect x="2.5" y="6" width="19" height="12" rx="2.5" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M6 10v4M18 10v4" />
    </>
  ),
  star: <path d="M12 3l2.7 5.8 6.3.8-4.6 4.4 1.2 6.2-5.6-3-5.6 3 1.2-6.2L3 9.6l6.3-.8L12 3Z" />,
  book: (
    <>
      <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H19v18H5.5A1.5 1.5 0 0 1 4 19.5v-15Z" />
      <path d="M4 17h15M9 7h6" />
    </>
  ),
  swap: <path d="M4 8h13l-3.5-3.5M20 16H7l3.5 3.5" />,
  pin: (
    <>
      <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
};

/**
 * The three worlds Spark is built for. Sits directly after the card so the
 * product is on screen before the reasons to carry it.
 */
export default function Lifestyle() {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".lf-tile").forEach((el) => {
        const down = () => gsap.to(el, { scale: 0.96, duration: 0.18, ease: "power2.out" });
        const up = () => gsap.to(el, { scale: 1, duration: 0.5, ease: "elastic.out(1,0.6)" });
        el.addEventListener("pointerdown", down);
        el.addEventListener("pointerup", up);
        el.addEventListener("pointercancel", up);
        el.addEventListener("pointerleave", up);
      });

      // Each group's rule draws itself as the group arrives.
      gsap.utils.toArray<HTMLElement>(".lf-rule").forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 92%", end: "top 62%", scrub: 0.5 },
          }
        );
      });
    }, root);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="lifestyle" className="relative py-16 sm:py-24">
      <div className="shell">
        <Depth variant="drop">
          <div className="mx-auto max-w-2xl text-center">
            <span className="t-label">03 — What it unlocks</span>
            <h2 className="t-h1 mt-3">
              Three worlds.
              <br />
              <span className="t-marker text-yellow">One card.</span>
            </h2>
          </div>
        </Depth>

        <div className="mt-12 flex flex-col gap-14 sm:gap-20">
          {GROUPS.map((g, gi) => (
            <div key={g.kicker}>
              <Depth variant={gi % 2 === 0 ? "swing" : "rise"}>
                <div className="flex items-baseline gap-4">
                  <span
                    className="t-label shrink-0 text-[10px]!"
                    style={{ color: g.accent }}
                  >
                    {g.kicker}
                  </span>
                  <span
                    className="lf-rule h-[3px] flex-1 origin-left"
                    style={{ background: g.accent, opacity: 0.55 }}
                  />
                </div>

                <h3 className="t-h2 mt-4 max-w-[16ch]">{g.title}</h3>
              </Depth>

              <Depth
                variant="fan"
                stagger
                className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {g.tiles.map((t) => (
                  <article
                    key={t.q}
                    className="lf-tile relative overflow-hidden rounded-[22px] border-[3px] border-blue-ink p-6 shadow-[6px_6px_0_var(--blue-ink)] will-change-transform"
                    style={{ background: t.bg, color: t.ink }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-8 w-8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      {ICONS[t.icon]}
                    </svg>
                    <h4 className="t-h3 mt-4">{t.q}</h4>
                    <p className="mt-2 text-[0.95rem] leading-relaxed" style={{ opacity: 0.78 }}>
                      {t.a}
                    </p>
                  </article>
                ))}
              </Depth>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
