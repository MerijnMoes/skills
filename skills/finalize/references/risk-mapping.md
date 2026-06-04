# Risk mapping

Used in `/finalize` Phase 0 and then carried into Phases 4, 6, and 7. Before
you start polishing or reviewing, build a small map of **what kind of change
this is** and **how it can fail**. Different changes need different scrutiny.

Its job is to answer **"where is the risk?"** It does **not** need to choose
every probe, prove the behavior, or decide the verdict. Those belong to
`bug-hunting.md`, `verify.md`, and `validation-gate.md` respectively.

The goal is not paperwork. The goal is to avoid two bad habits:

- treating every diff like a generic checklist exercise;
- spending equal energy on low-risk and high-risk surfaces.

This reference is a **router, not a taxonomy of all software**. The archetypes,
examples, and probes below are deliberately broad starting points. If the diff
has a domain-specific risk that is not named here, add it. Do not force a change
into the closest canned category if that hides the real failure modes.

## Core rule

Build the map from the **diff's actual semantics**, not from this document's
headings. Ask:

- what can this change newly break?
- what invariants does this product/domain care about?
- what side effects or safety properties matter here even if they are unusual?

If the best risk label is "pricing-rule correctness", "compiler pass
soundness", "search ranking drift", "document rendering fidelity", "billing
cutoff semantics", or something else not listed below, use that label. The map
is allowed to be domain-specific.

## 1. Classify the change

Mark the archetypes that apply:

- **UI / UX** — pages, components, forms, navigation, accessibility, client state.
- **API / contract** — request/response shapes, handlers, webhooks, public methods.
- **Auth / privacy / tenant boundary** — login, session, roles, permissions, data visibility.
- **Persistence / state** — DB writes, files, caches, queues, search indexes, derived state.
- **Schema / migration / rollout** — migrations, backfills, data-shape compatibility, deployment order.
- **Async / jobs / events** — workers, cron, retry loops, event handlers, message consumers.
- **External integration** — third-party APIs, storage, email, payment, webhooks, SDKs.
- **Config / feature flags / deployment** — env vars, toggles, release behavior, defaults.
- **Performance-sensitive path** — hot loops, queries, rendering hotspots, expensive I/O.
- **Domain-specific lane(s)** — anything central to this repo that deserves its
  own risk treatment and does not fit neatly above.

Many diffs hit more than one archetype. That's normal.

If none of these labels are quite right, create a better one. The value is in
making the risk legible, not in sticking to a fixed list.

## 2. Name the invariants

Ask: if this change is correct, what must remain true?

Examples:

- unauthorized users never see other users' data;
- a retry does not double-apply the side effect;
- creating then reloading preserves the saved state;
- old and new data shapes both work during rollout;
- totals, balances, quotas, counters, ordering, or versions remain correct.

Prefer 2-5 strong invariants over a long vague list.

At least one invariant should usually be **domain-level**, not just technical.
Examples: "invoice totals match contract rules", "rendered export preserves page
breaks", "ranking never returns filtered-out items", "compiler transform does
not change meaning", "sync does not resurrect deleted records."

## 3. List side effects and boundaries

Capture the important edges:

- **State writes** — DB rows, files, caches, search index, analytics events.
- **External effects** — HTTP calls, emails, payments, webhooks, jobs scheduled.
- **Trust boundaries** — user input, uploaded files, external payloads, tenant/account switches.
- **Operational boundaries** — feature flags, env vars, deploy order, restart/retry behavior.

This is where many bugs hide: at module boundaries, not inside a single pure function.

## 4. Pick the top failure modes

Choose the **2-5 highest-value risks**. Phrase them as concrete bug hypotheses,
not categories.

Good:

- duplicate submit could create two orders because the handler is not idempotent;
- old rows without `foo_status` may crash the new serializer after deploy;
- cache invalidation may leave the UI showing stale permissions after role change.

Bad:

- maybe a race condition somewhere;
- security should be checked;
- there could be edge cases.

## 5. Let the map drive the later phases

Use the risk map to decide:

- which conditional audit lanes matter in Phase 4;
- which bug hypotheses deserve probing in `bug-hunting.md`;
- which focused tests/probes must actually be executed in Phase 6;
- what residual risk still matters in Phase 7.

The map should make the pass **narrower and smarter**, not broader and noisier.

If the later phases are just replaying the canned archetype bullets without
touching the diff's actual product/domain risk, the map was too generic and must
be rewritten.

## Worked mini-maps

Use these as pattern examples, not templates to copy blindly.

### Example: API + DB write

- **Archetypes** — API / contract, persistence / state, maybe auth.
- **Invariants** — valid requests create exactly one correct record; invalid
  requests create none; response shape matches contract.
- **Boundaries/side effects** — request parsing, auth middleware, DB write,
  cache invalidation, emitted event.
- **Top failure modes**
  - duplicate delivery or retry creates two rows;
  - old clients omit a field the new handler accidentally treats as required;
  - write succeeds but cache/read model stays stale.

### Example: UI + auth/roles

- **Archetypes** — UI / UX, auth / privacy / tenant boundary.
- **Invariants** — allowed users can complete the flow; forbidden users cannot
  see or mutate protected data; UI state reflects permission changes correctly.
- **Boundaries/side effects** — browser/server contract, session state, role
  checks, navigation, optimistic client state.
- **Top failure modes**
  - UI hides an action but backend still allows it;
  - stale client state shows data from a previous tenant/account;
  - refresh/back navigation restores an unauthorized view.

### Example: schema / migration / rollout

- **Archetypes** — schema / migration / rollout, persistence / state, config /
  deployment.
- **Invariants** — old and new code tolerate the deployed data shape during the
  rollout window; migration does not corrupt or silently drop data.
- **Boundaries/side effects** — DB schema, backfill job, serializer/deserializer,
  feature flag, deploy order.
- **Top failure modes**
  - old rows without the new field crash the reader after deploy;
  - partial backfill leaves mixed-shape data that the app mishandles;
  - rollback is unsafe because the migration is one-way in practice.

### Example: async job / webhook consumer

- **Archetypes** — async / jobs / events, external integration, persistence /
  state.
- **Invariants** — the job is safe on retry; duplicate or out-of-order delivery
  does not corrupt state; failures are observable.
- **Boundaries/side effects** — queue or webhook payload, dedupe key, DB write,
  outbound side effect, retry policy.
- **Top failure modes**
  - duplicate delivery double-applies the side effect;
  - poison payload loops forever or disappears silently;
  - transient upstream failure leaves half-applied state.

## Heuristics by archetype

- **UI / UX** — verify keyboard/accessibility, validation, loading/error states, refresh/navigation, stale state after mutation.
- **API / contract** — verify malformed input, missing fields, auth failures, backward compatibility, response shape promises.
- **Auth / privacy** — verify under-privileged, expired, cross-tenant, and wrong-resource paths explicitly.
- **Persistence / state** — verify create/update/delete round-trips, partial failure behavior, cache invalidation, and derived-state sync.
- **Schema / migration / rollout** — verify old/new shape tolerance, reversibility where relevant, and deploy ordering assumptions.
- **Async / jobs / events** — verify retries, duplicates, ordering assumptions, crash/restart tolerance, poison-message handling.
- **External integration** — verify timeout/error paths, retries, idempotency, rate limits, and schema drift assumptions.
- **Config / feature flags** — verify safe defaults, missing-config behavior, flag off/on behavior, and cleanup of stale paths.
- **Performance-sensitive** — verify the actual hotspot with measurement; don't guess.
- **Domain-specific lane** — define the invariant and the failure mode in the
  product's own terms first, then choose the cheapest probe that can falsify it.

## When to create a domain-specific lane

Create one whenever the repo's core risk is not well captured by generic app
archetypes. Common examples:

- compilers, interpreters, parsers, or build tools;
- ranking, recommendation, or search relevance logic;
- billing, pricing, tax, quota, or entitlement rules;
- rich text, document, media, or design/rendering fidelity;
- synchronization/replication/conflict-resolution behavior;
- workflow/state-machine semantics in product-heavy apps;
- scientific, geometric, financial, or scheduling algorithms;
- developer tooling where DX/ergonomics is part of correctness.

In those cases, generic lanes like "API" or "persistence" are still useful, but
they are not the main story.

## Anti-patterns

- Treating a high-risk auth/migration/integration diff like a generic code-style pass.
- Letting the example archetypes define the map instead of the diff.
- Writing ten low-value risks instead of three important ones.
- Naming categories instead of concrete failure modes.
- Forgetting deployment/rollout behavior for schema/config/flag changes.
- Forgetting the product/domain invariant because the technical layers were easier to see.
- Building the map and then never using it.

## Quick checklist

- [ ] Change archetypes identified.
- [ ] Domain-specific lane added when the generic ones are not enough.
- [ ] 2-5 core invariants named.
- [ ] At least one invariant reflects the product/domain semantics when relevant.
- [ ] Important state writes / side effects / trust boundaries listed.
- [ ] 2-5 concrete failure modes chosen.
- [ ] Later audit and verify work clearly follows from the map.
