"use client";

import type { Content, SiteSettings } from "@/lib/site";
import { Field, TextInput, TextArea, NumInput, Toggle } from "./ui";

export default function SettingsPanel({
  content,
  onChange,
}: {
  content: Content;
  onChange: (c: Content) => void;
}) {
  const s = content.settings;
  const set = (patch: Partial<SiteSettings>) =>
    onChange({ ...content, settings: { ...s, ...patch } });
  const hero = (patch: Partial<SiteSettings["hero"]>) =>
    set({ hero: { ...s.hero, ...patch } });
  const about = (patch: Partial<SiteSettings["aboutIntro"]>) =>
    set({ aboutIntro: { ...s.aboutIntro, ...patch } });
  const comm = (patch: Partial<SiteSettings["commerce"]>) =>
    set({ commerce: { ...s.commerce, ...patch } });
  const social = (patch: Partial<SiteSettings["social"]>) =>
    set({ social: { ...s.social, ...patch } });
  const meta = (patch: Partial<SiteSettings["metadata"]>) =>
    set({ metadata: { ...s.metadata, ...patch } });

  return (
    <div className="space-y-8">
      <Section title="Brand">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Site name">
            <TextInput value={s.siteName} onChange={(e) => set({ siteName: e.target.value })} />
          </Field>
          <Field label="Tagline">
            <TextInput value={s.tagline} onChange={(e) => set({ tagline: e.target.value })} />
          </Field>
          <Field label="Contact email">
            <TextInput value={s.contactEmail} onChange={(e) => set({ contactEmail: e.target.value })} />
          </Field>
          <Field label="Announcement" hint="Leave blank to hide the bar">
            <TextInput value={s.announcement} onChange={(e) => set({ announcement: e.target.value })} />
          </Field>
          <Field label="Footer blurb" className="sm:col-span-2">
            <TextArea rows={3} value={s.footerBlurb} onChange={(e) => set({ footerBlurb: e.target.value })} />
          </Field>
        </div>
      </Section>

      <Section title="Homepage hero">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Eyebrow">
              <TextInput value={s.hero.eyebrow} onChange={(e) => hero({ eyebrow: e.target.value })} />
            </Field>
            <Field label="Accent word" hint="Wrapped in italic/ochre if present in a line">
              <TextInput value={s.hero.accentWord} onChange={(e) => hero({ accentWord: e.target.value })} />
            </Field>
          </div>
          <Field label="Headline lines" hint="One line per row">
            <TextArea rows={3} value={s.hero.lines.join("\n")} onChange={(e) => hero({ lines: e.target.value.split("\n") })} />
          </Field>
          <Field label="Subheading">
            <TextArea rows={3} value={s.hero.subheading} onChange={(e) => hero({ subheading: e.target.value })} />
          </Field>
        </div>
      </Section>

      <Section title="About intro">
        <div className="space-y-4">
          <Field label="Heading">
            <TextInput
              value={s.aboutIntro.heading}
              onChange={(e) => about({ heading: e.target.value })}
            />
          </Field>
          <Field label="Body" hint="One paragraph per row">
            <TextArea rows={4} value={s.aboutIntro.body.join("\n")} onChange={(e) => about({ body: e.target.value.split("\n") })} />
          </Field>
          <Field label="Bullet points" hint="One per row">
            <TextArea rows={3} value={s.aboutIntro.points.join("\n")} onChange={(e) => about({ points: e.target.value.split("\n").filter(Boolean) })} />
          </Field>
        </div>
      </Section>

      <Section title="Commerce">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Currency code">
            <TextInput value={s.commerce.currency} onChange={(e) => comm({ currency: e.target.value })} />
          </Field>
          <Field label="UK shipping fee (£)">
            <NumInput value={s.commerce.shippingFee} onChange={(e) => comm({ shippingFee: Number(e.target.value) || 0 })} />
          </Field>
          <Field label="Free UK shipping over (£)" hint="0 = no free UK delivery">
            <NumInput value={s.commerce.freeShippingThreshold} onChange={(e) => comm({ freeShippingThreshold: Number(e.target.value) || 0 })} />
          </Field>
        </div>

        <div className="mt-5 rounded-xl border border-navy/10 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="eyebrow text-steel">International shipping</p>
              <p className="mt-1 max-w-md text-xs text-steel/70">
                Charged at checkout when a shopper selects &ldquo;International / Rest of world&rdquo;. Switch this on once you have your rates.
              </p>
            </div>
            <Toggle checked={s.commerce.internationalEnabled} onChange={(v) => comm({ internationalEnabled: v })} label="Enable" />
          </div>
          {s.commerce.internationalEnabled && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="International shipping fee (£)">
                <NumInput value={s.commerce.internationalShippingFee} onChange={(e) => comm({ internationalShippingFee: Number(e.target.value) || 0 })} />
              </Field>
              <Field label="Free international shipping over (£)" hint="0 = no free international delivery">
                <NumInput value={s.commerce.internationalFreeShippingThreshold} onChange={(e) => comm({ internationalFreeShippingThreshold: Number(e.target.value) || 0 })} />
              </Field>
            </div>
          )}
        </div>

      </Section>

      <Section title="Social links">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Instagram">
            <TextInput value={s.social.instagram} onChange={(e) => social({ instagram: e.target.value })} />
          </Field>
          <Field label="Pinterest">
            <TextInput value={s.social.pinterest} onChange={(e) => social({ pinterest: e.target.value })} />
          </Field>
          <Field label="TikTok">
            <TextInput value={s.social.tiktok} onChange={(e) => social({ tiktok: e.target.value })} />
          </Field>
        </div>
      </Section>

      <Section title="SEO / metadata">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title">
            <TextInput value={s.metadata.title} onChange={(e) => meta({ title: e.target.value })} />
          </Field>
          <Field label="Title template">
            <TextInput value={s.metadata.titleTemplate} onChange={(e) => meta({ titleTemplate: e.target.value })} />
          </Field>
          <Field label="Site URL" className="sm:col-span-2">
            <TextInput value={s.metadata.url} onChange={(e) => meta({ url: e.target.value })} />
          </Field>
          <Field label="Description" className="sm:col-span-2">
            <TextArea rows={3} value={s.metadata.description} onChange={(e) => meta({ description: e.target.value })} />
          </Field>
          <Field label="Keywords" hint="Comma separated" className="sm:col-span-2">
            <TextInput value={s.metadata.keywords.join(", ")} onChange={(e) => meta({ keywords: e.target.value.split(",").map((k) => k.trim()).filter(Boolean) })} />
          </Field>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-navy/10 bg-cream-soft p-6">
      <h2 className="eyebrow mb-5 text-navy">{title}</h2>
      {children}
    </section>
  );
}
