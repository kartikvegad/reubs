"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatInr } from "@/lib/school";
import { MAX_PASSES, compareSeats } from "@/lib/seats";
import { SeatMap } from "./SeatMap";

type Step = "seats" | "details" | "payment";
type Student = {
  enrollmentNumber: string;
  name: string;
  className: string;
  section: string;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
};

export function BookingFlow({
  slug,
  title,
  priceInPaise,
  maxPerStudent,
}: {
  slug: string;
  title: string;
  priceInPaise: number;
  maxPerStudent: number;
}) {
  const router = useRouter();
  const cap = Math.min(MAX_PASSES, maxPerStudent);
  const [step, setStep] = useState<Step>("seats");
  const [booked, setBooked] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [enrollment, setEnrollment] = useState("");
  const [student, setStudent] = useState<Student | null>(null);
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [payMethod, setPayMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [upiId, setUpiId] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void fetch(`/api/events/${slug}/seats`)
      .then(async (res) => {
        if (!res.ok) return { booked: [] };
        return res.json();
      })
      .then((data) => setBooked(data.booked || []))
      .catch(() => setBooked([]));
  }, [slug]);

  const amount = priceInPaise * selected.length;
  const free = priceInPaise <= 0;

  function toggleSeat(id: string) {
    setError("");
    setSelected((current) => {
      if (current.includes(id)) return current.filter((seat) => seat !== id);
      if (current.length >= cap) {
        setError(`You can select up to ${cap} seats.`);
        return current;
      }
      return [...current, id].sort(compareSeats);
    });
  }

  function goToPayment(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setStep("payment");
  }

  async function pay(event: React.FormEvent) {
    event.preventDefault();
    if (!student) return;
    setBusy(true);
    setError("");
    await new Promise((resolve) => setTimeout(resolve, 900));
    const res = await fetch("/api/tickets/purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug,
        enrollmentNumber: student.enrollmentNumber,
        seats: selected,
        buyerName,
        buyerEmail,
        buyerPhone,
        payMethod,
      }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Payment could not be completed.");
      if (Array.isArray(data.booked)) setBooked(data.booked);
      return;
    }
    router.push(`/ticket/${data.token}?confirmed=1`);
  }

  return (
    <div className="mt-8">
      <ol className="mb-6 grid grid-cols-4 gap-2 text-center text-xs uppercase tracking-[0.14em]">
        {[
          ["seats", "1 Seats"],
          ["details", "2 Details"],
          ["payment", "3 Payment"],
          ["done", "4 Confirm"],
        ].map(([key, label]) => (
          <li
            key={key}
            className={`border-b-2 pb-2 ${
              step === key || (key === "done" && step === "payment")
                ? "border-maroon text-maroon"
                : "border-gold-soft text-muted"
            }`}
          >
            {label}
          </li>
        ))}
      </ol>

      {step === "seats" ? (
        <section className="border border-gold-soft bg-paper p-4 md:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-3xl">Select seats</h2>
              <p className="text-sm text-muted">Pick up to {cap} seats. Sold seats are greyed out.</p>
            </div>
            <p className="text-sm">{selected.length} / {cap} selected</p>
          </div>
          <SeatMap booked={booked} selected={selected} onToggle={toggleSeat} />
          <div className="sticky bottom-0 mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-gold-soft bg-paper py-4">
            <p>
              {selected.length ? `${selected.join(", ")} · ${formatInr(amount)}` : "No seats yet"}
            </p>
            <button
              disabled={!selected.length}
              onClick={() => {
                setError("");
                setStep("details");
              }}
              className="rounded-full bg-maroon px-5 py-3 text-paper disabled:opacity-40"
            >
              Continue
            </button>
          </div>
        </section>
      ) : null}

      {step === "details" ? (
        <div className="space-y-4 border border-gold-soft bg-paper p-6">
          <h2 className="font-display text-3xl">Your details</h2>
          <p className="text-sm text-muted">
            Seats {selected.join(", ")} · {title}
          </p>
          {!student ? (
            <form
              onSubmit={async (event) => {
                event.preventDefault();
                setBusy(true);
                setError("");
                const res = await fetch("/api/students/verify", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    enrollmentNumber: enrollment,
                    slug,
                    quantity: selected.length,
                  }),
                });
                const data = await res.json();
                setBusy(false);
                if (!res.ok) {
                  setError(data.error || "Could not verify this student.");
                  return;
                }
                setStudent(data.student);
                setBuyerName(data.student.parentName || "");
                setBuyerEmail(data.student.parentEmail || "");
                setBuyerPhone(data.student.parentPhone || "");
              }}
              className="space-y-4"
            >
              <label className="block text-sm">
                Student enrollment / roll number
                <input
                  required
                  value={enrollment}
                  onChange={(e) => setEnrollment(e.target.value.toUpperCase())}
                  className="mt-2 w-full border border-gold-soft bg-cream px-3 py-3"
                  placeholder="REU2026-1001"
                />
              </label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep("seats")} className="px-4 py-3 text-sm">
                  Back
                </button>
                <button disabled={busy} className="rounded-full bg-maroon px-5 py-3 text-paper">
                  {busy ? "Verifying…" : "Verify student"}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={goToPayment} className="space-y-4">
              <div className="bg-cream px-4 py-3 text-sm">
                Verified: <strong>{student.name}</strong> · Class {student.className}-{student.section} ·{" "}
                {student.enrollmentNumber}
              </div>
              <label className="block text-sm">
                Buyer name
                <input
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="mt-2 w-full border border-gold-soft bg-cream px-3 py-3"
                />
              </label>
              <label className="block text-sm">
                Email for e-ticket
                <input
                  required
                  type="email"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="mt-2 w-full border border-gold-soft bg-cream px-3 py-3"
                />
              </label>
              <label className="block text-sm">
                WhatsApp number
                <input
                  required
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  className="mt-2 w-full border border-gold-soft bg-cream px-3 py-3"
                />
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStudent(null);
                    setError("");
                  }}
                  className="px-4 py-3 text-sm"
                >
                  Back
                </button>
                <button className="rounded-full bg-maroon px-5 py-3 text-paper">
                  Continue to payment
                </button>
              </div>
            </form>
          )}
        </div>
      ) : null}

      {step === "payment" ? (
        <form onSubmit={pay} className="grid gap-6 border border-gold-soft bg-paper p-6 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="font-display text-3xl">{free ? "Confirm booking" : "Payment"}</h2>
            {student ? (
              <p className="mt-2 text-sm text-muted">
                {student.name} · {student.enrollmentNumber} · Class {student.className}-{student.section}
              </p>
            ) : null}
            {!free ? (
              <fieldset className="mt-6 space-y-3">
                <legend className="text-sm">Pay with</legend>
                {(
                  [
                    ["upi", "UPI"],
                    ["card", "Debit / Credit card"],
                    ["netbanking", "Net banking"],
                  ] as const
                ).map(([value, label]) => (
                  <label key={value} className="flex items-center gap-3 border border-gold-soft px-3 py-3">
                    <input
                      type="radio"
                      name="pay"
                      checked={payMethod === value}
                      onChange={() => setPayMethod(value)}
                    />
                    {label}
                  </label>
                ))}
                {payMethod === "upi" ? (
                  <input
                    required
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="name@upi"
                    className="w-full border border-gold-soft bg-cream px-3 py-3"
                  />
                ) : (
                  <p className="text-sm text-muted">
                    Demo checkout — no live bank call. The pass is issued after you confirm.
                  </p>
                )}
              </fieldset>
            ) : (
              <p className="mt-4 text-sm text-muted">This event is free. Confirm to issue the e-ticket.</p>
            )}
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setStep("details")} className="px-4 py-3 text-sm">
                Back
              </button>
              <button disabled={busy} className="rounded-full bg-maroon px-5 py-3 text-paper">
                {busy ? "Processing…" : free ? "Confirm booking" : `Pay ${formatInr(amount)}`}
              </button>
            </div>
          </div>
          <aside className="bg-cream p-5 text-sm">
            <p className="text-xs uppercase tracking-[0.16em] text-maroon">Order summary</p>
            <p className="mt-3 font-display text-2xl">{title}</p>
            <p className="mt-2">Seats: {selected.join(", ")}</p>
            <p>{selected.length === 1 ? "1 pass" : `${selected.length} passes`}</p>
            <p className="mt-4 text-lg">{formatInr(amount)}</p>
            <p className="mt-4 text-muted">QR e-ticket will open after confirmation.</p>
          </aside>
        </form>
      ) : null}

      {error ? <p className="mt-4 text-sm text-maroon">{error}</p> : null}
    </div>
  );
}
