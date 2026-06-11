# Forge workflow routing

This file decides what happens after classification.

## Default order

`Discover -> Spec -> Plan -> Shape (if needed) -> Implement -> Playwright Author -> Playwright Verify -> Playwright Explore (conditional) -> Temper -> Report`

## Loopbacks

- If shaping changes the intended UI direction materially, return to `Spec` or
  `Plan` before implementation.
- If Playwright authoring or verification exposes an implementation defect,
  return to `Implement`.
- If exploratory QA finds a high-confidence, low-blast-radius issue, fix and
  rerun QA before moving on.
- If exploratory QA reveals ambiguous product or UX concerns, pause for user
  guidance.
- If `temper` returns blockers, route back to the earliest phase needed to
  resolve them, then rerun downstream checks.

## Stop conditions

- Stop and summarize when the same unresolved blocker keeps reopening.
- Stop and ask for guidance when the requested flow is too ambiguous to author
  Playwright coverage safely.
