import { CataloguePage } from "@/components/public/CataloguePage";
import { CourseDetailPage } from "@/components/public/CourseDetailPage";
import {
  getPublicCourseBySlug,
  getPublicCourseSummaries,
  type PublicCourseFilters,
} from "@/lib/course-data";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    segments?: string[];
  }>;
  searchParams: Promise<PublicCourseFilters>;
};

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

  return <CourseDetailPage course={course} />;
}
