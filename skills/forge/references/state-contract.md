# Forge state contract

Forge keeps current-run state in `.forge/state.json` in the target application
repo. This file is a small resume and evidence index, not a project-management
database.

## Operating rules

- Create `.forge/` only when a run needs pause/resume, written spec/plan
  tracking, QA evidence, or a non-trivial final report.
- Keep `.forge/` gitignored by default unless the user explicitly wants to
  commit run evidence.
- Update `.forge/state.json` after every phase transition, pause point,
  visual-plan decision, QA verification result, and review verdict.
- Prefer atomic writes: write a complete temporary JSON file in `.forge/`, then
  move it into place. Never leave partial JSON behind.
- If a tool or host cannot write files safely, report the fields that would
  have changed and continue with chat-visible state.

## Required shape

```json
{
  "schema_version": 1,
  "run_id": "2026-06-12T09-30-00Z-account-settings",
  "request_summary": "Add account settings page with deletion flow",
  "current_phase": "qa",
  "classification": {
    "primary": "ui-or-flow",
    "rationale": "Touches a user-facing settings flow",
    "risk_overlays": ["high-risk"]
  },
  "project_knowledge": {
    "read": ["PRODUCT.md", "DESIGN.md"],
    "updated": [],
    "unchanged": ["CONTEXT.md"],
    "gaps": []
  },
  "spec": {
    "mode": "file",
    "path": "docs/forge/specs/2026-06-12-account-settings.md",
    "approval": "approved"
  },
  "plan": {
    "mode": "file",
    "path": ".forge/current-plan.md",
    "approval": "approved"
  },
  "visual_plan": {
    "offered": true,
    "status": "skipped",
    "artifact_path": null,
    "approval": "not-requested",
    "feedback_summary": null
  },
  "shaping": {
    "active": true,
    "artifacts": []
  },
  "checklists": {
    "current_phase": "implement",
    "phases": {
      "implement": { "entry": "done", "exit": "done" }
    }
  },
  "converge": {
    "status": "not-run",
    "coverage": [],
    "gaps": []
  },
  "qa": {
    "playwright": "required",
    "intent_path": ".forge/qa-intent.md",
    "authored_tests": ["tests/e2e/account-settings.spec.ts"],
    "verification_status": "passed",
    "watched_local_result": {
      "command": "npx playwright test tests/e2e/account-settings.spec.ts --headed",
      "status": "passed"
    },
    "ci_equivalent_result": {
      "command": "npx playwright test tests/e2e/account-settings.spec.ts",
      "status": "passed"
    },
    "capability_matrix_path": ".forge/qa-capability-matrix.md",
    "exploratory_findings": [],
    "evidence": []
  },
  "review": {
    "base": "main",
    "verdict": "ready",
    "blockers": [],
    "residual_risks": []
  },
  "blocker": null,
  "pause_required": false,
  "next_recommended_step": "report"
}
```

Use `null`, empty arrays, or `"not-started"` for unknown or future fields; do
not omit top-level keys once the file exists.

## Field rules

- `schema_version`: integer. Start at `1`; increment only for incompatible
  shape changes.
- `run_id`: stable id for this Forge run. Use timestamp plus a short slug.
- `current_phase`: one of `setup`, `discover`, `spec`, `plan`, `shape`,
  `visual-plan`, `implement`, `design-quality`, `qa`, `review`, `report`,
  `paused`, or `blocked`. During the migration, older subphase values such as
  `qa-intent`, `playwright-author`, `playwright-verify`,
  `playwright-explore`, `qa-capability-matrix`, and `temper` may be read from
  existing state and should resume to the equivalent public phase.
- `classification.primary`: one of `docs-only`, `backend-only`, `ui-or-flow`,
  or `mixed-feature`.
- `spec` and `plan`: record either a file path or compact inline summary via
  `mode: "file"` or `mode: "inline"`.
- `visual_plan.status`: one of `not-offered`, `offered`, `accepted`,
  `skipped`, or `blocked`. `visual_plan.artifact_path` is the visual plan
  artifact path when a local browser-openable plan was created.
- `qa.playwright`: one of `required`, `optional`, or `skipped`.
- `qa.verification_status`: one of `not-started`, `passed`, `failed`,
  `blocked`, `deferred`, or `not-configured`.
- `qa.watched_local_result`: watched local E2E result, including the headed/UI
  command and status when applicable.
- `qa.ci_equivalent_result`: CI-equivalent E2E result, including the headless
  command and status when applicable.
- `qa.evidence`: list commands, screenshots, traces, reports, logs, videos, or
  manual probes that support the final report.
- `checklists.current_phase`: the phase whose entry/exit checklist is currently
  tracked.
- `checklists.phases`: per-phase `{ "entry", "exit" }` recorded as `done` or
  `not-started` (`checklists.md`).
- `converge.status`: one of `not-run`, `converged`, `gaps-found`, or
  `not-applicable`.
- `converge.coverage`: list mapping each spec acceptance criterion and plan task
  to its implemented behavior and evidence, or `N/A` with a reason
  (`converge.md`).
- `converge.gaps`: uncovered criteria or tasks, the reason, and the earliest
  resume phase.
- `review.verdict`: review verdict, one of `not-run`, `ready`, `blocked`, or
  `needs-decision`.
- `review`: written by the `moes` skill when it runs the Review phase; read by reporting and resume. There is no separate mirror field.
- `blocker`: `null` when clear; otherwise include `phase`, `summary`, `needs`,
  and `earliest_resume_phase`.
- `next_recommended_step`: one short action the next Forge invocation should
  take.

## Resume behavior

At startup, after preflight and project-knowledge discovery:

1. If `.forge/state.json` exists, read it before asking questions.
2. If `blocker` is set, summarize the blocker and ask only for the missing
   decision or dependency.
3. If `pause_required` is true, resume at `current_phase` only after the
   relevant approval or judgment is clear.
4. If the recorded `spec.path`, `plan.path`, visual plan artifact path, authored
   tests, or QA artifacts no longer exist, mark the state stale and return to
   the earliest phase needed to rebuild trustworthy evidence.
5. If the user's new request conflicts with the saved run, ask whether to
   replace the run state or continue it.

## Final report evidence

The final report should be traceable to `.forge/state.json` when the file
exists. At minimum, report the spec path or inline spec summary, plan path or
inline plan summary, visual plan status and artifact path when applicable,
Playwright status, watched local E2E result, CI-equivalent E2E result, QA
capability matrix status, review verdict, blockers or residual risks, and
`next_recommended_step`.
