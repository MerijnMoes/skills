# Forge classification

Use this file to decide which lanes the request needs.

## Primary classes

- `docs-only`
- `backend-only`
- `ui-or-flow`
- `mixed-feature`

Choose one primary class for every request.

## Risk overlays

- `high-risk`

Apply overlays in addition to the primary class when needed.

## Routing rules

- `docs-only`: skip shaping and skip Playwright unless the docs describe
  runnable flows that must stay in sync.
- `backend-only`: skip shaping; keep Playwright optional unless the backend
  change directly affects important user journeys.
- `ui-or-flow`: run shaping, Playwright authoring, Playwright verify, and
  conditional exploratory QA.
- `mixed-feature`: treat as both implementation and flow work; activate
  Playwright by default.
- `high-risk`: this is not a primary class. Add it on top of the chosen
  primary class, strengthen verification expectations, and route cleanly into review (`moes`).

## Output

Record:

- chosen primary class
- why it was chosen
- any risk overlays
- whether shaping is active
- whether Playwright is required
- whether the run should expect additional pause points
