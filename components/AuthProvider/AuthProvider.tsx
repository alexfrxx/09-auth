'use client';

import { checkSession, getMe } from '@/lib/api/clientApi';
import { useUserStore } from '@/lib/store/authStore';
import { useEffect } from 'react';

interface ProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: ProviderProps) {
  const setUser = useUserStore((state) => state.setUser);
  const clearIsAuthenticated = useUserStore(
    (state) => state.clearIsAuthenticated
  );

  useEffect(() => {
    const fetchUser = async () => {
      const isAuthenticated = await checkSession();

      if (isAuthenticated) {
        const user = await getMe();
        if (user) {
          setUser(user);
        }
      } else {
        clearIsAuthenticated();
      }
    };
    fetchUser();
  }, [setUser, clearIsAuthenticated]);

  return children;
}
