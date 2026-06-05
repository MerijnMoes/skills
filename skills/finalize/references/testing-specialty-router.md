# Testing specialty router

Load this when generic `testing.md` is not enough for the changed risk surface.

## Suggested routes

- **Playwright / Cypress** — for user-journey risk. When the project already
  has browser/E2E tooling, keep flows focused on high-value journeys and one
  meaningful negative/regression path; prefer stable roles/selectors and
  explicit waits; avoid giant snapshots or `waitForTimeout`-style scripts. Do
  not add a new browser framework just to satisfy `/finalize`.
- **JS/TS test references** — for frontend/runtime-heavy diffs.
- **Python test references** — for pytest/fixture/async/time-control-heavy
  diffs.
