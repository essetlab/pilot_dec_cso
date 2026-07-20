export type PilotRegistrationMode = "simple" | "strict" | "unavailable";

export type PilotRegistrationModeResolution = {
  label:
    | "Simple access-code mode"
    | "Strict invited-email and access-code mode"
    | "Registration temporarily unavailable";
  mode: PilotRegistrationMode;
};

type PilotRegistrationEnvironment = Partial<
  Pick<
    NodeJS.ProcessEnv,
    | "NODE_ENV"
    | "PILOT_ACCESS_CODE"
    | "PILOT_ACCESS_CODES"
    | "PILOT_INVITED_EMAILS"
    | "PILOT_REGISTRATION_MODE"
  >
>;

const DEFAULT_PILOT_ACCESS_CODE = "HRBA-PILOT-2026";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function normalizeAccessCode(value: string) {
  return value.trim().toUpperCase();
}

function parseInvitedEmails(environment: PilotRegistrationEnvironment) {
  const entries = (environment.PILOT_INVITED_EMAILS ?? "")
    .split(",")
    .map(normalizeEmail)
    .filter(Boolean);

  return {
    emails: entries,
    valid: entries.length > 0 && entries.every((email) => EMAIL_PATTERN.test(email)),
  };
}

export function resolvePilotRegistrationMode(
  environment: PilotRegistrationEnvironment = process.env,
): PilotRegistrationModeResolution {
  const requestedMode = (environment.PILOT_REGISTRATION_MODE ?? "")
    .trim()
    .toLowerCase();

  if (!requestedMode || requestedMode === "simple") {
    return { label: "Simple access-code mode", mode: "simple" };
  }

  if (requestedMode === "strict" && parseInvitedEmails(environment).valid) {
    return {
      label: "Strict invited-email and access-code mode",
      mode: "strict",
    };
  }

  return {
    label: "Registration temporarily unavailable",
    mode: "unavailable",
  };
}

export function isConfiguredPilotEmail(
  value: string,
  environment: PilotRegistrationEnvironment = process.env,
) {
  const parsed = parseInvitedEmails(environment);
  return parsed.valid && parsed.emails.includes(normalizeEmail(value));
}

export function isPilotAccessCodeValid(
  value: string,
  environment: PilotRegistrationEnvironment = process.env,
) {
  const localDefault = environment.NODE_ENV === "production" ? "" : DEFAULT_PILOT_ACCESS_CODE;
  const configuredCodes = (
    environment.PILOT_ACCESS_CODES ?? environment.PILOT_ACCESS_CODE ?? localDefault
  )
    .split(",")
    .map(normalizeAccessCode)
    .filter(Boolean);

  return configuredCodes.includes(normalizeAccessCode(value));
}

export function getDefaultPilotAccessCodeForLocalDev() {
  return DEFAULT_PILOT_ACCESS_CODE;
}
