# Forge classification

Use this file to decide which lanes the request needs.

## Primary classes

- `docs-only`
- `backend-only`
- `ui-or-flow`
- `mixed-feature`
- `high-risk`

## Routing rules

- `docs-only`: skip shaping and skip Playwright unless the docs describe
  runnable flows that must stay in sync.
- `backend-only`: skip shaping; keep Playwright optional unless the backend
  change directly affects important user journeys.
- `ui-or-flow`: run shaping, Playwright authoring, Playwright verify, and
  conditional exploratory QA.
- `mixed-feature`: treat as both implementation and flow work; activate
  Playwright by default.
- `high-risk`: strengthen verification expectations and route cleanly into
  `temper`.

## Output

Record:

- chosen class
- why it was chosen
- whether shaping is active
- whether Playwright is required
- whether the run should expect additional pause points
