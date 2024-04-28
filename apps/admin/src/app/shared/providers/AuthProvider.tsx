'use client';

import { authStore, refreshToken, router } from '@shared/frontend';
import { AxiosError } from 'axios';
import { observer } from 'mobx-react-lite';
import { createContext, ReactNode, useContext, useEffect } from 'react';
type Dispatch = (Auth: string) => void;

type AuthProviderProps = {
  children: ReactNode;
  initialState?: string | null;
};

const AuthContext = createContext<string | null>(null);
const AuthDispatchContext = createContext<Dispatch | null>(null);

const AuthProvider = observer(({ children }: AuthProviderProps) => {
  useEffect(() => {
    (async function () {
      if (!authStore.accessToken) {
        try {
          const { accessToken, user } = await refreshToken();
          authStore.accessToken = accessToken;
          authStore.user = user;
        } catch (error) {
          if (error instanceof AxiosError) {
            if (error.response?.status === 401) {
              authStore.accessToken = '';
              authStore.user = undefined;
              router.push({
                url: '/admin/auth/login',
              });
            }
          }
        }
      }
    })();
  }, []);

  return <>{children}</>;
});

const useAuth = (): string | null => {
  return useContext<string | null>(AuthContext);
};

const useAuthDispatch = (): Dispatch => {
  const context = useContext<Dispatch | null>(AuthDispatchContext);

  if (context === null) {
    throw new Error('useAuthDispatch must be used within a AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth, useAuthDispatch };
