'use client';

import React, { useEffect, useState, createContext } from 'react';
import { RouteBuilder } from '@shared/types';
import { App } from '../../services/app';
import { useGetAppBuilder } from '../../apis';
import { useParams, useRouter } from 'next/navigation';
import {
  ButtonService,
  ColumnService,
  DepotService,
  NavigationService,
} from '../../services';

const StoreContext = createContext<App | null>(null);

interface StoreProviderProps {
  children: React.ReactNode;
}

export let app: App;

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
    console.log('params', params);
    if (params && services) {
      console.log('servcies', services);
      const serviceId = services?.find(
        (service: { name: string }) => service.name === params?.serviceName,
      )?.id;

      console.log('serviceId', serviceId);
      localStorage.setItem('serviceName', params?.serviceName);
      localStorage.setItem('serviceId', serviceId);
      document.cookie = `serviceName=${params?.serviceName}; path=/`;
      document.cookie = `serviceId=${serviceId}; path=/`;
    }
  }, [params, services]);

  useEffect(() => {
    if (routes) {
      const navigationService = new NavigationService(routes, router);
      const buttonService = new ButtonService(navigationService);
      const columnService = new ColumnService();
      const depotService = new DepotService();

      app = new App(
        navigationService,
        buttonService,
        columnService,
        depotService,
      );

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
