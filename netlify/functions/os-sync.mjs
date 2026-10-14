import crypto from 'node:crypto';
const BUCKET='ocg-pipeline-reactor-assets',OBJECT='os/canonical_state.json';
const json=(x,status=200)=>new Response(JSON.stringify(x),{status,headers:{'content-type':'application/json','cache-control':'no-store','vary':'Origin'}});
function credentials(req){
 const k=(req.headers.get('x-founder-key')||req.headers.get('authorization')||'').replace(/^Bearer\s+/i,'').trim();
 if(!/^[0-9a-f]{64}$/i.test(k))return null;
 const raw=process.env.OCG_GCS_ADC_ENCRYPTED_JSON;
 if(!raw)throw Error('CLOUD_CREDENTIALS_NOT_CONFIGURED');
 try{const e=JSON.parse(raw),d=crypto.createDecipheriv('aes-256-gcm',Buffer.from(k,'hex'),Buffer.from(e.iv,'hex'));d.setAuthTag(Buffer.from(e.authTag,'hex'));return JSON.parse(d.update(e.encryptedData,'hex','utf8')+d.final('utf8'));}catch{return null;}
}
async function token(c){
 const r=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:c.client_id,client_secret:c.client_secret,refresh_token:c.refresh_token,grant_type:'refresh_token'})});
 if(!r.ok)throw Error('GOOGLE_TOKEN_FAILED');
 const j=await r.json();if(!j.access_token)throw Error('GOOGLE_TOKEN_MISSING');return j.access_token;
}
export default async function handler(req){
 if(req.headers.get('origin')&&req.headers.get('origin')!==new URL(req.url).origin)return json({error:'CROSS_ORIGIN_DENIED'},403);
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers:{'cache-control':'no-store'}});
 if(!['GET','POST'].includes(req.method))return json({error:'METHOD_NOT_ALLOWED'},405);
 let c;try{c=credentials(req);}catch(e){return json({error:e.message},503);}
 if(!c)return json({error:'UNAUTHORIZED_FOUNDER_ACCESS'},401);
 try{
 const t=await token(c),h={Authorization:'Bearer '+t},u='https://storage.googleapis.com/storage/v1/b/'+BUCKET+'/o/'+encodeURIComponent(OBJECT);
 if(req.method==='GET'){
  const r=await fetch(u+'?alt=media',{headers:h});
  if(r.status===404)return json({exists:false},404);
  if(!r.ok)return json({error:'GCS_READ_FAILED'},502);
  const state=await r.json();return json({ok:true,source:'google_cloud_storage',state,syncedAt:state.lastSyncedAt,version:state.version});
 }
 const body=await req.json().catch(()=>null);
 if(!body||typeof body!=='object'||Array.isArray(body))return json({error:'INVALID_PAYLOAD'},400);
 const m=await fetch(u+'?fields=generation',{headers:h});
 if(m.status!==404&&!m.ok)return json({error:'GCS_METADATA_FAILED'},502);
 const gen=m.status===404?'0':String((await m.json()).generation||'');
 if(!/^[0-9]+$/.test(gen))return json({error:'GCS_GENERATION_INVALID'},502);
 const state={...body,version:body.version||'3.0.0',lastSyncedAt:new Date().toISOString(),syncActor:'OCG LAB OS'};
 const upload='https://storage.googleapis.com/upload/storage/v1/b/'+BUCKET+'/o?uploadType=media&name='+encodeURIComponent(OBJECT)+'&ifGenerationMatch='+gen;
 const r=await fetch(upload,{method:'POST',headers:{...h,'content-type':'application/json'},body:JSON.stringify(state)});
 if(r.status===412)return json({error:'CLOUD_GENERATION_CONFLICT'},409);
 if(!r.ok)return json({error:'GCS_WRITE_FAILED'},502);
 return json({ok:true,lastSyncedAt:state.lastSyncedAt,version:state.version});
 }catch(e){console.error('[os-sync]',e?.message);return json({error:'CLOUD_SYNC_UNAVAILABLE'},502);}
}
export const config={path:'/api/os/sync'};
