# M2 Implementation Specification — Shared App Shell

## Goal

Build the shared smartphone application shell used by all later HouseToDo mockup screens.

M2 establishes navigation, viewport behavior, shared layout primitives, safe-area handling, icon conventions, and the minimum motion foundation needed for later screen mockups.

The visual source of truth is `DESIGN.md`.
The development workflow is `docs/CODEX_WORKFLOW.md`.
The UI Lab import contract is `docs/UI_LAB_ADAPTER_SPEC_v1.md`.

M2 must **not** implement the actual Home, Calendar, Shopping, Add/Edit, or Settings screen designs. Those belong to later milestones.

---

## 0. Mandatory Git workflow

Before implementation:

1. Update local `main` to the latest remote `main`.
2. Create a dedicated branch from that latest `main`.
3. Suggested branch name: `codex/m2-shared-app-shell`.

When M2 implementation and verification are complete:

1. Commit all M2 changes.
2. Push the branch.
3. Open a **draft Pull Request** targeting `main`.
4. Do not merge the PR.
5. Do not begin M3.
6. Report branch name, commit, PR number/link, changed files, dependency changes, test results, and any spec deviations.

This requirement is mandatory even if the implementation is small.

---

## 1. Scope

Implement only the shared shell required by future screens:

- smartphone-first viewport shell
- page/content scroll region
- safe-area handling
- bottom navigation
- five navigation destinations
- route placeholders for future screens
- central Add action shell
- shared icon strategy
- shared layout primitives
- basic navigation/motion conventions
- tests for navigation and shell behavior

Do not implement screen-specific task/item content.

---

## 2. Required routes

Add Hash Router-compatible routes for:

```text
#/home
#/calendar
#/shopping
#/other
```

Keep the existing foundation route available for development verification:

```text
#/foundation
```

The center Add control is an action rather than a persistent destination. It should not need a permanently selected navigation route in M2.

Unknown routes should continue to fail safely and offer a path back into the mockup.

Navigation must continue to work with the UI Lab query convention, for example:

```text
#/home?uilabState=normal
```

Do not introduce BrowserRouter/server fallback assumptions.

---

## 3. App shell structure

Create a reusable shell component rather than duplicating layout in each placeholder page.

Recommended conceptual structure:

```text
App
└─ AppShell
   ├─ MainViewport / PageContent
   │  └─ Current route content
   └─ BottomNavigation
```

Possible source structure:

```text
src/
├─ app/
│  ├─ App.tsx
│  └─ router.tsx
├─ components/
│  ├─ AppShell/
│  │  ├─ AppShell.tsx
│  │  └─ AppShell.css
│  └─ BottomNavigation/
│     ├─ BottomNavigation.tsx
│     └─ BottomNavigation.css
├─ pages/
│  ├─ HomePlaceholderPage.tsx
│  ├─ CalendarPlaceholderPage.tsx
│  ├─ ShoppingPlaceholderPage.tsx
│  └─ OtherPlaceholderPage.tsx
└─ styles/
```

Exact filenames may differ if there is a clear reason, but shared shell and navigation responsibilities must remain separated from page-specific content.

---

## 4. Smartphone viewport behavior

The mockup is mobile-first.

Requirements:

- usable from approximately 320px width upward
- primary reference viewport remains 390 × 844
- content may scroll vertically
- bottom navigation remains available at the bottom of the viewport
- page content must not disappear behind the bottom navigation
- desktop width must not break the layout
- do not turn desktop into a separate dashboard layout

Use normal responsive CSS rather than absolute positioning for the shell.

The app background uses the existing `--color-bg` token.

Do not add decorative device frames around the app.

---

## 5. Safe-area handling

Prepare the shell for iPhone/PWA-like safe areas.

Use environment inset support where relevant, e.g.:

```css
env(safe-area-inset-top)
env(safe-area-inset-bottom)
```

Requirements:

- bottom navigation must account for bottom safe area
- scroll/content padding must account for navigation height + safe area
- no content should be hidden behind the home indicator area

Provide graceful fallback when environment inset values are zero.

Do not hard-code a specific iPhone model's notch/home-indicator dimensions.

---

## 6. Bottom navigation

Follow `DESIGN.md` exactly for the shared navigation grammar.

Order:

1. Home
2. Calendar
3. Add
4. Shopping
5. Other

Visible UI requirements:

- icons only
- no visible labels
- white background
- thin top border using the existing border token
- no shadow
- selected destination uses `--color-primary`
- unselected destinations use a restrained neutral color
- center `+` is slightly larger than the other icons
- center `+` must **not** become an oversized floating FAB
- minimum interactive touch target: 44px
- icons are visually centered within their touch targets

Accessibility requirements:

- every icon button/link has an accessible label
- current destination exposes selected/current state semantically where appropriate
- keyboard focus remains visible

Do not introduce badges/counts in M2.
Do not add decorative labels below icons.

---

## 7. Icon strategy

Use one simple outline icon family consistently.

Preferred implementation for this repository:

- `lucide-react`

Suggested mappings:

```text
Home      -> House
Calendar  -> CalendarDays (or Calendar)
Add       -> Plus
Shopping  -> ShoppingCart (or ShoppingBasket)
Other     -> Ellipsis (or MoreHorizontal-equivalent)
```

Choose one mapping and keep it consistent.

Rules from `DESIGN.md`:

- simple outline icons
- medium visual stroke
- no mixed icon families
- no decorative icons
- icon-only bottom navigation

If adding `lucide-react`, document the dependency choice in the PR summary.

Do not use emoji as production mockup navigation icons.

---

## 8. Add action shell

Tapping the center `+` should open only a lightweight M2 choice surface proving the interaction grammar.

Choices:

```text
家事
買い物
```

This is **not** the real Add/Edit screen yet.

Preferred M2 behavior:

- a small, restrained bottom sheet or action sheet
- white surface
- rounded top corners around the existing sheet radius token
- subtle backdrop
- two clear options: `家事` / `買い物`
- explicit close behavior
- dismiss by backdrop/close control if implemented safely

Do not build task/shopping forms.
Do not invent helper descriptions under the two choices.

The Add sheet should be implemented as a reusable shell-level primitive if practical because later milestones will use bottom sheets extensively.

---

## 9. Shared page placeholders

Create deliberately minimal placeholders for:

- Home
- Calendar
- Shopping
- Other

Purpose:

- verify routing
- verify selected bottom-nav state
- verify shared viewport/layout behavior

Placeholder content should be minimal, for example the Japanese screen name only.

Do not approximate the final screen UI yet.
Do not add cards, stats, sample tasks, or screen-specific controls in M2.

The Home placeholder must not be mistaken for the M3 Home mockup.

---

## 10. Shared layout primitives

Add only primitives justified by multiple future screens.

Useful examples:

- `AppShell`
- `ScreenContent`
- `BottomNavigation`
- `BottomSheet` / `ActionSheet` if required by the Add action

Do not create a large design-system abstraction layer in M2.
Do not create dozens of speculative components.

Use existing CSS variables from M1.
If one truly shared token is missing (for example navigation height), adding a narrowly scoped semantic CSS variable is acceptable.

Avoid hard-coded duplicate magic numbers when a shared shell token clearly makes sense.

---

## 11. Motion foundation

HouseToDo motion must remain quiet and polished.

From `DESIGN.md`:

- approximately 150–250ms for normal transitions
- no large bounce
- no confetti/game effects
- bottom sheets move from the bottom
- navigation transition should remain subtle

M2 should establish only the minimum shared motion behavior needed for navigation/Add sheet.

Before adding a dedicated animation dependency, check whether CSS transitions are sufficient for M2.

Preferred decision rule:

1. Use small CSS transitions if they fully cover M2.
2. Add `motion`/Motion only if it provides clear value already in M2 and will be reused later.
3. If a new animation dependency is added, document why CSS alone was insufficient.

Do not over-engineer page transitions in M2.
Do not block navigation waiting for animation completion.

Respect `prefers-reduced-motion`.

---

## 12. Styling rules

Follow the current `DESIGN.md` system.

Required shell-level direction:

- background: `--color-bg`
- navigation surface: `--color-surface`
- border: `--color-border`
- selected nav: `--color-primary`
- main text: `--color-text`
- restrained neutral for unselected icons
- system font stack
- no gradients
- no decorative shadows
- no oversized rounded cards
- no English labels in the visible HouseToDo UI

Do not invent a beige navigation bar.
Do not use a floating bubble around every navigation icon.

---

## 13. State/query behavior

The M1 `uilabState` helper must remain functional.

Navigation should not accidentally break hash-route query parsing.

For M2 placeholders, `uilabState` does not need screen-specific fixture behavior yet.

However:

- `#/home?uilabState=normal` must render Home placeholder successfully
- route changes should remain deterministic
- no backend/API calls may be introduced

---

## 14. Testing requirements

Add/update tests to cover at least:

1. `#/home` renders inside the shared AppShell.
2. Each persistent destination (Home / Calendar / Shopping / Other) can be reached through Hash Router navigation.
3. Correct bottom-navigation destination exposes selected/current state.
4. Center Add control opens the `家事 / 買い物` choice surface.
5. Closing/dismissing the Add choice restores the underlying route without navigation corruption.
6. Hash route with `?uilabState=normal` still works.
7. No backend/API dependency is required for rendering.

Tests should focus on behavior rather than fragile pixel snapshots.

Keep the existing M1 tests passing unless a test is intentionally refactored for a documented reason.

---

## 15. Quality gates

Before opening the PR, run:

```text
npm run lint
npm run typecheck
npm run test
npm run build
```

All must pass.

If dependencies change, also run an install/audit-equivalent check and report the result.

Do not suppress lint/type errors merely to make the gate pass.

---

## 16. Explicit non-goals

Do not implement in M2:

- Home task list
- Home completed section
- Home shopping summary
- task completion/check animation
- Calendar month layout
- Calendar date detail sheet
- Shopping item rows
- Shopping reorder
- task/shopping forms
- member/settings content
- production API calls
- authentication
- Cloudflare integration
- full UI Lab `.uilab/` metadata
- final `data-uilab-component` mapping across screen components
- single-file UI Lab build/package
- screenshot/reference-image export

Those belong to later milestones.

---

## 17. Completion criteria

M2 is complete only when:

- shared AppShell exists
- smartphone scroll/safe-area behavior is implemented
- bottom navigation has all five positions in the specified order
- Home/Calendar/Shopping/Other routes work
- selected navigation state works
- central Add action opens the two-choice shell
- icon family is consistent
- accessibility labels/current state are present
- reduced-motion handling is considered
- no screen-specific M3+ UI has been implemented
- no backend/API dependency exists
- lint passes
- typecheck passes
- tests pass
- build passes
- `.ai/TASKS.md` is updated with actual M2 completion state
- dedicated branch is pushed
- draft PR to `main` is opened

At completion, report:

1. branch name
2. commit SHA
3. PR number/link
4. files added/changed
5. dependency additions/removals and reasons
6. lint/typecheck/test/build results
7. any accessibility/motion decisions
8. any deviations from this specification
9. confirmation that M3 was not started

Stop after opening the PR and wait for review.
