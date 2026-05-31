import { useState } from 'react';
import { useUserStore } from '../store/userStore';
import { useWalletStore } from '../store/walletStore';
import { useHistoryStore } from '../store/historyStore';
import { usePhantomStore } from '../store/phantomStore';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { User, Wallet, BarChart3, Globe, ExternalLink, LogOut } from 'lucide-react';

const WEB_URL = import.meta.env.VITE_WEB_URL || 'https://web-production-049de.up.railway.app';
const isTelegram = Boolean(window.Telegram?.WebApp?.initData);

export default function Profile() {
  const { firstName, lastName, username, telegramId, setUser } = useUserStore();
  const { connected, address } = useWalletStore();
  const setPhantomConnected = usePhantomStore((s) => s.setConnected);
  const clearHistory = useHistoryStore((s) => s.clearItems);
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {
      // ignore network errors — sign out locally regardless
    }
    // Disconnect Phantom wallet
    try {
      await (window as any).phantom?.solana?.disconnect();
    } catch { /* ignore */ }
    setPhantomConnected(false, '');
    clearHistory();
    // Clear user state — triggers WebSignIn overlay
    setUser({
      telegramId: '',
      firstName: '',
      lastName: '',
      username: '',
      languageCode: 'en',
      isWeb: true,
      needsSignIn: true,
    });
    setSigningOut(false);
  };
  const items = useHistoryStore((s) => s.items);
  const [tonConnectUI] = useTonConnectUI();

  const shortAddress = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : '';

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900">Profile</h2>

      {/* User info */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
            <User className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              {firstName} {lastName}
            </p>
            {username && <p className="text-xs text-gray-500">@{username}</p>}
            <p className="text-[10px] text-gray-400">ID: {telegramId}</p>
          </div>
        </div>
      </div>

      {/* Wallet — only meaningful inside Telegram (TON wallet) */}
      {isTelegram && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-semibold text-gray-900">TON Wallet</h3>
            <span className="ml-auto text-[10px] font-medium bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded-full">
              USDT payments
            </span>
          </div>
          {connected ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 font-mono">{shortAddress}</p>
              <button
                onClick={() => tonConnectUI.disconnect()}
                className="text-xs text-red-500 hover:text-red-600"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={() => tonConnectUI.openModal()}
              className="text-sm text-emerald-600 font-medium hover:text-emerald-700"
            >
              Connect TON Wallet
            </button>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-4 h-4 text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-900">Stats</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-2xl font-bold text-gray-900">{items.length}</p>
            <p className="text-xs text-gray-500">Analyses</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{items.length}</p>
            <p className="text-xs text-gray-500">Documents unlocked</p>
          </div>
        </div>
      </div>

      {/* ── Settings: Web + Phantom (shown only inside Telegram) ── */}
      {isTelegram && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-semibold text-gray-900">Pay with Phantom (USDC)</h3>
          </div>
          <p className="text-xs text-gray-500 mb-3">
            Prefer Solana? Open LexOn in your browser and connect Phantom Wallet to pay with USDC.
          </p>
          <button
            onClick={() => {
              window.Telegram?.WebApp?.openLink(WEB_URL);
              window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
            }}
            className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Open LexOn on the web
          </button>
        </div>
      )}

      {/* ── Sign Out (web only) ── */}
      {!isTelegram && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="w-full flex items-center justify-center gap-2 text-sm font-medium text-red-500 hover:text-red-600 disabled:opacity-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {signingOut ? 'Signing out…' : 'Sign Out'}
          </button>
        </div>
      )}
    </div>
  );
}
