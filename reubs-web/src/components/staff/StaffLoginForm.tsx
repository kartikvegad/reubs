"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function StaffLoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, next }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Could not sign in.");
      return;
    }
    router.push(data.redirect || next);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <label className="block text-sm">
        Staff email
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full border border-white/20 bg-white/5 px-3 py-3 text-paper"
        />
      </label>
      <label className="block text-sm">
        Password
        <input
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full border border-white/20 bg-white/5 px-3 py-3 text-paper"
        />
      </label>
      <button disabled={busy} className="w-full rounded-full bg-gold px-5 py-3 text-ink">
        {busy ? "Signing in…" : "Enter scanner"}
      </button>
      {error ? <p className="text-sm text-gold">{error}</p> : null}
    </form>
  );
}
