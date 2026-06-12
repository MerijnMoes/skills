# Forge Playwright QA

Playwright is the primary executable QA lane in `forge`. It is local-first:
durable tests and evidence live in the target app repo, and Forge must not
depend on paid QA providers, hosted AI testing services, provider-owned model
subscriptions, or vendor dashboards.

Load these references when Playwright is `required` or chosen:

- `qa-intent-draft.md` before substantial test authoring
- `qa-capability-matrix.md` for local/free capability coverage

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

## Execution evidence

Capture when available:

- accepted or agent-selected QA intent draft
- changed or generated test paths
- commands run and observed results
- capability matrix states and reasons
- screenshots
- traces
- videos
- failing steps or selectors
- environment limits that blocked full execution
