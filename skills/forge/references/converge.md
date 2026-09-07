# Forge converge

`converge` is the exit gate of implementation. Before moving into design
quality and QA, prove that the implementation actually covers the approved
spec and plan. It is a verifying pass, not a new product step: "done" must mean
covered by behavior and evidence, not merely "I wrote code".

## Purpose

Make every spec acceptance criterion and every plan task traceable to
implemented behavior plus evidence. This is the forcing function a cheap or
weaker model needs to reliably finish a change rather than drift.

## Inputs

- Approved spec (path or inline summary)
- Approved plan and its task list
- Current `.forge/state.json`
- The implemented diff

## The gate

For each **spec acceptance criterion**:

- Name the implemented behavior that satisfies it.
- Name the evidence that proves it: test command + result, manual probe,
  Playwright run, directory of fixtures, or a recorded check.
- If it cannot be named, it is a gap.

For each **plan task**:

- Confirm the task completed and its named "proves it worked" check actually
  ran (see `planning.md`).
- Confirm the task did not silently expand scope beyond the approved behavior.

A criterion or task is covered only when both behavior and evidence exist, or
the coverage decision is `N/A` with an explicit reason.

## Outcomes

- `converged` — every criterion and task has behavior and evidence, no material
  gaps.
- `gaps-found` — at least one criterion or task lacks behavior or evidence. Do
  NOT proceed to downstream quality lanes. Loop back to `implementation.md`:
  add the missing test/behavior, or record why a criterion does not apply, then
  re-run converge.
- `not-applicable` — the run has no written spec/plan (for example a pure
  review lane). Skip the gate and record why.

## Output and state changes

Record in `.forge/state.json` under `converge`:

- `status`
- `coverage` — criterion/task → implemented behavior → evidence, or `N/A` with
  a reason
- `gaps` — uncovered criteria or tasks, the reason, and the earliest resume
  phase

## Exit criteria

Converge is complete when `status` is `converged` (or `not-applicable` with a
recorded reason). Only then move to design quality and QA.

## Failure and recovery

- A gap that evidence cannot close is a real scope risk: return to the earliest
  phase needed (spec, plan, or implement) and reopen. Do not hide it by
  lowering the evidence bar.
- If the same gap keeps reopening, stop and ask the user whether to expand
  scope, adjust the spec, or accept the gap. Do not silently proceed.
