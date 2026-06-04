# Finding triage

Used when `/finalize` consolidates Phase 4 findings and calibrates the Phase 7 verdict. This file classifies each surviving finding by **what should happen next**, not by how clever or interesting the issue is.

Run `finding-verification.md` first for anything that might block. Then assign one action type.

## Action types

| Action | Use when | Effect on `/finalize` |
|--------|----------|------------------------|
| **Fix** | High-confidence, localized defect with a clear safe fix inside the finalized diff | Fix it now, then re-run the relevant verification. |
| **Investigate** | Plausible issue but missing evidence, unclear cause, or environment-dependent behavior | Surface as non-blocking unless the unknown itself creates unacceptable risk. State the first concrete check. |
| **Plan** | Systemic architecture, migration, cross-module, or policy work that exceeds finalize scope | Do not refactor broadly in `/finalize`; report as follow-up or `NEEDS REVISION` if it blocks the current change. |
| **Decide** | Product/domain/security/release trade-off needing human judgment | Ask or report the decision point. Do not invent policy. |

## Decision flow

1. Is the issue a verified localized defect in changed code?
   - Yes: **Fix**.
2. Does the issue require broad architecture or multi-file policy change beyond the diff?
   - Yes: **Plan**.
3. Does the issue depend on product intent, domain policy, legal/compliance posture, rollout tolerance, or team preference?
   - Yes: **Decide**.
4. Is the diagnosis plausible but not proven?
   - Yes: **Investigate**.

## Calibration rules

- A **Fix** item can block until fixed.
- A **Plan** item blocks only if the current diff makes the system materially unsafe or unmaintainable as-is; otherwise it is a follow-up.
- A **Decide** item blocks when shipping would choose an irreversible or risky policy by accident.
- An **Investigate** item should not block on its own unless the missing evidence is itself a release blocker, such as an unrun migration on a critical data path.
- Low-confidence findings belong in **Investigate**, not in **Fix** with dramatic language.

## Output fields

For every finding in the final punch list, include:

- **Severity** — Critical / High / Medium / Low.
- **Confidence** — High / Medium / Low.
- **Action** — Fix / Investigate / Plan / Decide.
- **Trigger or evidence** — the concrete input, path, spec line, command output, or missing evidence.
- **Status** — fixed, unresolved, deferred, or needs user decision.

## Quick checklist

- [ ] Blocking items survived `finding-verification.md`.
- [ ] Every finding has severity, confidence, action, trigger/evidence, and status.
- [ ] Speculative issues are marked Investigate, not inflated to blockers.
- [ ] Systemic issues are not solved by broad surprise refactors during `/finalize`.
- [ ] Human trade-offs are surfaced as decisions, not guessed.
