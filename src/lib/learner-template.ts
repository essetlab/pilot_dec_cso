export const learnerTemplateIds = [
  "LT-GUIDED-LESSON",
  "LT-PRACTICE-SCENARIO",
  "LT-RESOURCE-TOOLKIT",
  "LT-ASSESSMENT-PREP",
] as const;

export type LearnerTemplateId = (typeof learnerTemplateIds)[number];

export type LearnerTemplateSelection = {
  navigationStyleId: "SIDEBAR_OUTLINE";
  templateId: LearnerTemplateId;
  templateLabel: string;
  templateSummary: string;
  themeId: "DEC_DEFAULT";
};

export const defaultLearnerTemplateSelection: LearnerTemplateSelection = {
  navigationStyleId: "SIDEBAR_OUTLINE",
  templateId: "LT-GUIDED-LESSON",
  templateLabel: "Guided lesson",
  templateSummary: "Structured, calm, readable lesson flow",
  themeId: "DEC_DEFAULT",
};

const learnerTemplateLibrary: Record<LearnerTemplateId, LearnerTemplateSelection> = {
  "LT-ASSESSMENT-PREP": {
    navigationStyleId: "SIDEBAR_OUTLINE",
    templateId: "LT-ASSESSMENT-PREP",
    templateLabel: "Assessment prep",
    templateSummary: "Focused review flow for knowledge checks and final test readiness",
    themeId: "DEC_DEFAULT",
  },
  "LT-GUIDED-LESSON": defaultLearnerTemplateSelection,
  "LT-PRACTICE-SCENARIO": {
    navigationStyleId: "SIDEBAR_OUTLINE",
    templateId: "LT-PRACTICE-SCENARIO",
    templateLabel: "Practice scenario",
    templateSummary: "Applied decision practice with case work and action activities",
    themeId: "DEC_DEFAULT",
  },
  "LT-RESOURCE-TOOLKIT": {
    navigationStyleId: "SIDEBAR_OUTLINE",
    templateId: "LT-RESOURCE-TOOLKIT",
    templateLabel: "Resource toolkit",
    templateSummary: "Practical toolkit flow for resources, links, and reusable materials",
    themeId: "DEC_DEFAULT",
  },
};

function jsonRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeTemplateId(value: unknown): LearnerTemplateId {
  const templateId = stringValue(value);

  return learnerTemplateIds.includes(templateId as LearnerTemplateId)
    ? (templateId as LearnerTemplateId)
    : defaultLearnerTemplateSelection.templateId;
}

export function getLearnerTemplate(templateId: unknown) {
  return learnerTemplateLibrary[normalizeTemplateId(templateId)];
}

export function toLearnerTemplateMetadata(templateId: unknown) {
  const template = getLearnerTemplate(templateId);

  return {
    selectedNavigationStyleId: template.navigationStyleId,
    selectedTemplateId: template.templateId,
    selectedThemeId: template.themeId,
  };
}

export function resolveLearnerTemplateSelection(
  metadataJson: unknown,
): LearnerTemplateSelection {
  const metadata = jsonRecord(metadataJson);
  const template = jsonRecord(metadata.template);
  const templateId = normalizeTemplateId(
    template.selectedTemplateId ?? template.templateId ?? metadata.selectedTemplateId,
  );

  return learnerTemplateLibrary[templateId];
}

export function getLearnerTemplateOptions() {
  return learnerTemplateIds.map((templateId) => learnerTemplateLibrary[templateId]);
}
