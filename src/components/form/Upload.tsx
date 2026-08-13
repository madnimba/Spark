"use client";

import { useId, useRef, useState, useCallback } from "react";

const MAX_MB = 5;
const ACCEPT = "image/jpeg,image/png,image/webp,application/pdf";

export type Doc = { name: string; size: number; preview?: string };

/**
 * Document drop zone.
 *
 * Files are held in component state and never uploaded — this is a prototype,
 * so nothing leaves the browser. Object URLs for the thumbnail are revoked when
 * replaced or cleared, otherwise picking a few large photos leaks memory for
 * the life of the tab.
 */
export default function Upload({
  label,
  hint,
  value,
  onChange,
  error,
  required = true,
}: {
  label: string;
  hint?: string;
  value: Doc | null;
  onChange: (d: Doc | null) => void;
  error?: string;
  required?: boolean;
}) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [local, setLocal] = useState<string | null>(null);

  const accept = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      if (file.size > MAX_MB * 1024 * 1024) {
        setLocal(`That file is ${(file.size / 1024 / 1024).toFixed(1)}MB — keep it under ${MAX_MB}MB.`);
        return;
      }
      if (!ACCEPT.split(",").includes(file.type)) {
        setLocal("Use a JPG, PNG, WEBP or PDF.");
        return;
      }
      setLocal(null);
      if (value?.preview) URL.revokeObjectURL(value.preview);
      onChange({
        name: file.name,
        size: file.size,
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
      });
    },
    [onChange, value]
  );

  const clear = () => {
    if (value?.preview) URL.revokeObjectURL(value.preview);
    onChange(null);
    setLocal(null);
    if (input.current) input.current.value = "";
  };

  const msg = local ?? error;
  const filled = !!value;

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label
          htmlFor={id}
          className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-white"
        >
          {label}
          {!required && <span className="ml-1.5 font-bold text-white/50">Optional</span>}
        </label>
        {hint && <span className="text-[11px] text-white/45">{hint}</span>}
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          accept(e.dataTransfer.files?.[0]);
        }}
        className={[
          "relative flex items-center gap-4 rounded-2xl border-[3px] border-dashed p-4 transition-all duration-200",
          filled
            ? "border-solid border-blue-ink bg-white shadow-[4px_4px_0_var(--blue-ink)]"
            : msg
              ? "border-pink bg-white/10"
              : over
                ? "border-yellow bg-yellow/15"
                : "border-white/45 bg-white/[0.07] hover:border-white/80",
        ].join(" ")}
      >
        <input
          ref={input}
          id={id}
          type="file"
          accept={ACCEPT}
          onChange={(e) => accept(e.target.files?.[0])}
          className="absolute inset-0 cursor-pointer opacity-0"
          aria-describedby={msg ? `${id}-msg` : undefined}
        />

        {/* thumbnail / icon */}
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border-[3px] border-blue-ink ${
            filled ? "bg-yellow" : "bg-white/15"
          }`}
        >
          {value?.preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value.preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <svg
              viewBox="0 0 24 24"
              className={`h-6 w-6 ${filled ? "text-blue-ink" : "text-white/70"}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              {filled ? (
                <path d="M20 6 9 17l-5-5" />
              ) : (
                <>
                  <path d="M12 16V4M7 9l5-5 5 5" />
                  <path d="M4 16v2.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V16" />
                </>
              )}
            </svg>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p
            className={`truncate text-[14px] font-extrabold ${
              filled ? "text-blue-ink" : "text-white"
            }`}
          >
            {value ? value.name : "Tap to choose, or drop a file"}
          </p>
          <p className={`text-[11px] ${filled ? "text-blue-ink/55" : "text-white/50"}`}>
            {value
              ? `${(value.size / 1024).toFixed(0)} KB · ready`
              : `JPG, PNG, WEBP or PDF · max ${MAX_MB}MB`}
          </p>
        </div>

        {filled && (
          <button
            type="button"
            onClick={clear}
            aria-label={`Remove ${value?.name}`}
            className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[3px] border-blue-ink bg-pink text-white"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        )}
      </div>

      {msg && (
        <p id={`${id}-msg`} role="alert" className="mt-1.5 text-[12px] font-bold text-yellow">
          {msg}
        </p>
      )}
    </div>
  );
}
