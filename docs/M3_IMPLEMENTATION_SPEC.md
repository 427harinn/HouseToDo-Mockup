# M3 Implementation Specification — Home Mockup

## Goal

Build the first real HouseToDo screen: the Home mockup.

Home is the visual reference screen for the rest of the app. It should establish the everyday density, typography, spacing, task-row structure, task-state colors, completion behavior, completed-task treatment, and shopping summary used by later milestones.

The source of truth is `DESIGN.md`.
The shared shell from M2 must be reused rather than duplicated.
The workflow requirements in `docs/CODEX_WORKFLOW.md` are mandatory.

M3 must not implement Calendar, Shopping list internals, Add/Edit forms, or production APIs.

---

## 0. Mandatory Git workflow

Before implementation:

1. Update local `main` to the latest remote `main`.
2. Create a dedicated branch from the latest `main`.
3. Suggested branch name: `codex/m3-home-mockup`.

When M3 implementation and verification are complete:

1. Capture the required screenshots listed in this spec.
2. Commit all M3 changes.
3. Push the branch.
4. Open a **draft Pull Request** targeting `main`.
5. Include a `Screenshots` section in the PR body.
6. Do not merge the PR.
7. Do not begin M4.
8. Report branch, commit, PR, changed files, test results, screenshot coverage, and deviations.

---

## 1. Home purpose

Home answers:

> What needs attention now?

It is not a project dashboard and must not look like one.

Do not split the task list into large sections such as:

- 今日
- 今週中
- 今月中

Use one urgency-sorted list.

The overall feeling priority remains:

1. すっきりする
2. 生活になじむ
3. 安心する

---

## 2. Required route and states

Use the existing route:

```text
#/home
```

M3 must support Home mock states through the existing `uilabState` query pattern.

Required states:

```text
#/home?uilabState=normal
#/home?uilabState=overdue
#/home?uilabState=assigned
#/home?uilabState=mixed
#/home?uilabState=completed-open
#/home?uilabState=many
#/home?uilabState=long-text
#/home?uilabState=empty
```

Unknown Home state values must safely fall back to `normal`.

`small-device` should not be encoded as a fixture state. Validate narrow viewport behavior through responsive screenshots/tests instead.

---

## 3. Home fixture architecture

Replace the generic M1 fixture concept with a screen-aware fixture structure suitable for future screens.

Recommended direction:

```text
src/fixtures/
├─ home/
│  ├─ fixtures.ts
│  └─ types.ts
└─ ...
```

The exact structure may differ, but Home state data must be deterministic and separate from rendering logic.

Suggested Home task fixture fields:

```ts
type HomeTask = {
  id: string;
  name: string;
  deadlineText: string;
  timeScope: 'date' | 'week' | 'month' | 'none';
  overdue?: boolean;
  assignee?: {
    id: string;
    name: string;
    avatarUrl?: string;
    initials?: string;
  };
};
```

Completed fixture fields may include:

```ts
type CompletedTask = {
  id: string;
  name: string;
  completedAt: string;
  completedBy?: {
    id: string;
    name: string;
    avatarUrl?: string;
    initials?: string;
  };
};
```

Use fixture data only. No API calls.

---

## 4. Home structure

Recommended component structure:

```text
HomePage
├─ HomeDate
├─ HomeSectionHeading
├─ TaskList
│  └─ TaskRow
│     ├─ TaskCheck
│     ├─ TaskContent
│     │  ├─ TaskName
│     │  └─ TaskDeadline
│     └─ AssigneeAvatar
├─ CompletedSection
└─ ShoppingSummary
```

Keep component boundaries semantic and useful.
Do not over-fragment tiny spans into unnecessary components.

Reuse M2 `AppShell` and `BottomNavigation`.

---

## 5. Home header

Show only:

- subtle date, e.g. `8月20日 木曜日`
- subtle `やること`

Do not show:

- greeting
- motivational text
- weather
- summary cards
- top Add button
- explanatory subtitle under the heading

Hierarchy must be:

```text
Task name > やること > date
```

The Home header should be quiet and compact.

---

## 6. Task ordering

The rendered list must visually follow practical deadline urgency:

1. overdue
2. nearest deadline
3. later deadline
4. no-deadline tasks last

The fixture itself may already be ordered; M3 does not need production-grade scheduling algorithms.

However, the displayed state must demonstrate the intended ordering clearly.

---

## 7. Task row design

Each normal task row shows:

- colored circular check indicator
- task name
- deadline directly below the task name
- assignee avatar only when a specific person is assigned

Do not show:

- `誰でも`
- category label text
- task-type badges
- cards around every task
- one-sided colored strips
- shadow

Rows should be separated primarily by thin divider and/or spacing.

Suggested initial values from the design direction:

```text
screen horizontal padding: 16px
task name: 16–17px
deadline: 13–14px
check: ~24px
avatar: ~26px
row vertical padding: 12–14px
```

These are starting values and may be adjusted slightly if the 390×844 screenshot clearly benefits.

---

## 8. Task check colors

Use the existing tokens from M1/`DESIGN.md`.

Meaning:

```text
Date-specific -> --color-task-date
This week    -> --color-task-week
This month   -> --color-task-month
No deadline  -> --color-task-no-deadline
Overdue      -> --color-task-overdue
```

Overdue overrides the normal time-scope color.

For overdue tasks, only the check color changes.

Do not change:

- row background
- task-name color
- deadline-text color

---

## 9. Deadline text

Use real deadline text, not system-state wording.

Examples:

```text
9:00まで
日曜まで
8/31まで
締切なし
8/19 9:00まで
```

For overdue tasks, do **not** replace the deadline with `期限超過`.
The red check already communicates overdue.

---

## 10. Assignee avatar

Only show an avatar when a specific assignee exists.

For M3 fixture avatars:

- a simple local deterministic avatar treatment is sufficient
- initials inside a neutral circle are acceptable if no image asset is needed
- do not introduce a remote image service dependency

Avatar needs an accessible name/label where appropriate.

Do not display an avatar placeholder for unassigned/anyone tasks.

---

## 11. Primary task interaction

Chosen Home interaction model:

- tap task row = complete
- left swipe = `編集 / パス`
- delete is not exposed on Home

M3 should implement enough mock interaction to visually evaluate this model.

Required:

- tapping a task marks it completed in local mock state
- the task disappears from the active list after the completion animation
- completed count increases / completed section updates
- no backend persistence

For swipe:

- implement a usable left-swipe gesture if practical without a heavy dependency
- reveal `編集` and `パス`
- `パス` removes that task from the current Home mock view
- `編集` may be a mock/no-op action or small temporary feedback because the real edit screen belongs to M6

Provide a discoverable fallback if the swipe implementation would otherwise be impossible to test with keyboard/mouse.

Do not expose delete.

---

## 12. Completion animation

Implement the task completion check motion described in `DESIGN.md`.

Target behavior:

- inactive: outlined colored circle
- on complete: task-type color fills the circle
- white check appears
- subtle fill/scale motion
- approximately 150–220ms
- weak/no bounce

Use CSS transition/animation if sufficient.
Do not add an animation library unless clearly necessary.

Respect `prefers-reduced-motion`.

Do not add:

- confetti
- celebratory bursts
- large bounce
- sound

---

## 13. Completed section

At the bottom of the active task list, show:

```text
完了済み N件
```

Default state: collapsed.

When expanded, each completed row shows:

- task name
- completion time
- completing user's avatar when available

Deadline is not required in the completed section.

Passed items do not appear in completed.

The expanded presentation should remain quiet and secondary to active tasks.

Required interactions:

- tap/click the completed section header to expand/collapse
- state `completed-open` opens it by default

---

## 14. Shopping summary

At the bottom of Home, after the completed section, show one simple line:

```text
買い物 4件 >
```

Use fixture count.

Do not show product names.
Do not turn this into a summary card.

The row should navigate to `#/shopping`.

Use a lightweight chevron icon from the existing Lucide family if useful.

---

## 15. Empty state

For `uilabState=empty` show:

- `やることはありません`
- a small life-themed illustration or very restrained local visual

The empty-state visual must not look like generic AI/SaaS illustration art.

Prefer a tiny simple CSS/local SVG illustration if needed.

Do not create a giant empty-state card.

BottomNavigation remains visible.

---

## 16. Required fixture states

### `normal`

Use a balanced reference Home state, e.g.:

- several active tasks
- a mix of deadline scopes
- at least one assignee
- some completed tasks collapsed
- shopping count

### `overdue`

Include at least one overdue task with:

- red check
- actual past deadline text
- normal task/deadline text colors

### `assigned`

Show multiple assigned/unassigned examples proving avatars appear only for specific assignees.

### `mixed`

Clearly demonstrate:

- date-specific
- this week
- this month
- no deadline
- preferably an overdue item as well

### `completed-open`

Completed section expanded by default with completed rows.

### `many`

Enough tasks to require vertical scrolling while BottomNavigation remains fixed.

### `long-text`

Use long realistic Japanese task names.
Ensure:

- rows remain readable
- deadline remains associated with the correct task
- avatar/check do not collapse
- text wrapping/truncation behavior is deliberate

### `empty`

No active tasks.
Completed/shopping presentation should remain sensible and visually balanced.

---

## 17. Responsive behavior

Primary reference viewport:

```text
390 × 844
```

Also validate approximately:

```text
320 × 568
```

Requirements:

- task content stays readable
- BottomNavigation retains all five positions
- no horizontal overflow
- long text does not overlap check/avatar
- completed/shopping rows remain tappable
- many-state scroll stays inside the M2 AppShell viewport

Do not redesign for desktop.

---

## 18. UI Lab preparation

M8 owns the final UI Lab adapter mapping, but M3 should avoid architecture that makes semantic mapping difficult.

Where useful and stable, it is acceptable to add `data-uilab-component` and `data-uilab-id` to the Home mockup now.

Recommended semantic identifiers include:

```text
Home.Page
Home.Date
Home.SectionHeading
Home.TaskList
Home.TaskRow
Home.TaskRow.Check
Home.TaskRow.Name
Home.TaskRow.Deadline
Home.TaskRow.Avatar
Home.CompletedSection
Home.ShoppingSummary
```

Rules:

- `data-uilab-component` may repeat by semantic component
- `data-uilab-id` must be unique within the rendered screen
- use stable fixture IDs, not positional names such as `row-1`

Do not create `.uilab/*.json` metadata yet unless explicitly needed by M8.

---

## 19. Styling constraints

Follow `DESIGN.md` anti-patterns strictly.

Do not use:

- strong gradients
- oversized cards
- decorative shadows
- one-sided colored card strips
- large rounded task cards
- KPI blocks
- excessive whitespace
- explanatory gray subtitles under headings
- decorative icons unrelated to state/action

The screen should feel like a household life surface, not a task-management SaaS dashboard.

---

## 20. Testing requirements

Add/update behavior tests covering at least:

1. normal Home state renders active tasks in AppShell
2. each task scope uses the correct check-state class/token mapping
3. overdue uses overdue color/state without altering text semantics
4. assignee avatar only appears for assigned tasks
5. tapping a task completes/removes it and updates completed state
6. completed section expands/collapses
7. `completed-open` renders expanded by default
8. pass removes a task from active Home without adding it to completed
9. shopping summary navigates to `#/shopping`
10. unknown `uilabState` falls back to normal
11. many-state uses the AppShell scroll structure without breaking BottomNavigation
12. empty state renders appropriately

Prefer behavior/semantic tests over pixel snapshots.

Keep all previous M1/M2 tests passing unless a documented refactor is required.

---

## 21. Screenshot requirements

Because M3 is a visible UI milestone, screenshots are mandatory.

Store/attach screenshots so the PR can display them.

Required 390×844 screenshots:

1. `normal`
2. `overdue` or `mixed` (must visibly demonstrate multiple check colors including overdue)
3. `completed-open`
4. `empty`
5. task completion interaction result or swipe actions visible

Also include at least one narrow viewport screenshot around 320px width, preferably `long-text` or `many`.

The PR body must contain a `Screenshots` section with clear labels.

Do not submit screenshots from stale commits.
Generate them from the final PR HEAD after all code changes are complete.

---

## 22. Quality gates

Before opening the PR, run:

```text
npm run lint
npm run typecheck
npm run test
npm run build
```

All must pass.

If dependencies are changed, report why and include an audit result.

Avoid new dependencies unless they are clearly justified.

---

## 23. Explicit non-goals

Do not implement in M3:

- Calendar month UI
- Calendar date sheet
- Shopping list internals
- real task edit screen
- task creation form
- production persistence/API
- authentication
- Cloudflare integration
- full UI Lab metadata/package
- final single-file build
- server state

Do not start M4 after completing M3.

---

## 24. Completion criteria

M3 is complete only when:

- `#/home` is a real Home mockup rather than placeholder
- required Home states work through `uilabState`
- normal urgency-sorted task list is implemented
- check colors match task scope
- overdue behavior matches `DESIGN.md`
- assignee display rules are correct
- tap-to-complete mock interaction works
- swipe/edit/pass grammar is represented
- completion animation is restrained and reduced-motion aware
- completed section works
- shopping summary works
- empty state works
- 390×844 layout is visually coherent
- narrow viewport does not break
- no backend/API dependency exists
- lint/typecheck/test/build pass
- required screenshots are captured from final HEAD
- `.ai/TASKS.md` reflects actual M3 completion
- dedicated branch is pushed
- draft PR to `main` is opened
- M4 is not started

At completion, report:

1. branch name
2. commit SHA
3. PR number/link
4. files added/changed
5. dependency changes and reasons
6. lint/typecheck/test/build results
7. screenshot list and viewport sizes
8. implemented Home states
9. interaction/motion decisions
10. any deviations from this spec
11. confirmation that M4 was not started

Stop after opening the PR and wait for review.
