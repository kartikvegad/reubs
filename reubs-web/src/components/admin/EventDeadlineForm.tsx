"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function EventDeadlineForm({
  eventId,
  bookingOpensAt,
  bookingClosesAt,
  published,
}: {
  eventId: string;
  bookingOpensAt: string;
  bookingClosesAt: string;
  published: boolean;
}) {
  const router = useRouter();
  const [opens, setOpens] = useState(bookingOpensAt);
  const [closes, setCloses] = useState(bookingClosesAt);
  const [isPublished, setIsPublished] = useState(published);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setNote("");
    const res = await fetch(`/api/admin/events/${eventId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingOpensAt: opens || null,
        bookingClosesAt: closes || null,
        published: isPublished,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setNote(data.error || "Could not save.");
      return;
    }
    setNote("Saved.");
    router.refresh();
  }

  return (
    <form onSubmit={save} className="space-y-3 border border-gold-soft bg-paper p-5">
      <h3 className="font-display text-xl">Registration window</h3>
      <label className="block text-sm">
        Opens at
        <input
          type="datetime-local"
          value={opens}
          onChange={(e) => setOpens(e.target.value)}
          className="mt-1 w-full border border-gold-soft bg-cream px-3 py-2"
        />
      </label>
      <label className="block text-sm">
        Closes at
        <input
          type="datetime-local"
          value={closes}
          onChange={(e) => setCloses(e.target.value)}
          className="mt-1 w-full border border-gold-soft bg-cream px-3 py-2"
        />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
        Published on public site
      </label>
      <button disabled={busy} className="rounded-full bg-maroon px-4 py-2 text-sm text-paper disabled:opacity-40">
        {busy ? "Saving…" : "Save deadlines"}
      </button>
      {note ? <p className="text-xs text-muted">{note}</p> : null}
    </form>
  );
}
