import { NextResponse } from "next/server";
import { getStaffSession } from "@/lib/auth";
import { deliverTicket } from "@/lib/notify";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const staff = await getStaffSession();
  if (!staff || staff.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ticketId } = await request.json();
  const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
  if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });

  await deliverTicket(ticket.id);
  return NextResponse.json({ ok: true });
}
