import { TrustPage } from "@/components/public/TrustPage";

export default function PrivacyPage() {
  return (
    <TrustPage
      badge="Privacy"
      title="Privacy for learner data"
      description="The pilot uses learner data to provide course access, progress tracking, certificates, support, and aggregate course improvement."
      sections={[
        {
          title: "What data supports",
          body: "Registration, course progress, final assessment status, certificate records, feedback summaries, and support requests are used to operate the learning journey and improve course quality.",
        },
        {
          title: "Aggregate monitoring only",
          body: "Pilot monitoring focuses on aggregate patterns such as registrations, enrollments, starts, completions, pass rates, certificates, and feedback themes. It is not an individual learner judgment tool.",
        },
        {
          title: "Public certificate verification",
          body: "Public verification does not show learner email, assessment answers, private progress details, portfolio content, internal IDs, or private organization details.",
        },
        {
          title: "No donor access to raw records",
          body: "The pilot does not provide donors with raw learner records, private feedback text, assessment answers, portfolio outputs, or organization weaknesses.",
        },
      ]}
    />
  );
}
