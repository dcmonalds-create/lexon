import { useUserStore } from '../store/userStore';
import { useWalletStore } from '../store/walletStore';
import { useHistoryStore } from '../store/historyStore';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { User, Wallet, BarChart3 } from 'lucide-react';

export default function Profile() {
  const { firstName, lastName, username, telegramId } = useUserStore();
  const { connected, address } = useWalletStore();
  const items = useHistoryStore((s) => s.items);
  const [tonConnectUI] = useTonConnectUI();

  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900">Profile</h2>

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

      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Wallet className="w-4 h-4 text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-900">Wallet</h3>
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
            <p className="text-xs text-gray-500">TON spent</p>
          </div>
        </div>
      </div>
    </div>
  );
}
