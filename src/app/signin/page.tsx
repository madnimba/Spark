"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { gsap, useIsoLayoutEffect, prefersReducedMotion } from "@/lib/gsap";
import { signIn, formatPhone } from "@/lib/session";
import PageShell from "@/components/form/PageShell";
import Field from "@/components/form/Field";
import Button from "@/components/ui/Button";

const OTP_LEN = 6;
const RESEND_SECONDS = 30;

export default function SignInPage() {
  const router = useRouter();
  const root = useRef<HTMLDivElement>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [stage, setStage] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [digits, setDigits] = useState<string[]>(Array(OTP_LEN).fill(""));
  const [err, setErr] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [left, setLeft] = useState(0);

  /* resend clock */
  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(".si-panel > *", {
        y: 26,
        autoAlpha: 0,
        duration: 0.6,
        stagger: 0.06,
        ease: "expo",
      });
    }, root);
    return () => ctx.revert();
  }, [stage]);

  const sendOtp = () => {
    // No length or operator-prefix rule — any number is accepted, it just has
    // to be there.
    if (!phone.replace(/\D/g, "")) {
      setErr("Enter your mobile number.");
      return;
    }
    setErr(undefined);
    setStage("otp");
    setLeft(RESEND_SECONDS);
    setTimeout(() => otpRefs.current[0]?.focus(), 120);
  };

  const setDigit = useCallback((i: number, v: string) => {
    const clean = v.replace(/\D/g, "");
    setErr(undefined);

    // Pasting the whole code into any box should fill the row.
    if (clean.length > 1) {
      const next = clean.slice(0, OTP_LEN).split("");
      setDigits((p) => {
        const out = [...p];
        for (let k = 0; k < OTP_LEN; k++) if (next[k] !== undefined) out[k] = next[k];
        return out;
      });
      otpRefs.current[Math.min(OTP_LEN - 1, clean.length)]?.focus();
      return;
    }

    setDigits((p) => {
      const out = [...p];
      out[i] = clean;
      return out;
    });
    if (clean && i < OTP_LEN - 1) otpRefs.current[i + 1]?.focus();
  }, []);

  const onKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) otpRefs.current[i - 1]?.focus();
    if (e.key === "ArrowLeft" && i > 0) otpRefs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < OTP_LEN - 1) otpRefs.current[i + 1]?.focus();
  };

  const verify = () => {
    const code = digits.join("");
    if (code.length < OTP_LEN) {
      setErr(`Enter all ${OTP_LEN} digits.`);
      return;
    }
    // Prototype: any code of the right length is accepted.
    setBusy(true);
    signIn(phone.replace(/\D/g, ""));
    setTimeout(() => router.push("/account"), 550);
  };

  return (
    <PageShell back={{ href: "/", label: "Back to Spark" }}>
      <div ref={root} className="shell pt-4">
        <div className="si-panel mx-auto max-w-md">
          <div className="text-center">
            <span className="t-label">{stage === "phone" ? "Sign in or sign up" : "Verify"}</span>
            <h1 className="t-h1 mt-3">
              {stage === "phone" ? (
                <>
                  Your
                  <br />
                  <span className="t-marker text-yellow">Spark account</span>
                </>
              ) : (
                <>
                  Check your
                  <br />
                  <span className="t-marker text-yellow">messages</span>
                </>
              )}
            </h1>
            <p className="t-body mx-auto mt-4 max-w-[32ch]">
              {stage === "phone"
                ? "One number, no password. We'll text you a code — new here or not, this is the way in."
                : `We sent a ${OTP_LEN}-digit code to ${formatPhone(phone)}.`}
            </p>
          </div>

          {stage === "phone" ? (
            <div className="mt-9 flex flex-col gap-5">
              <Field
                label="Mobile number"
                inputMode="tel"
                prefix="+880"
                value={phone}
                onChange={(v) => {
                  setPhone(v);
                  setErr(undefined);
                }}
                error={err}
                placeholder="1712 345678"
                autoComplete="tel-national"
              />

              <div className="flex justify-center">
                <Button onClick={sendOtp} tone="yellow">
                  Send code →
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-9 flex flex-col gap-5">
              <div>
                <p className="mb-3 text-center text-[11px] font-extrabold uppercase tracking-[0.14em] text-white">
                  Enter the code
                </p>

                <div className="flex justify-center gap-2 sm:gap-2.5" role="group" aria-label="One-time code">
                  {digits.map((d, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        otpRefs.current[i] = el;
                      }}
                      value={d}
                      onChange={(e) => setDigit(i, e.target.value)}
                      onKeyDown={(e) => onKey(i, e)}
                      inputMode="numeric"
                      autoComplete={i === 0 ? "one-time-code" : "off"}
                      maxLength={OTP_LEN}
                      aria-label={`Digit ${i + 1}`}
                      aria-invalid={!!err}
                      className="h-14 w-11 rounded-2xl border-[3px] border-blue-ink bg-white text-center text-[22px] font-extrabold text-blue-ink shadow-[4px_4px_0_var(--blue-ink)] outline-none focus:shadow-[6px_6px_0_var(--blue-ink)] sm:w-12"
                    />
                  ))}
                </div>

                {err && (
                  <p role="alert" className="mt-3 text-center text-[12px] font-bold text-yellow">
                    {err}
                  </p>
                )}
              </div>

              <p className="text-center text-[12.5px] text-white/60">
                {left > 0 ? (
                  <>
                    Resend in <span className="font-bold tabular-nums text-white">{left}s</span>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setLeft(RESEND_SECONDS);
                      setDigits(Array(OTP_LEN).fill(""));
                      otpRefs.current[0]?.focus();
                    }}
                    className="font-bold text-yellow underline underline-offset-2"
                  >
                    Send a new code
                  </button>
                )}
              </p>

              <div className="flex flex-wrap justify-center gap-3">
                <Button onClick={verify} tone="yellow" magnetic={!busy}>
                  {busy ? "Signing in…" : "Log in →"}
                </Button>
                <Button
                  onClick={() => {
                    setStage("phone");
                    setDigits(Array(OTP_LEN).fill(""));
                    setErr(undefined);
                  }}
                  tone="outline"
                  magnetic={false}
                >
                  Change number
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
