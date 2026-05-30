import { create } from 'zustand';

interface UserState {
  telegramId: string;
  firstName: string;
  lastName: string;
  username: string;
  languageCode: string;
  /** true when running in a regular browser (not Telegram Mini App) */
  isWeb: boolean;
  /** true when on web and the user has not authenticated via Google yet */
  needsSignIn: boolean;
  setUser: (data: {
    telegramId: string;
    firstName: string;
    lastName: string;
    username: string;
    languageCode: string;
    isWeb?: boolean;
    needsSignIn?: boolean;
  }) => void;
}

export const useUserStore = create<UserState>((set) => ({
  telegramId: '',
  firstName: '',
  lastName: '',
  username: '',
  languageCode: 'en',
  isWeb: false,
  needsSignIn: false,
  setUser: (data) => set(data),
}));
