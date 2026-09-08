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

test('moes is a public review skill with its own command surface', async () => {
  const skill = await read('skills/moes/SKILL.md');

  assert.match(skill, /^name: moes$/m);
  assert.match(skill, /^description: Use when/m);
  assert.doesNotMatch(skill, /\/forge:review/);
  assert.doesNotMatch(skill, /temper/);

  for (const phrase of [
    '/moes against <branch>',
    'Architecture Map',
    'Finding Set',
    'Verification Ledger',
    'Decision Packet',
    'advisory',
  ]) {
    assertIncludesIgnoringCase(skill, phrase);
  }
});

test('moes shared-file references resolve inside this repo', async () => {
  const skill = await read('skills/moes/SKILL.md');
  const delegation = await read('skills/forge/references/delegation.md');
  const review = await read('skills/forge/references/worker-templates/review.md');

  assertIncludesIgnoringCase(skill, '../forge/references/delegation.md');
  assertIncludesIgnoringCase(skill, '../forge/references/worker-templates/review.md');
  assertIncludesIgnoringCase(delegation, 'wave');
  assertIncludesIgnoringCase(review, 'Covered:');
});

test('moes criticality counterweights hold', async () => {
  const lifecycle = await read('skills/moes/references/findings-lifecycle.md');

  for (const phrase of [
    'mechanism gate',
    'why-no-more-risks',
    'surprise pass',
    'belowBarReason',
    'The low tier is exempt',
    'dismissedLedger',
    'executor of the surprise pass',
    'gap-hunting mode',
    'doubles as the gap-hunt',
    'with a converged audit',
  ]) {
    assertIncludesIgnoringCase(lifecycle, phrase);
  }

  const designQuality = await read('skills/moes/references/design-quality.md');
  const codebaseFit = await read('skills/moes/references/codebase-fit.md');

  for (const phrase of [
    'Red-team presumption',
    'one steelman per unique mechanism',
    'never go through sharded verification',
    'steelmanOf',
  ]) {
    assertIncludesIgnoringCase(designQuality, phrase);
  }

  assertIncludesIgnoringCase(codebaseFit, 'Red-team presumption');

  const arch = await read('skills/moes/references/architecture-review.md');

  for (const phrase of [
    'blocking exception',
    'if and only if the mechanism triple is present',
    'non-exhaustive examples',
  ]) {
    assertIncludesIgnoringCase(arch, phrase);
  }
});
