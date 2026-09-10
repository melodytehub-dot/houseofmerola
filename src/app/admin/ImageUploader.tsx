"use client";

import { useRef, useState } from "react";
import { Field } from "./ui";

/**
 * A text/browse image field. Typing a path (e.g. /images/x.jpg) works as before;
 * the Upload button POSTs the chosen file to /api/admin/upload and stores the
 * returned URL. On Vercel the upload writes to the repo (GitHub) when
 * GITHUB_TOKEN + GITHUB_REPO are set, otherwise to local public/images (dev).
 */
export default function ImageUploader({
  value,
  onChange,
  label,
  hint,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  hint?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFileChosen(f: File | null) {
    if (!f) return;
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", f);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error || "Upload failed");
      onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Field label={label} hint={hint} className={className}>
      <div className="flex items-start gap-3">
        <input
          className="w-full rounded-lg border border-navy/15 bg-cream px-3.5 py-2.5 text-sm text-navy placeholder:text-steel/50 focus:border-ochre focus:outline-none focus:ring-2 focus:ring-ochre/20"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/images/…"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="shrink-0 rounded-lg border border-navy/20 px-3.5 py-2.5 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-navy transition hover:border-ochre hover:bg-ochre/10 disabled:opacity-50"
        >
          {busy ? "Uploading…" : "Upload"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onFileChosen(e.target.files?.[0] ?? null)}
        />
      </div>
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="Preview" className="mt-2 h-20 w-20 rounded-lg border border-navy/10 object-cover" />
      ) : null}
      {error ? <p className="mt-1 text-xs text-oxblood">{error}</p> : null}
    </Field>
  );
}
