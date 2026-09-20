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

export default function ProductsPanel({
  content,
  onChange,
}: {
  content: Content;
  onChange: (c: Content) => void;
}) {
  const { products } = content;
  const [selected, setSelected] = useState<string | null>(products[0]?.slug ?? null);

  const patch = (slug: string, p: Partial<Product>) =>
    onChange({
      ...content,
      products: products.map((x) => (x.slug === slug ? { ...x, ...p } : x)),
    });

  const add = () => {
    const base = `new-piece-${products.length + 1}`;
    const product: Product = {
      id: base,
      slug: base,
      name: "New piece",
      price: 15,
      image: "/images/prod-madonna-sicilia.jpg",
      collection: content.collections[0]?.slug ?? "",
      materials: ["Original artwork UV-printed onto ceramic"],
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
  };

  const remove = (slug: string) => {
    onChange({ ...content, products: products.filter((x) => x.slug !== slug) });
    if (selected === slug) setSelected(products[0]?.slug ?? null);
  };

  const active = products.find((x) => x.slug === selected) ?? null;

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="eyebrow text-navy">{products.length} pieces</p>
          <AddButton onClick={add}>New piece</AddButton>
        </div>
        <ul className="space-y-1.5">
          {products.map((p) => (
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
                <span className="block text-[0.62rem] uppercase tracking-wide text-steel">
                  £{p.price} · {p.collection}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="rounded-2xl border border-navy/10 bg-cream-soft p-6">
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
        <h2 className="font-serif text-2xl text-navy">{product.name}</h2>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-full border border-oxblood/40 px-4 py-2 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-oxblood transition hover:bg-oxblood hover:text-cream"
        >
          Delete
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
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

      <div className="grid gap-6 sm:grid-cols-2">
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
              className="flex-1"
            />
            <div className="relative w-24 shrink-0">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-steel">+£</span>
              <NumInput
                value={opt.priceDelta}
                onChange={(e) =>
                  onChange(value.map((o, idx) => (idx === i ? { ...o, priceDelta: Number(e.target.value) || 0 } : o)))
                }
                className="pl-9"
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
          className="rounded-full border border-oxblood/40 px-3 py-1.5 text-[0.64rem] font-medium uppercase tracking-[0.14em] text-oxblood transition hover:bg-oxblood hover:text-cream"
        >
          Disable
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Toggle checked={value.requiresText} onChange={(v) => onChange({ ...value, requiresText: v })} label="Require text" />
        <Toggle checked={value.allowsImage} onChange={(v) => onChange({ ...value, allowsImage: v })} label="Allow image upload" />
        <Toggle checked={value.notes} onChange={(v) => onChange({ ...value, notes: v })} label="Notes field" />
        <Field label="Max text length">
          <NumInput value={value.maxLength} onChange={(e) => onChange({ ...value, maxLength: Number(e.target.value) || 0 })} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
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
