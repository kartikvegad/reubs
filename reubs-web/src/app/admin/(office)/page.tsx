import Link from "next/link";
import { bookingWindowStatus } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { formatInr } from "@/lib/school";

export default async function AdminOverviewPage() {
  const [events, ticketStats, pendingCash, students, teachers] = await Promise.all([
    prisma.event.findMany({
      orderBy: { startsAt: "asc" },
      include: {
        tickets: {
          where: { status: { not: "cancelled" } },
          select: { quantity: true, amountInPaise: true, status: true, paymentStatus: true },
        },
      },
    }),
    prisma.ticket.groupBy({
      by: ["status"],
      _sum: { quantity: true, amountInPaise: true },
    }),
    prisma.cashTicketRequest.count({ where: { status: "pending" } }),
    prisma.student.count({ where: { active: true } }),
    prisma.teacher.count({ where: { active: true } }),
  ]);

  const issued = ticketStats
    .filter((row) => row.status !== "cancelled")
    .reduce((sum, row) => sum + (row._sum.quantity || 0), 0);
  const used = ticketStats.find((row) => row.status === "used")?._sum.quantity || 0;
  const revenue = ticketStats
    .filter((row) => row.status !== "cancelled")
    .reduce((sum, row) => sum + (row._sum.amountInPaise || 0), 0);
  const upcoming = events.filter((event) => event.startsAt > new Date()).length;

  return (
    <main>
      <h1 className="font-display text-3xl sm:text-4xl">Office overview</h1>
      <p className="mt-2 text-sm text-muted">
        Event ops, student roll, ticket lifecycle and cash-desk requests in one place.
      </p>

      <section className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[
          ["Upcoming events", String(upcoming)],
          ["Passes issued", String(issued)],
          ["Checked in", String(used)],
          ["Revenue", formatInr(revenue)],
          ["Cash pending", String(pendingCash)],
        ].map(([label, value]) => (
          <article key={label} className="border border-gold-soft bg-paper p-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-maroon">{label}</p>
            <p className="mt-2 font-display text-2xl sm:text-3xl">{value}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link href="/admin/students" className="border border-gold-soft bg-paper p-5 transition hover:border-maroon/30">
          <p className="text-[11px] uppercase tracking-[0.16em] text-maroon">Roll</p>
          <p className="mt-2 font-display text-2xl">{students} active students</p>
        </Link>
        <Link href="/admin/teachers" className="border border-gold-soft bg-paper p-5 transition hover:border-maroon/30">
          <p className="text-[11px] uppercase tracking-[0.16em] text-maroon">Faculty</p>
          <p className="mt-2 font-display text-2xl">{teachers} active teachers</p>
        </Link>
        <Link href="/admin/cash-requests" className="border border-gold-soft bg-paper p-5 transition hover:border-maroon/30">
          <p className="text-[11px] uppercase tracking-[0.16em] text-maroon">Cash desk</p>
          <p className="mt-2 font-display text-2xl">{pendingCash} awaiting approval</p>
        </Link>
      </section>

      <section className="mt-10">
        <div className="flex items-end justify-between gap-3">
          <h2 className="font-display text-2xl">Events</h2>
          <Link href="/admin/events" className="text-sm text-maroon">
            Manage all
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto border border-gold-soft bg-paper">
          <table className="w-full text-left text-sm">
            <thead className="bg-gold-soft/40">
              <tr>
                <th className="px-3 py-2">Event</th>
                <th className="px-3 py-2">Registration</th>
                <th className="px-3 py-2">Sold</th>
                <th className="px-3 py-2">Checked in</th>
                <th className="px-3 py-2">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => {
                const sold = event.tickets.reduce((sum, t) => sum + t.quantity, 0);
                const checkedIn = event.tickets
                  .filter((t) => t.status === "used")
                  .reduce((sum, t) => sum + t.quantity, 0);
                const eventRevenue = event.tickets.reduce((sum, t) => sum + t.amountInPaise, 0);
                const window = bookingWindowStatus(event);
                return (
                  <tr key={event.id} className="border-t border-gold-soft">
                    <td className="px-3 py-2">
                      <Link href={`/admin/events/${event.id}`} className="text-maroon">
                        {event.title}
                      </Link>
                    </td>
                    <td className="px-3 py-2">{window.label}</td>
                    <td className="px-3 py-2">
                      {sold} / {event.totalSeats}
                    </td>
                    <td className="px-3 py-2">{checkedIn}</td>
                    <td className="px-3 py-2">{formatInr(eventRevenue)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
