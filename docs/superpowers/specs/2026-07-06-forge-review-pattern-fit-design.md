# Forge Review Pattern Fit

## Goal

Teach `/forge:review` to evaluate architecture and design patterns as part of
the existing design-quality review. The reviewer should be able to recommend
patterns from Patterns.dev and broader architecture practice when they solve a
real problem in the diff, and explain why the pattern improves the design.

## Current Gap

The review flow now has strong `Design Quality Notes` and Ousterhout-style
complexity lenses. It can say whether a module became deeper, whether knowledge
is hidden well, and whether change amplification improved or worsened.

It does not yet explicitly ask whether the changed code is reaching for a known
pattern, whether a named pattern would clarify the design, or whether an
existing pattern in the codebase is already the better fit.

## Design

Add a `Pattern Fit` subsection to `temper`'s design-quality guidance.

The lens should be broad:

- Use Patterns.dev for frontend, web-app, JavaScript, React, Vue, rendering, and
  performance patterns.
- Use general architecture and design patterns where relevant, including
  Strategy, Adapter, Repository, Factory, Observer, Provider, Command, Unit of
  Work, CQRS, state machines, ports/adapters, and composition-oriented
  patterns.
- Use project conventions first. A pattern recommendation must not introduce a
  second competing way to solve a problem the repo already solves consistently.

## Pattern Fit Questions

The reviewer should ask:

- What recurring design problem or likely change point does this diff expose?
- Is the code already half-implementing a known pattern without naming or
  completing it?
- Would a pattern make the module deeper, improve locality, reduce coupling, or
  reduce change amplification?
- Would the pattern add ceremony without hiding real complexity?
- Does the pattern match the stack and the codebase's existing conventions?
- What trade-off does the pattern introduce?
- When would this recommendation become over-engineering?

## Recommendation Shape

Pattern recommendations must be mechanism-level, not label-level. A good note
should include:

- pattern name and source lens when helpful;
- problem in the diff;
- why the pattern fits this problem;
- how it changes coupling, knowledge hiding, interface depth, locality, or
  change amplification;
- trade-off or drawback;
- when not to apply it;
- a simpler alternative if the pattern is not worth its cost.

The reviewer may also produce positive notes when the diff already uses a
pattern well. Those should explain why the pattern is appropriate, not just say
that the pattern is present.

## Anti-Patterns

The review must reject:

- pattern shopping: recommending a pattern because it is recognizable rather
  than because it solves this diff's problem;
- generic advice such as "use Strategy" or "this is clean architecture" without
  a mechanism;
- pattern recommendations that ignore existing project conventions;
- broad rewrites during final hardening;
- treating Patterns.dev as universal authority outside its strongest web,
  frontend, rendering, and performance context.

## Reporting

Pattern-fit guidance should flow through existing `Design Quality Notes`.

Use:

- `kind: strength` when the diff uses a pattern well;
- `kind: risk` when the diff misses a pattern fit or introduces the wrong
  pattern shape;
- `principle` to name `Pattern Fit` and the relevant pattern;
- `mechanism` to explain why the pattern changes complexity or maintainability;
- `trade-off` to explain the cost and when not to apply it.

Do not add a separate final-report section. Pattern-fit notes should appear in
`What went right`, `Learning notes`, or `Findings` only when they are meaningful
under the existing design-quality rules.

## Testing

Update the contract tests so the skill text requires:

- a `Pattern Fit` lens;
- Patterns.dev use for web/frontend/rendering/performance patterns;
- broader architecture pattern coverage beyond Patterns.dev;
- mechanism-level pattern recommendations;
- explicit rejection of pattern shopping and pattern-shaped ceremony;
- reporting through `Design Quality Notes` rather than a new report artifact.
