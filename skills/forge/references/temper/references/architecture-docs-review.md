# Architecture docs review

Phase 4 and Phase 5 support for `temper`, conditional. Apply when the diff
changes a public API, system boundary, component responsibility split, or other
architecture-facing contract that may require more than a routine README/API
sync.

This lane decides whether the change needs an ADR, architecture doc, or
component doc, and checks whether existing public-API or boundary documentation
became stale. It should keep escalation narrow: not every refactor or internal
cleanup deserves architecture paperwork.

## What to check

- **ADR required?** — the diff introduces, reverses, or materially changes a
  durable decision, tradeoff, or compatibility policy that future contributors
  would need explained, not rediscovered.
- **Architecture doc required?** — the change alters system boundaries,
  cross-component topology, trust/integration edges, or major data/control flow
  in a way that a system-level doc or diagram should now explain.
- **Component doc required?** — a specific subsystem's responsibilities,
  invariants, extension points, or usage contract changed enough that local
  consumers need a focused component-level explanation.
- **Public API docs stale?** — changed endpoints, events, SDK surfaces, CLI
  contracts, config schemas, deprecation paths, or compatibility expectations
  are still described accurately in the project's public-facing docs.
- **Boundary docs stale?** — existing architecture notes, diagrams, ownership
  tables, sequence explanations, or boundary docs still match the changed
  module/service responsibilities.

## Concrete prompts

- Did this diff change what another component, client, or operator is allowed
  to rely on?
- Is there a durable tradeoff or policy decision here that would be lost if the
  code alone were the only record?
- Would a system diagram or component-responsibility doc now tell a false story
  about data flow or ownership?
- Is an existing README/API reference enough, or would that hide a boundary or
  responsibility shift that deserves its own doc?

## Common blockers

- Public API changed but the documented contract, compatibility note, or
  deprecation guidance still describes the old behavior.
- A component took on a new responsibility or integration edge, but the
  component/architecture docs still assign that job elsewhere.
- The change encodes a durable architectural choice, yet no ADR or equivalent
  record exists and future contributors would have to infer the why from code.

## Mutability

- Mutability mode: `small-fix-allowed`
- Small stale-doc fixes are allowed for obvious signature snippets, labels,
  links, ownership wording, or diagrams already owned by the changed surface.
- If the lane concludes that a new ADR, architecture doc, or component doc is
  required, treat that as an escalation target for Phase 5 rather than an
  invitation to auto-author broad design prose during the audit itself.

## Output

- If the lane concludes **no escalation**, keep that as specialty-lane
  registry metadata only; do not emit a placeholder finding.
- If existing API/boundary docs are stale, emit a normalized `Finding Set`
  entry with the changed surface, stale doc target, mismatch, and action type
  (`Fix` when the update is local and safe now; otherwise `Plan`,
  `Investigate`, or `Decide`).
- If the lane concludes that a component doc, architecture doc, or ADR is
  required, emit a normalized `Finding Set` entry naming the required doc
  target, the boundary/decision gap, and the action type that should carry it
  into Phase 5 and Phase 7.
