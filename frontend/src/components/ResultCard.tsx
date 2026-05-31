import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check } from 'lucide-react';

interface ResultCardProps {
  toolName: string;
  fullResult: string;
  timestamp?: number;
  resultLabel?: string;
}

export default function ResultCard({ toolName, fullResult, timestamp, resultLabel = 'Full Analysis' }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
  };

  const dateString = timestamp
    ? new Date(timestamp * 1000).toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: '2-digit',
      })
    : new Date().toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: '2-digit',
      });

  return (
    <article
      className="mt-6 overflow-hidden lex-enter"
      style={{
        background: 'var(--paper-3)',
        border: '1px solid var(--rule-soft)',
        borderRadius: '14px',
      }}
    >
      {/* ─── Ruling header ─────────────────────────────────────────────── */}
      <header
        className="px-6 pt-6 pb-5 relative"
        style={{ borderBottom: '1px solid var(--rule-soft)' }}
      >
        {/* Accent hairline */}
        <span
          aria-hidden
          className="absolute top-0 left-6 w-9 h-[2px]"
          style={{ background: 'var(--accent)' }}
        />

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p
              className="font-mono text-[10px] uppercase tracking-[0.18em]"
              style={{ color: 'var(--ink-3)' }}
            >
              {resultLabel}
            </p>
            <h2
              className="font-display text-[28px] leading-[1.1] mt-1.5"
              style={{ color: 'var(--ink)' }}
            >
              {toolName}
            </h2>
            <p
              className="font-mono text-[11px] tabular mt-2"
              style={{ color: 'var(--ink-3)' }}
            >
              {dateString}
            </p>
          </div>

          <button
            onClick={handleCopy}
            className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
            style={{
              border: '1px solid var(--rule)',
              color: copied ? 'var(--verdict-ok)' : 'var(--ink-2)',
              background: 'transparent',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--paper-2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            aria-label={copied ? 'Copied' : 'Copy full result'}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-[14px] h-[14px]" />}
          </button>
        </div>
      </header>

      {/* ─── Ruling body ───────────────────────────────────────────────── */}
      <div
        className="px-6 py-5
                   prose prose-sm max-w-none
                   prose-headings:font-display
                   prose-h1:text-[24px] prose-h1:leading-tight prose-h1:mt-6 prose-h1:mb-3
                   prose-h2:text-[20px] prose-h2:leading-tight prose-h2:mt-6 prose-h2:mb-3
                   prose-h3:text-[16px] prose-h3:leading-snug prose-h3:mt-5 prose-h3:mb-2
                   prose-p:leading-relaxed
                   prose-strong:font-semibold
                   prose-code:font-mono prose-code:text-[12px]
                   prose-blockquote:border-l-2"
        style={{
          color: 'var(--ink-2)',
          // Prose CSS variables (Tailwind Typography v4)
          '--tw-prose-body':       'var(--ink-2)',
          '--tw-prose-headings':   'var(--ink)',
          '--tw-prose-lead':       'var(--ink-2)',
          '--tw-prose-links':      'var(--accent)',
          '--tw-prose-bold':       'var(--ink)',
          '--tw-prose-counters':   'var(--ink-3)',
          '--tw-prose-bullets':    'var(--rule)',
          '--tw-prose-hr':         'var(--rule-soft)',
          '--tw-prose-quotes':     'var(--ink)',
          '--tw-prose-quote-borders': 'var(--accent)',
          '--tw-prose-code':       'var(--ink)',
          '--tw-prose-pre-code':   'var(--ink)',
          '--tw-prose-pre-bg':     'var(--paper-2)',
          '--tw-prose-th-borders': 'var(--rule)',
          '--tw-prose-td-borders': 'var(--rule-soft)',
        } as React.CSSProperties}
      >
        <ReactMarkdown>{fullResult}</ReactMarkdown>
      </div>
    </article>
  );
}
