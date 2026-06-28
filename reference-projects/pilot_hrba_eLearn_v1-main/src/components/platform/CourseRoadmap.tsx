import { HRBA_COURSE_MODULES } from '../../data/hrbaCourseModules';
import ModuleLaunchCard, { type ModuleLaunchStatus } from './ModuleLaunchCard';

interface CourseRoadmapProps {
  completedModules: string[];
  screenProgress: Record<string, string[]>;
  currentModuleId: string | null;
  currentScreenId: string | null;
  onLaunchModule: (moduleId: string, reviewMode: boolean) => void;
}

export default function CourseRoadmap({
  onLaunchModule,
}: CourseRoadmapProps) {
  const statusByModuleId = new Map<string, ModuleLaunchStatus>();

  HRBA_COURSE_MODULES.forEach((module) => {
    if (module.moduleSeq <= 4) {
      statusByModuleId.set(module.moduleId, 'completed');
    } else if (module.moduleSeq === 5) {
      statusByModuleId.set(module.moduleId, 'in-progress');
    } else {
      statusByModuleId.set(module.moduleId, 'locked');
    }
  });

  return (
    <section className="course-roadmap" aria-labelledby="course-roadmap-title">
      <div className="course-roadmap__header">
        <div>
          <p className="course-roadmap__eyebrow">Course structure</p>
          <h3 id="course-roadmap-title">Five-module learning pathway</h3>
        </div>
        <span className="course-roadmap__count" aria-label="Five course modules plus final assessment">
          5 modules + final assessment
        </span>
      </div>

      <div className="course-roadmap__pathway">
        {HRBA_COURSE_MODULES.map((module) => {
          const status = statusByModuleId.get(module.moduleId) || 'locked';
          const lockedMessage = status === 'locked' ? 'Complete to unlock' : undefined;

          return (
            <ModuleLaunchCard
              key={module.moduleId}
              module={module}
              status={status}
              lockedMessage={lockedMessage}
              onLaunch={onLaunchModule}
            />
          );
        })}
      </div>
    </section>
  );
}
