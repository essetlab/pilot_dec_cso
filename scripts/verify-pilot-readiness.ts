import "dotenv/config";

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { CourseStatus, CourseVisibility } from "../src/generated/prisma/enums";
import { PILOT_CATALOGUE_COURSE_IDENTITIES } from "../src/lib/catalogue-course-identities";
import { ETHIOPIA_REGIONS, LEARNER_ROLE_OPTIONS, SUPPORTED_LANGUAGE_OPTIONS } from "../src/lib/controlled-options";
import { prisma } from "../src/lib/prisma";

const source = (file: string) => readFileSync(file, "utf8");

assert.equal(PILOT_CATALOGUE_COURSE_IDENTITIES.length, 9);
assert.deepEqual(PILOT_CATALOGUE_COURSE_IDENTITIES.map((course) => course.displayOrder), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
assert.equal(new Set(ETHIOPIA_REGIONS).size, ETHIOPIA_REGIONS.length);
assert(LEARNER_ROLE_OPTIONS.includes("Other"));
assert.deepEqual(SUPPORTED_LANGUAGE_OPTIONS, ["English", "Amharic", "Afan Oromo", "Tigrinya"]);

const invitationForm = source("src/components/admin/CourseInvitationActions.tsx");
assert.match(invitationForm, /Before creating an invitation/);
assert.match(invitationForm, /type="search"/);
assert.match(invitationForm, /ETHIOPIA_REGIONS\.map/);
assert.match(invitationForm, /disabled=\{!courseId\}/);
assert.match(invitationForm, /disabled=\{!organizationId\}/);
assert.doesNotMatch(invitationForm, /Approved organization|Approved course version/);

const registrationAction = source("src/app/(auth)/register/actions.ts");
const registrationPage = source("src/app/(auth)/register/page.tsx");
assert.match(registrationAction, /resolveCourseInvitationToken/);
assert.match(registrationPage, /Invitation-controlled access/);
assert.match(registrationPage, /Preferred language/);
assert.match(registrationPage, /LEARNER_ROLE_OPTIONS\.map/);

const player = source("src/components/learner/LearnerCoursePlayer.tsx");
assert.match(player, /\{\{learnerName\}\}/);
assert.match(player, /course\.finalTestQuestions\.length > 0/);

const catalogueRecords = await prisma.course.findMany({
  select: { slug: true, status: true, title: true, visibility: true },
  where: { slug: { in: PILOT_CATALOGUE_COURSE_IDENTITIES.map((course) => course.slug) } },
});
assert.equal(catalogueRecords.length, 9);
for (const identity of PILOT_CATALOGUE_COURSE_IDENTITIES) {
  const record = catalogueRecords.find((course) => course.slug === identity.slug);
  assert(record);
  assert.equal(record.title, identity.title);
}
const hrba = catalogueRecords.find((course) => course.slug === PILOT_CATALOGUE_COURSE_IDENTITIES[0].slug);
assert.equal(hrba?.status, CourseStatus.PUBLISHED);
assert.equal(hrba?.visibility, CourseVisibility.ASSIGNED_ONLY);

const demo = await prisma.course.findUnique({
  include: { versions: { include: { modules: { include: { lessons: { include: { contentBlocks: true } } } }, quizzes: true } } },
  where: { slug: "welcome-to-cso-learning-hub" },
});
assert(demo);
assert.equal(demo.title, "Welcome to the CSO Learning Hub");
assert.equal(demo.status, CourseStatus.PUBLISHED);
assert.equal(demo.visibility, CourseVisibility.PUBLIC);
assert.equal(demo.certificateEligible, false);
assert.equal(demo.finalTestRequired, false);
assert.equal(demo.versions[0]?.modules[0]?.lessons.length, 4);
assert.equal(demo.versions[0]?.quizzes.length, 0);
assert(demo.versions[0]?.modules[0]?.lessons[0]?.contentBlocks.some((block) => JSON.stringify(block.configJson).includes("{{learnerName}}")));

const regionCount = await prisma.referenceDataItem.count({
  where: { category: "regions", isActive: true, label: { in: [...ETHIOPIA_REGIONS] } },
});
assert.equal(regionCount, ETHIOPIA_REGIONS.length);

console.log("Pilot readiness verification passed: structured controls, nine catalogue records, controlled regions, and open demo course.");
await prisma.$disconnect();
