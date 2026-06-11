# forge

`forge` is the public workflow system in this repository: an integrated forge
workflow from Merijn Moes for AI coding agents, installable across
[Claude Code](https://code.claude.com), [OpenAI Codex CLI](https://developers.openai.com/codex),
[GitHub Copilot CLI](https://docs.github.com/en/copilot), and [50+ other
agents](https://github.com/vercel-labs/skills) with a single `npx skills`
command.

The repo exposes one public entrypoint:

## `forge`

`forge` is the public front door for this repo's integrated workflow. It takes
work from discovery and planning through implementation, Playwright-guided QA,
and the internal `temper` final hardening gate.

### What `forge` covers

```
Discover -> Spec -> Plan -> Shape (if needed) -> Implement -> Playwright Author
-> Playwright Verify -> Playwright Explore (conditional) -> Temper -> Report
```

`temper` remains part of the system, but it is an internal hardening subsystem
inside `forge`, not a separate public command.

### Runtime conventions

- `forge` uses a repo-local `.forge/` folder in target app repos for ephemeral
  run state, pause points, and resume metadata.
- Playwright is a first-class QA lane, and durable browser tests are created or
  updated by default for affected flows when that lane is active.

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
