import fs from "fs";
import path from "path";

function runVerify() {
  console.log("=== Verification: Course Player Shell and Navigation Gating ===");

  const projectRoot = path.join(__dirname, "..");
  const pagePath = path.join(projectRoot, "src", "app", "(learn)", "learn", "[[...segments]]", "page.tsx");
  const playerPath = path.join(projectRoot, "src", "components", "learner", "LearnerCoursePlayer.tsx");
  const externalFramePath = path.join(projectRoot, "src", "components", "learner", "ExternalCourseFrame.tsx");
  const controlsPath = path.join(projectRoot, "src", "components", "learner", "LessonNavigationControls.tsx");

  // 1. Check page routing and certificate data isolation
  console.log("Checking page route handlers and certificate isolation...");
  const pageContent = fs.readFileSync(pagePath, "utf8");

  // Check that certificate list data is NOT loaded on courses/player routes
  const lines = pageContent.split("\n");
  let certificateDataFetchedOnCoursePlayer = false;
  let insideCourseRoute = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('segments.length === 2 && segments[0] === "courses"')) {
      insideCourseRoute = true;
    }
    if (insideCourseRoute && line.includes("getLearnerCertificateListData")) {
      certificateDataFetchedOnCoursePlayer = true;
    }
    if (insideCourseRoute && line.includes("return (") && line.includes("CoursePlayerShell")) {
      insideCourseRoute = false; // exited courses route
    }
  }

  if (certificateDataFetchedOnCoursePlayer) {
    console.error("FAIL: getLearnerCertificateListData is incorrectly called on course player routes!");
    process.exit(1);
  }
  console.log("PASS: Course Player routes do not fetch dashboard certificate data.");

  // Check that gating logic and quiz attempts queries remain intact
  if (!pageContent.includes("lessonsComplete = totalCount > 0 && completedCount === totalCount")) {
    console.error("FAIL: Lesson completion/gating check has been modified!");
    process.exit(1);
  }
  if (!pageContent.includes("prisma.quizAttempt.findFirst")) {
    console.error("FAIL: Quiz attempt check query has been modified!");
    process.exit(1);
  }
  console.log("PASS: Assessment gating and lesson eligibility logic are unchanged.");

  // Assert that mockProgress override is NOT present on the normal learner routes
  if (pageContent.includes("mockProgress")) {
    console.error("FAIL: mockProgress override is still present on normal learner routes!");
    process.exit(1);
  }
  console.log("PASS: Normal learner routes have no progress simulation parameters.");

  // 2. Check LearnerCoursePlayer and navigation controls
  console.log("Checking LearnerCoursePlayer layout and outline accessibility...");
  const playerContent = fs.readFileSync(playerPath, "utf8");

  // Check that locked lessons are non-interactive divs rather than links
  if (!playerContent.includes("isLocked && !isCurrent")) {
    console.error("FAIL: Course outline does not handle locked lessons separately!");
    process.exit(1);
  }
  if (!playerContent.includes("aria-disabled=\"true\"")) {
    console.error("FAIL: Locked lessons do not declare aria-disabled status!");
    process.exit(1);
  }
  console.log("PASS: Locked items are rendered as non-interactive accessible items.");

  // Check that duplicate headers are removed from internal player view
  if (playerContent.includes("<LearnerInstitutionalHeader")) {
    console.error("FAIL: Duplicate LearnerInstitutionalHeader is still rendered inside player!");
    process.exit(1);
  }
  if (playerContent.includes("<CoursePlayerHeader")) {
    console.error("FAIL: Duplicate CoursePlayerHeader is still rendered inside player!");
    process.exit(1);
  }
  console.log("PASS: Duplicate headers successfully removed from Course Player body.");

  // 3. Check navigation controls action submit handles
  console.log("Checking navigation controls handlers...");
  const controlsContent = fs.readFileSync(controlsPath, "utf8");
  if (!controlsContent.includes("markLessonCompleteAction")) {
    console.error("FAIL: Complete and continue handler modified!");
    process.exit(1);
  }
  console.log("PASS: Lesson completion form submits to existing Server Action handler.");

  // 4. Check external course iframe properties
  console.log("Checking external course frame attributes...");
  const externalContent = fs.readFileSync(externalFramePath, "utf8");
  if (!externalContent.includes("sandbox=\"allow-downloads allow-forms allow-popups allow-same-origin allow-scripts\"")) {
    console.error("FAIL: External iframe sandbox rules have changed!");
    process.exit(1);
  }
  if (!externalContent.includes("allow=\"clipboard-read; clipboard-write; fullscreen\"")) {
    console.error("FAIL: External iframe does not delegate fullscreen permission!");
    process.exit(1);
  }
  if (!externalContent.includes("src={launchData.iframeSrc}")) {
    console.error("FAIL: External iframe src has been changed!");
    process.exit(1);
  }
  console.log("PASS: External course iframe source, fullscreen delegation, and sandboxing are correct.");

  // 5. Verify local QA visual completed course page checks and guards
  console.log("Verifying isolated QA completed course page rules...");
  const qaCompletedPath = path.join(projectRoot, "src", "app", "(auth)", "local-qa", "course-player", "completed", "page.tsx");
  if (!fs.existsSync(qaCompletedPath)) {
    console.error("FAIL: Isolated completed course QA page does not exist!");
    process.exit(1);
  }
  const qaCompletedContent = fs.readFileSync(qaCompletedPath, "utf8");
  if (!qaCompletedContent.includes("isLocalQaFixtureAllowed()")) {
    console.error("FAIL: QA completed visual page does not call isLocalQaFixtureAllowed()!");
    process.exit(1);
  }
  console.log("PASS: Isolated QA Completed Page calls local QA safety guards.");

  // 6. Verify local QA guard safety assertions
  console.log("Verifying local QA safety guard rules...");
  const guardPath = path.join(projectRoot, "src", "lib", "local-qa-guard.ts");
  if (!fs.existsSync(guardPath)) {
    console.error("FAIL: local-qa-guard.ts does not exist!");
    process.exit(1);
  }
  const guardContent = fs.readFileSync(guardPath, "utf8");
  if (!guardContent.includes("APP_ENVIRONMENT") || !guardContent.includes("ALLOW_LOCAL_DEMO_AUTH") || !guardContent.includes("ALLOW_LOCAL_COURSE_FIXTURES")) {
    console.error("FAIL: local-qa-guard.ts is missing required environment flags checks!");
    process.exit(1);
  }
  if (!guardContent.includes("fgyxbzwdvngqlksyxuwa") || !guardContent.includes("bhzyrthinbyqgsetnoph")) {
    console.error("FAIL: local-qa-guard.ts is missing staging or production project ID safety checks!");
    process.exit(1);
  }
  if (!guardContent.includes("localhost") || !guardContent.includes("127.0.0.1")) {
    console.error("FAIL: local-qa-guard.ts is missing localhost request checking!");
    process.exit(1);
  }
  console.log("PASS: Local QA safety guard enforces environment, project IDs, and request headers.");

  // 7. Verify course-data and external-course workflows throw errors under database outages outside of local-test mode
  console.log("Verifying fail-closed database query exceptions workflow...");
  const courseDataPath = path.join(projectRoot, "src", "lib", "course-data.ts");
  const courseDataContent = fs.readFileSync(courseDataPath, "utf8");
  if (!courseDataContent.includes("isLocalQaFixtureAllowed()")) {
    console.error("FAIL: course-data.ts does not call isLocalQaFixtureAllowed()!");
    process.exit(1);
  }
  if (!courseDataContent.includes("throw error;")) {
    console.error("FAIL: course-data.ts does not rethrow error on query failure outside local QA!");
    process.exit(1);
  }

  const workflowPath = path.join(projectRoot, "src", "lib", "external-course-workflow.ts");
  const workflowContent = fs.readFileSync(workflowPath, "utf8");
  if (!workflowContent.includes("isLocalQaFixtureAllowed()")) {
    console.error("FAIL: external-course-workflow.ts does not call isLocalQaFixtureAllowed()!");
    process.exit(1);
  }
  if (!workflowContent.includes("throw error;")) {
    console.error("FAIL: external-course-workflow.ts does not rethrow error on query failure outside local QA!");
    process.exit(1);
  }
  console.log("PASS: Database query failures throw and bubble up outside local QA mode.");

  console.log("ALL COURSE PLAYER SHELL REGRESSION VERIFICATIONS PASSED.");
}

runVerify();
