# REUBS School website & event passes

Website for **REUBS Primary & Higher Secondary School**, a CBSE English-medium campus in Maninagar, Ahmedabad. Families can read about the school, book event passes (BookMyShow-style), and receive a QR e-ticket. Gate staff scan those codes on a separate scanner screen.

## What is included

- School pages: home, about, academics, admissions, gallery, contact
- Upcoming events with seat counts and pass prices
- Student check at checkout (enrollment / roll number must match the school roll)
- QR e-ticket stored in the database with buyer details
- Email + WhatsApp delivery when SMTP / Twilio are configured
- Staff scanner at `/scan` (phone camera)
- Office console at `/admin` (events, tickets, student roll, delivery log)

## Run locally

```bash
cd reubs-web
npm install
npm run db:setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo logins and students

| Role | Email | Password |
| --- | --- | --- |
| Office admin | `admin@reubs.school` | `ReubsAdmin@2026` |
| Gate scanner | `scanner@reubs.school` | `ScanGate@2026` |

Sample enrollment numbers: `REU2026-1001` (Aanya Shah) through `REU2026-1008`.

## How a pass is issued

1. Parent opens **Events** and chooses a programme.
2. They pick up to 5 seats on the hall map (BookMyShow-style).
3. They enter the student enrollment number. Only current students can continue.
4. Buyer name, email, and WhatsApp number are collected.
5. Payment (UPI / card / net banking demo, or confirm if free).
6. A confirmation page shows the QR e-ticket with seat numbers.
7. Email and WhatsApp go out if keys are set.

Without SMTP or Twilio, the ticket is still stored. The delivery log in `/admin` shows `skipped`.

## WhatsApp and email

Copy `.env.example` to `.env` and set:

- SMTP: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`
- WhatsApp (Twilio): `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM`

The WhatsApp message includes event details and a link to the QR pass. Email embeds the QR image.

## Scanner

1. Sign in at `/scan`.
2. Allow the camera.
3. Point at the ticket QR (`REUBS:<token>`).
4. A valid pass is marked used. A second scan is rejected.

The scanner and public site share one database, so they can be deployed as two hosts later if needed.

## Stack

Next.js, Tailwind, Prisma, SQLite. Swap `DATABASE_URL` to Postgres for production.
