import { ActionButton, EmptyState, MetricCard, StatusBadge } from "@/components/ui";
import type {
  AdminCertificateDetailData,
  AdminCertificateListData,
  AdminCertificateRow,
} from "@/lib/certificate-workflow";
import type { ReactNode } from "react";

function Panel({
  children,
  description,
  title,
}: {
  children: ReactNode;
  description?: string;
  title: string;
}) {
  return (
    <section className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-semibold leading-tight text-dark-ink">{title}</h2>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-muted-text">{description}</p>
        ) : null}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function CertificatesHeader({ issued }: { issued: number }) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-design-border bg-deep-navy p-6 text-white shadow-hero lg:p-8">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge label="Certificate records" tone="blue" />
            <StatusBadge label="Admin workspace" tone="green" />
          </div>
          <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
            Certificates
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/75">
            Review issued certificate records, learner identity, course snapshots,
            completion date, and final test context.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ActionButton href="/admin/courses" size="lg">
              View Courses
            </ActionButton>
            <ActionButton
              className="bg-white text-deep-navy hover:text-dec-blue"
              href="/admin"
              size="lg"
              variant="secondary"
            >
              <span className="text-deep-navy">Back to Dashboard</span>
            </ActionButton>
          </div>
        </div>

        <article className="rounded-[24px] border border-white/15 bg-white/10 p-5">
          <p className="text-sm font-semibold text-dec-green">Certificate context</p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight">
            {issued} issued certificate{issued === 1 ? "" : "s"}
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Certificate records are created only when the learner has met course
            completion and final test pass requirements.
          </p>
        </article>
      </div>
    </section>
  );
}

function CertificateMetricGrid({ data }: { data: AdminCertificateListData }) {
  return (
    <section aria-labelledby="certificate-summary-heading" className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold leading-tight text-dark-ink" id="certificate-summary-heading">
          Certificate summary
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-text">
          A concise view of issued records and eligible completion states.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          helperText="Certificate records already issued."
          label="Issued"
          tone="green"
          value={data.metrics.issued}
        />
        <MetricCard
          helperText="Completed eligible enrollments."
          label="Eligible"
          tone="blue"
          value={data.metrics.eligible}
        />
        <MetricCard
          helperText="Eligible enrollments still in progress."
          label="Pending completion"
          tone="orange"
          value={data.metrics.pendingCompletion}
        />
        <MetricCard
          helperText="Required final test threshold."
          label="Required pass score"
          tone="gray"
          value={data.metrics.requiredPassScore}
        />
      </div>
    </section>
  );
}

function CertificateTable({ certificates }: { certificates: AdminCertificateRow[] }) {
  return (
    <Panel
      description="Review certificate ID, participant, course, organization, status, and issue date."
      title="Certificate list"
    >
      {certificates.length === 0 ? (
        <EmptyState
          description="Issued certificates will appear here after learners complete eligible courses and pass the final test."
          title="No certificate records yet"
        />
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-[20px] border border-design-border lg:block">
            <table className="w-full min-w-[980px] border-collapse bg-white text-left text-sm">
              <thead className="bg-soft-bg text-xs font-semibold uppercase tracking-[0.12em] text-muted-text">
                <tr>
                  <th className="px-4 py-4">Certificate ID</th>
                  <th className="px-4 py-4">Participant</th>
                  <th className="px-4 py-4">Course</th>
                  <th className="px-4 py-4">Organization</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Issue date</th>
                  <th className="px-4 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-design-border">
                {certificates.map((certificate) => (
                  <tr className="align-top" key={certificate.certificateCode}>
                    <td className="px-4 py-4 font-semibold text-dark-ink">{certificate.certificateCode}</td>
                    <td className="px-4 py-4 text-muted-text">{certificate.participant}</td>
                    <td className="px-4 py-4 text-muted-text">{certificate.courseTitle}</td>
                    <td className="px-4 py-4 text-muted-text">{certificate.organization}</td>
                    <td className="px-4 py-4">
                      <StatusBadge label={certificate.status} tone="green" />
                    </td>
                    <td className="px-4 py-4 text-muted-text">{certificate.issuedAt}</td>
                    <td className="px-4 py-4">
                      <ActionButton href={certificate.href} size="sm" variant="secondary">
                        View
                      </ActionButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 grid gap-4 lg:hidden">
            {certificates.map((certificate) => (
              <article className="rounded-[20px] border border-design-border bg-soft-bg p-4" key={certificate.certificateCode}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-base font-semibold leading-6 text-dark-ink">
                      {certificate.certificateCode}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-muted-text">
                      {certificate.participant}
                    </p>
                  </div>
                  <StatusBadge label={certificate.status} tone="green" />
                </div>
                <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    ["Course", certificate.courseTitle],
                    ["Organization", certificate.organization],
                    ["Issue date", certificate.issuedAt],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-text">
                        {label}
                      </dt>
                      <dd className="mt-1 text-sm font-semibold leading-6 text-dark-ink">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-4">
                  <ActionButton className="w-full" href={certificate.href} variant="secondary">
                    View
                  </ActionButton>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </Panel>
  );
}

function CertificateRuleNote({ requiredPassScore }: { requiredPassScore: string }) {
  return (
    <aside className="rounded-[24px] border border-dec-green/30 bg-dec-green/15 p-6 shadow-soft">
      <StatusBadge label="Certificate rule" tone="green" />
      <p className="mt-4 text-sm leading-7 text-[#426f1c]">
        Certificates are connected to course completion and reaching{" "}
        {requiredPassScore} or above on the final test before the record is issued.
      </p>
    </aside>
  );
}

export function AdminCertificates({ data }: { data: AdminCertificateListData }) {
  return (
    <div className="space-y-6">
      <CertificatesHeader issued={data.metrics.issued} />
      <CertificateMetricGrid data={data} />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <div className="space-y-6">
          <CertificateTable certificates={data.certificates} />
        </div>

        <aside className="space-y-6">
          <CertificateRuleNote requiredPassScore={data.metrics.requiredPassScore} />
        </aside>
      </section>
    </div>
  );
}

export function AdminCertificateDetail({
  certificate,
}: {
  certificate: AdminCertificateDetailData;
}) {
  const detailItems = [
    ["Certificate ID", certificate.certificateCode],
    ["Participant", certificate.participant],
    ["Course", certificate.courseTitle],
    ["Organization", certificate.organization],
    ["Status", certificate.status],
    ["Issue date", certificate.issuedAt],
    ["Completion date", certificate.completionDate ?? "Not available"],
    ["Issuer", certificate.issuerName],
    ["Final test score", certificate.quizScore],
    ["Final test percentage", certificate.quizPercentage],
    ["Required pass score", certificate.passThresholdLabel],
  ];

  return (
    <div className="space-y-6">
      <CertificatesHeader issued={1} />
      <Panel
        description="Certificate record details are stored from the issued certificate snapshot."
        title="Certificate detail"
      >
        <dl className="grid gap-4 md:grid-cols-2">
          {detailItems.map(([label, value]) => (
            <div className="rounded-[18px] bg-soft-bg p-4" key={label}>
              <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-text">
                {label}
              </dt>
              <dd className="mt-2 text-sm font-semibold leading-6 text-dark-ink">
                {value}
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <ActionButton href="/admin/certificates" variant="secondary">
            Back to Certificates
          </ActionButton>
          <ActionButton href="/admin/monitoring" variant="ghost">
            View Monitoring
          </ActionButton>
        </div>
      </Panel>
    </div>
  );
}
