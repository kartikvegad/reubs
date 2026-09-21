import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PassActions } from "@/components/events/PassActions";
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
  const code = `REUBS-${ticket.qrToken.slice(0, 8).toUpperCase()}`;
  const paymentLabel =
    ticket.paymentStatus === "bypassed"
      ? "Payment bypassed (demo checkout)"
      : ticket.paymentStatus === "waived"
        ? "Free pass"
        : ticket.paymentStatus === "paid"
          ? `Paid · ${ticket.paymentMethod}`
          : `${ticket.paymentMethod} · ${ticket.paymentStatus}`;
  const eventWhen = `${formatEventDate(ticket.event.startsAt)} · ${formatEventTime(ticket.event.startsAt)}`;
  const issuedAt = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(ticket.purchasedAt);
  const quantityLabel = ticket.quantity === 1 ? "1 pass" : `${ticket.quantity} passes`;
  const classLabel = `Class ${ticket.student.className}-${ticket.student.section}`;
  const seatsLabel = seats.length ? seats.join(", ") : "-";
  const amountLabel = formatInr(ticket.amountInPaise);
  const safeFile = `REUBS-pass-${code}`.replace(/[^a-zA-Z0-9-_]/g, "-");

  return (
    <main className="mx-auto max-w-lg px-4 py-10 sm:px-5 sm:py-14">
      {confirmed ? (
        <div className="mb-6 border border-sage bg-paper px-5 py-4 text-center print:hidden">
          <p className="text-xs uppercase tracking-[0.2em] text-sage">Booking confirmed</p>
          <p className="mt-2 font-display text-3xl">Your QR pass is ready</p>
          <p className="mt-1 text-sm text-muted">Pass {code}</p>
        </div>
      ) : null}

      <article
        id="pass-card"
        className="overflow-hidden border border-gold-soft bg-paper shadow-[0_18px_40px_-28px_rgba(27,20,16,0.35)]"
      >
        <div className="bg-maroon-deep px-5 py-5 text-paper">
          <p className="text-[11px] uppercase tracking-[0.22em] text-gold">{school.shortName} e-ticket</p>
          <h1 className="mt-2 font-display text-3xl leading-tight">{ticket.event.title}</h1>
          <p className="mt-2 text-sm text-gold-soft">{eventWhen}</p>
          <p className="text-sm text-gold-soft">{ticket.event.venue}</p>
        </div>

        <div className="relative h-36 print:hidden">
          <Image src={ticket.event.imageUrl} alt="" fill className="object-cover" sizes="512px" />
          <div className="absolute inset-0 bg-gradient-to-t from-paper via-transparent to-transparent" />
        </div>

        <div className="px-5 pb-6">
          <div className="ticket-perforation -mt-3 mb-5 h-5 border-y border-dashed border-gold-soft print:mt-5" />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-maroon">Student</p>
              <p className="mt-1 font-display text-2xl">{ticket.student.name}</p>
              <p className="text-sm text-muted">{ticket.student.enrollmentNumber}</p>
              <p className="text-sm text-muted">{classLabel}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-maroon">Seats</p>
              <p className="mt-1 font-display text-2xl">{seatsLabel}</p>
              <p className="text-sm text-muted">{quantityLabel}</p>
              <p className="text-sm text-muted">{amountLabel}</p>
            </div>
          </div>

          <div className="mt-5 space-y-3 rounded-sm border border-gold-soft bg-cream px-4 py-4 text-sm">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-maroon">Buyer / guardian</p>
              <p className="mt-1 font-medium">{ticket.buyerName}</p>
              <p className="text-muted">{ticket.buyerEmail}</p>
              <p className="text-muted">{ticket.buyerPhone}</p>
            </div>
            <div className="border-t border-gold-soft/70 pt-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-maroon">Pass details</p>
              <p className="mt-1">
                ID: <strong>{code}</strong>
              </p>
              <p className="text-muted">Status: {ticket.status}</p>
              <p className="text-muted">{paymentLabel}</p>
              <p className="text-muted">Issued: {issuedAt}</p>
            </div>
          </div>

          <div className="mt-6 rounded-sm border border-gold-soft bg-paper px-4 py-5 text-center">
            <p className="text-[11px] uppercase tracking-[0.16em] text-maroon">Gate QR</p>
            <img src={qr} alt="Ticket QR code" className="mx-auto mt-3 w-52 sm:w-56" />
            <p className="mt-3 text-xs uppercase tracking-[0.16em] text-muted">{code}</p>
            <p className="mt-2 text-xs leading-5 text-muted">
              Show this QR at the gate with a photo ID if requested. Each pass can be scanned once.
            </p>
          </div>

          <PassActions
            fileName={safeFile}
            schoolName={school.shortName}
            eventTitle={ticket.event.title}
            eventWhen={eventWhen}
            venue={ticket.event.venue}
            studentName={ticket.student.name}
            enrollment={ticket.student.enrollmentNumber}
            classLabel={classLabel}
            seats={seatsLabel}
            quantityLabel={quantityLabel}
            amountLabel={amountLabel}
            buyerName={ticket.buyerName}
            buyerEmail={ticket.buyerEmail}
            buyerPhone={ticket.buyerPhone}
            passCode={code}
            status={ticket.status}
            paymentLabel={paymentLabel}
            issuedAt={issuedAt}
            qrDataUrl={qr}
          />

          <div className="mt-4 flex justify-center print:hidden">
            <Link href="/events" className="text-sm text-maroon">
              More events
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
