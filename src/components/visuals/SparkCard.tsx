"use client";

import { useState } from "react";
import type { Design } from "./designs";

/**
 * A single card face.
 *
 * The front is supplied artwork — a complete vertical face with chip,
 * contactless mark, Spark lockup and Mastercard already drawn in — so nothing
 * is overlaid on it beyond the holder's name. The back is generated to match.
 *
 * All type is sized in `cqw` (percent of the card's own width) against a
 * declared container, so one component renders correctly as a 40px picker
 * thumbnail and as a 340px hero card with no breakpoints.
 */

/** Vertical card, matching the supplied artwork (1290 × 2048). */
export const CARD_RATIO = "1290 / 2048";

function Mastercard({ size = "22cqw" }: { size?: string }) {
  return (
    <svg viewBox="0 0 48 30" style={{ width: size, height: "auto" }} aria-label="Mastercard" role="img">
      <circle cx="18" cy="15" r="14" fill="#EB001B" />
      <circle cx="30" cy="15" r="14" fill="#F79E1B" />
      <path d="M24 4.4a13.96 13.96 0 0 0 0 21.2 13.96 13.96 0 0 0 0-21.2Z" fill="#FF5F00" />
    </svg>
  );
}

function SparkLockup({ color }: { color: string }) {
  return (
    <span className="inline-flex items-end" style={{ gap: "1.6cqw" }}>
      <svg viewBox="0 0 40 64" style={{ height: "11cqw", width: "auto" }} aria-hidden>
        <path d="M24 0 2 36h13L14 64 38 26H24l6-26Z" fill={color} />
      </svg>
      <span className="flex flex-col leading-none" style={{ color }}>
        <span style={{ fontSize: "9.5cqw", fontWeight: 800, letterSpacing: "-0.035em" }}>Spark</span>
        <span style={{ fontSize: "5.4cqw", fontWeight: 500, letterSpacing: "0.01em", marginTop: "0.6cqw" }}>
          prepaid
        </span>
      </span>
    </span>
  );
}

export default function SparkCard({
  design,
  face = "front",
  name = "",
  className = "",
}: {
  design: Design;
  face?: "front" | "back";
  /** Printed small along the bottom of the front, if supplied. */
  name?: string;
  className?: string;
}) {
  // The artwork may not be in /public yet. Until it loads, the design's own
  // fallback gradient stands in, so nothing ever renders as a broken image.
  const [artOk, setArtOk] = useState(true);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        containerType: "inline-size",
        aspectRatio: CARD_RATIO,
        borderRadius: "7cqw",
        background: design.fallback,
        boxShadow: "0 3cqw 9cqw rgba(4,31,92,0.45), inset 0 0 0 0.4cqw rgba(255,255,255,0.18)",
      }}
    >
      {face === "front" ? (
        <>
          {artOk && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={design.image}
              alt=""
              onError={() => setArtOk(false)}
              className="absolute inset-0 h-full w-full object-cover"
              draggable={false}
            />
          )}

          {/* The artwork carries every mark already; only the holder's name is
              added, and only once they've typed one. */}
          {name.trim() && (
            <p
              className="absolute"
              style={{
                left: "9cqw",
                bottom: "3.5cqw",
                color: "#ffffff",
                fontSize: "4cqw",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                textShadow: "0 0.4cqw 1.6cqw rgba(0,0,0,0.45)",
              }}
            >
              {name.trim()}
            </p>
          )}

          <div className="pointer-events-none absolute inset-0 [background:linear-gradient(118deg,transparent_38%,rgba(255,255,255,0.14)_47%,transparent_57%)]" />
        </>
      ) : (
        <div
          className="relative flex h-full flex-col"
          style={{ background: design.back }}
        >
          {/* magstripe */}
          <div style={{ marginTop: "11cqw", height: "17cqw", background: "rgba(0,0,0,0.82)" }} />

          {/* signature panel + CVV */}
          <div style={{ paddingInline: "9cqw", marginTop: "7cqw" }}>
            <div className="flex items-center" style={{ gap: "3cqw" }}>
              <div
                className="flex-1"
                style={{ height: "11cqw", borderRadius: "1.6cqw", background: "rgba(255,255,255,0.92)" }}
              />
              <div
                className="flex items-center justify-center"
                style={{
                  height: "11cqw",
                  paddingInline: "4cqw",
                  borderRadius: "1.6cqw",
                  background: "rgba(255,255,255,0.92)",
                  color: "#0b1b3a",
                  fontFamily: "var(--font-mono)",
                  fontSize: "4.4cqw",
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                }}
              >
                •••
              </div>
            </div>

            <p
              style={{
                color: design.inkSoft,
                fontFamily: "var(--font-mono)",
                fontSize: "3.1cqw",
                lineHeight: 1.7,
                letterSpacing: "0.05em",
                marginTop: "5cqw",
              }}
            >
              ACTIVATE AND SET YOUR PIN IN THE GO PLUS APP. RELOAD VIA GO PLUS,
              BEFTN, ANY BRANCH OR A CRM. PREPAID · DUAL CURRENCY.
            </p>

            <p
              style={{
                color: design.inkSoft,
                fontFamily: "var(--font-mono)",
                fontSize: "3.1cqw",
                letterSpacing: "0.16em",
                marginTop: "4cqw",
              }}
            >
              LOST OR STOLEN · 16474
            </p>
          </div>

          <div
            className="mt-auto flex items-end justify-between"
            style={{ padding: "9cqw" }}
          >
            <SparkLockup color={design.bolt} />
            <Mastercard size="20cqw" />
          </div>

          <div className="pointer-events-none absolute inset-0 [background:linear-gradient(118deg,transparent_40%,rgba(255,255,255,0.1)_48%,transparent_58%)]" />
        </div>
      )}
    </div>
  );
}
