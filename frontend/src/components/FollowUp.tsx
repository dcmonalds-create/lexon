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

  // Scroll to latest answer when new one arrives
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

      {/* Q&A thread */}
      {history.map((qa, idx) => (
        <div key={idx} className="space-y-2">
          {/* Question bubble */}
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <p className="text-sm font-medium text-gray-800 pt-0.5">{qa.question}</p>
          </div>
          {/* Answer bubble */}
          <div className="ml-8 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{qa.answer}</p>
          </div>
        </div>
      ))}

      <div ref={bottomRef} />

      {/* Input card */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100">
          <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
          <p className="text-xs font-semibold text-gray-700">Ask a follow-up</p>
          <span className="ml-auto text-[10px] font-medium bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">
            Free
          </span>
        </div>
        <form onSubmit={handleSubmit} className="flex items-end gap-2 p-3">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. What does clause 4 mean? Which lawyer type should I contact?"
            rows={2}
            className="flex-1 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none resize-none bg-transparent leading-relaxed"
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
            className="w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-gray-200 flex items-center justify-center shrink-0 transition-colors"
            aria-label="Send follow-up"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4 text-white" />
            )}
          </button>
        </form>
      </div>

      {error && <p className="text-xs text-red-500 px-1">{error}</p>}
    </div>
  );
}
