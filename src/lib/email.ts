import nodemailer from "nodemailer";

let cachedTransporter: nodemailer.Transporter | null = null;

const SMTP_ENV_KEYS = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "EMAIL_FROM",
] as const;

export type TransactionalEmailResult =
  | { delivered: true }
  | {
      delivered: false;
      reason: "missing-config" | "send-failed";
      message: string;
    };

export type EmailContent = {
  html: string;
  subject: string;
  text: string;
};

export type EmailTransport = {
  sendMail(message: nodemailer.SendMailOptions): Promise<unknown>;
};

function readEnv(name: string) {
  return process.env[name]?.trim() ?? "";
}

export function isTransactionalEmailConfigured() {
  return SMTP_ENV_KEYS.every((key) => readEnv(key).length > 0);
}

export const isStaffInvitationEmailConfigured =
  isTransactionalEmailConfigured;

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

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("invalid-email-config:SMTP_PORT");
  }

  cachedTransporter = nodemailer.createTransport({
    auth: { pass, user },
    host,
    port,
    secure,
  });

  return cachedTransporter;
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] ?? character,
  );
}

function supportText() {
  const supportEmail = readEnv("PILOT_SUPPORT_EMAIL");
  return supportEmail
    ? `If you need help, contact ${supportEmail}.`
    : "If you need help, contact the DEC pilot support team.";
}

function brandedHtml({
  actionLabel,
  actionUrl,
  body,
  greeting,
  preheader,
}: {
  actionLabel: string;
  actionUrl: string;
  body: string;
  greeting: string;
  preheader: string;
}) {
  const safeUrl = escapeHtml(actionUrl);
  const safeSupport = escapeHtml(supportText());

  return `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
  <body style="margin:0;background:#f3f7fa;color:#10213d;font-family:Arial,sans-serif;">
    <span style="display:none;max-height:0;overflow:hidden;">${escapeHtml(preheader)}</span>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f7fa;padding:24px 12px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border:1px solid #dce5eb;border-radius:18px;overflow:hidden;">
          <tr><td style="background:#10213d;padding:24px 28px;color:#ffffff;">
            <p style="margin:0;font-size:13px;letter-spacing:1.6px;text-transform:uppercase;">DEC</p>
            <h1 style="margin:8px 0 0;font-size:24px;">CSO Learning Hub</h1>
          </td></tr>
          <tr><td style="padding:28px;">
            <p style="margin:0 0 18px;font-size:16px;">${escapeHtml(greeting)}</p>
            ${body}
            <p style="margin:26px 0;">
              <a href="${safeUrl}" style="display:inline-block;border-radius:10px;background:#1689c9;color:#ffffff;padding:13px 20px;text-decoration:none;font-weight:700;">${escapeHtml(actionLabel)}</a>
            </p>
            <p style="margin:0 0 18px;color:#536579;font-size:13px;line-height:1.6;">If the button does not work, copy this secure address into your browser:<br><a href="${safeUrl}" style="color:#096caa;word-break:break-all;">${safeUrl}</a></p>
            <p style="margin:0;color:#536579;font-size:13px;line-height:1.6;">${safeSupport}</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

export function buildStaffInvitationEmailContent({
  invitationUrl,
  roleName,
}: {
  invitationUrl: string;
  roleName: string;
}): EmailContent {
  const safeRole = escapeHtml(roleName);
  const invitation = new URL(invitationUrl);
  const portalUrl = new URL("/admin", invitation.origin).toString();
  const guideUrl = new URL("/admin/internal-test-guide", invitation.origin).toString();
  const body = [
    `<p style="margin:0 0 16px;line-height:1.7;">You have been authorized as a DEC <strong>${safeRole}</strong> for the controlled CSO Learning Hub internal rehearsal.</p>`,
    '<p style="margin:0 0 16px;line-height:1.7;">Use the secure one-time link below to confirm your email and create your own password. The link expires in 48 hours. No temporary password will be sent.</p>',
    `<p style="margin:0 0 16px;line-height:1.7;">After setup, use the private <a href="${escapeHtml(portalUrl)}">DEC Administrator Portal</a>. The <a href="${escapeHtml(guideUrl)}">Internal Rehearsal Guide</a> explains the administrator checklist, learner test, issue log, and cleanup boundary.</p>`,
    '<p style="margin:0 0 16px;line-height:1.7;">You do not need Vercel, GitHub, or Supabase access. Use a second email you personally control for the fictional learner, prefix fictional organizations with “DEC Internal Test”, and do not invite real participants.</p>',
    '<p style="margin:0 0 16px;line-height:1.7;"><strong>Do not forward this message or share your credentials.</strong> The invitation is intended only for your email address.</p>',
  ].join("");

  return {
    html: brandedHtml({
      actionLabel: "Complete administrator registration",
      actionUrl: invitationUrl,
      body,
      greeting: "Hello,",
      preheader: "Complete your CSO Learning Hub administrator registration.",
    }),
    subject: "Your CSO Learning Hub administrator invitation",
    text: [
      "Hello,",
      "",
      `You have been invited to join the CSO Learning Hub as ${roleName}.`,
      "You have been authorized for the controlled DEC internal rehearsal.",
      "Use this secure one-time link to confirm your email and create your own password:",
      invitationUrl,
      "",
      `Private Administrator Portal: ${portalUrl}`,
      `Administrator Guide and internal testing checklist: ${guideUrl}`,
      "",
      "Use a second email you personally control for the fictional learner.",
      "Prefix fictional organizations with “DEC Internal Test”. Do not invite real participants.",
      "No Vercel, GitHub, or Supabase access is required.",
      "The link expires in 48 hours. Do not forward this message or share your credentials.",
      supportText(),
    ].join("\n"),
  };
}

export function buildCourseInvitationEmailContent({
  courseTitle,
  expiresAt,
  invitationUrl,
  learnerName,
  organizationName,
  versionLabel,
}: {
  courseTitle: string;
  expiresAt: Date;
  invitationUrl: string;
  learnerName: string;
  organizationName: string;
  versionLabel: string;
}): EmailContent {
  const safeCourse = escapeHtml(courseTitle);
  const safeOrganization = escapeHtml(organizationName);
  const expiry = new Intl.DateTimeFormat("en", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Africa/Addis_Ababa",
  }).format(expiresAt);
  const body = [
    `<p style="margin:0 0 16px;line-height:1.7;">DEC has prepared individual access for you to <strong>${safeCourse}</strong> (${escapeHtml(versionLabel)}) through ${safeOrganization}.</p>`,
    `<p style="margin:0 0 16px;line-height:1.7;">Use the secure one-time link below to register or sign in with the email address that received this message. The invitation expires on <strong>${escapeHtml(expiry)} (EAT)</strong>.</p>`,
    '<p style="margin:0 0 16px;line-height:1.7;"><strong>Do not forward or share this link.</strong> Course access is assigned only after you sign in and explicitly accept the invitation.</p>',
  ].join("");

  return {
    html: brandedHtml({
      actionLabel: "Accept course invitation",
      actionUrl: invitationUrl,
      body,
      greeting: `Hello ${learnerName.trim() || "learner"},`,
      preheader: `Your invitation to ${courseTitle}.`,
    }),
    subject: `Your CSO Learning Hub course invitation: ${courseTitle}`,
    text: [
      `Hello ${learnerName.trim() || "learner"},`,
      "",
      `DEC has prepared individual access for you to ${courseTitle} (${versionLabel}) through ${organizationName}.`,
      "Register or sign in with the email address that received this message:",
      invitationUrl,
      "",
      `This one-time invitation expires on ${expiry} (EAT). Do not forward or share it.`,
      supportText(),
    ].join("\n"),
  };
}

async function sendTransactionalEmail({
  content,
  email,
  purpose,
  transport,
}: {
  content: EmailContent;
  email: string;
  purpose: "course-invitation" | "staff-invitation";
  transport?: EmailTransport;
}): Promise<TransactionalEmailResult> {
  if (!isTransactionalEmailConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.info(
        `[cso-learning-hub] ${purpose} email unavailable; secure recipient and invitation URL were not logged.`,
      );
    }
    return {
      delivered: false,
      message:
        "Email delivery is not configured. Use the approved manual secure-delivery process.",
      reason: "missing-config",
    };
  }

  try {
    const transporter = transport ?? getSmtpTransporter();
    await transporter.sendMail({
      from: getRequiredEnv("EMAIL_FROM"),
      html: content.html,
      replyTo: readEnv("EMAIL_REPLY_TO") || undefined,
      subject: content.subject,
      text: content.text,
      to: email,
    });
    return { delivered: true };
  } catch {
    console.error(
      `[cso-learning-hub] ${purpose} email was rejected by the configured provider; recipient, secure URL, credentials, and provider response were not logged.`,
    );
    return {
      delivered: false,
      message:
        "The configured email provider did not accept this message. No delivery was recorded.",
      reason: "send-failed",
    };
  }
}

export function sendStaffInvitationEmail({
  email,
  invitationUrl,
  roleName,
  transport,
}: {
  email: string;
  invitationUrl: string;
  roleName: string;
  transport?: EmailTransport;
}): Promise<TransactionalEmailResult> {
  return sendTransactionalEmail({
    content: buildStaffInvitationEmailContent({ invitationUrl, roleName }),
    email,
    purpose: "staff-invitation",
    transport,
  });
}

export function sendCourseInvitationEmail({
  courseTitle,
  email,
  expiresAt,
  invitationUrl,
  learnerName,
  organizationName,
  transport,
  versionLabel,
}: {
  courseTitle: string;
  email: string;
  expiresAt: Date;
  invitationUrl: string;
  learnerName: string;
  organizationName: string;
  transport?: EmailTransport;
  versionLabel: string;
}): Promise<TransactionalEmailResult> {
  return sendTransactionalEmail({
    content: buildCourseInvitationEmailContent({
      courseTitle,
      expiresAt,
      invitationUrl,
      learnerName,
      organizationName,
      versionLabel,
    }),
    email,
    purpose: "course-invitation",
    transport,
  });
}
