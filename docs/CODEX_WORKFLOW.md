# Codex Development Workflow

This repository uses a branch + pull request workflow for every implementation task.

## Mandatory workflow

For every Codex implementation task:

1. Start from the latest `main`.
2. Create a dedicated working branch before making implementation changes.
3. Keep the work scoped to the requested milestone/task only.
4. Run the required quality checks before finishing.
5. For every user-visible UI change, capture screenshots of the implemented result.
6. Store or attach those screenshots so they can be shown in the Pull Request.
7. Commit the completed changes to the working branch.
8. Push the branch.
9. Open a Pull Request targeting `main`.
10. Include implementation screenshots in the Pull Request body whenever the task changes visible UI.
11. Report the branch name, PR number/link, changed files, test results, and screenshot coverage.
12. Do not merge the Pull Request unless explicitly instructed.
13. Do not begin the next milestone automatically.

## Screenshot requirements

For tasks that change visible UI, screenshots are mandatory.

Capture enough screenshots to review the implementation without running the branch locally.

At minimum:

- capture the primary implemented screen/state
- capture any important open/expanded/modal state added by the task
- use a representative smartphone viewport, normally around 390 × 844 unless the task specifies another viewport
- if the task explicitly concerns responsive behavior, include the relevant additional viewport(s)
- avoid screenshots that include unrelated desktop/browser clutter when possible

Prefer deterministic mock/fixture data so screenshots are reproducible.

The PR body should include a `Screenshots` section with the images embedded or linked clearly.

Do not create screenshots for changes that have no meaningful visible UI effect, such as documentation-only or internal refactor tasks.

## Branch naming

Use a short descriptive branch name, for example:

```text
feat/m1-react-foundation
feat/m2-app-shell
feat/m3-home-mockup
fix/home-task-row-spacing
```

## Review workflow

After Codex opens the Pull Request, the user will tell ChatGPT that the PR is ready for review.

ChatGPT should then:

1. Inspect the PR metadata and changed files.
2. Review the code/diff against the milestone specification and `DESIGN.md`.
3. Review the PR screenshots for visible UI changes.
4. Check tests/quality-gate information when available.
5. If changes are required, add the review feedback directly to the Pull Request as GitHub review/comment feedback rather than only describing it in chat.
6. Tell the user what was commented and whether another review pass is required.
7. If no blocking changes are found, tell the user the PR is ready to merge.

ChatGPT must not merge the Pull Request unless the user explicitly asks it to do so.

## Required reminder in every Codex instruction

Every implementation instruction sent to Codex must explicitly include the following requirement:

> Before starting implementation, create a dedicated branch from the latest `main`. When the requested work and tests are complete, capture screenshots of every meaningful visible UI change and include them in the Pull Request. Then commit and push the branch and open a Pull Request to `main`. Do not merge it and do not start the next milestone. Report the branch name, PR, changed files, test results, and screenshot coverage.

This rule applies even when the task appears small. Screenshot requirements apply whenever the task has a meaningful visible UI effect.
