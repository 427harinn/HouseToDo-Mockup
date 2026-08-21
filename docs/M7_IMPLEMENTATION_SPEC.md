# M7 Implementation Specification — Other / Settings

## Goal

Replace the `#/other` placeholder with the real HouseToDo Other / Settings experience.

M7 should complete the remaining user-facing mockup surfaces before M8 packaging.

Source of truth:

- `DESIGN.md`
- `docs/CODEX_WORKFLOW.md`

M7 must not implement production backend/API behavior, authentication flows, push delivery, invitation delivery, or UI Lab packaging.

---

## 0. Mandatory Git workflow

Before implementation:

1. Update local `main` to the latest remote `main`.
2. Create a dedicated branch from latest `main`.
3. Suggested branch: `codex/m7-other-settings`.

When implementation is complete:

1. Run all quality gates.
2. Capture screenshots from the final PR HEAD.
3. Commit and push all M7 changes.
4. Open a **draft Pull Request** targeting `main`.
5. Add a clearly labeled `Screenshots` section to the PR body.
6. Do not merge.
7. Do not begin M8.
8. Stop for review.

---

## 1. Routes

Use the existing route:

```text
#/other
```

Add dedicated settings routes:

```text
#/other/members
#/other/notifications
#/other/household
#/other/account
```

These routes should remain hash-router compatible.

Other keeps the normal BottomNavigation visible.

Dedicated settings/detail routes should use a focused settings layout with a top back control. Prefer hiding BottomNavigation on these deeper routes so the screen reads as a configuration flow rather than another primary tab.

---

## 2. Other landing screen

Purpose:

> A quiet entry point for household configuration that does not belong in Home / Calendar / Shopping.

Visible title:

```text
その他
```

Use a simple vertical navigation list.

Required rows:

```text
メンバー       >
通知           >
家庭設定       >
アカウント     >
```

Rules:

- no cards around each item
- no descriptive subtitles under rows
- no counts/KPIs
- no decorative illustrations
- thin dividers only
- touch target at least 44px
- row tap navigates to dedicated route
- use restrained Lucide icons only if they materially improve scanning; icons are optional, not required

Do not invent additional settings just to fill the screen.

---

## 3. Shared Settings pattern

Follow the iOS-settings-like direction from `DESIGN.md`.

Each detail screen should use:

- short screen title
- explicit back button
- vertical settings rows/fields
- immediate local changes when practical
- full-width Save only where an explicit save action is meaningful
- destructive/logout actions separated at the bottom

Do not create a new visual system for M7.
Reuse M6 form/row patterns where they fit, while keeping simple settings rows more compact than full text inputs.

No gradient, shadow-heavy cards, nested cards, or persistent explanatory subtitle under the title.

---

## 4. Members screen

Route:

```text
#/other/members
```

Title:

```text
メンバー
```

Show deterministic household members.

Required member information:

- avatar
- name

Recommended fixture:

```text
ゆき
はる
```

Use the same visual language as assignee avatars from M6 where practical.

At the bottom of the member list, show:

```text
招待する >
```

### Invitation mock

Tapping `招待する` opens a small/large bottom sheet appropriate to the content.

The invitation UI must remain minimal and local-only.

Recommended content:

- household name or short context only if necessary
- deterministic invite code, e.g. `HOUSE-4821`
- `コードをコピー` mock action
- `閉じる`

Do not implement:

- email sending
- share sheet integration
- QR generation unless already available without new dependency and clearly useful
- backend invite creation
- real clipboard requirement if test/runtime complexity is unnecessary; local feedback is sufficient

The sheet should clearly communicate that this is a mock state without adding long explanatory text to the normal screen.

---

## 5. Notification settings

Route:

```text
#/other/notifications
```

Title:

```text
通知
```

Only include settings supported by current HouseToDo product decisions.

Required controls:

### Morning summary

```text
朝のまとめ通知   ON/OFF
```

When enabled, show its time selector directly below/near it.

Default mock time:

```text
9:00
```

### Evening summary

```text
夜のまとめ通知   ON/OFF
```

When enabled, show its time selector.

Default mock time:

```text
21:00
```

Important:

- time rows/fields must be hidden when the corresponding toggle is OFF
- do not leave disabled time fields visible
- settings apply immediately in local state; a Save button is not required
- use native `time` inputs if practical
- task-specific notification configuration remains in M6 Task Edit/Add and must not be duplicated here

Do not implement push permission prompts, service workers, APNs/Web Push, or backend scheduling.

---

## 6. Household settings

Route:

```text
#/other/household
```

Title:

```text
家庭設定
```

Required fields:

### Household name

Example:

```text
わが家
```

Editable text field.

### Timezone

Show a compact selection row or select.

Default:

```text
Asia/Tokyo
```

Because this is a smartphone settings mockup, prefer a compact row + bottom sheet selection if that matches the established M6 selection pattern.

Include a bottom full-width:

```text
保存
```

Mock save only; local status feedback is enough.

Do not add address, household type, family-role labels, subscription settings, or other unsupported fields.

---

## 7. Account screen

Route:

```text
#/other/account
```

Title:

```text
アカウント
```

Keep this screen intentionally small.

Only include currently meaningful mock account information.

Recommended content:

- avatar
- display name, e.g. `はる`
- email-like mock identifier if needed for visual completeness, e.g. `haru@example.com`

Editable display name is acceptable.
Email may be read-only in M7.

At the bottom, visually separated from ordinary settings, show:

```text
ログアウト
```

Tapping Logout should open a confirmation bottom sheet/dialog.

Required confirmation:

- title: `ログアウトしますか？`
- `ログアウト`
- `キャンセル`

Mock only. Do not implement authentication/session behavior.

Do not add:

- password management
- subscription
- billing
- security center
- connected apps
- account deletion unless already explicitly defined elsewhere

---

## 8. Fixture / uilabState requirements

Keep states deterministic and screen-aware.

### Other

```text
#/other?uilabState=normal
```

Unknown state falls back to `normal`.

### Members

```text
#/other/members?uilabState=normal
#/other/members?uilabState=invite-open
```

### Notifications

```text
#/other/notifications?uilabState=normal
#/other/notifications?uilabState=morning-off
#/other/notifications?uilabState=all-off
```

`normal` should show both summary notifications enabled with 9:00 / 21:00.

### Household

```text
#/other/household?uilabState=normal
#/other/household?uilabState=timezone-open
#/other/household?uilabState=saved
```

### Account

```text
#/other/account?uilabState=normal
#/other/account?uilabState=logout-confirm
```

Unknown values must safely fall back to `normal` for each screen.

---

## 9. Recommended semantic identifiers

M8 owns final `.uilab` metadata, but stable identifiers should be added now where practical.

Suggested `data-uilab-component` values:

```text
Other.Page
Other.NavigationList
Other.NavigationRow
Settings.Page
Members.List
Members.Row
Members.InviteRow
Members.InviteSheet
Notifications.MorningToggle
Notifications.MorningTime
Notifications.EveningToggle
Notifications.EveningTime
Household.Name
Household.Timezone
Household.TimezoneSheet
Household.Save
Account.Profile
Account.Logout
Account.LogoutConfirm
```

Use stable `data-uilab-id` values for important rows and controls.

Do not create `.uilab/*.json` yet.

---

## 10. Responsive behavior

Primary viewport:

```text
390 × 844
```

Also validate:

```text
320 × 568
```

Requirements:

- no horizontal overflow
- rows retain 44px+ touch targets
- long household/display names wrap or truncate deliberately
- bottom sheets remain fully usable
- Logout/Delete-style destructive area does not collide with primary controls
- Other landing keeps all five BottomNavigation positions intact
- deeper Settings routes remain usable without BottomNavigation

Do not create a desktop redesign.

---

## 11. Interaction requirements

Required local mock interactions:

- Other row navigation
- Members invite sheet open/close
- invite-code copy mock feedback
- notification toggles show/hide their time controls
- notification time inputs update local state
- household name edit
- timezone sheet open/select/close
- household Save mock feedback
- account logout confirmation open/cancel/confirm

All interactions remain in local React state.
No persistence across reload is required.

---

## 12. Accessibility

Required:

- icon-only back/close buttons have accessible names
- toggles have proper labels and checked state
- member avatars have useful alt/ARIA semantics when informative
- bottom sheets/dialogs expose dialog semantics through the existing component
- disabled controls use real disabled state where applicable
- all tap targets remain at least 44px

---

## 13. Testing requirements

Add/update behavior tests covering at least:

1. `#/other` renders the real Other screen
2. four required navigation rows exist
3. each Other row navigates to the correct settings route
4. deeper settings routes do not show the primary BottomNavigation
5. Members renders deterministic avatar/name rows
6. Invite row opens invitation sheet
7. Invite mock action produces local feedback
8. Notification `normal` shows morning/evening times
9. turning morning OFF hides morning time while evening remains
10. `all-off` hides both time controls
11. notification time values can change locally
12. Household name can edit
13. timezone row opens sheet and selection updates summary
14. Household Save produces mock status feedback
15. Account normal renders restrained profile info
16. Logout opens confirmation
17. Cancel closes confirmation
18. Logout confirm produces mock feedback without real auth behavior
19. unknown `uilabState` falls back safely on each settings family
20. existing M1–M6 tests continue to pass

Prefer behavior tests over visual snapshots.

---

## 14. Screenshot requirements

Screenshots must come from the **final PR HEAD**.

Required at 390×844:

1. Other — normal
2. Members — normal
3. Members — invite-open
4. Notifications — normal
5. Notifications — morning-off or all-off showing hidden conditional time row
6. Household — normal
7. Household — timezone-open
8. Account — normal
9. Account — logout-confirm

Required at 320×568:

10. one settings screen with long household/member/account text demonstrating no overflow

If a state extends below the viewport, include a second bottom-coverage screenshot where needed, as established during M6 review.

PR body must include a clearly labeled `Screenshots` section.
Do not use screenshots from an earlier commit.

---

## 15. Quality gates

Run before opening/updating the PR:

```text
npm run lint
npm run typecheck
npm run test
npm run build
```

All must pass.

Avoid new dependencies unless clearly justified.
If dependencies change, report why and include audit status.

---

## 16. Explicit non-goals

Do not implement in M7:

- production authentication/session logic
- real logout
- real invitations
- email invitation delivery
- real clipboard/share integration if unnecessary for mock fidelity
- QR backend flow
- push permission flow
- Service Worker / Web Push / APNs
- notification scheduling backend
- household persistence/API
- account deletion
- billing/subscription
- M8 `.uilab` metadata
- final single-file build/package

---

## 17. Completion criteria

M7 is complete only when:

- `#/other` is a real Other screen
- Members / Notifications / Household / Account routes exist
- Other uses a simple four-row navigation list
- Members shows avatars/names and minimal invite mock
- notification toggles conditionally reveal time controls
- household name/timezone settings and mock Save work
- account screen remains minimal and has separated Logout confirmation
- required deterministic `uilabState` values work
- 390×844 and 320×568 layouts are usable
- no backend/API dependency exists
- all M1–M6 tests still pass
- lint/typecheck/test/build pass
- final-HEAD screenshots are included in PR
- `.ai/TASKS.md` reflects actual M7 status
- branch is pushed
- draft PR targeting `main` is open
- M8 is not started

Final report must include:

1. branch
2. commit SHA
3. PR number/link
4. changed files
5. dependency changes
6. lint/typecheck/test/build results
7. implemented routes/states
8. screenshot list/viewports
9. invite/notifications/timezone/logout interaction decisions
10. deviations, if any
11. confirmation M8 was not started

Stop for review after opening the draft PR.
