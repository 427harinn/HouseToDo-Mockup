# HouseToDo DESIGN.md

> Version: v1 — Director / System / major screen interaction decisions reflected as of 2026-08-19.

## 0. Purpose

HouseToDo is a shared household life-management app for people who live together.

The UI must feel like a place to **see today's life at a glance**, not like a task-management dashboard.

Core priority:

1. **Clean / uncluttered**
2. **Fits naturally into daily life**
3. **Feels reassuring**

The app should show enough information to be useful without looking busy.

---

# 1. Director

## 1.1 Product feeling

HouseToDo should feel:

- clean and uncluttered
- natural in daily life
- reassuring because states are clear
- warm, but not childish
- quiet, but pleasant to interact with

Reference direction:

- FamilyBank: household/life-oriented information organization
- みてね: warmth, friendliness, comfortable whitespace
- TimeTree: calendar and mobile information hierarchy
- iOS system apps: clarity, restraint, familiar interaction

Do not copy any service literally. Extract useful interaction and hierarchy patterns and adapt them to HouseToDo.

## 1.2 Target user

Primary mental model:

- couples
- people living together
- married partners
- small households

The product must remain neutral enough to work for larger families or shared living situations.

Avoid:

- overly child-oriented visuals
- assumptions about family structure
- gendered styling

## 1.3 Product personality

Use everyday Japanese UI language.

Prefer short labels.

Examples:

- 家事を追加
- 完了
- パス
- 担当
- 通知
- 繰り返し
- 買い物
- 保存

Avoid long system-like terms where shorter everyday language works.

Do not add explanatory subtext under headings unless truly necessary.

## 1.4 Signature

HouseToDo's identity should come primarily from **information structure and interaction**, not decoration.

The main signature is:

> Household tasks are naturally ordered by when they actually need attention.

On Home, tasks are sorted by real urgency / deadline rather than being separated into large sections such as 今日 / 今週中 / 今月中.

Time scope is still visible through the task check color and deadline text.

Secondary signature:

- who is responsible
- who completed an item
- shared household state

---

# 2. Anti-patterns / Prohibited design

Do not use:

- strong gradients
- purple/blue AI-SaaS style gradients
- oversized rounded cards
- card-everything layouts
- colored strip on only one edge of a card
- decorative shadows
- unnecessary decorative icons
- oversized headings
- KPI/dashboard-style summary blocks
- excessive animation
- childlike color usage
- excessive whitespace
- cramped information density
- English used only to look stylish
- persistent small gray explanatory text under headings
- `<h1>` followed by a smaller explanatory subtitle by default
- fake “premium” spacing
- nested cards inside cards
- visual decoration that has no information or interaction purpose

Default rule:

> If hierarchy can be expressed with spacing, border, typography, or ordering, do not create a card.

---

# 3. Device assumptions

HouseToDo is designed primarily for smartphones.

Priority:

1. smartphone one-handed use
2. short interactions lasting only a few seconds
3. smartphone configuration flows

Desktop is not a primary design target.

Desktop support only needs to avoid broken layouts.

---

# 4. Core color system

## 4.1 Base palette

| Token | Color | Use |
|---|---|---|
| `--bg` | `#FCFBF7` | Main app background |
| `--surface` | `#FFFFFF` | Sheets, input surfaces, necessary raised surfaces |
| `--primary` | `#8FD3B6` | Main accent |
| `--primary-strong` | `#4E9F7D` | Strong accent / pressed / high-contrast primary |
| `--text` | `#303531` | Main text |
| `--border` | `#E5E7E2` | Dividers and input borders |

Optional accents:

| Token | Color | Use |
|---|---|---|
| `--yellow-beige` | `#E8DDBE` | Very limited supporting accent |
| `--marigold` | `#F2C968` | Limited emphasis |
| `--primary-soft` | `#E7F5EF` | Subtle selected background |
| `--text-secondary` | `#717772` | Secondary information |
| `--disabled` | `#C8CCC7` | Disabled state |

General color ratio:

- mostly cream-white / white
- small amount of neutral text/borders
- primary emerald for actions/states
- yellow/beige only in small doses

Do not use beige as a large app header or footer surface by default.

## 4.2 Home task check colors

The check circle communicates task time-scope without extra labels.

| Meaning | Color |
|---|---|
| Date-specific | `#78AFC7` |
| This week | `#8FD3B6` |
| This month | `#E2BE73` |
| No deadline | `#AEB5AF` |
| Overdue | `#D96B63` |

Overdue overrides the normal task-type check color.

Only the check color changes for overdue tasks.

Do not change:

- row background
- task name color
- deadline text color

---

# 5. Typography

Use system fonts.

On iOS, prefer the native system stack automatically.

Do not introduce a custom brand font unless later testing proves necessary.

Suggested sizes:

| Role | Size |
|---|---|
| Screen title | 20px |
| Section heading | 15–16px |
| Task / item name | 16–17px |
| Form label | 14–15px |
| Secondary info | 13–14px |
| Bottom navigation | no visible text label |
| Button text | 15–16px |

Suggested weights:

- normal text: 400
- task / item name: ~500
- screen title: ~600

Avoid bold-heavy layouts.

Information hierarchy:

1. Primary: task name, item name, date, key section label
2. Secondary: deadline, quantity, assignee presence, count
3. Tertiary: completion time, purchaser, history details

Do not create hierarchy by shrinking everything into tiny gray text.

---

# 6. Spacing

Base spacing scale:

`4 / 8 / 12 / 16 / 20 / 24 / 32`

Suggested values:

| Use | Value |
|---|---|
| Screen horizontal padding | 16px |
| Section gap | 20–24px |
| List row vertical padding | 12–14px |
| Form field gap | ~16px |
| Small internal gap | 8px |
| Minimum touch target | 44px |

Goal:

> readable, tappable, but not sparse.

---

# 7. Radius

Avoid large “AI card” radii.

Suggested:

| Element | Radius |
|---|---|
| Input / normal button | 8–10px |
| Large action button | 10–12px |
| Small surface | 10–12px |
| Large bottom sheet | ~16px top corners |
| Normal task / shopping row | no card radius by default |
| Avatar / task check | fully round only when semantically appropriate |

---

# 8. Borders, shadows, surfaces

Use:

- thin dividers
- spacing
- white surfaces where contrast is actually needed

Do not use shadows by default.

List rows should generally be separated by `--border`.

Bottom sheets use white surface and rounded top corners.

Inputs may use:

- white background + border
- or an extremely subtle surface distinction

Do not use a shadow to make every element “float”.

---

# 9. Buttons

## Primary

Use for the current screen's main action only.

Examples:

- 保存
- 購入
- 戻す

Style:

- near-full-width when used as form / purchase action
- easy to tap
- no gradient
- no heavy shadow
- restrained radius

Default color candidate:

`--primary`

Final contrast/text color can be adjusted after visual testing.

## Secondary

- white background
- border
- short label

## Destructive

- red text or restrained red outline
- do not present destructive actions in daily swipe menus

## Icon buttons

- visual icon can be small
- touch area must remain at least 44px
- no decorative icon buttons

---

# 10. Icons

Use simple outline icons.

Style reference:

- SF Symbols-like
- Lucide-like

Rules:

- medium stroke
- no mixed icon families
- no decorative icons
- fill icons only when semantically useful
- icon-only bottom navigation
- accessibility labels must still exist internally

---

# 11. Bottom navigation

Order:

1. Home
2. Calendar
3. Add
4. Shopping
5. Other

Visible UI:

- icons only
- no visible labels
- white background
- thin top border
- no shadow
- selected icon: `--primary`
- unselected icons: neutral gray
- center `+` is slightly larger
- do not use a floating oversized FAB

The `+` opens a lightweight choice:

- 家事
- 買い物

---

# 12. Interaction consistency

Do not force identical gestures where the primary user intent differs.

Instead keep a consistent interaction grammar:

- tap = primary action or reveal useful detail
- left swipe = secondary action
- destructive actions = deeper screen
- add = center `+`
- bottom sheets = modal selections/details
- gestures should have visible fallback controls where discovery matters

---

# 13. Home

## 13.1 Purpose

Home is the place to see:

> What needs attention now?

Do not structure Home as 今日 / 今週中 / 今月中 sections.

Use one urgency-sorted list.

## 13.2 Header

Show:

- subtle date, e.g. `8月19日 水曜日`
- subtle `やること`

Hierarchy:

`Task name > やること > date`

Do not show a greeting.

Do not add a top “Add” button.

Add is handled by the bottom `+`.

## 13.3 Task ordering

Order by practical deadline urgency:

1. overdue
2. nearest deadline
3. later deadlines
4. no-deadline tasks last

Weekly/monthly tasks rise naturally as their deadline approaches.

## 13.4 Task row

Show:

- colored circular check indicator
- task name
- deadline directly below the task name
- assignee avatar only when a specific person is assigned

Do not show “誰でも”.

Examples:

- `9:00まで`
- `日曜まで`
- `8/31まで`
- overdue from a previous day: `8/19 9:00まで`

Do not replace the actual deadline with “期限超過”.

The red check already communicates overdue.

## 13.5 Home task interaction

Current chosen model:

- tap row = complete
- left swipe = `編集 / パス`
- delete is not exposed on Home
- delete lives in edit/detail management

Pass removes the task from the current Home view.

The next applicable daily/weekly/monthly occurrence can appear normally later.

## 13.6 Completion animation

Use a round check animation inspired by high-quality existing checkbox patterns.

Preferred behavior:

- inactive: outlined colored circle
- on complete: color appears to fill / adhere into the circle
- white check appears
- subtle scale / fill motion
- approximately 150–220ms
- weak/no bounce

Use task-type color for the fill unless later testing suggests a unified completion color.

Research existing implementations before writing a custom one.

Animate Club checkbox examples are a visual reference, not a requirement to copy code literally.

## 13.7 Completed tasks

Move completed tasks to a bottom collapsed area:

`完了済み N件`

Default: collapsed.

Expanded rows show:

- task name
- completion time
- completing user's avatar

Deadline is not necessary in the completed section.

Pass items do not appear here.

## 13.8 In-progress state

Do not visually emphasize “in progress” on Home.

Household tasks rarely need that state visible in the primary list.

## 13.9 Shopping summary

At the bottom of Home:

`買い物 N件 >`

One simple line link.

Do not show product names on Home.

## 13.10 Empty state

Use:

- small life-themed illustration
- `やることはありません`

---

# 14. Calendar

## 14.1 Purpose

Calendar is for monthly overview and date-specific household planning.

The month calendar itself should fill almost the entire screen, TimeTree-style.

## 14.2 Month view

Requirements:

- show full month in one screen
- adapt cell height based on 5-week / 6-week month
- fit as many task-name rows as possible
- one task per text line
- truncate long names with `…`
- if overflow remains, show `+N`

Tapping:

- date cell
- task text
- `+N`

all open the date detail panel.

## 14.3 What appears in month cells

Prioritize tasks where the date itself is meaningful.

Display primarily:

- one-time/date-specific tasks
- monthly fixed-date tasks
- other date-fixed occurrences where useful

Do not fill every cell with recurring daily tasks.

Flexible weekly/monthly tasks are not rendered across every day in their active period.

They appear in the month cell **only on their deadline date**, where they can receive the same deadline-day emphasis as other tasks that must be done that day.

## 14.4 Deadline-day emphasis

Only tasks that must be done on that day receive the calendar task emphasis color.

Examples:

- a date-specific task scheduled for that day
- weekly flexible task whose deadline is that day
- monthly flexible task whose deadline is that day

Use one shared emphasis color.

Do not color-code these by task type inside Calendar.

## 14.5 Completed / passed items

Completed items disappear from the month cell.

Passed items disappear from the month cell.

Past history belongs in date detail/history, not the overview.

## 14.6 Today

Today is shown by a subtle round background behind the date number only.

Do not tint the entire cell.

## 14.7 Weekday colors

- weekdays: neutral
- Saturday: blue
- Sunday: red

Use restrained shades.

## 14.8 Calendar header

Show:

- year/month
- previous month
- next month
- `今日` button

Keep the header compact.

## 14.9 Date detail panel

Tapping a date opens a large bottom sheet that covers almost the whole screen while leaving a small amount of the calendar visible.

Structure:

- close/back control
- subtle date
- `この日`
- `期間中`

`この日` includes:

- date-specific
- daily
- weekday-based
- monthly fixed-date tasks

`期間中` includes:

- this-week flexible tasks
- this-month flexible tasks

Sort within each section by deadline.

Task interaction is the same as Home:

- tap = complete
- left swipe = `編集 / パス`

Completed tasks appear in a collapsed area inside the date detail:

`完了済み N件`

Default: collapsed.

Expanded completed rows follow the same quiet presentation as Home, showing the task name, completion time, and completing user's avatar.

Passed items do not appear in this completed area.

## 14.10 Date navigation

Swipe horizontally:

- entire panel slides to previous/next day
- date and contents move together

Close via:

- downward swipe
- explicit close/back control

---

# 15. Shopping

## 15.1 Screen header

Show only:

`買い物`

Do not show item count in the screen title.

Home already shows the outstanding count.

## 15.2 Main list ordering

Default:

- oldest added item first

Manual priority:

- long press an item
- drag to reorder
- shared order is synchronized for all household members

The list order itself represents priority.

Do not add separate High / Medium / Low priority labels.

## 15.3 Collapsed row

One compact row:

- product name left
- memo icon if memo exists
- photo icon if photo exists
- quantity at far right

Concept:

`牛乳        [memo][photo]   1本`

Do not display memo text or photo preview in the collapsed list.

## 15.4 Expand behavior

Tap a row:

- expand that same row vertically

Only one shopping item can be expanded at a time.

Tap another item:

- previous item closes
- new item opens

Tap same item again:

- close

## 15.5 Expanded item order

1. item name / icons / quantity
2. large near-full-width `購入` button
3. memo
4. photo

Photo:

- supporting information only
- approx 40–60% width
- capped height
- modest radius
- optional tap-to-enlarge

Do not make the image the visual focus.

## 15.6 Purchase state

On purchase:

- item moves to `購入済み N件`
- purchased section is collapsed by default

Tap purchased section to open.

Purchased row shows:

- product name
- quantity
- purchase time
- purchaser avatar

Tap a purchased row:

- expand using same layout
- primary button becomes `戻す`
- memo/photo remain viewable

## 15.7 Swipe

Unpurchased item:

- left swipe = `編集`

Do not expose delete in the swipe action.

Delete belongs in edit screen.

## 15.8 Empty state

Small illustration +:

`買うものはありません`

---

# 16. Shopping add / edit

## 16.1 Add screen

Structure:

1. `買い物を追加`
2. `以前の項目から選ぶ`
3. 商品名
4. 数量
5. メモ
6. 写真
7. large bottom `保存`

No explanatory subtitle under title.

## 16.2 Reuse picker

`以前の項目から選ぶ` opens a near-full-screen bottom sheet.

UI does not separate Recent and Template.

Search both together.

Show in picker:

- product name
- quantity

Do not show memo/photo in the picker.

Selecting an item auto-fills the form.

User can modify values before saving.

## 16.3 Edit screen

Reuse the same form.

Differences:

- title: `買い物を編集`
- no reuse picker
- destructive delete action is placed at the bottom, visually separated

---

# 17. Household task add / edit

## 17.1 Add screen

Use TimeTree-like registration structure.

Structure:

1. `家事を追加`
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

Some time fields are conditionally hidden.

## 17.2 Reuse picker

Near-full-screen bottom sheet.

Combine Recent + Template in one search experience.

Show:

- task name
- short repetition summary

Examples:

- `インコの餌交換` / `毎日`
- `ゴミ出し` / `火・金`
- `トイレ掃除` / `今週のどこか`

Selection auto-fills the form.

## 17.3 Repeat options

Normal row:

`繰り返し   毎日 >`

Tap opens bottom sheet.

Labels:

- 今回だけ
- 毎日
- 曜日を決める
- 毎月○日
- 今週のどこか
- 今月のどこか

Show only additional settings required by the chosen repetition type.

Do not show irrelevant fields.

## 17.4 Start date

Always visible.

Default:

`今日`

User only changes it when needed.

## 17.5 All-day / time

All tasks support:

- 終日
- or time-specific

Default:

**終日 ON**

The date field is always visible, regardless of the all-day setting.

Default:

- `終日 ON`
- date = the task's natural occurrence/deadline date

When all-day is ON:

- date remains visible
- time is hidden
- notification is hidden

When all-day is OFF:

- date remains visible
- time appears
- notification appears

The date defaults to the task's natural occurrence/deadline date, so users only need to change it when necessary.

Date and time are separate controls.

Use OS-native date/time pickers.

## 17.6 Notification

Only show notification when a time is specified.

Do not show a disabled notification control while all-day is ON.

## 17.7 Assignee

Normal row:

`担当   誰でも >`

Tap opens bottom sheet.

Options:

- 誰でも
- household members

Selected member is shown as avatar + name in the form.

Home only shows the avatar when a specific member is assigned.

## 17.8 Memo

Always visible.

Start at 1–2 lines.

Auto-grow vertically as content grows.

Avoid a large empty textarea by default.

## 17.9 Edit screen

Same form as add.

Differences:

- `家事を編集`
- no reuse picker
- delete placed at bottom and visually separated

---

# 18. Other / Settings

## 18.1 Other

Simple vertical navigation list.

Example:

- メンバー
- 通知
- 家庭設定
- アカウント

No cards.

No descriptive subtitles.

Tap row to open detail settings.

## 18.2 Settings common pattern

Use an iOS-settings-like structure.

- short screen title
- vertical list
- toggle on right for booleans
- `項目名   現在値 >` for choices
- save button only where explicit saving is needed
- immediate settings can apply immediately
- destructive/logout actions at bottom

Do not create a new visual style for Settings.

## 18.3 Members

Show:

- avatar
- name

Add:

`招待する >`

Keep invitation UI minimal.

## 18.4 Notification settings

Only show relevant controls.

Example:

- 夜のまとめ通知 toggle
- time appears only when enabled

Task-specific notifications remain in task editing.

## 18.5 Household settings

Examples:

- household name
- timezone

Use bottom full-width save where necessary.

## 18.6 Account

Keep to currently supported settings only.

Do not invent settings just to fill the screen.

Logout stays at the bottom.

---

# 19. Forms

Input style:

- white / subtle surface
- `#E5E7E2` border
- 8–10px radius
- restrained placeholder
- focus: primary border
- error: restrained red border/state
- no persistent explanatory text under fields by default

Prefer conditional fields over disabled clutter.

---

# 20. Controls

## Toggle

ON:

`--primary`

OFF:

neutral gray

## Selection list

- one-line list
- selected item gets a check at right
- no selected-card background unless needed
- thin divider
- full-row tap target

## Home task check

Special semantic control; uses the time-scope color system defined earlier.

---

# 21. Bottom sheets

Shared rules:

- white surface
- top radius ~16px
- slide from bottom
- subtle drag handle
- background dimmed slightly
- flexible height
- near-full-screen when content is large
- short heading
- no explanatory subtitle
- strong shadows avoided

Use for:

- Calendar date detail
- repeat selection
- assignee selection
- “previous items” picker
- other modal selections

---

# 22. Feedback and loading

## Success

Short toast:

- `保存しました`
- `購入しました`
- `完了しました`

## Error

Short red-accent toast.

Examples:

- `保存できませんでした`

Input errors:

- highlight only the relevant field
- use short error copy

## Loading

Prefer:

- skeleton
- small spinner

Avoid full-screen loading unless unavoidable.

---

# 23. Swipe actions

Home:

- `編集`
- `パス`

Shopping:

- `編集`

Visual direction:

- Edit: neutral / primary-adjacent
- Pass: yellow-beige / marigold-adjacent
- no destructive delete swipe

Actions should follow the finger naturally.

---

# 24. Avatars

- circle
- 24–28px in list contexts
- user image when available
- otherwise initial
- soft primary background for initials
- no border by default
- do not overlap multiple avatars by default

Used for:

- assignee
- completer
- purchaser

---

# 25. Empty-state illustration

Style:

- simple line-art
- small
- adult-oriented
- household/life motif
- pale emerald as main color
- yellow-beige / marigold as minor accents

Examples:

- Home: laundry/check/household motif
- Shopping: shopping bag/basket motif

Avoid mascots or highly character-driven art.

---

# 26. Motion

Overall goal:

> quiet, polished, and pleasant — never flashy.

Suggested timing:

150–250ms for most interactions.

Patterns:

| Action | Motion |
|---|---|
| Screen push | subtle horizontal slide |
| Back | reverse horizontal slide |
| Bottom sheet | slide from bottom |
| Shopping expansion | smooth layout growth |
| Task completion | check animation + short fade/move |
| Purchase | button response + row move |
| Swipe | finger-tracking reveal |
| Calendar date navigation | whole panel slides horizontally |

Avoid:

- large bounce
- confetti
- long easing
- decorative motion with no interaction purpose

---

# 27. Reuse existing animation / interaction patterns

Before building custom animation or gesture logic:

1. search for high-quality existing implementations
2. check maintenance status
3. check license
4. adapt the pattern to HouseToDo's design system
5. only custom-build when suitable existing implementations do not meet requirements

Potential sources:

- Motion
- React Spring
- maintained Base UI / shadcn-compatible patterns
- reputable open-source gesture components
- Animate Club-style interaction references
- official framework examples

Do not blindly copy outdated packages.

Do not copy proprietary product assets or branded visual designs.

Reuse interaction mechanics and licensed implementation patterns.

---

# 28. Animation / interaction examples to investigate during implementation

Research existing implementations for:

- animated checkbox fill
- swipe actions
- draggable shopping reorder
- bottom sheet drag and dismiss
- horizontal day paging
- expandable shopping row
- list removal/reflow after complete/purchase
- skeleton loading
- toast feedback

Prefer well-known, maintained patterns over original reinvention.

---

# 29. Accessibility baseline

Even though the visible design is minimal:

- icon-only bottom navigation must have accessible labels
- minimum touch target 44px
- color must not be the only critical way to communicate destructive/error actions
- text/background contrast must be checked before finalizing colors
- reduced-motion preferences should be respected where feasible

The semantic task-type color system may be supported by deadline text so users do not have to understand color alone.

---

# 30. Final design principle

When making a UI decision, choose the option that best satisfies this order:

1. **Is it visually clean?**
2. **Does it fit naturally into everyday household use?**
3. **Is the state understandable and reassuring?**
4. **Can it be operated quickly on a phone?**
5. **Does it feel like HouseToDo without unnecessary decoration?**

If a feature requires explanation to understand, first attempt to simplify the interaction or information structure before adding helper text.
