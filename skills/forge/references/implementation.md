# Forge implementation

Implementation turns the approved plan into working changes.

## Operating rules

- Work on a feature branch or explicitly approved working branch.
- Follow the repo's existing patterns before introducing new abstractions.
- Keep edits scoped to the planned surfaces.
- Use test-first development for changed behavior when practical.
- Commit at coherent checkpoints when the workflow calls for durable history.
- Do not let implementation rewrite the approved product behavior without
  returning to spec or planning.
- When a task can be split safely, keep work packages independent enough for
  fresh-context review or parallel agent execution.

## Test discipline

- Write or update the smallest useful test before changing behavior when the
  repo has an appropriate test layer.
- Watch new or changed tests fail for the intended reason before writing the
  production change.
- Run focused tests after each meaningful change.
- Run broader checks before Playwright QA or `temper`.
- If the baseline is already red, record that explicitly and avoid hiding the
  difference between pre-existing failures and new regressions.
- Do not satisfy tests by weakening assertions unless the spec changed and that
  change was approved.

## Red-green-refactor loop

For behavior changes:

1. Add or update one focused failing test for the next acceptance criterion.
2. Run it and confirm the failure proves the missing behavior, not a typo or
   setup mistake.
3. Implement the smallest change that should pass that test.
4. Rerun the focused test, then any nearby tests that could regress.
5. Refactor only after the tests are green.
6. Repeat for the next criterion.

If a suitable automated test layer does not exist, record why, use the nearest
useful verification hook, and let Playwright cover browser-facing behavior when
classification requires it.

## Debugging loop

When implementation exposes a bug, failing check, or unexpected behavior:

1. Reproduce the symptom with the smallest command, route, or interaction.
2. Read the full error and trace the failing value or state backward to its
   source.
3. Compare against a working pattern in the same repo before inventing a fix.
4. State one hypothesis and test one variable at a time.
5. Fix the root cause, then add or update a regression check where practical.
6. If three distinct fixes fail, stop and revisit the architecture or plan with
   the user instead of stacking patches.

## Review discipline

- Review the diff against the spec before entering QA.
- Check for accidental scope growth.
- Check codebase fit: naming, helpers, module boundaries, and local style.
- For risky or broad work, use a fresh-context review before moving on.
- Treat fresh review as a gate, not a courtesy: fix critical and important
  findings before downstream QA, or explicitly record why the finding is not
  valid.
- For multi-step plans, review after meaningful checkpoints so defects do not
  compound across later tasks.

## Output

Record:

- changed files
- tests added or updated
- verification commands and results
- known limitations or deferred work
- whether the work is ready for design quality and Playwright QA

## Quality bar

Implementation is complete when the planned behavior works, focused checks have
run, and the diff is ready to be exercised through the downstream quality
lanes.
