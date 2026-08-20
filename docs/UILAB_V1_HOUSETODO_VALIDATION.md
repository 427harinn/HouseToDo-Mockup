# UI Lab v1 HouseToDo Validation

## Environment

- Repository: `HouseToDo-Mockup`
- Branch: `feat/uilab-v1-adapter`
- Base: `main` / `origin/main` at `c39fac8`
- UI Lab: local `http://127.0.0.1:4173`
- Runtime: Node `v22.18.0`, npm `10.9.3`
- Adapter viewport: `390 × 844`
- Package: `artifacts/HouseToDo-Mockup-uilab-v1.zip`
- UI Lab runtime code was not changed. The integration E2E is a validation harness only.

`git fetch origin` could not refresh credentials because the configured `credential-manager-core` helper is unavailable; local `main` and `origin/main` were already identical at the base commit above.

## Adapter mapping

The package contains all required Adapter v1 files:

```text
.uilab/project.json
.uilab/screens.json
.uilab/components.json
.uilab/tokens.json
.uilab/states.json
dist/index.html
```

`node scripts/build-uilab-package.mjs` builds a single `dist/index.html`; `scripts/package-uilab.ps1` creates the ZIP. CSS and JavaScript are inline, the shopping SVG is a data URL, and there are no external `src`/`href`, API, service worker, backend, or dev-server dependencies.

There are 3 screens, 20 fixture-backed states, and 41 component definitions. `data-uilab-id` values use stable task/item IDs or ISO dates; React keys and array indexes are not used as instance identity.

## Screens

| Screen | Path | Registered states |
|---|---|---|
| Home | `/home` | normal, overdue, assigned, mixed, completed-open, many, long-text, empty |
| Calendar | `/calendar` | normal, dense, date-open, completed-hidden, long-text |
| Shopping | `/shopping` | normal, expanded, purchased-open, photo, many, long-text, empty |

All states come from existing Mockup fixtures. No new visual state was invented for UI Lab.

## Components

The inventory prioritizes edit targets rather than wrappers:

- Shared: `AppShell.BottomNavigation`, `AppShell.AddSheet`.
- Home: `Home.TaskRow`, `Home.TaskRow.Name`, `Home.TaskRow.Deadline`, `Home.TaskRow.Check`, `Home.CompletedSection`, `Home.ShoppingSummary`.
- Calendar: `Calendar.MonthGrid`, `Calendar.DayCell`, `Calendar.DayCell.Date`, `Calendar.DayCell.Task`, `Calendar.DateSheet`, `Calendar.DetailTask`.
- Shopping: `Shopping.ItemRow`, `Shopping.PurchasedRow`, `Shopping.ItemRow.Name`, `Shopping.ItemRow.Quantity`, `Shopping.ItemExpanded`, `Shopping.ItemPurchaseButton`, `Shopping.ItemMemo`, `Shopping.ItemPhoto`.

Editable lists are scoped per component. Rows expose geometry and appearance; text exposes typography and color; buttons expose size/appearance; containers expose spacing/background/border. No blanket “all properties” definition is used.

Tokens are copied from `src/styles/tokens.css`: semantic colors, spacing values, and input/action/sheet radii. No UI Lab-only design values were added.

## Editing validation

The real UI Lab integration E2E passed:

```text
1 passed — HouseToDo Mockup Adapter v1 supports import, editing, project round trip, and Codex Export
```

Verified against the real package:

- Import and screen switching: Home, Calendar, Shopping.
- Home `Home.TaskRow / normal-trash`: position X, width, background; nested title font size.
- Calendar `Calendar.DayCell / 2026-08-20`: background.
- Shopping `Shopping.ItemRow / shopping-milk`: width.
- Undo and Redo restore the Home title edit.
- Escape clears selection.
- Inspector fields reflect the selected semantic component and instance.

Evidence screenshots are stored under `docs/screenshots/uilab-v1/`.

## Project round trip

The edited project was exported as `.ui-project`, imported back through UI Lab, and verified to restore the preview, all 3 screen/state definitions, the `390 × 844` viewport, and all 6 changes across Home, Calendar, and Shopping. The restored preview is `05-house-todo-project-restored.png`.

## Codex Export validation

The generated Codex package contains:

```text
ui-changes.json
design-tokens.json
screens.json
IMPLEMENTATION.md
DESIGN.md
screenshots/home-normal.png
screenshots/calendar-normal.png
screenshots/shopping-normal.png
```

`ui-changes.json` contains 6 final records. Representative values are:

| screenId | stateId | componentId | instanceId | property | after | valueType |
|---|---|---|---|---|---|---|
| home | normal | Home.TaskRow | normal-trash | background | `#eef8f1` | exact |
| home | normal | Home.TaskRow | normal-trash | position | `{x:22,y:82.1875}` | visual |
| home | normal | Home.TaskRow.Name | home-task-normal-trash-name | fontSize | `18` | exact |
| calendar | normal | Calendar.DayCell | `2026-08-20` | background | `#edf7ff` | exact |
| shopping | normal | Shopping.ItemRow | shopping-milk | width | `350` | visual |

The sixth record is Home row width `340` with `before: 344`. Every record includes `screenId`, `stateId`, `componentId`, `instanceId`, `property`, `before`, `after`, and `valueType`.

## Issues found

### P0 — none

No blocking Adapter schema, entry-path, local preview, project round-trip, or Codex Export failure remains in the final package.

### P1 — UI Lab v1 discovery is load/timing-sensitive

UI Lab v1 discovers iframe elements on load, but a React preview can commit after that discovery, and hash screen changes can leave discovery scoped to the prior screen. The adapter uses a body-end inline classic script, synchronous React mount, and an embedded-only reload bridge to make the real Mockup work. This is an Adapter compatibility tax and should move into UI Lab discovery lifecycle in a future fix.

### P1 — action-bearing rows are difficult to select with normal pointer clicks

Home task rows and Shopping rows own click/pointer behavior. A normal pointer click can invoke the Mockup action before UI Lab selection, while a stable semantic target or event interception selects reliably. The current E2E validates the editor pipeline with the discovered target event; production use would benefit from a selection affordance or event-priority rule in UI Lab.

### P2 — computed “before” color can lose transparency semantics

The Home row background export records `before: "#000000"` when the source is effectively transparent. The `after` value is correct and actionable, but preserving raw `transparent`/rgba semantics would improve Codex context.

### P2 — state and scope remain fixture-level

The Adapter can name existing fixture states but cannot express richer state transitions or user-created variants. Instance IDs are clear for this Mockup; a future component-scope model could make repeated nested components easier to target without relying on long IDs.

### P2 — Adapter creation cost is moderate

For this 3-screen Mockup, the work required manifest authoring, 41 semantic definitions, stable IDs on repeated elements, a single-file build step, and integration evidence. The mapping is manageable, but the route/discovery workaround is the largest non-visual cost.

## Recommended next improvements

1. UI Lab should rediscover Adapter targets after iframe DOM readiness and after hash-route screen/state changes.
2. UI Lab should provide a selection mode or capture-phase priority for interactive Adapter roots.
3. Codex Export should preserve transparent/rgba computed-style values in `before` snapshots.
4. Add an optional Adapter readiness signal so React/Vue previews do not need framework-specific timing workarounds.
5. Keep the current semantic ID convention and token ownership; it was sufficient for Codex to identify all six changes without source parsing.
