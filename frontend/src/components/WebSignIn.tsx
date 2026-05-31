import { useState, useCallback } from 'react';
import { Scale } from 'lucide-react';
import { useUserStore } from '../store/userStore';

const TELEGRAM_BOT_URL = import.meta.env.VITE_TELEGRAM_BOT_URL || 'https://t.me/LexOnBot';

function getPhantom() {
  return (window as any).phantom?.solana ?? null;
}

// True when LexOn is loaded inside Phantom's built-in browser
const isPhantomBrowser = Boolean(getPhantom()?.isPhantom);

const PhantomIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 128 128" fill="none">
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

export default function WebSignIn() {
  const setUser = useUserStore((s) => s.setUser);
  const [connecting, setConnecting] = useState(false);

  const connectPhantom = useCallback(async () => {
    const phantom = getPhantom();
    if (!phantom) return;
    setConnecting(true);
    try {
      const { publicKey } = await phantom.connect();
      const pk = publicKey.toString();
      setUser({
        telegramId: `phantom_${pk}`,
        firstName: `${pk.slice(0, 4)}…${pk.slice(-4)}`,
        lastName: '',
        username: pk,
        languageCode: navigator.language?.split('-')[0] || 'en',
        isWeb: true,
        needsSignIn: false,
      });
    } catch (err: any) {
      if (err?.code !== 4001) console.error('Phantom connect error:', err);
    } finally {
      setConnecting(false);
    }
  }, [setUser]);

  return (
    <div className="fixed inset-0 bg-[#f8faf9] z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-7 shadow-xl border border-gray-100 max-w-sm w-full text-center space-y-5">
        {/* Logo */}
        <div className="w-16 h-16 rounded-2xl bg-[#1D4035] flex items-center justify-center mx-auto">
          <Scale className="w-8 h-8 text-white" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900">Welcome to LexOn</h2>
          <p className="text-sm text-gray-500 mt-1">
            AI-powered legal tools at your fingertips
          </p>
        </div>

        <div className="space-y-3">
          {isPhantomBrowser ? (
            /* Phantom's built-in browser — Google OAuth is blocked, use wallet instead */
            <button
              onClick={connectPhantom}
              disabled={connecting}
              className="w-full bg-[#AB9FF2] hover:bg-[#9B8EE8] active:bg-[#8B7ED8] disabled:opacity-60 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors"
            >
              <PhantomIcon />
              {connecting ? 'Connecting…' : 'Continue with Phantom Wallet'}
            </button>
          ) : (
            <>
              {/* Google Sign-In */}
              <a
                href="/auth/google"
                className="w-full bg-white border border-gray-200 hover:bg-gray-50 active:bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
              </a>

              {/* Telegram alternative */}
              <a
                href={TELEGRAM_BOT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#0088cc] hover:bg-[#0077b6] active:bg-[#006ba1] text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.29c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.931z" />
                </svg>
                Open in Telegram
              </a>
            </>
          )}
        </div>

        <p className="text-[11px] text-gray-400">
          {isPhantomBrowser
            ? 'Connect your Phantom wallet to save your analysis history'
            : 'Sign in to save your analysis history and pay with Phantom wallet'}
        </p>
      </div>
    </div>
  );
}
