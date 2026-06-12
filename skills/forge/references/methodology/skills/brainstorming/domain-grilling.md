# Domain grilling

This guide adapts Matt Pocock's `grill-with-docs` principles for Forge
brainstorming. Use it when the work depends on domain language, context
boundaries, product promises, or architecture decisions.

## When to run

Run domain grilling during brainstorming when any of these are true:

- The request uses fuzzy or overloaded terms such as "account", "workspace",
  "member", "customer", "session", "project", or "flow".
- The work touches domain-heavy behavior such as auth, billing, onboarding,
  permissions, orders, documents, notifications, analytics, or integrations.
- The repo has `CONTEXT.md`, `CONTEXT-MAP.md`, `PRODUCT.md`, `DESIGN.md`, or
  ADRs that might constrain the work.
- The change crosses bounded contexts or introduces a new reusable concept.
- A decision may be hard to reverse or surprising to a future maintainer.

Skip or keep it lightweight for tiny mechanical edits, unless the edit reveals
a naming conflict or durable decision.

## Process

1. Load `references/project-knowledge.md`.
2. Inspect the existing project knowledge and relevant code before asking the
   user anything that the repo can answer.
3. Build a design tree: list the major decisions, dependencies between them,
   and the branches that need to be resolved.
4. Walk the tree one branch at a time. Ask one question at a time and include a
   recommended answer when the trade-off is clear.
5. Challenge glossary conflicts immediately. If two terms appear to mean the
   same thing, or one term means multiple things, stop and resolve the language.
6. Sharpen fuzzy words into concrete definitions, examples, and non-examples.
7. Stress-test the proposed language with scenarios and edge cases.
8. Cross-reference code and docs. Surface contradictions rather than smoothing
   them over.
9. Update durable docs inline when a reusable term, boundary, product truth,
   design rule, or decision is resolved.
10. Offer an ADR sparingly: only when the decision is hard to reverse,
    surprising without context, or reflects a real trade-off.

## Question style

Prefer grounded, decision-shaped questions:

```text
I found `Account` used for both billing ownership and login identity. I
recommend we reserve `Account` for billing ownership and use `User` for login
identity, because that matches the current database boundaries. Does that match
how you think about it?
```

Avoid broad interviews when the repo already contains evidence. "What should
this mean?" is weaker than "The code suggests X, the old docs suggest Y, and I
recommend Z because of A. Which source should win?"

## Outputs

At the end of brainstorming, capture:

- domain terms resolved
- context boundaries or relationships resolved
- project knowledge docs changed
- ADRs created or intentionally skipped
- contradictions found
- remaining open questions

The design spec can reference these outcomes, but long-lived truth belongs in
the project knowledge files, not only in the task spec.
