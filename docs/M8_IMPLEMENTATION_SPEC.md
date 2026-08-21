# M8 Implementation Specification — UI Lab adapter/package

## 1. Goal

M8 is the final mockup milestone. Prepare the completed HouseToDo mockup for import into UI Lab v1.

The source of truth is:

- `docs/UI_LAB_ADAPTER_SPEC_v1.md`
- `DESIGN.md`
- `docs/CODEX_WORKFLOW.md`
- the actual routes/states/components already implemented in M1–M7

Do not redesign product screens in M8 unless an adapter validation issue requires a minimal correction.
Do not implement UI Lab editor functionality inside this repository.

## 2. Required deliverables

Add the adapter metadata directory:

```text
.uilab/
├─ project.json
├─ screens.json
├─ components.json
├─ tokens.json
└─ states.json
```

Provide an import build that can be distributed as:

```text
HouseToDo-Mockup.zip
├─ dist/
│  └─ index.html
└─ .uilab/
   ├─ project.json
   ├─ screens.json
   ├─ components.json
   ├─ tokens.json
   └─ states.json
```

The ZIP is a generated delivery artifact. Do not commit generated ZIP/dist output if repository conventions keep generated files ignored; commit the source/config/scripts needed to reproduce it.

## 3. Project metadata

`.uilab/project.json` must follow adapter v1 exactly:

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

Do not add undocumented format fields unless required by an existing repository convention.

## 4. Screens inventory

`screens.json` must declare every user-reviewable mockup screen that UI Lab should expose, using existing hash routes only.

Minimum screen IDs/routes:

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

Use readable English `name` values and `defaultState: "normal"` unless the implemented screen contract clearly uses another default.

Do not expose the Foundation/internal verification route as a normal UI Lab product screen.

## 5. States inventory

`states.json` must reflect the actual deterministic `uilabState` contract already implemented. Do not invent states that do not render.

At minimum include the states currently supported by M3–M7:

### Home

- `normal`
- `overdue`
- `assigned`
- `mixed`
- `completed-open`
- `many`
- `long-text`
- `empty`

If the actual Home implementation uses a slightly different exact state ID, use the code's existing ID rather than silently renaming it.

### Calendar

Inventory the exact existing Calendar state IDs from the implementation and include all supported deterministic states, including normal/month-density/detail states that were created during M4.

### Shopping

Inventory all exact existing M5 Shopping state IDs, including normal/expanded/purchased/memo-photo/reorder/empty/long-text variants actually supported.

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

Unknown states must continue to fall back to each screen's declared default state.

## 6. Component adapter inventory

Create `.uilab/components.json` from the semantic adapter attributes already present in the rendered UI.

Rules:

1. Inventory the existing `data-uilab-component` values first.
2. Reuse stable semantic names already introduced in M2–M7.
3. Add missing adapter attributes only where a meaningful user-editable component cannot otherwise be selected.
4. `data-uilab-component` may repeat for semantic component families.
5. `data-uilab-id` must be unique within the currently rendered screen/state.
6. Do not use generated hashes, array indexes, or meaningless IDs such as `element-1`.
7. Do not annotate every wrapper. Expose meaningful visual/interactive components only.

Important families should include, where they already exist or are meaningfully editable:

- AppShell / BottomNavigation / Add sheet
- Home task rows/checks/completed rows/shopping summary
- Calendar cells/task labels/date detail sheet
- Shopping rows/action areas/purchased section
- Task form fields/repeat/assignee/save/delete/sheets
- Shopping form fields/photo/save/delete/sheets
- Other navigation rows
- Members rows/invite sheet
- Notification toggles/time fields
- Household name/timezone/save
- Account profile/logout confirmation

For each semantic component definition, expose only meaningful editable keys from adapter v1:

```text
position
width
height
padding
margin
gap
fontSize
fontWeight
lineHeight
color
background
border
borderRadius
opacity
```

Do not expose properties that have no practical visual meaning for that component.

## 7. Tokens

`.uilab/tokens.json` must be grounded in current `DESIGN.md` and actual CSS tokens.

At minimum include stable semantic values for:

- background
- surface
- primary
- primaryStrong
- primarySoft
- text
- textSecondary
- border
- disabled
- task/calendar accent colors that are part of the current design system
- spacing scale based on `4 / 8 / 12 / 16 / 20 / 24 / 32`
- relevant input/action/sheet radii

Do not create a parallel token system that disagrees with the app CSS.

## 8. Import build

UI Lab v1 prefers a static single-file preview:

```text
dist/index.html
```

The import build must:

- work without a dev server
- work without backend/API/auth/database
- use hash routing
- not require `npm install` at import time
- have no service worker dependency
- have no hard-coded localhost URLs
- avoid temporary/external runtime asset URLs
- work in a same-origin/trusted iframe where the parent can inspect the DOM
- preserve `data-uilab-component` and `data-uilab-id` attributes

Use an established Vite single-file/inlining approach if a dependency is necessary. Any new dependency must be justified in the PR report.

Small local assets should be embedded in the import build when practical. If an asset remains separate, it must be included in the generated package and resolve correctly from the imported ZIP.

## 9. Reproducible scripts

Add clear npm scripts for the UI Lab artifact, for example:

```text
npm run build:uilab
npm run validate:uilab
npm run package:uilab
```

Exact script names may differ if there is a better repository-consistent naming, but the workflow must be reproducible and documented.

`package:uilab` should produce a ZIP with `dist/` + `.uilab/` at the ZIP root layout required by the adapter spec.

The generated package must not contain unrelated large artifacts such as `node_modules`, test output, screenshots, `.git`, or source caches.

## 10. Adapter validator

Add deterministic validation that fails with a non-zero exit code when the package contract is broken.

At minimum validate:

1. `.uilab/project.json` exists and is valid JSON.
2. `formatVersion === 1`.
3. `project.entry === "dist/index.html"` and the entry exists after build.
4. all five `.uilab` JSON files exist and parse.
5. all declared screens have path/name/defaultState.
6. every declared default state exists for that screen.
7. screen/state routes can be constructed using `{entry}#{path}?uilabState={state}`.
8. every selector in `components.json` is syntactically valid for the intended attribute selector format.
9. build output contains no obvious localhost runtime URLs.
10. package ZIP contains the required root layout.

Where practical, add browser-level validation using the existing test tooling to load each declared screen/state and verify:

- route renders without crashing
- no horizontal overflow at the default 390×844 viewport
- adapter selectors match at least one intended rendered element for states where the component is expected
- rendered `data-uilab-id` values are unique within the current document

Do not introduce a large new browser-testing framework only for M8 if the repository does not already have one. Prefer existing Vitest/jsdom and/or lightweight static validation unless current project tooling already supports browser automation.

## 11. Route/state completeness

M8 is the point where route/state metadata and implementation must agree exactly.

Create a test or validator that iterates the metadata rather than manually checking only a few examples.

Important:

- `screens.json` + `states.json` must not contain stale/fictional states.
- implemented deterministic states intended for UI Lab must not be silently omitted.
- screen IDs used by `states.json` must match `screens.json` keys.

## 12. Single-file verification

After `build:uilab`, verify `dist/index.html` can be opened/imported without Vite dev server.

If the final build truly contains only `dist/index.html`, report this explicitly.
If extra assets remain, list them and justify why they are required; the ZIP must include them.

The priority is a reliable import artifact, not forcing a brittle one-file build at the cost of broken preview behavior.

## 13. Generated package verification

Generate the final package from the final PR HEAD and report:

- ZIP filename
- file size
- exact top-level ZIP contents
- whether `dist/` is single-file
- validator result

Do not attach or commit secrets; none should exist in this mock project.

## 14. Screenshots for M8 PR

M8 is primarily adapter/build work rather than a visual redesign, so do not create dozens of duplicate screenshots.

Still provide enough final-HEAD evidence to show the import build renders the real application:

390×844 minimum:

1. Home normal loaded from the UI Lab import build
2. Calendar normal loaded from the UI Lab import build
3. Shopping normal loaded from the UI Lab import build
4. Task add normal loaded from the UI Lab import build
5. Other normal loaded from the UI Lab import build
6. one non-normal deterministic state loaded via `?uilabState=` from the import build (for example Home overdue or Task repeat-sheet)

If there is no visible difference between normal Vite build and UI Lab import build, the PR body should state that screenshots were captured from the generated import build, not the dev server.

## 15. Tests / quality gates

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

All existing M1–M7 behavior must remain passing.

## 16. Scope limits

Do not implement:

- UI Lab selection UI
- drag/resize handles
- inspector panels
- undo/redo
- editor persistence
- Project Export
- Codex Export
- CSS source rewriting
- React source parsing
- production HouseToDo integration
- backend/API/auth/database work

Those belong outside this mockup adapter milestone.

## 17. Git / PR workflow

Follow `docs/CODEX_WORKFLOW.md`.

- update to latest `main`
- create a dedicated M8 branch
- implement M8 only
- run all quality/adapter/package checks
- capture required screenshots from final PR HEAD/import build
- commit and push
- open a draft PR to `main`
- do not merge
- stop for review

Suggested branch:

```text
codex/m8-uilab-adapter
```

## 18. Final report

Report:

- branch
- commit SHA
- PR number/link
- changed files
- dependency changes and justification
- `.uilab` files created
- screen count / state count
- semantic component definition count
- quality gate results
- `build:uilab` result
- `validate:uilab` result
- package ZIP filename/size/layout
- whether `dist/` is one-file
- screenshots captured from import build
- any minimal adapter-attribute corrections made to existing UI
- deviations from this spec
- working tree clean

Do not merge until reviewed.