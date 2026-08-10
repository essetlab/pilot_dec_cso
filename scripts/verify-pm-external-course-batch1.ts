import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  buildHrbaExternalCourseMetadata,
  buildPmExternalCourseMetadata,
  getTrackedExternalCourseConfig,
  HRBA_EXTERNAL_COURSE_ID,
  HRBA_EXTERNAL_COURSE_SLUG,
  HRBA_EXTERNAL_COURSE_VERSION_ID,
  PM_CANONICAL_SCREEN_IDS,
  PM_EXTERNAL_COURSE_ID,
  PM_EXTERNAL_COURSE_INTERNAL_ID,
  PM_EXTERNAL_COURSE_SLUG,
  PM_EXTERNAL_COURSE_THUMBNAIL,
  PM_EXTERNAL_COURSE_TITLE,
  PM_EXTERNAL_COURSE_VERSION_ID,
} from "../src/lib/external-course-config";
import {
  resolveExternalCourseProgressPercent,
  resolveExternalCourseResumeScreenId,
} from "../src/lib/external-course-workflow";
import { PILOT_CATALOGUE_COURSE_IDENTITIES } from "../src/lib/catalogue-course-identities";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function source(path: string) {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

const hrba = getTrackedExternalCourseConfig(HRBA_EXTERNAL_COURSE_SLUG);
assert(hrba?.courseId === HRBA_EXTERNAL_COURSE_ID, "HRBA course ID changed.");
assert(
  hrba.courseVersionId === HRBA_EXTERNAL_COURSE_VERSION_ID &&
    hrba.provider === "hrba-vite" &&
    hrba.supportsSecureNewTab,
  "HRBA tracked-course behavior changed.",
);

const pm = getTrackedExternalCourseConfig(PM_EXTERNAL_COURSE_SLUG);
assert(pm?.courseId === PM_EXTERNAL_COURSE_ID, "PM course config is missing.");
assert(pm.courseVersionId === PM_EXTERNAL_COURSE_VERSION_ID, "PM version ID is unstable.");
assert(pm.provider === "project-management-vite", "PM provider is invalid.");
assert(pm.internalCourseId === PM_EXTERNAL_COURSE_INTERNAL_ID, "PM internal ID was not reused.");
assert(pm.enforceMonotonicProgress, "PM progress must be monotonic.");
assert(!pm.supportsSecureNewTab, "PM tracked launches must stay in the secure frame.");
assert(PM_EXTERNAL_COURSE_INTERNAL_ID === "project-management", "PM internal ID changed.");
assert(PM_CANONICAL_SCREEN_IDS.length === 32, "PM canonical screen count is not 32.");
assert(new Set(PM_CANONICAL_SCREEN_IDS).size === 32, "PM canonical screen IDs are not unique.");

assert(
  resolveExternalCourseResumeScreenId(PM_EXTERNAL_COURSE_SLUG, {
    currentScreenId: "PM-M4-05",
  }) === "PM-M4-05",
  "A valid persisted PM resume screen was rejected.",
);
assert(
  resolveExternalCourseResumeScreenId(PM_EXTERNAL_COURSE_SLUG, {
    currentScreenId: "PM-NOT-CANONICAL",
  }) === null,
  "An invalid persisted PM resume screen was accepted.",
);
assert(
  resolveExternalCourseProgressPercent(PM_EXTERNAL_COURSE_SLUG, 72, 18) === 72,
  "PM review navigation regressed Hub progress.",
);
assert(
  resolveExternalCourseProgressPercent(HRBA_EXTERNAL_COURSE_SLUG, 72, 18) === 18,
  "The pre-existing HRBA progress rule changed.",
);

const pmMetadata = buildPmExternalCourseMetadata();
assert(pmMetadata.provider === "project-management-vite", "PM metadata is invalid.");
assert(pmMetadata.internalCourseId === PM_EXTERNAL_COURSE_INTERNAL_ID, "PM metadata lost its internal ID.");
assert(
  pmMetadata.allowedOrigins.every((origin) => origin !== "*"),
  "PM allowed origins contain a wildcard.",
);
assert(
  buildHrbaExternalCourseMetadata().provider === "hrba-vite",
  "HRBA metadata is no longer available.",
);

const catalogueIdentity = PILOT_CATALOGUE_COURSE_IDENTITIES[2];
assert(catalogueIdentity.displayOrder === 3, "PM catalogue position changed.");
assert(catalogueIdentity.slug === PM_EXTERNAL_COURSE_SLUG, "PM catalogue slug changed.");
assert(catalogueIdentity.title === PM_EXTERNAL_COURSE_TITLE, "PM catalogue title changed.");

const catalogue = source("src/lib/public-course-catalogue.ts");
assert(catalogue.includes(PM_EXTERNAL_COURSE_THUMBNAIL), "PM thumbnail was not reused.");
assert(catalogue.includes('integrationStatus: "integrated"'), "PM remains integration-pending.");
assert(catalogue.includes('launchMode: "embedded"'), "PM is not an embedded tracked course.");

const workflow = source("src/lib/external-course-workflow.ts");
assert(workflow.includes("hasLearnerCourseEntitlement"), "Launch entitlement enforcement is missing.");
assert(workflow.includes("tokenRecord.expiresAt.getTime() <= Date.now()"), "Expired tokens are not rejected.");
assert(workflow.includes("tokenRecord.allowedOrigin !== iframeOrigin"), "Exact iframe origin validation is missing.");
assert(workflow.includes("tokenRecord.courseSlug !== courseSlug"), "Course-slug validation is missing.");
assert(workflow.includes("lessonId: trackedConfig.lessonId"), "Tracked lesson selection is not generic.");

const openRegistration = source("src/lib/open-registration-workflow.ts");
assert(!openRegistration.includes("PM_EXTERNAL_COURSE"), "PM was added to open registration.");

const frame = source("src/components/learner/ExternalCourseFrame.tsx");
assert(
  frame.includes("launchData.supportsSecureNewTab !== false"),
  "PM new-tab launch is not suppressed.",
);
assert(frame.includes("resumeScreenId"), "The trusted launch context lacks resume state.");

const nextConfig = source("next.config.ts");
assert(nextConfig.includes("PM_EXTERNAL_COURSE_ALLOWED_ORIGINS"), "PM CSP origins are not environment-backed.");
assert(nextConfig.includes("PM_EXTERNAL_COURSE_URL"), "PM frame URL is not environment-backed.");

console.log(JSON.stringify({
  canonicalScreens: PM_CANONICAL_SCREEN_IDS.length,
  cataloguePosition: catalogueIdentity.displayOrder,
  hrbaBehaviorPreserved: true,
  monotonicProgress: true,
  pmCourseId: PM_EXTERNAL_COURSE_ID,
  pmCourseVersionId: PM_EXTERNAL_COURSE_VERSION_ID,
  resumeValidation: true,
  secureTrackedLaunch: true,
}, null, 2));
