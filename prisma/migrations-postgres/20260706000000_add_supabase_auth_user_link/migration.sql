-- Add an explicit auth provider marker for existing local Hub users and future Supabase-linked users.
ALTER TABLE "User" ADD COLUMN "authProvider" TEXT NOT NULL DEFAULT 'local';

-- Link Supabase Auth users through the existing nullable external provider id field.
-- PostgreSQL permits multiple NULL values in a unique index, so existing local users remain valid.
CREATE UNIQUE INDEX "User_authProviderId_key" ON "User"("authProviderId");
