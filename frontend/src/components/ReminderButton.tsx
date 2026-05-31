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

  // Reminders need a real Telegram chat_id. Web users (google_*, phantom_*,
  // anon_*) can't receive them — show a CTA pointing them to the bot instead.
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

  if (!canRemind) {
    return (
      <div className="mt-4 bg-white border border-gray-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-1.5">
          <Bell className="w-3.5 h-3.5 text-amber-500" />
          <p className="text-xs font-semibold text-gray-700">Want a deadline reminder?</p>
        </div>
        <p className="text-xs text-gray-500">
          Reminders are sent via Telegram. Open LexOn inside the Telegram Mini App to use this feature.
        </p>
      </div>
    );
  }

  if (chosenDays !== null) {
    return (
      <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
          <Check className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-emerald-900">Reminder set</p>
          <p className="text-xs text-emerald-700">We'll message you in {chosenDays} days via Telegram.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 bg-white border border-gray-200 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-2.5">
        <Bell className="w-3.5 h-3.5 text-amber-500" />
        <p className="text-xs font-semibold text-gray-700">Remind me before the deadline</p>
        <span className="ml-auto text-[10px] font-medium bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">
          Free
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {OPTIONS.map(({ days, label }) => (
          <button
            key={days}
            type="button"
            disabled={loading}
            onClick={() => handlePick(days)}
            className="text-xs font-medium bg-amber-50 hover:bg-amber-100 active:bg-amber-200 disabled:opacity-50 text-amber-800 border border-amber-200 rounded-xl py-2 transition-colors"
          >
            {label}
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  );
}
