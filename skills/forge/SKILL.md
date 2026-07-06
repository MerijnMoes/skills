---
name: forge
description: The public command family for this repo's integrated development workflow. Use it to set up project memory for a repo, take a change from discovery and specification through implementation and QA, or run the public final hardening review. Invoke when the user explicitly asks to use forge or clearly wants the repo's full development workflow.
---

# Forge

`forge` is the public front door to this repository's development workflow
system. It owns the flow from request to final readiness, including discovery,
setup, specification, planning, implementation routing, QA, and the final
hardening review.

The public command surface is:

- `/forge:setup`: prepare Forge for a new or existing repo.
- `/forge:build`: run the full change workflow.
- `/forge:review`: run the final hardening and readiness review on the current
  diff, optionally against a chosen base.

## When to use

- Use `forge` when the user wants this repo's full workflow, not a narrow
  one-off review.
- Use it for new features, substantial refactors, workflow-level bug fixes, or
  any change where browser QA and final readiness matter.
- Use it to set up project memory for a repo before substantial Forge work.
- Do not use it for trivial factual questions or unrelated repo audits.

## Phase model

`forge` runs this phase order:

`Setup (if requested or blocking context is missing) -> Discover -> Spec -> Plan -> Visual Plan Review (optional) -> Shape (if needed) -> Implement -> Design Quality (if needed) -> QA -> Review -> Report`

## Operating rules

- Start with `references/preflight.md`.
- Use `references/source-integration.md` to resolve the internal methodology
  and design-studio source payloads.
- Use `references/project-knowledge.md` to read and maintain durable repo
  memory such as `PRODUCT.md`, `DESIGN.md`, `CONTEXT.md`,
  `CONTEXT-MAP.md`, and ADRs.
- Use `references/setup.md` for `/forge:setup`, including existing-project
  and new-project setup modes.
- Classify the task using `references/classification.md`.
- Route the rest of the run through `references/workflow-routing.md`.
- Use `references/discovery.md` to gather project context and requirements.
- Use `references/specification.md` to define the approved behavior before
  planning.
- Use `references/planning.md` to create a concrete implementation plan.
- Use `references/visual-plan.md` only after asking the user, and only as a
  dependency-light review surface before implementation.
- Use `references/shaping.md` when the task touches UI, UX, layout, flows, or
  visual hierarchy.
- Use `references/implementation.md` to execute with test-first discipline,
  branch hygiene, and review checkpoints.
- Use `references/design-quality.md` for UI critique, accessibility,
  responsiveness, hardening, and polish before QA.
- Use `references/qa.md` for the QA umbrella after implementation and design
  quality.
- Use `references/pause-resume.md` and `references/state-contract.md` to manage
  `.forge/` state, evidence, and resume points.
- Use `references/reporting.md` to produce the final handoff.
- Use `/forge:review` language for the public final hardening lane. Route its
  internals through `references/temper/SKILL.md` until the internal migration is
  complete.
- When the compact `forge` adapters are too thin for the situation, load the
  matching source payload file before acting.

## Quality contracts

- Ground first, then specify, then plan; do not jump from request to edits when
  scope is unclear.
- If repo evidence still leaves even modest ambiguity about copy, UX, defaults,
  data behavior, or another approval-worthy tradeoff, pause for a compact
  brainstorming/spec step before planning instead of treating the request as
  implementation-ready.
- Treat durable project knowledge as part of grounding: read it before asking
  questions and update it when reusable product, design, domain, or decision
  truth is resolved.
- Keep setup idempotent and selective: create first-version markdown files only
  when they will be read by later Forge phases.
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

- Users may ask for `/forge:setup` when they want to prepare Forge for a new or
  existing repo.
- Users may ask for `/forge:build` when they want the full change workflow.
- Users may ask for `/forge:review`, `/forge:review against base`, or
  `/forge:review against <branch>` when they want only the final hardening pass.
- `temper` remains the internal reference payload behind review during
  migration; do not present it as a separate public skill.
- The workflow should pause at explicit approval or judgment points rather than
  pretending the whole system is fire-and-forget.
