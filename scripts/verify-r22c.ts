import "dotenv/config";

import {
  ContentBlockType,
  CourseStatus,
  CourseVisibility,
} from "../src/generated/prisma/enums";
import type { AuthSession } from "../src/lib/auth/session-codec";
import { getCreatorPreviewData } from "../src/lib/creator-preview-data";
import { DEMO_PROPOSAL_COURSE } from "../src/lib/demo-data";
import { prisma } from "../src/lib/prisma";

const expectedSeededBlockTypes = [
  ContentBlockType.ACCORDION,
  ContentBlockType.BRANCHING_SCENARIO,
  ContentBlockType.CASE_STUDY,
  ContentBlockType.FLASHCARD,
  ContentBlockType.IMAGE,
  ContentBlockType.KEY_MESSAGE,
  ContentBlockType.KNOWLEDGE_CHECK,
  ContentBlockType.PRACTICAL_ACTIVITY_PROMPT,
  ContentBlockType.REFLECTION_PROMPT,
  ContentBlockType.RESOURCE,
  ContentBlockType.TEXT,
  ContentBlockType.VIDEO,
] as const;

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
  console.log("=== R22C Verification: Seed Data + DB-backed Creator Preview ===");

  const proposalCourse = await prisma.course.findUnique({
    select: {
      id: true,
      slug: true,
      status: true,
      visibility: true,
      versions: {
        orderBy: { versionNumber: "desc" },
        select: {
          id: true,
        },
        take: 1,
      },
    },
    where: { slug: DEMO_PROPOSAL_COURSE.slug },
  });
  assert(proposalCourse, "Missing seeded proposal course. Run npm run db:seed first.");
  assert(proposalCourse.status === CourseStatus.PUBLISHED, "Expected proposal course to be published.");
  assert(proposalCourse.visibility === CourseVisibility.PUBLIC, "Expected proposal course to be public.");
  const versionId = proposalCourse.versions[0]?.id;
  assert(versionId, "Missing latest proposal course version.");

  const contentBlocks = await prisma.contentBlock.findMany({
    select: { type: true },
    where: {
      lesson: {
        module: {
          courseVersionId: versionId,
        },
      },
    },
  });
  assert(contentBlocks.length >= 12, `Expected at least 12 seeded content blocks, got ${contentBlocks.length}.`);
  const seededTypes = new Set(contentBlocks.map((block) => block.type));
  for (const type of expectedSeededBlockTypes) {
    assert(seededTypes.has(type), `Expected seeded content blocks to include ${type}.`);
  }
  assert(!seededTypes.has(ContentBlockType.MULTIPLE_CHOICE_QUESTION), "Lesson content should not seed scored multiple choice question blocks.");
  assert(!seededTypes.has(ContentBlockType.TRUE_FALSE_QUESTION), "Lesson content should not seed scored true/false question blocks.");
  console.log("PASS: seed includes representative Phase 1 lesson blocks and excludes scored final-test question blocks.");

  const certificateCount = await prisma.certificate.count();
  assert(certificateCount > 0, "Expected seeded certificate demo scenario to exist.");
  console.log("PASS: seed includes a certificate-visible demo scenario.");

  const [creator, admin, participant] = await Promise.all([
    prisma.user.findUnique({ where: { email: "creator@demo.local" } }),
    prisma.user.findUnique({ where: { email: "admin@demo.local" } }),
    prisma.user.findUnique({ where: { email: "participant2@demo.local" } }),
  ]);
  assert(creator, "Missing seeded creator user.");
  assert(admin, "Missing seeded admin user.");
  assert(participant, "Missing seeded participant user.");

  const creatorPreview = await getCreatorPreviewData(
    proposalCourse.slug,
    sessionFor(creator, ["COURSE_CREATOR"]),
  );
  assert(creatorPreview, "Expected creator preview data to load.");
  assert(creatorPreview.title === DEMO_PROPOSAL_COURSE.title, "Expected creator preview title to come from DB course.");
  assert(creatorPreview.totalBlocks >= 12, "Expected creator preview to include seeded content blocks.");
  assert(creatorPreview.modules.length > 0, "Expected creator preview modules.");
  assert(creatorPreview.resources.length > 0, "Expected creator preview resources.");
  assert(creatorPreview.finalTestQuestionCount > 0, "Expected creator preview final test summary.");
  console.log("PASS: creator preview data is DB-backed for the selected course.");

  const adminPreview = await getCreatorPreviewData(
    proposalCourse.slug,
    sessionFor(admin, ["PLATFORM_ADMIN"]),
  );
  assert(adminPreview?.totalBlocks === creatorPreview.totalBlocks, "Expected Platform Admin preview access to the same course content.");
  console.log("PASS: Platform Admin can load creator preview data.");

  const participantPreview = await getCreatorPreviewData(
    proposalCourse.slug,
    sessionFor(participant, ["PARTICIPANT"]),
  );
  assert(participantPreview === null, "Expected participant to be denied creator preview data.");
  console.log("PASS: participant cannot load creator preview data.");

  const learnerBlocks = await prisma.contentBlock.findMany({
    select: { type: true },
    where: {
      lesson: {
        module: {
          courseVersionId: versionId,
        },
      },
    },
  });
  assert(learnerBlocks.length >= 12, "Expected published course version to expose seeded blocks for the learner player.");
  assert(
    learnerBlocks.some((block) => block.type === ContentBlockType.KNOWLEDGE_CHECK),
    "Expected published learner content to include a knowledge check block.",
  );
  assert(
    learnerBlocks.some((block) => block.type === ContentBlockType.BRANCHING_SCENARIO),
    "Expected published learner content to include a branching scenario block.",
  );
  console.log("PASS: published learner course content includes seeded DB content blocks.");

  console.log("ALL R22C CHECKS PASSED.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
