# Forge setup

Setup creates the first durable project-memory files that later Forge phases
read. It is an internal lane of `/forge`, not a separate public skill.

Use setup when the user asks to initialize, onboard, configure, or prepare a
repo for Forge, or when preflight finds missing context that blocks confident
work.

## Principles

- Explore first, then draft, then write.
- Be idempotent: update existing sections in place and never create duplicate
  blocks.
- Never silently overwrite standing docs. Show the old/new interpretation when
  changing durable truth.
- Create only justified files. A setup graveyard is worse than no setup.
- Ask decisions one at a time when repo evidence cannot answer them.
- Prefer repo evidence over generic defaults.

## What setup may create

Always consider these:

- `PRODUCT.md`: strategic who/what/why for the product.
- `CONTEXT.md`: single-context glossary and canonical domain language.
- `docs/agents/verification.md`: build, lint, typecheck, test, Playwright,
  API-contract, accessibility, visual, performance, coverage, CI artifact, and
  release-check commands agents should use. This should record local/free
  capabilities and explicitly avoid paid QA-provider requirements.
- `AGENTS.md` or `CLAUDE.md`: whichever already exists, with a Forge pointer
  block. If neither exists, ask which one to create.

Create conditionally:

- `DESIGN.md`: create when the repo has UI/design surfaces or the user wants a
  pre-implementation visual seed.
- `CONTEXT-MAP.md`: create only for multi-context repos.
- `docs/adr/0001-adopt-forge-workflow.md`: create only when the user wants the
  adoption of Forge, Playwright QA, or docs-as-memory recorded as a durable
  decision.
- `docs/agents/issue-tracker.md`: create only when Forge should interact with
  issues or work items.
- `.impeccable/live/config.json`: create only when live design iteration can
  be configured from existing code, following `design-studio/reference/init.md`
  and `design-studio/reference/live.md`.

Do not create `docs/agents/triage-labels.md`. Forge may still note label
conventions inside `docs/agents/issue-tracker.md` if the repo already depends
on them, but label mapping is not a standalone setup artifact.

## Exploration checklist

Inspect before asking:

- `git remote -v` and `.git/config` for GitHub, GitLab, or another tracker
  signal.
- `README.md`, docs, package files, build config, test config, CI config, and
  app entrypoints.
- Existing `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, or other agent instruction
  files.
- Existing `PRODUCT.md`, `DESIGN.md`, `CONTEXT.md`, `CONTEXT-MAP.md`,
  `docs/adr/`, `docs/agents/`, and `.forge/`.
- UI evidence: components, routes, CSS variables, design tokens, brand assets,
  screenshots, or design-system packages.
- Domain evidence: module names, route names, database schemas, API resources,
  bounded-context directories, and glossary-like docs.
- Verification evidence: package scripts, Makefile targets, CI jobs,
  Playwright config, test folders, API test setup, linters, typecheckers,
  build commands, accessibility tooling, visual snapshot tooling, Lighthouse,
  k6, coverage tooling, and artifact upload/reporting conventions.

## Decision flow

After exploration, present what exists and what is missing. Then handle only
the decisions that are unresolved:

1. **Agent instruction target**
   - If `CLAUDE.md` exists, update it.
   - Else if `AGENTS.md` exists, update it.
   - Else ask whether to create `AGENTS.md` or `CLAUDE.md`.

2. **Project shape**
   - Single-context: create or update root `CONTEXT.md`.
   - Multi-context: create or update root `CONTEXT-MAP.md` plus per-context
     `CONTEXT.md` files only for contexts the repo clearly contains.

3. **Issue tracker**
   - If a GitHub remote exists, propose GitHub Issues.
   - If a GitLab remote exists, propose GitLab Issues.
   - If the repo uses local markdown or has no remote, propose local markdown
     under `.scratch/issues/`.
   - For Jira, Linear, or another system, ask for the workflow in one short
     paragraph and record it as prose.
   - If the user does not want issue integration, skip
     `docs/agents/issue-tracker.md`.

4. **Design setup**
   - If `PRODUCT.md` is missing, follow `design-studio/reference/init.md` to
     produce it from repo evidence plus a short interview.
   - If `DESIGN.md` is missing and code exists, offer scan mode through
     `design-studio/reference/document.md`.
   - If `DESIGN.md` is missing and the project is pre-implementation, offer
     seed mode.
   - If neither UI nor product design matters for this repo, skip `DESIGN.md`
     and note why.

5. **ADR**
   - Offer an ADR only if setup records a real durable decision: adopting
     Forge, standardizing Playwright QA, choosing docs-as-memory, or changing
     agent workflow conventions.

## Draft before writing

Before editing, show the user a compact draft of:

- the Forge block for `AGENTS.md` or `CLAUDE.md`
- project docs to create or update
- setup docs to create or update
- files intentionally skipped

Wait for approval before writing unless the user has already explicitly asked
for a direct setup write.

## Agent instruction block

Use this block in the selected agent file, updating in place if a Forge block
already exists:

```md
## Forge

This repo uses Forge as its AI development workflow.

- Product context: see `PRODUCT.md` when present.
- Design context: see `DESIGN.md` when present.
- Domain language: see `CONTEXT.md` or `CONTEXT-MAP.md`.
- Architecture decisions: see `docs/adr/`.
- Agent setup: see `docs/agents/`.
- Verification commands: see `docs/agents/verification.md`.

Use `/forge` for substantial changes so discovery, spec, implementation,
Playwright QA, and final hardening stay connected.
```

## Minimal seed templates

### PRODUCT.md

```md
# Product

## Register

product

## Users

[Who uses this, their context, and the job they need done.]

## Product Purpose

[What the product does, why it exists, and what success looks like.]

## Brand Personality

[Voice, tone, emotional goals, and 3-5 personality words.]

## Anti-goals

[What this product should not become or optimize for.]

## Design Principles

- [Strategic principle.]
- [Strategic principle.]
- [Strategic principle.]

## Accessibility & Inclusion

[Accessibility expectations, known user needs, and constraints.]
```

### CONTEXT.md

```md
# Project Context

Short description of the domain this repo owns.

## Language

**Canonical Term**: Concise context-specific definition.
_Avoid_: ambiguous synonym, old synonym
```

### docs/agents/domain.md

```md
# Domain Docs

## Layout

This repo uses [single-context / multi-context] domain docs.

## Consumer Rules

- Read `CONTEXT.md` before domain-heavy planning, debugging, TDD, or
  architecture work.
- If `CONTEXT-MAP.md` exists, use it to find the relevant context first.
- Read `docs/adr/` before changing architecture or cross-context boundaries.
- Update domain docs when reusable terms, boundaries, or decisions are
  clarified.
- Keep `docs/agents/verification.md` aligned with local/free QA capabilities:
  Playwright E2E, Playwright API, accessibility, visual smoke, performance,
  coverage, and CI artifacts.
```

### docs/agents/issue-tracker.md

```md
# Issue Tracker

## System

[GitHub Issues / GitLab Issues / local markdown / other]

## Workflow

[How agents should read, create, update, and link work items.]

## Notes

[Repo-specific conventions, if any.]
```

### docs/agents/verification.md

```md
# Verification

## Install

`[install command]`

## Build

`[build command]`

## Lint

`[lint command]`

## Typecheck

`[typecheck command]`

## Test

`[test command]`

## Playwright

`[playwright command or "not configured"]`

## Notes

[Known baseline failures, required services, env vars, or setup caveats.]
```

### ADR

```md
# 0001-adopt-forge-workflow

We use Forge as the repo's AI development workflow so discovery, specification,
implementation, Playwright QA, and final hardening happen as one connected
process. Project knowledge lives in durable markdown files so future agents can
reuse product, design, domain, verification, and decision context instead of
rediscovering it each run.
```

## Done report

When setup completes, report:

- files created
- files updated
- files intentionally skipped and why
- setup decisions made
- unresolved setup gaps
- which Forge phases now read the new context
