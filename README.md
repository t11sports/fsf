
# MNF Squares — Ultimate Bundle

End-to-end app for Monday Night Football Squares fundraisers.

## Features
- Two boards per game, winners from scores (single + batch)
- CRUD for Players / Buyers / Sales / Games
- Public purchase page → Stripe Checkout + webhook
- Excel import wizard + round-trip Excel export
- Dashboard KPIs
- Public board viewer
- Live Game mode (confetti + batch winners)
- Email magic-link sign-in + Admin/Organizer login
- Admin → Users management
- Admin → Demo seed data
- Security headers via middleware

## Dev Quick Start
```bash
npm i
cp .env.example .env
npx prisma migrate dev -n init
npx prisma generate
npm run dev
```


## One-time Setup (Production)
1. Copy `.env.production.sample` → `.env` and fill values.
2. `npm i && npx prisma migrate deploy && npm run build && npm start`

## Seed Everything (CLI)
```bash
# After env+DB configured
node scripts/seed-all.ts
# Or via UI: /admin/seed → "Seed 2025 MNF Schedule"
```

## Import Your Excel
- Use `/import` wizard to preview → commit
- Map columns: Buyer Name, Qty (and optional Due/Received)
- Re-export any time: `/api/export/workbook` (xlsx), `/api/export/sales`, `/api/export/winners` (csv)
