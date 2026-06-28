import "server-only";

import { cookies } from "next/headers";
import {
  AUTH_COOKIE_NAME,
  createSessionCookieValue,
  getSessionSecret,
  parseSessionCookieValue,
  type AuthSession,
} from "./session-codec";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NEXT_PUBLIC_APP_URL?.startsWith("https://") ?? false,
  path: "/",
  maxAge: 60 * 60 * 8,
};

export async function getCurrentSession() {
  const globalMock = (globalThis as unknown as { __mockSession?: AuthSession }).__mockSession;
  if (globalMock) {
    return globalMock;
  }
  try {
    const cookieStore = await cookies();
    const cookieValue = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    return parseSessionCookieValue(cookieValue, getSessionSecret());
  } catch {
    return null;
  }
}

export async function setCurrentSession(session: AuthSession) {
  const cookieStore = await cookies();
  const cookieValue = await createSessionCookieValue(
    session,
    getSessionSecret(),
  );

  cookieStore.set(AUTH_COOKIE_NAME, cookieValue, cookieOptions);
}

export async function clearCurrentSession() {
  const cookieStore = await cookies();

  cookieStore.delete(AUTH_COOKIE_NAME);
}
