# Finalize Phase 1 clean-coding and OOP guidance design

## Context

`finalize` Phase 1 already has a strong language/framework routing model plus a
baseline OOP reference for backend and business-logic changes. The current
`general-oop.md` covers SOLID, layering, composition, and domain modeling well,
but it leaves a gap around local code clarity and some pragmatic object-design
heuristics that are frequently surfaced by books like *Clean Code*, *Code
Complete*, and *Design Patterns*.

The goal is not to turn Phase 1 into a book summary or a style lecture. The
goal is to make the Phase 1 best-practices pass better at improving real diffs
with concise, actionable guidance.

## Goals

- Strengthen Phase 1 for backend and business-logic diffs.
- Keep the loading model simple and predictable.
- Separate object-design guidance from local readability guidance.
- Express guidance as diff-oriented review heuristics, not tutorial prose.
- Preserve the existing role boundaries between Phase 1, Phase 2, and Phase 3.

## Non-goals

- Do not add book-by-book reference files.
- Do not move clean-coding guidance into later phases.
- Do not turn `finalize` into a broad architecture-teaching workflow.
- Do not create a full design-pattern catalog.
- Do not add abstract purity rules likely to create noisy or low-value findings.

## Proposed structure

Phase 1 should load four complementary kinds of guidance for backend and
business-logic changes:

1. `general-oop.md` for object design, boundaries, and pragmatic pattern use.
2. `clean-coding.md` for local readability and maintainability heuristics.
3. Language/framework references for ecosystem-specific idioms.
4. `universal-quality.md` for cross-language smells that do not fit cleanly
   into the other buckets.

This keeps the mental model simple:

- `general-oop.md` answers whether the design boundaries are sound.
- `clean-coding.md` answers whether the code is clear and maintainable.
- Language/framework files answer whether the code is idiomatic for the stack.
- `universal-quality.md` catches broader cross-language quality issues.

## File changes

### 1. Expand `references/best-practices/general-oop.md`

Keep the current SOLID, dependency, layering, control-flow, and domain-modeling
material, and add targeted sections for the missing object-design guidance:

- `Cohesion & coupling`
  - Keep related data and behavior together.
  - Reduce the number of reasons a module changes.
  - Avoid modules that know too much about neighboring internals.
- `Patterns, pragmatically`
  - Prefer composition over inheritance.
  - Reach for patterns such as strategy, adapter, and factory when they remove
    a real extension or integration problem in the diff.
  - Avoid speculative abstraction and pattern-shaped indirection with no
    present payoff.
- `Redesign smells`
  - Growing type-switches and variant branching.
  - Feature envy.
  - Anemic domain objects with rules spread across callers.
  - Orchestration blobs and god services.
  - Inheritance used only for reuse.
- `Checklist refresh`
  - Ask whether each changed boundary has one clear job.
  - Ask whether variants are modeled in a way that will scale without
    repeatedly editing the same conditional hotspot.
  - Ask whether abstractions are earning their cost now.

### 2. Add `references/best-practices/clean-coding.md`

This new file should focus on code clarity that applies across languages:

- `Naming`
  - Intention-revealing names.
  - Searchable names.
  - Consistent vocabulary.
  - Avoid misleading abbreviations and overloaded terms.
- `Functions & methods`
  - Single purpose.
  - Prefer explicit inputs and outputs.
  - Avoid flag arguments when practical.
  - Minimize hidden side effects.
- `Control flow`
  - Make the happy path obvious.
  - Flatten unnecessary nesting.
  - Replace opaque conditionals with named predicates or helpers when that
    improves comprehension.
- `Comments`
  - Comments should explain why, constraints, or tradeoffs.
  - Do not narrate what the code already says clearly.
  - Stale comments count against code quality.
- `Errors & boundaries`
  - Validate at the edges.
  - Fail clearly.
  - Preserve useful error context.
  - Do not swallow important failures silently.
- `Duplication & consistency`
  - Remove duplication of knowledge, not just duplicated text.
  - Keep similar cases shaped similarly.
  - Avoid multiple competing patterns for the same job inside one diff.
- `Checklist`
  - End with a short, diff-oriented review checklist Phase 1 can apply quickly.

## Routing change

Update `references/best-practices/_index.md` so that backend and
business-logic changes load both:

- `general-oop.md`
- `clean-coding.md`

This should remain a single routing rule rather than several special cases. The
change should be minimal and preserve the existing progressive-disclosure model.

## Phase boundaries

This design intentionally keeps the new material in Phase 1 only.

- Phase 1 remains the place for best-practice and readability improvements.
- Phase 2 remains focused on local simplification and accidental complexity.
- Phase 3 remains focused on structural refactoring worth doing now.

This avoids scattering similar guidance across multiple phases and keeps each
phase's purpose legible.

## Writing style requirements

Both references should be written for agent consumption:

- concise
- direct
- diff-oriented
- checklist-backed
- pragmatic rather than absolute

The files should not be framed as book commentary. They should translate the
useful principles into practical review rules the agent can apply immediately.

## Validation

The design is successful if:

- Phase 1 gains clearer coverage for naming, comments, local readability, and
  error-handling quality.
- OOP guidance becomes stronger on cohesion, coupling, and pragmatic use of
  patterns without becoming abstract or bloated.
- The routing model stays easy to understand.
- The new reference load remains small enough to justify inclusion on every
  backend/business-logic finalize pass.

## Implementation sketch

1. Edit `general-oop.md` to add the missing object-design sections and refresh
   the checklist.
2. Add `clean-coding.md` with concise review heuristics and a short checklist.
3. Update `_index.md` so Phase 1 loads both files for backend and
   business-logic changes.
4. Keep the wording aligned with existing Phase 1 references so the new files
   feel native to `finalize`.
