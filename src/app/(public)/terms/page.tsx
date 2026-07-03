import { TrustPage } from "@/components/public/TrustPage";

export default function TermsPage() {
  return (
    <TrustPage
      badge="Terms"
      title="Terms for pilot learning use"
      description="The CSO Learning Hub is a pilot learning platform for practical courses, progress, assessment, certificates, and feedback."
      sections={[
        {
          title: "Use the platform respectfully",
          body: "Use your learner account for your own learning journey. Do not misuse another learner account, disrupt course access, or share content in a way that harms other learners or organizations.",
        },
        {
          title: "Keep sensitive information out",
          body: "Do not upload or type confidential organizational information, safeguarding cases, complaints, survivor stories, political details, exact locations, or personal details about other people.",
        },
        {
          title: "Certificate limitation",
          body: "A certificate confirms that the named learner completed the course requirements and passed the final assessment. It does not replace organizational due diligence, safeguarding review, legal compliance checks, or partnership assessment.",
        },
        {
          title: "Current limitations",
          body: "The pilot supports online learning, course progress, certificates, public verification, feedback, and aggregate monitoring. It does not claim full offline learning or certify organizational capacity.",
        },
      ]}
    />
  );
}
