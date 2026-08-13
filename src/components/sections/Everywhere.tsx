"use client";

import Depth from "../ui/Depth";
import Marquee from "../ui/Marquee";

const BAND = [
  "Activate digitally",
  "Set your PIN",
  "Reload anytime",
  "Track every taka",
  "Freeze in a tap",
];

const RELOAD = [
  { t: "GO Plus App", b: "Top up straight from your phone, any hour.", c: "var(--yellow)", ink: "#041f5c" },
  { t: "BEFTN", b: "Transfer in from any bank in Bangladesh.", c: "var(--pink)", ink: "#ffffff" },
  { t: "Branches", b: "Over the counter at any Dhaka Bank branch.", c: "#ffffff", ink: "#041f5c" },
  { t: "CRMs", b: "Cash Recycling Machines, deposit and go.", c: "var(--cyan)", ink: "#041f5c" },
];

/** Everything you do with the card after it arrives — all of it from the phone. */
export default function Everywhere() {
  return (
    <section id="app" className="relative overflow-hidden py-16 sm:py-24">
      <div className="shell">
        <Depth variant="swing">
          <div className="mx-auto max-w-2xl text-center">
            <span className="t-label">05 — In your hand</span>
            <h2 className="t-h1 mt-3">
              Spark. All from
              <br />
              <span className="t-marker text-yellow">your phone.</span>
            </h2>
            <p className="t-body mx-auto mt-5 max-w-[34ch]">
              Activate your card and set your PIN digitally. Nothing to post,
              nothing to queue for.
            </p>
          </div>
        </Depth>
      </div>

      <div className="my-10 border-y-[3px] border-blue-ink bg-white py-4">
        <Marquee baseSpeed={40}>
          {BAND.map((p) => (
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
        <p className="t-label mb-4 text-center">Reload via</p>
        <Depth variant="depth" stagger className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {RELOAD.map((c) => (
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
