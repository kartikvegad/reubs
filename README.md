# REUBS

School website and event-pass app for REUBS Primary & Higher Secondary School, Maninagar, Ahmedabad.

```bash
cd reubs-web
npm install
cp .env.example .env
npm run db:setup
npm run dev
```

Open http://localhost:3000

| | |
| --- | --- |
| Site | `/` |
| Events / booking | `/events` |
| Gate scanner | `/scan` |
| Office | `/admin` |

Demo staff: `admin@reubs.school` / `ReubsAdmin@2026` · `scanner@reubs.school` / `ScanGate@2026`  
Demo students: `REU2026-1001` … `REU2026-1008`

Stack: Next.js, Prisma, SQLite. Details and env vars: [`reubs-web/README.md`](./reubs-web/README.md)
