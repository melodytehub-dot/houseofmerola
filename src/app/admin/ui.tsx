"use client";

import { useEffect, useState, type ReactNode } from "react";

export function HelpTip({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open ]);

  return (
    <>
      <button
        type="button"
        aria-label={`Help: ${title}`}
        title={title}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        className="ml-1.5 inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border border-steel/50 p-0 align-middle text-[11px] font-semibold normal-case leading-none tracking-normal text-steel transition hover:border-ochre hover:text-ochre"
      >
        <span className="block leading-none">?</span>
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div
            className="absolute inset-0 bg-navy-deep/60"
            onClick={() => setOpen(false)}
          />
          <div className="relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border border-navy/10 bg-cream-soft p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-serif text-xl leading-snug text-navy">{title}</h3>
              <button
                type="button"
                aria-label="Close help"
                onClick={() => setOpen(false)}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-navy/15 text-sm text-navy/70 transition hover:border-oxblood hover:text-oxblood"
              >
                ✕
              </button>
            </div>
            <div className="mt-3 space-y-2 text-sm leading-relaxed text-navy/80 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5 [&_a]:text-ochre [&_a]:underline [&_code]:break-all [&_code]:rounded [&_code]:bg-navy/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-xs [&_strong]:font-medium [&_strong]:text-navy">
              {children}
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-5 w-full rounded-full bg-navy px-5 py-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-cream transition hover:bg-oxblood"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function Field({
  label,
  hint,
  helpTitle,
  help,
  children,
  className = "",
}: {
  label: ReactNode;
  hint?: string;
  helpTitle?: string;
  help?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`block ${className}`}>
      <span className="mb-1.5 block text-[0.68rem] font-medium uppercase tracking-[0.2em] text-steel">
        {label}
        {help && (
          <HelpTip title={helpTitle ?? (typeof label === "string" ? label : "Help")}>
            {help}
          </HelpTip>
        )}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-steel/70">{hint}</span>}
    </div>
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
