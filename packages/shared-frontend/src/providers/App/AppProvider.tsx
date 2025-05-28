'use client';

import React, { useEffect, useState, createContext } from 'react';
import { RouteBuilder } from '@shared/types';
import { useGetAppBuilder } from '../../apis';
import { useParams, useRouter } from 'next/navigation';
import {
  DepotService,
  Illit,
  ModalService,
  NavigationService,
} from '../../services';
import { observer } from 'mobx-react-lite';

const StoreContext = createContext<Illit | null>(null);

interface StoreProviderProps {
  children: React.ReactNode;
}

// Define ILLIT as a global variable that will be initialized by AppProvider
export let ILLIT: Illit;

export const AppProvider = observer((props: StoreProviderProps) => {
  const { children } = props;
  const { data: response } = useGetAppBuilder();
  // @ts-ignore
  const routeBuilders: RouteBuilder[] = response?.data?.routes;
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (routeBuilders && !isInitialized) {
      const navigationService = new NavigationService(routeBuilders);
      const depotService = new DepotService();
      const modalService = new ModalService();

      // Initialize the global ILLIT instance
      ILLIT = new Illit(navigationService, depotService, modalService);
      ILLIT.isInitialized = true;
      setIsInitialized(true);
      console.log('init!');
    }
  }, [routeBuilders, isInitialized]);

  console.log('1', isInitialized);
  if (!isInitialized) {
    return <></>;
  }
  console.log('2');
  return (
    <StoreContext.Provider value={ILLIT}>{children}</StoreContext.Provider>
  );
});

export const useApp = () => {
  const store = React.useContext(StoreContext);
  if (!store) {
    throw new Error('useApp must be used within a StoreProvider');
  }
  return store;
};
