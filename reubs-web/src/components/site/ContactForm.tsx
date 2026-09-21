"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries())),
    });
    setBusy(false);
    setStatus(res.ok ? "sent" : "error");
  }

  if (status === "sent") {
    return (
      <div className="border border-sage bg-paper p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-sage">Received</p>
        <p className="mt-2 font-display text-3xl">Thank you</p>
        <p className="mt-3 leading-7 text-muted">
          The office will use this enquiry as a record. For the live session, connect this form to the
          school inbox.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 border border-gold-soft bg-paper p-6">
      <label className="block text-sm">
        Name
        <input required name="name" className="mt-2 w-full border border-gold-soft bg-cream px-3 py-3" />
      </label>
      <label className="block text-sm">
        I am a
        <select name="role" className="mt-2 w-full border border-gold-soft bg-cream px-3 py-3">
          <option>Parent / Guardian</option>
          <option>Student</option>
          <option>Visitor</option>
        </select>
      </label>
      <label className="block text-sm">
        Phone
        <input required name="phone" className="mt-2 w-full border border-gold-soft bg-cream px-3 py-3" />
      </label>
      <label className="block text-sm">
        Email
        <input required type="email" name="email" className="mt-2 w-full border border-gold-soft bg-cream px-3 py-3" />
      </label>
      <label className="block text-sm">
        Grade / Class
        <input name="grade" placeholder="e.g. Class 5" className="mt-2 w-full border border-gold-soft bg-cream px-3 py-3" />
      </label>
      <label className="block text-sm">
        Enquiry
        <textarea required name="message" rows={5} className="mt-2 w-full border border-gold-soft bg-cream px-3 py-3" />
      </label>
      <button disabled={busy} className="rounded-full bg-maroon px-5 py-3 text-paper">
        {busy ? "Sending…" : "Submit enquiry"}
      </button>
      {status === "error" ? <p className="text-sm text-maroon">Please try again, or call the office.</p> : null}
    </form>
  );
}
