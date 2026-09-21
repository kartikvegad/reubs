import { NextResponse } from "next/server";
import { z } from "zod";
import { getStaffSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  enrollmentNumber: z.string().min(3).optional(),
  name: z.string().min(2).optional(),
  className: z.string().min(1).optional(),
  section: z.string().min(1).optional(),
  parentName: z.string().min(2).optional(),
  parentPhone: z.string().min(8).optional(),
  parentEmail: z.string().email().nullable().optional(),
  active: z.boolean().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const staff = await getStaffSession();
  if (!staff || staff.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = schema.safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Invalid student details." }, { status: 400 });

  const data = { ...body.data };
  if (data.enrollmentNumber) data.enrollmentNumber = data.enrollmentNumber.trim().toUpperCase();
  if (data.section) data.section = data.section.trim().toUpperCase();

  await prisma.student.update({ where: { id }, data });
  return NextResponse.json({ ok: true });
}
