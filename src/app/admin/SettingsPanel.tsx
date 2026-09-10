"use client";

import type { Content, SiteSettings } from "@/lib/site";
import { Field, TextInput, TextArea, NumInput, AddButton } from "./ui";

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
          <Field label="Shipping fee (£)">
            <NumInput value={s.commerce.shippingFee} onChange={(e) => comm({ shippingFee: Number(e.target.value) || 0 })} />
          </Field>
          <Field label="Free shipping threshold (£)">
            <NumInput value={s.commerce.freeShippingThreshold} onChange={(e) => comm({ freeShippingThreshold: Number(e.target.value) || 0 })} />
          </Field>
          <Field label="Delivery note">
            <TextInput value={s.commerce.deliveryNote} onChange={(e) => comm({ deliveryNote: e.target.value })} />
          </Field>
          <Field label="Welcome code">
            <TextInput value={s.commerce.welcomeCode} onChange={(e) => comm({ welcomeCode: e.target.value })} />
          </Field>
          <Field label="Welcome code %">
            <NumInput value={s.commerce.welcomeCodePercent} onChange={(e) => comm({ welcomeCodePercent: Number(e.target.value) || 0 })} />
          </Field>
        </div>
        <div className="mt-5 rounded-xl border border-navy/10 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="eyebrow text-steel">Discount codes</p>
            <AddButton onClick={() => comm({ discountCodes: { ...s.commerce.discountCodes, NEW: 10 } })}>
              Add code
            </AddButton>
          </div>
          {Object.keys(s.commerce.discountCodes).length === 0 ? (
            <p className="text-sm text-steel/70">No codes yet.</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(s.commerce.discountCodes).map(([code, percent]) => (
                <div key={code} className="flex items-center gap-2">
                  <TextInput
                    value={code}
                    onChange={(e) => {
                      const next = { ...s.commerce.discountCodes };
                      next[e.target.value.toUpperCase()] = percent;
                      delete next[code];
                      comm({ discountCodes: next });
                    }}
                    placeholder="CODE"
                    className="w-40"
                  />
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-steel">%</span>
                    <NumInput
                      value={percent}
                      onChange={(e) =>
                        comm({ discountCodes: { ...s.commerce.discountCodes, [code]: Number(e.target.value) || 0 } })
                      }
                      className="pl-8"
                    />
                  </div>
                  <button
                    type="button"
                    aria-label="Remove"
                    onClick={() => {
                      const next = { ...s.commerce.discountCodes };
                      delete next[code];
                      comm({ discountCodes: next });
                    }}
                    className="shrink-0 rounded-full border border-navy/15 px-2.5 py-2 text-xs text-steel transition hover:border-oxblood hover:text-oxblood"
                  >
                    ×
                  </button>
                </div>
              ))}
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
