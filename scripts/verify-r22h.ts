import "dotenv/config";

import type { AuthSession } from "../src/lib/auth/session-codec";
import { getFeedbackSummaryData } from "../src/lib/feedback-workflow";
import { getMonitoringData } from "../src/lib/monitoring-workflow";
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
  console.log("=== R22H Verification: Monitoring Visual Polish ===");

  const [admin, meViewer, creator, participant] = await Promise.all([
    prisma.user.findUnique({ where: { email: "admin@demo.local" } }),
    prisma.user.findUnique({ where: { email: "meviewer@demo.local" } }),
    prisma.user.findUnique({ where: { email: "creator@demo.local" } }),
    prisma.user.findUnique({ where: { email: "participant2@demo.local" } }),
  ]);

  assert(admin, "Missing seeded Platform Admin user. Run npm run db:seed first.");
  assert(meViewer, "Missing seeded M&E Viewer user. Run npm run db:seed first.");
  assert(creator, "Missing seeded Course Creator user. Run npm run db:seed first.");
  assert(participant, "Missing seeded participant user. Run npm run db:seed first.");

  const adminSession = sessionFor(admin, ["PLATFORM_ADMIN"]);
  const meViewerSession = sessionFor(meViewer, ["ME_VIEWER"]);
  const creatorSession = sessionFor(creator, ["COURSE_CREATOR"]);
  const participantSession = sessionFor(participant, ["PARTICIPANT"]);

  // 1. Role Limits
  const adminData = await getMonitoringData(adminSession);
  const meData = await getMonitoringData(meViewerSession);
  const creatorData = await getMonitoringData(creatorSession);
  const participantData = await getMonitoringData(participantSession);

  assert(adminData.kpiCards.length === 10, "Expected 10 KPI cards for admin.");
  assert(meData.kpiCards.length === 10, "Expected 10 KPI cards for M&E Viewer.");
  assert(
    creatorData.kpiCards.every((card) => card.value === "0" || card.value === "N/A"),
    "Expected empty defaults for Course Creator.",
  );
  assert(
    participantData.kpiCards.every((card) => card.value === "0" || card.value === "N/A"),
    "Expected empty defaults for Participant.",
  );
  console.log("PASS: monitoring access role controls verified.");

  // 2. Visual KPIs Structure
  const expectedLabels = [
    "Registered participants",
    "Active participants",
    "CSO organizations",
    "Cohorts",
    "Published courses",
    "Enrollments",
    "Completion rate",
    "Final test pass rate",
    "Certificates issued",
    "Average course rating",
  ];

  for (const label of expectedLabels) {
    const card = adminData.kpiCards.find((c) => c.label === label);
    assert(card, `Expected to find KPI card with label: "${label}"`);
    assert(card.value !== undefined, `KPI card "${label}" should have a value.`);
    assert(card.helperText !== undefined, `KPI card "${label}" should have a helperText.`);
    assert(card.tone !== undefined, `KPI card "${label}" should have a tone.`);
  }
  console.log("PASS: 10 visual KPI metrics are correctly populated.");

  // 3. Cohort and Org Progress Arrays
  assert(Array.isArray(adminData.cohortProgress), "Expected cohortProgress to be an array.");
  assert(Array.isArray(adminData.organizationProgress), "Expected organizationProgress to be an array.");

  if (adminData.cohortProgress.length > 0) {
    const firstCohort = adminData.cohortProgress[0];
    assert(firstCohort.cohortId, "Cohort progress must contain cohortId.");
    assert(firstCohort.cohortName, "Cohort progress must contain cohortName.");
    assert(typeof firstCohort.completionNumeric === "number", "completionNumeric must be a number.");
    assert(typeof firstCohort.enrollments === "number", "enrollments must be a number.");
  }

  if (adminData.organizationProgress.length > 0) {
    const firstOrg = adminData.organizationProgress[0];
    assert(firstOrg.organizationId, "Organization progress must contain organizationId.");
    assert(firstOrg.organizationName, "Organization progress must contain organizationName.");
    assert(typeof firstOrg.completionNumeric === "number", "completionNumeric must be a number.");
    assert(typeof firstOrg.participants === "number", "participants must be a number.");
  }

  // Verify precise certificates scoping
  for (const cohort of adminData.cohortProgress) {
    const cohortUsers = await prisma.user.findMany({
      where: { primaryCohortId: cohort.cohortId },
      select: { id: true }
    });
    const userIds = cohortUsers.map(u => u.id);
    const dbCertsCount = await prisma.certificate.count({
      where: {
        userId: { in: userIds },
        status: "ISSUED"
      }
    });
    assert(cohort.certificates === dbCertsCount, `Cohort ${cohort.cohortName} certificate count mismatch. Got: ${cohort.certificates}, Expected: ${dbCertsCount}`);
  }
  console.log("PASS: Cohort certificate count matches precise database lookup.");

  for (const org of adminData.organizationProgress) {
    const orgUsers = await prisma.user.findMany({
      where: { organizationId: org.organizationId },
      select: { id: true }
    });
    const userIds = orgUsers.map(u => u.id);
    const dbCertsCount = await prisma.certificate.count({
      where: {
        userId: { in: userIds },
        status: "ISSUED"
      }
    });
    assert(org.certificates === dbCertsCount, `Organization ${org.organizationName} certificate count mismatch. Got: ${org.certificates}, Expected: ${dbCertsCount}`);
  }
  console.log("PASS: Organization certificate count matches precise database lookup.");

  // Verify quiz attempts only include final tests
  const dbFinalTestsCount = await prisma.quizAttempt.count({
    where: {
      quiz: { isFinalTest: true },
      status: { in: ["SUBMITTED", "PASSED", "FAILED"] }
    }
  });
  const totalSummaryAttempts = adminData.testSummary.totalAttempts;
  assert(totalSummaryAttempts === dbFinalTestsCount, `Total quiz attempts mismatch. Got: ${totalSummaryAttempts}, Expected (final tests only): ${dbFinalTestsCount}`);
  console.log("PASS: Quiz attempt aggregation counts only final test quizzes.");

  // Verify cohort feedback ratings match user feedback ratings
  for (const cohort of adminData.cohortProgress) {
    const cohortUsers = await prisma.user.findMany({
      where: { primaryCohortId: cohort.cohortId },
      select: { id: true }
    });
    const userIds = cohortUsers.map(u => u.id);
    const feedbackRatings = await prisma.feedback.findMany({
      where: {
        userId: { in: userIds },
        courseId: { not: null },
        rating: { not: null }
      },
      select: { rating: true }
    });
    const ratings = feedbackRatings.map(f => f.rating!).filter(r => r !== null);
    const avg = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : "N/A";
    const cohortAvg = cohort.averageRating;
    assert(cohortAvg === avg, `Cohort ${cohort.cohortName} feedback rating mismatch. Got: ${cohortAvg}, Expected: ${avg}`);
  }
  console.log("PASS: Cohort feedback rating average is scoped precisely to cohort participants.");

  console.log("PASS: Cohort and Organization progress metrics are correctly populated.");

  // 4. Attention Signals / Threshold Rules
  assert(Array.isArray(adminData.attentionSignals), "Expected attentionSignals to be an array.");
  for (const signal of adminData.attentionSignals) {
    assert(["low-completion", "low-pass-rate", "low-feedback", "low-activity"].includes(signal.type), `Unknown signal type: ${signal.type}`);
    assert(["orange", "red", "gold"].includes(signal.tone), `Unknown signal tone: ${signal.tone}`);
    assert(signal.label, "Attention signal must have a label.");
    assert(signal.detail, "Attention signal must have detail explanation.");
  }
  console.log("PASS: Attention and improvement signals computed correctly.");

  // 5. Test Performance Summary Structure
  const summary = adminData.testSummary;
  assert(summary.totalAttempts !== undefined, "Expected totalAttempts in test summary.");
  assert(summary.averagePassScore !== undefined, "Expected averagePassScore in test summary.");
  assert(summary.passedAttempts !== undefined, "Expected passedAttempts in test summary.");
  assert(summary.failedAttempts !== undefined, "Expected failedAttempts in test summary.");
  assert(typeof summary.passRateNumeric === "number", "Expected passRateNumeric to be a number.");
  console.log("PASS: final test and assessment performance structured correctly.");

  // 6. Feedback summary honors monitoring filters
  const feedbackProbe = await prisma.feedback.findFirst({
    select: {
      courseId: true,
      user: {
        select: {
          organizationId: true,
          primaryCohortId: true,
        },
      },
    },
    where: {
      courseId: { not: null },
      type: "COURSE_FEEDBACK",
    },
  });

  if (feedbackProbe?.courseId) {
    const [courseSummary, expectedCourseFeedback] = await Promise.all([
      getFeedbackSummaryData(adminSession, { courseId: feedbackProbe.courseId }),
      prisma.feedback.count({
        where: {
          courseId: feedbackProbe.courseId,
          type: "COURSE_FEEDBACK",
        },
      }),
    ]);

    assert(
      courseSummary.totalFeedback === expectedCourseFeedback,
      `Filtered course feedback mismatch. Got: ${courseSummary.totalFeedback}, Expected: ${expectedCourseFeedback}`,
    );
  }

  if (feedbackProbe?.user.organizationId) {
    const organizationId = feedbackProbe.user.organizationId;
    const [organizationSummary, expectedOrganizationFeedback] = await Promise.all([
      getFeedbackSummaryData(adminSession, { organizationId }),
      prisma.feedback.count({
        where: {
          courseId: { not: null },
          type: "COURSE_FEEDBACK",
          user: { organizationId },
        },
      }),
    ]);

    assert(
      organizationSummary.totalFeedback === expectedOrganizationFeedback,
      `Filtered organization feedback mismatch. Got: ${organizationSummary.totalFeedback}, Expected: ${expectedOrganizationFeedback}`,
    );
  }

  if (feedbackProbe?.user.primaryCohortId) {
    const cohortId = feedbackProbe.user.primaryCohortId;
    const [cohortSummary, expectedCohortFeedback] = await Promise.all([
      getFeedbackSummaryData(adminSession, { cohortId }),
      prisma.feedback.count({
        where: {
          courseId: { not: null },
          type: "COURSE_FEEDBACK",
          user: { primaryCohortId: cohortId },
        },
      }),
    ]);

    assert(
      cohortSummary.totalFeedback === expectedCohortFeedback,
      `Filtered cohort feedback mismatch. Got: ${cohortSummary.totalFeedback}, Expected: ${expectedCohortFeedback}`,
    );
  }

  console.log("PASS: feedback summary honors monitoring filters.");

  console.log("ALL R22H CHECKS PASSED.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
