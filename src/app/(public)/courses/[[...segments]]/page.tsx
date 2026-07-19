import { CataloguePage } from "@/components/public/CataloguePage";
import {
  CourseDetailPage,
  type PublicCourseAction,
} from "@/components/public/CourseDetailPage";
import { getCurrentSession } from "@/lib/auth/server";
import {
  getLearnerCourseBySlug,
  getPublicCourseBySlug,
  getPublicCourseSummaries,
  type PublicCourseFilters,
} from "@/lib/course-data";
import { notFound } from "next/navigation";
import { getCatalogueCourseDefinition } from "@/lib/public-course-catalogue";

type PageProps = {
  params: Promise<{
    segments?: string[];
  }>;
  searchParams: Promise<PublicCourseFilters>;
};

async function getPublicCourseAction(
  course: NonNullable<Awaited<ReturnType<typeof getPublicCourseBySlug>>>,
): Promise<PublicCourseAction | null> {
  if (course.availability !== "available") {
    return null;
  }

  if (course.launchMode === "external_link" && course.externalUrl) {
    return {
      href: course.externalUrl,
      label: "Open course",
      rel: "noreferrer",
      target: "_blank",
    };
  }

  const learnerPath = course.launchMode === "embedded"
    ? `/learn/courses/${course.slug}/external`
    : `/learn/courses/${course.slug}`;
  const session = await getCurrentSession();

  if (!session) {
    return {
      href: `/sign-in?next=${encodeURIComponent(learnerPath)}`,
      label: "Start learning",
    };
  }

  if (course.launchMode === "embedded" && !getCatalogueCourseDefinition(course.slug)) {
    return {
      href: learnerPath,
      label: "Start learning",
    };
  }

  const learnerCourse = await getLearnerCourseBySlug(course.slug, {
    initializeEnrollment: false,
  });

  if (!learnerCourse) {
    return {
      href: "/learn/my-courses",
      label: "Go to My Courses",
    };
  }

  return {
    href: learnerPath,
    label: learnerCourse.progress > 0 ? "Continue learning" : "Start learning",
  };
}

export default async function PublicCoursesPage({ params, searchParams }: PageProps) {
  const { segments = [] } = await params;
  if (segments.length === 0) {
    const filters = await searchParams;
    const courses = await getPublicCourseSummaries(filters);

    return <CataloguePage courses={courses} filters={filters} />;
  }

  if (segments.length > 1) {
    notFound();
  }

  const course = await getPublicCourseBySlug(segments[0]);

  if (!course) {
    notFound();
  }

  const action = await getPublicCourseAction(course);

  return <CourseDetailPage action={action} course={course} />;
}
