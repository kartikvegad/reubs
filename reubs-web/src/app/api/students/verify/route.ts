import { NextResponse } from "next/server";
import { z } from "zod";
import { assertBookingOpen } from "@/lib/admin";
import { MAX_PASSES } from "@/lib/seats";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  enrollmentNumber: z.string().min(3),
  slug: z.string().min(1),
  quantity: z.number().int().min(1).max(5).optional(),
});

export async function POST(request: Request) {
  const body = schema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: "Enter a valid enrollment number." }, { status: 400 });
  }

  const event = await prisma.event.findUnique({ where: { slug: body.data.slug } });
  if (!event) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
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
    return NextResponse.json(
      { error: "This enrollment number is not on the current student roll." },
      { status: 404 },
    );
  }

  const already = await prisma.ticket.aggregate({
    where: { eventId: event.id, studentId: student.id, status: { not: "cancelled" } },
    _sum: { quantity: true },
  });
  const used = already._sum.quantity || 0;
  const cap = Math.min(MAX_PASSES, event.maxPerStudent);
  const remaining = cap - used;
  if (remaining <= 0) {
    return NextResponse.json(
      { error: "This student already has the maximum passes for this event." },
      { status: 409 },
    );
  }
  if ((body.data.quantity || 1) > remaining) {
    return NextResponse.json(
      { error: `This student can book ${remaining} more pass${remaining === 1 ? "" : "es"} for this event.` },
      { status: 409 },
    );
  }

  return NextResponse.json({
    student: {
      enrollmentNumber: student.enrollmentNumber,
      name: student.name,
      className: student.className,
      section: student.section,
      parentName: student.parentName,
      parentEmail: student.parentEmail,
      parentPhone: student.parentPhone,
    },
    remainingPasses: remaining,
  });
}
