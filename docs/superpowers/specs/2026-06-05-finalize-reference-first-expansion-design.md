# Finalize Reference-First Expansion Design

> **For agentic workers:** Expand `/finalize` by keeping the core skill orchestration-focused and moving new specialty logic into surface-triggered reference files. This document defines the target behavior, file structure, routing rules, and safety boundaries for that expansion.

**Goal:** Evolve `/finalize` into a maximal-audit, reference-first review pipeline that can cover accessibility, App Store reviewability, infra security, exploit-driven workflow review, threat-model escalation, error handling, richer docs escalation, and deeper testing/performance guidance without turning the main skill into an unmaintainable monolith.

**Non-goals:** This design does not turn `/finalize` into a whole-repo audit, a generalized pentest workflow, or a domain-specialist lane for every niche ecosystem. Specialty coverage remains surface-triggered, diff-scoped, and bounded by verification discipline.

**Primary decision:** Use a reference-first expansion model rather than a monolithic rewrite or coarse lane bundles.

---

## Context

The current [skills/finalize/SKILL.md](/Users/merijnmoes/Code/persoonlijk/skills/skills/finalize/SKILL.md) already has a strong structure:

- explicit phases from baseline through verdict
- shared artifacts (`Evidence Pack`, `Finding Set`, `Verification Ledger`, `Decision Packet`)
- diff-scoped review discipline
- risk-aware conditional routing
- clear separation between improvement phases, audit phases, verification, and final reporting

The comparison pass against external skills showed that the main gaps are not in basic review coverage, but in specialty audit depth and escalation behavior:

- accessibility review is underpowered relative to dedicated WCAG audit skills
- App Store / submission review is not represented at all
- infra and IaC security are weaker than app security coverage
- GitHub Actions review lacks an explicit external-attacker exploit model
- red-lane security changes have no formal threat-model escalation
- documentation updates do not escalate clearly into ADRs, architecture docs, or component docs
- resilience and error-handling quality are only partially covered through generic code review
- testing and performance guidance are principled but not deeply routed into stack-specific references

At the same time, the user explicitly wants:

- a **maximal audit** posture by default
- permission for **small localized auto-fixes**
- **surface-triggered** specialty lanes rather than baking niche domains into the core skill

## Constraints

The expansion must preserve the existing strengths of `/finalize`:

- remain primarily **diff-scoped**
- keep the main skill readable and maintainable
- avoid speculative blockers
- route findings through the existing findings lifecycle
- preserve verification-led decision-making
- avoid broad unsafe auto-fixes

## Design Principles

1. **The core skill is an orchestrator.**
   The main skill should declare phases, routing decisions, gating rules, auto-fix boundaries, and artifact contracts. Detailed heuristics and checklist content belong in references.

2. **Maximal audit means maximal evaluation, not maximal noise.**
   Every lane should be considered on every run and resolved as `run`, `N/A`, or `deferred by environment`. This is broader than today's behavior, but still requires fit-to-surface discipline.

3. **Specialty lanes remain diff-scoped.**
   A lane may inspect surrounding code and config to validate a changed surface, but should not drift into whole-repo cleanup.

4. **Auto-fix must stay narrow and evidence-driven.**
   New lanes may auto-fix only when the change is localized, low blast radius, clearly correct, and verifiable within the existing pipeline.

5. **Routing should prefer progressive disclosure.**
   Trigger a reference only when the changed surface, risk map, or project context makes it relevant.

6. **Validation stays centralized.**
   Even as the number of lanes expands, verdicting remains in Phases 7 and 8 using shared artifacts and shared severity/action discipline.

## Expansion Overview

The expansion keeps the current 0-8 phase model intact, but strengthens several phases:

- **Phase 0** gains stronger specialty-surface detection and escalation flags
- **Phase 4** becomes a broader, explicit lane registry
- **Phase 5** gains docs escalation routing
- **Phase 6** gains specialty verification hooks for a11y, workflow safety, and stack-specific testing/perf evidence
- **Phase 7** gains clearer calibration rules for new lane outputs

No new top-level phases are added. This avoids destabilizing the overall pipeline shape and keeps the mental model familiar.

## Proposed Core Skill Changes

### 1. Strengthen the phase-map language

Update the top-level description and phase map in [skills/finalize/SKILL.md](/Users/merijnmoes/Code/persoonlijk/skills/skills/finalize/SKILL.md) so Phase 4 explicitly describes a routed maximal-audit matrix rather than a smaller set of primary lanes plus optional extras.

### 2. Introduce a lane registry concept

Within Phase 4, the main skill should explicitly state that every finalize run evaluates a lane registry:

- `run` when the surface is present and the lane is available
- `N/A` when the surface is absent
- `deferred by environment` when the surface is present but the required runtime/browser/device/tooling evidence cannot be gathered

The lane registry should be reported in final compact metadata.

### 3. Add escalation hooks

The core skill should include trigger rules like:

- UI or markup diff -> accessibility review lane
- iOS app, app metadata, purchase, privacy, entitlement, or reviewer-facing flow diff -> App Store review lane
- Docker, Kubernetes, Terraform, deployment manifest, infra policy, or cloud config diff -> infra security lane
- `.github/workflows`, composite actions, release automation, or workflow config diff -> exploit-driven GHA lane
- red-lane trust-boundary change -> threat-model escalation lane
- public API, architecture boundary, or major component shape change -> architecture-docs escalation lane
- resilience-sensitive logic, jobs, retries, idempotency, backoff, or degradation paths -> error-handling lane
- stack-specific testing/perf-sensitive surfaces -> specialty routers for test/perf references

### 4. Clarify lane mutability

Each lane must declare one of:

- `read-only`
- `report-first`
- `small-fix-allowed`

The core skill should define that any lane with `small-fix-allowed` may only apply changes that satisfy the auto-fix contract described below.

## Auto-Fix Contract

### Allowed

Small fixes may be applied when all of the following are true:

- the issue is localized to a small number of files
- the intended correction is unambiguous from established standards or local context
- the fix does not change product scope or rollout assumptions
- the fix can be re-verified in Phase 6 using existing commands, tests, or focused probes

Examples that may qualify:

- missing or incorrect accessibility labels, roles, tab-order/focus wiring, or clearly safe semantic element swaps
- safe workflow hardening like SHA pinning, permission tightening, or moving attacker-controlled expressions out of `run:` interpolation
- stale docs, outdated examples, missing ADR/component-doc updates where the correct target is obvious
- brittle changed tests, weak assertions, or missing focused regression coverage
- narrow security remediations such as parameterized queries, escaping, obvious secret removal from examples, or localized auth checks with clear intended behavior

### Not Allowed

Auto-fix is prohibited for:

- speculative security hardening without a clear trigger path
- architectural rewrites
- broad multi-file refactors driven by a specialty lane
- legal/product/policy decisions
- rollout or migration semantics that need human judgment
- App Store issues that require wording, business-policy, or product-experience decisions beyond an obvious stale-file fix

## New Reference Files

The following files should be added under [skills/finalize/references](/Users/merijnmoes/Code/persoonlijk/skills/skills/finalize/references):

### `accessibility-review.md`

Purpose:

- dedicated Phase-4 and Phase-6 support for WCAG-style accessibility auditing
- richer than the current a11y checks in `frontend-a11y-i18n.md`

Should cover:

- automated and manual-style verification expectations
- keyboard-only, focus order, landmark semantics, accessible name/description, form labeling, error message announcement, dialog/focus trap, contrast, and reduced-motion review
- deduplication by pattern rather than repeating identical findings
- mapping findings to WCAG-style categories when possible
- which issues are safe for small auto-fix vs report-only

### `appstore-review.md`

Purpose:

- dedicated App Store reviewability and submission-risk lane for iOS-facing diffs

Should cover:

- `Info.plist`, entitlements, privacy manifests
- purchase and restore flows
- Sign in with Apple implications
- account deletion / login-wall / reviewer friction checks
- test account and reviewer-note readiness
- permission prompt clarity and overreach
- rejection-risk framing with prioritized findings

This lane should be report-first, with fixes limited to obvious stale metadata or docs.

### `infra-security-review.md`

Purpose:

- expand security review into infrastructure and deployment surfaces

Should cover:

- Docker hardening
- Kubernetes pod/container security
- Terraform/cloud config posture
- secret handling in deployment surfaces
- least privilege, public exposure, encryption/logging defaults, provenance-sensitive settings

### `gha-exploit-review.md`

Purpose:

- exploit-driven GitHub Actions lane with an explicit external-attacker model

Should cover:

- `pull_request_target` / pwn-request analysis
- expression injection in `run:`
- comment-triggered command execution
- secret and permission blast radius
- checkout of attacker-controlled code
- local composite actions and config poisoning
- pinning and mutable action references

It should require a plausible exploit path before emitting a blocking finding.

### `threat-model-escalation.md`

Purpose:

- targeted red-lane escalation for high-risk changes

Should cover:

- trust boundaries
- assets
- attacker capabilities
- abuse paths
- assumptions that materially affect severity
- mapping threat-model output back into `Finding Set`, `Verification Ledger`, and `Decision Packet`

This lane should not produce a giant standalone document during ordinary `/finalize`; it should generate a compact threat-model slice feeding the main pipeline.

### `security-requirements.md`

Purpose:

- derive actionable security requirements or acceptance criteria from escalated threat-model findings when relevant

Should cover:

- translating threats into functional/non-functional/constraint requirements
- testability and traceability expectations
- how to classify `Plan` vs `Fix` vs `Decide` actions for security requirements that cannot be solved within finalize

### `error-handling-review.md`

Purpose:

- review resilience and failure-handling quality more explicitly than generic correctness review

Should cover:

- graceful degradation
- retry correctness
- idempotency and replay safety
- compensating behavior after partial failure
- user-facing error quality
- operator-facing diagnostics quality
- poison-message or stuck-job behavior where relevant

### `architecture-docs-review.md`

Purpose:

- decide when docs work must escalate into ADRs, architecture docs, or component docs

Should cover:

- architecture decision triggers
- public API shape changes
- major boundary or responsibility movement
- whether existing architecture docs or component docs are now stale
- when to update an existing ADR vs create a new one

### `docs-quality-router.md`

Purpose:

- route Phase 5 into documentation styles and specialty formats when needed

Should cover:

- README / API / runbook / architecture / ADR / component-doc decisions
- Diataxis-aware distinctions where useful
- when not to expand documentation scope

### `testing-specialty-router.md`

Purpose:

- attach stack-specific test references to Phase 1 or Phase 6 when the changed tests or risk profile justify it

Should cover:

- Playwright / Cypress style E2E guidance
- JS/TS testing tool guidance
- Python testing tool guidance
- when generic `testing.md` is enough vs when a specialty reference should load

### `performance-specialty-router.md`

Purpose:

- attach stack-specific perf references when the changed surface is performance-sensitive

Should cover:

- web perf / Core Web Vitals
- runtime/memory/bundle guidance
- optional niche references only when the surface matches

## Existing Reference Updates

### `security-review.md`

Update to:

- mention the new infra-security lane
- point workflow-related diffs to the exploit-driven GHA reference
- clarify that red-lane security changes may trigger threat-model escalation
- distinguish app-security review from infra-security review

### `security-cheat-sheets.md`

Update to route to:

- `infra-security-review.md`
- `gha-exploit-review.md`
- `threat-model-escalation.md`
- `security-requirements.md`

### `update-docs.md`

Update to:

- mention ADRs, architecture docs, and component docs as escalation targets
- route to `docs-quality-router.md` or `architecture-docs-review.md` when the change materially affects public behavior or architecture

### `testing.md`

Update to:

- clarify when to load `testing-specialty-router.md`
- keep the generic philosophy but defer tool- and framework-specific patterns to the router

### `performance-profiling.md`

Update to:

- clarify when to load `performance-specialty-router.md`
- preserve the current measure-first discipline while allowing specialty perf guidance

### `validation-gate.md`

Update to:

- explicitly account for new lane outputs in verdict calibration
- ensure accessibility, workflow exploitability, App Store review blockers, and unresolved threat-model risks can influence `NEEDS REVISION` or `BLOCKED` consistently

## Phase-by-Phase Behavioral Changes

### Phase 0

Enhance project-context and risk mapping so they detect:

- specialty surfaces present in the diff
- whether lane availability depends on environment access
- whether the diff has architecture-doc or App Store implications

The `Evidence Pack` should include a `specialty lane candidates` section.

### Phase 4

Convert from a smaller conditional list into a formal maximal-audit registry.

Core always-considered lanes should include:

- code review
- security review
- secret scan
- dependency/license audit
- static intelligence
- migration safety
- observability review
- configuration review
- focused bug hunt
- project-context fit
- consistency/codebase fit
- spec conformance
- structural regression
- accessibility review
- error-handling review
- architecture-docs review
- infra security review
- exploit-driven GHA review
- App Store review
- threat-model escalation

Not all of these will run on every diff, but all of them are evaluated for applicability.

### Phase 5

Still handles docs alignment, but now can escalate into:

- ADR update or creation
- architecture doc update
- component doc update
- existing documentation modes beyond README/API/changelog

### Phase 6

Add specialty verification hooks:

- accessibility verification for UI diffs
- workflow verification where safe static confirmation is possible
- stronger browser/E2E routing when risk warrants it and tooling exists
- specialty perf verification when perf-sensitive surfaces changed

### Phase 7

Extend verdict calibration so these can block appropriately:

- confirmed accessibility blockers on critical flows
- confirmed exploit-driven workflow vulnerabilities
- serious App Store rejection risks when the feature is clearly targeting submission readiness
- unresolved threat-model findings on red-lane changes
- missing required architecture or rollout docs when that absence creates shipping risk

## Routing Strategy

Routing should stay surface-triggered rather than domain-global.

Examples:

- a Markdown-only diff should not load App Store, a11y, or threat-model references
- a CSS/JSX diff should consider accessibility even when the user never said “a11y”
- a workflow YAML diff should always consider exploit-driven GHA review
- an iOS metadata + purchase-flow diff should trigger App Store review even without iOS code changes
- a new Dockerfile plus Terraform module should trigger infra security without needing app-layer auth changes

## File Responsibility Map

### Modify

- [skills/finalize/SKILL.md](/Users/merijnmoes/Code/persoonlijk/skills/skills/finalize/SKILL.md)
- [skills/finalize/references/security-review.md](/Users/merijnmoes/Code/persoonlijk/skills/skills/finalize/references/security-review.md)
- [skills/finalize/references/security-cheat-sheets.md](/Users/merijnmoes/Code/persoonlijk/skills/skills/finalize/references/security-cheat-sheets.md)
- [skills/finalize/references/update-docs.md](/Users/merijnmoes/Code/persoonlijk/skills/skills/finalize/references/update-docs.md)
- [skills/finalize/references/testing.md](/Users/merijnmoes/Code/persoonlijk/skills/skills/finalize/references/testing.md)
- [skills/finalize/references/performance-profiling.md](/Users/merijnmoes/Code/persoonlijk/skills/skills/finalize/references/performance-profiling.md)
- [skills/finalize/references/validation-gate.md](/Users/merijnmoes/Code/persoonlijk/skills/skills/finalize/references/validation-gate.md)

### Create

- [skills/finalize/references/accessibility-review.md](/Users/merijnmoes/Code/persoonlijk/skills/skills/finalize/references/accessibility-review.md)
- [skills/finalize/references/appstore-review.md](/Users/merijnmoes/Code/persoonlijk/skills/skills/finalize/references/appstore-review.md)
- [skills/finalize/references/infra-security-review.md](/Users/merijnmoes/Code/persoonlijk/skills/skills/finalize/references/infra-security-review.md)
- [skills/finalize/references/gha-exploit-review.md](/Users/merijnmoes/Code/persoonlijk/skills/skills/finalize/references/gha-exploit-review.md)
- [skills/finalize/references/threat-model-escalation.md](/Users/merijnmoes/Code/persoonlijk/skills/skills/finalize/references/threat-model-escalation.md)
- [skills/finalize/references/security-requirements.md](/Users/merijnmoes/Code/persoonlijk/skills/skills/finalize/references/security-requirements.md)
- [skills/finalize/references/error-handling-review.md](/Users/merijnmoes/Code/persoonlijk/skills/skills/finalize/references/error-handling-review.md)
- [skills/finalize/references/architecture-docs-review.md](/Users/merijnmoes/Code/persoonlijk/skills/skills/finalize/references/architecture-docs-review.md)
- [skills/finalize/references/docs-quality-router.md](/Users/merijnmoes/Code/persoonlijk/skills/skills/finalize/references/docs-quality-router.md)
- [skills/finalize/references/testing-specialty-router.md](/Users/merijnmoes/Code/persoonlijk/skills/skills/finalize/references/testing-specialty-router.md)
- [skills/finalize/references/performance-specialty-router.md](/Users/merijnmoes/Code/persoonlijk/skills/skills/finalize/references/performance-specialty-router.md)

## Risks And Trade-Offs

### Risk: Reference sprawl

Adding many references can make the skill harder to navigate.

Mitigation:

- keep the main skill explicit about which references load when
- ensure each new file has a narrow responsibility
- avoid overlapping checklists that duplicate existing references

### Risk: More blockers, more noise

A maximal audit posture can over-report issues.

Mitigation:

- preserve findings-lifecycle discipline
- require concrete trigger paths for blockers
- route niche lanes only on matching surfaces

### Risk: Auto-fix becomes too aggressive

Mitigation:

- centralize the auto-fix contract in the main skill
- restate fixability boundaries inside each new lane where relevant
- require verification before the fix is treated as resolved

### Risk: Verification becomes too expensive

Mitigation:

- use environment-aware `deferred by environment` reporting
- keep niche runtime checks surface-triggered
- prefer focused probes over broad scaffolding

## Recommended Implementation Shape

Implement the expansion in this order:

1. strengthen [SKILL.md](/Users/merijnmoes/Code/persoonlijk/skills/skills/finalize/SKILL.md) phase/routing language and auto-fix contract
2. add the high-value missing references:
   - `accessibility-review.md`
   - `appstore-review.md`
   - `infra-security-review.md`
   - `gha-exploit-review.md`
   - `error-handling-review.md`
   - `architecture-docs-review.md`
3. wire them into the existing routers and phase docs
4. add the escalation references:
   - `threat-model-escalation.md`
   - `security-requirements.md`
   - docs/testing/perf specialty routers
5. update validation/reporting language so the new lanes affect verdicts coherently

This sequence delivers the biggest coverage gains early while keeping the rollout testable.

## Success Criteria

The expansion is successful when:

- the main skill remains readable and clearly orchestration-focused
- specialty lanes are triggered predictably from changed surfaces
- the new references close the identified gaps without duplicating existing content
- small localized issues can be auto-fixed safely in new lanes
- final verdicts and reports consistently reflect the new lane outputs
- the implementation still feels like one `/finalize` command rather than a collection of unrelated audit modes
