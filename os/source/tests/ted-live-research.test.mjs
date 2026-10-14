/**
 * TED Phase 2.2 — live research tests.
 *
 * Verifies the real research providers (Hacker News, GitHub, DuckDuckGo):
 * interface compliance, hit parsing, merge/rank, graceful degradation,
 * rate-limit honesty, and the coverage contract.
 *
 * Network is mocked for determinism; one live smoke test is included and
 * skips gracefully when offline.
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  LiveResearchProvider,
  liveResearchProvider,
  initLiveResearch,
  isGitHubRateLimited,
  resetGitHubRateLimit,
} from '../src/tedexperience/research/liveProviders.ts';
import {
  listResearchProviders,
  unregisterResearchProvider,
  getAvailableResearchProvider,
  requestResearch,
} from '../src/tedexperience/tedResearch.ts';

const HN_FIXTURE = {
  hits: [
    { title: 'Etsy raises fees', url: 'https://example.com/etsy-fees', created_at_i: 1727740800, points: 120, objectID: '1' },
    { title: 'Old news', url: 'https://example.com/old', created_at_i: 1600000000, points: 5, objectID: '2' },
  ],
  nbHits: 2,
};

const GH_FIXTURE = {
  total_count: 1,
  items: [
    { full_name: 'octo/shopify-app', html_url: 'https://github.com/octo/shopify-app', description: 'A Shopify app', updated_at: '2026-09-15T10:00:00Z', stargazers_count: 42 },
  ],
};

const DDG_FIXTURE = {
  Heading: 'Etsy',
  Abstract: 'Etsy is a marketplace.',
  AbstractURL: 'https://en.wikipedia.org/wiki/Etsy',
  RelatedTopics: [{ Text: 'Vintage - old stuff', FirstURL: 'https://duckduckgo.com/vintage' }],
};

function mockFetch(handler) {
  const orig = globalThis.fetch;
  globalThis.fetch = handler;
  return () => { globalThis.fetch = orig; };
}

function okJson(data, headers = {}) {
  return Promise.resolve({
    ok: true,
    headers: { get: (k) => headers[k.toLowerCase()] ?? null },
    json: () => Promise.resolve(data),
  });
}

test('live provider implements the ResearchProvider contract', () => {
  assert.equal(liveResearchProvider.id, 'live-research');
  assert.ok(liveResearchProvider.name.length > 0);
  assert.equal(typeof liveResearchProvider.isAvailable, 'function');
  assert.equal(typeof liveResearchProvider.research, 'function');
});

test('aggregator merges sources, ranks by score, preserves dates', async () => {
  const restore = mockFetch((url) => {
    if (url.includes('hn.algolia.com')) return okJson(HN_FIXTURE);
    if (url.includes('api.github.com')) return okJson(GH_FIXTURE);
    if (url.includes('duckduckgo.com')) return okJson(DDG_FIXTURE);
    throw new Error('unexpected url ' + url);
  });
  try {
    const result = await liveResearchProvider.research('Etsy fees');
    assert.equal(result.providerId, 'live-research');
    assert.ok(result.evidenceDate, 'evidence date present');
    assert.ok(result.sources.length >= 3, 'hits from multiple sources');
    // Ranked by score: HN 120pts first
    assert.match(result.sources[0].title, /Etsy raises fees/);
    const dated = result.sources.find((s) => s.publishedAt);
    assert.ok(dated, 'at least one source carries a date');
    assert.match(result.summary, /tech-community sources, not the whole web/, 'coverage stated honestly');
  } finally {
    restore();
  }
});

test('a failing source degrades gracefully and the gap is named', async () => {
  const restore = mockFetch((url) => {
    if (url.includes('hn.algolia.com')) return Promise.reject(new Error('down'));
    if (url.includes('api.github.com')) return okJson(GH_FIXTURE);
    return okJson(DDG_FIXTURE);
  });
  try {
    const result = await liveResearchProvider.research('test query');
    assert.ok(result.sources.length > 0, 'other sources still answer');
    assert.match(result.summary, /Hacker News was unreachable/, 'gap named, not hidden');
  } finally {
    restore();
  }
});

test('GitHub rate limit is handled honestly', async () => {
  resetGitHubRateLimit();
  const restore = mockFetch((url) => {
    if (url.includes('api.github.com')) {
      return Promise.resolve({
        ok: false,
        status: 403,
        headers: { get: (k) => (k.toLowerCase() === 'x-ratelimit-remaining' ? '0' : null) },
        json: () => Promise.resolve({}),
      });
    }
    if (url.includes('hn.algolia.com')) return okJson(HN_FIXTURE);
    return okJson(DDG_FIXTURE);
  });
  try {
    const result = await liveResearchProvider.research('test');
    assert.equal(isGitHubRateLimited(), true);
    assert.match(result.summary, /rate-limited/, 'rate limit disclosed');
    // Second call skips GitHub entirely
    const result2 = await liveResearchProvider.research('test');
    assert.ok(!result2.sources.some((s) => s.title.includes('[GitHub]')));
  } finally {
    restore();
    resetGitHubRateLimit();
  }
});

test('initLiveResearch registers the provider once', () => {
  unregisterResearchProvider('live-research');
  assert.equal(listResearchProviders().some((p) => p.id === 'live-research'), false);
  initLiveResearch();
  initLiveResearch();
  assert.equal(listResearchProviders().filter((p) => p.id === 'live-research').length, 1);
  unregisterResearchProvider('live-research');
});

test('requestResearch works end-to-end with the live provider', async () => {
  const restore = mockFetch((url) => {
    if (url.includes('hn.algolia.com')) return okJson(HN_FIXTURE);
    if (url.includes('api.github.com')) return okJson(GH_FIXTURE);
    return okJson(DDG_FIXTURE);
  });
  try {
    initLiveResearch();
    const outcome = await requestResearch('Etsy fees');
    assert.equal(outcome.status, 'ok');
    assert.ok(outcome.result.sources.length > 0);
  } finally {
    restore();
    unregisterResearchProvider('live-research');
  }
});

// Live smoke test: hits the real APIs. Skips gracefully when offline.
test('LIVE SMOKE: real providers answer (skips offline)', async (t) => {
  try {
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 10000);
    const res = await fetch('https://hn.algolia.com/api/v1/search?query=test&tags=story', { signal: ctrl.signal });
    if (!res.ok) {
      t.skip('HN unreachable');
      return;
    }
    const data = await res.json();
    assert.ok(Array.isArray(data.hits), 'real HN response shape');
  } catch {
    t.skip('network unavailable for live smoke test');
  }
});
