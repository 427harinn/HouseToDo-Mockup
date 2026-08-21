# Tasks

## Completed milestone: M0 — Repository preparation

- [x] Repository preparation complete.

## Completed milestone: M1 — React/Vite mockup foundation

- [x] React/Vite/TypeScript foundation complete.
- [x] Hash routing, tokens, fixture architecture, tests, and quality gates complete.
- [x] PR #1 merged to `main`.

## Completed milestone: M2 — Shared app shell

- [x] Shared mobile AppShell, BottomNavigation, Add action, safe-area behavior, tests, and screenshots complete.
- [x] PR #2 merged to `main`.

## Completed milestone: M3 — Home mockup

- [x] Home states, task interactions, completed section, shopping summary, tests, and screenshots complete.
- [x] PR #3 merged to `main`.

## Completed milestone: M4 — Calendar mockup

- [x] Month grid, 5/6-week behavior, date sheet, gestures, tests, and screenshots complete.
- [x] PR #4 merged to `main`.

## Completed milestone: M5 — Shopping mockup

- [x] Shopping rows, purchase/restore, swipe edit, reorder, tests, and screenshots complete.
- [x] PR #5 merged to `main`.

## Adapter baseline completed between M5 and M6

- [x] PR #6 (`feat/uilab-v1-adapter`) merged to `main`.
- [x] Adapter v1 `.uilab` metadata created for Home / Calendar / Shopping.
- [x] 3 screens / 20 states / 41 semantic component definitions validated.
- [x] Single-file UI Lab import build established.
- [x] UI Lab import/edit, Undo/Redo, Project Export/import round trip, and Codex Export validated against the real package.
- [x] UI Lab discovery timing/hash-route compatibility behavior established in Mockup runtime.
- [x] Validation findings documented in `docs/UILAB_V1_HOUSETODO_VALIDATION.md`.

## Completed milestone: M6 — Add / Edit forms

- [x] Task and Shopping add/edit routes complete.
- [x] Center Add navigation complete.
- [x] Reuse/repeat/assignee selection complete.
- [x] Responsive form behavior and deterministic states complete.
- [x] Tests, screenshots, review corrections complete.
- [x] PR #7 merged to `main`.

## Completed milestone: M7 — Other / Settings

- [x] Other landing complete.
- [x] Members / Notifications / Household / Account routes complete.
- [x] Local invite / notification / timezone / logout mock interactions complete.
- [x] Required deterministic `uilabState` states complete.
- [x] Responsive behavior, tests, screenshots, and review complete.
- [x] PR #8 merged to `main`.

## Current milestone: M8 — UI Lab adapter/package update

M8 implementation is approved.
Follow `docs/M8_IMPLEMENTATION_SPEC.md`, `docs/UILAB_V1_HOUSETODO_VALIDATION.md`, `docs/UI_LAB_ADAPTER_SPEC_v1.md`, `DESIGN.md`, and `docs/CODEX_WORKFLOW.md`.

**Important:** M8 is an update of the proven PR #6 adapter implementation already present on `main`, not a from-scratch adapter rewrite.

This is the final mockup milestone. Stop for review after opening the PR; do not merge automatically.

Mandatory workflow:

- [ ] Update to latest `main` before starting.
- [ ] Create a dedicated M8 update branch before implementation.
- [ ] Inspect PR #6 / `docs/UILAB_V1_HOUSETODO_VALIDATION.md` before changing adapter/runtime behavior.
- [ ] Preserve PR #6 `flushSync`, embedded hash-route reload/discovery compatibility, and single-file classic-script build behavior unless real UI Lab regression proves a safe replacement.
- [ ] Audit current `.uilab/project.json`; keep Adapter v1 contract stable.
- [ ] Extend existing `.uilab/screens.json` from 3 screens to all current M1–M7 user-reviewable routes.
- [ ] Extend existing `.uilab/states.json` from the proven baseline using exact currently implemented `uilabState` IDs.
- [ ] Extend existing 41-component `.uilab/components.json` inventory for meaningful M6/M7 edit targets without unnecessarily renaming proven semantic IDs.
- [ ] Audit `.uilab/tokens.json` against current CSS tokens and only update genuine design-system changes.
- [ ] Audit `data-uilab-component` / `data-uilab-id` coverage and uniqueness; make only minimal adapter corrections where required.
- [ ] Update existing `scripts/build-uilab-package.mjs` for any M6/M7 assets while retaining the proven import behavior.
- [ ] Ensure UI Lab import build remains dev-server/backend/API/auth/service-worker/localhost independent.
- [ ] Add npm scripts for `build:uilab`, `validate:uilab`, and `package:uilab`.
- [ ] Keep/reuse existing packaging flow; prefer a reproducible cross-platform npm path while preserving the same ZIP root contract.
- [ ] Add deterministic repository-side Adapter validation that iterates declared metadata.
- [ ] Validate screen/defaultState/state consistency and component selector structure.
- [ ] Validate required entry and ZIP root layout.
- [ ] Validate rendered adapter IDs/selectors where practical using existing tooling.
- [ ] Run a real UI Lab regression import of the updated package, using the existing/current integration harness where available.
- [ ] Verify at least one previously proven Home/Calendar/Shopping edit target still edits correctly.
- [ ] Verify at least one new M6/M7 semantic target edits correctly.
- [ ] Verify screen/state switching including a new M6/M7 route.
- [ ] Verify Project Export/import round trip still restores the updated project.
- [ ] Verify Codex Export still contains actionable semantic component/instance IDs.
- [ ] If real UI Lab validation cannot run, stop and report the missing prerequisite instead of claiming success.
- [ ] Update `docs/UILAB_V1_HOUSETODO_VALIDATION.md` with final M8 regression results while preserving prior PR #6 findings.
- [ ] Inspect generated ZIP and report filename/size/top-level layout.
- [ ] Keep temporary staging/cache output out of Git; retain/update final validation evidence according to the established PR #6 convention.
- [ ] Keep all M1–M7 tests passing.
- [ ] Run lint/typecheck/test/build successfully.
- [ ] Run build:uilab / validate:uilab / package:uilab successfully.
- [ ] Capture required screenshots/evidence from the final-HEAD updated UI Lab import package, not the dev server.
- [ ] Add a clearly labeled `Screenshots` section to the PR body.
- [ ] Update this file with actual M8 completion state.
- [ ] Commit and push the M8 update branch.
- [ ] Open a draft Pull Request targeting `main`.
- [ ] Do not merge the PR.
- [ ] Report branch, commit, PR, changed files, dependencies, retained PR #6 behavior, adapter counts before/after, checks, package details, real UI Lab regression/round-trip/Codex Export results, screenshots, deviations, and working tree state.
