import { spawnSync } from "node:child_process";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function runSeedWithEnv(env: Record<string, string>) {
  const result = spawnSync(
    "node",
    ["--import", "jiti/register", "scripts/seed-phase1-demo.ts"],
    {
      env: {
        ...process.env,
        ...env,
      },
      encoding: "utf8",
    }
  );
  return {
    status: result.status,
    stdout: result.stdout || "",
    stderr: result.stderr || "",
  };
}

async function main() {
  console.log("=== Verification: Seed Safety Guard ===");

  // 1. Refuses to run without ALLOW_DESTRUCTIVE_DEMO_SEED=true
  console.log("Checking refuse when ALLOW_DESTRUCTIVE_DEMO_SEED is missing...");
  const res1 = runSeedWithEnv({
    ALLOW_DESTRUCTIVE_DEMO_SEED: "false",
    APP_ENVIRONMENT: "local-test",
    DATABASE_URL: "postgresql://localhost:5432/postgres",
  });
  assert(res1.status !== 0, "Seed script should fail without opt-in.");
  assert(res1.stderr.includes("ALLOW_DESTRUCTIVE_DEMO_SEED is not set to true"), "Unexpected error message: " + res1.stderr);
  console.log("PASS: Refused when ALLOW_DESTRUCTIVE_DEMO_SEED=false");

  // 2. Refuses to run with incorrect APP_ENVIRONMENT
  console.log("Checking refuse when APP_ENVIRONMENT is not local-test...");
  const res2 = runSeedWithEnv({
    ALLOW_DESTRUCTIVE_DEMO_SEED: "true",
    APP_ENVIRONMENT: "staging",
    DATABASE_URL: "postgresql://localhost:5432/postgres",
  });
  assert(res2.status !== 0, "Seed script should fail with wrong APP_ENVIRONMENT.");
  assert(res2.stderr.includes("APP_ENVIRONMENT is set to 'staging'"), "Unexpected error message: " + res2.stderr);
  console.log("PASS: Refused when APP_ENVIRONMENT is staging");

  // 3. Refuses to run against staging project reference
  console.log("Checking refuse when database URL targets staging project...");
  const res3 = runSeedWithEnv({
    ALLOW_DESTRUCTIVE_DEMO_SEED: "true",
    APP_ENVIRONMENT: "local-test",
    DATABASE_URL: "postgresql://postgres.fgyxbzwdvngqlksyxuwa@aws-0-eu-west-1.pooler.supabase.com:6543/postgres",
  });
  assert(res3.status !== 0, "Seed script should fail when targeting staging project.");
  assert(res3.stderr.includes("Seeding shared staging or production databases is prohibited"), "Unexpected error message: " + res3.stderr);
  console.log("PASS: Refused when targeting staging database");

  // 4. Refuses to run against production project reference
  console.log("Checking refuse when database URL targets production project...");
  const res4 = runSeedWithEnv({
    ALLOW_DESTRUCTIVE_DEMO_SEED: "true",
    APP_ENVIRONMENT: "local-test",
    DATABASE_URL: "postgresql://postgres.bhzyrthinbyqgsetnoph@aws-0-eu-west-1.pooler.supabase.com:6543/postgres",
  });
  assert(res4.status !== 0, "Seed script should fail when targeting production project.");
  assert(res4.stderr.includes("Seeding shared staging or production databases is prohibited"), "Unexpected error message: " + res4.stderr);
  console.log("PASS: Refused when targeting production database");

  // 5. Refuses to run against non-localhost hostnames
  console.log("Checking refuse when database URL targets non-localhost host...");
  const res5 = runSeedWithEnv({
    ALLOW_DESTRUCTIVE_DEMO_SEED: "true",
    APP_ENVIRONMENT: "local-test",
    DATABASE_URL: "postgresql://postgres@some-remote-db-server.com:5432/postgres",
  });
  assert(res5.status !== 0, "Seed script should fail when targeting non-localhost.");
  assert(res5.stderr.includes("DATABASE_URL host does not match an approved local pattern"), "Unexpected error message: " + res5.stderr);
  console.log("PASS: Refused when targeting remote database");

  console.log("ALL SEED SAFETY GUARD VERIFICATIONS PASSED.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
