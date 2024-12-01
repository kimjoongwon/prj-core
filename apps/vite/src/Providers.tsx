import { useLocalObservable } from 'mobx-react-lite';
import { StoreProvider, Illit, Navigation } from '@shared/stores';
import { useGetAppBuilderSuspense } from '@shared/frontend';
import { AppBuilder } from '@shared/types';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = (props: ProvidersProps) => {
  const { children } = props;

  const { data: getAppBuilderResponse } = useGetAppBuilderSuspense();

  const appBuilder = useLocalObservable(
    () =>
      (
        getAppBuilderResponse as {
          data: AppBuilder;
        }
      )?.data,
  );

  const store = useLocalObservable(() => {
    const navigation = new Navigation(appBuilder.routes);
    const illit = new Illit(navigation, appBuilder);

    return illit;
  });

  return <StoreProvider value={store}>{children}</StoreProvider>;
};
