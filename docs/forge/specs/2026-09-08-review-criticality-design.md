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
  report layout.

## Design

### 1. Completeness check (base-rate surprise rule)

**Files:** `skills/moes/references/findings-lifecycle.md`,
`skills/moes/references/validation-gate.md`.

After consolidation, the run must name its 3 highest remaining risks even
when they sit below the blocking bar, recorded as non-blocking with an
explicit "below bar because X" reason. Zero findings on a yellow/red diff,
or on any diff over roughly 200 lines, is surprising rather than
satisfying: the run must perform one more targeted pass, state what it
hunted, and only then claim a clean result. This mirrors the trigger test
in the opposite direction — skepticism toward "nothing wrong" to match the
existing skepticism toward "something wrong."

### 2. Visible dropped-findings ledger

**Files:** `skills/moes/references/findings-lifecycle.md`,
`skills/moes/references/final-reporting.md`.

`dropped` findings stop being invisible. The final report gains a capped
"Considered and dismissed" list (maximum 5 entries): title plus a one-line
reason each. The cap keeps the report readable while giving the user
calibration data — a valid concern that keeps getting dismissed becomes
visible as a leniency pattern instead of disappearing. The internal
`dropped` status is unchanged; only its report projection changes.

### 3. Red-team framing for quality lanes

**Files:** `skills/moes/references/design-quality.md`,
`skills/moes/references/architecture-review.md`,
`skills/moes/references/codebase-fit.md` (Q-ownership note).

Quality reviewers assume the change degrades the design and attempt to
prove it. When the case cannot be sustained, they record the strongest
version of the critique they could not sustain and why it fails — which
flows into the dropped-findings ledger (counterweight 2) instead of
evaporating. Steelman-then-drop replaces shrug-and-drop. The Undirected
Audit personas are unchanged; this alters the instruction the quality
lanes run under, not the roster.

### 4. Mechanism-strength blocking for architecture

**Files:** `skills/moes/references/architecture-review.md`,
`skills/moes/references/findings-lifecycle.md`,
`skills/moes/references/validation-gate.md`.

The advisory default stands, but a structural finding may carry a blocking
status when its mechanism evidence names all three of: **who is harmed**
(affected callers, future variants), **blast radius counted** (sites or
files that must now change together), and **the cheaper alternative**
(the right depth or shape). Canonical qualifiers are boundary leaks,
cross-module knowledge duplication, and shallowed interfaces that burden
callers. The validation gate treats surviving architectural blockers like
any other blocker. "Cannot prove a future bug" stops being an automatic
veto; mechanism strength decides.

Related small change: the challenger also runs when a yellow-or-higher
diff reports zero design findings (leniency check), alongside the existing
red-lane default. Challenger scope stays disproof-only; gap-hunting
remains the reverse audit's job.

## Files to change

- `skills/moes/references/findings-lifecycle.md`: completeness-check
  section, dismissed-list schema, mechanism-triple blocking criteria,
  challenger leniency trigger.
- `skills/moes/references/validation-gate.md`: required-step additions
  (top-3 sub-bar risks, surprise-rule pass, architectural blockers
  verdict-weight).
- `skills/moes/references/final-reporting.md`: "Considered and dismissed"
  section (capped at 5, omitted when empty, like "What went right").
- `skills/moes/references/design-quality.md`: red-team instruction plus
  steelman record rule.
- `skills/moes/references/architecture-review.md`: mechanism-triple
  definition, canonical qualifiers, advisory-default-with-exception rule.
- `skills/moes/references/codebase-fit.md`: one-line red-team pointer for
  Q1/Q3 (detail lives in `design-quality.md`).
- `skills/moes/SKILL.md`: challenger bullet gains the leniency trigger.
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
