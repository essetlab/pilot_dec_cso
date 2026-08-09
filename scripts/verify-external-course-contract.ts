import {
  EXTERNAL_COURSE_EVENT_MESSAGE,
  hasProhibitedExternalCourseIdentifier,
  isExternalCourseEventMessage,
  isTrustedExternalCourseMessageEvent,
  isValidExternalCourseEvidenceId,
} from "../src/lib/external-course-types";
import {
  buildHrbaExternalCourseMetadata,
  getExternalCourseMetadata,
  getHrbaExternalCourseAllowedOrigins,
  getHrbaExternalCourseUrl,
  HRBA_PRODUCTION_COURSE_ORIGIN,
  HRBA_PRODUCTION_COURSE_URL,
} from "../src/lib/external-course-config";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

const validUuidV4 = "123e4567-e89b-42d3-a456-426614174000";
const validBase64Url = Buffer.alloc(32, 0xa5).toString("base64url");
const validCallback = {
  completedModuleIds: ["module_01_hrba_foundations"],
  courseSlug: "applying-human-rights-based-approach-in-cso-practice",
  currentModuleId: "module_01_hrba_foundations",
  currentScreenId: "M1-S01",
  event: "progress_updated",
  learnerStateKey: Buffer.alloc(32, 0x5a).toString("base64url"),
  progressPercent: 25,
  sentAt: "2026-07-23T12:00:00.000Z",
  type: EXTERNAL_COURSE_EVENT_MESSAGE,
  version: 1,
} as const;
const obsoleteHrbaOrigin = "https://pilot-hrba-e-learn-v1-wajj.vercel.app";
const formerProtectedHrbaOrigin =
  "https://pilot-hrba-e-learn-v1-m8p2y1dzx-girumteenexus-8292s-projects.vercel.app";
const qaHrbaOrigin = "https://hrba-explicit-qa.example.test";
const originalCourseUrl = process.env.HRBA_EXTERNAL_COURSE_URL;
const originalAllowedOrigins = process.env.HRBA_EXTERNAL_COURSE_ALLOWED_ORIGINS;

delete process.env.HRBA_EXTERNAL_COURSE_URL;
delete process.env.HRBA_EXTERNAL_COURSE_ALLOWED_ORIGINS;

assert(
  getHrbaExternalCourseUrl() === HRBA_PRODUCTION_COURSE_URL,
  "The default HRBA launch URL is not the authoritative production deployment.",
);
assert(
  JSON.stringify(getHrbaExternalCourseAllowedOrigins()) ===
    JSON.stringify([HRBA_PRODUCTION_COURSE_ORIGIN]),
  "Production must allow only the exact authoritative HRBA origin by default.",
);
assert(
  !getHrbaExternalCourseAllowedOrigins().includes(obsoleteHrbaOrigin),
  "The obsolete Wajj origin remains allowed by default.",
);
assert(
  HRBA_PRODUCTION_COURSE_URL === "https://pilot-hrba-qa-859c1a3.vercel.app" &&
    !getHrbaExternalCourseAllowedOrigins().includes(formerProtectedHrbaOrigin),
  "The authoritative stable origin is not the default or the former protected origin remains allowed.",
);

process.env.HRBA_EXTERNAL_COURSE_URL = qaHrbaOrigin;
delete process.env.HRBA_EXTERNAL_COURSE_ALLOWED_ORIGINS;
assert(
  getHrbaExternalCourseUrl() === qaHrbaOrigin &&
    JSON.stringify(getHrbaExternalCourseAllowedOrigins()) === JSON.stringify([qaHrbaOrigin]),
  "An explicit QA launch URL must allow only its exact origin.",
);

process.env.HRBA_EXTERNAL_COURSE_URL = HRBA_PRODUCTION_COURSE_URL;
process.env.HRBA_EXTERNAL_COURSE_ALLOWED_ORIGINS = qaHrbaOrigin;
assert(
  JSON.stringify(getHrbaExternalCourseAllowedOrigins()) ===
    JSON.stringify([HRBA_PRODUCTION_COURSE_ORIGIN, qaHrbaOrigin]),
  "The QA origin was not enabled through the explicit allowlist.",
);

process.env.HRBA_EXTERNAL_COURSE_URL = obsoleteHrbaOrigin;
let obsoleteUrlRejected = false;
try {
  getHrbaExternalCourseUrl();
} catch {
  obsoleteUrlRejected = true;
}
assert(obsoleteUrlRejected, "The obsolete Wajj launch URL was accepted.");

process.env.HRBA_EXTERNAL_COURSE_URL = formerProtectedHrbaOrigin;
let formerProtectedUrlRejected = false;
try {
  getHrbaExternalCourseUrl();
} catch {
  formerProtectedUrlRejected = true;
}
assert(formerProtectedUrlRejected, "The former protected HRBA launch URL was accepted.");

assert(
  getExternalCourseMetadata({
    externalCourse: {
      provider: "hrba-vite",
      launchUrl: obsoleteHrbaOrigin,
      allowedOrigins: [obsoleteHrbaOrigin],
    },
  }) === null,
  "Stored metadata for the obsolete Wajj deployment was accepted.",
);
assert(
  getExternalCourseMetadata({
    externalCourse: {
      provider: "hrba-vite",
      launchUrl: HRBA_PRODUCTION_COURSE_URL,
      allowedOrigins: ["https://unexpected.example"],
    },
  }) === null,
  "Metadata whose launch origin is not explicitly allowed was accepted.",
);

delete process.env.HRBA_EXTERNAL_COURSE_URL;
delete process.env.HRBA_EXTERNAL_COURSE_ALLOWED_ORIGINS;

const expectedFrameSource = {} as MessageEventSource;
assert(
  isTrustedExternalCourseMessageEvent(
    { origin: HRBA_PRODUCTION_COURSE_ORIGIN, source: expectedFrameSource },
    HRBA_PRODUCTION_COURSE_ORIGIN,
    expectedFrameSource,
  ),
  "A valid exact-origin iframe message was rejected.",
);
assert(
  !isTrustedExternalCourseMessageEvent(
    { origin: "https://unexpected.example", source: expectedFrameSource },
    HRBA_PRODUCTION_COURSE_ORIGIN,
    expectedFrameSource,
  ),
  "A message from an unexpected origin was accepted.",
);
assert(
  !isTrustedExternalCourseMessageEvent(
    { origin: HRBA_PRODUCTION_COURSE_ORIGIN, source: {} as MessageEventSource },
    HRBA_PRODUCTION_COURSE_ORIGIN,
    expectedFrameSource,
  ),
  "A message from the wrong iframe source was accepted.",
);

const courseReady = {
  courseSlug: validCallback.courseSlug,
  event: "course_ready",
  sentAt: validCallback.sentAt,
  type: EXTERNAL_COURSE_EVENT_MESSAGE,
  version: 1,
} as const;
const assessment = {
  attemptNumber: 1,
  evidenceId: validUuidV4,
  maxScore: 10,
  passed: true,
  percentage: 80,
  score: 8,
  submittedAt: validCallback.sentAt,
};
const assessmentCompleted = {
  ...validCallback,
  assessment,
  event: "assessment_completed",
  progressPercent: 100,
} as const;
const courseCompleted = {
  ...assessmentCompleted,
  event: "course_completed",
} as const;
const integrationError = {
  courseSlug: validCallback.courseSlug,
  error: { code: "launch_context_unavailable" },
  event: "integration_error",
  sentAt: validCallback.sentAt,
  type: EXTERNAL_COURSE_EVENT_MESSAGE,
  version: 1,
} as const;

assert(isExternalCourseEventMessage(courseReady), "A valid course_ready handshake was rejected.");
assert(
  isExternalCourseEventMessage(assessmentCompleted),
  "A valid HRBA assessment completion event was rejected.",
);
assert(
  isExternalCourseEventMessage(courseCompleted),
  "A valid HRBA course completion event was rejected.",
);
assert(
  isExternalCourseEventMessage(integrationError),
  "A valid HRBA integration error event was rejected.",
);

const defaultMetadata = buildHrbaExternalCourseMetadata();
assert(
  defaultMetadata.launchUrl === HRBA_PRODUCTION_COURSE_URL &&
    JSON.stringify(defaultMetadata.allowedOrigins) ===
      JSON.stringify([HRBA_PRODUCTION_COURSE_ORIGIN]),
  "Default HRBA metadata is not bound to the authoritative production deployment.",
);

if (originalCourseUrl === undefined) {
  delete process.env.HRBA_EXTERNAL_COURSE_URL;
} else {
  process.env.HRBA_EXTERNAL_COURSE_URL = originalCourseUrl;
}
if (originalAllowedOrigins === undefined) {
  delete process.env.HRBA_EXTERNAL_COURSE_ALLOWED_ORIGINS;
} else {
  process.env.HRBA_EXTERNAL_COURSE_ALLOWED_ORIGINS = originalAllowedOrigins;
}

assert(isValidExternalCourseEvidenceId(validUuidV4), "UUID v4 was rejected.");
assert(
  isValidExternalCourseEvidenceId(validBase64Url),
  "A canonical 43-character base64url evidence ID was rejected.",
);
assert(
  !isValidExternalCourseEvidenceId(validBase64Url.slice(0, 42)),
  "A short base64url evidence ID was accepted.",
);
assert(
  !isValidExternalCourseEvidenceId(`${validBase64Url}A`),
  "A long base64url evidence ID was accepted.",
);
assert(
  !isValidExternalCourseEvidenceId(`${validBase64Url}=`),
  "A padded base64 evidence ID was accepted.",
);
assert(
  !isValidExternalCourseEvidenceId("A".repeat(64)),
  "An arbitrary 20-128 character URL-safe evidence ID was accepted.",
);
assert(
  !isValidExternalCourseEvidenceId("123e4567-e89b-12d3-a456-426614174000"),
  "A malformed non-v4 UUID was accepted.",
);
assert(
  !isValidExternalCourseEvidenceId(`${validBase64Url.slice(0, 42)}B`),
  "A non-canonical 43-character base64url value was accepted.",
);

assert(
  isExternalCourseEventMessage(validCallback),
  "A valid summary-only callback was rejected.",
);

const prohibitedCases = [
  { userId: "raw-user" },
  { enrollmentId: "raw-enrollment" },
  { courseVersionId: "raw-version" },
  {
    learnerId: "raw-learner",
    organizationId: "raw-organization",
    user_id: "raw-user",
  },
  {
    assessment: {
      participant_id: "raw-participant",
    },
  },
];

for (const prohibited of prohibitedCases) {
  const callback = { ...validCallback, ...prohibited };

  assert(
    hasProhibitedExternalCourseIdentifier(callback),
    "A prohibited identifier was not detected.",
  );
  assert(
    !isExternalCourseEventMessage(callback),
    "A callback containing a prohibited identifier was accepted.",
  );
}

console.log(
  JSON.stringify(
    {
      arbitraryUrlSafeEvidenceIdRejected: true,
      assessmentCompletionAccepted: true,
      base64UrlEvidenceIdAccepted: true,
      courseCompletionAccepted: true,
      courseReadyHandshakeAccepted: true,
      defaultProductionOriginOnly: true,
      explicitQaOriginSupported: true,
      integrationErrorAccepted: true,
      longerBase64UrlEvidenceIdRejected: true,
      malformedUuidRejected: true,
      multipleProhibitedIdentifiersRejected: true,
      nestedLegacyIdentifierRejected: true,
      obsoleteWajjOriginRejected: true,
      paddedBase64EvidenceIdRejected: true,
      prohibitedCourseVersionIdRejected: true,
      prohibitedEnrollmentIdRejected: true,
      prohibitedUserIdRejected: true,
      shorterBase64UrlEvidenceIdRejected: true,
      summaryOnlyCallbackAccepted: true,
      unexpectedOriginRejected: true,
      uuidV4EvidenceIdAccepted: true,
      wrongIframeSourceRejected: true,
    },
    null,
    2,
  ),
);
