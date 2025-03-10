'use client';

import React, { useEffect, useState, createContext } from 'react';
import { RouteBuilder } from '@shared/types';
import { App } from '../../services/app';
import { useGetAppBuilder } from '../../apis';

const StoreContext = createContext<App | null>(null);

interface StoreProviderProps {
  children: React.ReactNode;
}

let app: App;

export const AppProvider = (props: StoreProviderProps) => {
  const { children } = props;
  const [isInitialized, setIsInitialized] = useState(false);

  const { data: response } = useGetAppBuilder();
  const routes = (response as { data: RouteBuilder })?.data as RouteBuilder[];

  useEffect(() => {
    if (routes) {
      app = new App(routes);
      setIsInitialized(true);
    }
  }, [routes]);

  if (!isInitialized) {
    return null;
  }

  return <StoreContext.Provider value={app}>{children}</StoreContext.Provider>;
};

export const useApp = () => {
  const store = React.useContext(StoreContext);
  if (!store) {
    throw new Error('useApp must be used within a StoreProvider');
  }
  return store;
};
