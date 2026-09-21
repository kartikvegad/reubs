import Link from "next/link";
import { bookingWindowStatus } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export default async function AdminOperationsPage() {
  const now = new Date();
  const [openEvents, closingSoon, pendingCash, recentScans, holds] = await Promise.all([
    prisma.event.findMany({
      where: { published: true, startsAt: { gt: now } },
      orderBy: { startsAt: "asc" },
    }),
    prisma.event.findMany({
      where: {
        published: true,
        bookingClosesAt: { not: null, gt: now, lt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) },
      },
      orderBy: { bookingClosesAt: "asc" },
    }),
    prisma.cashTicketRequest.findMany({
      where: { status: "pending" },
      include: { event: true, student: true },
      orderBy: { createdAt: "asc" },
      take: 12,
    }),
    prisma.ticket.findMany({
      where: { status: "used", scannedAt: { not: null } },
      include: { event: true, student: true },
      orderBy: { scannedAt: "desc" },
      take: 12,
    }),
    prisma.seatHold.findMany({
      where: { expiresAt: { gt: now } },
      include: { event: true },
      orderBy: { expiresAt: "asc" },
      take: 12,
    }),
  ]);

  return (
    <main>
      <h1 className="font-display text-3xl">Operations</h1>
      <p className="mt-2 text-sm text-muted">
        Live office board: registration windows, cash desk queue, active seat holds and recent gate scans.
      </p>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="border border-gold-soft bg-paper p-5">
          <h2 className="font-display text-xl">Registration windows</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {openEvents.map((event) => {
              const window = bookingWindowStatus(event);
              return (
                <li key={event.id} className="flex items-start justify-between gap-3 border-b border-gold-soft/50 pb-2">
                  <div>
                    <Link href={`/admin/events/${event.id}`} className="text-maroon">
                      {event.title}
                    </Link>
                    <p className="text-xs text-muted">
                      Closes{" "}
                      {event.bookingClosesAt
                        ? event.bookingClosesAt.toLocaleString("en-IN")
                        : "when event starts"}
                    </p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.12em] text-muted">{window.label}</span>
                </li>
              );
            })}
            {!openEvents.length ? <li className="text-muted">No upcoming published events.</li> : null}
          </ul>
          {closingSoon.length ? (
            <p className="mt-4 text-xs text-maroon">
              {closingSoon.length} event{closingSoon.length === 1 ? "" : "s"} close within 7 days.
            </p>
          ) : null}
        </article>

        <article className="border border-gold-soft bg-paper p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl">Cash desk queue</h2>
            <Link href="/admin/cash-requests" className="text-sm text-maroon">
              Open
            </Link>
          </div>
          <ul className="mt-4 space-y-3 text-sm">
            {pendingCash.map((request) => (
              <li key={request.id} className="border-b border-gold-soft/50 pb-2">
                <p>
                  {request.student.name} · {request.event.title}
                </p>
                <p className="text-xs text-muted">
                  {request.quantity} pass(es) · {request.buyerName} · {request.createdAt.toLocaleString("en-IN")}
                </p>
              </li>
            ))}
            {!pendingCash.length ? <li className="text-muted">No pending cash requests.</li> : null}
          </ul>
        </article>

        <article className="border border-gold-soft bg-paper p-5">
          <h2 className="font-display text-xl">Active seat holds</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {holds.map((hold) => (
              <li key={hold.id} className="border-b border-gold-soft/50 pb-2">
                <p>{hold.event.title}</p>
                <p className="text-xs text-muted">
                  {hold.seats} · expires {hold.expiresAt.toLocaleTimeString("en-IN")}
                </p>
              </li>
            ))}
            {!holds.length ? <li className="text-muted">No active holds.</li> : null}
          </ul>
        </article>

        <article className="border border-gold-soft bg-paper p-5">
          <h2 className="font-display text-xl">Recent gate scans</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {recentScans.map((ticket) => (
              <li key={ticket.id} className="border-b border-gold-soft/50 pb-2">
                <p>
                  {ticket.student.name} · {ticket.event.title}
                </p>
                <p className="text-xs text-muted">
                  {ticket.scannedAt?.toLocaleString("en-IN")}
                  {ticket.scannedGate ? ` · ${ticket.scannedGate}` : ""}
                  {ticket.scannedBy ? ` · ${ticket.scannedBy}` : ""}
                </p>
              </li>
            ))}
            {!recentScans.length ? <li className="text-muted">No scans yet.</li> : null}
          </ul>
        </article>
      </section>
    </main>
  );
}
