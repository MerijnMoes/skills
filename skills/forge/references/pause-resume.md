# Forge pause and resume

`forge` should rely on repo-local state rather than chat memory.

## Runtime folder

- use `.forge/` in the target application repo
- keep it gitignored by default
- store only current-run state, not long-lived history

## Required current-run fields

- current phase
- task classification
- spec path
- plan path
- whether shaping is active
- Playwright authored test paths
- Playwright verification status
- blocker or approval requirement
- next recommended step

## Pause points

- after spec approval
- after plan approval when scope changed
- before large Playwright generation when the flow target is ambiguous
- after QA when judgment is needed
- after `temper` when the verdict is not clean
