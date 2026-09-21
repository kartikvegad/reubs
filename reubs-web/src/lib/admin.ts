import { redirect } from "next/navigation";
import { getStaffSession, type StaffSession } from "@/lib/auth";

export async function requireAdmin(): Promise<StaffSession> {
  const staff = await getStaffSession();
  if (!staff) redirect("/admin/login");
  if (staff.role !== "admin") redirect("/scan");
  return staff;
}

export function bookingWindowStatus(event: {
  bookingOpensAt: Date | null;
  bookingClosesAt: Date | null;
  startsAt: Date;
  published: boolean;
}) {
  const now = new Date();
  if (!event.published) return { open: false, label: "Unpublished" };
  if (event.startsAt <= now) return { open: false, label: "Event started" };
  if (event.bookingOpensAt && event.bookingOpensAt > now) {
    return { open: false, label: "Opens later" };
  }
  if (event.bookingClosesAt && event.bookingClosesAt <= now) {
    return { open: false, label: "Registration closed" };
  }
  return { open: true, label: "Open" };
}

export function assertBookingOpen(event: {
  bookingOpensAt: Date | null;
  bookingClosesAt: Date | null;
  startsAt: Date;
  published: boolean;
}) {
  const status = bookingWindowStatus(event);
  if (!status.open) {
    throw new Error(
      status.label === "Opens later"
        ? "Registration for this event has not opened yet."
        : status.label === "Registration closed"
          ? "Registration for this event has closed."
          : "This event is not open for booking.",
    );
  }
}
