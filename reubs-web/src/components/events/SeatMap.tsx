"use client";

import { hallLayout, seatId, type SeatLayout } from "@/lib/seats";

const layout: SeatLayout = hallLayout();

export function SeatMap({
  booked,
  selected,
  onToggle,
}: {
  booked: string[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  const taken = new Set(booked);

  return (
    <div className="overflow-x-auto">
      <div className="mx-auto min-w-[720px] px-2 py-4">
        <div className="mx-auto mb-8 h-3 w-3/4 rounded-b-[80px] bg-ink text-center text-[10px] uppercase tracking-[0.4em] text-gold-soft">
          <span className="relative top-3">Stage</span>
        </div>
        <div className="mt-8 space-y-2">
          {layout.rows.map((row) => (
            <div key={row} className="flex items-center justify-center gap-3">
              <span className="w-5 text-center text-xs text-muted">{row}</span>
              <div className="flex gap-1.5">
                {Array.from({ length: layout.aisleAfter }, (_, index) => {
                  const id = seatId(row, index + 1);
                  return (
                    <SeatButton
                      key={id}
                      id={id}
                      sold={taken.has(id)}
                      chosen={selected.includes(id)}
                      onToggle={onToggle}
                    />
                  );
                })}
              </div>
              <div className="w-6" />
              <div className="flex gap-1.5">
                {Array.from({ length: layout.seatsPerRow - layout.aisleAfter }, (_, index) => {
                  const number = layout.aisleAfter + index + 1;
                  const id = seatId(row, number);
                  return (
                    <SeatButton
                      key={id}
                      id={id}
                      sold={taken.has(id)}
                      chosen={selected.includes(id)}
                      onToggle={onToggle}
                    />
                  );
                })}
              </div>
              <span className="w-5 text-center text-xs text-muted">{row}</span>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-xs text-muted">
          <Legend className="border-sage bg-paper" label="Available" />
          <Legend className="border-maroon bg-maroon" label="Selected" />
          <Legend className="border-gold-soft bg-gold-soft" label="Sold" />
        </div>
      </div>
    </div>
  );
}

function SeatButton({
  id,
  sold,
  chosen,
  onToggle,
}: {
  id: string;
  sold: boolean;
  chosen: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <button
      type="button"
      title={id}
      disabled={sold}
      onClick={() => onToggle(id)}
      className={`h-7 w-7 rounded-t-md text-[10px] ${
        sold
          ? "cursor-not-allowed border border-gold-soft bg-gold-soft text-muted"
          : chosen
            ? "border border-maroon bg-maroon text-paper"
            : "border border-sage bg-paper text-sage hover:bg-sage hover:text-paper"
      }`}
    >
      {id.replace(/^[A-Z]+/, "")}
    </button>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-4 w-4 rounded-t-sm border ${className}`} />
      {label}
    </span>
  );
}
