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

const GATES = ["Main gate", "Gate 2", "Gate 3", "VIP gate", "Staff gate"];

export function ScannerApp({
  staffName,
  staffRole,
}: {
  staffName: string;
  staffRole: string;
}) {
  const router = useRouter();
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [manual, setManual] = useState("");
  const [manualOpen, setManualOpen] = useState(false);
  const [gate, setGate] = useState("Main gate");
  const gateRef = useRef(gate);
  const [outcome, setOutcome] = useState<ScanResult | null>(null);
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);

  useEffect(() => {
    gateRef.current = gate;
  }, [gate]);

  async function check(payload: string) {
    const value = payload.trim();
    if (!value || lock.current) return;
    lock.current = true;
    setBusy(true);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload: value, gate: gateRef.current }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOutcome({
          result: "invalid",
          headline: "Scan failed",
          message: data.error || "Could not check this pass.",
        });
      } else {
        setOutcome(data);
      }
    } catch {
      setOutcome({
        result: "invalid",
        headline: "Scan failed",
        message: "Network error. Try again.",
      });
    } finally {
      setBusy(false);
      setTimeout(() => {
        lock.current = false;
      }, 1200);
    }
  }

  useEffect(() => {
    let scanner: { clear: () => Promise<void> } | null = null;
    let cancelled = false;

    async function start() {
      try {
        const { Html5QrcodeScanner } = await import("html5-qrcode");
        if (cancelled || !hostRef.current) return;
        const box = Math.min(260, Math.floor(window.innerWidth * 0.72));
        const instance = new Html5QrcodeScanner(
          "reubs-scanner",
          {
            fps: 10,
            qrbox: { width: box, height: box },
            aspectRatio: 1,
            rememberLastUsedCamera: true,
            showTorchButtonIfSupported: true,
          },
          false,
        );
        instance.render(
          (text) => {
            void check(text);
          },
          () => undefined,
        );
        scanner = instance;
        if (!cancelled) setReady(true);
      } catch {
        if (!cancelled) {
          setCameraError("Camera could not start. Use manual entry below.");
          setManualOpen(true);
        }
      }
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

  function clearOutcome() {
    setOutcome(null);
    setManual("");
  }

  const roleLabel = staffRole === "admin" ? "Office staff" : "Gate staff";
  const tone =
    outcome?.result === "valid"
      ? "admit"
      : outcome?.result === "used"
        ? "used"
        : outcome
          ? "deny"
          : "";

  return (
    <main className="gate-shell">
      <header className="gate-top">
        <div className="min-w-0">
          <p className="gate-brand">REUBS</p>
          <h1 className="gate-title">Gate check-in</h1>
        </div>
        <button type="button" onClick={logout} className="gate-signout">
          Sign out
        </button>
      </header>

      <div className="gate-meta">
        <label className="gate-gate-field">
          <span className="sr-only">Gate</span>
          <select
            value={gate}
            onChange={(e) => setGate(e.target.value)}
            className="gate-select"
            aria-label="Select gate"
          >
            {GATES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </label>
        <p className="gate-operator">
          {roleLabel}
          <span aria-hidden> · </span>
          <span className="truncate">{staffName}</span>
        </p>
      </div>

      <section className="gate-camera" aria-label="Camera scanner">
        <div id="reubs-scanner" ref={hostRef} className="gate-scanner-host" />
        {!ready && !cameraError ? (
          <p className="gate-camera-status">Starting camera…</p>
        ) : null}
        {cameraError ? <p className="gate-camera-status">{cameraError}</p> : null}
      </section>

      <section className="gate-manual">
        <button
          type="button"
          className="gate-manual-toggle"
          onClick={() => setManualOpen((v) => !v)}
          aria-expanded={manualOpen}
        >
          {manualOpen ? "Hide manual entry" : "Enter code manually"}
        </button>
        {manualOpen ? (
          <form
            className="gate-manual-form"
            onSubmit={(event) => {
              event.preventDefault();
              void check(manual);
            }}
          >
            <input
              value={manual}
              onChange={(e) => setManual(e.target.value)}
              placeholder="Paste or type pass code"
              className="gate-manual-input"
              inputMode="text"
              autoCapitalize="characters"
              autoCorrect="off"
            />
            <button type="submit" className="gate-manual-btn" disabled={busy || !manual.trim()}>
              {busy ? "Checking…" : "Check"}
            </button>
          </form>
        ) : null}
      </section>

      {outcome ? (
        <div className={`gate-result gate-result--${tone}`} role="status" aria-live="polite">
          <div className="gate-result-inner">
            <p className="gate-result-kicker">{outcome.headline || outcome.result}</p>
            <p className="gate-result-message">{outcome.message}</p>
            {outcome.ticket ? (
              <dl className="gate-result-details">
                <div>
                  <dt>Student</dt>
                  <dd>{outcome.ticket.student}</dd>
                </div>
                <div>
                  <dt>Class</dt>
                  <dd>
                    {outcome.ticket.enrollmentNumber} · {outcome.ticket.className}
                  </dd>
                </div>
                <div>
                  <dt>Event</dt>
                  <dd>{outcome.ticket.event}</dd>
                </div>
                {outcome.ticket.seats ? (
                  <div>
                    <dt>Seats</dt>
                    <dd>{outcome.ticket.seats}</dd>
                  </div>
                ) : null}
                {outcome.ticket.code ? (
                  <div>
                    <dt>Pass</dt>
                    <dd>{outcome.ticket.code}</dd>
                  </div>
                ) : null}
              </dl>
            ) : null}
            <button type="button" className="gate-next" onClick={clearOutcome}>
              Scan next pass
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
