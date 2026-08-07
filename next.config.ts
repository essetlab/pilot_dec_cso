import type { NextConfig } from "next";

import { getHrbaExternalCourseAllowedOrigins } from "./src/lib/external-course-config";

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

const externalCourseOrigins = getHrbaExternalCourseAllowedOrigins();

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
