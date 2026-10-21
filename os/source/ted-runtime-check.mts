/* TED SIMPLICITY runtime QA: renders the real App in happy-dom, drives the new UX. */
import { Window } from 'happy-dom';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
const win = new Window({ url: 'http://localhost:5173/' });
const doc = win.document;
for (const key of ['window','document','navigator','localStorage','sessionStorage','location','history','HTMLElement','Element','Node','Event','CustomEvent','KeyboardEvent','MouseEvent','getComputedStyle','requestAnimationFrame','cancelAnimationFrame','MutationObserver','File','FileList','Blob']) {
  if (!(globalThis as any)[key] && (win as any)[key] !== undefined) (globalThis as any)[key] = (win as any)[key];
}
(globalThis as any).self = globalThis;
(globalThis as any).URL.createObjectURL = () => 'blob:mock';
win.matchMedia = win.matchMedia || (() => ({ matches: false, media: '', addListener(){}, removeListener(){}, addEventListener(){}, removeEventListener(){}, dispatchEvent: () => false }));
(globalThis as any).matchMedia = win.matchMedia.bind(win);
(globalThis as any).IntersectionObserver = class { observe(){} unobserve(){} disconnect(){} };
(globalThis as any).ResizeObserver = class { observe(){} unobserve(){} disconnect(){} };
if (!win.HTMLElement.prototype.scrollIntoView) win.HTMLElement.prototype.scrollIntoView = function () {};

const errors: string[] = [];
win.addEventListener('error', (e: any) => errors.push(`WINDOW_ERROR: ${e.message || e.error?.message}`));

const React = await import('react');
const { createRoot } = await import('react-dom/client');
const { act } = await import('react');
const { default: App } = await import('./src/App.tsx');

const container = doc.createElement('div');
doc.body.appendChild(container);
await act(async () => { createRoot(container).render(React.createElement(App)); await new Promise(r => setTimeout(r, 1200)); });

const text = () => doc.body.textContent || '';
const lower = () => text().toLowerCase();
const R: Record<string, unknown> = {};
const click = async (el: any, wait = 400) => {
  if (!el) return false;
  await act(async () => { el.dispatchEvent(new win.MouseEvent('click', { bubbles: true })); await new Promise(r => setTimeout(r, wait)); });
  return true;
};
const byAria = (label: string) => doc.querySelector(`button[aria-label="${label}"]`) as any;
const byText = (tag: string, t: string) => Array.from(doc.querySelectorAll(tag)).find(e => (e.textContent||'').trim() === t) as any;
const typeInto = async (value: string) => {
  const input = doc.querySelector('textarea[placeholder="Tell TED what you want to create..."]') as any;
  const desc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(input), 'value');
  await act(async () => { desc?.set?.call(input, value); input.dispatchEvent(new win.Event('input', { bubbles: true })); await new Promise(r => setTimeout(r, 300)); });
};

// 1. Five-second test
R.fiveSecond = text().includes('What do you want to build?') && text().includes('Technology Super Agent');
R.composer = !!doc.querySelector('textarea[placeholder="Tell TED what you want to create..."]');
R.tedReady = text().includes('TED · Ready');
R.noAiden = !text().includes('Aiden');
R.noFalseClaims = !['· Online','CONNECTED','SYNCED','DEPLOYED'].some(w => text().includes(w));

// 2. Minimal nav: New chat + Previous Work only — no search, no secondary sections
const navEl0 = doc.querySelector('nav[aria-label="TED navigation"]');
R.navMinimal = text().includes('New chat') && text().includes('Previous Work')
  && !doc.querySelector('input[placeholder="Search"]')
  && !(navEl0?.textContent?.includes('More from OCG LAB'));
R.navClean = !['Builds','Pipeline','Customers','Research','Command','Portfolio','Projects','Operations','Resources','Systems','Workforce','Engineering','Commercial','Knowledge'].some(w => {
  const navEl = doc.querySelector('nav[aria-label="TED navigation"]');
  return navEl?.textContent?.includes(w);
}) && !(doc.querySelector('nav[aria-label="TED navigation"]')?.textContent?.includes('MARK'));
R.noPermanentPanel = !text().includes('Nothing to show yet') && !text().includes('Context appears here');
R.noPermanentVoiceNotice = !text().includes('Voice not connected in this build');

// 3. Continue pill -> recorded status sweep opens the projects artifact on demand
await click(byText('button', "Continue something I'm working on"), 1200);
R.continueReply = text().includes("What we're working on");
await click(byAria('Close panel'), 400);
R.artifactCloses = !text().includes("What we're working on");

// 4. New chat, then idea pill
await click(byText('button', 'New chat'), 500);
R.newChatClears = !lower().includes("let's work it");
await click(byText('button', 'I have an idea'), 900);
R.ideaReply = lower().includes("let's work it");

// 5. Product portfolio -> products artifact
await typeInto('What products do we have?');
await click(byAria('Send message'), 1200);
R.productsArtifact = text().includes('Our products');
await click(byAria('Close panel'), 300);

// 6. Mic: honest voice state. happy-dom has no SpeechRecognition -> unsupported,
// so tapping the mic must say so plainly (never "coming soon", never a fake voice).
// With recognition, one tap opens a persistent session (no per-turn presses).
await click(byAria('Voice not available in this browser'), 900);
R.micTruth =
  text().includes("Voice isn't available in this browser") &&
  !text().includes('Voice coming soon') &&
  !text().includes('Voice not connected in this build');
R.noFakeVoiceStates = !text().includes('Listening — just talk') && !text().includes('Speaking — mic interrupts');

// 7. Attachment truthfulness
await click(byAria('Attach a file'), 300);
R.attachPopover = text().includes('Image / screenshot');
const fileInput = doc.querySelector('input[type="file"]') as any;
if (fileInput) {
  const file = new win.File(['x'], 'brief.pdf', { type: 'application/pdf' });
  await act(async () => {
    Object.defineProperty(fileInput, 'files', { value: [file], configurable: true });
    fileInput.dispatchEvent(new win.Event('change', { bubbles: true }));
    await new Promise(r => setTimeout(r, 400));
  });
  await typeInto('Here is the brief.');
  await click(byAria('Send message'), 1200);
  R.attachTruth = lower().includes("can't open or analyze attached files");
}

// 8. Previous work: conversation persisted, New chat clears
await click(byText('button', 'New chat'), 500);
R.newChatClears2 = !lower().includes("let's work it");
R.previousWork = text().includes('Previous Work');

// 9. Commerce still fail-closed
await typeInto('How much does the Real Estate Investor AI Playbook cost?');
await click(byAria('Send message'), 1200);
R.noInventedPrice = !text().includes('$39.00') || lower().includes('recorded');

// 10. PHASE 2 acceptance flow
await click(byText('button', 'New chat'), 500);
await typeInto("What's the best way to connect Stripe to this app?");
await click(byAria('Send message'), 1200);
R.stripeGuidance = lower().includes('secret key') && lower().includes('webhook');

await typeInto("What's new with Etsy digital products right now?");
await click(byAria('Send message'), 1200);
R.etsyResearchLive =
  lower().includes('researching that live') && !lower().includes('etsy just announced');

await typeInto('Update my Etsy listing.');
await click(byAria('Send message'), 1200);
// Full-text check: the honest "not connected" reply must appear, and TED must
// never claim he updated the listing ("Done, updated...").
R.etsyActionHonest =
  text().includes('Etsy write access is not connected') &&
  !/done.{0,40}updat(ed|ing) your (etsy )?listing/i.test(text());

await typeInto('How do I improve my Etsy listing SEO?');
await click(byAria('Send message'), 1200);
R.etsyStructural = lower().includes('tags') && !lower().includes('fee is now');

await typeInto('Deploy this to production.');
await click(byAria('Send message'), 1200);
R.deployFailClosed = /no .* connect|cannot/i.test(text()) && !/^\s*Done\b/m.test(text());

await typeInto('Read that answer to me.');
await click(byAria('Send message'), 1200);
R.voiceCommandRoutes = lower().includes('reading that back');

// PHASE 2.3 — Product Memory & Inventory acceptance
R.productsSection = text().includes('Your Products');
R.noFooterClutter = !['Powerful Systems', 'Storefront Active', 'Pricing Matrix', 'AI Weekly', 'Ocasio Collective'].some(w => text().includes(w));
const openBtn = Array.from(doc.querySelectorAll('button')).find(e => (e.textContent||'').trim() === 'Open Product') as any;
R.productDetailOpens = await (async () => {
  if (!openBtn) return false;
  await click(openBtn, 600);
  return text().includes('What are we building');
})();
const continueBtn = Array.from(doc.querySelectorAll('button')).find(e => (e.textContent||'').trim() === 'Continue with TED') as any;
R.continueWithTed = await (async () => {
  if (!continueBtn) return false;
  await click(continueBtn, 600);
  return text().includes("let's finish this");
})();

R.windowErrors = errors;
console.log(JSON.stringify(R, null, 2));
process.exit(0);
