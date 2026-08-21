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

## Completed milestone: M8 — UI Lab adapter/package

M8 implementation and final validation are complete. This is the final mockup milestone; do not create M9 or another milestone.
Follow `docs/M8_IMPLEMENTATION_SPEC.md`, `docs/UI_LAB_ADAPTER_SPEC_v1.md`, `DESIGN.md`, and `docs/CODEX_WORKFLOW.md`.
Stop for review after opening the draft PR; do not merge automatically.

Mandatory workflow:

- [x] Add `.uilab/project.json`.
- [x] Add `.uilab/screens.json` covering all 12 user-reviewable M1–M7 product screens.
- [x] Add `.uilab/states.json` with 48 exact implemented deterministic state IDs.
- [x] Add `.uilab/components.json` with 92 definitions grounded in existing semantic adapter attributes.
- [x] Add `.uilab/tokens.json` grounded in DESIGN/current CSS tokens.
- [x] Audit `data-uilab-component` / `data-uilab-id` coverage and uniqueness.
- [x] Add reproducible single-file UI Lab import build and ZIP packaging scripts.
- [x] Repair inline JavaScript embedding (`$&` replacement-token corruption, callback replacement, `</script` escaping).
- [x] Strengthen validation with metadata checks, required entry/ZIP checks, no-localhost/external-runtime checks, and V8 inline-script syntax checks.
- [x] Verify the final ZIP contains `dist/index.html` and the five `.uilab` files at the required root layout.
- [x] Keep all M1–M7 tests passing and pass lint/typecheck/test/build/build:uilab/validate/package.
- [x] Complete real UI Lab validation: 12-screen rendering, normal and non-normal states, existing Home component edit, M6 component edit, Undo/Redo, Project round trip, and Codex Export.
- [x] Copy final real UI Lab import screenshots to `docs/screenshots/m8/`.
- [x] Update the validation document with M5/M8 counts, root cause, repair, results, ZIP SHA256, and known follow-up.
- [x] Commit and push the M8 branch.
- [x] Open a draft Pull Request targeting `main`.
- [x] Do not merge the PR.
