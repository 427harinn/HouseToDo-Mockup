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
- [x] Reuse picker complete.
- [x] Repeat picker with weekday/month-day configuration inside sheet complete.
- [x] Start Date / Date / All-day / Time / Notification rules complete.
- [x] Assignee selection complete.
- [x] Local photo preview complete.
- [x] Save/delete-confirm mock behavior complete.
- [x] Dedicated form layout and responsive behavior complete.
- [x] Required `uilabState` states complete.
- [x] Tests and lint/typecheck/build gates complete.
- [x] Final-HEAD screenshots and review corrections complete.
- [x] PR #7 merged to `main`.

## Current milestone: M7 — Other / Settings

M7 implementation is approved.
Follow `docs/M7_IMPLEMENTATION_SPEC.md`, `DESIGN.md`, and `docs/CODEX_WORKFLOW.md`.
Do not begin M8 automatically after finishing M7; stop for review.

Mandatory workflow:

- [x] Update to latest `main` before starting.
- [x] Create a dedicated M7 branch before implementation.
- [x] Replace `#/other` placeholder with the real Other screen.
- [x] Add `#/other/members`.
- [x] Add `#/other/notifications`.
- [x] Add `#/other/household`.
- [x] Add `#/other/account`.
- [x] Implement four-row Other navigation without cards/subtitles.
- [x] Implement Members list with avatar/name.
- [x] Implement minimal local invite sheet and mock copy feedback.
- [x] Implement morning/evening summary notification toggles.
- [x] Hide each notification time control when its toggle is OFF.
- [x] Implement household name and timezone settings.
- [x] Implement timezone selection and household mock Save.
- [x] Implement minimal Account screen.
- [x] Implement separated Logout action and confirmation mock.
- [x] Add required deterministic `uilabState` states.
- [x] Keep BottomNavigation on Other landing and hide it on deeper settings routes.
- [x] Validate 390×844 and 320×568 responsive behavior.
- [x] Add/update behavior tests while keeping M1–M6 tests passing.
- [x] Confirm no backend/API/auth/push dependency exists.
- [x] Run lint/typecheck/test/build successfully.
- [x] Capture all required screenshots from final PR HEAD.
- [x] Add a clearly labeled `Screenshots` section to the PR body.
- [x] Update this file with actual M7 completion state.
- [x] Commit and push the M7 branch.
- [x] Open a draft Pull Request targeting `main`.
- [x] Do not merge the PR.
- [x] Do not begin M8.
- [x] Report branch, commit, PR, files, dependencies, checks, routes/states, screenshots, behavior decisions, and deviations.
