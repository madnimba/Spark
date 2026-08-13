"use client";

import type { Design } from "./designs";

/**
 * A single card face.
 *
 * All type is sized in `cqw` (percent of the card's own width) with the root
 * declared as a container. That means one component renders correctly as a
 * 40px picker thumbnail and as a 600px hero card with no breakpoints — which
 * matters here because the same card appears at wildly different sizes.
 */

function Chip({ tone }: { tone: "gold" | "steel" }) {
  const bg =
    tone === "gold"
      ? "linear-gradient(135deg,#f7dc9a,#c9a24d 45%,#fbeec2 70%,#b8902f)"
      : "linear-gradient(135deg,#e8eef7,#9dabbd 45%,#f2f6fb 70%,#8593a6)";
  return (
    <div
      className="relative overflow-hidden rounded-[1.2cqw]"
      style={{ width: "13cqw", height: "9.6cqw", background: bg }}
    >
      <div className="absolute inset-0 [background-image:linear-gradient(90deg,rgba(0,0,0,0.3)_1px,transparent_1px),linear-gradient(rgba(0,0,0,0.3)_1px,transparent_1px)] [background-size:33%_50%]" />
    </div>
  );
}

function Contactless({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" style={{ width: "7cqw", height: "7cqw" }} fill="none" aria-hidden>
      <path
        d="M7 8a7 7 0 0 1 0 8M11 5.5a11 11 0 0 1 0 13M15 3a15 15 0 0 1 0 18"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Mastercard's interlocking discs. Spark runs on the Mastercard network. */
function Mastercard() {
  return (
    <span className="inline-flex flex-col items-end" style={{ gap: "0.8cqw" }}>
      <svg
        viewBox="0 0 48 30"
        style={{ width: "17cqw", height: "auto" }}
        aria-label="Mastercard"
        role="img"
      >
        <circle cx="18" cy="15" r="14" fill="#EB001B" />
        <circle cx="30" cy="15" r="14" fill="#F79E1B" />
        <path
          d="M24 4.4a13.96 13.96 0 0 0 0 21.2 13.96 13.96 0 0 0 0-21.2Z"
          fill="#FF5F00"
        />
      </svg>
    </span>
  );
}

function SparkMark({ color, scale = 1 }: { color: string; scale?: number }) {
  return (
    <span className="inline-flex items-center" style={{ gap: "1.2cqw" }}>
      <svg viewBox="0 0 40 64" style={{ height: `${7 * scale}cqw`, width: "auto" }} aria-hidden>
        <path d="M24 0 2 36h13L14 64 38 26H24l6-26Z" fill={color} />
      </svg>
      <span
        style={{
          color,
          fontSize: `${6.6 * scale}cqw`,
          fontWeight: 800,
          letterSpacing: "-0.03em",
          lineHeight: 1,
        }}
      >
        Spark
      </span>
    </span>
  );
}

export default function SparkCard({
  design,
  face = "front",
  name = "YOUR NAME",
  className = "",
}: {
  design: Design;
  face?: "front" | "back";
  name?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[4.2cqw] ${className}`}
      style={{
        containerType: "inline-size",
        aspectRatio: "1.586 / 1",
        background: design.bg,
        boxShadow:
          "0 2cqw 6cqw rgba(4,31,92,0.45), inset 0 0 0 0.35cqw rgba(255,255,255,0.16)",
      }}
    >
      {/* design art */}
      <div className="pointer-events-none absolute inset-0">{design.art}</div>

      {/* sheen */}
      <div className="pointer-events-none absolute inset-0 [background:linear-gradient(118deg,transparent_36%,rgba(255,255,255,0.16)_47%,transparent_58%)]" />

      {face === "front" ? (
        <div
          className="relative flex h-full flex-col justify-between"
          style={{ padding: "6.5cqw" }}
        >
          <div className="flex items-start justify-between">
            <span
              style={{
                color: design.ink,
                fontSize: "3.5cqw",
                fontWeight: 800,
                letterSpacing: "0.02em",
                lineHeight: 1.1,
              }}
            >
              DHAKA BANK
              <span style={{ display: "block", fontSize: "2.1cqw", opacity: 0.65, letterSpacing: "0.16em" }}>
                PLC.
              </span>
            </span>
            <SparkMark color={design.bolt} />
          </div>

          <div className="flex items-end" style={{ gap: "4cqw" }}>
            <Chip tone={design.chip} />
            <Contactless color={design.inkSoft} />
          </div>

          <div>
            <p
              style={{
                color: design.ink,
                fontFamily: "var(--font-mono)",
                fontSize: "6.4cqw",
                letterSpacing: "0.11em",
                lineHeight: 1,
              }}
            >
              •••• •••• •••• 8421
            </p>

            <div className="flex items-end justify-between" style={{ marginTop: "4.4cqw" }}>
              <div>
                <p
                  style={{
                    color: design.inkSoft,
                    fontFamily: "var(--font-mono)",
                    fontSize: "2.1cqw",
                    letterSpacing: "0.2em",
                  }}
                >
                  CARDHOLDER
                </p>
                <p
                  style={{
                    color: design.ink,
                    fontSize: "3.5cqw",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    marginTop: "0.8cqw",
                    textTransform: "uppercase",
                  }}
                >
                  {name}
                </p>
              </div>

              <div className="flex flex-col items-end">
                <p
                  style={{
                    color: design.inkSoft,
                    fontFamily: "var(--font-mono)",
                    fontSize: "2.1cqw",
                    letterSpacing: "0.2em",
                    marginBottom: "1cqw",
                  }}
                >
                  DUAL CURRENCY
                </p>
                <Mastercard />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative flex h-full flex-col justify-between">
          <div style={{ height: "14cqw", marginTop: "7cqw", background: "rgba(0,0,0,0.82)" }} />

          <div style={{ paddingInline: "6.5cqw" }}>
            <div className="flex items-center" style={{ gap: "2.5cqw" }}>
              <div
                className="flex-1"
                style={{ height: "8.5cqw", borderRadius: "1cqw", background: "rgba(255,255,255,0.9)" }}
              />
              <div
                className="flex items-center justify-center"
                style={{
                  height: "8.5cqw",
                  paddingInline: "3cqw",
                  borderRadius: "1cqw",
                  background: "rgba(255,255,255,0.9)",
                  color: "#041f5c",
                  fontFamily: "var(--font-mono)",
                  fontSize: "3.4cqw",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                }}
              >
                •••
              </div>
            </div>

            <p
              style={{
                color: design.inkSoft,
                fontFamily: "var(--font-mono)",
                fontSize: "2.15cqw",
                lineHeight: 1.65,
                letterSpacing: "0.06em",
                marginTop: "3.5cqw",
              }}
            >
              ACTIVATE AND SET YOUR PIN DIGITALLY. RELOAD VIA THE GO PLUS APP,
              BEFTN, ANY BRANCH OR A CRM. DUAL CURRENCY, HOME AND AWAY.
            </p>
          </div>

          <div
            className="flex items-end justify-between"
            style={{ padding: "6.5cqw" }}
          >
            <p
              style={{
                color: design.inkSoft,
                fontFamily: "var(--font-mono)",
                fontSize: "2.4cqw",
                letterSpacing: "0.18em",
              }}
            >
              24/7 · 16474
            </p>
            <SparkMark color={design.bolt} scale={0.82} />
          </div>
        </div>
      )}
    </div>
  );
}
