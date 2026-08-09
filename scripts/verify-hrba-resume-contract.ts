import { readFileSync } from "node:fs";
import {
  deriveHrbaProgressPercent,
  HRBA_COURSE_STATE_VERSION,
  HRBA_COURSE_STRUCTURE_REVISION,
  HRBA_RESUME_CONTRACT_VERSION,
  validateHrbaProgressSummary,
  validateHrbaResumeState,
  type HrbaResumeState,
} from "../src/lib/hrba-resume-contract";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function emptyResume(): HrbaResumeState {
  return {
    contractVersion: HRBA_RESUME_CONTRACT_VERSION,
    courseStateVersion: HRBA_COURSE_STATE_VERSION,
    courseStructureRevision: HRBA_COURSE_STRUCTURE_REVISION,
    baseRevision: "2026-08-09T00:00:00.000Z",
    navigation: { currentLayer: "platform", currentModuleId: null, currentScreenId: null },
    completedModuleIds: [],
    completedScreenIdsByModule: {},
    moduleState: {
      module1: { version: 1, data: {} },
      module2: { version: 1, data: {} },
      module3: { version: 1, data: {} },
      module4: { version: 1, data: {} },
      module5: { version: 1, data: {} },
    },
  };
}

const validEmpty = emptyResume();
assert(validateHrbaResumeState(validEmpty).success, "The canonical empty resume state was rejected.");
assert(deriveHrbaProgressPercent([]) === 0, "Empty progress must derive to 0%.");
assert(deriveHrbaProgressPercent(["module_01_hrba_foundations"]) === 18, "One module must derive to 18%.");
assert(deriveHrbaProgressPercent([
  "module_01_hrba_foundations",
  "module_02_everyday_cso_work",
  "module_03_project_design",
]) === 54, "Three modules must derive to 54%.");
assert(deriveHrbaProgressPercent([
  "module_01_hrba_foundations",
  "module_02_everyday_cso_work",
  "module_03_project_design",
  "module_04_implementation",
  "module_05_hrba_meal",
]) === 90, "Five modules must derive to 90% before assessment.");
assert(deriveHrbaProgressPercent([], true) === 100, "Only trusted assessment completion may derive to 100%.");

const invalidScreen = structuredClone(validEmpty);
invalidScreen.navigation = {
  currentLayer: "player",
  currentModuleId: "module_01_hrba_foundations",
  currentScreenId: "M1-ARBITRARY",
};
assert(!validateHrbaResumeState(invalidScreen).success, "An unknown screen ID was accepted.");

const gatingJump = structuredClone(validEmpty);
gatingJump.navigation = {
  currentLayer: "player",
  currentModuleId: "module_04_implementation",
  currentScreenId: "M4-PLAYER-00",
};
assert(!validateHrbaResumeState(gatingJump).success, "A Module 4 prerequisite jump was accepted.");
assert(!validateHrbaProgressSummary(
  ["module_02_everyday_cso_work"],
  "module_02_everyday_cso_work",
  "M2-00",
), "A non-prefix completion summary was accepted.");

const unknownField = structuredClone(validEmpty) as Record<string, unknown>;
unknownField.finalAssessmentResult = { passed: true, percentage: 100 };
assert(!validateHrbaResumeState(unknownField).success, "Client assessment authority was accepted.");

const unknownModuleField = structuredClone(validEmpty);
unknownModuleField.moduleState.module3.data.arbitrary = true;
assert(!validateHrbaResumeState(unknownModuleField).success, "An unknown module field was accepted.");

const oversized = structuredClone(validEmpty);
oversized.moduleState.module1.data.surveyNote = "x".repeat(520_000);
assert(!validateHrbaResumeState(oversized).success, "An oversized resume payload was accepted.");

const workflowSource = readFileSync("src/lib/external-course-workflow.ts", "utf8");
assert(workflowSource.includes("updatedAt: new Date(baseRevision as string)"), "Optimistic concurrency update is missing.");
assert(workflowSource.includes("Completed modules cannot regress"), "Completed-module regression protection is missing.");
assert(workflowSource.includes("Completed modules cannot skip prerequisites"), "Completion jump protection is missing.");
assert(workflowSource.includes("Course prerequisites are incomplete"), "Assessment prerequisite protection is missing.");

console.log(JSON.stringify({
  assessmentAuthorityExcluded: true,
  emptyStateValid: true,
  invalidScreenRejected: true,
  moduleProgress: [0, 18, 54, 90, 100],
  optimisticConcurrencyPresent: true,
  oversizedPayloadRejected: true,
  prerequisiteJumpRejected: true,
  regressionProtectionPresent: true,
  unknownFieldsRejected: true,
}, null, 2));
