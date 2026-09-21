"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function TicketActions({
  ticketId,
  status,
}: {
  ticketId: string;
  status: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<"resend" | "cancel" | null>(null);
  const [note, setNote] = useState("");

  async function run(action: "resend" | "cancel") {
    setBusy(action);
    setNote("");
    const res = await fetch(`/api/tickets/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticketId }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(null);
    if (!res.ok) {
      setNote(data.error || "Action failed.");
      return;
    }
    setNote(action === "resend" ? "Delivery queued." : "Cancelled.");
    router.refresh();
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => void run("resend")}
          className="text-xs text-maroon underline-offset-2 hover:underline disabled:opacity-40"
        >
          {busy === "resend" ? "Sending…" : "Resend"}
        </button>
        {status === "valid" ? (
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => {
              if (window.confirm("Cancel this pass and free its seats?")) void run("cancel");
            }}
            className="text-xs text-muted underline-offset-2 hover:underline disabled:opacity-40"
          >
            {busy === "cancel" ? "Cancelling…" : "Cancel"}
          </button>
        ) : null}
      </div>
      {note ? <p className="text-[11px] text-muted">{note}</p> : null}
    </div>
  );
}
