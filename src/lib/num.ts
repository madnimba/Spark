/**
 * Round to a fixed precision.
 *
 * `Math.sin`/`Math.cos` are implementation-defined in ECMAScript — Node and the
 * browser can disagree in the last ULP, which React reports as a hydration
 * mismatch when the result lands in an SVG attribute. Rounding any trig-derived
 * geometry before it reaches JSX makes both sides produce byte-identical markup.
 */
export const r = (n: number, precision = 3): number => {
  const f = 10 ** precision;
  return Math.round(n * f) / f;
};

/** Polar → cartesian, pre-rounded. Angle in degrees. */
export const polar = (cx: number, cy: number, radius: number, deg: number) => ({
  x: r(cx + Math.cos((deg * Math.PI) / 180) * radius),
  y: r(cy + Math.sin((deg * Math.PI) / 180) * radius),
});
