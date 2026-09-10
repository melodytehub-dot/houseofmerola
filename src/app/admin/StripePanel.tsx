"use client";

import type { Content, StripeConfig, StripeMode } from "@/lib/site";
import { Field, TextInput, Select, Toggle } from "./ui";

export default function StripePanel({
  content,
  onChange,
}: {
  content: Content;
  onChange: (c: Content) => void;
}) {
  const s = content.stripe;
  const set = (patch: Partial<StripeConfig>) =>
    onChange({ ...content, stripe: { ...s, ...patch } });
  const env = (which: StripeMode, patch: Partial<StripeConfig["sandbox"]>) =>
    set({ [which]: { ...s[which], ...patch } } as Partial<StripeConfig>);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-navy/10 bg-cream-soft p-6">
        <h2 className="eyebrow mb-5 text-navy">Stripe payments</h2>
        <div className="mb-5 rounded-xl border border-ochre/30 bg-ochre/5 p-4 text-sm leading-relaxed text-navy/80">
          Paste the keys from your{" "}
          <a
            href="https://dashboard.stripe.com/apikeys"
            target="_blank"
            rel="noreferrer"
            className="text-ochre underline"
          >
            Stripe dashboard
          </a>
          . Secret keys are stored server-side and shown masked here — type a key
          to replace it, or leave it blank to keep the current one. Use
          &ldquo;sandbox&rdquo; while testing and switch to &ldquo;live&rdquo;
          when you are ready to take real payments.
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Active mode">
            <Select value={s.mode} onChange={(e) => set({ mode: e.target.value as StripeMode })}>
              <option value="sandbox">Sandbox (test)</option>
              <option value="live">Live</option>
            </Select>
          </Field>
          <div className="flex items-end pb-1">
            <Toggle checked={s.enabled} onChange={(v) => set({ enabled: v })} label="Enable Stripe checkout" />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-navy/10 bg-cream-soft p-6">
        <h2 className="eyebrow mb-5 text-navy">Sandbox / test keys</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Publishable key">
            <TextInput value={s.sandbox.publishableKey} onChange={(e) => env("sandbox", { publishableKey: e.target.value })} placeholder="pk_test_…" />
          </Field>
          <Field label="Secret key" hint="Stored server-side">
            <TextInput value={s.sandbox.secretKey} onChange={(e) => env("sandbox", { secretKey: e.target.value })} placeholder="sk_test_…" />
          </Field>
          <Field label="Webhook signing secret" className="sm:col-span-2">
            <TextInput value={s.sandbox.webhookSecret} onChange={(e) => env("sandbox", { webhookSecret: e.target.value })} placeholder="whsec_…" />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-navy/10 bg-cream-soft p-6">
        <h2 className="eyebrow mb-5 text-navy">Live keys</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Publishable key">
            <TextInput value={s.live.publishableKey} onChange={(e) => env("live", { publishableKey: e.target.value })} placeholder="pk_live_…" />
          </Field>
          <Field label="Secret key" hint="Stored server-side">
            <TextInput value={s.live.secretKey} onChange={(e) => env("live", { secretKey: e.target.value })} placeholder="sk_live_…" />
          </Field>
          <Field label="Webhook signing secret" className="sm:col-span-2">
            <TextInput value={s.live.webhookSecret} onChange={(e) => env("live", { webhookSecret: e.target.value })} placeholder="whsec_…" />
          </Field>
        </div>
      </section>

      <p className="text-sm text-steel">
        Webhook endpoint:{" "}
        <code className="rounded bg-navy/10 px-1.5 py-0.5 text-xs">
          /api/webhooks/stripe
        </code>{" "}
        · add it in Stripe for the events{" "}
        <code className="rounded bg-navy/10 px-1.5 py-0.5 text-xs">
          checkout.session.completed
        </code>
        .
      </p>
    </div>
  );
}
