# Lane Sharpness Design (Round 2)

## Goal

Close the leniency gaps the criticality counterweights do not cover. A
three-lane survey (correctness/testing/performance, security, conditional
operational lanes) found the foundations sharp — OWASP floor always
applied, secret scan, C1–C4 walks, spec-conformance blocking on missing
requirements — but the disease lives in **lane selection, not lane
execution**: skipped lanes are never challenged, environment deferrals are
terminal passes, security downgrades accept memory, threat-model
escalation is silently skippable, and unfalsifiable concurrency hypotheses
cannot block.

Decisions already taken with the user: spec and implement all five fixes
below.

## Non-goals

- No changes to the four shipped counterweights (completeness check,
  dismissed ledger, red-team framing, mechanism-triple blocking).
- No new lanes, agents, or artifacts beyond named schema/section
  extensions.
- Testing-lane vacuous-test detection, capsule re-validation, and the
  performance-router N/A case are noted but deferred; they ride the N/A
  challenge (fix 1) instead of getting bespoke rules.

## Design

### 1. N/A challenge (challenge skipped lanes, not just findings)

**Files:** `skills/moes/SKILL.md` (Phase 4 registry), `skills/moes/references/validation-gate.md`.

Every lane marked `N/A` or `deferred by environment` carries a one-line
why-not naming the checked signal (e.g. "no schema files in diff",
"no UI markup touched"). The coordinator spot-checks N/A claims on
yellow/red diffs: for the 2–3 highest-risk skipped lanes, grep the diff
for trigger signals (schema/migration keywords, auth/session paths,
markup, workflow files, dependency manifests). A trigger signal present
despite `N/A` is itself a process finding plus the lane runs. The
validation gate re-checks the registry: any `N/A` without a why-not, or
with a contradicted why-not, is a gate finding. This generalizes the only
existing N/A policing (`qa-evidence-review.md`) to all lanes.

### 2. Environment-deferral follow-ups

**Files:** `skills/moes/SKILL.md` (Phase 4 registry),
`skills/moes/references/final-reporting.md`.

`deferred by environment` stops being a terminal pass on yellow/red
diffs: it converts to a `Plan` finding naming the concrete follow-up
check (canary probe, post-deploy observation, browser pass with
environment) or becomes an explicit user-accepted gap (`Decide`). Green
diffs keep the one-line note. Residual risk reports which form each
deferral took; an unconverted, unaccepted deferral on yellow/red is a
gate finding.

### 3. Security downgrade evidence

**Files:** `skills/moes/references/findings-lifecycle.md`
(false-positive classes), `skills/moes/references/security-review.md`.

Downgrading a security finding on "framework/ORM already protects" or
"auth enforced elsewhere" requires quoting the guard: in-diff lines, or
an immediately adjacent file:line verified by reading it — never memory,
never a confidence shrug. Without the quote the finding keeps a
verdict-affecting status (`blocking` if the trigger holds, otherwise
`contested`/`Investigate` with the concrete check stated). The general
"verify framework claims or lower confidence" rule stays for
non-security lanes; security gets the stronger bar because the blast
radius justifies it.

### 4. Threat-model why-not note

**Files:** `skills/moes/references/threat-model-escalation.md`,
`skills/moes/references/security-review.md`,
`skills/moes/references/validation-gate.md` (security checklist item).

On any trust-boundary change — auth/session paths, tenant separation,
untrusted-input handling, money or authorization caching — the run
either executes the threat-model escalation (boundary, assets, attacker
goals, 1–3 abuse paths) or records a why-not note naming the boundary
and the reason escalation adds nothing. The validation gate checks the
escalation or the note exists; a missing both on a trust-boundary diff
is a gate finding. `read-only` mutability is unchanged.

### 5. Race-mechanism blocking (concurrency, idempotency, tenant leaks)

**Files:** `skills/moes/references/bug-hunting.md`,
`skills/moes/references/findings-lifecycle.md` (trigger-test carve-out),
`skills/moes/references/validation-gate.md` (calibration).

Extend the mechanism-gate pattern beyond architecture: a concurrency
hazard (race, TOCTOU, double-run/non-idempotent retry, tenant leak) may
carry blocking status without a demonstrated trigger when it names the
interleaving or double-run scenario sketched, the shared state or
operation involved, and the cheaper safeguard (lock, transaction,
idempotency key, ownership check). Formulation mirrors the architecture
rule: `Plan`/`Investigate` action with `blocking` status, verdict weight
capped at `NEEDS REVISION`. Purely theoretical hazards with no reachable
shape still drop; the extension covers unfalsifiable-but-real, not
imaginary.

## Files to change

- `skills/moes/SKILL.md`: registry why-not + spot-check rule, deferral
  conversion rule, N/A gate finding.
- `skills/moes/references/validation-gate.md`: N/A re-check, deferral
  acceptance check, threat-model note check, race-mechanism verdict cap.
- `skills/moes/references/findings-lifecycle.md`: security downgrade
  evidence bar, race-mechanism carve-out alongside the architecture gate.
- `skills/moes/references/security-review.md`: evidence-quote rule
  pointer for the two dangerous downgrade classes.
- `skills/moes/references/threat-model-escalation.md`: why-not note
  contract for trust-boundary diffs.
- `skills/moes/references/bug-hunting.md`: hypothesis-to-blocking rule
  for race/idempotency/tenant hazards meeting the mechanism bar.
- `skills/moes/references/final-reporting.md`: deferral-form reporting
  (Plan follow-up vs accepted gap) in residual risk.
- `tests/moes-contract.test.mjs`: assertions for the why-not rule,
  deferral conversion, evidence-quote bar, why-not note, and
  race-mechanism gate.

## Trade-offs

- Spot-checking N/A claims costs coordinator effort on every yellow/red
  review; bounded to 2–3 lanes by design, and a contradicted N/A is
  precisely the highest-signal miss.
- The security evidence bar will keep some findings alive longer;
  `contested`/`Investigate`-with-check is the release valve, and the
  dismissed ledger (round 1) keeps the reasoning inspectable.
- Race-mechanism blocking reintroduces judgment at the gate for the
  hardest class to prove; the sketched-scenario-plus-safeguard
  requirement is the objectivity anchor, mirroring the architecture
  triple.
