# Forge Review Design Quality

## Goal

Make `/forge:review` better at teaching and judging software design. The
review should still lead with correctness, risk, and verification, but it should
also recognize meaningful examples of good design and reason more deeply with
the ideas from John Ousterhout's *A Philosophy of Software Design*.

## Current Gap

The current review flow already references learning notes, SOLID, clean coding,
deep modules, and Ousterhout-style complexity lenses. Those ideas are useful,
but they mostly appear as overview labels. A reviewer can satisfy the current
contract by saying a change is "clean" or by citing "deep modules" without
explaining the mechanism that makes the design better or worse.

The missing behavior is a diff-scoped design-quality analysis that asks what
complexity moved, what knowledge became hidden or exposed, what callers now have
to understand, and whether the change reduces or increases future change
amplification.

## Design

Add a deeper design-quality layer to the `temper` review pipeline.

1. Create or expand a `temper` reference for design-quality review.
2. Add an internal `Design Quality Notes` artifact produced during audit or
   validation.
3. Project design-quality notes into the final report only when the review found
   meaningful, evidence-backed examples.
4. Keep the analysis diff-scoped. The review may identify broader future
   opportunities, but it must not turn final hardening into a general
   architecture rewrite.

## Design-Quality Lens

The review should evaluate changed code through concrete probes rather than
principle names:

- What knowledge did this change hide, expose, duplicate, or scatter?
- What does a caller now need to know to use the changed module correctly?
- Did the interface become deeper or shallower?
- Did the change reduce cognitive load or merely move complexity elsewhere?
- Did it reduce or increase change amplification?
- Does it preserve locality, so related decisions and bug fixes remain in one
  coherent place?
- Is this a strategic simplification, or a tactical patch that will make the
  next change harder?
- Are unknown unknowns reduced by explicit interfaces, invariants, names, and
  tests?

The lens can use SOLID, clean architecture, and project conventions, but those
should be translated into mechanism-level explanations. For example, avoid
"this is good dependency inversion" as a standalone claim; prefer "policy code
no longer imports the transport detail, so future transport changes stay local
to the adapter."

## Positive Design Notes

`/forge:review` should include a "What went right" or equivalent section only
when there are meaningful examples worth calling out. Meaningful means:

- the example is tied to a specific changed surface;
- it explains why the choice reduces complexity, risk, or future work;
- it names the trade-off or boundary of the advice;
- it is useful enough that the user could preserve or repeat the pattern later.

Do not add generic praise, morale filler, or a default empty section. "No
meaningful positive design notes" is acceptable as an internal outcome and
must be omitted from the final report.

## Critical Design Notes

Design risks should remain evidence-backed and action-oriented. A design concern
should say what future change, bug, or maintenance task becomes harder, and why.
If it is localized and safe, it can become a normal finding. If it is broader
than final hardening, classify it as `Plan`, `Investigate`, or `Decide`.

The review should not block on aesthetic preferences. It should block only when
the structural issue creates a concrete, reachable correctness, maintainability,
or delivery risk for the current change.

## Artifact Shape

`Design Quality Notes` should be compact internal records with:

- kind: `strength` or `risk`
- surface: file, module, or behavior area
- principle: the design lens in play
- evidence: what the diff actually did
- mechanism: how complexity, knowledge, coupling, or amplification changed
- trade-off: cost, drawback, or when not to apply this advice
- disposition: report, finding, defer, or drop

Phase 8 should summarize only the notes with `report`, `finding`, or meaningful
`defer` dispositions.

## Testing

Update the contract tests so the skill text requires:

- a design-quality reference or section;
- the `Design Quality Notes` internal artifact;
- mechanism-level explanations instead of label-only principle references;
- optional positive design reporting only when meaningful examples exist;
- continued Ousterhout and SOLID/project-fit coverage without treating them as
  authority detached from the diff.

Run the existing contract test suite after editing.
