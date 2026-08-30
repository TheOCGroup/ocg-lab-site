import { generateText } from 'ai';

const buckets=globalThis.__leadflowBuckets||(globalThis.__leadflowBuckets=new Map());
const reply=(res,status,body)=>{res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(body))};
const clean=(v,n=5000)=>typeof v==='string'?v.slice(0,n):'';
const obj=v=>v&&typeof v==='object'&&!Array.isArray(v)?v:{};
function rate(req){const ip=String(req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0].trim(),now=Date.now();let x=buckets.get(ip);if(!x||now-x.start>3600000)x={start:now,count:0};x.count++;buckets.set(ip,x);return x.count<=40}

export default async function handler(req,res){
  if(req.method==='GET')return reply(res,200,{status:'ready',provider:'vercel-ai-gateway',model:'openai/gpt-5.6-luna'});
  if(req.method!=='POST')return reply(res,405,{error:'Method not allowed'});
  if(!rate(req))return reply(res,429,{error:'LeadFlow AI rate limit reached. Try again later.'});
  const body=obj(req.body),message=clean(body.message,4000).trim();
  if(!message)return reply(res,400,{error:'Message is required'});
  const mode=['manage','practice','training'].includes(body.mode)?body.mode:'manage';
  const profile=obj(body.profile),permissions=obj(body.permissions),connections=obj(body.connections),lead=obj(body.lead);
  const rules=Array.isArray(body.rules)?body.rules.slice(0,60).map(r=>clean(r?.text||r,500)).filter(Boolean):[];
  const leadContext={name:clean(lead.name,120),need:clean(lead.need,500),stage:clean(lead.stage,80),priority:clean(lead.priority,30),missing:Array.isArray(lead.missing)?lead.missing.slice(0,20).map(x=>clean(x,200)):[],appointment:clean(lead.appointment,300),followup:clean(lead.followup,300),risk:clean(lead.risk,500),next:clean(lead.next,500),history:Array.isArray(lead.history)?lead.history.slice(-20).map(h=>({ts:clean(h?.ts,80),channel:clean(h?.channel,50),text:clean(h?.text,600)})):[]};
  const system=`You are the customer's LeadFlow AI Lead Employee inside OCG LAB LeadFlow AI PRO.\n\nNON-NEGOTIABLE OPERATING RULES:\n- The supplied business profile, owner rules, lead record, permissions and connector states are the business source of truth.\n- Never invent lead facts, contacts, messages, appointments, prices, policies, service areas, business rules, availability, completed actions or connector results.\n- If information is missing, say exactly what is missing.\n- If an action needs a connector that is not technically connected, never say it happened; draft or recommend the next step instead.\n- Respect permissions. Permission alone never proves a connector is live.\n- Newer owner corrections outrank older instructions when they conflict.\n- For lead-status questions summarize what the person wants, relevant history, completed work, missing information, appointment status, follow-up status, risks and recommended next action.\n- In practice mode, coach and test. Never claim a real customer action occurred.\n- In training mode, turn owner instructions into precise operating rules and identify contradictions or missing boundaries.\n- Be concise, operational and natural.\n\nBUSINESS PROFILE:\n${JSON.stringify(profile)}\n\nOWNER RULES, NEWEST FIRST:\n${JSON.stringify(rules)}\n\nPERMISSIONS:\n${JSON.stringify(permissions)}\n\nCONNECTION STATES:\n${JSON.stringify(connections)}\n\nCURRENT LEAD:\n${JSON.stringify(leadContext)}\n\nMODE: ${mode}`;
  try{
    const result=await generateText({model:'openai/gpt-5.6-luna',system,prompt:message,maxOutputTokens:700});
    return reply(res,200,{text:result.text,model:'openai/gpt-5.6-luna'});
  }catch(error){
    console.error('leadflow-ai-error',error);
    return reply(res,503,{error:'LeadFlow live AI is temporarily unavailable. Deterministic LeadFlow operations remain available.'});
  }
}
