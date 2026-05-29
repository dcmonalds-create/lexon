import { Lock } from 'lucide-react';
import { usePayment } from '../hooks/usePayment';
import { useTonConnectUI } from '@tonconnect/ui-react';
import Loader from './Loader';

interface PaywallProps {
  teaser: string;
  sessionToken: string;
  toolName: string;
  onUnlocked: (fullResult: string) => void;
}

export default function Paywall({ teaser, sessionToken, toolName, onUnlocked }: PaywallProps) {
  const { pay, paying, error } = usePayment();
  const [tonConnectUI] = useTonConnectUI();
  const isConnected = tonConnectUI.connected;

  const handlePay = async () => {
    if (!isConnected) {
      tonConnectUI.openModal();
      return;
    }
    const fullResult = await pay(sessionToken);
    if (fullResult) {
      onUnlocked(fullResult);
    }
  };

  if (paying) {
    return <Loader text="Processing payment..." />;
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Preview — {toolName}</h4>
        <p className="text-sm text-gray-600 leading-relaxed">{teaser}</p>
      </div>

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
          <p className="text-xs text-gray-500">Full analysis locked</p>
        </div>
      </div>

      <button
        onClick={handlePay}
        className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold py-3.5 px-6 rounded-2xl transition-colors text-sm flex items-center justify-center gap-2"
      >
        {isConnected ? (
          <>Unlock for 1 TON</>
        ) : (
          <>Connect Wallet to Unlock</>
        )}
      </button>

      {error && (
        <p className="text-xs text-red-500 text-center">{error}</p>
      )}
    </div>
  );
}
