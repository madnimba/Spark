"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useIsoLayoutEffect } from "@/lib/gsap";
import { onReady } from "@/lib/bus";
import { useSmoothScroll } from "./SmoothScroll";
import Logo, { BankMark } from "./Logo";
import Button from "../ui/Button";

const LINKS = [
  { label: "The card", href: "#card" },
  { label: "Perks", href: "#perks" },
  { label: "Get one", href: "#get" },
];

export default function Nav() {
  const root = useRef<HTMLElement>(null);
  const shell = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const { lenisRef } = useSmoothScroll();

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

  /* fullscreen menu */
  useIsoLayoutEffect(() => {
    const el = menu.current;
    if (!el) return;
    const items = el.querySelectorAll(".nav-item");
    const tl = gsap.timeline({ paused: true });

    tl.set(el, { pointerEvents: "auto" })
      .to(el, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "quart" })
      .from(items, { yPercent: 120, autoAlpha: 0, stagger: 0.07, duration: 0.6, ease: "expo" }, "-=0.35")
      .from(".nav-foot", { autoAlpha: 0, y: 14, duration: 0.5 }, "-=0.35");

    if (open) {
      tl.play();
      lenisRef.current?.stop();
      document.documentElement.style.overflow = "hidden";
    } else {
      tl.progress(0).pause();
      gsap.set(el, { clipPath: "inset(0% 0% 100% 0%)", pointerEvents: "none" });
      lenisRef.current?.start();
      document.documentElement.style.overflow = "";
    }

    return () => {
      tl.kill();
    };
  }, [open, lenisRef]);

  return (
    <>
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
                  href="#download"
                  tone="yellow"
                  magnetic={false}
                  className="min-h-[42px]! px-5! py-2! text-[13px]!"
                >
                  Get Spark
                </Button>
              </div>

              <button
                onClick={() => setOpen((o) => !o)}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                className="relative z-[95] flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-white lg:hidden"
              >
                <span className="relative block h-3 w-4">
                  <span
                    className={`absolute left-0 block h-[2.5px] w-full rounded bg-white transition-all duration-400 ${
                      open ? "top-1/2 rotate-45" : "top-0"
                    }`}
                  />
                  <span
                    className={`absolute left-0 block h-[2.5px] w-full rounded bg-white transition-all duration-400 ${
                      open ? "top-1/2 -rotate-45" : "top-full"
                    }`}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* fullscreen menu */}
      <div
        ref={menu}
        className="fixed inset-0 z-[85] flex flex-col justify-between bg-blue-ink px-[var(--gutter)] pb-10 pt-24"
        style={{ clipPath: "inset(0% 0% 100% 0%)", pointerEvents: "none" }}
      >
        <div className="halftone pointer-events-none absolute inset-0 opacity-15" />

        <nav className="relative flex flex-col gap-2">
          {LINKS.map((l, i) => (
            <div key={l.href} className="mask">
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="nav-item flex items-baseline gap-4 py-1"
              >
                <span className="font-mono text-xs text-yellow">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="t-h1 text-white">{l.label}</span>
              </a>
            </div>
          ))}
        </nav>

        <div className="nav-foot relative flex flex-col gap-5">
          <div className="h-[3px] w-full bg-white/20" />
          <div className="flex flex-wrap items-center justify-between gap-4">
            <BankMark className="text-[13px] text-white/70" />
            <Button href="#download" tone="yellow" onClick={() => setOpen(false)}>
              Get Spark
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
