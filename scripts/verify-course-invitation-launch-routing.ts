import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  HRBA_EXTERNAL_COURSE_SLUG,
  PM_EXTERNAL_COURSE_SLUG,
  getTrackedExternalCourseLearnerPath,
} from "../src/lib/external-course-config";

async function main() {
  assert.equal(
    getTrackedExternalCourseLearnerPath(HRBA_EXTERNAL_COURSE_SLUG),
    `/learn/courses/${HRBA_EXTERNAL_COURSE_SLUG}/external`,
  );
  assert.equal(
    getTrackedExternalCourseLearnerPath(PM_EXTERNAL_COURSE_SLUG),
    `/learn/courses/${PM_EXTERNAL_COURSE_SLUG}/external`,
  );
  assert.equal(
    getTrackedExternalCourseLearnerPath("ordinary-hub-course"),
    "/learn/courses/ordinary-hub-course",
  );

  const [pageSource, acceptanceSource] = await Promise.all([
    readFile("src/app/(public)/course-invitations/accept/page.tsx", "utf8"),
    readFile("src/components/public/CourseInvitationAcceptance.tsx", "utf8"),
  ]);
  assert.match(pageSource, /getTrackedExternalCourseLearnerPath\(resolution\.context\.courseSlug\)/);
  assert.match(acceptanceSource, /href=\{activation\.learnerPath\}/);
  assert.match(acceptanceSource, /href=\{context\.learnerPath\}/);

  console.log(JSON.stringify({
    hrbaInvitationLaunch: "secured-external",
    ordinaryHubCourseLaunch: "internal",
    pmInvitationLaunch: "secured-external",
  }, null, 2));
}

await main();
