import fs from "node:fs";
import dotenv from "dotenv";

// 1. Load env dynamically from the secure secrets directory to avoid command-line or log exposure
const secretsPath = "d:/CSO_Learning_Hub_Secrets/phase1-staging.env";
if (!fs.existsSync(secretsPath)) {
  console.error("Error: Staging secrets file not found at:", secretsPath);
  process.exit(1);
}

const secretsContent = fs.readFileSync(secretsPath, "utf8");
const parsedEnv = dotenv.parse(secretsContent);
const dbUrl = parsedEnv.DATABASE_URL;

if (!dbUrl) {
  console.error("Error: DATABASE_URL is missing in staging secrets file.");
  process.exit(1);
}

// Set database URL in environment for Prisma to connect
process.env.DATABASE_URL = dbUrl;

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function main() {
  console.log("=== Staging Database: UAT Certificate Restoration ===");

  const pool = new pg.Pool({ connectionString: dbUrl });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter, errorFormat: "minimal" });

  try {
    // 2. Safeguard Checks - verify parent relations exist
    console.log("Checking parent relations in staging database...");

    const user1 = await prisma.user.findUnique({ where: { id: "cms36mda3000004l4fjevvjeg" } });
    const user2 = await prisma.user.findUnique({ where: { id: "cms68ry9k000004l4ltb76duc" } });
    assert(user1, "Relation error: User cms36mda3000004l4fjevvjeg (Self-Reg Learner) does not exist.");
    assert(user2, "Relation error: User cms68ry9k000004l4ltb76duc (Aster UAT Learner) does not exist.");

    const enrollment1 = await prisma.enrollment.findUnique({ where: { id: "cms376sj2000004l7sha3k2jh" } });
    const enrollment2 = await prisma.enrollment.findUnique({ where: { id: "cms68uzic000404l4acs64pz8" } });
    assert(enrollment1, "Relation error: Enrollment cms376sj2000004l7sha3k2jh does not exist.");
    assert(enrollment2, "Relation error: Enrollment cms68uzic000404l4acs64pz8 does not exist.");

    const quizAttempt1 = await prisma.quizAttempt.findUnique({ where: { id: "cms3cb6kz000i04i885s3o5pi" } });
    const quizAttempt2 = await prisma.quizAttempt.findUnique({ where: { id: "cms69w4xb000504ldt2u7w3ny" } });
    assert(quizAttempt1, "Relation error: QuizAttempt cms3cb6kz000i04i885s3o5pi does not exist.");
    assert(quizAttempt2, "Relation error: QuizAttempt cms69w4xb000504ldt2u7w3ny does not exist.");

    // Verify course & version
    const course = await prisma.course.findUnique({ where: { id: "COURSE-HRBA-EXTERNAL-VITE-V1" } });
    const version = await prisma.courseVersion.findUnique({ where: { id: "PCV-HRBA-EXTERNAL-VITE-V1" } });
    assert(course, "Relation error: Course COURSE-HRBA-EXTERNAL-VITE-V1 does not exist.");
    assert(version, "Relation error: CourseVersion PCV-HRBA-EXTERNAL-VITE-V1 does not exist.");

    // 3. Verify no duplicate primary key or code currently exists
    console.log("Checking duplication prevention keys...");
    const existingCerts = await prisma.certificate.findMany({
      where: {
        id: { in: ["cms3cb8bu000104i6fx16kigq", "cms69w59f000704ldbzvqswjb"] }
      }
    });
    assert(existingCerts.length === 0, "Precondition error: One or both certificates already exist in DB.");

    // 4. Execute Restoration Transaction
    console.log("Executing restoration transaction...");
    await prisma.$transaction([
      prisma.certificate.create({
        data: {
          id: "cms3cb8bu000104i6fx16kigq",
          certificateCode: "CERT-E-V1-VJEG-KBVN",
          userId: "cms36mda3000004l4fjevvjeg",
          courseId: "COURSE-HRBA-EXTERNAL-VITE-V1",
          courseVersionId: "PCV-HRBA-EXTERNAL-VITE-V1",
          enrollmentId: "cms376sj2000004l7sha3k2jh",
          quizAttemptId: "cms3cb6kz000i04i885s3o5pi",
          status: "ISSUED",
          issuedAt: new Date("2026-07-27T14:46:33.450Z"),
          completionDate: new Date("2026-07-27T14:46:32.850Z"),
          participantNameSnapshot: "HRBA Self-Registration Pilot Learner",
          issuerNameSnapshot: "DEC / WHH CSF+ CSO Learning Hub",
        }
      }),
      prisma.certificate.create({
        data: {
          id: "cms69w59f000704ldbzvqswjb",
          certificateCode: "CERT-E-V1-6DUC-LOEU",
          userId: "cms68ry9k000004l4ltb76duc",
          courseId: "COURSE-HRBA-EXTERNAL-VITE-V1",
          courseVersionId: "PCV-HRBA-EXTERNAL-VITE-V1",
          enrollmentId: "cms68uzic000404l4acs64pz8",
          quizAttemptId: "cms69w4xb000504ldt2u7w3ny",
          status: "ISSUED",
          issuedAt: new Date("2026-07-29T16:02:08.931Z"),
          completionDate: new Date("2026-07-29T16:02:08.351Z"),
          participantNameSnapshot: "Aster Pilot UAT Learner",
          issuerNameSnapshot: "DEC / WHH CSF+ CSO Learning Hub",
        }
      })
    ]);

    console.log("SUCCESS: Both UAT certificate records restored successfully.");

  } catch (err) {
    console.error("Restoration failed and rolled back:", err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
