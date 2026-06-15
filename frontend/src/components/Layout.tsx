import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Scale, Clock, User, Sun, Moon } from 'lucide-react';
import WalletButton from './WalletButton';
import PhantomButton from './PhantomButton';
import WebSignIn from './WebSignIn';
import { useUserStore } from '../store/userStore';
import { useThemeStore } from '../store/themeStore';

const NAV_ITEMS = [
  { path: '/',        label: 'Tools',   icon: Scale },
  { path: '/history', label: 'History', icon: Clock },
  { path: '/profile', label: 'Profile', icon: User  },
];

const isTelegram = Boolean(window.Telegram?.WebApp?.initData);

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const needsSignIn = useUserStore((s) => s.needsSignIn);
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggle);

  return (
    <div className="flex flex-col min-h-screen">
      {!isTelegram && needsSignIn && <WebSignIn />}

      {/* ─── Header ────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-40 backdrop-blur-md"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--paper) 86%, transparent)',
          borderBottom: '1px solid var(--rule-soft)',
        }}
      >
        <div className="w-full max-w-md mx-auto px-4 py-3 flex items-center justify-between">

          {/* Wordmark */}
          <button
            onClick={() => navigate('/')}
            className="flex items-baseline gap-1.5 group"
            aria-label="LexOn home"
          >
            <span
              className="font-display text-[26px] leading-none"
              style={{ color: 'var(--ink)' }}
            >
              Lex
            </span>
            <span
              className="font-display text-[26px] leading-none italic"
              style={{ color: 'var(--accent)' }}
            >
              On
            </span>
            <span className="ml-1 mt-1 w-1 h-1 rounded-full" style={{ background: 'var(--accent)' }} />
          </button>

          {/* Right cluster — theme toggle + wallet */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{
                color: 'var(--ink-2)',
                background: 'transparent',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--paper-2)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              title={theme === 'light' ? 'Dark mode' : 'Light mode'}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            {isTelegram ? <WalletButton /> : <PhantomButton />}
          </div>
        </div>
      </header>

      {/* ─── Main canvas ───────────────────────────────────────────────── */}
      <main className="flex-1 px-4 py-5 pb-28 overflow-y-auto">
        <div className="max-w-md mx-auto lex-enter-soft" key={location.pathname}>
          <Outlet />
        </div>

        {/* ─── Footer ──────────────────────────────────────────────────── */}
        <footer
          className="max-w-md mx-auto mt-10 pt-5 flex items-center justify-between"
          style={{ borderTop: '1px solid var(--rule-soft)' }}
        >
          <span
            className="font-mono text-[10px] uppercase tracking-[0.18em]"
            style={{ color: 'var(--ink-3)' }}
          >
            LexOn
          </span>
          <a
            href="https://x.com/LexOnLegal"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              window.Telegram?.WebApp?.openLink?.('https://x.com/LexOnLegal');
              window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
            }}
            className="font-mono text-[10px] uppercase tracking-[0.18em] transition-colors"
            style={{ color: 'var(--ink-3)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink-3)')}
            aria-label="LexOn on X"
          >
            Follow @LexOnLegal →
          </a>
        </footer>
      </main>

      {/* ─── Bottom nav ────────────────────────────────────────────────── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--paper) 88%, transparent)',
          borderTop: '1px solid var(--rule-soft)',
        }}
      >
        <div className="flex items-center justify-around py-2 max-w-md mx-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
                }}
                className="relative flex flex-col items-center gap-0.5 px-5 py-1.5 transition-colors"
                style={{ color: isActive ? 'var(--ink)' : 'var(--ink-3)' }}
              >
                <Icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2.2 : 1.6} />
                <span
                  className="text-[10px] tracking-wide uppercase"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    letterSpacing: '0.08em',
                    fontWeight: isActive ? 600 : 500,
                  }}
                >
                  {item.label}
                </span>
                {isActive && (
                  <span
                    className="absolute -bottom-0.5 w-1 h-1 rounded-full"
                    style={{ background: 'var(--accent)' }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
