"use client";

import Link from "next/link";
import Atmosphere from "../core/Atmosphere";
import Cursor from "../core/Cursor";
import Logo, { BankMark } from "../core/Logo";

/**
 * Chrome shared by the apply and payment routes. Deliberately lighter than the
 * landing page's nav: once someone is filling in a form, every extra control is
 * a way to lose them.
 */
export default function PageShell({
  children,
  step,
  totalSteps,
  back,
}: {
  children: React.ReactNode;
  step?: number;
  totalSteps?: number;
  back?: { href: string; label: string };
}) {
  return (
    <>
      <Atmosphere />
      <Cursor />

      <header className="relative z-20">
        <div className="shell flex items-center justify-between gap-4 py-4">
          <Link href="/" aria-label="Spark — home" className="flex items-center gap-3">
            <Logo className="h-6 text-white sm:h-7" />
            <span className="hidden h-5 w-px bg-white/30 sm:block" />
            <BankMark className="hidden text-[11px] text-white/75 sm:flex" />
          </Link>

          {typeof step === "number" && typeof totalSteps === "number" && (
            <p className="font-mono text-[11px] font-bold tracking-[0.16em] text-white/70">
              STEP {step}
              <span className="text-white/35"> / {totalSteps}</span>
            </p>
          )}
        </div>
      </header>

      <main className="relative z-10 pb-20">
        {back && (
          <div className="shell">
            <Link
              href={back.href}
              className="inline-flex items-center gap-2 py-2 text-[13px] font-bold uppercase tracking-tight text-white/70 transition-colors hover:text-yellow"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              {back.label}
            </Link>
          </div>
        )}
        {children}
      </main>
    </>
  );
}

/** Chunky segmented progress bar. */
export function Progress({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex gap-2" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={total}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-2.5 flex-1 rounded-full border-2 border-blue-ink transition-colors duration-500 ${
            i < step ? "bg-yellow" : "bg-white/15"
          }`}
        />
      ))}
    </div>
  );
}

/**
 * Reassurance strip used beside the payment controls. Says something true and
 * useful about the transaction rather than about the build.
 */
export function SecureNote({ className = "" }: { className?: string }) {
  return (
    <p
      className={`flex items-center justify-center gap-2 text-[12px] font-bold text-white/60 ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="4.5" y="10" width="15" height="11" rx="3" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </svg>
      Secured by Dhaka Bank PLC
    </p>
  );
}
