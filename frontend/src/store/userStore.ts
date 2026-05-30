import { create } from 'zustand';

interface UserState {
  telegramId: string;
  firstName: string;
  lastName: string;
  username: string;
  languageCode: string;
  setUser: (data: { telegramId: string; firstName: string; lastName: string; username: string; languageCode: string }) => void;
}

export const useUserStore = create<UserState>((set) => ({
  telegramId: '',
  firstName: '',
  lastName: '',
  username: '',
  languageCode: 'en',
  setUser: (data) => set(data),
}));
