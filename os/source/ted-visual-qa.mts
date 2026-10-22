/* TED visual/responsive QA: renders the real App at desktop + mobile widths in happy-dom. */
import { Window } from 'happy-dom';

async function renderAt(width: number) {
  const win = new Window({ url: 'http://localhost:5173/' });
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  const doc = win.document;
  for (const key of ['window','document','navigator','localStorage','sessionStorage','location','history','HTMLElement','Element','Node','Event','CustomEvent','KeyboardEvent','MouseEvent','getComputedStyle','requestAnimationFrame','cancelAnimationFrame','MutationObserver','File','FileList','Blob']) {
    if ((win as any)[key] === undefined) continue;
    try {
      Object.defineProperty(globalThis, key, { value: (win as any)[key], configurable: true, writable: true });
    } catch {
      (globalThis as any)[key] = (win as any)[key];
    }
  }
  (globalThis as any).self = globalThis;
  (globalThis as any).URL.createObjectURL = () => 'blob:mock';
  Object.defineProperty(win, 'innerWidth', { value: width, configurable: true });
  win.matchMedia = win.matchMedia || (() => ({ matches: false, media: '', addListener(){}, removeListener(){}, addEventListener(){}, removeEventListener(){}, dispatchEvent: () => false }));
  (globalThis as any).matchMedia = win.matchMedia.bind(win);
  (globalThis as any).IntersectionObserver = class { observe(){} unobserve(){} disconnect(){} };
  (globalThis as any).ResizeObserver = class { observe(){} unobserve(){} disconnect(){} };
  const errors: string[] = [];
  win.addEventListener('error', (e: any) => errors.push(`WINDOW_ERROR: ${e.message || e.error?.message}`));
  const React = await import('react');
  const { createRoot } = await import('react-dom/client');
  const { act } = await import('react');
  const { default: App } = await import('./src/App.tsx');
  const container = doc.createElement('div');
  doc.body.appendChild(container);
  await act(async () => { createRoot(container).render(React.createElement(App)); await new Promise(r => setTimeout(r, 1000)); });
  return { win, doc, act, errors };
}

const R: Record<string, unknown> = {};
const click = async (ctx: any, el: any, wait = 400) => {
  if (!el) return false;
  await ctx.act(async () => { el.dispatchEvent(new ctx.win.MouseEvent('click', { bubbles: true })); await new Promise(r => setTimeout(r, wait)); });
  return true;
};

// ---- DESKTOP (1440) ----
{
  const ctx = await renderAt(1440);
  const { doc } = ctx;
  const text = () => doc.body.textContent || '';
  R.desktop_fiveSecond = text().includes('What do you want to build?') && text().includes('Technology Super Agent');
  R.desktop_sidebarVisible = !!doc.querySelector('aside nav[aria-label="TED navigation"]');
  R.desktop_navItems = Array.from(doc.querySelectorAll('nav[aria-label="TED navigation"] button')).map(b => (b.textContent||'').trim().slice(0,28));
  R.desktop_noOsButtons = !Array.from(doc.querySelectorAll('nav[aria-label="TED navigation"] button')).some(b => /Command|Portfolio|Projects|Operations|Resources|OCG LAB home/i.test(b.textContent||''));
  R.desktop_twoPills = ['I have an idea', "Continue something I'm working on"].every(p => text().includes(p));
  R.desktop_noVoiceNotice = !text().includes('Voice not connected in this build');
  // happy-dom has no SpeechRecognition: mic must report unsupported honestly.
  R.desktop_micHonest = !!doc.querySelector('button[aria-label="Voice not available in this browser"]');
  R.desktop_noComingSoon = !text().includes('Voice coming soon');
  R.desktop_errors = ctx.errors;
}

// ---- MOBILE (390) ----
{
  const ctx = await renderAt(390);
  const { doc } = ctx;
  const text = () => doc.body.textContent || '';
  R.mobile_fiveSecond = text().includes('What do you want to build?');
  // happy-dom applies no CSS: verify the responsive gating classes are in the markup instead
  const deskAside = doc.querySelector('main')?.parentElement?.querySelector('aside');
  R.mobile_sidebarResponsiveGated = !!deskAside && deskAside.className.includes('hidden') && deskAside.className.includes('lg:block');
  R.mobile_menuButton = !!doc.querySelector('button[aria-label="Open navigation"]');
  await click(ctx, doc.querySelector('button[aria-label="Open navigation"]'), 500);
  R.mobile_drawerOpens = !!doc.querySelector('div[role="dialog"][aria-label="TED navigation"]');
  const drawer = doc.querySelector('div[role="dialog"][aria-label="TED navigation"]');
  R.mobile_drawerItems = drawer ? Array.from(drawer.querySelectorAll('nav button')).map(b => (b.textContent||'').trim().slice(0,28)) : [];
  await click(ctx, drawer?.querySelector('button[aria-label="Close navigation"]'), 400);
  R.mobile_drawerCloses = !doc.querySelector('div[role="dialog"][aria-label="TED navigation"]');
  R.mobile_composerVisible = !!doc.querySelector('textarea[placeholder="Tell TED what you want to create..."]');
  R.mobile_errors = ctx.errors;
}

console.log(JSON.stringify(R, null, 2));
process.exit(0);
