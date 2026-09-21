"use client";

import { useState } from "react";
import type { Content } from "@/lib/site";
import type { PersonalisationConfig, Product, ProductOption } from "@/lib/products";
import {
  Field,
  TextInput,
  TextArea,
  NumInput,
  Select,
  Toggle,
  AddButton,
} from "./ui";
import ImageUploader from "./ImageUploader";

const PAGE_SIZE = 5;

export default function ProductsPanel({
  content,
  onChange,
}: {
  content: Content;
  onChange: (c: Content) => void;
}) {
  const { products } = content;
  const [selected, setSelected] = useState<string | null>(products[0]?.slug ?? null);
  const [page, setPage] = useState(0);

  const pageCount = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const current = Math.min(page, pageCount - 1);
  const visible = products.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE);

  const patch = (slug: string, p: Partial<Product>) => {
    let next = p.slug?.trim() ? p.slug.trim() : undefined;
    if (next && products.some((x) => x.slug !== slug && x.slug === next)) {
      let n = 2;
      while (products.some((x) => x.slug !== slug && x.slug === `${next}-${n}`)) n += 1;
      next = `${next}-${n}`;
    }
    onChange({
      ...content,
      products: products.map((x) =>
        x.slug === slug ? { ...x, ...p, ...(next ? { slug: next } : {}) } : x,
      ),
    });
    if (next && selected === slug) setSelected(next);
  };

  const add = () => {
    let n = products.length + 1;
    let base = `new-piece-${n}`;
    while (products.some((x) => x.slug === base)) {
      n += 1;
      base = `new-piece-${n}`;
    }
    const product: Product = {
      id: base,
      slug: base,
      name: "New piece",
      price: 15,
      image: "/images/prod-madonna-sicilia.jpg",
      collection: content.collections[0]?.slug ?? "",
      materials: ["House of Merola artwork UV-printed onto ceramic"],
      tagline: "",
      description: "",
      featured: false,
      madeToOrder: false,
      materialOptions: [],
      sizeOptions: [],
      personalisation: undefined,
    };
    onChange({ ...content, products: [...products, product] });
    setSelected(base);
    setPage(Math.ceil((products.length + 1) / PAGE_SIZE) - 1);
  };

  const remove = (slug: string) => {
    const next = products.filter((x) => x.slug !== slug);
    onChange({ ...content, products: next });
    if (selected === slug) {
      setSelected(next[0]?.slug ?? null);
      setPage(0);
    }
  };

  const active = products.find((x) => x.slug === selected) ?? null;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="min-w-0 space-y-3">
        <div className="flex items-center justify-between">
          <p className="eyebrow text-navy">Pieces</p>
          <AddButton onClick={add}>New piece</AddButton>
        </div>
        <ul className="space-y-1.5">
          {visible.map((p) => (
            <li key={p.slug}>
              <button
                type="button"
                onClick={() => setSelected(p.slug)}
                className={`w-full rounded-lg border px-3 py-2.5 text-left transition ${
                  active?.slug === p.slug
                    ? "border-ochre bg-ochre/10"
                    : "border-navy/10 hover:border-navy/25"
                }`}
              >
                <span className="block truncate text-sm font-medium text-navy">
                  {p.name}
                </span>
                <span className="block text-[0.62rem] tracking-wide text-steel">
                  £{p.price} · {content.collections.find((c) => c.slug === p.collection)?.name ?? p.collection}
                </span>
              </button>
            </li>
          ))}
        </ul>
        {pageCount > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
            <button
              type="button"
              onClick={() => setPage(current - 1)}
              disabled={current === 0}
              aria-label="Previous page"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-navy/15 text-navy transition hover:border-ochre hover:text-ochre disabled:opacity-40"
            >
              ←
            </button>
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i)}
                aria-label={`Page ${i + 1}`}
                aria-current={i === current ? "page" : undefined}
                className={`h-8 min-w-8 rounded-full px-2 text-xs font-medium transition ${
                  i === current
                    ? "bg-navy text-cream"
                    : "border border-navy/15 text-navy hover:border-ochre hover:text-ochre"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage(current + 1)}
              disabled={current >= pageCount - 1}
              aria-label="Next page"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-navy/15 text-navy transition hover:border-ochre hover:text-ochre disabled:opacity-40"
            >
              →
            </button>
          </div>
        )}
        <p className="pt-1 text-center text-xs text-steel/70">
          Page {current + 1} of {pageCount} · {products.length} pieces
        </p>
      </aside>

      <div className="min-w-0 rounded-2xl border border-navy/10 bg-cream-soft p-6">
        {active ? (
          <ProductForm
            product={active}
            collections={content.collections}
            onPatch={(p) => patch(active.slug, p)}
            onDelete={() => remove(active.slug)}
          />
        ) : (
          <p className="py-16 text-center text-navy/50">Select a piece to edit.</p>
        )}
      </div>
    </div>
  );
}

interface ProductFormProps {
  product: Product;
  collections: Content["collections"];
  onPatch: (patch: Partial<Product>) => void;
  onDelete: () => void;
}

function ProductForm({ product, collections, onPatch, onDelete }: ProductFormProps) {
  const [materialsText, setMaterialsText] = useState(product.materials.join(", "));
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <h2 className="min-w-0 font-serif text-2xl text-navy">{product.name}</h2>
        <button
          type="button"
          onClick={onDelete}
          className="shrink-0 rounded-full border border-oxblood/40 px-4 py-2 text-[0.68rem] font-medium tracking-[0.16em] text-oxblood transition hover:bg-oxblood hover:text-cream"
        >
          Delete
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Name">
          <TextInput value={product.name} onChange={(e) => onPatch({ name: e.target.value })} />
        </Field>
        <Field label="Slug" hint="URL: /shop/slug">
          <TextInput value={product.slug} onChange={(e) => onPatch({ slug: e.target.value })} />
        </Field>
        <Field label="Base price (£)">
          <NumInput
            value={product.price}
            onChange={(e) => onPatch({ price: Number(e.target.value) || 0 })}
          />
        </Field>
        <Field label="Collection">
          <Select
            value={product.collection}
            onChange={(e) => onPatch({ collection: e.target.value })}
          >
            {collections.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </Select>
        </Field>
        <ImageUploader
          label="Image"
          hint="Upload a file, or paste a path to an existing image."
          className="sm:col-span-2"
          value={product.image}
          onChange={(image) => onPatch({ image })}
        />
        <Field label="Additional images" hint="One image path per line" className="sm:col-span-2">
          <TextArea
            rows={3}
            value={(product.images ?? []).join("\n")}
            onChange={(e) =>
              onPatch({ images: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })
            }
          />
        </Field>
        <Field label="Tagline" className="sm:col-span-2">
          <TextInput value={product.tagline} onChange={(e) => onPatch({ tagline: e.target.value })} />
        </Field>
        <Field label="Description" className="sm:col-span-2">
          <TextArea rows={4} value={product.description} onChange={(e) => onPatch({ description: e.target.value })} />
        </Field>
        <Field label="Materials" hint="Comma separated" className="sm:col-span-2">
          <TextInput
            value={materialsText}
            onChange={(e) => {
              setMaterialsText(e.target.value);
              onPatch({
                materials: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
              });
            }}
          />
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-6 border-y border-navy/10 py-4">
        <Toggle checked={Boolean(product.featured)} onChange={(v) => onPatch({ featured: v })} label="Featured" />
        <Toggle checked={Boolean(product.madeToOrder)} onChange={(v) => onPatch({ madeToOrder: v })} label="Made to order (Enquire)" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <OptionsEditor
          label="Material options"
          value={product.materialOptions ?? []}
          onChange={(v) => onPatch({ materialOptions: v })}
        />
        <OptionsEditor
          label="Size options"
          value={product.sizeOptions ?? []}
          onChange={(v) => onPatch({ sizeOptions: v })}
        />
      </div>

      <PersonalisationEditor
        value={product.personalisation}
        onChange={(v) => onPatch({ personalisation: v })}
      />
    </div>
  );
}

function OptionsEditor({
  label,
  value,
  onChange,
}: {
  label: string;
  value: ProductOption[];
  onChange: (v: ProductOption[]) => void;
}) {
  if (value.length === 0) {
    return (
      <div className="rounded-xl border border-navy/10 p-4">
        <p className="eyebrow mb-3 text-steel">{label}</p>
        <AddButton onClick={() => onChange([{ label: "", priceDelta: 0 }])}>
          Add {label.toLowerCase()}
        </AddButton>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-navy/10 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="eyebrow text-steel">{label}</p>
        <AddButton onClick={() => onChange([...value, { label: "", priceDelta: 0 }])}>Add</AddButton>
      </div>
      <div className="space-y-2">
        {value.map((opt, i) => (
          <div key={i} className="flex items-center gap-2">
            <TextInput
              value={opt.label}
              placeholder="Label e.g. 15 × 15 cm"
              onChange={(e) =>
                onChange(value.map((o, idx) => (idx === i ? { ...o, label: e.target.value } : o)))
              }
              className="min-w-0 flex-1"
            />
            <div className="relative w-20 shrink-0 sm:w-24">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-steel">+£</span>
              <NumInput
                value={opt.priceDelta}
                onChange={(e) =>
                  onChange(value.map((o, idx) => (idx === i ? { ...o, priceDelta: Number(e.target.value) || 0 } : o)))
                }
                className="pl-8"
              />
            </div>
            <button
              type="button"
              aria-label="Remove"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="shrink-0 rounded-full border border-navy/15 px-2.5 py-2 text-xs text-steel transition hover:border-oxblood hover:text-oxblood"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PersonalisationEditor({
  value,
  onChange,
}: {
  value?: PersonalisationConfig;
  onChange: (v: PersonalisationConfig | undefined) => void;
}) {
  if (!value) {
    return (
      <div className="rounded-xl border border-navy/10 p-4">
        <p className="eyebrow mb-1 text-steel">Personalisation</p>
        <p className="mb-3 text-sm text-steel/80">
          For bespoke pieces, require a name/text and offer an image upload.
        </p>
        <AddButton
          onClick={() =>
            onChange({
              requiresText: true,
              textLabel: "Name / text to feature",
              textPlaceholder: "e.g. Merola, or Con amore · 2026",
              maxLength: 80,
              allowsImage: true,
              notes: true,
            })
          }
        >
          Enable personalisation
        </AddButton>
      </div>
    );
  }
  return (
    <div className="space-y-4 rounded-xl border border-navy/10 p-4">
      <div className="flex items-center justify-between">
        <p className="eyebrow text-steel">Personalisation</p>
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className="rounded-full border border-oxblood/40 px-3 py-1.5 text-[0.64rem] font-medium tracking-[0.14em] text-oxblood transition hover:bg-oxblood hover:text-cream"
        >
          Disable
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Toggle checked={value.requiresText} onChange={(v) => onChange({ ...value, requiresText: v })} label="Require text" />
        <Toggle checked={value.allowsImage} onChange={(v) => onChange({ ...value, allowsImage: v })} label="Allow image upload" />
        <Toggle checked={value.notes} onChange={(v) => onChange({ ...value, notes: v })} label="Notes field" />
        <Field label="Max text length">
          <NumInput value={value.maxLength} onChange={(e) => onChange({ ...value, maxLength: Number(e.target.value) || 0 })} />
        </Field>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Text label">
          <TextInput value={value.textLabel} onChange={(e) => onChange({ ...value, textLabel: e.target.value })} />
        </Field>
        <Field label="Text placeholder">
          <TextInput value={value.textPlaceholder} onChange={(e) => onChange({ ...value, textPlaceholder: e.target.value })} />
        </Field>
      </div>
    </div>
  );
}
