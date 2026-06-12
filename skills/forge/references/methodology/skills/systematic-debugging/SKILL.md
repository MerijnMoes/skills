---
name: systematic-debugging
description: Use when encountering any bug, test failure, performance regression, or unexpected behavior, before proposing fixes
---

# Systematic Debugging

## Overview

Random fixes waste time and create new bugs. Quick patches mask underlying
issues.

**Core principle:** Build a trusted feedback loop, then find root cause before
attempting fixes. Symptom fixes are failure.

**Violating the letter of this process is violating the spirit of debugging.**

## The Iron Law

```
NO FIXES WITHOUT A TRUSTED FEEDBACK LOOP AND ROOT CAUSE INVESTIGATION FIRST
```

If you have not completed Phases 1 and 2, you cannot propose fixes.

## When to Use

Use for ANY technical issue:

- Test failures
- Bugs in production
- Unexpected behavior
- Performance regressions
- Build failures
- Integration issues
- Flaky or timing-dependent behavior

Use this especially when:

- Under time pressure
- "Just one quick fix" seems obvious
- You have already tried multiple fixes
- A previous fix did not work
- You do not fully understand the issue

Do not skip when:

- The issue seems simple
- You are in a hurry
- A stakeholder wants it fixed now

## The Six Phases

You MUST complete each phase before proceeding to the next.

### Phase 1: Build a Feedback Loop

**This is the debugging superpower.** A fast, deterministic, agent-runnable
pass/fail signal makes the rest of debugging mechanical. Spend disproportionate
effort here before reading too deeply or proposing fixes.

Create the smallest useful loop that reproduces the user's symptom:

1. **Failing test** at the nearest real seam: unit, integration, browser, or
   system test.
2. **Curl / HTTP script** against a running dev server.
3. **CLI invocation** with fixture input and expected stdout/stderr.
4. **Headless browser script** with Playwright or Puppeteer assertions on DOM,
   console, network, or screenshots.
5. **Captured trace replay** from a saved request, payload, log, HAR, event, or
   job body.
6. **Throwaway harness** that runs the smallest service, module, or function
   chain that reaches the bug.
7. **Property or fuzz loop** when the bug is "sometimes wrong output."
8. **Bisection harness** when the bug appeared between known commits, data
   versions, dependency versions, or config states.
9. **Differential loop** that runs the same input through old vs. new behavior,
   two configs, or two implementations and diffs the result.
10. **Human-in-the-loop script** only as a last resort. If a person must click,
    script their actions and capture the output so the loop is still
    structured.

Improve the loop before moving on:

- Make it faster by narrowing scope, caching setup, and skipping unrelated boot
  work.
- Make it sharper by asserting on the specific symptom, not merely "it did not
  crash."
- Make it deterministic by pinning time, seeding randomness, isolating the
  filesystem, freezing network calls, and controlling fixtures.

For flaky or timing-dependent bugs, the goal is a higher reproduction rate, not
instant perfection. Loop the trigger repeatedly, parallelize, add stress, narrow
timing windows, and inject sleeps only to raise the failure rate. A 50% flake
is debuggable; a 1% flake usually is not.

If you genuinely cannot build a loop, stop and say so. List what you tried and
ask the user for one of:

- access to the environment that reproduces it
- a captured artifact such as HAR, logs, core dump, database row, fixture, or
  screen recording with timestamps
- permission to add temporary production instrumentation

Do not proceed to Phase 2 until you have a loop you believe in, or you have
explicitly reported why the loop cannot be built.

### Phase 2: Root Cause Investigation

Before attempting any fix:

1. **Run the Feedback Loop**
   - Confirm it produces the failure mode the user described, not a nearby
     failure.
   - Confirm it reproduces across multiple runs, or at a high enough flake
     rate to debug.
   - Capture the exact symptom: error, wrong output, bad DOM state, network
     response, timing, or log line.
   - If the loop shows the wrong bug, fix the loop before touching product
     code.

2. **Read Error Messages Carefully**
   - Do not skip past errors or warnings.
   - Read stack traces completely.
   - Note line numbers, file paths, error codes, and failing assertions.

3. **Check Recent Changes**
   - Review git diff and recent commits.
   - Check new dependencies, config changes, data changes, and environment
     differences.

4. **Read Project Knowledge**
   - Check relevant `CONTEXT.md`, `CONTEXT-MAP.md`, and ADRs for the touched
     area before deciding what "correct" means.
   - If domain docs and code disagree, note the contradiction before fixing.

5. **Gather Evidence in Multi-Component Systems**

   When the system has multiple components, instrument boundaries before
   proposing fixes:

   ```text
   For each component boundary:
     - Log what data enters the component
     - Log what data exits the component
     - Verify environment/config propagation
     - Check state at each layer

   Run once to gather evidence showing where it breaks.
   Then analyze evidence to identify the failing component.
   Then investigate that component.
   ```

6. **Trace Data Flow**
   - Where does the bad value or state originate?
   - What called this with the bad value?
   - Keep tracing upward until you find the source.
   - Fix at the source, not at the symptom.
   - Use `root-cause-tracing.md` for the full backward-tracing technique.

### Phase 3: Pattern Analysis

Find the pattern before fixing:

1. **Find Working Examples**
   - Locate similar working code in the same codebase.
   - Prefer local patterns over generic memory.

2. **Compare Against References**
   - If implementing an established pattern, read the reference completely.
   - Do not skim and adapt from half-understanding.

3. **Identify Differences**
   - List every difference between working and broken behavior.
   - Do not assume "that cannot matter" without evidence.

4. **Understand Dependencies**
   - What settings, config, environment, data shape, or ordering does this
     depend on?

### Phase 4: Hypothesis and Instrumentation

Use the scientific method:

1. **Form Ranked Hypotheses**
   - Generate 3-5 plausible hypotheses before testing any of them.
   - Rank them by likelihood and cheapness to falsify.
   - Make each hypothesis falsifiable:
     "If X is the cause, then Y probe will make the bug disappear, get worse,
     or expose Z evidence."
   - If you cannot state the prediction, sharpen or discard the hypothesis.
   - Show the ranked list to the user when practical. If they are unavailable,
     proceed with your ranking and record it.

2. **Instrument Precisely**
   - Map every probe to one hypothesis prediction.
   - Change one variable at a time.
   - Prefer debugger or REPL inspection when the environment supports it.
   - Use targeted logs only at boundaries that distinguish hypotheses.
   - Tag temporary debug logs with a unique prefix such as `[DEBUG-a4f2]` so
     cleanup can grep for them.
   - Never "log everything and grep."

3. **Handle Performance Regressions as Measurement Problems**
   - Establish a baseline with a timing harness, profiler, browser performance
     trace, query plan, or realistic benchmark.
   - Bisect or profile to the bottleneck before changing code.
   - Re-measure after the fix and check for shifted cost elsewhere.

4. **When You Do Not Know**
   - Say "I do not understand X."
   - Do not pretend to know.
   - Ask for help or gather more evidence.

### Phase 5: Fix and Regression Test

Fix the root cause, not the symptom:

1. **Create a Failing Regression Test**
   - Turn the minimized feedback loop into a failing regression test when a
     correct seam exists.
   - A correct seam exercises the real bug pattern as it occurs at the call
     site.
   - If no correct seam exists, document that as a finding. A shallow test that
     does not exercise the real bug pattern gives false confidence.
   - Use the `superpowers:test-driven-development` skill for proper failing
     tests.

2. **Implement a Single Fix**
   - Address the identified root cause.
   - Change one thing at a time.
   - No "while I am here" improvements.
   - No bundled refactoring.

3. **Verify the Fix**
   - Regression test passes now.
   - Original feedback loop no longer reproduces the bug.
   - Original un-minimized scenario also passes.
   - Nearby and broader tests still pass.

4. **If the Fix Does Not Work**
   - Stop and return to Phase 1 or Phase 4 with the new evidence.
   - Do not stack extra fixes on top.
   - If three distinct fixes fail, stop and question the architecture with the
     user before trying again.

5. **If 3+ Fixes Failed: Question Architecture**
   - Each fix revealing new shared state, coupling, or symptoms elsewhere is an
     architecture smell.
   - Ask whether the pattern is fundamentally sound.
   - Prefer an explicit architecture discussion over patch number four.

### Phase 6: Cleanup and Post-Mortem

Before declaring the bug fixed:

- Re-run the original Phase 1 feedback loop.
- Re-run the regression test, or explicitly document why no correct regression
  seam exists.
- Remove all tagged debug instrumentation and grep for the unique
  `[DEBUG-...]` prefix.
- Delete throwaway harnesses, traces, and prototypes unless they were promoted
  to clearly named test fixtures or debug artifacts.
- State the hypothesis that was correct in the commit, PR, or handoff.
- Ask: what would have prevented this bug? If the answer is architecture,
  missing seams, hidden coupling, unclear domain language, or stale docs, feed
  that back into Forge planning or project knowledge after the fix is proven.

## Red Flags: Stop and Follow Process

If you catch yourself thinking:

- "Quick fix for now, investigate later"
- "Just try changing X and see if it works"
- "Add multiple changes, run tests"
- "Skip the test, I will manually verify"
- "It is probably X, let me fix that"
- "I do not fully understand but this might work"
- "Pattern says X but I will adapt it differently"
- "The repro is flaky, so I will infer the cause"
- "I will leave the debug logs for now"
- "Here are the main problems" followed by fixes without investigation
- "One more fix attempt" after multiple failed fixes

All of these mean: stop. Return to the earliest phase that restores evidence.

## Your Human Partner's Signals You're Doing It Wrong

Watch for these redirections:

- "Is that not happening?" means you assumed without verifying.
- "Will it show us...?" means you should have added evidence gathering.
- "Stop guessing" means you are proposing fixes without understanding.
- "Ultrathink this" means question fundamentals, not just symptoms.
- "We're stuck?" means your approach is not producing evidence.

When you see these, stop and return to Phase 1.

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "Issue is simple, don't need process" | Simple issues have root causes too. Process is fast for simple bugs. |
| "Emergency, no time for process" | Systematic debugging is faster than guess-and-check thrashing. |
| "Just try this first, then investigate" | First fix sets the pattern. Do it right from the start. |
| "I'll write test after confirming fix works" | Untested fixes do not stick. Test first proves it. |
| "Multiple fixes at once saves time" | You cannot isolate what worked. This causes new bugs. |
| "Reference too long, I'll adapt the pattern" | Partial understanding guarantees bugs. Read it completely. |
| "I see the problem, let me fix it" | Seeing symptoms is not understanding root cause. |
| "The repro is flaky, so I'll infer the cause" | Raise the reproduction rate first. Flaky can still be debugged scientifically. |
| "I'll leave the debug logs for now" | Temporary instrumentation must be tagged and removed before completion. |
| "One more fix attempt" | Three failed fixes means question the architecture. |

## Quick Reference

| Phase | Key Activities | Success Criteria |
|-------|----------------|------------------|
| **1. Feedback Loop** | Create fast pass/fail signal | Trusted repro loop exists |
| **2. Root Cause** | Run loop, read errors, check changes, gather evidence | Understand what failed and why |
| **3. Pattern** | Find working examples, compare | Relevant differences identified |
| **4. Hypothesis** | Rank falsifiable theories, instrument one at a time | Hypothesis confirmed or falsified |
| **5. Fix** | Create regression test, fix root cause, verify | Original and minimized repros pass |
| **6. Cleanup** | Remove instrumentation, document lesson | No debug residue, prevention noted |

## When Process Reveals "No Root Cause"

If systematic investigation reveals the issue is truly environmental,
timing-dependent, or external:

1. You completed the process.
2. You documented what you investigated.
3. You implemented appropriate handling: retry, timeout, clearer error, or
   operator-facing diagnostic.
4. You added monitoring or logging for future investigation.

But 95% of "no root cause" cases are incomplete investigation.

## Supporting Techniques

These techniques are part of systematic debugging and available in this
directory:

- `root-cause-tracing.md`: trace bugs backward through the call stack to find
  the original trigger.
- `defense-in-depth.md`: add validation at multiple layers after finding root
  cause.
- `condition-based-waiting.md`: replace arbitrary timeouts with condition
  polling.

Related skills:

- `superpowers:test-driven-development`: create failing regression tests.
- `superpowers:verification-before-completion`: verify the fix before claiming
  success.
