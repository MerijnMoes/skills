# Forge Playwright QA

Playwright is a first-class lane in `forge`, but it is still routed by
classification rather than forced on every run.

## Routing contract

- `required`: author or update durable Playwright coverage, then run verify and
  any exploratory QA the route expects
- `optional`: use Playwright when the implementation touches important user
  journeys or when browser evidence materially reduces risk
- `skipped`: do not invent Playwright work for docs-only or other runs that the
  classifier explicitly routes around QA authoring

When Playwright is required or chosen, the default expectation is:

- create or update durable Playwright tests for affected user-facing or flow
  changes
- run smoke coverage
- run critical-flow regression
- run exploratory probing when the change is UI-heavy, risky, or difficult to
  reason about statically

## Durable artifact expectations

- prefer an existing repo convention such as `tests/e2e/`
- if no convention exists, scaffold a clear Playwright home before authoring
- keep authored tests in the target app repo, not in this skill repo

## Execution evidence

Capture when available when Playwright runs:

- changed or generated test paths
- screenshots
- traces
- videos
- failing steps or selectors
- environment limits that blocked full execution
