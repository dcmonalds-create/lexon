import { useState } from 'react';
import { Bell, Check } from 'lucide-react';
import { createReminder } from '../lib/api';
import { useUserStore } from '../store/userStore';

interface ReminderButtonProps {
  toolId: string;
  toolName: string;
  summary: string;
}

const OPTIONS = [
  { days: 7,  label: '7 days' },
  { days: 14, label: '14 days' },
  { days: 30, label: '30 days' },
] as const;

export default function ReminderButton({ toolId, toolName, summary }: ReminderButtonProps) {
  const telegramId = useUserStore((s) => s.telegramId);
  const isWeb = useUserStore((s) => s.isWeb);
  const [chosenDays, setChosenDays] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canRemind = !isWeb && /^-?\d+$/.test(telegramId);

  const handlePick = async (days: number) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
    try {
      await createReminder({ telegramId, toolId, toolName, summary, days });
      setChosenDays(days);
      window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Could not set the reminder. Try again.';
      setError(msg);
      window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('error');
    } finally {
      setLoading(false);
    }
  };

  const cardStyle: React.CSSProperties = {
    background: 'var(--paper-3)',
    border: '1px solid var(--rule-soft)',
    borderRadius: '14px',
    padding: '16px 18px',
  };

  if (!canRemind) {
    return (
      <div className="mt-4" style={cardStyle}>
        <div className="flex items-center gap-2 mb-1.5">
          <Bell className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} strokeWidth={1.8} />
          <p
            className="font-mono text-[10px] uppercase tracking-[0.18em]"
            style={{ color: 'var(--ink-3)' }}
          >
            Deadline reminder
          </p>
        </div>
        <p className="text-[13px] leading-snug" style={{ color: 'var(--ink-2)' }}>
          Reminders are sent via Telegram. Open LexOn inside the Telegram Mini App to use this feature.
        </p>
      </div>
    );
  }

  if (chosenDays !== null) {
    return (
      <div
        className="mt-4 flex items-center gap-3"
        style={{
          background: 'var(--brand-soft)',
          border: '1px solid var(--brand)',
          borderRadius: '14px',
          padding: '14px 18px',
        }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'var(--brand)', color: 'var(--on-brand)' }}
        >
          <Check className="w-4 h-4" strokeWidth={2.2} />
        </div>
        <div>
          <p
            className="font-mono text-[10px] uppercase tracking-[0.18em]"
            style={{ color: 'var(--brand)' }}
          >
            Reminder set
          </p>
          <p className="text-[13px] leading-snug mt-0.5" style={{ color: 'var(--ink)' }}>
            We'll message you in <span className="tabular font-mono">{chosenDays}</span> days via Telegram.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4" style={cardStyle}>
      <div className="flex items-center gap-2 mb-3">
        <Bell className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} strokeWidth={1.8} />
        <p
          className="font-mono text-[10px] uppercase tracking-[0.18em]"
          style={{ color: 'var(--ink-3)' }}
        >
          Remind me before the deadline
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {OPTIONS.map(({ days, label }) => (
          <button
            key={days}
            type="button"
            disabled={loading}
            onClick={() => handlePick(days)}
            className="text-[13px] font-medium py-2.5 transition-colors disabled:opacity-50"
            style={{
              background: 'transparent',
              color: 'var(--ink)',
              border: '1px solid var(--rule)',
              borderRadius: '10px',
              fontFamily: 'var(--font-sans)',
            }}
            onMouseEnter={(e) => {
              if (loading) return;
              e.currentTarget.style.background = 'var(--accent-soft)';
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.color = 'var(--accent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'var(--rule)';
              e.currentTarget.style.color = 'var(--ink)';
            }}
          >
            {label}
          </button>
        ))}
      </div>
      {error && (
        <p className="text-xs mt-2" style={{ color: 'var(--verdict-danger)' }}>
          {error}
        </p>
      )}
    </div>
  );
}
