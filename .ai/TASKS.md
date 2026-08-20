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

## Current milestone: M2 — Shared app shell

M2 implementation is approved.
Follow `docs/M2_IMPLEMENTATION_SPEC.md`, `DESIGN.md`, and `docs/CODEX_WORKFLOW.md`.
Do not begin M3 automatically after finishing M2; stop for review.

Mandatory workflow:

- [ ] Update to latest `main` before starting.
- [ ] Create a dedicated M2 branch before implementation.
- [ ] Implement shared smartphone AppShell.
- [ ] Add Home / Calendar / Shopping / Other hash routes.
- [ ] Add five-position icon-only bottom navigation in the required order.
- [ ] Add selected/current navigation state and accessibility labels.
- [ ] Add safe-area-aware scroll/content behavior.
- [ ] Add lightweight center Add action with `家事 / 買い物` choices only.
- [ ] Establish shared icon and minimal motion conventions.
- [ ] Add/update behavior tests for shell/navigation/Add action.
- [ ] Confirm `uilabState` hash query remains functional.
- [ ] Confirm no backend/API dependency exists.
- [ ] Run lint/typecheck/test/build successfully.
- [ ] Update this file with actual M2 completion state.
- [ ] Commit and push the M2 branch.
- [ ] Open a draft Pull Request targeting `main`.
- [ ] Do not merge the PR.
- [ ] Do not begin M3.
- [ ] Report branch, commit, PR, changed files, dependencies, checks, and deviations.
