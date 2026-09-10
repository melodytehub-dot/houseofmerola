"use client";

import type { Order } from "@/lib/site";

function money(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  } catch {
    return `${currency.toUpperCase()} ${amount.toFixed(2)}`;
  }
}

export default function OrdersPanel({
  orders,
  onChange,
  notify,
}: {
  orders: Order[];
  onChange: (o: Order[]) => void;
  notify: (msg: string) => void;
}) {
  const toggle = async (o: Order) => {
    const next = o.status === "new" ? "fulfilled" : "new";
    onChange(orders.map((x) => (x.id === o.id ? { ...x, status: next } : x)));
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: o.id, status: next }),
    });
    notify(next === "fulfilled" ? "Marked as fulfilled." : "Reopened.");
  };

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-navy/10 bg-cream-soft p-16 text-center">
        <p className="font-serif text-2xl italic text-navy">No orders yet</p>
        <p className="mt-2 text-sm text-steel">
          Paid checkout sessions will appear here the moment they complete.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((o) => (
        <article
          key={o.id}
          className="rounded-2xl border border-navy/10 bg-cream-soft p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-navy px-3 py-1 text-[0.6rem] font-medium uppercase tracking-[0.16em] text-cream">
                  {o.deliveryZone === "international" ? "International" : "UK"}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-[0.6rem] font-medium uppercase tracking-[0.16em] ${
                    o.status === "new"
                      ? "bg-ochre/20 text-ochre"
                      : "bg-navy/10 text-steel"
                  }`}
                >
                  {o.status}
                </span>
                {o.paymentStatus && (
                  <span className="rounded-full bg-emerald-700/10 px-3 py-1 text-[0.6rem] font-medium uppercase tracking-[0.16em] text-emerald-700">
                    {o.paymentStatus}
                  </span>
                )}
              </div>
              <h3 className="mt-2 font-serif text-xl text-navy">
                {o.name || "Guest"}
              </h3>
              <a href={`mailto:${o.email}`} className="text-sm text-ochre">
                {o.email}
              </a>
            </div>
            <button
              type="button"
              onClick={() => toggle(o)}
              className={`rounded-full border px-4 py-2 text-[0.68rem] font-medium uppercase tracking-[0.16em] transition ${
                o.status === "new"
                  ? "border-ochre/50 text-ochre hover:bg-ochre hover:text-navy-deep"
                  : "border-navy/20 text-navy hover:bg-navy hover:text-cream"
              }`}
            >
              {o.status === "new" ? "Mark fulfilled" : "Reopen"}
            </button>
          </div>

          <ul className="mt-4 divide-y divide-navy/10 text-sm text-navy/80">
            {o.items.map((item, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between gap-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-navy">{item.name}</p>
                  {item.variant && (
                    <p className="truncate text-[0.65rem] uppercase tracking-wide text-steel/70">
                      {item.variant}
                    </p>
                  )}
                </div>
                <p className="shrink-0 text-right text-navy">
                  Qty {item.qty} · {money(item.unitPrice * item.qty, o.currency)}
                </p>
              </li>
            ))}
          </ul>

          <dl className="mt-3 space-y-1 border-t border-navy/10 pt-3 text-sm text-navy/80">
            <div className="flex justify-between">
              <dt className="text-steel">Subtotal</dt>
              <dd>{money(o.subtotal, o.currency)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-steel">Shipping</dt>
              <dd>{o.shipping === 0 ? "Free" : money(o.shipping, o.currency)}</dd>
            </div>
            <div className="flex justify-between border-t border-navy/10 pt-2 font-semibold text-navy">
              <dt>Total</dt>
              <dd>{money(o.total, o.currency)}</dd>
            </div>
          </dl>

          <p className="mt-3 text-[0.64rem] uppercase tracking-wide text-steel/70">
            {new Date(o.createdAt).toLocaleString()} · {o.id}
          </p>
        </article>
      ))}
    </div>
  );
}
