import "dotenv/config";

import { ContentBlockType } from "../src/generated/prisma/enums";
import { canAccessPath } from "../src/lib/auth/permissions";
import type { AuthSession } from "../src/lib/auth/session-codec";
import { getBuildStudioCourse } from "../src/lib/build-studio-data";
import { prisma } from "../src/lib/prisma";

const expectedEditableTypes = [
  ContentBlockType.ACCORDION,
  ContentBlockType.BRANCHING_SCENARIO,
  ContentBlockType.CASE_STUDY,
  ContentBlockType.EXTERNAL_LINK,
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
  console.log("=== Build Studio Blocks Verification ===");

  const [admin, participant] = await Promise.all([
    prisma.user.findUnique({ where: { email: "admin@demo.local" } }),
    prisma.user.findUnique({ where: { email: "participant2@demo.local" } }),
  ]);

  assert(admin, "Missing seeded Platform Admin user. Run npm run db:seed first.");
  assert(participant, "Missing seeded Participant user. Run npm run db:seed first.");

  const participantSession = sessionFor(participant, ["PARTICIPANT"]);
  assert(
    !canAccessPath(participantSession, "/creator/courses/example/build"),
    "Participant must not access creator Build Studio routes.",
  );
  console.log("PASS: participant route guard blocks Build Studio access.");

  const courseWithBlocks = await prisma.course.findFirst({
    select: {
      id: true,
      versions: {
        orderBy: { versionNumber: "desc" },
        select: {
          modules: {
            orderBy: { order: "asc" },
            select: {
              lessons: {
                orderBy: { order: "asc" },
                select: {
                  contentBlocks: {
                    orderBy: { order: "asc" },
                    select: { id: true, type: true },
                  },
                  id: true,
                },
              },
            },
          },
        },
        take: 1,
      },
    },
    where: {
      versions: {
        some: {
          modules: {
            some: {
              lessons: {
                some: {
                  contentBlocks: { some: {} },
                },
              },
            },
          },
        },
      },
    },
  });

  assert(courseWithBlocks, "Expected at least one course with lesson blocks.");
  const firstLesson = courseWithBlocks.versions[0]?.modules
    .flatMap((module) => module.lessons)
    .find((lesson) => lesson.contentBlocks.length > 0);
  assert(firstLesson, "Expected a lesson with content blocks.");

  const adminSession = sessionFor(admin, ["PLATFORM_ADMIN"]);
  const firstBlock = firstLesson.contentBlocks[0];
  const selectedCourse = await getBuildStudioCourse(
    courseWithBlocks.id,
    adminSession,
    firstLesson.id,
    firstBlock.id,
  );

  assert(
    selectedCourse.selectedLesson?.id === firstLesson.id,
    "Expected selected lesson to remain selected.",
  );
  assert(
    selectedCourse.selectedBlock?.id === firstBlock.id,
    "Expected selected block state to resolve by blockId.",
  );
  assert(
    selectedCourse.selectedBlock?.type === firstBlock.type,
    "Expected selected block type to match the stored block record.",
  );
  console.log("PASS: Build Studio resolves selected lesson and selected block state.");

  const selectedTypes = new Set(
    selectedCourse.modules.flatMap((module) =>
      module.lessons.flatMap((lesson) => lesson.blocks.map((block) => block.type)),
    ),
  );
  for (const blockType of expectedEditableTypes) {
    if (selectedTypes.has(blockType)) {
      const matchingBlock = selectedCourse.modules
        .flatMap((module) => module.lessons)
        .flatMap((lesson) => lesson.blocks)
        .find((block) => block.type === blockType);
      assert(matchingBlock?.typeLabel, `Expected label for ${blockType}.`);
      assert(
        typeof matchingBlock.summary === "string",
        `Expected canvas summary for ${blockType}.`,
      );
    }
  }
  console.log("PASS: available Build Studio block cards expose labels and summaries.");

  console.log("ALL BUILD STUDIO BLOCK CHECKS PASSED.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
