import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const persona = fs.readFileSync(new URL('../src/tedexperience/tedPersona.ts', import.meta.url), 'utf8');
const workspace = fs.readFileSync(new URL('../src/tedexperience/tedWorkspace.ts', import.meta.url), 'utf8');
const page = fs.readFileSync(new URL('../src/pages/TedExperiencePage.tsx', import.meta.url), 'utf8');
const chat = fs.readFileSync(new URL('../src/tedexperience/components/TedChat.tsx', import.meta.url), 'utf8');
const nav = fs.readFileSync(new URL('../src/tedexperience/components/TedNav.tsx', import.meta.url), 'utf8');
const panel = fs.readFileSync(new URL('../src/tedexperience/components/TedArtifactPanel.tsx', import.meta.url), 'utf8');
const history = fs.readFileSync(new URL('../src/tedexperience/tedHistory.ts', import.meta.url), 'utf8');
const handlers = fs.readFileSync(new URL('../src/ted/tedQueryHandlers.ts', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');

test('experience layer delegates to the governed intelligence layer first', () => {
  assert.match(persona, /import \{ handleTedQuery \} from '\.\.\/ted\/tedQueryHandlers'/);
  assert.match(persona, /LAYER 1[\s\S]*?handleTedQuery\(message/);
  assert.match(persona, /if \(governed\)/);
});

test('intelligence layer is not modified by the experience work', () => {
  assert.match(handlers, /export function handleTedQuery/);
  assert.match(handlers, /TED_PRODUCT_STATUS/);
  assert.match(handlers, /TED_COMMERCE_STATUS/);
  assert.match(handlers, /TED_PIPELINE_OVERVIEW/);
  assert.match(handlers, /TED_DEPLOY_STATUS/);
  assert.match(handlers, /TED_TASK/);
});

test('no slash commands or required intent selection in the experience', () => {
  assert.ok(!persona.includes("'/ted'"), 'persona must not define slash commands');
  assert.ok(!/\/[a-z]+ [a-z]+ command/.test(chat), 'chat must not document command syntax');
  assert.match(chat, /Tell TED what you want to create/);
  assert.match(chat, /SUGGESTIONS/);
});

test('TED identity is correct in the experience', () => {
  assert.match(chat, /Technology Super Agent/);
  assert.match(page, /TED · Ready/);
  assert.match(nav, /TED/);
});

test('default screen passes the five-second test', () => {
  assert.match(chat, /What do you want to build\?/);
  assert.match(chat, /Tell TED what you want to create/);
  assert.match(chat, /Tell me what you want to create/);
});

test('empty state offers at most two suggestions, no capability menu', () => {
  const block = chat.match(/const SUGGESTIONS = \[([\s\S]*?)\];/);
  assert.ok(block, 'SUGGESTIONS block must exist');
  const entries = block[1].match(/\{ label:/g) || [];
  assert.ok(entries.length <= 2, `at most two suggestion pills, found ${entries.length}`);
  assert.match(chat, /I have an idea/);
  assert.match(chat, /Continue something I'm working on/);
  assert.ok(!chat.includes('What can you help me build?'), 'capability-menu pill must be gone');
  assert.ok(!chat.includes('What are we building right now?'), 'raw sweep phrasing must not be a pill');
});

test('navigation is minimal: New chat + Previous Work — nothing else', () => {
  assert.match(nav, /New chat/);
  assert.match(nav, /Previous Work/);
  assert.ok(!nav.includes('placeholder="Search"'), 'search input must be gone from the nav');
  assert.ok(!nav.includes('More from OCG LAB'), 'secondary surface section must be gone');
  assert.ok(!/MORE_PAGES/.test(nav), 'nav must not carry a secondary page list');
  assert.ok(!/onNavigatePage/.test(nav), 'nav must not route to OS pages');
  for (const exposed of ['Builds', 'Pipeline', 'Customers', 'Research', "'agents'", 'MARK', 'ORION', 'NOVA', 'Command', 'Portfolio', 'Projects', 'Operations', 'Resources', 'OCG LAB home', 'Systems', 'Workforce', 'Engineering', 'Commercial', 'Knowledge']) {
    assert.ok(!nav.includes(exposed), `nav must not expose ${exposed} in the founder view`);
  }
});

test('no permanent dashboard chrome in the TED room', () => {
  assert.ok(!page.includes('xl:block'), 'page must not keep a permanently visible right panel');
  assert.ok(!/TedContextPanel/.test(page), 'old always-on context panel must be gone');
  assert.ok(!page.includes('Toggle context panel'), 'no permanent context toggle');
});

test('artifact workspace appears only on demand', () => {
  assert.match(panel, /export const TedArtifactPanel/);
  assert.match(panel, /onClose/);
  assert.match(page, /TedArtifactPanel/);
  assert.match(page, /artifact &&/);
  assert.match(persona, /artifact: TedArtifactKind \| null/);
  assert.match(persona, /artifact: 'projects'/);
  assert.match(persona, /artifact: 'project'/);
  assert.match(persona, /artifact: 'product'/);
});

test('site Navbar is hidden inside TED\'s room', () => {
  assert.match(app, /activePage !== "ted" &&/);
});

test('Aiden is not displayed inside TED\'s room', () => {
  for (const [name, src] of [['page', page], ['chat', chat], ['nav', nav], ['panel', panel]]) {
    assert.ok(!src.includes('Aiden'), `${name} must not display Aiden`);
  }
});

test('no false connectivity claims in the TED room', () => {
  for (const [name, src] of [['page', page], ['chat', chat], ['nav', nav], ['panel', panel]]) {
    assert.ok(!src.includes('· Online'), `${name} must not claim Online`);
    assert.ok(!src.includes('CONNECTED'), `${name} must not claim CONNECTED`);
  }
  assert.match(page, /TED · Ready/);
});

test('conversation history is real local persistence, never faked', () => {
  assert.match(history, /localStorage/);
  assert.match(history, /export function loadConversations/);
  assert.match(history, /export function saveConversation/);
  assert.match(history, /deriveTitle/);
  assert.match(page, /loadConversations/);
  assert.match(page, /saveConversation/);
});

test('unavailable data remains fail-closed in the experience layer', () => {
  assert.match(workspace, /STATUS UNAVAILABLE/);
  assert.match(persona, /STATUS UNAVAILABLE/);
  assert.match(persona, /never fabricat|will not invent|won't invent/i);
});

test('MARK / ORION / NOVA role boundaries are intact', () => {
  assert.match(workspace, /MARK.*ORION.*NOVA/s);
  assert.match(persona, /don't pretend to be them|never impersonates/i);
  assert.match(workspace, /notResponsible/);
});

test('context changes are driven by recorded data, never guessed', () => {
  assert.match(workspace, /export function detectWorkspaceContext/);
  assert.match(workspace, /Returns null when nothing recorded matches/);
  assert.match(persona, /detectWorkspaceContext/);
});

test('voice is truthful: real voice path with capability detection, no fake connected claims', () => {
  assert.ok(!chat.includes('Voice not connected in this build'), 'no permanent voice notice in the chat UI');
  assert.ok(!chat.includes('Voice coming soon'), 'coming-soon placeholder replaced by the real voice path');
  assert.match(chat, /Listening — just talk/);
  assert.match(chat, /Voice not available in this browser/);
  assert.match(chat, /End session/);
  assert.match(persona, /voiceSupported/);
  assert.match(persona, /Voice is live/);
});

test('attachments are acknowledged honestly without fake analysis', () => {
  assert.match(page, /ATTACHMENT_NOTE/);
  assert.match(page, /can't open or analyze attached files in this build/i);
});

test('responsive shell keeps TED primary with drawer navigation', () => {
  assert.match(page, /lg:hidden/);
  assert.match(page, /role="dialog"/);
  assert.match(page, /h-dvh/);
  assert.match(chat, /max-w-\[760px\]/);
});

test('TED is the default experience in the OS shell', () => {
  assert.match(app, /useState<Page>\("ted"\)/);
  assert.match(app, /TedExperiencePage/);
  assert.match(app, /activePage === "ted"/);
});
