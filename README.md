# merijn-skills

A personal collection of agent skills for AI coding CLIs — installable across [Claude Code](https://code.claude.com), [OpenAI Codex CLI](https://developers.openai.com/codex), [GitHub Copilot CLI](https://docs.github.com/en/copilot), and [50+ other agents](https://github.com/vercel-labs/skills) with a single `npx skills` command.

Currently ships one skill:

## `finalize`

A post-implementation **finalization pipeline**: you run it once a change is
functionally complete, and it brings the change up to shippable standard, then
gives a go/no-go verdict. It remains a **self-contained orchestrator** and a
single `finalize` entrypoint, but `v2` is internally artifact-driven: it builds an
`Evidence Pack`, routes scrutiny by risk, normalizes audit output into a
`Finding Set`, records runtime proof in a `Verification Ledger`, and produces a
verdict-backed `Decision Packet`.

**It never commits, pushes, or opens a PR** — it stops at a verdict and a summary, and leaves all git actions to you.

### The pipeline

```
0  Scope & evidence    diff/context/intent/risk lane/runtime sketch/verifier inventory -> Evidence Pack
1  Best-practices      apply language/framework idioms to the changed code
2  Simplify            local clarity pass on the diff
3  Refactor            fix structural problems worth fixing now
4  Audit               multi-lane review -> candidate findings -> challenge -> Finding Set
5  Update docs         sync README/CLAUDE.md/AGENTS.md/API/config/changelog/example/migration docs with the change
6  Verify              static gates + tests + behavioral probes -> Verification Ledger
7  Validation gate     evaluate evidence, surviving findings, and open risk -> Decision Packet + verdict
8  Report              verdict-first handoff built from the decision packet
```

Findings in the audit and gate phases are adversarially verified — confirmed blockers should survive a trigger test or equally concrete evidence, so the punch list stays trustworthy rather than noisy. The final verdict can still hold a change at `NEEDS REVISION` or `BLOCKED` when important risks remain unproven.

The gate's checklist is a floor, not a ceiling: the skill is expected to generate risk-led bug hypotheses from the actual diff instead of only ticking boxes. Its final output is meant to be evidence-rich and reviewer-ready, so you can turn it into a strong PR or handoff without reconstructing the session.

Best-practices coverage (loaded only for the languages in your diff): general OOP/backend, JavaScript, TypeScript, React, Python, FastAPI, Django/DRF, PHP, Laravel, Vue, CSS, SQL, PostgreSQL, Supabase, plus accessibility & i18n. Cross-cutting references cover project context (architecture boundaries, team conventions, domain rules, tooling/test/doc norms), simplify (local clarity), refactoring (incl. structural-regression), universal-quality anti-patterns, a common-bugs quick sweep, code review (correctness), security review (OWASP Top 10:2025 + conditional API/LLM/security routing), static intelligence, migration safety, observability review, configuration review, behavioral verification, codebase-fit, spec-conformance, finding-verification and triage, test quality, docs, dependency/license audit, performance profiling, and the validation gate.

## Install

Install with the [`skills`](https://github.com/vercel-labs/skills) CLI — one command, no clone, works across Claude Code, Codex, Copilot, and 50+ other agents:

```bash
npx skills add merijnmoes/skills
```

That prompts for which agent(s) to install into. To skip the prompt, target agents directly or install globally:

```bash
npx skills add merijnmoes/skills -a claude-code -a codex -a github-copilot
npx skills add merijnmoes/skills -g        # global (~/<agent>/skills) — available in every project
npx skills add merijnmoes/skills --copy    # copy the files instead of symlinking
```

Then invoke it:

- **Claude Code** — `/finalize`
- **Codex CLI** — `$finalize`, or pick `finalize` from the `/skills` list
- **Copilot CLI** — ask "use the finalize skill" (Copilot has no custom slash commands)

## Repository structure

```
.
└── skills/
    └── finalize/
        ├── SKILL.md
        └── references/   # progressive-disclosure guidance loaded on demand
```

## Adding another skill

Create `skills/<name>/SKILL.md` (plus an optional folder of reference files beside it) and commit it. `npx skills add merijnmoes/skills` will discover and offer it automatically.

## License

[MIT](LICENSE) — use it, fork it, adapt it.
