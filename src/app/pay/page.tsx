"use client";

import { useState, useEffect, useRef, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { gsap, useIsoLayoutEffect, prefersReducedMotion } from "@/lib/gsap";
import PageShell, { SecureNote } from "@/components/form/PageShell";
import Field from "@/components/form/Field";
import Button from "@/components/ui/Button";

/** Illustrative figure — replace with the real issuance fee before launch. */
const FEE = 575;

type MethodId = "bkash" | "nagad" | "rocket" | "card";
type Stage = "choose" | "processing" | "done";

const METHODS: { id: MethodId; name: string; kind: "mfs" | "card"; brand: string; ink: string }[] = [
  { id: "bkash", name: "bKash", kind: "mfs", brand: "#E2136E", ink: "#ffffff" },
  { id: "nagad", name: "Nagad", kind: "mfs", brand: "#F6921E", ink: "#041f5c" },
  { id: "rocket", name: "Rocket", kind: "mfs", brand: "#8C3494", ink: "#ffffff" },
  { id: "card", name: "Card", kind: "card", brand: "#1f6fea", ink: "#ffffff" },
];

const STEPS = ["Contacting gateway", "Verifying details", "Confirming payment"];

/**
 * sessionStorage is a client-only store, so it's read through
 * useSyncExternalStore with a null server snapshot rather than an effect that
 * calls setState. Same result, no cascading render, and the server and first
 * client paint agree. Nothing is subscribed — the value is written once by the
 * application form and never changes while this page is open.
 */
const noSubscribe = () => () => {};
const readApplicant = () => {
  try {
    return sessionStorage.getItem("spark:applicant");
  } catch {
    return null;
  }
};

/** 4-digit groups, capped at 16 digits. */
const groupCard = (v: string) =>
  v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

const groupExpiry = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

export default function PayPage() {
  const root = useRef<HTMLDivElement>(null);
  const [method, setMethod] = useState<MethodId | null>(null);
  const [stage, setStage] = useState<Stage>("choose");
  const [tick, setTick] = useState(0);

  const rawApplicant = useSyncExternalStore(noSubscribe, readApplicant, () => null);
  const name = useMemo(() => {
    if (!rawApplicant) return "";
    try {
      return (JSON.parse(rawApplicant) as { name?: string }).name ?? "";
    } catch {
      return "";
    }
  }, [rawApplicant]);

  // MFS
  const [mfsNumber, setMfsNumber] = useState("");
  const [mfsPin, setMfsPin] = useState("");
  // Card
  const [cardNo, setCardNo] = useState("");
  const [exp, setExp] = useState("");
  const [cvv, setCvv] = useState("");
  const [holder, setHolder] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ref] = useState(() => `SPK-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);

  const active = METHODS.find((m) => m.id === method) ?? null;

  /* Every payment field is optional — an empty form pays and moves on. */
  const pay = () => {
    setErrors({});
    setStage("processing");
    setTick(0);
  };

  /* fake processing clock */
  useEffect(() => {
    if (stage !== "processing") return;
    if (tick >= STEPS.length) {
      const t = setTimeout(() => setStage("done"), 450);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setTick((n) => n + 1), 750);
    return () => clearTimeout(t);
  }, [stage, tick]);

  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(".pay-panel > *", {
        y: 24,
        autoAlpha: 0,
        duration: 0.55,
        stagger: 0.05,
        ease: "expo",
      });
    }, root);
    return () => ctx.revert();
  }, [stage, method]);

  /* ------------------------------------------------------------- done -- */
  if (stage === "done") {
    return (
      <PageShell>
        <div ref={root} className="shell pt-10">
          <div className="pay-panel mx-auto max-w-lg text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-[4px] border-blue-ink bg-yellow shadow-[6px_6px_0_var(--blue-ink)]">
              <svg viewBox="0 0 24 24" className="h-12 w-12 text-blue-ink" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>

            <h1 className="t-h1 mt-8">
              You&apos;re in{name ? `, ${name}` : ""}
            </h1>
            <p className="t-marker mt-3 text-[clamp(1.5rem,7vw,2.6rem)] text-white">
              <span className="slab">Follow ur Spark</span>
            </p>

            <div className="mt-8 rounded-[22px] border-[3px] border-blue-ink bg-white p-6 text-left shadow-[6px_6px_0_var(--blue-ink)]">
              <dl className="flex flex-col gap-3 text-blue-ink">
                {[
                  ["Reference", ref],
                  ["Paid", `৳ ${FEE.toLocaleString("en-US")}.00`],
                  ["Method", active?.name ?? "—"],
                  ["Status", "Application received"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4 border-b-2 border-blue-ink/10 pb-2 last:border-0 last:pb-0">
                    <dt className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-blue-ink/50">{k}</dt>
                    <dd className="font-mono text-[14px] font-bold">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <p className="t-body mt-6 text-[0.95rem]!">
              We&apos;ll verify your documents and text you when your Spark card
              is on its way.
            </p>

            <SecureNote className="mt-6" />

            <div className="mt-8 flex justify-center">
              <Button href="/" tone="yellow">
                Back to Spark
              </Button>
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  /* ------------------------------------------------------- processing -- */
  if (stage === "processing") {
    return (
      <PageShell>
        <div ref={root} className="shell pt-16">
          <div className="pay-panel mx-auto max-w-sm text-center">
            <div className="mx-auto h-16 w-16 animate-[spark-spin_1s_linear_infinite] rounded-full border-[5px] border-white/25 border-t-yellow" />
            <h1 className="t-h2 mt-8">Hold on…</h1>

            <ul className="mt-8 flex flex-col gap-3 text-left">
              {STEPS.map((s, i) => (
                <li
                  key={s}
                  className={`flex items-center gap-3 rounded-2xl border-[3px] border-blue-ink px-4 py-3 transition-colors duration-300 ${
                    i < tick ? "bg-white text-blue-ink" : "bg-white/10 text-white/70"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-blue-ink ${
                      i < tick ? "bg-yellow" : "bg-white/20"
                    }`}
                  >
                    {i < tick && (
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-blue-ink" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    )}
                  </span>
                  <span className="text-[14px] font-bold">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PageShell>
    );
  }

  /* ----------------------------------------------------------- choose -- */
  return (
    <PageShell back={{ href: "/apply", label: "Back to application" }}>
      <div ref={root} className="shell pt-4">
        <div className="pay-panel mx-auto max-w-lg">
          <div className="text-center">
            <span className="t-label">Payment</span>
            <h1 className="t-h1 mt-3">Card issuance fee</h1>
            <p className="font-display mt-4 text-[clamp(2.8rem,14vw,4.5rem)] font-extrabold leading-none tracking-tighter text-yellow">
              ৳ {FEE.toLocaleString("en-US")}
              <span className="text-[0.45em] text-white/60">.00</span>
            </p>
            <p className="t-body mt-3 text-[0.95rem]!">
              One-time, includes delivery{name ? `, ${name}` : ""}.
            </p>
          </div>

          <SecureNote className="mt-7" />

          {/* method picker */}
          <p className="t-label mt-8 mb-3">Pay with</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {METHODS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setMethod(m.id);
                  setErrors({});
                }}
                aria-pressed={method === m.id}
                className={`flex min-h-[74px] flex-col items-center justify-center gap-1.5 rounded-2xl border-[3px] border-blue-ink px-2 py-3 transition-transform duration-150 active:translate-x-[2px] active:translate-y-[2px] ${
                  method === m.id
                    ? "shadow-[2px_2px_0_var(--blue-ink)] ring-[3px] ring-yellow ring-offset-2 ring-offset-transparent"
                    : "shadow-[4px_4px_0_var(--blue-ink)]"
                }`}
                style={{ background: m.brand, color: m.ink }}
              >
                {m.kind === "card" ? (
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="2.5" y="5" width="19" height="14" rx="3" />
                    <path d="M2.5 9.5h19" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="6" y="2" width="12" height="20" rx="3" />
                    <path d="M11 18.5h2" />
                  </svg>
                )}
                <span className="text-[13px] font-extrabold tracking-tight">{m.name}</span>
              </button>
            ))}
          </div>

          {/* method form */}
          {active && (
            <div className="mt-7 flex flex-col gap-5">
              {active.kind === "mfs" ? (
                <>
                  <Field
                    label={`${active.name} account number`}
                    inputMode="tel"
                    prefix="+880"
                    value={mfsNumber}
                    onChange={setMfsNumber}
                    error={errors.mfsNumber}
                    placeholder="1712 345678"
                  />
                  <Field
                    label="PIN"
                    type="password"
                    inputMode="numeric"
                    value={mfsPin}
                    onChange={(v) => setMfsPin(v.replace(/\D/g, "").slice(0, 5))}
                    error={errors.mfsPin}
                    placeholder="••••"
                    hint="4 or 5 digits"
                  />
                </>
              ) : (
                <>
                  <Field
                    label="Card number"
                    inputMode="numeric"
                    value={cardNo}
                    onChange={(v) => setCardNo(groupCard(v))}
                    error={errors.cardNo}
                    placeholder="4242 4242 4242 4242"
                    hint="16 digits, front of the card"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Field
                      label="Expiry"
                      inputMode="numeric"
                      value={exp}
                      onChange={(v) => setExp(groupExpiry(v))}
                      error={errors.exp}
                      placeholder="09/28"
                    />
                    <Field
                      label="CVV"
                      type="password"
                      inputMode="numeric"
                      value={cvv}
                      onChange={(v) => setCvv(v.replace(/\D/g, "").slice(0, 4))}
                      error={errors.cvv}
                      placeholder="•••"
                    />
                  </div>
                  <Field
                    label="Name on card"
                    value={holder}
                    onChange={setHolder}
                    error={errors.holder}
                    placeholder="WASIF RAHMAN"
                  />
                </>
              )}

              <div className="mt-2 flex justify-center">
                <Button onClick={pay} tone="yellow">
                  Pay ৳ {FEE.toLocaleString("en-US")} →
                </Button>
              </div>
            </div>
          )}

          {!active && (
            <p className="mt-7 text-center text-[13px] text-white/55">
              Choose a payment method to continue.
            </p>
          )}

          <p className="mt-8 text-center text-[12px] text-white/45">
            Trouble paying?{" "}
            <Link href="/apply" className="font-bold text-yellow underline underline-offset-2">
              Go back and check your details
            </Link>
          </p>
        </div>
      </div>
    </PageShell>
  );
}
