import { NextResponse } from "next/server";
import { getStaffSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { seatsForTicket } from "@/lib/seatStore";
import { parseTicketPayload } from "@/lib/tickets";

export async function POST(request: Request) {
  const staff = await getStaffSession();
  if (!staff) {
    return NextResponse.json({ error: "Please sign in as gate staff." }, { status: 401 });
  }

  const { payload } = await request.json();
  const token = parseTicketPayload(String(payload || ""));
  if (!token) {
    return NextResponse.json({ error: "Empty QR code." }, { status: 400 });
  }

  const ticket = await prisma.ticket.findUnique({
    where: { qrToken: token },
    include: { event: true, student: true },
  });

  if (!ticket) {
    return NextResponse.json({ result: "invalid", message: "This QR is not in the school database." });
  }

  const seats = await seatsForTicket(ticket.id);

  if (ticket.status === "cancelled") {
    return NextResponse.json({
      result: "invalid",
      message: "This pass was cancelled.",
      ticket: publicTicket(ticket, seats),
    });
  }

  if (ticket.status === "used") {
    return NextResponse.json({
      result: "used",
      message: `Already scanned${ticket.scannedAt ? ` at ${ticket.scannedAt.toLocaleString("en-IN")}` : ""}.`,
      ticket: publicTicket(ticket, seats),
    });
  }

  const updated = await prisma.ticket.update({
    where: { id: ticket.id },
    data: { status: "used", scannedAt: new Date(), scannedBy: staff.email },
    include: { event: true, student: true },
  });

  return NextResponse.json({
    result: "valid",
    message: "Pass accepted. Welcome in.",
    ticket: publicTicket(updated, seats),
  });
}

function publicTicket(
  ticket: {
    quantity: number;
    buyerName: string;
    status: string;
    scannedAt: Date | null;
    event: { title: string; venue: string };
    student: { name: string; enrollmentNumber: string; className: string; section: string };
  },
  seats: string[],
) {
  return {
    event: ticket.event.title,
    venue: ticket.event.venue,
    student: ticket.student.name,
    enrollmentNumber: ticket.student.enrollmentNumber,
    className: `${ticket.student.className}-${ticket.student.section}`,
    buyerName: ticket.buyerName,
    quantity: ticket.quantity,
    seats: seats.join(", "),
    status: ticket.status,
    scannedAt: ticket.scannedAt,
  };
}
