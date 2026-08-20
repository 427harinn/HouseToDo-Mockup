# M1 Implementation Specification — React/Vite Mockup Foundation

## Goal

Create the minimum application foundation required to build HouseToDo UI mockups in later milestones.

This milestone is **not** for designing Home, Calendar, Shopping, or other screens yet.

The visual source of truth is `DESIGN.md`.
The UI Lab import contract is `docs/UI_LAB_ADAPTER_SPEC_v1.md`.
The repository workflow is `docs/CODEX_WORKFLOW.md`.

## Mandatory Git workflow

Before starting implementation, create a dedicated branch from the latest `main`.

When the requested M1 work and tests are complete:

1. commit the changes on that branch
2. push the branch
3. open a Pull Request targeting `main`
4. do **not** merge it
5. do **not** start M2
6. report the branch name, PR number/link, changed files, and test results

Recommended branch name:

```text
feat/m1-react-foundation
```

This branch + PR workflow is mandatory for every implementation task in this repository.

## Scope

Implement only the following:

1. React + Vite + TypeScript foundation.
2. Hash Router-compatible application routing.
3. Shared design-token foundation derived from `DESIGN.md`.
4. Fixture/mock-state architecture.
5. Base quality scripts for lint, typecheck, test, and build.
6. A minimal route placeholder proving the mockup can run without backend/API access.

Do not implement production HouseToDo behavior.
Do not implement UI Lab editor features.
Do not start the actual Home design in M1.

---

## 1. Project foundation

Use:

- React
- Vite
- TypeScript

Keep the dependency set small.

Recommended structure after M1:

```text
src/
├─ app/
│  ├─ App.tsx
│  └─ router.tsx
├─ components/
├─ fixtures/
│  ├─ index.ts
│  └─ types.ts
├─ mock/
│  └─ state.ts
├─ styles/
│  ├─ globals.css
│  └─ tokens.css
├─ pages/
│  └─ FoundationPage.tsx
├─ test/
│  └─ setup.ts
└─ main.tsx
```

The exact folder names may be adjusted if there is a clear reason, but keep responsibilities separated and simple.

---

## 2. Routing

Use a Hash Router-compatible structure because UI Lab v1 will open routes using:

```text
{entry}#{path}?uilabState={state}
```

M1 only needs one placeholder route, for example:

```text
#/foundation
```

Requirements:

- opening the hash route directly must render successfully
- the app must not require server-side SPA fallback
- query parameters after the hash route must remain readable

Do not add BrowserRouter-only assumptions.

---

## 3. Design-token foundation

Create `src/styles/tokens.css` from the current values in `DESIGN.md`.

At minimum include semantic CSS variables for:

```text
--color-bg
--color-surface
--color-primary
--color-primary-strong
--color-text
--color-text-secondary
--color-border
--color-disabled
--color-yellow-beige
--color-marigold
--color-primary-soft

--color-task-date
--color-task-week
--color-task-month
--color-task-no-deadline
--color-task-overdue

--space-1
--space-2
--space-3
--space-4
--space-5
--space-6
--space-8

--radius-input
--radius-action
--radius-sheet
```

Initial color values must match `DESIGN.md`.

Do not invent a large theme framework.
Do not introduce Tailwind unless explicitly approved later.
Plain CSS variables are preferred for M1 because UI Lab and Codex exports can refer to them directly.

Create `globals.css` with only the basic reset/foundation needed for later mobile mockups:

- `box-sizing: border-box`
- system font stack
- background/text defaults
- sensible button/input font inheritance
- no decorative styling yet

---

## 4. Fixture and mock-state architecture

All future screens must work without backend/API access.

Create a small fixture/state pattern that later milestones can extend.

Requirements:

- read `uilabState` from the current hash-route query string
- expose a small helper such as `getUiLabState()`
- unknown/missing states must safely fall back to a declared default
- no API calls
- no persistence required in M1

Do not create real task/business logic yet.

A minimal fixture example can prove state switching works, e.g. `normal` and `alternate` text on the Foundation route.

---

## 5. Placeholder page

Create one intentionally plain `FoundationPage` used only to verify the foundation.

It should show enough information to manually confirm:

- React rendered
- Hash Router works
- current `uilabState` can be read
- design tokens are loaded

Do not style it as a HouseToDo production screen.
Do not begin Home mockup design here.

---

## 6. Quality tooling

Add scripts for:

```text
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
```

Testing can use a lightweight React/Vite-compatible stack.

Minimum tests:

1. fixture/state helper returns the expected state from a hash URL
2. unknown state falls back correctly
3. FoundationPage renders without backend/API dependencies

Avoid large testing frameworks beyond what is needed.

---

## 7. Build constraints

The normal M1 build may remain a standard Vite build.

Do **not** implement the final single-file UI Lab Import build yet; that belongs to M8.

However, do not introduce architecture that would make M8 difficult:

- no hard-coded localhost URLs
- no backend dependency
- no service worker dependency
- no external runtime configuration requirement
- assets should be local when introduced later

---

## 8. Explicit non-goals

Do not implement in M1:

- Home UI
- Calendar UI
- Shopping UI
- Bottom navigation design
- production API calls
- authentication
- Cloudflare integration
- UI Lab `.uilab/` runtime metadata
- `data-uilab-component` attributes for future screen components
- single-file packaging
- animations
- drag/drop
- screenshots

Those belong to later milestones.

---

## 9. Completion criteria

M1 is complete only when all of the following pass:

- React + Vite + TypeScript scaffold exists
- Hash Router route works
- design tokens from `DESIGN.md` are present
- fixture/mock state helper works
- no backend/API dependency exists
- `npm run lint` passes
- `npm run typecheck` passes
- `npm run test` passes
- `npm run build` passes
- `.ai/TASKS.md` is updated with actual completion state
- implementation was done on a dedicated branch
- branch was pushed
- Pull Request to `main` was opened

At completion, report:

1. branch name
2. Pull Request number/link
3. files added/changed
4. dependency choices and why
5. commands run and results
6. any deviations from this spec
7. whether M2 can safely begin

Do not merge the Pull Request.
Do not start M2 automatically after finishing M1. Stop and wait for review.
