"use client";

import type { Enquiry } from "@/lib/site";

export default function EnquiriesPanel({
  enquiries,
  onChange,
  notify,
}: {
  enquiries: Enquiry[];
  onChange: (e: Enquiry[]) => void;
  notify: (msg: string) => void;
}) {
  const toggle = async (e: Enquiry) => {
    const next = e.status === "new" ? "done" : "new";
    onChange(enquiries.map((x) => (x.id === e.id ? { ...x, status: next } : x)));
    await fetch("/api/admin/enquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: e.id, status: next }),
    });
    notify(next === "done" ? "Marked as done." : "Reopened.");
  };

  if (enquiries.length === 0) {
    return (
      <div className="rounded-2xl border border-navy/10 bg-cream-soft p-16 text-center">
        <p className="font-serif text-2xl italic text-navy">No enquiries yet</p>
        <p className="mt-2 text-sm text-steel">
          Bespoke requests and contact messages will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {enquiries.map((e) => (
        <article
          key={e.id}
          className="rounded-2xl border border-navy/10 bg-cream-soft p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-navy px-3 py-1 text-[0.6rem] font-medium tracking-[0.16em] text-cream">
                  {e.kind === "contact" ? "Contact" : "Bespoke"}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-[0.6rem] font-medium capitalize tracking-[0.16em] ${
                    e.status === "new"
                      ? "bg-ochre/20 text-ochre"
                      : "bg-navy/10 text-steel"
                  }`}
                >
                  {e.status}
                </span>
              </div>
              <h3 className="mt-2 font-serif text-xl text-navy">{e.name}</h3>
              <a href={`mailto:${e.email}`} className="break-all text-sm text-ochre">
                {e.email}
              </a>
            </div>
            <div className="flex items-center gap-2">
              {e.reference?.dataUrl && (
                <a
                  href={e.reference.dataUrl}
                  target="_blank"
                  rel="noreferrer"
                  title={`Open full image: ${e.reference.name}`}
                  className="shrink-0"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={e.reference.dataUrl}
                    alt="Reference"
                    className="h-14 w-14 rounded-lg border border-navy/10 object-cover transition hover:opacity-80"
                  />
                </a>
              )}
              <button
                type="button"
                onClick={() => toggle(e)}
                className={`rounded-full border px-4 py-2 text-[0.68rem] font-medium tracking-[0.16em] transition ${
                  e.status === "new"
                    ? "border-ochre/50 text-ochre hover:bg-ochre hover:text-navy-deep"
                    : "border-navy/20 text-navy hover:bg-navy hover:text-cream"
                }`}
              >
                {e.status === "new" ? "Mark done" : "Reopen"}
              </button>
            </div>
          </div>

          <dl className="mt-4 grid grid-cols-1 gap-2 text-sm text-navy/80">
            {e.productName && (
              <div>
                <dt className="inline tracking-[0.14em] text-steel">Piece: </dt>
                <dd className="inline">{e.productName}</dd>
              </div>
            )}
            {e.material && (
              <div>
                <dt className="inline tracking-[0.14em] text-steel">Material: </dt>
                <dd className="inline">{e.material}</dd>
              </div>
            )}
            {e.size && (
              <div>
                <dt className="inline tracking-[0.14em] text-steel">Size: </dt>
                <dd className="inline">{e.size}</dd>
              </div>
            )}
            {e.text && <dd className="whitespace-pre-wrap break-all">{e.text}</dd>}
            {e.notes && (
              <dd className="whitespace-pre-wrap break-all text-steel">{e.notes}</dd>
            )}
            {e.reference && (
              <dd className="break-all text-xs text-steel">Reference: {e.reference.name}</dd>
            )}
          </dl>

          <p className="mt-3 text-[0.64rem] tracking-wide text-steel/70">
            {new Date(e.createdAt).toLocaleString()}
          </p>
        </article>
      ))}
    </div>
  );
}
