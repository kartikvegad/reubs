"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function TeacherForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setNote("");
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/admin/teachers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        department: form.get("department"),
        className: form.get("className") || null,
        section: form.get("section") ? String(form.get("section")).toUpperCase() : null,
        active: true,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setNote(data.error || "Could not save teacher.");
      return;
    }
    setNote("Teacher added.");
    event.currentTarget.reset();
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="grid gap-3 border border-gold-soft bg-paper p-5 md:grid-cols-2">
      <h3 className="font-display text-xl md:col-span-2">Add teacher</h3>
      {(
        [
          ["name", "Name"],
          ["email", "Email"],
          ["phone", "Phone"],
          ["department", "Department"],
          ["className", "Class teacher of (optional)"],
          ["section", "Section (optional)"],
        ] as const
      ).map(([name, label]) => (
        <label key={name} className="block text-sm">
          {label}
          <input
            name={name}
            required={!label.includes("optional")}
            type={name === "email" ? "email" : "text"}
            className="mt-1 w-full border border-gold-soft bg-cream px-3 py-2"
          />
        </label>
      ))}
      <div className="md:col-span-2">
        <button disabled={busy} className="rounded-full bg-maroon px-4 py-2 text-sm text-paper disabled:opacity-40">
          {busy ? "Saving…" : "Add teacher"}
        </button>
        {note ? <p className="mt-2 text-xs text-muted">{note}</p> : null}
      </div>
    </form>
  );
}
