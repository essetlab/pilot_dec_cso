import { NextResponse, type NextRequest } from "next/server";
import { getCurrentSession } from "@/lib/auth/server";
import {
  buildCertificatePdfFileName,
  generateCertificatePdf,
} from "@/lib/certificate-pdf";
import { getLearnerCertificatePdfData } from "@/lib/certificate-workflow";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    certificateCode: string;
  }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { certificateCode } = await context.params;
  const certificate = await getLearnerCertificatePdfData(certificateCode, session);

  if (!certificate) {
    return NextResponse.json(
      { success: false, error: "Certificate not found" },
      { status: 404 },
    );
  }

  const pdfBytes = await generateCertificatePdf(certificate);
  const pdfBody = new ArrayBuffer(pdfBytes.byteLength);
  new Uint8Array(pdfBody).set(pdfBytes);
  const fileName = buildCertificatePdfFileName(certificate.certificateCode);

  return new NextResponse(pdfBody, {
    headers: {
      "Cache-Control": "private, no-store",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Content-Type": "application/pdf",
    },
  });
}
