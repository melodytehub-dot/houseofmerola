"use client";

import { useState } from "react";
import type { Content } from "@/lib/site";
import type { Collection } from "@/lib/products";
import { Field, TextInput, TextArea, AddButton } from "./ui";
import ImageUploader from "./ImageUploader";

export default function CollectionsPanel({
  content,
  onChange,
}: {
  content: Content;
  onChange: (c: Content) => void;
}) {
  const { collections } = content;
  const [selected, setSelected] = useState<string | null>(collections[0]?.slug ?? null);

  const patch = (slug: string, p: Partial<Collection>) =>
    onChange({
      ...content,
      collections: collections.map((x) => (x.slug === slug ? { ...x, ...p } : x)),
    });

  const add = () => {
    const slug = `new-collection-${collections.length + 1}`;
    const c: Collection = {
      slug,
      name: "New collection",
      tagline: "",
      description: "",
      bannerImage: "/images/collection-mediterranean.jpg",
    };
    onChange({ ...content, collections: [...collections, c] });
    setSelected(slug);
  };

  const remove = (slug: string) => {
    const stillUsed = content.products.some((p) => p.collection === slug);
    if (stillUsed) {
      window.alert("This collection still has products. Move them first.");
      return;
    }
    onChange({ ...content, collections: collections.filter((x) => x.slug !== slug) });
    if (selected === slug) setSelected(collections[0]?.slug ?? null);
  };

  const active = collections.find((x) => x.slug === selected) ?? null;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="min-w-0 space-y-3">
        <div className="flex items-center justify-between">
          <p className="eyebrow text-navy">{collections.length} Collections</p>
          <AddButton onClick={add}>New collection</AddButton>
        </div>
        <ul className="space-y-1.5">
          {collections.map((c) => (
            <li key={c.slug}>
              <button
                type="button"
                onClick={() => setSelected(c.slug)}
                className={`w-full rounded-lg border px-3 py-2.5 text-left transition ${
                  active?.slug === c.slug
                    ? "border-ochre bg-ochre/10"
                    : "border-navy/10 hover:border-navy/25"
                }`}
              >
                <span className="block truncate text-sm font-medium text-navy">{c.name}</span>
                <span className="block text-[0.62rem] tracking-wide text-steel">
                  {content.products.filter((p) => p.collection === c.slug).length} pieces
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="min-w-0 rounded-2xl border border-navy/10 bg-cream-soft p-6">
        {active ? (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <h2 className="min-w-0 font-serif text-2xl text-navy">{active.name}</h2>
              <button
                type="button"
                onClick={() => remove(active.slug)}
                className="shrink-0 rounded-full border border-oxblood/40 px-4 py-2 text-[0.68rem] font-medium tracking-[0.16em] text-oxblood transition hover:bg-oxblood hover:text-cream"
              >
                Delete
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Name">
                <TextInput value={active.name} onChange={(e) => patch(active.slug, { name: e.target.value })} />
              </Field>
              <Field label="Slug" hint="URL: /collections/slug">
                <TextInput value={active.slug} onChange={(e) => patch(active.slug, { slug: e.target.value })} />
              </Field>
              <Field label="Tagline" className="sm:col-span-2">
                <TextInput value={active.tagline} onChange={(e) => patch(active.slug, { tagline: e.target.value })} />
              </Field>
              <ImageUploader
                label="Banner image"
                hint="Upload a file, or paste a path to an existing image."
                className="sm:col-span-2"
                value={active.bannerImage}
                onChange={(bannerImage) => patch(active.slug, { bannerImage })}
              />
              <Field label="Description" className="sm:col-span-2">
                <TextArea rows={4} value={active.description} onChange={(e) => patch(active.slug, { description: e.target.value })} />
              </Field>
            </div>
            <p className="text-xs text-steel">
              You can also point a product at a different collection via the Products tab.
            </p>
          </div>
        ) : (
          <p className="py-16 text-center text-navy/50">Select a collection to edit.</p>
        )}
      </div>
    </div>
  );
}
