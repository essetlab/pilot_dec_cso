import { HRBA_COURSE_MODULES } from '../data/hrbaCourseModules';
import type { LearningState } from '../state/learningState';

const MESSAGE_TYPE = 'cso-learning-hub:external-course-progress';

type SequenceItem = {
  'Screen/State ID'?: string;
  Layer?: string;
};

function getSearchParams() {
  return new URLSearchParams(window.location.search);
}

function splitOrigins(value: string | undefined) {
  return (value ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function getAllowedPortalOrigins() {
  return Array.from(
    new Set([
      ...splitOrigins(import.meta.env.VITE_PORTAL_ORIGINS),
      'http://localhost:3000',
    ]),
  );
}

function getTargetPortalOrigin() {
  const params = getSearchParams();
  const requestedOrigin = params.get('portalOrigin');
  const allowedOrigins = getAllowedPortalOrigins();

  if (requestedOrigin && allowedOrigins.includes(requestedOrigin)) {
    return requestedOrigin;
  }

  if (document.referrer) {
    try {
      const referrerOrigin = new URL(document.referrer).origin;
      if (allowedOrigins.includes(referrerOrigin)) {
        return referrerOrigin;
      }
    } catch {
      return null;
    }
  }

  return null;
}

function getLaunchContext() {
  const params = getSearchParams();

  return {
    courseSlug: params.get('courseSlug') ?? '',
    courseVersionId: params.get('courseVersionId') ?? '',
    embed: params.get('embed') === 'portal',
    enrollmentId: params.get('enrollmentId') ?? '',
    userId: params.get('userId') ?? '',
  };
}

function getRequiredModuleIds() {
  return HRBA_COURSE_MODULES
    .filter((module) => module.contentAvailable)
    .map((module) => module.moduleId);
}

function getCompletedModuleIds(state: LearningState) {
  const completed = new Set(state.completedModules);

  for (const courseModule of HRBA_COURSE_MODULES) {
    const progress = state.screenProgress[courseModule.moduleId] ?? [];
    if (
      progress.includes(courseModule.completionScreenId) ||
      (
        state.currentModuleId === courseModule.moduleId &&
        state.currentScreenId === courseModule.completionScreenId
      )
    ) {
      completed.add(courseModule.moduleId);
    }
  }

  return Array.from(completed);
}

function currentScreenProgressPercent(
  state: LearningState,
  sequenceData: SequenceItem[],
) {
  if (!state.currentModuleId || !state.currentScreenId) {
    return 0;
  }

  const playerScreens = sequenceData.filter((item) => item.Layer === 'Layer 2 Player');
  const currentIndex = playerScreens.findIndex(
    (item) => item['Screen/State ID'] === state.currentScreenId,
  );

  if (currentIndex < 0 || playerScreens.length === 0) {
    return 0;
  }

  return (currentIndex + 1) / playerScreens.length;
}

export function emitPortalProgress(
  state: LearningState,
  sequenceData: SequenceItem[],
) {
  if (typeof window === 'undefined' || window.parent === window) {
    return;
  }

  const context = getLaunchContext();
  if (
    !context.embed ||
    !context.courseSlug ||
    !context.userId ||
    !context.enrollmentId ||
    !context.courseVersionId
  ) {
    return;
  }

  const targetOrigin = getTargetPortalOrigin();
  if (!targetOrigin) {
    return;
  }

  const requiredModuleIds = getRequiredModuleIds();
  const completedModuleIds = getCompletedModuleIds(state).filter((moduleId) =>
    requiredModuleIds.includes(moduleId),
  );
  const completedCount = completedModuleIds.length;
  const currentModuleIndex = Math.max(
    0,
    requiredModuleIds.indexOf(state.currentModuleId ?? ''),
  );
  const currentModuleProgress = completedModuleIds.includes(state.currentModuleId ?? '')
    ? 1
    : currentScreenProgressPercent(state, sequenceData);
  const progressPercent = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        ((completedCount + (completedModuleIds.length === requiredModuleIds.length ? 0 : currentModuleIndex > -1 ? currentModuleProgress : 0)) /
          requiredModuleIds.length) *
          100,
      ),
    ),
  );
  const completed = requiredModuleIds.every((moduleId) =>
    completedModuleIds.includes(moduleId),
  );

  window.parent.postMessage(
    {
      type: MESSAGE_TYPE,
      version: 1,
      completed,
      completedModuleIds,
      courseSlug: context.courseSlug,
      courseVersionId: context.courseVersionId,
      currentModuleId: state.currentModuleId,
      currentScreenId: state.currentScreenId,
      enrollmentId: context.enrollmentId,
      progressPercent: completed ? 100 : progressPercent,
      sentAt: new Date().toISOString(),
      userId: context.userId,
    },
    targetOrigin,
  );
}
