import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  buildPmExternalCourseMetadata,
  DEFAULT_PM_EXTERNAL_COURSE_URL,
  getPmExternalCourseAllowedOrigins,
  getPmExternalCourseUrl,
  PM_EXTERNAL_COURSE_VERSION_ID,
} from "../src/lib/external-course-config";
import {
  requirePmIntegrationOwner,
  resolvePmCourseVersionPublishedAt,
} from "../src/lib/external-course-workflow";
import { prisma } from "../src/lib/prisma";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function source(path: string) {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

const originalEnvironment = {
  nodeEnvironment: process.env.NODE_ENV,
  pmAllowedOrigins: process.env.PM_EXTERNAL_COURSE_ALLOWED_ORIGINS,
  pmUrl: process.env.PM_EXTERNAL_COURSE_URL,
};
const mutableEnvironment = process.env as Record<string, string | undefined>;

function setPmEnvironment({
  allowedOrigins,
  nodeEnvironment,
  url,
}: {
  allowedOrigins?: string;
  nodeEnvironment: string;
  url?: string;
}) {
  mutableEnvironment.NODE_ENV = nodeEnvironment;

  if (allowedOrigins === undefined) {
    delete process.env.PM_EXTERNAL_COURSE_ALLOWED_ORIGINS;
  } else {
    process.env.PM_EXTERNAL_COURSE_ALLOWED_ORIGINS = allowedOrigins;
  }

  if (url === undefined) {
    delete process.env.PM_EXTERNAL_COURSE_URL;
  } else {
    process.env.PM_EXTERNAL_COURSE_URL = url;
  }
}

try {
  setPmEnvironment({ nodeEnvironment: "development" });
  assert(
    getPmExternalCourseUrl() === DEFAULT_PM_EXTERNAL_COURSE_URL,
    "Local PM URL default is no longer available.",
  );
  assert(
    getPmExternalCourseAllowedOrigins().includes("http://127.0.0.1:5173"),
    "Local loopback origin support is no longer available.",
  );

  setPmEnvironment({ nodeEnvironment: "production" });
  assert(getPmExternalCourseUrl() === "", "Production PM URL fell back to localhost.");
  assert(
    getPmExternalCourseAllowedOrigins().length === 0,
    "Production PM origins implicitly trusted localhost.",
  );
  let missingProductionConfigurationRejected = false;
  try {
    buildPmExternalCourseMetadata();
  } catch {
    missingProductionConfigurationRejected = true;
  }
  assert(
    missingProductionConfigurationRejected,
    "Missing Production PM configuration did not fail closed.",
  );

  setPmEnvironment({
    allowedOrigins: "https://pm-course.release.test",
    nodeEnvironment: "production",
    url: "https://pm-course.release.test",
  });
  const productionMetadata = buildPmExternalCourseMetadata();
  assert(
    productionMetadata.launchUrl === "https://pm-course.release.test" &&
      productionMetadata.allowedOrigins.length === 1 &&
      productionMetadata.allowedOrigins[0] === "https://pm-course.release.test",
    "Explicit matching Production PM configuration was rejected.",
  );

  setPmEnvironment({
    allowedOrigins: "https://different-course.release.test",
    nodeEnvironment: "production",
    url: "https://pm-course.release.test",
  });
  assert(
    getPmExternalCourseAllowedOrigins().length === 0,
    "Mismatched Production PM URL and allowed origin were accepted.",
  );

  setPmEnvironment({
    allowedOrigins: "http://localhost:5173",
    nodeEnvironment: "production",
    url: "http://localhost:5173",
  });
  assert(
    getPmExternalCourseUrl() === "" && getPmExternalCourseAllowedOrigins().length === 0,
    "Production PM configuration trusted localhost.",
  );
} finally {
  if (originalEnvironment.nodeEnvironment === undefined) delete mutableEnvironment.NODE_ENV;
  else mutableEnvironment.NODE_ENV = originalEnvironment.nodeEnvironment;
  if (originalEnvironment.pmAllowedOrigins === undefined) {
    delete process.env.PM_EXTERNAL_COURSE_ALLOWED_ORIGINS;
  } else {
    process.env.PM_EXTERNAL_COURSE_ALLOWED_ORIGINS = originalEnvironment.pmAllowedOrigins;
  }
  if (originalEnvironment.pmUrl === undefined) delete process.env.PM_EXTERNAL_COURSE_URL;
  else process.env.PM_EXTERNAL_COURSE_URL = originalEnvironment.pmUrl;
}

const firstRegistrationTime = new Date("2026-08-11T10:00:00.000Z");
const rerunTime = new Date("2026-08-12T10:00:00.000Z");
const firstPublishedAt = resolvePmCourseVersionPublishedAt(undefined, firstRegistrationTime);
const rerunPublishedAt = resolvePmCourseVersionPublishedAt(firstPublishedAt, rerunTime);
const nullPublishedAt = resolvePmCourseVersionPublishedAt(null, rerunTime);
const logicalVersions = new Map<string, Date>();
logicalVersions.set(PM_EXTERNAL_COURSE_VERSION_ID, firstPublishedAt);
logicalVersions.set(PM_EXTERNAL_COURSE_VERSION_ID, rerunPublishedAt);

assert(firstPublishedAt === firstRegistrationTime, "First registration did not publish the version.");
assert(rerunPublishedAt === firstPublishedAt, "Registration rerun changed publishedAt.");
assert(nullPublishedAt === rerunTime, "A null publishedAt was not set during intentional publication.");
assert(logicalVersions.size === 1, "Logical rerun duplicated the stable CourseVersion record.");

const activeAdmin = { id: "existing-platform-admin" };
const originalFindFirst = prisma.user.findFirst;
const originalRoleUpsert = prisma.role.upsert;
const originalUserUpsert = prisma.user.upsert;
let unauthorizedAdminWrites = 0;

try {
  Reflect.set(prisma.role, "upsert", async () => {
    unauthorizedAdminWrites += 1;
    throw new Error("Unexpected role creation.");
  });
  Reflect.set(prisma.user, "upsert", async () => {
    unauthorizedAdminWrites += 1;
    throw new Error("Unexpected user creation.");
  });
  Reflect.set(prisma.user, "findFirst", async () => activeAdmin);
  assert(
    (await requirePmIntegrationOwner()).id === activeAdmin.id,
    "An existing active administrator was rejected.",
  );

  Reflect.set(prisma.user, "findFirst", async () => null);
  let missingAdminRejected = false;
  try {
    await requirePmIntegrationOwner();
  } catch (error) {
    missingAdminRejected =
      error instanceof Error &&
      error.message.includes("existing active Platform Admin or Super Admin");
  }
  assert(missingAdminRejected, "Missing active administrator did not fail with an actionable error.");
  assert(unauthorizedAdminWrites === 0, "PM prerequisite check created a user or role.");
} finally {
  Reflect.set(prisma.user, "findFirst", originalFindFirst);
  Reflect.set(prisma.role, "upsert", originalRoleUpsert);
  Reflect.set(prisma.user, "upsert", originalUserUpsert);
}

const workflow = source("src/lib/external-course-workflow.ts");
const pmRegistrationStart = workflow.indexOf("export async function registerPmExternalCourse()");
const pmRegistrationEnd = workflow.indexOf(
  "export function resolveExternalCourseResumeScreenId",
  pmRegistrationStart,
);
const pmRegistration = workflow.slice(pmRegistrationStart, pmRegistrationEnd);
const hrbaRegistrationStart = workflow.indexOf("export async function registerHrbaExternalCourse()");
const hrbaRegistrationEnd = workflow.indexOf("async function ensurePmCapacityAreas", hrbaRegistrationStart);
const hrbaRegistration = workflow.slice(hrbaRegistrationStart, hrbaRegistrationEnd);

assert(
  pmRegistration.indexOf("requirePmIntegrationOwner()") >= 0 &&
    pmRegistration.indexOf("requirePmIntegrationOwner()") <
      pmRegistration.indexOf("ensurePmCapacityAreas()"),
  "PM registration does not verify the administrator prerequisite before writes.",
);
assert(
  pmRegistration.includes("resolvePmCourseVersionPublishedAt"),
  "PM registration does not preserve the existing publication timestamp.",
);
assert(
  pmRegistration.includes("courseId_versionNumber") &&
    pmRegistration.includes("PM_EXTERNAL_COURSE_VERSION_ID"),
  "PM registration no longer reconciles the stable CourseVersion record.",
);
assert(
  hrbaRegistration.includes("ensureIntegrationOwner()"),
  "HRBA registration owner behavior changed.",
);

const frame = source("src/components/learner/ExternalCourseFrame.tsx");
assert(
  frame.includes('allow="clipboard-read; clipboard-write; fullscreen"'),
  "Tracked external-course iframe does not delegate fullscreen.",
);
assert(
  frame.includes('sandbox="allow-downloads allow-forms allow-popups allow-same-origin allow-scripts"') &&
    !frame.includes("allow-top-navigation"),
  "Tracked external-course sandbox changed.",
);

const readiness = source("scripts/verify-s8-env-readiness.ts");
assert(
  readiness.includes('"PM_EXTERNAL_COURSE_URL"') &&
    readiness.includes('"PM_EXTERNAL_COURSE_ALLOWED_ORIGINS"') &&
    readiness.includes('"NEXT_PUBLIC_APP_URL"') &&
    readiness.includes("PM external-course origin correspondence"),
  "Deployment readiness does not cover the required external-course origins.",
);

console.log(JSON.stringify({
  activeAdministratorAccepted: true,
  fullscreenDelegatedWithoutSandboxChange: true,
  hrbaRegistrationBehaviorPreserved: true,
  localOriginsRemainAvailableOutsideProduction: true,
  missingAdministratorRejectedWithoutCreation: true,
  productionConfigurationFailsClosed: true,
  publishedAtPreservedOnRerun: true,
  stableVersionRecords: logicalVersions.size,
}, null, 2));

await prisma.$disconnect();
