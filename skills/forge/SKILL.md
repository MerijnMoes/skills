---
name: forge
description: The single public command for this repo's integrated development workflow. Use it to take a change from discovery and specification through implementation, Playwright-guided QA, and the internal temper hardening gate. Invoke only when the user explicitly asks to use forge or clearly wants the repo's full development workflow.
---

# Forge

`forge` is the public front door to this repository's development workflow
system. It owns the flow from request to final readiness, including discovery,
specification, planning, implementation routing, Playwright QA, and the final
`temper` hardening gate.

## When to use

- Use `forge` when the user wants this repo's full workflow, not a narrow
  one-off review.
- Use it for new features, substantial refactors, workflow-level bug fixes, or
  any change where browser QA and final readiness matter.
- Do not use it for trivial factual questions or unrelated repo audits.

## Phase model

`forge` runs this phase order:

`Discover -> Spec -> Plan -> Shape (if needed) -> Implement -> Playwright Author -> Playwright Verify -> Playwright Explore (conditional) -> Temper -> Report`

## Operating rules

- Start with `references/preflight.md`.
- Classify the task using `references/classification.md`.
- Route the rest of the run through `references/workflow-routing.md`.
- Use `references/shaping.md` when the task touches UI, UX, layout, flows, or
  visual hierarchy.
- Use `references/playwright-qa.md` for the QA lane before `temper`.
- Use `references/pause-resume.md` to manage `.forge/` state and resume points.
- Use `references/reporting.md` to produce the final handoff.
- Enter the final hardening phase through `references/temper/SKILL.md`.
- Do not present `temper` as a second public skill or separate user command.

## User experience

- `forge` is the only public entrypoint in this repo.
- `temper` is internal to the workflow even though its guidance lives in
  references.
- The workflow should pause at explicit approval or judgment points rather than
  pretending the whole system is fire-and-forget.
