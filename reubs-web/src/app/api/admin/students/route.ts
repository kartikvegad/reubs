import { NextResponse } from "next/server";
import { z } from "zod";
import { getStaffSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  enrollmentNumber: z.string().min(3),
  name: z.string().min(2),
  className: z.string().min(1),
  section: z.string().min(1),
  parentName: z.string().min(2),
  parentPhone: z.string().min(8),
  parentEmail: z.string().email().nullable().optional(),
  active: z.boolean().optional(),
});

export async function POST(request: Request) {
  const staff = await getStaffSession();
  if (!staff || staff.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = schema.safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Invalid student details." }, { status: 400 });

  try {
    const student = await prisma.student.create({
      data: {
        enrollmentNumber: body.data.enrollmentNumber.trim().toUpperCase(),
        name: body.data.name.trim(),
        className: body.data.className.trim(),
        section: body.data.section.trim().toUpperCase(),
        parentName: body.data.parentName.trim(),
        parentPhone: body.data.parentPhone.trim(),
        parentEmail: body.data.parentEmail || null,
        active: body.data.active ?? true,
      },
    });
    return NextResponse.json({ ok: true, id: student.id });
  } catch {
    return NextResponse.json({ error: "Enrollment number may already exist." }, { status: 409 });
  }
}
