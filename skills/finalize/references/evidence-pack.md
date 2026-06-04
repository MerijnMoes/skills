# Evidence pack

Used in `/finalize` Phase 0 and then carried into every later phase. This is the
single compact artifact that explains what changed, why it matters, where the
risk is, and what evidence exists before deeper review begins.

## Required fields

- diff scope
- base branch and comparison point
- changed surfaces and subsystem clusters
- language and framework detection
- project-context capsule
- pinned intent/spec source
- risk lane: `green` | `yellow` | `red`
- risk map
- runtime interaction sketch
- hotspots
- verifier inventory and initial results
- missing artifacts / unknowns

## Risk lane calibration

Assign the `risk lane` in Phase 0 using this compact calibration:

- `green` — localized change, low blast radius, straightforward rollback
- `yellow` — meaningful behavior change or side effects that need focused probes
- `red` — high-blast-radius, security-sensitive, migration-sensitive, or hard-to-reverse change

Use `risk-mapping.md` for the deeper risk map, failure modes, trust boundaries,
and hotspots. The evidence pack carries the lane classification forward once it
is assigned.

## Runtime interaction sketch

This is the most important section for high-risk changes. Capture:

- entrypoints touched
- state transitions
- persistence boundaries
- cache interactions
- async/retry/concurrency points
- external service boundaries
- auth/trust boundaries
- rollout/config toggles

Write it as a compact ordered flow, for example:

- `POST /refund` reads payment state
- checks refundable status
- calls external provider
- writes refund record
- updates payment status
- emits event

## Hotspots

Mark any of these when present:

- auth / permission checks
- migrations / rollout-sensitive code
- concurrency / idempotency
- cache invalidation
- external side effects
- public API changes
- trust-boundary input handling
- performance-sensitive paths

## Output discipline

The evidence pack is not a dump of everything the agent saw. It is a compact
working artifact. If a detail will not change later review behavior, omit it.
