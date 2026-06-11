# Forge preflight

Run this before any deeper phase work.

## Required startup checks

1. Read the user request carefully and restate the intended outcome.
2. Load `project-knowledge.md` and inspect the repo for standing context such
   as `README.md`, `PRODUCT.md`, `DESIGN.md`, `CONTEXT-MAP.md`,
   `CONTEXT.md`, and `docs/adr/` when present.
3. If the user asks to set up, initialize, onboard, or configure the repo for
   Forge, route to `setup.md` before normal discovery. Also route there when
   missing project context blocks confident work.
4. Identify whether the request needs a written spec, an implementation plan,
   or both before edits begin.
5. Map the task to one primary class from `classification.md`:
   `docs-only`, `backend-only`, `ui-or-flow`, or `mixed-feature`.
6. Confirm whether the `high-risk` overlay applies in addition to the primary
   class.
7. Confirm the repo is on an isolated feature branch or an explicitly approved
   working branch.
8. Confirm whether Playwright already exists in the target application repo
   before planning QA authoring.

## Output

Capture:

- current branch
- project knowledge inventory: relevant files found, missing-but-relevant
  files, and any obvious stale or conflicting docs
- whether setup is required or explicitly requested
- chosen primary class and any overlays
- whether spec and plan artifacts are required
- obvious blockers before planning
