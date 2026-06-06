# Testing specialty router

Load this when generic `testing.md` is not enough for the changed risk surface
and `/finalize` needs a stack-specific testing handoff rather than more generic
test-quality advice.

## Suggested handoffs

- **Playwright / Cypress / existing browser-E2E guidance** — when the changed
  risk is an end-to-end user journey and the project already has browser
  tooling. Hand off to the repo's existing browser/E2E guidance or house
  conventions; `/finalize` only needs to decide that this deeper route is
  warranted and keep the verification scope focused.
- **JS/TS test references** — when frontend/runtime-heavy diffs need
  framework-specific advice on async rendering, DOM/runtime harnesses, or
  module-boundary mocking beyond what `testing.md` covers.
- **Python test references** — when pytest/fixture/async/time-control-heavy
  diffs need more specific guidance than the generic test-quality reference.
