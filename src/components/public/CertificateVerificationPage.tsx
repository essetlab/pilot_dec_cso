import { ActionButton, StatusBadge } from "@/components/ui";
import type { PublicCertificateVerificationData } from "@/lib/certificate-workflow";

type CertificateVerificationPageProps = {
  certificate: PublicCertificateVerificationData | null;
  code: string;
  hasSubmittedCode: boolean;
};

const statusTone = {
  Expired: "orange",
  Inactive: "gray",
  Issued: "green",
  Revoked: "red",
} as const;

function VerificationForm({ code }: { code: string }) {
  return (
    <form
      action="/verify-certificate"
      className="grid gap-4 rounded-[24px] border border-design-border bg-white-surface p-5 shadow-soft sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"
    >
      <label className="block">
        <span className="text-sm font-semibold text-dark-ink">
          Certificate code
        </span>
        <input
          className="mt-2 min-h-12 w-full rounded-control border border-design-border bg-soft-bg px-4 text-sm font-medium text-dark-ink outline-none transition placeholder:text-muted-text focus:border-dec-blue focus:ring-4 focus:ring-dec-blue/20"
          defaultValue={code}
          name="code"
          placeholder="Enter certificate code"
          type="text"
        />
      </label>
      <ActionButton className="min-h-12" type="submit">
        Verify Certificate
      </ActionButton>
    </form>
  );
}

function InitialState() {
  return (
    <article className="rounded-[24px] border border-dec-blue/20 bg-dec-blue/10 p-6 shadow-soft">
      <StatusBadge label="Ready to verify" tone="blue" />
      <h2 className="mt-4 text-2xl font-semibold leading-tight text-deep-navy">
        Check an issued certificate.
      </h2>
      <p className="mt-3 text-sm leading-7 text-[#26536c]">
        Enter the certificate code exactly as shown on the certificate. The
        result shows only safe public certificate details.
      </p>
    </article>
  );
}

function NotFoundState({ code }: { code: string }) {
  return (
    <article className="rounded-[24px] border border-red-200 bg-red-50 p-6 shadow-soft">
      <StatusBadge label="Not found" tone="red" />
      <h2 className="mt-4 text-2xl font-semibold leading-tight text-red-950">
        No matching certificate was found.
      </h2>
      <p className="mt-3 text-sm leading-7 text-red-900">
        We could not verify a certificate with code{" "}
        <span className="font-semibold">{code}</span>. Check the code and try
        again.
      </p>
    </article>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-design-border bg-soft-bg p-4">
      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-text">
        {label}
      </dt>
      <dd className="mt-2 text-base font-semibold leading-6 text-dark-ink">
        {value}
      </dd>
    </div>
  );
}

function VerifiedState({
  certificate,
}: {
  certificate: PublicCertificateVerificationData;
}) {
  const isIssued = certificate.status === "Issued";

  return (
    <article className="overflow-hidden rounded-[28px] border border-design-border bg-white-surface shadow-card">
      <div className={isIssued ? "bg-dec-green/15 p-6" : "bg-amber-50 p-6"}>
        <StatusBadge
          label={certificate.status}
          tone={statusTone[certificate.status]}
        />
        <h2 className="mt-4 text-3xl font-semibold leading-tight text-dark-ink">
          {isIssued
            ? "Certificate verified"
            : "Certificate record found, but not active"}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-text">
          This public result confirms the certificate record without exposing
          learner email, assessment answers, private progress details, portfolio
          content, internal IDs, or private organization details.
        </p>
      </div>

      <dl className="grid gap-4 p-6 sm:grid-cols-2">
        <DetailRow label="Certificate status" value={certificate.status} />
        <DetailRow label="Name on certificate" value={certificate.participantName} />
        <DetailRow label="Course title" value={certificate.courseTitle} />
        <DetailRow label="Issue date" value={certificate.issuedAt} />
        <DetailRow label="Certificate code" value={certificate.certificateCode} />
        <DetailRow label="Issuing platform" value={certificate.issuerName} />
      </dl>
    </article>
  );
}

export function CertificateVerificationPage({
  certificate,
  code,
  hasSubmittedCode,
}: CertificateVerificationPageProps) {
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[28px] bg-deep-navy p-6 text-white shadow-hero lg:p-8">
        <StatusBadge label="Public verification" tone="blue" />
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
          Verify Certificate
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-white/75">
          Confirm whether a CSO Learning Hub certificate code belongs to an
          issued certificate record.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="space-y-6">
          <VerificationForm code={code} />
          {certificate ? (
            <VerifiedState certificate={certificate} />
          ) : hasSubmittedCode ? (
            <NotFoundState code={code} />
          ) : (
            <InitialState />
          )}
        </div>

        <aside className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
          <h2 className="text-xl font-semibold text-dark-ink">
            Public information only
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-text">
            Verification results are limited to certificate status, recipient
            display name, course title, issue date, certificate code, and issuing
            platform.
          </p>
          <p className="mt-3 text-sm leading-7 text-muted-text">
            Verification does not show learner email, assessment answers,
            private progress details, portfolio content, internal IDs, or
            private organization details.
          </p>
          <p className="mt-3 text-sm leading-7 text-muted-text">
            A certificate confirms completion and final assessment performance.
            It does not replace organizational due diligence, safeguarding
            review, legal compliance checks, or partnership assessment.
          </p>
        </aside>
      </section>
    </div>
  );
}
