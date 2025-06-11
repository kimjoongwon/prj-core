'use client';

import React, { useEffect, useState, createContext } from 'react';
import type { RouteBuilder } from '@shared/types';
import {
  DepotService,
  PlateService,
  ModalService,
  NavigationService,
} from '../../services';
import { observer } from 'mobx-react-lite';
import { useGetAppBuilder } from '@shared/api-client';

const StoreContext = createContext<PlateService | null>(null);

interface StoreProviderProps {
  children: React.ReactNode;
}

// Define Plate as a global variable that will be initialized by AppProvider
export let Plate: PlateService;

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
      Plate = new PlateService(navigationService, depotService, modalService);
      Plate.isInitialized = true;
      setIsInitialized(true);
    }
  }, [routeBuilders, isInitialized]);

  if (!isInitialized) {
    return <></>;
  }

  return (
    <StoreContext.Provider value={Plate}>{children}</StoreContext.Provider>
  );
});

export const useApp = () => {
  const store = React.useContext(StoreContext);
  if (!store) {
    throw new Error('useApp must be used within a StoreProvider');
  }
  return store;
};
