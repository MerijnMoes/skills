# Verification ledger

Used in `temper` Phase 6. Every verification action must produce an explicit
record of what was exercised and what remained unproven.

## Record fields

- activity name
- command, flow, or probe that was run
- observed result
- risk or invariant exercised
- coverage type: `direct` | `indirect`
- status: `pass` | `fail` | `not-run`
- notes on environment gaps or unexercised risks

## Minimum coverage

The ledger must explicitly record:

- static gates
- full test suite
- targeted regressions or probes
- behavioral verification
- accessibility or performance checks when relevant
- every top risk from the risk map as either exercised or unexercised
- the audit trail: how many verify shards ran, how many reverse-audit rounds ran, and whether the audit stopped converged (2 consecutive dry rounds) or capped at the round limit

## Rule

If a risk was not exercised, write that plainly. Absence of evidence must never
read like positive evidence.
