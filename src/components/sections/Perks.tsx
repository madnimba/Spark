"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useIsoLayoutEffect, prefersReducedMotion } from "@/lib/gsap";
import Depth from "../ui/Depth";

const PERKS = [
  {
    icon: "bolt",
    t: "Top up in seconds",
    b: "Move money in from your Dhaka Bank account, bKash, Nagad or Rocket. It lands before you close the app.",
    bg: "var(--yellow)",
    ink: "#041f5c",
  },
  {
    icon: "lock",
    t: "Freeze it mid-panic",
    b: "Left it in a rickshaw? One tap kills the card. One more brings it back when you find it under the seat.",
    bg: "var(--pink)",
    ink: "#ffffff",
  },
  {
    icon: "globe",
    t: "Works where you do",
    b: "Tap in a shop, pay online, withdraw at any ATM, or use it abroad at over 200 countries' Visa merchants.",
    bg: "#ffffff",
    ink: "#041f5c",
  },
  {
    icon: "shield",
    t: "Spend only what's on it",
    b: "It's prepaid. There is no overdraft, no interest, no bill at the end of the month. You cannot fall into debt with it.",
    bg: "var(--cyan)",
    ink: "#041f5c",
  },
  {
    icon: "eye",
    t: "See every taka",
    b: "Every purchase lands in your history the moment it happens, with the merchant name spelled out properly.",
    bg: "#041f5c",
    ink: "#ffffff",
  },
  {
    icon: "gift",
    t: "Deals worth using",
    b: "Discounts at partner restaurants, campuses and online stores — refreshed monthly, redeemed by tapping.",
    bg: "var(--orange)",
    ink: "#041f5c",
  },
];

const ICONS: Record<string, React.ReactNode> = {
  bolt: <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />,
  lock: (
    <>
      <rect x="4.5" y="10" width="15" height="11" rx="3" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18-2.5-2.7-2.5-15.3 0-18Z" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2.5 20 6v6c0 4.6-3.3 8.5-8 9.5-4.7-1-8-4.9-8-9.5V6l8-3.5Z" />
      <path d="m8.7 12 2.3 2.3 4.3-4.6" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  gift: (
    <>
      <rect x="3" y="8" width="18" height="13" rx="2" />
      <path d="M3 12h18M12 8v13M12 8S9.5 3 7 4.5 9 8 12 8Zm0 0s2.5-5 5-3.5S15 8 12 8Z" />
    </>
  ),
};

export default function Perks() {
  const root = useRef<HTMLElement>(null);

  /* Each tile lifts toward the finger/cursor that's over it. */
  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".perk").forEach((el) => {
        const down = () => gsap.to(el, { scale: 0.96, duration: 0.18, ease: "power2.out" });
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
    <section ref={root} id="perks" className="relative py-16 sm:py-24">
      <div className="shell">
        <Depth variant="drop">
          <div className="mx-auto max-w-2xl text-center">
            <span className="t-label">03 — What you get</span>
            <h2 className="t-h1 mt-3">
              Six reasons it
              <br />
              <span className="t-marker text-yellow">beats cash</span>
            </h2>
          </div>
        </Depth>

        {/* The tiles are Depth's direct children so `stagger` can address them
            individually — wrapping them in a grid div would give it one target. */}
        <Depth
          variant="fan"
          stagger
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {PERKS.map((p) => (
            <article
              key={p.t}
              className="perk relative overflow-hidden rounded-[22px] border-[3px] border-blue-ink p-6 shadow-[6px_6px_0_var(--blue-ink)] will-change-transform"
              style={{ background: p.bg, color: p.ink }}
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
                {ICONS[p.icon]}
              </svg>

              <h3 className="t-h3 mt-4">{p.t}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed" style={{ opacity: 0.78 }}>
                {p.b}
              </p>
            </article>
          ))}
        </Depth>
      </div>
    </section>
  );
}
