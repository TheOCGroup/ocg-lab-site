import { test } from 'node:test';
import assert from 'node:assert/strict';
import { StorageEngine } from '../src/data/storageEngine.ts';
import { AidenEngine } from '../src/components/aiden/aidenEngine.ts';
import { lotusDiscoveryBrief } from '../src/tedexperience/lotusDiscovery.ts';

test('Aiden and TED expose the same persisted Lotus Insight task', () => {
  const previous=globalThis.localStorage;
  const map=new Map();
  globalThis.localStorage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)};
  try {
    StorageEngine.saveProjectAction({id:'task-shared-1',projectId:'lotus-insight',title:'Confirm integration requirements with Al',owner:'TED',status:'TODO',updatedAt:''});
    assert.match(AidenEngine.processQuery('Lotus Insight status').reply,/Confirm integration requirements with Al/);
    assert.match(lotusDiscoveryBrief(),/Confirm integration requirements with Al/);
  } finally {if(previous===undefined) delete globalThis.localStorage;else globalThis.localStorage=previous;}
});
