import crypto from "crypto";

export const INVITATION_TTL_HOURS = 48;

export function createInvitationToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function hashInvitationToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function createInvitationExpiry() {
  return new Date(Date.now() + INVITATION_TTL_HOURS * 60 * 60 * 1000);
}

export function buildStaffRegistrationUrl(token: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  const base = appUrl && appUrl.startsWith("http") ? appUrl : "http://localhost:3000";
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;

  return `${normalizedBase}/register/staff?token=${encodeURIComponent(token)}`;
}
