import nodemailer from "nodemailer";

let cachedTransporter: nodemailer.Transporter | null = null;

const SMTP_ENV_KEYS = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "EMAIL_FROM",
] as const;

export type StaffInvitationEmailResult =
  | { delivered: true }
  | {
      delivered: false;
      reason: "missing-config" | "send-failed";
      message: string;
    };

export type CourseInvitationEmailResult = StaffInvitationEmailResult;

function readEnv(name: string) {
  return process.env[name]?.trim() ?? "";
}

export function isStaffInvitationEmailConfigured() {
  return SMTP_ENV_KEYS.every((key) => readEnv(key).length > 0);
}

function getRequiredEnv(name: string) {
  const value = readEnv(name);
  if (!value) {
    throw new Error(`missing-email-config:${name}`);
  }
  return value;
}

function getSmtpTransporter() {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const host = getRequiredEnv("SMTP_HOST");
  const port = Number(getRequiredEnv("SMTP_PORT"));
  const user = getRequiredEnv("SMTP_USER");
  const pass = getRequiredEnv("SMTP_PASS");
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  cachedTransporter = nodemailer.createTransport({
    auth: { pass, user },
    host,
    port,
    secure,
  });

  return cachedTransporter;
}

function buildInvitationEmailContent(invitationUrl: string) {
  return {
    html: `
      <p>Hello,</p>
      <p>You have been invited to join the CSO Learning Hub.</p>
      <p>Please click the secure link below to complete your registration:</p>
      <p><a href="${invitationUrl}">${invitationUrl}</a></p>
      <p>This link expires in 48 hours and can only be used once.</p>
    `,
    subject: "CSO Learning Hub invitation",
    text: [
      "Hello,",
      "",
      "You have been invited to join the CSO Learning Hub.",
      "Open this secure link to complete registration:",
      invitationUrl,
      "",
      "This link expires in 48 hours and can only be used once.",
    ].join("\n"),
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildCourseInvitationEmailContent(input: {
  courseTitle: string;
  invitationUrl: string;
  invitedName: string;
}) {
  const invitedName = escapeHtml(input.invitedName);
  const courseTitle = escapeHtml(input.courseTitle);
  const invitationUrl = escapeHtml(input.invitationUrl);

  return {
    html: `
      <p>Hello ${invitedName},</p>
      <p>DEC has approved your access to <strong>${courseTitle}</strong> in the CSO Learning Hub.</p>
      <p>Use the secure personal link below to activate your account and course access:</p>
      <p><a href="${invitationUrl}">Activate my learning account</a></p>
      <p>This activation link is valid for five days. Opening it does not consume it, and your course access will not expire after activation.</p>
      <p>If you already activated your account, open the link and sign in.</p>
    `,
    subject: `Your CSO Learning Hub invitation: ${input.courseTitle}`,
    text: [
      `Hello ${input.invitedName},`,
      "",
      `DEC has approved your access to ${input.courseTitle} in the CSO Learning Hub.`,
      "Activate your account and course access using this secure personal link:",
      input.invitationUrl,
      "",
      "This activation link is valid for five days. Opening it does not consume it, and your course access will not expire after activation.",
      "If you already activated your account, open the link and sign in.",
    ].join("\n"),
  };
}

export async function sendStaffInvitationEmail({
  email,
  invitationUrl,
}: {
  email: string;
  invitationUrl: string;
}): Promise<StaffInvitationEmailResult> {
  if (!isStaffInvitationEmailConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[cso-learning-hub] Staff invitation email delivery is unavailable.");
      return {
        delivered: false,
        message:
          "Email delivery is unavailable. Share the registration link manually.",
        reason: "missing-config",
      };
    }

    return {
      delivered: false,
      message:
        "Invitation email could not be sent because SMTP settings are missing.",
      reason: "missing-config",
    };
  }

  try {
    const fromEmail = getRequiredEnv("EMAIL_FROM");
    const transporter = getSmtpTransporter();
    const content = buildInvitationEmailContent(invitationUrl);

    await transporter.sendMail({
      from: fromEmail,
      html: content.html,
      subject: content.subject,
      text: content.text,
      to: email,
    });

    return { delivered: true };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "The mail server rejected the invitation email.";

    console.error("Failed to send staff invitation email", error);

    return {
      delivered: false,
      message,
      reason: "send-failed",
    };
  }
}

export async function sendCourseInvitationEmail(input: {
  courseTitle: string;
  email: string;
  invitationUrl: string;
  invitedName: string;
}): Promise<CourseInvitationEmailResult> {
  if (!isStaffInvitationEmailConfigured()) {
    return {
      delivered: false,
      message: "Invitation email could not be sent because SMTP settings are missing.",
      reason: "missing-config",
    };
  }

  try {
    const fromEmail = getRequiredEnv("EMAIL_FROM");
    const transporter = getSmtpTransporter();
    const content = buildCourseInvitationEmailContent(input);

    await transporter.sendMail({
      from: fromEmail,
      html: content.html,
      subject: content.subject,
      text: content.text,
      to: input.email,
    });

    return { delivered: true };
  } catch (error) {
    console.error("Course invitation email delivery failed.", {
      errorType: error instanceof Error ? error.name : "UnknownError",
    });
    return {
      delivered: false,
      message: "The invitation email could not be delivered.",
      reason: "send-failed",
    };
  }
}
