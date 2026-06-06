# Behavioral verification

Prove the change actually works by **running it**, not just by reading it or trusting a green test suite. Type-checks and tests show code correctness; this step shows *feature* correctness. Run by the main agent (it holds the change's intent and can drive the app).

Build the verification plan from the Phase-0 risk map and project context
capsule. Do not just "poke around" randomly: choose probes that attack the
highest-value failure modes and the project/domain invariants that matter for
this repo.

Its job is to answer **"what did we actually run, and what did we actually
observe?"** It should execute the highest-value probes suggested by
`risk-mapping.md`, `project-context.md`, and `bug-hunting.md`, not reopen broad
ideation or verdict debate.

## Verification posture

- Match the verification method to the risk shape: static analysis for some
  structural/data-flow issues, targeted tests for logic and regressions,
  runtime probes for stateful behavior, and adversarial review for
  exploitability/security claims.
- On high-risk changes, do not let one green evidence source substitute for the
  others. A passing suite, a clean linter run, or a green static lane can each
  be meaningful without being sufficient alone.
- Record what was directly observed, what is only indirectly supported by
  evidence, and what the environment prevented you from running.

## Procedure

1. **Static gates** — run the project's formatter, linter and type-checker (detected in Phase 0). These are cheap and catch more than a human read.
2. **Test suite** — run the full suite; it must pass. Confirm new code paths are actually *covered* (an untested new path is a finding). Assess test *quality* against `testing.md` — behavior over implementation, deterministic, not over-mocked, not vacuous (asserts something real). A green-but-meaningless test is false confidence and is itself a finding. If the changed surface needs framework-specific testing guidance, load `testing-specialty-router.md`. For higher-risk diffs, use `bug-hunting.md` to choose a few focused probes or regression tests rather than trusting suite breadth alone.
3. **Run the app / feature** — launch it and exercise the change for real:
   - the **golden path** the change was built for (use the intent pinned in Phase 0);
   - **at least one negative/error path** — invalid input, empty state, permission-denied path, timeout, or dependency failure, whichever best matches the risk map;
   - **regressions** — quickly exercise adjacent features the change could plausibly affect.
   Observe actual behavior (output, UI, logs, side effects); don't infer it from the code.
   - **temporal/retry behavior** *(when relevant)* — retry, refresh/reload, back/forward navigation, duplicate submit, reconnect, or rerun the same action to confirm idempotency and stale-state handling.
   - **persistence/round-trip behavior** *(when relevant)* — create something, reload/refetch it, and confirm the stored or serialized form still behaves correctly.
   - **auth / permission paths** *(when relevant)* — confirm unauthenticated, under-privileged, expired-session, and wrong-tenant paths behave safely.
   - **upload / parser / redirect / outbound-fetch paths** *(when relevant)* — exercise malformed input, oversized files, blocked destinations, and unsafe redirect attempts.
   - **observability** *(when relevant)* — confirm failures and high-value actions leave useful signals without leaking secrets or PII; see `observability-review.md`.
   - **migration / rollout safety** *(when relevant)* — verify new code tolerates existing data shape and migrated data shape where the environment allows; see `migration-safety.md`.
   - **async / duplicate / replay behavior** *(when relevant)* — rerun the same message, job, or action and confirm side effects are not duplicated or corrupted.
   - **config / feature-flag behavior** *(when relevant)* — verify safe defaults, missing-config behavior, and both sides of the flag when the change depends on rollout controls.
   - **project/domain invariants** *(when relevant)* — exercise the repo-specific calculation, workflow state, tenant/privacy boundary, compatibility promise, or documented convention captured in the project context capsule.
   - **Playwright/browser automation** *(when already available)* — for UI/web changes, prefer at least one focused reproducible browser flow for the highest-value journey and one meaningful negative/regression path over an ad hoc manual click-through. When the project already has specialty browser/E2E tooling and the changed surface needs that detail, route through `testing-specialty-router.md`.
   - **workflow safety confirmation** *(when relevant and static verification is meaningful)* — for workflow/release automation changes, confirm the trusted event model, token/secrets exposure, and execution path assumptions from `workflow-security.md`, and record what was statically proven versus what could not be exercised directly.
4. **Accessibility** *(UI changes only)* — run the dedicated `accessibility-review.md` lane for the changed UI. Treat it as the Phase 6 verification path that proves the expectations introduced by `best-practices/frontend-a11y-i18n.md` actually hold: keyboard-only pass, automated checker (e.g. axe), and any changed focus/label/error/motion expectations that matter for this surface.
5. **Performance** *(hot-path / perf-sensitive changes only)* — follow `performance-profiling.md`: measure against realistic data, find the real bottleneck, confirm any optimisation with a before/after. If the changed surface needs framework-specific performance guidance, load `performance-specialty-router.md`. Skip with a note for cold-path changes.

At the end of verification, be able to say which top risks from the risk map and
which relevant project-context invariants were actually exercised, and which
were not.

## Required probes by archetype

If an archetype appears in the Phase-0 risk map, cover **at least one**
meaningful probe from its row. High-risk diffs usually need more than one.

- **UI / UX**
  - golden path in the real UI;
  - one validation/loading/error-state check;
  - refresh/navigation/back-forward or stale-state check.
- **API / contract**
  - valid request;
  - malformed/missing-field or wrong-method check;
  - backward-compatibility or response-shape check when relevant.
- **Auth / privacy / tenant boundary**
  - unauthenticated or expired-session path;
  - under-privileged/wrong-resource/wrong-tenant path;
  - confirm both deny behavior and absence of leaked data.
- **Persistence / state**
  - create/update/delete round-trip;
  - partial-failure or rollback-safe behavior if relevant;
  - cache/read-model/derived-state sync after mutation.
- **Schema / migration / rollout**
  - old/new data-shape tolerance;
  - deploy-order or flag-order assumption check;
  - reversibility/rollback note or explicit reason it is not relevant.
- **Async / jobs / events**
  - retry or duplicate-delivery probe;
  - ordering/replay probe when ordering matters;
  - failure visibility and poison-message behavior where relevant.
- **External integration**
  - upstream timeout/error path;
  - retry/idempotency behavior;
  - schema/contract assumption check on the exchanged payload.
- **Config / feature flags / deployment**
  - safe default / missing-config path;
  - flag off and flag on behavior when both modes can exist;
  - startup/runtime failure mode when config is invalid.
- **Workflow / release automation**
  - trusted event / trigger assumptions;
  - secret and token exposure path;
  - static workflow safety confirmation when direct execution is unavailable.
- **Performance-sensitive**
  - measure the suspected hotspot;
  - compare before/after or explain why no before/after was possible.

If you skip a row because the environment cannot exercise it, say that
explicitly and carry the gap into the validation gate rather than silently
pretending it was covered.

## Output

Phase 6 must produce the shared `verification ledger`.

Use `verification-ledger.md` as the canonical schema and minimum-coverage
contract. For each verification activity, record the exact fields defined
there:

- activity name
- command, flow, or probe that was run
- observed result
- risk or invariant exercised
- coverage type: `direct` | `indirect`
- status: `pass` | `fail` | `not-run`
- notes on environment gaps or unexercised risks

If a top risk from the Phase-0 risk map was not exercised, carry that gap
forward explicitly into the validation gate.

When summarizing the ledger, be explicit about which entries are **directly
verified**, which are only **indirectly supported**, and which remain
**not-run/environment-blocked**.

## When a bug appears during verification

Don't just note "saw a failure." Capture it in a replayable way:

- record the exact command, route, fixture, input, or seed that triggered it;
- minimize the reproducer if you can;
- add or improve a regression test when practical;
- rerun the focused probe after the fix, then the broader suite.

## When you cannot run it

If the environment can't launch the app (no runtime, missing services, no display), **say so explicitly** and mark the behavioral check as not performed — never report success you didn't observe. Fall back to the strongest evidence available (tests, a dry run, a focused harness) and record the gap for the validation gate.
