"use client";

import { useState } from "react";
import type { Content, StripeConfig } from "@/lib/site";
import { Field, HelpTip, TextInput, Toggle } from "./ui";

function SecretInput({
  value,
  onChange,
  placeholder,
  replacePlaceholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  replacePlaceholder: string;
}) {
  const masked = value.includes("…") || value.includes("••");
  const longEnough = value.length > 8;
  return (
    <div className="space-y-2">
      {masked && value.length > 0 && (
        <p>
          <code className="break-all rounded bg-navy/10 px-1.5 py-0.5 text-xs text-navy/80">
            {longEnough ? value.slice(0, 6) : ""}
            <span aria-hidden="true" className="select-none blur-[2px]">
              ••••••
            </span>
            {longEnough ? value.slice(-4) : ""}
          </code>
        </p>
      )}
      <TextInput
        value={masked ? "" : value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={masked ? replacePlaceholder : placeholder}
      />
    </div>
  );
}

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
  const isLive = s.mode === "live";
  const keys = isLive ? s.live : s.sandbox;
  const put = (patch: Partial<StripeConfig["sandbox"]>) =>
    set({ [s.mode]: { ...keys, ...patch } } as Partial<StripeConfig>);

  const [origin] = useState(() =>
    typeof window !== "undefined" ? window.location.origin : "",
  );
  const webhookUrl = `${origin || "https://your-site"}/api/webhooks/stripe`;

  const pkPrefix = isLive ? "pk_live_" : "pk_test_";
  const skPrefix = isLive ? "sk_live_" : "sk_test_";
  const apiKeysUrl = isLive
    ? "https://dashboard.stripe.com/apikeys"
    : "https://dashboard.stripe.com/test/apikeys";
  const apiKeysLabel = isLive ? "live api keys" : "test api keys";
  const webhooksUrl = isLive
    ? "https://dashboard.stripe.com/webhooks"
    : "https://dashboard.stripe.com/test/webhooks";
  const webhooksLabel = isLive ? "live webhooks" : "test webhooks";
  const otherMode = isLive ? "test mode" : "live mode";

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-navy/10 bg-cream-soft p-6">
        <h2 className="eyebrow mb-5 text-navy">stripe payments</h2>
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
                    only one set of fields is shown below — the switch decides which side
                    you are editing. each side keeps its own keys, so flipping back
                    restores what you pasted.
                  </li>
                  <li>
                    when ready, fill in the live keys, flip this switch to live, then
                    press <strong>save changes</strong>.
                  </li>
                  <li>
                    test and live each need their <strong>own webhook secret</strong> —
                    see the ? on the webhook field below.
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
        <h2 className="eyebrow mb-5 text-navy">
          {isLive ? "live keys" : "sandbox / test keys"}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Publishable key"
            hint={`starts with ${pkPrefix} · stripe dashboard → developers → api keys`}
            helpTitle={`where to find your ${isLive ? "live" : "test"} publishable key`}
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
                  {isLive ? (
                    <>switch <strong>off test mode</strong> so you are in <strong>live mode</strong>.</>
                  ) : (
                    <>you land in <strong>test mode</strong> by default.</>
                  )}
                </li>
                <li>
                  go to <strong>developers → api keys</strong> (or open{" "}
                  <a href={apiKeysUrl} target="_blank" rel="noreferrer">
                    {apiKeysLabel}
                  </a>
                  ).
                </li>
                <li>
                  under <strong>standard keys</strong>, copy the <strong>publishable key</strong> starting{" "}
                  <code>{pkPrefix}…</code>.
                </li>
                <li>paste it here, then press save changes.</li>
              </ol>
            }
          >
            <SecretInput
              value={keys.publishableKey}
              onChange={(v) => put({ publishableKey: v })}
              placeholder={`${pkPrefix}…`}
              replacePlaceholder="paste a new key to replace the saved one"
            />
          </Field>
          <Field
            label="Secret key"
            hint={`starts with ${skPrefix} · saved key shows partly blurred`}
            helpTitle={`where to find your ${isLive ? "live" : "test"} secret key`}
            help={
              <ol>
                <li>
                  {isLive ? (
                    <>with <strong>test mode off</strong>, go to{" "}</>
                  ) : (
                    <>in <strong>test mode</strong>, go to{" "}</>
                  )}
                  <strong>developers → api keys</strong> ({" "}
                  <a href={apiKeysUrl} target="_blank" rel="noreferrer">
                    {apiKeysLabel}
                  </a>
                  ).
                </li>
                <li>
                  under <strong>standard keys</strong>, find <strong>secret key</strong> →{" "}
                  <strong>{isLive ? "reveal live key" : "reveal test key"}</strong> and copy it
                  (starts <code>{skPrefix}…</code>).
                  {isLive && " you may need to roll/create one if none exists."}
                </li>
                <li>paste it here and press save changes. it will show partly blurred afterwards.</li>
                <li>
                  {isLive ? (
                    <>this key moves real money — never paste it anywhere public or commit it to git.</>
                  ) : (
                    <>keep it private — it can create charges and refunds. it is stored server-side and never shown in full again.</>
                  )}
                </li>
              </ol>
            }
          >
            <SecretInput
              value={keys.secretKey}
              onChange={(v) => put({ secretKey: v })}
              placeholder={`${skPrefix}…`}
              replacePlaceholder="paste a new key to replace the saved one"
            />
          </Field>
          <Field
            label="Webhook signing secret"
            hint="starts with whsec_ · stripe dashboard → developers → webhooks, add your endpoint first"
            className="sm:col-span-2"
            helpTitle={`create your ${isLive ? "live" : "test"} webhook`}
            help={
              <>
                <ol>
                  <li>
                    {isLive ? (
                      <>with <strong>test mode off</strong>, go to{" "}</>
                    ) : (
                      <>in <strong>test mode</strong>, go to{" "}</>
                    )}
                    <strong>developers → webhooks</strong> ({" "}
                    <a href={webhooksUrl} target="_blank" rel="noreferrer">
                      {webhooksLabel}
                    </a>
                    ) → <strong>add endpoint</strong>.
                  </li>
                  <li>
                    endpoint url: <code>{webhookUrl}</code>
                    {isLive ? (
                      <> — the same path as test, but added while in <strong>live mode</strong>. test and live endpoints are separate.</>
                    ) : (
                      <> (use your live vercel domain, not localhost).</>
                    )}
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
                    paste it here{isLive && <>, flip <strong>active mode</strong> to live</>} and press save changes.
                  </li>
                  {isLive ? (
                    <li>
                      place a small real order (or refund it after) to confirm orders appear in the
                      orders tab.
                    </li>
                  ) : (
                    <li>
                      place a test order — a new paid order should appear in the orders tab.
                    </li>
                  )}
                </ol>
                <p>
                  without this secret, payments still succeed but orders won&rsquo;t be recorded
                  automatically.
                </p>
              </>
            }
          >
            <SecretInput
              value={keys.webhookSecret}
              onChange={(v) => put({ webhookSecret: v })}
              placeholder="whsec_…"
              replacePlaceholder="paste a new secret to replace the saved one"
            />
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
              <strong>signing secret</strong> into the matching field above — flip the{" "}
              <strong>active mode</strong> switch to paste the {otherMode} one.
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
