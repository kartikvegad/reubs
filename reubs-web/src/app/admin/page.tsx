import Link from "next/link";
import { redirect } from "next/navigation";
import { getStaffSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { seatsForTicket } from "@/lib/seatStore";

export default async function AdminPage() {
  const staff = await getStaffSession();
  if (!staff) redirect("/admin/login");
  if (staff.role !== "admin") redirect("/scan");

  const [events, tickets, students, logs] = await Promise.all([
    prisma.event.findMany({ orderBy: { startsAt: "asc" }, include: { _count: { select: { tickets: true } } } }),
    prisma.ticket.findMany({
      orderBy: { purchasedAt: "desc" },
      take: 20,
      include: { event: true, student: true },
    }),
    prisma.student.findMany({ orderBy: { enrollmentNumber: "asc" } }),
    prisma.notificationLog.findMany({ orderBy: { createdAt: "desc" }, take: 12 }),
  ]);
  const ticketsWithSeats = await Promise.all(
    tickets.map(async (ticket) => ({
      ...ticket,
      seatLabels: (await seatsForTicket(ticket.id)).join(", ") || "—",
    })),
  );

  return (
    <main className="min-h-screen bg-cream px-5 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-maroon">REUBS office</p>
            <h1 className="font-display text-4xl">Events & tickets</h1>
          </div>
          <form action="/api/auth/logout" method="post">
            <LogoutButton />
          </form>
        </div>

        <section className="mt-10">
          <h2 className="font-display text-2xl">Events</h2>
          <div className="mt-4 overflow-x-auto border border-gold-soft bg-paper">
            <table className="w-full text-left text-sm">
              <thead className="bg-gold-soft/40">
                <tr>
                  <th className="px-3 py-2">Event</th>
                  <th className="px-3 py-2">When</th>
                  <th className="px-3 py-2">Sold</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-t border-gold-soft">
                    <td className="px-3 py-2">{event.title}</td>
                    <td className="px-3 py-2">{event.startsAt.toLocaleString("en-IN")}</td>
                    <td className="px-3 py-2">
                      {event._count.tickets} / {event.totalSeats}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl">Recent tickets</h2>
          <div className="mt-4 overflow-x-auto border border-gold-soft bg-paper">
            <table className="w-full text-left text-sm">
              <thead className="bg-gold-soft/40">
                <tr>
                  <th className="px-3 py-2">Student</th>
                  <th className="px-3 py-2">Event</th>
                  <th className="px-3 py-2">Buyer</th>
                  <th className="px-3 py-2">Seats</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Pass</th>
                </tr>
              </thead>
              <tbody>
                {ticketsWithSeats.map((ticket) => (
                  <tr key={ticket.id} className="border-t border-gold-soft">
                    <td className="px-3 py-2">
                      {ticket.student.name}
                      <div className="text-xs text-muted">{ticket.student.enrollmentNumber}</div>
                    </td>
                    <td className="px-3 py-2">{ticket.event.title}</td>
                    <td className="px-3 py-2">{ticket.buyerEmail}</td>
                    <td className="px-3 py-2">{ticket.seatLabels}</td>
                    <td className="px-3 py-2">{ticket.status}</td>
                    <td className="px-3 py-2">
                      <Link className="text-maroon" href={`/ticket/${ticket.qrToken}`}>
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10 grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl">Student roll</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {students.map((student) => (
                <li key={student.id} className="border border-gold-soft bg-paper px-3 py-2">
                  <strong>{student.enrollmentNumber}</strong> · {student.name} · {student.className}-{student.section}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl">Delivery log</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {logs.map((log) => (
                <li key={log.id} className="border border-gold-soft bg-paper px-3 py-2">
                  <span className="uppercase text-maroon">{log.channel}</span> · {log.status}
                  <div className="text-muted">{log.detail}</div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}

function LogoutButton() {
  return (
    <button
      formAction={async () => {
        "use server";
        const { logoutStaff } = await import("@/lib/auth");
        await logoutStaff();
        const { redirect } = await import("next/navigation");
        redirect("/admin/login");
      }}
      className="text-sm text-maroon"
    >
      Sign out
    </button>
  );
}
