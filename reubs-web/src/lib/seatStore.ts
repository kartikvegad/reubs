import { prisma } from "./prisma";
import { parseSeats, joinSeats } from "./seats";

export async function bookedSeatsForEvent(eventId: string) {
  const rows = await prisma.$queryRaw<{ seats: string | null }[]>`
    SELECT seats FROM Ticket WHERE eventId = ${eventId} AND status != 'cancelled'
  `;
  return rows.flatMap((row) => parseSeats(row.seats));
}

export async function saveTicketSeats(ticketId: string, seats: string[]) {
  const value = joinSeats(seats);
  await prisma.$executeRaw`UPDATE Ticket SET seats = ${value} WHERE id = ${ticketId}`;
}

export async function seatsForTicket(ticketId: string) {
  const rows = await prisma.$queryRaw<{ seats: string | null }[]>`
    SELECT seats FROM Ticket WHERE id = ${ticketId} LIMIT 1
  `;
  return parseSeats(rows[0]?.seats);
}
