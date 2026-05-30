import { Lock } from 'lucide-react';
import { usePayment } from '../hooks/usePayment';
import { usePhantomPayment } from '../hooks/usePhantomPayment';
import { useTonConnectUI } from '@tonconnect/ui-react';
import Loader from './Loader';

interface PaywallProps {
  teaser: string;
  sessionToken: string;
  toolName: string;
  onUnlocked: (fullResult: string) => void;
  lockedLabel?: string;
}

// Detect if running inside the Telegram Mini App
const isTelegram = Boolean(window.Telegram?.WebApp?.initData);

export default function Paywall({
  teaser,
  sessionToken,
  toolName,
  onUnlocked,
  lockedLabel = 'Full analysis locked',
}: PaywallProps) {
  // Always call both hooks (Rules of Hooks) — only one is used per platform
  const tonPayment = usePayment();
  const phantomPayment = usePhantomPayment();
  const [tonConnectUI] = useTonConnectUI();

  const { pay, paying, error } = isTelegram ? tonPayment : phantomPayment;
  const isConnected = tonConnectUI.connected;

  const handlePay = async () => {
    if (isTelegram && !isConnected) {
      tonConnectUI.openModal();
      return;
    }
    const fullResult = await pay(sessionToken);
    if (fullResult) {
      onUnlocked(fullResult);
    }
  };

  if (paying) {
    return <Loader text="Processing payment…" />;
  }

  return (
    <div className="mt-6 space-y-4">
      {/* Teaser preview */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Preview — {toolName}</h4>
        <p className="text-sm text-gray-600 leading-relaxed">{teaser}</p>
      </div>

      {/* Blurred content placeholder */}
      <div className="relative bg-white rounded-2xl p-5 border border-gray-100 shadow-sm overflow-hidden">
        <div className="blur-sm select-none pointer-events-none">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
          <div className="h-3 bg-gray-100 rounded w-full mb-2" />
          <div className="h-3 bg-gray-100 rounded w-5/6 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-4/5 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
          <div className="h-3 bg-gray-100 rounded w-full mb-2" />
          <div className="h-3 bg-gray-100 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-5/6" />
        </div>
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <Lock className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500">{lockedLabel}</p>
        </div>
      </div>

      {/* Payment button */}
      {isTelegram ? (
        /* ── TON path: TonConnect USDT ── */
        <button
          onClick={handlePay}
          className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold py-3.5 px-6 rounded-2xl transition-colors text-sm flex items-center justify-center gap-2"
        >
          {isConnected ? (
            <>
              {/* Tether logo */}
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.5 9.5V7H17V5H7v2h3.5v2.5C6.36 9.92 3 11.3 3 13s3.36 3.08 7.5 3.48V21h3v-4.52C17.64 16.08 21 14.7 21 13s-3.36-3.08-7.5-3.5zM12 15c-3.87 0-7-1.12-7-2.5S8.13 10 12 10s7 1.12 7 2.5S15.87 15 12 15z" />
              </svg>
              Unlock for 1 USDT
            </>
          ) : (
            <>Connect Wallet to Unlock</>
          )}
        </button>
      ) : (
        /* ── Web path: Phantom USDC ── */
        <button
          onClick={handlePay}
          className="w-full bg-[#AB9FF2] hover:bg-[#9B8EE8] active:bg-[#8B7ED8] text-white font-semibold py-3.5 px-6 rounded-2xl transition-colors text-sm flex items-center justify-center gap-2"
        >
          {/* Phantom ghost logo */}
          <svg className="w-5 h-5" viewBox="0 0 128 128" fill="none">
            <rect width="128" height="128" rx="64" fill="#AB9FF2" />
            <path
              d="M110.584 64.9142C110.584 89.5089 90.576 109.428 65.8711 109.428C41.1662 109.428 21.1582 89.5089 21.1582 64.9142C21.1582 40.3195 41.1662 20.4 65.8711 20.4C90.576 20.4 110.584 40.3195 110.584 64.9142Z"
              fill="white"
            />
            <path
              d="M88.5 64.5C88.5 77.7548 77.7548 88.5 64.5 88.5C51.2452 88.5 40.5 77.7548 40.5 64.5C40.5 51.2452 51.2452 40.5 64.5 40.5"
              stroke="#AB9FF2"
              strokeWidth="8"
              strokeLinecap="round"
            />
          </svg>
          Unlock with Phantom (1 USDC)
        </button>
      )}

      {error && <p className="text-xs text-red-500 text-center">{error}</p>}
    </div>
  );
}
