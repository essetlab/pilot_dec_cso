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
    <section className="relative overflow-hidden rounded-[24px] bg-deep-navy p-6 text-white shadow-hero lg:p-8">
      <div aria-hidden="true" className="absolute -right-16 -top-16 h-64 w-64 rounded-full border-[24px] border-dec-blue/10" />
      <div aria-hidden="true" className="absolute -left-10 bottom-10 h-48 w-48 rounded-full border-[16px] border-dec-green/5" />

      <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-center relative z-10">
        <div>
          <StatusBadge label="Certificates" tone="gold" />
          <h1 className="mt-5 font-display text-3xl font-bold leading-tight sm:text-4xl">
            Certificates
          </h1>
          <p className="mt-3 text-sm leading-normal text-slate-300 max-w-2xl">
            View certificates you have earned after completing eligible courses and passing the final test.
          </p>
        </div>
        <div className="rounded-card border border-white/15 bg-white/5 p-5 backdrop-blur">
          <p className="text-xs font-semibold text-dec-green">Certificate rule</p>
          <h2 className="mt-2.5 text-lg font-bold leading-tight">
            Completion & 80% pass score
          </h2>
          <p className="mt-2 text-xs leading-normal text-slate-300">
            Certificate available after completing all lessons and scoring 80% or above on the final assessment.
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
    <article className="rounded-card border border-design-border bg-white p-6 shadow-soft">
      <SectionHeader
        description="A simple view of the steps that lead to an earned certificate."
        title="How certificates work"
      />
      <ol className="mt-6 space-y-4">
        {steps.map((step, index) => (
          <li className="flex gap-4" key={step}>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-control bg-dec-green/10 text-xs font-bold text-[#426f1c]">
              {index + 1}
            </span>
            <span className="pt-0.5 text-xs leading-relaxed text-muted-text">{step}</span>
          </li>
        ))}
      </ol>
      <p className="mt-6 rounded-control border border-design-border bg-light-bg/50 p-4 text-3xs leading-normal text-muted-text">
        This certificate confirms that the named learner completed the course requirements and passed the final assessment. It does not replace organizational due diligence, safeguarding review, legal compliance checks, or partnership assessment.
      </p>
    </article>
  );
}

function EarnedCertificateCard({
  certificate,
}: {
  certificate: LearnerCertificateSummary;
}) {
  return (
    <article className="rounded-card border border-dec-green/20 bg-white p-6 shadow-soft hover:shadow-card transition">
      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:items-center">
        <div className="relative overflow-hidden rounded-card border border-dec-green/15 bg-dec-green/5 p-4">
          <div className="rounded-control border border-dec-green/10 bg-white p-5 text-center shadow-soft">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-dec-green">
              Certificate of Completion
            </p>
            <div className="mx-auto mt-4 flex size-12 items-center justify-center rounded-full border border-dec-green/20 bg-dec-green/10 text-xl font-bold text-dec-green" aria-hidden="true">
              ✓
            </div>
            <h3 className="mt-4 text-base font-bold leading-tight text-deep-navy">
              Issued
            </h3>
          </div>
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap gap-1.5">
            <StatusBadge label="Issued" tone="green" />
            <StatusBadge label={certificate.issuedAt} tone="gray" />
          </div>
          <h2 className="mt-4 text-xl font-bold leading-snug text-deep-navy">
            {certificate.courseTitle}
          </h2>
          <p className="mt-2 text-xs text-muted-text">
            Certificate ID: <code className="font-mono bg-light-bg px-1.5 py-0.5 rounded text-deep-navy font-bold">{certificate.certificateCode}</code>
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <ActionButton href={certificate.certificateHref} size="sm" className="font-bold text-xs">
              View Certificate
            </ActionButton>
            {certificate.verifyHref ? (
              <ActionButton href={certificate.verifyHref} variant="outline" size="sm" className="font-semibold text-xs">
                Verify
              </ActionButton>
            ) : null}
            {certificate.downloadHref ? (
              <ActionButton href={certificate.downloadHref} variant="success" size="sm" className="font-bold text-xs">
                Download PDF
              </ActionButton>
            ) : null}
            <ActionButton href={certificate.courseHref} variant="secondary" size="sm" className="font-semibold text-xs">
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
    <article className="rounded-card border border-design-border bg-white p-6 shadow-soft">
      <h2 className="text-sm font-bold uppercase tracking-wider text-deep-navy">{title}</h2>
      <div className="mt-4 text-xs leading-normal text-muted-text">{children}</div>
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
      className="overflow-hidden rounded-[24px] border border-dec-green/20 bg-dec-green/5 p-4 shadow-card sm:p-6"
      id="certificate-print-area"
    >
      <div className="relative rounded-card border border-dec-green/10 bg-white p-8 text-center">
        <div className="pointer-events-none absolute inset-4 rounded-control border border-dashed border-dec-green/20" />
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-dec-green">
          Certificate of Completion
        </p>
        <h1 className="mx-auto mt-8 max-w-2xl text-2xl font-bold leading-tight text-deep-navy sm:text-3xl">
          {certificate.courseTitle}
        </h1>
        <div className="mx-auto mt-6 h-px max-w-md bg-dec-green/20" />
        <p className="mt-6 text-xs font-semibold text-muted-text uppercase">
          This is proudly presented to
        </p>
        <p className="mt-2 text-3xl font-extrabold italic text-deep-navy">
          {certificate.participantName}
        </p>
        <p className="mt-6 text-xs leading-relaxed text-muted-text max-w-lg mx-auto">
          This confirms the named learner completed the course requirements and passed the final assessment on the CSO Learning Hub.
        </p>
        <div className="mx-auto mt-12 grid max-w-2xl gap-4 border-t border-design-border pt-6 text-left text-xs sm:grid-cols-3">
          <div>
            <p className="font-bold text-deep-navy">{certificate.issuerName}</p>
            <p className="text-3xs text-muted-text mt-0.5 uppercase font-medium">Issuer</p>
          </div>
          <div className="sm:text-center">
            <p className="font-bold text-deep-navy">{certificate.certificateCode}</p>
            <p className="text-3xs text-muted-text mt-0.5 uppercase font-medium">Certificate ID</p>
          </div>
          <div className="sm:text-right">
            <p className="font-bold text-deep-navy">
              {certificate.completionDate ?? certificate.issuedAt}
            </p>
            <p className="text-3xs text-muted-text mt-0.5 uppercase font-medium">Completion date</p>
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
    <section className="overflow-hidden rounded-[24px] border border-amber-250 bg-amber-50/50 p-4 shadow-card sm:p-6">
      <div className="rounded-card border border-amber-200 bg-white p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
          Certificate of Completion
        </p>
        <h1 className="mx-auto mt-8 max-w-2xl text-2xl font-bold leading-tight text-deep-navy sm:text-3xl">
          {certificate.courseTitle}
        </h1>
        <div className="mx-auto mt-6 h-px max-w-md bg-amber-200" />
        <p className="mt-6 text-xs font-semibold text-muted-text uppercase">Participant name</p>
        <p className="mt-2 text-2xl font-bold text-deep-navy">
          {certificate.participantName}
        </p>
        <div className="mt-8 inline-flex rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-bold text-amber-700">
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

      <section aria-label="Certificate status summary" className="space-y-4">
        <SectionHeader
          description="A quick view of certificate progress across your learning."
          title="Certificate summary"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      <section className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <SectionHeader
            description="Issued certificates include a certificate code, public verification link, and downloadable PDF."
            title="Earned certificates"
          />
          {data.certificates.length > 0 ? (
            <div className="space-y-4">
              {data.certificates.map((certificate) => (
                <EarnedCertificateCard
                  certificate={certificate}
                  key={certificate.certificateCode}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              action={<ActionButton href="/learn/my-courses" size="sm">Continue Learning</ActionButton>}
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
      <section className="relative overflow-hidden rounded-[24px] bg-deep-navy p-6 text-white shadow-hero lg:p-8">
        <div aria-hidden="true" className="absolute -right-16 -top-16 h-64 w-64 rounded-full border-[24px] border-dec-blue/10" />
        <div aria-hidden="true" className="absolute -left-10 bottom-10 h-48 w-48 rounded-full border-[16px] border-dec-green/5" />

        <div className="relative z-10">
          <StatusBadge
            label={isIssued ? "Certificate earned" : "Certificate locked"}
            tone={isIssued ? "green" : "gold"}
          />
          <h1 className="mt-5 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">
            {isIssued ? "Your Certificate is Ready" : "Certificate not yet available"}
          </h1>
          <p className="mt-3 text-sm leading-normal text-slate-300 max-w-2xl">
            {isIssued
              ? "You successfully completed the course requirements and earned your certificate."
              : "Complete the course requirements to unlock this certificate."}
          </p>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
        {isIssued ? (
          <EarnedCertificatePreview certificate={certificate} />
        ) : (
          <LockedCertificatePreview certificate={certificate} />
        )}

        <aside className="space-y-6">
          <DetailPanel title="Certificate details">
            <p className="font-bold text-deep-navy">Status: {certificate.status}</p>
            <p className="mt-2">Recipient: {certificate.participantName}</p>
            <p className="mt-1">Course: {certificate.courseTitle}</p>
            <p className="mt-1">Issuer: {certificate.issuerName}</p>
            <p className="mt-1 font-mono text-3xs uppercase font-semibold">
              ID: {certificate.certificateCode ?? "Not issued yet"}
            </p>
            <p className="mt-1">
              Required pass score: {certificate.passThresholdLabel}
            </p>
          </DetailPanel>
          <div className="rounded-card border border-dec-blue/20 bg-dec-blue/5 p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-deep-navy">Actions</h2>
            <div className="mt-4 flex flex-col gap-2.5">
              {isIssued ? (
                <>
                  {certificate.downloadHref ? (
                    <ActionButton href={certificate.downloadHref} variant="success" size="sm" className="font-bold text-xs w-full text-center justify-center">
                      Download certificate
                    </ActionButton>
                  ) : null}
                  <ActionButton onClick={() => window.print()} variant="secondary" size="sm" className="font-bold text-xs w-full text-center justify-center">
                    Print Preview
                  </ActionButton>
                </>
              ) : (
                <ActionButton href={certificate.finalTestHref} size="sm" className="font-bold text-xs w-full text-center justify-center">
                  View Final Test
                </ActionButton>
              )}
              <ActionButton href="/learn/certificates" variant="secondary" size="sm" className="font-semibold text-xs w-full text-center justify-center">
                Back to Certificates
              </ActionButton>
              <ActionButton href={certificate.courseHref} variant="secondary" size="sm" className="font-semibold text-xs w-full text-center justify-center">
                Review Course
              </ActionButton>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
