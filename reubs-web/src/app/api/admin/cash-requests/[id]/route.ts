import { NextResponse } from "next/server";
import { z } from "zod";
import { getStaffSession } from "@/lib/auth";
import { unavailableSeatsForEvent } from "@/lib/holds";
import { deliverTicket } from "@/lib/notify";
import { prisma } from "@/lib/prisma";
import { saveTicketSeats } from "@/lib/seatStore";
import { isValidSeat, parseSeats } from "@/lib/seats";
import { createQrToken } from "@/lib/tickets";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const staff = await getStaffSession();
  if (!staff || staff.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = z.object({ action: z.enum(["approve", "reject"]) }).safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Invalid action." }, { status: 400 });

  const cashRequest = await prisma.cashTicketRequest.findUnique({
    where: { id },
    include: { event: true, student: true },
  });
  if (!cashRequest) return NextResponse.json({ error: "Request not found." }, { status: 404 });
  if (cashRequest.status !== "pending") {
    return NextResponse.json({ error: "Request already reviewed." }, { status: 409 });
  }

  if (body.data.action === "reject") {
    await prisma.cashTicketRequest.update({
      where: { id },
      data: { status: "rejected", reviewedAt: new Date(), reviewedBy: staff.email },
    });
    return NextResponse.json({ ok: true, status: "rejected" });
  }

  const seats = parseSeats(cashRequest.seats);
  if (seats.some((seat) => !isValidSeat(seat))) {
    return NextResponse.json({ error: "Request has invalid seats." }, { status: 400 });
  }
  if (seats.length) {
    const taken = new Set(await unavailableSeatsForEvent(cashRequest.eventId));
    if (seats.some((seat) => taken.has(seat))) {
      return NextResponse.json({ error: "Requested seats are no longer available." }, { status: 409 });
    }
  }

  const quantity = seats.length || cashRequest.quantity;
  const ticket = await prisma.ticket.create({
    data: {
      eventId: cashRequest.eventId,
      studentId: cashRequest.studentId,
      buyerName: cashRequest.buyerName,
      buyerEmail: cashRequest.buyerEmail,
      buyerPhone: cashRequest.buyerPhone,
      quantity,
      amountInPaise: cashRequest.event.priceInPaise * quantity,
      paymentMethod: "cash",
      paymentStatus: "paid",
      qrToken: createQrToken(),
      officeNote: cashRequest.note,
    },
  });

  if (seats.length) await saveTicketSeats(ticket.id, seats);
  await deliverTicket(ticket.id);

  await prisma.cashTicketRequest.update({
    where: { id },
    data: {
      status: "approved",
      ticketId: ticket.id,
      reviewedAt: new Date(),
      reviewedBy: staff.email,
    },
  });

  return NextResponse.json({ ok: true, status: "approved", token: ticket.qrToken });
}
