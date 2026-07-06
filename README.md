# forge

`forge` is the public workflow system in this repository: an integrated forge
workflow from Merijn Moes for AI coding agents, installable across
[Claude Code](https://code.claude.com), [OpenAI Codex CLI](https://developers.openai.com/codex),
[GitHub Copilot CLI](https://docs.github.com/en/copilot), and [50+ other
agents](https://github.com/vercel-labs/skills) with a single `npx skills`
command.

The repo exposes one public skill with three command forms:

## `forge`

`forge` is the public front door for this repo's integrated workflow. It takes
work from discovery and planning through implementation, QA, and the final
hardening review.

The public command surface is:

- `/forge:setup`: prepare Forge for a new or existing repo.
- `/forge:build`: run the full change workflow.
- `/forge:review`: run the final hardening and readiness review on the current
  diff, optionally against a chosen base.

### What `forge` covers

```
Setup (if requested or blocking context is missing) -> Discover -> Spec ->
Plan -> Visual Plan Review (optional) -> Shape (if needed) -> Implement ->
Design Quality (if needed) -> QA -> Review -> Report
```

`temper` remains part of the system, but it is an internal hardening subsystem
behind `/forge:review`, not a separate public command.

Examples:

- `/forge:setup`
- `/forge:build`
- `/forge:review`
- `/forge:review against base`
- `/forge:review against develop`

Internally, `forge` vendors the full methodology and frontend design-quality
payloads it routes through, so a single install carries the workflow guidance,
design references, detector scripts, and final hardening gate.

### Runtime conventions

- `forge` uses a repo-local `.forge/` folder in target app repos for ephemeral
  run state, pause points, and resume metadata.
- `forge` treats `PRODUCT.md`, `DESIGN.md`, `CONTEXT.md`,
  `CONTEXT-MAP.md`, and ADRs as durable project memory when those files exist.
- `/forge:setup` initializes that project memory selectively, including
  `docs/agents/` setup docs when they are useful for later runs.
- `/forge:review` runs only the final hardening lane against the current branch
  diff. `against base` means auto-detect the repository default branch;
  `against <branch>` overrides the comparison base.
- QA is the top-level quality phase. Playwright remains the durable browser and
  API automation sub-lane when that capability is active.

## Install

Install with the [`skills`](https://github.com/vercel-labs/skills) CLI — one
command, no clone, works across Claude Code, Codex, Copilot, and 50+ other
agents:

```bash
npx skills add merijnmoes/skills
```

That prompts for which agent(s) to install into. To skip the prompt, target
agents directly or install globally:

```bash
npx skills add merijnmoes/skills -a claude-code -a codex -a github-copilot
npx skills add merijnmoes/skills -g        # global (~/<agent>/skills) — available in every project
npx skills add merijnmoes/skills --copy    # copy the files instead of symlinking
```

Then invoke it:

- **Claude Code** — `/forge`
- **Codex CLI** — `$forge`, or pick `forge` from the skills list
- **Copilot CLI** — ask "use the forge skill"

## Repository structure

```text
.
└── skills/
    └── forge/
        ├── SKILL.md
        └── references/   # progressive-disclosure guidance loaded on demand
```

## License

[MIT](LICENSE) — use it, fork it, adapt it.
