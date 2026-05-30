import { usePhantomWallet } from '../hooks/usePhantomWallet';

const PhantomIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 128 128" fill="none">
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

  // Not installed — nudge user to get Phantom
  if (!isInstalled) {
    return (
      <a
        href="https://phantom.app"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-xs font-medium text-white/70 hover:text-white border border-white/20 hover:border-white/40 rounded-xl px-3 py-1.5 transition-colors"
      >
        <PhantomIcon />
        Install Phantom
      </a>
    );
  }

  // Connected — show short address + disconnect
  if (connected) {
    return (
      <button
        onClick={disconnect}
        className="flex items-center gap-1.5 text-xs font-medium bg-white/10 hover:bg-white/20 text-white rounded-xl px-3 py-1.5 transition-colors"
        title="Click to disconnect"
      >
        <PhantomIcon />
        <span className="font-mono">{shortAddress}</span>
      </button>
    );
  }

  // Installed but not connected
  return (
    <button
      onClick={connect}
      className="flex items-center gap-1.5 text-xs font-medium bg-[#AB9FF2] hover:bg-[#9B8EE8] active:bg-[#8B7ED8] text-white rounded-xl px-3 py-1.5 transition-colors"
    >
      <PhantomIcon />
      Connect Phantom
    </button>
  );
}
