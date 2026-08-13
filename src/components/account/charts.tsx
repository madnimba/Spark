"use client";

import { useState, useId } from "react";

/* =============================================================================
   Chart primitives for the dashboard.

   Palette is two brand hues, validated for the white card surface:
     spend #1F6FEA · saved #EE1B7C
   Adjacent CVD ΔE 17.8 (protan), normal-vision ΔE 34.8, both ≥ 3:1 on white.
   Colour follows the entity — spend is always blue, saved always pink, in
   every chart on the page.

   Marks follow the house spec: bars ≤ 24px with a 4px rounded data-end square
   at the baseline, 2px lines, ≥ 8px end markers ringed in the surface colour,
   solid hairline grid one step off the surface, and labels in ink tokens
   rather than the series colour.
   ============================================================================= */

export const SPEND = "#1F6FEA";
export const SAVED = "#EE1B7C";
const GRID = "#E4E9F3";
const INK = "#041f5c";

const tk = (n: number) => `৳${Math.round(n).toLocaleString("en-US")}`;

/* ------------------------------------------------------------- chrome ----- */

export function Card({
  title,
  sub,
  children,
  actions,
}: {
  title: string;
  sub?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <section className="rounded-[22px] border-[3px] border-blue-ink bg-white p-5 shadow-[6px_6px_0_var(--blue-ink)] sm:p-6">
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-[1rem] font-extrabold uppercase tracking-tight text-blue-ink sm:text-[1.1rem]">
            {title}
          </h3>
          {sub && <p className="mt-1 text-[12.5px] leading-snug text-blue-ink/55">{sub}</p>}
        </div>
        {actions}
      </header>
      {children}
    </section>
  );
}

/** Every chart ships a table twin, so no value is reachable only by hovering. */
function TableToggle({ on, set }: { on: boolean; set: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => set(!on)}
      aria-pressed={on}
      className="rounded-full border-2 border-blue-ink/25 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-blue-ink/70 transition-colors hover:border-blue-ink hover:text-blue-ink"
    >
      {on ? "Chart" : "Table"}
    </button>
  );
}

export function Legend({ items }: { items: { color: string; label: string }[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
      {items.map((i) => (
        <li key={i.label} className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: i.color }} aria-hidden />
          <span className="text-[12px] font-bold text-blue-ink/70">{i.label}</span>
        </li>
      ))}
    </ul>
  );
}

/* --------------------------------------------------------- stat tiles ----- */

export function Stat({
  label,
  value,
  delta,
  deltaGood,
  foot,
}: {
  label: string;
  value: string;
  delta?: string;
  /** Whether the direction shown is a good thing. */
  deltaGood?: boolean;
  foot?: string;
}) {
  return (
    <div className="rounded-[18px] border-[3px] border-blue-ink bg-white p-4 shadow-[4px_4px_0_var(--blue-ink)]">
      <p className="text-[10.5px] font-extrabold uppercase tracking-[0.12em] text-blue-ink/50">
        {label}
      </p>
      {/* proportional figures — tabular-nums makes big numbers look loose */}
      <p className="mt-2 text-[clamp(1.35rem,5.5vw,1.85rem)] font-extrabold leading-none tracking-tight text-blue-ink">
        {value}
      </p>
      {delta && (
        <p
          className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-extrabold ${
            deltaGood ? "bg-[#0F8A5F]/12 text-[#0B6B49]" : "bg-[#C4115F]/12 text-[#A50F50]"
          }`}
        >
          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d={deltaGood ? "M12 19V5M6 11l6-6 6 6" : "M12 5v14M18 13l-6 6-6-6"} />
          </svg>
          {delta}
        </p>
      )}
      {foot && <p className="mt-2 text-[11.5px] leading-snug text-blue-ink/50">{foot}</p>}
    </div>
  );
}

/** A single ratio against a limit — track is a lighter step of the same hue. */
export function Meter({
  label,
  value,
  max,
  caption,
}: {
  label: string;
  value: number;
  max: number;
  caption?: string;
}) {
  const p = Math.min(1, value / max);
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[12px] font-extrabold uppercase tracking-wider text-blue-ink/60">{label}</p>
        <p className="text-[13px] font-extrabold tabular-nums text-blue-ink">
          {tk(value)} <span className="text-blue-ink/40">/ {tk(max)}</span>
        </p>
      </div>
      <div className="mt-2 h-3 w-full overflow-hidden rounded-full" style={{ background: "#D6E4FB" }}>
        <div
          className="h-full rounded-r-[4px]"
          style={{ width: `${p * 100}%`, background: SPEND }}
          role="progressbar"
          aria-valuenow={Math.round(p * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
        />
      </div>
      {caption && <p className="mt-2 text-[11.5px] text-blue-ink/55">{caption}</p>}
    </div>
  );
}

/* ------------------------------------------------- horizontal bar chart --- */

export type BarRow = { name: string; spend: number; saved: number; rate: number; txns: number };

/**
 * One series, so every bar takes the same hue — colouring bars by their value
 * would re-encode length as brightness and spend the identity channel on
 * nothing. Values sit outside the bar end, where they can never be clipped.
 */
export function CategoryBars({ rows }: { rows: BarRow[] }) {
  const [table, setTable] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const max = Math.max(...rows.map((r) => r.spend));

  return (
    <Card
      title="Where it went"
      sub={`${rows.length} categories this month · bar length is spend, the note below each is what Spark gave back`}
      actions={<TableToggle on={table} set={setTable} />}
    >
      {table ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] tabular-nums">
            <thead>
              <tr className="border-b-2 border-blue-ink/15 text-[10.5px] uppercase tracking-wider text-blue-ink/50">
                <th className="py-2 pr-3 font-extrabold">Category</th>
                <th className="py-2 pr-3 text-right font-extrabold">Spend</th>
                <th className="py-2 pr-3 text-right font-extrabold">Rate</th>
                <th className="py-2 pr-3 text-right font-extrabold">Saved</th>
                <th className="py-2 text-right font-extrabold">Txns</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.name} className="border-b border-blue-ink/8 text-blue-ink">
                  <td className="py-2 pr-3 font-bold">{r.name}</td>
                  <td className="py-2 pr-3 text-right">{tk(r.spend)}</td>
                  <td className="py-2 pr-3 text-right">{r.rate}%</td>
                  <td className="py-2 pr-3 text-right">{tk(r.saved)}</td>
                  <td className="py-2 text-right">{r.txns}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {rows.map((r) => (
            <li
              key={r.name}
              onPointerEnter={() => setHover(r.name)}
              onPointerLeave={() => setHover((h) => (h === r.name ? null : h))}
              className="group"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[13px] font-extrabold text-blue-ink">{r.name}</span>
                <span className="shrink-0 text-[13px] font-extrabold tabular-nums text-blue-ink">
                  {tk(r.spend)}
                </span>
              </div>

              {/* track is one step off the surface; bar is 12px with a 4px
                  rounded data-end and a square baseline */}
              <div className="mt-1.5 h-3 w-full rounded-full" style={{ background: GRID }}>
                <div
                  className="h-full rounded-r-[4px] transition-[width] duration-700 ease-out"
                  style={{
                    width: `${(r.spend / max) * 100}%`,
                    background: SPEND,
                    opacity: hover && hover !== r.name ? 0.45 : 1,
                  }}
                />
              </div>

              <p className="mt-1.5 text-[11.5px] text-blue-ink/55">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: SAVED }} aria-hidden />
                  <span className="font-bold text-blue-ink/75">{tk(r.saved)} back</span>
                </span>
                <span className="mx-1.5 text-blue-ink/30">·</span>
                {r.rate}% rate
                <span className="mx-1.5 text-blue-ink/30">·</span>
                {r.txns} transactions
              </p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

/* --------------------------------------------------------- column chart --- */

/**
 * Spend and savings are two orders of magnitude apart, so they are never
 * plotted on one axis — a dual-axis chart invents a correlation. They are
 * small multiples instead: same months, same width, one measure each.
 */
export function MonthlyColumns({
  data,
  series,
  color,
  label,
}: {
  data: { m: string; v: number }[];
  series: string;
  color: string;
  label: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const id = useId();
  const max = Math.max(...data.map((d) => d.v));
  const ticks = [0, max / 2, max];

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} aria-hidden />
        <p className="text-[12px] font-extrabold uppercase tracking-wider text-blue-ink/70">{series}</p>
      </div>

      <div className="relative">
        {/* grid — solid hairlines, one step off the surface */}
        <div className="absolute inset-x-0 top-0 h-[132px]">
          {ticks.map((t, i) => (
            <div
              key={i}
              className="absolute inset-x-0 border-t"
              style={{ borderColor: GRID, bottom: `${(t / max) * 100}%` }}
            />
          ))}
        </div>

        <ul className="relative flex h-[132px] items-end gap-2">
          {data.map((d, i) => {
            const on = hover === i;
            const last = i === data.length - 1;
            return (
              <li key={d.m} className="flex h-full flex-1 items-end justify-center">
                <button
                  type="button"
                  onPointerEnter={() => setHover(i)}
                  onPointerLeave={() => setHover((h) => (h === i ? null : h))}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover((h) => (h === i ? null : h))}
                  aria-describedby={id}
                  aria-label={`${d.m}: ${tk(d.v)}`}
                  // the hit area is the whole column slot, not just the bar
                  className="relative flex h-full w-full max-w-[24px] items-end"
                >
                  <span
                    className="block w-full rounded-t-[4px] transition-all duration-500"
                    style={{
                      height: `${(d.v / max) * 100}%`,
                      background: color,
                      opacity: hover !== null && !on ? 0.45 : 1,
                    }}
                  />
                  {(on || last) && (
                    <span className="pointer-events-none absolute inset-x-0 -top-5 whitespace-nowrap text-center text-[10.5px] font-extrabold tabular-nums text-blue-ink">
                      {tk(d.v)}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* x band lives inside the container, so nothing gets a nested scroll */}
        <ul className="mt-2 flex gap-2">
          {data.map((d, i) => (
            <li
              key={d.m}
              className={`flex-1 text-center text-[10.5px] font-bold tabular-nums ${
                hover === i ? "text-blue-ink" : "text-blue-ink/45"
              }`}
            >
              {d.m}
            </li>
          ))}
        </ul>
      </div>

      <p id={id} className="sr-only">
        {label}: {data.map((d) => `${d.m} ${tk(d.v)}`).join(", ")}
      </p>
    </div>
  );
}

/* ----------------------------------------------------------- line chart --- */

/** Single series, so no legend box — the heading names what's plotted. */
export function SavingsLine({ data }: { data: { m: string; v: number }[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 320;
  const H = 120;
  const PAD = { t: 14, r: 14, b: 8, l: 14 };
  const max = Math.max(...data.map((d) => d.v)) * 1.15;

  const x = (i: number) => PAD.l + (i / (data.length - 1)) * (W - PAD.l - PAD.r);
  const y = (v: number) => PAD.t + (1 - v / max) * (H - PAD.t - PAD.b);

  const path = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(d.v)}`).join(" ");
  const area = `${path} L${x(data.length - 1)},${H - PAD.b} L${x(0)},${H - PAD.b} Z`;
  const lastIdx = data.length - 1;
  const active = hover ?? lastIdx;

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: SAVED }} aria-hidden />
        <p className="text-[12px] font-extrabold uppercase tracking-wider text-blue-ink/70">
          Saved with Spark
        </p>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full touch-none"
        role="img"
        aria-label={`Monthly savings: ${data.map((d) => `${d.m} ${tk(d.v)}`).join(", ")}`}
        onPointerLeave={() => setHover(null)}
      >
        {/* hairline grid */}
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <line
            key={f}
            x1={PAD.l}
            x2={W - PAD.r}
            y1={y(max * f)}
            y2={y(max * f)}
            stroke={GRID}
            strokeWidth="1"
          />
        ))}

        {/* 10% wash under the line */}
        <path d={area} fill={SAVED} opacity="0.1" />
        <path d={path} fill="none" stroke={SAVED} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {/* crosshair on the active point */}
        <line
          x1={x(active)}
          x2={x(active)}
          y1={PAD.t}
          y2={H - PAD.b}
          stroke={INK}
          strokeOpacity="0.16"
          strokeWidth="1"
        />

        {/* end marker: r 5 with a 2px surface ring */}
        <circle cx={x(active)} cy={y(data[active].v)} r="5" fill={SAVED} stroke="#fff" strokeWidth="2" />

        {/* generous invisible hit targets */}
        {data.map((d, i) => (
          <rect
            key={d.m}
            x={x(i) - (W - PAD.l - PAD.r) / (data.length - 1) / 2}
            y={0}
            width={(W - PAD.l - PAD.r) / (data.length - 1)}
            height={H}
            fill="transparent"
            onPointerEnter={() => setHover(i)}
          />
        ))}
      </svg>

      <div className="mt-1 flex items-baseline justify-between gap-3">
        <ul className="flex flex-1 gap-2">
          {data.map((d, i) => (
            <li
              key={d.m}
              className={`flex-1 text-center text-[10.5px] font-bold tabular-nums ${
                active === i ? "text-blue-ink" : "text-blue-ink/45"
              }`}
            >
              {d.m}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-2 text-[12px] text-blue-ink/60">
        <span className="font-extrabold text-blue-ink">{data[active].m}</span> ·{" "}
        <span className="font-extrabold tabular-nums text-blue-ink">{tk(data[active].v)}</span> back
      </p>
    </div>
  );
}
