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

`Discover -> Spec -> Plan -> Shape (if needed) -> Implement -> Design Quality (if needed) -> Playwright Author -> Playwright Verify -> Playwright Explore (conditional) -> Temper -> Report`

## Operating rules

- Start with `references/preflight.md`.
- Use `references/source-integration.md` to resolve the internal methodology
  and design-studio source payloads.
- Use `references/project-knowledge.md` to read and maintain durable repo
  memory such as `PRODUCT.md`, `DESIGN.md`, `CONTEXT.md`,
  `CONTEXT-MAP.md`, and ADRs.
- Classify the task using `references/classification.md`.
- Route the rest of the run through `references/workflow-routing.md`.
- Use `references/discovery.md` to gather project context and requirements.
- Use `references/specification.md` to define the approved behavior before
  planning.
- Use `references/planning.md` to create a concrete implementation plan.
- Use `references/shaping.md` when the task touches UI, UX, layout, flows, or
  visual hierarchy.
- Use `references/implementation.md` to execute with test-first discipline,
  branch hygiene, and review checkpoints.
- Use `references/design-quality.md` for UI critique, accessibility,
  responsiveness, hardening, and polish before QA.
- Use `references/playwright-qa.md` for the QA lane before `temper`.
- Use `references/pause-resume.md` to manage `.forge/` state and resume points.
- Use `references/reporting.md` to produce the final handoff.
- Enter the final hardening phase through `references/temper/SKILL.md`.
- Do not present `temper` as a second public skill or separate user command.
- When the compact `forge` adapters are too thin for the situation, load the
  matching source payload file before acting.

## Quality contracts

- Ground first, then specify, then plan; do not jump from request to edits when
  scope is unclear.
- Treat durable project knowledge as part of grounding: read it before asking
  questions and update it when reusable product, design, domain, or decision
  truth is resolved.
- For behavior changes, prefer a red-green-refactor loop and prove tests fail
  for the intended reason before implementing.
- For bugs or broken checks, find root cause before fixing symptoms.
- Use fresh-context review at meaningful checkpoints for broad, risky, or
  delegated work.
- Treat user-facing polish as part of the workflow, not an optional afterthought
  when the task affects UI or product flow.
- Preserve the one-command user experience even when internal references still
  carry upstream names, examples, or license text.

## User experience

- `forge` is the only public entrypoint in this repo.
- `temper` is internal to the workflow even though its guidance lives in
  references.
- The workflow should pause at explicit approval or judgment points rather than
  pretending the whole system is fire-and-forget.
