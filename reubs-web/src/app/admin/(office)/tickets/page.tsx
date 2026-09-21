import Link from "next/link";
import { TicketActions } from "@/components/admin/TicketActions";
import { TicketCreateForm } from "@/components/admin/TicketCreateForm";
import { prisma } from "@/lib/prisma";
import { formatInr } from "@/lib/school";
import { seatsForTicket } from "@/lib/seatStore";

export default async function AdminTicketsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    payment?: string;
    eventId?: string;
    sort?: string;
  }>;
}) {
  const { q = "", status = "", payment = "", eventId = "", sort = "newest" } = await searchParams;

  const [tickets, events, students] = await Promise.all([
    prisma.ticket.findMany({
      where: {
        AND: [
          status ? { status } : {},
          payment ? { paymentMethod: payment } : {},
          eventId ? { eventId } : {},
          q
            ? {
                OR: [
                  { buyerName: { contains: q } },
                  { buyerEmail: { contains: q } },
                  { buyerPhone: { contains: q } },
                  { student: { name: { contains: q } } },
                  { student: { enrollmentNumber: { contains: q } } },
                  { event: { title: { contains: q } } },
                ],
              }
            : {},
        ],
      },
      include: { event: true, student: true },
      orderBy: sort === "amount" ? { amountInPaise: "desc" } : { purchasedAt: "desc" },
      take: 100,
    }),
    prisma.event.findMany({ orderBy: { startsAt: "asc" }, select: { id: true, title: true, priceInPaise: true } }),
    prisma.student.findMany({
      where: { active: true },
      orderBy: { enrollmentNumber: "asc" },
      select: { id: true, enrollmentNumber: true, name: true, className: true, section: true },
    }),
  ]);

  const rows = await Promise.all(
    tickets.map(async (ticket) => ({
      ...ticket,
      seatLabels: (await seatsForTicket(ticket.id)).join(", ") || "-",
    })),
  );

  return (
    <main>
      <h1 className="font-display text-3xl">Ticket management</h1>
      <p className="mt-2 text-sm text-muted">Search, filter, issue cash/office passes, resend or cancel.</p>

      <form className="mt-6 flex flex-wrap gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search student, buyer, event"
          className="min-w-[220px] flex-1 border border-gold-soft bg-paper px-3 py-2 text-sm"
        />
        <select name="eventId" defaultValue={eventId} className="border border-gold-soft bg-paper px-3 py-2 text-sm">
          <option value="">All events</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title}
            </option>
          ))}
        </select>
        <select name="status" defaultValue={status} className="border border-gold-soft bg-paper px-3 py-2 text-sm">
          <option value="">All statuses</option>
          <option value="valid">Valid</option>
          <option value="used">Used</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select name="payment" defaultValue={payment} className="border border-gold-soft bg-paper px-3 py-2 text-sm">
          <option value="">All payments</option>
          <option value="online">Online</option>
          <option value="cash">Cash</option>
          <option value="free">Free</option>
        </select>
        <select name="sort" defaultValue={sort} className="border border-gold-soft bg-paper px-3 py-2 text-sm">
          <option value="newest">Newest</option>
          <option value="amount">Highest amount</option>
        </select>
        <button className="rounded-full bg-maroon px-4 py-2 text-sm text-paper">Apply</button>
      </form>

      <div className="mt-8">
        <TicketCreateForm events={events} students={students} />
      </div>

      <div className="mt-8 overflow-x-auto border border-gold-soft bg-paper">
        <table className="w-full text-left text-sm">
          <thead className="bg-gold-soft/40">
            <tr>
              <th className="px-3 py-2">Student</th>
              <th className="px-3 py-2">Event</th>
              <th className="px-3 py-2">Seats</th>
              <th className="px-3 py-2">Amount</th>
              <th className="px-3 py-2">Payment</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Pass</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((ticket) => (
              <tr key={ticket.id} className="border-t border-gold-soft">
                <td className="px-3 py-2">
                  {ticket.student.name}
                  <div className="text-xs text-muted">
                    {ticket.student.enrollmentNumber} · {ticket.student.className}-{ticket.student.section}
                  </div>
                </td>
                <td className="px-3 py-2">
                  <Link href={`/admin/events/${ticket.eventId}`} className="text-maroon">
                    {ticket.event.title}
                  </Link>
                </td>
                <td className="px-3 py-2">{ticket.seatLabels}</td>
                <td className="px-3 py-2">{formatInr(ticket.amountInPaise)}</td>
                <td className="px-3 py-2 capitalize">
                  {ticket.paymentMethod}
                  <div className="text-xs text-muted">{ticket.paymentStatus}</div>
                </td>
                <td className="px-3 py-2 capitalize">{ticket.status}</td>
                <td className="px-3 py-2">
                  <Link href={`/ticket/${ticket.qrToken}`} className="text-maroon">
                    Open
                  </Link>
                </td>
                <td className="px-3 py-2">
                  <TicketActions ticketId={ticket.id} status={ticket.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
