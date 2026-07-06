# Forge workflow routing

This file decides what happens after classification.

Load `source-integration.md` and `project-knowledge.md` before deep phase work.
The compact files in this directory route the workflow; the payloads under
`methodology/` and `design-studio/` provide the detailed procedures.

## Default order

`Setup (if requested or blocking context is missing) -> Discover -> Spec -> Plan -> Visual Plan Review (optional) -> Shape (if needed) -> Implement -> Design Quality (if needed) -> QA -> Review -> Report`

## Explicit lane requests

When the user explicitly asks for a public `/forge:*` command, honor that
command route instead of forcing the full default order.

- `/forge:setup`: route to `setup.md`.
- `/forge:build`: run the full default workflow.
- `/forge:review`: run preflight, then enter the internal review payload
  (`references/temper/SKILL.md`) directly on the current branch diff.
- `/forge:review against base`: same as above, with base branch auto-detected.
- `/forge:review against <branch>`: same as above, but carry `<branch>` as the
  requested comparison base.

Direct `/forge:review` routing skips discovery/spec/plan/implementation lanes because
the user is asking for the final hardening pass only, not a fresh build cycle.
If the internal review later finds blockers, report them and recommend the earliest phase
that should be re-entered afterward.

Use `classification.md` to decide whether Playwright is skipped, optional, or
required for the run.

Use `qa.md` for the QA umbrella. It coordinates `qa-intent-draft.md`,
`playwright-qa.md`, `qa-capability-matrix.md`, and exploratory QA evidence.
The QA lane may learn from external QA practices, but it must not require paid
QA providers, hosted AI testing services, provider-owned model subscriptions,
or vendor dashboards.

Use `discovery.md`, `specification.md`, `planning.md`, `visual-plan.md`, and
`implementation.md` for the core development workflow. Use
`design-quality.md` after implementation when the task activates the shaping
lane or otherwise affects a user-facing flow.

For any work that is not purely mechanical after discovery, load the matching
source payloads:

- Repo setup and first-version project memory: `setup.md`
- Discovery and product shaping: `methodology/skills/brainstorming/SKILL.md`
  Default to this whenever copy, UX, defaults, data behavior, or state
  expectations are part of the ask and repo context does not make the answer
  fully obvious.
- Domain language and durable project memory:
  `methodology/skills/brainstorming/domain-grilling.md`
- Planning: `methodology/skills/writing-plans/SKILL.md`
- Optional visual plan review: `visual-plan.md`
- Branch/workspace setup: `methodology/skills/using-git-worktrees/SKILL.md`
- Implementation loop: `methodology/skills/test-driven-development/SKILL.md`
- Debugging: `methodology/skills/systematic-debugging/SKILL.md`
- Cross-agent execution: `methodology/skills/subagent-driven-development/SKILL.md`
- Sequential execution fallback: `methodology/skills/executing-plans/SKILL.md`
- Review checkpoints: `methodology/skills/requesting-code-review/SKILL.md`
  and `methodology/skills/receiving-code-review/SKILL.md`
- Completion claims: `methodology/skills/verification-before-completion/SKILL.md`
- QA umbrella: `qa.md`
- QA intent draft: `qa-intent-draft.md`
- Playwright QA sub-lane: `playwright-qa.md`
- QA capability matrix: `qa-capability-matrix.md`
- UI shaping: `design-studio/reference/shape.md`
- UI building/craft: `design-studio/reference/craft.md`
- UI critique/audit/polish: `design-studio/reference/critique.md`,
  `design-studio/reference/audit.md`, and `design-studio/reference/polish.md`
- UI hardening: `design-studio/reference/harden.md`
- Live browser design iteration: `design-studio/reference/live.md`

After the QA umbrella completes, move into Review. Until the internal payload
is renamed, Review is backed by `references/temper/SKILL.md` as the final
hardening phase before reporting out.

## Loopbacks

- If shaping changes the intended UI direction materially, return to `Spec` or
  `Plan` before implementation.
- If visual plan feedback changes the intended behavior or implementation
  order materially, return to `Spec` or `Plan` before implementation.
- If design quality review finds a high-confidence usability, accessibility, or
  responsiveness defect, return to `Implement` and rerun the relevant design
  and QA checks.
- If Playwright authoring or verification exposes an implementation defect,
  return to `Implement`.
- If the QA intent draft exposes ambiguous product behavior, pause before
  authoring durable tests.
- If exploratory QA finds a high-confidence, low-blast-radius issue, fix and
  rerun QA before moving on.
- If exploratory QA reveals ambiguous product or UX concerns, pause for user
  guidance.
- If the capability matrix marks a relevant check `not configured` or
  `deferred`, carry that residual risk into Review rather than hiding it.
- If Review returns blockers, route back to the earliest phase needed to
  resolve them, then rerun downstream checks.

## Stop conditions

- Stop and summarize when the same unresolved blocker keeps reopening.
- Stop and ask for guidance when the requested flow is too ambiguous to author
  Playwright coverage safely.
