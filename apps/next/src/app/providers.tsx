'use client';

import { HeroUIProvider } from '@heroui/react';
import { useGetAppBuilder } from '@shared/frontend';
import { Navigation, Store, StoreProvider } from '@shared/stores';
import { RouteBuilder } from '@shared/types';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';

interface ProvidersProps {
  children: React.ReactNode;
}

let store: Store;
export const Providers = observer((props: ProvidersProps) => {
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
    <HeroUIProvider>
      <StoreProvider value={store}>{children}</StoreProvider>
    </HeroUIProvider>
  );
});
