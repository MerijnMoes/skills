# Forge source integration

`forge` contains two internal source payloads. They are not public entrypoints;
they are the detailed operating manuals behind the public workflow.

## Skill directory convention

When a referenced script must run, first resolve the installed `forge` skill
directory and treat it as `FORGE_SKILL_DIR`.

Examples:

- project-local Codex: `.agents/skills/forge`
- project-local Claude Code: `.claude/skills/forge`
- global installs: the agent-specific global skills directory that contains
  `forge/SKILL.md`

When unsure, inspect the loaded skill path or search for `forge/SKILL.md` in
the active agent skills directory. Then run scripts as:

```bash
node "$FORGE_SKILL_DIR/references/design-studio/scripts/context.mjs"
```

Do not require users to install another workflow package to use these internal
references.

## Methodology payload

Use `references/methodology/skills/` as the source of truth for disciplined
development behavior. Use `references/project-knowledge.md` as the Forge-owned
contract for durable repo memory that these methodology files read and update.

- `brainstorming`: collaborative discovery, domain grilling, and design docs
- `writing-plans`: executable implementation plans
- `using-git-worktrees`: isolated workspaces and branch hygiene
- `subagent-driven-development`: cross-agent task execution and reviews
- `executing-plans`: sequential fallback when subagents are unavailable
- `test-driven-development`: red-green-refactor behavior changes
- `systematic-debugging`: root-cause debugging
- `requesting-code-review` and `receiving-code-review`: review loops
- `verification-before-completion`: evidence before completion claims
- `finishing-a-development-branch`: final integration choices
- `writing-skills`: skill authoring and pressure-test discipline

The summarized `forge` files in this directory are routing adapters. If a
summary conflicts with a source payload, prefer the source payload unless it
conflicts with explicit user instructions or this repo's public-entrypoint
model.

## Design studio payload

Use `references/design-studio/` as the source of truth for frontend design
quality:

- `SOURCE-SKILL.md`: original design-skill operating manual, retained as an
  internal reference
- `reference/*.md`: command references for shape, craft, critique, audit,
  polish, harden, animate, colorize, layout, typeset, live iteration, and more
- `scripts/`: context, palette, critique storage, deterministic detector, and
  live-browser support scripts
- `agents/`: supporting agent prompts/configuration where a host supports them

For `forge`, the public UI and design phase names are:

- `Shape`: use `reference/shape.md` and the matching register reference
- `Design Quality`: route to `critique`, `audit`, `harden`, `polish`, or a
  targeted command such as `layout`, `typeset`, `colorize`, `adapt`, `animate`,
  `clarify`, `optimize`, or `onboard`
- `QA`: runs after design quality; Playwright authoring and verification are
  internal QA sub-lanes so durable browser tests reflect the hardened UI

## QA source synthesis

Forge's QA lane adapts external QA-skill practices as principles, not runtime
dependencies. The default executable layer remains repo-local Playwright.

Useful practices for Forge QA:

- Playwright E2E: user-centric flows, semantic selectors, auto-waiting,
  isolation, readable tests, fixtures, auth state, traces, screenshots, and
  videos.
- Playwright API: request-context tests, lifecycle-managed data, response body
  validation, auth/error contracts, and API side-effect checks.
- Browser automation skills: navigate, inspect, interact, re-inspect, and
  capture artifacts as an exploratory rhythm.
- Cypress: network-control mindset, clean auth state, request assertions, and
  test isolation.
- Storybook: component interaction checks only when the target repo already
  uses Storybook.

Useful practices for `temper`:

- CI/CD pipeline guidance: fast feedback, fail fast, reproducible builds,
  parallelism where safe, and artifact preservation.
- Jest, Vitest, Pytest, React Testing Library, and Vue Testing Utils: behavior
  over implementation, AAA shape, descriptive names, fixtures,
  parametrization, async discipline, and independence.
- Lighthouse and k6: conditional local/free performance evidence when risk and
  environment justify it.
- Coverage tools: risk signal only, never a reason for vacuous tests.

Mostly not adopted:

- Selenium and Puppeteer do not become first-class Forge paths while Playwright
  is the default. Borrow general wait, isolation, and data discipline only.
- Thin placeholder skills with little actionable content should not expand
  Forge scope.

## Visual plan source synthesis

Forge owns the default visual-plan lane. It is a dependency-light local review
artifact generated after planning and before implementation only when the user
accepts it.

Do not require Agent-Native, hosted sharing, MDX renderers, or vendor dashboards
for the default Forge flow.

## Naming boundary

Public user flow uses `/forge:setup`, `/forge:build`, and `/forge:review`.
Internal files may retain upstream naming, license text, command examples, and
comments where preserving source fidelity is more valuable than cosmetic
renaming.
