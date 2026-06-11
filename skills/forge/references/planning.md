# Forge planning

Planning turns the approved spec into executable work.

## Goals

- choose the smallest implementation path that satisfies the spec
- preserve existing architecture and local conventions
- make testing and verification concrete before edits start
- split work into reviewable steps

## Process

1. Map the files and modules likely to change.
2. Identify boundaries, dependencies, migrations, routes, components, and tests.
3. Choose the implementation order that gives fast feedback.
4. Prefer test-first steps for behavior changes.
5. Include Playwright authoring when classification requires browser-flow QA.
6. Include documentation updates when user-facing behavior or setup changes.
7. Add pause points for ambiguous product, UX, data, or rollout decisions.

## Work package rules

- Split plans by independently reviewable behavior, not by file type.
- Put risky or unknown work early enough to fail fast.
- Keep migrations, API behavior, UI wiring, and QA tasks explicit when they
  cross system boundaries.
- Name the exact check that proves each task worked.
- Mark tasks that can be delegated to another agent without shared mutable
  context.
- Add a review checkpoint after broad, risky, or delegated tasks.

## Plan shape

Each task should name:

- files to create, modify, or inspect
- the behavior being changed
- the test or verification command
- the expected result
- the commit checkpoint when appropriate

## Output

Record:

- plan path or inline plan summary
- task list
- test strategy
- Playwright scope
- expected pause points
- review checkpoints
- delegation candidates, if any

## Quality bar

The plan is ready when a fresh agent could execute it without reconstructing
the product intent from chat history.
