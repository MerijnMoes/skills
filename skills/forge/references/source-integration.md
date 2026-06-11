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

For `forge`, the public phase names are:

- `Shape`: use `reference/shape.md` and the matching register reference
- `Design Quality`: route to `critique`, `audit`, `harden`, `polish`, or a
  targeted command such as `layout`, `typeset`, `colorize`, `adapt`, `animate`,
  `clarify`, `optimize`, or `onboard`
- `Playwright QA`: runs after design quality so durable browser tests reflect
  the hardened UI

## Naming boundary

Public user flow stays `/forge`. Internal files may retain upstream naming,
license text, command examples, and comments where preserving source fidelity is
more valuable than cosmetic renaming.
