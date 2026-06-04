# Focused bug hunting

Used in `/finalize` Phases 4, 6, and 7. The goal is to find **real bugs the
checklists may miss** without turning finalize into an open-ended research
project. Start from the actual diff and choose a **small number of
high-leverage probes**. This is a risk-led complement to `code-review.md`,
`testing.md`, and `validation-gate.md` — not a replacement for them.

## Core stance

- The checklist is necessary, but **not exhaustive**.
- Coverage is evidence, not proof.
- A bug hypothesis is useful only if you can turn it into a **reachable
  scenario**, an invariant, or a deterministic reproduction.
- Prefer the **smallest probe that can falsify your confidence**:
  unit/integration test, a focused harness, a repeated command, or a single
  browser flow.
- Do **not** install new dependencies or build a large new test framework inside
  `/finalize`.

## 1. Generate bug hypotheses from the diff

Look for the places where bugs usually hide:

- **Boundaries** — empty, max-size, malformed, duplicate, unicode, locale,
  timezone/DST, negative/zero, first/last item.
- **State transitions** — create/update/delete, pending -> success/failure,
  login/logout, draft/published, enabled/disabled.
- **Temporal behavior** — retries, timeouts, debounce, batching, cache expiry,
  cron/scheduler logic, "eventually consistent" reads.
- **Concurrency & reentrancy** — double-submit, duplicate webhook delivery,
  two workers racing, stale read-modify-write, repeated clicks.
- **Persistence & serialization** — round-trips, migrations, precision loss,
  missing defaults, backward compatibility with existing data.
- **Trust boundaries** — auth, tenant isolation, role changes, untrusted input,
  redirects, uploads, outbound requests.
- **Derived state** — cache invalidation, denormalized counters, search indexes,
  analytics events, read models, materialized views.
- **Integration seams** — third-party APIs, queues, jobs, DB transactions,
  filesystem, message brokers, browser/server contracts.

If the diff is trivial or purely documentary, say so and skip this reference
with a one-line note.

## 2. Write the invariant before the probe

Don't just ask "what input should I try?" Ask **what must never become false**.
Examples:

- an acknowledged write must still exist later;
- a retry must not double-apply the side effect;
- unauthorized users must never observe another tenant's data;
- offsets, counters, versions, or timestamps must stay monotonic where the
  design requires it;
- serialize -> parse -> serialize should preserve the intended value;
- totals, balances, quotas, and counts should conserve or change by the exact
  amount expected.

Good invariants turn vague suspicion into crisp tests and sharper reviews.

## 3. Pick the smallest high-value probe

Choose one or more, depending on the risk:

- **Table-driven edge sweep** — enumerate boundary and invalid inputs in a
  focused unit/integration test.
- **Regression test** — if a bug was fixed or suspected, encode the exact
  reproducer so it stays dead.
- **Model/oracle comparison** — compare a complex path against a simpler trusted
  implementation, fixture, or hand-worked expectation.
- **Metamorphic/property-style probe** — assert a relation across many inputs
  without needing a special framework; e.g. round-trip, monotonicity,
  idempotency, commutativity where appropriate.
- **Repeat/replay probe** — run the same scenario many times, or with fixed
  seeds/fixtures, to shake out timing/order bugs while keeping failures
  reproducible.
- **Restart/retry/failure probe** — rerun across reconnects, page reloads,
  process restarts, temporary network loss, or dependency errors if the project
  already has harnesses/fakes to do so.
- **Focused browser flow** — for web/UI changes, exercise the highest-value user
  journey and one meaningful negative path.

The aim is not "more tests." The aim is **the right test for the specific risk**.

## 4. Make the probe deterministic

The most valuable bug-finding setups turn weird failures into replayable ones.
You can borrow that discipline even in an ordinary `/finalize` run:

- freeze or inject the clock when the project already supports it;
- seed randomness and record the seed;
- use fixed fixtures and explicit waits, never `sleep`-and-hope;
- keep the command/path to reproduce the failure short and exact;
- when a scenario is timing-sensitive, reduce moving parts until the bug is
  still present but easier to replay.

When you find a bug, capture the **minimal reproducer** first; only then widen
the fix.

## 5. Playwright guidance

If **Playwright is already configured in the repo or otherwise already
available**, it is often the best probe for UI/system flows:

- cover the highest-value journey end-to-end, not the whole product;
- add at least one negative or regression path when the diff touches auth,
  validation, navigation, async loading, or persistence;
- assert on semantics and user-visible outcomes, not incidental DOM trivia;
- prefer stable selectors/roles over brittle CSS chains;
- use Playwright's waiting model, tracing, network controls, and storage state
  only if they are already part of the project's setup.

Do not add Playwright to a repo that doesn't already use it just because the
skill mentions it.

## 6. Deterministic bug-finding habits

You probably won't have deterministic simulation tooling in an ordinary
`/finalize` run. You can still borrow the parts that matter:

- **Control what you can** — time, randomness, fixtures, dependency responses.
- **Assert continuously** — bake invariants into tests/harnesses instead of
  checking only at the end.
- **Probe weird states on purpose** — retries during partial success, stale
  cache after mutation, duplicate delivery, process restart, offline/online,
  expired auth, mixed old/new data shapes.
- **Favor replayability over breadth** — one bug you can deterministically
  reproduce and keep dead beats ten flaky "stress tests."
- **Measure test yield** — if a large test explores nothing new, improve the
  workload or assertions instead of just running it longer.

For distributed, async, or stateful systems, these habits often find bugs that
plain happy-path tests and checklist reviews miss.

## 7. Turn discoveries into durable safety

When you find a real bug:

1. capture the trigger precisely;
2. minimize it to the smallest useful reproducer;
3. add or improve a regression test when that is practical in-repo;
4. only then fix the production code;
5. rerun the focused probe and the broader suite.

If you cannot add a durable regression in this pass, call that out explicitly in
the final report as residual risk.
