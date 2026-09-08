# False-Negative Counterweights Design

## Goal

Fix `moes` leniency on code quality and architecture without weakening its
false-positive discipline. Today's pipeline has many gates that can only
downgrade findings and none that push back toward flagging; architecture
findings additionally need prophecy (a proven future bug) to block, and the
architecture lane is advisory-only. The result is systematic under-flagging
where judgment is the job.

Decisions already taken with the user: all four counterweights approved,
including narrowing the earlier advisory-only architecture decision so that
mechanism-strong structural findings may block.

## Non-goals

- No weakening of the trigger test, sharded verification, or rejection bar
  for correctness and security findings.
- No pipeline reorder; all four changes plug into existing
  lifecycle/gate/report joints.
- No new artifacts beyond extending the Finding Set schema and the final
  report layout. Named schema additions: `belowBarReason` on residual
  risks (from the fixed reason taxonomy), `dismissedLedger[]` (title,
  reason, prior status, priority rank), and `steelmanOf` links from
  dropped Notes to the mechanism they failed to sustain.

## Design

### 1. Completeness check (base-rate surprise rule)

**Files:** `skills/moes/references/findings-lifecycle.md`,
`skills/moes/references/validation-gate.md`.

After consolidation, the run must name its 3 highest remaining risks even
when they sit below the blocking bar. These are recorded in the residual-risk
section (not as synthetic `non-blocking` findings), ordered by business
impact with action types preserved (`Investigate`-grade evidence and
`Decide`-grade trade-offs may satisfy the quota; the reason taxonomy is:
no reachable trigger, low confidence, `Investigate`-grade evidence, or
`Decide`-grade trade-off). Fewer than 3 is allowed only with an explicit
why-no-more-risks note. This check runs after the reverse audit and before
the Decision Packet, reusing the existing residual-risk and verification
coverage joints.

Zero findings on a yellow/red diff, or on any diff over 200 source lines
(counted with `git diff --numstat` on source files only, the same counting
as the large-diff rule; the lower threshold is deliberate because this is a
cheap second look, not a sharding decision), is surprising rather than
satisfying: the run must perform one more targeted pass, state what it
hunted (persisted in the Verification Ledger audit trail and the Decision
Packet residual unknowns), and only then claim a clean result. This mirrors
the trigger test in the opposite direction — skepticism toward "nothing
wrong" to match the existing skepticism toward "something wrong." The
`low` tier is explicitly exempt (a pre-screen with no Ledger, Packet, or
verdict, it cannot host this check); at `medium` the surprise pass doubles
as the gap-hunt (no reverse audit exists there); at `high` it follows the
converged or capped reverse audit. Skipping is allowed only for green-lane
diffs at or under 200 source lines with a converged audit, with a one-line
note — never by bare preference.

### 2. Visible dropped-findings ledger

**Files:** `skills/moes/references/findings-lifecycle.md`,
`skills/moes/references/final-reporting.md`.

`dropped` findings stop being invisible. The final report gains a capped
"Considered and dismissed" list (maximum 5 entries): title plus a one-line
reason each, ordered ex-blockers first, then by severity and confidence.
Only Finding Set members dropped after challenge or verification qualify —
scenario-less candidates dropped at the source and fixer `no_change_needed`
outcomes are excluded unless explicitly notable. The cap keeps the report
readable while giving the user calibration data — a valid concern that
keeps getting dismissed becomes visible as a leniency pattern instead of
disappearing. The internal `dropped` status is unchanged; only its report
projection changes. The canonical Phase 8 template in `skills/moes/SKILL.md`
gains the section (omitted when empty, like "What went right"), and the
lifecycle's "`dropped` is omitted" rule is amended to point at it. Schema:
`dismissedLedger[]` carrying title, reason, prior status, and priority
rank.

### 3. Red-team framing for quality lanes

**Files:** `skills/moes/references/design-quality.md`,
`skills/moes/references/architecture-review.md`,
`skills/moes/references/codebase-fit.md` (Q-ownership note).

Quality reviewers assume the change degrades the design and attempt to
prove it — operating strictly within diff scope and the existing
mechanism bar. The presumption changes effort, not the blocking standard:
no taste-hunting, no broad architecture audits, no scope expansion.
When the case cannot be sustained, they record the strongest version of
the critique they could not sustain and why it fails — one steelman per
unique mechanism, with cross-pointers instead of duplicates (extending the
Q-ownership rule), recorded as a Design Quality Note with disposition
`drop`, and projected into the dismissed ledger only when
mechanism-complete. Steelmans yield cap priority to ex-blocking dropped
items and never go through sharded verification (dropped by definition).
Steelman-then-drop replaces shrug-and-drop. The Undirected Audit personas
are unchanged; this alters the instruction the quality lanes run under,
not the roster.

### 4. Mechanism-strength blocking for architecture

**Files:** `skills/moes/references/architecture-review.md`,
`skills/moes/references/findings-lifecycle.md`,
`skills/moes/references/validation-gate.md`.

The advisory default stands, but a structural finding may carry a blocking
status when its mechanism evidence names all three of: **who is harmed**
(named concrete callers, or a named future variant with a concrete change
example — vague "maintainability" does not qualify), **blast radius
counted** (enumerated files or sites that must now change together;
estimates allowed only when marked as estimates), and **the cheaper
alternative** (the right depth or shape, with trade-off and
when-not-to-apply per the design-quality note contract). Canonical
qualifiers are boundary leaks, cross-module knowledge duplication, and
shallowed interfaces that burden callers — non-exhaustive examples that
still require the full triple. Formulation: `Fix` stays localized-only;
`Plan` / `Decide` / `Investigate` may carry status `blocking` if and only
if the triple is present (this amends the lane's "never blocking"
wording, the roster line, and the ownership note). The triple replaces
the reachable-trigger requirement for architecture findings but keeps the
rest of the lifecycle: the finding still carries `failureScenario` as its
concrete cost, plus severity, confidence, and action type. Verdict
calibration: surviving architectural blockers drive at most
`NEEDS REVISION` — `BLOCKED` stays reserved for data loss, security
breaches, and broken core flows. "Cannot prove a future bug" stops being
an automatic veto; mechanism strength decides.

Related small change: the challenger also executes the surprise pass. When
a yellow-or-higher diff reports zero design findings — meaning no Q/A
Finding Set entries and no `report`- or `finding`-disposition Design
Quality Notes (`defer`-only activity does not satisfy this) — the
mandatory extra targeted pass runs as a challenger-style adversarial
gap-hunt in fresh context, ordered after the reverse audit. (The
challenger's existing scope already includes surfacing missed high-impact
defects; this names the leniency execution explicitly rather than
pretending the challenger is disproof-only.) Gap-hunting remains the
reverse audit's job in the general case; the challenger does not gain a
standing second wall of findings.

## Files to change

- `skills/moes/references/findings-lifecycle.md`: completeness-check
  section, dismissed-list schema, mechanism-triple blocking criteria with
  the trigger-test carve-out, challenger leniency execution.
- `skills/moes/references/validation-gate.md`: required-step additions
  (top-3 sub-bar risks, surprise-rule pass, architectural blockers capped
  at `NEEDS REVISION`).
- `skills/moes/references/final-reporting.md`: "Considered and dismissed"
  section (capped at 5, omitted when empty, like "What went right").
- `skills/moes/references/design-quality.md`: red-team instruction plus
  steelman record rule.
- `skills/moes/references/architecture-review.md`: mechanism-triple
  definition, canonical qualifiers, advisory-default-with-exception rule.
- `skills/moes/references/codebase-fit.md`: one-line red-team pointer for
  Q1/Q3 (detail lives in `design-quality.md`).
- `skills/moes/SKILL.md`: challenger bullet gains the leniency execution,
  Phase 8 template gains the dismissed section, roster and ownership lines
  gain the advisory-default-with-blocking-exception wording.
- `tests/moes-contract.test.mjs`: assertions for the surprise rule, the
  dismissed-list schema, the steelman requirement, the mechanism triple,
  and the challenger trigger.

## Trade-offs

- More findings will surface, including more debatable ones; the capped
  dismissed list and the below-bar reasons are the release valves that
  keep noise bounded and inspectable.
- Mechanism-strength blocking reintroduces reviewer judgment at the
  gate; the triple (harmed parties, counted blast radius, cheaper
  alternative) is the objectivity anchor that keeps it from becoming
  taste-based veto.
- Slightly longer reviews on clean diffs (the extra targeted pass); priced
  by the existing effort tiers, and skippable only with an explicit note.
