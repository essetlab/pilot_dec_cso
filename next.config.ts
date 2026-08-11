import type { NextConfig } from "next";

function originFromUrl(value: string | undefined) {
  if (!value) {
    return "";
  }

  try {
    return new URL(value).origin;
  } catch {
    return "";
  }
}

function splitOrigins(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function productionSafeExactOrigin(value: string) {
  try {
    const parsed = new URL(value);
    const hostname = parsed.hostname.toLowerCase();
    const isLoopback =
      hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";

    return !value.includes("*") &&
      parsed.origin === value &&
      parsed.protocol === "https:" &&
      !isLoopback
      ? parsed.origin
      : "";
  } catch {
    return "";
  }
}

const isProduction = process.env.NODE_ENV === "production";
const localExternalCourseOrigins = isProduction
  ? []
  : ["http://localhost:5173", "http://127.0.0.1:5173"];
const configuredPmOrigins = splitOrigins(
  process.env.PM_EXTERNAL_COURSE_ALLOWED_ORIGINS,
);
const pmExternalCourseOrigins = isProduction
  ? [
      ...configuredPmOrigins.map(productionSafeExactOrigin),
      productionSafeExactOrigin(originFromUrl(process.env.PM_EXTERNAL_COURSE_URL)),
    ]
  : [
      ...configuredPmOrigins,
      originFromUrl(process.env.PM_EXTERNAL_COURSE_URL),
    ];

const externalCourseOrigins = Array.from(
  new Set([
    "https://pilot-hrba-e-learn-v1-wajj.vercel.app",
    ...localExternalCourseOrigins,
    ...splitOrigins(process.env.HRBA_EXTERNAL_COURSE_ALLOWED_ORIGINS),
    originFromUrl(process.env.HRBA_EXTERNAL_COURSE_URL),
    ...pmExternalCourseOrigins,
  ].filter(Boolean)),
);

const supabaseOrigin = originFromUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "frame-ancestors 'self'",
  `frame-src 'self' ${externalCourseOrigins.join(" ")}`,
  `child-src 'self' ${externalCourseOrigins.join(" ")}`,
  `connect-src 'self' ${supabaseOrigin}`.trim(),
  "font-src 'self' data:",
  "form-action 'self'",
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob: https:",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
].join("; ");

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        headers: [
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
        source: "/course-invitations/accept",
      },
      {
        headers: [
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy,
          },
        ],
        source: "/:path*",
      },
    ];
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
