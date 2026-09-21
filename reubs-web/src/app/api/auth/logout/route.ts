import { NextResponse } from "next/server";
import { logoutStaff } from "@/lib/auth";

export async function POST() {
  await logoutStaff();
  return NextResponse.json({ ok: true });
}
