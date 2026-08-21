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

## Completed milestone: M8 — UI Lab adapter/package update

M8 is complete. It extends the proven PR #6 adapter implementation already present on `main`; this is the final mockup milestone. Do not create M9 or merge automatically.
Follow `docs/M8_IMPLEMENTATION_SPEC.md`, `docs/UILAB_V1_HOUSETODO_VALIDATION.md`, `docs/UI_LAB_ADAPTER_SPEC_v1.md`, `DESIGN.md`, and `docs/CODEX_WORKFLOW.md`.

- [x] Preserve PR #6 `flushSync`, embedded hash-route reload/discovery compatibility, and single-file classic-script import behavior.
- [x] Extend metadata from 3 screens / 20 states / 41 components to 12 screens / 48 states / 92 components.
- [x] Add and validate M6/M7 screen, state, component, and token coverage.
- [x] Repair inline JavaScript embedding (`$&` replacement-token corruption, callback replacement, `</script` escaping).
- [x] Strengthen validation with metadata, ZIP layout, no-localhost/external-runtime, adapter selector, and V8 syntax checks.
- [x] Keep all M1–M7 tests passing and pass lint/typecheck/test/build/build:uilab/validate/package.
- [x] Complete real UI Lab validation: 12-screen rendering, normal and non-normal states, existing Home edit, M6 component edit, Undo/Redo, Project round trip, and Codex Export.
- [x] Copy final real UI Lab import screenshots to `docs/screenshots/m8/`.
- [x] Update the validation document with M5/M8 counts, root cause, repair, results, ZIP SHA256, and known follow-up.
- [x] Commit and push the M8 branch.
- [x] Open draft PR #9 targeting `main`.
- [x] Do not merge the PR.
