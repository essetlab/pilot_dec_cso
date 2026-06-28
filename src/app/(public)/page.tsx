import { LandingPage } from "@/components/public/LandingPage";
import { getPublicCourseSummaries } from "@/lib/course-data";

export default async function HomePage() {
  const courses = await getPublicCourseSummaries();

  return <LandingPage courses={courses} />;
}
