# Forge project knowledge

Project knowledge files are durable memory for the repo. Read them before
asking questions, keep them distinct from task specs, and update them only when
the run resolves reusable truth.

## Artifact contract

- `PRODUCT.md`: strategic product truth. Use it for users, problem framing,
  goals, non-goals, brand personality, positioning, and product promises. Do
  not store implementation plans here.
- `DESIGN.md`: reusable design-system truth. Use it for visual principles,
  tokens, typography, layout rules, components, motion, accessibility posture,
  and design anti-patterns. Do not store product strategy or domain glossary
  entries here.
- `CONTEXT-MAP.md`: map of bounded contexts in multi-domain repos. Use it for
  context names, owned paths, relationships, dependencies, and language
  boundaries.
- `CONTEXT.md`: glossary for one context. Use it for canonical domain terms,
  short definitions, and avoided synonyms. Do not store feature specs,
  implementation notes, or scratchpad reasoning here.
- `docs/adr/*.md`: durable decision records. Use ADRs for decisions that are
  hard to reverse, surprising without context, or the result of a real
  trade-off.
- `docs/forge/specs/*.md`: task-specific design/spec artifacts. Use specs for
  the work currently being planned. Promote only reusable product, design,
  domain, or architecture truth into the durable files above.

## Discovery read gate

At the start of non-trivial work:

1. Scan the repo root and common docs folders for `PRODUCT.md`, `DESIGN.md`,
   `CONTEXT-MAP.md`, `CONTEXT.md`, and `docs/adr/`.
2. If `CONTEXT-MAP.md` exists, use it to find the relevant context docs before
   asking domain questions.
3. If `PRODUCT.md` or `DESIGN.md` is missing and the task depends on product
   or visual truth, either route to the design-studio initialization guidance
   or report the missing artifact as a gap.
4. Prefer repository evidence over guesses. If code, docs, and user statements
   disagree, pause and ask which source should win.

## Update triggers

Update durable project knowledge when the run resolves reusable truth:

- A domain term, avoided synonym, or overloaded word is clarified: update the
  nearest `CONTEXT.md`.
- A context boundary, ownership rule, or cross-context relationship is
  clarified: update `CONTEXT-MAP.md` or the relevant context docs.
- A hard-to-reverse, surprising, or trade-off-heavy architecture decision is
  made: create a short ADR.
- A product audience, promise, anti-goal, positioning point, or brand voice is
  clarified: update `PRODUCT.md`.
- A visual token, component rule, motion rule, layout rule, accessibility rule,
  or design anti-pattern is clarified: update `DESIGN.md`.

Never silently overwrite existing project knowledge. When a change would alter
standing truth, call out the old and new interpretations before editing unless
the user has already approved the change.

## Minimal formats

`CONTEXT.md` should stay glossary-shaped:

```md
# <Context Name> Context

Short description of what this context owns.

## Language

**Canonical Term**: Concise context-specific definition.
_Avoid_: old synonym, ambiguous synonym
```

`CONTEXT-MAP.md` should stay map-shaped:

```md
# Context Map

## Contexts

- **Billing**: owns subscriptions and invoices. Paths: `apps/api/billing/`,
  `packages/billing/`.

## Relationships

- **Billing -> Accounts**: Billing reads account identity but does not own
  profile state.
```

ADRs can be very short when the decision is simple:

```md
# 0001-use-playwright-for-browser-qa

We use Playwright for durable browser QA because Forge needs installable,
repo-local tests that can run through the user's own agent subscription. This
keeps QA evidence portable and avoids coupling the workflow to a paid hosted
QA provider.
```

Add optional sections only when they improve future understanding.

## Reporting requirements

Every final Forge report for non-trivial work should name:

- project knowledge files read
- project knowledge files updated
- relevant project knowledge files intentionally left unchanged
- contradictions, stale docs, or missing docs that affected confidence
