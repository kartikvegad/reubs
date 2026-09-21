import { NextResponse } from "next/server";
import { z } from "zod";
import { getStaffSession } from "@/lib/auth";
import { deliverTicket } from "@/lib/notify";
import { prisma } from "@/lib/prisma";
import { unavailableSeatsForEvent } from "@/lib/holds";
import { saveTicketSeats } from "@/lib/seatStore";
import { MAX_PASSES, isValidSeat } from "@/lib/seats";
import { createQrToken } from "@/lib/tickets";

export async function POST(request: Request) {
  const staff = await getStaffSession();
  if (!staff || staff.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const schema = z.object({
    eventId: z.string(),
    studentId: z.string(),
    buyerName: z.string().min(2),
    buyerEmail: z.string().email(),
    buyerPhone: z.string().min(8),
    seats: z.array(z.string()).default([]),
    paymentMethod: z.enum(["cash", "online", "free"]).default("cash"),
    officeNote: z.string().optional(),
  });
  const body = schema.safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Invalid ticket details." }, { status: 400 });

  const seats = [...new Set(body.data.seats.filter(Boolean))];
  if (seats.some((seat) => !isValidSeat(seat))) {
    return NextResponse.json({ error: "One or more seats are invalid." }, { status: 400 });
  }
  if (seats.length > MAX_PASSES) {
    return NextResponse.json({ error: `Maximum ${MAX_PASSES} seats.` }, { status: 400 });
  }

  const [event, student] = await Promise.all([
    prisma.event.findUnique({ where: { id: body.data.eventId } }),
    prisma.student.findUnique({ where: { id: body.data.studentId } }),
  ]);
  if (!event || !student || !student.active) {
    return NextResponse.json({ error: "Event or student not found." }, { status: 404 });
  }

  const quantity = seats.length || 1;
  if (seats.length) {
    const taken = new Set(await unavailableSeatsForEvent(event.id));
    if (seats.some((seat) => taken.has(seat))) {
      return NextResponse.json({ error: "One or more seats are already taken." }, { status: 409 });
    }
  }

  const amountInPaise =
    body.data.paymentMethod === "free" ? 0 : event.priceInPaise * quantity;

  const ticket = await prisma.ticket.create({
    data: {
      eventId: event.id,
      studentId: student.id,
      buyerName: body.data.buyerName.trim(),
      buyerEmail: body.data.buyerEmail.trim().toLowerCase(),
      buyerPhone: body.data.buyerPhone.trim(),
      quantity,
      amountInPaise,
      paymentMethod: body.data.paymentMethod,
      paymentStatus: body.data.paymentMethod === "free" ? "waived" : "paid",
      qrToken: createQrToken(),
      officeNote: body.data.officeNote || null,
    },
  });

  if (seats.length) await saveTicketSeats(ticket.id, seats);
  await deliverTicket(ticket.id);

  return NextResponse.json({ ok: true, id: ticket.id, token: ticket.qrToken });
}
