import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
const port=5199;
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port',String(port),'--strictPort'],{cwd:process.cwd(),stdio:'ignore',windowsHide:true});
const pause=(ms)=>new Promise(resolve=>setTimeout(resolve,ms));
let browser;
try {
  let online=false;
  for(let i=0;i<40;i++){try{const r=await fetch('http://127.0.0.1:'+port+'/'); if(r.ok){online=true;break;}}catch{} await pause(500);}
  assert.ok(online,'Vite server unavailable');
  browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  await page.goto('http://127.0.0.1:'+port+'/');
  await page.getByRole('button',{name:'Open Project Workbench'}).click();
  await page.getByRole('heading',{name:'Project Actions'}).first().waitFor({timeout:10000}).catch(()=>{});
  await page.getByRole('textbox',{name:'Task title'}).first().fill('Browser QA task');
  await page.getByRole('textbox',{name:'Task owner'}).first().fill('TED');
  await page.getByRole('button',{name:'Add task'}).first().click();
  await page.getByText('Browser QA task').first().waitFor();
  await page.reload();
  await page.getByRole('button',{name:'Open Project Workbench'}).click();
  await page.getByText('Browser QA task').first().waitFor();
  console.log('PASS: TED to project workbench, create task, persisted reload');
} finally { if(browser)await browser.close();server.kill(); }
