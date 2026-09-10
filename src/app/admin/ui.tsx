"use client";

import type { ReactNode } from "react";

export function Field({
  label,
  hint,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[0.68rem] font-medium uppercase tracking-[0.2em] text-steel">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-steel/70">{hint}</span>}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg border border-navy/15 bg-cream px-3.5 py-2.5 text-sm text-navy placeholder:text-steel/50 focus:border-ochre focus:outline-none focus:ring-2 focus:ring-ochre/20";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputCls} ${props.className ?? ""}`} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputCls} resize-none ${props.className ?? ""}`} />;
}

export function NumInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="number"
      step="0.01"
      {...props}
      className={`${inputCls} ${props.className ?? ""}`}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={`${inputCls} ${props.className ?? ""}`}>
      {props.children}
    </select>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="group flex cursor-pointer select-none items-center gap-2.5 rounded-lg text-sm text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre/60"
    >
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
          checked ? "bg-ochre" : "bg-navy/20"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-cream shadow transition-transform duration-200 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </span>
      <span className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-navy/80 transition-colors group-hover:text-navy">
        {label}
      </span>
    </button>
  );
}

export function AddButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-navy/30 px-4 py-2 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-steel transition hover:border-ochre hover:text-ochre"
    >
      + {children}
    </button>
  );
}
