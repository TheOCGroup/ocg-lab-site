import { test } from 'node:test';
import assert from 'node:assert/strict';
import { StorageEngine } from '../src/data/storageEngine.ts';

test('newer authenticated cloud snapshot without objectives keeps local project actions', async () => {
  const oldLocal=globalThis.localStorage, oldSession=globalThis.sessionStorage, oldFetch=globalThis.fetch;
  const values=new Map();
  globalThis.localStorage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)};
  globalThis.sessionStorage={getItem:()=> 'founder-test-key'};
  try {
    StorageEngine.saveProjectAction({id:'local-only',projectId:'lotus-insight',title:'Local task',owner:'TED',status:'TODO',updatedAt:''});
    globalThis.fetch=async()=>({ok:true,json:async()=>({state:{lastSyncedAt:'2099-01-01T00:00:00Z',projectActions:[{id:'cloud-only',projectId:'lotus-insight',title:'Cloud task',owner:'AIDEN',status:'TODO',updatedAt:'2026-10-13T00:00:00Z'}]}})});
    const result=await StorageEngine.syncWithCloud();
    assert.equal(result.status,'LOCAL_DOMINANT');
    assert.deepEqual(StorageEngine.getProjectActions('lotus-insight').map(x=>x.id).sort(),['cloud-only','local-only']);
  } finally {
    if(oldLocal===undefined)delete globalThis.localStorage;else globalThis.localStorage=oldLocal;
    if(oldSession===undefined)delete globalThis.sessionStorage;else globalThis.sessionStorage=oldSession;
    globalThis.fetch=oldFetch;
  }
});
