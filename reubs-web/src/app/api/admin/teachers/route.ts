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
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(8),
    department: z.string().min(2),
    className: z.string().nullable().optional(),
    section: z.string().nullable().optional(),
    active: z.boolean().optional(),
  });
  const body = schema.safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Invalid teacher details." }, { status: 400 });

  try {
    const teacher = await prisma.teacher.create({
      data: {
        name: body.data.name.trim(),
        email: body.data.email.trim().toLowerCase(),
        phone: body.data.phone.trim(),
        department: body.data.department.trim(),
        className: body.data.className || null,
        section: body.data.section || null,
        active: body.data.active ?? true,
      },
    });
    return NextResponse.json({ ok: true, id: teacher.id });
  } catch {
    return NextResponse.json({ error: "Teacher email may already exist." }, { status: 409 });
  }
}
