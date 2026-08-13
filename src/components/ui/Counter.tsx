"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useIsoLayoutEffect, prefersReducedMotion } from "@/lib/gsap";

export default function Counter({
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 2.2,
  grouping = true,
  className = "",
}: {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  /** Turn off thousands separators — years shouldn't read as "1,995". */
  grouping?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const format = (n: number) =>
      prefix +
      n.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        useGrouping: grouping,
      }) +
      suffix;

    if (prefersReducedMotion()) {
      el.textContent = format(to);
      return;
    }

    const obj = { v: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        v: to,
        duration,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = format(obj.v);
        },
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    }, ref);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [to, decimals, prefix, suffix, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}
