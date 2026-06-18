# Forge Playwright QA

Playwright is the primary durable browser and API automation sub-lane inside
Forge QA. Durable tests and evidence live in the target app repo, and Forge
must not depend on paid QA providers, hosted AI testing services,
provider-owned model subscriptions, or vendor dashboards.

Load these references when Playwright is `required` or chosen:

- `qa-intent-draft.md` before substantial test authoring
- `qa-capability-matrix.md` for local/free capability coverage

## Availability check

Before authoring or running E2E tests, check for:

- `@playwright/test` in project dependencies
- `playwright.config.*`
- existing E2E folders such as `tests/e2e/`
- scripts such as `test:e2e`
- installed browsers where practical
- CI jobs that already run E2E tests

If Playwright is missing and E2E coverage is required or useful, ask before
installing or configuring it. Do not silently add project dependencies.

## Routing contract

- `required`: produce or update a QA intent draft, author or update durable
  Playwright coverage, run verification, update the capability matrix, and run
  exploratory QA when the route expects it.
- `optional`: use Playwright when the implementation touches important user
  journeys or when browser/API evidence materially reduces risk. If chosen,
  follow the same artifact discipline as `required`.
- `skipped`: do not invent Playwright work for docs-only or other runs that the
  classifier explicitly routes around QA authoring. Mark relevant capabilities
  `N/A`, `not configured`, or `deferred` instead of pretending they ran.

## QA intent first

Before writing or updating substantial Playwright tests, draft human-readable
scenarios with:

- plain-English scenario name
- Given / When / Then
- risk caught
- automation layer
- fixture, auth, data, environment, or exclusion notes

Pause for user feedback when the route is `required`, the scenario list is
broad, or product/data behavior is ambiguous. For tiny obvious changes, proceed
with the agent-selected draft and record it in QA evidence.

## Durable artifact expectations

- Prefer an existing repo convention such as `tests/e2e/`.
- If no convention exists, scaffold a clear Playwright home before authoring.
- Keep authored tests in the target app repo, not in this skill repo.
- Use semantic selectors first: role, label, text, placeholder, and stable test
  ids before CSS or XPath.
- Use Playwright auto-waiting and web-first assertions.
- Avoid `waitForTimeout` except as a documented last resort.
- Keep tests isolated and order-independent.
- Keep tests readable enough to act as journey documentation.
- Use Page Objects or helper fixtures only when they clarify repeated flows,
  expensive setup, or stable selector/action reuse.

## Coverage expectations

When Playwright is required or chosen, default to:

- smoke coverage for the changed route or flow
- critical-flow regression for the changed area
- at least one meaningful negative, recovery, permission, empty, invalid, or
  stale-state path when relevant
- API contract tests through Playwright request testing when the change crosses
  REST, GraphQL, auth, validation, CRUD, permission, pagination, or error
  contract boundaries
- exploratory probing when the change is UI-heavy, risky, or difficult to
  reason about statically

Use the cheapest test layer that catches the risk. Do not force E2E coverage
for behavior better pinned by unit, integration, or API tests.

## Optional local/free probes

- Accessibility: semantic assertions, keyboard checks, and `@axe-core/playwright`
  only if present or user-approved for local setup.
- Visual smoke: screenshots for evidence; snapshot assertions only for stable
  surfaces where the repo already accepts baseline maintenance.
- Performance: Lighthouse for changed web load/render/access signals; k6 for
  load-sensitive API/backend flows only when thresholds and environment are
  explicit.
- Coverage: use existing coverage tooling as a gap signal, never as a reason to
  write vacuous tests.

## Watched local verify

When Forge runs locally and the user can benefit from seeing the flow, default
to headed mode for changed durable tests:

```bash
npx playwright test <changed-tests> --headed
```

Use UI mode for step debugging or authoring visibility:

```bash
npx playwright test <changed-tests> --ui
```

The watched run must use the same durable tests that will run in CI. It is not
a separate QA system.

## CI-equivalent verify

After watched verification passes or is skipped for a documented reason, run
the same relevant tests in normal headless mode:

```bash
npx playwright test <changed-tests>
```

If headed passes but headless fails, treat QA as failing until the
implementation, test, or environment blocker is resolved.

## Execution evidence

Capture when available:

- accepted or agent-selected QA intent draft
- changed or generated test paths
- watched local E2E command and observed result
- CI-equivalent E2E command and observed result
- whether both runs used the same durable tests
- other relevant commands run and observed results
- capability matrix states and reasons
- screenshots
- traces
- videos
- failing steps or selectors
- environment limits that blocked full execution
