import React from 'react';

/**
 * Minimal, safe markdown renderer for TED replies.
 * Supports the subset the intelligence layer emits: ### headings, **bold**,
 * `code`, • / - bullet lines, and paragraphs. All HTML is escaped first —
 * founder input and handler output are never injected as raw HTML.
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function inline(text: string): string {
  let out = escapeHtml(text);
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>');
  out = out.replace(/`([^`]+)`/g, '<code class="rounded bg-slate-900/[0.06] px-1.5 py-0.5 font-mono text-[0.82em] text-slate-800">$1</code>');
  return out;
}

export function renderTedMarkdown(source: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const lines = source.split('\n');
  let key = 0;
  let listBuffer: string[] = [];

  const flushList = () => {
    if (!listBuffer.length) return;
    nodes.push(
      <ul key={`l-${key++}`} className="my-2 space-y-1.5">
        {listBuffer.map((item, i) => (
          <li
            key={i}
            className="flex gap-2.5 text-[13.5px] leading-relaxed text-slate-700"
            dangerouslySetInnerHTML={{ __html: `<span class="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-blue-600 to-emerald-500"></span><span>${inline(item)}</span>` }}
          />
        ))}
      </ul>,
    );
    listBuffer = [];
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (/^#{1,3}\s+/.test(line)) {
      flushList();
      const text = line.replace(/^#{1,3}\s+/, '');
      nodes.push(
        <h4 key={`h-${key++}`} className="mb-1.5 mt-1 font-heading text-[15px] font-bold tracking-tight text-slate-900"
          dangerouslySetInnerHTML={{ __html: inline(text) }} />,
      );
    } else if (/^[•\-]\s+/.test(line)) {
      listBuffer.push(line.replace(/^[•\-]\s+/, ''));
    } else if (line === '') {
      flushList();
    } else {
      flushList();
      nodes.push(
        <p key={`p-${key++}`} className="my-1.5 text-[13.5px] leading-relaxed text-slate-700"
          dangerouslySetInnerHTML={{ __html: inline(line) }} />,
      );
    }
  }
  flushList();
  return nodes;
}

export const TedMarkdown: React.FC<{ text: string }> = ({ text }) => (
  <div className="ted-markdown">{renderTedMarkdown(text)}</div>
);
