# Deploying MNF Squares v1.0

This bundle includes ready-to-use configs for **Docker**, **Render**, **Heroku**, and **Vercel**.

## Docker (local / any host)
```bash
docker compose up --build
# open http://localhost:3000
```

## Render
- Connect your repo, add `render.yaml` as **Blueprint**.
- Render auto-creates Postgres and the Web Service.
- Set custom domain in the dashboard.

## Heroku
```bash
heroku create
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
# or use the zip directly by pushing a repo with these files
heroku config:set APP_JWT_SECRET=$(openssl rand -hex 32) NEXTAUTH_URL=https://<your-app>.herokuapp.com SQUARE_PRICE_CENTS=2000
heroku run npx prisma migrate deploy
```

## Vercel
- Import project into Vercel.
- Ensure envs:
  - `DATABASE_URL` (use Neon/Supabase/PlanetScale; Vercel Postgres also works)
  - `APP_JWT_SECRET`
  - `SQUARE_PRICE_CENTS`
- Build settings use `vercel.json`.

## First Run Checklist
1. Visit `/admin/setup` to confirm environment.
2. Seed the schedule at `/admin/seed` ("Seed 2025 MNF Schedule").
3. Optional: `/admin/theme` to fine-tune colors/logo.
4. Try public board `/boards/<gameId>/1` and purchase flow `/buy/<gameId>/1` (Stripe keys required).
5. Test offline + background sync by going offline and adding a sale/winner.

> Note: For serverless platforms, persistent writes to `/data/` (theme.json, uploads) may not survive redeploys. Store branding assets in repo or object storage if you need permanence.
