"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import { MailIcon, OliveIcon } from "@/components/icons";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      setError("Please add your name and a message.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSent(true);
  };

  return (
    <>
      <section className="border-b border-navy/10 bg-cream">
        <Reveal className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:py-24">
          <p className="eyebrow text-ochre">Contact</p>
          <h1 className="mt-4 font-serif text-4xl text-navy sm:text-6xl">
            Let’s talk
          </h1>
          <p className="mx-auto mt-5 max-w-lg leading-relaxed text-navy/70">
            Commissions, wholesale, press or just a hello. We read every
            message and answer within two working days.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Info */}
          <Reveal className="space-y-8 lg:col-span-2">
            <div>
              <h2 className="font-serif text-2xl text-navy">The studio</h2>
              <p className="mt-3 text-sm leading-relaxed text-navy/70">
                House of Merola is a small studio: tiles painted, boards
                engraved, and parcels wrapped by hand.
              </p>
            </div>
            <div className="space-y-4 text-sm">
              <p className="flex items-center gap-3 text-navy/80">
                <MailIcon className="h-4 w-4 text-ochre" />
                <a
                  href="mailto:hello@houseofmerola.com"
                  className="transition hover:text-ochre"
                >
                  hello@houseofmerola.com
                </a>
              </p>
            </div>
            <div className="rounded-xl border border-navy/10 bg-cream-soft p-6">
              <p className="font-serif text-xl italic text-navy">
                “Looking for something specific?”
              </p>
              <p className="mt-2 text-sm leading-relaxed text-steel">
                Bespoke tiles and personalised study boards are our favourite
                commissions; share your idea and we’ll paint the first sketch.
              </p>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={120} className="lg:col-span-3">
            {sent ? (
              <div className="flex h-full min-h-80 flex-col items-center justify-center rounded-2xl border border-ochre/40 bg-cream-soft p-10 text-center">
                <OliveIcon className="h-14 w-14 text-ochre" />
                <h2 className="mt-4 font-serif text-3xl text-navy">
                  Grazie mille!
                </h2>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-steel">
                  Your message has been received. We’ll be in touch within two
                  working days.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="space-y-5 rounded-2xl border border-navy/10 bg-cream-soft p-6 sm:p-10"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-[0.68rem] font-medium uppercase tracking-[0.2em] text-steel"
                    >
                      Your name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-lg border border-navy/15 bg-cream px-4 py-3 text-sm text-navy placeholder:text-steel/50 focus:border-ochre focus:outline-none"
                      placeholder="Maria Rossi"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-[0.68rem] font-medium uppercase tracking-[0.2em] text-steel"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="w-full rounded-lg border border-navy/15 bg-cream px-4 py-3 text-sm text-navy placeholder:text-steel/50 focus:border-ochre focus:outline-none"
                      placeholder="maria@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-[0.68rem] font-medium uppercase tracking-[0.2em] text-steel"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    className="w-full resize-none rounded-lg border border-navy/15 bg-cream px-4 py-3 text-sm text-navy placeholder:text-steel/50 focus:border-ochre focus:outline-none"
                    placeholder="Tell us what you have in mind…"
                  />
                </div>
                {error && <p className="text-sm text-oxblood">{error}</p>}
                <button
                  type="submit"
                  className="rounded-full bg-oxblood px-9 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-cream transition hover:bg-oxblood-deep"
                >
                  Send message
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </>
  );
}
