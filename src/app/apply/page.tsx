"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { gsap, useIsoLayoutEffect, prefersReducedMotion } from "@/lib/gsap";
import PageShell, { Progress } from "@/components/form/PageShell";
import Field from "@/components/form/Field";
import Upload, { type Doc } from "@/components/form/Upload";
import Button from "@/components/ui/Button";
import SparkCard, { CARD_RATIO } from "@/components/visuals/SparkCard";
import { DESIGNS } from "@/components/visuals/designs";

const PROFESSIONS = [
  "Student",
  "Salaried employee",
  "Business owner",
  "Freelancer",
  "Homemaker",
  "Other",
];

type Details = {
  name: string;
  email: string;
  mobile: string;
  profession: string;
  age: string;
  income: string;
};

type Docs = {
  nid: Doc | null;
  photo: Doc | null;
  orgId: Doc | null;
  nomineeNid: Doc | null;
  nomineePhoto: Doc | null;
};

const EMPTY_DETAILS: Details = {
  name: "",
  email: "",
  mobile: "",
  profession: "",
  age: "",
  income: "",
};

const EMPTY_DOCS: Docs = {
  nid: null,
  photo: null,
  orgId: null,
  nomineeNid: null,
  nomineePhoto: null,
};

/* Every field is optional — an empty form submits and moves on.
   The error plumbing below is left wired up so restoring a rule is a matter of
   filling one of these functions back in, nothing more. */
function validateDetails(): Partial<Record<keyof Details, string>> {
  return {};
}

function validateDocs(): Partial<Record<keyof Docs, string>> {
  return {};
}

export default function ApplyPage() {
  const router = useRouter();
  const root = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState(1);
  const [details, setDetails] = useState<Details>(EMPTY_DETAILS);
  const [docs, setDocs] = useState<Docs>(EMPTY_DOCS);
  const [errD, setErrD] = useState<Partial<Record<keyof Details, string>>>({});
  const [errF, setErrF] = useState<Partial<Record<keyof Docs, string>>>({});
  const [design, setDesign] = useState(0);
  const [busy, setBusy] = useState(false);

  const set = useCallback(
    <K extends keyof Details>(k: K) =>
      (v: string) => {
        setDetails((p) => ({ ...p, [k]: v }));
        setErrD((p) => (p[k] ? { ...p, [k]: undefined } : p));
      },
    []
  );

  const setDoc = useCallback(
    <K extends keyof Docs>(k: K) =>
      (v: Doc | null) => {
        setDocs((p) => ({ ...p, [k]: v }));
        setErrF((p) => (p[k] ? { ...p, [k]: undefined } : p));
      },
    []
  );

  /* step transition */
  useIsoLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(".ap-panel > *", {
        y: 26,
        autoAlpha: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: "expo",
      });
    }, root);
    return () => ctx.revert();
  }, [step]);

  const goToDocs = () => {
    const e = validateDetails();
    setErrD(e);
    if (Object.keys(e).length) {
      // Send focus to the problem rather than leaving the visitor to hunt.
      root.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = () => {
    const e = validateDocs();
    setErrF(e);
    if (Object.keys(e).length) return;

    setBusy(true);
    // Nothing is uploaded — the files stay in memory and are dropped here.
    // Only the applicant's first name and chosen design travel onward, so the
    // payment screen can address them.
    try {
      sessionStorage.setItem(
        "spark:applicant",
        JSON.stringify({ name: details.name.trim().split(/\s+/)[0], design })
      );
    } catch {
      /* private mode — the payment page falls back to a generic greeting */
    }
    setTimeout(() => router.push("/pay"), 700);
  };

  return (
    <PageShell step={step} totalSteps={2} back={step === 1 ? { href: "/", label: "Back to Spark" } : undefined}>
      <div ref={root} className="shell pt-4">
        <div className="mx-auto max-w-5xl">
          {/* ---------------------------------------------------- heading -- */}
          <div className="text-center">
            <span className="t-label">Application</span>
            <h1 className="t-h1 mt-3">
              Get your
              <br />
              <span className="t-marker text-yellow">Spark</span>
            </h1>
            <p className="t-body mx-auto mt-4 max-w-[36ch]">
              {step === 1
                ? "Six quick details. No branch visit, and no existing Dhaka Bank account needed."
                : "Just three documents — photograph them on your phone."}
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-md">
            <Progress step={step} total={2} />
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-14">
            {/* -------------------------------------------------- form -- */}
            <div className="ap-panel order-2 lg:order-1">
              {step === 1 ? (
                <div className="flex flex-col gap-5">
                  <Field
                    label="Full name"
                    value={details.name}
                    onChange={set("name")}
                    error={errD.name}
                    placeholder="As printed on your NID"
                    autoComplete="name"
                  />
                  <Field
                    label="Email"
                    type="email"
                    inputMode="email"
                    value={details.email}
                    onChange={set("email")}
                    error={errD.email}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                  <Field
                    label="Mobile number"
                    inputMode="tel"
                    prefix="+880"
                    value={details.mobile}
                    onChange={set("mobile")}
                    error={errD.mobile}
                    placeholder="1712 345678"
                    autoComplete="tel-national"
                  />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label="Profession"
                      value={details.profession}
                      onChange={set("profession")}
                      error={errD.profession}
                      options={PROFESSIONS}
                    />
                    <Field
                      label="Age"
                      inputMode="numeric"
                      value={details.age}
                      onChange={set("age")}
                      error={errD.age}
                      placeholder="21"
                      hint="18 or over"
                    />
                  </div>
                  <Field
                    label="Monthly income"
                    inputMode="numeric"
                    prefix="৳"
                    value={details.income}
                    onChange={set("income")}
                    error={errD.income}
                    placeholder="25,000"
                  />

                  <div className="mt-3 flex flex-wrap gap-3">
                    <Button onClick={goToDocs} tone="yellow">
                      Continue →
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  <Upload
                    label="NID"
                    hint="Both sides"
                    value={docs.nid}
                    onChange={setDoc("nid")}
                    error={errF.nid}
                  />
                  <Upload
                    label="Passport-size photo"
                    hint="Plain background"
                    value={docs.photo}
                    onChange={setDoc("photo")}
                    error={errF.photo}
                  />
                  <Upload
                    label="University ID / Employee ID"
                    value={docs.orgId}
                    onChange={setDoc("orgId")}
                    error={errF.orgId}
                  />

                  <div className="mt-2 flex items-center gap-3">
                    <span className="h-[3px] flex-1 bg-white/20" />
                    <span className="t-label text-[10px]!">Nominee — optional</span>
                    <span className="h-[3px] flex-1 bg-white/20" />
                  </div>

                  <Upload
                    label="Nominee NID"
                    value={docs.nomineeNid}
                    onChange={setDoc("nomineeNid")}
                    required={false}
                  />
                  <Upload
                    label="Nominee photo"
                    value={docs.nomineePhoto}
                    onChange={setDoc("nomineePhoto")}
                    required={false}
                  />

                  <div className="mt-1 flex flex-wrap gap-3">
                    <Button onClick={submit} tone="pink" magnetic={!busy}>
                      {busy ? "Submitting…" : "Submit & pay →"}
                    </Button>
                    <Button onClick={() => setStep(1)} tone="outline" magnetic={false}>
                      Back
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* ------------------------------------------- card preview -- */}
            <aside className="order-1 lg:order-2 lg:sticky lg:top-6">
              <p className="t-label mb-3 text-center lg:text-left">Your card</p>
              <div className="mx-auto w-full max-w-[190px] sm:max-w-[220px]">
                <SparkCard
                  design={DESIGNS[design]}
                  face="front"
                  name={details.name}
                />
              </div>

              <div className="mx-auto mt-5 grid max-w-[300px] grid-cols-6 gap-2">
                {DESIGNS.map((d, i) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDesign(i)}
                    aria-label={d.name}
                    aria-pressed={i === design}
                    className={`relative overflow-hidden rounded-lg transition-transform active:scale-95 ${
                      i === design ? "ring-[3px] ring-yellow ring-offset-2 ring-offset-transparent" : "ring-1 ring-white/35"
                    }`}
                    style={{ aspectRatio: CARD_RATIO, background: d.fallback }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={d.image}
                      alt=""
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                      className="absolute inset-0 h-full w-full object-cover"
                      draggable={false}
                    />
                  </button>
                ))}
              </div>

              <p className="mt-4 text-center text-[12px] text-white/55 lg:text-left">
                Type your name and it prints onto the card. Pick a design — you
                can change it before the card is issued.
              </p>
            </aside>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
