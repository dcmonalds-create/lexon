import { useEffect } from 'react';
import { useUserStore } from '../store/userStore';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData?: string;
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
        };
        ready: () => void;
        expand: () => void;
        BackButton: {
          show: () => void;
          hide: () => void;
          onClick: (cb: () => void) => void;
          offClick: (cb: () => void) => void;
        };
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
        };
        openLink: (url: string) => void;
        themeParams: Record<string, string>;
      };
    };
  }
}

function getOrCreateFallbackId(): string {
  const key = 'lexon_user_id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = `anon_${crypto.randomUUID()}`;
    localStorage.setItem(key, id);
  }
  return id;
}

export function useTelegramUser() {
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    // ── Telegram Mini App ──────────────────────────────────────────────────
    if (tg?.initData) {
      tg.ready();
      tg.expand();

      const user = tg.initDataUnsafe?.user;
      if (user?.id) {
        setUser({
          telegramId: String(user.id),
          firstName: user.first_name || 'User',
          lastName: user.last_name || '',
          username: user.username || '',
          languageCode: user.language_code || 'en',
          isWeb: false,
          needsSignIn: false,
        });
        return;
      }
    }

    // ── Web browser ────────────────────────────────────────────────────────
    // Try Google OAuth session first, then fall back to anonymous ID
    (async () => {
      try {
        const res = await fetch('/auth/me', { credentials: 'include' });
        if (res.ok) {
          const user = await res.json() as {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
          };
          setUser({
            telegramId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: '',
            languageCode: navigator.language?.split('-')[0] || 'en',
            isWeb: true,
            needsSignIn: false,
          });
          return;
        }
      } catch {
        // Network error — fall through to anonymous
      }

      // Not authenticated on web → show sign-in prompt
      const fallbackId = getOrCreateFallbackId();
      setUser({
        telegramId: fallbackId,
        firstName: import.meta.env.DEV ? 'Dev User' : 'Guest',
        lastName: '',
        username: import.meta.env.DEV ? 'devuser' : '',
        languageCode: navigator.language?.split('-')[0] || 'en',
        isWeb: true,
        needsSignIn: true,
      });
    })();
  }, [setUser]);
}
