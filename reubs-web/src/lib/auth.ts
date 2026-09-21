import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

const COOKIE = "reubs_staff";

function secret() {
  return new TextEncoder().encode(
    process.env.AUTH_SECRET || "reubs-dev-secret-change-in-production-32chars",
  );
}

export type StaffSession = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "scanner";
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function loginStaff(email: string, password: string) {
  const staff = await prisma.staff.findUnique({
    where: { email: email.trim().toLowerCase() },
  });
  if (!staff) return null;
  const ok = await verifyPassword(password, staff.passwordHash);
  if (!ok) return null;

  const token = await new SignJWT({
    id: staff.id,
    name: staff.name,
    email: staff.email,
    role: staff.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(secret());

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return {
    id: staff.id,
    name: staff.name,
    email: staff.email,
    role: staff.role as StaffSession["role"],
  };
}

export async function logoutStaff() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getStaffSession(): Promise<StaffSession | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return {
      id: String(payload.id),
      name: String(payload.name),
      email: String(payload.email),
      role: payload.role === "admin" ? "admin" : "scanner",
    };
  } catch {
    return null;
  }
}
