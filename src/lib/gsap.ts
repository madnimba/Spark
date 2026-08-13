"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { CustomEase } from "gsap/CustomEase";
import { Observer } from "gsap/Observer";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useLayoutEffect, useEffect } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(
    ScrollTrigger,
    SplitText,
    DrawSVGPlugin,
    CustomEase,
    Observer,
    MotionPathPlugin
  );

  // Bespoke eases. `expo` is our house curve — fast out, long elegant settle.
  CustomEase.create("expo", "0.16, 1, 0.3, 1");
  CustomEase.create("quart", "0.76, 0, 0.24, 1");
  CustomEase.create("swift", "0.22, 1, 0.36, 1");

  gsap.defaults({ ease: "expo", duration: 1.1 });
}

/** useLayoutEffect that doesn't warn during SSR. */
export const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** True when the visitor has asked for reduced motion. */
export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, Observer, MotionPathPlugin };
