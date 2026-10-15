import { test } from 'node:test';
import assert from 'node:assert/strict';
import { StorageEngine } from '../src/data/storageEngine.ts';

test('project action reconciliation preserves separate local and cloud tasks', () => {
  const local = [{id:'a',projectId:'lotus-insight',title:'Local task',owner:'TED',status:'TODO',updatedAt:'2026-10-13T13:00:00Z'}];
  const cloud = [{id:'b',projectId:'lotus-insight',title:'Cloud task',owner:'AIDEN',status:'DONE',updatedAt:'2026-10-13T14:00:00Z'}];
  assert.deepEqual(StorageEngine.mergeProjectActions(local,cloud).map(x=>x.id),['a','b']);
});

test('newer task version wins for matching identifiers', () => {
  const prior={id:'a',projectId:'lotus-insight',title:'Scope',owner:'TED',status:'TODO',updatedAt:'2026-10-13T13:00:00Z'};
  const later={...prior,status:'DONE',updatedAt:'2026-10-13T14:00:00Z'};
  assert.equal(StorageEngine.mergeProjectActions([later],[prior])[0].status,'DONE');
  assert.equal(StorageEngine.mergeProjectActions([prior],[later])[0].status,'DONE');
});
