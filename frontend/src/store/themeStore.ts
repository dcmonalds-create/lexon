import { create } from 'zustand';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'lexon_theme';

function readCurrentAttr(): Theme {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

function apply(theme: Theme) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
}

function persist(theme: Theme) {
  try { localStorage.setItem(STORAGE_KEY, theme); } catch {}
}

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  // The inline bootstrap script in index.html has already applied a theme
  // before React mounted — pick it up so SSR-free hydration matches.
  theme: readCurrentAttr(),
  setTheme: (theme) => {
    apply(theme);
    persist(theme);
    set({ theme });
  },
  toggle: () => {
    const next: Theme = get().theme === 'light' ? 'dark' : 'light';
    apply(next);
    persist(next);
    set({ theme: next });
  },
}));
