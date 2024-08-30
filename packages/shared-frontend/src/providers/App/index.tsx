'use client';

import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Galaxy } from '../../services/galaxy';
import { observer } from 'mobx-react-lite';
import { Spinner } from '@nextui-org/react';
import { getNewToken } from '../../apis';
import { Effect } from 'effect';
import { reaction } from 'mobx';

interface AppProviderProps {
  children: React.ReactNode;
}

const AppContext = React.createContext<Galaxy>({} as Galaxy);

export const useApp = () => {
  return useContext(AppContext);
};

export let galaxy: Galaxy = {} as Galaxy;

export const AppProvider = observer(({ children }: AppProviderProps) => {
  const nextRouter = useRouter();

  useEffect(() => {
    const init = async () => {
      galaxy = new Galaxy(nextRouter);
      if (!window.location.pathname.includes('/auth')) {
        await galaxy.auth.reAuthenticate();
      }
    };
    init();
  }, [nextRouter]);

  if (!galaxy.isInitialized) {
    return <Spinner />;
  }

  return <AppContext.Provider value={galaxy}>{children}</AppContext.Provider>;
});
