import { NextResponse } from "next/server";
import { z } from "zod";
import { getStaffSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdminApi() {
  const staff = await getStaffSession();
  if (!staff || staff.role !== "admin") return null;
  return staff;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const staff = await requireAdminApi();
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const schema = z.object({
    bookingOpensAt: z.string().nullable().optional(),
    bookingClosesAt: z.string().nullable().optional(),
    published: z.boolean().optional(),
  });
  const body = schema.safeParse(await request.json());
  if (!body.success) return NextResponse.json({ error: "Invalid payload." }, { status: 400 });

  const data: {
    bookingOpensAt?: Date | null;
    bookingClosesAt?: Date | null;
    published?: boolean;
  } = {};

  if ("bookingOpensAt" in body.data) {
    data.bookingOpensAt = body.data.bookingOpensAt ? new Date(body.data.bookingOpensAt) : null;
  }
  if ("bookingClosesAt" in body.data) {
    data.bookingClosesAt = body.data.bookingClosesAt ? new Date(body.data.bookingClosesAt) : null;
  }
  if (typeof body.data.published === "boolean") data.published = body.data.published;

  await prisma.event.update({ where: { id }, data });
  return NextResponse.json({ ok: true });
}
