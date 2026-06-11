# Forge Playwright QA

Playwright is a first-class lane in `forge`, not an optional afterthought.

## Default contract

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

Capture when available:

- changed or generated test paths
- screenshots
- traces
- videos
- failing steps or selectors
- environment limits that blocked full execution
