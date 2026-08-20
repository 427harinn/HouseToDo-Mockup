# Codex Development Workflow

This repository uses a branch + pull request workflow for every implementation task.

## Mandatory workflow

For every Codex implementation task:

1. Start from the latest `main`.
2. Create a dedicated working branch before making implementation changes.
3. Keep the work scoped to the requested milestone/task only.
4. Run the required quality checks before finishing.
5. Commit the completed changes to the working branch.
6. Push the branch.
7. Open a Pull Request targeting `main`.
8. Report the branch name, PR number/link, changed files, and test results.
9. Do not merge the Pull Request unless explicitly instructed.
10. Do not begin the next milestone automatically.

## Branch naming

Use a short descriptive branch name, for example:

```text
feat/m1-react-foundation
feat/m2-app-shell
feat/m3-home-mockup
fix/home-task-row-spacing
```

## Required reminder in every Codex instruction

Every implementation instruction sent to Codex must explicitly include the following requirement:

> Before starting implementation, create a dedicated branch from the latest `main`. When the requested work and tests are complete, commit and push the branch, then open a Pull Request to `main`. Do not merge it and do not start the next milestone. Report the branch name, PR, changed files, and test results.

This rule applies even when the task appears small.
