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

## Current milestone: M8 — UI Lab adapter/package

M8 implementation is approved.
Follow `docs/M8_IMPLEMENTATION_SPEC.md`, `docs/UI_LAB_ADAPTER_SPEC_v1.md`, `DESIGN.md`, and `docs/CODEX_WORKFLOW.md`.
This is the final mockup milestone. Stop for review after opening the PR; do not merge automatically.

Mandatory workflow:

- [ ] Update to latest `main` before starting.
- [ ] Create a dedicated M8 branch before implementation.
- [ ] Add `.uilab/project.json`.
- [ ] Add `.uilab/screens.json` covering all user-reviewable M1–M7 product screens.
- [ ] Add `.uilab/states.json` matching the exact implemented deterministic state IDs.
- [ ] Add `.uilab/components.json` grounded in existing semantic adapter attributes.
- [ ] Add `.uilab/tokens.json` grounded in DESIGN/current CSS tokens.
- [ ] Audit `data-uilab-component` / `data-uilab-id` coverage and uniqueness; make only minimal adapter corrections where required.
- [ ] Add reproducible UI Lab import build script.
- [ ] Prefer a single-file `dist/index.html` import artifact without breaking preview behavior.
- [ ] Ensure import build has no backend/API/dev-server/service-worker/localhost dependency.
- [ ] Add deterministic adapter validation.
- [ ] Validate metadata screen/state consistency by iterating declared metadata.
- [ ] Validate required entry and ZIP root layout.
- [ ] Validate component selectors and rendered adapter IDs where practical with existing tooling.
- [ ] Add reproducible UI Lab packaging script producing `dist/` + `.uilab/` ZIP.
- [ ] Inspect generated ZIP and report filename/size/top-level layout.
- [ ] Keep generated artifacts out of Git if repository conventions ignore build/package output.
- [ ] Keep all M1–M7 tests passing.
- [ ] Run lint/typecheck/test/build successfully.
- [ ] Run build:uilab / validate:uilab / package:uilab successfully.
- [ ] Capture required screenshots from the final-HEAD UI Lab import build, not the dev server.
- [ ] Add a clearly labeled `Screenshots` section to the PR body.
- [ ] Update this file with actual M8 completion state.
- [ ] Commit and push the M8 branch.
- [ ] Open a draft Pull Request targeting `main`.
- [ ] Do not merge the PR.
- [ ] Report branch, commit, PR, changed files, dependencies, adapter counts, checks, import build/package details, screenshots, deviations, and working tree state.
