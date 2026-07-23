import { ActionButton, StatusBadge } from "@/components/ui";

const administratorSteps = [
  "Create one fictional organization whose name begins with “DEC Internal Test”.",
  "Add one fictional learner using a second email address you personally control.",
  "Assign only the approved HRBA course to that individual learner.",
  "Create the invitation, deliver it only to your test-learner address, and confirm the delivery status.",
  "Monitor invitation activation, course progress, completion, certificate status, and the relevant audit history.",
] as const;

const learnerSteps = [
  "Open the invitation in the mailbox for your second test identity.",
  "Register or sign in using exactly the invited email address and explicitly accept the invitation.",
  "Open HRBA, save progress, sign out, sign in again, and confirm progress resumes correctly.",
  "Complete the course and Final Assessment, then confirm the Hub shows completion and a downloadable certificate.",
  "Do not enter real participant, organization, programme, safeguarding, or personal data.",
] as const;

const issueFields = [
  "Tester name and date/time (EAT)",
  "Administrator or learner journey",
  "Page or action being tested",
  "Expected result and actual result",
  "Exact steps to reproduce",
  "Screenshot with passwords, invitation tokens, and personal data removed",
  "Severity: blocks testing / major / minor / suggestion",
] as const;

function NumberedList({ items }: { items: readonly string[] }) {
  return (
    <ol className="mt-5 space-y-3">
      {items.map((item, index) => (
        <li
          className="flex gap-3 rounded-[16px] border border-design-border bg-white p-4 text-sm leading-6 text-muted-text"
          key={item}
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-dec-blue/10 text-xs font-bold text-[#216f9d]">
            {index + 1}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

export function AdminInternalTestGuide() {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-design-border bg-deep-navy p-6 text-white shadow-hero lg:p-8">
        <StatusBadge label="Controlled internal rehearsal" tone="blue" />
        <h1 className="mt-5 text-4xl font-semibold leading-tight">
          DEC Internal Platform Rehearsal
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-white/80">
          This guide is for authorized DEC Platform Administrators testing pilot
          operations with fictional data before any real CSO participant is invited.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <ActionButton href="/admin/course-invitations" size="lg">
            Manage invitations
          </ActionButton>
          <ActionButton
            className="bg-white text-deep-navy"
            href="/admin"
            size="lg"
            variant="secondary"
          >
            Return to dashboard
          </ActionButton>
        </div>
      </section>

      <section className="rounded-[24px] border border-amber-300 bg-amber-50 p-6">
        <h2 className="text-2xl font-semibold text-dark-ink">Testing boundaries</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-text">
          <li>Use your authorized administrator email only for administrator access.</li>
          <li>Use a separate email you personally control for the fictional learner.</li>
          <li>Prefix every fictional organization with “DEC Internal Test”.</li>
          <li>Do not invite real CSOs or participants until DEC gives formal authorization.</li>
          <li>Never share passwords, secure invitation links, or account credentials.</li>
          <li>No Vercel, GitHub, or Supabase access is needed for this rehearsal.</li>
        </ul>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
          <StatusBadge label="Administrator journey" tone="blue" />
          <h2 className="mt-4 text-2xl font-semibold text-dark-ink">
            Create and monitor controlled access
          </h2>
          <NumberedList items={administratorSteps} />
        </article>
        <article className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft">
          <StatusBadge label="Learner journey" tone="green" />
          <h2 className="mt-4 text-2xl font-semibold text-dark-ink">
            Activate, learn, resume, and complete
          </h2>
          <NumberedList items={learnerSteps} />
        </article>
      </section>

      <section
        className="rounded-[24px] border border-design-border bg-white-surface p-6 shadow-soft"
        id="issue-log"
      >
        <StatusBadge label="Issue reporting" tone="orange" />
        <h2 className="mt-4 text-2xl font-semibold text-dark-ink">
          Record one issue per entry
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-text">
          Copy the fields below into the approved DEC issue log. Remove passwords,
          invitation tokens, personal data, and full secure links from all evidence.
        </p>
        <ul className="mt-5 grid gap-3 md:grid-cols-2">
          {issueFields.map((field) => (
            <li
              className="rounded-[16px] border border-design-border bg-soft-bg p-4 text-sm text-muted-text"
              key={field}
            >
              {field}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-[24px] border border-dec-green/30 bg-dec-green/10 p-6">
        <h2 className="text-2xl font-semibold text-deep-navy">End of rehearsal</h2>
        <p className="mt-3 text-sm leading-7 text-muted-text">
          Tell the pilot support contact when your tests are complete. The cleanup
          will remove only fictional rehearsal organizations, learners, invitations,
          assignments, enrollments, progress, attempts, certificates, and launch
          tokens. Named administrator accounts, administrator audit records, and
          approved issues or feedback will be retained.
        </p>
      </section>
    </div>
  );
}
