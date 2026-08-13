"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap, useIsoLayoutEffect, prefersReducedMotion } from "@/lib/gsap";
import { useSession, signOut, formatPhone } from "@/lib/session";
import PageShell from "@/components/form/PageShell";
import SparkCard from "@/components/visuals/SparkCard";
import { DESIGNS } from "@/components/visuals/designs";
import ApplicationStatus from "@/components/account/ApplicationStatus";
import {
  Card,
  Stat,
  Meter,
  Legend,
  CategoryBars,
  MonthlyColumns,
  SavingsLine,
  SPEND,
  SAVED,
} from "@/components/account/charts";
import {
  ACCOUNT,
  CATEGORIES,
  MONTHS,
  MAX_DISCOUNT,
  spend,
  saved,
  txns,
  leftover,
  spendRatio,
  effectiveRate,
  spendDelta,
  savedDelta,
  top,
  bestSaver,
  foodShare,
  potentialSaved,
  missedSaved,
  belowCap,
  tk,
  pct,
} from "@/lib/account-data";

export default function AccountPage() {
  const router = useRouter();
  const root = useRef<HTMLDivElement>(null);
  const { session, ready } = useSession();

  // Prototype guard, not a security boundary — the dashboard is static
  // fixture data either way.
  useEffect(() => {
    if (ready && !session) router.replace("/signin");
  }, [ready, session, router]);

  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(".ac-block", {
        y: 30,
        autoAlpha: 0,
        duration: 0.7,
        stagger: 0.07,
        ease: "expo",
      });
    }, root);
    return () => ctx.revert();
  }, [ready]);

  if (!ready || !session) {
    return (
      <PageShell>
        <div className="shell pt-20 text-center">
          <div className="mx-auto h-12 w-12 animate-[spark-spin_1s_linear_infinite] rounded-full border-4 border-white/25 border-t-yellow" />
        </div>
      </PageShell>
    );
  }

  const design = DESIGNS.find((d) => d.id === ACCOUNT.cardDesignId) ?? DESIGNS[0];
  const biggest = top[0];
  const opportunity = belowCap[0];

  return (
    <PageShell>
      <div ref={root} className="shell pt-2">
        {/* --------------------------------------------------------- head -- */}
        <div className="ac-block flex flex-wrap items-end justify-between gap-4 border-b-[3px] border-white/20 pb-6">
          <div>
            <span className="t-label">Your dashboard</span>
            <h1 className="t-h1 mt-2">
              Hey,{" "}
              <span className="t-marker text-yellow">{ACCOUNT.holder.split(" ")[0]}</span>
            </h1>
            <p className="mt-2 text-[13px] text-white/60">
              {formatPhone(session.phone)} · member since {ACCOUNT.memberSince}
            </p>
          </div>

          <button
            onClick={() => {
              signOut();
              router.replace("/");
            }}
            className="rounded-full border-[3px] border-white/60 px-4 py-2 text-[12px] font-extrabold uppercase tracking-wider text-white transition-colors hover:border-yellow hover:text-yellow"
          >
            Sign out
          </button>
        </div>

        {/* ---------------------------------------------------- your card -- */}
        <div className="ac-block mt-8 grid gap-6 lg:grid-cols-[240px_1fr] lg:items-start">
          <div>
            <p className="t-label mb-3">Your card</p>
            <div className="mx-auto w-[150px] sm:w-[180px] lg:mx-0 lg:w-full">
              <SparkCard design={design} face="front" name={ACCOUNT.holder} />
            </div>
            <p className="mt-3 text-center text-[12px] text-white/60 lg:text-left">
              Spark {design.name} · ···· {ACCOUNT.cardLast4}
              <span className="mt-1 block">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-2.5 py-1 text-[11px] font-bold text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow" /> Active
                </span>
              </span>
            </p>
          </div>

          <ApplicationStatus
            stage={ACCOUNT.applicationStage}
            branch={ACCOUNT.branch}
            days={ACCOUNT.pickupDays}
          />
        </div>

        {/* -------------------------------------------------------- KPIs --- */}
        <div className="ac-block mt-8">
          <p className="t-label mb-3">{ACCOUNT.period}</p>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <Stat
              label="Money in"
              value={tk(ACCOUNT.income)}
              foot="Salary, credited 1 Aug"
            />
            <Stat
              label="Money out"
              value={tk(spend)}
              delta={`${spendDelta > 0 ? "+" : ""}${spendDelta.toFixed(1)}% vs Jul`}
              deltaGood={false}
              foot={`${txns} transactions`}
            />
            <Stat
              label="Saved with Spark"
              value={tk(saved)}
              delta={`+${savedDelta.toFixed(1)}% vs Jul`}
              deltaGood
              foot={`${pct(effectiveRate)} effective discount`}
            />
            <Stat
              label="Left over"
              value={tk(leftover)}
              foot={`${pct((leftover / ACCOUNT.income) * 100, 0)} of income kept`}
            />
          </div>
        </div>

        {/* ------------------------------------------------- AI summary --- */}
        <div className="ac-block mt-6 rounded-[22px] border-[3px] border-blue-ink bg-gradient-to-br from-yellow to-[#FFC400] p-5 shadow-[6px_6px_0_var(--blue-ink)] sm:p-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-blue-ink bg-white">
              <svg viewBox="0 0 40 64" className="h-4 w-auto" aria-hidden>
                <path d="M24 0 2 36h13L14 64 38 26H24l6-26Z" fill="var(--blue-ink)" />
              </svg>
            </span>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-blue-ink/70">
              Spark AI · your month in short
            </p>
          </div>

          <p className="mt-4 text-[15px] font-bold leading-relaxed text-blue-ink sm:text-[16.5px]">
            You spent <strong>{tk(spend)}</strong> in {ACCOUNT.period.split(" ")[0]} — that&apos;s{" "}
            <strong>{pct(spendRatio * 100, 0)}</strong> of what came in, and{" "}
            <strong>{spendDelta.toFixed(1)}% more</strong> than July. Food is the story:
            groceries and eating out together came to{" "}
            <strong>{tk(biggest.spend + CATEGORIES[1].spend)}</strong>, or{" "}
            <strong>{pct(foodShare, 0)}</strong> of everything you spent.
          </p>

          <p className="mt-3 text-[14px] leading-relaxed text-blue-ink/75">
            Spark handed back <strong className="text-blue-ink">{tk(saved)}</strong> across{" "}
            {txns} transactions — an effective discount of {pct(effectiveRate)}. Your best
            earner was <strong className="text-blue-ink">{bestSaver.name}</strong> at{" "}
            {tk(bestSaver.saved)}, sitting at the full {MAX_DISCOUNT}% rate. At {MAX_DISCOUNT}%
            on everything you&apos;d have kept {tk(potentialSaved)}, so there&apos;s{" "}
            <strong className="text-blue-ink">{tk(missedSaved)}</strong> still on the table.
          </p>

          <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {[
              {
                t: "Move this one first",
                b: `${opportunity.name} is your biggest gap — ${tk(opportunity.spend)} at only ${opportunity.rate}%. Paying it with Spark at partner outlets would add roughly ${tk((opportunity.spend * (MAX_DISCOUNT - opportunity.rate)) / 100)} a month.`,
              },
              {
                t: "Your savings are outpacing your spending",
                b: `Spend rose ${spendDelta.toFixed(1)}% but what you got back rose ${savedDelta.toFixed(1)}% — you're routing more of the same money through the card.`,
              },
              {
                t: "Small, frequent, and adding up",
                b: `Ride hailing is only ${tk(8900)} but ${62} separate taps. It's your most-used category by a distance.`,
              },
              {
                t: "Runway",
                b: `${tk(leftover)} left this month. Keep this pace and you'll clear ${tk(leftover * 12)} over a year before any discounts.`,
              },
            ].map((i) => (
              <li key={i.t} className="rounded-2xl bg-white/55 p-3.5">
                <p className="text-[12.5px] font-extrabold uppercase tracking-tight text-blue-ink">
                  {i.t}
                </p>
                <p className="mt-1 text-[12.5px] leading-snug text-blue-ink/70">{i.b}</p>
              </li>
            ))}
          </ul>

          <p className="mt-4 text-[11px] font-medium text-blue-ink/55">
            Generated from your last six months of activity.
          </p>
        </div>

        {/* -------------------------------------------------- categories -- */}
        <div className="ac-block mt-6">
          <CategoryBars rows={CATEGORIES} />
        </div>

        {/* ----------------------------------------------------- trends --- */}
        <div className="ac-block mt-6 grid gap-6 lg:grid-cols-2">
          <Card
            title="Six-month trend"
            sub="Spend and savings are two different scales, so they get a chart each rather than sharing one axis."
          >
            <div className="flex flex-col gap-8">
              <MonthlyColumns
                data={MONTHS.map((m) => ({ m: m.m, v: m.spend }))}
                series="Spent"
                color={SPEND}
                label="Monthly spend"
              />
              <SavingsLine data={MONTHS.map((m) => ({ m: m.m, v: m.saved }))} />
            </div>
            <div className="mt-6 border-t border-blue-ink/10 pt-4">
              <Legend
                items={[
                  { color: SPEND, label: "Spent" },
                  { color: SAVED, label: "Saved with Spark" },
                ]}
              />
            </div>
          </Card>

          <div className="flex flex-col gap-6">
            <Card title="Income vs spending" sub="How much of this month's money is already committed.">
              <div className="flex flex-col gap-5">
                <Meter
                  label="Spent"
                  value={spend}
                  max={ACCOUNT.income}
                  caption={`${pct(spendRatio * 100, 0)} of income. ${tk(leftover)} still unspent.`}
                />
                <Meter
                  label="Discount earned"
                  value={saved}
                  max={potentialSaved}
                  caption={`${pct(effectiveRate)} average against a ${MAX_DISCOUNT}% ceiling — ${tk(missedSaved)} unclaimed.`}
                />
              </div>
            </Card>

            <Card
              title="Where the discount works hardest"
              sub={`Rate applied per category. Spark caps at ${MAX_DISCOUNT}%.`}
            >
              <ul className="flex flex-col gap-3">
                {[...CATEGORIES]
                  .sort((a, b) => b.rate - a.rate || b.saved - a.saved)
                  .map((c) => (
                    <li key={c.name} className="flex items-center gap-3">
                      <span className="w-[42%] shrink-0 truncate text-[12.5px] font-bold text-blue-ink">
                        {c.name}
                      </span>
                      <span className="h-2.5 flex-1 rounded-full" style={{ background: "#E4E9F3" }}>
                        <span
                          className="block h-full rounded-r-[4px]"
                          style={{ width: `${(c.rate / MAX_DISCOUNT) * 100}%`, background: SAVED }}
                        />
                      </span>
                      <span className="w-[3.2rem] shrink-0 text-right text-[12px] font-extrabold tabular-nums text-blue-ink">
                        {c.rate}%
                      </span>
                    </li>
                  ))}
              </ul>
              <p className="mt-4 text-[12px] leading-snug text-blue-ink/55">
                Categories below the cap are where extra money is available — no change in
                what you buy, only where you tap.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
