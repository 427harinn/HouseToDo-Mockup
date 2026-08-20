# M4 Implementation Specification — Calendar Mockup

## Goal

Build the HouseToDo Calendar mockup on top of the shared M2 AppShell and M3 design language.

The Calendar is a smartphone-first month view inspired by the previously agreed TimeTree-like direction. It should make date-specific household tasks easy to scan without becoming a generic scheduling SaaS calendar.

The source of truth is `DESIGN.md`.
The workflow requirements in `docs/CODEX_WORKFLOW.md` are mandatory.

M4 must not implement Shopping internals, Add/Edit forms, backend/API, or production persistence.

---

## 0. Mandatory Git workflow

Before implementation:

1. Update local `main` to the latest remote `main`.
2. Create a dedicated branch from latest `main`.
3. Suggested branch name: `codex/m4-calendar-mockup`.

When M4 implementation and verification are complete:

1. Capture the required screenshots listed below from the final PR HEAD.
2. Commit all M4 changes.
3. Push the branch.
4. Open a **draft Pull Request** targeting `main`.
5. Include a clearly labeled `Screenshots` section in the PR body.
6. Do not merge the PR.
7. Do not begin M5.
8. Report branch, commit, PR, changed files, test results, screenshot coverage, states, and deviations.

---

## 1. Required route and states

Use the existing route:

```text
#/calendar
```

Support deterministic Calendar mock states through `uilabState`.

Required states:

```text
#/calendar?uilabState=normal
#/calendar?uilabState=dense
#/calendar?uilabState=date-open
#/calendar?uilabState=completed-hidden
#/calendar?uilabState=long-text
```

Unknown values must safely fall back to `normal`.

---

## 2. Calendar purpose

Calendar answers:

> いつ何をする予定か、月全体で把握できるか？

The month view should prioritize date meaning and quick scanning.

Do not turn it into:

- a generic event calendar
- a timetable
- KPI/dashboard layout
- card-heavy schedule screen

The screen should remain quiet, domestic, and compact.

---

## 3. Calendar header

Show:

- year + month, e.g. `2026年8月`
- previous month button
- next month button
- `今日` button

Keep the header compact.

Use icon buttons from the existing Lucide family where appropriate.
All icon-only controls need accessible labels.

Do not add a subtitle under the month heading.

---

## 4. Month grid

Show a full month grid using 7 columns.

Requirements:

- weekday row
- adaptive 5 or 6 week rows depending on month
- each date cell contains date number and date-specific task text rows
- task rows are text-first and compact
- long task names truncate deliberately
- when a cell contains more tasks than can be displayed, show `+N`
- Saturday date text = blue
- Sunday date text = red
- weekday date text = normal

Avoid large rounded date cards.
Use subtle grid/divider structure.

---

## 5. Today treatment

Today should be visible without dominating the month.

Use:

- a subtle round background behind the date number only

Do not:

- color the entire cell
- add a large badge
- use a strong shadow

---

## 6. Which tasks appear in month cells

Display only tasks where the date is meaningful.

Show:

- date-specific tasks on their actual date
- flexible weekly/monthly tasks only on their deadline date

Do not show recurring daily chores on every calendar cell just because they recur.

The calendar is for date meaning, not a duplicate of Home.

---

## 7. Deadline-day emphasis

Tasks that must be completed on that date can receive one shared calendar emphasis color.

Important:

- use **one shared calendar task emphasis color**
- do not reuse Home task-type color coding in the month cells
- date / week / month categories should not each have separate calendar colors

Keep emphasis restrained, e.g. subtle text marker/background/left dot if needed, but avoid one-sided colored card strips.

---

## 8. Completed / passed behavior in month view

Completed and passed tasks should not remain visible in month cells.

The `completed-hidden` fixture should demonstrate that tasks known as completed/passed are excluded from the month grid.

No strikethrough clutter in the month view.

---

## 9. Date detail interaction

Tapping a date cell, a task row, or `+N` opens the selected date detail panel.

The date detail should be a **large bottom sheet / foreground panel that occupies most of the screen**, while still reading as a sheet rather than a completely unrelated route.

Show:

- explicit close/back control
- selected date, e.g. `8月20日 木曜日`
- section `この日`
- section `期間中`
- collapsed completed section `完了済み N件`

Do not add explanatory subtitles.

---

## 10. Date detail content rules

### `この日`

Contains tasks directly associated with the selected date.

Examples:

- exact-date household task
- task due on that date

### `期間中`

Contains relevant tasks whose active period includes the date but whose meaning is not a single exact-date event.

Keep the distinction understandable through grouping, not through explanatory paragraphs.

---

## 11. Date detail task interaction

Task interaction grammar should be consistent with Home where practical:

- tap task row = complete mock action
- left swipe = `編集 / パス`
- no delete from this surface

Reuse/refactor M3 task-row interaction if that reduces duplication without forcing Calendar into an inappropriate Home-specific layout.

The Calendar detail can have minor presentation differences, but interaction semantics should remain consistent.

Completion/pass should remove the task from current date detail and from the month-cell display in local mock state where applicable.

No backend persistence.

---

## 12. Horizontal date navigation in detail panel

When the date detail panel is open, support previous/next date navigation by horizontal swipe.

Desired behavior:

- swipe left -> next day
- swipe right -> previous day
- the whole panel should visually behave as the date content changing, not just a tiny text field

A restrained slide transition is sufficient.
Avoid heavy animation libraries unless justified.

Also provide accessible previous/next controls so keyboard/mouse users can navigate dates.

---

## 13. Closing the date detail panel

Support:

- explicit close/back button
- restrained downward close gesture if practical

The explicit close control is mandatory.

Do not rely on gesture-only dismissal.

---

## 14. Fixtures

Create deterministic Calendar fixture data separated from rendering logic.

Recommended structure:

```text
src/fixtures/calendar/
├─ fixtures.ts
├─ types.ts
└─ index.ts
```

Suggested concepts:

```ts
type CalendarTask = {
  id: string;
  name: string;
  date: string;
  periodStart?: string;
  periodEnd?: string;
  completed?: boolean;
  passed?: boolean;
  assignee?: CalendarPerson;
};
```

Exact types may differ.

Do not call backend/API.

---

## 15. Fixture state expectations

### `normal`

Balanced month view with:

- several dates containing tasks
- at least one Saturday and Sunday visible
- today visible
- a date with 1–2 tasks
- a date with a deadline-day emphasized task

### `dense`

Demonstrate:

- multiple populated dates
- at least one `+N`
- 6-week month layout or sufficiently dense content
- no visual overflow

### `date-open`

Date detail panel open by default with:

- selected date
- `この日`
- `期間中`
- collapsed completed section
- at least one assigned task where useful

### `completed-hidden`

Fixture contains completed/passed tasks internally, but they do not appear in month cells.

### `long-text`

Use realistic long Japanese task names and ensure cell text truncation does not break layout.

---

## 16. Responsive behavior

Reference viewport:

```text
390 × 844
```

Also validate around:

```text
320 × 568
```

Requirements:

- all 7 calendar columns remain visible
- no horizontal scrolling for the month grid
- date numbers remain readable
- task rows truncate rather than overlap
- `+N` remains usable
- date detail remains usable on narrow screens
- BottomNavigation retains all five positions

Do not redesign for desktop.

---

## 17. UI Lab preparation

M8 still owns final adapter metadata, but M4 should use stable semantic identifiers where practical.

Recommended `data-uilab-component` values:

```text
Calendar.Page
Calendar.Header
Calendar.MonthGrid
Calendar.DayCell
Calendar.DayCell.Date
Calendar.DayCell.Task
Calendar.DayCell.More
Calendar.DateSheet
Calendar.DateSheet.Date
Calendar.DateSheet.TodaySection
Calendar.DateSheet.PeriodSection
Calendar.DateSheet.CompletedSection
```

Use stable task/date IDs for `data-uilab-id` when useful.

Do not create final `.uilab/*.json` metadata yet.

---

## 18. Styling constraints

Follow `DESIGN.md` strictly.

Do not use:

- oversized month heading
- large rounded date cards
- decorative shadows
- gradients
- separate color coding for every task category in calendar cells
- excessive whitespace
- nested cards
- persistent helper subtitles

The month should fill the screen efficiently while remaining calm and readable.

---

## 19. Motion

Use restrained CSS motion where sufficient.

Target:

- panel open/close around 180–250ms
- date horizontal transition around 180–250ms
- no bounce/confetti

Respect `prefers-reduced-motion`.

---

## 20. Testing requirements

Add/update behavior tests covering at least:

1. Calendar replaces the placeholder route
2. normal state renders full 7-column month grid
3. Saturday/Sunday semantic classes are applied
4. today semantic state is applied only to date number treatment
5. completed/passed tasks are excluded from month cells
6. dense state renders `+N`
7. tapping a date opens date detail
8. `date-open` opens detail by default
9. detail shows `この日` and `期間中`
10. close control closes detail
11. previous/next date controls update selected date
12. horizontal swipe updates selected date
13. completing/passing a detail task removes it from visible date content as appropriate
14. unknown `uilabState` falls back to normal
15. long-text fixture does not alter month-grid structure
16. BottomNavigation remains outside the Calendar scroll/content region

Prefer semantic/behavior tests over pixel snapshot tests.
Keep all previous M1–M3 tests passing.

---

## 21. Screenshot requirements

Because M4 is visible UI work, screenshots are mandatory.

Required screenshots from final PR HEAD:

390×844:

1. `normal`
2. `dense` showing `+N`
3. `date-open`
4. date detail after navigating to adjacent day OR swipe-navigation visible result
5. `completed-hidden` or another state proving completed/passed tasks are absent while surrounding tasks remain

320×568:

6. `long-text` or `date-open` narrow viewport

If an interaction state is important but difficult to encode as `uilabState`, capture it manually from final HEAD.

PR body must contain a clearly labeled `Screenshots` section.
Do not use stale screenshots.

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

If dependencies change, explain why and report audit status.
Avoid new dependencies unless clearly justified.

---

## 23. Explicit non-goals

Do not implement in M4:

- Shopping list internals
- Shopping templates
- Add/Edit task forms
- production persistence/API
- authentication
- Cloudflare integration
- final UI Lab metadata/package
- final single-file static build
- M5 work

---

## 24. Completion criteria

M4 is complete only when:

- `#/calendar` is a real month calendar mockup
- required `uilabState` values work
- full 7-column month grid is usable at 390px and 320px widths
- Saturday/Sunday/today treatments follow the design direction
- month cells show date-meaningful tasks only
- one shared calendar task emphasis convention is used
- completed/passed tasks are excluded from month cells
- date cell/task/`+N` opens date detail
- date detail has `この日` / `期間中` / completed section
- previous/next and swipe day navigation work
- close control works
- task completion/pass semantics are consistent with Home
- no backend/API dependency exists
- lint/typecheck/test/build pass
- required screenshots come from final HEAD
- `.ai/TASKS.md` reflects M4 completion
- dedicated branch is pushed
- draft PR targeting `main` is open
- M5 is not started

At completion, report:

1. branch name
2. commit SHA
3. PR number/link
4. changed files
5. dependency changes and reasons
6. lint/typecheck/test/build results
7. implemented Calendar states
8. screenshot list and viewport sizes
9. interaction/motion decisions
10. deviations from this spec
11. confirmation that M5 was not started

Stop after opening the PR and wait for review.
