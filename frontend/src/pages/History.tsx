import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChevronDown, Clock, Copy, Check } from 'lucide-react';
import { useHistoryStore } from '../store/historyStore';
import { useUserStore } from '../store/userStore';
import { getHistory } from '../lib/api';
import { getToolById } from '../lib/tools.config';
import Loader from '../components/Loader';
import type { HistoryItem } from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────

function buildTeaser(item: HistoryItem): string {
  // Prefer the stored input summary (set at analyze time); fall back to the
  // first non-empty line of the markdown result with light formatting stripped.
  const summary = item.input_summary?.trim();
  if (summary) return summary.slice(0, 110);

  const firstLine = item.full_result
    .split('\n')
    .map((l) => l.replace(/[#*_>`]/g, '').trim())
    .find((l) => l.length > 0) || '';
  return firstLine.slice(0, 110);
}

function formatDate(epochSeconds: number): string {
  return new Date(epochSeconds * 1000).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: '2-digit',
  });
}

// ─── Row ──────────────────────────────────────────────────────────────────

function HistoryRow({ item }: { item: HistoryItem }) {
  const tool = getToolById(item.tool_id);
  const teaser = buildTeaser(item);
  const dateLabel = formatDate(item.created_at);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    await navigator.clipboard.writeText(item.full_result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
  };

  return (
    <details
      className="group overflow-hidden"
      style={{
        background: 'var(--paper-3)',
        border: '1px solid var(--rule-soft)',
        borderRadius: '14px',
      }}
    >
      {/* ── Collapsed header (clickable) ──────────────────────────────── */}
      <summary
        className="cursor-pointer list-none px-5 py-3.5 flex items-center gap-3 select-none"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2.5">
            <h3
              className="font-display text-[17px] leading-none truncate"
              style={{ color: 'var(--ink)' }}
            >
              {tool?.name || item.tool_id}
            </h3>
            <span
              className="font-mono text-[10px] tabular shrink-0"
              style={{ color: 'var(--ink-3)' }}
            >
              {dateLabel}
            </span>
          </div>
          {teaser && (
            <p
              className="text-[12.5px] leading-snug mt-1 line-clamp-1"
              style={{ color: 'var(--ink-2)' }}
            >
              {teaser}
            </p>
          )}
        </div>

        <ChevronDown
          className="w-4 h-4 shrink-0 transition-transform duration-200 group-open:rotate-180"
          strokeWidth={1.8}
          style={{ color: 'var(--ink-3)' }}
          aria-hidden
        />
      </summary>

      {/* ── Expanded body ─────────────────────────────────────────────── */}
      <div
        className="px-5 pb-5 pt-1"
        style={{ borderTop: '1px solid var(--rule-soft)' }}
      >
        {/* Toolbar row */}
        <div className="flex items-center justify-between pt-3 pb-2">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.18em]"
            style={{ color: 'var(--ink-3)' }}
          >
            {item.tool_id === 'lexdraft' ? 'Generated Document' : 'Full Analysis'}
          </p>
          <button
            onClick={handleCopy}
            className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
            style={{
              border: '1px solid var(--rule)',
              color: copied ? 'var(--verdict-ok)' : 'var(--ink-2)',
              background: 'transparent',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--paper-2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            aria-label={copied ? 'Copied' : 'Copy full result'}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>

        {/* Markdown body — token mapping lives in .prose-lexon */}
        <div
          className="prose-lexon prose prose-sm max-w-none
                     prose-headings:font-display
                     prose-h1:text-[22px] prose-h1:leading-tight prose-h1:mt-5 prose-h1:mb-3
                     prose-h2:text-[18px] prose-h2:leading-tight prose-h2:mt-5 prose-h2:mb-2
                     prose-h3:text-[15px] prose-h3:leading-snug prose-h3:mt-4 prose-h3:mb-2
                     prose-p:leading-relaxed
                     prose-strong:font-semibold
                     prose-code:font-mono prose-code:text-[12px]
                     prose-blockquote:border-l-2"
        >
          <ReactMarkdown>{item.full_result}</ReactMarkdown>
        </div>
      </div>
    </details>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default function History() {
  const { items, loading, setItems, setLoading } = useHistoryStore();
  const telegramId = useUserStore((s) => s.telegramId);

  useEffect(() => {
    if (!telegramId) return;
    setLoading(true);
    getHistory(telegramId)
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [telegramId, setItems, setLoading]);

  if (loading) return <Loader text="Loading history..." />;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3"
           style={{ color: 'var(--ink-3)' }}>
        <Clock className="w-10 h-10" strokeWidth={1.4} />
        <p
          className="font-mono text-[10px] uppercase tracking-[0.2em]"
          style={{ color: 'var(--ink-3)' }}
        >
          No results yet
        </p>
        <p className="text-[13px]" style={{ color: 'var(--ink-2)' }}>
          Your paid analyses will appear here
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 rule-above">
        <p
          className="font-mono text-[10px] uppercase tracking-[0.18em]"
          style={{ color: 'var(--ink-3)' }}
        >
          {items.length} {items.length === 1 ? 'result' : 'results'}
        </p>
        <h1
          className="font-display text-[28px] leading-[1.05] mt-1.5"
          style={{ color: 'var(--ink)' }}
        >
          Your case file
        </h1>
      </div>

      <div className="space-y-2.5 lex-stagger">
        {items.map((item) => (
          <HistoryRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
