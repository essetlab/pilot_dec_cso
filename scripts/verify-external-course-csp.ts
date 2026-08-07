import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const productionOrigin = "https://enhanced-hrba-pilot.vercel.app";
const qaOrigin =
  "https://pilot-hrba-e-learn-v1-m8p2y1dzx-girumteenexus-8292s-projects.vercel.app";
const obsoleteOrigin = "https://pilot-hrba-e-learn-v1-wajj.vercel.app";
const localOrigin = "http://localhost:5173";
const qaMode = process.argv.includes("--qa");

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

if (qaMode) {
  process.env.HRBA_EXTERNAL_COURSE_URL = qaOrigin;
  process.env.HRBA_EXTERNAL_COURSE_ALLOWED_ORIGINS = qaOrigin;
} else {
  delete process.env.HRBA_EXTERNAL_COURSE_URL;
  delete process.env.HRBA_EXTERNAL_COURSE_ALLOWED_ORIGINS;
}

const { default: nextConfig } = await import("../next.config");
const headerRules = await nextConfig.headers?.();
const contentSecurityPolicy = headerRules
  ?.flatMap((rule) => rule.headers)
  .find((header) => header.key === "Content-Security-Policy")?.value;

assert(contentSecurityPolicy, "The Content-Security-Policy header is missing.");
assert(
  !contentSecurityPolicy.includes(obsoleteOrigin),
  "The obsolete Wajj origin remains in the CSP.",
);
assert(
  !contentSecurityPolicy.includes(localOrigin),
  "The localhost HRBA origin remains in the CSP.",
);

if (qaMode) {
  assert(
    contentSecurityPolicy.includes(`frame-src 'self' ${qaOrigin}`) &&
      contentSecurityPolicy.includes(`child-src 'self' ${qaOrigin}`),
    "The explicit QA HRBA origin is missing from frame-src or child-src.",
  );
  assert(
    !contentSecurityPolicy.includes(productionOrigin),
    "The QA CSP silently retained the production HRBA origin.",
  );
} else {
  assert(
    contentSecurityPolicy.includes(`frame-src 'self' ${productionOrigin}`) &&
      contentSecurityPolicy.includes(`child-src 'self' ${productionOrigin}`),
    "The authoritative production HRBA origin is missing by default.",
  );

  const child = spawnSync(
    process.execPath,
    ["--import", "jiti/register", fileURLToPath(import.meta.url), "--qa"],
    {
      encoding: "utf8",
      env: {
        ...process.env,
        HRBA_EXTERNAL_COURSE_ALLOWED_ORIGINS: qaOrigin,
        HRBA_EXTERNAL_COURSE_URL: qaOrigin,
      },
    },
  );

  assert(
    child.status === 0,
    `The explicit QA CSP verification failed: ${child.stderr || child.stdout}`,
  );

  console.log(
    JSON.stringify(
      {
        defaultProductionOriginPresent: true,
        explicitQaOriginOnly: true,
        localhostOriginAbsent: true,
        obsoleteWajjOriginAbsent: true,
      },
      null,
      2,
    ),
  );
}
