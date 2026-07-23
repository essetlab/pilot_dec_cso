import assert from "node:assert/strict";
import {
  buildCourseInvitationEmailContent,
  buildStaffInvitationEmailContent,
  sendCourseInvitationEmail,
  sendStaffInvitationEmail,
  type EmailTransport,
} from "../src/lib/email";

const SMTP_KEYS = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "SMTP_SECURE",
  "EMAIL_FROM",
  "EMAIL_REPLY_TO",
  "PILOT_SUPPORT_EMAIL",
] as const;

const originalEnvironment = Object.fromEntries(
  SMTP_KEYS.map((key) => [key, process.env[key]]),
);
const sensitiveEmail = "pilot.email.fixture@example.invalid";
const sensitiveUrl =
  "https://preview.example.invalid/course-invitations/accept?token=fixture-secret-token";

function setCompleteConfiguration() {
  process.env.SMTP_HOST = "smtp.example.invalid";
  process.env.SMTP_PORT = "587";
  process.env.SMTP_USER = "fixture-user";
  process.env.SMTP_PASS = "fixture-password";
  process.env.EMAIL_FROM = "CSO Learning Hub <no-reply@example.invalid>";
  process.env.EMAIL_REPLY_TO = "support@example.invalid";
  process.env.PILOT_SUPPORT_EMAIL = "support@example.invalid";
}

async function verifyMissingConfigurationRedaction() {
  for (const key of SMTP_KEYS) {
    delete process.env[key];
  }
  const messages: string[] = [];
  const originalInfo = console.info;
  console.info = (...values: unknown[]) => messages.push(values.join(" "));
  try {
    const result = await sendStaffInvitationEmail({
      email: sensitiveEmail,
      invitationUrl: sensitiveUrl,
      roleName: "Platform Administrator",
    });
    assert.equal(result.delivered, false);
    assert.equal(result.delivered ? "" : result.reason, "missing-config");
  } finally {
    console.info = originalInfo;
  }

  const output = messages.join("\n");
  assert(!output.includes(sensitiveEmail));
  assert(!output.includes(sensitiveUrl));
  assert(!output.includes("fixture-secret-token"));
}

function verifyProfessionalContentAndEscaping() {
  const staff = buildStaffInvitationEmailContent({
    invitationUrl: sensitiveUrl,
    roleName: 'Platform Administrator <script>alert("x")</script>',
  });
  assert.match(staff.subject, /administrator invitation/i);
  assert.match(staff.text, /expires in 48 hours/i);
  assert.match(staff.text, /Private Administrator Portal/i);
  assert.match(staff.text, /internal testing checklist/i);
  assert.match(staff.text, /DEC Internal Test/i);
  assert.match(staff.text, /No Vercel, GitHub, or Supabase access is required/i);
  assert.match(staff.html, /\/admin\/internal-test-guide/);
  assert(!staff.html.includes("<script>"));

  const course = buildCourseInvitationEmailContent({
    courseTitle: 'HRBA <script>alert("x")</script>',
    expiresAt: new Date("2026-08-01T12:00:00.000Z"),
    invitationUrl: sensitiveUrl,
    learnerName: "<Learner>",
    organizationName: "Synthetic & Safe CSO",
    versionLabel: "Version 1",
  });
  assert.match(course.subject, /course invitation/i);
  assert.match(course.text, /Do not forward or share/i);
  assert.match(course.text, /explicitly accept|register or sign in/i);
  assert(!course.html.includes("<script>"));
  assert(course.html.includes("&lt;Learner&gt;"));
  assert(course.html.includes("Synthetic &amp; Safe CSO"));
}

async function verifyProviderAcceptanceAndFailureRedaction() {
  setCompleteConfiguration();
  const acceptedMessages: Array<Record<string, unknown>> = [];
  const acceptedTransport: EmailTransport = {
    async sendMail(message) {
      acceptedMessages.push(message as Record<string, unknown>);
      return { accepted: [sensitiveEmail] };
    },
  };
  const accepted = await sendCourseInvitationEmail({
    courseTitle: "Applying the Human Rights-Based Approach in CSO Practice",
    email: sensitiveEmail,
    expiresAt: new Date("2026-08-01T12:00:00.000Z"),
    invitationUrl: sensitiveUrl,
    learnerName: "Synthetic Learner",
    organizationName: "Synthetic CSO",
    transport: acceptedTransport,
    versionLabel: "Version 1",
  });
  assert.deepEqual(accepted, { delivered: true });
  assert.equal(acceptedMessages.length, 1);
  assert.equal(acceptedMessages[0].to, sensitiveEmail);
  assert.equal(acceptedMessages[0].replyTo, "support@example.invalid");

  const failureMessages: string[] = [];
  const originalError = console.error;
  console.error = (...values: unknown[]) => failureMessages.push(values.join(" "));
  try {
    const rejected = await sendCourseInvitationEmail({
      courseTitle: "HRBA",
      email: sensitiveEmail,
      expiresAt: new Date("2026-08-01T12:00:00.000Z"),
      invitationUrl: sensitiveUrl,
      learnerName: "Synthetic Learner",
      organizationName: "Synthetic CSO",
      transport: {
        async sendMail() {
          throw new Error("provider-secret-response");
        },
      },
      versionLabel: "Version 1",
    });
    assert.equal(rejected.delivered, false);
    assert.equal(rejected.delivered ? "" : rejected.reason, "send-failed");
  } finally {
    console.error = originalError;
  }

  const output = failureMessages.join("\n");
  assert(!output.includes(sensitiveEmail));
  assert(!output.includes(sensitiveUrl));
  assert(!output.includes("fixture-secret-token"));
  assert(!output.includes("provider-secret-response"));
}

try {
  await verifyMissingConfigurationRedaction();
  verifyProfessionalContentAndEscaping();
  await verifyProviderAcceptanceAndFailureRedaction();
  console.log(
    "Pilot email verifier passed: templates, provider acceptance, missing-config fallback, and sensitive-value redaction are intact.",
  );
} finally {
  for (const key of SMTP_KEYS) {
    const value = originalEnvironment[key];
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}
