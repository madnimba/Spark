"use client";

import { useId } from "react";

/**
 * Pop-art text input. Errors are announced through `aria-describedby` and
 * `aria-invalid` rather than colour alone — the yellow/pink palette has poor
 * contrast against several of the error states otherwise.
 */
export default function Field({
  label,
  value,
  onChange,
  error,
  hint,
  type = "text",
  placeholder,
  inputMode,
  autoComplete,
  prefix,
  options,
  required = true,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  hint?: string;
  type?: string;
  placeholder?: string;
  inputMode?: "text" | "numeric" | "tel" | "email" | "decimal";
  autoComplete?: string;
  /** Static text pinned inside the control, e.g. a dialling code. */
  prefix?: string;
  /** Renders a <select> instead of an <input>. */
  options?: string[];
  required?: boolean;
}) {
  const id = useId();
  const errId = `${id}-err`;
  const hintId = `${id}-hint`;

  const shell = [
    "flex items-center gap-2 rounded-2xl border-[3px] bg-white px-4 transition-shadow",
    error ? "border-pink shadow-[4px_4px_0_var(--pink)]" : "border-blue-ink shadow-[4px_4px_0_var(--blue-ink)]",
    "focus-within:shadow-[6px_6px_0_var(--blue-ink)]",
  ].join(" ");

  const control =
    "w-full bg-transparent py-3.5 text-[16px] font-semibold text-blue-ink outline-none placeholder:font-normal placeholder:text-blue-ink/35";

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.14em] text-white"
      >
        {label}
        {!required && <span className="ml-1.5 font-bold text-white/50">Optional</span>}
      </label>

      <div className={shell}>
        {prefix && (
          <span className="shrink-0 border-r-2 border-blue-ink/15 pr-2.5 text-[15px] font-extrabold text-blue-ink/60">
            {prefix}
          </span>
        )}

        {options ? (
          <select
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={!!error}
            aria-describedby={error ? errId : hint ? hintId : undefined}
            className={`${control} cursor-pointer`}
          >
            <option value="">Select…</option>
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            inputMode={inputMode}
            autoComplete={autoComplete}
            aria-invalid={!!error}
            aria-describedby={error ? errId : hint ? hintId : undefined}
            className={control}
          />
        )}
      </div>

      {error ? (
        <p id={errId} role="alert" className="mt-1.5 text-[12px] font-bold text-yellow">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="mt-1.5 text-[12px] text-white/55">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
