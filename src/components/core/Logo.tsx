"use client";

/**
 * Spark lockup — bolt glyph plus wordmark, matching the campaign key visual.
 * Placeholder art: swap for the official Spark / Dhaka Bank vectors on launch.
 */
export default function Logo({
  className = "h-7",
  showWordmark = true,
  color = "currentColor",
}: {
  className?: string;
  showWordmark?: boolean;
  color?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <svg viewBox="0 0 40 64" className="h-full w-auto shrink-0" aria-hidden>
        <path d="M24 0 2 36h13L14 64 38 26H24l6-26Z" fill={color} />
      </svg>
      {showWordmark && (
        <span
          className="font-display text-[1.05em] font-extrabold tracking-[-0.04em]"
          style={{ color }}
        >
          Spark
        </span>
      )}
    </span>
  );
}

/** The issuing bank's mark, used small and in the footer. */
export function BankMark({ className = "", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <span className={`inline-flex flex-col leading-none ${className}`} style={{ color }}>
      <span className="text-[0.95em] font-extrabold tracking-[-0.02em]">DHAKA BANK</span>
      <span className="text-[0.5em] font-bold tracking-[0.32em] opacity-70">PLC.</span>
    </span>
  );
}
