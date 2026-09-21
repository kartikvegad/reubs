import type { Metadata } from "next";
import Link from "next/link";
import { EventCard } from "@/components/site/EventCard";
import { Eyebrow, Note, Photo } from "@/components/site/Photo";
import { demoCalendar, demoPastEvents, eventAudience, registrationLabel } from "@/lib/eventMeta";
import { img } from "@/lib/media";
import { prisma } from "@/lib/prisma";
import { formatEventDate, formatEventTime, formatInr } from "@/lib/school";
import { hallCapacity } from "@/lib/seats";

export const metadata: Metadata = { title: "Events" };

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    where: { published: true },
    orderBy: { startsAt: "asc" },
    include: { tickets: { where: { status: { not: "cancelled" } }, select: { quantity: true } } },
  });

  const now = new Date();
  const upcoming = events.filter((event) => event.startsAt > now);
  const pastLive = events.filter((event) => event.startsAt <= now);
  const featured = upcoming[0];

  function cardFor(event: (typeof events)[number], featuredCard = false) {
    const sold = event.tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
    const left = Math.max(0, Math.min(event.totalSeats, hallCapacity()) - sold);
    const upcomingEvent = event.startsAt > now;
    const open = upcomingEvent && left > 0;
    return (
      <EventCard
        key={event.id}
        href={`/events/${event.slug}`}
        image={event.imageUrl}
        category={event.category}
        title={event.title}
        summary={event.summary}
        date={formatEventDate(event.startsAt)}
        time={formatEventTime(event.startsAt)}
        venue={event.venue}
        audience={eventAudience(event.category)}
        status={registrationLabel(open, upcomingEvent, left)}
        cta={open ? `${formatInr(event.priceInPaise)} · Get pass` : "View details"}
        featured={featuredCard}
      />
    );
  }

  return (
    <main>
      <section className="relative min-h-[42vh]">
        <Photo src={img.concert} alt="School event on stage" className="absolute inset-0" sizes="100vw" priority />
        <div className="absolute inset-0 bg-maroon-deep/70" />
        <div className="relative mx-auto max-w-6xl px-5 py-20 text-paper">
          <Eyebrow>Campus calendar</Eyebrow>
          <h1 className="mt-3 max-w-3xl font-display text-5xl md:text-6xl">Events at Reubs</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-gold-soft">
            Annual Day, sports, science, workshops and family programmes, with reserved seats and a
            QR pass for verified students. Listings below mix live booking with demo cards the office
            can replace.
          </p>
        </div>
      </section>

      {featured ? (
        <section className="mx-auto max-w-6xl px-5 py-14">
          <Eyebrow>Next on the calendar</Eyebrow>
          <div className="mt-6">{cardFor(featured, true)}</div>
        </section>
      ) : null}

      <section id="upcoming" className="mx-auto max-w-6xl px-5 pb-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-4xl">Upcoming events</h2>
            <p className="mt-2 max-w-xl text-muted">
              Book with a current enrollment number. Choose up to five seats, then collect a QR
              e-ticket by email or WhatsApp when delivery is configured.
            </p>
          </div>
          <Link href="/events#calendar" className="text-sm text-maroon">
            View all events
          </Link>
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {upcoming.filter((event) => event.id !== featured?.id).map((event) => cardFor(event))}
        </div>
        {upcoming.length === 0 ? (
          <p className="mt-8 text-muted">No live upcoming dates in the booking system yet. Sample past programmes appear below.</p>
        ) : null}
      </section>

      <section id="calendar" className="bg-paper py-16">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="font-display text-4xl">How the year is meant to look</h2>
          <Note>Category labels for the office, not a guarantee that every programme runs every year.</Note>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {demoCalendar.map(([title, copy]) => (
              <article key={title} className="border border-gold-soft p-4">
                <h3 className="font-display text-xl">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="past" className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-display text-4xl">Past events</h2>
        <p className="mt-2 max-w-2xl text-muted">
          Sample archive cards so the page does not go empty after a season. Replace photographs and
          copy with the school’s own record.
        </p>
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {pastLive.map((event) => cardFor(event))}
          {demoPastEvents.map((event) => (
            <EventCard
              key={event.slug}
              image={event.image}
              category={event.category}
              title={event.title}
              summary={event.summary}
              date={event.date}
              time={event.time}
              venue={event.venue}
              audience={event.audience}
              status="Closed · demo archive"
            />
          ))}
        </div>
      </section>
    </main>
  );
}
