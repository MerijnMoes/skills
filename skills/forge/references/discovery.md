# Forge discovery

Discovery turns the request into grounded project context before any design or
implementation work starts.

For any request that is not purely mechanical after repo context is read, load
`project-knowledge.md` and `methodology/skills/brainstorming/SKILL.md`
through `source-integration.md` before finalizing the discovery output.

Treat "purely mechanical" narrowly: existing behavior and placement are already
clear from repo context, no product/copy/UX/default/data-shape choice remains,
and another agent could implement the change without needing a confirmation
pause.

## Required inputs

- the user request and any linked issue, handoff, or product note
- repo instructions such as `README.md`, `AGENTS.md`, `CLAUDE.md`, or
  `GEMINI.md` when present
- project context docs such as `DESIGN.md`, `PRODUCT.md`, architecture notes,
  `CONTEXT-MAP.md`, `CONTEXT.md`, ADRs, or existing specs
- relevant existing code, tests, routes, components, jobs, schemas, and
  configuration for the changed surface

## Process

1. Identify the intended outcome in one or two sentences.
2. Read the nearest existing context before asking detailed questions.
   If `CONTEXT-MAP.md` exists, use it to find the relevant bounded context.
3. Map the changed surfaces: UI, API, auth, persistence, jobs, integrations,
   config, docs, tests, or release behavior.
4. Look for prior art in the repo before inventing a new pattern.
5. Decompose obviously large requests into smaller work packages before
   writing a spec.
6. For domain-heavy work, run the brainstorming `domain-grilling.md` subroutine
   to resolve terms, context boundaries, and durable decisions.
7. Ask only the questions needed to remove material ambiguity.
8. If repo evidence leaves even modest uncertainty about copy, UX placement,
   defaults, states, serialization, or approval-worthy tradeoffs, run a compact
   brainstorming pass instead of treating the request as implementation-ready.

## Investigation rules

- Prefer repository evidence over assumptions from memory.
- Search for the existing route, component, command, schema, or test before
  proposing a new one.
- Identify the current verification story before changing it.
- If the request mentions an external tool, package, or current service,
  verify the current docs or installed version before relying on memory.
- Separate facts, assumptions, and open questions in the run notes.
- Surface contradictions between code, user statements, and project knowledge
  docs instead of silently choosing one.
- Default to a compact brainstorm/spec approval when the request is concrete
  but still mixes implementation detail with product or UX intent.
- Skip brainstorming only when the remaining work is truly mechanical after
  reading the relevant code and project knowledge.

## Output

Record:

- concise intent
- project knowledge files read
- changed surfaces
- existing patterns to follow
- domain terms, context boundaries, or ADR candidates discovered
- contradictions or stale project knowledge found
- open questions or assumptions
- whether the request is small enough for one `forge` run
- current verification story

## Quality bar

Discovery is complete when another agent could understand why this change
matters, where it belongs in the codebase, and which parts of the system are at
risk without rereading the whole conversation.
