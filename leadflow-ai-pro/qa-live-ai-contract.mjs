import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const api=fs.readFileSync('api/leadflow-ai.js','utf8');
const client=fs.readFileSync('leadflow-ai-pro/live-ai.js','utf8');
const index=fs.readFileSync('leadflow-ai-pro/index.html','utf8');
const isTracked=(path)=>{try{execFileSync('git',['ls-files','--error-unmatch',path],{stdio:'ignore'});return true}catch{return false}};
const checks={
  noNewRuntimeDependency: !isTracked('package.json') && !isTracked('package-lock.json'),
  gatewayKeyServerOnly: api.includes('process.env.AI_GATEWAY_API_KEY') && !client.includes('AI_GATEWAY_API_KEY'),
  sameOriginEndpoint: client.includes("const endpoint='/api/leadflow-ai'"),
  noCorsBroadening: !api.includes('Access-Control-Allow-Origin'),
  failClosedWithoutAuth: api.includes("code: 'AI_AUTH_REQUIRED'") && api.includes("configured ? 'ready' : 'auth_required'"),
  noExternalExecutionClaim: api.includes('You have no authority to execute external actions from this endpoint'),
  connectionStateNotProof: api.includes('they never prove an outside action occurred'),
  deterministicFallback: client.includes('deterministicManage') && client.includes("status('LOCAL MODE','gold')"),
  boundedInput: api.includes('Request too large') && api.includes('slice(0, 60)') && api.includes('slice(-20)'),
  timeoutPresent: api.includes('AbortController') && api.includes('25000'),
  currentGatewayBase: api.includes('https://ai-gateway.vercel.sh/v1/chat/completions'),
  liveLayerOptionalForDeterministicQa: index.includes("has('no-live-ai')") && index.includes("ai.onerror=loadPolish"),
  noStaleAiSdkImport: !api.includes("from 'ai'") && !api.includes('generateText(')
};
const failed=Object.entries(checks).filter(([,v])=>!v).map(([k])=>k);
console.log(JSON.stringify({checks,passed:failed.length===0,failedChecks:failed},null,2));
if(failed.length) process.exit(1);
