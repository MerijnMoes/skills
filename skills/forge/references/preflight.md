# Forge preflight

Run this before any deeper phase work.

## Required startup checks

1. Read the user request carefully and restate the intended outcome.
2. Inspect the repo for standing context such as `README.md`, `DESIGN.md`, and
   `PRODUCT.md` when present.
3. Map the task to one primary class from `classification.md`:
   `docs-only`, `backend-only`, `ui-or-flow`, or `mixed-feature`.
4. Confirm whether the `high-risk` overlay applies in addition to the primary
   class.
5. Confirm the repo is on an isolated feature branch or an explicitly approved
   working branch.
6. Confirm whether Playwright already exists in the target application repo
   before planning QA authoring.

## Output

Capture:

- current branch
- relevant project-context files
- chosen primary class and any overlays
- obvious blockers before planning
