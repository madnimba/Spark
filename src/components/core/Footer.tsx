"use client";

import Logo, { BankMark } from "./Logo";

const COLS = [
  { h: "Spark", links: ["The card", "Designs", "Perks", "Fees & limits"] },
  { h: "Support", links: ["Help centre", "Freeze a card", "Report fraud", "Contact"] },
  { h: "Dhaka Bank", links: ["About", "Branches & ATMs", "Careers", "Privacy"] },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-blue-ink pt-16">
      <div className="halftone pointer-events-none absolute inset-0 opacity-12" />

      <div className="shell relative">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo className="h-8 text-yellow" color="var(--yellow)" />
            <p className="mt-4 max-w-xs text-[0.92rem] leading-relaxed text-white/65">
              A prepaid card issued by Dhaka Bank PLC, licensed and regulated by
              Bangladesh Bank.
            </p>
            <BankMark className="mt-5 text-[15px] text-white/80" />
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {COLS.map((c) => (
              <div key={c.h}>
                <p className="t-label text-[9px]! text-yellow">{c.h}</p>
                <ul className="mt-3 flex flex-col gap-2">
                  {c.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        data-cursor="link"
                        className="inline-block py-1 text-[0.9rem] text-white/65 transition-colors hover:text-yellow"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t-[3px] border-white/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[60ch] text-[11px] leading-relaxed text-white/45">
            Concept marketing site — not an official Dhaka Bank PLC property.
            Card designs, figures and offers shown are illustrative.
          </p>
          <p className="text-[11px] text-white/45">
            © {new Date().getFullYear()} Dhaka Bank PLC
          </p>
        </div>
      </div>

      {/* kinetic wordmark bleeding off the bottom edge */}
      <p
        className="pointer-events-none mt-6 select-none text-center font-display font-extrabold uppercase leading-[0.75] tracking-[-0.05em] text-white/10"
        style={{ fontSize: "clamp(4rem, 26vw, 20rem)" }}
      >
        Spark
      </p>
    </footer>
  );
}
