import "dotenv/config";

const expectedHrbaOrigin = "https://pilot-hrba-e-learn-v1-wajj.vercel.app";
const requiredInvitedEmails = ["agiledatawise@gmail.com", "essetlab@gmail.com"];

type Status = "invalid" | "missing" | "ok" | "placeholder" | "warning";

type CheckResult = {
  detail: string;
  name: string;
  status: Status;
};

const results: CheckResult[] = [];

function add(name: string, status: Status, detail: string) {
  results.push({ detail, name, status });
}

function valueOf(name: string) {
  return process.env[name]?.trim() ?? "";
}

function isPlaceholder(value: string) {
  const normalized = value.toLowerCase();

  return (
    value.includes("[") ||
    value.includes("]") ||
    normalized.includes("your-") ||
    normalized.includes("replace-with") ||
    normalized.includes("placeholder") ||
    normalized.includes("example.com") ||
    normalized.includes("example.local")
  );
}

function hasLocalhost(value: string) {
  const normalized = value.toLowerCase();

  return (
    normalized.includes("localhost") ||
    normalized.includes("127.0.0.1") ||
    normalized.includes("::1")
  );
}

function isHttpUrl(value: string) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

function isPostgresUrl(value: string) {
  return value.startsWith("postgresql://") || value.startsWith("postgres://");
}

function checkRequiredValue(name: string) {
  const value = valueOf(name);

  if (!value) {
    add(name, "missing", "required variable is not set");
    return "";
  }

  if (isPlaceholder(value)) {
    add(name, "placeholder", "required variable still looks like a placeholder");
    return value;
  }

  add(name, "ok", "required variable is set");
  return value;
}

function checkRequiredUrl(name: string) {
  const value = checkRequiredValue(name);

  if (!value || isPlaceholder(value)) {
    return value;
  }

  if (!isHttpUrl(value)) {
    add(name, "invalid", "required URL must be a valid http(s) URL");
    return value;
  }

  return value;
}

function checkRequiredPostgresUrl(name: string) {
  const value = checkRequiredValue(name);

  if (!value || isPlaceholder(value)) {
    return value;
  }

  if (!isPostgresUrl(value)) {
    add(name, "invalid", "required database URL must start with postgresql:// or postgres://");
  }

  return value;
}

function splitCsv(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

const databaseUrl = checkRequiredPostgresUrl("DATABASE_URL");
const directUrl = checkRequiredPostgresUrl("DIRECT_URL");
checkRequiredValue("SESSION_SECRET");
const appUrl = checkRequiredUrl("NEXT_PUBLIC_APP_URL");
checkRequiredUrl("NEXT_PUBLIC_SUPABASE_URL");
checkRequiredValue("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
const hrbaUrl = checkRequiredUrl("HRBA_EXTERNAL_COURSE_URL");
const hrbaOrigins = checkRequiredValue("HRBA_EXTERNAL_COURSE_ALLOWED_ORIGINS");

const pilotAccessCode = valueOf("PILOT_ACCESS_CODE");
const pilotAccessCodes = valueOf("PILOT_ACCESS_CODES");
if (!pilotAccessCode && !pilotAccessCodes) {
  add("PILOT_ACCESS_CODE/PILOT_ACCESS_CODES", "missing", "at least one pilot access code variable is required");
} else if (
  (pilotAccessCode && isPlaceholder(pilotAccessCode)) ||
  (pilotAccessCodes && isPlaceholder(pilotAccessCodes))
) {
  add("PILOT_ACCESS_CODE/PILOT_ACCESS_CODES", "placeholder", "pilot access code still looks like a placeholder");
} else {
  add("PILOT_ACCESS_CODE/PILOT_ACCESS_CODES", "ok", "at least one pilot access code variable is set");
}

const registrationMode = checkRequiredValue("PILOT_REGISTRATION_MODE");
const invitedEmails = checkRequiredValue("PILOT_INVITED_EMAILS");

if (databaseUrl && directUrl && databaseUrl === directUrl && !isPlaceholder(databaseUrl)) {
  add("DATABASE_URL/DIRECT_URL", "warning", "runtime and direct migration URLs are identical");
}

if (appUrl && isHttpUrl(appUrl) && hasLocalhost(appUrl)) {
  add("NEXT_PUBLIC_APP_URL", "warning", "production readiness should not use localhost");
}

if (hrbaUrl && isHttpUrl(hrbaUrl) && hrbaUrl !== expectedHrbaOrigin) {
  add("HRBA_EXTERNAL_COURSE_URL", "warning", "HRBA URL does not match the approved pilot deployment");
}

if (hrbaOrigins && !isPlaceholder(hrbaOrigins)) {
  const origins = splitCsv(hrbaOrigins);
  if (!origins.includes(expectedHrbaOrigin)) {
    add("HRBA_EXTERNAL_COURSE_ALLOWED_ORIGINS", "warning", "allowed origins does not include the approved HRBA origin");
  }

  for (const origin of origins) {
    if (!isHttpUrl(origin)) {
      add("HRBA_EXTERNAL_COURSE_ALLOWED_ORIGINS", "invalid", "allowed origins must contain valid http(s) URLs");
      break;
    }
  }
}

if (registrationMode && !isPlaceholder(registrationMode) && registrationMode.toLowerCase() !== "strict") {
  add("PILOT_REGISTRATION_MODE", "warning", "real pilot should use strict registration mode");
}

if (invitedEmails && !isPlaceholder(invitedEmails)) {
  const invitedEmailSet = new Set(splitCsv(invitedEmails).map((email) => email.toLowerCase()));
  const missingInvites = requiredInvitedEmails.filter((email) => !invitedEmailSet.has(email));

  if (missingInvites.length > 0) {
    add("PILOT_INVITED_EMAILS", "warning", "required Internal Pilot 0 invited emails are incomplete");
  }
}

const nextPublicSupabaseSecretKeys = Object.keys(process.env).filter((key) => {
  const normalized = key.toUpperCase();
  return (
    normalized.startsWith("NEXT_PUBLIC_") &&
    (normalized.includes("SUPABASE_SECRET") ||
      normalized.includes("SERVICE_ROLE"))
  );
});

if (nextPublicSupabaseSecretKeys.length > 0) {
  add("NEXT_PUBLIC_* Supabase secrets", "invalid", "service-role/secret-like Supabase key is exposed as public");
} else {
  add("NEXT_PUBLIC_* Supabase secrets", "ok", "no public service-role/secret-like Supabase variable detected");
}

if (valueOf("SUPABASE_SECRET_KEY")) {
  add("SUPABASE_SECRET_KEY", "warning", "server-only key is present; use only if server admin actions require it");
} else {
  add("SUPABASE_SECRET_KEY", "ok", "not set; optional unless server admin actions are implemented");
}

const smtpKeys = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SMTP_SECURE", "EMAIL_FROM"];
const smtpPresent = smtpKeys.filter((key) => Boolean(valueOf(key)));
if (smtpPresent.length === 0) {
  add("SMTP_*", "ok", "not set; optional unless Hub direct emails are enabled");
} else if (smtpPresent.length === smtpKeys.length) {
  add("SMTP_*", "warning", "SMTP variables are present; ensure Hub direct emails are intentionally enabled");
} else {
  add("SMTP_*", "warning", "SMTP variables are partially set; required only if Hub direct emails are enabled");
}

const statusOrder: Record<Status, number> = {
  invalid: 0,
  missing: 1,
  placeholder: 2,
  warning: 3,
  ok: 4,
};

for (const result of results.sort((left, right) => {
  const statusDelta = statusOrder[left.status] - statusOrder[right.status];
  return statusDelta || left.name.localeCompare(right.name);
})) {
  console.log(`${result.status.toUpperCase()}: ${result.name} - ${result.detail}`);
}

const blockingStatuses = new Set<Status>(["invalid", "missing", "placeholder"]);
const blockingCount = results.filter((result) => blockingStatuses.has(result.status)).length;
const warningCount = results.filter((result) => result.status === "warning").length;

if (blockingCount > 0) {
  console.error(
    `S8 environment readiness failed: ${blockingCount} blocking issue(s), ${warningCount} warning(s). No secret values were printed.`,
  );
  process.exitCode = 1;
} else {
  console.log(
    `S8 environment readiness completed: ready${warningCount > 0 ? " with warnings" : ""}. No secret values were printed.`,
  );
}
