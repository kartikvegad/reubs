import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bookedSeatsForEvent } from "@/lib/seatStore";
import { hallCapacity, hallLayout } from "@/lib/seats";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event || !event.published) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  const booked = await bookedSeatsForEvent(event.id);

  return NextResponse.json({
    layout: hallLayout(),
    booked,
    capacity: hallCapacity(),
    maxPerStudent: event.maxPerStudent,
    priceInPaise: event.priceInPaise,
  });
}
