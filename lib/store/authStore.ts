import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/user';

type UserDraftStore = {
  user: User;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearIsAuthenticated: () => void;
};

const initialDraft: User = {
  username: '',
  email: '',
  avatar: ''
};

export const useUserStore = create<UserDraftStore>()(
  persist(
    (set) => ({
      user: initialDraft,
      isAuthenticated: false,
      setUser: (user) => set(() => ({ user: user, isAuthenticated: true })),
      clearIsAuthenticated: () =>
        set(() => ({ user: initialDraft, isAuthenticated: false }))
    }),
    { name: 'user', partialize: (state) => ({ user: state.user }) }
  )
);
