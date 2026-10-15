import { test } from 'node:test';
import assert from 'node:assert/strict';
import { StorageEngine } from '../src/data/storageEngine.ts';

test('Lotus Insight client exists with TED ownership', () => {
  const record = StorageEngine.loadState().clientSolutions.find((x) => x.id === 'client-lotus-insight');
  assert.equal(record?.leadAgent, 'TED');
  assert.match(record?.summary ?? '', /not yet independently verified/i);
});

test('older browser state receives canonical Lotus record without losing existing clients', () => {
  const previous = globalThis.localStorage;
  const map = new Map();
  globalThis.localStorage = {getItem:(key)=>map.get(key)??null,setItem:(key,v)=>map.set(key,v)};
  try {
    map.set('ocg_lab_os_state_v2', JSON.stringify({clientSolutions:[{id:'existing-client',clientName:'Keep Me'}]}));
    const results=StorageEngine.loadState().clientSolutions;
    assert.ok(results.some(x=>x.id==='existing-client'));
    assert.ok(results.some(x=>x.id==='client-lotus-insight'));
  } finally {if(previous === undefined) delete globalThis.localStorage;else globalThis.localStorage=previous;}
});
