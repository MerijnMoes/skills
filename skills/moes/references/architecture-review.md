# Architecture review

Phase 4 lane in `moes`. This lane improves the change's architecture without
rewriting it: it builds the **Architecture Map** overview and emits
mechanism-level findings. It is advisory — structural moves beyond localized
safe fixes leave `moes` as `Plan` / `Decide` / `Investigate`, never as silent
auto-fix.

## Architecture Map

Build one compact inventory of what the diff did to the system's shape:

- module and boundary inventory: which components changed, who owns what
- dependency edges touched: imports, calls, events, schema or data-shape changes
- layering check: feature logic leaking into general modules, policy depending
  on transport, framework, ORM, or vendor details
- knowledge duplication and change amplification: how many places the next
  likely variant must touch
- pattern-fit note per `design-quality.md`: mechanism-level only — what got
  deeper or shallower, locality up or down, coupling change, trade-off, when
  not to apply, simpler alternative

The Map is an overview for the human reviewer, not a second findings list.
Findings point into it; it never duplicates the `Finding Set`. Attach it to
the `Evidence Pack` and embed it in the final report overview.

## Lane rules

- Advisory power only. `Fix` action exclusively for localized, safe, verifiable
  findings that satisfy the Phase 4 auto-fix contract. All structural moves
  (extract, move, deepen an interface, split a module) are emitted as `Plan`,
  `Decide`, or `Investigate` with mechanism plus trade-off.
- No finding without mechanism: state what knowledge moved, what callers must
  now know, whether the interface became deeper or shallower, and whether
  cognitive load moved or was removed.
- Reuse the existing `design-quality.md` Pattern Fit lens for pattern
  recommendations. Reject pattern shopping, label-only advice, and broad
  rewrites during hardening.
- Call `architecture-docs-review.md` as the docs-staleness checklist: stale
  public-API or boundary docs escalate to Phase 5; a required new ADR,
  architecture doc, or component doc is a `Plan` finding naming the target doc
  and the boundary or decision gap.

## Output

Emit normalized `Finding Set` entries per `findings-lifecycle.md`, plus the
Architecture Map attached to the `Evidence Pack`. If the lane is not registered (`N/A` in the specialty lane registry), there is no Map and the final report omits the Map embed. If the lane concludes no escalation and no findings, keep that as specialty-lane registry metadata only; do not emit a placeholder finding.
