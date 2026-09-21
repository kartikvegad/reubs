import { prisma } from "./prisma";
import { joinSeats, parseSeats } from "./seats";
import { bookedSeatsForEvent } from "./seatStore";

export const HOLD_MINUTES = 8;

export async function purgeExpiredHolds(eventId?: string) {
  const where = eventId
    ? { eventId, expiresAt: { lt: new Date() } }
    : { expiresAt: { lt: new Date() } };
  await prisma.seatHold.deleteMany({ where });
}

export async function heldSeatsForEvent(eventId: string, exceptToken?: string) {
  await purgeExpiredHolds(eventId);
  const holds = await prisma.seatHold.findMany({
    where: {
      eventId,
      expiresAt: { gt: new Date() },
      ...(exceptToken ? { holdToken: { not: exceptToken } } : {}),
    },
  });
  return holds.flatMap((hold) => parseSeats(hold.seats));
}

export async function unavailableSeatsForEvent(eventId: string, exceptToken?: string) {
  const [booked, held] = await Promise.all([
    bookedSeatsForEvent(eventId),
    heldSeatsForEvent(eventId, exceptToken),
  ]);
  return [...new Set([...booked, ...held])];
}

export async function createOrRefreshHold(input: {
  eventId: string;
  seats: string[];
  holdToken: string;
}) {
  await purgeExpiredHolds(input.eventId);

  const seats = [...new Set(input.seats)];
  if (!seats.length) {
    throw new Error("Select at least one seat to hold.");
  }

  const unavailable = new Set(await unavailableSeatsForEvent(input.eventId, input.holdToken));
  if (seats.some((seat) => unavailable.has(seat))) {
    throw new Error("Those seats were just taken. Please pick again.");
  }

  const expiresAt = new Date(Date.now() + HOLD_MINUTES * 60_000);
  const seatsValue = joinSeats(seats);

  const existing = await prisma.seatHold.findFirst({
    where: { eventId: input.eventId, holdToken: input.holdToken },
  });

  if (existing) {
    return prisma.seatHold.update({
      where: { id: existing.id },
      data: { seats: seatsValue, expiresAt },
    });
  }

  return prisma.seatHold.create({
    data: {
      eventId: input.eventId,
      seats: seatsValue,
      holdToken: input.holdToken,
      expiresAt,
    },
  });
}

export async function releaseHold(eventId: string, holdToken: string) {
  await prisma.seatHold.deleteMany({ where: { eventId, holdToken } });
}

export async function getActiveHold(eventId: string, holdToken: string) {
  await purgeExpiredHolds(eventId);
  return prisma.seatHold.findFirst({
    where: { eventId, holdToken, expiresAt: { gt: new Date() } },
  });
}
