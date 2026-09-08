import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function read(path) {
  return readFile(new URL(path, root), 'utf8');
}

function assertIncludesIgnoringCase(actual, expected) {
  assert.ok(
    actual.toLowerCase().includes(expected.toLowerCase()),
    `Expected text to include ${expected}`,
  );
}

function assertIncludesIgnoringCaseAndWhitespace(actual, expected) {
  const normalize = (text) => text.toLowerCase().replace(/\s+/g, ' ').trim();
  assert.ok(
    normalize(actual).includes(normalize(expected)),
    `Expected text to include ${expected}`,
  );
}

test('forge delegation contract is bounded, non-recursive, and hang-resilient', async () => {
  const delegation = await read('skills/forge/references/delegation.md');
  const implementation = await read('skills/forge/references/implementation.md');
  const temper = await read('skills/forge/references/temper/SKILL.md');

  // Contract is referenced from implementation and temper.
  assert.match(implementation, /delegation\.md/);
  assert.match(temper, /delegation\.md/);

  // Task parcel must be explicit (scope, forbidden actions, output).
  for (const phrase of [
    'Scope and relevant files',
    'Allowed and forbidden actions',
    'Expected output',
    'Acceptance criteria',
  ]) {
    assertIncludesIgnoringCase(delegation, phrase);
  }

  // No recursive delegation by default.
  assertIncludesIgnoringCaseAndWhitespace(delegation, 'must not spawn additional workers');
  assertIncludesIgnoringCase(delegation, 'Do not delegate further');

  // Parent recovery reflex: never wait indefinitely.
  for (const phrase of [
    'never wait indefinitely',
    'Inline fallback',
    'Continue degraded',
    'Pause',
  ]) {
    assertIncludesIgnoringCase(delegation, phrase);
  }

  assert.match(temper, /never returns/);
  assert.match(implementation, /never wait indefinitely/);
});

test('forge has an implementation converge gate and per-phase checklists', async () => {
  const skill = await read('skills/forge/SKILL.md');
  const routing = await read('skills/forge/references/workflow-routing.md');
  const converge = await read('skills/forge/references/converge.md');
  const checklists = await read('skills/forge/references/checklists.md');
  const stateContract = await read('skills/forge/references/state-contract.md');
  const planning = await read('skills/forge/references/planning.md');

  // Converge is in the phase order and referenced from routing and state.
  assert.match(skill, /Implement -> Converge -> Design Quality/);
  assert.match(routing, /Implement -> Converge -> Design Quality/);
  assert.match(routing, /converge\.md/i);
  assert.match(routing, /checklists\.md/i);
  assert.match(stateContract, /"converge"/);
  assert.match(stateContract, /converge\.status/);
  assert.match(stateContract, /checklists\.current_phase/);

  // Converge gate: evidence-backed coverage, no silent gaps.
  for (const phrase of [
    'acceptance criterion',
    'coverage',
    'gaps-found',
    'Loop back',
    'converged',
  ]) {
    assertIncludesIgnoringCase(converge, phrase);
  }

  // Checklists: entry/exit per phase, load on demand, persisted.
  for (const phrase of [
    'entry',
    'exit',
    'load-on-demand',
    'not-started',
  ]) {
    assertIncludesIgnoringCase(checklists, phrase);
  }

  // Planning tasks now name the acceptance criterion they satisfy.
  assertIncludesIgnoringCase(planning, 'acceptance criterion');
});

test('forge delegation uses canonical worker role templates', async () => {
  const delegation = await read('skills/forge/references/delegation.md');
  const routing = await read('skills/forge/references/workflow-routing.md');

  // Delegation and routing point at the worker-templates mechanism.
  assert.match(delegation, /worker-templates\/<role>\.md/);
  assert.match(delegation, /fill its\s*task-parcel block/i);
  assertIncludesIgnoringCase(delegation, 'research, review, implementer, or qa');
  assert.match(routing, /worker-templates\//);

  // Every role template is self-contained: scope, forbidden, no recursion,
  // evidence-backed output with an explicit output format.
  for (const file of ['research', 'review', 'implementer', 'qa']) {
    const tpl = await read(`skills/forge/references/worker-templates/${file}.md`);
    for (const phrase of [
      'Task parcel',
      'Forbidden',
      'delegate to any further worker',
      'Output format',
      'BLOCKED:',
      'Acceptance criteria',
    ]) {
      assertIncludesIgnoringCaseAndWhitespace(tpl, phrase);
    }
  }
});

test('forge exposes a structured run-state contract', async () => {
  const skill = await read('skills/forge/SKILL.md');
  const pauseResume = await read('skills/forge/references/pause-resume.md');
  const stateContract = await read('skills/forge/references/state-contract.md');

  assert.match(skill, /references\/state-contract\.md/);
  assert.match(pauseResume, /state-contract\.md/);

  for (const field of [
    'schema_version',
    'run_id',
    'current_phase',
    'classification',
    'spec',
    'plan',
    'visual_plan',
    'qa',
    'review',
    'temper',
    'blocker',
    'next_recommended_step',
  ]) {
    assert.match(stateContract, new RegExp(`\\b${field}\\b`));
  }

  assert.match(stateContract, /\.forge\/state\.json/);
  assert.match(stateContract, /atomic/i);
  assert.match(stateContract, /resume/i);

  for (const phase of ['visual-plan', 'qa', 'review']) {
    assert.match(stateContract, new RegExp(`\\b${phase}\\b`));
  }

  for (const phrase of [
    'visual plan artifact path',
    'watched local E2E result',
    'CI-equivalent E2E result',
    'review verdict',
  ]) {
    assertIncludesIgnoringCase(stateContract, phrase);
    assertIncludesIgnoringCase(pauseResume, phrase);
  }
});

test('forge final reporting is backed by structured evidence', async () => {
  const reporting = await read('skills/forge/references/reporting.md');
  const stateContract = await read('skills/forge/references/state-contract.md');

  for (const phrase of [
    'spec path',
    'plan path',
    'Playwright',
    'QA capability matrix',
    'review verdict',
    'next recommended step',
  ]) {
    assert.match(reporting, new RegExp(phrase, 'i'));
  }

  assert.match(stateContract, /evidence/i);
  assert.match(stateContract, /final report/i);
});

test('forge review teaches design quality without replacing the verdict', async () => {
  const temper = await read('skills/forge/references/temper/SKILL.md');
  const finalReporting = await read('skills/forge/references/temper/references/final-reporting.md');
  const findingsLifecycle = await read('skills/forge/references/temper/references/findings-lifecycle.md');
  const designQuality = await read('skills/forge/references/temper/references/design-quality.md');

  assert.match(temper, /references\/design-quality\.md/);
  assert.match(
    temper,
    /\| 4 — Audit \|[^\n]*`Finding Set`, `Design Quality Notes`, specialty lane registry/,
  );
  assert.match(
    temper,
    /\| 7 — Validation gate \|[^\n]*`Evidence Pack`, `Finding Set`, `Design Quality Notes`, `Verification Ledger`/,
  );
  assert.match(
    temper,
    /\[Conditional: include only when meaningful design strengths exist\][\s\S]*## What went right/,
  );

  for (const doc of [temper, finalReporting, findingsLifecycle, designQuality]) {
    assert.match(doc, /Learning notes?/i);
    assert.match(doc, /Design Quality Notes/i);
  }

  for (const phrase of [
    'why it matters',
    'trade-off',
    'drawback',
    'when not to apply',
    'alternative',
    'mechanism',
  ]) {
    assertIncludesIgnoringCase(finalReporting, phrase);
    assertIncludesIgnoringCase(findingsLifecycle, phrase);
  }

  for (const phrase of [
    'meaningful examples',
    'generic praise',
    'what went right',
    'must be omitted',
  ]) {
    assertIncludesIgnoringCase(finalReporting, phrase);
    assertIncludesIgnoringCase(designQuality, phrase);
  }

  const decisionPacket = findingsLifecycle.match(
    /## Decision packet([\s\S]*?)## Reporting-term mapping/,
  );
  assert.ok(decisionPacket, 'Expected a Decision packet section');
  const decisionPacketInputs = decisionPacket[1].match(/Inputs:\n([\s\S]*?)\nOutputs:/);
  assert.ok(decisionPacketInputs, 'Expected Decision packet inputs');
  const decisionPacketOutputs = decisionPacket[1].match(/Outputs:\n([\s\S]*?)\nWhen relevant/);
  assert.ok(decisionPacketOutputs, 'Expected Decision packet outputs');
  assertIncludesIgnoringCase(
    decisionPacketInputs[1],
    'design-quality notes with `report`, `finding`, or meaningful `defer`',
  );
  assertIncludesIgnoringCase(
    decisionPacketOutputs[1],
    'report-facing design strengths and design-risk notes',
  );

  for (const phrase of [
    'A Philosophy of Software Design',
    'deep module',
    'shallow module',
    'information hiding',
    'change amplification',
    'cognitive load',
    'unknown unknowns',
    'tactical',
    'strategic',
    'SOLID',
    'not authority',
  ]) {
    assertIncludesIgnoringCase(designQuality, phrase);
  }

  for (const phrase of [
    'Pattern Fit',
    'Patterns.dev',
    'frontend, web-app, JavaScript, React, Vue, rendering, and performance patterns',
    'Strategy, Adapter, Repository, Factory, Observer, Provider, Command, Unit of Work, CQRS',
    'pattern shopping',
    'pattern-shaped ceremony',
    'pattern recommendations must be mechanism-level',
    'problem in the diff',
    'why the pattern fits this problem',
    'a simpler alternative if the pattern is not worth its cost',
    'for pattern guidance use `Pattern Fit / <pattern name>`',
  ]) {
    assertIncludesIgnoringCaseAndWhitespace(designQuality, phrase);
  }
});

test('forge exposes the simplified public command surface and workflow overview', async () => {
  const skill = await read('skills/forge/SKILL.md');
  const routing = await read('skills/forge/references/workflow-routing.md');
  const preflight = await read('skills/forge/references/preflight.md');
  const readme = await read('README.md');

  for (const command of ['/forge:setup', '/forge:build', '/forge:review']) {
    assert.match(skill, new RegExp(command.replace('/', '\\/')));
    assert.match(routing, new RegExp(command.replace('/', '\\/')));
    assert.match(readme, new RegExp(command.replace('/', '\\/')));
  }

  assert.match(skill, /Design Quality \(if needed\) -> QA -> Review -> Report/);
  assert.doesNotMatch(skill, /Playwright Author -> Playwright Verify -> Playwright Explore/);
  assert.match(preflight, /\/forge:review against <branch>/);
  assert.match(preflight, /comparison base/i);
  assert.doesNotMatch(readme, /forge temper/);
  assert.doesNotMatch(readme, /forge setup/);
});

test('forge setup distinguishes existing and new project modes while preserving setup behavior', async () => {
  const setup = await read('skills/forge/references/setup.md');

  for (const phrase of [
    'existing-project setup',
    'new-project setup',
    '/forge:setup existing',
    '/forge:setup new',
    'PRODUCT.md',
    'DESIGN.md',
    'CONTEXT.md',
    'docs/agents/verification.md',
    'preferred local E2E mode',
    'security',
  ]) {
    assertIncludesIgnoringCase(setup, phrase);
  }

  assert.match(setup, /should not become.*generator/i);
});

test('forge offers visual plans as an opt-in rendered planning review surface', async () => {
  const skill = await read('skills/forge/SKILL.md');
  const routing = await read('skills/forge/references/workflow-routing.md');
  const planning = await read('skills/forge/references/planning.md');
  const visualPlan = await read('skills/forge/references/visual-plan.md');

  assert.match(skill, /references\/visual-plan\.md/);
  assert.match(routing, /Visual Plan Review/);
  assert.match(planning, /visual plan/i);

  for (const phrase of [
    'ask the user',
    'do not assume',
    'dependency-light',
    'static HTML',
    'browser-openable',
    'without Agent-Native',
    'without new npm dependencies',
    'after planning',
    'before implementation',
  ]) {
    assertIncludesIgnoringCase(visualPlan, phrase);
  }

  assert.doesNotMatch(visualPlan, /local-files mode/i);
  assert.doesNotMatch(visualPlan, /plan\.mdx/i);
});

test('forge qa is one umbrella with durable watched and ci-equivalent playwright verification', async () => {
  const skill = await read('skills/forge/SKILL.md');
  const routing = await read('skills/forge/references/workflow-routing.md');
  const qa = await read('skills/forge/references/qa.md');
  const playwright = await read('skills/forge/references/playwright-qa.md');
  const matrix = await read('skills/forge/references/qa-capability-matrix.md');
  const reporting = await read('skills/forge/references/reporting.md');

  assert.match(skill, /-> QA -> Review -> Report/);
  assert.match(routing, /QA umbrella/i);

  for (const phrase of [
    'QA Intent Draft',
    'Capability Check',
    'Playwright Author',
    'Watched Local Verify',
    'CI-Equivalent Verify',
    'Exploratory QA',
    'Capability Matrix',
  ]) {
    assert.match(qa, new RegExp(phrase, 'i'));
  }

  assert.match(playwright, /@playwright\/test/);
  assert.match(playwright, /npx playwright test <changed-tests> --headed/);
  assert.match(playwright, /^npx playwright test <changed-tests>$/m);
  assert.match(playwright, /same durable tests/i);
  assert.match(matrix, /Security checks/);
  assert.match(reporting, /watched local E2E/i);
  assert.match(reporting, /CI-equivalent E2E/i);
});

test('forge phase 4 runs a parallel fan-out with coverage receipts', async () => {
  const temper = await read('skills/forge/references/temper/SKILL.md');

  for (const phrase of [
    'line-walk',
    'removed-behavior',
    'cross-file tracer',
    'language-pitfall',
    'reuse',
    'altitude',
    'consistency',
    'personas',
    'specialized finders',
    'Covered:',
    'territory',
    'effort',
  ]) {
    assertIncludesIgnoringCase(temper, phrase);
  }
});
