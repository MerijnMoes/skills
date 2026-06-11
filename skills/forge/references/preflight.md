# Forge preflight

Run this before any deeper phase work.

## Required startup checks

1. Read the user request carefully and restate the intended outcome.
2. Inspect the repo for standing context such as `README.md`, `DESIGN.md`, and
   `PRODUCT.md` when present.
3. Confirm whether the task is code-heavy, UI-heavy, risky, or mostly
   documentation.
4. Confirm the repo is on an isolated feature branch or an explicitly approved
   working branch.
5. Confirm whether Playwright already exists in the target application repo
   before planning QA authoring.

## Output

Capture:

- current branch
- relevant project-context files
- likely phase shape
- obvious blockers before planning
