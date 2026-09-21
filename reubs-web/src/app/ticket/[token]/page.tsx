import Image from "next/image";
import Link from "next/link";
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
  const code = `REUBS-${ticket.qrToken.slice(0, 6).toUpperCase()}`;

  return (
    <main className="mx-auto max-w-lg px-4 py-10 sm:px-5 sm:py-14">
      {confirmed ? (
        <div className="mb-6 border border-sage bg-paper px-5 py-4 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-sage">Booking confirmed</p>
          <p className="mt-2 font-display text-3xl">Your seats are locked in</p>
          <p className="mt-1 text-sm text-muted">Pass {code}</p>
        </div>
      ) : null}

      <article className="overflow-hidden border border-gold-soft bg-paper shadow-[0_18px_40px_-28px_rgba(27,20,16,0.35)]">
        <div className="bg-maroon-deep px-5 py-5 text-paper">
          <p className="text-[11px] uppercase tracking-[0.22em] text-gold">{school.shortName}</p>
          <h1 className="mt-2 font-display text-3xl leading-tight">{ticket.event.title}</h1>
          <p className="mt-2 text-sm text-gold-soft">
            {formatEventDate(ticket.event.startsAt)} · {formatEventTime(ticket.event.startsAt)}
          </p>
          <p className="text-sm text-gold-soft">{ticket.event.venue}</p>
        </div>

        <div className="relative h-36">
          <Image src={ticket.event.imageUrl} alt="" fill className="object-cover" sizes="512px" />
          <div className="absolute inset-0 bg-gradient-to-t from-paper via-transparent to-transparent" />
        </div>

        <div className="px-5 pb-6">
          <div className="ticket-perforation -mt-3 mb-5 h-5 border-y border-dashed border-gold-soft" />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-maroon">Student</p>
              <p className="mt-1 font-display text-2xl">{ticket.student.name}</p>
              <p className="text-sm text-muted">
                {ticket.student.enrollmentNumber} · Class {ticket.student.className}-
                {ticket.student.section}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-maroon">Seats</p>
              <p className="mt-1 font-display text-2xl">{seats.length ? seats.join(", ") : "-"}</p>
              <p className="text-sm text-muted">
                {ticket.quantity === 1 ? "1 pass" : `${ticket.quantity} passes`} ·{" "}
                {formatInr(ticket.amountInPaise)}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-sm border border-gold-soft bg-cream px-4 py-3 text-sm">
            <p>
              Buyer: <strong>{ticket.buyerName}</strong>
            </p>
            <p className="text-muted">{ticket.buyerEmail}</p>
          </div>

          <img src={qr} alt="Ticket QR code" className="mx-auto mt-6 w-52 sm:w-56" />
          <p className="mt-3 text-center text-xs uppercase tracking-[0.16em] text-muted">
            {code} · {ticket.status}
          </p>
          <p className="mt-3 text-center text-xs text-muted">
            Show this QR at the gate. Each pass can be scanned once.
          </p>
          <p className="mt-2 text-center text-xs text-muted">
            {ticket.emailSent ? "Emailed. " : "Email pending (SMTP not set). "}
            {ticket.whatsappSent ? "WhatsApp sent." : "WhatsApp pending (Twilio not set)."}
          </p>

          <div className="mt-6 flex justify-center gap-4 text-sm">
            <Link href="/events" className="text-maroon">
              More events
            </Link>
          </div>
        </div>
      </article>

      <p className="mt-4 text-center text-sm text-muted print:hidden">
        Use your browser print dialog to save this pass as PDF.
      </p>
    </main>
  );
}
