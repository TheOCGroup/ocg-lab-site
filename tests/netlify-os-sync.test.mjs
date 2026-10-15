import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../netlify/functions/os-sync.mjs';
const request=(method='GET',headers={},body)=>new Request('https://ocg-lab-os.netlify.app/api/os/sync',{method,headers,...(body?{body:JSON.stringify(body)}:{})});
test('Netlify cloud sync rejects unauthenticated requests',async()=>{
 const response=await handler(request());
 assert.equal(response.status,401);
 assert.equal((await response.json()).error,'UNAUTHORIZED_FOUNDER_ACCESS');
});
test('Netlify cloud sync rejects cross-origin calls',async()=>{
 const response=await handler(request('GET',{origin:'https://attacker.example'}));
 assert.equal(response.status,403);
 assert.equal((await response.json()).error,'CROSS_ORIGIN_DENIED');
});
test('Netlify cloud sync reports missing encrypted credentials safely',async()=>{
 const previous=process.env.OCG_GCS_ADC_ENCRYPTED_JSON;
 delete process.env.OCG_GCS_ADC_ENCRYPTED_JSON;
 try{
  const response=await handler(request('GET',{'x-founder-key':'a'.repeat(64)}));
  assert.equal(response.status,503);
  assert.equal((await response.json()).error,'CLOUD_CREDENTIALS_NOT_CONFIGURED');
 }finally{if(previous===undefined)delete process.env.OCG_GCS_ADC_ENCRYPTED_JSON;else process.env.OCG_GCS_ADC_ENCRYPTED_JSON=previous;}
});
