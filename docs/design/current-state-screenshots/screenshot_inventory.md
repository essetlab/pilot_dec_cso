# CSO Learning Hub: Current-State Screenshot Inventory

## Capture context

| Field | Value |
| --- | --- |
| Capture date | 2026-08-02 |
| Repository | `D:\z CDP-Lg-Andy-pilot-integration` |
| Branch | `feature/cso-hub-revamp-foundations` |
| Commit | `e9d72be353cbcd6c76d7d5ddc5eed40a8267b3b9` |
| Environment | No existing local application listener was detected. The browser-control interface required for screenshot capture was unavailable in this session. |
| Data access | No database, staging, pilot, or production environment was accessed. No authentication was bypassed and no data was created. |
| Capture result | No screenshots were created. The local application was not started through an alternate setup, and no substitute browser automation method was used. |

## Capture matrix

All records below are retained so the project owner can see the complete planned capture set and the exact current limitation. `Not captured` is not a visual finding.

| Page name | Route | Viewport | Data classification | Render result | Visible observations | Review status |
| --- | --- | --- | --- | --- | --- | --- |
| Homepage | `/` | Desktop, 1440px | Public | Not captured; no local listener/browser-control interface available. | None; page was not rendered. | Not reviewable. |
| Homepage | `/` | Mobile, 390px | Public | Not captured; no local listener/browser-control interface available. | None; page was not rendered. | Not reviewable. |
| Catalogue | `/courses` | Desktop, 1440px | Public | Not captured; no local listener/browser-control interface available. | None; page was not rendered. | Not reviewable. |
| Catalogue | `/courses` | Mobile, 390px | Public | Not captured; no local listener/browser-control interface available. | None; page was not rendered. | Not reviewable. |
| Available course detail | `/courses/applying-human-rights-based-approach-in-cso-practice` | Desktop, 1440px | Public | Not captured; no local listener/browser-control interface available. | None; page was not rendered. | Not reviewable. |
| Available course detail | `/courses/applying-human-rights-based-approach-in-cso-practice` | Mobile, 390px | Public | Not captured; no local listener/browser-control interface available. | None; page was not rendered. | Not reviewable. |
| Support | `/support` | Desktop, 1440px | Public | Not captured; no local listener/browser-control interface available. | None; page was not rendered. | Not reviewable. |
| Support | `/support` | Mobile, 390px | Public | Not captured; no local listener/browser-control interface available. | None; page was not rendered. | Not reviewable. |
| Certificate verification | `/verify-certificate` | Desktop, 1440px | Public | Not captured; no local listener/browser-control interface available. | None; page was not rendered. | Not reviewable. |
| Certificate verification | `/verify-certificate` | Mobile, 390px | Public | Not captured; no local listener/browser-control interface available. | None; page was not rendered. | Not reviewable. |
| Sign in | `/sign-in` | Desktop, 1440px | Public authentication surface | Not captured; no local listener/browser-control interface available. | None; page was not rendered. | Not reviewable. |
| Sign in | `/sign-in` | Mobile, 390px | Public authentication surface | Not captured; no local listener/browser-control interface available. | None; page was not rendered. | Not reviewable. |
| Registration | `/register` | Desktop, 1440px | Public authentication surface | Not captured; no local listener/browser-control interface available. | None; page was not rendered. | Not reviewable. |
| Registration | `/register` | Mobile, 390px | Public authentication surface | Not captured; no local listener/browser-control interface available. | None; page was not rendered. | Not reviewable. |
| Forgot password | `/forgot-password` | Desktop, 1440px | Public authentication surface | Not captured; no local listener/browser-control interface available. | None; page was not rendered. | Not reviewable. |
| Forgot password | `/forgot-password` | Mobile, 390px | Public authentication surface | Not captured; no local listener/browser-control interface available. | None; page was not rendered. | Not reviewable. |
| Reset password | `/reset-password` | Desktop and mobile | Token-dependent authentication surface | Not captured; no token was supplied and no local listener/browser-control interface was available. | None; page was not rendered. | Not reviewable. |
| Learner dashboard | `/learn` | Desktop and mobile | Existing authorised local state only | Not captured; no existing authorised local state was inspected or bypassed. | None; page was not rendered. | Not reviewable. |
| My Learning | `/learn/my-courses` | Desktop and mobile | Existing authorised local state only | Not captured; no existing authorised local state was inspected or bypassed. | None; page was not rendered. | Not reviewable. |
| Certificates | `/learn/certificates` | Desktop and mobile | Existing authorised local state only | Not captured; no existing authorised local state was inspected or bypassed. | None; page was not rendered. | Not reviewable. |
| Course Player | `/learn/courses/applying-human-rights-based-approach-in-cso-practice` | Desktop and mobile | Existing authorised local state only | Not captured; no existing authorised local state was inspected or bypassed. | None; page was not rendered. | Not reviewable. |
| Administrator shell | `/admin` | Desktop and mobile | Administrator data and authenticated surface | Not captured in the current local environment. The closeout record states that the route requires an unavailable database connection. | None; page was not rendered. | Not reviewable. |
| Administrator dashboard | `/admin` | Desktop and mobile | Administrator data and authenticated surface | Not captured in the current local environment. The closeout record states that the route requires an unavailable database connection. | None; page was not rendered. | Not reviewable. |

## File verification

- Screenshot files: none created; therefore no screenshot-file size or filename check applies.
- Inventory filename: `screenshot_inventory.md`.
- Sensitive-data review: no screenshots were created, and no passwords, tokens, private learner data, or administrator information were exposed.

## Closeout note

This evidence attempt does not reopen the visual revamp or justify an implementation batch. A future capture may be performed only from an already authorised local environment with a functioning browser-control surface; it must not require Docker, WSL, PostgreSQL, mock data, a QA route, fallback logic, or access to staging, pilot, or production systems.
