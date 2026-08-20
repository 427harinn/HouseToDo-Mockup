# UI Lab Adapter Specification v1

HouseToDo mockup projects imported into UI Lab must follow this adapter contract.

## 1. Purpose

The mockup project renders HouseToDo UI states only.

UI Lab is responsible for:

- importing the built mockup
- selecting editable elements
- changing position / size / spacing / color / typography
- saving editor state
- exporting change specifications and reference screenshots for Codex

The mockup project must **not** implement UI Lab editor functionality.

## 2. Required project shape

```text
HouseToDo-Mockup/
├─ src/
├─ public/
├─ package.json
├─ dist/
│  └─ index.html
└─ .uilab/
   ├─ project.json
   ├─ screens.json
   ├─ components.json
   ├─ tokens.json
   └─ states.json
```

For UI Lab import, distribute a ZIP containing at minimum:

- built `dist/`
- `.uilab/`
- any required preview assets

Source files may also be included, but UI Lab v1 must not depend on them.

## 3. General mockup requirements

- Normal React + Vite + TypeScript project.
- Built preview runs from `dist/`.
- No backend/API/database dependency.
- Use mock data / fixtures for states.
- Preview works inside an iframe.
- UI Lab editor controls are not rendered by the mockup.
- Use normal Flexbox/Grid/CSS layout.
- Editable elements use stable UI Lab adapter attributes.
- v1 separates semantic component identity from rendered instance identity.
- Import build should be single-file HTML whenever practical.
- No development server requirement.

## 4. `.uilab/project.json`

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

Rules:

- `entry` must point to an HTML file in the ZIP.
- UI Lab v1 must not guess the entry point.
- `formatVersion` is `1`.

## 5. Routing standard

UI Lab v1 uses **Hash Router** style navigation so imported static builds do not need SPA server fallback.

Examples:

```text
index.html#/home
index.html#/calendar
index.html#/shopping
index.html#/home?uilabState=overdue
```

UI Lab constructs preview routes as:

```text
{entry}#{path}?uilabState={state}
```

Do not require BrowserRouter/server fallback in v1.

## 6. `.uilab/screens.json`

```json
{
  "home": {
    "name": "Home",
    "path": "/home",
    "defaultState": "normal"
  },
  "calendar": {
    "name": "Calendar",
    "path": "/calendar",
    "defaultState": "normal"
  },
  "shopping": {
    "name": "Shopping",
    "path": "/shopping",
    "defaultState": "normal"
  }
}
```

Every screen must be reachable from the declared entry through its hash route.

## 7. Stable element identifiers

v1 uses two attributes.

### `data-uilab-component`

Semantic component identity. May repeat.

```tsx
data-uilab-component="Shopping.ItemRow"
```

### `data-uilab-id`

Rendered instance identity. Must be unique within the currently rendered screen.

```tsx
data-uilab-id="shopping-item-milk"
```

Full example:

```tsx
<div
  data-uilab-component="Shopping.ItemRow"
  data-uilab-id="shopping-item-milk"
>
  ...
</div>
```

Nested editable elements may declare their own semantic component and instance ID.

Use readable semantic names; avoid generated hashes or names like `element-1`.

## 8. `.uilab/components.json`

```json
{
  "Shopping.ItemRow": {
    "selector": "[data-uilab-component='Shopping.ItemRow']",
    "instances": "multiple",
    "editable": [
      "position",
      "width",
      "height",
      "padding",
      "margin",
      "gap",
      "fontSize",
      "fontWeight",
      "lineHeight",
      "color",
      "background",
      "border",
      "borderRadius",
      "opacity"
    ]
  }
}
```

Required fields:

- `selector`
- `instances`: `single` or `multiple`
- `editable`

v1 editable keys:

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

Rules:

- Only expose meaningful properties.
- Prefer semantic component-level editing.
- Nested semantic parts may have separate definitions.
- When `instances` is `multiple`, UI Lab selects an instance by `data-uilab-id`.
- Exported changes normally target the semantic component.
- Instance-specific overrides are created only when explicitly requested.

## 9. `.uilab/tokens.json`

```json
{
  "color": {
    "background": "#FCFBF7",
    "surface": "#FFFFFF",
    "primary": "#8FD3B6",
    "text": "#303531",
    "border": "#E5E7E2"
  },
  "spacing": {
    "xs": 4,
    "sm": 8,
    "md": 12,
    "lg": 16,
    "xl": 20,
    "xxl": 24
  },
  "radius": {
    "input": 10,
    "sheet": 16
  }
}
```

Use stable semantic token names. Initial values should follow `DESIGN.md`, then UI Lab may refine them.

## 10. `.uilab/states.json`

```json
{
  "home": {
    "normal": { "name": "Normal" },
    "overdue": { "name": "Overdue" },
    "assigned": { "name": "Assigned" },
    "completed-open": { "name": "Completed Open" },
    "many": { "name": "Many Tasks" },
    "long-text": { "name": "Long Text" },
    "empty": { "name": "Empty" }
  }
}
```

State-switching contract:

```text
#/home?uilabState=<state-id>
```

The mockup must read `uilabState`; unknown states fall back to the screen's `defaultState`.

## 11. Single-file Import build

UI Lab v1 should prefer a **single-file static preview build**.

Preferred:

```text
dist/
└─ index.html
```

The Import build should inline/embed as much as practical:

- JavaScript
- CSS
- small assets

Recommended characteristics:

- one `index.html`
- no runtime HTTP server
- no `npm install` at import time
- no dev server
- no service worker
- no hard-coded localhost asset URLs

The source project may remain a normal multi-file Vite project. Only the UI Lab Import artifact needs the single-file constraint/recommendation.

## 12. iframe execution and DOM inspection

UI Lab needs access to the rendered preview DOM for:

- `getBoundingClientRect()`
- computed style inspection
- adapter attributes
- selection
- applying preview overrides

Therefore v1 requires an execution mode where the parent UI Lab can access the iframe DOM.

Do not configure the iframe so the preview becomes an opaque origin that blocks parent access.

Security scope for v1:

> Trusted local mockup imports only.

If untrusted projects are supported later, migrate to a Preview Bridge / `postMessage` architecture with stronger isolation.

## 13. iframe compatibility requirements

The preview must:

- load without backend/API
- support the Hash Router contract
- allow UI Lab DOM inspection
- avoid hard-coded localhost URLs
- avoid service worker dependency
- avoid external runtime API dependency
- render correctly at UI Lab viewport dimensions

## 14. Assets

Prefer:

- local images
- SVG
- local fixture photos
- local JSON
- system fonts

Prefer embedding assets in the single-file build. Otherwise include them in the ZIP. Do not depend on temporary external URLs.

## 15. Adapter validation

Before handing a mockup to UI Lab, verify:

1. `dist/` exists.
2. `project.entry` exists in the package.
3. `.uilab/project.json` exists.
4. `formatVersion` is `1`.
5. Every declared hash route loads from the entry.
6. Every default state loads.
7. Every state in `states.json` renders.
8. Every selector in `components.json` matches intended elements.
9. Every editable rendered instance has a screen-unique `data-uilab-id`.
10. Repeated elements share the correct semantic `data-uilab-component`.
11. Required preview assets are present.
12. Preview works without backend/API.
13. Preview works in iframe.
14. UI Lab can inspect preview DOM.
15. No UI Lab editor implementation is embedded in the mockup.

## 16. Out of scope for the mockup project

Do not implement:

- drag / resize handles
- selection boxes
- inspector panels
- undo / redo
- UI Lab project import/export
- Codex export generation
- screenshot export tooling
- CSS source rewriting
- React source parsing
- production HouseToDo integration

Those belong to UI Lab or Codex.

## 17. Delivery format

Preferred package:

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

Import flow:

```text
Mockup ZIP
  ↓
validate adapter
  ↓
read project.entry
  ↓
load trusted single-file preview
  ↓
construct hash route + state
  ↓
show screens/states
  ↓
discover semantic components + instances
  ↓
visual adjustment
  ↓
Project Export / Codex Export
```
