# Forge workflow routing

This file decides what happens after classification.

Load `source-integration.md` and `project-knowledge.md` before deep phase work.
The compact files in this directory route the workflow; the payloads under
`methodology/` and `design-studio/` provide the detailed procedures.

## Default order

`Setup (if requested or blocking context is missing) -> Discover -> Spec -> Plan -> Shape (if needed) -> Implement -> Design Quality (if needed) -> QA Intent Draft (when Playwright is required or meaningful) -> Playwright Author (if classification requires it or QA draft selects it) -> Playwright Verify (when Playwright is required or authored) -> Playwright Explore (conditional) -> QA Capability Matrix -> Temper -> Report`

## Explicit lane requests

When the user explicitly asks for an internal lane through `forge`, honor that
request instead of forcing the full default order.

- `forge setup`: route to `setup.md`.
- `forge temper`: run preflight, then enter `references/temper/SKILL.md`
  directly on the current branch diff.
- `forge temper against base`: same as above, with base branch auto-detected by
  the `temper` phase.
- `forge temper against <branch>`: same as above, but treat `<branch>` as the
  requested comparison base for the diff and carry that override into
  `temper` Phase 0.

Direct `temper` routing skips discovery/spec/plan/implementation lanes because
the user is asking for the final hardening pass only, not a fresh build cycle.
If `temper` later finds blockers, report them and recommend the earliest phase
that should be re-entered afterward.

Use `classification.md` to decide whether Playwright is skipped, optional, or
required for the run.

Use `playwright-qa.md`, `qa-intent-draft.md`, and
`qa-capability-matrix.md` for the local/free QA lane. The QA lane may learn
from external QA practices, but it must not require paid QA providers, hosted AI
testing services, provider-owned model subscriptions, or vendor dashboards.

Use `discovery.md`, `specification.md`, `planning.md`, and
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
- Branch/workspace setup: `methodology/skills/using-git-worktrees/SKILL.md`
- Implementation loop: `methodology/skills/test-driven-development/SKILL.md`
- Debugging: `methodology/skills/systematic-debugging/SKILL.md`
- Cross-agent execution: `methodology/skills/subagent-driven-development/SKILL.md`
- Sequential execution fallback: `methodology/skills/executing-plans/SKILL.md`
- Review checkpoints: `methodology/skills/requesting-code-review/SKILL.md`
  and `methodology/skills/receiving-code-review/SKILL.md`
- Completion claims: `methodology/skills/verification-before-completion/SKILL.md`
- UI shaping: `design-studio/reference/shape.md`
- UI building/craft: `design-studio/reference/craft.md`
- UI critique/audit/polish: `design-studio/reference/critique.md`,
  `design-studio/reference/audit.md`, and `design-studio/reference/polish.md`
- UI hardening: `design-studio/reference/harden.md`
- Live browser design iteration: `design-studio/reference/live.md`

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
- If the QA intent draft exposes ambiguous product behavior, pause before
  authoring durable tests.
- If exploratory QA finds a high-confidence, low-blast-radius issue, fix and
  rerun QA before moving on.
- If exploratory QA reveals ambiguous product or UX concerns, pause for user
  guidance.
- If the capability matrix marks a relevant check `not configured` or
  `deferred`, carry that residual risk into `temper` rather than hiding it.
- If `temper` returns blockers, route back to the earliest phase needed to
  resolve them, then rerun downstream checks.

## Stop conditions

- Stop and summarize when the same unresolved blocker keeps reopening.
- Stop and ask for guidance when the requested flow is too ambiguous to author
  Playwright coverage safely.
