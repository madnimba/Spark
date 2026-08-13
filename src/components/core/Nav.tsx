"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger, useIsoLayoutEffect } from "@/lib/gsap";
import { onReady } from "@/lib/bus";
import { useSession } from "@/lib/session";
import Logo, { BankMark } from "./Logo";
import Button from "../ui/Button";

const LINKS = [
  { label: "Why Spark", href: "#why" },
  { label: "The card", href: "#card" },
  { label: "Benefits", href: "#lifestyle" },
  { label: "How to apply", href: "#get" },
];

export default function Nav() {
  const root = useRef<HTMLElement>(null);
  const shell = useRef<HTMLDivElement>(null);
  const { session } = useSession();

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(root.current, { yPercent: -140 });
      const off = onReady(() =>
        gsap.to(root.current, { yPercent: 0, duration: 1, delay: 0.1, ease: "expo" })
      );

      // Solidify once we're off the hero.
      ScrollTrigger.create({
        start: "top -60",
        end: "max",
        onToggle(self) {
          gsap.to(shell.current, {
            backgroundColor: self.isActive ? "rgba(4,31,92,0.92)" : "rgba(4,31,92,0)",
            borderColor: self.isActive ? "var(--blue-ink)" : "rgba(4,31,92,0)",
            duration: 0.4,
            ease: "power2.out",
          });
        },
      });

      // Hide going down, reveal coming up — buys back a chunk of a phone screen.
      let last = 0;
      ScrollTrigger.create({
        start: "top -160",
        end: "max",
        onUpdate(self) {
          const y = self.scroll();
          if (Math.abs(y - last) < 10) return;
          const down = y > last;
          last = y;
          gsap.to(root.current, {
            yPercent: down ? -140 : 0,
            duration: 0.5,
            ease: "power3.out",
            overwrite: true,
          });
        },
      });

      return off;
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <header ref={root} className="fixed inset-x-0 top-0 z-[80] will-change-transform">
      <div className="shell">
        <div
          ref={shell}
          className="mt-2.5 flex items-center justify-between rounded-full border-[3px] px-3.5 py-2 sm:px-5 sm:py-2.5"
          style={{ backgroundColor: "rgba(4,31,92,0)", borderColor: "rgba(4,31,92,0)" }}
        >
          <a href="#top" aria-label="Spark — home" className="flex items-center gap-3">
            <Logo className="h-6 text-white sm:h-7" />
            <span className="hidden h-5 w-px bg-white/30 sm:block" />
            <BankMark className="hidden text-[11px] text-white/75 sm:flex" />
          </a>

          <nav className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                data-cursor="link"
                className="rounded-full px-4 py-2 text-[14px] font-bold uppercase tracking-tight text-white/80 transition-colors hover:bg-white/12 hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <Button
                href="/apply"
                tone="yellow"
                magnetic={false}
                className="min-h-[42px]! px-5! py-2! text-[13px]!"
              >
                Get Spark
              </Button>
            </div>

            {/* Profile, in place of the old hamburger. Signed in it goes to the
                dashboard, otherwise to sign-in. */}
            <Link
              href={session ? "/account" : "/signin"}
              aria-label={session ? "Your account" : "Sign in"}
              data-cursor="link"
              className={`relative flex h-11 w-11 items-center justify-center rounded-full border-[3px] transition-colors ${
                session
                  ? "border-yellow bg-yellow text-blue-ink"
                  : "border-white text-white hover:border-yellow hover:text-yellow"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <circle cx="12" cy="8" r="3.6" />
                <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
              </svg>
              {session && (
                <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-blue-ink bg-pink" />
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
