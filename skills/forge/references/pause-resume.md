# Forge pause and resume

`forge` should rely on repo-local state rather than chat memory.

Use `state-contract.md` as the canonical `.forge/state.json` schema and update
rules. This file explains when to pause and resume; the contract defines what
must be recorded.

## Runtime folder

- use `.forge/` in the target application repo
- keep it gitignored by default
- store only current-run state, not long-lived history

## Required current-run fields

- schema version
- run id
- current phase
- request summary
- task classification
- classification rationale
- risk overlays
- spec path
- plan path
- whether shaping is active
- whether Playwright is `required`, `optional`, or `skipped`
- Playwright authored test paths
- Playwright verification status
- QA capability matrix path
- QA evidence
- `temper` base, verdict, blockers, and residual risks
- whether extra pause points are expected
- blocker or approval requirement
- next recommended step

## Resume startup

When `.forge/state.json` exists, read it immediately after preflight and
project-knowledge discovery. Resume from `next_recommended_step` unless the
user asks for a different lane, the saved state is stale, or the saved run
conflicts with the new request.

Treat missing spec, plan, authored test, or QA artifact paths as stale state.
Route back to the earliest phase that can recreate trustworthy evidence.

## Pause points

- after spec approval
- after plan approval when scope changed
- before large Playwright generation when Playwright is in scope and the flow
  target is ambiguous
- after QA when judgment is needed
- after `temper` when the verdict is not clean
