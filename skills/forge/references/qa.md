# Forge QA

QA is the single top-level quality phase after implementation and design
quality. It preserves Forge's existing QA rigor while making the public phase
overview easier to read.

## Sub-lanes

Run the relevant sub-lanes in this order:

1. QA Intent Draft
2. Capability Check
3. Playwright Author
4. Watched Local Verify
5. CI-Equivalent Verify
6. Exploratory QA
7. Capability Matrix And Evidence

## References

- Use `qa-intent-draft.md` before substantial durable test authoring.
- Use `playwright-qa.md` for Playwright availability checks, test authoring,
  watched local verification, CI-equivalent verification, and API request tests.
- Use `qa-capability-matrix.md` to record run, N/A, not configured, and deferred
  capabilities.

## Capability Check

Before authoring or running E2E tests, detect whether the target project has:

- `@playwright/test`
- `playwright.config.*`
- E2E folders such as `tests/e2e/`
- package scripts such as `test:e2e`
- installed Playwright browsers where practical
- CI jobs that already run E2E tests

If Playwright is missing and E2E is required or useful, ask before adding it.
If the user declines, use host browser automation for exploration when
available, but report that no durable E2E tests were added.

## Watched and CI-equivalent verification

Watched local verification should default to headed Playwright:

```bash
npx playwright test <changed-tests> --headed
```

Use UI mode with the same relevant test selection when step debugging or
time-travel visibility is more useful:

```bash
npx playwright test <changed-tests> --ui
```

Then run the same relevant durable tests in CI-equivalent mode:

```bash
npx playwright test <changed-tests>
```

The watched run and CI-equivalent run must exercise the same test logic. If
headed passes but headless fails, QA is not passing.

## Exploratory QA

After scripted verification, perform risk-shaped exploratory probing when the
change is UI-heavy, flow-heavy, risky, or difficult to reason about statically.
Probe adjacent routes, responsive states, keyboard paths, loading/empty/error
states, auth boundaries, and plausible unusual user paths when relevant.

If exploration finds a stable bug, fix it and usually add or update a durable
regression test. If it finds product or UX ambiguity, pause for user guidance.

## Output

Record:

- QA intent status
- Playwright capability status
- authored or updated test paths
- watched local E2E command and result
- CI-equivalent E2E command and result
- exploratory QA findings
- capability matrix
- residual risks
