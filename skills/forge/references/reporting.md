# Forge reporting

The final report should summarize the run as one workflow, not as unrelated
tool outputs.

When `.forge/state.json` exists, use `state-contract.md` as the evidence index
for the final report. Do not rely only on chat memory for paths, QA status, or
the `/forge:review` verdict stored in internal state.

## Required sections

- request summary
- phase outcome summary
- spec path or inline spec summary
- plan path or inline plan summary
- changed deliverables
- QA intent draft summary when the run included QA authoring: accepted,
  revised, or agent-selected
- Playwright/API coverage created or updated when applicable
- QA capability matrix when applicable: `run`, `N/A`, `not configured`, and
  `deferred` states
- QA evidence gathered when applicable: commands, screenshots, traces, videos,
  reports, or logs
- watched local E2E result when applicable
- CI-equivalent E2E result when applicable
- exploratory QA findings when applicable
- local/free QA note when relevant: no paid provider was required
- project knowledge files read, updated, or intentionally left unchanged
- contradictions, stale docs, or missing docs that affected confidence
- review verdict or blockers
- next recommended step from `.forge/state.json` when available

Use `/forge:review` in public reports. Treat legacy `temper verdict` and state
language as internal migration terminology only.

## Tone

- be explicit about what was verified
- call out blocked or skipped checks honestly
- keep the summary concise and decision-oriented
