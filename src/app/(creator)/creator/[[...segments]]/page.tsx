import { CreatorBuildStudio } from "@/components/creator/CreatorBuildStudio";
import { CreatorCourseMetadata } from "@/components/creator/CreatorCourseMetadata";
import { CreatorCourseSetup } from "@/components/creator/CreatorCourseSetup";
import { CreatorFinalTestSetup } from "@/components/creator/CreatorFinalTestSetup";
import { CreatorLearningOutcomes } from "@/components/creator/CreatorLearningOutcomes";
import { CreatorMyCourses } from "@/components/creator/CreatorMyCourses";
import { CreatorPreview } from "@/components/creator/CreatorPreview";
import { CreatorResources } from "@/components/creator/CreatorResources";
import { CreatorSubmitFeedback } from "@/components/creator/CreatorSubmitFeedback";
import { EmptyState, PlaceholderPage } from "@/components/shell/PlaceholderPage";
import { canAccessPath } from "@/lib/auth/permissions";
import { getCurrentSession } from "@/lib/auth/server";
import { getBuildStudioCourse, getCreatorQuizData } from "@/lib/build-studio-data";
import {
  getCreatorCourseList,
  getCreatorCourseMetadata,
  getCreatorCourseSetup,
} from "@/lib/creator-course-workflow";
import { getCreatorPreviewData } from "@/lib/creator-preview-data";
import { getCreatorOutcomesData, getCreatorResourcesData } from "@/lib/creator-materials-workflow";
import { getCreatorReviewCourse } from "@/lib/review-workflow";
import { creatorRoutes, matchRoute, routeFromSegments } from "@/lib/routes";
import { notFound, redirect } from "next/navigation";

type PageProps = {
  params: Promise<{
    segments?: string[];
  }>;
  searchParams: Promise<{
    blockId?: string;
    lessonId?: string;
    materialsNotice?: string;
    metadataNotice?: string;
    reviewNotice?: string;
    setupNotice?: string;
    studioNotice?: string;
  }>;
};

export default async function CreatorPage({ params, searchParams }: PageProps) {
  const { segments = [] } = await params;
  const {
    blockId,
    lessonId,
    materialsNotice,
    metadataNotice,
    reviewNotice,
    setupNotice,
    studioNotice,
  } = await searchParams;
  const actualRoute = routeFromSegments("creator", segments);
  const definition = matchRoute(actualRoute, creatorRoutes);
  const session = await getCurrentSession();

  if (!session) {
    redirect(`/sign-in?next=${encodeURIComponent(actualRoute)}`);
  }

  if (!canAccessPath(session, actualRoute)) {
    redirect(`/unauthorized?from=${encodeURIComponent(actualRoute)}`);
  }

  if (actualRoute === "/creator") {
    redirect("/creator/courses");
  }

  if (!definition) {
    notFound();
  }

  const isBuildStudio =
    segments.length === 3 &&
    segments[0] === "courses" &&
    segments[2] === "build";
  const isNewCourse = actualRoute === "/creator/courses/new";
  const isCourseSetup =
    segments.length === 3 &&
    segments[0] === "courses" &&
    segments[2] === "setup";
  const isCourseMetadata =
    segments.length === 3 &&
    segments[0] === "courses" &&
    segments[2] === "metadata";
  const isLearningOutcomes =
    segments.length === 3 &&
    segments[0] === "courses" &&
    segments[2] === "outcomes";
  const isResources =
    segments.length === 3 &&
    segments[0] === "courses" &&
    segments[2] === "resources";
  const isFinalTestSetup =
    segments.length === 3 &&
    segments[0] === "courses" &&
    segments[2] === "quiz";
  const isPreview =
    segments.length === 3 &&
    segments[0] === "courses" &&
    segments[2] === "preview";
  const isSubmitFeedback =
    segments.length === 3 &&
    segments[0] === "courses" &&
    (segments[2] === "submit" || segments[2] === "feedback");

  if (actualRoute === "/creator/courses") {
    const courses = await getCreatorCourseList(session);

    return <CreatorMyCourses data={courses} />;
  }

  if (isBuildStudio) {
    const course = await getBuildStudioCourse(
      segments[1],
      session,
      lessonId,
      blockId,
    );

    return <CreatorBuildStudio course={course} studioNotice={studioNotice} />;
  }

  if (isNewCourse) {
    const setup = await getCreatorCourseSetup(null, session);

    if (!setup) {
      notFound();
    }

    return <CreatorCourseSetup setup={setup} setupNotice={setupNotice} />;
  }

  if (isCourseSetup) {
    const setup = await getCreatorCourseSetup(segments[1], session);

    if (!setup) {
      notFound();
    }

    return <CreatorCourseSetup setup={setup} setupNotice={setupNotice} />;
  }

  if (isCourseMetadata) {
    const metadataData = await getCreatorCourseMetadata(segments[1], session);

    if (!metadataData) {
      notFound();
    }

    return (
      <CreatorCourseMetadata
        data={metadataData}
        metadataNotice={metadataNotice}
      />
    );
  }

  if (isLearningOutcomes) {
    const outcomesData = await getCreatorOutcomesData(segments[1], session);

    if (!outcomesData) {
      notFound();
    }

    return (
      <CreatorLearningOutcomes
        data={outcomesData}
        materialsNotice={materialsNotice}
      />
    );
  }

  if (isResources) {
    const resourcesData = await getCreatorResourcesData(segments[1], session);

    if (!resourcesData) {
      notFound();
    }

    return (
      <CreatorResources
        data={resourcesData}
        materialsNotice={materialsNotice}
      />
    );
  }

  if (isFinalTestSetup) {
    const quizData = await getCreatorQuizData(segments[1], session);
    if (!quizData) {
      notFound();
    }
    return <CreatorFinalTestSetup quizData={quizData} />;
  }

  if (isPreview) {
    const previewData = await getCreatorPreviewData(segments[1], session);

    if (!previewData) {
      notFound();
    }

    return <CreatorPreview activeLessonId={lessonId} data={previewData} />;
  }

  if (isSubmitFeedback) {
    const reviewCourse = await getCreatorReviewCourse(segments[1], session);

    if (!reviewCourse) {
      notFound();
    }

    return (
      <CreatorSubmitFeedback
        course={reviewCourse}
        reviewNotice={reviewNotice}
      />
    );
  }

  return (
    <PlaceholderPage
      purpose={definition.purpose}
      route={actualRoute}
      section="Creator"
      title={definition.title}
    >
      {definition.emptyTitle ? (
        <EmptyState
          description={definition.emptyDescription ?? ""}
          href="/creator/courses/new"
          action="Create new course"
          title={definition.emptyTitle}
        />
      ) : null}
    </PlaceholderPage>
  );
}
