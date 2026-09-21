"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function StudentForm({
  mode = "create",
  initial,
}: {
  mode?: "create" | "edit";
  initial?: {
    id: string;
    enrollmentNumber: string;
    name: string;
    className: string;
    section: string;
    parentName: string;
    parentPhone: string;
    parentEmail?: string | null;
    active: boolean;
  };
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setNote("");
    const form = new FormData(event.currentTarget);
    const payload = {
      enrollmentNumber: String(form.get("enrollmentNumber") || "").toUpperCase(),
      name: form.get("name"),
      className: form.get("className"),
      section: String(form.get("section") || "").toUpperCase(),
      parentName: form.get("parentName"),
      parentPhone: form.get("parentPhone"),
      parentEmail: form.get("parentEmail") || null,
      active: form.get("active") === "on",
    };

    const res = await fetch(mode === "edit" ? `/api/admin/students/${initial!.id}` : "/api/admin/students", {
      method: mode === "edit" ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setNote(data.error || "Could not save student.");
      return;
    }
    setNote(mode === "edit" ? "Updated." : "Student added.");
    if (mode === "create") event.currentTarget.reset();
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="grid gap-3 border border-gold-soft bg-paper p-5 md:grid-cols-2">
      <h3 className="font-display text-xl md:col-span-2">{mode === "edit" ? "Edit student" : "Add student"}</h3>
      {(
        [
          ["enrollmentNumber", "Enrollment no.", initial?.enrollmentNumber || ""],
          ["name", "Student name", initial?.name || ""],
          ["className", "Standard / class", initial?.className || ""],
          ["section", "Section", initial?.section || ""],
          ["parentName", "Parent / guardian", initial?.parentName || ""],
          ["parentPhone", "Parent phone", initial?.parentPhone || ""],
          ["parentEmail", "Parent email", initial?.parentEmail || ""],
        ] as const
      ).map(([name, label, value]) => (
        <label key={name} className="block text-sm">
          {label}
          <input
            name={name}
            defaultValue={value}
            required={name !== "parentEmail"}
            className="mt-1 w-full border border-gold-soft bg-cream px-3 py-2"
          />
        </label>
      ))}
      <label className="flex items-center gap-2 text-sm md:col-span-2">
        <input name="active" type="checkbox" defaultChecked={initial?.active ?? true} />
        Active on roll
      </label>
      <div className="md:col-span-2">
        <button disabled={busy} className="rounded-full bg-maroon px-4 py-2 text-sm text-paper disabled:opacity-40">
          {busy ? "Saving…" : mode === "edit" ? "Save changes" : "Add student"}
        </button>
        {note ? <p className="mt-2 text-xs text-muted">{note}</p> : null}
      </div>
    </form>
  );
}
