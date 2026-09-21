import Link from "next/link";
import { bookingWindowStatus } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { formatEventDate, formatInr } from "@/lib/school";

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>;
}) {
  const { q = "", category = "", sort = "date" } = await searchParams;
  const events = await prisma.event.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { title: { contains: q } },
                { venue: { contains: q } },
                { category: { contains: q } },
              ],
            }
          : {},
        category ? { category } : {},
      ],
    },
    include: {
      tickets: {
        where: { status: { not: "cancelled" } },
        select: { quantity: true, amountInPaise: true, status: true },
      },
      _count: { select: { cashRequests: true } },
    },
    orderBy: sort === "title" ? { title: "asc" } : { startsAt: "asc" },
  });

  const categories = [...new Set((await prisma.event.findMany({ select: { category: true } })).map((e) => e.category))];

  return (
    <main>
      <h1 className="font-display text-3xl">Events</h1>
      <p className="mt-2 text-sm text-muted">Segregate programmes, set registration windows, open event ops.</p>

      <form className="mt-6 flex flex-wrap gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search title, venue, category"
          className="min-w-[220px] flex-1 border border-gold-soft bg-paper px-3 py-2 text-sm"
        />
        <select name="category" defaultValue={category} className="border border-gold-soft bg-paper px-3 py-2 text-sm">
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select name="sort" defaultValue={sort} className="border border-gold-soft bg-paper px-3 py-2 text-sm">
          <option value="date">Sort by date</option>
          <option value="title">Sort by title</option>
        </select>
        <button className="rounded-full bg-maroon px-4 py-2 text-sm text-paper">Apply</button>
      </form>

      <div className="mt-6 grid gap-4">
        {events.map((event) => {
          const sold = event.tickets.reduce((sum, t) => sum + t.quantity, 0);
          const checkedIn = event.tickets
            .filter((t) => t.status === "used")
            .reduce((sum, t) => sum + t.quantity, 0);
          const revenue = event.tickets.reduce((sum, t) => sum + t.amountInPaise, 0);
          const window = bookingWindowStatus(event);
          return (
            <article key={event.id} className="border border-gold-soft bg-paper p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-maroon">
                    {event.category} · {window.label}
                  </p>
                  <h2 className="mt-1 font-display text-2xl">{event.title}</h2>
                  <p className="mt-1 text-sm text-muted">
                    {formatEventDate(event.startsAt)} · {event.venue}
                  </p>
                </div>
                <Link href={`/admin/events/${event.id}`} className="rounded-full bg-maroon px-4 py-2 text-sm text-paper">
                  Open ops
                </Link>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                <div>
                  <dt className="text-muted">Sold</dt>
                  <dd>
                    {sold} / {event.totalSeats}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">Checked in</dt>
                  <dd>{checkedIn}</dd>
                </div>
                <div>
                  <dt className="text-muted">Revenue</dt>
                  <dd>{formatInr(revenue)}</dd>
                </div>
                <div>
                  <dt className="text-muted">Cash requests</dt>
                  <dd>{event._count.cashRequests}</dd>
                </div>
              </dl>
            </article>
          );
        })}
      </div>
    </main>
  );
}
