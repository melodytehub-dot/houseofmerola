"use client";

import { useState } from "react";
import type { Content, StripeConfig, StripeMode } from "@/lib/site";
import { Field, HelpTip, TextInput, Toggle } from "./ui";

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

  const isLive = s.mode === "live";

  const [origin] = useState(() =>
    typeof window !== "undefined" ? window.location.origin : "",
  );
  const webhookUrl = `${origin || "https://your-site"}/api/webhooks/stripe`;

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-navy/10 bg-cream-soft p-6">
        <h2 className="eyebrow mb-5 text-navy">Stripe payments</h2>
        <div className="mb-5 rounded-xl border border-ochre/30 bg-ochre/5 p-4 text-sm leading-relaxed text-navy/80">
          <strong className="font-medium text-navy">Stripe Checkout is always on.</strong>{" "}
          Add your keys below and checkout will redirect shoppers to Stripe. Use the{" "}
          <strong className="font-medium text-navy">Sandbox</strong> keys while
          testing, then flip the switch to{" "}
          <strong className="font-medium text-navy">Live</strong> when you&rsquo;re
          ready to take real payments. Secret keys and webhook secrets are kept
          server-side and shown masked — type a new value to replace one, or leave
          it blank to keep the current key.
        </div>

        <div className="flex items-end pb-1">
          <div>
            <span className="mb-1.5 block text-[0.68rem] font-medium uppercase tracking-[0.2em] text-steel">
              Active mode
              <HelpTip title="Sandbox vs Live mode">
                <ol>
                  <li>
                    <strong>Sandbox (test)</strong> uses test keys — no real money moves.
                    Pay with the test card <code>4242 4242 4242 4242</code>, any future
                    expiry date and any CVC.
                  </li>
                  <li>
                    <strong>Live</strong> uses real keys and takes real payments.
                  </li>
                  <li>
                    Recommended flow: fill in the Sandbox keys first, place a test order,
                    and check the Orders tab plus your Stripe Dashboard (in Test mode).
                  </li>
                  <li>
                    When ready, fill in the Live keys, flip this switch to Live, then
                    press <strong>Save changes</strong>.
                  </li>
                  <li>
                    Test and Live each need their <strong>own webhook secret</strong> —
                    see the ? on each webhook field below.
                  </li>
                </ol>
              </HelpTip>
            </span>
            <Toggle
              checked={isLive}
              onChange={(v) => set({ mode: v ? "live" : "sandbox" })}
              label={isLive ? "Live" : "Sandbox (test)"}
            />
            <p className="mt-1 text-xs text-steel/70">
              {isLive ? "Taking real payments." : "Testing only — no real charges."}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-navy/10 bg-cream-soft p-6">
        <h2 className="eyebrow mb-5 text-navy">Sandbox / test keys</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Publishable key"
            hint="Starts with pk_test_ · Stripe Dashboard → Developers → API keys"
            helpTitle="Where to find your test publishable key"
            help={
              <ol>
                <li>
                  Sign in at{" "}
                  <a href="https://dashboard.stripe.com" target="_blank" rel="noreferrer">
                    dashboard.stripe.com
                  </a>
                  .
                </li>
                <li>
                  Switch on <strong>Test mode</strong> (toggle in the dashboard header).
                </li>
                <li>
                  Go to <strong>Developers → API keys</strong> (or open{" "}
                  <a href="https://dashboard.stripe.com/test/apikeys" target="_blank" rel="noreferrer">
                    Test API keys
                  </a>
                  ).
                </li>
                <li>
                  Under <strong>Standard keys</strong>, copy the <strong>Publishable key</strong> starting{" "}
                  <code>pk_test_…</code>.
                </li>
                <li>Paste it here, then press Save changes.</li>
              </ol>
            }
          >
            <TextInput value={s.sandbox.publishableKey} onChange={(e) => env("sandbox", { publishableKey: e.target.value })} placeholder="pk_test_…" />
          </Field>
          <Field
            label="Secret key"
            hint="Starts with sk_test_ · shown masked, stored server-side"
            helpTitle="Where to find your test secret key"
            help={
              <ol>
                <li>
                  In <strong>Test mode</strong>, go to{" "}
                  <strong>Developers → API keys</strong> ({" "}
                  <a href="https://dashboard.stripe.com/test/apikeys" target="_blank" rel="noreferrer">
                    Test API keys
                  </a>
                  ).
                </li>
                <li>
                  Under <strong>Standard keys</strong>, find <strong>Secret key</strong> →{" "}
                  <strong>Reveal test key</strong> and copy it (starts <code>sk_test_…</code>).
                </li>
                <li>Paste it here and press Save changes. It will show masked afterwards.</li>
                <li>
                  Keep it private — it can create charges and refunds. It is stored server-side
                  and never shown in full again.
                </li>
              </ol>
            }
          >
            <TextInput value={s.sandbox.secretKey} onChange={(e) => env("sandbox", { secretKey: e.target.value })} placeholder="sk_test_…" />
          </Field>
          <Field
            label="Webhook signing secret"
            hint="Starts with whsec_ · Stripe Dashboard → Developers → Webhooks, add your endpoint first"
            className="sm:col-span-2"
            helpTitle="Create your test webhook"
            help={
              <>
                <ol>
                  <li>
                    In <strong>Test mode</strong>, go to <strong>Developers → Webhooks</strong> ({" "}
                    <a href="https://dashboard.stripe.com/test/webhooks" target="_blank" rel="noreferrer">
                      Test Webhooks
                    </a>
                    ) → <strong>Add endpoint</strong>.
                  </li>
                  <li>
                    Endpoint URL: <code>{webhookUrl}</code> (use your live Vercel domain, not
                    localhost).
                  </li>
                  <li>
                    Under <strong>Listen to events</strong>, select{" "}
                    <code>checkout.session.completed</code>, then <strong>Add endpoint</strong>.
                  </li>
                  <li>
                    Open the new endpoint → <strong>Reveal Signing secret</strong> → copy it
                    (starts <code>whsec_…</code>).
                  </li>
                  <li>Paste it here and press Save changes.</li>
                  <li>
                    Place a test order — a new paid order should appear in the Orders tab.
                  </li>
                </ol>
                <p>
                  Without this secret, payments still succeed but orders won&rsquo;t be recorded
                  automatically.
                </p>
              </>
            }
          >
            <TextInput value={s.sandbox.webhookSecret} onChange={(e) => env("sandbox", { webhookSecret: e.target.value })} placeholder="whsec_…" />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-navy/10 bg-cream-soft p-6">
        <h2 className="eyebrow mb-5 text-navy">Live keys</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Publishable key"
            hint="Starts with pk_live_ · Stripe Dashboard → Developers → API keys"
            helpTitle="Where to find your live publishable key"
            help={
              <ol>
                <li>
                  Sign in at{" "}
                  <a href="https://dashboard.stripe.com" target="_blank" rel="noreferrer">
                    dashboard.stripe.com
                  </a>
                  .
                </li>
                <li>
                  Switch <strong>off Test mode</strong> so you are in <strong>Live mode</strong>.
                </li>
                <li>
                  Go to <strong>Developers → API keys</strong> (or open{" "}
                  <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noreferrer">
                    Live API keys
                  </a>
                  ).
                </li>
                <li>
                  Under <strong>Standard keys</strong>, copy the <strong>Publishable key</strong> starting{" "}
                  <code>pk_live_…</code>.
                </li>
                <li>Paste it here, then press Save changes.</li>
              </ol>
            }
          >
            <TextInput value={s.live.publishableKey} onChange={(e) => env("live", { publishableKey: e.target.value })} placeholder="pk_live_…" />
          </Field>
          <Field
            label="Secret key"
            hint="Starts with sk_live_ · shown masked, stored server-side"
            helpTitle="Where to find your live secret key"
            help={
              <ol>
                <li>
                  With <strong>Test mode off</strong>, go to{" "}
                  <strong>Developers → API keys</strong> ({" "}
                  <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noreferrer">
                    Live API keys
                  </a>
                  ).
                </li>
                <li>
                  Under <strong>Standard keys</strong>, find <strong>Secret key</strong> →{" "}
                  <strong>Reveal live key</strong> and copy it (starts <code>sk_live_…</code>).
                  You may need to roll/create one if none exists.
                </li>
                <li>Paste it here and press Save changes. It will show masked afterwards.</li>
                <li>
                  This key moves real money — never paste it anywhere public or commit it to git.
                </li>
              </ol>
            }
          >
            <TextInput value={s.live.secretKey} onChange={(e) => env("live", { secretKey: e.target.value })} placeholder="sk_live_…" />
          </Field>
          <Field
            label="Webhook signing secret"
            hint="Starts with whsec_ · Stripe Dashboard → Developers → Webhooks, add your endpoint first"
            className="sm:col-span-2"
            helpTitle="Create your live webhook"
            help={
              <>
                <ol>
                  <li>
                    With <strong>Test mode off</strong>, go to <strong>Developers → Webhooks</strong> ({" "}
                    <a href="https://dashboard.stripe.com/webhooks" target="_blank" rel="noreferrer">
                      Live Webhooks
                    </a>
                    ) → <strong>Add endpoint</strong>.
                  </li>
                  <li>
                    Endpoint URL: <code>{webhookUrl}</code> — the same path as test, but added
                    while in <strong>Live mode</strong>. Test and Live endpoints are separate.
                  </li>
                  <li>
                    Under <strong>Listen to events</strong>, select{" "}
                    <code>checkout.session.completed</code>, then <strong>Add endpoint</strong>.
                  </li>
                  <li>
                    Open the new endpoint → <strong>Reveal Signing secret</strong> → copy it
                    (starts <code>whsec_…</code>).
                  </li>
                  <li>
                    Paste it here, flip <strong>Active mode</strong> to Live, and press Save changes.
                  </li>
                </ol>
                <p>
                  Place a small real order (or refund it after) to confirm orders appear in the
                  Orders tab.
                </p>
              </>
            }
          >
            <TextInput value={s.live.webhookSecret} onChange={(e) => env("live", { webhookSecret: e.target.value })} placeholder="whsec_…" />
          </Field>
        </div>
      </section>

      <p className="text-sm text-steel">
        Webhook endpoint:{" "}
        <code className="rounded bg-navy/10 px-1.5 py-0.5 text-xs">
          {webhookUrl}
        </code>{" "}
        <HelpTip title="About the webhook endpoint">
          <ol>
            <li>
              This is the URL Stripe calls after a payment to record the order. Add it under{" "}
              <strong>Developers → Webhooks</strong> — once in <strong>Test mode</strong> and once
              in <strong>Live mode</strong>.
            </li>
            <li>
              Use your public site URL (e.g. <code>https://houseofmerola.vercel.app/api/webhooks/stripe</code>
              ), not <code>localhost</code>.
            </li>
            <li>
              Select the <code>checkout.session.completed</code> event, then copy each endpoint&rsquo;s{" "}
              <strong>Signing secret</strong> into the matching field above.
            </li>
          </ol>
        </HelpTip>
        · in Stripe add it under{" "}
        <span className="font-medium text-navy/80">Developers → Webhooks</span> and
        select the{" "}
        <code className="rounded bg-navy/10 px-1.5 py-0.5 text-xs">
          checkout.session.completed
        </code>{" "}
        event.
      </p>
    </div>
  );
}
