import { NextResponse } from "next/server";
import { loginStaff } from "@/lib/auth";

export async function POST(request: Request) {
  const { email, password, next } = await request.json();
  const staff = await loginStaff(String(email || ""), String(password || ""));
  if (!staff) {
    return NextResponse.json({ error: "Invalid staff email or password." }, { status: 401 });
  }
  return NextResponse.json({
    staff,
    redirect: staff.role === "admin" && next !== "/scan" ? "/admin" : "/scan",
  });
}
