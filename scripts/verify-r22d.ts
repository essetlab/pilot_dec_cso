import "dotenv/config";

import type { AuthSession } from "../src/lib/auth/session-codec";
import {
  getAdminCertificateDetailData,
  getAdminCertificateListData,
  getLearnerCertificateDetailData,
  getLearnerCertificateListData,
} from "../src/lib/certificate-workflow";
import { CERTIFICATE_PASS_THRESHOLD } from "../src/lib/demo-data";
import { cleanPresentationText } from "../src/lib/presentation-text";
import { prisma } from "../src/lib/prisma";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function sessionFor(
  user: { email: string; fullName: string | null; id: string },
  roles: AuthSession["roles"],
): AuthSession {
  return {
    email: user.email,
    issuedAt: new Date().toISOString(),
    name: user.fullName ?? user.email,
    roles,
    userId: user.id,
  };
}

async function main() {
  console.log("=== R22D Verification: DB-backed Certificates ===");

  const [admin, participantCompleted, participantNew] = await Promise.all([
    prisma.user.findUnique({ where: { email: "admin@demo.local" } }),
    prisma.user.findUnique({ where: { email: "participant2@demo.local" } }),
    prisma.user.findUnique({ where: { email: "participant3@demo.local" } }),
  ]);
  assert(admin, "Missing seeded admin user. Run npm run db:seed first.");
  assert(participantCompleted, "Missing seeded completed participant. Run npm run db:seed first.");
  assert(participantNew, "Missing seeded new participant. Run npm run db:seed first.");

  const adminSession = sessionFor(admin, ["PLATFORM_ADMIN"]);
  const completedSession = sessionFor(participantCompleted, ["PARTICIPANT"]);
  const newParticipantSession = sessionFor(participantNew, ["PARTICIPANT"]);

  const certificates = await prisma.certificate.findMany({
    select: {
      certificateCode: true,
      courseVersionId: true,
      userId: true,
    },
  });
  assert(certificates.length > 0, "Expected at least one seeded certificate.");
  const uniquePairs = new Set(
    certificates.map(
      (certificate) => `${certificate.userId}:${certificate.courseVersionId}`,
    ),
  );
  assert(
    uniquePairs.size === certificates.length,
    "Expected no duplicate certificate per user/course version.",
  );
  console.log("PASS: certificate records exist and duplicate prevention key is respected.");

  const issuedCertificate = certificates[0];
  assert(issuedCertificate, "Expected a certificate for detail checks.");
  const displayCertificateCode = cleanPresentationText(issuedCertificate.certificateCode);

  const learnerList = await getLearnerCertificateListData(completedSession);
  assert(learnerList.metrics.earned >= 1, "Expected completed participant to see an earned certificate.");
  assert(
    learnerList.certificates.some(
      (certificate) => certificate.certificateCode === displayCertificateCode,
    ),
    "Expected learner list to include the issued certificate.",
  );
  assert(
    learnerList.metrics.requiredPassScore === `${CERTIFICATE_PASS_THRESHOLD}%`,
    "Expected learner pass threshold to remain 80%.",
  );
  console.log("PASS: learner certificate list is DB-backed.");

  const learnerDetail = await getLearnerCertificateDetailData(
    issuedCertificate.certificateCode,
    completedSession,
  );
  assert(learnerDetail, "Expected learner certificate detail to load by certificate code.");
  assert(learnerDetail.status === "Issued", "Expected learner certificate detail status to be issued.");
  assert(learnerDetail.certificateCode === displayCertificateCode, "Expected learner detail certificate code.");
  assert(learnerDetail.participantName.includes("Participant"), "Expected learner detail snapshot participant name.");
  console.log("PASS: learner certificate detail uses issued snapshot fields.");

  const otherLearnerDetail = await getLearnerCertificateDetailData(
    issuedCertificate.certificateCode,
    newParticipantSession,
  );
  assert(otherLearnerDetail === null, "Expected another participant not to read someone else's certificate.");
  console.log("PASS: learner certificates are scoped to the current participant.");

  const adminList = await getAdminCertificateListData(adminSession);
  assert(adminList.metrics.issued >= 1, "Expected admin certificate list metric.");
  assert(
    adminList.certificates.some(
      (certificate) => certificate.certificateCode === displayCertificateCode,
    ),
    "Expected admin certificate list to include issued certificate.",
  );
  assert(
    adminList.metrics.requiredPassScore === `${CERTIFICATE_PASS_THRESHOLD}%`,
    "Expected admin pass threshold to remain 80%.",
  );
  console.log("PASS: admin certificate list is DB-backed.");

  const adminDetail = await getAdminCertificateDetailData(
    issuedCertificate.certificateCode,
    adminSession,
  );
  assert(adminDetail, "Expected admin certificate detail to load.");
  assert(adminDetail.certificateCode === displayCertificateCode, "Expected admin detail certificate code.");
  assert(adminDetail.passThresholdLabel === `${CERTIFICATE_PASS_THRESHOLD}%`, "Expected admin detail pass threshold 80%.");
  console.log("PASS: admin certificate detail reads DB certificate record.");

  const nonAdminList = await getAdminCertificateListData(completedSession);
  const nonAdminDetail = await getAdminCertificateDetailData(
    issuedCertificate.certificateCode,
    completedSession,
  );
  assert(nonAdminList.certificates.length === 0, "Expected participant admin certificate list access to return no records.");
  assert(nonAdminDetail === null, "Expected participant admin certificate detail access to return null.");
  console.log("PASS: participant cannot read admin certificate records.");

  console.log("ALL R22D CHECKS PASSED.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
