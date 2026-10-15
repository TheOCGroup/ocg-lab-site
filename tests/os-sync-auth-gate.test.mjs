import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/os/sync.js';

function response() {
  return { statusCode: 200, headers: {}, setHeader(k,v){this.headers[k]=v;}, status(n){this.statusCode=n;return this;}, json(v){this.payload=v;return this;}, end(){return this;} };
}
test('cloud sync rejects absent founder credentials before contacting cloud', async () => {
  const originalFetch=globalThis.fetch;
  let called=false;
  globalThis.fetch=async()=>{called=true; throw Error('unexpected network request');};
  try {
    const res=response();
    await handler({method:'GET',headers:{host:'example.test','x-forwarded-proto':'https'}},res);
    assert.equal(res.statusCode,401);
    assert.equal(res.payload.error,'UNAUTHORIZED_FOUNDER_ACCESS');
    assert.equal(called,false);
  } finally {globalThis.fetch=originalFetch;}
});
test('cross-origin state requests are rejected before authentication', async()=>{
 const res=response();
 await handler({method:'GET',headers:{host:'example.test',origin:'https://attacker.example','x-forwarded-proto':'https'}},res);
 assert.equal(res.statusCode,403);
 assert.equal(res.payload.error,'CROSS_ORIGIN_DENIED');
});
