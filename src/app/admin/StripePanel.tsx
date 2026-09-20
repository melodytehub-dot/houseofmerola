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
          <strong className="font-medium text-navy">stripe checkout is always on.</strong>{" "}
          add your keys below and checkout will redirect shoppers to stripe. the switch starts in{" "}
          <strong className="font-medium text-navy">sandbox (test)</strong> by default — use the{" "}
          <strong className="font-medium text-navy">sandbox</strong> keys while
          testing, then flip the switch to{" "}
          <strong className="font-medium text-navy">live</strong> when you&rsquo;re
          ready to take real payments. secret keys and webhook secrets are kept
          server-side and shown masked — type a new value to replace one, or leave
          it blank to keep the current key.
        </div>

        <div className="flex items-end pb-1">
          <div>
            <span className="mb-1.5 block text-[0.68rem] font-medium uppercase tracking-[0.2em] text-steel">
              Active mode
              <HelpTip title="sandbox vs live mode">
                <ol>
                  <li>
                    the switch starts in <strong>sandbox (test)</strong> by default.
                  </li>
                  <li>
                    <strong>sandbox (test)</strong> uses test keys — no real money moves.
                    pay with the test card <code>4242 4242 4242 4242</code>, any future
                    expiry date and any cvc.
                  </li>
                  <li>
                    <strong>live</strong> uses real keys and takes real payments.
                  </li>
                  <li>
                    recommended flow: fill in the sandbox keys first, place a test order,
                    and check the orders tab plus your stripe dashboard (in test mode).
                  </li>
                  <li>
                    when ready, fill in the live keys, flip this switch to live, then
                    press <strong>save changes</strong>.
                  </li>
                  <li>
                    test and live each need their <strong>own webhook secret</strong> —
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
              {isLive ? "taking real payments." : "testing only — no real charges."}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-navy/10 bg-cream-soft p-6">
        <h2 className="eyebrow mb-5 text-navy">Sandbox / test keys</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Publishable key"
            hint="starts with pk_test_ · stripe dashboard → developers → api keys"
            helpTitle="where to find your test publishable key"
            help={
              <ol>
                <li>
                  sign in at{" "}
                  <a href="https://dashboard.stripe.com" target="_blank" rel="noreferrer">
                    dashboard.stripe.com
                  </a>
                  .
                </li>
                <li>
                  switch on <strong>test mode</strong> (toggle in the dashboard header).
                </li>
                <li>
                  go to <strong>developers → api keys</strong> (or open{" "}
                  <a href="https://dashboard.stripe.com/test/apikeys" target="_blank" rel="noreferrer">
                    test api keys
                  </a>
                  ).
                </li>
                <li>
                  under <strong>standard keys</strong>, copy the <strong>publishable key</strong> starting{" "}
                  <code>pk_test_…</code>.
                </li>
                <li>paste it here, then press save changes.</li>
              </ol>
            }
          >
            <TextInput value={s.sandbox.publishableKey} onChange={(e) => env("sandbox", { publishableKey: e.target.value })} placeholder="pk_test_…" />
          </Field>
          <Field
            label="Secret key"
            hint="starts with sk_test_ · shown masked, stored server-side"
            helpTitle="where to find your test secret key"
            help={
              <ol>
                <li>
                  in <strong>test mode</strong>, go to{" "}
                  <strong>developers → api keys</strong> ({" "}
                  <a href="https://dashboard.stripe.com/test/apikeys" target="_blank" rel="noreferrer">
                    test api keys
                  </a>
                  ).
                </li>
                <li>
                  under <strong>standard keys</strong>, find <strong>secret key</strong> →{" "}
                  <strong>reveal test key</strong> and copy it (starts <code>sk_test_…</code>).
                </li>
                <li>paste it here and press save changes. it will show masked afterwards.</li>
                <li>
                  keep it private — it can create charges and refunds. it is stored server-side
                  and never shown in full again.
                </li>
              </ol>
            }
          >
            <TextInput value={s.sandbox.secretKey} onChange={(e) => env("sandbox", { secretKey: e.target.value })} placeholder="sk_test_…" />
          </Field>
          <Field
            label="Webhook signing secret"
            hint="starts with whsec_ · stripe dashboard → developers → webhooks, add your endpoint first"
            className="sm:col-span-2"
            helpTitle="create your test webhook"
            help={
              <>
                <ol>
                  <li>
                    in <strong>test mode</strong>, go to <strong>developers → webhooks</strong> ({" "}
                    <a href="https://dashboard.stripe.com/test/webhooks" target="_blank" rel="noreferrer">
                      test webhooks
                    </a>
                    ) → <strong>add endpoint</strong>.
                  </li>
                  <li>
                    endpoint url: <code>{webhookUrl}</code> (use your live vercel domain, not
                    localhost).
                  </li>
                  <li>
                    under <strong>listen to events</strong>, select{" "}
                    <code>checkout.session.completed</code>, then <strong>add endpoint</strong>.
                  </li>
                  <li>
                    open the new endpoint → <strong>reveal signing secret</strong> → copy it
                    (starts <code>whsec_…</code>).
                  </li>
                  <li>paste it here and press save changes.</li>
                  <li>
                    place a test order — a new paid order should appear in the orders tab.
                  </li>
                </ol>
                <p>
                  without this secret, payments still succeed but orders won&rsquo;t be recorded
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
            hint="starts with pk_live_ · stripe dashboard → developers → api keys"
            helpTitle="where to find your live publishable key"
            help={
              <ol>
                <li>
                  sign in at{" "}
                  <a href="https://dashboard.stripe.com" target="_blank" rel="noreferrer">
                    dashboard.stripe.com
                  </a>
                  .
                </li>
                <li>
                  switch <strong>off test mode</strong> so you are in <strong>live mode</strong>.
                </li>
                <li>
                  go to <strong>developers → api keys</strong> (or open{" "}
                  <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noreferrer">
                    live api keys
                  </a>
                  ).
                </li>
                <li>
                  under <strong>standard keys</strong>, copy the <strong>publishable key</strong> starting{" "}
                  <code>pk_live_…</code>.
                </li>
                <li>paste it here, then press save changes.</li>
              </ol>
            }
          >
            <TextInput value={s.live.publishableKey} onChange={(e) => env("live", { publishableKey: e.target.value })} placeholder="pk_live_…" />
          </Field>
          <Field
            label="Secret key"
            hint="starts with sk_live_ · shown masked, stored server-side"
            helpTitle="where to find your live secret key"
            help={
              <ol>
                <li>
                  with <strong>test mode off</strong>, go to{" "}
                  <strong>developers → api keys</strong> ({" "}
                  <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noreferrer">
                    live api keys
                  </a>
                  ).
                </li>
                <li>
                  under <strong>standard keys</strong>, find <strong>secret key</strong> →{" "}
                  <strong>reveal live key</strong> and copy it (starts <code>sk_live_…</code>).
                  you may need to roll/create one if none exists.
                </li>
                <li>paste it here and press save changes. it will show masked afterwards.</li>
                <li>
                  this key moves real money — never paste it anywhere public or commit it to git.
                </li>
              </ol>
            }
          >
            <TextInput value={s.live.secretKey} onChange={(e) => env("live", { secretKey: e.target.value })} placeholder="sk_live_…" />
          </Field>
          <Field
            label="Webhook signing secret"
            hint="starts with whsec_ · stripe dashboard → developers → webhooks, add your endpoint first"
            className="sm:col-span-2"
            helpTitle="create your live webhook"
            help={
              <>
                <ol>
                  <li>
                    with <strong>test mode off</strong>, go to <strong>developers → webhooks</strong> ({" "}
                    <a href="https://dashboard.stripe.com/webhooks" target="_blank" rel="noreferrer">
                      live webhooks
                    </a>
                    ) → <strong>add endpoint</strong>.
                  </li>
                  <li>
                    endpoint url: <code>{webhookUrl}</code> — the same path as test, but added
                    while in <strong>live mode</strong>. test and live endpoints are separate.
                  </li>
                  <li>
                    under <strong>listen to events</strong>, select{" "}
                    <code>checkout.session.completed</code>, then <strong>add endpoint</strong>.
                  </li>
                  <li>
                    open the new endpoint → <strong>reveal signing secret</strong> → copy it
                    (starts <code>whsec_…</code>).
                  </li>
                  <li>
                    paste it here, flip <strong>active mode</strong> to live, and press save changes.
                  </li>
                </ol>
                <p>
                  place a small real order (or refund it after) to confirm orders appear in the
                  orders tab.
                </p>
              </>
            }
          >
            <TextInput value={s.live.webhookSecret} onChange={(e) => env("live", { webhookSecret: e.target.value })} placeholder="whsec_…" />
          </Field>
        </div>
      </section>

      <p className="text-sm text-steel">
        webhook endpoint:{" "}
        <code className="break-all rounded bg-navy/10 px-1.5 py-0.5 text-xs">
          {webhookUrl}
        </code>{" "}
        <HelpTip title="about the webhook endpoint">
          <ol>
            <li>
              this is the url stripe calls after a payment to record the order. add it under{" "}
              <strong>developers → webhooks</strong> — once in <strong>test mode</strong> and once
              in <strong>live mode</strong>.
            </li>
            <li>
              use your public site url (e.g. <code>https://houseofmerola.vercel.app/api/webhooks/stripe</code>
              ), not <code>localhost</code>.
            </li>
            <li>
              select the <code>checkout.session.completed</code> event, then copy each endpoint&rsquo;s{" "}
              <strong>signing secret</strong> into the matching field above.
            </li>
          </ol>
        </HelpTip>
        · in stripe add it under{" "}
        <span className="font-medium text-navy/80">developers → webhooks</span> and
        select the{" "}
        <code className="rounded bg-navy/10 px-1.5 py-0.5 text-xs">
          checkout.session.completed
        </code>{" "}
        event.
      </p>
    </div>
  );
}
