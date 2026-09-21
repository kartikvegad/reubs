"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type ScanResult = {
  result: "valid" | "used" | "invalid";
  headline?: string;
  message: string;
  ticket?: {
    code?: string;
    event: string;
    venue?: string;
    student: string;
    enrollmentNumber: string;
    className: string;
    quantity: number;
    seats?: string;
    buyerName: string;
    scannedAt?: string | null;
    scannedGate?: string | null;
    scannedBy?: string | null;
  };
};

export function ScannerApp({ staffName }: { staffName: string }) {
  const router = useRouter();
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [manual, setManual] = useState("");
  const [gate, setGate] = useState("Main gate");
  const gateRef = useRef(gate);
  const [outcome, setOutcome] = useState<ScanResult | null>(null);
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);

  useEffect(() => {
    gateRef.current = gate;
  }, [gate]);

  async function check(payload: string) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    const res = await fetch("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload, gate: gateRef.current }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setOutcome({ result: "invalid", headline: "Scan failed", message: data.error || "Scan failed." });
    } else {
      setOutcome(data);
    }
    setTimeout(() => {
      lock.current = false;
    }, 1500);
  }

  useEffect(() => {
    let scanner: { clear: () => Promise<void> } | null = null;
    let cancelled = false;

    async function start() {
      const { Html5QrcodeScanner } = await import("html5-qrcode");
      if (cancelled || !hostRef.current) return;
      const instance = new Html5QrcodeScanner(
        "reubs-scanner",
        { fps: 8, qrbox: { width: 240, height: 240 }, rememberLastUsedCamera: true },
        false,
      );
      instance.render(
        (text) => {
          void check(text);
        },
        () => undefined,
      );
      scanner = instance;
      setReady(true);
    }

    void start();
    return () => {
      cancelled = true;
      void scanner?.clear();
    };
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/scan/login");
    router.refresh();
  }

  const tone =
    outcome?.result === "valid"
      ? "bg-sage"
      : outcome?.result === "used"
        ? "bg-gold text-ink"
        : outcome
          ? "bg-maroon"
          : "bg-white/5";

  return (
    <main className="min-h-screen bg-ink px-4 py-6 text-paper">
      <div className="mx-auto max-w-md">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold">REUBS gate</p>
            <h1 className="font-display text-3xl">Scan pass</h1>
            <p className="text-sm text-gold-soft">{staffName}</p>
          </div>
          <button onClick={logout} className="text-sm text-gold">
            Sign out
          </button>
        </div>

        <label className="mt-5 block text-sm text-gold-soft">
          Gate
          <select
            value={gate}
            onChange={(e) => setGate(e.target.value)}
            className="mt-2 w-full border border-white/20 bg-white/5 px-3 py-3 text-paper"
          >
            <option>Main gate</option>
            <option>Gate 2</option>
            <option>Gate 3</option>
            <option>VIP gate</option>
            <option>Staff gate</option>
          </select>
        </label>

        <div id="reubs-scanner" ref={hostRef} className="mt-6 overflow-hidden rounded-xl bg-black" />
        {!ready ? <p className="mt-3 text-sm text-gold-soft">Starting camera…</p> : null}

        <form
          className="mt-6 flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            void check(manual);
          }}
        >
          <input
            value={manual}
            onChange={(e) => setManual(e.target.value)}
            placeholder="Or paste QR payload"
            className="flex-1 border border-white/20 bg-white/5 px-3 py-3 text-sm"
          />
          <button className="bg-gold px-4 text-ink" disabled={busy}>
            Check
          </button>
        </form>

        {outcome ? (
          <section className={`mt-6 p-5 ${tone}`}>
            <p className="text-xs uppercase tracking-[0.18em]">
              {outcome.headline || outcome.result}
            </p>
            <p className="mt-2 text-xl font-medium">{outcome.message}</p>
            {outcome.ticket ? (
              <div className="mt-4 space-y-1 text-sm leading-6">
                <p className="font-display text-2xl">{outcome.ticket.student}</p>
                <p>{outcome.ticket.enrollmentNumber} · {outcome.ticket.className}</p>
                <p>{outcome.ticket.event}</p>
                {outcome.ticket.seats ? <p>Seats {outcome.ticket.seats}</p> : null}
                {outcome.ticket.code ? <p className="text-xs uppercase tracking-[0.14em] opacity-80">{outcome.ticket.code}</p> : null}
              </div>
            ) : null}
          </section>
        ) : null}
      </div>
    </main>
  );
}
