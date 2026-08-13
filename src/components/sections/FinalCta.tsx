"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useIsoLayoutEffect, prefersReducedMotion } from "@/lib/gsap";
import Depth from "../ui/Depth";
import Button from "../ui/Button";

function StoreBadge({ store }: { store: "ios" | "android" }) {
  const ios = store === "ios";
  return (
    <a
      href="#"
      data-cursor="link"
      className="flex min-h-[52px] items-center gap-3 rounded-2xl border-[3px] border-blue-ink bg-white px-5 py-2.5 text-blue-ink shadow-[4px_4px_0_var(--blue-ink)] transition-transform duration-150 active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0_var(--blue-ink)]"
    >
      {ios ? (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
          <path d="M16.4 12.7c0-2.4 2-3.6 2.1-3.6-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.6.9s-1.9-.9-3.1-.8c-1.6 0-3.1.9-3.9 2.3-1.7 2.9-.4 7.2 1.2 9.6.8 1.2 1.7 2.5 3 2.4 1.2 0 1.6-.8 3.1-.8s1.9.8 3.1.7c1.3 0 2.1-1.2 2.9-2.3.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.6-1-2.6-3.8ZM14 5.3c.7-.8 1.1-1.9 1-3-1 0-2.2.6-2.9 1.5-.6.7-1.1 1.9-1 3 1.1.1 2.2-.6 2.9-1.5Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
          <path d="M3.6 2.3c-.2.2-.3.6-.3 1v17.4c0 .4.1.7.3 1l9.2-9.7-9.2-9.7Z" fill="#00d0ff" />
          <path d="m16.3 8.7-3.5-2-9.2 9.7 9.2-9.7Z" fill="#00f076" />
          <path d="m16.3 8.7 3.6 2c.9.5.9 1.9 0 2.5l-3.6 2-3.5-3.7 3.5-2.8Z" fill="#ffc900" />
          <path d="m12.8 12.5-9.2 9.7 9.2-5.3 3.5-2-3.5-2.4Z" fill="#ff3a44" />
        </svg>
      )}
      <span className="leading-tight">
        <span className="block text-[9px] font-bold uppercase tracking-[0.16em] opacity-60">
          {ios ? "Download on the" : "Get it on"}
        </span>
        <span className="block text-[15px] font-extrabold tracking-tight">
          {ios ? "App Store" : "Google Play"}
        </span>
      </span>
    </a>
  );
}

export default function FinalCta() {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.to(".cta-burst", {
        rotate: 130,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1.3 },
      });
    }, root);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="download" className="relative overflow-hidden py-20 sm:py-28">
      <svg
        viewBox="0 0 200 200"
        className="cta-burst pointer-events-none absolute left-1/2 top-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 opacity-20"
        aria-hidden
      >
        <polygon
          points="100,0 118,54 172,28 148,80 200,100 148,120 172,172 118,146 100,200 82,146 28,172 52,120 0,100 52,80 28,28 82,54"
          fill="var(--yellow)"
        />
      </svg>

      <div className="shell relative">
        <Depth variant="depth">
          <div className="mx-auto max-w-2xl text-center">
            <p className="t-h2 text-white/85">
              Don&apos;t let it become
              <br />
              just another card.
            </p>

            <h2 className="t-marker mt-5 text-[clamp(2.6rem,13vw,7rem)] text-white">
              <span className="slab">Follow Ur Spark</span>
            </h2>

            <p className="t-body mx-auto mt-7 max-w-[38ch]">
              Apply digitally from home with three documents. No branch visit,
              and no existing Dhaka Bank account needed.
            </p>

            <div className="mt-8 flex justify-center">
              <Button href="#apply" tone="yellow">
                Apply now →
              </Button>
            </div>

            <p className="t-label mt-10">Manage it all in the GO Plus app</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <StoreBadge store="ios" />
              <StoreBadge store="android" />
            </div>
          </div>
        </Depth>
      </div>
    </section>
  );
}
