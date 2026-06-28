"use client";

import type { ReactNode } from "react";
import { ActionButton, EmptyState, MetricCard, SectionHeader, StatusBadge } from "@/components/ui";
import type {
  LearnerCertificateDetailData,
  LearnerCertificateListData,
  LearnerCertificateSummary,
} from "@/lib/certificate-workflow";

function CertificateHeaderCard() {
  return (
    <section className="overflow-hidden rounded-[28px] bg-deep-navy p-6 text-white shadow-hero lg:p-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-center">
        <div>
          <StatusBadge label="Certificates" tone="gold" />
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            Certificates
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/75">
            View certificates you have earned after completing eligible courses
            and passing the final test.
          </p>
        </div>
        <div className="rounded-[24px] border border-white/15 bg-white/10 p-5">
          <p className="text-sm font-semibold text-dec-green">Certificate rule</p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight">
            Completion and pass score required.
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Certificates remain locked until course completion and the required
            final test threshold are met.
          </p>
        </div>
      </div>
    </section>
  );
}

function HowCertificatesWorkCard({
  requiredPassScore,
}: {
  requiredPassScore: string;
}) {
  const steps = [
    "Complete the course lessons.",
    "Take the final test.",
    `Reach the required pass score of ${requiredPassScore}.`,
    "Return here to view your certificate when it becomes available.",
  ];

  return (
    <article className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
      <SectionHeader
        description="A simple view of the steps that lead to an earned certificate."
        title="How certificates work"
      />
      <ol className="mt-6 space-y-4">
        {steps.map((step, index) => (
          <li className="flex gap-4" key={step}>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-control bg-dec-green/15 text-sm font-semibold text-[#426f1c]">
              {index + 1}
            </span>
            <span className="pt-1 text-sm leading-6 text-muted-text">{step}</span>
          </li>
        ))}
      </ol>
    </article>
  );
}

function EarnedCertificateCard({
  certificate,
}: {
  certificate: LearnerCertificateSummary;
}) {
  return (
    <article className="rounded-[24px] border border-dec-green/20 bg-white-surface p-6 shadow-soft">
      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-center">
        <div className="relative overflow-hidden rounded-[24px] border border-dec-green/25 bg-dec-green/10 p-5">
          <div className="rounded-[20px] border border-dec-green/25 bg-white p-6 text-center shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-dec-green">
              Certificate of Completion
            </p>
            <div className="mx-auto mt-5 flex size-16 items-center justify-center rounded-full border border-dec-green/25 bg-dec-green/10 text-2xl font-semibold text-dec-green">
              OK
            </div>
            <h3 className="mt-5 text-xl font-semibold leading-tight text-deep-navy">
              Issued
            </h3>
          </div>
        </div>
        <div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge label="Issued" tone="green" />
            <StatusBadge label={certificate.issuedAt} tone="gray" />
          </div>
          <h2 className="mt-4 text-2xl font-semibold leading-tight text-dark-ink">
            {certificate.courseTitle}
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted-text">
            Certificate ID: {certificate.certificateCode}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ActionButton href={certificate.certificateHref}>View Certificate</ActionButton>
            <ActionButton href={certificate.courseHref} variant="secondary">
              Review Course
            </ActionButton>
          </div>
        </div>
      </div>
    </article>
  );
}

function DetailPanel({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <article className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
      <h2 className="text-xl font-semibold text-dark-ink">{title}</h2>
      <div className="mt-4 text-sm leading-7 text-muted-text">{children}</div>
    </article>
  );
}

function EarnedCertificatePreview({
  certificate,
}: {
  certificate: LearnerCertificateDetailData;
}) {
  return (
    <section
      className="overflow-hidden rounded-[28px] border border-dec-green/20 bg-dec-green/5 p-4 shadow-card sm:p-6"
      id="certificate-print-area"
    >
      <div className="relative rounded-[24px] border border-dec-green/20 bg-white p-8 text-center">
        <div className="pointer-events-none absolute inset-4 rounded-[18px] border border-dashed border-dec-green/30" />
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-dec-green">
          Certificate of Completion
        </p>
        <h1 className="mx-auto mt-8 max-w-2xl text-3xl font-bold leading-tight text-deep-navy sm:text-4xl">
          {certificate.courseTitle}
        </h1>
        <div className="mx-auto mt-8 h-px max-w-md bg-dec-green/20" />
        <p className="mt-8 text-sm font-medium text-muted-text">
          This is proudly presented to
        </p>
        <p className="mt-2 text-3xl font-bold italic text-dark-ink">
          {certificate.participantName}
        </p>
        <p className="mt-8 text-sm leading-6 text-muted-text">
          For successfully completing all requirements for the course.
        </p>
        <div className="mx-auto mt-12 grid max-w-2xl gap-4 border-t pt-6 text-left text-xs sm:grid-cols-3">
          <div>
            <p className="font-semibold text-dark-ink">{certificate.issuerName}</p>
            <p className="text-muted-text">Issuer</p>
          </div>
          <div className="sm:text-center">
            <p className="font-semibold text-dark-ink">{certificate.certificateCode}</p>
            <p className="text-muted-text">Certificate ID</p>
          </div>
          <div className="sm:text-right">
            <p className="font-semibold text-dark-ink">
              {certificate.completionDate ?? certificate.issuedAt}
            </p>
            <p className="text-muted-text">Completion date</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function LockedCertificatePreview({
  certificate,
}: {
  certificate: LearnerCertificateDetailData;
}) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-amber-200 bg-amber-50 p-4 shadow-card sm:p-6">
      <div className="rounded-[24px] border border-amber-200 bg-white p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
          Certificate of Completion
        </p>
        <h1 className="mx-auto mt-8 max-w-2xl text-3xl font-semibold leading-tight text-deep-navy sm:text-4xl">
          {certificate.courseTitle}
        </h1>
        <div className="mx-auto mt-8 h-px max-w-md bg-amber-200" />
        <p className="mt-8 text-sm font-medium text-muted-text">Participant name</p>
        <p className="mt-2 text-2xl font-semibold text-dark-ink">
          {certificate.participantName}
        </p>
        <div className="mt-8 inline-flex rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
          Locked
        </div>
      </div>
    </section>
  );
}

export function LearnerCertificates({
  data,
}: {
  data: LearnerCertificateListData;
}) {
  return (
    <div className="space-y-8">
      <CertificateHeaderCard />

      <section aria-label="Certificate status summary" className="space-y-5">
        <SectionHeader
          description="A quick view of certificate progress across your learning."
          title="Certificate summary"
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            helperText="Certificates issued to you."
            label="Certificates earned"
            tone="orange"
            value={data.metrics.earned}
          />
          <MetricCard
            helperText="Published eligible courses."
            label="Courses eligible"
            tone="green"
            value={data.metrics.eligible}
          />
          <MetricCard
            helperText="Your active enrollments."
            label="Courses in progress"
            tone="blue"
            value={data.metrics.inProgress}
          />
          <MetricCard
            helperText="Required for eligible final tests."
            label="Required pass score"
            tone="gray"
            value={data.metrics.requiredPassScore}
          />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <SectionHeader
            description="Earned certificates appear as issued records. Locked certificates remain available from the related course detail."
            title="Earned certificates"
          />
          {data.certificates.length > 0 ? (
            data.certificates.map((certificate) => (
              <EarnedCertificateCard
                certificate={certificate}
                key={certificate.certificateCode}
              />
            ))
          ) : (
            <EmptyState
              action={<ActionButton href="/learn/my-courses">Continue Learning</ActionButton>}
              description="Complete eligible courses and pass the final test to unlock certificates."
              title="No certificates earned yet"
            />
          )}
        </div>
        <HowCertificatesWorkCard requiredPassScore={data.metrics.requiredPassScore} />
      </section>
    </div>
  );
}

export function LearnerCertificateDetail({
  certificate,
}: {
  certificate: LearnerCertificateDetailData;
}) {
  const isIssued = certificate.status === "Issued";

  return (
    <div className="space-y-8">
      <section className="rounded-[28px] bg-deep-navy p-6 text-white shadow-hero lg:p-8">
        <StatusBadge
          label={isIssued ? "Certificate earned" : "Certificate locked"}
          tone={isIssued ? "green" : "gold"}
        />
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
          {isIssued ? "Your Certificate is Ready" : "Certificate not yet available"}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-white/75">
          {isIssued
            ? "You successfully completed the course requirements and earned your certificate."
            : "Complete the course requirements to unlock this certificate."}
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        {isIssued ? (
          <EarnedCertificatePreview certificate={certificate} />
        ) : (
          <LockedCertificatePreview certificate={certificate} />
        )}

        <aside className="space-y-5">
          <DetailPanel title="Certificate details">
            <p className="font-medium text-dark-ink">Status: {certificate.status}</p>
            <p className="mt-2 text-xs">Recipient: {certificate.participantName}</p>
            <p className="mt-1 text-xs">Course: {certificate.courseTitle}</p>
            <p className="mt-1 text-xs">Issuer: {certificate.issuerName}</p>
            <p className="mt-1 text-xs">
              Certificate ID: {certificate.certificateCode ?? "Not issued yet"}
            </p>
            <p className="mt-1 text-xs">
              Required pass score: {certificate.passThresholdLabel}
            </p>
          </DetailPanel>
          <div className="rounded-[24px] border border-dec-blue/20 bg-dec-blue/10 p-6">
            <h2 className="text-xl font-semibold text-deep-navy">Actions</h2>
            <div className="mt-5 flex flex-col gap-3">
              {isIssued ? (
                <ActionButton onClick={() => window.print()}>
                  Print / Download Certificate
                </ActionButton>
              ) : (
                <ActionButton href={certificate.finalTestHref}>
                  View Final Test
                </ActionButton>
              )}
              <ActionButton href="/learn/certificates" variant="secondary">
                Back to Certificates
              </ActionButton>
              <ActionButton href={certificate.courseHref} variant="secondary">
                Review Course
              </ActionButton>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
