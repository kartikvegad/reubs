import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  role: z.string().optional(),
  phone: z.string().min(8),
  email: z.string().email(),
  grade: z.string().optional(),
  message: z.string().min(8),
});

export async function POST(request: Request) {
  const body = schema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: "Please complete the form." }, { status: 400 });
  }
  console.info("REUBS enquiry", body.data);
  return NextResponse.json({ ok: true });
}
