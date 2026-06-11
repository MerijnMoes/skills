# Forge Local QA Design

## Goal

Expand Forge's QA lane into a complete local-first quality workflow without
depending on paid QA providers or hosted AI testing services.

Forge should continue to use the user's own agent subscription for reasoning,
but the durable artifacts and executable checks should live in the target repo
and rely on free, local, or open-source tooling wherever possible. Playwright
remains the primary browser and API automation tool.

## Scope

This design covers:

- the shape of the Forge QA lane between implementation and `temper`
- the human-readable QA intent draft before durable test authoring
- the local/free QA capability matrix
- which external QA-skill ideas should influence Forge QA versus `temper`
- the boundary between generated tests, exploratory probes, and final readiness
  judgment

It does not:

- add paid providers such as hosted AI QA platforms
- require Vibium, Momentic, QA.tech, or any vendor-specific service
- replace Playwright as Forge's default executable QA layer
- require every optional probe on every run
- redesign `temper` outside the QA evidence it should consume

## Desired Outcome

After implementation:

- Forge proposes a human-readable QA intent draft before large or meaningful
  Playwright authoring.
- Forge creates or updates durable Playwright tests by default for affected
  browser flows.
- API contract checks can use Playwright's request testing when the changed
  surface warrants it.
- Accessibility, visual, performance, coverage, and CI artifact checks are
  available as local/free conditional capabilities.
- Every QA run records a compact capability matrix so skipped checks are
  explicit and justified.
- `temper` consumes QA evidence and evaluates test quality, coverage fit,
  artifact sufficiency, and residual risk before the final verdict.

## Design

### 1. Local-First Constraint

Forge's QA lane should be complete without paid providers.

Allowed dependencies:

- repo-local Playwright and `@playwright/test`
- Playwright's built-in browser, trace, video, screenshot, and API request
  capabilities
- optional local/free tools already present in the target repo
- optional open-source additions when the user approves setup, such as
  `@axe-core/playwright`, Lighthouse, k6, MSW, Istanbul/nyc, or framework-native
  test runners

Disallowed defaults:

- hosted AI QA providers
- provider-owned model subscriptions
- vendor dashboards required for pass/fail evidence
- generated tests that cannot run from the target repo

Forge may learn from external QA skill practices, but the workflow should not
require users to install those skills or subscribe to their providers.

### 2. QA Intent Draft

Before writing or updating substantial Playwright coverage, Forge should produce
a human-readable QA intent draft.

Purpose:

- surface agent assumptions before they become brittle tests
- give the user a steering point without forcing a full manual test plan
- connect changed requirements to concrete testable journeys
- identify which risks deserve E2E, API, accessibility, visual, or performance
  coverage

Draft format:

```md
## QA Intent Draft

1. [Plain-English scenario]
   Given: [starting state]
   When: [user or system action]
   Then: [observable outcome]
   Risk: [failure mode this catches]
   Automate: [Playwright E2E / Playwright API / unit / integration / manual note]
   Notes: [fixtures, auth, data, environment, or exclusions]
```

Pause behavior:

- Pause for feedback when the QA route is `required`, the change is user-facing,
  the generated scenario list is broad, or there is product ambiguity.
- Continue without a pause for tiny, low-risk, obvious updates, but still record
  the draft in the run evidence when Playwright tests are authored.
- Treat the draft as provisional. The final durable tests should follow repo
  conventions and observed app behavior, not blindly preserve draft wording.

### 3. Playwright-First Durable QA

Playwright remains the primary Forge QA artifact.

Default expectations:

- create or update durable tests in the target app repo
- follow existing test layout when present
- scaffold a clear Playwright home only when no convention exists
- use semantic selectors first: role, label, text, placeholder, and stable test
  ids before CSS or XPath
- use Playwright's auto-waiting and web-first assertions
- avoid `waitForTimeout` except as a documented last resort
- keep tests isolated and order-independent
- keep tests readable enough to act as journey documentation
- capture traces, screenshots, videos, and failing selectors when available

Page Objects:

- Use Page Objects or helper fixtures when flows repeat, setup is expensive, or
  selectors/actions need a stable abstraction.
- Do not force Page Objects for small one-off specs where direct Playwright code
  is clearer.

Exploration:

- Use a navigate, inspect, interact, re-inspect rhythm for exploratory browser
  probing.
- Prefer Playwright, the host browser tool, or project-native browser tooling
  over adding a separate browser-automation dependency.
- Convert durable findings into Playwright tests only when the behavior is
  stable, valuable, and not better covered at a cheaper layer.

### 4. Capability Matrix

Every meaningful QA lane should produce a compact capability matrix.

```md
## QA Capability Matrix

| Capability | State | Evidence | Reason |
|---|---|---|---|
| Browser E2E | run / N/A / not configured / deferred | paths, command, artifacts | why |
| API contract | run / N/A / not configured / deferred | paths, command, artifacts | why |
| Accessibility | run / N/A / not configured / deferred | axe/manual/browser evidence | why |
| Visual smoke | run / N/A / not configured / deferred | screenshots/snapshots | why |
| Performance smoke | run / N/A / not configured / deferred | Lighthouse/k6/build metrics | why |
| Coverage signal | run / N/A / not configured / deferred | coverage summary | why |
| CI artifacts | run / N/A / not configured / deferred | reports/traces/logs | why |
```

State meanings:

- `run`: executed and evidence captured
- `N/A`: not relevant to this diff
- `not configured`: relevant, but the repo has no local setup yet
- `deferred`: relevant, but blocked by environment, credentials, data, time, or
  explicit user decision

`not configured` and `deferred` should never be hidden. They are residual risk
inputs for `temper`.

### 5. Conditional Local Capabilities

Forge should keep the QA lane broad without making every tool mandatory.

Browser E2E:

- Default to Playwright.
- Cover smoke paths, changed critical flows, negative/recovery paths, auth/state
  transitions, navigation, async loading, and persistence-visible outcomes.

API contract:

- Use Playwright API request tests for REST, GraphQL, auth, validation, CRUD,
  permissions, pagination, and error contracts when changed behavior crosses an
  HTTP/API boundary.
- Validate response body, headers, error shape, and side effects, not just
  status codes.

Accessibility:

- Prefer semantic Playwright assertions and keyboard-reachable flow checks.
- If the repo has `@axe-core/playwright`, run targeted axe checks on changed
  pages or states.
- If no automated a11y setup exists, do a manual browser/accessibility-tree
  probe where practical and mark automation as `not configured`.

Visual smoke:

- Use screenshots to support investigation and reporting.
- Use snapshot assertions only for stable, high-value surfaces where the repo
  already accepts visual baseline maintenance.
- Avoid giant screenshots that fail on every harmless copy, data, or layout
  adjustment.

Performance smoke:

- Use Lighthouse for web UI performance/accessibility/SEO signals when the diff
  touches load behavior, rendering, assets, route structure, or public landing
  pages.
- Use k6 only for load-sensitive API or backend flows where the user approves
  realistic targets and environment.
- Performance tests must have explicit thresholds or they are observations, not
  gates.

Coverage signal:

- Use existing coverage tooling to identify suspicious gaps in changed behavior.
- Never write vacuous tests solely to improve a number.
- Coverage can inform risk; it does not prove correctness.

CI artifacts:

- Prefer cheap-to-expensive ordering: lint/typecheck, unit, integration, build,
  API, E2E, performance.
- Preserve traces, screenshots, videos, coverage, and logs when available.
- Local Forge QA should report whether the same checks are CI-ready or only
  local.

### 6. `temper` Consumption

`temper` should not regenerate the QA plan from scratch. It should judge the QA
evidence already produced.

`temper` should check:

- whether the QA intent draft covered the meaningful user and system risks
- whether durable tests were added at the right layer
- whether Playwright tests are deterministic, isolated, semantic, and readable
- whether negative paths and recovery states were considered
- whether API tests assert body and side effects, not only status codes
- whether accessibility, visual, performance, coverage, and CI capabilities were
  correctly marked `run`, `N/A`, `not configured`, or `deferred`
- whether skipped or blocked checks leave residual risk that affects the final
  verdict
- whether artifacts are sufficient for another reviewer to understand failures
  or confidence claims

`temper` may request new or improved tests only when the missing coverage is a
verified blocker or a clear residual risk in the current diff. It should not
turn optional capabilities into mandatory work for unrelated changes.

### 7. External Skill Synthesis

Forge should adapt practices from the reviewed QA skills as principles, not as
dependencies.

Useful for Forge QA:

- Playwright E2E: user-centric flows, semantic selectors, auto-waiting,
  isolation, readable tests, fixtures, auth state, traces, screenshots, videos.
- Playwright API: request-context testing, typed contracts where useful,
  lifecycle-managed data, response body validation, auth/error contracts.
- Browser automation skills: navigate, map/snapshot, interact, re-map, inspect
  changes; useful as an exploratory rhythm, not a required CLI dependency.
- Cypress: network-control mindset, clean auth state, request assertions, and
  test isolation; do not adopt Cypress as the Forge default.
- Storybook: component interaction checks only when the target repo already
  uses Storybook.

Useful for `temper`:

- CI/CD pipeline guidance: fast feedback, fail fast, reproducible builds,
  parallelism where safe, and artifact preservation.
- Jest, Vitest, Pytest, React Testing Library, and Vue Testing Utils: test
  quality principles such as behavior over implementation, AAA shape,
  descriptive names, fixtures, parametrization, async discipline, and
  independence.
- Lighthouse: conditional performance/accessibility/SEO evidence for web UI.
- k6: conditional load and resilience evidence for performance-sensitive APIs.
- Code coverage: risk signal only.
- REST Assured: API contract principle of validating body and workflow behavior,
  not just HTTP status.

Mostly not adopted:

- Selenium and Puppeteer should not become first-class Forge paths while
  Playwright is the default. Borrow only general wait, isolation, and data
  discipline where applicable.
- Thin placeholder skills with little actionable content should not expand
  Forge scope.

## Files Expected To Change

Likely implementation files:

- `skills/forge/references/playwright-qa.md`
- `skills/forge/references/planning.md`
- `skills/forge/references/workflow-routing.md`
- `skills/forge/references/reporting.md`
- `skills/forge/references/temper/SKILL.md`
- `skills/forge/references/temper/references/testing.md`
- `skills/forge/references/temper/references/verify.md`
- `skills/forge/references/temper/references/performance-specialty-router.md`
- `skills/forge/references/setup.md`
- `skills/forge/references/project-knowledge.md`
- `skills/forge/references/source-integration.md`

Optional implementation files:

- a new `skills/forge/references/qa-capability-matrix.md`
- a new `skills/forge/references/qa-intent-draft.md`
- a new `skills/forge/references/temper/references/qa-evidence-review.md`

## Implementation Notes

- Keep the top-level `skills/forge/SKILL.md` concise. Put detailed QA mechanics
  in references.
- Do not add required runtime dependencies to this skill repo for target-app QA.
  Forge should instruct the agent to use or install dependencies in the target
  app repo only when the user approves.
- Preserve repo conventions in target apps before scaffolding new test folders.
- Mark local/free optional tooling as capabilities, not universal requirements.
- Ensure reports separate durable automated tests from exploratory observations.

## Open Decisions

None blocking. The implementation may choose whether to add separate
`qa-intent-draft.md` and `qa-capability-matrix.md` files or fold those sections
into `playwright-qa.md`, as long as the resulting guidance remains easy to
discover from the Forge workflow.

## References

- QASkills leaderboard: https://qaskills.sh/leaderboard
- Playwright E2E skill: https://qaskills.sh/skills/thetestingacademy/playwright-e2e
- Playwright API skill: https://qaskills.sh/skills/thetestingacademy/playwright-api
- CI/CD Pipeline Config skill: https://qaskills.sh/skills/thetestingacademy/cicd-pipeline
- Lighthouse Performance skill: https://qaskills.sh/skills/thetestingacademy/lighthouse-performance
- k6 Performance Testing skill: https://qaskills.sh/skills/thetestingacademy/k6-performance
