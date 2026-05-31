import { usePhantomWallet } from '../hooks/usePhantomWallet';

const PhantomIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 128 128" fill="none">
    <rect width="128" height="128" rx="64" fill="#AB9FF2" />
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

export default function PhantomButton() {
  const { connected, shortAddress, connect, disconnect, isInstalled } = usePhantomWallet();

  // Not installed — quiet outline pill nudging install
  if (!isInstalled) {
    return (
      <a
        href="https://phantom.app"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-[11px] font-medium rounded-full px-3 py-1.5 transition-colors"
        style={{
          color: 'var(--ink-2)',
          border: '1px solid var(--rule)',
          background: 'transparent',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--ink-3)';
          e.currentTarget.style.color = 'var(--ink)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--rule)';
          e.currentTarget.style.color = 'var(--ink-2)';
        }}
      >
        <PhantomIcon />
        Install Phantom
      </a>
    );
  }

  // Connected — ink-on-paper pill with mono address
  if (connected) {
    return (
      <button
        onClick={disconnect}
        className="flex items-center gap-1.5 text-[11px] rounded-full px-3 py-1.5 transition-colors"
        style={{
          color: 'var(--ink)',
          background: 'var(--paper-2)',
          border: '1px solid var(--rule-soft)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--ink-3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--rule-soft)';
        }}
        title="Click to disconnect"
      >
        <PhantomIcon />
        <span style={{ fontFamily: 'var(--font-mono)' }} className="tabular tracking-tight">
          {shortAddress}
        </span>
      </button>
    );
  }

  // Installed but not connected — sienna accent prompt
  return (
    <button
      onClick={connect}
      className="flex items-center gap-1.5 text-[11px] font-medium rounded-full px-3 py-1.5 transition-colors"
      style={{
        color: 'var(--on-accent)',
        background: 'var(--accent)',
        border: '1px solid var(--accent)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(0.92)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; }}
    >
      <PhantomIcon />
      Connect
    </button>
  );
}
