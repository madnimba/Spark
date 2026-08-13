"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useIsoLayoutEffect, prefersReducedMotion } from "@/lib/gsap";
import { polar } from "@/lib/num";

type Node = {
  id: string;
  label: string;
  caption: string;
  image: string;
  /** Shown until the artwork loads, and if it never does. */
  tint: string;
  short: string;
};

/**
 * Drop the five images into `public/lifestyle/` with these filenames. Until
 * then each node renders its tinted initials, so the ring is never broken.
 */
const NODES: Node[] = [
  {
    id: "streaming",
    label: "Streaming",
    caption: "Netflix, and every other subscription",
    image: "/lifestyle/netflix.jpg",
    tint: "#E50914",
    short: "N",
  },
  {
    id: "shopping",
    label: "Shopping",
    caption: "Amazon and online stores worldwide",
    image: "/lifestyle/amazon.jpg",
    tint: "#111827",
    short: "a",
  },
  {
    id: "study",
    label: "Study abroad",
    caption: "GRE, IELTS, TOEFL, SAT and GMAT fees",
    image: "/lifestyle/gre.jpg",
    tint: "#1E63D0",
    short: "GRE",
  },
  {
    id: "ai",
    label: "AI tools",
    caption: "ChatGPT and the rest of your stack",
    image: "/lifestyle/openai.jpg",
    tint: "#10A37F",
    short: "AI",
  },
  {
    id: "lounge",
    label: "Lounge",
    caption: "4× Balaka Executive Lounge access",
    image: "/lifestyle/lounge.jpg",
    tint: "#C9A227",
    short: "BEL",
  },
];

const RADIUS = 38; // percent of the ring box

function NodeArt({ node }: { node: Node }) {
  const [ok, setOk] = useState(true);
  if (!ok) {
    return (
      <div
        className="flex h-full w-full items-center justify-center font-display text-[clamp(0.7rem,2.6vw,1.1rem)] font-extrabold text-white"
        style={{ background: node.tint }}
      >
        {node.short}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={node.image}
      alt={node.label}
      onError={() => setOk(false)}
      className="h-full w-full object-cover"
      draggable={false}
    />
  );
}

/**
 * The lifestyle ring.
 *
 * A dotted circle carrying five image nodes. Scroll turns the ring; each node
 * counter-rotates by the same amount so its picture stays upright rather than
 * tumbling. Tapping or hovering a node lifts it and names it in the centre.
 */
export default function LifestyleOrbit() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useIsoLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;

      const st = {
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.2,
      } as const;

      // Ring turns one way…
      gsap.fromTo(
        ".lo-ring",
        { rotate: -26 },
        { rotate: 26, ease: "none", transformOrigin: "50% 50%", scrollTrigger: st }
      );
      // …and every node turns back by the same amount, so the images stay level.
      gsap.fromTo(
        ".lo-node",
        { rotate: 26 },
        { rotate: -26, ease: "none", transformOrigin: "50% 50%", scrollTrigger: st }
      );

      // Dotted guide drifts against the ring for depth.
      gsap.fromTo(
        ".lo-guide",
        { rotate: 18 },
        { rotate: -18, ease: "none", transformOrigin: "50% 50%", scrollTrigger: st }
      );

      gsap.from(".lo-node-wrap", {
        scale: 0,
        autoAlpha: 0,
        duration: 0.8,
        ease: "back.out(1.8)",
        stagger: { each: 0.09, from: "start" },
        scrollTrigger: { trigger: root.current, start: "top 76%", once: true },
      });

      gsap.from(".lo-centre > *", {
        y: 26,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.07,
        ease: "expo",
        scrollTrigger: { trigger: root.current, start: "top 76%", once: true },
      });

      // Each node breathes on its own cycle so the ring never looks rigid.
      gsap.utils.toArray<HTMLElement>(".lo-float").forEach((el, i) => {
        gsap.to(el, {
          y: i % 2 ? 9 : -9,
          duration: 2.4 + i * 0.35,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });
    }, root);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  const current = active === null ? null : NODES[active];

  return (
    <section ref={root} id="lifestyles" className="relative overflow-hidden py-16 sm:py-24">
      <div className="shell">
        <div className="mx-auto max-w-2xl text-center">
          <span className="t-label">One card</span>
          <h2 className="t-h1 mt-3">
            All your
            <br />
            <span className="t-marker text-yellow">lifestyles</span>
          </h2>
        </div>

        {/* ---------------------------------------------------------- ring -- */}
        <div className="relative mx-auto mt-12 aspect-square w-full max-w-[min(92vw,620px)]">
          {/* dotted guide */}
          <div
            className="lo-guide absolute inset-[8%] rounded-full border-[3px] border-dashed border-white/30"
            aria-hidden
          />
          <div className="absolute inset-[20%] rounded-full border-2 border-white/12" aria-hidden />

          {/* rotating carrier */}
          <div className="lo-ring absolute inset-0">
            {NODES.map((n, i) => {
              const deg = (i / NODES.length) * 360 - 90;
              const { x, y } = polar(50, 50, RADIUS, deg);
              const on = active === i;
              return (
                <div
                  key={n.id}
                  className="lo-node-wrap absolute"
                  style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
                >
                  {/* counter-rotated so the picture stays upright */}
                  <div className="lo-node">
                    <div className="lo-float">
                      <button
                        type="button"
                        onPointerEnter={() => setActive(i)}
                        onPointerLeave={() => setActive((p) => (p === i ? null : p))}
                        onFocus={() => setActive(i)}
                        onBlur={() => setActive((p) => (p === i ? null : p))}
                        onClick={() => setActive((p) => (p === i ? null : i))}
                        aria-label={`${n.label} — ${n.caption}`}
                        className={`group relative block overflow-hidden rounded-full border-[3px] border-blue-ink transition-transform duration-300 ${
                          on ? "scale-110" : "scale-100"
                        }`}
                        style={{
                          width: "clamp(58px, 17vw, 116px)",
                          height: "clamp(58px, 17vw, 116px)",
                          boxShadow: on
                            ? "0 0 0 5px var(--yellow), 6px 6px 0 var(--blue-ink)"
                            : "5px 5px 0 var(--blue-ink)",
                        }}
                      >
                        <NodeArt node={n} />
                      </button>

                      {/* label rides under its node on wider screens */}
                      <span className="mt-2 hidden text-center text-[11px] font-extrabold uppercase tracking-tight text-white/85 sm:block">
                        {n.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ------------------------------------------------------ centre -- */}
          <div className="lo-centre pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-[22%] text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-blue-ink bg-yellow shadow-[4px_4px_0_var(--blue-ink)] sm:h-16 sm:w-16">
              <svg viewBox="0 0 40 64" className="h-6 w-auto sm:h-8" aria-hidden>
                <path d="M24 0 2 36h13L14 64 38 26H24l6-26Z" fill="var(--blue-ink)" />
              </svg>
            </span>

            <p
              key={current?.id ?? "idle"}
              className="mt-4 text-[clamp(0.95rem,3.6vw,1.35rem)] font-extrabold uppercase leading-tight tracking-tight text-white"
            >
              {current ? current.label : "Spark"}
            </p>
            <p className="mt-1.5 max-w-[22ch] text-[clamp(0.72rem,2.6vw,0.9rem)] leading-snug text-white/70">
              {current ? current.caption : "Tap a circle to see where it takes you"}
            </p>
          </div>
        </div>

        {/* mobile legend — the ring's own labels are hidden on small screens */}
        <ul className="mt-8 flex flex-wrap justify-center gap-2 sm:hidden">
          {NODES.map((n, i) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => setActive((p) => (p === i ? null : i))}
                className={`rounded-full border-[3px] border-blue-ink px-3 py-1.5 text-[12px] font-extrabold uppercase tracking-tight transition-colors ${
                  active === i ? "bg-yellow text-blue-ink" : "bg-white/10 text-white"
                }`}
              >
                {n.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
