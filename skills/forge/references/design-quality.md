# Forge design quality

Use this lane for UI, UX, visual, interaction, layout, onboarding, dashboard,
form, and other user-facing changes.

Before doing substantial UI work, load `source-integration.md` and the relevant
`design-studio/reference/*.md` file. This adapter names the `forge` phase; the
design-studio payload contains the detailed command discipline.

## Entry criteria

Run this lane when classification marks the task as `ui-or-flow` or
`mixed-feature`, or when backend work materially changes an important user
journey.

## Passes

### Shape

Source: `design-studio/reference/shape.md`.

- clarify the intended user journey
- define hierarchy, state, and interaction priorities
- identify the screens and states Playwright must cover
- name the primary emotion or confidence signal the UI should create
- decide what should be visually dominant, secondary, and quiet

### Critique

Source: `design-studio/reference/critique.md`.

- inspect the implemented UI against the spec and shaping direction
- check visual hierarchy, spacing, copy density, affordances, empty states,
  loading states, and error states
- identify only issues that affect clarity, usability, or confidence
- compare the implementation to the strongest nearby product pattern before
  introducing new visual language

### Audit

Source: `design-studio/reference/audit.md`.

- check accessibility, keyboard flow, labels, focus states, contrast, and error
  announcement
- check responsiveness across relevant viewports
- check theming, component consistency, and obvious performance risks
- check that interactive states are visible: hover, focus, active, disabled,
  loading, success, and error

### Harden

Source: `design-studio/reference/harden.md`.

- fix high-confidence design or accessibility defects with clear user impact
- rerun the relevant UI or browser checks after changes
- pause for product or brand judgment when the right fix is not mechanical
- do not redesign opportunistically once the agreed direction is working

### Polish

Source: `design-studio/reference/polish.md`.

- apply small, safe refinements that improve readability or interaction quality
- avoid speculative redesign once the UI meets the spec and checks
- keep polish reversible and low risk; if it changes product meaning, return to
  shaping

## Live review

Use browser inspection when a design issue is easier to evaluate visually than
in code. Capture screenshots or notes when they will help downstream QA and
`temper`.

Review these states when relevant:

- first load
- happy path
- empty state
- long content
- validation error
- network or server error
- permission denied
- narrow mobile viewport
- keyboard-only navigation

## Output

Record:

- screens or flows reviewed
- issues found and fixed
- issues deferred for user judgment
- responsive and accessibility checks performed
- evidence paths, screenshots, or notes when available

## Quality bar

The lane is complete when the user-facing change is coherent, accessible enough
for the risk level, responsive for expected viewports, and ready for Playwright
coverage.
