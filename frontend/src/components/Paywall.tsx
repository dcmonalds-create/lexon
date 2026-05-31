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
  const tonPayment = usePayment();
  const { pay, paying, error } = usePhantomPayment();
  const { connected: phantomConnected, connect: connectPhantom, isInstalled } = usePhantomWallet();
  const [tonConnectUI] = useTonConnectUI();
  const tonConnected = tonConnectUI.connected;

  const handleTonPay = async () => {
    if (!tonConnected) { tonConnectUI.openModal(); return; }
    const full = await tonPayment.pay(sessionToken);
    if (full) onUnlocked(full);
  };

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
    <div className="mt-6 space-y-4 lex-enter">

      {/* ─── Teaser card ────────────────────────────────────────────── */}
      <article
        className="overflow-hidden relative"
        style={{
          background: 'var(--paper-3)',
          border: '1px solid var(--rule-soft)',
          borderRadius: '14px',
        }}
      >
        <span
          aria-hidden
          className="absolute top-0 left-6 w-9 h-[2px]"
          style={{ background: 'var(--accent)' }}
        />
        <div className="px-6 pt-6 pb-5">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.18em]"
            style={{ color: 'var(--ink-3)' }}
          >
            Preview
          </p>
          <h3
            className="font-display text-[24px] leading-[1.15] mt-1.5"
            style={{ color: 'var(--ink)' }}
          >
            {toolName}
          </h3>
          <p
            className="text-sm leading-relaxed mt-3"
            style={{ color: 'var(--ink-2)' }}
          >
            {teaser}
          </p>
        </div>
      </article>

      {/* ─── Locked body ────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'var(--paper-3)',
          border: '1px solid var(--rule-soft)',
          borderRadius: '14px',
          padding: '22px 24px',
        }}
      >
        <div className="blur-md select-none pointer-events-none space-y-2.5">
          <div className="h-3.5 w-2/3 rounded" style={{ background: 'var(--rule)' }} />
          <div className="h-2.5 w-full rounded" style={{ background: 'var(--rule-soft)' }} />
          <div className="h-2.5 w-5/6 rounded" style={{ background: 'var(--rule-soft)' }} />
          <div className="h-2.5 w-4/5 rounded" style={{ background: 'var(--rule-soft)' }} />
          <div className="h-3.5 w-1/2 rounded mt-4" style={{ background: 'var(--rule)' }} />
          <div className="h-2.5 w-full rounded" style={{ background: 'var(--rule-soft)' }} />
          <div className="h-2.5 w-3/4 rounded" style={{ background: 'var(--rule-soft)' }} />
        </div>
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3"
          style={{
            background: 'color-mix(in srgb, var(--paper-3) 78%, transparent)',
            backdropFilter: 'blur(2px)',
          }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: 'var(--paper-2)',
              border: '1px solid var(--rule)',
            }}
          >
            <Lock className="w-[18px] h-[18px]" style={{ color: 'var(--ink-3)' }} strokeWidth={1.6} />
          </div>
          <p
            className="font-mono text-[10px] uppercase tracking-[0.2em]"
            style={{ color: 'var(--ink-3)' }}
          >
            {lockedLabel}
          </p>
        </div>
      </div>

      {/* ─── Pay button (Telegram) ──────────────────────────────────── */}
      {isTelegram && (
        <button
          onClick={handleTonPay}
          className="w-full font-semibold py-[14px] px-6 transition-colors text-sm flex items-center justify-center gap-2"
          style={{
            background: 'var(--accent)',
            color: 'var(--on-accent)',
            borderRadius: '12px',
            fontFamily: 'var(--font-sans)',
            letterSpacing: '-0.005em',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(0.92)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; }}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.5 9.5V7H17V5H7v2h3.5v2.5C6.36 9.92 3 11.3 3 13s3.36 3.08 7.5 3.48V21h3v-4.52C17.64 16.08 21 14.7 21 13s-3.36-3.08-7.5-3.5zM12 15c-3.87 0-7-1.12-7-2.5S8.13 10 12 10s7 1.12 7 2.5S15.87 15 12 15z" />
          </svg>
          {tonConnected ? 'Unlock for 1 USDT' : 'Connect Wallet to Unlock'}
        </button>
      )}

      {/* ─── Pay button (Web / Phantom) ─────────────────────────────── */}
      {!isTelegram && (
        <>
          {!isInstalled && (
            <a
              href="https://phantom.app"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full font-semibold py-[14px] px-6 transition-colors text-sm flex items-center justify-center gap-2"
              style={{
                background: 'var(--accent)',
                color: 'var(--on-accent)',
                borderRadius: '12px',
                fontFamily: 'var(--font-sans)',
              }}
            >
              <PhantomIcon className="w-5 h-5" />
              Install Phantom Wallet
            </a>
          )}

          {isInstalled && !phantomConnected && (
            <button
              onClick={connectPhantom}
              className="w-full font-semibold py-[14px] px-6 transition-colors text-sm flex items-center justify-center gap-2"
              style={{
                background: 'var(--accent)',
                color: 'var(--on-accent)',
                borderRadius: '12px',
                fontFamily: 'var(--font-sans)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(0.92)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; }}
            >
              <PhantomIcon className="w-5 h-5" />
              Connect Phantom Wallet
            </button>
          )}

          {isInstalled && phantomConnected && (
            <button
              onClick={handlePhantomPay}
              className="w-full font-semibold py-[14px] px-6 transition-colors text-sm flex items-center justify-center gap-2"
              style={{
                background: 'var(--accent)',
                color: 'var(--on-accent)',
                borderRadius: '12px',
                fontFamily: 'var(--font-sans)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(0.92)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; }}
            >
              <PhantomIcon className="w-5 h-5" />
              Pay 1 USDC to Unlock
            </button>
          )}
        </>
      )}

      {isTelegram && tonPayment.error && (
        <p className="text-xs text-center" style={{ color: 'var(--verdict-danger)' }}>
          {tonPayment.error}
        </p>
      )}
      {!isTelegram && error && (
        <p className="text-xs text-center" style={{ color: 'var(--verdict-danger)' }}>
          {error}
        </p>
      )}
    </div>
  );
}
