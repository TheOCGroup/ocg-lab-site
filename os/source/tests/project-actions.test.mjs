import { test } from 'node:test';
import assert from 'node:assert/strict';
import { StorageEngine } from '../src/data/storageEngine.ts';

test('project actions are isolated by project and persist across state reload', () => {
  const original = globalThis.localStorage;
  const values = new Map();
  globalThis.localStorage = { getItem: k => values.get(k) ?? null, setItem: (k,v) => values.set(k,v) };
  try {
    const action = { id:'lotus-discovery-01', projectId:'lotus-insight', title:'Confirm discovery scope', owner:'TED', status:'TODO', updatedAt:'' };
    StorageEngine.saveProjectAction(action);
    assert.equal(StorageEngine.getProjectActions('lotus-insight').length, 1);
    assert.equal(StorageEngine.getProjectActions('columbine').length, 0);
    StorageEngine.saveProjectAction({ ...action, status:'IN_PROGRESS' });
    assert.equal(StorageEngine.getProjectActions('lotus-insight').length, 1);
    assert.equal(StorageEngine.loadState().projectActions[0].status, 'IN_PROGRESS');
    assert.throws(() => StorageEngine.saveProjectAction({ ...action, title:'' }));
  } finally { if(original === undefined) delete globalThis.localStorage; else globalThis.localStorage=original; }
});
