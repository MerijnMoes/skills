# QA intent draft

The QA intent draft is the human-readable bridge between the approved spec and
durable Playwright/API tests. Use it before substantial QA authoring so the
user can steer assumptions before they become brittle automated tests.

## When to draft

Create a QA intent draft when:

- Playwright is `required` by classification.
- Playwright is `optional` but the change touches an important user journey.
- The affected flow is user-facing, multi-step, auth/stateful, payment-like,
  destructive, data-persistent, or hard to reason about statically.
- The likely E2E coverage is broad enough that user steering could prevent
  wasted or misleading tests.

Skip the pause for tiny, low-risk, obvious changes, but still record the draft
in QA evidence when durable tests are authored.

## Format

```md
## QA Intent Draft

1. [Plain-English scenario]
   Given: [starting state]
   When: [user or system action]
   Then: [observable outcome]
   Risk: [failure mode this catches]
   Automate: [Playwright E2E / Playwright API / unit / integration / manual note]
   Notes: [fixtures, auth, data, environment, or exclusions]
```

## Drafting rules

- Tie every scenario to a changed requirement, changed risk, or likely
  regression path.
- Prefer user-visible outcomes and persisted side effects over implementation
  details.
- Include at least one meaningful negative, recovery, permission, empty, or
  invalid-state path when the changed surface can fail that way.
- Mark scenarios that are better covered by unit, integration, or API tests
  rather than forcing everything into E2E.
- Keep the list short enough to review. Merge duplicate journeys and name what
  is intentionally not covered.

## Pause contract

Pause for user feedback when:

- the route is `required` and the scenario list is more than a trivial smoke;
- product behavior, copy, data setup, or acceptance criteria are ambiguous;
- test data, auth, environment, or destructive actions need user confirmation;
- the agent is about to scaffold significant Playwright coverage from inferred
  behavior.

If the user does not want to pause, continue with the best current draft and
record that it was agent-selected.

## Output

Carry forward:

- accepted, revised, or agent-selected scenario list;
- scenarios automated now;
- scenarios intentionally left manual or deferred;
- assumptions about fixtures, auth, seed data, environment, and destructive
  actions.
