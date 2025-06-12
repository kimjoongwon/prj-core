'use client';

import React, { useEffect, useState, createContext } from 'react';
import type { RouteBuilder } from '@shared/types';
import { PlateService, ModalService, NavigationService } from '../../services';
import { observer } from 'mobx-react-lite';
import { useGetAppBuilder } from '@shared/api-client';
import { SplashScreen } from '../../components/SplashScreen';
import { useAuth } from '../Auth/AuthProvider';

const StoreContext = createContext<PlateService | null>(null);

interface StoreProviderProps {
  children: React.ReactNode;
}

// Define Plate as a global variable that will be initialized by AppProvider
export let Plate: PlateService;

export const AppProvider = observer((props: StoreProviderProps) => {
  const { children } = props;
  const { data: response, refetch } = useGetAppBuilder();
  const { isAuthenticated } = useAuth();
  // @ts-ignore
  const routeBuilders: RouteBuilder[] = response?.data?.routes;
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastAuthState, setLastAuthState] = useState<boolean | null>(null);

  // 인증 상태가 변경되었을 때 앱 재로드
  useEffect(() => {
    if (lastAuthState !== null && lastAuthState !== isAuthenticated) {
      // 인증 상태가 변경되었으므로 새로운 라우트를 가져옴
      refetch();
      setIsInitialized(false);
    }
    setLastAuthState(isAuthenticated);
  }, [isAuthenticated, lastAuthState, refetch]);

  useEffect(() => {
    if (routeBuilders && !isInitialized) {
      const navigationService = new NavigationService(routeBuilders);
      const modalService = new ModalService();
      Plate = new PlateService(navigationService, modalService);
      Plate.isInitialized = true;
      setIsInitialized(true);
    }
  }, [routeBuilders, isInitialized]);

  if (!isInitialized) {
    return <SplashScreen />;
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
