import {
  EXTERNAL_COURSE_EVENT_MESSAGE,
  hasProhibitedExternalCourseIdentifier,
  isExternalCourseEventMessage,
  isValidExternalCourseEvidenceId,
} from "../src/lib/external-course-types";

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
      base64UrlEvidenceIdAccepted: true,
      longerBase64UrlEvidenceIdRejected: true,
      malformedUuidRejected: true,
      multipleProhibitedIdentifiersRejected: true,
      nestedLegacyIdentifierRejected: true,
      paddedBase64EvidenceIdRejected: true,
      prohibitedCourseVersionIdRejected: true,
      prohibitedEnrollmentIdRejected: true,
      prohibitedUserIdRejected: true,
      shorterBase64UrlEvidenceIdRejected: true,
      summaryOnlyCallbackAccepted: true,
      uuidV4EvidenceIdAccepted: true,
    },
    null,
    2,
  ),
);
