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
4. If the user explicitly asks for `/moes`, hand the request to the `moes`
   skill after preflight instead of running the full
   discovery-to-implementation workflow. Treat phrases such as `against base`, `against main`, `against develop`, or `against <branch>` as a
   requested comparison base for the review run. For example,
   `/moes against <branch>` carries `<branch>` as that base.
5. If the user explicitly asks for `/forge:setup`, route to `setup.md`.
6. If the user explicitly asks for `/forge:build`, run the full workflow.
7. Identify whether the request needs a written spec, an implementation plan,
   or both before edits begin.
8. Map the task to one primary class from `classification.md`:
   `docs-only`, `backend-only`, `ui-or-flow`, or `mixed-feature`.
9. Confirm whether the `high-risk` overlay applies in addition to the primary
   class.
10. Confirm the repo is on an isolated feature branch or an explicitly approved
   working branch.
11. Confirm whether Playwright already exists in the target application repo
   before planning QA authoring.

## Output

Capture:

- current branch
- project knowledge inventory: relevant files found, missing-but-relevant
  files, and any obvious stale or conflicting docs
- whether setup is required or explicitly requested
- whether `/moes` was explicitly requested, and any base-branch
  override supplied by the user
- chosen primary class and any overlays
- whether spec and plan artifacts are required
- obvious blockers before planning
