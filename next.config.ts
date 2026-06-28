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

const externalCourseOrigins = Array.from(
  new Set([
    "https://pilot-hrba-e-learn-v1-wajj.vercel.app",
    "http://localhost:5173",
    ...(process.env.HRBA_EXTERNAL_COURSE_ALLOWED_ORIGINS ?? "")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
    originFromUrl(process.env.HRBA_EXTERNAL_COURSE_URL),
  ].filter(Boolean)),
);

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "frame-ancestors 'self'",
  `frame-src 'self' ${externalCourseOrigins.join(" ")}`,
  `child-src 'self' ${externalCourseOrigins.join(" ")}`,
  "connect-src 'self'",
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
