"use client";

import Depth from "../ui/Depth";
import Counter from "../ui/Counter";

const FACTS = [
  { v: 1995, l: "Serving Bangladesh since", plain: true },
  { v: 100, suffix: "+", l: "Branches nationwide" },
  { v: 9500, suffix: "+", l: "Mastercard partner outlets" },
];

/**
 * The one place the bank speaks for itself. Short by design — it exists to
 * answer "who is behind this card?" and then hand the page back to Spark.
 */
export default function Trust() {
  return (
    <section id="trust" className="relative py-14 sm:py-20">
      <div className="shell">
        <Depth variant="rise">
          <div className="mx-auto max-w-3xl rounded-[28px] border-[3px] border-blue-ink bg-white/95 p-7 shadow-[7px_7px_0_var(--blue-ink)] sm:p-10">
            <p className="t-label text-blue-ink/55">07 — Who&apos;s behind it</p>

            <h2 className="t-h2 mt-3 text-blue-ink">
              A brand-new card from a{" "}
              <span className="t-marker text-pink">thirty-year-old bank</span>
            </h2>

            <p className="mt-4 text-[1rem] leading-relaxed text-blue-ink/75 sm:text-[1.05rem]">
              Spark is issued by Dhaka Bank PLC — licensed and regulated by
              Bangladesh Bank, and looking after people&apos;s money since 1995.
              Your balance sits in a regulated institution. The card on top of it
              just happens to be a lot more fun.
            </p>

            <dl className="mt-8 grid grid-cols-3 gap-4 border-t-[3px] border-blue-ink/12 pt-6">
              {FACTS.map((f) => (
                <div key={f.l}>
                  <dd className="font-display text-[clamp(1.5rem,6vw,2.25rem)] font-extrabold leading-none tracking-tight text-blue-ink">
                    <Counter
                      to={f.v}
                      suffix={f.suffix ?? ""}
                      grouping={!f.plain}
                    />
                  </dd>
                  <dt className="mt-2 text-[10px] font-semibold uppercase leading-tight tracking-[0.12em] text-blue-ink/55 sm:text-[11px]">
                    {f.l}
                  </dt>
                </div>
              ))}
            </dl>
          </div>
        </Depth>
      </div>
    </section>
  );
}
