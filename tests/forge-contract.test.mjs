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
    'qa',
    'temper',
    'blocker',
    'next_recommended_step',
  ]) {
    assert.match(stateContract, new RegExp(`\\b${field}\\b`));
  }

  assert.match(stateContract, /\.forge\/state\.json/);
  assert.match(stateContract, /atomic/i);
  assert.match(stateContract, /resume/i);
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

  for (const command of ['/forge:setup', '/forge:build', '/forge:review']) {
    assert.match(skill, new RegExp(command.replace('/', '\\/')));
    assert.match(routing, new RegExp(command.replace('/', '\\/')));
  }

  assert.match(skill, /Design Quality \(if needed\) -> QA -> Review -> Report/);
  assert.doesNotMatch(skill, /Playwright Author -> Playwright Verify -> Playwright Explore/);
  assert.match(preflight, /\/forge:review against <branch>/);
  assert.match(preflight, /comparison base/i);
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
