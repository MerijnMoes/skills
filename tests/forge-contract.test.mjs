import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function read(path) {
  return readFile(new URL(path, root), 'utf8');
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
    'temper verdict',
    'next recommended step',
  ]) {
    assert.match(reporting, new RegExp(phrase, 'i'));
  }

  assert.match(stateContract, /evidence/i);
  assert.match(stateContract, /final report/i);
});
