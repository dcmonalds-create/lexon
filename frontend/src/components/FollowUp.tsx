import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { followUp } from '../lib/api';
import { useUserStore } from '../store/userStore';

interface QA {
  question: string;
  answer: string;
}

interface FollowUpProps {
  fullResult: string;
}

export default function FollowUp({ fullResult }: FollowUpProps) {
  const [question, setQuestion] = useState('');
  const [history, setHistory] = useState<QA[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const telegramId = useUserStore((s) => s.telegramId);
  const languageCode = useUserStore((s) => s.languageCode);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (history.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [history]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = question.trim();
    if (!q || loading) return;

    setLoading(true);
    setError(null);
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');

    try {
      const res = await followUp({ fullResult, question: q, telegramId, languageCode });
      setHistory((prev) => [...prev, { question: q, answer: res.answer }]);
      setQuestion('');
      window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
    } catch (err: any) {
      const status = err.response?.status;
      const msg = err.response?.data?.error;
      if (status === 429) {
        setError(`⏳ ${msg || 'Too many follow-ups. Please wait.'}`);
      } else {
        setError(msg || 'Failed to get an answer. Try again.');
      }
      window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 space-y-3">

      {/* ─── Q&A thread ───────────────────────────────────────────────── */}
      {history.map((qa, idx) => (
        <div key={idx} className="space-y-2 lex-enter-soft">
          {/* Question — editorial label + ink */}
          <div className="flex items-start gap-2.5">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
            >
              <MessageCircle className="w-3 h-3" strokeWidth={2} />
            </div>
            <p
              className="font-display text-[16px] leading-snug pt-0.5"
              style={{ color: 'var(--ink)' }}
            >
              {qa.question}
            </p>
          </div>

          {/* Answer — restrained body */}
          <div
            className="ml-8 px-4 py-3"
            style={{
              background: 'var(--paper-3)',
              border: '1px solid var(--rule-soft)',
              borderRadius: '12px',
            }}
          >
            <p
              className="text-[13.5px] leading-relaxed whitespace-pre-wrap"
              style={{ color: 'var(--ink-2)' }}
            >
              {qa.answer}
            </p>
          </div>
        </div>
      ))}

      <div ref={bottomRef} />

      {/* ─── Input card ──────────────────────────────────────────────── */}
      <div
        className="overflow-hidden"
        style={{
          background: 'var(--paper-3)',
          border: '1px solid var(--rule-soft)',
          borderRadius: '14px',
        }}
      >
        <div
          className="flex items-center gap-2 px-4 py-2.5"
          style={{ borderBottom: '1px solid var(--rule-soft)' }}
        >
          <MessageCircle className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} strokeWidth={1.8} />
          <p
            className="font-mono text-[10px] uppercase tracking-[0.18em]"
            style={{ color: 'var(--ink-3)' }}
          >
            Ask a follow-up
          </p>
          <span
            className="ml-auto font-mono text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full"
            style={{
              background: 'var(--brand-soft)',
              color: 'var(--brand)',
            }}
          >
            Free
          </span>
        </div>
        <form onSubmit={handleSubmit} className="flex items-end gap-2 p-3">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. What does clause 4 mean? Which lawyer type should I contact?"
            rows={2}
            className="flex-1 text-sm resize-none bg-transparent leading-relaxed focus:outline-none"
            style={{ color: 'var(--ink)' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as unknown as React.FormEvent);
              }
            }}
          />
          <button
            type="submit"
            disabled={!question.trim() || loading}
            className="w-9 h-9 flex items-center justify-center shrink-0 transition-colors disabled:opacity-40"
            style={{
              background: question.trim() && !loading ? 'var(--accent)' : 'var(--paper-2)',
              color: question.trim() && !loading ? 'var(--on-accent)' : 'var(--ink-3)',
              borderRadius: '10px',
            }}
            aria-label="Send follow-up"
          >
            {loading ? (
              <div
                className="w-4 h-4 rounded-full animate-spin"
                style={{
                  border: '2px solid color-mix(in srgb, var(--on-accent) 30%, transparent)',
                  borderTopColor: 'var(--on-accent)',
                }}
              />
            ) : (
              <Send className="w-4 h-4" strokeWidth={1.8} />
            )}
          </button>
        </form>
      </div>

      {error && (
        <p className="text-xs px-1" style={{ color: 'var(--verdict-danger)' }}>
          {error}
        </p>
      )}
    </div>
  );
}
