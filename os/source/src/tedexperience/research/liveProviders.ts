/**
 * TED Super Agent — LIVE research providers (Phase 2.2).
 *
 * Real current-information sources reachable from a static browser app:
 * no API keys, CORS-open, no backend required.
 *
 * - Hacker News (hn.algolia.com): dated tech stories with points and URLs.
 * - GitHub (api.github.com): live repository data — stars, update dates,
 *   descriptions. 60 req/hr unauthenticated; rate-limit handled honestly.
 * - DuckDuckGo Instant Answer: background abstracts (thin for news).
 *
 * HONESTY CONTRACT: these are tech-community sources, not "the whole web".
 * Every hit carries its source and date. The aggregator states its coverage
 * plainly and never claims broader research than it performed. When a
 * source fails or rate-limits, the others still answer and the gap is named.
 */

import {
  ResearchProvider,
  ResearchResult,
  ResearchSource,
  listResearchProviders,
  registerResearchProvider,
} from '../tedResearch';

export interface ResearchHit {
  title: string;
  url: string;
  snippet: string;
  /** ISO date string when known, else null. */
  publishedAt: string | null;
  sourceName: string;
  /** points (HN) or stars (GitHub), for ranking. */
  score: number;
}

interface SourceDef {
  id: string;
  name: string;
  /** What this source honestly covers. */
  coverage: string;
  freshness: 'realtime' | 'daily' | 'static';
  search(query: string): Promise<ResearchHit[]>;
}

const FETCH_TIMEOUT_MS = 8000;

async function fetchJson(url: string, headers: Record<string, string> = {}): Promise<any> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { headers, signal: ctrl.signal });
    if (!res.ok) {
      const err: any = new Error(`HTTP ${res.status}`);
      err.status = res.status;
      err.rateLimited =
        res.status === 403 && res.headers.get('X-RateLimit-Remaining') === '0';
      throw err;
    }
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

const hnSource: SourceDef = {
  id: 'hacker-news',
  name: 'Hacker News',
  coverage: 'tech-community stories and discussions (not the whole web)',
  freshness: 'realtime',
  async search(query: string): Promise<ResearchHit[]> {
    const data = await fetchJson(
      `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=story`,
    );
    return (data.hits || []).slice(0, 8).map((h: any) => ({
      title: h.title || '(untitled)',
      url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
      snippet: '',
      publishedAt: h.created_at_i
        ? new Date(h.created_at_i * 1000).toISOString().slice(0, 10)
        : null,
      sourceName: 'Hacker News',
      score: h.points || 0,
    }));
  },
};

let githubRateLimited = false;

const githubSource: SourceDef = {
  id: 'github',
  name: 'GitHub',
  coverage: 'public repositories: stars, update dates, descriptions',
  freshness: 'realtime',
  async search(query: string): Promise<ResearchHit[]> {
    if (githubRateLimited) return [];
    try {
      const data = await fetchJson(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=updated&order=desc&per_page=8`,
        { Accept: 'application/vnd.github+json' },
      );
      return (data.items || []).map((r: any) => ({
        title: r.full_name,
        url: r.html_url,
        snippet: (r.description || '').slice(0, 200),
        publishedAt: r.updated_at ? r.updated_at.slice(0, 10) : null,
        sourceName: 'GitHub',
        score: r.stargazers_count || 0,
      }));
    } catch (err: any) {
      if (err.rateLimited) {
        githubRateLimited = true;
      }
      throw err;
    }
  },
};

const ddgSource: SourceDef = {
  id: 'duckduckgo',
  name: 'DuckDuckGo',
  coverage: 'background abstracts (thin for breaking news)',
  freshness: 'static',
  async search(query: string): Promise<ResearchHit[]> {
    const data = await fetchJson(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`,
    );
    const hits: ResearchHit[] = [];
    if (data.Abstract) {
      hits.push({
        title: data.Heading || query,
        url: data.AbstractURL || '',
        snippet: data.Abstract.slice(0, 300),
        publishedAt: null,
        sourceName: 'DuckDuckGo',
        score: 0,
      });
    }
    for (const t of (data.RelatedTopics || []).slice(0, 4)) {
      if (t.Text && t.FirstURL) {
        hits.push({
          title: t.Text.split(' - ')[0].slice(0, 80),
          url: t.FirstURL,
          snippet: t.Text.slice(0, 200),
          publishedAt: null,
          sourceName: 'DuckDuckGo',
          score: 0,
        });
      }
    }
    return hits;
  },
};

const SOURCES: SourceDef[] = [hnSource, githubSource, ddgSource];

export function isGitHubRateLimited(): boolean {
  return githubRateLimited;
}

export function resetGitHubRateLimit(): void {
  githubRateLimited = false;
}

/**
 * Live research aggregator: fans out to every source, merges hits ranked by
 * score, and returns a factual summary with source/date evidence. A source
 * that fails degrades gracefully — the gap is named, not hidden.
 */
export class LiveResearchProvider implements ResearchProvider {
  readonly id = 'live-research';
  readonly name = 'Live research (Hacker News + GitHub + DuckDuckGo)';

  isAvailable(): boolean {
    try {
      return typeof fetch !== 'undefined' && (typeof navigator === 'undefined' || navigator.onLine !== false);
    } catch {
      return false;
    }
  }

  async research(query: string): Promise<ResearchResult> {
    const settled = await Promise.allSettled(SOURCES.map((s) => s.search(query)));
    const hits: ResearchHit[] = [];
    const failed: string[] = [];
    settled.forEach((r, i) => {
      if (r.status === 'fulfilled') hits.push(...r.value);
      else failed.push(SOURCES[i].name);
    });
    hits.sort((a, b) => b.score - a.score);
    const top = hits.slice(0, 10);

    const sources: ResearchSource[] = top.map((h) => ({
      title: `${h.title} [${h.sourceName}]`,
      url: h.url,
      publishedAt: h.publishedAt ?? undefined,
    }));

    const summary = this.summarize(query, top, failed);
    return {
      query,
      providerId: this.id,
      summary,
      sources,
      evidenceDate: new Date().toISOString().slice(0, 10),
    };
  }

  private summarize(query: string, hits: ResearchHit[], failed: string[]): string {
    const lines: string[] = [];
    if (hits.length === 0) {
      lines.push(`Live research for "${query}" returned nothing usable right now.`);
    } else {
      lines.push(`Live research for "${query}" — top ${hits.length} hits from tech-community sources:`);
      lines.push('');
      for (const h of hits.slice(0, 6)) {
        const date = h.publishedAt ? ` (${h.publishedAt})` : '';
        const score = h.score > 0 ? ` [${h.score}]` : '';
        lines.push(`• ${h.title}${date}${score} — ${h.sourceName}`);
        if (h.snippet) lines.push(`  ${h.snippet.slice(0, 160)}`);
      }
    }
    lines.push('');
    lines.push(
      'Coverage: Hacker News discussions + GitHub repositories + background abstracts. ' +
      'These are tech-community sources, not the whole web — treat accordingly.',
    );
    if (failed.length > 0) {
      lines.push(`Note: ${failed.join(', ')} ${failed.length === 1 ? 'was' : 'were'} unreachable for this query.`);
    }
    if (githubRateLimited) {
      lines.push('Note: GitHub search is rate-limited right now (60/hr without a key); results exclude GitHub.');
    }
    return lines.join('\n');
  }
}

/** The singleton live provider. */
export const liveResearchProvider = new LiveResearchProvider();

/**
 * Register the live provider. Called by the app bootstrap (not on import),
 * so tests keep a clean registry and the provider only activates in a real
 * browser with network access.
 */
export function initLiveResearch(): void {
  if (!listResearchProviders().some((p) => p.id === liveResearchProvider.id)) {
    registerResearchProvider(liveResearchProvider);
  }
}
