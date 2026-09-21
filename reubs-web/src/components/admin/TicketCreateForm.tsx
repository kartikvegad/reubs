"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function TicketCreateForm({
  events,
  students,
}: {
  events: { id: string; title: string; priceInPaise: number }[];
  students: { id: string; enrollmentNumber: string; name: string; className: string; section: string }[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setNote("");
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/admin/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId: form.get("eventId"),
        studentId: form.get("studentId"),
        buyerName: form.get("buyerName"),
        buyerEmail: form.get("buyerEmail"),
        buyerPhone: form.get("buyerPhone"),
        seats: String(form.get("seats") || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        paymentMethod: form.get("paymentMethod"),
        officeNote: form.get("officeNote"),
      }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setNote(data.error || "Could not create ticket.");
      return;
    }
    setNote("Ticket issued.");
    event.currentTarget.reset();
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="grid gap-3 border border-gold-soft bg-paper p-5 md:grid-cols-2">
      <h3 className="font-display text-xl md:col-span-2">Issue ticket (office / cash)</h3>
      <label className="block text-sm">
        Event
        <select name="eventId" required className="mt-1 w-full border border-gold-soft bg-cream px-3 py-2">
          {events.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        Student
        <select name="studentId" required className="mt-1 w-full border border-gold-soft bg-cream px-3 py-2">
          {students.map((item) => (
            <option key={item.id} value={item.id}>
              {item.enrollmentNumber} · {item.name} · {item.className}-{item.section}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        Buyer name
        <input name="buyerName" required className="mt-1 w-full border border-gold-soft bg-cream px-3 py-2" />
      </label>
      <label className="block text-sm">
        Buyer email
        <input name="buyerEmail" type="email" required className="mt-1 w-full border border-gold-soft bg-cream px-3 py-2" />
      </label>
      <label className="block text-sm">
        Buyer phone
        <input name="buyerPhone" required className="mt-1 w-full border border-gold-soft bg-cream px-3 py-2" />
      </label>
      <label className="block text-sm">
        Seats (comma-separated)
        <input name="seats" placeholder="A1,A2" className="mt-1 w-full border border-gold-soft bg-cream px-3 py-2" />
      </label>
      <label className="block text-sm">
        Payment method
        <select name="paymentMethod" className="mt-1 w-full border border-gold-soft bg-cream px-3 py-2">
          <option value="cash">Cash at office</option>
          <option value="online">Marked online</option>
          <option value="free">Free / complimentary</option>
        </select>
      </label>
      <label className="block text-sm md:col-span-2">
        Office note
        <input name="officeNote" className="mt-1 w-full border border-gold-soft bg-cream px-3 py-2" />
      </label>
      <div className="md:col-span-2">
        <button disabled={busy} className="rounded-full bg-maroon px-4 py-2 text-sm text-paper disabled:opacity-40">
          {busy ? "Issuing…" : "Issue ticket"}
        </button>
        {note ? <p className="mt-2 text-xs text-muted">{note}</p> : null}
      </div>
    </form>
  );
}
