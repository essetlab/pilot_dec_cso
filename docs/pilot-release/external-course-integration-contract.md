# External Course Integration Contract

## Purpose and compatibility

This document defines the smallest Phase One contract for safely connecting externally delivered courses to the CSO Learning Hub. The existing HRBA launch-token and legacy progress-message flow remains supported without changes.

New External Course Manager records use a versioned `externalCourseManager` object inside `Course.analysisMetadataJson`. The manager does not change or replace the existing HRBA `externalCourse` metadata.

## Integration modes

### External link

- Opens the validated external URL in a new tab.
- The Hub does not append user, enrollment, course-version, or other raw Hub record IDs.
- Reliable progress, completion, assessment, and automatic Hub certificates are not claimed.

### Embedded course

- Opens the validated external URL in a sandboxed iframe inside the authenticated learner area.
- The approved origin must exactly match the external URL origin.
- Reload and open-in-new-tab controls are always available.
- A visible fallback explains that providers may block embedding with `X-Frame-Options` or Content Security Policy.
- Reliable progress, completion, assessment, and automatic Hub certificates are not claimed.

### Hub-tracked external course

- Uses the protected HRBA integration as the reference implementation.
- A new course may be configured and saved as Draft or Coming soon.
- Available publication is blocked until a course-specific trusted adapter validates origin, launch token, progress, assessment, completion, and certificate rules.

## URL and origin requirements

- HTTPS is required.
- HTTP is accepted only for `localhost`, `127.0.0.1`, or `::1` during local development.
- `javascript:`, `data:`, `file:`, credentials in URLs, protocol-relative URLs, and unsafe remote HTTP URLs are rejected.
- Query parameters named `userId`, `enrollmentId`, or `courseVersionId` are rejected.
- An approved origin must contain only scheme, hostname, and optional port, and must exactly match the configured external URL origin.
- External progress messages are ignored unless `MessageEvent.origin` equals the server-provided allowed origin and the course slug matches the active launch.

## Version 1 event envelope

New integrations may send this backward-compatible envelope:

```ts
{
  type: "cso-learning-hub:external-course-event";
  version: 1;
  event:
    | "course_ready"
    | "course_started"
    | "progress_updated"
    | "module_completed"
    | "assessment_completed"
    | "course_completed"
    | "integration_error";
  courseSlug: string;
  sentAt: string;
  progressPercent?: number;
  completedModuleIds?: string[];
  currentModuleId?: string | null;
  currentScreenId?: string | null;
  assessment?: {
    attemptNumber?: number;
    maxScore?: number;
    passed?: boolean;
    percentage?: number;
    score?: number;
    submittedAt?: string;
  };
  error?: {
    code: string;
    message?: string;
  };
}
```

Required for every event:

- `type`
- `version`
- `event`
- `courseSlug`
- `sentAt`

Additional requirements:

- `progress_updated`, `module_completed`, and `assessment_completed` require `progressPercent`.
- `course_completed` requires `progressPercent: 100`.
- `integration_error` requires `error.code`.
- `completedModuleIds`, current module/screen, assessment detail, and a human-readable error message are optional.
- Progress must be finite and between 0 and 100.
- Assessment percentages must be between 0 and 100; scores cannot be negative or exceed `maxScore`; attempt numbers begin at 1.

The event envelope intentionally contains no launch token or raw Hub user, enrollment, or course-version IDs.

## Legacy HRBA message

The existing message remains accepted:

```ts
{
  type: "cso-learning-hub:external-course-progress";
  version: 1;
  courseSlug: string;
  progressPercent: number;
  completed: boolean;
  completedModuleIds: string[];
  currentModuleId: string | null;
  currentScreenId: string | null;
  sentAt: string;
  assessment?: ExternalCourseAssessmentResult;
}
```

The Hub frame converts supported new-envelope progress events into this existing same-origin persistence request. The protected launch token is attached by the Hub frame, not supplied by the external course.

## Token and persistence validation

For Hub-tracked HRBA events:

1. The browser rejects events from an origin other than the server-provided allowed origin.
2. The browser rejects a different course slug.
3. The Hub sends the event to its same-origin progress API with the protected launch token.
4. The server validates the signed launch token, authenticated learner session, expected course, allowed origin, progress limits, and assessment limits.
5. Completion and certificate records are created only through the existing server-side HRBA rules.

External-link and generic embedded modes never call the progress API and cannot issue an automatic Hub certificate.

## Course state behavior

| Manager state | Database state | Public behavior |
|---|---|---|
| Draft | `DRAFT` + `PRIVATE` | Not listed and not launchable |
| Coming soon | `PUBLISHED` + `PUBLIC` | Catalogue and overview visible; launch blocked |
| Available | `PUBLISHED` + `PUBLIC` | Catalogue, overview, and configured safe launch available |
| Unpublished | `UNPUBLISHED` + `PRIVATE` | Removed publicly; records retained |

## Known limitations

- Arbitrary external sites may refuse iframe embedding.
- External link and generic embedded modes cannot provide reliable Hub progress or completion.
- A Hub-tracked course requires course-specific adapter verification before Available publication.
- No service-role credential is used or exposed by this manager.
- No Project Management course integration is included in P2C-A.
