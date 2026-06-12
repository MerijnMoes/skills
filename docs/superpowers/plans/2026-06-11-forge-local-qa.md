# Forge Local QA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Forge's local/free Playwright-first QA lane with a human-readable QA intent draft, capability matrix, and `temper` evidence review.

**Architecture:** Add two focused Forge QA reference files, keep `playwright-qa.md` as the lane router, and wire downstream planning, routing, setup, reporting, and `temper` references to consume those artifacts. Keep all QA tooling local/free and capability-based rather than introducing paid provider dependencies.

**Tech Stack:** Markdown skill/reference files, Forge skill conventions, Playwright guidance, optional local/free tools (`@axe-core/playwright`, Lighthouse, k6, MSW, coverage tools) as documented capabilities only.

---

## File Structure

- Create `skills/forge/references/qa-intent-draft.md`: canonical format and pause rules for human-readable QA scenarios before substantial Playwright authoring.
- Create `skills/forge/references/qa-capability-matrix.md`: canonical local/free QA capability matrix, state definitions, and capability-specific guidance.
- Create `skills/forge/references/temper/references/qa-evidence-review.md`: `temper` Phase 4/6/7 review guidance for consuming QA intent, Playwright artifacts, and capability matrix evidence.
- Modify `skills/forge/references/playwright-qa.md`: keep it as the Playwright lane router, but load the new references and adopt Playwright-first local/free defaults.
- Modify `skills/forge/references/planning.md`: require QA intent planning when Playwright is required or meaningful.
- Modify `skills/forge/references/workflow-routing.md`: insert QA Intent Draft before Playwright Author and clarify loopbacks.
- Modify `skills/forge/references/reporting.md`: require QA intent, capability matrix, and local/free provider stance in final reports.
- Modify `skills/forge/references/setup.md`: add verification/setup guidance for local/free QA capabilities without requiring all tools.
- Modify `skills/forge/references/project-knowledge.md`: document local/free QA and QA capability matrix as reusable verification truth.
- Modify `skills/forge/references/source-integration.md`: record the QASkills synthesis as principles, not dependencies.
- Modify `skills/forge/references/temper/SKILL.md`: route QA evidence review in audit/verification/validation phases.
- Modify `skills/forge/references/temper/references/testing.md`: strengthen E2E/API test-quality guidance using the QA intent and capability matrix.
- Modify `skills/forge/references/temper/references/testing-playwright.md`: add locator/wait/artifact/Page Object nuance from the approved spec.
- Modify `skills/forge/references/temper/references/browser-qa.md`: align browser QA output with the capability matrix.
- Modify `skills/forge/references/temper/references/verify.md`: mention capability matrix consumption in Phase 6 verification.
- Modify `skills/forge/references/temper/references/performance-specialty-router.md`: clarify Lighthouse/k6 as local/free conditional capabilities.
- Modify `docs/superpowers/specs/2026-06-11-forge-local-qa-design.md`: no content changes expected; use only as implementation source of truth.

## Verification Strategy

- Run `git diff --check` after Markdown edits.
- Run `rg -n "Momentic|QA\\.tech|paid provider|hosted AI QA|vendor dashboard" skills/forge docs/superpowers/specs/2026-06-11-forge-local-qa-design.md` and confirm any hits are explicit prohibitions, not requirements.
- Run `rg -n "qa-intent-draft|qa-capability-matrix|qa-evidence-review|QA Intent Draft|QA Capability Matrix" skills/forge/references` and confirm every new reference is discoverable from the workflow.
- Run `rg -n "waitForTimeout|Page Object|Lighthouse|k6|@axe-core/playwright|Playwright API" skills/forge/references` and confirm the guidance is conditional and local/free.
- Run `git status --short` before committing.

---

### Task 1: Add Canonical QA Artifacts

**Files:**
- Create: `skills/forge/references/qa-intent-draft.md`
- Create: `skills/forge/references/qa-capability-matrix.md`

- [ ] **Step 1: Create `qa-intent-draft.md`**

Add this file:

````md
# QA intent draft

The QA intent draft is the human-readable bridge between the approved spec and
durable Playwright/API tests. Use it before substantial QA authoring so the
user can steer assumptions before they become brittle automated tests.

## When to draft

Create a QA intent draft when:

- Playwright is `required` by classification.
- Playwright is `optional` but the change touches an important user journey.
- The affected flow is user-facing, multi-step, auth/stateful, payment-like,
  destructive, data-persistent, or hard to reason about statically.
- The likely E2E coverage is broad enough that user steering could prevent
  wasted or misleading tests.

Skip the pause for tiny, low-risk, obvious changes, but still record the draft
in QA evidence when durable tests are authored.

## Format

```md
## QA Intent Draft

1. [Plain-English scenario]
   Given: [starting state]
   When: [user or system action]
   Then: [observable outcome]
   Risk: [failure mode this catches]
   Automate: [Playwright E2E / Playwright API / unit / integration / manual note]
   Notes: [fixtures, auth, data, environment, or exclusions]
````

## Drafting rules

- Tie every scenario to a changed requirement, changed risk, or likely
  regression path.
- Prefer user-visible outcomes and persisted side effects over implementation
  details.
- Include at least one meaningful negative, recovery, permission, empty, or
  invalid-state path when the changed surface can fail that way.
- Mark scenarios that are better covered by unit, integration, or API tests
  rather than forcing everything into E2E.
- Keep the list short enough to review. Merge duplicate journeys and name what
  is intentionally not covered.

## Pause contract

Pause for user feedback when:

- the route is `required` and the scenario list is more than a trivial smoke;
- product behavior, copy, data setup, or acceptance criteria are ambiguous;
- test data, auth, environment, or destructive actions need user confirmation;
- the agent is about to scaffold significant Playwright coverage from inferred
  behavior.

If the user does not want to pause, continue with the best current draft and
record that it was agent-selected.

## Output

Carry forward:

- accepted, revised, or agent-selected scenario list;
- scenarios automated now;
- scenarios intentionally left manual or deferred;
- assumptions about fixtures, auth, seed data, environment, and destructive
  actions.
```

- [ ] **Step 2: Create `qa-capability-matrix.md`**

Add this file:

````md
# QA capability matrix

The QA capability matrix records which local/free QA capabilities were relevant,
which were run, and which remain residual risk. It prevents skipped checks from
disappearing into optimistic prose.

Forge must not require paid QA providers, hosted AI testing services, provider
model subscriptions, or vendor dashboards for pass/fail evidence.

## Matrix

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
````

## State meanings

- `run`: executed and evidence captured.
- `N/A`: not relevant to this diff.
- `not configured`: relevant, but the repo has no local setup yet.
- `deferred`: relevant, but blocked by environment, credentials, data, time, or
  explicit user decision.

`not configured` and `deferred` are not failures by themselves, but they are
residual-risk inputs for `temper`.

## Capability guidance

- **Browser E2E**: default to Playwright for smoke paths, changed critical
  flows, negative/recovery paths, auth/state transitions, navigation, async
  loading, and persistence-visible outcomes.
- **API contract**: use Playwright API request tests when changed behavior
  crosses REST, GraphQL, auth, validation, CRUD, permission, pagination, or
  error-contract boundaries. Assert body, headers, error shape, and side
  effects, not only status codes.
- **Accessibility**: prefer semantic Playwright assertions and keyboard checks.
  Use `@axe-core/playwright` only if present or explicitly approved for local
  setup.
- **Visual smoke**: use screenshots for investigation and reporting. Use
  snapshot assertions only for stable high-value surfaces where the repo already
  accepts baseline maintenance.
- **Performance smoke**: use Lighthouse for browser-facing load/render/access
  signals and k6 for load-sensitive API/backend flows only when risk and
  environment justify it. Performance checks need explicit thresholds.
- **Coverage signal**: use existing coverage tooling to find suspicious changed
  behavior gaps. Never add vacuous tests to improve a number.
- **CI artifacts**: prefer cheap-to-expensive order: lint/typecheck, unit,
  integration, build, API, E2E, performance. Preserve traces, screenshots,
  videos, coverage, and logs when available.

## Output rules

- Include the matrix in QA evidence for non-trivial Forge runs.
- Name exact commands, paths, screenshots, traces, videos, reports, or logs.
- Explain every `not configured` and `deferred` state.
- Do not imply a capability passed when it was not run.
```

- [ ] **Step 3: Verify Task 1 references are present**

Run:

```bash
rg -n "QA intent draft|QA capability matrix|hosted AI testing|Playwright API|@axe-core/playwright|Lighthouse|k6" skills/forge/references/qa-intent-draft.md skills/forge/references/qa-capability-matrix.md
```

Expected: matches in both new files, including the no-paid-provider constraint and local/free optional tooling.

- [ ] **Step 4: Commit Task 1**

```bash
git add skills/forge/references/qa-intent-draft.md skills/forge/references/qa-capability-matrix.md
git commit -m "docs: add forge qa evidence artifacts"
```

---

### Task 2: Wire QA Intent Into Forge Planning And Playwright QA

**Files:**
- Modify: `skills/forge/references/playwright-qa.md`
- Modify: `skills/forge/references/planning.md`
- Modify: `skills/forge/references/workflow-routing.md`

- [ ] **Step 1: Update `playwright-qa.md`**

Replace the file with:

```md
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
```

- [ ] **Step 2: Update `planning.md`**

In the `## Process` list, replace step 5 with these two steps and renumber the remaining items:

```md
5. Include a QA intent draft when classification requires Playwright or when
   browser/API evidence materially reduces risk.
6. Include Playwright authoring and capability-matrix evidence when
   classification requires browser-flow or API-contract QA.
7. Include documentation updates when user-facing behavior or setup changes.
8. Add pause points for ambiguous product, UX, data, QA, or rollout decisions.
```

In `## Output`, replace `Playwright scope` with:

```md
- QA intent draft scope
- Playwright/API scope
- QA capability matrix expectations
```

- [ ] **Step 3: Update `workflow-routing.md` default order**

Replace the default order line with:

```md
`Setup (if requested or blocking context is missing) -> Discover -> Spec -> Plan -> Shape (if needed) -> Implement -> Design Quality (if needed) -> QA Intent Draft (when Playwright is required or meaningful) -> Playwright Author (if classification requires it or QA draft selects it) -> Playwright Verify (when Playwright is required or authored) -> Playwright Explore (conditional) -> QA Capability Matrix -> Temper -> Report`
```

Add this paragraph after the `Use classification.md` paragraph:

```md
Use `playwright-qa.md`, `qa-intent-draft.md`, and
`qa-capability-matrix.md` for the local/free QA lane. The QA lane may learn
from external QA practices, but it must not require paid QA providers, hosted AI
testing services, provider-owned model subscriptions, or vendor dashboards.
```

Add these bullets to `## Loopbacks`:

```md
- If the QA intent draft exposes ambiguous product behavior, pause before
  authoring durable tests.
- If the capability matrix marks a relevant check `not configured` or
  `deferred`, carry that residual risk into `temper` rather than hiding it.
```

- [ ] **Step 4: Verify Task 2 wiring**

Run:

```bash
rg -n "QA Intent Draft|QA intent draft|qa-intent-draft|QA Capability Matrix|qa-capability-matrix|paid QA providers|Playwright API" skills/forge/references/playwright-qa.md skills/forge/references/planning.md skills/forge/references/workflow-routing.md
```

Expected: all three files mention the new QA artifacts; `playwright-qa.md` includes the local/free provider constraint.

- [ ] **Step 5: Commit Task 2**

```bash
git add skills/forge/references/playwright-qa.md skills/forge/references/planning.md skills/forge/references/workflow-routing.md
git commit -m "docs: wire local qa into forge flow"
```

---

### Task 3: Wire QA Evidence Into Reporting, Setup, And Project Knowledge

**Files:**
- Modify: `skills/forge/references/reporting.md`
- Modify: `skills/forge/references/setup.md`
- Modify: `skills/forge/references/project-knowledge.md`
- Modify: `skills/forge/references/source-integration.md`

- [ ] **Step 1: Update `reporting.md` required sections**

Replace the `## Required sections` list with:

```md
## Required sections

- request summary
- phase outcome summary
- changed deliverables
- QA intent draft summary: accepted, revised, or agent-selected
- Playwright/API coverage created or updated
- QA capability matrix: `run`, `N/A`, `not configured`, and `deferred` states
- QA evidence gathered: commands, screenshots, traces, videos, reports, or logs
- local/free QA note when relevant: no paid provider was required
- project knowledge files read, updated, or intentionally left unchanged
- contradictions, stale docs, or missing docs that affected confidence
- `temper` verdict or blockers
- note that the verdict comes from `temper`, the internal final phase inside
  `forge`
- next recommended step
```

- [ ] **Step 2: Update `setup.md` verification file description**

In `## What setup may create`, replace the `docs/agents/verification.md` bullet with:

```md
- `docs/agents/verification.md`: build, lint, typecheck, test, Playwright,
  API-contract, accessibility, visual, performance, coverage, CI artifact, and
  release-check commands agents should use. This should record local/free
  capabilities and explicitly avoid paid QA-provider requirements.
```

In `## Exploration checklist`, replace the verification evidence bullet with:

```md
- Verification evidence: package scripts, Makefile targets, CI jobs,
  Playwright config, test folders, API test setup, linters, typecheckers,
  build commands, accessibility tooling, visual snapshot tooling, Lighthouse,
  k6, coverage tooling, and artifact upload/reporting conventions.
```

In the `docs/agents/domain.md` template, after the current `Verification commands` bullet if present or near the end of the consumer rules, add:

```md
- Keep `docs/agents/verification.md` aligned with local/free QA capabilities:
  Playwright E2E, Playwright API, accessibility, visual smoke, performance,
  coverage, and CI artifacts.
```

- [ ] **Step 3: Update `project-knowledge.md` artifact contract**

In the `docs/agents/*.md` bullet, replace the second sentence with:

```md
Use them for issue tracker, domain-doc layout, verification-command
conventions, and local/free QA capability conventions. Do not store product
strategy, design rules, or task specs here.
```

In `## Update triggers`, replace the verification-command bullet with:

```md
- A verification command, issue workflow, agent setup convention, or local/free
  QA capability is clarified: update the relevant `docs/agents/*.md`.
```

In `## Reporting requirements`, add:

```md
- local/free QA capabilities used, missing, or intentionally deferred
```

- [ ] **Step 4: Update `source-integration.md`**

After the `## Design studio payload` section and before `## Naming boundary`, add:

```md
## QA source synthesis

Forge's QA lane adapts external QA-skill practices as principles, not runtime
dependencies. The default executable layer remains repo-local Playwright.

Useful practices for Forge QA:

- Playwright E2E: user-centric flows, semantic selectors, auto-waiting,
  isolation, readable tests, fixtures, auth state, traces, screenshots, and
  videos.
- Playwright API: request-context tests, lifecycle-managed data, response body
  validation, auth/error contracts, and API side-effect checks.
- Browser automation skills: navigate, inspect, interact, re-inspect, and
  capture artifacts as an exploratory rhythm.
- Cypress: network-control mindset, clean auth state, request assertions, and
  test isolation.
- Storybook: component interaction checks only when the target repo already
  uses Storybook.

Useful practices for `temper`:

- CI/CD pipeline guidance: fast feedback, fail fast, reproducible builds,
  parallelism where safe, and artifact preservation.
- Jest, Vitest, Pytest, React Testing Library, and Vue Testing Utils: behavior
  over implementation, AAA shape, descriptive names, fixtures, parametrization,
  async discipline, and independence.
- Lighthouse and k6: conditional local/free performance evidence when risk and
  environment justify it.
- Coverage tools: risk signal only, never a reason for vacuous tests.

Mostly not adopted:

- Selenium and Puppeteer do not become first-class Forge paths while Playwright
  is the default. Borrow general wait, isolation, and data discipline only.
- Thin placeholder skills with little actionable content should not expand
  Forge scope.
```

- [ ] **Step 5: Verify Task 3 reporting/setup wiring**

Run:

```bash
rg -n "QA intent|capability matrix|local/free|paid QA|Playwright API|Lighthouse|k6|coverage" skills/forge/references/reporting.md skills/forge/references/setup.md skills/forge/references/project-knowledge.md skills/forge/references/source-integration.md
```

Expected: all four files include local/free QA or capability-matrix guidance.

- [ ] **Step 6: Commit Task 3**

```bash
git add skills/forge/references/reporting.md skills/forge/references/setup.md skills/forge/references/project-knowledge.md skills/forge/references/source-integration.md
git commit -m "docs: document forge qa reporting and setup"
```

---

### Task 4: Add `temper` QA Evidence Review

**Files:**
- Create: `skills/forge/references/temper/references/qa-evidence-review.md`
- Modify: `skills/forge/references/temper/SKILL.md`
- Modify: `skills/forge/references/temper/references/testing.md`
- Modify: `skills/forge/references/temper/references/testing-playwright.md`
- Modify: `skills/forge/references/temper/references/browser-qa.md`
- Modify: `skills/forge/references/temper/references/verify.md`
- Modify: `skills/forge/references/temper/references/performance-specialty-router.md`

- [ ] **Step 1: Create `qa-evidence-review.md`**

Add this file:

```md
# QA evidence review

Phase 4, Phase 6, and Phase 7 support for `temper`. Use this when Forge
produced or should have produced QA intent, Playwright/API tests, exploratory
browser evidence, or a QA capability matrix.

`temper` consumes QA evidence; it does not regenerate the QA plan from scratch.

## Inputs

- QA intent draft: accepted, revised, or agent-selected scenarios.
- Durable test changes: Playwright E2E, Playwright API, unit, integration, or
  other repo-native tests.
- QA capability matrix with `run`, `N/A`, `not configured`, and `deferred`
  states.
- Commands, screenshots, traces, videos, coverage summaries, CI artifacts,
  Lighthouse reports, k6 output, or environment-blocker notes.

## Review questions

- Did the QA intent draft cover the meaningful user and system risks from the
  pinned intent and risk map?
- Were durable tests added at the cheapest layer that can catch the risk?
- Are Playwright tests deterministic, isolated, semantic, and readable?
- Do browser tests cover golden paths plus relevant negative, recovery,
  permission, empty, invalid, stale-state, or persistence-visible outcomes?
- Do API tests validate response body, headers, error shape, and side effects,
  not just status codes?
- Are accessibility, visual, performance, coverage, and CI artifact capabilities
  correctly marked `run`, `N/A`, `not configured`, or `deferred`?
- Do skipped or blocked checks leave residual risk that should affect the
  verdict?
- Are artifacts sufficient for another reviewer to understand failures or
  confidence claims?

## Findings

Create a finding only when the gap affects this diff's ship-readiness.

Examples that can block:

- changed critical flow has no durable test and no justified cheaper coverage;
- E2E test is flaky by construction, relies on sleeps, or depends on shared
  state;
- API contract change only asserts status code while response shape or side
  effect is the risk;
- accessibility/performance capability is marked `N/A` even though the diff
  clearly changed that surface;
- QA evidence claims a pass but no command, flow, artifact, or observation was
  recorded.

Examples that usually should not block:

- optional Lighthouse, k6, or visual snapshot setup is absent for a cold-path
  backend change;
- Page Objects are absent from a small one-off Playwright spec that is clearer
  inline;
- coverage percentage did not increase when the changed behavior is already
  meaningfully asserted.

## Output

Normalize any surviving issue into the shared `Finding Set`:

- finding title;
- evidence source;
- reachable trigger or missing-evidence trigger;
- affected capability;
- recommended action: `Fix`, `Investigate`, `Plan`, or `Decide`;
- residual risk if not fixed now.
```

- [ ] **Step 2: Wire `temper/SKILL.md` Phase 4**

In Phase 4 escalation hooks, add `qa-evidence-review.md` to the list of specialty lanes:

```md
Use `qa-evidence-review.md` when Forge produced or should have produced QA
intent, Playwright/API tests, exploratory browser evidence, or a QA capability
matrix.
```

In the Phase 4 lane list near code/security/browser-related lanes, add:

```md
- **QA evidence review:** when the Forge run includes QA intent, Playwright/API
  artifacts, exploratory browser notes, or a capability matrix, follow
  `references/qa-evidence-review.md`. Verify that QA evidence covers the
  diff's meaningful risks, that missing capabilities are honestly marked, and
  that test gaps are normalized into the shared `Finding Set` only when they
  affect this diff's ship-readiness.
```

- [ ] **Step 3: Wire `temper/SKILL.md` Phase 6/7**

In Phase 6 guidance, add:

```md
When Forge QA ran before `temper`, include the QA capability matrix and
Playwright/API artifacts in the verification ledger. Do not collapse
`not configured` or `deferred` capabilities into success.
```

In Phase 7 guidance, add:

```md
Treat unresolved QA evidence gaps from `qa-evidence-review.md` as residual risk
inputs. They block only when they survive the findings lifecycle and materially
affect this diff's ship-readiness.
```

- [ ] **Step 4: Update `testing.md`**

After the `## Pick the right test for the risk` section's E2E bullet list, add:

```md
For Forge QA, compare changed tests against the QA intent draft when one exists.
The draft is not a contract to automate every idea, but any omitted high-value
scenario should be covered at a cheaper layer or recorded as residual risk.
```

In the quick checklist, add:

```md
- [ ] If a QA intent draft exists, changed tests cover or consciously defer the
      high-value scenarios.
- [ ] API tests validate body/shape/side effects when those are the changed
      contract, not only status codes.
```

- [ ] **Step 5: Update `testing-playwright.md`**

Replace the `## What to review` list with:

```md
## What to review

- User-centric coverage: the test mirrors the meaningful journey from the QA
  intent draft or pinned intent rather than implementation structure.
- Locator discipline: prefer role, label, text, placeholder, and stable test-id
  locators over brittle CSS/XPath chains.
- Waiting discipline: use Playwright auto-waiting, web-first assertions, and
  explicit observable conditions instead of sleeps.
- Isolation: tests can run alone, in parallel where the project supports it,
  and without relying on state from previous tests.
- Assertions: verify observable outcomes, URL/state/persistence/API effects,
  and useful negative/recovery behavior.
- Page Objects/helpers: use them when they clarify repeated flows or expensive
  setup; do not force them when direct tests are clearer.
- Artifact capture: traces, screenshots, video, and failure output are
  configured or captured well enough to debug CI/environment failures.
- Flake diagnosis: use `repeat-each`, retries, traces, or focused reruns to
  investigate nondeterminism, not to hide it.
```

- [ ] **Step 6: Update `browser-qa.md` output**

In `## Output`, add:

```md
- QA capability matrix state for browser E2E, accessibility, visual smoke, and
  performance smoke when those capabilities are relevant;
```

- [ ] **Step 7: Update `verify.md`**

After the paragraph about `verification-ledger.md`, add:

```md
When Forge QA produced a QA capability matrix, carry its states into the
verification ledger. `run` capabilities should point to commands or observed
flows; `not configured` and `deferred` capabilities should stay visible as
not-run or environment-blocked evidence.
```

- [ ] **Step 8: Update `performance-specialty-router.md`**

Add this section before `## Suggested routes`:

```md
## Local/free QA tools

For Forge QA, Lighthouse and k6 are optional local/free capabilities, not
universal requirements. Use Lighthouse for web UI load/render/accessibility/SEO
signals when the diff affects those surfaces. Use k6 for load-sensitive API or
backend flows only when targets, thresholds, and environment are explicit.
```

- [ ] **Step 9: Verify Task 4 `temper` wiring**

Run:

```bash
rg -n "qa-evidence-review|QA capability matrix|QA intent draft|Playwright/API|Lighthouse|k6|not configured|deferred" skills/forge/references/temper
```

Expected: new review file is discoverable from `temper/SKILL.md`; verification/testing references mention QA artifacts and residual-risk states.

- [ ] **Step 10: Commit Task 4**

```bash
git add skills/forge/references/temper/SKILL.md skills/forge/references/temper/references/qa-evidence-review.md skills/forge/references/temper/references/testing.md skills/forge/references/temper/references/testing-playwright.md skills/forge/references/temper/references/browser-qa.md skills/forge/references/temper/references/verify.md skills/forge/references/temper/references/performance-specialty-router.md
git commit -m "docs: add temper qa evidence review"
```

---

### Task 5: Final Consistency Pass

**Files:**
- Inspect: all files changed in Tasks 1-4
- Modify if needed: `skills/forge/references/source-integration.md`
- Modify if needed: `skills/forge/references/playwright-qa.md`
- Modify if needed: `skills/forge/references/temper/SKILL.md`

- [ ] **Step 1: Run Markdown whitespace check**

Run:

```bash
git diff --check
```

Expected: no output.

- [ ] **Step 2: Verify no paid-provider requirement slipped in**

Run:

```bash
rg -n "Momentic|QA\\.tech|Vibium|paid provider|paid QA|hosted AI QA|vendor dashboard|provider-owned" skills/forge docs/superpowers/specs/2026-06-11-forge-local-qa-design.md
```

Expected: matches only appear in prohibitions, source-synthesis notes, or statements that these are not required dependencies.

- [ ] **Step 3: Verify new QA artifacts are discoverable**

Run:

```bash
rg -n "qa-intent-draft|qa-capability-matrix|qa-evidence-review|QA Intent Draft|QA Capability Matrix|QA evidence review" skills/forge/references
```

Expected: `playwright-qa.md`, `workflow-routing.md`, reporting/setup/project knowledge/source integration, and `temper` references point to the new artifacts.

- [ ] **Step 4: Verify local/free optional tooling is conditional**

Run:

```bash
rg -n "@axe-core/playwright|Lighthouse|k6|coverage|visual snapshot|Page Objects|waitForTimeout|Playwright API" skills/forge/references
```

Expected: guidance says these are conditional or existing/user-approved tools, except Playwright E2E/API as the primary local executable QA layer.

- [ ] **Step 5: Review changed file list**

Run:

```bash
git diff --name-only HEAD
```

Expected: only Forge QA/reference docs changed after the last task commit. No unrelated files.

- [ ] **Step 6: Commit final polish if any files changed**

If Steps 1-5 required edits, run:

```bash
git add skills/forge docs/superpowers/plans/2026-06-11-forge-local-qa.md
git commit -m "docs: polish forge local qa guidance"
```

If no edits were needed, do not create an empty commit.

- [ ] **Step 7: Push branch**

Run:

```bash
git push origin codex/forge-system
```

Expected: branch pushes successfully to the existing PR branch.
