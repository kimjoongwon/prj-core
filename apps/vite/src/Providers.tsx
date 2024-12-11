import { useLocalObservable } from 'mobx-react-lite';
import { StoreProvider, Store, Navigation } from '@shared/stores';
import { useGetAppBuilderSuspense, AppBuilder } from '@shared/frontend';
import { NextUIProvider } from '@nextui-org/react';

interface ProvidersProps {
  children?: React.ReactNode;
}

export const Providers = (props: ProvidersProps) => {
  const { children } = props;

  const { data: getAppBuilderResponse } = useGetAppBuilderSuspense();
  const appBuilder = (
    getAppBuilderResponse as {
      data: AppBuilder;
    }
  )?.data;

  const value = useLocalObservable(() => {
    const navigation = new Navigation(appBuilder.routes);
    const store = new Store(navigation, appBuilder);
    store.isInitialized = true;
    return store;
  });

  return (
    <StoreProvider value={value}>
      <NextUIProvider>{children}</NextUIProvider>
    </StoreProvider>
  );
};
