import Link from "next/link";
import { notFound } from "next/navigation";
import { EventDeadlineForm } from "@/components/admin/EventDeadlineForm";
import { bookingWindowStatus } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { formatEventDate, formatEventTime, formatInr } from "@/lib/school";
import { seatsForTicket } from "@/lib/seatStore";

function toLocalInput(value: Date | null | undefined) {
  if (!value) return "";
  const offset = value.getTimezoneOffset();
  const local = new Date(value.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

export default async function AdminEventDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ className?: string; section?: string; q?: string }>;
}) {
  const { id } = await params;
  const { className = "", section = "", q = "" } = await searchParams;

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      tickets: {
        where: { status: { not: "cancelled" } },
        include: { student: true },
        orderBy: { purchasedAt: "desc" },
      },
      cashRequests: {
        where: { status: "pending" },
        include: { student: true },
      },
    },
  });
  if (!event) notFound();

  const ticketsWithSeats = await Promise.all(
    event.tickets.map(async (ticket) => ({
      ...ticket,
      seatLabels: (await seatsForTicket(ticket.id)).join(", ") || "-",
    })),
  );

  const filtered = ticketsWithSeats.filter((ticket) => {
    if (className && ticket.student.className !== className) return false;
    if (section && ticket.student.section !== section) return false;
    if (q) {
      const hay = `${ticket.student.name} ${ticket.student.enrollmentNumber} ${ticket.buyerName}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  const byClass = new Map<string, number>();
  const bySection = new Map<string, number>();
  const byStudent = new Map<string, { name: string; enrollment: string; qty: number }>();

  for (const ticket of event.tickets) {
    const classKey = ticket.student.className;
    const sectionKey = `${ticket.student.className}-${ticket.student.section}`;
    byClass.set(classKey, (byClass.get(classKey) || 0) + ticket.quantity);
    bySection.set(sectionKey, (bySection.get(sectionKey) || 0) + ticket.quantity);
    const existing = byStudent.get(ticket.studentId);
    if (existing) existing.qty += ticket.quantity;
    else {
      byStudent.set(ticket.studentId, {
        name: ticket.student.name,
        enrollment: ticket.student.enrollmentNumber,
        qty: ticket.quantity,
      });
    }
  }

  const sold = event.tickets.reduce((sum, t) => sum + t.quantity, 0);
  const checkedIn = event.tickets.filter((t) => t.status === "used").reduce((sum, t) => sum + t.quantity, 0);
  const revenue = event.tickets.reduce((sum, t) => sum + t.amountInPaise, 0);
  const window = bookingWindowStatus(event);
  const classes = [...byClass.keys()].sort((a, b) => Number(a) - Number(b) || a.localeCompare(b));
  const sections = [...bySection.keys()].sort();

  return (
    <main>
      <Link href="/admin/events" className="text-sm text-maroon">
        ← Events
      </Link>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-maroon">
            {event.category} · {window.label}
          </p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl">{event.title}</h1>
          <p className="mt-2 text-sm text-muted">
            {formatEventDate(event.startsAt)} · {formatEventTime(event.startsAt)} · {event.venue}
          </p>
        </div>
        <Link href={`/events/${event.slug}`} className="text-sm text-maroon">
          Public page
        </Link>
      </div>

      <section className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Sold", `${sold} / ${event.totalSeats}`],
          ["Checked in", String(checkedIn)],
          ["Revenue", formatInr(revenue)],
          ["Pending cash", String(event.cashRequests.length)],
        ].map(([label, value]) => (
          <article key={label} className="border border-gold-soft bg-paper p-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-maroon">{label}</p>
            <p className="mt-2 font-display text-2xl">{value}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <EventDeadlineForm
          eventId={event.id}
          bookingOpensAt={toLocalInput(event.bookingOpensAt)}
          bookingClosesAt={toLocalInput(event.bookingClosesAt)}
          published={event.published}
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <article className="border border-gold-soft bg-paper p-4">
            <h3 className="font-display text-lg">By standard</h3>
            <ul className="mt-3 space-y-1 text-sm">
              {[...byClass.entries()]
                .sort((a, b) => Number(a[0]) - Number(b[0]) || a[0].localeCompare(b[0]))
                .map(([key, qty]) => (
                  <li key={key} className="flex justify-between gap-2">
                    <span>Class {key}</span>
                    <strong>{qty}</strong>
                  </li>
                ))}
              {!byClass.size ? <li className="text-muted">No passes yet</li> : null}
            </ul>
          </article>
          <article className="border border-gold-soft bg-paper p-4">
            <h3 className="font-display text-lg">By section</h3>
            <ul className="mt-3 space-y-1 text-sm">
              {[...bySection.entries()].sort().map(([key, qty]) => (
                <li key={key} className="flex justify-between gap-2">
                  <span>{key}</span>
                  <strong>{qty}</strong>
                </li>
              ))}
              {!bySection.size ? <li className="text-muted">No passes yet</li> : null}
            </ul>
          </article>
          <article className="border border-gold-soft bg-paper p-4">
            <h3 className="font-display text-lg">Top students</h3>
            <ul className="mt-3 space-y-1 text-sm">
              {[...byStudent.values()]
                .sort((a, b) => b.qty - a.qty)
                .slice(0, 8)
                .map((row) => (
                  <li key={row.enrollment} className="flex justify-between gap-2">
                    <span className="truncate">{row.name}</span>
                    <strong>{row.qty}</strong>
                  </li>
                ))}
              {!byStudent.size ? <li className="text-muted">No passes yet</li> : null}
            </ul>
          </article>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-2xl">Event tickets</h2>
          <form className="flex flex-wrap gap-2">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search student / buyer"
              className="border border-gold-soft bg-paper px-3 py-2 text-sm"
            />
            <select name="className" defaultValue={className} className="border border-gold-soft bg-paper px-3 py-2 text-sm">
              <option value="">All classes</option>
              {classes.map((item) => (
                <option key={item} value={item}>
                  Class {item}
                </option>
              ))}
            </select>
            <select name="section" defaultValue={section} className="border border-gold-soft bg-paper px-3 py-2 text-sm">
              <option value="">All sections</option>
              {sections.map((item) => (
                <option key={item} value={item.split("-")[1]}>
                  {item}
                </option>
              ))}
            </select>
            <button className="rounded-full bg-maroon px-4 py-2 text-sm text-paper">Filter</button>
          </form>
        </div>

        <div className="mt-4 overflow-x-auto border border-gold-soft bg-paper">
          <table className="w-full text-left text-sm">
            <thead className="bg-gold-soft/40">
              <tr>
                <th className="px-3 py-2">Student</th>
                <th className="px-3 py-2">Class</th>
                <th className="px-3 py-2">Seats</th>
                <th className="px-3 py-2">Payment</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Pass</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ticket) => (
                <tr key={ticket.id} className="border-t border-gold-soft">
                  <td className="px-3 py-2">
                    {ticket.student.name}
                    <div className="text-xs text-muted">{ticket.student.enrollmentNumber}</div>
                  </td>
                  <td className="px-3 py-2">
                    {ticket.student.className}-{ticket.student.section}
                  </td>
                  <td className="px-3 py-2">{ticket.seatLabels}</td>
                  <td className="px-3 py-2 capitalize">
                    {ticket.paymentMethod} · {ticket.paymentStatus}
                  </td>
                  <td className="px-3 py-2 capitalize">{ticket.status}</td>
                  <td className="px-3 py-2">
                    <Link href={`/ticket/${ticket.qrToken}`} className="text-maroon">
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
              {!filtered.length ? (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-muted">
                    No tickets match these filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
