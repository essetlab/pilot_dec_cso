export const ETHIOPIA_REGIONS = [
  "Addis Ababa",
  "Afar",
  "Amhara",
  "Benishangul-Gumuz",
  "Central Ethiopia",
  "Dire Dawa",
  "Gambella",
  "Harari",
  "Oromia",
  "Sidama",
  "Somali",
  "South Ethiopia",
  "South West Ethiopia Peoples’ Region",
  "Tigray",
  "Other / not listed",
] as const;

export const LEARNER_ROLE_OPTIONS = [
  "Executive leadership",
  "Programme or project management",
  "Monitoring, evaluation, accountability, and learning",
  "Finance or administration",
  "People, inclusion, or safeguarding",
  "Advocacy or communications",
  "Community engagement or facilitation",
  "Governance or board member",
  "Other",
] as const;

export const SUPPORTED_LANGUAGE_OPTIONS = [
  "English",
  "Amharic",
  "Afan Oromo",
  "Tigrinya",
] as const;

export function isControlledRegion(value: string) {
  return ETHIOPIA_REGIONS.includes(value as (typeof ETHIOPIA_REGIONS)[number]);
}

export function isControlledLearnerRole(value: string) {
  return LEARNER_ROLE_OPTIONS.includes(
    value as (typeof LEARNER_ROLE_OPTIONS)[number],
  );
}

export function isSupportedLanguage(value: string) {
  return SUPPORTED_LANGUAGE_OPTIONS.includes(
    value as (typeof SUPPORTED_LANGUAGE_OPTIONS)[number],
  );
}

export function resolveControlledLearnerRole(role: string, otherRole?: string) {
  if (!isControlledLearnerRole(role)) {
    return null;
  }

  if (role !== "Other") {
    return role;
  }

  const normalizedOtherRole = otherRole?.trim().slice(0, 160) ?? "";
  return normalizedOtherRole || null;
}
