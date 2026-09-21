import Link from "next/link";
import { CashRequestActions, CashRequestCreateForm } from "@/components/admin/CashRequestForms";
import { prisma } from "@/lib/prisma";

export default async function AdminCashRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; eventId?: string }>;
}) {
  const { status = "pending", eventId = "" } = await searchParams;

  const [requests, events, students] = await Promise.all([
    prisma.cashTicketRequest.findMany({
      where: {
        AND: [status ? { status } : {}, eventId ? { eventId } : {}],
      },
      include: { event: true, student: true, ticket: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.event.findMany({ orderBy: { startsAt: "asc" }, select: { id: true, title: true } }),
    prisma.student.findMany({
      where: { active: true },
      orderBy: { enrollmentNumber: "asc" },
      select: { id: true, enrollmentNumber: true, name: true },
    }),
  ]);

  return (
    <main>
      <h1 className="font-display text-3xl">Cash ticket requests</h1>
      <p className="mt-2 text-sm text-muted">
        Front-desk cash requests waiting for office approval. Approving issues a paid cash pass.
      </p>

      <form className="mt-6 flex flex-wrap gap-2">
        <select name="status" defaultValue={status} className="border border-gold-soft bg-paper px-3 py-2 text-sm">
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select name="eventId" defaultValue={eventId} className="border border-gold-soft bg-paper px-3 py-2 text-sm">
          <option value="">All events</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title}
            </option>
          ))}
        </select>
        <button className="rounded-full bg-maroon px-4 py-2 text-sm text-paper">Apply</button>
      </form>

      <div className="mt-8">
        <CashRequestCreateForm events={events} students={students} />
      </div>

      <div className="mt-8 overflow-x-auto border border-gold-soft bg-paper">
        <table className="w-full text-left text-sm">
          <thead className="bg-gold-soft/40">
            <tr>
              <th className="px-3 py-2">When</th>
              <th className="px-3 py-2">Student</th>
              <th className="px-3 py-2">Event</th>
              <th className="px-3 py-2">Buyer</th>
              <th className="px-3 py-2">Qty / seats</th>
              <th className="px-3 py-2">Note</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id} className="border-t border-gold-soft">
                <td className="px-3 py-2 whitespace-nowrap">
                  {request.createdAt.toLocaleString("en-IN")}
                </td>
                <td className="px-3 py-2">
                  {request.student.name}
                  <div className="text-xs text-muted">{request.student.enrollmentNumber}</div>
                </td>
                <td className="px-3 py-2">
                  <Link href={`/admin/events/${request.eventId}`} className="text-maroon">
                    {request.event.title}
                  </Link>
                </td>
                <td className="px-3 py-2">
                  {request.buyerName}
                  <div className="text-xs text-muted">{request.buyerPhone}</div>
                </td>
                <td className="px-3 py-2">
                  {request.quantity}
                  {request.seats ? ` · ${request.seats}` : ""}
                </td>
                <td className="px-3 py-2">{request.note || "-"}</td>
                <td className="px-3 py-2">
                  {request.ticket ? (
                    <Link href={`/ticket/${request.ticket.qrToken}`} className="text-maroon">
                      Open pass
                    </Link>
                  ) : (
                    <CashRequestActions requestId={request.id} status={request.status} />
                  )}
                </td>
              </tr>
            ))}
            {!requests.length ? (
              <tr>
                <td colSpan={7} className="px-3 py-6 text-muted">
                  No cash requests in this filter.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </main>
  );
}
