import { test } from 'node:test';
import assert from 'node:assert/strict';
import { StorageEngine } from '../src/data/storageEngine.ts';
test('equal snapshot timestamps still reconcile different project actions', async () => {
 const oldLocal=globalThis.localStorage, oldSession=globalThis.sessionStorage, oldFetch=globalThis.fetch;
 const values=new Map();
 globalThis.localStorage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)};
 globalThis.sessionStorage={getItem:()=> 'test-key'};
 try {
   StorageEngine.saveProjectAction({id:'local',projectId:'lotus-insight',title:'Local action',owner:'TED',status:'TODO',updatedAt:''});
   const local=StorageEngine.loadState();
   let posts=0;
   globalThis.fetch=async (_url, options={})=>options.method==='POST'
     ? (posts++,{ok:true,json:async()=>({lastSyncedAt:'2099-01-01T00:00:00Z'})})
     : {ok:true,json:async()=>({state:{...local,projectActions:[]}})};
   const result=await StorageEngine.syncWithCloud();
   assert.equal(result.success,true);
   assert.equal(posts,1);
   assert.equal(StorageEngine.getProjectActions('lotus-insight').length,1);
 } finally {
  if(oldLocal===undefined)delete globalThis.localStorage;else globalThis.localStorage=oldLocal;
  if(oldSession===undefined)delete globalThis.sessionStorage;else globalThis.sessionStorage=oldSession;
  globalThis.fetch=oldFetch;
 }
});
