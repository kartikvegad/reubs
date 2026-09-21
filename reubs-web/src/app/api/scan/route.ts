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

  const body = await request.json();
  const token = parseTicketPayload(String(body.payload || ""));
  const gate = String(body.gate || "Main gate").slice(0, 40);
  if (!token) {
    return NextResponse.json({ error: "Empty QR code." }, { status: 400 });
  }

  const ticket = await prisma.ticket.findUnique({
    where: { qrToken: token },
    include: { event: true, student: true },
  });

  if (!ticket) {
    return NextResponse.json({
      result: "invalid",
      headline: "Not recognised",
      message: "This QR is not in the school database.",
    });
  }

  const seats = await seatsForTicket(ticket.id);

  if (ticket.status === "cancelled") {
    return NextResponse.json({
      result: "invalid",
      headline: "Cancelled",
      message: "This pass was cancelled by the office.",
      ticket: publicTicket(ticket, seats),
    });
  }

  if (ticket.status === "used") {
    return NextResponse.json({
      result: "used",
      headline: "Already used",
      message: ticket.scannedAt
        ? `Scanned at ${ticket.scannedAt.toLocaleString("en-IN")}${ticket.scannedGate ? ` · ${ticket.scannedGate}` : ""}${ticket.scannedBy ? ` · ${ticket.scannedBy}` : ""}`
        : "This pass was already scanned.",
      ticket: publicTicket(ticket, seats),
    });
  }

  if (ticket.event.endsAt < new Date()) {
    return NextResponse.json({
      result: "invalid",
      headline: "Expired",
      message: "This event has ended.",
      ticket: publicTicket(ticket, seats),
    });
  }

  const updated = await prisma.ticket.update({
    where: { id: ticket.id },
    data: {
      status: "used",
      scannedAt: new Date(),
      scannedBy: staff.email,
      scannedGate: gate,
    },
    include: { event: true, student: true },
  });

  return NextResponse.json({
    result: "valid",
    headline: "Entry approved",
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
    scannedBy: string | null;
    scannedGate: string | null;
    qrToken: string;
    event: { title: string; venue: string };
    student: { name: string; enrollmentNumber: string; className: string; section: string };
  },
  seats: string[],
) {
  return {
    code: `REUBS-${ticket.qrToken.slice(0, 6).toUpperCase()}`,
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
    scannedBy: ticket.scannedBy,
    scannedGate: ticket.scannedGate,
  };
}
