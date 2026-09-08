# Parallel Review Fan-out + Architecture Lane + Full Verification

## Goal

Make `/forge:review` (temper Phase 4) run its audit as a parallel fan-out of
focused lanes, add a real architecture-improving lane that keeps a clear
overview for reviewers, and adopt full verification mechanics (sharded verify +
reverse audit + findings-as-data). Expected result: faster, more complete
reviews that stay safe inside temper's improve → audit → verify → gate order.

Decisions already taken with the user: full fan-out scope, architecture lane =
Map + advisory (no auto-rewrite), verification = all mechanics.

## Non-goals

- No change to Phase 1–3 sequencing. Best-practices → simplify → refactor stay
  sequential and test-gated; they mutate code and cannot parallelize.
- No change to the public command surface (`/forge:review`, `against <branch>`).
  Effort tiers are an internal depth control, not new commands.
- No auto-rewrite of architecture. Structural moves beyond localized safe fixes
  stay `Plan` / `Decide` / `Investigate`, never silent auto-fix.
- No new git writes. The never-commit rule stands.

## Current gap

Phase 4 declares "run the lane work in parallel where possible (dispatch
parallel subagents)" but in practice only code-review and security-review run
fresh-context; the dozen conditional lanes (migration, config, observability,
error-handling, static-intelligence, accessibility, browser-QA, QA-evidence,
appstore, docker/deployment, post-deploy) run inline and sequentially. There is
no procedural split inside correctness (one lens walks everything), no quality
split (one lens holds reuse + altitude + consistency), no personas, no
diff-specialized finders, no territory sharding for large diffs, single-pass
challenger instead of sharded verify + reverse audit, and findings live as prose
rather than data. `architecture-docs-review.md` only asks "did docs go stale?"
— it never produces an overview or an improvement proposal.

## Design

### 1. Phase 4 fan-out (read-only, fresh-context, depth 1)

The coordinator builds one shared context packet once (diff + Evidence Pack
slices: risk map, project context capsule, pinned intent, runtime sketch,
hotspots) and dispatches one wave. Every worker follows
`worker-templates/review.md`: read-only, no nested spawn, returns normalized
candidate findings + a `Covered:` receipt naming what it read.

Lane groups (each maps to an existing reference so no guidance is lost):

- **C1 line-walk** (`code-review.md` + `common-bugs-checklist.md`): every hunk +
  enclosing function. Conditions, off-by-one, missing await, edges, races.
- **C2 removed-behavior** (`code-review.md`): every deleted/replaced line names
  the invariant it enforced and where the new code re-establishes it, including
  removed exports whose replacement may live in another file.
- **C3 cross-file tracer** (`code-review.md`): callers of every changed symbol
  (consumer direction), read-sites of every added field (producer direction),
  same-PR callee changes.
- **C4 language-pitfall** (new slice, no new dependency): checklist
  pattern-match for the diff's language (== coercion, falsy traps, loop capture,
  mutable defaults, nil-map writes, SQL concat, DST arithmetic).
- **Q1 reuse** (`codebase-fit.md`): existing helper to call instead, dead code
  left behind, duplicate logic.
- **Q2 altitude** (`design-quality.md` + `refactoring.md` diff-scoped lane):
  bandaid on shared infra vs right depth, downstream compensation for upstream
  bug, single-use abstraction.
- **Q3 consistency** (`codebase-fit.md` + `universal-quality.md`): sibling-family
  guards, convention drift with cited local example, misleading names/comments,
  needless complexity.
- **S security** (`security-review.md` + `security-cheat-sheets.md` router):
  owns threat-model, infra, GHA exploit-path, and security-requirements routes.
  Findings normalized under the security lane, as today.
- **P performance** (`performance-specialty-router.md`): N+1, leaks, re-renders,
  bundle; cold path = N/A with a line of reasoning.
- **T test-coverage** (`testing.md`): untested paths/branches in the diff, weak
  assertions, brittle/mocked tests as findings.
- **U personas** (new, 3 parallel): attacker / 3am-oncall / maintainer.
  Cross-dimensional catch-net; each emits at most a few high-value candidates.
- **A architecture** (new lane, Section 2 below).
- **D specialized finders** (0–2, synthesized per review): spawned only when the
  risk map shows a concentrated domain with known failure modes (retry/backoff,
  schedulers, module loaders, codecs, migration idempotency). Prompt is written
  from the risk map, not from a static file.
- **B build & test probe** (shell only): runs formatter/lint/typecheck/tests.
  If a probe must mutate code (mutants, repro edits), it runs in a throwaway
  worktree/scratch dir so readers never see a dirty tree.

Conditional lanes stay conditional: dependency-audit (manifests changed),
migration-safety, docker/deployment, observability, configuration,
error-handling, accessibility, browser-QA, QA-evidence, appstore,
post-deploy-monitoring register `run` / `N/A` / `deferred by environment` in
the specialty lane registry exactly as today. When `run`, they join the same
wave with the same context packet instead of running sequentially after.

Failure handling follows `delegation.md`: worker timeout/fail → run that lane
inline as an adversarial pass → record degraded coverage. Never block the
pipeline on a missing worker. Every lane without a `Covered:` receipt is
re-run or marked honestly as unexercised in the Verification Ledger.

Large-diff rule: if `>500 source lines OR >3200 total diff lines`, switch C and
Q groups to territory agents (~400 lines each, split on hunk boundaries, never
inside a function — split at top-level declaration instead), each applying all
C+Q dimensions to its territory only. Whole-diff lanes (S, A, U, D, C2
cross-chunk half, C3) keep whole-diff scope. Heavily rewritten source files
(300+ lines and 40%+ new, or 800+ changed lines; never tests/generated) get 3
whole-file invariant agents (state/timers, counters/returns/errors,
config/early-returns). Source lines — not raw diff lines — drive the gate so
large test payloads don't needlessly shard production review.

### 2. Architecture lane (Map + advisory)

New reference `architecture-review.md` (lane) plus a new Evidence Pack section
`Architecture Map`. The Map is the "clear overview" artifact: one page the
human reviewer can read without reconstructing the change from hunks.

Map contents (inventory, not prose):

- module/boundary inventory: which components changed, who owns what.
- dependency edges touched: imports, calls, events, schema/data-shape changes.
- layering check: feature logic leaking into general modules, policy depending
  on transport/framework/ORM/vendor details.
- knowledge duplication + change amplification: "the next likely variant
  touches N places."
- pattern-fit note (existing `design-quality.md` Pattern Fit lens):
  mechanism-level only — what got deeper/shallower, locality up/down, coupling
  change, tradeoff, when not to apply, simpler alternative.

Lane rules:

- Advisory power only. `Fix` action exclusively for localized, safe,
  verifiable findings satisfying the existing auto-fix contract. All structural
  moves (extract, move, deepen interface, split module) are emitted as `Plan` /
  `Decide` / `Investigate` with mechanism + tradeoff, carried to Phase 7 and
  reported in Phase 8. Never auto-rewritten during hardening.
- Stale ADR/boundary/public-API doc detection stays and escalates to Phase 5 as
  today (`architecture-docs-review.md` behavior folded in, file kept as the
  docs-staleness checklist the lane calls).
- No finding without mechanism: what knowledge moved, what callers must now
  know, interface deeper or shallower, cognitive load moved or removed.
- Pattern shopping, label-only advice ("use Strategy", "clean architecture"),
  and broad rewrites are rejected per existing design-quality rules.

The Map is built by lane A, attached to the Evidence Pack, cited by finding
locations, and embedded in the final report overview section. Findings point
into it; it never duplicates the Finding Set.

### 3. Verification (full mechanics, forge paths)

- **Failure-scenario gate** (tightens `findings-lifecycle.md`): every candidate
  states trigger → wrong outcome (or concrete cost for quality findings).
  No scenario = dropped at source. Blocking needs a concrete reachable trigger;
  low-likelihood but real stays with calibrated severity/confidence.
- **Sharded verify**: after dedup, split surviving candidates into shards of ≤8
  and verify each shard in a fresh-context verifier. A verifier may reject a
  Critical only by quoting the contradicting code, proving impossibility from a
  type/constant/invariant, citing the in-diff guard, or matching a defined
  exclusion. Anything less certain is downgraded in confidence, never silently
  deleted. "Too speculative" is not a rejection ground.
- **Reverse audit**: after verification, run gap-hunters (one per chunk/territory,
  or one for small diffs) with the cumulative finding list, asking only "what
  did we miss?" New candidates go through sharded verify. Stop after 2
  consecutive dry rounds; caps 10 (small) / 5 (chunked) / 3 (huge ≥3000
  effective lines with a deadline). Report rounds run and whether the stop was
  convergence or cap.
- **Findings-as-data**: extend the Finding Set schema with `id` (stable),
  `shortSummary` (≤60ch), `failureScenario`, `locations[]` (one entry per
  occurrence so N-file patterns stay countable). Persist canonical JSON under
  the repo-local `.forge/` state dir (forge convention, not `.qwen/`). Phase 6,
  7, 8 read that artifact. Any auto-fix accounts every finding with
  `fixed` / `skipped` (reason) / `no_change_needed` — enforced coverage, so a
  fixer cannot silently shorten the list.
- **Challenger**: keep the selective challenger as a final red-lane /
  low-confidence-blocker / lane-disagreement pass after reverse audit, not as
  the only second look.
- **Effort tiers** (cost control): `low` = inline sweep only, unverified, no
  verdict (tiny green-lane diffs); `medium` = reduced fan-out (C1–C3, S, T, B +
  whole-diff A-lite) + single verify, no reverse audit; `high` = full fan-out +
  sharded verify + reverse audit. Default `high` for `/forge:review`; green
  lane may drop to medium with an explicit note. Tiers change depth, never the
  diff/base mechanics.

### 4. Data flow

```
Phase 0 → Evidence Pack (+ risk map, capsule, intent, sketch)
Phase 1–3 → polished diff (sequential, test-gated)
Phase 4 → context packet → parallel wave (C/Q/S/P/T/U/A/D/B)
        → dedup → sharded verify → reverse audit → Finding Set (JSON) + Arch Map
Phase 5 → docs/ADR updates from Finding Set + Map
Phase 6 → Verification Ledger (static + tests + behavioral probes + B results)
Phase 7 → Decision Packet (Finding Set + Map + Ledger + Design Quality Notes)
Phase 8 → report: overview (Map) → evidence → findings → residual risk
```

### 5. Error handling

- Worker fail/timeout → inline adversarial fallback → degraded-continue with
  honest coverage marking. Pipeline never hangs on a worker.
- Red baseline in Phase 0 → stop, as today. Secret-scan hit → hard stop.
- Verify rejection without constructible grounds → downgrade, not drop.
- Reverse-audit cap hit → report "capped", not "converged".
- Environment-blocked lanes (no browser, no deploys) → `deferred by
  environment`, carried as residual risk, never presented as verified.

### 6. Testing

- Contract tests on skill text: fan-out roster present, depth-1 rule, Covered
  receipt rule, failure-scenario requirement, sharded-verify rejection bar,
  reverse-audit stop rule, findings JSON schema, outcomes-ledger coverage,
  Architecture Map schema, advisory-only architecture rule, effort-tier
  definitions, large-diff territory rule.
- Dry-run `/forge:review` on a small, medium, and large diff; assert lane
  registry completeness, Finding Set validity (ids unique, every finding has
  scenario + locations), and report sections render from artifacts without
  re-typing.

## Files to change

- `references/temper/SKILL.md` Phase 4: fan-out roster, territory rule,
  sharded verify + reverse audit order, effort tiers.
- New `references/temper/references/architecture-review.md` (lane + Map
  schema); keep `architecture-docs-review.md` as the docs-staleness checklist
  it calls.
- `references/temper/references/findings-lifecycle.md`: failure-scenario gate,
  rejection bar, JSON schema (`id`, `shortSummary`, `failureScenario`,
  `locations[]`), outcomes ledger.
- `references/temper/references/evidence-pack.md`: Architecture Map section.
- `references/temper/references/verification-ledger.md`,
  `validation-gate.md`, `final-reporting.md`: ledger/audit-trail fields
  (verify shards, audit rounds, capped-vs-converged, Map embed).
- `references/delegation.md` + `worker-templates/review.md`: wave pattern,
  Covered receipt, probe-worktree rule.
- `references/temper/references/code-review.md`: C1–C4 procedural split +
  C4 checklist pointer.
- `references/temper/references/codebase-fit.md` /
  `universal-quality.md` / `design-quality.md`: Q1–Q3 ownership split so the
  three quality lanes don't overlap.
- Tests: contract tests asserting the above.

## Trade-offs

- More subagent calls per review (full fan-out + verify shards + audit rounds).
  Controlled by effort tiers + large-diff sharding + conditional lanes.
- More orchestration complexity in Phase 4. Paid back by shorter wall-clock
  time and fewer missed defects; coordinator logic stays in one place (SKILL.md
  Phase 4 + delegation).
- Architecture lane could tempt rewrites. Contained by advisory-only rule +
  auto-fix contract + Phase 6 re-verification of anything touched.
