# Forge shaping

Use this phase when the work affects UI, UX, layout, onboarding, dashboards,
forms, or visual hierarchy.

Shaping may be compact for small or mostly-clear requests, but it should still
create an explicit direction/approval checkpoint unless the change is already
fully determined by repo context and requires no real product judgment.

## Goals

- clarify the intended user journey
- identify the key screens, components, or states involved
- define what success looks like before implementation starts

## Required outputs

- a short design direction
- the key flows or surfaces that Playwright must later cover
- any approvals needed before implementation proceeds
- whether the downstream design-quality lane should run critique, audit,
  harden, polish, or live review passes

## Avoid

- turning shaping into generic brainstorming after the spec is already clear
- skipping shaping for visibly user-facing changes
- over-designing purely backend tasks
