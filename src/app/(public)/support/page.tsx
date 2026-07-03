import { TrustPage } from "@/components/public/TrustPage";

export default function SupportPage() {
  return (
    <TrustPage
      badge="Help / Support"
      title="Support for pilot learners"
      description="Use this page for practical guidance on account access, course launch, certificates, and safe participation."
      sections={[
        {
          title: "Account and access help",
          body: "Use the email address and pilot access code shared by the programme team. If either detail is unclear, contact your CSO focal person or the support channel shared by the programme team.",
        },
        {
          title: "Course launch help",
          body: "Start HRBA and other available courses from the CSO Learning Hub. The Hub is the official entry point for tracking progress, final assessment results, certificates, and verification.",
        },
        {
          title: "Certificate verification help",
          body: "Use the Verify Certificate page with the certificate code shown on the certificate. Public verification shows only safe certificate information.",
        },
        {
          title: "Pilot support channel",
          body: "For pilot support, use the support channel shared by the programme team. Do not send sensitive case details or confidential organization information through general support messages.",
        },
      ]}
    />
  );
}
