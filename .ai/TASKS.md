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

- [ ] Update to latest `main` before starting.
- [ ] Create a dedicated M7 branch before implementation.
- [ ] Replace `#/other` placeholder with the real Other screen.
- [ ] Add `#/other/members`.
- [ ] Add `#/other/notifications`.
- [ ] Add `#/other/household`.
- [ ] Add `#/other/account`.
- [ ] Implement four-row Other navigation without cards/subtitles.
- [ ] Implement Members list with avatar/name.
- [ ] Implement minimal local invite sheet and mock copy feedback.
- [ ] Implement morning/evening summary notification toggles.
- [ ] Hide each notification time control when its toggle is OFF.
- [ ] Implement household name and timezone settings.
- [ ] Implement timezone selection and household mock Save.
- [ ] Implement minimal Account screen.
- [ ] Implement separated Logout action and confirmation mock.
- [ ] Add required deterministic `uilabState` states.
- [ ] Keep BottomNavigation on Other landing and hide it on deeper settings routes.
- [ ] Validate 390×844 and 320×568 responsive behavior.
- [ ] Add/update behavior tests while keeping M1–M6 tests passing.
- [ ] Confirm no backend/API/auth/push dependency exists.
- [ ] Run lint/typecheck/test/build successfully.
- [ ] Capture all required screenshots from final PR HEAD.
- [ ] Add a clearly labeled `Screenshots` section to the PR body.
- [ ] Update this file with actual M7 completion state.
- [ ] Commit and push the M7 branch.
- [ ] Open a draft Pull Request targeting `main`.
- [ ] Do not merge the PR.
- [ ] Do not begin M8.
- [ ] Report branch, commit, PR, files, dependencies, checks, routes/states, screenshots, behavior decisions, and deviations.
