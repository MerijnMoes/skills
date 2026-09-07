# Forge checklists

Forge records an entry and exit checklist per phase so a run does not skip
steps — especially on cheaper or weaker models that might otherwise trust that
a phase is done. Checklists are load-on-demand: read only the current phase's
checklist when entering it; you do not need the whole system in context.

## Contract

- `entry` — what must already be true before starting the phase.
- `exit` — what must be true to leave the phase (its completion contract).
- Record the current phase's entry and exit as `done` or `not-started` in
  `.forge/state.json` under `checklists` after each transition.

## Phase checklists

**Discover**
- entry: task classified via `classification.md`.
- exit: scope, stakeholders, constraints, and requirements are clear.

**Spec**
- entry: discovery completed.
- exit: approved spec written with explicit acceptance criteria.

**Plan**
- entry: spec approved.
- exit: plan with a task list, each task naming the exact check that proves it
  worked (see `planning.md`).

**Visual plan** (optional)
- entry: user accepted the offer.
- exit: artifact reviewed or explicitly skipped.

**Shape** (if needed)
- entry: approved plan.
- exit: UI intent, direction, and hierarchy settled.

**Implement**
- entry: approved plan and branch hygiene in place.
- exit: red-green-refactor completed for behavior changes, and the
  `converge.md` gate has passed.

**Design quality** (if needed)
- entry: implementation converged.
- exit: critique, accessibility, responsiveness, and hardening reviewed.

**QA**
- entry: implementation converged and design quality passed or N/A.
- exit: QA intent drafted, capability check done, verification passed or
  explicitly deferred with a recorded residual risk.

**Review**
- entry: QA output available.
- exit: a verdict reached (`ready`, `blocked`, or `needs-decision`).

**Report**
- entry: review complete.
- exit: final handoff traced to `.forge/state.json` evidence.
