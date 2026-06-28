import { isRoleKey, type RoleKey } from "./roles";

export const AUTH_COOKIE_NAME = "cso_lh_session";

export type AuthSession = {
  userId: string;
  email: string;
  name: string;
  roles: RoleKey[];
  issuedAt: string;
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function base64UrlToBytes(value: string) {
  const base64 = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));

  return bytesToBase64Url(new Uint8Array(signature));
}

function timingSafeEqual(left: string, right: string) {
  if (left.length !== right.length) {
    return false;
  }

  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return result === 0;
}

function isAuthSession(value: unknown): value is AuthSession {
  if (!value || typeof value !== "object") {
    return false;
  }

  const session = value as Partial<AuthSession>;

  return (
    typeof session.userId === "string" &&
    typeof session.email === "string" &&
    typeof session.name === "string" &&
    typeof session.issuedAt === "string" &&
    Array.isArray(session.roles) &&
    session.roles.every(isRoleKey)
  );
}

export async function createSessionCookieValue(
  session: AuthSession,
  secret: string,
) {
  const payload = bytesToBase64Url(encoder.encode(JSON.stringify(session)));
  const signature = await sign(payload, secret);

  return `${payload}.${signature}`;
}

export async function parseSessionCookieValue(
  cookieValue: string | undefined,
  secret: string,
) {
  if (!cookieValue) {
    return null;
  }

  const [payload, signature] = cookieValue.split(".");
  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = await sign(payload, secret);
  if (!timingSafeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const parsed = JSON.parse(decoder.decode(base64UrlToBytes(payload)));
    return isAuthSession(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function getSessionSecret() {
  return (
    process.env.SESSION_SECRET ??
    "local-development-session-secret-change-me-before-production"
  );
}
