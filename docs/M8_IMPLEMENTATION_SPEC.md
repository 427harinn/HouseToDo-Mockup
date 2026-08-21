# M8 Implementation Specification — UI Lab adapter/package update

## 1. Goal

M8 is the final mockup milestone. **Do not rebuild the UI Lab adapter from scratch.**

PR #6 (`feat/uilab-v1-adapter`) already implemented and validated the first working HouseToDo Adapter v1 integration and was merged to `main` as commit `91abfbe92cc846945ada61fef305f0f51f6d6a69`.

That work already established:

- `.uilab/project.json`
- `.uilab/screens.json`
- `.uilab/components.json`
- `.uilab/tokens.json`
- `.uilab/states.json`
- single-file `dist/index.html` generation via `scripts/build-uilab-package.mjs`
- ZIP packaging via `scripts/package-uilab.ps1`
- semantic `data-uilab-component` / `data-uilab-id` coverage for the M3–M5 screens
- UI Lab v1 compatibility work in routing/mount timing
- real UI Lab validation of import, element editing, Undo/Redo, project export/import round trip, and Codex Export
- validation evidence in `docs/UILAB_V1_HOUSETODO_VALIDATION.md`

M8 therefore means:

> **Preserve the proven PR #6 integration and extend/update it for the completed M6 and M7 application.**

Primary sources of truth:

- `docs/UILAB_V1_HOUSETODO_VALIDATION.md` — proven PR #6 behavior and compatibility findings
- `docs/UI_LAB_ADAPTER_SPEC_v1.md` — adapter contract
- `DESIGN.md`
- `docs/CODEX_WORKFLOW.md`
- actual routes/states/components currently implemented on `main`

Do not redesign product screens unless an adapter validation issue requires a minimal correction.
Do not implement UI Lab editor functionality in this repository.

## 2. Preserve the verified PR #6 compatibility work

Before changing adapter/build behavior, inspect PR #6 and current `main`.

Important behavior that must not be removed casually:

1. `src/main.tsx` currently uses `flushSync` so React content is committed early enough for UI Lab v1 discovery.
2. `src/app/router.tsx` contains embedded-preview route reload behavior because UI Lab v1 discovery is load-based and otherwise may stay scoped to the previous hash route.
3. `scripts/build-uilab-package.mjs` converts the Vite build into a single-file HTML preview, inlines CSS/JS, embeds `shopping-pantry.svg`, and intentionally emits classic inline JavaScript to avoid the discovery race.
4. Stable semantic component and instance IDs were already validated by actual UI Lab editing.

These are deliberate compatibility measures documented in `docs/UILAB_V1_HOUSETODO_VALIDATION.md`. Preserve them unless testing against UI Lab proves a better solution works.

Known PR #6 limitations are also documented there:

- UI Lab discovery is load/timing-sensitive.
- action-bearing task/shopping rows can be difficult to select with normal pointer clicks.
- transparent computed-style `before` values can lose transparency semantics in Codex Export.

M8 should not attempt broad UI Lab runtime fixes for those issues. Only change Mockup-side compatibility behavior if required for the current completed app.

## 3. Existing adapter baseline

At the start of M8, `main` already has Adapter v1 metadata for the earlier application:

- 3 screens: Home / Calendar / Shopping
- 20 fixture-backed states
- 41 semantic component definitions

The completed application now includes M6 and M7 routes, so the existing metadata is intentionally stale/incomplete and must be **updated**, not replaced blindly.

## 4. Required final package shape

Keep the existing Adapter v1 contract:

```text
HouseToDo-Mockup-uilab-v1.zip
├─ dist/
│  └─ index.html
└─ .uilab/
   ├─ project.json
   ├─ screens.json
   ├─ components.json
   ├─ tokens.json
   └─ states.json
```

`.uilab/project.json` should remain:

```json
{
  "formatVersion": 1,
  "name": "HouseToDo Mockup",
  "entry": "dist/index.html",
  "defaultViewport": {
    "width": 390,
    "height": 844
  }
}
```

Do not introduce a new adapter format.

## 5. Screens update

Extend the existing `.uilab/screens.json` from the currently proven 3 screens to all user-reviewable product routes.

Required final routes:

```text
home                  /home
calendar              /calendar
shopping              /shopping
task-add              /tasks/new
task-edit             /tasks/edit
shopping-add          /shopping/new
shopping-edit         /shopping/edit
other                 /other
members               /other/members
notifications         /other/notifications
household-settings    /other/household
account                /other/account
```

Do not expose Foundation/internal verification routes.

Use `defaultState: "normal"` unless the actual screen contract requires otherwise.

## 6. States update

Start from the existing `.uilab/states.json`, then inventory the current implementation and append M6/M7 states.

Do not rename working PR #6 state IDs unless the current code itself changed them.
Do not invent fixture states.

Expected current groups include:

### Home

- `normal`
- `overdue`
- `assigned`
- `mixed`
- `completed-open`
- `many`
- `long-text`
- `empty`

### Calendar

Use the exact existing M4 state IDs from code/current metadata.

### Shopping

Use the exact existing M5 state IDs from code/current metadata.

### Task add

- `normal`
- `repeat-sheet`
- `weekday-repeat`
- `time-specific`
- `assignee-sheet`
- `reuse-picker`
- `reuse-selected`
- `long-text`

### Task edit

- `normal`
- `delete-confirm`

### Shopping add

- `normal`
- `reuse-picker`
- `reuse-selected`
- `photo-selected`
- `long-text`

### Shopping edit

- `normal`
- `delete-confirm`

### Other

- `normal`

### Members

- `normal`
- `invite-open`

### Notifications

- `normal`
- `morning-off`
- `all-off`

### Household settings

- `normal`
- `timezone-open`
- `saved`

### Account

- `normal`
- `logout-confirm`

Unknown states must continue to fall back to each screen's default.

## 7. Component metadata update

**Extend the existing 41-component inventory.**

Do not discard or unnecessarily rename semantic component IDs that already worked in UI Lab and in the validated Codex Export.

PR #6 verified examples such as:

- `Home.TaskRow`
- `Home.TaskRow.Name`
- `Calendar.DayCell`
- `Shopping.ItemRow`

and their stable `data-uilab-id` targeting.

Audit new M6/M7 semantic attributes and add meaningful component definitions for:

- Task add/edit form page and fields
- repeat row / repeat sheet / weekday controls
- assignee row / assignee sheet
- reuse picker
- Save/Delete controls
- Shopping add/edit fields and photo controls
- Other navigation rows
- Members rows / Invite sheet
- Notification toggles / conditional time controls
- Household name / timezone / Save
- Account profile / Logout / confirmation

Rules remain:

- preserve readable semantic names
- repeated components use stable instance IDs
- no generated hashes or array-index IDs
- only expose useful Adapter v1 editable properties
- do not annotate every wrapper
- `data-uilab-id` must be unique within the currently rendered screen

## 8. Tokens update

Start from the existing `.uilab/tokens.json`, which was previously copied from the real CSS tokens and successfully used in Codex Export.

Update only where M6/M7 or current `tokens.css` introduced/changed design-system values.

Do not create a parallel UI Lab-only design system.

## 9. Import build — update the existing builder

Reuse `scripts/build-uilab-package.mjs` as the baseline.

The existing builder already proved that UI Lab could import the app and edit it. Preserve its important behavior while updating it for current assets/routes.

Verify that all assets introduced since PR #6 are either:

- already inline through Vite/CSS/JS,
- explicitly embedded into `dist/index.html`, or
- included in the package with correct paths.

Preferred final artifact remains a true single-file:

```text
dist/index.html
```

Requirements:

- no dev server
- no backend/API/auth/database
- no hard-coded localhost runtime URLs
- no service worker dependency
- no external/temporary runtime assets
- Hash Router works
- UI Lab parent can inspect the iframe DOM
- existing discovery timing workaround remains functional
- all `data-uilab-*` attributes survive the build

## 10. Packaging — evolve the existing flow

Reuse the existing packaging logic rather than creating an unrelated second package format.

Current baseline:

- `scripts/package-uilab.ps1`
- `artifacts/HouseToDo-Mockup-uilab-v1.zip`

M8 should make the process reproducible from npm scripts and preferably cross-platform.

Required npm entry points:

```text
npm run build:uilab
npm run validate:uilab
npm run package:uilab
```

It is acceptable to keep `package-uilab.ps1` as a convenience wrapper, but `npm run package:uilab` should not require the developer to remember manual PowerShell-only steps if a simple Node-based package implementation can preserve the proven output.

Do not change the ZIP root contract.

## 11. Validator

PR #6 validated the integration manually/through the UI Lab integration harness, but M8 should add reproducible repository-side validation for the completed metadata/package.

At minimum validate:

1. all five `.uilab` files exist and parse
2. `formatVersion === 1`
3. `entry === "dist/index.html"`
4. entry exists after UI Lab build
5. every screen has name/path/defaultState
6. every default state exists
7. every `states.json` screen key exists in `screens.json`
8. exact route/state metadata agrees with current implementation
9. component selectors use the expected semantic attribute form
10. no obvious localhost runtime URL remains in the import HTML
11. package root contains only the expected delivery structure
12. semantic instance IDs are unique per rendered screen where practical to validate with existing tooling

Prefer iterating metadata rather than hard-coding a handful of example routes.

## 12. Real UI Lab regression validation is required

Because PR #6 already proved a real UI Lab workflow, M8 should not stop at static JSON/ZIP validation.

After producing the updated package, run the same real UI Lab import workflow used previously, or the current equivalent integration harness, and verify at least:

- import updated ZIP
- screen switching across an old screen and new M6/M7 screens
- state switching with `uilabState`
- select/edit at least one previously validated component (for regression)
- select/edit at least one newly added M6/M7 semantic component
- Project Export/import round trip still restores the updated project
- Codex Export still contains actionable semantic component/instance IDs

Do not change UI Lab runtime code as part of this repository task unless the user explicitly starts a separate UI Lab task.

If the current UI Lab integration cannot be executed from this repository/environment, stop and report exactly what external prerequisite is missing rather than claiming the integration was validated.

## 13. Validation documentation

Update `docs/UILAB_V1_HOUSETODO_VALIDATION.md` rather than creating a disconnected new validation history.

Preserve the PR #6 findings and add an M8/update section containing:

- final branch/commit
- updated screen/state/component counts
- package filename/size
- real UI Lab regression result
- M6/M7 edit targets validated
- Project round trip result
- Codex Export result
- any new issues found
- whether the previous P1/P2 observations remain applicable

## 14. Generated artifacts

PR #6 committed earlier validation artifacts under `artifacts/` and screenshots under `docs/screenshots/uilab-v1/`.

For M8:

- do not delete prior evidence unless obsolete/corrupt
- update/add final evidence as appropriate
- avoid committing temporary staging folders
- avoid committing `node_modules`, caches, browser traces unless specifically useful
- generated final ZIP may be committed if continuing the existing PR #6 repository convention; if not committed, explain the change in convention explicitly

## 15. Screenshots

M8 is an adapter regression/update milestone, not a visual redesign.

Capture final-HEAD evidence **from the updated UI Lab import package**, not the Vite dev server.

Minimum 390×844 evidence:

1. Home normal
2. Calendar normal
3. Shopping normal
4. Task add normal
5. Other normal
6. one non-normal `uilabState` state
7. at least one UI Lab-edited M6/M7 component if the real UI Lab validation harness supports evidence capture

Reuse the established `docs/screenshots/uilab-v1/` evidence convention or create a clearly versioned M8 subdirectory without deleting the original evidence.

## 16. Quality gates

Required:

```text
npm run lint
npm run typecheck
npm run test
npm run build
npm run build:uilab
npm run validate:uilab
npm run package:uilab
```

Also inspect the generated ZIP contents.

All M1–M7 behavior must stay passing.

## 17. Scope limits

Do not implement or rewrite:

- UI Lab editor UI
- drag/resize handles
- inspector panels
- undo/redo engine
- UI Lab project persistence
- Codex Export engine
- CSS source rewriting
- React source parsing
- production HouseToDo integration

The only UI Lab-related Mockup work in M8 is adapter metadata, preview compatibility, packaging, and validation.

## 18. Git / PR workflow

Follow `docs/CODEX_WORKFLOW.md`.

- update to latest `main`
- create dedicated M8 branch
- **start from the existing merged PR #6 adapter implementation already on `main`**
- update/extend it for M6/M7
- run all quality/adapter/package checks
- run real UI Lab regression validation where available
- capture required final-HEAD screenshots/evidence
- commit and push
- open a draft PR to `main`
- do not merge
- stop for review

Suggested branch:

```text
codex/m8-uilab-adapter-update
```

## 19. Final report

Report:

- branch
- commit SHA
- PR number/link
- changed files
- dependency changes and justification
- which PR #6 files/compatibility behaviors were retained
- screen count before/after
- state count before/after
- semantic component definition count before/after
- quality gate results
- `build:uilab` result
- `validate:uilab` result
- `package:uilab` result
- ZIP filename/size/root layout
- whether `dist/` remains one-file
- real UI Lab import/edit regression result
- old component regression target edited
- new M6/M7 component target edited
- Project Export/import round trip result
- Codex Export result
- screenshots/evidence
- minimal adapter-attribute corrections
- updates made to `docs/UILAB_V1_HOUSETODO_VALIDATION.md`
- deviations
- working tree clean

Do not merge until reviewed.
