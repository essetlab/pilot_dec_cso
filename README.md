# CSO Learning Hub

Phase 1 implementation repository for the DEC / WHH CSF+ CSO Learning Hub.

## Stack

- Next.js 16 App Router
- React 19
- Prisma 7 with PostgreSQL
- TypeScript

## Fresh Clone Setup

1. Install dependencies.

```powershell
npm install
```

2. Create a local environment file.

```powershell
Copy-Item .env.example .env
```

3. Generate the Prisma client.

```powershell
npm run prisma:generate
```

4. Create a local PostgreSQL database, set `DATABASE_URL` in `.env`, then apply migrations.

```powershell
npm run db:migrate:deploy
```

5. Optional: seed demo data.

```powershell
npm run db:seed
```

6. Start the local app.

```powershell
npm run dev
```

The default local URL is `http://localhost:3000`.

## Required Environment Variables

See `.env.example`.

- `DATABASE_URL`: PostgreSQL connection string used by Prisma.
- `SESSION_SECRET`: local session signing secret. Use a strong secret outside local demos.
- `NEXT_PUBLIC_APP_URL`: public app URL for secure cookie behavior, redirects, emails, and absolute links when needed.
- `SMTP_HOST`: SMTP server host for transactional emails.
- `SMTP_PORT`: SMTP server port (usually `587` or `465`).
- `SMTP_USER`: SMTP username.
- `SMTP_PASS`: SMTP password/app password.
- `SMTP_SECURE`: set to `true` for implicit TLS (usually port `465`), otherwise `false`.
- `EMAIL_FROM`: sender address used for staff invitation emails.

## Verification

```powershell
npm run lint
npm run build
npm run prisma:validate
```

`npm run build` runs `prisma generate` first, so the ignored generated Prisma client is recreated during production builds.

## Repository Notes

- Do not commit `.env`, local database files, `node_modules`, `.next`, build output, generated Prisma client files, logs, or temporary QA artifacts.
- Phase 1 specs live in `docs/specs/phase-1-cso-learning-hub/`.
- Design system and implementation guidance live in `docs/design/`.

## Deployment Notes

See `docs/deployment/VERCEL_POSTGRES_DEPLOYMENT.md` for the Vercel + Postgres deployment flow, including the separate HRBA Vite course app deployment.
