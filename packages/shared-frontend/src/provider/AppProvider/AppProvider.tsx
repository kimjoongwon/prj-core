

import React, { useEffect, createContext } from 'react';
import type { RouteBuilder } from '@shared/types';
import { PlateStore, NavigationStore } from '../../store';
import { observer } from 'mobx-react-lite';
import { observable, runInAction } from 'mobx';
import { useGetAppBuilder } from '@shared/api-client';
import { useAuth } from '../AuthProvider/AuthProvider';
import { SplashScreen } from '../../components/ui/SplashScreen';

const StoreContext = createContext<PlateStore | null>(null);

interface StoreProviderProps {
  children: React.ReactNode;
}

// Define Plate as a global variable that will be initialized by AppProvider
export let Plate: PlateStore;

// MobX observable state
const appProvider = observable(
  {
    isInitialized: false,
    lastAuthState: null as boolean | null,

    setInitialized(value: boolean) {
      this.isInitialized = value;
    },

    setLastAuthState(value: boolean | null) {
      this.lastAuthState = value;
    },

    initializePlate(routeBuilders: RouteBuilder[]) {
      Plate = new PlateStore(routeBuilders);
      Plate.isInitialized = true;
      this.isInitialized = true;
    },

    reset() {
      this.isInitialized = false;
    },
  },
  undefined,
  { proxy: false },
);

export const AppProvider = observer((props: StoreProviderProps) => {
  const { children } = props;
  const { data: response, refetch } = useGetAppBuilder();
  const { isAuthenticated } = useAuth();
  const routeBuilders: RouteBuilder[] | undefined = (response as any)?.data
    ?.routes;

  // 인증 상태가 변경되었을 때 앱 재로드
  useEffect(() => {
    if (
      appProvider.lastAuthState !== null &&
      appProvider.lastAuthState !== isAuthenticated
    ) {
      // 인증 상태가 변경되었으므로 새로운 라우트를 가져옴
      refetch();
      runInAction(() => {
        appProvider.reset();
      });
    }
    runInAction(() => {
      appProvider.setLastAuthState(isAuthenticated);
    });
  }, [isAuthenticated, refetch]);

  useEffect(() => {
    if (routeBuilders && !appProvider.isInitialized) {
      runInAction(() => {
        appProvider.initializePlate(routeBuilders);
      });
    }
  }, [routeBuilders]);

  if (!appProvider.isInitialized) {
    return <SplashScreen />;
  }

  return (
    <StoreContext.Provider value={Plate}>{children}</StoreContext.Provider>
  );
});

export const usePlate = () => {
  const store = React.useContext(StoreContext);
  if (!store) {
    throw new Error('useApp must be used within a StoreProvider');
  }
  return store;
};

export const useNavigator = () => {
  const plate = usePlate();
  return plate.navigation.getNavigator();
};

export const useNavigation = () => {
  const plate = usePlate();
  return plate.navigation;
};
