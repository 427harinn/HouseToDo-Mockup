# Tasks

## Completed milestone: M0 — Repository preparation

- [x] Create empty GitHub repository.
- [x] Add README.
- [x] Add `DESIGN.md`.
- [x] Add `.gitignore`.
- [x] Add `.editorconfig`.
- [x] Add `.ai/MILESTONE.md`.
- [x] Add `docs/UI_LAB_ADAPTER_SPEC_v1.md`.
- [x] Review repository preparation files.
- [x] Mark M0 complete.

## Completed milestone: M1 — React/Vite mockup foundation

- [x] Scaffold React + Vite + TypeScript.
- [x] Add Hash Router-compatible routing.
- [x] Create design-token foundation from `DESIGN.md`.
- [x] Add fixture/state architecture and `uilabState` helper.
- [x] Add minimal Foundation route/page for verification only.
- [x] Add base quality scripts: lint, typecheck, test, build.
- [x] Add minimum foundation tests.
- [x] Confirm mockup runs without backend/API access.
- [x] Run lint/typecheck/test/build successfully.
- [x] Merge PR #1 to `main`.

## Completed milestone: M2 — Shared app shell

- [x] Implement shared smartphone AppShell.
- [x] Add Home / Calendar / Shopping / Other hash routes.
- [x] Add five-position icon-only bottom navigation in the required order.
- [x] Add selected/current navigation state and accessibility labels.
- [x] Add safe-area-aware scroll/content behavior.
- [x] Add lightweight center Add action with `家事 / 買い物` choices only.
- [x] Establish shared icon and minimal motion conventions.
- [x] Add/update behavior tests for shell/navigation/Add action.
- [x] Confirm `uilabState` hash query remains functional.
- [x] Confirm no backend/API dependency exists.
- [x] Run lint/typecheck/test/build successfully.
- [x] Add PR screenshots for visible M2 UI states.
- [x] Complete review fixes.
- [x] Merge PR #2 to `main`.

## Completed milestone: M3 — Home mockup

- [x] Replace the Home placeholder with the real Home mockup.
- [x] Add screen-aware Home fixtures and required `uilabState` states.
- [x] Implement urgency-sorted active task list.
- [x] Implement task check colors and overdue rules from `DESIGN.md`.
- [x] Show assignee avatar only when a specific assignee exists.
- [x] Implement mock tap-to-complete interaction and restrained completion animation.
- [x] Represent left-swipe `編集 / パス` interaction without exposing delete.
- [x] Implement collapsed/expanded completed section.
- [x] Implement Home shopping summary navigation.
- [x] Implement empty state.
- [x] Validate 390×844 and narrow mobile viewport behavior.
- [x] Add/update Home behavior tests while keeping M1/M2 tests passing.
- [x] Confirm no backend/API dependency exists.
- [x] Run lint/typecheck/test/build successfully.
- [x] Capture required screenshots from final PR HEAD.
- [x] Complete PR review fixes.
- [x] Merge PR #3 to `main`.

## Completed milestone: M4 — Calendar mockup

- [x] Update to latest `main` before starting.
- [x] Create a dedicated M4 branch before implementation.
- [x] Replace the Calendar placeholder with the real month-view Calendar mockup.
- [x] Add screen-aware Calendar fixtures and required `uilabState` states.
- [x] Implement full 7-column month grid with Saturday/Sunday/today treatments.
- [x] Show only date-meaningful tasks in month cells.
- [x] Implement restrained shared calendar task emphasis and `+N` overflow handling.
- [x] Exclude completed/passed tasks from month cells.
- [x] Implement large date detail sheet with `この日` / `期間中` / completed section.
- [x] Implement date cell/task/`+N` opening the date detail sheet.
- [x] Implement previous/next and horizontal-swipe date navigation.
- [x] Keep detail task completion/pass semantics consistent with Home.
- [x] Validate 390×844 and narrow mobile viewport behavior.
- [x] Add/update Calendar behavior tests while keeping M1–M3 tests passing.
- [x] Confirm no backend/API dependency exists.
- [x] Run lint/typecheck/test/build successfully.
- [x] Capture required screenshots from final PR HEAD.
- [x] Complete PR review fixes.
- [x] Merge PR #4 to `main`.

## Current milestone: M5 — Shopping mockup

M5 implementation is approved.
Follow `docs/M5_IMPLEMENTATION_SPEC.md`, `DESIGN.md`, and `docs/CODEX_WORKFLOW.md`.
Do not begin M6 automatically after finishing M5; stop for review.

Mandatory workflow:

- [ ] Update to latest `main` before starting.
- [ ] Create a dedicated M5 branch before implementation.
- [ ] Replace the Shopping placeholder with the real Shopping list mockup.
- [ ] Add screen-aware Shopping fixtures and required `uilabState` states.
- [ ] Implement oldest-first active list ordering without priority labels.
- [ ] Implement compact collapsed rows with name / memo-photo indicators / quantity.
- [ ] Implement single-open inline row expansion.
- [ ] Implement expanded `購入` / memo / photo presentation.
- [ ] Implement local purchase action and collapsed purchased section.
- [ ] Implement purchased rows with purchase time and purchaser avatar.
- [ ] Implement purchased-row expansion and `戻す` action.
- [ ] Implement unpurchased left-swipe `編集` only; do not expose delete.
- [ ] Implement local reorder behavior representing manual priority.
- [ ] Implement Shopping empty state.
- [ ] Validate 390×844 and narrow mobile viewport behavior.
- [ ] Add/update Shopping behavior tests while keeping M1–M4 tests passing.
- [ ] Confirm no backend/API dependency exists.
- [ ] Run lint/typecheck/test/build successfully.
- [ ] Capture required screenshots from final PR HEAD.
- [ ] Add a clearly labeled `Screenshots` section to the PR body.
- [ ] Update this file with actual M5 completion state.
- [ ] Commit and push the M5 branch.
- [ ] Open a draft Pull Request targeting `main`.
- [ ] Do not merge the PR.
- [ ] Do not begin M6.
- [ ] Report branch, commit, PR, changed files, dependencies, checks, screenshots, states, behavior decisions, and deviations.
