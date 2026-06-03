# Migration safety

Phase 4 and Phase 6 support for `/finalize`, conditional. Apply when the diff changes schemas, migrations, data backfills, persistence formats, or rollout-sensitive data transforms.

## What to check

- **Reversibility** — the migration can be rolled back, or the irreversibility is explicit and justified.
- **Old/new compatibility** — old app code can tolerate the new schema during rollout, and new code can tolerate partially migrated data where required.
- **Lock and rewrite risk** — large table rewrites, blocking locks, or expensive index builds are understood and acceptable for the deployment context.
- **Backfill safety** — retry behavior, batching, partial progress, and idempotency are considered.
- **Data integrity** — precision, timezone, encoding, nullability, defaults, and enum/state transitions preserve meaning.
- **Operational plan** — sequencing is clear when the change needs multi-step rollout, flagging, or operator action.

## Concrete prompts

- What happens if deployment rolls forward app code before the backfill finishes?
- What happens if the migration stops halfway through?
- Can this run twice safely?
- Which existing rows, nulls, enum values, or malformed historical data break this path?

## Common blockers

- Destructive schema change with no compatibility or rollback story.
- Backfill/update script that is not safe to retry.
- New constraint/default silently corrupts or truncates existing data.

## Output

Fold findings into the Phase-4 punch list and re-check them in Phase 6 if any DB-changing code was exercised.
