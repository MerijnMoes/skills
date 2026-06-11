# Forge workflow routing

This file decides what happens after classification.

## Default order

`Discover -> Spec -> Plan -> Shape (if needed) -> Implement -> Design Quality (if needed) -> Playwright Author (if classification requires it) -> Playwright Verify (when Playwright is required or authored) -> Playwright Explore (conditional) -> Temper -> Report`

Use `classification.md` to decide whether Playwright is skipped, optional, or
required for the run.

Use `discovery.md`, `specification.md`, `planning.md`, and
`implementation.md` for the core development workflow. Use
`design-quality.md` after implementation when the task activates the shaping
lane or otherwise affects a user-facing flow.

After Playwright verification and any exploratory QA, move into `temper` as the
internal final hardening phase before reporting out.

## Loopbacks

- If shaping changes the intended UI direction materially, return to `Spec` or
  `Plan` before implementation.
- If design quality review finds a high-confidence usability, accessibility, or
  responsiveness defect, return to `Implement` and rerun the relevant design
  and QA checks.
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
