import { NextResponse } from "next/server";
import { z } from "zod";
import { assertBookingOpen } from "@/lib/admin";
import { getActiveHold, releaseHold, unavailableSeatsForEvent } from "@/lib/holds";
import { deliverTicket } from "@/lib/notify";
import { prisma } from "@/lib/prisma";
import { saveTicketSeats } from "@/lib/seatStore";
import { MAX_PASSES, hallCapacity, isValidSeat, parseSeats } from "@/lib/seats";
import { createQrToken } from "@/lib/tickets";

const schema = z.object({
  slug: z.string(),
  enrollmentNumber: z.string().min(3),
  seats: z.array(z.string().min(2)).min(1).max(MAX_PASSES),
  buyerName: z.string().min(2),
  buyerEmail: z.string().email(),
  buyerPhone: z.string().min(8),
  holdToken: z.string().min(8).max(80).optional(),
});

export async function POST(request: Request) {
  const body = schema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: "Please fill every field correctly and pick 1–5 seats." }, { status: 400 });
  }

  const seats = [...new Set(body.data.seats)];
  if (seats.some((seat) => !isValidSeat(seat))) {
    return NextResponse.json({ error: "One or more seats are not in this hall." }, { status: 400 });
  }

  const event = await prisma.event.findUnique({
    where: { slug: body.data.slug },
  });
  if (!event) {
    return NextResponse.json({ error: "This event is not open for booking." }, { status: 400 });
  }

  try {
    assertBookingOpen(event);
  } catch (error) {
    const message = error instanceof Error ? error.message : "This event is not open for booking.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const student = await prisma.student.findUnique({
    where: { enrollmentNumber: body.data.enrollmentNumber.trim().toUpperCase() },
  });
  if (!student || !student.active) {
    return NextResponse.json({ error: "Student could not be verified." }, { status: 403 });
  }

  try {
    if (body.data.holdToken) {
      const hold = await getActiveHold(event.id, body.data.holdToken);
      if (!hold) {
        throw new Error("Your seat hold expired. Please select seats again.");
      }
      const held = new Set(parseSeats(hold.seats));
      if (seats.length !== held.size || seats.some((seat) => !held.has(seat))) {
        throw new Error("Selected seats no longer match your hold. Please select again.");
      }
    }

    const already = await prisma.ticket.aggregate({
      where: { eventId: event.id, studentId: student.id, status: { not: "cancelled" } },
      _sum: { quantity: true },
    });
    const used = already._sum.quantity || 0;
    const cap = Math.min(MAX_PASSES, event.maxPerStudent);
    if (used + seats.length > cap) {
      throw new Error(`Only ${Math.max(0, cap - used)} pass(es) remain for this student.`);
    }

    const taken = new Set(await unavailableSeatsForEvent(event.id, body.data.holdToken));
    if (seats.some((seat) => taken.has(seat))) {
      throw new Error("Those seats were just taken. Please pick again.");
    }

    const sold = await prisma.ticket.aggregate({
      where: { eventId: event.id, status: { not: "cancelled" } },
      _sum: { quantity: true },
    });
    const capacity = Math.min(event.totalSeats, hallCapacity());
    if ((sold._sum.quantity || 0) + seats.length > capacity) {
      throw new Error("Not enough seats left.");
    }

    const ticket = await prisma.ticket.create({
      data: {
        eventId: event.id,
        studentId: student.id,
        buyerName: body.data.buyerName.trim(),
        buyerEmail: body.data.buyerEmail.trim().toLowerCase(),
        buyerPhone: body.data.buyerPhone.trim(),
        quantity: seats.length,
        amountInPaise: event.priceInPaise * seats.length,
        paymentMethod: event.priceInPaise <= 0 ? "free" : "bypass",
        paymentStatus: event.priceInPaise <= 0 ? "waived" : "bypassed",
        qrToken: createQrToken(),
      },
    });

    await saveTicketSeats(ticket.id, seats);
    if (body.data.holdToken) {
      await releaseHold(event.id, body.data.holdToken);
    }
    await deliverTicket(ticket.id);
    return NextResponse.json({ token: ticket.qrToken, id: ticket.id, seats });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not complete booking.";
    const booked = event ? await unavailableSeatsForEvent(event.id, body.data.holdToken) : [];
    return NextResponse.json({ error: message, booked }, { status: 409 });
  }
}
