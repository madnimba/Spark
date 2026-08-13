"use client";

import Magnetic from "./Magnetic";

type Tone = "yellow" | "pink" | "white" | "outline";

const TONES: Record<Tone, string> = {
  yellow: "bg-yellow text-blue-ink border-blue-ink",
  pink: "bg-pink text-white border-blue-ink",
  white: "bg-white text-blue-ink border-blue-ink",
  outline: "bg-transparent text-white border-white",
};

/**
 * Chunky pop-art button. The offset shadow collapses on press, which reads as
 * a physical push — and because it's driven by :active it fires instantly on
 * touch, with none of the delay a JS handler would add.
 */
export default function Button({
  children,
  href,
  onClick,
  tone = "yellow",
  className = "",
  icon,
  magnetic = true,
  ...rest
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  tone?: Tone;
  className?: string;
  icon?: React.ReactNode;
  magnetic?: boolean;
} & React.HTMLAttributes<HTMLElement>) {
  const cls = [
    // min-height keeps every control at a comfortable thumb target
    "group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border-[3px] px-6 py-3",
    "text-[15px] font-extrabold uppercase tracking-tight",
    "shadow-[4px_4px_0_var(--blue-ink)]",
    "transition-[transform,box-shadow] duration-150 ease-out",
    "hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--blue-ink)]",
    "active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0_var(--blue-ink)]",
    TONES[tone],
    className,
  ].join(" ");

  const inner = (
    <>
      {children}
      {icon}
    </>
  );

  const node = href ? (
    <a href={href} className={cls} data-cursor="link" {...rest}>
      {inner}
    </a>
  ) : (
    <button onClick={onClick} className={cls} data-cursor="link" {...rest}>
      {inner}
    </button>
  );

  return magnetic ? <Magnetic strength={0.22}>{node}</Magnetic> : node;
}
