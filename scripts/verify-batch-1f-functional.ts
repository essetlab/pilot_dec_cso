import { getLearnerCertificateListData } from "../src/lib/certificate-workflow";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function main() {
  console.log("=== Verification: Batch 1F Functional Boundaries ===");

  const originalAppEnv = process.env.APP_ENVIRONMENT;
  const originalAllowDemo = process.env.ALLOW_LOCAL_DEMO_AUTH;
  const originalDbUrl = process.env.DATABASE_URL;

  const mockSession = {
    email: "test.learner@example.com",
    issuedAt: new Date().toISOString(),
    name: "Test Learner",
    roles: ["PARTICIPANT" as const],
    userId: "mock-user-id",
  };

  try {
    // 1. Certificate Data Error Propagation outside local-test
    console.log("Checking getLearnerCertificateListData query failure outside local-test mode...");
    process.env.APP_ENVIRONMENT = "staging";
    process.env.ALLOW_LOCAL_DEMO_AUTH = "false";
    process.env.DATABASE_URL = "postgresql://invalid_user:invalid_pass@localhost:5432/non_existent_db";

    const result = await getLearnerCertificateListData(mockSession);

    assert(result.error !== undefined, "Expected typed error state when DB fails outside local-test mode.");
    assert(result.error?.code === "DATABASE_UNAVAILABLE", `Unexpected error code: ${result.error?.code}`);
    assert(
      result.error?.message === "Your certificate records are temporarily unavailable.",
      `Unexpected message: ${result.error?.message}`
    );
    console.log("PASS: Typed error returned when DB fails outside local-test mode.");

    // 2. Certificate Data Local-Test Fallback
    console.log("Checking getLearnerCertificateListData query failure inside local-test mode...");
    process.env.APP_ENVIRONMENT = "local-test";
    process.env.ALLOW_LOCAL_DEMO_AUTH = "true";
    process.env.DATABASE_URL = "postgresql://invalid_user:invalid_pass@localhost:5432/non_existent_db";

    const localResult = await getLearnerCertificateListData(mockSession);

    assert(localResult.error === undefined, "Local-test mode with explicit opt-in should return local fallback.");
    assert(localResult.metrics.eligible === 1, "Expected local test fallback metric.");
    console.log("PASS: Local fallback returned when in local-test mode with explicit opt-in.");

    console.log("ALL BATCH 1F FUNCTIONAL BOUNDARY VERIFICATIONS PASSED.");
  } finally {
    process.env.APP_ENVIRONMENT = originalAppEnv;
    process.env.ALLOW_LOCAL_DEMO_AUTH = originalAllowDemo;
    process.env.DATABASE_URL = originalDbUrl;
  }
}

main().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
