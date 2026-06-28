import { CertificateVerificationPage } from "@/components/public/CertificateVerificationPage";
import { getPublicCertificateVerificationData } from "@/lib/certificate-workflow";

type PageProps = {
  searchParams: Promise<{
    code?: string;
  }>;
};

export default async function VerifyCertificatePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const code = typeof params.code === "string" ? params.code.trim() : "";
  const certificate = code
    ? await getPublicCertificateVerificationData(code)
    : null;

  return (
    <CertificateVerificationPage
      certificate={certificate}
      code={code}
      hasSubmittedCode={Boolean(code)}
    />
  );
}
