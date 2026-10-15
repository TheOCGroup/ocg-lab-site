import { test } from 'node:test';
import assert from 'node:assert/strict';
import { StorageEngine } from '../src/data/storageEngine.ts';

test('completed upload does not overwrite task created during network request', async () => {
  const priorLocal=globalThis.localStorage, priorSession=globalThis.sessionStorage, priorFetch=globalThis.fetch;
  const saved=new Map();
  globalThis.localStorage={ getItem:key=>saved.get(key)??null, setItem:(key,value)=>saved.set(key,value) };
  globalThis.sessionStorage={getItem:()=> 'test-key'};
  try {
    StorageEngine.saveProjectAction({id:'first',projectId:'lotus-insight',title:'Initial',owner:'TED',status:'TODO',updatedAt:''});
    let finish;
    globalThis.fetch=()=>new Promise(resolve=>{finish=()=>resolve({ok:true,json:async()=>({lastSyncedAt:'2026-10-13T20:00:00Z'})});});
    const pending=StorageEngine.syncWithCloud(true);
    StorageEngine.saveProjectAction({id:'second',projectId:'lotus-insight',title:'Edited during upload',owner:'TED',status:'TODO',updatedAt:''});
    finish();
    const result=await pending;
    assert.equal(result.success,false);
    assert.deepEqual(StorageEngine.getProjectActions('lotus-insight').map(a=>a.id).sort(),['first','second']);
  } finally {
    if(priorLocal===undefined)delete globalThis.localStorage;else globalThis.localStorage=priorLocal;
    if(priorSession===undefined)delete globalThis.sessionStorage;else globalThis.sessionStorage=priorSession;
    globalThis.fetch=priorFetch;
  }
});
