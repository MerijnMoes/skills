# Moes Extraction Design

## Goal

Extract the final hardening review pipeline (`temper`, currently
`skills/forge/references/temper/`) out of `forge` into a standalone skill,
`moes`, exposing `/moes` and `/moes against <branch>`. `/forge:review` is
removed; `/forge:build` keeps its Review phase and runs it by loading the
`moes` skill.

Decisions already taken with the user: move (not copy, not wrapper);
`/forge:review` removed (not delegated, not kept); build keeps Review via
`moes`; `moes` mirrors the old review command surface.

## Non-goals

- No behavior changes to the review pipeline itself (parallel fan-out,
  Architecture Map, sharded verification, and findings-as-data ship as built).
- `methodology/` skills, `delegation.md`, and `worker-templates/` stay in
  `forge` and are referenced by path or skill name, not duplicated.
- Historical `docs/superpowers/*` records are not rewritten.
- No new commands beyond the two mirrored forms.

## Design

### 1. Target structure

Move with `git mv` so history is preserved:

```text
skills/moes/SKILL.md         <- from skills/forge/references/temper/SKILL.md
skills/moes/references/*     <- from skills/forge/references/temper/references/* (69 files)
```

Internal `references/X` links keep working untouched because the `SKILL.md` +
`references/` layout is preserved. The one absolute self-reference
(`final-reporting.md` pointing at `skills/forge/references/temper/SKILL.md`)
is rewritten to `skills/moes/SKILL.md`.

### 2. moes SKILL.md

- Frontmatter `name: moes`. Description follows CSO rules: starts with
  "Use when...", third person, triggering conditions only, never a workflow
  summary. Draft: "Use when a code change is functionally complete and needs
  a final hardening review before shipping, or when the user asks for moes."
- Public surface: `/moes` reviews the current diff; `/moes against
  <branch>` overrides the comparison base (auto-detect otherwise).
- Body keeps the phase pipeline (Scope, Best-practices, Simplify, Refactor
  assessment, Audit, Update docs, Verify, Validation gate, Final report)
  with forge-specific routing replaced by the shared-file references below.
- Bare ``delegation.md`` pointers become
  ``../forge/references/delegation.md``; `worker-templates/review.md`
  becomes ``../forge/references/worker-templates/review.md``. Methodology
  skills keep skill-name references (no paths to rewrite).

### 3. Shared files (stay in forge, single source)

- `skills/forge/references/delegation.md` (also used by `implementation.md`;
  must not move).
- `skills/forge/references/worker-templates/` (role template set stays
  together; `moes` uses the `review` role).
- `skills/forge/references/methodology/` (referenced by skill name).
- Run state stays in `.forge/state.json`, owned by forge's
  `state-contract.md`; `moes` reads and writes only the `review` section.
  This is the documented handoff: zero bridging, works standalone and inside
  `/forge:build`. The `temper` legacy mirror field is deleted as part of the
  move; the migration it tracked is complete.

### 4. Forge-side edits

- `skills/forge/SKILL.md`: drop `/forge:review` from the command surface and
  the "When to use" review bullet; phase model keeps `Review`, annotated as
  executed by loading the `moes` skill.
- `workflow-routing.md`, `reporting.md`, `preflight.md`,
  `pause-resume.md`, `source-integration.md`, `qa-capability-matrix.md`:
  replace `/forge:review` routing with `moes` loading; keep the
  `review.verdict` state field and report inputs (now filled by `moes`).
- `README.md`: remove `/forge:review` from the command list; add a `moes`
  section (same install, new skill). No plugin metadata change needed:
  `.codex-plugin/plugin.json` names only the plugin and enumerates no
  skills.

### 5. Testing

- New `tests/moes-contract.test.mjs`: frontmatter (`name: moes`,
  `description` starts with "Use when"), `/moes` and `against <branch>`
  surface, phase-artifact chain (Evidence Pack, Finding Set, Verification
  Ledger, Decision Packet), advisory-only architecture rule, and the
  `../forge/` shared-file references resolving to real files.
- Update `tests/forge-contract.test.mjs`: assert `/forge:review` is gone
  from skill, routing, and README; assert the build Review phase loads
  `moes`; keep all other assertions green.
- Full suite (`node --test tests/`) green, then dry-run `/moes` on its own
  move-diff as the acceptance probe.

## Files to change

- Move: `skills/forge/references/temper/SKILL.md` to `skills/moes/SKILL.md`
  (plus frontmatter, surface, and shared-path rewrites).
- Move: `skills/forge/references/temper/references/*` to
  `skills/moes/references/*` (plus the one `final-reporting.md` path
  rewrite).
- Edit: forge `SKILL.md`, `workflow-routing.md`, `reporting.md`,
  `preflight.md`, `pause-resume.md`, `source-integration.md`,
  `qa-capability-matrix.md`, `state-contract.md` (drop `temper` mirror),
  `README.md`.
- Create: `tests/moes-contract.test.mjs`; edit:
  `tests/forge-contract.test.mjs`.

## Trade-offs

- Cross-skill relative paths (`../forge/...`) couple `moes` to `forge`'s
  layout; both ship in this repo so they move together, and the contract
  test pins the targets.
- One state file (`.forge/state.json`) shared by two skills is slightly
  impure, but avoids dual-state sync bugs and keeps the build-to-review
  handoff free.
- `git mv` of 70 files makes the move commit large; it is purely
  mechanical and reviewable as a rename plus the small rewrites above.
