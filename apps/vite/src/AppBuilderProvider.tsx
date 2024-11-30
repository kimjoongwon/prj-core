import { useGetAppBuilderSuspense } from '@shared/frontend';
import { AppBuilder } from '@shared/types';
import { useLocalObservable } from 'mobx-react-lite';
import { createContext, useContext } from 'react';

const AppBuilderContext = createContext<AppBuilder>({} as AppBuilder);

export const AppBuilderProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: getAppBuilderResponse } = useGetAppBuilderSuspense();
  const appBuilder = useLocalObservable(
    () => getAppBuilderResponse?.data as unknown as AppBuilder,
  );

  return (
    <AppBuilderContext.Provider value={appBuilder}>
      {children}
    </AppBuilderContext.Provider>
  );
};

export const useAppBuilder = () => {
  return useContext(AppBuilderContext);
};
