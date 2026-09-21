import { NextResponse } from "next/server";
import { z } from "zod";
import { getStaffSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
    quantity: z.number().int().min(1).max(5).default(1),
    seats: z.string().optional(),
    note: z.string().optional(),
  });
  const body = schema.safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Invalid cash request." }, { status: 400 });

  const [event, student] = await Promise.all([
    prisma.event.findUnique({ where: { id: body.data.eventId } }),
    prisma.student.findUnique({ where: { id: body.data.studentId } }),
  ]);
  if (!event || !student) {
    return NextResponse.json({ error: "Event or student not found." }, { status: 404 });
  }

  const requestRow = await prisma.cashTicketRequest.create({
    data: {
      eventId: event.id,
      studentId: student.id,
      buyerName: body.data.buyerName.trim(),
      buyerEmail: body.data.buyerEmail.trim().toLowerCase(),
      buyerPhone: body.data.buyerPhone.trim(),
      quantity: body.data.quantity,
      seats: body.data.seats || "",
      note: body.data.note || null,
      status: "pending",
    },
  });

  return NextResponse.json({ ok: true, id: requestRow.id });
}
