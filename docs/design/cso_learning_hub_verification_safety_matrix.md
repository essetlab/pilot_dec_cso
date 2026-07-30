# CSO Learning Hub - Verification Safety Matrix

This safety matrix classifies all project script commands by mutation risk and defines the approved environments for execution.

---

## 1. Safety Classifications

| Command | Source Script | Classification | Operations | Approved Environments |
|---|---|---|---|---|
| `npm run prisma:validate` | Prisma Schema engine | **Read-Only** (Local) | Parses `schema.prisma` for validation. | All (Local, Staging, Production) |
| `npm run lint` | ESLint Linter | **Read-Only** (Local) | Checks static code quality and formatting. | All (Local, Staging, Production) |
| `npm run build` | Next.js Build compiler | **Read-Only** (Local) | Compiles production assets and routes. | All (Local, Staging, Production) |
| `npm run verify:seed-safety` | `scripts/verify-seed-safety.ts` | **Read-Only** (Local Process) | Spawns child processes to test seed safety. | All (Local, Staging, Production) |
| `npm run verify:s6-route-roles` | `scripts/verify-s6-route-roles.ts` | **Read-Only** (Database) | Queries permissions tables to check guards. | All (Requires seeded data) |
| `npm run verify:s5-signin` | `scripts/verify-s5-supabase-signin.ts` | **Read-Only** (API / Auth) | Verifies Supabase authentication endpoints. | All (Requires API connection) |
| `npm run verify:r22d` | `scripts/verify-r22d.ts` | **Read-Only** (Database) | Asserts certificate metrics and scopes. | All (Requires seeded data) |
| `npm run db:seed` | `scripts/seed-phase1-demo.ts` | **Mutating** (Writes/Updates) | Bulk upserts demo data (organizations, users). | **Local-Test Sandbox Only** |
| Ad hoc script | `scripts/restore-uat-certificates.ts` | **Mutating / Remediation** | Inserts specific UAT certificates (One-time only). | Staging (Authorized Remediation ONLY) |

---

## 2. Environment Safeguards

* **Local-Test Sandbox**: Complete database write capability. Safe for migrations, database pushes, and destructive seeding.
* **Shared Staging (`fgyxbzwdvngqlksyxuwa`)**: Seeding is **strictly prohibited**. Visual check tests must rely on read-only queries.
* **Shared Production / Pilot (`bhzyrthinbyqgsetnoph`)**: Seeding and structural pushes are **strictly prohibited**. Never execute mutating operations here.
