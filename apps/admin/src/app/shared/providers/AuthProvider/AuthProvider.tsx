'use client';

import React from 'react';
import { observer } from 'mobx-react-lite';
import { useHandlers, useState } from './hooks';
import { useMutations } from './hooks/useMutations';
import { reaction } from 'mobx';

interface AuthContext {
  handlers: ReturnType<typeof useHandlers>;
  state: ReturnType<typeof useState>;
}

export const AuthContext = React.createContext<AuthContext>({} as AuthContext);

export const AuthProvider = observer((props: { children: React.ReactNode }) => {
  const mutations = useMutations();
  const state = useState();
  const handlers = useHandlers({
    mutations,
    state,
  });

  const { refreshToken } = handlers;

  reaction(
    () => state.accessToken,
    () => {
      if (state.accessToken) return;

      refreshToken();
    },
  );

  return (
    <AuthContext.Provider
      value={{
        handlers,
        state,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
});
