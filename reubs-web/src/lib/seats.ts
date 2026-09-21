export const MAX_PASSES = 5;

export type SeatLayout = {
  rows: string[];
  seatsPerRow: number;
  aisleAfter: number;
};

export function hallLayout(): SeatLayout {
  return {
    rows: "ABCDEFGHJKLM".split(""),
    seatsPerRow: 16,
    aisleAfter: 8,
  };
}

export function seatId(row: string, number: number) {
  return `${row}${number}`;
}

export function allSeatIds(layout: SeatLayout = hallLayout()) {
  return layout.rows.flatMap((row) =>
    Array.from({ length: layout.seatsPerRow }, (_, index) => seatId(row, index + 1)),
  );
}

export function parseSeats(value: string | null | undefined) {
  if (!value) return [];
  return value
    .split(",")
    .map((seat) => seat.trim())
    .filter(Boolean);
}

export function joinSeats(seats: string[]) {
  return [...seats].sort(compareSeats).join(",");
}

export function compareSeats(a: string, b: string) {
  const left = a.match(/^([A-Z]+)(\d+)$/i);
  const right = b.match(/^([A-Z]+)(\d+)$/i);
  if (!left || !right) return a.localeCompare(b);
  if (left[1] === right[1]) return Number(left[2]) - Number(right[2]);
  return left[1].localeCompare(right[1]);
}

export function isValidSeat(id: string, layout: SeatLayout = hallLayout()) {
  return allSeatIds(layout).includes(id);
}

export function hallCapacity(layout: SeatLayout = hallLayout()) {
  return layout.rows.length * layout.seatsPerRow;
}
