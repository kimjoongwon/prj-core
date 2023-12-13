'use client';

import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { usePathname } from 'next/navigation';
import { useHandlers, useMutations } from './hooks';
import { authStore } from '@stores';

interface AuthContext {
  handlers: ReturnType<typeof useHandlers>;
}

export const AuthContext = React.createContext<AuthContext>({} as AuthContext);

export const AuthProvider = observer((props: { children: React.ReactNode }) => {
  const mutations = useMutations();
  const handlers = useHandlers({
    mutations,
  });

  const pathname = usePathname();

  const { refreshToken } = handlers;

  useEffect(() => {
    if (authStore.accessToken) return;

    if (pathname.includes('/auth')) return;

    refreshToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        handlers,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
});
