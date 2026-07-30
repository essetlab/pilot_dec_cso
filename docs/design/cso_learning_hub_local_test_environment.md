# CSO Learning Hub - Local Test Environment Guide

To safeguard shared pilot staging and production environments, all visual and functional revamp tests must be conducted against an isolated local database sandbox.

---

## 1. Setting Up an Isolated Local Database

### 1.1 Local PostgreSQL Container
The recommended approach is to run PostgreSQL locally via Docker or a local installer:
```bash
docker run --name cso-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
```

### 1.2 Configuration
1. Copy [.env.local-test.example](file:///d:/z%20CDP-Lg-Andy-pilot-integration/.env.local-test.example) to `.env` in the repository root.
2. Edit `.env` to configure your local credentials and database name.
3. Validate that `APP_ENVIRONMENT` is set to `local-test` and `ALLOW_DESTRUCTIVE_DEMO_SEED` is `true`.

---

## 2. Populating Synthetic Data

Once your local database is running and the `.env` points to it:

1. **Deploy database schemas and generate Prisma client**:
   ```bash
   npx prisma db push
   ```
2. **Execute synthetic demo seed**:
   ```bash
   npm run db:seed
   ```
   *Note: The safety guard will refuse execution if it detects connection strings containing staging or production project IDs.*

---

## 3. Operations Guidelines

### 3.1 Safe Commands (Local-Only)
The following commands should only be executed against your local database sandbox:
* `npm run db:seed`
* `npx prisma db push` / `npx prisma migrate dev`
* `npm run verify:r22d`

### 3.2 Read-Only Verification Commands
These commands are safe to run in any environment since they do not write data:
* `npm run prisma:validate`
* `npm run lint`
* `npm run build`
* `npm run verify:s6-route-roles`
* `npm run verify:s5-signin`
* `npm run verify:seed-safety`

### 3.3 Strict Prohibitions
* **NEVER** run `npm run db:seed` or prisma push/migration scripts against Supabase references `fgyxbzwdvngqlksyxuwa` or `bhzyrthinbyqgsetnoph`.
* **NEVER** write ad hoc delete queries targeting shared databases.

---

## 4. Visual Verification & Testing
* **Distinguishing Environments**: Staging and pilot domains are hosted on Vercel preview routes. Local visual checks must run strictly at `http://localhost:3000`.
* **Synthetic Accounts**: Test the UI using the pre-seeded accounts (`admin@demo.local`, `participant2@demo.local`) created by the seed script. Do not input real practitioner emails or Dec operational accounts on localhost.
