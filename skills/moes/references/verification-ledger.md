# Verification ledger

Used in `moes` Phase 6. Every verification action must produce an explicit
record of what was exercised and what remained unproven.

## Record fields

- activity name
- command, flow, or probe that was run
- observed result
- risk or invariant exercised
- coverage type: `direct` | `indirect`
- status: `pass` | `fail` | `flaky` | `infra` | `not-run`
- attempt: `1` for initial run, `2`/`3` for retries, plus `prior` id when retrying
- notes on environment gaps or unexercised risks

## Status definitions

- `fail` = code defect with reproducible trigger quoted (command + input + wrong output). Only state that can carry a blocking finding.
- `flaky` = same code + same command gives both pass and fail with no code change. Never counts as `pass`. Quote both runs.
- `infra` = tool/env failure, not code (OOM, missing service, no display, timeout, rate limit). Quote the tool error. Never counts as `pass`.
- `pass-after-retry` is not a status — record as `pass` with `attempt: 2`/`3` plus a note on what was fixed. A `flaky` that eventually passes stays `flaky` with a note, not `pass`.

## Minimum coverage

The ledger must explicitly record:

- static gates
- full test suite
- targeted regressions or probes
- behavioral verification
- accessibility or performance checks when relevant
- every top risk from the risk map as either exercised or unexercised
- the audit trail: how many verify shards ran, how many reverse-audit rounds ran, and whether the audit stopped converged (2 consecutive dry rounds) or capped at the round limit
- surprise-pass target and outcome when the surprise rule fired

## Rule

If a risk was not exercised, write that plainly. Absence of evidence must never
read like positive evidence. `flaky` or `infra` is not evidence — only `pass` on
the same code state counts toward the gate.
