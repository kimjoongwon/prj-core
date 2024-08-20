import React, { useContext, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { Galaxy } from '../../store/galaxy';
import { observer } from 'mobx-react-lite';
import { usePrefechInitialData } from '../../hooks';
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

  usePrefechInitialData();

  useEffect(() => {
    galaxy = new Galaxy(nextRouter);
  }, [nextRouter]);

  if (!galaxy.isInitialized) {
    return <Spinner />;
  }

  return <AppContext.Provider value={galaxy}>{children}</AppContext.Provider>;
});
