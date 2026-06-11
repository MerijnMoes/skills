# Forge Visual Companion Router

This file replaces the standalone brainstorming mockup server with routing into
`forge`'s design-studio payload.

Use it after the user accepts visual help during brainstorming. It is a router,
not a separate mode: decide per question whether visual treatment helps.

## Core Rule

Do not start the legacy `.superpowers/brainstorm` HTML server from inside
`forge`. Prefer the integrated design-studio references and scripts.

## Route By Need

### UI Or Product Surface Before Code

Use this when the conversation is shaping a new screen, flow, component,
dashboard, landing page, onboarding path, settings page, form, or other
user-facing surface before implementation.

Load:

- `references/design-studio/SOURCE-SKILL.md`
- `references/design-studio/reference/shape.md`
- `references/design-studio/reference/brand.md` or
  `references/design-studio/reference/product.md`

If Codex or the active harness has native image generation, follow
`references/design-studio/reference/codex.md` for visual direction probes after
shape discovery. The probes support the brief; they do not replace the brief.

Output a confirmed design brief before implementation planning.

### Existing Running UI

Use this when there is already a running dev server, static HTML page, or
browser-visible surface and the user wants visual iteration on real UI.

Load:

- `references/design-studio/reference/live.md`

Run the live helper from the installed `forge` skill directory:

```bash
node "$FORGE_SKILL_DIR/references/design-studio/scripts/live.mjs"
```

Then follow the live-mode poll contract in `live.md`.

### Design Critique, Audit, Or Polish

Use this when the user wants to evaluate or improve an existing surface rather
than brainstorm a new one.

Load the most specific reference:

- `references/design-studio/reference/critique.md`
- `references/design-studio/reference/audit.md`
- `references/design-studio/reference/polish.md`
- `references/design-studio/reference/harden.md`
- targeted refiners such as `layout.md`, `typeset.md`, `colorize.md`,
  `adapt.md`, `animate.md`, `clarify.md`, `optimize.md`, or `onboard.md`

Use the detector script as evidence when relevant:

```bash
node "$FORGE_SKILL_DIR/references/design-studio/scripts/detect.mjs" --json <target>
```

Detector output is evidence, not proof of design quality.

### Architecture, Process, Or Non-UI Diagrams

Use text-native visuals instead of design-studio live mode:

- Mermaid diagrams in the response
- ASCII sketches for small flows
- Markdown tables for comparisons

Only use design-studio if the diagram is part of a user-facing UI surface.

## Per-Question Decision

Use visual treatment when the answer depends on seeing one of these:

- layout or hierarchy
- visual direction
- responsive composition
- information architecture
- interaction flow
- before/after critique

Stay in terminal text when the answer is primarily:

- requirements
- scope
- tradeoffs
- technical architecture
- data modeling
- copy-only clarification

A question about UI is not automatically visual. "What should this wizard
achieve?" is text. "Which wizard layout feels clearer?" is visual.

## User Experience

Keep the original brainstorming consent model:

1. Offer visual help as its own message when upcoming questions may benefit
   from visual treatment.
2. If the user declines, continue text-only.
3. If the user accepts, route each visual moment through the correct
   design-studio reference or lightweight diagram format.
4. Do not imply every later question will use a browser.

When returning from visual work to terminal-only discussion, say so briefly so
the user knows where to focus.
