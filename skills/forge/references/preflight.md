# Forge preflight

Run this before any deeper phase work.

## Required startup checks

1. Read the user request carefully and restate the intended outcome.
2. Load `project-knowledge.md` and inspect the repo for standing context such
   as `README.md`, `PRODUCT.md`, `DESIGN.md`, `CONTEXT-MAP.md`,
   `CONTEXT.md`, and `docs/adr/` when present.
3. Identify whether the request needs a written spec, an implementation plan,
   or both before edits begin.
4. Map the task to one primary class from `classification.md`:
   `docs-only`, `backend-only`, `ui-or-flow`, or `mixed-feature`.
5. Confirm whether the `high-risk` overlay applies in addition to the primary
   class.
6. Confirm the repo is on an isolated feature branch or an explicitly approved
   working branch.
7. Confirm whether Playwright already exists in the target application repo
   before planning QA authoring.

## Output

Capture:

- current branch
- project knowledge inventory: relevant files found, missing-but-relevant
  files, and any obvious stale or conflicting docs
- chosen primary class and any overlays
- whether spec and plan artifacts are required
- obvious blockers before planning
