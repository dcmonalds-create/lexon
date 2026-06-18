import { useEffect, useRef, useState } from 'react';
import { Scale, Coins, FileText } from 'lucide-react';

// ─── Persistence ────────────────────────────────────────────────────────────
const VIEWS_KEY = 'lexon_onboarding_views';   // counter, max 3
const DONE_KEY  = 'lexon_onboarding_done';    // sticky once finished

const MAX_VIEWS = 3;

function shouldShow(): boolean {
  if (localStorage.getItem(DONE_KEY) === '1') return false;
  const raw = localStorage.getItem(VIEWS_KEY);
  const count = raw ? parseInt(raw, 10) : 0;
  return Number.isFinite(count) && count < MAX_VIEWS;
}

function bumpViewCount() {
  const raw = localStorage.getItem(VIEWS_KEY);
  const count = raw ? parseInt(raw, 10) : 0;
  localStorage.setItem(VIEWS_KEY, String(Math.min(MAX_VIEWS, count + 1)));
}

function markDone() {
  localStorage.setItem(DONE_KEY, '1');
}

// ─── Slide content ──────────────────────────────────────────────────────────
type Slide = {
  Icon: typeof Scale;
  overline: string;
  title: string;
  italic: string;
  body: string;
};

const SLIDES: Slide[] = [
  {
    Icon: Scale,
    overline: 'Welcome',
    title: 'Legal tools,',
    italic: 'on demand.',
    body: 'Frozen exchange account. Tax letter you don’t understand. Contract you’re about to sign. Pick a tool, get a sendable reply in seconds.',
  },
  {
    Icon: Coins,
    overline: 'No subscription',
    title: 'Pay only when',
    italic: 'you need it.',
    body: 'One USDT transaction equals one structured legal output. From cents to a few dollars. No retainer. No €200 lawyer for an 8-minute answer.',
  },
  {
    Icon: FileText,
    overline: 'How it works',
    title: 'Tap. Pay.',
    italic: 'Send.',
    body: 'Choose Guided for a short quiz or Manual to write your own input. Attach a document or photo. Your history is saved — open it whenever the next thing hits.',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────
export default function Onboarding() {
  const [open, setOpen] = useState<boolean>(() => shouldShow());
  const [index, setIndex] = useState(0);
  const bumped = useRef(false);

  // Increment the view counter once per mount (counts as one "open").
  useEffect(() => {
    if (!open || bumped.current) return;
    bumpViewCount();
    bumped.current = true;
  }, [open]);

  if (!open) return null;

  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  const handleSkip = () => {
    // Dismiss for this session only — will reappear on next open if count < 3.
    setOpen(false);
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
  };

  const handleContinue = () => {
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
    if (isLast) {
      markDone();
      setOpen(false);
      return;
    }
    setIndex((i) => Math.min(SLIDES.length - 1, i + 1));
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col"
      style={{ background: 'var(--paper)' }}
      role="dialog"
      aria-modal="true"
      aria-label="LexOn introduction"
    >
      {/* ── Top bar: Skip ── */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-end max-w-md w-full mx-auto">
        <button
          onClick={handleSkip}
          className="font-mono text-[10px] uppercase tracking-[0.18em] px-3 py-1.5 transition-colors"
          style={{ color: 'var(--ink-3)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink-3)')}
          aria-label="Skip introduction"
        >
          Skip
        </button>
      </div>

      {/* ── Slide canvas ── */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div
          key={index}
          className="max-w-md w-full text-center lex-enter-soft"
        >
          {/* Icon plate */}
          <div className="flex justify-center mb-8">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: 'var(--accent-soft)',
                color: 'var(--accent)',
                border: '1px solid var(--rule-soft)',
              }}
            >
              <slide.Icon className="w-7 h-7" strokeWidth={1.6} />
            </div>
          </div>

          {/* Overline */}
          <p
            className="font-mono text-[10px] uppercase tracking-[0.22em] mb-3"
            style={{ color: 'var(--ink-3)' }}
          >
            {slide.overline}
          </p>

          {/* Title */}
          <h1
            className="font-display text-[34px] leading-[1.05]"
            style={{ color: 'var(--ink)' }}
          >
            {slide.title}{' '}
            <span className="italic" style={{ color: 'var(--accent)' }}>
              {slide.italic}
            </span>
          </h1>

          {/* Body */}
          <p
            className="text-[15px] leading-relaxed mt-5"
            style={{ color: 'var(--ink-2)' }}
          >
            {slide.body}
          </p>
        </div>
      </div>

      {/* ── Page dots ── */}
      <div className="flex items-center justify-center gap-2 pb-5">
        {SLIDES.map((_, i) => (
          <span
            key={i}
            aria-hidden
            className="transition-all"
            style={{
              width: i === index ? '20px' : '6px',
              height: '4px',
              borderRadius: '2px',
              background: i === index ? 'var(--accent)' : 'var(--rule)',
            }}
          />
        ))}
      </div>

      {/* ── CTA ── */}
      <div className="px-6 pb-8 max-w-md w-full mx-auto">
        <button
          onClick={handleContinue}
          className="w-full py-4 rounded-full font-display text-[17px] transition-transform active:scale-[0.98]"
          style={{
            background: 'var(--accent)',
            color: 'var(--paper)',
            letterSpacing: '0.01em',
          }}
        >
          {isLast ? 'Get started' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
