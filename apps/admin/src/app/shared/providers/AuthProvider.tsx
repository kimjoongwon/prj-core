'use client';

import {
  authStore,
  getCurrentUser,
  refreshToken,
} from '@shared/frontend';
import { reaction } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
} from 'react';
type Dispatch = (Auth: string) => void;

type AuthProviderProps = {
  children: ReactNode;
  initialState?: string | null;
};

const AuthContext = createContext<string | null>(null);
const AuthDispatchContext = createContext<Dispatch | null>(null);

const AuthProvider = observer(
  ({ children, initialState = null }: AuthProviderProps) => {
    useEffect(() => {
      (async function () {
        if (!authStore.accessToken) {
          const { accessToken } = await refreshToken();
          authStore.accessToken = accessToken;

          const user = await getCurrentUser(
            {},
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
              withCredentials: true,
            },
          );
          authStore.user = user;
        }
      })();
    }, []);

    return <>{children}</>;
  },
);

const useAuth = (): string | null => {
  return useContext<string | null>(AuthContext);
};

const useAuthDispatch = (): Dispatch => {
  const context = useContext<Dispatch | null>(AuthDispatchContext);

  if (context === null) {
    throw new Error(
      'useAuthDispatch must be used within a AuthProvider',
    );
  }
  return context;
};

export { AuthProvider, useAuth, useAuthDispatch };
