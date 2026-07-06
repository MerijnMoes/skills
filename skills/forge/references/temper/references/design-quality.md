# Design quality review

Used in `temper` Phases 4, 7, and 8. This reference turns design principles
into diff-scoped review practice. It is not a broad architecture audit and not a
license to rewrite working code because another shape is imaginable.

The goal is to produce compact `Design Quality Notes`: evidence-backed notes
about design strengths worth preserving and design risks worth fixing,
deferring, or surfacing. Use this lens only where it explains the current diff
better than generic correctness, security, or style review.

## Source lenses

Use these as thinking tools, not authority:

- John Ousterhout's *A Philosophy of Software Design*: complexity is anything
  that makes software hard to understand or modify. Look for change
  amplification, cognitive load, unknown unknowns, information hiding, deep
  modules, shallow modules, tactical programming, and strategic programming.
- SOLID and clean architecture: translate the label into the actual mechanism
  in this codebase. Do not say "good dependency inversion" without explaining
  what concrete detail is now hidden behind which stable interface.
- Project conventions: the repository's existing boundaries and domain language
  outrank generic advice.

## Mechanism-level probes

Ask these about the changed code:

- What knowledge did the diff hide, expose, duplicate, or scatter?
- What must a caller know now to use the changed module correctly: types,
  ordering, invariants, errors, config, performance, or side effects?
- Did the interface become deeper by hiding meaningful implementation detail
  behind a smaller surface, or shallower by adding pass-through ceremony?
- Did the change reduce cognitive load, or did it move complexity to another
  caller, test, config file, or runtime convention?
- Did it reduce or increase change amplification: how many places must change
  for the next likely variant?
- Did it improve locality so related decisions, bugs, and verification stay in
  one coherent module?
- Did it reduce unknown unknowns by naming invariants, making states explicit,
  or adding tests that document behavior?
- Is the change strategic simplification, or tactical patching that solves
  today's request while making the next change harder?

## Positive design notes

Emit a positive `Design Quality Notes` item only for meaningful examples. A
meaningful example:

- names a specific changed surface;
- explains the mechanism that reduces complexity, risk, or future work;
- states the trade-off, drawback, or when not to apply the advice;
- gives the user a pattern worth preserving or repeating.

Do not emit generic praise, morale filler, or a default "what went right"
section. If no meaningful examples exist, record no positive note and the final
report section must be omitted.

Good shape:

- Surface: `PaymentWebhookHandler`
- Principle: information hiding / deep module
- Evidence: the handler now delegates signature parsing and timestamp tolerance
  to `WebhookVerifier.verify(request)`.
- Mechanism: callers no longer need to know the header names, clock skew rule,
  or HMAC comparison detail; those invariants stay local to one verifier.
- Trade-off: the verifier is worth keeping only while it hides those details; a
  one-line pass-through wrapper would be shallow.
- Disposition: report

Bad shape:

- "Nice clean architecture."
- "Good SOLID."
- "This follows Ousterhout."

## Design risk notes

Emit a design risk only when the diff creates or exposes a concrete future bug,
maintenance hazard, or delivery risk:

- A shallow wrapper adds interface surface without hiding complexity.
- Feature-specific logic leaks into a general module.
- Knowledge duplication means a future rule change must be made in several
  places.
- A boundary leak makes high-level policy depend on transport, framework, ORM,
  or vendor details.
- A tactical patch increases the number of files that must change for the next
  likely variant.

If the risk is localized, safe, and verifiable, convert it into a normal
finding with `Fix`. If the risk is real but broader than final hardening,
classify it as `Plan`, `Investigate`, or `Decide` through
`findings-lifecycle.md`.

Do not block on aesthetics. A design-quality blocker needs the concrete
maintenance hazard it creates for this change, not a preferred architecture
style.

## Artifact schema

Each `Design Quality Notes` item should carry:

- kind: `strength` or `risk`
- surface: file, module, function, command, or behavior area
- principle: the lens in play
- evidence: what the diff actually did
- mechanism: how complexity, knowledge, coupling, locality, or change
  amplification changed
- trade-off: cost, drawback, or when not to apply this advice
- disposition: `report`, `finding`, `defer`, or `drop`

Phase 7 should carry `report`, `finding`, and meaningful `defer` items into the
`Decision Packet`. Phase 8 should summarize them under Learning notes, Findings,
or an optional "What went right" section depending on disposition and kind.
