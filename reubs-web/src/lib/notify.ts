import nodemailer from "nodemailer";
import { prisma } from "./prisma";
import { seatsForTicket } from "./seatStore";
import { makeQrPng } from "./tickets";
import { formatEventDate, formatEventTime, formatInr, school } from "./school";

type TicketMail = {
  id: string;
  qrToken: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  amountInPaise: number;
  seats?: string;
  event: { title: string; venue: string; startsAt: Date };
  student: { name: string; enrollmentNumber: string; className: string; section: string };
};

function appUrl() {
  return process.env.APP_URL || "http://localhost:3000";
}

function ticketUrl(token: string) {
  return `${appUrl()}/ticket/${token}`;
}

async function log(ticketId: string, channel: string, status: string, detail: string) {
  await prisma.notificationLog.create({ data: { ticketId, channel, status, detail } });
}

function emailHtml(ticket: TicketMail) {
  const when = `${formatEventDate(ticket.event.startsAt)} · ${formatEventTime(ticket.event.startsAt)}`;
  return `
  <div style="font-family:Georgia,serif;background:#f6efe3;padding:28px">
    <div style="max-width:560px;margin:auto;background:#fffdf8;border:1px solid #e6d7b8;padding:28px">
      <p style="letter-spacing:.18em;text-transform:uppercase;color:#7a1f2b;font-size:12px;margin:0 0 8px">${school.shortName} EVENTS</p>
      <h1 style="margin:0 0 16px;font-size:28px;color:#1b1410">Your e-ticket is ready</h1>
      <p style="color:#3d342c;line-height:1.6">Hello ${ticket.buyerName}, your pass for <strong>${ticket.event.title}</strong> has been issued for student ${ticket.student.name} (${ticket.student.enrollmentNumber}).</p>
      <table style="width:100%;margin:18px 0;color:#1b1410">
        <tr><td>When</td><td style="text-align:right">${when}</td></tr>
        <tr><td>Venue</td><td style="text-align:right">${ticket.event.venue}</td></tr>
        <tr><td>Seats</td><td style="text-align:right">${ticket.seats || "General"}</td></tr>
        <tr><td>Amount</td><td style="text-align:right">${formatInr(ticket.amountInPaise)}</td></tr>
      </table>
      <p style="text-align:center"><img src="cid:reubsticket" alt="Ticket QR" width="220" /></p>
      <p style="text-align:center"><a href="${ticketUrl(ticket.qrToken)}" style="color:#7a1f2b">Open digital pass</a></p>
      <p style="font-size:13px;color:#6b5b4f">Show this QR at the school gate. Each pass can be scanned once.</p>
    </div>
  </div>`;
}

async function sendEmail(ticket: TicketMail, png: Buffer) {
  const host = process.env.SMTP_HOST;
  if (!host) {
    await log(ticket.id, "email", "skipped", "SMTP not configured. Ticket is still stored.");
    return false;
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_PORT === "465",
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });

  await transporter.sendMail({
    from: process.env.MAIL_FROM || school.email,
    to: ticket.buyerEmail,
    subject: `${school.shortName} e-ticket · ${ticket.event.title}`,
    text: `Your REUBS pass for ${ticket.event.title} is ready: ${ticketUrl(ticket.qrToken)}`,
    html: emailHtml(ticket),
    attachments: [{ filename: "reubs-ticket.png", content: png, cid: "reubsticket" }],
  });
  await log(ticket.id, "email", "sent", `Sent to ${ticket.buyerEmail}`);
  return true;
}

async function sendWhatsapp(ticket: TicketMail) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;
  if (!sid || !token || !from) {
    await log(ticket.id, "whatsapp", "skipped", "Twilio WhatsApp not configured.");
    return false;
  }

  const to = ticket.buyerPhone.replace(/\s+/g, "");
  const dest = to.startsWith("whatsapp:")
    ? to
    : `whatsapp:${to.startsWith("+") ? to : `+91${to.replace(/^0/, "")}`}`;

  const body = [
    `${school.shortName} e-ticket confirmed`,
    ticket.event.title,
    `${ticket.student.name} · ${ticket.student.enrollmentNumber}`,
    ticket.seats ? `Seats: ${ticket.seats}` : "",
    `${formatEventDate(ticket.event.startsAt)} · ${ticket.event.venue}`,
    `Open pass: ${ticketUrl(ticket.qrToken)}`,
  ].filter(Boolean).join("\n");

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ From: from, To: dest, Body: body }),
    },
  );

  if (!res.ok) {
    const detail = await res.text();
    await log(ticket.id, "whatsapp", "failed", detail.slice(0, 400));
    return false;
  }

  await log(ticket.id, "whatsapp", "sent", `Sent to ${dest}`);
  return true;
}

export async function deliverTicket(ticketId: string) {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: { event: true, student: true },
  });
  if (!ticket) return;

  const seatLabels = (await seatsForTicket(ticket.id)).join(", ");
  const mailTicket = { ...ticket, seats: seatLabels };
  const png = await makeQrPng(ticket.qrToken);
  let emailSent = ticket.emailSent;
  let whatsappSent = ticket.whatsappSent;
  const notes: string[] = [];

  try {
    emailSent = await sendEmail(mailTicket, png);
  } catch (error) {
    notes.push(`email: ${error instanceof Error ? error.message : "failed"}`);
    await log(ticket.id, "email", "failed", notes.at(-1) || "failed");
  }

  try {
    whatsappSent = await sendWhatsapp(mailTicket);
  } catch (error) {
    notes.push(`whatsapp: ${error instanceof Error ? error.message : "failed"}`);
    await log(ticket.id, "whatsapp", "failed", notes.at(-1) || "failed");
  }

  await prisma.ticket.update({
    where: { id: ticket.id },
    data: {
      emailSent,
      whatsappSent,
      notifyNote: notes.join(" | ") || null,
    },
  });
}
