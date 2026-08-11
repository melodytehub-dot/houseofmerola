"use client";

import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Enquiry from ${name.trim() || "the website"}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:hello@houseofmerola.com?subject=${subject}&body=${body}`;
    setSent(true);
  };

  if (sent) {
    return (
      <div className="animate-scale-in border border-ochre/40 bg-cream/5 px-6 py-10 text-center">
        <p className="font-serif text-3xl text-ochre-light">Thank you</p>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-cream/70">
          Your message is ready in your email app — just press send and we&rsquo;ll
          reply within two working days. Or write to us directly at{" "}
          <a
            href="mailto:hello@houseofmerola.com"
            className="text-ochre-light underline underline-offset-2"
          >
            hello@houseofmerola.com
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-6 text-[10px] uppercase tracking-[0.3em] text-ochre-light underline underline-offset-4 transition-colors hover:text-ochre"
        >
          Write another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label
          htmlFor="contact-name"
          className="mb-2 block text-[10px] font-medium uppercase tracking-[0.28em] text-cream/50"
        >
          Your name
        </label>
        <input
          id="contact-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Smith"
          className="w-full border border-cream/25 bg-cream/5 px-5 py-3.5 text-sm text-cream transition-colors placeholder:text-cream/35 focus:border-ochre/70 focus:outline-none"
        />
      </div>
      <div>
        <label
          htmlFor="contact-email"
          className="mb-2 block text-[10px] font-medium uppercase tracking-[0.28em] text-cream/50"
        >
          Email address
        </label>
        <input
          id="contact-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jane@example.com"
          className="w-full border border-cream/25 bg-cream/5 px-5 py-3.5 text-sm text-cream transition-colors placeholder:text-cream/35 focus:border-ochre/70 focus:outline-none"
        />
      </div>
      <div>
        <label
          htmlFor="contact-message"
          className="mb-2 block text-[10px] font-medium uppercase tracking-[0.28em] text-cream/50"
        >
          Your message
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about the piece you're looking for…"
          className="w-full resize-y border border-cream/25 bg-cream/5 px-5 py-3.5 text-sm text-cream transition-colors placeholder:text-cream/35 focus:border-ochre/70 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="mt-2 bg-oxblood px-8 py-4 text-[10px] font-medium uppercase tracking-[0.3em] text-cream transition-all duration-300 hover:bg-oxblood-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ochre"
      >
        Send message
      </button>
      <p className="text-[10px] leading-relaxed text-cream/35">
        Submitting opens your email app with the message pre-filled — nothing is
        stored on this site.
      </p>
    </form>
  );
}
