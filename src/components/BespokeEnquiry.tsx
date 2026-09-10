"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  bespokeProducts,
  getProductBySlug,
  type Product,
} from "@/lib/products";
import { MailIcon, OliveIcon } from "./icons";
import { formatGBP } from "@/lib/format";

const STORAGE_KEY = "houseofmerola-bespoke-enquiries";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const inputCls =
  "w-full rounded-lg border border-navy/15 bg-cream px-4 py-3 text-sm text-navy placeholder:text-steel/50 focus:border-ochre focus:outline-none";
const labelCls =
  "mb-2 block text-[0.68rem] font-medium uppercase tracking-[0.2em] text-steel";

export default function BespokeEnquiry({ product }: { product?: Product }) {
  const [pieceSlug, setPieceSlug] = useState(product?.slug ?? bespokeProducts[0]?.slug ?? "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");
  const [notes, setNotes] = useState("");
  const [materialIdx, setMaterialIdx] = useState(0);
  const [sizeIdx, setSizeIdx] = useState(0);
  const [image, setImage] = useState<{ dataUrl: string; name: string } | null>(null);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const piece = getProductBySlug(pieceSlug) ?? bespokeProducts[0];
  const materials = piece?.materialOptions ?? [];
  const sizes = piece?.sizeOptions ?? [];
  const personalisation = piece?.personalisation;
  const material = materials.length ? materials[materialIdx] : null;
  const size = sizes.length ? sizes[sizeIdx] : null;

  const price = useMemo(() => {
    let p = piece?.price ?? 0;
    if (material) p += material.priceDelta;
    if (size) p += size.priceDelta;
    return p;
  }, [piece, material, size]);

  useEffect(() => {
    setMaterialIdx(0);
    setSizeIdx(0);
  }, [pieceSlug]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImage(null);
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Please choose a reference image under 8MB.");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () =>
      setImage({ dataUrl: String(reader.result), name: file.name });
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please add your name.");
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (personalisation?.requiresText && !text.trim()) {
      setError(`Please add ${personalisation.textLabel.toLowerCase()}.`);
      return;
    }
    setError("");

    const body = [
      "New bespoke enquiry — House of Merola",
      "",
      `Piece: ${piece?.name ?? "—"}`,
      material ? `Material: ${material.label}` : "",
      size ? `Size: ${size.label}` : "",
      personalisation?.requiresText
        ? `${personalisation.textLabel}: ${text}`
        : "",
      notes ? `Notes: ${notes}` : "",
      "",
      `Reference image attached separately: ${image ? `${image.name}` : "none"}`,
      "",
      `From: ${name}`,
      `Email: ${email}`,
      "",
      "Please reply to arrange a mock-up and final order.",
    ]
      .filter((l) => l.length)
      .join("\n");

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      arr.push({
        at: Date.now(),
        piece: piece?.slug,
        name,
        email,
        text,
        notes,
        material: material?.label,
        size: size?.label,
        image:
          image && image.dataUrl.length < 1_500_000 ? image.dataUrl : null,
      });
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    } catch {
      /* storage unavailable — the mail client still opens */
    }

    window.location.href = `mailto:hello@houseofmerola.com?subject=${encodeURIComponent(
      `Bespoke enquiry — ${piece?.name ?? "made-to-order piece"}`,
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex h-full min-h-80 flex-col items-center justify-center rounded-2xl border border-ochre/40 bg-cream-soft p-10 text-center">
        <OliveIcon className="h-14 w-14 text-ochre" />
        <h2 className="mt-4 font-serif text-3xl text-navy">Grazie mille!</h2>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-steel">
          Your enquiry has been prepared. Your email app should have opened with
          everything filled in — just press send, and don’t forget to attach
          your reference image if you have one.
        </p>
        <p className="mt-3 max-w-sm text-sm text-steel/80">
          Prefer email? Write to{" "}
          <a href="mailto:hello@houseofmerola.com" className="text-ochre underline">
            hello@houseofmerola.com
          </a>
          .
        </p>
        <Link
          href="/bespoke"
          onClick={() => setSent(false)}
          className="mt-6 rounded-full border border-navy/25 px-7 py-3 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-navy transition hover:border-ochre hover:text-ochre"
        >
          Send another
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5 rounded-2xl border border-navy/10 bg-cream-soft p-6 sm:p-10"
    >
      <h2 className="font-serif text-2xl text-navy">Start a bespoke enquiry</h2>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="b-piece" className={labelCls}>
            What would you like made?
          </label>
          <select
            id="b-piece"
            value={pieceSlug}
            onChange={(e) => setPieceSlug(e.target.value)}
            className={inputCls}
          >
            {bespokeProducts.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        {materials.length > 1 && (
          <div>
            <label htmlFor="b-material" className={labelCls}>
              Material
            </label>
            <select
              id="b-material"
              value={materialIdx}
              onChange={(e) => setMaterialIdx(Number(e.target.value))}
              className={inputCls}
            >
              {materials.map((m, index) => (
                <option key={m.label} value={index}>
                  {m.label}
                  {m.priceDelta > 0 ? ` (+£${m.priceDelta})` : ""}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {sizes.length > 1 && (
        <div>
          <label htmlFor="b-size" className={labelCls}>
            Size
          </label>
          <select
            id="b-size"
            value={sizeIdx}
            onChange={(e) => setSizeIdx(Number(e.target.value))}
            className={inputCls}
          >
            {sizes.map((s, index) => (
              <option key={s.label} value={index}>
                {s.label}
                {s.priceDelta > 0 ? ` (+£${s.priceDelta})` : ""}
              </option>
            ))}
          </select>
        </div>
      )}

      {personalisation?.requiresText && (
        <div>
          <label htmlFor="b-text" className={labelCls}>
            {personalisation.textLabel} <span className="text-oxblood">*</span>
          </label>
          <input
            id="b-text"
            type="text"
            maxLength={personalisation.maxLength}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={inputCls}
            placeholder={personalisation.textPlaceholder}
          />
        </div>
      )}

      {personalisation?.allowsImage && (
        <div>
          <label className={labelCls}>
            Reference image{" "}
            <span className="font-normal normal-case text-steel/60">
              (optional)
            </span>
          </label>
          <label
            htmlFor="b-image"
            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-navy/25 bg-cream px-4 py-4 text-sm text-navy/70 transition hover:border-ochre hover:text-ochre"
          >
            <MailIcon className="h-4 w-4 text-ochre" />
            {image ? image.name : "Choose a photo or reference to upload"}
          </label>
          <input
            id="b-image"
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="sr-only"
          />
          {image && (
            <div className="mt-3 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.dataUrl}
                alt="Reference preview"
                className="h-16 w-16 rounded-md border border-navy/10 object-cover"
              />
              <button
                type="button"
                onClick={() => setImage(null)}
                className="text-xs text-steel underline transition hover:text-oxblood"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      )}

      {personalisation?.notes && (
        <div>
          <label htmlFor="b-notes" className={labelCls}>
            Notes
          </label>
          <textarea
            id="b-notes"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={`${inputCls} resize-none`}
            placeholder="Anything else — colours, occasion, deadline…"
          />
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="b-name" className={labelCls}>
            Your name
          </label>
          <input
            id="b-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputCls}
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="b-email" className={labelCls}>
            Email
          </label>
          <input
            id="b-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls}
            placeholder="you@example.com"
          />
        </div>
      </div>

      {piece && (
        <p className="text-sm text-navy/70">
          Estimated from {formatGBP(price)} — we’ll confirm the exact price with
          your mock-up.
        </p>
      )}
      {error && <p className="text-sm text-oxblood">{error}</p>}
      <button
        type="submit"
        className="rounded-full bg-oxblood px-9 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-cream transition hover:bg-oxblood-deep"
      >
        Send enquiry
      </button>
    </form>
  );
}
