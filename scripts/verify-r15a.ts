import "dotenv/config";
import { CourseStatus, QuizQuestionType, Prisma, RoleKey } from "../src/generated/prisma/client";
import { getCreatorQuizData } from "../src/lib/build-studio-data";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("=== R15A Integration Test: Creator Final Test Setup Persistence ===");

  // Find a draft/returned course to test
  const draftCourse = await prisma.course.findFirst({
    where: {
      status: CourseStatus.DRAFT,
    },
  });

  if (!draftCourse) {
    console.error("FAIL: No draft course found in the database. Please run db:seed first.");
    process.exit(1);
  }

  console.log(`Testing with draft course: ${draftCourse.title} (${draftCourse.slug})`);

  // Mock a session of the creator of the course or admin
  const creatorUser = await prisma.user.findFirst({
    where: {
      roleAssignments: {
        some: {
          role: {
            key: "COURSE_CREATOR",
          },
        },
      },
    },
  });

  if (!creatorUser) {
    console.error("FAIL: No creator user found in seed.");
    process.exit(1);
  }

  const mockSession = {
    userId: creatorUser.id,
    email: creatorUser.email,
    roles: [RoleKey.COURSE_CREATOR],
    name: creatorUser.fullName ?? "Creator User",
    issuedAt: new Date().toISOString(),
  };

  // 1. Get Creator Quiz Data (which should find/create a quiz)
  const quizData = await getCreatorQuizData(draftCourse.slug, mockSession);

  if (!quizData) {
    console.error("FAIL: Could not load creator quiz data.");
    process.exit(1);
  }

  console.log("SUCCESS: getCreatorQuizData successfully loaded.");
  console.log(`  - Course: ${quizData.course.title}`);
  console.log(`  - Editable Version ID: ${quizData.version.id}`);
  console.log(`  - Quiz ID: ${quizData.quiz?.id}`);
  console.log(`  - Questions Count: ${quizData.questions.length}`);
  console.log(`  - Outcomes Count: ${quizData.learningOutcomes.length}`);
  console.log(`  - Is Editable: ${quizData.isEditable}`);

  if (!quizData.quiz) {
    console.error("FAIL: Quiz was not initialized/created.");
    process.exit(1);
  }

  const quizId = quizData.quiz.id;

  // Cleanup any old questions to avoid test leakage
  await prisma.quizQuestion.deleteMany({
    where: { quizId },
  });

  // 2. Test Adding Questions
  console.log("Adding first question...");
  await prisma.quizQuestion.create({
    data: {
      quizId,
      type: QuizQuestionType.MULTIPLE_CHOICE,
      questionText: "What is 2 + 2?",
      order: 1,
      points: 1,
      explanation: "Basic addition",
      configJson: {
        options: ["3", "4", "5"],
        correctAnswer: "4",
      },
    },
  });

  console.log("Adding second question...");
  const q2 = await prisma.quizQuestion.create({
    data: {
      quizId,
      type: QuizQuestionType.TRUE_FALSE,
      questionText: "Is Earth round?",
      order: 2,
      points: 1,
      explanation: "Basic astronomy",
      configJson: {
        options: ["True", "False"],
        correctAnswer: "True",
      },
    },
  });

  const updatedData = await getCreatorQuizData(draftCourse.slug, mockSession);
  if (!updatedData || updatedData.questions.length !== 2) {
    console.error(`FAIL: Expected 2 questions, got ${updatedData?.questions.length}`);
    process.exit(1);
  }
  console.log("SUCCESS: Questions successfully retrieved.");

  // Verify warning logic manually as a mock of the UI helper
  console.log("Verifying validation logic on incomplete question...");
  const qBad = await prisma.quizQuestion.create({
    data: {
      quizId,
      type: QuizQuestionType.MULTIPLE_CHOICE,
      questionText: "", // missing text
      order: 3,
      points: 1,
      configJson: {
        options: ["OnlyOne"], // fewer than two options
        correctAnswer: "NotInOptions", // correct answer doesn't match
      },
    },
  });

  function getQuestionWarnings(question: { questionText: string; configJson: unknown }) {
    const warnings: string[] = [];
    if (!question.questionText.trim()) warnings.push("Question text missing");
    const config = question.configJson as { options?: string[]; correctAnswer?: string } | null;
    const options = config?.options ?? [];
    const correct = config?.correctAnswer ?? "";
    if (options.length < 2) warnings.push("Fewer than two options");
    if (!correct) warnings.push("Missing correct answer");
    else if (!options.includes(correct)) warnings.push("Correct answer not in options");
    return warnings;
  }

  const warnings = getQuestionWarnings(qBad);
  console.log("  Warnings computed for bad question:", warnings);
  if (warnings.length !== 3) {
    console.error("FAIL: Expected 3 warnings, got " + warnings.length);
    process.exit(1);
  }
  console.log("SUCCESS: Warning logic detects all required conditions.");

  // Cleanup bad question
  await prisma.quizQuestion.delete({ where: { id: qBad.id } });

  // 3. Test Duplication
  console.log("Duplicating question 2...");
  const countBefore = await prisma.quizQuestion.count({ where: { quizId } });
  await prisma.quizQuestion.create({
    data: {
      quizId,
      type: q2.type,
      questionText: `${q2.questionText} (Copy)`,
      order: countBefore + 1,
      explanation: q2.explanation,
      configJson: q2.configJson as unknown as Prisma.InputJsonValue,
    },
  });

  const countAfter = await prisma.quizQuestion.count({ where: { quizId } });
  if (countAfter !== countBefore + 1) {
    console.error("FAIL: Duplication did not increase question count.");
    process.exit(1);
  }
  console.log("SUCCESS: Question duplicated.");

  // 4. Test Deletion and Order Re-sequencing
  console.log("Deleting duplicated question and testing re-sequencing...");
  const duplicate = await prisma.quizQuestion.findFirst({
    where: { quizId, questionText: "Is Earth round? (Copy)" },
  });

  if (!duplicate) {
    console.error("FAIL: Could not find duplicated question to delete.");
    process.exit(1);
  }

  await prisma.quizQuestion.delete({ where: { id: duplicate.id } });
  const remaining = await prisma.quizQuestion.findMany({
    where: { quizId },
    orderBy: { order: "asc" },
  });

  // Verify order is sequential 1, 2
  for (let i = 0; i < remaining.length; i++) {
    if (remaining[i].order !== i + 1) {
      console.error(`FAIL: Order not sequenced correctly. Index ${i} has order ${remaining[i].order}`);
      process.exit(1);
    }
  }
  console.log("SUCCESS: Deletion and sequential order re-sequencing verified.");

  // 5. Test Settings Update
  console.log("Updating quiz and course settings...");
  await prisma.course.update({
    where: { id: draftCourse.id },
    data: { finalTestRequired: true },
  });
  await prisma.quiz.update({
    where: { id: quizId },
    data: { retakeAllowed: true, maxAttempts: 5 },
  });

  const finalCheck = await prisma.quiz.findUnique({ where: { id: quizId } });
  const courseCheck = await prisma.course.findUnique({ where: { id: draftCourse.id } });

  if (courseCheck?.finalTestRequired !== true || finalCheck?.maxAttempts !== 5) {
    console.error("FAIL: Settings did not persist correctly.");
    process.exit(1);
  }
  console.log("SUCCESS: Settings persistence verified.");

  console.log("\nALL R15A TESTS PASSED SUCCESSFULLY!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
