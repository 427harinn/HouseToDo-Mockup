# M5 Implementation Specification — Shopping Mockup

## Goal

Replace the Shopping placeholder with the first real Shopping list mockup, following `DESIGN.md` and the shared M2 AppShell.

M5 owns the shopping list experience only:

- unpurchased list
- inline row expansion
- purchase / restore interactions
- purchased section
- memo/photo presence and expanded detail
- left-swipe edit affordance
- manual priority/reordering mock behavior where practical
- empty state

M5 does **not** own Shopping add/edit forms or the reuse picker. Those belong to M6.

`DESIGN.md` is the source of truth. `docs/CODEX_WORKFLOW.md` is mandatory.

## Planned purchase date (Calendar integration)

Each shopping item may have an optional date-only `plannedDate` (`YYYY-MM-DD`).
The add form starts unset, the edit form can change or clear it, and selecting a
previous item never copies it. The collapsed list shows a quiet `M/D予定`
label only when set; expanded rows repeat the date as supporting information.

This mockup milestone also supplies the item data consumed by Calendar. Only
active items whose planned date matches the Calendar date are shown there.
Purchased items and items without a planned date are excluded.

---

## 0. Mandatory Git workflow

Before implementation:

1. Update local `main` to the latest remote `main`.
2. Create a dedicated branch from latest `main`.
3. Suggested branch: `codex/m5-shopping-mockup`.

After implementation:

1. Run all quality gates.
2. Capture required screenshots from final PR HEAD.
3. Commit and push.
4. Open a **draft PR** targeting `main`.
5. Include a clearly labeled `Screenshots` section.
6. Do not merge.
7. Do not begin M6.
8. Report branch, commit, PR, files, dependencies, checks, states, screenshots, behavior decisions, deviations.

---

## 1. Route and required states

Use the existing route:

```text
#/shopping
```

Support deterministic `uilabState` values:

```text
#/shopping?uilabState=normal
#/shopping?uilabState=expanded
#/shopping?uilabState=purchased-open
#/shopping?uilabState=photo
#/shopping?uilabState=many
#/shopping?uilabState=long-text
#/shopping?uilabState=empty
```

Unknown values must fall back to `normal`.

---

## 2. Header

Show only:

```text
買い物
```

Do not put the outstanding count in the title.
Do not add a subtitle.
Do not add a top-level Add button; the shared center `+` owns Add entry.

---

## 3. Unpurchased list ordering

Default order:

- oldest added item first

The list order itself represents priority.
Do not add High / Medium / Low labels.

Fixture data should contain a stable `addedAt` or equivalent field so the default order is deterministic.

Manual priority behavior:

- long press + drag to reorder is the intended product interaction
- for the mockup, implement a credible lightweight reorder interaction if practical without a heavy dependency
- mouse/keyboard fallback must exist if touch drag is otherwise untestable
- local state only; no persistence/backend

At minimum, M5 must demonstrate that reordering changes the visible order and stays stable during the current mock session.

---

## 4. Collapsed shopping row

A normal unpurchased row shows:

1. product name on the left
2. memo icon only if memo exists
3. photo icon only if photo exists
4. quantity at the far right

Concept:

```text
牛乳        [memo][photo]   1本
```

Do not display memo text or photo preview in collapsed rows.
Do not wrap every item in a card.
Use compact rows separated by dividers/spacing.

Use existing Lucide icon family for memo/photo indicators where useful.
Icons require accessible labels internally.

---

## 5. Row expand behavior

Tap an unpurchased row:

- expand that same row vertically

Rules:

- only one shopping item can be expanded at a time
- tapping another row closes the previous one and opens the new one
- tapping the same expanded row again closes it

The expanded content must remain part of the same list row/surface, not open a separate modal.

---

## 6. Expanded item layout

Order inside an expanded unpurchased item:

1. normal item row header: name / icons / quantity
2. large near-full-width `購入` button
3. memo, if present
4. photo, if present

The purchase button is the primary action for the expanded row.

Do not place memo/photo above the purchase action.

---

## 7. Memo presentation

Memo is secondary information.

Requirements:

- hidden in collapsed row except presence icon
- shown only in expanded row
- plain text, readable, restrained
- no nested memo card unless a border/surface is truly needed
- realistic Japanese fixture text

---

## 8. Photo presentation

Photo is supporting information, not the visual focus.

Requirements:

- hidden in collapsed row except presence icon
- shown only in expanded row
- approximately 40–60% of available row width
- capped height
- modest radius
- preserve aspect ratio
- local deterministic image asset only; no remote image service

Optional:

- tap to enlarge if trivial and restrained

Do not make full-width hero photos.

---

## 9. Purchase interaction

Tapping `購入`:

- remove the item from the active shopping list
- add it to the purchased collection
- update `購入済み N件`
- record deterministic/local purchaser and purchase time for the mock session

A restrained local transition is enough.
No backend persistence.

After purchase, the newly purchased item does not remain expanded in the active list.

---

## 10. Purchased section

At the bottom of Shopping, show:

```text
購入済み N件
```

Default: collapsed.

Tap the section header to expand/collapse.

Expanded purchased rows show:

- product name
- quantity
- purchase time
- purchaser avatar

The row should remain quiet and compact.

Passed/task concepts do not apply to Shopping.

---

## 11. Purchased row expansion / restore

Purchased rows can also expand inline.

Tap a purchased row:

- same expand/collapse grammar as active rows
- only one purchased item expanded at a time is preferred

Expanded purchased row layout:

1. product name / quantity / purchase metadata
2. large near-full-width `戻す` button
3. memo
4. photo

Tapping `戻す`:

- removes the item from purchased collection
- returns it to the active list
- removes purchase metadata from visible state
- active ordering should follow the current mock list ordering rule in a predictable way

Local state only.

---

## 12. Swipe interaction

Unpurchased item:

- left swipe = `編集`

Do not expose delete in the swipe action.
Delete belongs to M6 edit management.

`編集` in M5 is mock/no-op/light feedback only because M6 owns the actual edit screen.

As with Home/Calendar:

- normal mobile view should not show a permanent `…` beside every row
- after swipe, show only the intended action surface
- provide a keyboard/mouse-accessible fallback without cluttering normal mobile UI

Test the actual pointer swipe path, not only the fallback button.

---

## 13. Reordering

The intended interaction is:

- long press
- drag item
- release in new position

Keep it restrained:

- no large floating card
- no heavy shadow
- subtle lifted/selected feedback only if needed

For a dependency-free mock, pointer-based drag or clear move-up/move-down accessibility fallback is acceptable.

Required behavior:

- item order visibly changes
- expanded state must not produce overlapping/broken layout during reorder
- order is local mock state only

Do not add permanent numeric priority labels.

---

## 14. Empty state

If there are no active items, show:

```text
買うものはありません
```

with a small restrained life-themed illustration/local SVG/CSS visual.

Purchased section may still exist if fixture contains purchased history.
BottomNavigation must remain visible.

Do not use a giant empty-state card.

---

## 15. Fixture architecture

Use deterministic screen-aware fixtures separated from rendering.

Recommended:

```text
src/fixtures/shopping/
├─ fixtures.ts
├─ types.ts
└─ index.ts
```

Suggested concepts:

```ts
type ShoppingPerson = {
  id: string;
  name: string;
  initials?: string;
};

type ShoppingItem = {
  id: string;
  name: string;
  quantity: string;
  addedAt: string;
  memo?: string;
  photoSrc?: string;
  purchased?: boolean;
  purchasedAt?: string;
  purchaser?: ShoppingPerson;
};
```

Exact types may differ.

No backend/API calls.

---

## 16. Fixture state expectations

### `normal`

- 5–7 active items
- oldest-first ordering visible
- mix of plain / memo / photo / memo+photo
- purchased section collapsed
- no row expanded by default

### `expanded`

- one active item expanded by default
- visible `購入` button
- memo visible
- if practical photo visible too
- another row remains collapsed nearby so single-open behavior is reviewable

### `purchased-open`

- purchased section expanded by default
- at least 2 purchased items
- purchase time and purchaser avatar visible
- one purchased item can be expanded to show `戻す`

### `photo`

- expanded item with deterministic local photo
- proves collapsed row only shows photo icon, expanded row shows restrained image

### `many`

- enough items to require vertical scrolling inside AppShell
- BottomNavigation remains fixed/outside content scroll

### `long-text`

- realistic long Japanese item names / memo / quantity
- no horizontal overflow
- row header/icons/quantity remain stable

### `empty`

- zero active items
- small empty illustration + `買うものはありません`
- purchased history can be zero or sensible fixture data

---

## 17. Responsive behavior

Primary viewport:

```text
390 × 844
```

Also validate:

```text
320 × 568
```

Requirements:

- product name can shrink/wrap or truncate deliberately without colliding with icons/quantity
- quantity remains readable at far right
- expanded purchase/restore button remains easy to tap
- photo remains supporting size
- no horizontal scrolling
- many-state scroll happens inside AppShell content
- all five BottomNavigation positions remain intact

No desktop redesign required.

---

## 18. UI Lab preparation

M8 owns final metadata, but stable semantic attributes are recommended.

Suggested `data-uilab-component` values:

```text
Shopping.Page
Shopping.Header
Shopping.ActiveList
Shopping.ItemRow
Shopping.ItemRow.Name
Shopping.ItemRow.Indicators
Shopping.ItemRow.Quantity
Shopping.ItemExpanded
Shopping.ItemPurchaseButton
Shopping.ItemMemo
Shopping.ItemPhoto
Shopping.PurchasedSection
Shopping.PurchasedRow
Shopping.PurchasedRestoreButton
Shopping.EmptyState
```

Use stable item IDs for `data-uilab-id`.
Do not create final `.uilab/*.json` yet.

---

## 19. Styling constraints

Follow `DESIGN.md` strictly.

Do not use:

- oversized cards
- card-per-item layout
- decorative shadows
- gradients
- priority badges
- giant photos
- item count in title
- permanent edit/delete buttons in every row
- explanatory subtitle under `買い物`
- excessive whitespace
- nested surfaces without need

The Shopping screen should feel like a useful shared household list, not ecommerce or inventory software.

---

## 20. Motion

Use restrained CSS motion where useful.

Suggested:

- row expand/collapse: ~180–220ms
- purchase/restore state transition: ~150–220ms
- reorder feedback: subtle only

Respect `prefers-reduced-motion`.
No bounce/confetti.

---

## 21. Testing requirements

Add/update semantic behavior tests covering at least:

1. Shopping replaces placeholder route
2. `normal` renders active items oldest-first
3. collapsed row shows name/quantity and memo/photo indicators only when present
4. collapsed row does not show memo text/photo preview
5. tapping row expands it inline
6. only one active item is expanded at a time
7. tapping same expanded row closes it
8. `expanded` opens one item by default
9. purchase moves item from active to purchased and updates count
10. purchased section defaults collapsed
11. `purchased-open` defaults expanded
12. purchased row shows time + purchaser avatar
13. purchased row expands and exposes `戻す`
14. restore moves item back to active
15. left swipe reveals only `編集` and does not reveal delete
16. actual pointer swipe path is tested
17. reorder changes visible item order
18. `photo` uses local deterministic image and only shows image when expanded
19. unknown `uilabState` falls back to `normal`
20. `many` keeps BottomNavigation outside content scroll
21. `empty` renders correctly
22. long-text fixture preserves row structure/no semantic layout regression

Keep all M1–M4 tests passing.
Prefer behavior tests over pixel snapshots.

---

## 22. Screenshot requirements

Visible UI work requires final-HEAD screenshots.

Required 390×844 screenshots:

1. `normal`
2. `expanded` showing `購入`, memo, and indicators
3. `photo` showing restrained expanded photo
4. `purchased-open` showing purchase metadata
5. purchased item expanded with `戻す`
6. active item swipe state showing **編集 only**
7. reordered list state showing manual priority order changed
8. `empty`

Also required:

9. 320×568 `long-text` or `expanded`

If one image can clearly prove multiple required conditions, that is acceptable, but PR review must still be possible without running locally.

PR body must have a `Screenshots` section.
Do not use stale screenshots.

---

## 23. Quality gates

Before PR:

```text
npm run lint
npm run typecheck
npm run test
npm run build
```

All must pass.

If dependencies change:

- explain why
- report audit status

Avoid new dependencies unless clearly justified.

---

## 24. Explicit non-goals

Do not implement in M5:

- Shopping Add screen
- Shopping Edit screen
- `以前の項目から選ぶ` picker
- Recent/template search
- photo upload/camera integration
- deletion UI
- backend/API persistence
- Cloudflare integration
- final UI Lab metadata/package
- M6 work

---

## 25. Completion criteria

M5 is complete only when:

- `#/shopping` is a real Shopping list mockup
- all required `uilabState` values work
- default active list is oldest-first
- collapsed row follows name/icons/quantity structure
- inline expansion is single-open
- purchase moves item into purchased section
- purchased section expands/collapses and shows purchaser/time
- restore works
- memo/photo remain secondary and are shown only when expanded
- left swipe exposes Edit only; no delete
- reorder interaction changes visible priority order
- empty/many/long-text states work
- no backend/API dependency exists
- lint/typecheck/test/build pass
- final-HEAD screenshots are included
- `.ai/TASKS.md` reflects M5 completion
- dedicated branch is pushed
- draft PR targeting `main` is open
- M6 is not started

At completion report:

1. branch
2. commit SHA
3. PR number/link
4. changed files
5. dependency changes/reasons
6. quality-gate results
7. implemented Shopping states
8. screenshot list/viewports
9. expansion/purchase/restore/swipe/reorder decisions
10. deviations
11. confirmation that M6 was not started

Stop after opening the PR and wait for review.
