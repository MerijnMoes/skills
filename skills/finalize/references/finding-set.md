# Finding set

Used in `/finalize` after Phase 4 lanes begin producing review output. Every
lane emits candidate findings into one normalized set so blockers can be
verified, deduplicated, challenged, and reported consistently.

## Required fields per finding

- title
- lane/source
- file or surface
- severity
- confidence
- reachability
- evidence type
- concrete trigger
- violated invariant or spec point
- current status
- recommended action: `Fix` | `Investigate` | `Plan` | `Decide`

## Lane contract

Every audit lane should emit candidate findings using the required finding
fields above. Common participating lanes include:

- correctness review
- security review
- focused bug hunt
- spec conformance
- project-fit / consistency
- structural regression
- dependency / static-intelligence / migration-sensitive conditional lanes

Use the `risk lane` assigned in the evidence pack when deciding whether
challenger coverage or extra verification is needed. Refer to
`risk-mapping.md` for the deeper risk map behind that lane.

## Status values

- `candidate` — found by a lane, not yet challenged
- `blocking` — survives trigger-test verification and should affect the verdict
- `non-blocking` — real but not verdict-changing
- `deferred` — real follow-up, intentionally not solved inside `/finalize`
- `contested` — important disagreement or uncertainty remains after challenge
- `fixed` — resolved during the finalize run
- `dropped` — failed verification or duplicate of a stronger finding

## Reporting-term mapping

Map the finding-set statuses into existing finalize reporting terms like this:

- `fixed` stays `fixed`
- `deferred` stays `deferred`
- `blocking`, `non-blocking`, and `contested` remain `unresolved` until they
  are fixed, deferred, or dropped
- surviving findings whose recommended action is `Decide` surface as
  `needs user decision` in the final report, even if their internal workflow
  status remains `blocking`, `non-blocking`, or `contested`
- `candidate` is working state only and should not appear in the final report
  unless the review stopped before validation
- `dropped` is omitted from the final report unless keeping the audit trail is
  useful for explaining why a suspected blocker no longer stands

## Challenger behavior

The challenger is selective:

- run it by default for red-lane diffs;
- run it for high-impact low-confidence findings;
- run it when lanes disagree materially.

Its job is to disprove weak blockers and surface missed high-impact defects, not
to create a second wall of findings.
