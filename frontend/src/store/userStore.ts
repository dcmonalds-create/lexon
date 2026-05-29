import { create } from 'zustand';

interface UserState {
  telegramId: string;
  firstName: string;
  lastName: string;
  username: string;
  setUser: (data: { telegramId: string; firstName: string; lastName: string; username: string }) => void;
}

export const useUserStore = create<UserState>((set) => ({
  telegramId: '',
  firstName: '',
  lastName: '',
  username: '',
  setUser: (data) => set(data),
}));
