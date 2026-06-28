import type { HRBAModuleDefinition } from '../../data/hrbaCourseModules';

export type ModuleLaunchStatus = 'locked' | 'not-started' | 'in-progress' | 'completed';

interface ModuleLaunchCardProps {
  module: HRBAModuleDefinition;
  status: ModuleLaunchStatus;
  lockedMessage?: string;
  onLaunch: (moduleId: string, reviewMode: boolean) => void;
}

const statusLabel: Record<ModuleLaunchStatus, string> = {
  locked: 'Locked',
  'not-started': 'Not started',
  'in-progress': 'In progress',
  completed: 'Completed',
};

function getCtaLabel(status: ModuleLaunchStatus, itemLabel: string, lockedMessage?: string) {
  if (status === 'locked') {
    return lockedMessage || 'Complete to unlock';
  }

  if (status === 'completed') {
    return `Review ${itemLabel}`;
  }

  if (status === 'in-progress') {
    return `Resume ${itemLabel}`;
  }

  return `Start ${itemLabel}`;
}

export default function ModuleLaunchCard({
  module,
  status,
  lockedMessage,
  onLaunch,
}: ModuleLaunchCardProps) {
  const isLocked = status === 'locked';
  const ctaLabel = getCtaLabel(status, module.itemLabel, lockedMessage);
  const reviewMode = status === 'completed';
  const descriptionId = `module-${module.moduleSeq}-description`;
  const lockMessageId = `module-${module.moduleSeq}-lock-message`;
  const ctaDescription = isLocked ? lockMessageId : descriptionId;
  const statusIcon = status === 'completed' ? '✓' : status === 'in-progress' ? '◌' : '🔒';

  return (
    <article className={`module-launch-card module-launch-card--${status}`} aria-labelledby={`module-${module.moduleSeq}-title`}>
      <div className="module-launch-card__pathway" aria-hidden="true">
        <span>{module.moduleSeq}</span>
      </div>

      <div className="module-launch-card__media">
        <img src={module.thumbnailSrc} alt={module.thumbnailAlt} loading="lazy" />
      </div>

      <div className="module-launch-card__body">
        <div>
          <span className="module-launch-card__badge">{module.itemLabel}</span>
          <h4 id={`module-${module.moduleSeq}-title`} className="module-launch-card__title">
            {module.title}
          </h4>
          {module.subtitle && (
            <p className="module-launch-card__subtitle">{module.subtitle}</p>
          )}
        </div>

        <p id={descriptionId} className="module-launch-card__description">
          {module.description}
        </p>
        <p id={lockMessageId} className="module-launch-card__lock-message" aria-live="polite">
          {isLocked ? lockedMessage : ''}
        </p>
      </div>

      <div className="module-launch-card__meta-row">
        <span className="module-launch-card__duration" aria-label={`Estimated time: ${module.duration}`}>
          <span aria-hidden="true">◷</span>
          {module.duration}
        </span>
        <span className={`module-launch-card__status module-launch-card__status--${status}`}>
          <span aria-hidden="true">{statusIcon}</span>
          {statusLabel[status]}
        </span>
      </div>

      <button
        type="button"
        className="module-launch-card__cta"
        onClick={() => onLaunch(module.moduleId, reviewMode)}
        disabled={isLocked}
        aria-disabled={isLocked}
        aria-describedby={ctaDescription}
        aria-label={`${ctaLabel}: ${module.title}`}
      >
        <span>{ctaLabel}</span>
        <span aria-hidden="true">›</span>
      </button>
    </article>
  );
}
