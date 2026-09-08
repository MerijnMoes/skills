# Findings lifecycle

Used in `temper` Phases 4, 7, and 8. This is the single source of truth
for how candidate findings are emitted, challenged, classified, carried into
the verdict, and projected into final reporting.

The goal is to keep the punch list small, true, and decision-ready. A finding
should not block just because it sounds plausible; it must survive challenge,
carry the right next action, and arrive at the verdict with enough structure
that the user does not have to re-triage it by hand.

## Required fields per finding

Every lane that emits a finding into the shared `Finding Set` should provide:

- title
- lane/source
- file or surface
- severity
- confidence
- reachability
- evidence type
- concrete trigger
- failure scenario: the concrete input, state, or timing that triggers the
  finding and the wrong outcome that results (for quality findings, the
  concrete cost instead). A candidate that cannot name its failure scenario is
  dropped at the source.
- violated invariant or spec point
- current status
- recommended action: `Fix` | `Investigate` | `Plan` | `Decide`
- learning note, when the finding teaches a reusable lesson
- related `Design Quality Notes` item, when the finding came from the
  design-quality review

## Lane contract

Every audit lane should emit candidate findings using the required fields
above. Common participating lanes include:

- correctness review
- security review
- focused bug hunt
- spec conformance
- project-fit / consistency
- structural regression
- dependency / static-intelligence / migration-sensitive conditional lanes

Lane-local scratch formats are fine for intermediate reasoning, but the final
emitted result from each lane must still be normalized into the shared
`Finding Set`.

Use the `risk lane` assigned in the `Evidence Pack` when deciding whether
challenger coverage or extra verification is needed. Refer to
`risk-mapping.md` for the deeper risk map behind that lane.

## Design Quality Notes

`Design Quality Notes` are the companion artifact for design strengths and
design risks. They are not automatically findings. A strength can become a
report-facing "what went right" item; a risk becomes a finding only when it
creates a concrete future bug, maintenance hazard, or delivery risk for the
current diff.

When a design-quality risk becomes a finding, preserve the mechanism in the
finding: what knowledge moved, which interface became deeper or shallower, what
coupling changed, or how change amplification, cognitive load, locality, or
unknown unknowns changed. Label-only claims such as "violates SOLID" or "not
clean architecture" are not sufficient.

## Lifecycle

1. Audit lanes emit `candidate` findings into the shared `Finding Set`.
2. Candidate findings are challenged against concrete trigger evidence before
   they are allowed to block.
3. Surviving findings are given severity, confidence, reachability, action,
   and status.
4. Localized `Fix` findings may be fixed inside `temper`; anything else is
   reported forward.
5. Phase 7 carries the surviving findings into the `Decision Packet`.
6. Phase 8 projects those findings into user-facing report statuses.

## Trigger test for blocking findings

Before a finding is marked **blocking**, state a concrete, reachable trigger: a
specific input or scenario that produces the wrong behavior, and the path by
which untrusted or real data reaches it.

- **Concrete trigger exists and is reachable**: it can block. Record the
  trigger so the user can reproduce it.
- **No trigger you can state**: it is not blocking. Demote it to a
  non-blocking observation or drop it.
- **Trigger requires impossible or contradictory preconditions**: drop it.
- **Trigger is reachable only under unusual low-likelihood conditions**: keep
  it if it is real, but rate severity accordingly.

This applies across lanes. A missing requirement needs the violated spec line.
A race condition needs the interleaving. A structural regression needs the
concrete maintenance hazard it creates, not an aesthetic objection.

## Known false-positive classes

Downgrade these from blocking unless you have specific evidence the protection
is absent or bypassed here:

- framework or ORM already provides the cited protection
- auth is enforced elsewhere in the request path
- the runtime or type system already rules the issue out
- trusted input is being treated as if it were attacker-controlled
- the issue is informational rather than a demonstrated runtime defect
- the report applies only to tests, fixtures, or public test material

This list downgrades; it never upgrades. A finding that escapes every
exclusion still has to pass the trigger test.

## Verify framework and library claims

If the existence or dismissal of a finding depends on library or framework
behavior, verify that behavior against current docs rather than memory. If a
documentation MCP such as Context7 is available, query the specific behavior.
Otherwise say you could not verify it and lower confidence accordingly.

## Action types

After verification, assign one next action:

| Action | Use when | Effect on `temper` |
|--------|----------|------------------------|
| **Fix** | High-confidence, localized defect with a clear safe fix inside the finalized diff | Fix it now, then re-run the relevant verification. |
| **Investigate** | Plausible issue but missing evidence, unclear cause, or environment-dependent behavior | Surface as non-blocking unless the unknown itself creates unacceptable risk. State the first concrete check. |
| **Plan** | Systemic architecture, migration, cross-module, or policy work that exceeds temper scope | Do not refactor broadly in `temper`; report as follow-up or `NEEDS REVISION` if it blocks the current change. |
| **Decide** | Product, domain, security, release, or policy trade-off needing human judgment | Surface the decision point. Do not invent policy. |

Decision flow:

1. Is the issue a verified localized defect in changed code? If yes, `Fix`.
2. Does it require broad architecture or policy change beyond the diff? If
   yes, `Plan`.
3. Does it depend on product intent, domain policy, compliance posture,
   rollout tolerance, or team preference? If yes, `Decide`.
4. Is the diagnosis plausible but not proven? If yes, `Investigate`.

## Status values

- `candidate`: found by a lane, not yet challenged
- `blocking`: survives trigger-test verification and should affect the verdict
- `non-blocking`: real but not verdict-changing
- `deferred`: real follow-up, intentionally not solved inside `temper`
- `contested`: important disagreement or uncertainty remains after challenge
- `fixed`: resolved during the temper run
- `dropped`: failed verification or duplicate of a stronger finding

## Findings as data

The consolidated `Finding Set` is persisted as canonical JSON under the
repo-local `.forge/` state dir. Each finding carries a stable `id`, a
`shortSummary` capped at 60 characters, its `failureScenario`, and one
`locations` entry per occurrence so N-file patterns stay countable. Phases 6,
7, and 8 read that artifact instead of re-typing the list.

Every finding fixed inside `temper` is accounted for in an outcomes ledger:
each id gets exactly one of `fixed`, `skipped` (with reason), or
`no_change_needed`. A ledger that does not cover every finding id is
incomplete — a fixer that silently shortens the list has failed verification.

## Label every surviving finding

Attach these labels to every finding that reaches the report or verdict:

- **Severity**: Critical / High / Medium / Low, calibrated by impact.
- **Confidence**: High / Medium / Low, your certainty that it is real after
  challenge.
- **Reachability**: external / authenticated / internal / unreachable for
  input-driven issues.
- **Action**: Fix / Investigate / Plan / Decide.
- **Trigger or evidence**: the concrete input, path, spec line, command
  output, or missing evidence.

Low-confidence items may still be surfaced, but they should not block on their
own.

## Learning notes

Add a learning note for findings, fixes, positive `Design Quality Notes`, and
rejected recommendations that would help the user become a better developer.
Keep it short and tied to this diff; do not turn the report into a tutorial.

A useful learning note answers:

- **Principle:** the review lens in play, such as project fit, information
  hiding, deep interfaces, change amplification, reuse before reinvention,
  rendering/performance patterns, or test quality.
- **Mechanism:** how the choice changes knowledge hiding, interface depth,
  coupling, locality, change amplification, cognitive load, or unknown unknowns.
- **Why it matters:** the concrete complexity, correctness, maintenance, or
  product risk this principle reduces here.
- **Trade-off / drawback:** what the recommendation costs or could make worse.
- **When not to apply:** the situation where this advice would become cargo
  culting.
- **Alternative:** the next-best option if the recommended change is not worth
  its cost.

Use source lenses as context, not authority. It is fine to cite Patterns.dev,
language/framework guidance, project conventions, or ideas from John
Ousterhout's *A Philosophy of Software Design*, but the note must still explain
why the advice fits this codebase and this diff.

## Sharded verification

After dedup, verify findings in sharded batches of at most 8 per verifier, all
launched together. A verifier may reject a blocking finding only by quoting
the code that contradicts it, proving the claimed state impossible from a
type, constant, or invariant, citing the in-diff guard that covers the
trigger, or matching a defined exclusion. Anything less certain is downgraded
in confidence rather than deleted — a silently rejected blocker is invisible to every later stage, while a downgraded one still reaches a human. Too speculative is never a valid rejection ground.

## Reverse audit

After verification, run gap-hunters with the cumulative finding list, asking
only what was missed. New candidates go through sharded verification like any
other. Stop after 2 consecutive dry rounds; caps are 10 rounds for a small
diff, 5 for a chunked diff, and 3 for a huge diff with a deadline. A stop at
the cap is reported as capped, never as converged.

## Challenger behavior

The challenger is selective and runs after the reverse audit:

- run it by default for red-lane diffs
- run it for high-impact low-confidence findings
- run it when lanes disagree materially

Its job is to disprove weak blockers and surface missed high-impact defects,
not to create a second wall of findings.

## Decision packet

Phase 7 produces a `Decision Packet`, the internal verdict bundle that justifies
the final outcome. It is not a second user-facing report contract; Phase 8
projects from it.

Inputs:

- evidence-pack summary
- surviving findings
- design-quality notes with `report`, `finding`, or meaningful `defer`
- verification-ledger summary
- residual unknowns
- project-fit and spec-fit judgment

Outputs:

- verdict: `READY TO SHIP` | `NEEDS REVISION` | `BLOCKED`
- short verdict rationale
- evidence summary
- blocking findings
- non-blocking / deferred findings
- report-facing design strengths and design-risk notes
- verification coverage summary
- residual risk and unknowns
- learning notes for the most instructive findings or non-findings
- recommended next step

When relevant, note provenance such as:

- risk lane
- whether challenger ran
- whether audit independence was structural or instructional
- which major lanes were skipped or unavailable

## Reporting-term mapping

Map the internal statuses into final-report terms like this:

- `fixed` stays `fixed`
- `deferred` stays `deferred`
- `blocking`, `non-blocking`, and `contested` remain `unresolved` until they
  are fixed, deferred, or dropped
- surviving findings whose recommended action is `Decide` surface as
  `needs user decision`
- `candidate` is working state only and should not appear in the final report
  unless the review stopped before validation
- `dropped` is omitted from the final report unless the audit trail matters

## Quick checklist

- [ ] Blocking items survived the trigger test.
- [ ] Every surviving finding has severity, confidence, action, trigger or
      evidence, and status.
- [ ] Speculative issues are marked `Investigate`, not inflated to blockers.
- [ ] Systemic issues are not solved by broad surprise refactors during
      `temper`.
- [ ] Human trade-offs are surfaced as `Decide`, not guessed.
- [ ] The `Decision Packet` reflects verified findings and actual coverage, not
      optimistic narration.
