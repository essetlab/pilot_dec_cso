import type { Prisma } from "../generated/prisma/client";

export const HRBA_RESUME_CONTRACT_VERSION = 1 as const;
export const HRBA_COURSE_STATE_VERSION = "hrba-course-progress-v1" as const;
export const HRBA_COURSE_STRUCTURE_REVISION = "hrba-course-structure-7e4b8b4-v1" as const;
export const HRBA_RESUME_MAX_BYTES = 512_000;

export const HRBA_REQUIRED_MODULE_IDS = [
  "module_01_hrba_foundations",
  "module_02_everyday_cso_work",
  "module_03_project_design",
  "module_04_implementation",
  "module_05_hrba_meal",
] as const;

export type HrbaRequiredModuleId = typeof HRBA_REQUIRED_MODULE_IDS[number];
export type HrbaResumeModuleKey = "module1" | "module2" | "module3" | "module4" | "module5";
export type HrbaJsonValue = null | boolean | number | string | HrbaJsonValue[] | { [key: string]: HrbaJsonValue };

export type HrbaResumeModuleState = {
  version: 1;
  data: Record<string, HrbaJsonValue>;
};

export type HrbaResumeState = {
  contractVersion: typeof HRBA_RESUME_CONTRACT_VERSION;
  courseStateVersion: typeof HRBA_COURSE_STATE_VERSION;
  courseStructureRevision: typeof HRBA_COURSE_STRUCTURE_REVISION;
  baseRevision: string | null;
  navigation: {
    currentLayer: "platform" | "player";
    currentModuleId: string | null;
    currentScreenId: string | null;
  };
  completedModuleIds: HrbaRequiredModuleId[];
  completedScreenIdsByModule: Partial<Record<HrbaRequiredModuleId, string[]>>;
  moduleState: Record<HrbaResumeModuleKey, HrbaResumeModuleState>;
  assessmentDraft?: {
    answers: Record<string, string>;
  };
};

export type HrbaTrustedAssessmentState = {
  attemptNumber: number;
  evidenceId: string;
  maxScore: number;
  passed: boolean;
  percentage: number;
  score: number;
  submittedAt: string;
} | null;

const moduleScreenIds: Record<string, ReadonlySet<string>> = {
  module_01_hrba_foundations: new Set([
    "M1-LMS-00", "M1-PLAYER-00", "M1-PLAYER-HELP", "M1-PLAYER-A11Y",
    "M1-S1-01", "M1-S1-02", "M1-S1-03", "M1-S1-04", "M1-S1-05",
    "M1-S1-06", "M1-S1-06A", "M1-S1-06B", "M1-PLAYER-COMPLETE", "M1-LMS-RETURN",
  ]),
  module_02_everyday_cso_work: new Set([
    "M2-00", "M2-Intro", "M2-Objectives", "1.1", "1.2", "1.3", "2.1", "2.2", "2.3",
    "3.1", "3.2", "3.3", "4.1", "4.2", "4.3", "5.1", "5.2", "5.3", "6.1", "6.2",
    "M2-KC", "M2-Close",
  ]),
  module_03_project_design: new Set([
    "M3-PLAYER-00", ...Array.from({ length: 22 }, (_, index) => `M3-R${String(index + 1).padStart(2, "0")}`),
  ]),
  module_04_implementation: new Set([
    "M4-PLAYER-00", ...Array.from({ length: 14 }, (_, index) => `M4-S1-${String(index + 1).padStart(2, "0")}`),
  ]),
  module_05_hrba_meal: new Set([
    "M5-PLAYER-00", ...Array.from({ length: 14 }, (_, index) => `M5-R${String(index + 1).padStart(2, "0")}`),
    "M5-PLAYER-COMPLETE",
  ]),
  final_assessment: new Set([
    "FINAL-ASSESSMENT-PLAYER-00", "FINAL-ASSESSMENT-QUESTIONS", "FINAL-ASSESSMENT-COMPLETE",
  ]),
};

const module1Fields = new Set([
  "agreementAccepted", "orientationAnswers", "orientationCompleted", "surveyAnswers", "surveyPriorities",
  "surveyNote", "surveyCompleted", "sortingState", "sortingCompleted", "matchingState", "matchingCompleted",
  "scenarioAnswers", "scenarioCompleted", "m1JourneyActiveStep", "m1JourneyVisitedSteps",
  "m1WaterPointVisitedClues", "m1WaterPointSelectedOption", "m1WaterPointSummaryViewed",
  "m1EverydayWorkExplored", "m1InclusionPerspectivesExplored", "m1ConnectedRightsExplored",
  "m1RightsHolderLensViewed", "m1RightsHolderCheckAnswer", "m1ActorCategoriesExplored",
  "m1ActorMatchingAnswers", "m1ActorMatchingCompleted", "m1ParticipationLevelsViewed",
  "m1ParticipationScenarioAnswer", "m1ParticipationScenarioCompleted", "m1HrbaShiftStepsExplored",
  "m1HrbaShiftAnswer", "m1KnowledgeCheckStarted", "m1KnowledgeCheckCurrentIndex",
  "m1KnowledgeCheckSelectedAnswers", "m1KnowledgeCheckCheckedQuestions", "m1KnowledgeCheckCorrectness",
  "m1KnowledgeCheckScore", "m1KnowledgeCheckCompleted", "m1KnowledgeCheckRetryCount", "assessmentFocus",
  "m1SelfAssessmentPage", "selfAssessmentScores", "selfAssessmentTotal", "selfAssessmentCategory",
  "suggestedPriorityOne", "suggestedPriorityTwo", "screen16Completed", "screen17ActionCommitment",
  "screen18Completion", "module1Completion", "portfolioShiftSelected", "portfolioShiftAreas",
  "portfolioShiftNote", "quizAnswers", "quizCompleted", "quizScore", "practice",
]);

const module2Fields = new Set([
  "m2PlainLanguageRightsExplanation", "m2EverydayRightsIssue", "m2EverydayRightsDimension",
  "m2EverydayRightsMap", "m2RightsType", "m2RightsTypeNote", "m2SafeLearningReminderAccepted",
  "m2StandardsChecklistReviewed", "m2RightsRelevanceWorksheet", "m2DecisionChangeType",
  "m2DecisionChangeNote", "m2EverydayRightsLens", "m2QuizAnswers", "m2QuizCompleted",
  "m2SortingState", "m2SortingCompleted", "m2MatchingState", "m2MatchingCompleted",
  "m2ObjectiveCardsViewed", "m2FinalPortfolio", "m2FinalKnowledgeCheckAnswers",
  "m2FinalKnowledgeCheckCompleted", "m2HotspotViewed", "m2FlashcardsViewed", "m2TabsViewed",
  "m2ProcessViewed", "m2TimelineViewed", "practice",
]);

const moduleStateFields: Record<HrbaResumeModuleKey, ReadonlySet<string>> = {
  module1: module1Fields,
  module2: module2Fields,
  module3: new Set(["practice"]),
  module4: new Set(["practice"]),
  module5: new Set(["practice"]),
};

const prohibitedKeys = new Set([
  "userid", "learnerid", "participantid", "enrollmentid", "organizationid", "orgid",
  "courseversionid", "learnerstatekey", "launchtoken", "certificateid", "certificatecode",
  "finalassessmentresult", "finalassessmentattemptnumber",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function hasExactKeys(value: Record<string, unknown>, required: string[], optional: string[] = []) {
  const allowed = new Set([...required, ...optional]);
  return required.every((key) => Object.hasOwn(value, key))
    && Object.keys(value).every((key) => allowed.has(key));
}

function isBoundedJson(value: unknown, depth = 0): value is HrbaJsonValue {
  if (depth > 12) return false;
  if (value === null || typeof value === "boolean") return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value === "string") return value.length <= 10_000;
  if (Array.isArray(value)) {
    return value.length <= 500 && value.every((item) => isBoundedJson(item, depth + 1));
  }
  if (!isRecord(value) || Object.keys(value).length > 500) return false;

  return Object.entries(value).every(([key, nested]) => {
    const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
    return key.length > 0
      && key.length <= 128
      && !prohibitedKeys.has(normalizedKey)
      && isBoundedJson(nested, depth + 1);
  });
}

function isValidRevision(value: unknown) {
  if (value === null) return true;
  if (typeof value !== "string" || value.length > 64) return false;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString() === value;
}

function isValidCompletedModules(value: unknown): value is HrbaRequiredModuleId[] {
  if (!Array.isArray(value) || value.length > HRBA_REQUIRED_MODULE_IDS.length) return false;
  return value.every((moduleId, index) => moduleId === HRBA_REQUIRED_MODULE_IDS[index]);
}

function isValidScreenProgress(value: unknown) {
  if (!isRecord(value)) return false;
  if (!Object.keys(value).every((moduleId) => HRBA_REQUIRED_MODULE_IDS.includes(moduleId as HrbaRequiredModuleId))) {
    return false;
  }

  return Object.entries(value).every(([moduleId, screenIds]) => (
    Array.isArray(screenIds)
    && screenIds.length <= 100
    && new Set(screenIds).size === screenIds.length
    && screenIds.every((screenId) => typeof screenId === "string" && moduleScreenIds[moduleId]?.has(screenId))
  ));
}

function isValidPracticeKey(moduleKey: HrbaResumeModuleKey, key: string) {
  if (moduleKey === "module1") return /^(?:m1|module1)/iu.test(key);
  if (moduleKey === "module2") return /^(?:m2|module2)/iu.test(key);
  if (moduleKey === "module3") {
    return /^(?:m3|module3|screen3)/iu.test(key)
      || ["rights_actors_map", "knowledge_check", "PortfolioSnapshot"].includes(key);
  }
  if (moduleKey === "module4") return /^(?:m4|module4)/iu.test(key);
  return /^(?:m5|module5)/iu.test(key);
}

function isValidModuleEnvelope(moduleKey: HrbaResumeModuleKey, value: unknown) {
  if (!isRecord(value) || !hasExactKeys(value, ["version", "data"]) || value.version !== 1 || !isRecord(value.data)) {
    return false;
  }
  if (!Object.keys(value.data).every((key) => moduleStateFields[moduleKey].has(key))) return false;
  if (!isBoundedJson(value.data)) return false;

  const practice = value.data.practice;
  if (practice !== undefined) {
    if (!isRecord(practice) || !Object.keys(practice).every((key) => isValidPracticeKey(moduleKey, key))) {
      return false;
    }
  }

  if (moduleKey === "module4" && isRecord(practice) && practice.module4Enhanced !== undefined) {
    const enhanced = practice.module4Enhanced;
    if (!isRecord(enhanced)
      || enhanced.schemaVersion !== 1
      || enhanced.contentRevision !== "module4-enhanced-2026-07-25") return false;
  }
  if (moduleKey === "module5" && isRecord(practice) && practice.module5Presentation !== undefined) {
    const presentation = practice.module5Presentation;
    if (!isRecord(presentation)
      || presentation.schemaVersion !== 1
      || presentation.contentRevision !== "m5-presentation-final-v1") return false;
  }
  return true;
}

export function validateHrbaResumeState(value: unknown):
  | { success: true; state: HrbaResumeState }
  | { success: false; error: string } {
  let serialized: string;
  try {
    serialized = JSON.stringify(value);
  } catch {
    return { success: false, error: "Resume state is not serializable" };
  }
  if (Buffer.byteLength(serialized, "utf8") > HRBA_RESUME_MAX_BYTES) {
    return { success: false, error: "Resume state is too large" };
  }
  if (!isRecord(value) || !hasExactKeys(value, [
    "contractVersion", "courseStateVersion", "courseStructureRevision", "baseRevision", "navigation",
    "completedModuleIds", "completedScreenIdsByModule", "moduleState",
  ], ["assessmentDraft"])) {
    return { success: false, error: "Invalid resume state envelope" };
  }
  if (value.contractVersion !== HRBA_RESUME_CONTRACT_VERSION
    || value.courseStateVersion !== HRBA_COURSE_STATE_VERSION
    || value.courseStructureRevision !== HRBA_COURSE_STRUCTURE_REVISION
    || !isValidRevision(value.baseRevision)) {
    return { success: false, error: "Unsupported resume state version" };
  }
  if (!isRecord(value.navigation)
    || !hasExactKeys(value.navigation, ["currentLayer", "currentModuleId", "currentScreenId"])
    || !["platform", "player"].includes(String(value.navigation.currentLayer))) {
    return { success: false, error: "Invalid resume navigation" };
  }
  const currentModuleId = value.navigation.currentModuleId;
  const currentScreenId = value.navigation.currentScreenId;
  if (currentModuleId !== null
    && (typeof currentModuleId !== "string" || !Object.hasOwn(moduleScreenIds, currentModuleId))) {
    return { success: false, error: "Invalid current module" };
  }
  if (currentScreenId !== null
    && (typeof currentScreenId !== "string"
      || typeof currentModuleId !== "string"
      || !moduleScreenIds[currentModuleId]?.has(currentScreenId))) {
    return { success: false, error: "Invalid current screen" };
  }
  if (!isValidCompletedModules(value.completedModuleIds)
    || !isValidScreenProgress(value.completedScreenIdsByModule)) {
    return { success: false, error: "Invalid completed learning state" };
  }
  const completedModuleIds = value.completedModuleIds as HrbaRequiredModuleId[];
  const completedScreenIdsByModule = value.completedScreenIdsByModule as Record<string, string[]>;
  const currentRequiredIndex = typeof currentModuleId === "string"
    ? HRBA_REQUIRED_MODULE_IDS.indexOf(currentModuleId as HrbaRequiredModuleId)
    : -1;
  if ((currentRequiredIndex >= 0 && currentRequiredIndex > completedModuleIds.length)
    || (currentModuleId === "final_assessment"
      && completedModuleIds.length !== HRBA_REQUIRED_MODULE_IDS.length)
    || Object.keys(completedScreenIdsByModule).some((moduleId) => (
      HRBA_REQUIRED_MODULE_IDS.indexOf(moduleId as HrbaRequiredModuleId) > completedModuleIds.length
    ))) {
    return { success: false, error: "Resume state skips course prerequisites" };
  }
  if (!isRecord(value.moduleState)
    || !hasExactKeys(value.moduleState, ["module1", "module2", "module3", "module4", "module5"])) {
    return { success: false, error: "Invalid module state" };
  }
  for (const moduleKey of ["module1", "module2", "module3", "module4", "module5"] as const) {
    if (!isValidModuleEnvelope(moduleKey, value.moduleState[moduleKey])) {
      return { success: false, error: `Invalid ${moduleKey} resume state` };
    }
  }
  if (value.assessmentDraft !== undefined) {
    if (!isRecord(value.assessmentDraft)
      || !hasExactKeys(value.assessmentDraft, ["answers"])
      || !isRecord(value.assessmentDraft.answers)
      || Object.keys(value.assessmentDraft.answers).length > 20
      || !Object.entries(value.assessmentDraft.answers).every(([key, answer]) => (
        key.length > 0 && key.length <= 128 && typeof answer === "string" && answer.length <= 256
      ))) {
      return { success: false, error: "Invalid assessment draft" };
    }
  }
  return { success: true, state: JSON.parse(serialized) as HrbaResumeState };
}

export function extractStoredHrbaResumeState(progressJson: Prisma.JsonValue | null) {
  if (!isRecord(progressJson) || progressJson.resumeState === undefined) return null;
  const validated = validateHrbaResumeState(progressJson.resumeState);
  return validated.success ? validated.state : null;
}

export function deriveHrbaProgressPercent(completedModuleIds: readonly string[], assessmentPassed = false) {
  if (assessmentPassed) return 100;
  const completed = new Set(completedModuleIds);
  const completedRequired = HRBA_REQUIRED_MODULE_IDS.filter((moduleId) => completed.has(moduleId)).length;
  return completedRequired * 18;
}

export function validateHrbaProgressSummary(
  completedModuleIds: readonly string[],
  currentModuleId: string | null,
  currentScreenId: string | null,
) {
  const completedSet = new Set(completedModuleIds);
  const requiredCompleted = HRBA_REQUIRED_MODULE_IDS.filter((moduleId) => completedSet.has(moduleId));
  if (!isValidCompletedModules(requiredCompleted)
    || completedModuleIds.some((moduleId) => (
      moduleId !== "final_assessment"
      && !HRBA_REQUIRED_MODULE_IDS.includes(moduleId as HrbaRequiredModuleId)
    ))
    || completedSet.size !== completedModuleIds.length
    || (completedModuleIds.includes("final_assessment")
      && !HRBA_REQUIRED_MODULE_IDS.every((moduleId) => completedSet.has(moduleId)))) {
    return false;
  }
  if (currentModuleId === null) return currentScreenId === null;
  if (!Object.hasOwn(moduleScreenIds, currentModuleId)) return false;
  return currentScreenId === null || moduleScreenIds[currentModuleId].has(currentScreenId);
}

export function withHrbaResumeRevision(state: HrbaResumeState, revision: string): HrbaResumeState {
  return { ...state, baseRevision: revision };
}
