# M6 Implementation Specification — Add / Edit Forms

## Goal

Implement the first real Add/Edit mockup flows for both household tasks and shopping items.

M6 owns:

- household task add form
- household task edit form
- shopping add form
- shopping edit form
- shared/reusable form controls where sensible
- reuse picker (`以前の項目から選ぶ`) for add flows
- repeat / assignee selection sheets for household tasks
- local deterministic form behavior only
- destructive delete affordance on edit screens only

M6 does **not** own backend persistence, authentication, real photo upload/storage, Other/Settings, or final UI Lab metadata.

`DESIGN.md` is the source of truth. `docs/CODEX_WORKFLOW.md` is mandatory.

---

## 0. Mandatory Git workflow

Before implementation:

1. Update local `main` to latest remote `main`.
2. Create a dedicated M6 branch from latest `main`.
3. Suggested branch: `codex/m6-add-edit-forms`.

After implementation:

1. Run all quality gates.
2. Capture required screenshots from final PR HEAD.
3. Commit and push.
4. Open a **draft PR** targeting `main`.
5. Include a clearly labeled `Screenshots` section.
6. Do not merge.
7. Do not begin M7.
8. Report branch, commit, PR, files, dependencies, checks, routes/states, screenshots, behavior decisions, deviations.

---

## 1. Routes

Add these hash routes:

```text
#/tasks/new
#/tasks/edit
#/shopping/new
#/shopping/edit
```

These are mockup routes and may use deterministic fixture values.

The existing center `+` sheet must navigate:

- `家事` -> `#/tasks/new`
- `買い物` -> `#/shopping/new`

Existing edit affordances from Home/Calendar/Shopping should navigate to the corresponding edit route where practical without over-expanding M6 scope.

Unknown routes/states must fail safely without backend/API access.

---

# Part A — Shopping Add / Edit

## 2. Shopping add screen

Route:

```text
#/shopping/new
```

Structure from top to bottom:

1. title `買い物を追加`
2. `以前の項目から選ぶ`
3. 商品名
4. 数量
5. メモ
6. 写真
7. large bottom `保存`

Do not add an explanatory subtitle.

The form should feel like a normal mobile settings/form screen rather than a stack of cards.

---

## 3. Shopping reuse picker

`以前の項目から選ぶ` opens a near-full-screen bottom sheet.

Requirements:

- Recent and Template are combined into one list/search experience
- do not visually split into separate Recent / Template sections
- searchable
- each result shows product name + quantity only
- do not show memo text/photo in picker rows
- selection auto-fills the add form
- user can edit populated values before saving
- local deterministic fixtures only

Required picker fixture examples should include at least:

- 牛乳 / 1本
- 卵 / 10個
- 洗濯洗剤 / 詰替え 1袋

---

## 4. Shopping fields

### Product name

- required-looking primary text input
- realistic Japanese fixture value
- no permanent help paragraph

### Quantity

- normal text input/select-like text field is acceptable for mockup
- keep flexible enough for values like `1本`, `2丁`, `詰替え 1袋`

### Memo

- compact textarea
- starts around 1–2 lines
- grows with content if practical

### Photo

M6 does not implement real upload/storage.

Represent photo selection with deterministic local state:

- no photo state
- selected local preview state
- remove/replace affordance may be mock only

Do not implement Cloudflare/R2/file upload.

---

## 5. Shopping edit screen

Route:

```text
#/shopping/edit
```

Reuse the shopping add form.

Differences:

- title = `買い物を編集`
- no `以前の項目から選ぶ`
- prefilled deterministic item data
- destructive `削除` action at the bottom, visually separated from Save

Delete is local/mock only.
Do not put delete next to Save.

---

# Part B — Household Task Add / Edit

## 6. Household task add screen

Route:

```text
#/tasks/new
```

Use the TimeTree-like registration structure defined in `DESIGN.md`.

Structure:

1. title `家事を追加`
2. `以前の項目から選ぶ`
3. 家事名
4. 繰り返し
5. 開始日
6. 終日
7. 日付
8. 時刻
9. 通知
10. 担当
11. メモ
12. large bottom `保存`

Some fields are conditionally hidden according to task settings.

Do not add explanatory subtitle under the title.

---

## 7. Task reuse picker

`以前の項目から選ぶ` opens a near-full-screen bottom sheet.

Requirements:

- Recent + Template combined in one search experience
- searchable
- each result shows task name + short repetition summary
- selection auto-fills the add form
- user can modify values after selection

Required examples:

```text
インコの餌交換    毎日
ゴミ出し          火・金
トイレ掃除        今週のどこか
```

Do not show memo or implementation metadata in picker rows.

---

## 8. Repeat field

Normal form row concept:

```text
繰り返し    毎日 >
```

Tap opens a bottom sheet.

Required options:

- 今回だけ
- 毎日
- 曜日を決める
- 毎月○日
- 今週のどこか
- 今月のどこか

Show a checkmark on the selected option.
Do not create selected cards.

Only show additional configuration required by the selected repeat type.
Do not leave irrelevant controls disabled on screen.

### Repeat-specific behavior

#### 今回だけ

No repeat-specific extra control.

#### 毎日

No extra control.

#### 曜日を決める

Show weekday selection after this option is chosen.
Use compact selectable weekday controls.
At least one deterministic state should demonstrate `火・金`.

#### 毎月○日

Show a day-of-month selection/control.
Example summary: `毎月20日`.

#### 今週のどこか

No weekday selector.
Represents flexible weekly task behavior.

#### 今月のどこか

No day-of-month selector unless required by the natural deadline representation.
Represents flexible monthly behavior.

---

## 9. Start date

`開始日` is always visible.

Default:

```text
今日
```

Use native date input/picker where feasible.

The user should not need to edit this for common tasks.

---

## 10. All-day / Date / Time

All tasks support either:

- `終日`
- time-specific scheduling

Default:

- `終日` ON
- `日付` visible
- `時刻` hidden
- `通知` hidden

Important:

- `日付` stays visible whether all-day is ON or OFF
- when `終日` is OFF, show `時刻`
- when `終日` is OFF, show `通知`
- do not show disabled Time/Notification rows while all-day is ON

Use native date/time inputs where feasible.

The date field should represent the task's natural occurrence/deadline date.

---

## 11. Notification

Notification is shown only when a time is specified (`終日` OFF).

A compact choice row is sufficient.

Suggested deterministic options for mock behavior:

- なし
- 時刻ちょうど
- 10分前
- 30分前

Do not implement real notifications.

---

## 12. Assignee

Normal row concept:

```text
担当    誰でも >
```

Tap opens bottom sheet.

Options:

- 誰でも
- deterministic household members from local fixture

When a specific member is selected, show avatar + name in the form.

Use the same quiet avatar language already established in Home/Calendar/Shopping.

---

## 13. Task memo

Always visible.

Requirements:

- starts at ~1–2 lines
- auto-grow if practical
- do not start as a large empty textarea
- no permanent helper text

---

## 14. Task edit screen

Route:

```text
#/tasks/edit
```

Reuse the same form.

Differences:

- title = `家事を編集`
- no reuse picker
- prefilled deterministic task data
- `削除` at the bottom, visually separated from Save

Delete is local/mock only.

---

## 15. Save behavior

All Add/Edit screens are local mock forms.

On `保存`:

- do not call backend/API
- show restrained success feedback
- navigation back to the owning surface is acceptable
  - task add/edit -> `#/home`
  - shopping add/edit -> `#/shopping`

For deterministic UI Lab review, saving does not need to persist across a full reload.

---

## 16. Delete behavior

Edit screens only.

Requirements:

- destructive action visually separated at bottom
- red text or restrained red outline
- not adjacent to Save
- no delete action on Add forms
- no delete in Home/Calendar/Shopping daily swipe menus

A small confirmation sheet/dialog is preferred so delete is not one accidental tap.

Mock/local only.

---

## 17. Back / close behavior

Each Add/Edit screen needs a clear back/close control.

Do not rely on browser back only.

Use familiar mobile navigation language.

If the form has unsaved changes, M6 does not require a complex discard-warning system unless trivial.

---

## 18. Form visual rules

Follow `DESIGN.md` Forms/Controls sections.

Inputs:

- white/subtle surface
- thin `--color-border`
- radius about 8–10px
- restrained placeholder
- primary border on focus
- restrained red state for validation if demonstrated

Selection rows:

- simple one-line rows
- label left, current value right, chevron where appropriate
- selected option in sheets gets a check at right
- no selected-card background by default

Toggles:

- ON = primary
- OFF = neutral

Do not use:

- card-per-field layouts
- persistent gray explanatory subtitles
- large nested cards
- decorative icons with no purpose
- excessive whitespace

---

## 19. Required deterministic UI states

### Task add states

Support via `uilabState` on `#/tasks/new`:

```text
normal
repeat-sheet
weekday-repeat
time-specific
assignee-sheet
reuse-picker
reuse-selected
long-text
```

Expected intent:

- `normal`: all-day ON, date visible, time/notification hidden
- `repeat-sheet`: repeat selector open
- `weekday-repeat`: `曜日を決める`, example 火・金
- `time-specific`: all-day OFF, date/time/notification visible
- `assignee-sheet`: assignee selector open
- `reuse-picker`: reuse picker open
- `reuse-selected`: form prefilled after selection
- `long-text`: long realistic task name/memo on narrow viewport

### Task edit states

Support at least:

```text
#/tasks/edit?uilabState=normal
#/tasks/edit?uilabState=delete-confirm
```

### Shopping add states

Support via `uilabState` on `#/shopping/new`:

```text
normal
reuse-picker
reuse-selected
photo-selected
long-text
```

### Shopping edit states

Support at least:

```text
#/shopping/edit?uilabState=normal
#/shopping/edit?uilabState=delete-confirm
```

Unknown state -> route's `normal` state.

---

## 20. Responsive behavior

Primary:

```text
390 × 844
```

Also validate:

```text
320 × 568
```

Requirements:

- no horizontal overflow
- bottom Save button remains reachable
- sheets remain usable on narrow screens
- native date/time inputs do not break width
- long labels/values do not collide
- keyboard focus remains visible
- screen scroll occurs inside existing AppShell layout

No desktop redesign.

---

## 21. Bottom navigation / form screens

Add/Edit screens may keep the shared AppShell but should avoid the bottom navigation competing with the form's Save action.

Preferred M6 behavior:

- hide the main BottomNavigation on dedicated Add/Edit routes
- keep a clear top back control
- make the bottom Save action safe-area aware

Do not create a second app shell.

---

## 22. UI Lab preparation

M8 owns final metadata, but use stable semantic attributes where practical.

Recommended examples:

```text
TaskForm.Page
TaskForm.ReusePickerTrigger
TaskForm.Name
TaskForm.Repeat
TaskForm.StartDate
TaskForm.AllDay
TaskForm.Date
TaskForm.Time
TaskForm.Notification
TaskForm.Assignee
TaskForm.Memo
TaskForm.Save
TaskForm.Delete
TaskForm.RepeatSheet
TaskForm.AssigneeSheet
TaskForm.ReuseSheet

ShoppingForm.Page
ShoppingForm.ReusePickerTrigger
ShoppingForm.Name
ShoppingForm.Quantity
ShoppingForm.Memo
ShoppingForm.Photo
ShoppingForm.Save
ShoppingForm.Delete
ShoppingForm.ReuseSheet
```

Use stable row/result IDs.
Do not create final `.uilab/*.json` yet.

---

## 23. Testing requirements

Add/update behavior tests covering at least:

1. Add sheet `家事` navigates to `#/tasks/new`
2. Add sheet `買い物` navigates to `#/shopping/new`
3. Task add normal state shows Start Date + All-day ON + Date and hides Time/Notification
4. turning All-day OFF reveals Time + Notification while Date remains visible
5. repeat sheet contains all required repeat choices
6. weekday repeat reveals weekday-specific control and summary
7. task reuse picker searches combined results and selecting a result pre-fills form
8. assignee picker supports Anyone + member selection and selected member presentation
9. task edit has no reuse picker and includes separated delete action
10. task delete confirmation can open/cancel/confirm mock behavior
11. shopping add reuse picker searches combined results and selection pre-fills form
12. shopping photo-selected state shows local preview without network upload
13. shopping edit has no reuse picker and includes separated delete action
14. shopping delete confirmation can open/cancel/confirm mock behavior
15. Save actions do not call backend/API and navigate/feedback predictably
16. unknown `uilabState` falls back to normal
17. dedicated form routes do not show the main BottomNavigation if following preferred behavior
18. 320px long-text fixture preserves structure without horizontal overflow

Keep all M1–M5 tests passing.

---

## 24. Screenshot requirements

All screenshots must come from final PR HEAD.

### 390×844 required

Task:

1. task add `normal`
2. task add `repeat-sheet`
3. task add `weekday-repeat`
4. task add `time-specific`
5. task add `assignee-sheet`
6. task add `reuse-picker`
7. task add `reuse-selected`
8. task edit `normal`
9. task edit `delete-confirm`

Shopping:

10. shopping add `normal`
11. shopping add `reuse-picker`
12. shopping add `reuse-selected`
13. shopping add `photo-selected`
14. shopping edit `normal`
15. shopping edit `delete-confirm`

### Narrow viewport

At least one 320×568 screenshot for each form family:

16. task add `long-text` 320×568
17. shopping add `long-text` 320×568

PR body must include a clearly labeled `Screenshots` section.
Do not use stale screenshots.

---

## 25. Quality gates

Before opening PR:

```text
npm run lint
npm run typecheck
npm run test
npm run build
```

All must pass.

Avoid new dependencies unless clearly justified.
If dependencies change, explain why and report audit status.

---

## 26. Explicit non-goals

Do not implement in M6:

- backend/API persistence
- real notification scheduling
- real image upload/storage
- Cloudflare/R2 integration
- authentication
- Other/Settings screens
- final UI Lab metadata/package
- production recurrence engine
- production date scheduling logic
- M7 work

---

## 27. Completion criteria

M6 is complete only when:

- all four Add/Edit routes render real mockup forms
- center Add action navigates into correct add route
- reuse pickers work locally
- task repeat behavior is conditional and understandable
- Start Date is always visible
- Date remains visible in both all-day/time-specific modes
- Time/Notification appear only when appropriate
- Assignee selection works locally
- edit screens omit reuse picker and include separated delete
- shopping photo is local mock only
- no backend/API dependency exists
- lint/typecheck/test/build pass
- required screenshots are final-HEAD screenshots
- `.ai/TASKS.md` reflects M6 completion
- dedicated branch is pushed
- draft PR targeting `main` is open
- M7 is not started

At completion report:

1. branch name
2. commit SHA
3. PR number/link
4. changed files
5. dependency changes/reasons
6. lint/typecheck/test/build results
7. routes and UI states implemented
8. screenshot list + viewports
9. form/sheet interaction decisions
10. deviations from spec
11. confirmation M7 not started

Stop after opening the PR and wait for review.
