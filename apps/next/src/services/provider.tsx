'use client';

import { useGetAppBuilder } from '@shared/frontend';
import { Navigation, Store } from '../../../../packages/shared-services';
import { RouteBuilder } from '@shared/types';
import React, { useEffect, useState } from 'react';
import { createContext } from 'react';

const StoreContext = createContext<Store | null>(null);

interface StoreProviderProps {
  children: React.ReactNode;
}

let store: Store;
export const ServiceProvider = (props: StoreProviderProps) => {
  const { children } = props;
  const [isInitialized, setIsInitialized] = useState(false);

  const { data: response } = useGetAppBuilder();
  const routes = (response as { data: RouteBuilder })?.data as RouteBuilder[];

  useEffect(() => {
    if (routes) {
      const navigation = new Navigation(routes);
      store = new Store(navigation);
      setIsInitialized(true);
    }
  }, [routes]);

  if (!isInitialized) {
    return null;
  }

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => {
  const store = React.useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return store;
};
