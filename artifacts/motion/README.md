# Motion evidence

Each operation has a 390×844 PNG frame sequence captured from the local Vite app. Frames are sampled before the interaction and at roughly 40–45ms intervals afterward so reviewers can inspect the same evidence that would be used for a short browser recording.

Sequences:

- `task-complete-*.png`
- `task-swipe-*.png`
- `shopping-purchase-*.png`
- `bottom-sheet-*.png`
- `calendar-month-swipe-*.png`
- `calendar-day-swipe-*.png`

The browser-control runtime available for this task exposes screenshots but not browser video recording, and ffmpeg is not installed in the workspace environment. The PR body records this evidence-format deviation.
