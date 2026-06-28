import "dotenv/config";

import { registerHrbaExternalCourse } from "../src/lib/external-course-workflow";

async function main() {
  const course = await registerHrbaExternalCourse();

  console.log(
    JSON.stringify(
      {
        courseId: course.id,
        slug: course.slug,
        status: course.status,
        title: course.title,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    const { prisma } = await import("../src/lib/prisma");
    await prisma.$disconnect();
  });
