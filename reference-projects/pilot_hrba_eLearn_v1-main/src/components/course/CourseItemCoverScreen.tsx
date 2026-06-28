import type { LearningState } from '../../state/learningState';
import type { HRBAModuleDefinition } from '../../data/hrbaCourseModules';

type CourseItemCoverScreenProps = {
  module: HRBAModuleDefinition;
  onChangeState: (updater: (prev: LearningState) => LearningState) => void;
  onNext: () => void;
};

export default function CourseItemCoverScreen({
  module,
  onChangeState,
  onNext,
}: CourseItemCoverScreenProps) {
  const titleId = `${module.moduleId}-cover-title`;
  const ctaLabel = `Start ${module.itemLabel}`;

  return (
    <section className="m2-cover-screen" aria-labelledby={titleId}>
      <button
        type="button"
        className="m2-cover-screen__back"
        aria-label="Back to course page"
        onClick={() => {
          onChangeState((prev) => ({
            ...prev,
            currentLayer: 'platform',
            currentSubState: null,
            activeModal: null,
          }));
        }}
      >
        <span aria-hidden="true">&lt;</span>
        Back to course
      </button>
      <div className="m2-cover-screen__panel">
        <div className="m2-cover-screen__accent" aria-hidden="true"></div>
        <p className="m2-cover-screen__course">
          Applying the Human Rights-Based Approach in CSO Practice
        </p>
        <p className="m2-cover-screen__module">{module.itemLabel}</p>
        <h1 id={titleId} className="m2-cover-screen__title">
          {module.title}
        </h1>
        {module.subtitle && (
          <p className="m2-cover-screen__subtitle">
            {module.subtitle}
          </p>
        )}
        <p className="m2-cover-screen__focus">
          {module.coverFocus}
        </p>
        <p className="m2-cover-screen__duration">
          <span aria-hidden="true"></span>
          Duration: {module.duration}
        </p>
        <button
          type="button"
          className="m2-cover-screen__cta"
          aria-label={ctaLabel}
          onClick={() => {
            onNext();
            if (module.moduleId === 'module_02_everyday_cso_work' && typeof window !== 'undefined') {
              window.history.pushState(null, '', '/module-2/intro-video');
            } else if (module.moduleId === 'module_04_implementation' && typeof window !== 'undefined') {
              window.history.pushState(null, '', '/module-4/screen-4-1');
            }
          }}
        >
          <span>{ctaLabel}</span>
          <span className="m2-cover-screen__cta-icon" aria-hidden="true"></span>
        </button>
      </div>
      <figure className="m2-cover-screen__image-wrap">
        <img
          src={module.thumbnailSrc}
          alt={module.thumbnailAlt}
          className="m2-cover-screen__image"
        />
      </figure>
    </section>
  );
}
