'use client';

import { authStore, refreshToken, router } from '@shared/frontend';
import { AxiosError } from 'axios';
import { observer } from 'mobx-react-lite';
import { ReactNode, useEffect } from 'react';

type AuthProviderProps = {
  children: ReactNode;
  initialState?: string | null;
};

export const AuthController = observer(({ children }: AuthProviderProps) => {
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
