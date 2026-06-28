# Vercel + Postgres Deployment

This app is configured for a persistent PostgreSQL database in production.
Do not deploy the portal with the old SQLite `file:./prisma/dev.db` URL on Vercel.

## Projects

Deploy two Vercel projects from the same repository:

1. Main portal
   - Root directory: repository root
   - Framework preset: Next.js
   - Build command: `npm run build`

2. HRBA course app
   - Root directory: `reference-projects/pilot_hrba_eLearn_v1-main`
   - Framework preset: Vite
   - Build command: `npm run build`
   - Output directory: `dist`

## Production Database

Create a Postgres database before deploying the portal. Neon, Supabase, or Vercel Postgres are suitable.

Set this environment variable in the portal Vercel project for Production, Preview, and Development as needed:

```text
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require&schema=public
```

Use the provider's pooled connection string if it is recommended for serverless workloads.

## Portal Environment Variables

Set these in the portal Vercel project:

```text
DATABASE_URL=postgresql://...
SESSION_SECRET=<long-random-secret>
NEXT_PUBLIC_APP_URL=https://YOUR-PORTAL-DOMAIN.vercel.app

HRBA_EXTERNAL_COURSE_URL=https://YOUR-HRBA-COURSE-DOMAIN.vercel.app
HRBA_EXTERNAL_COURSE_ALLOWED_ORIGINS=https://YOUR-HRBA-COURSE-DOMAIN.vercel.app

SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
SMTP_SECURE=false
EMAIL_FROM=CSO Learning Hub <no-reply@example.com>
```

## HRBA Course App Environment Variables

Set this in the HRBA course Vercel project:

```text
VITE_PORTAL_ORIGINS=https://YOUR-PORTAL-DOMAIN.vercel.app
```

## One-Time Production Setup

After the portal project has the production `DATABASE_URL`, run:

```bash
npm run db:migrate:deploy
npm run db:seed
npm run register:hrba-external-course
```

Or run the combined setup:

```bash
npm run db:setup:production
```

This creates the Postgres schema, seeds the Phase 1 demo/reference data, and registers the embedded HRBA course as a published portal course.

## Local Development After This Migration

Local development now also expects Postgres:

```text
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cso_learning_hub?schema=public
```

Then run:

```bash
npm run db:migrate:deploy
npm run db:seed
npm run register:hrba-external-course
npm run dev
```

Run the HRBA Vite app separately:

```bash
cd reference-projects/pilot_hrba_eLearn_v1-main
npm run dev -- --host 127.0.0.1 --port 5173
```
