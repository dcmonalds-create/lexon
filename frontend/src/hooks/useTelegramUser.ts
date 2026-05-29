import { useEffect } from 'react';
import { useUserStore } from '../store/userStore';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
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

    if (tg) {
      tg.ready();
      tg.expand();

      const user = tg.initDataUnsafe?.user;
      if (user?.id) {
        setUser({
          telegramId: String(user.id),
          firstName: user.first_name || 'User',
          lastName: user.last_name || '',
          username: user.username || '',
        });
        return;
      }
    }

    // Fallback: use a persistent anonymous ID stored in localStorage
    // This ensures telegramId is never empty, even outside Telegram
    const fallbackId = getOrCreateFallbackId();
    setUser({
      telegramId: fallbackId,
      firstName: import.meta.env.DEV ? 'Dev User' : 'User',
      lastName: '',
      username: import.meta.env.DEV ? 'devuser' : '',
    });
  }, [setUser]);
}
