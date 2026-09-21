"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CashRequestActions({ requestId, status }: { requestId: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState<"approve" | "reject" | null>(null);
  const [note, setNote] = useState("");

  async function run(action: "approve" | "reject") {
    setBusy(action);
    setNote("");
    const res = await fetch(`/api/admin/cash-requests/${requestId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(null);
    if (!res.ok) {
      setNote(data.error || "Action failed.");
      return;
    }
    setNote(action === "approve" ? "Approved and ticket issued." : "Rejected.");
    router.refresh();
  }

  if (status !== "pending") {
    return <span className="text-xs capitalize text-muted">{status}</span>;
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2">
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => void run("approve")}
          className="text-xs text-maroon underline-offset-2 hover:underline disabled:opacity-40"
        >
          {busy === "approve" ? "Approving…" : "Approve + issue"}
        </button>
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => void run("reject")}
          className="text-xs text-muted underline-offset-2 hover:underline disabled:opacity-40"
        >
          {busy === "reject" ? "Rejecting…" : "Reject"}
        </button>
      </div>
      {note ? <p className="text-[11px] text-muted">{note}</p> : null}
    </div>
  );
}

export function CashRequestCreateForm({
  events,
  students,
}: {
  events: { id: string; title: string }[];
  students: { id: string; enrollmentNumber: string; name: string }[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setNote("");
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/admin/cash-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId: form.get("eventId"),
        studentId: form.get("studentId"),
        buyerName: form.get("buyerName"),
        buyerEmail: form.get("buyerEmail"),
        buyerPhone: form.get("buyerPhone"),
        quantity: Number(form.get("quantity") || 1),
        seats: String(form.get("seats") || ""),
        note: form.get("note") || "",
      }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setNote(data.error || "Could not create request.");
      return;
    }
    setNote("Cash request logged.");
    event.currentTarget.reset();
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="grid gap-3 border border-gold-soft bg-paper p-5 md:grid-cols-2">
      <h3 className="font-display text-xl md:col-span-2">Log cash ticket request</h3>
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
              {item.enrollmentNumber} · {item.name}
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
        Quantity
        <input name="quantity" type="number" min={1} max={5} defaultValue={1} className="mt-1 w-full border border-gold-soft bg-cream px-3 py-2" />
      </label>
      <label className="block text-sm md:col-span-2">
        Preferred seats (optional)
        <input name="seats" placeholder="A1,A2" className="mt-1 w-full border border-gold-soft bg-cream px-3 py-2" />
      </label>
      <label className="block text-sm md:col-span-2">
        Note
        <input name="note" placeholder="Paid at front desk / will pay tomorrow" className="mt-1 w-full border border-gold-soft bg-cream px-3 py-2" />
      </label>
      <div className="md:col-span-2">
        <button disabled={busy} className="rounded-full bg-maroon px-4 py-2 text-sm text-paper disabled:opacity-40">
          {busy ? "Saving…" : "Create cash request"}
        </button>
        {note ? <p className="mt-2 text-xs text-muted">{note}</p> : null}
      </div>
    </form>
  );
}
