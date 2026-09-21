import { notFound } from "next/navigation";
import { BookingFlow } from "@/components/events/BookingFlow";
import { prisma } from "@/lib/prisma";
import { formatEventDate, formatInr } from "@/lib/school";
import { hallCapacity } from "@/lib/seats";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug },
    include: { tickets: { where: { status: { not: "cancelled" } }, select: { quantity: true } } },
  });
  if (!event || !event.published) notFound();

  const sold = event.tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
  const capacity = Math.min(event.totalSeats, hallCapacity());

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <p className="text-xs uppercase tracking-[0.2em] text-maroon">Book seats</p>
      <h1 className="mt-2 font-display text-4xl">{event.title}</h1>
      <p className="mt-2 text-muted">
        {formatEventDate(event.startsAt)} · {event.venue} · {formatInr(event.priceInPaise)} ·{" "}
        {Math.max(0, capacity - sold)} seats left
      </p>
      <BookingFlow
        slug={event.slug}
        title={event.title}
        priceInPaise={event.priceInPaise}
        maxPerStudent={event.maxPerStudent}
      />
    </main>
  );
}
