import { Lock } from 'lucide-react';
import { usePayment } from '../hooks/usePayment';
import { usePhantomPayment } from '../hooks/usePhantomPayment';
import { usePhantomWallet } from '../hooks/usePhantomWallet';
import { useTonConnectUI } from '@tonconnect/ui-react';
import Loader from './Loader';

interface PaywallProps {
  teaser: string;
  sessionToken: string;
  toolName: string;
  onUnlocked: (fullResult: string) => void;
  lockedLabel?: string;
}

const isTelegram = Boolean(window.Telegram?.WebApp?.initData);

const PhantomIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 128 128" fill="none">
    <rect width="128" height="128" rx="64" fill="white" fillOpacity="0.2" />
    <path
      d="M110.584 64.914c0 24.595-20.008 44.514-44.713 44.514-24.705 0-44.713-19.919-44.713-44.514 0-24.594 20.008-44.514 44.713-44.514 24.705 0 44.713 19.92 44.713 44.514z"
      fill="white"
    />
    <path
      d="M88.5 64.5c0 13.255-10.745 24-24 24s-24-10.745-24-24 10.745-24 24-24"
      stroke="#AB9FF2"
      strokeWidth="8"
      strokeLinecap="round"
    />
  </svg>
);

export default function Paywall({
  teaser,
  sessionToken,
  toolName,
  onUnlocked,
  lockedLabel = 'Full analysis locked',
}: PaywallProps) {
  // Always call all hooks — Rules of Hooks
  const tonPayment = usePayment();
  const { pay, paying, error } = usePhantomPayment();
  const { connected: phantomConnected, connect: connectPhantom, isInstalled } = usePhantomWallet();
  const [tonConnectUI] = useTonConnectUI();
  const tonConnected = tonConnectUI.connected;

  // Telegram payment handler
  const handleTonPay = async () => {
    if (!tonConnected) { tonConnectUI.openModal(); return; }
    const full = await tonPayment.pay(sessionToken);
    if (full) onUnlocked(full);
  };

  // Web payment handler — only called when Phantom is already connected
  const handlePhantomPay = async () => {
    const full = await pay(sessionToken);
    if (full) onUnlocked(full);
  };

  const isPayingTon = isTelegram && tonPayment.paying;
  const isPayingPhantom = !isTelegram && paying;

  if (isPayingTon || isPayingPhantom) {
    return <Loader text="Confirming on Solana — please wait…" />;
  }

  return (
    <div className="mt-6 space-y-4">

      {/* Teaser */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Preview — {toolName}</h4>
        <p className="text-sm text-gray-600 leading-relaxed">{teaser}</p>
      </div>

      {/* Blurred placeholder */}
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

      {/* ── Telegram: TonConnect USDT ── */}
      {isTelegram && (
        <button
          onClick={handleTonPay}
          className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold py-3.5 px-6 rounded-2xl transition-colors text-sm flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.5 9.5V7H17V5H7v2h3.5v2.5C6.36 9.92 3 11.3 3 13s3.36 3.08 7.5 3.48V21h3v-4.52C17.64 16.08 21 14.7 21 13s-3.36-3.08-7.5-3.5zM12 15c-3.87 0-7-1.12-7-2.5S8.13 10 12 10s7 1.12 7 2.5S15.87 15 12 15z" />
          </svg>
          {tonConnected ? 'Unlock for 1 USDT' : 'Connect Wallet to Unlock'}
        </button>
      )}

      {/* ── Web: Phantom USDC — 3 states ── */}
      {!isTelegram && (
        <>
          {/* State 1: Phantom not installed */}
          {!isInstalled && (
            <a
              href="https://phantom.app"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#AB9FF2] hover:bg-[#9B8EE8] text-white font-semibold py-3.5 px-6 rounded-2xl transition-colors text-sm flex items-center justify-center gap-2"
            >
              <PhantomIcon className="w-5 h-5" />
              Install Phantom Wallet
            </a>
          )}

          {/* State 2: Installed but not connected */}
          {isInstalled && !phantomConnected && (
            <button
              onClick={connectPhantom}
              className="w-full bg-[#AB9FF2] hover:bg-[#9B8EE8] active:bg-[#8B7ED8] text-white font-semibold py-3.5 px-6 rounded-2xl transition-colors text-sm flex items-center justify-center gap-2"
            >
              <PhantomIcon className="w-5 h-5" />
              Connect Phantom Wallet
            </button>
          )}

          {/* State 3: Connected — show Pay button */}
          {isInstalled && phantomConnected && (
            <button
              onClick={handlePhantomPay}
              className="w-full bg-[#AB9FF2] hover:bg-[#9B8EE8] active:bg-[#8B7ED8] text-white font-semibold py-3.5 px-6 rounded-2xl transition-colors text-sm flex items-center justify-center gap-2"
            >
              <PhantomIcon className="w-5 h-5" />
              Pay 1 USDC to Unlock
            </button>
          )}
        </>
      )}

      {/* Errors */}
      {isTelegram && tonPayment.error && (
        <p className="text-xs text-red-500 text-center">{tonPayment.error}</p>
      )}
      {!isTelegram && error && (
        <p className="text-xs text-red-500 text-center">{error}</p>
      )}
    </div>
  );
}
