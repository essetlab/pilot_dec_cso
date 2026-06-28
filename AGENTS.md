# Agent Instructions

## Working Scope

This repository is the Phase 1 CSO Learning Hub implementation. Keep changes aligned with the current e-learning MVP and do not add Phase 2 or Phase 3 product areas unless explicitly requested.

## Read First

- `README.md` for setup, verification, and deployment notes.
- `docs/specs/phase-1-cso-learning-hub/README.md` for the handoff package index.
- `docs/specs/phase-1-cso-learning-hub/CODEX_IMPLEMENTATION_STATUS.md` for current implementation state.
- `docs/specs/phase-1-cso-learning-hub/CODEX_REVISED_IMPLEMENTATION_PLAN.md` for next implementation slices.
- `docs/design/README.md` and `docs/design/00_VISUAL_SOURCE_OF_TRUTH.md` before UI/design work.

## Safety Rules

- Do not commit secrets, `.env`, local SQLite databases, dependency folders, build output, generated Prisma client files, logs, or temporary QA artifacts.
- Keep app logic changes scoped to the requested slice.
- Return an evidence pack after implementation work, including commands run, checks, changed files, risks, and screenshots when UI changed.

## Standard Checks

```powershell
npm run lint
npm run build
npm run prisma:validate
```

Use `npm run build` after route, component, Prisma, or TypeScript changes.
