'use client';

import React, { useEffect, useState, createContext } from 'react';
import { RouteBuilder } from '@shared/types';
import { useGetAppBuilder } from '../../apis';
import { useParams, useRouter } from 'next/navigation';
import {
  ButtonService,
  ColumnService,
  DepotService,
  Illit,
  ModalService,
  NavigationService,
} from '../../services';

const StoreContext = createContext<Illit | null>(null);

interface StoreProviderProps {
  children: React.ReactNode;
}

export let ILLIT: Illit;

export const AppProvider = (props: StoreProviderProps) => {
  const { children } = props;
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();
  const params = useParams<{ serviceName: string }>();

  const { data: response } = useGetAppBuilder();
  // @ts-ignore
  const routes: RouteBuilder[] = response?.data.routes;
  // @ts-ignore
  const services = response?.data?.services || [];

  useEffect(() => {
    if (params && services) {
      const serviceId = services?.find(
        (service: { name: string }) => service.name === params?.serviceName,
      )?.id;

      localStorage.setItem('serviceName', params?.serviceName);
      localStorage.setItem('serviceId', serviceId);
      document.cookie = `serviceName=${params?.serviceName}; path=/`;
      document.cookie = `serviceId=${serviceId}; path=/`;
    }
  }, [params, services]);

  useEffect(() => {
    if (routes) {
      const navigationService = new NavigationService(routes, router);
      const depotService = new DepotService();
      const modalService = new ModalService();

      ILLIT = new Illit(navigationService, depotService, modalService);

      setIsInitialized(true);
    }
  }, [routes]);

  if (!isInitialized) {
    return null;
  }

  return (
    <StoreContext.Provider value={ILLIT}>{children}</StoreContext.Provider>
  );
};

export const useApp = () => {
  const store = React.useContext(StoreContext);
  if (!store) {
    throw new Error('useApp must be used within a StoreProvider');
  }
  return store;
};
