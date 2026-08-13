"use client";

import Depth from "../ui/Depth";
import Marquee from "../ui/Marquee";

const PLACES = [
  "Campus canteens",
  "Ride hailing",
  "Food delivery",
  "Streaming subs",
  "Online stores",
  "ATM withdrawals",
  "Grocery runs",
  "Game top-ups",
  "Bus tickets",
  "Coffee",
];

const CHANNELS = [
  { t: "Tap in store", b: "Contactless up to ৳5,000 without a PIN.", c: "var(--yellow)", ink: "#041f5c" },
  { t: "Pay online", b: "Works with any site that takes Visa.", c: "var(--pink)", ink: "#ffffff" },
  { t: "Pull out cash", b: "Any ATM in Bangladesh, any network.", c: "#ffffff", ink: "#041f5c" },
  { t: "Use it abroad", b: "200+ countries. Toggle it on before you fly.", c: "var(--cyan)", ink: "#041f5c" },
];

export default function Everywhere() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div className="shell">
        <Depth variant="swing">
          <div className="mx-auto max-w-2xl text-center">
            <span className="t-label">05 — Where it works</span>
            <h2 className="t-h1 mt-3">
              Basically
              <br />
              <span className="t-marker text-yellow">everywhere</span>
            </h2>
          </div>
        </Depth>
      </div>

      {/* velocity-reactive band */}
      <div className="my-10 border-y-[3px] border-blue-ink bg-white py-4">
        <Marquee baseSpeed={40}>
          {PLACES.map((p) => (
            <span key={p} className="flex items-center">
              <span className="whitespace-nowrap px-5 text-[clamp(1.1rem,4.5vw,1.9rem)] font-extrabold uppercase tracking-tight text-blue-ink">
                {p}
              </span>
              <svg viewBox="0 0 40 64" className="h-5 w-auto shrink-0" aria-hidden>
                <path d="M24 0 2 36h13L14 64 38 26H24l6-26Z" fill="var(--pink)" />
              </svg>
            </span>
          ))}
        </Marquee>
      </div>

      <div className="shell">
        <Depth
          variant="depth"
          stagger
          className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
        >
          {CHANNELS.map((c) => (
            <div
              key={c.t}
              className="rounded-2xl border-[3px] border-blue-ink p-5 shadow-[5px_5px_0_var(--blue-ink)]"
              style={{ background: c.c, color: c.ink }}
            >
              <h3 className="text-[0.95rem] font-extrabold uppercase leading-tight tracking-tight sm:text-[1.05rem]">
                {c.t}
              </h3>
              <p className="mt-2 text-[0.85rem] leading-snug sm:text-[0.9rem]" style={{ opacity: 0.75 }}>
                {c.b}
              </p>
            </div>
          ))}
        </Depth>
      </div>
    </section>
  );
}
