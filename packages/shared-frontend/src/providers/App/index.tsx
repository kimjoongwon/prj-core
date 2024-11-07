'use client';

import React, { useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Galaxy } from '../../services/galaxy';
import { observer } from 'mobx-react-lite';
import { Spinner } from '@nextui-org/react';

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
  const [isInitialized, setInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      galaxy = new Galaxy(nextRouter);
      if (!window.location.pathname.includes('/auth')) {
        await galaxy.auth.reAuthenticate();
      }
    };
    setInitialized(true);
    init();
  }, [nextRouter]);

  if (!isInitialized) {
    return <Spinner />;
  }

  return <AppContext.Provider value={galaxy}>{children}</AppContext.Provider>;
});
