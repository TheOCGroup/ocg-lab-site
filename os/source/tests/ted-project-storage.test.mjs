import { test } from 'node:test';
import assert from 'node:assert/strict';
import { StorageEngine } from '../src/data/storageEngine.ts';
import { getWorkspaceProjects } from '../src/tedexperience/tedWorkspace.ts';

test('TED reads the latest persisted project state', () => {
  const saved = new Map();
  const previous = globalThis.localStorage;
  globalThis.localStorage = {
    getItem: (key) => saved.get(key) ?? null,
    setItem: (key, value) => saved.set(key, value),
    removeItem: (key) => saved.delete(key),
  };
  try {
    const project = StorageEngine.loadState().projects[0];
    assert.ok(project);
    StorageEngine.updateProject(project.id, { nextAction: 'VERIFY_TED_STORAGE_SENTINEL' });
    const updated = getWorkspaceProjects().find((p) => p.id === project.id);
    assert.equal(updated?.nextAction, 'VERIFY_TED_STORAGE_SENTINEL');
    const reloaded = StorageEngine.loadState().projects.find((p) => p.id === project.id);
    assert.equal(reloaded?.nextAction, 'VERIFY_TED_STORAGE_SENTINEL');
  } finally {
    if (previous === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = previous;
  }
});
