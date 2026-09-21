import { NextResponse } from "next/server";
import { z } from "zod";
import { createOrRefreshHold, releaseHold, unavailableSeatsForEvent } from "@/lib/holds";
import { prisma } from "@/lib/prisma";
import { MAX_PASSES, isValidSeat } from "@/lib/seats";

const schema = z.object({
  seats: z.array(z.string().min(2)).min(1).max(MAX_PASSES),
  holdToken: z.string().min(8).max(80),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const body = schema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: "Pick 1–5 seats to hold." }, { status: 400 });
  }

  const seats = [...new Set(body.data.seats)];
  if (seats.some((seat) => !isValidSeat(seat))) {
    return NextResponse.json({ error: "One or more seats are not in this hall." }, { status: 400 });
  }

  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event || !event.published || event.startsAt <= new Date()) {
    return NextResponse.json({ error: "This event is not open for booking." }, { status: 400 });
  }

  try {
    const hold = await createOrRefreshHold({
      eventId: event.id,
      seats,
      holdToken: body.data.holdToken,
    });
    return NextResponse.json({
      ok: true,
      holdToken: hold.holdToken,
      seats,
      expiresAt: hold.expiresAt.toISOString(),
      holdMinutes: 8,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not hold seats.";
    const unavailable = await unavailableSeatsForEvent(event.id, body.data.holdToken);
    return NextResponse.json({ error: message, booked: unavailable }, { status: 409 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const { holdToken } = await request.json().catch(() => ({ holdToken: "" }));
  if (!holdToken) {
    return NextResponse.json({ error: "Missing hold token." }, { status: 400 });
  }

  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event) return NextResponse.json({ ok: true });

  await releaseHold(event.id, String(holdToken));
  return NextResponse.json({ ok: true });
}
