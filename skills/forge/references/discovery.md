# Forge discovery

Discovery turns the request into grounded project context before any design or
implementation work starts.

For non-trivial requests, load `methodology/skills/brainstorming/SKILL.md`
through `source-integration.md` before finalizing the discovery output.

## Required inputs

- the user request and any linked issue, handoff, or product note
- repo instructions such as `README.md`, `AGENTS.md`, `CLAUDE.md`, or
  `GEMINI.md` when present
- project context docs such as `DESIGN.md`, `PRODUCT.md`, architecture notes,
  or existing specs
- relevant existing code, tests, routes, components, jobs, schemas, and
  configuration for the changed surface

## Process

1. Identify the intended outcome in one or two sentences.
2. Read the nearest existing context before asking detailed questions.
3. Map the changed surfaces: UI, API, auth, persistence, jobs, integrations,
   config, docs, tests, or release behavior.
4. Look for prior art in the repo before inventing a new pattern.
5. Decompose obviously large requests into smaller work packages before
   writing a spec.
6. Ask only the questions needed to remove material ambiguity.

## Investigation rules

- Prefer repository evidence over assumptions from memory.
- Search for the existing route, component, command, schema, or test before
  proposing a new one.
- Identify the current verification story before changing it.
- If the request mentions an external tool, package, or current service,
  verify the current docs or installed version before relying on memory.
- Separate facts, assumptions, and open questions in the run notes.

## Output

Record:

- concise intent
- relevant project-context files
- changed surfaces
- existing patterns to follow
- open questions or assumptions
- whether the request is small enough for one `forge` run
- current verification story

## Quality bar

Discovery is complete when another agent could understand why this change
matters, where it belongs in the codebase, and which parts of the system are at
risk without rereading the whole conversation.
