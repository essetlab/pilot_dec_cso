import "server-only";

import { headers } from "next/headers";

function toOrigin(value: string | undefined) {
  if (!value) return null;

  try {
    const normalized = value.includes("://") ? value : `https://${value}`;
    return new URL(normalized).origin;
  } catch {
    return null;
  }
}

function configuredAuthOrigins() {
  return new Set(
    [
      process.env.NEXT_PUBLIC_APP_URL,
      process.env.APP_URL,
      process.env.VERCEL_URL,
      process.env.VERCEL_BRANCH_URL,
      process.env.VERCEL_PROJECT_PRODUCTION_URL,
      process.env.NODE_ENV === "development" ? "http://localhost:3000" : undefined,
    ]
      .map(toOrigin)
      .filter((origin): origin is string => Boolean(origin)),
  );
}

export async function resolvePublicAuthOrigin() {
  const requestHeaders = await headers();
  const forwardedHost = requestHeaders.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost ?? requestHeaders.get("host");
  const forwardedProtocol = requestHeaders.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const protocol = forwardedProtocol ?? (host?.startsWith("localhost") ? "http" : "https");
  const requestOrigin = host ? toOrigin(`${protocol}://${host}`) : null;
  const allowedOrigins = configuredAuthOrigins();

  if (requestOrigin && allowedOrigins.has(requestOrigin)) {
    return requestOrigin;
  }

  return toOrigin(process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL) ?? "http://localhost:3000";
}
