# Final reporting

Phase 8 of `/finalize`. The job of the final report is not just to "summarize
the work." It is to make the outcome **easy to trust** and **easy to hand off**
into a commit, PR, or review conversation.

The user should not need to reconstruct:

- what changed;
- what was actually verified;
- which findings are real versus speculative;
- which project-specific conventions, boundaries, and domain rules were checked;
- what remains risky;
- what they should do next.

## Output principles

- **Lead with the decision.** Verdict first, then the evidence that supports it.
- **Evidence over reassurance.** Prefer "ran `pnpm test`, exercised create+edit
  flow, added regression test for duplicate submit" over "tests looked good."
- **Show project fit.** If the verdict relies on repo-specific architecture,
  domain, tooling, or release conventions, name what was checked and any
  unknowns.
- **Reviewer-ready, not diary-like.** Keep chronology out unless it matters for
  risk or debugging.
- **Separate facts from confidence from gaps.** What you know, how sure you are,
  and what you could not verify are different things.
- **Don't bury the user.** Include everything important, but compress repeated
  detail. The report is a decision artifact, not raw notes.

## Required sections

Use these headings or clearly equivalent ones.

## 1. Executive summary

Two to four sentences:

- what the change delivers;
- whether it is shippable;
- why the verdict is what it is.

This should read like the top of a strong PR description.

## 2. What changed

State:

- **Scope** — feature/fix/refactor delivered by the diff.
- **Touched surfaces** — major modules, user flows, APIs, schemas, config, docs.
- **Intent/spec source** — issue, spec file, commit message, user statement, or
  "no external spec; internal-consistency check only."
- **Project context** — standing instructions, architecture/domain conventions,
  and unknowns that materially affected the review.

Avoid file-by-file churn unless the diff is tiny.

## 3. Evidence ledger

This is the heart of a trustworthy finalize output. For every lane that was
relevant, say **what evidence exists**.

Include only what applies:

- **Static gates** — formatter, lint, typecheck, build.
- **Tests** — suite result, high-value targeted probes, regression tests added
  or improved, notable coverage gaps.
- **Behavioral verification** — real flows exercised and their outcomes.
- **Project-fit verification** — architecture boundaries, prior-art reuse,
  domain rules, tooling/test norms, docs/release conventions checked.
- **Browser/UI verification** — manual path, Playwright path, a11y checks.
- **Security verification** — concrete exploit checks, auth/tenant checks,
  secret scan, dependency/license audit.
- **Data/migration/rollout verification** — backward compatibility, idempotency,
  retry behavior, data-shape tolerance, config defaults.
- **Performance** — before/after if measured, or explicit note that it was not a
  hot-path change.
- **Docs/config** — what docs, examples, env templates, or changelog entries
  were updated or checked.

If something could not be run, say that here plainly. Do not let absence of
evidence read like positive evidence.

## 4. Findings

Split findings into:

- **Blocking**
- **Non-blocking / deferred**

For every finding, include:

- severity;
- confidence;
- action type: Fix, Investigate, Plan, or Decide;
- reachability when relevant;
- concrete trigger or violated spec line;
- current status: fixed, deferred, or unresolved.

Findings should be ordered by business impact, not by phase or file order.

## 5. Residual risk / open questions

This section is mandatory even when empty.

Include:

- things not fully proven due to environment limits;
- tests or probes you would still want in a future pass;
- deferred refactors with risk implications;
- ambiguous product/spec questions;
- rollout or operational assumptions that were not exercised.

If there is truly no residual risk worth naming, say that explicitly.

## 6. Recommended next step

Tailor this to the verdict:

- **READY TO SHIP** — suggest the commit/PR framing, reviewer attention points,
  and any rollout note worth carrying into the PR body.
- **NEEDS REVISION** — list the exact changes needed before rerunning
  `/finalize`.
- **BLOCKED** — state the hard stopper first, then the minimum path to unblock.

## PR-ready framing

When the verdict is `READY TO SHIP`, the report should leave the user with
material they can reuse directly in a PR:

- a one-paragraph change summary;
- the highest-signal verification bullets;
- reviewer attention points for the riskiest surfaces;
- any rollout/migration/config note that belongs in the PR body.

You do not need to write a full PR description unless the host or user asked for
it, but the report should make that description easy to derive.

## Anti-patterns

- Verdict without evidence.
- A giant wall of phase-by-phase narration that hides the actual result.
- Mixing speculative worries with confirmed findings.
- Claiming verification you did not actually perform.
- "No issues found" without saying what was checked.
- Listing every touched file when a few surfaces would communicate better.
- Hiding environment limitations in a footnote.

## Quick checklist

- [ ] Verdict appears immediately and is justified.
- [ ] Scope, touched surfaces, and intent source are stated clearly.
- [ ] Project-specific context that mattered is stated clearly.
- [ ] Evidence is listed per relevant lane, not implied.
- [ ] Findings carry severity/confidence/action/trigger/status.
- [ ] Residual risk/open questions are explicit, even if empty.
- [ ] Recommended next step matches the verdict.
- [ ] Output is concise but reusable in a PR or review handoff.
