# Forge workflow routing

This file decides what happens after classification.

Load `source-integration.md` before deep phase work. The compact files in this
directory route the workflow; the payloads under `methodology/` and
`design-studio/` provide the detailed procedures.

## Default order

`Discover -> Spec -> Plan -> Shape (if needed) -> Implement -> Design Quality (if needed) -> Playwright Author (if classification requires it) -> Playwright Verify (when Playwright is required or authored) -> Playwright Explore (conditional) -> Temper -> Report`

Use `classification.md` to decide whether Playwright is skipped, optional, or
required for the run.

Use `discovery.md`, `specification.md`, `planning.md`, and
`implementation.md` for the core development workflow. Use
`design-quality.md` after implementation when the task activates the shaping
lane or otherwise affects a user-facing flow.

For non-trivial work, load the matching source payloads:

- Discovery and product shaping: `methodology/skills/brainstorming/SKILL.md`
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
