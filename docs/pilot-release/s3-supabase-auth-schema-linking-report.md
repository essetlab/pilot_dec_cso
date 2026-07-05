# S3 Supabase Auth Schema Linking Report

Date: 2026-07-06

## Slice

S3: Supabase Auth database schema and profile linking.

Purpose: add the database-level link needed to connect future Supabase Auth users to existing Hub `User` records without switching current Hub auth/session behavior.

## Schema Decision

`User.authProviderId` was reused as the Supabase Auth user id link.

No separate `supabaseAuthUserId` field was added because `authProviderId` already existed, was unused by current auth workflows, and is suitable as the external auth-provider id.

## Schema Fields Changed

In `prisma/schema.prisma`, the `User` model now has:

```prisma
authProviderId String? @unique
authProvider   String  @default("local")
```

Unchanged fields confirmed:

- `email` remains `String @unique`.
- `passwordHash` remains nullable as `String?`.

## Migration

Migration name:

- `20260706000000_add_supabase_auth_user_link`

Migration file:

- `prisma/migrations-postgres/20260706000000_add_supabase_auth_user_link/migration.sql`

Note: this repository uses `prisma.config.ts` with `migrations.path = "prisma/migrations-postgres"`, so the migration was created under `prisma/migrations-postgres` rather than `prisma/migrations`.

Migration operations:

- Add `User.authProvider` with default `local`.
- Add unique index `User_authProviderId_key` on `User.authProviderId`.

## Local Duplicate Check

Read-only local database check before migration:

- Users with non-null `authProviderId`: 0.
- Duplicate non-null `authProviderId` groups: 0.

Post-apply local confirmation:

- Users with non-null `authProviderId`: 0.
- Duplicate non-null `authProviderId` groups: 0.
- Existing users with `authProvider="local"`: 18.

No personal data, emails, or auth ids were printed.

## Migration Safety

- No Supabase production migration was run.
- No Supabase production database was targeted.
- No `prisma db push` was used.
- `npx prisma migrate dev --name add_supabase_auth_user_link` could not run in this non-interactive shell because Prisma required warning confirmation for the new unique index.
- The migration SQL was created locally and applied only to the local development database.
- The migration was marked applied in local Prisma migration history with `npx prisma migrate resolve --applied 20260706000000_add_supabase_auth_user_link`.

## Behavior Confirmation

- Current learner registration behavior was not replaced.
- Current sign-in/sign-out behavior was not replaced.
- Current `cso_lh_session` behavior was not changed.
- Route protection behavior was not changed.
- HRBA deployment was not changed.
- HRBA `launchToken` contract was not changed.
- HRBA callback logic was not changed.
- Certificate logic was not changed.
- No learner/admin accounts were created.
- Daniel and Mulu were not invited.
- No Supabase service role key was used.

## Backfill Note

- Existing users keep `authProvider="local"`.
- Future Supabase-auth users should store the Supabase Auth user id in `User.authProviderId`.
- Future Supabase-auth users should be created or updated with `authProvider="supabase"`.
- Staff, admin, and M&E users must later be linked to Supabase Auth before real deployment.
- S4 should define how learner registration creates both the Supabase Auth user and the linked Hub `User` profile.

## Checks

- `npx prisma validate`: passed.
- `npx prisma migrate status`: passed; local database schema reported up to date.
- `npm run prisma:validate`: passed.
- `npm run lint`: passed.
- `npm run build`: passed.
- `npm run verify:hrba-external-course`: passed.
- `npm run verify:r17`: passed.
- `git diff --check`: passed.
- `git status --short`: reviewed before staging.

## Next Slice Recommendation

S4: registration/sign-up migration.
