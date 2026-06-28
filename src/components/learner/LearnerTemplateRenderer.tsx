import { LearnerCoursePlayer } from "@/components/learner/LearnerCoursePlayer";
import type { LearnerCourseDetail } from "@/lib/course-types";

export type LearnerTemplateRendererProps = {
  activeLessonId?: string;
  baseHref?: string;
  course: LearnerCourseDetail;
  finalTestHref?: string;
  previewMode?: boolean;
};

export function LearnerTemplateRenderer(props: LearnerTemplateRendererProps) {
  return <LearnerCoursePlayer {...props} />;
}
