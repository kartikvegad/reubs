import { NextResponse } from "next/server";
import { unavailableSeatsForEvent } from "@/lib/holds";
import { prisma } from "@/lib/prisma";
import { hallCapacity, hallLayout } from "@/lib/seats";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const holdToken = new URL(request.url).searchParams.get("holdToken") || undefined;
  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event || !event.published) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  const booked = await unavailableSeatsForEvent(event.id, holdToken);

  return NextResponse.json({
    layout: hallLayout(),
    booked,
    capacity: hallCapacity(),
    maxPerStudent: event.maxPerStudent,
    priceInPaise: event.priceInPaise,
  });
}
