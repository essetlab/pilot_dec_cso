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
          body: "Open the personal invitation sent to your email, create your password, and confirm your address to activate your Learning Hub account. Contact the programme support channel if account confirmation or sign-in does not work.",
        },
        {
          title: "Course launch help",
          body: "Start courses assigned or available to your account from the CSO Learning Hub. HRBA requires an individual assignment during the pilot. The Hub is the official entry point for progress, assessments, certificates, and verification.",
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
