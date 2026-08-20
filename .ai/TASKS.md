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

## Current milestone: M3 — Home mockup

M3 implementation is approved.
Follow `docs/M3_IMPLEMENTATION_SPEC.md`, `DESIGN.md`, and `docs/CODEX_WORKFLOW.md`.
Do not begin M4 automatically after finishing M3; stop for review.

Mandatory workflow:

- [ ] Update to latest `main` before starting.
- [ ] Create a dedicated M3 branch before implementation.
- [ ] Replace the Home placeholder with the real Home mockup.
- [ ] Add screen-aware Home fixtures and required `uilabState` states.
- [ ] Implement urgency-sorted active task list.
- [ ] Implement task check colors and overdue rules from `DESIGN.md`.
- [ ] Show assignee avatar only when a specific assignee exists.
- [ ] Implement mock tap-to-complete interaction and restrained completion animation.
- [ ] Represent left-swipe `編集 / パス` interaction without exposing delete.
- [ ] Implement collapsed/expanded completed section.
- [ ] Implement Home shopping summary navigation.
- [ ] Implement empty state.
- [ ] Validate 390×844 and narrow mobile viewport behavior.
- [ ] Add/update Home behavior tests while keeping M1/M2 tests passing.
- [ ] Confirm no backend/API dependency exists.
- [ ] Run lint/typecheck/test/build successfully.
- [ ] Capture required screenshots from the final PR HEAD.
- [ ] Add a clearly labeled `Screenshots` section to the PR body.
- [ ] Update this file with actual M3 completion state.
- [ ] Commit and push the M3 branch.
- [ ] Open a draft Pull Request targeting `main`.
- [ ] Do not merge the PR.
- [ ] Do not begin M4.
- [ ] Report branch, commit, PR, changed files, dependencies, checks, screenshots, states, and deviations.
