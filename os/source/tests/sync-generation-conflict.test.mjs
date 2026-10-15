import { test } from 'node:test';
import assert from 'node:assert/strict';
import { StorageEngine } from '../src/data/storageEngine.ts';
test('409 conditional-write conflict retains local and remote tasks without claiming upload',async()=>{
 const a=globalThis.localStorage,b=globalThis.sessionStorage,c=globalThis.fetch;
 const saved=new Map();
 globalThis.localStorage={getItem:k=>saved.get(k)??null,setItem:(k,v)=>saved.set(k,v)};
 globalThis.sessionStorage={getItem:()=> 'test-founder'};
 try {
  StorageEngine.saveProjectAction({id:'local',projectId:'lotus-insight',title:'Local',owner:'TED',status:'TODO',updatedAt:''});
  let requests=0;
  globalThis.fetch=async(_url,opts={})=>{
   requests++;
   if(opts.method==='POST')return {ok:false,status:409};
   return {ok:true,json:async()=>({state:{projectActions:[{id:'remote',projectId:'lotus-insight',title:'Remote',owner:'AIDEN',status:'DONE',updatedAt:'2026-10-14T00:00:00Z'}]}})};
  };
  const result=await StorageEngine.syncWithCloud(true);
  assert.equal(result.success,false);
  assert.equal(result.status,'OFFLINE_CACHED');
  assert.equal(requests,2);
  assert.deepEqual(StorageEngine.getProjectActions('lotus-insight').map(t=>t.id).sort(),['local','remote']);
 }finally{
  if(a===undefined)delete globalThis.localStorage;else globalThis.localStorage=a;
  if(b===undefined)delete globalThis.sessionStorage;else globalThis.sessionStorage=b;
  globalThis.fetch=c;
 }
});
