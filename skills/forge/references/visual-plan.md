# Forge visual plan review

Visual plan review is an optional, user-approved review surface between the
text implementation plan and source edits.

The default Forge visual plan is dependency-light. It should not require
Agent-Native, MDX renderer packages, hosted plan apps, or new npm dependencies.
It works without Agent-Native and without new npm dependencies by default.

## Consent rule

Ask the user before creating or opening a visual plan. Do not assume consent
from task classification alone.

## When to offer it

Offer after planning and before implementation when the work is multi-file,
risky, UI-heavy, architecture-heavy, data-heavy, or expensive to misunderstand.

Do not offer it for trivial fixes, mechanical docs edits, or work where the
final diff is clearer than a plan.

## Artifact shape

Generate a local static HTML browser artifact as the primary review surface.
Supporting Markdown or SVG assets are allowed when useful, but the
browser-openable HTML file is the default.

The artifact should show only sections that help review the work:

- summary and approval state
- file map and ownership boundaries
- architecture or data-flow diagram
- UI states, wireframes, or prototype notes
- API, schema, permission, migration, or error contracts
- risk notes and verification expectations
- open questions that block implementation

## Output

Record whether visual plan review was offered, accepted, skipped, or blocked;
the local artifact path when created; approval status; and any feedback that
changes the spec or plan.
