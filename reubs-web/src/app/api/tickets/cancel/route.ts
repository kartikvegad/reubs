import { NextResponse } from "next/server";
import { getStaffSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const staff = await getStaffSession();
  if (!staff || staff.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ticketId } = await request.json();
  if (!ticketId) {
    return NextResponse.json({ error: "Missing ticket id." }, { status: 400 });
  }

  const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found." }, { status: 404 });
  }
  if (ticket.status === "used") {
    return NextResponse.json({ error: "Used tickets cannot be cancelled." }, { status: 400 });
  }
  if (ticket.status === "cancelled") {
    return NextResponse.json({ ok: true, status: "cancelled" });
  }

  await prisma.ticket.update({
    where: { id: ticket.id },
    data: { status: "cancelled" },
  });

  return NextResponse.json({ ok: true, status: "cancelled" });
}
