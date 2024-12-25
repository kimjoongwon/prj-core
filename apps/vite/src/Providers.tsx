import { StoreProvider, Store, Navigation } from '@shared/stores';
import { useGetAppBuilderSuspense } from '@shared/frontend';
import { NextUIProvider } from '@nextui-org/react';
import { AppBuilder } from '@shared/types';

interface ProvidersProps {
  children?: React.ReactNode;
}

export const Providers = (props: ProvidersProps) => {
  const { children } = props;

  const { data: getAppBuilderResponse, isLoading } = useGetAppBuilderSuspense();
  const appBuilder = (
    getAppBuilderResponse as {
      data: AppBuilder;
    }
  )?.data;

  const navigation = new Navigation(appBuilder.routes);
  const store = new Store(navigation, appBuilder);
  store.isInitialized = true;

  if (isLoading) {
    return null;
  }

  return (
    <StoreProvider value={store}>
      <NextUIProvider>{children}</NextUIProvider>
    </StoreProvider>
  );
};
