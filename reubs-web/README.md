# reubs-web

Next.js app for the REUBS school site, event booking, QR passes, gate scanner, and office console.

## Setup

```bash
npm install
cp .env.example .env
npm run db:setup
npm run dev
```

http://localhost:3000

## Routes

| Path | Purpose |
| --- | --- |
| `/` | School website |
| `/events` | Event list and seat booking |
| `/ticket/[token]` | QR pass (PDF download) |
| `/scan` | Gate scanner |
| `/admin` | Office console |

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@reubs.school` | `ReubsAdmin@2026` |
| Scanner | `scanner@reubs.school` | `ScanGate@2026` |

Enrollment samples: `REU2026-1001` … `REU2026-1008`

## Environment

Copy `.env.example` to `.env`:

| Variable | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | yes | SQLite by default (`file:./dev.db`) |
| `AUTH_SECRET` | yes | Staff session signing |
| `APP_URL` | yes | Public base URL |
| `SMTP_*` / `MAIL_FROM` | no | Email ticket delivery |
| `TWILIO_*` | no | WhatsApp ticket delivery |

Online payment is bypassed in checkout; the pass is still issued.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run db:setup   # prisma db push + seed
npm run db:seed
```
