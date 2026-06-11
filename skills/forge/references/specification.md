# Forge specification

Specification defines the behavior `forge` is about to build.

For collaborative discovery or design-doc work, load
`methodology/skills/brainstorming/SKILL.md` through `source-integration.md`.

## Goals

- turn the discovered intent into explicit requirements
- name acceptance criteria before implementation starts
- separate product decisions from implementation details
- create a reviewable artifact when the change is non-trivial

## Process

1. State the problem and desired outcome.
2. List in-scope and out-of-scope behavior.
3. Define the primary user or system flows.
4. Capture data, permission, error, and edge-case rules.
5. For UI work, capture the screens, states, and visual priorities that later
   shaping and QA must cover.
6. Identify verification expectations: unit tests, integration tests,
   Playwright coverage, manual probes, or docs checks.
7. Reconcile the spec with `PRODUCT.md`, `DESIGN.md`, `CONTEXT.md`,
   `CONTEXT-MAP.md`, and ADRs when those files exist.
8. Update project knowledge, or mark an explicit unresolved doc gap, when the
   spec resolves reusable product, design, domain, or decision truth.
9. Pause for user approval when the spec changes scope, product behavior, or
   durable project knowledge.

## Acceptance criteria rules

- Criteria must describe observable behavior, not internal implementation.
- Include negative paths, loading states, empty states, and permission failures
  when they are part of the user promise.
- If the request is a bug fix, include the reproduction and the expected
  regression check.
- If the request affects a browser flow, identify which durable Playwright
  tests should be created or updated by default.
- Criteria may reference standing project knowledge files when they define a
  product promise, design rule, domain term, or architecture constraint.
- Do not hide unresolved product choices inside implementation notes; mark them
  as questions or pause points.

## Artifact guidance

For substantial work, write the spec under the repo's existing spec convention.
If none exists, use a clear path such as `docs/forge/specs/<date>-<topic>.md`.
Small changes can keep a compact inline spec in `.forge/` state.

## Output

Record:

- spec path or inline spec summary
- acceptance criteria
- out-of-scope items
- approval status
- verification expectations
- project knowledge files referenced or updated
- unresolved choices

## Quality bar

The spec is ready when implementation can begin without guessing what "done"
means.
