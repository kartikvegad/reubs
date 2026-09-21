import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatEventDate, formatEventTime, formatInr, school } from "@/lib/school";
import { seatsForTicket } from "@/lib/seatStore";
import { makeQrDataUrl } from "@/lib/tickets";

export default async function TicketPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ confirmed?: string }>;
}) {
  const { token } = await params;
  const { confirmed } = await searchParams;
  const ticket = await prisma.ticket.findUnique({
    where: { qrToken: token },
    include: { event: true, student: true },
  });
  if (!ticket) notFound();

  const qr = await makeQrDataUrl(ticket.qrToken);
  const seats = await seatsForTicket(ticket.id);

  return (
    <main className="mx-auto max-w-lg px-5 py-14">
      {confirmed ? (
        <div className="mb-8 border border-sage bg-paper px-5 py-4 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-sage">Booking confirmed</p>
          <p className="mt-2 font-display text-3xl">Your seats are locked in</p>
          <p className="mt-1 text-sm text-muted">Booking ID {ticket.qrToken.slice(0, 8).toUpperCase()}</p>
        </div>
      ) : null}
      <p className="text-center text-xs uppercase tracking-[0.22em] text-maroon">
        {school.shortName} e-ticket
      </p>
      <article className="mt-6 overflow-hidden border border-gold-soft bg-paper shadow-sm">
        <div className="relative h-40">
          <Image src={ticket.event.imageUrl} alt="" fill className="object-cover" sizes="512px" />
        </div>
        <div className="p-6">
          <h1 className="font-display text-3xl">{ticket.event.title}</h1>
          <p className="mt-2 text-sm text-muted">
            {formatEventDate(ticket.event.startsAt)} · {formatEventTime(ticket.event.startsAt)}
          </p>
          <p className="text-sm">{ticket.event.venue}</p>
          <div className="ticket-perforation my-6 h-6 border-y border-dashed border-gold-soft" />
          <p className="text-sm">
            {ticket.student.name} · Class {ticket.student.className}-{ticket.student.section}
          </p>
          <p className="text-sm text-muted">{ticket.student.enrollmentNumber}</p>
          <p className="mt-2 text-sm">Buyer: {ticket.buyerName}</p>
          {seats.length ? <p className="mt-2 text-sm">Seats: {seats.join(", ")}</p> : null}
          <p className="text-sm">
            {ticket.quantity === 1 ? "1 pass" : `${ticket.quantity} passes`} · {formatInr(ticket.amountInPaise)}
          </p>
          <img src={qr} alt="Ticket QR code" className="mx-auto mt-6 w-56" />
          <p className="mt-3 text-center text-xs uppercase tracking-[0.16em] text-muted">
            Status: {ticket.status}
          </p>
          <p className="mt-4 text-center text-xs text-muted">
            {ticket.emailSent ? "Emailed. " : "Email pending (SMTP not set). "}
            {ticket.whatsappSent ? "WhatsApp sent." : "WhatsApp pending (Twilio not set)."}
          </p>
        </div>
      </article>
    </main>
  );
}
