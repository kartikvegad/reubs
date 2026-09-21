import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Eyebrow, Photo } from "@/components/site/Photo";
import { eventAudience, registrationLabel } from "@/lib/eventMeta";
import { prisma } from "@/lib/prisma";
import { formatEventDate, formatEventTime, formatInr } from "@/lib/school";
import { hallCapacity } from "@/lib/seats";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug } });
  return { title: event?.title || "Event" };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug },
    include: { tickets: { where: { status: { not: "cancelled" } }, select: { quantity: true } } },
  });
  if (!event || !event.published) notFound();

  const sold = event.tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
  const capacity = Math.min(event.totalSeats, hallCapacity());
  const left = Math.max(0, capacity - sold);
  const upcoming = event.startsAt > new Date();
  const open = upcoming && left > 0;
  const others = await prisma.event.findMany({
    where: { published: true, slug: { not: event.slug }, startsAt: { gte: new Date() } },
    orderBy: { startsAt: "asc" },
    take: 3,
  });

  return (
    <main>
      <div className="relative h-[58vh] min-h-[380px]">
        <Photo src={event.imageUrl} alt={event.title} className="absolute inset-0" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/20" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-5 pb-10 text-paper">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">{event.category}</p>
          <h1 className="mt-2 font-display text-5xl md:text-6xl">{event.title}</h1>
          <p className="mt-3 max-w-2xl text-gold-soft">{event.summary}</p>
        </div>
      </div>
      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-12 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <Eyebrow>About this programme</Eyebrow>
          <p className="mt-4 text-lg leading-8 text-muted">{event.description}</p>
          <p className="mt-6 leading-8 text-muted">
            This is a live booking listing in the school’s event system. Dates, prices and seat maps
            can be updated by staff. Passes are issued only against a current Reubs enrollment
            number. Each student may hold up to {event.maxPerStudent} seats for this programme.
          </p>
          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              ["Date", formatEventDate(event.startsAt)],
              ["Time", `${formatEventTime(event.startsAt)} – ${formatEventTime(event.endsAt)}`],
              ["Location", event.venue],
              ["Audience", eventAudience(event.category)],
              ["Registration", registrationLabel(open, upcoming, left)],
              ["Pass", formatInr(event.priceInPaise)],
            ].map(([label, value]) => (
              <div key={label} className="border border-gold-soft bg-paper p-4">
                <dt className="text-[11px] uppercase tracking-[0.16em] text-maroon">{label}</dt>
                <dd className="mt-1">{value}</dd>
              </div>
            ))}
          </dl>
          <ul className="mt-8 space-y-2 text-sm text-muted">
            <li>Student enrollment number required at checkout</li>
            <li>Choose seats on the hall map, then pay and receive a QR e-ticket</li>
            <li>Email and WhatsApp delivery after confirmation, when those services are connected</li>
            <li>The gate scanner accepts each QR code once</li>
          </ul>
        </div>
        <aside className="h-fit border border-gold-soft bg-paper p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-maroon">Get a pass</p>
          <p className="mt-3 font-display text-4xl">{formatInr(event.priceInPaise)}</p>
          <p className="mt-1 text-sm text-muted">
            {left} of {capacity} seats left
          </p>
          <p className="mt-4 text-sm leading-6 text-muted">{eventAudience(event.category)}</p>
          {open ? (
            <Link
              href={`/events/${event.slug}/checkout`}
              className="mt-6 block rounded-full bg-maroon px-5 py-3 text-center text-paper"
            >
              Register / Get pass
            </Link>
          ) : (
            <p className="mt-6 text-sm text-maroon">Booking is closed for this event.</p>
          )}
          <Link href="/events" className="mt-4 block text-center text-sm text-maroon">
            All events
          </Link>
        </aside>
      </section>
      {others.length ? (
        <section className="bg-paper py-14">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="font-display text-3xl">Other upcoming programmes</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {others.map((item) => (
                <Link key={item.id} href={`/events/${item.slug}`} className="bg-cream">
                  <Photo src={item.imageUrl} alt={item.title} className="aspect-[16/10]" />
                  <div className="p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-maroon">{item.category}</p>
                    <h3 className="mt-1 font-display text-2xl">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted">{formatEventDate(item.startsAt)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
