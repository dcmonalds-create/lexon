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

export function useTelegramUser() {
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();

      const user = tg.initDataUnsafe?.user;
      if (user) {
        setUser({
          telegramId: String(user.id),
          firstName: user.first_name,
          lastName: user.last_name || '',
          username: user.username || '',
        });
        return;
      }
    }

    // Dev fallback
    if (import.meta.env.DEV) {
      setUser({
        telegramId: 'dev_user_123',
        firstName: 'Dev',
        lastName: 'User',
        username: 'devuser',
      });
    }
  }, [setUser]);
}
